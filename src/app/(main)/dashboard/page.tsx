import { Header } from "@/components/layout/header";
import { KPICard } from "@/components/kpi-card";
import { kpiMetrics, activeCalls, callVolumeData, sentimentDistributionData, recentBookings, systemAlerts } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer as PieResponsiveContainer } from 'recharts';
import { AlertTriangle, CheckCircle, Info, Bell, Activity, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const sentimentIcons = {
  positive: <ArrowUp className="w-4 h-4 text-emerald-500" />,
  neutral: <Activity className="w-4 h-4 text-gray-500" />,
  negative: <ArrowDown className="w-4 h-4 text-red-500" />,
};

const alertIcons = {
  critical: <AlertTriangle className="w-5 h-5 text-red-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
};

export default function DashboardPage() {
  return (
    <>
      <Header title="Command Center" actions={<Button variant="outline" size="sm"><Bell className="mr-2" />System Status: Healthy</Button>} />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpiMetrics.map((metric) => (
            <KPICard key={metric.id} metric={metric} />
          ))}
        </section>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Active Calls</CardTitle>
              <CardDescription>Real-time view of ongoing customer interactions.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden md:table-cell">Duration</TableHead>
                    <TableHead>Sentiment</TableHead>
                    <TableHead className="hidden lg:table-cell">Topics</TableHead>
                    <TableHead>Outcome</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeCalls.map((call) => (
                    <TableRow key={call.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={call.customer.avatar} alt={call.customer.name} />
                            <AvatarFallback>{call.customer.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{call.customer.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{call.duration}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {sentimentIcons[call.sentiment]}
                          <span className="capitalize">{call.sentiment}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex gap-1">
                          {call.topics.map(topic => <Badge key={topic} variant="secondary">{topic}</Badge>)}
                        </div>
                      </TableCell>
                       <TableCell>
                        <Badge variant={call.outcome === 'Resolved' ? 'default' : 'outline'} className={call.outcome === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : ''}>{call.outcome}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Call Volume (24h)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={callVolumeData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: 'hsl(var(--accent) / 0.2)'}} contentStyle={{backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}}/>
                    <Bar dataKey="calls" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                 <PieResponsiveContainer width="100%" height={150}>
                    <PieChart>
                        <Pie data={sentimentDistributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                            {sentimentDistributionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}}/>
                        <Legend iconSize={10} wrapperStyle={{fontSize: '12px'}}/>
                    </PieChart>
                </PieResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead>Value</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentBookings.map(booking => (
                                <TableRow key={booking.id}>
                                    <TableCell>
                                        <div className="font-medium">{booking.customer.name}</div>
                                        <div className="text-sm text-muted-foreground">{booking.event}</div>
                                    </TableCell>
                                    <TableCell>${booking.value.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'} className={booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : ''}>
                                            {booking.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>System Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {systemAlerts.map(alert => (
                            <div key={alert.id} className="flex items-start gap-4">
                                {alertIcons[alert.severity]}
                                <div>
                                    <p className="font-medium">{alert.message}</p>
                                    <p className="text-sm text-muted-foreground">{alert.timestamp}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </section>
      </main>
    </>
  );
}
