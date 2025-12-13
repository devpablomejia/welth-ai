"use client";

import * as React from "react";
import { ResponsiveContainer, Tooltip } from "recharts";

import { cn } from "@/lib/utils";

export type ChartConfig = Record<
  string,
  {
    label: string;
    color?: string;
  }
>;

type RechartsTooltipPayload = {
  dataKey?: string | number;
  value?: number | string;
  color?: string;
};

type ChartContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  config: ChartConfig;
  children: React.ReactElement;
};

export function ChartContainer({
  config,
  className,
  children,
  style,
  ...props
}: ChartContainerProps) {
  const cssVars = React.useMemo(() => {
    const vars: Record<string, string> = {};
    for (const [key, value] of Object.entries(config)) {
      if (value.color) vars[`--color-${key}`] = value.color;
    }
    return vars;
  }, [config]);

  return (
    <div
      className={cn("w-full", className)}
      style={{ ...(style as Record<string, unknown>), ...cssVars }}
      {...props}
    >
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

export function ChartTooltip(props: React.ComponentProps<typeof Tooltip>) {
  return <Tooltip {...props} />;
}

type ChartTooltipContentProps = {
  active?: boolean;
  payload?: RechartsTooltipPayload[];
  label?: string | number;
  config?: ChartConfig;
};

export function ChartTooltipContent({
  active,
  payload,
  label,
  config,
}: ChartTooltipContentProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border bg-card px-3 py-2 text-sm shadow-sm">
      <div className="mb-2 font-medium text-foreground">{String(label)}</div>
      <div className="space-y-1">
        {payload
          .filter(
            (
              p
            ): p is Required<Pick<RechartsTooltipPayload, "dataKey">> &
              RechartsTooltipPayload => Boolean(p.dataKey)
          )
          .map((p) => {
            const dataKey = String(p.dataKey);
            const cfg = config?.[dataKey];
            const dotColor =
              cfg?.color ??
              (typeof p.color === "string" ? p.color : "hsl(var(--primary))");

            return (
              <div
                key={dataKey}
                className="flex items-center justify-between gap-6"
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: dotColor }}
                  />
                  <span>{cfg?.label ?? dataKey}</span>
                </div>
                <div className="font-semibold text-foreground">
                  {typeof p.value === "number" ? p.value : String(p.value)}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
