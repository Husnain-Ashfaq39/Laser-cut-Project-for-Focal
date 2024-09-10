import FooterAdmin from "@/components/footer/fouter-admin";
import NavbarAdmin from "@/components/nav/navbar-admin";
import { Button } from "@/components/_ui/button";
import { useNavigate } from "react-router-dom";
import CreateNewQuoteSteper from "@/components/quotes/create-quote/steper";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { formatCuttingTime } from "@/utils/format-cutting-time";
import { useEffect } from "react";

function QuoteSummary() {
  const navigate = useNavigate();
  const files = useSelector((state: RootState) => state.quoteParts.files);

  const totals = files.reduce(
    (acc, file) => {
      acc.totalCuttingTime += file.cuttingTime * file.quantity || 0;
      acc.totalCost += file.totalCost || 0;
      acc.totalQuantity += file.quantity;
      return acc;
    },
    { totalCuttingTime: 0, totalCost: 0, totalQuantity: 0 },
  );

  useEffect(() => {
    console.log(files); // Check if totalCost is present for each file
  }, [files]);

  return (
    <div className="w-full bg-slate-100">
      <NavbarAdmin />
      <main className="m-auto flex min-h-screen flex-col px-[5%] py-5">
        <h1 className="text-center font-primary text-3xl">
          Create a new quote
        </h1>
        <CreateNewQuoteSteper currentStep={2} />

        <div className="mt-8 w-full rounded-lg border bg-gray-50 p-6 shadow-sm">
          <h2 className="mb-4 text-center text-2xl font-semibold text-gray-800">
            Review Your Quote
          </h2>

          {/* Summary of each part */}
          <div className="space-y-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex flex-wrap items-center justify-between border-b border-gray-200 py-4 sm:flex-nowrap"
              >
                <div className="w-full truncate font-medium text-gray-700 sm:w-1/3">
                  {file.name}
                </div>

                <div className="mt-2 flex w-full justify-center text-gray-500 sm:mt-0 sm:w-1/6">
                  Quantity: {file.quantity}
                </div>

                <div className="mt-2 flex w-full justify-center text-gray-500 sm:mt-0 sm:w-1/6">
                  Cutting Time:{" "}
                  {formatCuttingTime(file.cuttingTime * file.quantity)}
                </div>

                <div className="w-full text-right font-semibold text-gray-900 sm:w-1/6">
                  Cost: ${file.totalCost?.toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-8 rounded-lg bg-white p-6 shadow-md">
            <div className="flex flex-col items-center justify-around space-y-4 sm:flex-row sm:space-y-0">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-700">
                  Total Cutting Time:
                </span>
                <span className="font-semibold text-gray-900">
                  {formatCuttingTime(totals.totalCuttingTime)}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-700">
                  Total Quantity:
                </span>
                <span className="font-semibold text-gray-900">
                  {totals.totalQuantity}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-700">Total Cost:</span>
                <span className="font-semibold text-gray-900">
                  ${totals.totalCost.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex space-x-4">
          <Button
            variant="outline"
            className="rounded-full border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-100"
            onClick={() => navigate("/quotes/new-quote")}
          >
            Back
          </Button>
          <Button
            variant="default"
            className="rounded-full bg-black px-6 py-2 text-white hover:bg-gray-900"
          >
            Checkout
          </Button>
        </div>
      </main>
      <FooterAdmin />
    </div>
  );
}

export default QuoteSummary;
