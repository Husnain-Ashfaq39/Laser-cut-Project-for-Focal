/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/_ui/table";

import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { useEffect, useState } from "react";
import { Button } from "../_ui/button";
import { useDispatch } from "react-redux";
import { addFile } from "@/redux/slices/quote-parts-slice";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../_ui/toast/use-toast";
import { fetchPartFile } from "@/services/dxf-fetcher";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  toolbar?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  toolbar = false,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { toast } = useToast();
  const location = useLocation(); // Get the current location
  const defaultPageSize =
  location.pathname === "/admin/quotes" ? 50 : 10;

  const table = useReactTable({
    data,
  columns,
  initialState: {
    pagination: {
      pageSize: defaultPageSize,// Set default rows per page to 50
    },
  },
  state: {
    sorting,
    columnVisibility,
    rowSelection,
    columnFilters,
  },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });
  const [parts, setParts] = useState<TData[]>([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const selectedRows = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);
    setParts(selectedRows);
  }, [rowSelection, table]);

  const handleAddParts = async () => {
    try {
      // Add selected rows to the state after fetching file from storage
      for (const part of parts as any) {
        let fileBlob;
        let fileType;

        fileBlob = await fetchPartFile(part.fileURL);
        fileType = fileBlob.type;
        // Check the file extension to determine file type (SVG or DXF)
        if (fileType == "image/svg+xml") {
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

        // Dispatch the file with appropriate type and other properties
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
            quantity: part.quantity || 1
          }),
        );

        // Show the toast notification
        toast({
          variant: "default",
          title: `${part.name} Added Successfully!`,
          description: "You have successfully added your part.",
          duration: 5000,
        });
      }

      // Navigate to the new page after processing all parts
      navigate("/quotes/new-quote");
    } catch (error) {
      console.error("Error adding parts: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error adding your parts.",
      });
    }
  };

  const handleCancel = () => {
    navigate("/quotes/new-quote");
  };

  return (
    <div className="space-y-4 bg-white object-contain">
      {toolbar && <DataTableToolbar table={table} statuses={[]} />}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={`row-${row.id || row.index}`}>
                  {row.getVisibleCells().map((cell, cellIndex) => (
                    <TableCell key={`cell-${cell.id}-${cellIndex}`}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-[30vh] text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {location.pathname === "/quotes/new-quote/part-library" && (
        <div className="mt-4 flex justify-end space-x-4">
          <Button
            onClick={handleCancel}
            variant="secondary"
            className="rounded-full border bg-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddParts}
            variant="default"
            className="rounded-full bg-black px-6 py-2 text-white hover:bg-gray-900"
          >
            Add to parts
          </Button>
        </div>
      )}

      <DataTablePagination table={table} />
    </div>
  );
}
