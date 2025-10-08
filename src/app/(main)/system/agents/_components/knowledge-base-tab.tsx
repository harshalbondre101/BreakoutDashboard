
'use client';
import { useState, useEffect } from 'react';
import { Search, MoreVertical, Edit, Trash2, FileText, Globe, Type, Upload, PlusCircle, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { API_BASE_URL } from '@/lib/config';
import { useToast } from "@/hooks/use-toast";

interface Document {
    id: string;
    name: string;
    type: 'file' | 'url' | 'text';
    status: 'indexed' | 'processing' | 'failed';
    createdAt: string;
    charCount: number;
}

export function KnowledgeBaseTab() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateOpen, setCreateOpen] = useState(false);
    const { toast } = useToast();

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            // MOCK API call
             const staticDocs: Document[] = [
                {id: 'doc-1', name: 'Product FAQ.pdf', type: 'file', status: 'indexed', createdAt: new Date().toISOString(), charCount: 15234},
                {id: 'doc-2', name: 'Pricing Page', type: 'url', status: 'indexed', createdAt: new Date(Date.now() - 86400000).toISOString(), charCount: 4890},
                {id: 'doc-3', name: 'Return Policy', type: 'text', status: 'processing', createdAt: new Date(Date.now() - 172800000).toISOString(), charCount: 2150},
                {id: 'doc-4', name: 'API Docs', type: 'url', status: 'failed', createdAt: new Date(Date.now() - 259200000).toISOString(), charCount: 0},
            ];
            setDocuments(staticDocs);
        } catch (err) {
            setError('Could not load knowledge base documents.');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchDocuments();
    }, []);

    const filteredDocuments = documents.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleComputeIndex = () => {
        toast({
            title: "Processing RAG Index",
            description: "Your knowledge base documents are being indexed. This may take a few minutes."
        });
        // In a real app, this would trigger an API call.
    }

    const renderDocumentList = () => {
        if (loading) return <div className="text-center p-8">Loading documents...</div>;
        if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
        if (filteredDocuments.length === 0) return <div className="text-center p-8 text-gray-500">No documents found.</div>;

        return (
            <div className="space-y-3">
                {filteredDocuments.map(doc => (
                    <div key={doc.id} className="bg-white p-3 rounded-lg border border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100">
                                {doc.type === 'file' && <FileText className="w-5 h-5 text-gray-600" />}
                                {doc.type === 'url' && <Globe className="w-5 h-5 text-gray-600" />}
                                {doc.type === 'text' && <Type className="w-5 h-5 text-gray-600" />}
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">{doc.name}</p>
                                <p className="text-xs text-gray-500">
                                    {doc.charCount.toLocaleString()} chars &middot; Added on {new Date(doc.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                             <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1.5 ${
                                doc.status === 'indexed' ? 'bg-emerald-100 text-emerald-800' :
                                doc.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                'bg-red-100 text-red-800'
                            }`}>
                                <span className={`w-2 h-2 rounded-full ${
                                    doc.status === 'indexed' ? 'bg-emerald-500' :
                                    doc.status === 'processing' ? 'bg-blue-500 animate-pulse' :
                                    'bg-red-500'
                                }`}/>
                                {doc.status}
                            </span>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-4 h-4" /></Button></DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <div className="flex justify-between items-center mb-6">
                 <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                        placeholder="Search documents..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => setCreateOpen(true)}><PlusCircle className="mr-2 h-4 w-4" /> Add Document</Button>
                    <Button variant="outline" onClick={handleComputeIndex}>Compute RAG Index</Button>
                </div>
            </div>
            {renderDocumentList()}

            <CreateDocumentDialog open={isCreateOpen} onOpenChange={setCreateOpen} onSuccess={fetchDocuments} />
        </div>
    );
}


function CreateDocumentDialog({ open, onOpenChange, onSuccess }: { open: boolean, onOpenChange: (open: boolean) => void, onSuccess: () => void }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    
    const [url, setUrl] = useState('');
    const [text, setText] = useState('');
    const [fileName, setFileName] = useState('');

    const handleSubmit = async (type: 'url' | 'text' | 'file', content: string | File) => {
        setIsSubmitting(true);
        
        // This is a placeholder for the actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
             toast({
                title: 'Document Added',
                description: 'The document is now being processed and indexed.',
            });
            onSuccess();
            onOpenChange(false);
            setUrl(''); setText(''); setFileName('');

        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not add the document.' });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add to Knowledge Base</DialogTitle>
                    <DialogDescription>Add new content for your agents to learn from.</DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="url" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="url"><Link2 className="mr-1 h-4 w-4"/>From URL</TabsTrigger>
                        <TabsTrigger value="text"><Type className="mr-1 h-4 w-4"/>From Text</TabsTrigger>
                        <TabsTrigger value="file"><Upload className="mr-1 h-4 w-4"/>Upload File</TabsTrigger>
                    </TabsList>
                    <TabsContent value="url" className="pt-4">
                         <div className="space-y-2">
                            <Label htmlFor="url">Website URL</Label>
                            <Input id="url" type="url" placeholder="https://example.com/faq" value={url} onChange={e => setUrl(e.target.value)} />
                        </div>
                        <Button className="mt-4 w-full" onClick={() => handleSubmit('url', url)} disabled={isSubmitting || !url}>
                            {isSubmitting ? 'Importing...' : 'Import from URL'}
                        </Button>
                    </TabsContent>
                    <TabsContent value="text" className="pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="text-content">Text Content</Label>
                            <Textarea id="text-content" placeholder="Paste your content here." className="h-32" value={text} onChange={e => setText(e.target.value)} />
                        </div>
                         <Button className="mt-4 w-full" onClick={() => handleSubmit('text', text)} disabled={isSubmitting || !text}>
                            {isSubmitting ? 'Adding...' : 'Add Text'}
                        </Button>
                    </TabsContent>
                    <TabsContent value="file" className="pt-4">
                         <div className="space-y-2">
                            <Label htmlFor="file-upload">File</Label>
                            <Input id="file-upload" type="file" onChange={e => setFileName(e.target.files?.[0]?.name || '')} />
                        </div>
                         <Button className="mt-4 w-full" onClick={() => handleSubmit('file', new File([], 'mock'))} disabled={isSubmitting || !fileName}>
                            {isSubmitting ? 'Uploading...' : 'Upload File'}
                        </Button>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
