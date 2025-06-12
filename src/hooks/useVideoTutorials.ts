
import { useState } from 'react';

export const useVideoTutorials = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openTutorials = () => setIsOpen(true);
  const closeTutorials = () => setIsOpen(false);

  return {
    isOpen,
    openTutorials,
    closeTutorials,
  };
};
