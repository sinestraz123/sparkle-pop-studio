
import React, { useState } from 'react';
import { ArrowLeft, Eye, Settings, Palette, Type, Image, Video, MousePointer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PopupPreview from '@/components/PopupPreview';

const Builder = () => {
  const [popupConfig, setPopupConfig] = useState({
    title: "New: Chrome Extension",
    description: "Now you can create leads directly from LinkedIn – or anywhere you find your next prospect.",
    buttonText: "Get the Chrome extension",
    buttonUrl: "#",
    imageUrl: "",
    videoUrl: "",
    type: "modal", // modal, popover, banner
    position: "center", // center, top, bottom, corner
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
    buttonColor: "#3b82f6",
    showCloseButton: true,
    autoShow: true,
    delay: 2000
  });

  const updateConfig = (key: string, value: any) => {
    setPopupConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Announcement</h1>
              <p className="text-gray-600">Customize your popup announcement</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              Save
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <div className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="type">Popup Type</Label>
                    <Select value={popupConfig.type} onValueChange={(value) => updateConfig('type', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modal">Modal</SelectItem>
                        <SelectItem value="popover">Popover</SelectItem>
                        <SelectItem value="banner">Banner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Select value={popupConfig.position} onValueChange={(value) => updateConfig('position', value)}>
                      <SelectTrigger>
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

                  <div className="flex items-center justify-between">
                    <Label htmlFor="autoShow">Auto Show</Label>
                    <Switch 
                      checked={popupConfig.autoShow} 
                      onCheckedChange={(checked) => updateConfig('autoShow', checked)}
                    />
                  </div>

                  {popupConfig.autoShow && (
                    <div>
                      <Label htmlFor="delay">Delay (seconds)</Label>
                      <Input 
                        type="number" 
                        value={popupConfig.delay / 1000}
                        onChange={(e) => updateConfig('delay', parseInt(e.target.value) * 1000)}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Type className="h-5 w-5" />
                  <span>Content</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="text" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="text">Text</TabsTrigger>
                    <TabsTrigger value="media">Media</TabsTrigger>
                    <TabsTrigger value="button">Button</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="text" className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input 
                        value={popupConfig.title}
                        onChange={(e) => updateConfig('title', e.target.value)}
                        placeholder="Enter announcement title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        value={popupConfig.description}
                        onChange={(e) => updateConfig('description', e.target.value)}
                        placeholder="Enter announcement description"
                        rows={4}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="media" className="space-y-4">
                    <div>
                      <Label htmlFor="imageUrl">Image URL</Label>
                      <Input 
                        value={popupConfig.imageUrl}
                        onChange={(e) => updateConfig('imageUrl', e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="videoUrl">Video URL (YouTube/Vimeo)</Label>
                      <Input 
                        value={popupConfig.videoUrl}
                        onChange={(e) => updateConfig('videoUrl', e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="button" className="space-y-4">
                    <div>
                      <Label htmlFor="buttonText">Button Text</Label>
                      <Input 
                        value={popupConfig.buttonText}
                        onChange={(e) => updateConfig('buttonText', e.target.value)}
                        placeholder="Call to action text"
                      />
                    </div>
                    <div>
                      <Label htmlFor="buttonUrl">Button URL</Label>
                      <Input 
                        value={popupConfig.buttonUrl}
                        onChange={(e) => updateConfig('buttonUrl', e.target.value)}
                        placeholder="https://your-website.com"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="h-5 w-5" />
                  <span>Styling</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="backgroundColor">Background Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input 
                      type="color"
                      value={popupConfig.backgroundColor}
                      onChange={(e) => updateConfig('backgroundColor', e.target.value)}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input 
                      value={popupConfig.backgroundColor}
                      onChange={(e) => updateConfig('backgroundColor', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="textColor">Text Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input 
                      type="color"
                      value={popupConfig.textColor}
                      onChange={(e) => updateConfig('textColor', e.target.value)}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input 
                      value={popupConfig.textColor}
                      onChange={(e) => updateConfig('textColor', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="buttonColor">Button Color</Label>
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
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="lg:sticky lg:top-8">
            <Card className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Live Preview</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <PopupPreview config={popupConfig} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Builder;
