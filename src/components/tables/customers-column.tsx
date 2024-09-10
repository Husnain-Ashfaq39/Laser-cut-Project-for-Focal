import { ColumnDef } from "@tanstack/react-table";
import { Task } from "@/data/quotes/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Button } from "../_ui/button";
import { deleteUser } from "@/services/auth"; // Import the deleteUser service

export const CustomerColumn: ColumnDef<Task>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div className="w-[130px] ">{row.getValue("name")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("email")}
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
      const userEmail:string = row.getValue("email"); // Get email for the row

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            <Button
              variant="destructive"
              className="rounded-full font-secondary h-8"
              onClick={() => deleteUser(userEmail)} // Call deleteUser with the email
            >
              Delete
            </Button>
          </span>
        </div>
      );
    },
    enableSorting: false,
  },
];
