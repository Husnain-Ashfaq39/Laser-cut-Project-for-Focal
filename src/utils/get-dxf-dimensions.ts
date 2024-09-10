import DxfParser from "dxf-parser";
import { SvgDimensions } from "./get-svg-dimensions"; 

export function getDXFDimensions(
  file: File,
  callback: (dimensions: SvgDimensions) => void,
): void {
  const reader = new FileReader();

  reader.onload = function (e) {
    const parser = new DxfParser();

    try {
      const dxf = parser.parseSync(e.target?.result as string);

      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;

      let entityCount = 0;

      // Iterate through all DXF entities
      dxf.entities.forEach((entity: any) => {
        entityCount++;

        if (!entity) {
          console.warn("Empty or invalid entity found:", entity);
          return;
        }

        // Handle different entity types like LINE, CIRCLE, ARC, SPLINE, etc.
        switch (entity.type) {
          case "LINE":
            if (entity.vertices) {
              minX = Math.min(minX, entity.vertices[0].x, entity.vertices[1].x);
              maxX = Math.max(maxX, entity.vertices[0].x, entity.vertices[1].x);
              minY = Math.min(minY, entity.vertices[0].y, entity.vertices[1].y);
              maxY = Math.max(maxY, entity.vertices[0].y, entity.vertices[1].y);
            }
            break;

          case "CIRCLE":
            if (entity.center && entity.radius) {
              minX = Math.min(minX, entity.center.x - entity.radius);
              maxX = Math.max(maxX, entity.center.x + entity.radius);
              minY = Math.min(minY, entity.center.y - entity.radius);
              maxY = Math.max(maxY, entity.center.y + entity.radius);
            }
            break;

          case "LWPOLYLINE":
          case "POLYLINE":
            if (entity.vertices) {
              entity.vertices.forEach((vertex: any) => {
                if (
                  vertex &&
                  vertex.x !== undefined &&
                  vertex.y !== undefined
                ) {
                  minX = Math.min(minX, vertex.x);
                  maxX = Math.max(maxX, vertex.x);
                  minY = Math.min(minY, vertex.y);
                  maxY = Math.max(maxY, vertex.y);
                }
              });
            }
            break;

          case "SPLINE":
            if (entity.controlPoints) {
              entity.controlPoints.forEach((point: any) => {
                if (point && point.x !== undefined && point.y !== undefined) {
                  minX = Math.min(minX, point.x);
                  maxX = Math.max(maxX, point.x);
                  minY = Math.min(minY, point.y);
                  maxY = Math.max(maxY, point.y);
                }
              });
            }
            break;

          default:
            console.warn("Unsupported entity type:", entity.type);
            break;
        }
      });

      if (entityCount === 0) {
        console.error("No valid entities found in DXF.");
        return;
      }

      // Calculate width and height and round to 2 decimal places
      const width = parseFloat((maxX - minX).toFixed(2));
      const height = parseFloat((maxY - minY).toFixed(2));

      if (isFinite(width) && isFinite(height) && width > 0 && height > 0) {
        callback({
          width,
          height,
        });
      } else {
        console.error("Invalid dimensions calculated from DXF.");
      }
    } catch (err) {
      console.error("Error parsing DXF file:", err);
    }
  };

  reader.readAsText(file);
}
