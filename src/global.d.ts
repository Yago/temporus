import { Alpine as AlpineType } from 'alpinejs';

declare global {
  var Alpine: AlpineType;
  var initTimeline: () => void;
}
