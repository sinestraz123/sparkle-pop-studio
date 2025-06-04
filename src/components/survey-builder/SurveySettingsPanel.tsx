
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface SurveySettingsPanelProps {
  survey: any;
  onUpdate: (updates: any) => void;
}

export const SurveySettingsPanel = ({ survey, onUpdate }: SurveySettingsPanelProps) => {
  const [settings, setSettings] = useState({
    status: survey?.status || 'draft',
    auto_show: survey?.auto_show || false,
    show_close_button: survey?.show_close_button ?? true,
    delay: survey?.delay || 0,
    position: survey?.position || 'center',
    background_color: survey?.background_color || '#ffffff',
    text_color: survey?.text_color || '#000000',
    button_color: survey?.button_color || '#3b82f6',
    submit_button_text: survey?.submit_button_text || 'Submit',
  });

  useEffect(() => {
    if (survey) {
      setSettings({
        status: survey.status || 'draft',
        auto_show: survey.auto_show || false,
        show_close_button: survey.show_close_button ?? true,
        delay: survey.delay || 0,
        position: survey.position || 'center',
        background_color: survey.background_color || '#ffffff',
        text_color: survey.text_color || '#000000',
        button_color: survey.button_color || '#3b82f6',
        submit_button_text: survey.submit_button_text || 'Submit',
      });
    }
  }, [survey]);

  const handleSave = () => {
    onUpdate(settings);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Display Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={settings.status}
              onValueChange={(value) => setSettings({ ...settings, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="position">Position</Label>
            <Select
              value={settings.position}
              onValueChange={(value) => setSettings({ ...settings, position: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="top">Top</SelectItem>
                <SelectItem value="bottom">Bottom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="auto_show"
              checked={settings.auto_show}
              onCheckedChange={(checked) => setSettings({ ...settings, auto_show: checked })}
            />
            <Label htmlFor="auto_show">Auto show survey</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="show_close_button"
              checked={settings.show_close_button}
              onCheckedChange={(checked) => setSettings({ ...settings, show_close_button: checked })}
            />
            <Label htmlFor="show_close_button">Show close button</Label>
          </div>

          {settings.auto_show && (
            <div>
              <Label htmlFor="delay">Delay (seconds)</Label>
              <Input
                id="delay"
                type="number"
                value={settings.delay}
                onChange={(e) => setSettings({ ...settings, delay: parseInt(e.target.value) || 0 })}
                min="0"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Styling</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="background_color">Background Color</Label>
            <div className="flex items-center gap-2">
              <Input
                id="background_color"
                type="color"
                value={settings.background_color}
                onChange={(e) => setSettings({ ...settings, background_color: e.target.value })}
                className="w-20 h-10"
              />
              <Input
                value={settings.background_color}
                onChange={(e) => setSettings({ ...settings, background_color: e.target.value })}
                placeholder="#ffffff"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="text_color">Text Color</Label>
            <div className="flex items-center gap-2">
              <Input
                id="text_color"
                type="color"
                value={settings.text_color}
                onChange={(e) => setSettings({ ...settings, text_color: e.target.value })}
                className="w-20 h-10"
              />
              <Input
                value={settings.text_color}
                onChange={(e) => setSettings({ ...settings, text_color: e.target.value })}
                placeholder="#000000"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="button_color">Button Color</Label>
            <div className="flex items-center gap-2">
              <Input
                id="button_color"
                type="color"
                value={settings.button_color}
                onChange={(e) => setSettings({ ...settings, button_color: e.target.value })}
                className="w-20 h-10"
              />
              <Input
                value={settings.button_color}
                onChange={(e) => setSettings({ ...settings, button_color: e.target.value })}
                placeholder="#3b82f6"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="submit_button_text">Submit Button Text</Label>
            <Input
              id="submit_button_text"
              value={settings.submit_button_text}
              onChange={(e) => setSettings({ ...settings, submit_button_text: e.target.value })}
              placeholder="Submit"
            />
          </div>
        </CardContent>
      </Card>

      <div className="lg:col-span-2">
        <Button onClick={handleSave} className="bg-teal-600 hover:bg-teal-700 text-white">
          Save Settings
        </Button>
      </div>
    </div>
  );
};
