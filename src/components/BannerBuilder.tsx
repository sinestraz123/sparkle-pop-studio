
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Save, Eye, Code, Settings, Palette, Zap } from 'lucide-react';
import { BannerPreview } from './BannerPreview';

interface BannerConfig {
  title: string;
  content: string;
  showSender: boolean;
  senderName: string;
  showDismissButton: boolean;
  action: 'none' | 'url' | 'url_button' | 'reactions' | 'emails' | 'product_tour';
  actionUrl: string;
  actionButtonText: string;
  style: 'inline' | 'floating';
  position: 'top' | 'bottom';
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
}

const BannerBuilder = () => {
  const [config, setConfig] = useState<BannerConfig>({
    title: 'Your message...',
    content: '',
    showSender: true,
    senderName: 'Team',
    showDismissButton: true,
    action: 'none',
    actionUrl: '',
    actionButtonText: 'Learn More',
    style: 'inline',
    position: 'top',
    backgroundColor: '#0071B2',
    textColor: '#ffffff',
    buttonColor: '#ffffff'
  });

  const [activeTab, setActiveTab] = useState<'settings' | 'action' | 'style'>('settings');

  const updateConfig = (key: keyof BannerConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const actionOptions = [
    { value: 'none', label: 'None', icon: '🚫' },
    { value: 'url', label: 'Open a URL', icon: '🔗' },
    { value: 'url_button', label: 'Open a URL via a button', icon: '🔘', badge: 'New' },
    { value: 'reactions', label: 'Ask for reactions', icon: '😊' },
    { value: 'emails', label: 'Collect visitor emails', icon: '📧' },
    { value: 'product_tour', label: 'Launch a Product Tour', icon: '🎯' }
  ];

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Banner Creator</h1>
            <p className="text-gray-600">Create announcements, collect demos, and showcase features</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" size="sm">
              <Code className="h-4 w-4 mr-2" />
              Get Code
            </Button>
            <Button size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save Banner
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-t border-gray-200">
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'settings'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Settings className="h-4 w-4 inline mr-2" />
            Settings
          </button>
          <button
            onClick={() => setActiveTab('action')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'action'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Zap className="h-4 w-4 inline mr-2" />
            Action
          </button>
          <button
            onClick={() => setActiveTab('style')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'style'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Palette className="h-4 w-4 inline mr-2" />
            Style
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex">
        {/* Left Panel - Configuration */}
        <div className="w-1/2 bg-gray-50 border-r border-gray-200 overflow-y-auto">
          <div className="p-6">
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Message Content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Banner Message</Label>
                      <Input
                        id="title"
                        value={config.title}
                        onChange={(e) => updateConfig('title', e.target.value)}
                        placeholder="Your announcement message..."
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="content">Additional Content (Optional)</Label>
                      <Textarea
                        id="content"
                        value={config.content}
                        onChange={(e) => updateConfig('content', e.target.value)}
                        placeholder="Additional details..."
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Display Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show sender</Label>
                        <p className="text-sm text-gray-500">Display who sent this message</p>
                      </div>
                      <Switch
                        checked={config.showSender}
                        onCheckedChange={(checked) => updateConfig('showSender', checked)}
                      />
                    </div>

                    {config.showSender && (
                      <div>
                        <Label htmlFor="senderName">Sender Name</Label>
                        <Input
                          id="senderName"
                          value={config.senderName}
                          onChange={(e) => updateConfig('senderName', e.target.value)}
                          placeholder="Team name..."
                          className="mt-1"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show a dismiss button</Label>
                        <p className="text-sm text-gray-500">Allow users to close the banner</p>
                      </div>
                      <Switch
                        checked={config.showDismissButton}
                        onCheckedChange={(checked) => updateConfig('showDismissButton', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'action' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Banner Action</CardTitle>
                  <p className="text-sm text-gray-500">What happens when users interact with your banner?</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Action Type</Label>
                      <Select
                        value={config.action}
                        onValueChange={(value) => updateConfig('action', value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {actionOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <span>{option.icon}</span>
                                <span>{option.label}</span>
                                {option.badge && (
                                  <Badge variant="secondary" className="text-xs">
                                    {option.badge}
                                  </Badge>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {(config.action === 'url' || config.action === 'url_button') && (
                      <div>
                        <Label htmlFor="actionUrl">Target URL</Label>
                        <Input
                          id="actionUrl"
                          value={config.actionUrl}
                          onChange={(e) => updateConfig('actionUrl', e.target.value)}
                          placeholder="https://example.com"
                          className="mt-1"
                        />
                      </div>
                    )}

                    {config.action === 'url_button' && (
                      <div>
                        <Label htmlFor="actionButtonText">Button Text</Label>
                        <Input
                          id="actionButtonText"
                          value={config.actionButtonText}
                          onChange={(e) => updateConfig('actionButtonText', e.target.value)}
                          placeholder="Learn More"
                          className="mt-1"
                        />
                      </div>
                    )}

                    {config.action === 'emails' && (
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          📧 Email collection will display an input field for visitors to enter their email addresses.
                        </p>
                      </div>
                    )}

                    {config.action === 'reactions' && (
                      <div className="p-4 bg-yellow-50 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          😊 Reaction buttons will be displayed for visitors to provide quick feedback.
                        </p>
                      </div>
                    )}

                    {config.action === 'product_tour' && (
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-800">
                          🎯 This will trigger a product tour when users interact with the banner.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'style' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Banner Style</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Display Style</Label>
                      <div className="flex gap-2 mt-2">
                        <Button
                          variant={config.style === 'inline' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateConfig('style', 'inline')}
                        >
                          📄 Inline
                        </Button>
                        <Button
                          variant={config.style === 'floating' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateConfig('style', 'floating')}
                        >
                          🎈 Floating
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label>Position</Label>
                      <div className="flex gap-2 mt-2">
                        <Button
                          variant={config.position === 'top' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateConfig('position', 'top')}
                        >
                          ⬆️ Top
                        </Button>
                        <Button
                          variant={config.position === 'bottom' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateConfig('position', 'bottom')}
                        >
                          ⬇️ Bottom
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Colors</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="backgroundColor">Background Color</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="backgroundColor"
                          type="color"
                          value={config.backgroundColor}
                          onChange={(e) => updateConfig('backgroundColor', e.target.value)}
                          className="w-20 h-10 p-1"
                        />
                        <Input
                          value={config.backgroundColor}
                          onChange={(e) => updateConfig('backgroundColor', e.target.value)}
                          placeholder="#0071B2"
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="textColor">Text Color</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="textColor"
                          type="color"
                          value={config.textColor}
                          onChange={(e) => updateConfig('textColor', e.target.value)}
                          className="w-20 h-10 p-1"
                        />
                        <Input
                          value={config.textColor}
                          onChange={(e) => updateConfig('textColor', e.target.value)}
                          placeholder="#ffffff"
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="buttonColor">Button Color</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="buttonColor"
                          type="color"
                          value={config.buttonColor}
                          onChange={(e) => updateConfig('buttonColor', e.target.value)}
                          className="w-20 h-10 p-1"
                        />
                        <Input
                          value={config.buttonColor}
                          onChange={(e) => updateConfig('buttonColor', e.target.value)}
                          placeholder="#ffffff"
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="w-1/2 bg-white flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
            <p className="text-sm text-gray-500">See how your banner will look to visitors</p>
          </div>
          <div className="flex-1 p-6 overflow-y-auto">
            <BannerPreview config={config} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerBuilder;
