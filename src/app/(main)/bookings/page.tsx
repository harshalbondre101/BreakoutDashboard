import { Header } from "@/components/layout/header";
import { KPICard } from "@/components/kpi-card";
import { bookingMetrics, recentBookings, paymentAnalytics, keyBookingMetrics } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, CreditCard, Percent } from "lucide-react";

export default function BookingsPage() {
  return (
    <>
      <Header title="Booking Management" actions={<Button><PlusCircle className="mr-2"/>Create Booking</Button>} />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {bookingMetrics.map((metric) => (
            <KPICard key={metric.id} metric={metric} />
          ))}
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>An overview of the latest bookings in the system.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden md:table-cell">Event</TableHead>
                    <TableHead className="hidden lg:table-cell">Date</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div className="font-medium">{booking.customer.name}</div>
                        <div className="text-sm text-muted-foreground hidden sm:block">{booking.customer.email}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{booking.event}</TableCell>
                      <TableCell className="hidden lg:table-cell">{booking.date}</TableCell>
                      <TableCell>${booking.value.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant={booking.payment === 'paid' ? 'default' : (booking.payment === 'pending' ? 'secondary' : 'destructive')}
                          className={booking.payment === 'paid' ? 'bg-emerald-100 text-emerald-800' : ''}
                        >
                          {booking.payment}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={booking.status === 'confirmed' ? 'default' : (booking.status === 'pending' ? 'secondary' : 'destructive')}
                          className={booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : ''}
                        >
                          {booking.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
        
        <section className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Payment Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{paymentAnalytics.successRate.title}</span>
                <span className="font-semibold">{paymentAnalytics.successRate.value}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{paymentAnalytics.avgProcessingTime.title}</span>
                <span className="font-semibold">{paymentAnalytics.avgProcessingTime.value}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Payment Methods</span>
                <div className="flex items-center gap-2">
                    <CreditCard className="w-6 h-6 p-1 rounded-md bg-muted"/>
                    <Percent className="w-6 h-6 p-1 rounded-md bg-muted"/>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Key Metrics</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.values(keyBookingMetrics).map(metric => (
                <div key={metric.title} className="p-4 rounded-lg bg-background text-center shadow-sm border">
                  <p className="text-sm text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}
