
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Save, Plus, Trash2, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FeedbackConfig, FeedbackStep } from '@/components/FeedbackBuilder';

interface FeedbackBuilderPanelProps {
  configs: FeedbackConfig[];
  selectedConfig?: FeedbackConfig;
  selectedConfigId: string;
  onConfigChange: (updates: Partial<FeedbackConfig>) => void;
  onSelectConfig: (configId: string) => void;
  onAddConfig: () => void;
  onDeleteConfig: (configId: string) => void;
  onStepChange: (stepId: string, updates: Partial<FeedbackStep>) => void;
  onAddStep: () => void;
  onDeleteStep: (stepId: string) => void;
}

export const FeedbackBuilderPanel = ({ 
  configs,
  selectedConfig, 
  selectedConfigId,
  onConfigChange, 
  onSelectConfig,
  onAddConfig,
  onDeleteConfig,
  onStepChange,
  onAddStep,
  onDeleteStep
}: FeedbackBuilderPanelProps) => {
  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Feedback Widgets</h2>
        <div className="flex gap-2">
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link to="/feedback/responses">
              <BarChart3 className="h-4 w-4" />
              View Responses
            </Link>
          </Button>
          <Button onClick={onAddConfig} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Widget
          </Button>
        </div>
      </div>

      {/* Feedback Widget List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Feedback Widgets</CardTitle>
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
                  <h4 className="font-medium">Feedback Widget #{index + 1}</h4>
                  <p className="text-sm text-gray-500">
                    {config.steps.length} steps • {config.position}
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
          {/* Steps Configuration */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>Feedback Steps</CardTitle>
              <Button onClick={onAddStep} size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Step
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedConfig.steps.map((step, index) => (
                <div key={step.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Step {index + 1}</span>
                      <Switch
                        checked={step.required}
                        onCheckedChange={(checked) => onStepChange(step.id, { required: checked })}
                      />
                      <span className="text-xs text-gray-500">
                        {step.required ? 'Required' : 'Optional'}
                      </span>
                    </div>
                    {selectedConfig.steps.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteStep(step.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Step Type</Label>
                    <Select 
                      value={step.type} 
                      onValueChange={(value: 'nps' | 'csat' | 'short') => onStepChange(step.id, { type: value })}
                    >
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
                      value={step.question}
                      onChange={(e) => onStepChange(step.id, { question: e.target.value })}
                      placeholder="Enter your question..."
                      rows={2}
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
                      placeholder="#2563eb"
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
                      placeholder="#ffffff"
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

              <Button className="w-full flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
