
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SurveyBuilderHeaderProps {
  title: string;
  onBack: () => void;
  onSave: () => void;
  isLoading: boolean;
  status: string;
  onStatusChange: (status: string) => void;
}

export const SurveyBuilderHeader = ({
  title,
  onBack,
  onSave,
  isLoading,
  status,
  onStatusChange,
}: SurveyBuilderHeaderProps) => {
  return (
    <div className="border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          <div>
            <h1 className="text-lg font-medium text-gray-900">{title}</h1>
            <p className="text-sm text-gray-500">Survey Builder</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">Draft</Badge>
                </div>
              </SelectItem>
              <SelectItem value="active">
                <div className="flex items-center space-x-2">
                  <Badge variant="default">Active</Badge>
                </div>
              </SelectItem>
              <SelectItem value="paused">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">Paused</Badge>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={onSave}
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{isLoading ? 'Saving...' : 'Save'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
