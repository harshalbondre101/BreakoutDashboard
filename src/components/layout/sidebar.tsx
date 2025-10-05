'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  CalendarCheck,
  Phone,
  Users,
  Signal,
  BarChart2,
  Settings,
  LogOut,
  Bot
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/bookings', icon: CalendarCheck, label: 'Bookings' },
  { href: '/calls', icon: Phone, label: 'Calls' },
  { href: '/customers', icon: Users, label: 'Customers Hub' },
  { href: '/live-monitoring', icon: Signal, label: 'Live Monitoring' },
  { href: '/analysis', icon: BarChart2, label: 'Analysis' },
  { href: '/system', icon: Settings, label: 'System' },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="border-r border-sidebar-border"
    >
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-full bg-primary/10 hover:bg-primary/20">
                <Bot className="text-primary" />
            </Button>
            <h2 className="text-lg font-semibold tracking-tighter font-headline text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                Enterprise
            </h2>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href || pathname.startsWith(`${item.href}/`)}
                  tooltip={item.label}
                  className="justify-start"
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Separator className="my-2 bg-sidebar-border" />
         <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
            <Avatar className="size-9">
                <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" />
                <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="flex-1 group-data-[collapsible=icon]:hidden">
                <p className="text-sm font-semibold text-sidebar-foreground">Admin User</p>
                <p className="text-xs text-sidebar-foreground/70">admin@enterprise.com</p>
            </div>
            <Button variant="ghost" size="icon" className="group-data-[collapsible=icon]:hidden">
                <LogOut />
            </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
