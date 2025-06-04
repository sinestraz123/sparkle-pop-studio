
import React, { useState } from 'react';
import { Code } from 'lucide-react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export const SurveyEmbedSection: React.FC = () => {
  const [showScript, setShowScript] = useState(false);

  return (
    <>
      <AccordionItem value="embed" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Code className="h-4 w-4 text-orange-600" />
            </div>
            <div className="text-left">
              <div className="font-medium">Embed Script</div>
              <div className="text-sm text-gray-500">Embed survey on your website</div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-4">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setShowScript(true)}
          >
            <Code className="h-4 w-4 mr-2" />
            Generate Embed Code
          </Button>
        </AccordionContent>
      </AccordionItem>

      <Dialog open={showScript} onOpenChange={setShowScript}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Survey Embed Code</DialogTitle>
            <DialogDescription>
              Copy this code and paste it into your website where you want the survey to appear.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
            {`<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://your-domain.com/survey-widget.js';
    script.async = true;
    document.head.appendChild(script);
  })();
</script>`}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
