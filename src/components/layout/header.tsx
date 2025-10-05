import type { ReactNode } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface HeaderProps {
  title: string;
  actions?: ReactNode;
}

export function Header({ title, actions }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
       <SidebarTrigger className="md:hidden" />
      <h1 className="flex-1 text-2xl font-semibold tracking-tighter font-headline">{title}</h1>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}
