
import { useState } from 'react';

export const useSurveyBuilderSections = () => {
  const [contentOpen, setContentOpen] = useState(true);
  const [questionsOpen, setQuestionsOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [triggerOpen, setTriggerOpen] = useState(false);

  return {
    contentOpen,
    setContentOpen,
    questionsOpen,
    setQuestionsOpen,
    settingsOpen,
    setSettingsOpen,
    triggerOpen,
    setTriggerOpen,
  };
};
