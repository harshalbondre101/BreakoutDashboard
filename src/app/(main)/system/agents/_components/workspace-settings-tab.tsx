
'use client';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { KeyRound, Trash2, Eye, EyeOff, PlusCircle } from 'lucide-react';

interface Secret {
    id: string;
    key: string;
    value: string;
}

export function WorkspaceSettingsTab() {
    const [workspaceName, setWorkspaceName] = useState('My AI Workspace');
    const [autoIndex, setAutoIndex] = useState(true);
    const [secrets, setSecrets] = useState<Secret[]>([
        { id: 'sec-1', key: 'ELEVENLABS_API_KEY', value: 'sk_xxxxxxxxxxxxxxxxxxxx' },
        { id: 'sec-2', key: 'OPENAI_API_KEY', value: 'sk_xxxxxxxxxxxxxxxxxxxx' },
    ]);
    const [revealedSecrets, setRevealedSecrets] = useState<Record<string, boolean>>({});
    const { toast } = useToast();

    const handleSaveChanges = () => {
        toast({
            title: "Settings Saved",
            description: "Your workspace settings have been updated.",
        });
    };

    const toggleReveal = (id: string) => {
        setRevealedSecrets(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="workspace-name">Workspace Name</Label>
                        <Input id="workspace-name" value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                            <Label htmlFor="auto-index-rag" className="font-medium">
                                Auto-index RAG
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                Automatically compute RAG index after document creation.
                            </p>
                        </div>
                        <Switch id="auto-index-rag" checked={autoIndex} onCheckedChange={setAutoIndex} />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSaveChanges}>Save Changes</Button>
            </div>
        </div>
    );
}
