import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X } from "lucide-react";
import { useState, useRef } from "react";
import { useNewsImageUpload } from "@/hooks/useNewsImageUpload";

interface NewsContentSectionProps {
  newsItem?: any;
  onChange: (data: any) => void;
}

export function NewsContentSection({ newsItem, onChange }: NewsContentSectionProps) {
  const [formData, setFormData] = useState({
    title: newsItem?.title || "",
    description: newsItem?.description || "",
    content: newsItem?.content || "",
    type: newsItem?.type || "news",
    link_url: newsItem?.link_url || "",
    category: newsItem?.category || "general",
    author_name: newsItem?.author_name || "",
    image_url: newsItem?.image_url || ""
  });

  const { uploadImage, isUploading } = useNewsImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: string, value: string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onChange(updatedData);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        handleChange("image_url", imageUrl);
      }
    }
  };

  const removeImage = () => {
    handleChange("image_url", "");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Enter news title..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="news">News</SelectItem>
            <SelectItem value="announcement">Announcement</SelectItem>
            <SelectItem value="blog">Blog Post</SelectItem>
            <SelectItem value="webinar">Webinar</SelectItem>
            <SelectItem value="feature">New Feature</SelectItem>
            <SelectItem value="link">External Link</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="product">Product Updates</SelectItem>
            <SelectItem value="company">Company News</SelectItem>
            <SelectItem value="technical">Technical</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Brief description..."
          rows={3}
        />
      </div>

      {formData.type === "link" && (
        <div className="space-y-2">
          <Label htmlFor="link_url">Link URL</Label>
          <Input
            id="link_url"
            type="url"
            value={formData.link_url}
            onChange={(e) => handleChange("link_url", e.target.value)}
            placeholder="https://example.com"
          />
        </div>
      )}

      {formData.type !== "link" && (
        <div className="space-y-2">
          <Label htmlFor="content">Full Content</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => handleChange("content", e.target.value)}
            placeholder="Write your full content here..."
            rows={8}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="author">Author Name</Label>
        <Input
          id="author"
          value={formData.author_name}
          onChange={(e) => handleChange("author_name", e.target.value)}
          placeholder="Author name"
        />
      </div>

      <div className="space-y-2">
        <Label>Featured Image</Label>
        {formData.image_url ? (
          <div className="relative">
            <img
              src={formData.image_url}
              alt="Featured"
              className="w-full h-48 object-cover rounded-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={removeImage}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Click to upload an image
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Choose Image"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
