
import { useState, useEffect } from "react";
import { NewsBuilderHeader } from "./NewsBuilderHeader";
import { NewsContentSection } from "./NewsContentSection";
import { NewsSettingsSection } from "./NewsSettingsSection";
import { NewsPreview } from "./NewsPreview";
import { useNews } from "@/hooks/useNews";
import { Card } from "@/components/ui/card";

interface NewsBuilderProps {
  newsId?: string;
}

export function NewsBuilder({ newsId }: NewsBuilderProps) {
  console.log('NewsBuilder component rendering with newsId:', newsId);
  
  const { newsItem, loading, createNews, updateNews, deleteNews } = useNews(newsId);
  const [localData, setLocalData] = useState({
    title: "",
    description: "",
    content: "",
    type: "news",
    category: "general",
    link_url: "",
    image_url: "",
    author_name: "",
    status: "draft"
  });

  console.log('NewsBuilder state:', { newsItem, loading, localData });

  useEffect(() => {
    if (newsItem) {
      console.log('Setting local data from newsItem:', newsItem);
      setLocalData({
        title: newsItem.title || "",
        description: newsItem.description || "",
        content: newsItem.content || "",
        type: newsItem.type || "news",
        category: newsItem.category || "general",
        link_url: newsItem.link_url || "",
        image_url: newsItem.image_url || "",
        author_name: newsItem.author_name || "",
        status: newsItem.status || "draft"
      });
    }
  }, [newsItem]);

  const handleSave = async (data = localData) => {
    console.log('Saving news data:', data);
    try {
      if (newsId) {
        await updateNews(newsId, data);
      } else {
        await createNews(data);
      }
    } catch (error) {
      console.error('Error saving news:', error);
    }
  };

  const handleDataChange = (updates: Partial<typeof localData>) => {
    console.log('Updating local data:', updates);
    setLocalData(prev => ({ ...prev, ...updates }));
  };

  if (loading) {
    console.log('NewsBuilder is loading...');
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading news builder...</div>
      </div>
    );
  }

  const isNew = !newsId || !newsItem;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NewsBuilderHeader 
        newsItem={localData}
        onSave={handleSave}
        isNew={isNew}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex">
          <div className="w-1/2 border-r bg-white overflow-auto">
            <div className="p-6 space-y-6">
              <NewsContentSection 
                data={localData}
                onChange={handleDataChange}
              />
              
              <NewsSettingsSection 
                data={localData}
                onChange={handleDataChange}
              />
            </div>
          </div>
          
          <div className="w-1/2 bg-gray-100 overflow-auto">
            <div className="p-6">
              <Card className="h-full">
                <NewsPreview data={localData} />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
