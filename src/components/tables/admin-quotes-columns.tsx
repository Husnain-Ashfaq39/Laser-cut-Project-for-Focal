/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { deliveryStatuses, pickupStatuses } from "@/data/quotes/data";
import { DataTableColumnHeader } from "./data-table-column-header";
import { fetchDocumentById, updateDocument } from "@/services/db-services";
import { Dispatch, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../_ui/dropdown-menu";
import downloadsvg from "@/assets/icons/downlaod.svg";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
  addFile,
  updateQuoteId,
  updateStatus,
} from "@/redux/slices/quote-parts-slice";
import { fetchPartFile } from "@/services/dxf-fetcher";
import { Task } from "@/data/quotes/schema";
import { UnknownAction } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// Function to handle row click
const handleRowClick = async (
  rowData: Task,
  dispatch: Dispatch<UnknownAction>,
  navigate: ReturnType<typeof useNavigate>,
  setLoading: (loading: boolean) => void,
) => {
  setLoading(true); // Start loading

  console.log("Row clicked:", rowData);
  const Quote: any = await fetchDocumentById("Quotes", rowData.id);
  console.log(Quote);
  const partsIDs = Quote.parts;

  if (rowData.status === "in progress") {
    rowData.status = "uneditable";
  }

  dispatch(updateStatus(rowData.status));
  dispatch(updateQuoteId(Quote.id));

  // Using Promise.all to handle fetching all parts concurrently
  await Promise.all(
    partsIDs.map(async (partID) => {
      const part: any = await fetchDocumentById("Parts", partID);
      let fileBlob;
      let fileType;

      fileBlob = await fetchPartFile(part.fileURL);
      fileType = fileBlob.type;

      // Check the file extension to determine file type (SVG or DXF)
      if (fileType === "image/svg+xml") {
        const response = await fetch(part.fileURL);
        const svgBlob = await response.blob();
        const svgFile = new File([svgBlob], `${part.name}.svg`, {
          type: "image/svg+xml",
        });
        fileBlob = svgFile;
        fileType = "svg"; // Set file type for SVG
      } else {
        fileType = "dxf"; // Set file type for DXF
      }

        // Initialize variables for extraNote and uploadedFileUrl
        const extraNote: string = part.extraNote || "";
        
        const uploadedFileBlobs: File[] = [];
      console.log("part:", part);

      if (part.uploadedFiles && Array.isArray(part.uploadedFiles)) {
        for (const uploadedFileInfo of part.uploadedFiles) {
          try {
            const response = await fetch(uploadedFileInfo.url);
            if (!response.ok) {
              throw new Error(
                `Failed to fetch uploaded file from URL: ${uploadedFileInfo.url}`
              );
            }
            const uploadedBlob = await response.blob();
            // Use the original file name
            const fileName = uploadedFileInfo.name || "previous_uploaded.file";
            const uploadedFile = new File([uploadedBlob], fileName, {
              type: uploadedBlob.type,
            });
            uploadedFileBlobs.push(uploadedFile);
            console.log("Uploaded File Blob:", uploadedFile);
          } catch (error) {
            console.error(
              `Error fetching uploaded file for part ${partID}:`,
              error
            );
            // Optionally, handle the error (e.g., set uploadedFileUrl to null or notify the user)
          }
        }
        console.log("files going to redux: ", uploadedFileBlobs);
      } else {
        console.log("No uploaded file URLs found for part:", part);
      }
     
      dispatch(
        addFile({
          id: part.partID,
          file: fileBlob,
          fileType: fileType,
          name: part.name,
          cuttingTechnology: part.cuttingTechnology,
          material: part.material,
          thickness: part.thickness,
          size: { width: part.size.width, height: part.size.height },
          isValid: false,
          quantity: part.quantity,
          extraNote: extraNote, // Include extraNote
          uploadedFiles: uploadedFileBlobs || null,
        }),
      );
    }),
  );

  // Navigate after all async operations are complete
  navigate("/quotes/new-quote");
  setLoading(false); // Stop loading

  return null;
};

// AdminQuotes columns definition with handleRowClick integrated
export const AdminQuotes = (handleStatusUpdate: any, setLoading: any) => [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quote ID" />
    ),
    cell: ({ row }) => {
      const dispatch = useDispatch();
      const navigate = useNavigate();

      return (
        <div
          className={"flex cursor-pointer space-x-2"}
          onClick={() =>
            handleRowClick(row.original, dispatch, navigate, setLoading)
          }
        >
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("id")}
          </span>
        </div>
      );
    },
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
      const dispatch = useDispatch();
      const navigate = useNavigate();

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
          onClick={() =>
            isClickable &&
            handleRowClick(row.original, dispatch, navigate, setLoading)
          }
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
      const dispatch = useDispatch();
      const navigate = useNavigate();

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
          onClick={() =>
            isClickable &&
            handleRowClick(row.original, dispatch, navigate, setLoading)
          }
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
      const dispatch = useDispatch();
      const navigate = useNavigate();

      return (
        <div
          className={`flex space-x-2 ${isClickable ? "cursor-pointer" : ""}`}
          onClick={() =>
            isClickable &&
            handleRowClick(row.original, dispatch, navigate, setLoading)
          }
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
      const dispatch = useDispatch();
      const navigate = useNavigate();

      return (
        <div
          className={`flex space-x-2 ${isClickable ? "cursor-pointer" : ""}`}
          onClick={() =>
            isClickable &&
            handleRowClick(row.original, dispatch, navigate, setLoading)
          }
        >
          <span className="max-w-[500px] truncate font-medium">
            ${totalPrice !== null ? totalPrice.toFixed(2) : "0.00"}
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
      const dispatch = useDispatch();
      const navigate = useNavigate();

      const timestamp = row.getValue("lastModified");
      const date = new Date(timestamp * 1000);
      const formattedDate = date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      return (
        <div
          className={`flex space-x-2 ${isClickable ? "cursor-pointer" : ""}`}
          onClick={() =>
            isClickable &&
            handleRowClick(row.original, dispatch, navigate, setLoading)
          }
        >
          <span className="max-w-[500px] truncate font-medium">
            {formattedDate}
          </span>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const currentStatus = row.getValue("status");
      const shippingOption = row.original.shippingOption;
      const statusOptions =
        shippingOption === "pickup" ? pickupStatuses : deliveryStatuses;
      const status = statusOptions.find(
        (status) => status.value === currentStatus,
      );
      const [isMenuOpen, setIsMenuOpen] = useState(false);

      if (!status) return null;

      const handleStatusChange = async (newStatus: string) => {
        const Quote: any = await fetchDocumentById("Quotes", row.original.id);
        Quote.status = newStatus;
        await updateDocument("Quotes", row.original.id, Quote);
        handleStatusUpdate(row.original.id, newStatus,row.original.jobID);
        setIsMenuOpen(false);
      };

      return (
        <div className="relative">
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <div
                className="flex w-[100px] cursor-pointer items-center"
                onClick={() => setIsMenuOpen(true)}
              >
                {status.icon && (
                  <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                )}
                <span>{status.label}</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {statusOptions.map((statusOption) => (
                <DropdownMenuItem
                  key={statusOption.value}
                  onClick={() => handleStatusChange(statusOption.value)}
                  disabled={statusOption.value === currentStatus}
                >
                  {statusOption.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableSorting: true,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Download" />
    ),
    cell: ({ row }) => {
      const quoteid: string = row.getValue("id");

      const handleDownloadPartsFiles = async () => {
        try {
          const quote: any = await fetchDocumentById("Quotes", quoteid);
          const partsids = quote.parts;

          // Fetch all parts documents
          const partsPromises = partsids.map((partid: string) =>
            fetchDocumentById("Parts", partid),
          );
          const parts = await Promise.all(partsPromises);

          // Initialize JSZip
          const zip = new JSZip();

          for (const part of parts) {
            const response = await fetch(part.fileURL);
            const fileBlob = await response.blob();

            // Check if the part.name ends with .dxf
            const isDXF = part.name.endsWith(".dxf");
            const fileExtension = isDXF ? "" : ".svg"; // Only add .svg if the name doesn't end with .dxf

            // Add file to zip without modifying the file if it's already .dxf
            zip.file(`${part.name}${fileExtension}`, fileBlob);
          }

          // Generate the zip and trigger download
          const zipFile = await zip.generateAsync({ type: "blob" });
          saveAs(zipFile, `Quote_${quoteid}_parts.zip`);
        } catch (error) {
          console.error("Error downloading parts:", error);
        }
      };

      // Render download button with image
      return (
        <div className="flex cursor-pointer space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            <img
              src={downloadsvg}
              alt="Download"
              onClick={handleDownloadPartsFiles}
            />
          </span>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "shippingAddress",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Shipping Address" />
    ),
    cell: ({ row }) => {
      const shippingOption = row.original.shippingOption;
      const shippingAddress = row.getValue("shippingAddress");

      return (
        <div className={"flex cursor-pointer space-x-2"}>
          <span className="max-w-[500px] truncate font-medium">
            {shippingOption === "delivery"
              ? shippingAddress || "No Address Provided"
              : "Pickup"}
          </span>
        </div>
      );
    },
    enableSorting: true,
  },
];
