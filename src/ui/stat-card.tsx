import { type ReactNode } from "react";
import { cx } from "@ui/variants";
import { Card } from "@ui/card";

export type StatCardColor = "green" | "blue" | "orange" | "red" | "yellow" | "purple";

export type StatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  iconColor?: StatCardColor;
  trend?: { value: string; isPositive: boolean };
  action?: { label: string; onClick: () => void };
  className?: string;
  gradient?: boolean;
};

const iconColorMap: Record<StatCardColor, string> = {
  green:  "from-green-600 to-green-700",
  blue:   "from-blue-500 to-blue-600",
  orange: "from-orange-500 to-orange-600",
  red:    "from-red-500 to-red-600",
  yellow: "from-yellow-500 to-yellow-600",
  purple: "from-purple-500 to-purple-600",
};

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconColor = "green",
  trend,
  action,
  className,
  gradient = false,
}: StatCardProps) {
  return (
    <Card
      hover={!gradient}
      className={cx(
        "relative overflow-hidden p-5 transition-all duration-300",
        gradient
          ? "border-0 bg-gradient-to-br from-green-600 to-green-700 text-white shadow-lg"
          : "",
        className,
      )}
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="min-w-0 flex-1">
          {/* Título */}
          <p
            className={cx(
              "mb-1 text-sm font-medium",
              gradient ? "text-green-100" : "text-gray-600 dark:text-gray-400",
            )}
          >
            {title}
          </p>

          {/* Valor principal */}
          <p
            className={cx(
              "mb-1 text-2xl font-bold md:text-3xl",
              gradient ? "text-white" : "text-gray-900 dark:text-white",
            )}
          >
            {value}
          </p>

          {/* Subtítulo */}
          {subtitle && (
            <p
              className={cx(
                "text-xs",
                gradient ? "text-green-100/90" : "text-gray-500 dark:text-gray-400",
              )}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Ícone */}
        <div
          className={cx(
            "ml-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl shadow-lg",
            gradient
              ? "bg-white/20 backdrop-blur-sm"
              : `bg-gradient-to-br ${iconColorMap[iconColor]}`,
          )}
        >
          <span className="text-white">{icon}</span>
        </div>
      </div>

      {/* Trend */}
      {trend && (
        <div className="mb-2 flex items-center gap-2">
          <span
            className={cx(
              "text-sm font-semibold",
              trend.isPositive ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400",
              gradient && "text-white",
            )}
          >
            {trend.isPositive ? "↑" : "↓"} {trend.value}
          </span>
          <span
            className={cx(
              "text-xs",
              gradient ? "text-green-100" : "text-gray-500 dark:text-gray-400",
            )}
          >
            vs período anterior
          </span>
        </div>
      )}

      {/* Action button */}
      {action && (
        <button
          onClick={action.onClick}
          className={cx(
            "mt-3 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-300",
            gradient
              ? "bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
              : "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md hover:from-green-700 hover:to-green-800 hover:shadow-lg",
          )}
        >
          {action.label}
        </button>
      )}
    </Card>
  );
}
