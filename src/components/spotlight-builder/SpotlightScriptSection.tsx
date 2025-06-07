
import React from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Code } from 'lucide-react';

interface SpotlightScriptSectionProps {
  onShowScript: () => void;
}

export const SpotlightScriptSection: React.FC<SpotlightScriptSectionProps> = ({
  onShowScript,
}) => {
  return (
    <AccordionItem value="script">
      <AccordionTrigger className="flex items-center">
        <div className="flex items-center space-x-2">
          <Code className="h-4 w-4" />
          <span>Embed Script</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pt-4">
        <div className="text-sm text-gray-600">
          <p className="mb-3">
            Get the embed script to add a button to your website. When visitors click it, 
            your spotlight video will open in a popup.
          </p>
        </div>
        
        <Button onClick={onShowScript} className="w-full">
          <Code className="h-4 w-4 mr-2" />
          Get Embed Script
        </Button>
      </AccordionContent>
    </AccordionItem>
  );
};
