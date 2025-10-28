import { Alpine as AlpineType } from 'alpinejs';

import type { Settings } from './types';

declare global {
  interface Window {
    Alpine: AlpineType;
    initTimeline: () => void;
    settings: Settings;
  }
}

declare module '*.csv' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: Record<string, any>[];
  export default content;
}

export {};
