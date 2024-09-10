export interface SvgDimensions {
  width: number;
  height: number;
}

export function getSVGDimensions(
  file: File,
  callback: (dimensions: SvgDimensions) => void,
): void {
  const reader = new FileReader();

  reader.onload = function (e) {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(
      e.target?.result as string,
      "image/svg+xml",
    );
    const svgElement = svgDoc.querySelector("svg");

    if (!svgElement) {
      console.error("No SVG element found in file");
      return;
    }

    let width: number | undefined;
    let height: number | undefined;

    // Try width/height attributes
    width = parseFloat(svgElement.getAttribute("width") || "");
    height = parseFloat(svgElement.getAttribute("height") || "");

    // If not explicitly defined, use viewBox
    if (isNaN(width) || isNaN(height)) {
      const viewBox = svgElement.getAttribute("viewBox");
      if (viewBox) {
        const [minX, minY, viewBoxWidth, viewBoxHeight] = viewBox
          .split(" ")
          .map(Number);
        width = viewBoxWidth;
        height = viewBoxHeight;
      }
    }

    // If neither is available, fallback to getBBox
    if (isNaN(width) || isNaN(height)) {
      const bbox = svgElement.getBBox();
      width = bbox.width;
      height = bbox.height;
    }

    if (width && height) {
      callback({ width, height });
    } else {
      console.error("Could not determine SVG dimensions");
    }
  };

  reader.readAsText(file);
}
