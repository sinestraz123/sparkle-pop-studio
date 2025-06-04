
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DisplaySettingsCardProps {
  settings: any;
  onSettingsChange: (updates: any) => void;
}

export const DisplaySettingsCard = ({ settings, onSettingsChange }: DisplaySettingsCardProps) => {
  const updateSettings = (key: string, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Display Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={settings.status}
            onValueChange={(value) => updateSettings('status', value)}
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
            onValueChange={(value) => updateSettings('position', value)}
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
            onCheckedChange={(checked) => updateSettings('auto_show', checked)}
          />
          <Label htmlFor="auto_show">Auto show survey</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="show_close_button"
            checked={settings.show_close_button}
            onCheckedChange={(checked) => updateSettings('show_close_button', checked)}
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
              onChange={(e) => updateSettings('delay', parseInt(e.target.value) || 0)}
              min="0"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
