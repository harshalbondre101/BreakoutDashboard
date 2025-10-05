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
import { Bot, ArrowUp, ArrowDown, Activity, Search, Star, FileText } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";

const sentimentIcons = {
  positive: <ArrowUp className="w-4 h-4 text-emerald-500" />,
  neutral: <Activity className="w-4 h-4 text-gray-500" />,
  negative: <ArrowDown className="w-4 h-4 text-red-500" />,
};

const selectedCall = callList[0];

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

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Call History</CardTitle>
                <CardDescription>Browse and analyze past call records.</CardDescription>
                <div className="flex flex-col md:flex-row gap-2 pt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by customer, agent, or topic..." className="pl-8" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Agent</TableHead>
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
          </div>
          <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Call Details</CardTitle>
                    <CardDescription>Detailed information for the selected call.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Customer</p>
                            <p className="font-medium">{selectedCall.customer.name}</p>
                        </div>
                         <div>
                            <p className="text-sm text-muted-foreground">Agent</p>
                            <p className="font-medium">{selectedCall.agent?.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Duration</p>
                            <p className="font-medium">{selectedCall.duration}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Sentiment</p>
                            <div className="flex items-center gap-1">
                                {sentimentIcons[selectedCall.sentiment]}
                                <span className="capitalize font-medium">{selectedCall.sentiment}</span>
                            </div>
                        </div>
                   </div>
                   <div className="space-y-2">
                       <p className="text-sm text-muted-foreground">Topics</p>
                       <div className="flex flex-wrap gap-2">
                           {selectedCall.topics.map(topic => <Badge key={topic} variant="secondary">{topic}</Badge>)}
                       </div>
                   </div>
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Quality Score</p>
                        <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-500 fill-current" />
                            <span className="font-bold text-lg">9.2/10</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5"/> Transcript</CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea
                        readOnly
                        className="h-48 resize-none bg-muted/50"
                        defaultValue="Customer: Hi, I'd like to book an event. Agent: Sure, I can help with that. What kind of event are you planning? Customer: It's a wedding. Agent: Congratulations! When is the date? Customer: August 15th. We are expecting 150 guests. Agent: Great, let me check availability..."
                    />
                </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </>
  );
}
