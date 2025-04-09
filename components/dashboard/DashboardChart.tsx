"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  PieChart as RechartsBasePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

interface DashboardChartProps {
  title: string;
  data: any[];
  type: "bar" | "pie";
  icon?: React.ReactNode;
  description?: string;
  className?: string;
}

export function DashboardChart({
  title,
  data,
  type,
  icon,
  description,
  className,
}: DashboardChartProps) {
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
  ];

  if (!data || data.length === 0) {
    return (
      <Card className={cn("p-6", className)}>
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-medium">{title}</h3>
          {icon}
        </div>
        <div className="h-[300px] flex items-center justify-center">
          <Skeleton className="w-full h-[250px] rounded-md" />
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
      </div>
      {description && (
        <p className="text-xs text-muted-foreground mb-6">{description}</p>
      )}
      <div className="h-[300px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          {type === "bar" ? (
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--border)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Bar
                dataKey="value"
                fill="var(--primary)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          ) : (
            <RechartsBasePieChart
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--border)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </RechartsBasePieChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
