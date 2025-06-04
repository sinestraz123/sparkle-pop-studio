
import { useState } from "react";
import { NewsBuilderHeader } from "./NewsBuilderHeader";
import { NewsContentSection } from "./NewsContentSection";
import { NewsSettingsSection } from "./NewsSettingsSection";
import { NewsPreview } from "./NewsPreview";
import { useNews } from "@/hooks/useNews";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface NewsBuilderProps {
  newsId?: string;
}

export function NewsBuilder({ newsId }: NewsBuilderProps) {
  const { newsItem, updateNews, createNews } = useNews(newsId);
  const [activeAccordion, setActiveAccordion] = useState<string>("content");

  const handleSave = async (data: any) => {
    if (newsId && newsItem) {
      await updateNews(newsId, data);
    } else {
      await createNews(data);
    }
  };

  return (
    <div className="h-screen bg-gray-50">
      <NewsBuilderHeader 
        newsItem={newsItem}
        onSave={handleSave}
        isNew={!newsId}
      />
      
      <ResizablePanelGroup direction="horizontal" className="h-[calc(100vh-64px)]">
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full p-6 overflow-auto">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">News Builder</h2>
              
              <Accordion 
                type="single" 
                value={activeAccordion} 
                onValueChange={setActiveAccordion}
                className="space-y-4"
              >
                <AccordionItem value="content" className="bg-white rounded-lg border">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">1</span>
                      </div>
                      <span className="font-medium">Content</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <NewsContentSection 
                      newsItem={newsItem}
                      onChange={handleSave}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="settings" className="bg-white rounded-lg border">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-green-600">2</span>
                      </div>
                      <span className="font-medium">Settings</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <NewsSettingsSection 
                      newsItem={newsItem}
                      onChange={handleSave}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </ResizablePanel>
        
        <ResizableHandle />
        
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full bg-white border-l">
            <div className="h-full p-6">
              <h3 className="text-lg font-semibold mb-4">Preview</h3>
              <NewsPreview newsItem={newsItem} />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
