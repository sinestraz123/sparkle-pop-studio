
import React, { useState } from 'react';
import { ArrowLeft, Eye, ChevronDown, ChevronRight, Plus, Trash, GripVertical, Move } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import ChecklistPreview from '@/components/ChecklistPreview';

interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  mediaType: 'none' | 'image' | 'gif' | 'url';
  mediaUrl?: string;
  completed: boolean;
}

const Checklist = () => {
  const [checklistConfig, setChecklistConfig] = useState({
    title: "Getting Started",
    description: "Complete these steps to get started with our platform",
    items: [
      {
        id: '1',
        title: 'Get the Chrome extension',
        description: 'Install our Chrome extension to start capturing leads',
        mediaType: 'none' as const,
        mediaUrl: '',
        completed: false,
      },
      {
        id: '2',
        title: 'Invite your team',
        description: 'Add team members to collaborate on lead generation',
        mediaType: 'none' as const,
        mediaUrl: '',
        completed: false,
      },
      {
        id: '3',
        title: 'Customize deal stages',
        description: 'Set up your sales pipeline stages',
        mediaType: 'none' as const,
        mediaUrl: '',
        completed: false,
      },
      {
        id: '4',
        title: 'Build your first report',
        description: 'Create analytics reports to track your progress',
        mediaType: 'none' as const,
        mediaUrl: '',
        completed: false,
      },
    ] as ChecklistItem[],
    progressBarColor: '#3b82f6',
    buttonText: 'Get Started',
    buttonUrl: '#',
    showProgress: true,
    autoHide: false,
  });

  const [openSections, setOpenSections] = useState({
    questlist: true,
    items: false,
    trigger: false,
  });

  const updateConfig = (key: string, value: any) => {
    setChecklistConfig(prev => ({ ...prev, [key]: value }));
  };

  const updateItem = (itemId: string, key: string, value: any) => {
    setChecklistConfig(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId ? { ...item, [key]: value } : item
      )
    }));
  };

  const addItem = () => {
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      title: 'New checklist item',
      description: '',
      mediaType: 'none',
      mediaUrl: '',
      completed: false,
    };
    setChecklistConfig(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeItem = (itemId: string) => {
    setChecklistConfig(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">Create questlist</h1>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Switch checked={true} />
              <span className="text-sm text-gray-600">Draft</span>
            </div>
            <Button variant="outline" className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Save
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-80px)]">
        {/* Editor Panel */}
        <div className="bg-white border-r border-gray-200 p-6 space-y-1">
          {/* Questlist Section */}
          <Collapsible open={openSections.questlist} onOpenChange={() => toggleSection('questlist')}>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between py-4 px-4 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold text-gray-900">Questlist</h3>
                  <p className="text-sm text-gray-500">"{checklistConfig.title}"...</p>
                </div>
                {openSections.questlist ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Title</Label>
                  <Input 
                    value={checklistConfig.title}
                    onChange={(e) => updateConfig('title', e.target.value)}
                    placeholder="Enter checklist title"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Description</Label>
                  <Textarea 
                    value={checklistConfig.description}
                    onChange={(e) => updateConfig('description', e.target.value)}
                    placeholder="Enter checklist description"
                    rows={3}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">Show Progress Bar</Label>
                  <Switch 
                    checked={checklistConfig.showProgress} 
                    onCheckedChange={(checked) => updateConfig('showProgress', checked)}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Progress Bar Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input 
                      type="color"
                      value={checklistConfig.progressBarColor}
                      onChange={(e) => updateConfig('progressBarColor', e.target.value)}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input 
                      value={checklistConfig.progressBarColor}
                      onChange={(e) => updateConfig('progressBarColor', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Items Section */}
          <Collapsible open={openSections.items} onOpenChange={() => toggleSection('items')}>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between py-4 px-4 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold text-gray-900">Items</h3>
                  <p className="text-sm text-gray-500">{checklistConfig.items.length} questlist items</p>
                </div>
                {openSections.items ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4">
              <div className="space-y-4">
                {checklistConfig.items.map((item, index) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <GripVertical className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{index + 1}.</span>
                        <Input 
                          value={item.title}
                          onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                          placeholder="Item title"
                          className="font-medium"
                        />
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea 
                      value={item.description || ''}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      placeholder="Item description (optional)"
                      rows={2}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-1 block">Media Type</Label>
                        <Select value={item.mediaType} onValueChange={(value) => updateItem(item.id, 'mediaType', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="image">Image</SelectItem>
                            <SelectItem value="gif">GIF</SelectItem>
                            <SelectItem value="url">URL</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {item.mediaType !== 'none' && (
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-1 block">
                            {item.mediaType === 'url' ? 'URL' : 'Media URL'}
                          </Label>
                          <Input 
                            value={item.mediaUrl || ''}
                            onChange={(e) => updateItem(item.id, 'mediaUrl', e.target.value)}
                            placeholder={`Enter ${item.mediaType} URL`}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  onClick={addItem}
                  className="w-full flex items-center space-x-2 text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add item</span>
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Trigger Section */}
          <Collapsible open={openSections.trigger} onOpenChange={() => toggleSection('trigger')}>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between py-4 px-4 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold text-gray-900">Trigger</h3>
                  <p className="text-sm text-gray-500">When does it show?</p>
                </div>
                {openSections.trigger ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">Auto Hide on Completion</Label>
                  <Switch 
                    checked={checklistConfig.autoHide} 
                    onCheckedChange={(checked) => updateConfig('autoHide', checked)}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Call-to-Action Button Text</Label>
                  <Input 
                    value={checklistConfig.buttonText}
                    onChange={(e) => updateConfig('buttonText', e.target.value)}
                    placeholder="Button text"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Button URL</Label>
                  <Input 
                    value={checklistConfig.buttonUrl}
                    onChange={(e) => updateConfig('buttonUrl', e.target.value)}
                    placeholder="https://your-website.com"
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Preview Panel */}
        <div className="bg-gray-100 p-6">
          <div className="bg-white rounded-lg shadow-sm h-full">
            <ChecklistPreview config={checklistConfig} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checklist;
