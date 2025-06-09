
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface FeedbackBuilderPanelProps {
  config: any;
  onConfigChange: (updates: any) => void;
}

export const FeedbackBuilderPanel = ({ config, onConfigChange }: FeedbackBuilderPanelProps) => {
  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Feedback Widget</h2>
        <Button className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Feedback Type</Label>
            <Select value={config.type} onValueChange={(value) => onConfigChange({ type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nps">Net Promoter Score</SelectItem>
                <SelectItem value="csat">CSAT Rating</SelectItem>
                <SelectItem value="short">Short Question</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Question Text</Label>
            <Textarea
              value={config.question}
              onChange={(e) => onConfigChange({ question: e.target.value })}
              placeholder="Enter your feedback question..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

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
                  value={config.backgroundColor}
                  onChange={(e) => onConfigChange({ backgroundColor: e.target.value })}
                  className="w-12 h-10 p-1 border rounded"
                />
                <Input
                  value={config.backgroundColor}
                  onChange={(e) => onConfigChange({ backgroundColor: e.target.value })}
                  placeholder="#2563eb"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Text Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={config.textColor}
                  onChange={(e) => onConfigChange({ textColor: e.target.value })}
                  className="w-12 h-10 p-1 border rounded"
                />
                <Input
                  value={config.textColor}
                  onChange={(e) => onConfigChange({ textColor: e.target.value })}
                  placeholder="#ffffff"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Position</Label>
            <Select value={config.position} onValueChange={(value) => onConfigChange({ position: value })}>
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
              checked={config.showCloseButton}
              onCheckedChange={(checked) => onConfigChange({ showCloseButton: checked })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
