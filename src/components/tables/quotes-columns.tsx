/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { pickupStatuses, deliveryStatuses } from "@/data/quotes/data";
import { Task } from "@/data/quotes/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { useDispatch } from "react-redux";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { fetchDocumentById } from "@/services/db-services";
import {
  addFile,
  updateQuoteId,
  updateStatus,
} from "@/redux/slices/quote-parts-slice";
import { useNavigate } from "react-router-dom";
import { fetchPartFile } from "@/services/dxf-fetcher";

export const columns = (setLoading) => [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quote ID" />
    ),
    cell: ({ row }) => {
      
      const isDraft = row.getValue("status") === "draft";
      const isInProgress = row.getValue("status") === "in progress";
      const isClickable = isDraft || isInProgress;
      const dispatch = useDispatch();
      const navigate = useNavigate();
      return (
        <div className={"flex cursor-pointer space-x-2"} onClick={() =>
          isClickable &&
          handleRowClick(row.original, dispatch, navigate, setLoading)
        }>
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("id")}
          </span>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "customQuoteID", // Custom Quote ID accessor
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Custom Quote ID" />
    ),
    cell: ({ row }) => {
      
      const isDraft = row.getValue("status") === "draft";
      const isInProgress = row.getValue("status") === "in progress";
      const isClickable = isDraft || isInProgress;
      const dispatch = useDispatch();
      const navigate = useNavigate();
      return (
        <div className={"flex cursor-pointer space-x-2"} onClick={() =>
          isClickable &&
          handleRowClick(row.original, dispatch, navigate, setLoading)
        }>
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("customQuoteID") || ""}
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
      const isDraft = row.getValue("status") === "draft";
      const isInProgress = row.getValue("status") === "in progress";
      const isClickable = isDraft || isInProgress;
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
      const isDraft = row.getValue("status") === "draft";
      const isInProgress = row.getValue("status") === "in progress";
      const isClickable = isDraft || isInProgress;
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
            {totalPrice !== null && totalPrice !== undefined
              ? totalPrice.toFixed(2)
              : "0.00"}{" "}
            $
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
      const shippingOption = row.original.shippingOption;
      const statuses =
        shippingOption === "pickup" ? pickupStatuses : deliveryStatuses; // Select statuses based on shippingOption
      const currentStatus = row.getValue("status");
      const status = statuses.find((status) => status.value === currentStatus);
      const isDraft = currentStatus === "draft";
      const isInProgress = currentStatus === "in progress";
      const isClickable = isDraft || isInProgress;
      const dispatch = useDispatch();
      const navigate = useNavigate();

      if (!status) return null;

      return (
        <div
          className={`flex w-[100px] items-center ${isClickable ? "cursor-pointer" : ""}`}
          onClick={() =>
            isClickable &&
            handleRowClick(row.original, dispatch, navigate, setLoading)
          }
        >
          <>
            {status.icon && (
              <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
            )}
            <span>{status.label}</span>
          </>
        </div>
      );
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableSorting: true,
  },
];

// Function to handle row click
const handleRowClick = async (
  rowData: Task,
  dispatch: Dispatch<UnknownAction>,
  navigate: ReturnType<typeof useNavigate>,
  setLoading: (loading: boolean) => void
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

      // Initialize variables for extraNote and uploadedFiles
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
          uploadedFiles: uploadedFileBlobs,
        })
      );
    })
  );

  // Navigate after all async operations are complete
  navigate("/quotes/new-quote");
  setLoading(false); // Stop loading

  return null;
};
