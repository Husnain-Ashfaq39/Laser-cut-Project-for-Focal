import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Task } from "@/data/quotes/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { handleDeleteSheet, updateItemInArrayField } from "@/services/db-services"; // Import the delete function
import editsvg from '@/assets/icons/edit.svg';
import deletesvg from '@/assets/icons/delete.svg';
import EditModal from "../edit-modal";

export const SheetsColumn: ColumnDef<Task>[] = [
  {
    accessorKey: "thickness",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Thickness" />
    ),
    cell: ({ row }) => <div>{row.getValue("thickness")}</div>,
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
      const sheetData = row.original; // The specific sheet data
      const materialId = sheetData.id; // Access the id here

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [isEditModalOpen, setIsEditModalOpen] = useState(false);

      const handleEditClick = () => {
        setIsEditModalOpen(true);
      };

      const handleDeleteClick = () => {
        handleDeleteSheet(materialId, sheetData);
      };

      const handleSaveSheetData=(data,updatedSheetData)=>{

        updateItemInArrayField("Materials",materialId,"sheets",data,updatedSheetData);

      }

      return (
        <>
          <div className="flex space-x-2">
            <span className="truncate font-medium lg:mr-[-50px] flex space-x-4">
              <img
                src={editsvg}
                alt="Edit"
                onClick={handleEditClick}
                className="cursor-pointer"
              />
              <img
                src={deletesvg}
                alt="Delete"
                onClick={handleDeleteClick}
                className="cursor-pointer"
              />
            </span>
          </div>
          <EditModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            data={sheetData}
            onSave={handleSaveSheetData} // Assuming you have this function implemented
            fieldsToShow={['thickness', 'size', 'sheetCost', 'sheetRate', 'appliedMarkup']}
          />
        </>
      );
    },
    enableSorting: false,
  }
];
