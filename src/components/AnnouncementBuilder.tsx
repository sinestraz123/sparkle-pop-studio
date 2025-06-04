
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, Eye, Code, Settings, Type, Zap, Play, Upload, Link, Image } from 'lucide-react';
import { AnnouncementPreview } from './AnnouncementPreview';
import { ScriptModal } from './ScriptModal';
import { Tables } from '@/integrations/supabase/types';

type Announcement = Tables<'announcements'>;

interface AnnouncementBuilderProps {
  announcement?: Announcement;
  onSave: (data: any) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export const AnnouncementBuilder: React.FC<AnnouncementBuilderProps> = ({
  announcement,
  onSave,
  onBack,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    title: announcement?.title || 'New: Chrome Extension',
    description: announcement?.description || 'Now you can create leads directly from LinkedIn – or anywhere you find your next prospect.',
    type: announcement?.type || 'modal',
    position: announcement?.position || 'center',
    background_color: announcement?.background_color || '#ffffff',
    text_color: announcement?.text_color || '#000000',
    button_color: announcement?.button_color || '#000000',
    button_text: announcement?.button_text || 'Get the Chrome extension →',
    button_url: announcement?.button_url || '',
    image_url: announcement?.image_url || '/lovable-uploads/66772a1d-271b-4f67-a422-49ac799cccfe.png',
    video_url: announcement?.video_url || '',
    show_close_button: announcement?.show_close_button ?? true,
    auto_show: announcement?.auto_show ?? true,
    delay: announcement?.delay || 2000,
    status: announcement?.status || 'draft',
  });

  const [showScript, setShowScript] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'none'>(
    formData.video_url ? 'video' : formData.image_url ? 'image' : 'none'
  );

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updateFormData('image_url', result);
        updateFormData('video_url', '');
        setMediaType('image');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUrlChange = (url: string) => {
    updateFormData('video_url', url);
    updateFormData('image_url', '');
    setMediaType('video');
  };

  const handleMediaTypeChange = (type: 'image' | 'video' | 'none') => {
    setMediaType(type);
    if (type === 'none') {
      updateFormData('image_url', '');
      updateFormData('video_url', '');
    } else if (type === 'image' && !formData.image_url) {
      updateFormData('video_url', '');
    } else if (type === 'video' && !formData.video_url) {
      updateFormData('image_url', '');
    }
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left Sidebar - Configuration - Increased width */}
      <div className="w-[480px] bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.status === 'active'}
                onCheckedChange={(checked) => updateFormData('status', checked ? 'active' : 'draft')}
              />
              <Badge variant={formData.status === 'active' ? 'default' : 'secondary'}>
                {formData.status === 'active' ? 'Active' : 'Draft'}
              </Badge>
            </div>
          </div>
          
          <h1 className="text-xl font-semibold mb-4">Edit nudge</h1>
          
          <div className="flex gap-2">
            <Button 
              variant={previewMode ? "outline" : "default"} 
              size="sm"
              onClick={() => setPreviewMode(false)}
            >
              Edit
            </Button>
            <Button 
              variant={previewMode ? "default" : "outline"} 
              size="sm"
              onClick={() => setPreviewMode(true)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              Save
            </Button>
          </div>
        </div>

        {!previewMode && (
          <div className="p-6">
            <Accordion type="multiple" defaultValue={["settings", "content", "trigger", "script"]} className="space-y-4">
              {/* Settings Section */}
              <AccordionItem value="settings" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Settings className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Settings</div>
                      <div className="text-sm text-gray-500">How should the nudge be positioned?</div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  <div>
                    <label className="text-sm font-medium mb-3 block">Form Factor</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'modal', label: 'Modal', icon: '📱' },
                        { value: 'popover', label: 'Popover', icon: '💬' },
                        { value: 'banner', label: 'Pin', icon: '📌' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => updateFormData('type', option.value)}
                          className={`p-4 border rounded-lg text-center text-sm transition-colors ${
                            formData.type === option.value 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="text-2xl mb-2">{option.icon}</div>
                          <div className="font-medium">{option.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-3 block">Position</label>
                    <Select value={formData.position} onValueChange={(value) => updateFormData('position', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="top">Top</SelectItem>
                        <SelectItem value="bottom">Bottom</SelectItem>
                        <SelectItem value="corner">Corner</SelectItem>
                        <SelectItem value="bottom-right">Bottom Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <label className="text-sm font-medium">Use custom handler for this nudge</label>
                    </div>
                    <button className="text-blue-600 text-sm hover:underline">Learn More →</button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Content Section */}
              <AccordionItem value="content" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Type className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Content</div>
                      <div className="text-sm text-gray-500">{formData.title}</div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Title</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => updateFormData('title', e.target.value)}
                      placeholder="Enter title"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => updateFormData('description', e.target.value)}
                      placeholder="Enter description"
                      rows={3}
                    />
                  </div>

                  {/* Media Section */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Media</label>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {[
                        { value: 'none', label: 'None', icon: '🚫' },
                        { value: 'image', label: 'Image/GIF', icon: '🖼️' },
                        { value: 'video', label: 'Video', icon: '🎥' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleMediaTypeChange(option.value as 'image' | 'video' | 'none')}
                          className={`p-3 border rounded-lg text-center text-sm transition-colors ${
                            mediaType === option.value 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="text-lg mb-1">{option.icon}</div>
                          <div className="font-medium text-xs">{option.label}</div>
                        </button>
                      ))}
                    </div>

                    {mediaType === 'image' && (
                      <div className="space-y-3">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <input
                            type="file"
                            accept="image/*,.gif"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                          />
                          <label htmlFor="image-upload" className="cursor-pointer">
                            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm text-gray-600">Click to upload image or GIF</p>
                            <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                          </label>
                        </div>
                        {formData.image_url && (
                          <div className="text-xs text-green-600">✓ Image uploaded</div>
                        )}
                      </div>
                    )}

                    {mediaType === 'video' && (
                      <div>
                        <Input
                          value={formData.video_url}
                          onChange={(e) => handleVideoUrlChange(e.target.value)}
                          placeholder="Enter video URL (YouTube, Vimeo, etc.)"
                          className="w-full"
                        />
                        <p className="text-xs text-gray-400 mt-1">Paste a video link from YouTube, Vimeo, or direct video URL</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Button Text</label>
                    <Input
                      value={formData.button_text}
                      onChange={(e) => updateFormData('button_text', e.target.value)}
                      placeholder="Enter button text"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Button URL</label>
                    <Input
                      value={formData.button_url}
                      onChange={(e) => updateFormData('button_url', e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Background</label>
                      <Input
                        type="color"
                        value={formData.background_color}
                        onChange={(e) => updateFormData('background_color', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Text Color</label>
                      <Input
                        type="color"
                        value={formData.text_color}
                        onChange={(e) => updateFormData('text_color', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Button Color</label>
                    <Input
                      type="color"
                      value={formData.button_color}
                      onChange={(e) => updateFormData('button_color', e.target.value)}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Trigger Section */}
              <AccordionItem value="trigger" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Zap className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Trigger</div>
                      <div className="text-sm text-gray-500">When does it show?</div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Auto show</label>
                    <Switch
                      checked={formData.auto_show}
                      onCheckedChange={(checked) => updateFormData('auto_show', checked)}
                    />
                  </div>

                  {formData.auto_show && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Delay (milliseconds)</label>
                      <Input
                        type="number"
                        value={formData.delay}
                        onChange={(e) => updateFormData('delay', parseInt(e.target.value) || 0)}
                        placeholder="2000"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Show close button</label>
                    <Switch
                      checked={formData.show_close_button}
                      onCheckedChange={(checked) => updateFormData('show_close_button', checked)}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Script Section */}
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
                    onClick={() => setShowScript(true)}
                  >
                    <Code className="h-4 w-4 mr-2" />
                    Generate Script
                  </Button>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </div>

      {/* Right Side - Preview */}
      <div className="flex-1 bg-gradient-to-br from-orange-100 via-pink-100 to-purple-200 relative">
        <div className="absolute top-4 left-4 bg-white rounded-lg px-3 py-1 text-sm text-gray-600">
          yourwebsite.com
        </div>
        
        <AnnouncementPreview announcement={formData} />
      </div>

      {/* Script Modal */}
      <ScriptModal 
        isOpen={showScript}
        onClose={() => setShowScript(false)}
        announcement={formData}
      />
    </div>
  );
};
