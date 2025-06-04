
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface StylingSettingsCardProps {
  settings: any;
  onSettingsChange: (updates: any) => void;
}

export const StylingSettingsCard = ({ settings, onSettingsChange }: StylingSettingsCardProps) => {
  const updateSettings = (key: string, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
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
              onChange={(e) => updateSettings('background_color', e.target.value)}
              className="w-20 h-10"
            />
            <Input
              value={settings.background_color}
              onChange={(e) => updateSettings('background_color', e.target.value)}
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
              onChange={(e) => updateSettings('text_color', e.target.value)}
              className="w-20 h-10"
            />
            <Input
              value={settings.text_color}
              onChange={(e) => updateSettings('text_color', e.target.value)}
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
              onChange={(e) => updateSettings('button_color', e.target.value)}
              className="w-20 h-10"
            />
            <Input
              value={settings.button_color}
              onChange={(e) => updateSettings('button_color', e.target.value)}
              placeholder="#3b82f6"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="submit_button_text">Submit Button Text</Label>
          <Input
            id="submit_button_text"
            value={settings.submit_button_text}
            onChange={(e) => updateSettings('submit_button_text', e.target.value)}
            placeholder="Submit"
          />
        </div>
      </CardContent>
    </Card>
  );
};
