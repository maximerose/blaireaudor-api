import { UI } from '@/constants';
import { useEffect } from 'react';

export const useDocumentTitle = (title: string) => {
  useEffect(() => {
    document.title = `${title} | ${UI.APP_NAME}`;
  }, ['title']);
};
