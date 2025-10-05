'use client';

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { KPIMetric } from "@/lib/types";
import { Bot, CheckCircle, Star, Zap, DollarSign, Users, Phone, PieChart, Clock, Shield, TrendingUp, UserCheck } from "lucide-react";
import type { LucideIcon } from 'lucide-react';

const iconMap: { [key: string]: LucideIcon } = {
  Bot,
  CheckCircle,
  Star,
  Zap,
  DollarSign,
  Users,
  Phone,
  PieChart,
  Clock,
  Shield,
  TrendingUp,
  UserCheck
};


interface KPICardProps extends React.HTMLAttributes<HTMLDivElement> {
  metric: Omit<KPIMetric, 'icon'> & { icon: string };
}

export function KPICard({ metric, className, ...props }: KPICardProps) {
  const Icon = iconMap[metric.icon as keyof typeof iconMap];

  const changeColor =
    metric.changeType === 'increase'
      ? 'text-emerald-500'
      : metric.changeType === 'decrease'
      ? 'text-red-500'
      : 'text-muted-foreground';

  return (
    <Card className={cn("p-4 flex flex-col", className)} {...props}>
        <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">{metric.title}</h3>
            {Icon && <Icon className="w-5 h-5 text-muted-foreground" />}
        </div>
        <div className="mt-2">
            <p className="text-3xl font-bold">{metric.value}</p>
            <p className={cn("text-xs", changeColor)}>{metric.change}</p>
        </div>
    </Card>
  );
}