import { Alpine as AlpineType } from 'alpinejs';

import type { Settings } from './types';

declare global {
  var Alpine: AlpineType;
  var initTimeline: () => void;
  var settings: Settings;
}
