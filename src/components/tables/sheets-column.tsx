import { ColumnDef } from "@tanstack/react-table";
import { Task } from "@/data/quotes/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Button } from "../_ui/button";
import { handleDeleteSheet } from "@/services/db-services"; // Import the delete function
export const SheetsColumn: ColumnDef<Task>[] = [
  {
    accessorKey: "thickness",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Thickness" />
    ),
    cell: ({ row }) => <div >{row.getValue("thickness")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "size",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Size" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("size")}
        </span>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "sheetCost",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sheet Cost" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("sheetCost")}
        </span>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "sheetRate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sheet Rate" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("sheetRate")}
        </span>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "appliedMarkup",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Applied Markup" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("appliedMarkup")}
        </span>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "Action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => {
        const sheetData = row.original; // The specific sheet data you want to delete
        const materialId = sheetData.id; // Access the id here
        console.log("Material ID is " + materialId);
  
      return (
        <div className="flex space-x-2">
          <span className="truncate font-medium lg:mr-[-50px] ">
            <Button
              variant="destructive"
              className="rounded-full font-secondary h-8"
              onClick={() => handleDeleteSheet(materialId, sheetData)} 
            >
              Delete
            </Button>
          </span>
        </div>
      );
    },
    enableSorting: false,
  }
  
];
