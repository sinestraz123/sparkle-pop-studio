
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface NewsSettingsSectionProps {
  newsItem?: any;
  onChange: (data: any) => void;
}

export function NewsSettingsSection({ newsItem, onChange }: NewsSettingsSectionProps) {
  const [settings, setSettings] = useState({
    enable_comments: newsItem?.enable_comments || false,
    featured: newsItem?.featured || false,
    seo_title: newsItem?.seo_title || "",
    seo_description: newsItem?.seo_description || "",
    tags: newsItem?.tags || "",
  });

  const { toast } = useToast();

  const handleSettingChange = (field: string, value: any) => {
    const updatedSettings = { ...settings, [field]: value };
    setSettings(updatedSettings);
    onChange({ ...newsItem, ...updatedSettings });
  };

  const embedCode = `<iframe src="${window.location.origin}/embed/news" width="400" height="600" frameborder="0"></iframe>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    toast({
      title: "Copied!",
      description: "Embed code copied to clipboard",
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="font-medium">Display Settings</h4>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Featured Article</Label>
            <p className="text-sm text-gray-500">Show this article prominently</p>
          </div>
          <Switch
            checked={settings.featured}
            onCheckedChange={(checked) => handleSettingChange("featured", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Enable Comments</Label>
            <p className="text-sm text-gray-500">Allow readers to leave comments</p>
          </div>
          <Switch
            checked={settings.enable_comments}
            onCheckedChange={(checked) => handleSettingChange("enable_comments", checked)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">SEO Settings</h4>
        
        <div className="space-y-2">
          <Label htmlFor="seo_title">SEO Title</Label>
          <Input
            id="seo_title"
            value={settings.seo_title}
            onChange={(e) => handleSettingChange("seo_title", e.target.value)}
            placeholder="SEO optimized title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="seo_description">SEO Description</Label>
          <Textarea
            id="seo_description"
            value={settings.seo_description}
            onChange={(e) => handleSettingChange("seo_description", e.target.value)}
            placeholder="SEO meta description"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            value={settings.tags}
            onChange={(e) => handleSettingChange("tags", e.target.value)}
            placeholder="Comma separated tags"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Embed Widget</h4>
        <p className="text-sm text-gray-500">
          Embed this news feed on your website
        </p>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium">Embed Code</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={copyEmbedCode}
              className="gap-2"
            >
              <Copy className="w-3 h-3" />
              Copy
            </Button>
          </div>
          <code className="text-xs bg-white p-2 rounded border block overflow-x-auto">
            {embedCode}
          </code>
        </div>

        <Button variant="outline" className="w-full gap-2">
          <ExternalLink className="w-4 h-4" />
          Preview Embed
        </Button>
      </div>
    </div>
  );
}
