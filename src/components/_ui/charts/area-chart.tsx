import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCuttingTime } from "@/utils/format-cutting-time";

export const description = "A stacked area chart";

const chartConfig = {
  time: {
    label: "time",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function Component({ hoursChartData }) {
  console.log("in chart " + JSON.stringify(hoursChartData));

  const totalTime = hoursChartData?.reduce((sum, item) => sum + item.time, 0);

  return (
    <Card>
      <CardHeader>
        <CardDescription>Total Cut Time Completed</CardDescription>
        {/* Dynamically display total time */}
        <CardTitle>{formatCuttingTime(totalTime)}</CardTitle>
      </CardHeader>
      <CardContent style={{ paddingLeft: "0px" }}>
        <ChartContainer config={chartConfig}>
          {hoursChartData && hoursChartData.length > 0 ? (
            <AreaChart
              accessibilityLayer
              data={hoursChartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis domain={[0, "auto"]} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                dataKey="time"
                type="monotone"
                fill="var(--color-time)"
                fillOpacity={0.4}
                stroke="var(--color-time)"
                stackId="a"
              />
            </AreaChart>
          ) : (
            <p></p>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
