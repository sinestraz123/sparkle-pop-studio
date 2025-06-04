
import React from 'react';
import { Code } from 'lucide-react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

interface ScriptSectionProps {
  onShowScript: () => void;
}

export const ScriptSection: React.FC<ScriptSectionProps> = ({
  onShowScript,
}) => {
  return (
    <AccordionItem value="script" className="border rounded-lg px-4">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Code className="h-4 w-4 text-orange-600" />
          </div>
          <div className="text-left">
            <div className="font-medium">Script</div>
            <div className="text-sm text-gray-500">Light-weight script to embed onto your customer platform</div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-4">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onShowScript}
        >
          <Code className="h-4 w-4 mr-2" />
          Generate Script
        </Button>
      </AccordionContent>
    </AccordionItem>
  );
};
