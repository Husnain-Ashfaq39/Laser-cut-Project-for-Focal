import { Button } from "@/components/_ui/button";
import { DataTable } from "@/components/tables/data-table";
import { SheetsColumn } from "@/components/tables/sheets-columns";

function SheetsTable({
  sheets,
  selectedMaterialId,
  onSaveSheetData,
  onDeleteSheet,
  onOpenSheetModal,
}) {
  return (
    <div className="w-full">
      {/* Add New Sheet Button */}
      <Button
        variant="default"
        className="mb-5 rounded-full font-secondary"
        onClick={onOpenSheetModal}
      >
        + Add New Sheet
      </Button>

      {/* Sheets Data Table */}
      <div className="mt-10 flex min-h-[150px] min-w-[500px] flex-col space-y-8 rounded-md border bg-white p-8 shadow-xl">
        <DataTable
          data={
            sheets?.map((sheet) => ({
              ...sheet,
              id: selectedMaterialId,
              sheetRate: sheet.sheetCost * (1 + sheet.appliedMarkup / 100),
            })) || []
          }
          columns={SheetsColumn(onSaveSheetData, onDeleteSheet)}
        />
      </div>
    </div>
  );
}

export default SheetsTable;
