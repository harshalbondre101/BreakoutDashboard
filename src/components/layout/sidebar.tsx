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
  SidebarGroup,
  SidebarGroupLabel
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
  Bot,
  MessageSquare,
  Shield,
  Palette,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

const analyticsNav = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/analysis', icon: BarChart2, label: 'Analysis' },
  { href: '/live-monitoring', icon: Signal, label: 'Live Monitoring' },
]

const operationsNav = [
  { href: '/customers', icon: Users, label: 'Customers Hub' },
  { href: '/calls', icon: Phone, label: 'Calls' },
  { href: '/bookings', icon: CalendarCheck, label: 'Bookings' },
]

const systemNav = [
    { href: '/system/whatsapp', icon: MessageSquare, label: 'WhatsApp' },
    { href: '/system/themes', icon: Palette, label: 'Themes' },
    { href: '/system/validation', icon: Shield, label: 'Validation' },
    { href: '/system/agents', icon: Bot, label: 'Agents' },
    { href: '/system', icon: Settings, label: 'Settings' },
]

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground"
    >
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
                <Bot className="text-primary" />
            </div>
            <div className="group-data-[collapsible=icon]:hidden">
                <h2 className="text-lg font-semibold tracking-tighter font-headline text-foreground">
                    AI Command
                </h2>
                <p className="text-xs text-muted-foreground">Sales & Service</p>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto group-data-[collapsible=icon]:hidden">
                <X />
            </Button>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarGroup>
            <SidebarGroupLabel>Analytics</SidebarGroupLabel>
            <SidebarMenu>
            {analyticsNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref>
                    <SidebarMenuButton
                    isActive={pathname === item.href || pathname.startsWith(`${item.href}/`)}
                    tooltip={item.label}
                    className="justify-start data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-semibold"
                    >
                    <item.icon className="size-4" />
                    <span>{item.label}</span>
                    </SidebarMenuButton>
                </Link>
                </SidebarMenuItem>
            ))}
            </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
            <SidebarGroupLabel>Operations</SidebarGroupLabel>
            <SidebarMenu>
            {operationsNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref>
                    <SidebarMenuButton
                    isActive={pathname === item.href || pathname.startsWith(`${item.href}/`)}
                    tooltip={item.label}
                    className="justify-start data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-semibold"
                    >
                    <item.icon className="size-4" />
                    <span>{item.label}</span>
                    </SidebarMenuButton>
                </Link>
                </SidebarMenuItem>
            ))}
            </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
            <SidebarGroupLabel>System</SidebarGroupLabel>
            <SidebarMenu>
            {systemNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref>
                    <SidebarMenuButton
                    isActive={pathname === item.href || (pathname.startsWith('/system') && item.href === '/system')}
                    tooltip={item.label}
                    className="justify-start data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-semibold"
                    >
                    <item.icon className="size-4" />
                    <span>{item.label}</span>
                    </SidebarMenuButton>
                </Link>
                </SidebarMenuItem>
            ))}
            </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Separator className="my-2 bg-sidebar-border" />
         <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
            <Avatar className="size-9">
                <AvatarFallback className="bg-primary/20 text-primary font-semibold">A</AvatarFallback>
            </Avatar>
            <div className="flex-1 group-data-[collapsible=icon]:hidden">
                <p className="text-sm font-semibold text-foreground">Admin User</p>
                <p className="text-xs text-sidebar-foreground/70">admin@example.com</p>
            </div>
            <Button variant="ghost" size="icon" className="group-data-[collapsible=icon]:hidden">
                <LogOut />
            </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
