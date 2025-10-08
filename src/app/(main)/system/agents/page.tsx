
'use client';
import { useState, useEffect } from 'react';
import { Bot, User, MoreVertical, PlusCircle, Search, Trash2, Edit, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { API_BASE_URL } from '@/lib/config';

// A more detailed agent type based on the described API capabilities
export interface Agent {
    id: string;
    name: string;
    type: 'ai' | 'human'; // Assuming type is distinguishable
    status: 'available' | 'busy' | 'offline'; // Example statuses
    // Add other potential fields from a GET /agents/{id} response
    description?: string;
    createdAt?: string;
}

export default function AgentsPage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchAgents = async () => {
            setLoading(true);
            setError(null);
            try {
                // The user only provided /agents/{id}, so we'll simulate a list from /agents
                // For now, using a slightly modified version of the old static data
                // TODO: Replace with actual `GET /agents` call when available
                 const staticAgents: Agent[] = [
                    ...Array.from({ length: 8 }, (_, i) => ({
                        id: `ai-agent-${i + 1}`,
                        name: `AI Agent ${i + 1}`,
                        type: 'ai' as const,
                        description: 'Handles customer inquiries via chat and voice.',
                        status: ['available', 'busy', 'offline'][i % 3] as any,
                        createdAt: new Date(Date.now() - (i * 86400000 * 2)).toISOString()
                    })),
                    ...Array.from({ length: 4 }, (_, i) => ({
                        id: `human-agent-${i + 1}`,
                        name: ['John Doe', 'Jane Smith', 'Peter Jones', 'Mary Williams'][i],
                        type: 'human' as const,
                        description: 'Senior support specialist for escalations.',
                        status: ['available', 'busy', 'offline'][i % 3] as any,
                        createdAt: new Date(Date.now() - (i * 86400000 * 5)).toISOString()
                    }))
                ];
                setAgents(staticAgents);
            } catch (err) {
                setError('Failed to fetch agents. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAgents();
    }, []);

    const filteredAgents = agents.filter(agent =>
        agent.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderAgentList = () => {
        if (loading) {
            return (
                <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="p-4 bg-gray-50 rounded-lg h-20 animate-pulse" />
                    ))}
                </div>
            );
        }

        if (error) {
            return <div className="text-red-600 bg-red-50 p-4 rounded-lg text-center">{error}</div>;
        }

        if (filteredAgents.length === 0) {
            return <div className="text-gray-500 text-center py-10">No agents found.</div>;
        }

        return (
            <div className="space-y-4">
                {filteredAgents.map(agent => (
                    <div key={agent.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between hover:border-blue-400 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${agent.type === 'ai' ? 'bg-purple-100' : 'bg-blue-100'}`}>
                                {agent.type === 'ai' ? <Bot className="w-6 h-6 text-purple-600" /> : <User className="w-6 h-6 text-blue-600" />}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">{agent.name}</p>
                                <p className="text-sm text-gray-500">{agent.description || 'No description available.'}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Created: {agent.createdAt ? new Date(agent.createdAt).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                agent.status === 'available' ? 'bg-emerald-100 text-emerald-800' :
                                agent.status === 'busy' ? 'bg-amber-100 text-amber-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                                {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                            </span>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                        <Edit className="mr-2 h-4 w-4" />
                                        <span>Edit</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Copy className="mr-2 h-4 w-4" />
                                        <span>Duplicate</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        <span>Delete</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Agent Management</h1>
                    <p className="text-gray-500 mt-1">Create, manage, and test your AI and human agents.</p>
                </div>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Agent
                </Button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
                 <div className="flex gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            placeholder="Search agents..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
                {renderAgentList()}
            </div>
        </div>
    );
}
