/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { DataTableColumnHeader } from "./data-table-column-header";
import deletesvg from "@/assets/icons/delete.svg";
import approvesvg from "@/assets/icons/approve.svg";
import rejectsvg from "@/assets/icons/reject.svg";
import editsvg from "@/assets/icons/edit.svg";
import verified from "@/assets/icons/verified.svg"; // Assuming you have an icon for credit account users
import {
  fetchDocumentById,
  updateUserProfileField,
} from "@/services/db-services";
import { toast } from "../_ui/toast/use-toast";
import ConfirmationDialog from "@/components/_ui/confirmation";
import { Button } from "../_ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

const ActionCell = ({
  userEmail,
  userID,
  onCreditStatusUpdate,
  handleCustomerDelete, // Add this as a prop
}: {
  userEmail: string;
  userID: string;
  onCreditStatusUpdate: (userId: string, newStatus: string) => void;
  handleCustomerDelete: (email: string) => void; // Add this as a type
}) => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null); // Allow more flexible types for userData

  // Fetch user data as before
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
  }, [userID]);

  const handleDeleteClick = (email: string) => {
    setSelectedEmail(email);
    setOpenConfirm(true);
  };

  const handleRequestCredit = async (response: string) => {
    try {
      await updateUserProfileField(userID, "creditAccount", response);
      if (response === "verified") {
        toast({
          title: "Approved",
          description: "Customer has become a credit account holder",
          duration: 5000,
        });
      } else {
        toast({
          title: "Rejected",
          description: "Customer request has been rejected",
          duration: 5000,
        });
      }
      // Call the parent function to update the customer list
      onCreditStatusUpdate(userID, response);
    } catch (error) {
      console.error("Error updating credit status:", error);
    }
    setOpenEditDialog(false); // Close the dialog after updating
  };

  const handleConfirmDelete = () => {
    if (selectedEmail) {
      handleCustomerDelete(selectedEmail); // Call handleCustomerDelete instead of deleteUser directly
      setOpenConfirm(false);
    }
  };
  const handleEditClick = () => {
    setOpenEditDialog(true);
  };

  return (
    <div className="flex items-center space-x-2">
      {!loading ? (
        <>
          {userData?.creditAccount === "request" && (
            <>
              <img
                src={approvesvg}
                alt="approve"
                className="cursor-pointer"
                onClick={() => handleRequestCredit("verified")}
              />
              <img
                src={rejectsvg}
                alt="reject"
                className="cursor-pointer"
                onClick={() => handleRequestCredit("unverified")}
              />
            </>
          )}
          <span className="flex max-w-[500px] cursor-pointer space-x-4 truncate font-medium">
            <img
              src={deletesvg}
              alt="delete"
              className="cursor-pointer"
              onClick={() => handleDeleteClick(userEmail)}
            />
            <img
              src={editsvg}
              alt="edit"
              className="ml-2 cursor-pointer"
              onClick={handleEditClick}
            />
          </span>
        </>
      ) : (
        <Button disabled>
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </Button>
      )}

      {/* Confirmation dialog for delete */}
      <ConfirmationDialog
        open={openConfirm}
        onConfirm={handleConfirmDelete}
        onCancel={() => setOpenConfirm(false)}
      />
      <ConfirmationDialog
        open={openEditDialog}
        onConfirm={() =>
          userData?.creditAccount == "verified"
            ? handleRequestCredit("unverified")
            : handleRequestCredit("verified")
        }
        onCancel={() => setOpenEditDialog(false)}
        title={
          userData?.creditAccount == "verified"
            ? "Do you want to remove Credit Account feature from this account?"
            : "Do you want to add Credit Account feature to this account?"
        }
        desc=""
      />
    </div>
  );
};

export const CustomerColumn = (onCreditStatusUpdate, handleCustomerDelete) => [
  {
    accessorKey: "creditAccount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const name: string = row.original.name; // Accessing 'name' directly from the row's original data
      const creditAccount = row.getValue("creditAccount");

      return (
        <div className="flex w-[130px] items-center">
          <div>{name}</div>
          {creditAccount === "verified" && (
            <img
              src={verified}
              alt="Credit Account User"
              className="ml-2 h-4 w-4"
            />
          )}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "company",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("company") || ""}
        </span>
      </div>
    ),
    enableSorting: false,
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
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Manage Credit Reqs" />
    ),
    cell: ({ row }) => {
      const userEmail: string = row.getValue("email");
      const userID: string = row.getValue("id");

      // Pass the onCreditStatusUpdate and handleCustomerDelete functions down to ActionCell
      return (
        <ActionCell
          userEmail={userEmail}
          userID={userID}
          onCreditStatusUpdate={onCreditStatusUpdate}
          handleCustomerDelete={handleCustomerDelete}
        />
      );
    },
    enableSorting: false,
  },
];
