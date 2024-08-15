import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/_ui/checkbox";
import { Task } from "@/data/quotes/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import ImagePreview from "./image-preview"; // Import the new ImagePreview component

export const PartLibraryColumns: ColumnDef<Task>[] = [
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
    accessorKey: "image_url",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Part Images" />
    ),
    cell: ({ row }) => (
      <ImagePreview imageUrl={row.getValue("image_url")} />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "part_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Part Name" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("part_name")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "bounds_wxl",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bounds wxl" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("bounds_wxl")}
        </span>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "cutting_tech",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cutting Tech" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("cutting_tech")}
        </span>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "material",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Material" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("material")}
        </span>
      </div>
    ),
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
