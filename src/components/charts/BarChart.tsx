
import React, { useState } from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Shared type from LineChart
export type DataPoint = {
  [key: string]: string | number | undefined;
};
export type SeriesConfig = {
  dataKey: string;
  name: string;
  color: string;
  enabled?: boolean;
};

export type BarChartProps = {
  data: DataPoint[];
  series: SeriesConfig[];
  xAxisDataKey: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  chartTitle?: string;
  /**
   * Optional domain for the y-axis [min, max]
   */
  yAxisDomain?: [number | "auto", number | "auto"];
  height?: number | string;
  showSeriesToggle?: boolean;
  barSize?: number;
  barGap?: number;
};

const BarChart = ({
  data,
  series,
  xAxisDataKey,
  xAxisLabel,
  yAxisLabel,
  chartTitle,
  yAxisDomain = [0, "auto"],
  height = 250,
  showSeriesToggle = true,
  barSize,
  barGap,
}: BarChartProps) => {
  const [enabledSeries, setEnabledSeries] = useState<Record<string, boolean>>(
    series.reduce(
      (acc, { dataKey, enabled = true }) => {
        acc[dataKey] = enabled;
        return acc;
      },
      {} as Record<string, boolean>
    )
  );

  const toggleSeries = (dataKey: string) => {
    setEnabledSeries({
      ...enabledSeries,
      [dataKey]: !enabledSeries[dataKey],
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm space-y-4">
      {chartTitle && (
        <h4 className="font-medium text-base mb-2">{chartTitle}</h4>
      )}
      {showSeriesToggle && (
        <div className="flex flex-wrap gap-4">
          {series.map((s) => (
            <div key={s.dataKey} className="flex items-center space-x-2">
              <Checkbox
                id={s.dataKey}
                checked={enabledSeries[s.dataKey]}
                onCheckedChange={() => toggleSeries(s.dataKey)}
              />
              <Label
                htmlFor={s.dataKey}
                className="text-sm font-medium flex items-center"
              >
                <span
                  className="inline-block w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: s.color }}
                ></span>
                {s.name}
              </Label>
            </div>
          ))}
        </div>
      )}

      <div style={{ height: height, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            barSize={barSize}
            barGap={barGap}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={xAxisDataKey}
              label={
                xAxisLabel
                  ? { value: xAxisLabel, position: "insideBottom", offset: -5 }
                  : undefined
              }
              className="text-xs"
            />
            <YAxis
              domain={yAxisDomain}
              label={
                yAxisLabel
                  ? { value: yAxisLabel, angle: -90, position: "insideLeft" }
                  : undefined
              }
              className="text-xs"
            />
            <Tooltip />
            <Legend />
            {series.map(
              (s) =>
                enabledSeries[s.dataKey] && (
                  <Bar
                    key={s.dataKey}
                    dataKey={s.dataKey}
                    fill={s.color}
                    name={s.name}
                    radius={[3, 3, 0, 0]}
                  />
                )
            )}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChart;
