import { Header } from "@/components/layout/header";
import { liveMonitoringCalls, agentStatus, queueStatus } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, PhoneForwarded, Download, ArrowUp, ArrowDown, Activity, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const sentimentIcons = {
  positive: <ArrowUp className="w-4 h-4 text-emerald-500" />,
  neutral: <Activity className="w-4 h-4 text-gray-500" />,
  negative: <ArrowDown className="w-4 h-4 text-red-500" />,
};

function CallCard({ call }: { call: typeof liveMonitoringCalls[0] }) {
  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
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
            <span className="font-semibold">{call.agent?.name}</span>
        </div>
        <Badge variant={call.status === 'active' ? 'destructive' : 'secondary'}>{call.duration}</Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="font-medium text-lg">{call.customer.name}</p>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            {sentimentIcons[call.sentiment]}
            <span className="capitalize">{call.sentiment}</span>
          </div>
          <div className="flex gap-1">
             {call.topics.map(topic => <Badge key={topic} variant="outline">{topic}</Badge>)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function LiveMonitoringPage() {
    const totalAgents = agentStatus.available.count + agentStatus.busy.count + agentStatus.away.count;
    
  return (
    <>
      <Header title="Live Operations" actions={
        <div className="flex gap-2">
            <Button variant="outline"><PhoneForwarded className="mr-2"/>View Queue</Button>
            <Button><Download className="mr-2"/>Export Data</Button>
        </div>
      } />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Active Calls Monitor</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {liveMonitoringCalls.map(call => <CallCard key={call.id} call={call} />)}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Agent Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                        <span>Available</span>
                        <span>{agentStatus.available.count} / {totalAgents}</span>
                    </div>
                    <Progress value={(agentStatus.available.count/totalAgents)*100} className="h-2 [&>div]:bg-emerald-500" />
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                        <span>Busy</span>
                        <span>{agentStatus.busy.count} / {totalAgents}</span>
                    </div>
                    <Progress value={(agentStatus.busy.count/totalAgents)*100} className="h-2 [&>div]:bg-amber-500"/>
                </div>
                 <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                        <span>Away / Offline</span>
                        <span>{agentStatus.away.count} / {totalAgents}</span>
                    </div>
                    <Progress value={(agentStatus.away.count/totalAgents)*100} className="h-2 [&>div]:bg-gray-400"/>
                </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Queue Status</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4">
              {Object.values(queueStatus).map(item => (
                <div key={item.title} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{item.title}</span>
                  <span className="font-bold text-lg">{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Urgent Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 p-3 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <div>
                  <p className="font-semibold text-red-800">High Queue Alert</p>
                  <p className="text-sm text-red-700">12 calls waiting over 5 min.</p>
                </div>
              </div>
               <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 p-3 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
                <div>
                  <p className="font-semibold text-amber-800">Break Schedules</p>
                  <p className="text-sm text-amber-700">3 agents due for break.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}
