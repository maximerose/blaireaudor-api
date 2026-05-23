import { UI } from '@/shared/constants';
import { useEffect } from 'react';

export const useDocumentTitle = (title?: string, enabled = true) => {
  useEffect(() => {
    if (!enabled || !title) return;

    if (title === UI.APP_NAME) {
      document.title = title;
    } else {
      document.title = `${title} | ${UI.APP_NAME}`;
    }
  }, [title, enabled]);
};
