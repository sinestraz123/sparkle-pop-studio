
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Eye, Code } from 'lucide-react';
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
    show_close_button: announcement?.show_close_button ?? true,
    auto_show: announcement?.auto_show ?? true,
    delay: announcement?.delay || 2000,
    status: announcement?.status || 'draft',
  });

  const [showScript, setShowScript] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left Sidebar - Configuration */}
      <div className="w-96 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
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
          
          <h1 className="text-lg font-semibold">Edit nudge</h1>
          
          <div className="flex gap-2 mt-4">
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
          <div className="p-4 space-y-6">
            {/* Settings Section */}
            <div>
              <h3 className="font-medium mb-3">Settings</h3>
              <p className="text-sm text-gray-600 mb-4">How should the nudge be positioned?</p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Form Factor</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'modal', label: 'Modal', icon: '📱' },
                      { value: 'popover', label: 'Popover', icon: '💬' },
                      { value: 'banner', label: 'Pin', icon: '📌' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateFormData('type', option.value)}
                        className={`p-3 border rounded-lg text-center text-sm transition-colors ${
                          formData.type === option.value 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="text-2xl mb-1">{option.icon}</div>
                        <div>{option.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Position</label>
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
              </div>
            </div>

            {/* Content Section */}
            <div>
              <h3 className="font-medium mb-3">Content</h3>
              <div className="space-y-4">
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
              </div>
            </div>

            {/* Trigger Section */}
            <div>
              <h3 className="font-medium mb-3">Trigger</h3>
              <p className="text-sm text-gray-600 mb-4">When does it show?</p>
              
              <div className="space-y-4">
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
              </div>
            </div>

            {/* Script Section */}
            <div>
              <h3 className="font-medium mb-3">Script</h3>
              <p className="text-sm text-gray-600 mb-4">Light-weight script to embed onto your customer platform</p>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowScript(true)}
              >
                <Code className="h-4 w-4 mr-2" />
                Generate Script
              </Button>
            </div>
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
