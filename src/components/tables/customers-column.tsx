import React, { useEffect, useState } from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { Task } from "@/data/quotes/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { deleteUser } from "@/services/auth";
import deletesvg from '@/assets/icons/delete.svg';
import approvesvg from '@/assets/icons/approve.svg';
import rejectsvg from '@/assets/icons/reject.svg';
import { fetchDocumentById, updateUserProfileField } from "@/services/db-services";
import { toast } from "../_ui/toast/use-toast";
import ConfirmationDialog from '@/components/_ui/confirmation';
import { Button } from '../_ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';

const ActionCell = ({ userEmail, userID }: { userEmail: string; userID: string }) => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const handlefetchuser = async () => {
      try {
        const userd = await fetchDocumentById("Users", userID);
        setUserData(userd);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false); // Ensure loading state is updated after fetching
      }
    };
    handlefetchuser();
  }, [userID]); // Run when userID changes
  const handleRequestCredit = async (response: string) => {
    await updateUserProfileField(userID, "creditAccount", response);
    if (response === "verified") {
      toast({
        title: "Approved",
        description: "Customer has become credit Account holder",
        duration: 5000,
      });
    } else {
      toast({
        title: "Rejected",
        description: "Customer request has been rejected",
        duration: 5000,
      });
    }
  };

  const handleDeleteClick = (email: string) => {
    setSelectedEmail(email);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (selectedEmail) {
      deleteUser(selectedEmail);
      setOpenConfirm(false);
    }
  };

  return (
    <div className="flex space-x-2 items-center">
      {!loading ? <>
     
      {userData?.creditAccount && <>
        <img src={approvesvg} alt="approve" className=' cursor-pointer' onClick={() => handleRequestCredit("verified")} />
        <img src={rejectsvg} alt="reject" className=' cursor-pointer' onClick={() => handleRequestCredit("reject")} />
      </>}
      <span className="max-w-[500px] truncate font-medium cursor-pointer">
        <img src={deletesvg} alt="delete" className=' cursor-pointer' onClick={() => handleDeleteClick(userEmail)} />
      </span></>:(
      <Button disabled>
        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
        Please wait
      </Button>
      )}

      <ConfirmationDialog
        open={openConfirm}
        onConfirm={handleConfirmDelete}
        onCancel={() => setOpenConfirm(false)}
      />
    </div>
  );
};

export const CustomerColumn: ColumnDef<Task>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => <div className="w-[130px] ">{row.getValue("name")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
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
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Manage Credit Reqs" />,
    cell: ({ row }) => {
      const userEmail: string = row.getValue("email");
      const userID: string = row.getValue("id");

      return <ActionCell userEmail={userEmail} userID={userID} />;
    },
    enableSorting: false,
  },
];
