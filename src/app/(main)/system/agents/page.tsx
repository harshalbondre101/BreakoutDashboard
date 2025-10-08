
'use client';
import { useState } from 'react';
import { Bot, Book, Phone, Settings, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AgentsTab } from './_components/agents-tab';
import { KnowledgeBaseTab } from './_components/knowledge-base-tab';
import { CreateAgentDialog } from './_components/create-agent-dialog';

export default function AgentsPage() {
    const [isCreateAgentOpen, setCreateAgentOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('agents');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Agent & Knowledge Hub</h1>
                    <p className="text-gray-500 mt-1">Manage agents, knowledge bases, and system configurations.</p>
                </div>
                {activeTab === 'agents' && (
                    <Button onClick={() => setCreateAgentOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Agent
                    </Button>
                )}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="agents">
                        <Bot className="mr-2 h-4 w-4" />
                        Agents
                    </TabsTrigger>
                    <TabsTrigger value="knowledge-base">
                        <Book className="mr-2 h-4 w-4" />
                        Knowledge Base
                    </TabsTrigger>
                    <TabsTrigger value="phone-numbers" disabled>
                        <Phone className="mr-2 h-4 w-4" />
                        Phone Numbers
                    </TabsTrigger>
                    <TabsTrigger value="settings" disabled>
                        <Settings className="mr-2 h-4 w-4" />
                        Workspace Settings
                    </TabsTrigger>
                </TabsList>
                
                <TabsContent value="agents">
                    <AgentsTab />
                </TabsContent>
                <TabsContent value="knowledge-base">
                    <KnowledgeBaseTab />
                </TabsContent>
                 <TabsContent value="phone-numbers">
                    <div className="p-10 text-center text-gray-500">Phone number management coming soon.</div>
                </TabsContent>
                 <TabsContent value="settings">
                     <div className="p-10 text-center text-gray-500">Workspace settings coming soon.</div>
                </TabsContent>
            </Tabs>
            
            <CreateAgentDialog open={isCreateAgentOpen} onOpenChange={setCreateAgentOpen} />
        </div>
    );
}
