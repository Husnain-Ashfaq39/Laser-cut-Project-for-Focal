import { ColumnDef } from "@tanstack/react-table";
import { Task } from "@/data/quotes/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Button } from "../_ui/button";
import { handleDeleteTableData } from "@/services/db-services";
export const TableDataColumn: ColumnDef<Task>[] = [
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
    accessorKey: "web",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Web" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("web")}
        </span>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "cuttingFeedRate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cutting FeedRate" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("cuttingFeedRate")}
        </span>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "pierceTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pierce Time" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("pierceTime")}
        </span>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "appliedHourlyRate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Applied Hourly Rate" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("appliedHourlyRate")}
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
        const tableData = row.original; // The specific sheet data you want to delete
       console.log("id is "+tableData.id);
       
       
        
  
      return (
        <div className="flex space-x-2">
          <span className="truncate font-medium lg:mr-[-50px] ">
            <Button
              variant="destructive"
              className="rounded-full font-secondary h-8"
              onClick={() => handleDeleteTableData(tableData)}
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
