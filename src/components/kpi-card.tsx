import type { KPIMetric } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KPICardProps {
  metric: KPIMetric;
  className?: string;
}

export function KPICard({ metric, className }: KPICardProps) {
  const changeColor =
    metric.changeType === "increase"
      ? "text-emerald-500"
      : metric.changeType === "decrease"
      ? "text-red-500"
      : "text-muted-foreground";

  return (
    <Card className={cn("shadow-sm hover:shadow-lg transition-shadow duration-300", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
        <metric.icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{metric.value}</div>
        <p className={cn("text-xs", changeColor)}>
          {metric.change} from last month
        </p>
      </CardContent>
    </Card>
  );
}
