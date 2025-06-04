
import React, { useState } from 'react';
import { ArrowLeft, Eye, ChevronDown, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import PopupPreview from '@/components/PopupPreview';

const Builder = () => {
  const [popupConfig, setPopupConfig] = useState({
    title: "New: Chrome Extension",
    description: "Now you can create leads directly from LinkedIn – or anywhere you find your next prospect.",
    buttonText: "Get the Chrome extension",
    buttonUrl: "#",
    imageUrl: "",
    videoUrl: "",
    type: "modal",
    position: "center",
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
    buttonColor: "#000000",
    showCloseButton: true,
    autoShow: true,
    delay: 2000
  });

  const [openSections, setOpenSections] = useState({
    settings: true,
    content: false,
    trigger: false,
    action: false
  });

  const updateConfig = (key: string, value: any) => {
    setPopupConfig(prev => ({ ...prev, [key]: value }));
  };

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const FormFactorOption = ({ type, label, isSelected, onClick }: any) => (
    <div 
      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onClick}
    >
      <div className="w-16 h-12 bg-gray-100 rounded mb-2 flex items-center justify-center">
        {type === 'modal' && <div className="w-8 h-6 bg-white border rounded shadow-sm flex items-center justify-center"><div className="w-2 h-2 bg-blue-500 rounded"></div></div>}
        {type === 'popover' && <div className="w-6 h-4 bg-white border rounded shadow-sm"></div>}
        {type === 'banner' && <div className="w-10 h-2 bg-white border rounded"></div>}
      </div>
      <p className="text-sm font-medium text-center">{label}</p>
    </div>
  );

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
            <h1 className="text-xl font-semibold text-gray-900">Edit nudge</h1>
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
          {/* Settings Section */}
          <Collapsible open={openSections.settings} onOpenChange={() => toggleSection('settings')}>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between py-4 px-4 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
                  <p className="text-sm text-gray-500">How should the nudge be positioned?</p>
                </div>
                {openSections.settings ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4">
              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Form Factor</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <FormFactorOption 
                      type="modal" 
                      label="Modal" 
                      isSelected={popupConfig.type === 'modal'}
                      onClick={() => updateConfig('type', 'modal')}
                    />
                    <FormFactorOption 
                      type="popover" 
                      label="Popover" 
                      isSelected={popupConfig.type === 'popover'}
                      onClick={() => updateConfig('type', 'popover')}
                    />
                    <FormFactorOption 
                      type="banner" 
                      label="Pin" 
                      isSelected={popupConfig.type === 'banner'}
                      onClick={() => updateConfig('type', 'banner')}
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Position:</Label>
                  <Select value={popupConfig.position} onValueChange={(value) => updateConfig('position', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="top">Top</SelectItem>
                      <SelectItem value="bottom">Bottom</SelectItem>
                      <SelectItem value="corner">Bottom Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-3">
                  <Switch 
                    checked={false}
                  />
                  <Label className="text-sm text-gray-700">Use custom handler for this nudge.</Label>
                  <button className="text-blue-600 text-sm hover:underline">Learn More</button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Content Section */}
          <Collapsible open={openSections.content} onOpenChange={() => toggleSection('content')}>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between py-4 px-4 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold text-gray-900">Content</h3>
                  <p className="text-sm text-gray-500 truncate">"New: Chrome Extension"...</p>
                </div>
                {openSections.content ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Title</Label>
                  <Input 
                    value={popupConfig.title}
                    onChange={(e) => updateConfig('title', e.target.value)}
                    placeholder="Enter announcement title"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Description</Label>
                  <Textarea 
                    value={popupConfig.description}
                    onChange={(e) => updateConfig('description', e.target.value)}
                    placeholder="Enter announcement description"
                    rows={4}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Image URL</Label>
                  <Input 
                    value={popupConfig.imageUrl}
                    onChange={(e) => updateConfig('imageUrl', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Button Text</Label>
                  <Input 
                    value={popupConfig.buttonText}
                    onChange={(e) => updateConfig('buttonText', e.target.value)}
                    placeholder="Call to action text"
                  />
                </div>
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
                  <Label className="text-sm font-medium text-gray-700">Auto Show</Label>
                  <Switch 
                    checked={popupConfig.autoShow} 
                    onCheckedChange={(checked) => updateConfig('autoShow', checked)}
                  />
                </div>
                {popupConfig.autoShow && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Delay (seconds)</Label>
                    <Input 
                      type="number" 
                      value={popupConfig.delay / 1000}
                      onChange={(e) => updateConfig('delay', parseInt(e.target.value) * 1000)}
                    />
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Action Section */}
          <Collapsible open={openSections.action} onOpenChange={() => toggleSection('action')}>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between py-4 px-4 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold text-gray-900">Action</h3>
                  <p className="text-sm text-gray-500">No action</p>
                </div>
                {openSections.action ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Button URL</Label>
                  <Input 
                    value={popupConfig.buttonUrl}
                    onChange={(e) => updateConfig('buttonUrl', e.target.value)}
                    placeholder="https://your-website.com"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Button Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input 
                      type="color"
                      value={popupConfig.buttonColor}
                      onChange={(e) => updateConfig('buttonColor', e.target.value)}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input 
                      value={popupConfig.buttonColor}
                      onChange={(e) => updateConfig('buttonColor', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Preview Panel */}
        <div className="bg-gray-100 p-6">
          <div className="bg-white rounded-lg shadow-sm h-full">
            <PopupPreview config={popupConfig} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Builder;
