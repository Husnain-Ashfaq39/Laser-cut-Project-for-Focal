/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/_ui/dropdown-menu";
import { ShoppingCart, Timer } from "lucide-react"; // Replaced Clock with Timer
import { Component as AreaChartComponent } from "@/components/_ui/charts/area-chart";
import { Component as BarChartComponent } from "@/components/_ui/charts/bar-chart";
import {
  formatCuttingTime,
  getCuttingTimeByMonth,
  getCuttingTimeByWeek,
  getCuttingTimeOfOneMonth,
  getFilteredQuotesCount,
  getIncomeForLast30Days,
  getMonthlyIncome,
  getTotalCuttingTime,
  getWeeklyIncome,
} from "@/services/dashboard-services"; // Import the service
import FooterAdmin from "@/components/footer/footer-admin";
import NavbarAdmin from "@/components/nav/navbar-admin";
import { toast } from "@/components/_ui/toast/use-toast";
import { DataTable } from "@/components/tables/data-table";
import { fetchDocuments } from "@/services/db-services";
import { Button } from "@/components/_ui/button";
import { useNavigate } from "react-router-dom";
import { MaterialColumm } from "@/components/tables/material-columns";
import PreLoader from "@/components/pre-loader";
import { SkeletonCard } from "@/components/_ui/skeleton"; // Import shadcn Skeleton
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ShortAdminQuotes } from "@/components/tables/short-admin-quotes-columns";

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("This Week");
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalCuttingTime, settotalCuttingTime] = useState(0);
  const [chartData, setChartData] = useState(null); // Single state for chart data
  const [hoursChartData, sethoursChartData] = useState(null);
  const [materials, setMaterials] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [quotesData, setquotesData] = useState(null);

  const user = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  // Fetch data whenever selectedPeriod changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // Start loader
        // Fetch total orders and cutting time
        const total = await getFilteredQuotesCount("Quotes", selectedPeriod);
        const time = await getTotalCuttingTime("Quotes");
        const materialdata = await fetchDocuments("Materials");
        let QuotesData: any = await fetchDocuments("Quotes");
        QuotesData = QuotesData.filter(
          (item) =>
            item.customerID === user.id ||
            (item.customerID !== user.id && item.status !== "draft"),
        );
        QuotesData.sort((a, b) => b.lastModified - a.lastModified);

        const transformedMaterials = materialdata?.flatMap((material: any) => {
          // Filter the sheets of each material to only include those with quantity < 0
          return (
            material?.sheets
              ?.filter((sheet: any) => sheet?.quantity < 0) // Only keep sheets with quantity less than 0
              .map((sheet: any) => ({
                materialName: material.name, // Material name
                thickness: sheet.thickness, // Thickness
                quantity: Math.abs(sheet.quantity) || 0, // Use absolute value for clarity
                size: {
                  height: sheet.size.height || 0, // Default height
                  width: sheet.size.width || 0, // Default width
                },
              })) || []
          ); // Default to an empty array if no sheets
        });

        // Store the transformed data in the state
        setMaterials(transformedMaterials);

        let chartData, hoursChartData;
        if (selectedPeriod === "This Year") {
          chartData = await getMonthlyIncome("Quotes");
          hoursChartData = await getCuttingTimeByMonth("Quotes");
        } else if (selectedPeriod === "Last 30 Days") {
          chartData = await getIncomeForLast30Days("Quotes");
          hoursChartData = await getCuttingTimeOfOneMonth("Quotes");
        } else if (selectedPeriod === "This Week") {
          chartData = await getWeeklyIncome("Quotes");
          hoursChartData = await getCuttingTimeByWeek("Quotes");
        }

        setTotalOrders(total);
        settotalCuttingTime(time);
        setChartData(chartData);
        sethoursChartData(hoursChartData);
        setquotesData(QuotesData);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch data.",
          duration: 3000,
        });
      } finally {
        setIsLoading(false); // Stop loader
        setIsInitialLoad(false); // End initial load
      }
    };

    fetchData();
  }, [selectedPeriod]);

  return (
    <div className="w-full bg-slate-100">
      <NavbarAdmin />
      <main className="m-auto flex min-h-screen flex-col px-[2%] pb-14">
        {/* First Row - Dropdown on the right */}
        {isInitialLoad ? ( // PreLoader for initial load
          <PreLoader />
        ) : (
          <>
            <div className="flex justify-end p-5">
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  {selectedPeriod}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => setSelectedPeriod("This Week")}
                  >
                    This Week
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSelectedPeriod("Last 30 Days")}
                  >
                    Last 30 days
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSelectedPeriod("This Year")}
                  >
                    This Year
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Second Row - Flex 4 Box Layout */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Box 1: Total Orders */}
              <div className="flex items-center justify-between rounded-lg bg-white p-5 shadow">
                {isLoading ? (
                  <SkeletonCard /> // Skeleton for Total Orders
                ) : (
                  <div className="flex items-center space-x-4">
                    <ShoppingCart className="h-24 w-24 text-black" />
                    <div>
                      <h4 className="text-lg font-medium">Total Orders</h4>
                      <p className="text-4xl font-bold">{totalOrders}</p>{" "}
                      {/* Display total orders here */}
                    </div>
                  </div>
                )}
              </div>

              {/* Box 2: Current Cutting Scheduled */}
              <div className="flex items-center justify-between rounded-lg bg-white px-5 shadow">
                {isLoading ? (
                  <SkeletonCard /> // Skeleton for Cutting Time
                ) : (
                  <div className="my-4 flex items-center space-x-4">
                    <Timer className="h-24 w-24 text-black" />
                    <div>
                      <h4 className="text-sm font-medium">
                        Current Cutting Scheduled
                      </h4>
                      {/* Use the helper function to display hours and minutes */}
                      <p className="text-3xl font-bold">
                        {formatCuttingTime(totalCuttingTime)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Box 3: Hours Cutted */}
              <div className="">
                {isLoading ? (
                  <div className="flex items-center justify-between rounded-lg bg-white p-5 shadow">
                    <SkeletonCard />
                  </div>
                ) : (
                  <AreaChartComponent hoursChartData={hoursChartData} />
                )}
              </div>

              {/* Box 4: Total Income Chart */}
              <div className="">
                {isLoading ? (
                  <div className="flex items-center justify-between rounded-lg bg-white p-5 shadow">
                    <SkeletonCard />
                  </div>
                ) : (
                  <BarChartComponent chartData={chartData} />
                )}
              </div>
            </div>

            <div className="mb-4 mt-10 flex justify-between">
              <h1 className="font-body text-xl font-semibold">Latest Quotes</h1>
              <Button
                variant="default"
                className="rounded-full"
                onClick={() => {
                  navigate("/admin/quotes");
                }}
              >
                See all
              </Button>
            </div>
            <div className="">
              {quotesData && quotesData.length > 0 ? (
                <div className="mt-4 flex min-h-[150px] min-w-[500px] flex-col space-y-8 rounded-md border bg-white p-8 shadow-xl">
                  <DataTable data={quotesData} columns={ShortAdminQuotes} />
                </div>
              ) : (
                <div>No Quotes available</div>
              )}
            </div>

            <div className="mb-4 mt-10 flex">
              <h1 className="font-body text-xl font-semibold">Materials</h1>
            </div>

            <div className="">
              {materials && materials.length > 0 ? (
                <div className="mt-4 flex min-h-[150px] min-w-[500px] flex-col space-y-8 rounded-md border bg-white p-8 shadow-xl">
                  <DataTable data={materials} columns={MaterialColumm} />
                </div>
              ) : (
                <div>No Material available</div>
              )}
            </div>
          </>
        )}
      </main>
      <FooterAdmin />
    </div>
  );
};

export default Dashboard;
