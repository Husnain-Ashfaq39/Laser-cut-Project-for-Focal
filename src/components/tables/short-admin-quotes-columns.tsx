/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { DataTableColumnHeader } from "./data-table-column-header";
import { fetchDocumentById } from "@/services/db-services";
import { useEffect, useState } from "react";
import { Task } from "@/data/quotes/schema";
import { ColumnDef } from "@tanstack/react-table";

export const ShortAdminQuotes: ColumnDef<Task>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quote ID" />
    ),
    cell: ({ row }) => (
      <div className="flex cursor-pointer space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("id")}
        </span>
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "customQuoteID",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Custom ID" />
    ),
    cell: ({ row }) => {
      return (
        <div className={"flex cursor-pointer space-x-2"}>
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("customQuoteID") || ""}
          </span>
        </div>
      );
    },
    enableSorting: true,
  },

  {
    accessorKey: "customerID",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const customerID = row.getValue("customerID");
      const [customer, setCustomer] = useState(null);
      const isClickable = ["draft", "in progress"].includes(
        row.getValue("status"),
      );

      useEffect(() => {
        const fetchCustomer = async () => {
          const fetchedCustomer = await fetchDocumentById("Users", customerID);
          setCustomer(fetchedCustomer);
        };
        fetchCustomer();
      }, [customerID]);

      return (
        <div
          className={`flex space-x-2 ${isClickable ? "cursor-pointer" : ""}`}
          onClick={() => isClickable}
        >
          <span className="max-w-[500px] truncate font-medium">
            {customer
              ? customer?.firstName + " " + customer?.lastName
              : "Loading..."}
          </span>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "customerCompanyID",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company" />
    ),
    cell: ({ row }) => {
      const customerID = row.getValue("customerID");
      const [customer, setCustomer] = useState(null);
      const isClickable = ["draft", "in progress"].includes(
        row.getValue("status"),
      );

      useEffect(() => {
        const fetchCustomer = async () => {
          const fetchedCustomer = await fetchDocumentById("Users", customerID);
          setCustomer(fetchedCustomer);
        };
        fetchCustomer();
      }, [customerID]);

      return (
        <div
          className={`flex space-x-2 ${isClickable ? "cursor-pointer" : ""}`}
          onClick={() => isClickable}
        >
          <span className="max-w-[500px] truncate font-medium">
            {customer?.company}
          </span>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "parts",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Parts" />
    ),
    cell: ({ row }) => {
      const parts: any[] = row.getValue("parts");
      const isClickable = ["draft", "in progress"].includes(
        row.getValue("status"),
      );

      return (
        <div
          className={`flex space-x-2 ${isClickable ? "cursor-pointer" : ""}`}
          onClick={() => isClickable}
        >
          <span className="max-w-[500px] truncate font-medium">
            {parts.length}
          </span>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "totalPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Price" />
    ),
    cell: ({ row }) => {
      const totalPrice = row.getValue("totalPrice") as number | null;
      const isClickable = ["draft", "in progress"].includes(
        row.getValue("status"),
      );

      return (
        <div
          className={`flex space-x-2 ${isClickable ? "cursor-pointer" : ""}`}
          onClick={() => isClickable}
        >
          <span className="max-w-[500px] truncate font-medium">
            {totalPrice !== null ? totalPrice.toFixed(2) : "0.00"} $
          </span>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "lastModified",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Modified" />
    ),
    cell: ({ row }) => {
      const isClickable = ["draft", "in progress"].includes(
        row.getValue("status"),
      );

      const timestamp: any = row.getValue("lastModified");
      const date = new Date(timestamp * 1000);
      const formattedDate = date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      return (
        <div
          className={`flex space-x-2 ${isClickable ? "cursor-pointer" : ""}`}
          onClick={() => isClickable}
        >
          <span className="max-w-[500px] truncate font-medium">
            {formattedDate}
          </span>
        </div>
      );
    },
    enableSorting: true,
  },
];
