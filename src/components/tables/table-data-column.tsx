/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Task } from "@/data/quotes/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { handleDeleteTableData, updateItemInArrayField } from "@/services/db-services";
import editsvg from '@/assets/icons/edit.svg';
import deletesvg from '@/assets/icons/delete.svg';
import EditModal from "../edit-modal";
import ConfirmationDialog from "@/components/_ui/confirmation"; // Make sure the path is correct

export const TableDataColumn: ColumnDef<Task>[] = [
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
      const tableData = { ...row.original }; // Create a shallow copy of row.original
      const material = tableData.material;
      delete tableData.material;

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
          await handleDeleteTableData(tableData);
          setOpenConfirm(false); // Close the dialog on success
        } catch (error) {
          console.error('Error deleting table data:', error);
        }
      };

      const handleSaveTableData = (data, updatedData) => {
        updateItemInArrayField("RateTable", tableData.id, "rateData", data, updatedData);
      };

      return (
        <>
          <div className="flex space-x-2">
            <span className="truncate font-medium lg:mr-[-50px]">
              <div className="flex space-x-4">
                <img src={editsvg} alt="Edit" className="cursor-pointer" onClick={handleEditClick} />
                <img src={deletesvg} alt="Delete" className="cursor-pointer" onClick={handleDeleteClick} />
              </div>
            </span>
          </div>

          <EditModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            data={tableData}
            onSave={handleSaveTableData}
            fieldsToShow={['thickness', 'web', 'cuttingFeedRate', 'pierceTime', 'appliedHourlyRate']}
            isRateTable={true}
            material={material}
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
  }
];
