
'use client';

import { useState } from 'react';
import { generateBusinessInsights, type GenerateBusinessInsightsOutput } from '@/ai/flows/generate-business-insights';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Lightbulb, Zap, Loader2, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Mock business data for demonstration
const mockBusinessData = `
- Total Revenue last month: $40,000
- Total Revenue this month: $45,231
- Bookings last month: 1950
- Bookings this month: 2350
- Active Calls today: 573
- CSAT score last month: 94%
- CSAT score this month: 92.8%
- Top complaint topic: "Pricing confusion" (15% of negative calls)
- High traffic hours: 12:00 PM - 4:00 PM
- AI handled calls: 65%
- Rebooking rate: 15.7%
- Website conversion rate: 2.5%
`;

export default function AiInsights() {
  const [insights, setInsights] = useState<GenerateBusinessInsightsOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateInsights = async () => {
    setLoading(true);
    setError(null);
    setInsights(null);

    try {
      const result = await generateBusinessInsights({ businessData: mockBusinessData });
      setInsights(result);
      toast({
        title: "Insights Generated",
        description: "New recommendations are ready for review.",
      });
    } catch (e: any) {
      setError('Failed to generate insights. Please try again.');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not generate insights.",
      });
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleGenerateInsights} disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Zap className="mr-2 h-4 w-4" />
            Generate Insights
          </>
        )}
      </Button>

      {error && (
         <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {insights && insights.insights.length > 0 && (
        <div className="space-y-4 pt-4">
          {insights.insights.map((insight, index) => (
            <Card key={index} className="bg-background/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Lightbulb className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{insight.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{insight.recommendation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
       {!loading && !insights && !error && (
         <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg mt-4">
             <Zap className="w-10 h-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">Unlock Your Business Potential</h3>
            <p className="text-sm text-muted-foreground">Click the button to generate AI-powered insights and recommendations.</p>
        </div>
      )}
    </div>
  );
}
