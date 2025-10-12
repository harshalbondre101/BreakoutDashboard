
'use client';
import {
  LayoutDashboard,
  BarChart3,
  Radio,
  Users,
  Phone,
  CalendarCheck,
  Bot,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navigation = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/analysis', label: 'Analysis', icon: BarChart3 },
    { href: '/live-monitoring', label: 'Live Monitoring', icon: Radio },
    { href: '/customers', label: 'Customers Hub', icon: Users },
    { href: '/calls', label: 'Calls', icon: Phone },
    { href: '/bookings', label: 'Bookings', icon: CalendarCheck },
    { href: '/system/agents', label: 'Agents', icon: Bot },
  ];
  
  // This layout is simplified for an employee view.
  // The full admin layout with sections can be restored later.

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside
        className={'w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10'}
      >
        <div className="p-6 border-b border-gray-200">
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI Command</h1>
            <p className="text-xs text-gray-500">Employee View</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
            {navigation.map((item) => {
                const Icon = item.icon;
                return (
                <Link
                    key={item.label}
                    href={item.href}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    pathname.startsWith(item.href)
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">{item.label}</span>
                </Link>
                );
            })}
            </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Alex</p>
              <p className="text-xs text-gray-500">alex@example.com</p>
            </div>
          </div>
        </div>
      </aside>

      <main className={'flex-1 ml-64'}>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
