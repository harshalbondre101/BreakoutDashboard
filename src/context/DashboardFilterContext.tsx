'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

type DateRange = 'today' | 'last_week' | 'last_month';

interface DashboardFilterContextValue {
  dateRange: DateRange;
  setDateRange: (dateRange: DateRange) => void;
}

const DashboardFilterContext = createContext<DashboardFilterContextValue | undefined>(undefined);

export function DashboardFilterProvider({ children }: { children: ReactNode }) {
  const [dateRange, setDateRange] = useState<DateRange>('last_week');

  return (
    <DashboardFilterContext.Provider value={{ dateRange, setDateRange }}>
      {children}
    </DashboardFilterContext.Provider>
  );
}

export function useDashboardFilter() {
  const context = useContext(DashboardFilterContext);
  if (context === undefined) {
    throw new Error('useDashboardFilter must be used within a DashboardFilterProvider');
  }
  return context;
}
