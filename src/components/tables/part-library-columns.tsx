import { Checkbox } from "@/components/_ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import ImagePreview from "./image-preview";

export const PartLibraryColumns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
              ? "indeterminate"
              : false
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "fileURL",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Part Images" />
    ),
    cell: ({ row }) => <ImagePreview fileUrl={row.getValue("fileURL")} />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Part Name" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("name")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "cuttingTechnology",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cutting Tech" />
    ),
    cell: ({ row }) => {
      const cuttingTechnology = row.getValue("cuttingTechnology") as {
        name: string;
      };
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {cuttingTechnology.name}
          </span>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "material",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Material" />
    ),
    cell: ({ row }) => {
      const material = row.getValue("material") as { name: string };
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {material.name}
          </span>
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "totalCost",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cost" />
    ),
    cell: ({ row }) => {
      // Get the value and convert it to a number if it's a string
      let totalCost = row.getValue("totalCost");

      // If it's a string, try converting it to a number
      if (typeof totalCost === "string") {
        totalCost = parseFloat(totalCost);
      }

      // If conversion fails or it's not a valid number, handle gracefully
      const formattedCost = isNaN(totalCost) ? "N/A" : totalCost.toFixed(2);

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate text-left font-medium">
            {formattedCost} $
          </span>
        </div>
      );
    },
  },
];
