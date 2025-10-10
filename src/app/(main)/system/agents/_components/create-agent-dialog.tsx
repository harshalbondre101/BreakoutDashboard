
'use client';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/lib/config';
import type { Agent } from './agents-tab';

interface CreateAgentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    agent?: Agent | null;
    onSuccess?: () => void;
}

export function CreateAgentDialog({ open, onOpenChange, agent, onSuccess }: CreateAgentDialogProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<'ai' | 'human'>('ai');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (agent) {
            setName(agent.name);
            setDescription(agent.description || '');
            setType(agent.type);
        } else {
            setName('');
            setDescription('');
            setType('ai');
        }
    }, [agent, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const agentData = { name, description, type };
        const url = agent 
            ? `${API_BASE_URL}/agents/${agent.id}`
            : `${API_BASE_URL}/agents`;
        const method = agent ? 'PATCH' : 'POST';

        // TODO: Replace with a secure way to get the API key, e.g., from a context or a hook
        const apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
        if (!apiKey) {
             toast({
                variant: 'destructive',
                title: 'API Key Missing',
                description: 'The ElevenLabs API key is not configured.',
            });
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': apiKey,
                },
                body: JSON.stringify(agentData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `Failed to ${agent ? 'update' : 'create'} agent.`);
            }
            
            toast({
                title: 'Success!',
                description: `Voice Agent ${name} has been ${agent ? 'updated' : 'created'}.`,
            });

            onSuccess?.();
            onOpenChange(false);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Uh oh! Something went wrong.',
                description: (error as Error).message,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{agent ? 'Edit Voice Agent' : 'Create Voice Agent'}</DialogTitle>
                        <DialogDescription>
                            {agent ? 'Update the details for your voice agent.' : 'Fill in the details to create a new voice agent.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">Description</Label>
                            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">Type</Label>
                            <Select value={type} onValueChange={(value: 'ai' | 'human') => setType(value)}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select a type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ai">AI Voice Agent</SelectItem>
                                    <SelectItem value="human">Human Agent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Agent'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
