
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SurveySettingsSectionProps {
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  position: string;
  showCloseButton: boolean;
  showProgress: boolean;
  onBackgroundColorChange: (color: string) => void;
  onTextColorChange: (color: string) => void;
  onButtonColorChange: (color: string) => void;
  onPositionChange: (position: string) => void;
  onShowCloseButtonChange: (show: boolean) => void;
  onShowProgressChange: (show: boolean) => void;
}

export const SurveySettingsSection = ({
  backgroundColor,
  textColor,
  buttonColor,
  position,
  showCloseButton,
  showProgress,
  onBackgroundColorChange,
  onTextColorChange,
  onButtonColorChange,
  onPositionChange,
  onShowCloseButtonChange,
  onShowProgressChange,
}: SurveySettingsSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Appearance</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="background-color">Background Color</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="background-color"
              type="color"
              value={backgroundColor}
              onChange={(e) => onBackgroundColorChange(e.target.value)}
              className="w-12 h-10 p-1 border rounded"
            />
            <Input
              value={backgroundColor}
              onChange={(e) => onBackgroundColorChange(e.target.value)}
              placeholder="#ffffff"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="text-color">Text Color</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="text-color"
              type="color"
              value={textColor}
              onChange={(e) => onTextColorChange(e.target.value)}
              className="w-12 h-10 p-1 border rounded"
            />
            <Input
              value={textColor}
              onChange={(e) => onTextColorChange(e.target.value)}
              placeholder="#000000"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="button-color">Button Color</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="button-color"
              type="color"
              value={buttonColor}
              onChange={(e) => onButtonColorChange(e.target.value)}
              className="w-12 h-10 p-1 border rounded"
            />
            <Input
              value={buttonColor}
              onChange={(e) => onButtonColorChange(e.target.value)}
              placeholder="#3b82f6"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">Position</Label>
          <Select value={position} onValueChange={onPositionChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="top">Top</SelectItem>
              <SelectItem value="bottom">Bottom</SelectItem>
              <SelectItem value="top-left">Top Left</SelectItem>
              <SelectItem value="top-right">Top Right</SelectItem>
              <SelectItem value="bottom-left">Bottom Left</SelectItem>
              <SelectItem value="bottom-right">Bottom Right</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Show Close Button</Label>
            <p className="text-sm text-gray-500">Allow users to close the survey</p>
          </div>
          <Switch
            checked={showCloseButton}
            onCheckedChange={onShowCloseButtonChange}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Show Progress Bar</Label>
            <p className="text-sm text-gray-500">Display progress through the survey</p>
          </div>
          <Switch
            checked={showProgress}
            onCheckedChange={onShowProgressChange}
          />
        </div>
      </div>
    </div>
  );
};
