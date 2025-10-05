import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KPICardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function KPICard({ children, className, ...props }: KPICardProps) {
  return (
    <Card className={cn("p-4 flex flex-col", className)} {...props}>
      {children}
    </Card>
  );
}
