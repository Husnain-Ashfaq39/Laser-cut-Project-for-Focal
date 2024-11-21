/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Timestamp } from "firebase/firestore";
import { toast } from "@/components/_ui/toast/use-toast";
import { fetchDocuments } from "./db-services";

export const getFilteredQuotesCount = async (
  collectionName: string,
  filterOption: string,
) => {
  try {
    const now = new Date();
    let startDate: Date;
    switch (filterOption) {
      case "This Week":
        startDate = new Date();
        startDate.setDate(now.getDate() - 7); // Last 7 days
        break;
      case "Last 30 Days":
        startDate = new Date();
        startDate.setMonth(now.getMonth() - 1); // Last 1 month
        break;
      case "This Year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        throw new Error("Invalid filter option");
    }

    const startTimestamp = Timestamp.fromDate(startDate).seconds;

    const filters = [
      {
        field: "lastModified",
        operator: ">=",
        value: startTimestamp.toString(),
      },
      { field: "status", operator: "!=", value: "draft" },
    ];
    const quotes = await fetchDocuments("Quotes", filters);

    return quotes?.length;
  } catch (error) {
    console.error(
      `Error fetching filtered quotes from ${collectionName}:`,
      error,
    );
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to fetch filtered quotes.",
      duration: 3000,
    });
    throw new Error("Failed to fetch filtered quotes.");
  }
};

export const getTotalCuttingTime = async (collectionName: string) => {
  try {
    const filters = [{ field: "status", operator: "==", value: "in progress" }];

    const quotes: any = await fetchDocuments(collectionName, filters);

    if (!Array.isArray(quotes) || quotes?.length === 0) {
      console.log("No quotes with status 'in progress'");
      return 0; // Return 0 if no matching quotes are found
    }

    // Calculate the total cutting time from the filtered quotes
    const totalCuttingTime = quotes.reduce((acc, quote) => {
      const cuttingTime = quote?.totalCuttingTimeOfQuote || 0; // Safely handle missing or undefined values

      return acc + cuttingTime;
    }, 0);

    return totalCuttingTime;
  } catch (error) {
    console.error(
      `Error fetching total cutting time from ${collectionName}:`,
      error,
    );
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to calculate total cutting time.",
      duration: 3000,
    });
    throw new Error("Failed to calculate total cutting time.");
  }
};

export const getMonthlyIncome = async (collectionName: string) => {
  try {
    // Filter to include only quotes with status !== 'draft'
    const filters = [
      { field: "status", operator: "not-in", value: ["draft", "cancelled"] },
    ];

    // Fetch all matching quotes
    const quotes: any = await fetchDocuments(collectionName, filters);

    if (!quotes || quotes?.length === 0) {
      console.log("No quotes found.");
      return [];
    }

    // Initialize an object to store monthly income
    const monthlyIncome: { [key: string]: number } = {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0,
    };

    // Loop through each quote and calculate the total price per month
    quotes.forEach((quote: any) => {
      const lastModified = quote.lastModified;
      const date = new Date(lastModified * 1000); // Convert seconds to milliseconds for Date object
      const monthName = date.toLocaleString("en-US", { month: "long" });

      const totalPrice = quote.totalPrice || 0; // Safely handle missing or undefined values

      if (monthlyIncome[monthName] !== undefined) {
        monthlyIncome[monthName] += totalPrice;
      }
    });

    // Convert the monthly income object to an array of objects
    const OneYearChartData = Object.keys(monthlyIncome).map((day) => ({
      day,
      income: monthlyIncome[day],
    }));

    return OneYearChartData;
  } catch (error) {
    console.error(
      `Error fetching monthly income from ${collectionName}:`,
      error,
    );
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to calculate monthly income.",
      duration: 3000,
    });
    throw new Error("Failed to calculate monthly income.");
  }
};

export const getWeeklyIncome = async (collectionName: string) => {
  try {
    const filters = [
      { field: "status", operator: "not-in", value: ["draft", "cancelled"] },
    ];

    // Fetch all matching quotes
    const quotes: any = await fetchDocuments(collectionName, filters);

    if (!quotes || quotes?.length === 0) {
      console.log("No quotes found.");
      return [];
    }

    // Initialize an object to store daily income
    const weeklyIncome: { [key: string]: number } = {
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
      Sunday: 0,
    };

    // Get the current day of the week
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

    // Loop through each quote and calculate the total price per day for the last 7 days
    quotes.forEach((quote: any) => {
      const lastModified = quote.lastModified;
      const date = new Date(lastModified * 1000); // Convert seconds to milliseconds for Date object

      // Only consider quotes modified within the last 7 days
      if (date >= startOfWeek) {
        const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
        const totalPrice = quote.totalPrice || 0; // Safely handle missing or undefined values

        if (weeklyIncome[dayName] !== undefined) {
          weeklyIncome[dayName] += totalPrice;
        }
      }
    });

    // Convert the weekly income object to an array of objects
    const OneWeekChartData = Object.keys(weeklyIncome).map((day) => ({
      day,
      income: weeklyIncome[day],
    }));

    return OneWeekChartData;
  } catch (error) {
    console.error(
      `Error fetching weekly income from ${collectionName}:`,
      error,
    );
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to calculate weekly income.",
      duration: 3000,
    });
    throw new Error("Failed to calculate weekly income.");
  }
};

export const getIncomeForLast30Days = async (collectionName: string) => {
  try {
    // Filter to include only quotes with status !== 'draft'
    const filters = [
      { field: "status", operator: "not-in", value: ["draft", "cancelled"] },
    ];

    // Fetch all matching quotes
    const quotes: any = await fetchDocuments(collectionName, filters);

    // Get the current date and calculate the date 30 days ago
    const now = new Date();
    const last30Days = new Date(now);
    last30Days.setDate(now.getDate() - 30); // Go back 30 days

    // Initialize an object to store daily income for the last 30 days
    const dailyIncome: { [key: string]: number } = {};

    // Populate daily income with zeros for the last 30 days
    for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
      const date = new Date(now);
      date.setDate(now.getDate() - dayOffset);
      const dayLabel = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }); // Use 'MMM DD' format
      dailyIncome[dayLabel] = 0;
    }

    // Loop through each quote and calculate the total price per day for the last 30 days
    quotes.forEach((quote: any) => {
      const lastModified = quote.lastModified;
      const date = new Date(lastModified * 1000); // Convert seconds to milliseconds

      // Only consider quotes modified in the last 30 days
      if (date >= last30Days && date <= now) {
        const dayLabel = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }); // Use 'MMM DD' format
        const totalPrice = quote.totalPrice || 0; // Safely handle missing or undefined values

        if (dailyIncome[dayLabel] !== undefined) {
          dailyIncome[dayLabel] += totalPrice; // Add the totalPrice to the corresponding day
        }
      }
    });

    // Sort the days chronologically and map the data for charting
    const sortedDailyIncome = Object.keys(dailyIncome)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .map((day) => ({
        day,
        income: dailyIncome[day],
      }));

    return sortedDailyIncome;
  } catch (error) {
    console.error(
      `Error fetching income for last 30 days from ${collectionName}:`,
      error,
    );
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to calculate income for the last 30 days.",
      duration: 3000,
    });
    throw new Error("Failed to calculate income for the last 30 days.");
  }
};

export const getCuttingTimeByMonth = async (collectionName: string) => {
  try {
    const filters = [
      {
        field: "status",
        operator: "not-in",
        value: ["draft", "in progress", "cancelled"],
      },
    ];

    // Fetch all matching quotes
    const quotes: any = await fetchDocuments(collectionName, filters);

    if (!quotes || quotes?.length === 0) {
      console.log("No quotes found.");
      return [];
    }

    // Initialize an object to store cutting time for each month
    const monthlyCuttingTime: { [key: string]: number } = {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0,
    };

    // Loop through each quote and calculate the cutting time per month
    quotes.forEach((quote: any) => {
      const lastModified = quote.lastModified;
      const date = new Date(lastModified * 1000); // Convert seconds to milliseconds for Date object
      const monthName = date.toLocaleString("en-US", { month: "long" });

      const cuttingTime = quote.totalCuttingTimeOfQuote || 0; // Safely handle missing or undefined values

      if (monthlyCuttingTime[monthName] !== undefined) {
        monthlyCuttingTime[monthName] += cuttingTime;
      }
    });

    // Convert the monthly cutting time object to an array of objects for the chart
    const OneYearCuttingTimeChartData = Object.keys(monthlyCuttingTime).map(
      (day) => ({
        day,
        time: monthlyCuttingTime[day], // This ensures proper key-value pairing
      }),
    );

    console.log(
      "Processed Chart Data:",
      JSON.stringify(OneYearCuttingTimeChartData),
    ); // For debugging

    return OneYearCuttingTimeChartData; // This will return correctly structured data
  } catch (error) {
    console.error(
      `Error fetching cutting time by month from ${collectionName}:`,
      error,
    );
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to calculate monthly cutting time.",
      duration: 3000,
    });
    throw new Error("Failed to calculate monthly cutting time.");
  }
};
export const getCuttingTimeByWeek = async (collectionName: string) => {
  try {
    const filters = [
      {
        field: "status",
        operator: "not-in",
        value: ["draft", "in progress", "cancelled"],
      },
    ];

    // Fetch all matching quotes
    const quotes: any = await fetchDocuments(collectionName, filters);

    if (!quotes || quotes?.length === 0) {
      console.log("No quotes found.");
      return [];
    }

    // Initialize an object to store weekly cutting time
    const weeklyCuttingTime: { [key: string]: number } = {
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
      Sunday: 0,
    };

    // Get the current day of the week
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

    // Loop through each quote and calculate the cutting time for the last 7 days
    quotes.forEach((quote: any) => {
      const lastModified = quote.lastModified;
      const date = new Date(lastModified * 1000); // Convert seconds to milliseconds for Date object

      // Only consider quotes modified within the last 7 days
      if (date >= startOfWeek) {
        const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
        const cuttingTime = quote.totalCuttingTimeOfQuote || 0; // Safely handle missing or undefined values

        if (weeklyCuttingTime[dayName] !== undefined) {
          weeklyCuttingTime[dayName] += cuttingTime;
        }
      }
    });

    // Convert the weekly cutting time object to an array of objects for the chart
    const OneWeekCuttingTimeChartData = Object.keys(weeklyCuttingTime).map(
      (day) => ({
        day,
        time: weeklyCuttingTime[day],
      }),
    );

    return OneWeekCuttingTimeChartData;
  } catch (error) {
    console.error(
      `Error fetching cutting time by week from ${collectionName}:`,
      error,
    );
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to calculate weekly cutting time.",
      duration: 3000,
    });
    throw new Error("Failed to calculate weekly cutting time.");
  }
};

export const getCuttingTimeOfOneMonth = async (collectionName: string) => {
  try {
    const filters = [
      {
        field: "status",
        operator: "not-in",
        value: ["draft", "in progress", "cancelled"],
      },
    ];

    // Fetch all matching quotes
    const quotes: any = await fetchDocuments(collectionName, filters);

    if (!quotes || quotes?.length === 0) {
      console.log("No quotes found.");
      return [];
    }

    // Get the current date and the first day of the current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get the number of days in the current month
    const daysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
    ).getDate();

    // Initialize an object to store daily cutting time for every day of the month
    const dailyCuttingTime: { [key: string]: number } = {};
    for (let day = 1; day <= daysInMonth; day++) {
      dailyCuttingTime[day] = 0;
    }

    // Loop through each quote and calculate the cutting time per day for the current month
    quotes.forEach((quote: any) => {
      const lastModified = quote.lastModified;
      const date = new Date(lastModified * 1000); // Convert seconds to milliseconds for Date object

      // Only consider quotes modified in the current month
      if (date >= startOfMonth && date <= now) {
        const day = date.getDate().toString(); // Get the day of the month (1 to 31)
        const cuttingTime = quote.totalCuttingTimeOfQuote || 0; // Safely handle missing or undefined values

        dailyCuttingTime[day] += cuttingTime; // Add the cutting time to the corresponding day
      }
    });

    // Convert the daily cutting time object to an array of objects for the chart
    const OneMonthCuttingTimeChartData = Object.keys(dailyCuttingTime).map(
      (day) => ({
        day,
        time: dailyCuttingTime[day],
      }),
    );

    return OneMonthCuttingTimeChartData;
  } catch (error) {
    console.error(
      `Error fetching cutting time by month from ${collectionName}:`,
      error,
    );
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to calculate cutting time for the month.",
      duration: 3000,
    });
    throw new Error("Failed to calculate cutting time for the month.");
  }
};

export const formatCuttingTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds.toFixed(0)}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds.toFixed(0)}s`;
  } else {
    return `${remainingSeconds.toFixed(0)}s`;
  }
};
