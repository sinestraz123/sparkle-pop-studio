
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

interface SurveyTriggerSectionProps {
  triggerType: string;
  autoShow: boolean;
  delay: number;
  onTriggerTypeChange: (type: string) => void;
  onAutoShowChange: (autoShow: boolean) => void;
  onDelayChange: (delay: number) => void;
}

export const SurveyTriggerSection = ({
  triggerType,
  autoShow,
  delay,
  onTriggerTypeChange,
  onAutoShowChange,
  onDelayChange,
}: SurveyTriggerSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Trigger Settings</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="trigger-type">Trigger Type</Label>
          <Select value={triggerType} onValueChange={onTriggerTypeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto_show">Auto Show</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="exit_intent">Exit Intent</SelectItem>
              <SelectItem value="scroll">Scroll Trigger</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Auto Show</Label>
            <p className="text-sm text-gray-500">Automatically show survey when triggered</p>
          </div>
          <Switch
            checked={autoShow}
            onCheckedChange={onAutoShowChange}
          />
        </div>

        {autoShow && (
          <div className="space-y-2">
            <Label htmlFor="delay">Delay (seconds)</Label>
            <Input
              id="delay"
              type="number"
              value={delay}
              onChange={(e) => onDelayChange(parseInt(e.target.value) || 0)}
              placeholder="0"
              min="0"
            />
          </div>
        )}
      </div>
    </div>
  );
};
