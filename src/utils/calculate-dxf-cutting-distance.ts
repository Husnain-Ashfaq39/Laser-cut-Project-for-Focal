import DxfParser, { IEntity } from "dxf-parser";

// Type guard to check if the entity is a LINE
const isLineEntity = (
  entity: IEntity,
): entity is IEntity & { start: any; end: any } => {
  return entity.type === "LINE" && "start" in entity && "end" in entity;
};

// Type guard to check if the entity is an ARC
const isArcEntity = (
  entity: IEntity,
): entity is IEntity & {
  radius: number;
  startAngle: number;
  endAngle: number;
} => {
  return (
    entity.type === "ARC" &&
    "radius" in entity &&
    "startAngle" in entity &&
    "endAngle" in entity
  );
};

// Type guard to check if the entity is a CIRCLE
const isCircleEntity = (
  entity: IEntity,
): entity is IEntity & { radius: number } => {
  return entity.type === "CIRCLE" && "radius" in entity;
};

// Type guard to check if the entity is a POLYLINE or LWPOLYLINE
const isPolylineEntity = (
  entity: IEntity,
): entity is IEntity & { vertices: any[] } => {
  return (
    (entity.type === "LWPOLYLINE" || entity.type === "POLYLINE") &&
    "vertices" in entity
  );
};

// Type guard to check if the entity is an ELLIPSE
const isEllipseEntity = (
  entity: IEntity,
): entity is IEntity & {
  majorAxisEndPoint: any;
  ratio: number;
  startAngle: number;
  endAngle: number;
} => {
  return (
    entity.type === "ELLIPSE" &&
    "majorAxisEndPoint" in entity &&
    "ratio" in entity &&
    "startAngle" in entity &&
    "endAngle" in entity
  );
};

// Type guard to check if the entity is a SPLINE
const isSplineEntity = (
  entity: IEntity,
): entity is IEntity & { controlPoints: any[] } => {
  return entity.type === "SPLINE" && "controlPoints" in entity;
};

// Utility to calculate the cutting distance from a DXF file
export const calculateDxfCuttingDistance = (dxfContent: string): number => {
  const parser = new DxfParser();
  const dxf = parser.parseSync(dxfContent);

  let totalDistance = 0;

  dxf.entities.forEach((entity) => {
    // Check if entity is a LINE
    if (isLineEntity(entity)) {
      const { start, end } = entity;
      const length = Math.sqrt(
        Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2),
      );
      totalDistance += length;
    }

    // Check for ARC entities
    if (isArcEntity(entity)) {
      const { radius, startAngle, endAngle } = entity;
      const angle = (endAngle - startAngle) * (Math.PI / 180);
      const arcLength = angle * radius;
      totalDistance += arcLength;
    }

    // Check for POLYLINE and LWPOLYLINE entities
    if (isPolylineEntity(entity)) {
      entity.vertices.forEach((vertex, index) => {
        if (index > 0) {
          const prevVertex = entity.vertices[index - 1];
          const length = Math.sqrt(
            Math.pow(vertex.x - prevVertex.x, 2) +
              Math.pow(vertex.y - prevVertex.y, 2),
          );
          totalDistance += length;
        }
      });
    }

    // Check for CIRCLE entities
    if (isCircleEntity(entity)) {
      const circleLength = 2 * Math.PI * entity.radius;
      totalDistance += circleLength;
    }

    // Check for ELLIPSE entities
    if (isEllipseEntity(entity)) {
      const { majorAxisEndPoint, ratio, startAngle, endAngle } = entity;
      const majorAxisLength = Math.sqrt(
        Math.pow(majorAxisEndPoint.x, 2) + Math.pow(majorAxisEndPoint.y, 2),
      );
      const minorAxisLength = majorAxisLength * ratio;
      const circumference =
        Math.PI *
        (3 * (majorAxisLength + minorAxisLength) -
          Math.sqrt(
            (3 * majorAxisLength + minorAxisLength) *
              (majorAxisLength + 3 * minorAxisLength),
          ));
      const angle = (endAngle - startAngle) * (Math.PI / 180);
      const ellipseArcLength = (angle / (2 * Math.PI)) * circumference;
      totalDistance += ellipseArcLength;
    }

    // Check for SPLINE entities
    if (isSplineEntity(entity)) {
      const controlPoints = entity.controlPoints;
      for (let i = 0; i < controlPoints.length - 1; i++) {
        const cp1 = controlPoints[i];
        const cp2 = controlPoints[i + 1];
        const length = Math.sqrt(
          Math.pow(cp2.x - cp1.x, 2) + Math.pow(cp2.y - cp1.y, 2),
        );
        totalDistance += length;
      }
    }
  });

  return totalDistance;
};
