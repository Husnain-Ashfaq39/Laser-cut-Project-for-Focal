import { ColumnDef } from "@tanstack/react-table";
import { Task } from "@/data/quotes/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { handleDeleteTableData, updateItemInArrayField } from "@/services/db-services";
import editsvg from '@/assets/icons/edit.svg'
import deletesvg from '@/assets/icons/delete.svg'
import EditModal from "../edit-modal";
import { useState } from "react";
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
      const tableData = { ...row.original }; // Create a shallow copy of row.original
      const material = tableData.material;
      delete tableData.material;
      
      console.log("id is " + JSON.stringify(material));
      console.log("Material id is " + JSON.stringify(tableData));
      
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [isEditModalOpen, setIsEditModalOpen] = useState(false);
      const handleEditClick = () => {
        setIsEditModalOpen(true);
      };
      
      const handleSaveTableData = (data, updatedData) => {
        updateItemInArrayField("RateTable", tableData.id, "rateData", data, updatedData);
      };
      
        
  
      return (
        <>
       
        <div className="flex space-x-2">
          <span className="truncate font-medium lg:mr-[-50px] ">
           
            <div className="flex space-x-4">

            <img src={editsvg} alt="" className=' cursor-pointer'  onClick={handleEditClick}/>
            <img src={deletesvg} alt="" className=' cursor-pointer'  onClick={() => handleDeleteTableData(tableData)}/>
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
       </>
      );
    },
    enableSorting: false,
  }
  
];
