import { columns } from "@/components/tables/columns";
import { PartLibraryColumns } from "@/components/tables/part-library-columns";
import { DataTable } from "@/components/tables/data-table";
import { default as CreateNewQuoteButton } from "./create-quote-button";
import { quotes } from "@/data/quotes/quotes";

interface DataListProps {
  Columns: "part" | "history";
}

const DataList: React.FC<DataListProps> = ({ Columns }) => {
  const selectedColumns = Columns === "part" ? PartLibraryColumns : columns;

  return (
    <div className="mt-10 flex min-h-[650px] min-w-[500px] flex-col rounded-md border bg-white shadow-xl">
      {quotes.length > 0 ? (
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
          <DataTable data={quotes} columns={selectedColumns} />
        </div>
      ) : (
        <>
          <div className="flex flex-col justify-center space-y-2">
            <img
              src="/group-237716.svg"
              alt="group"
              className="m-auto mt-10 h-[350px] w-[350px]"
            />
            <h1 className="m-auto font-primary text-2xl">No Data available</h1>
            <p className="m-auto font-body text-sm text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse varius enim in eros.
            </p>
          </div>
          <div className="m-auto">
            <CreateNewQuoteButton />
          </div>
        </>
      )}
    </div>
  );
};

export default DataList;
