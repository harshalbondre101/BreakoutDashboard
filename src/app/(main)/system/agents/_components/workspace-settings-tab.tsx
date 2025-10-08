
'use client';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { KeyRound, Trash2, Eye, EyeOff, PlusCircle, Check } from 'lucide-react';
import { API_BASE_URL } from '@/lib/config';

interface Secret {
    id: string;
    key: string;
    value: string;
    createdAt: string;
}

export function WorkspaceSettingsTab() {
    const [secrets, setSecrets] = useState<Secret[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const [shownSecrets, setShownSecrets] = useState<Record<string, boolean>>({});

    const fetchSettings = async () => {
        setLoading(true);
        // Mocking secrets fetch
        const staticSecrets: Secret[] = [
            { id: 'sec-1', key: 'OPENAI_API_KEY', value: 'sk-********************************', createdAt: new Date().toISOString() },
            { id: 'sec-2', key: 'TWILIO_AUTH_TOKEN', value: '**********************************', createdAt: new Date(Date.now() - 86400000).toISOString() },
        ];
        setSecrets(staticSecrets);
        setLoading(false);
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleAddSecret = () => {
        setSecrets(prev => [...prev, { id: `sec-${Date.now()}`, key: '', value: '', createdAt: new Date().toISOString() }]);
    };

    const handleSecretChange = (id: string, field: 'key' | 'value', value: string) => {
        setSecrets(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const handleSaveSecret = (id: string) => {
        toast({ title: "Secret saved", description: "Your secret has been securely stored." });
    };

    const handleDeleteSecret = (id: string) => {
        setSecrets(prev => prev.filter(s => s.id !== id));
        toast({ title: "Secret deleted", description: "The secret has been removed." });
    };
    
    const toggleShowSecret = (id: string) => {
        setShownSecrets(prev => ({...prev, [id]: !prev[id]}));
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>General Settings</CardTitle>
                        <CardDescription>Global configurations for your workspace.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="workspace-name">Workspace Name</Label>
                            <Input id="workspace-name" defaultValue="My AI Command Center" />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                                <Label>Automatic RAG Indexing</Label>
                                <p className="text-xs text-muted-foreground">
                                    Automatically re-index knowledge base on new document uploads.
                                </p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <Button>Save Settings</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Secrets Management</CardTitle>
                        <CardDescription>Securely store API keys and other credentials.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                             {loading ? <p>Loading secrets...</p> : secrets.map(secret => (
                                <div key={secret.id} className="p-3 border rounded-lg space-y-2">
                                     <div className="flex items-center gap-2">
                                        <KeyRound className="w-4 h-4 text-muted-foreground" />
                                        <Input 
                                            placeholder="Secret Key (e.g., OPENAI_API_KEY)" 
                                            value={secret.key}
                                            onChange={(e) => handleSecretChange(secret.id, 'key', e.target.value)}
                                            className="font-mono text-xs"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Input 
                                            type={shownSecrets[secret.id] ? 'text' : 'password'}
                                            placeholder="Secret Value" 
                                            value={secret.value}
                                            onChange={(e) => handleSecretChange(secret.id, 'value', e.target.value)}
                                            className="font-mono text-xs"
                                        />
                                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => toggleShowSecret(secret.id)}>
                                            {shownSecrets[secret.id] ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                                        </Button>
                                    </div>
                                     <div className="flex justify-between items-center pt-2">
                                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteSecret(secret.id)}>
                                            <Trash2 className="w-4 h-4 mr-1"/> Delete
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => handleSaveSecret(secret.id)}>
                                            <Check className="w-4 h-4 mr-1"/> Save
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" className="w-full" onClick={handleAddSecret}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Secret
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
