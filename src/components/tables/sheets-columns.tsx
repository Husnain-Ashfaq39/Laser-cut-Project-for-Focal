/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";

import { DataTableColumnHeader } from "./data-table-column-header";
import editsvg from "@/assets/icons/edit.svg";
import deletesvg from "@/assets/icons/delete.svg";
import EditModal from "../edit-modal";
import ConfirmationDialog from "@/components/_ui/confirmation"; // Make sure the import path is correct

export const SheetsColumn = (
  handleSaveSheetData: any,
  handleSheetDelete: any,
) => [
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
      <DataTableColumnHeader column={column} title="Size (Width X Height)" />
    ),
    cell: ({ row }) => {
      const size = row.getValue("size");
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {size?.width} X {size?.height}
          </span>
        </div>
      );
    },
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
          {row.getValue("sheetRate").toFixed(2)}
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
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantity" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("quantity")}
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

      const [isEditModalOpen, setIsEditModalOpen] = useState(false);
      const [openConfirm, setOpenConfirm] = useState(false); // For confirmation dialog

      const handleEditClick = () => {
        setIsEditModalOpen(true);
      };

      const handleDeleteClick = () => {
        setOpenConfirm(true); // Open the confirmation dialog
      };

      const handleConfirmDelete = async () => {
        try {
          handleSheetDelete(sheetData);
          setOpenConfirm(false); // Close the dialog on success
        } catch (error) {
          console.error("Error deleting sheet:", error);
        }
      };
      return (
        <>
          <div className="flex space-x-2">
            <span className="flex space-x-4 truncate font-medium lg:mr-[-50px]">
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
            fieldsToShow={[
              "thickness",
              "width",
              "height",
              "sheetCost",
              "sheetRate",
              "appliedMarkup",
              "quantity",
            ]}
          />
          <ConfirmationDialog
            open={openConfirm}
            onConfirm={handleConfirmDelete} // Call the delete function here
            onCancel={() => setOpenConfirm(false)} // Close dialog on cancel
          />
        </>
      );
    },
    enableSorting: false,
  },
];
