/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { DataTableColumnHeader } from "./data-table-column-header";

import { ColumnDef } from "@tanstack/react-table";
import { Task } from "@/data/quotes/schema";

export const MaterialColumm: ColumnDef<Task>[] = [
  {
    accessorKey: "materialName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Material Name" />,
    cell: ({ row }) => {
      return (
        <div className={"flex space-x-2 cursor-pointer"}>
          <span className="max-w-[500px] truncate font-medium">{row.getValue("materialName")}</span>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "thickness",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Thickness" />,
    cell: ({ row }) => {
      return (
        <div className={"flex space-x-2 cursor-pointer"}>
          <span className="max-w-[500px] truncate font-medium">{row.getValue("thickness")}</span>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "size",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Size (W X H)" />,
    cell: ({ row }) => {
      const size:any=row.getValue("size");
      return (
        <div className={"flex space-x-2 cursor-pointer"}>
          <span className="max-w-[500px] truncate font-medium">{size?.width}x{size?.height}</span>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Quantity Shortage" />,
    cell: ({ row }) => {
      return (
        <div className={"flex space-x-2 cursor-pointer"}>
          <span className="max-w-[500px] truncate font-medium">{row.getValue("quantity")}</span>
        </div>
      );
    },
    enableSorting: true,
  },
  
];
