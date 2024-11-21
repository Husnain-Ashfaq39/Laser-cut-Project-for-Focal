export const initialMaterialState = {
  name: "",
  density: "",
  appliedMarkup: "",
};

export const inputFields = [
  { name: "name", type: "text", placeholder: "Material Name" },
  { name: "density", type: "number", placeholder: "Density (kg/m³)" },
  {
    name: "appliedMarkup",
    type: "number",
    placeholder: "Applied Markup (%)",
  },
];

export const initialSheetState = {
  thickness: "",
  width: "",
  height: "",
  sheetCost: "",
  sheetRate: "",
  appliedMarkup: "",
  quantity: "",
};

export const inputFieldsSheet = [
  { name: "thickness", type: "number", placeholder: "Thickness" },
  { name: "width", type: "number", placeholder: "Width" },
  { name: "height", type: "number", placeholder: "Height" },
  { name: "sheetCost", type: "number", placeholder: "Sheet Cost" },
  { name: "quantity", type: "number", placeholder: "Quantity" },
];
