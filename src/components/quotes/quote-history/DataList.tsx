/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { fetchDocuments } from "@/services/db-services";
import { columns } from "@/components/tables/quotes-columns";
import { PartLibraryColumns } from "@/components/tables/part-library-columns";
import { AdminQuotes } from "@/components/tables/admin-quotes-columns";
import { DataTable } from "@/components/tables/data-table";
import { default as CreateNewQuoteButton } from "./create-quote-button";
import PreLoader from "@/components/pre-loader";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { updateStatus } from "@/services/webflow-services";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface DataListProps {
  Columns: "part" | "history" | "adminQuotes";
}

const DataList: React.FC<DataListProps> = ({ Columns }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation(); // Get the current location
  const navigate=useNavigate();

  const handleStatusUpdate = async (QuoteID, newStatus, jobID = "") => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === QuoteID ? { ...item, status: newStatus } : item,
      ),
    );
    const state = {
      jobID: jobID,
      status: newStatus,
    };
    await updateStatus(state);
  };

  const selectedColumns =
    Columns === "part"
      ? PartLibraryColumns
      : Columns === "history"
        ? columns(setLoading)
        : AdminQuotes(handleStatusUpdate, setLoading);
  const [data, setData] = useState<any[]>([]);

  const user = useSelector((state: RootState) => state.auth);
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // Fetch the documents from the respective collection based on the "Columns" prop
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const collectionName = Columns === "part" ? "Parts" : "Quotes";
        if (
          location.pathname === "/quotes/history" ||
          location.pathname === "/admin/quotes"
        ) {
          await sleep(5000);
        }
        const filter1 = [
          { field: "customerID", operator: "==", value: user.id }, // Filter by customerID
        ];

        let fetchedData;
        if (user.role === "admin") {
          if (collectionName === "Parts") {
            fetchedData = await fetchDocuments(collectionName, filter1);
          } else {
            fetchedData = await fetchDocuments(collectionName);

            if (location.pathname === "/quotes/history") {
              fetchedData = fetchedData.filter(
                (item) => item.customerID === user.id,
              );
            } else {
              fetchedData = fetchedData.filter(
                (item) =>
                  item.customerID === user.id ||
                  (item.customerID !== user.id && item.status !== "draft"),
              );
            }
            fetchedData.sort((a, b) => b.lastModified - a.lastModified);
          }
        } else {
          if (collectionName === "Parts") {
            fetchedData = await fetchDocuments(collectionName, filter1);
          } else {
            fetchedData = await fetchDocuments(collectionName, filter1);
          }
        }
        setData(fetchedData);
      } catch (error) {
        console.error(
          `Error fetching ${Columns === "part" ? "parts" : "quotes"}:`,
          error,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [Columns, user.id, user.role]);

  return (
    <div className="mt-10 flex min-w-[500px] flex-col rounded-md border bg-white shadow-xl">
      {loading ? (
        <PreLoader />
      ) : data?.length > 0 ? (
        <div className="h-full flex-col space-y-8 p-8">
          <DataTable data={data} columns={selectedColumns} />
        </div>
      ) : (
        <>
        {location.pathname === "/quotes/new-quote/part-library" &&(
        <div className="my-3 inline-block">
          <Link
            to=""
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-blue-600 hover:underline p-4"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </Link>
        </div>
        )}
          <div className="flex flex-col justify-center space-y-2 mb-6">
            <img
              src="/group-237716.svg"
              alt="group"
              className="m-auto mt-10 h-[350px] w-[350px]"
            />
            <h1 className="m-auto font-primary text-2xl">No Data available</h1>
          </div>
          <div className="m-auto mb-44">
            <CreateNewQuoteButton />
          </div>
        </>
      )}
    </div>
  );
};

export default DataList;
