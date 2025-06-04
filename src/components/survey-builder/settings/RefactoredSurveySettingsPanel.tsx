
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DisplaySettingsCard } from './DisplaySettingsCard';
import { StylingSettingsCard } from './StylingSettingsCard';

interface RefactoredSurveySettingsPanelProps {
  survey: any;
  onUpdate: (updates: any) => void;
}

export const RefactoredSurveySettingsPanel = ({ survey, onUpdate }: RefactoredSurveySettingsPanelProps) => {
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
      <DisplaySettingsCard
        settings={settings}
        onSettingsChange={setSettings}
      />

      <StylingSettingsCard
        settings={settings}
        onSettingsChange={setSettings}
      />

      <div className="lg:col-span-2">
        <Button onClick={handleSave} className="bg-teal-600 hover:bg-teal-700 text-white">
          Save Settings
        </Button>
      </div>
    </div>
  );
};
