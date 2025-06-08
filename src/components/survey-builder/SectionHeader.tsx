
import { ChevronDown } from 'lucide-react';
import { CollapsibleTrigger } from '@/components/ui/collapsible';

interface SectionHeaderProps {
  icon: any;
  title: string;
  subtitle: string;
  isOpen: boolean;
  onToggle: () => void;
}

export const SectionHeader = ({ icon: Icon, title, subtitle, isOpen, onToggle }: SectionHeaderProps) => (
  <CollapsibleTrigger
    className="flex items-center justify-between w-full p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
    onClick={onToggle}
  >
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
        <Icon className="h-4 w-4 text-blue-600" />
      </div>
      <div className="text-left">
        <div className="font-medium text-gray-900">{title}</div>
        <div className="text-sm text-gray-500">{subtitle}</div>
      </div>
    </div>
    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
  </CollapsibleTrigger>
);
