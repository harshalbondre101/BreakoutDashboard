import { Header } from "@/components/layout/header";
import { customerData, leadData, eventData } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search, Filter } from "lucide-react";

export default function CustomersHubPage() {
  return (
    <>
      <Header title="Enterprise Data Hub" actions={<Button variant="outline"><Download className="mr-2"/>Export Data</Button>} />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <Tabs defaultValue="customers">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <TabsList>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="leads">Leads</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search..." className="pl-8 w-full md:w-[200px] lg:w-[300px]" />
                </div>
              <Button variant="outline"><Filter className="mr-2"/>Filter</Button>
            </div>
          </div>
          
          <TabsContent value="customers" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Customers</CardTitle>
                <CardDescription>Manage your existing customer base.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Total Value</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Registered</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerData.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>${customer.totalValue.toLocaleString()}</TableCell>
                        <TableCell>
                           <Badge variant={customer.status === 'active' ? 'default' : 'destructive'} className={customer.status === 'active' ? 'bg-emerald-100 text-emerald-800' : ''}>{customer.status}</Badge>
                        </TableCell>
                        <TableCell>{customer.registeredDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leads" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Leads</CardTitle>
                <CardDescription>Track and manage potential customers.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Expected Value</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leadData.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">{lead.name}</TableCell>
                        <TableCell>{lead.source}</TableCell>
                        <TableCell>{lead.score}</TableCell>
                        <TableCell>${lead.expectedValue.toLocaleString()}</TableCell>
                        <TableCell><Badge variant="secondary">{lead.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Events</CardTitle>
                <CardDescription>Manage all planned and completed events.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {eventData.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.name}</TableCell>
                        <TableCell>{event.type}</TableCell>
                        <TableCell>{event.date}</TableCell>
                        <TableCell>${event.revenue.toLocaleString()}</TableCell>
                        <TableCell>
                            <Badge variant={event.status === 'completed' ? 'default' : (event.status === 'planned' ? 'secondary' : 'destructive')} className={event.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : ''}>
                                {event.status}
                            </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
