
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Save, Plus, Trash2, Code, Play } from 'lucide-react';
import { VideoTutorialsConfig, VideoTutorial } from '@/components/VideoTutorialsBuilder';
import { ScriptModal } from '@/components/ScriptModal';
import { useState } from 'react';

interface VideoTutorialsBuilderPanelProps {
  configs: VideoTutorialsConfig[];
  selectedConfig?: VideoTutorialsConfig;
  selectedConfigId: string;
  onConfigChange: (updates: Partial<VideoTutorialsConfig>) => void;
  onSelectConfig: (configId: string) => void;
  onAddConfig: () => void;
  onDeleteConfig: (configId: string) => void;
  onTutorialChange: (tutorialId: string, updates: Partial<VideoTutorial>) => void;
  onAddTutorial: () => void;
  onDeleteTutorial: (tutorialId: string) => void;
}

export const VideoTutorialsBuilderPanel = ({ 
  configs,
  selectedConfig, 
  selectedConfigId,
  onConfigChange, 
  onSelectConfig,
  onAddConfig,
  onDeleteConfig,
  onTutorialChange,
  onAddTutorial,
  onDeleteTutorial
}: VideoTutorialsBuilderPanelProps) => {
  const [showScriptModal, setShowScriptModal] = useState(false);

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Video Tutorial Widgets</h2>
        <div className="flex gap-2">
          <Button onClick={onAddConfig} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Widget
          </Button>
        </div>
      </div>

      {/* Widget List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Video Tutorial Widgets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {configs.map((config, index) => (
            <div
              key={config.id}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedConfigId === config.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onSelectConfig(config.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{config.title}</h4>
                  <p className="text-sm text-gray-500">
                    {config.tutorials.length} tutorials • {config.position}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={config.isActive}
                    onCheckedChange={(checked) => onConfigChange({ isActive: checked })}
                    onClick={(e) => e.stopPropagation()}
                  />
                  {configs.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConfig(config.id);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {selectedConfig && (
        <>
          {/* Basic Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Widget Title</Label>
                <Input
                  value={selectedConfig.title}
                  onChange={(e) => onConfigChange({ title: e.target.value })}
                  placeholder="Video Tutorials"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={selectedConfig.description}
                  onChange={(e) => onConfigChange({ description: e.target.value })}
                  placeholder="Learn how to use our platform with these video tutorials"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Trigger Button Text</Label>
                <Input
                  value={selectedConfig.triggerButtonText}
                  onChange={(e) => onConfigChange({ triggerButtonText: e.target.value })}
                  placeholder="Watch Tutorials"
                />
              </div>
            </CardContent>
          </Card>

          {/* Video Tutorials */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>Video Tutorials</CardTitle>
              <Button onClick={onAddTutorial} size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Tutorial
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedConfig.tutorials.map((tutorial, index) => (
                <div key={tutorial.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Tutorial {index + 1}</span>
                    {selectedConfig.tutorials.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteTutorial(tutorial.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={tutorial.title}
                        onChange={(e) => onTutorialChange(tutorial.id, { title: e.target.value })}
                        placeholder="Tutorial title"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Duration</Label>
                      <Input
                        value={tutorial.duration}
                        onChange={(e) => onTutorialChange(tutorial.id, { duration: e.target.value })}
                        placeholder="5:00"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={tutorial.description}
                      onChange={(e) => onTutorialChange(tutorial.id, { description: e.target.value })}
                      placeholder="Tutorial description"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Video URL</Label>
                    <Input
                      value={tutorial.videoUrl}
                      onChange={(e) => onTutorialChange(tutorial.id, { videoUrl: e.target.value })}
                      placeholder="https://www.youtube.com/embed/..."
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={selectedConfig.backgroundColor}
                      onChange={(e) => onConfigChange({ backgroundColor: e.target.value })}
                      className="w-12 h-10 p-1 border rounded"
                    />
                    <Input
                      value={selectedConfig.backgroundColor}
                      onChange={(e) => onConfigChange({ backgroundColor: e.target.value })}
                      placeholder="#ffffff"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Text Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={selectedConfig.textColor}
                      onChange={(e) => onConfigChange({ textColor: e.target.value })}
                      className="w-12 h-10 p-1 border rounded"
                    />
                    <Input
                      value={selectedConfig.textColor}
                      onChange={(e) => onConfigChange({ textColor: e.target.value })}
                      placeholder="#000000"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Position</Label>
                <Select value={selectedConfig.position} onValueChange={(value: 'bottom-left' | 'bottom-center' | 'bottom-right') => onConfigChange({ position: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bottom-left">Bottom Left</SelectItem>
                    <SelectItem value="bottom-center">Bottom Center</SelectItem>
                    <SelectItem value="bottom-right">Bottom Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label>Show Close Button</Label>
                <Switch
                  checked={selectedConfig.showCloseButton}
                  onCheckedChange={(checked) => onConfigChange({ showCloseButton: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <Button className="w-full flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full flex items-center gap-2"
                onClick={() => setShowScriptModal(true)}
              >
                <Code className="h-4 w-4" />
                Get Embed Script
              </Button>
            </CardContent>
          </Card>
        </>
      )}

      {showScriptModal && selectedConfig && (
        <ScriptModal
          isOpen={showScriptModal}
          onClose={() => setShowScriptModal(false)}
          announcement={selectedConfig}
        />
      )}
    </div>
  );
};
