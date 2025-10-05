import { Header } from "@/components/layout/header";
import { KPICard } from "@/components/kpi-card";
import { callsPageMetrics, callList } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bot, ArrowUp, ArrowDown, Activity, Search } from 'lucide-react';

const sentimentIcons = {
  positive: <ArrowUp className="w-4 h-4 text-emerald-500" />,
  neutral: <Activity className="w-4 h-4 text-gray-500" />,
  negative: <ArrowDown className="w-4 h-4 text-red-500" />,
};

export default function CallsPage() {
  return (
    <>
      <Header title="Call Management" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {callsPageMetrics.map((metric) => (
            <KPICard key={metric.id} metric={metric} />
          ))}
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle>Call History</CardTitle>
              <CardDescription>Browse and analyze past call records.</CardDescription>
              <div className="flex flex-col md:flex-row gap-2 pt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search by customer, agent, or topic..." className="pl-8" />
                </div>
                <div className="flex gap-2">
                    <Select defaultValue="all">
                        <SelectTrigger className="w-full md:w-[150px]">
                            <SelectValue placeholder="Sentiment" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Sentiments</SelectItem>
                            <SelectItem value="positive">Positive</SelectItem>
                            <SelectItem value="neutral">Neutral</SelectItem>
                            <SelectItem value="negative">Negative</SelectItem>
                        </SelectContent>
                    </Select>
                     <Select defaultValue="all">
                        <SelectTrigger className="w-full md:w-[150px]">
                            <SelectValue placeholder="Outcome" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Outcomes</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="transferred">Transferred</SelectItem>
                            <SelectItem value="follow-up">Follow-up</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead className="hidden md:table-cell">Duration</TableHead>
                    <TableHead>Sentiment</TableHead>
                    <TableHead className="hidden lg:table-cell">Topics</TableHead>
                    <TableHead>Outcome</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {callList.map((call) => (
                    <TableRow key={call.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={call.customer.avatar} alt={call.customer.name} />
                            <AvatarFallback>{call.customer.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{call.customer.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {call.agent?.avatar === 'bot' ? (
                            <Avatar className="w-8 h-8 border-2 border-primary">
                               <AvatarFallback><Bot className="text-primary"/></AvatarFallback>
                            </Avatar>
                          ) : (
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={call.agent?.avatar} alt={call.agent?.name} />
                              <AvatarFallback>{call.agent?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                          )}
                          <span className="font-medium">{call.agent?.name}</span>
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
                        <div className="flex flex-wrap gap-1">
                            {call.topics.map(topic => <Badge key={topic} variant="secondary">{topic}</Badge>)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={call.outcome === 'Resolved' ? 'default' : 'outline'} className={call.outcome === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : ''}>
                          {call.outcome}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}
