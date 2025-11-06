
'use client';
import { useToast } from '@/hooks/use-toast';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

const followUpTemplates = [
  {
    id: 1,
    name: 'Initial Follow-Up',
    category: 'Follow-Up',
    content: 'Hi {{name}}, just following up on our recent conversation about {{topic}}. Let me know if you have any other questions!',
    status: 'active',
  },
  {
    id: 2,
    name: 'Post-Demo Follow-Up',
    category: 'Follow-Up',
    content: 'Hello {{name}}, thanks for your time during the demo today. I\'ve sent over the proposal we discussed. Looking forward to hearing your thoughts.',
    status: 'active',
  },
  {
    id: 3,
    name: 'No-Response Nudge',
    category: 'Follow-Up',
    content: 'Hi {{name}}, I wanted to gently check in on our last conversation. Is there any additional information I can provide?',
    status: 'active',
  },
];

export default function WhatsAppAutomationPage() {
  const { toast } = useToast();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to Clipboard',
      description: 'The template text has been copied.',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">WhatsApp Automation</h1>
        <p className="text-gray-500 mt-1">Messaging intelligence and campaign analytics</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Follow-Up Templates</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {followUpTemplates.map((template) => (
            <div key={template.id} className="border border-gray-200 rounded-lg p-4 flex flex-col justify-between hover:border-blue-300 transition-colors">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <p className="text-xs text-gray-500">{template.category}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium bg-emerald-100 text-emerald-800`}>
                    {template.status}
                  </span>
                </div>

                <div className="bg-gray-50 rounded p-3 mb-3">
                  <p className="text-xs text-gray-700">{template.content}</p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(template.content)}
                className="w-full mt-2"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Text
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
