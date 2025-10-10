
'use client';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { KeyRound, Trash2, Eye, EyeOff, PlusCircle, Check, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '@/lib/config';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Settings {
    conversation_initiation_client_data_webhook: {
        url: string;
        request_headers: Record<string, string>;
    };
    webhooks: {
        post_call_webhook_id: string;
        send_audio: boolean;
    };
    can_use_mcp_servers: boolean;
    rag_retention_period_days: number;
    default_livekit_stack: 'standard' | 'static';
}

export function WorkspaceSettingsTab() {
    const [settings, setSettings] = useState<Partial<Settings>>({});
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();
    const apiKey = 'ec4e64c2b17bf057a451949c080adb9274676fd0eb166aa17b346de61bde70e3';

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/settings`, {
                headers: { 'xi-api-key': apiKey },
            });
            if (!response.ok) {
                const err = await response.json().catch(() => ({ detail: 'Failed to fetch settings' }));
                throw new Error(err.detail);
            }
            const data: Settings = await response.json();
            setSettings({
                ...data,
                conversation_initiation_client_data_webhook: {
                    ...data.conversation_initiation_client_data_webhook,
                    request_headers: data.conversation_initiation_client_data_webhook.request_headers || {},
                },
                webhooks: data.webhooks || { post_call_webhook_id: '', send_audio: false },
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: "Error loading settings",
                description: (error as Error).message,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);
    
    const handleSettingsChange = (path: string, value: any) => {
        setSettings(prev => {
            const newSettings = { ...prev };
            const keys = path.split('.');
            let current: any = newSettings;
            keys.forEach((key, index) => {
                if (index === keys.length - 1) {
                    current[key] = value;
                } else {
                    current[key] = current[key] || {};
                    current = current[key];
                }
            });
            return newSettings;
        });
    };

    const handleSaveSettings = async () => {
        setIsSaving(true);
        try {
            const response = await fetch(`${API_BASE_URL}/settings`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': apiKey,
                },
                body: JSON.stringify(settings),
            });
            if (!response.ok) {
                const err = await response.json().catch(() => ({ detail: 'Failed to save settings' }));
                throw new Error(err.detail);
            }
            toast({
                title: "Settings Saved",
                description: "Your workspace settings have been updated.",
            });
            fetchSettings(); // Re-fetch to confirm changes
        } catch (error) {
             toast({
                variant: 'destructive',
                title: "Error saving settings",
                description: (error as Error).message,
            });
        } finally {
            setIsSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6 flex justify-center items-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Webhook Settings</CardTitle>
                    <CardDescription>Configure webhooks for conversation events.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2 p-4 border rounded-lg">
                        <Label>Conversation Initiation Webhook</Label>
                        <div className="space-y-2">
                             <Label htmlFor="webhook-url" className="text-xs text-muted-foreground">URL</Label>
                             <Input 
                                id="webhook-url" 
                                value={settings.conversation_initiation_client_data_webhook?.url || ''}
                                onChange={(e) => handleSettingsChange('conversation_initiation_client_data_webhook.url', e.target.value)}
                                placeholder="https://your-service.com/webhook"
                            />
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="webhook-headers" className="text-xs text-muted-foreground">Request Headers (JSON)</Label>
                             <Textarea
                                id="webhook-headers"
                                value={JSON.stringify(settings.conversation_initiation_client_data_webhook?.request_headers || {}, null, 2)}
                                onChange={(e) => {
                                    try {
                                        const parsed = JSON.parse(e.target.value);
                                        handleSettingsChange('conversation_initiation_client_data_webhook.request_headers', parsed)
                                    } catch (err) {
                                        // Handle invalid JSON gracefully if needed
                                    }
                                }}
                                placeholder={`{\n  "Authorization": "Bearer your-token"\n}`}
                                className="font-mono text-xs"
                                rows={4}
                            />
                        </div>
                    </div>
                     <div className="space-y-2 p-4 border rounded-lg">
                        <Label>Post Call Webhook</Label>
                         <div className="space-y-2">
                            <Label htmlFor="post-call-webhook-id" className="text-xs text-muted-foreground">Webhook ID</Label>
                            <Input
                                id="post-call-webhook-id"
                                value={settings.webhooks?.post_call_webhook_id || ''}
                                onChange={(e) => handleSettingsChange('webhooks.post_call_webhook_id', e.target.value)}
                                placeholder="wh_..."
                            />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <Label htmlFor="send-audio">Send Audio in Webhook</Label>
                            <Switch 
                                id="send-audio" 
                                checked={settings.webhooks?.send_audio || false}
                                onCheckedChange={(checked) => handleSettingsChange('webhooks.send_audio', checked)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Data & Privacy</CardTitle>
                        <CardDescription>Manage data retention and privacy settings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="rag-retention">RAG Retention Period (days)</Label>
                            <Input 
                                id="rag-retention" 
                                type="number" 
                                value={settings.rag_retention_period_days || 0}
                                onChange={(e) => handleSettingsChange('rag_retention_period_days', parseInt(e.target.value, 10))}
                            />
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Advanced</CardTitle>
                        <CardDescription>Advanced technical configurations.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <Label>Enable MCP Servers</Label>
                            <Switch
                                checked={settings.can_use_mcp_servers || false}
                                onCheckedChange={(checked) => handleSettingsChange('can_use_mcp_servers', checked)}
                            />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="livekit-stack">Default LiveKit Stack</Label>
                             <Select 
                                value={settings.default_livekit_stack || 'standard'}
                                onValueChange={(value: 'standard' | 'static') => handleSettingsChange('default_livekit_stack', value)}
                            >
                                <SelectTrigger id="livekit-stack">
                                    <SelectValue placeholder="Select stack" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="standard">Standard</SelectItem>
                                    <SelectItem value="static">Static</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            <div className="flex justify-end">
                <Button onClick={handleSaveSettings} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save All Settings
                </Button>
            </div>
        </div>
    );
}
