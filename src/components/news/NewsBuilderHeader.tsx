
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Eye, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface NewsBuilderHeaderProps {
  newsItem?: any;
  onSave: (data: any) => void;
  isNew: boolean;
}

export function NewsBuilderHeader({ newsItem, onSave, isNew }: NewsBuilderHeaderProps) {
  const navigate = useNavigate();
  const [isPublished, setIsPublished] = useState(newsItem?.status === 'published');

  const handleStatusChange = (checked: boolean) => {
    setIsPublished(checked);
    onSave({
      ...newsItem,
      status: checked ? 'published' : 'draft',
      published_at: checked ? new Date().toISOString() : null
    });
  };

  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate("/dashboard")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold">
            {isNew ? "New News Item" : newsItem?.title || "Untitled"}
          </h1>
          <Badge variant={isPublished ? "default" : "secondary"}>
            {isPublished ? "Published" : "Draft"}
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="publish-toggle" className="text-sm">
            Published
          </Label>
          <Switch
            id="publish-toggle"
            checked={isPublished}
            onCheckedChange={handleStatusChange}
          />
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          className="gap-2"
        >
          <Eye className="w-4 h-4" />
          Preview
        </Button>
        
        <Button 
          size="sm"
          className="gap-2"
          onClick={() => onSave(newsItem)}
        >
          <Save className="w-4 h-4" />
          Save
        </Button>
      </div>
    </div>
  );
}
