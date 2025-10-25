import Alpine from 'alpinejs';

import settings from './config/settings.json';
import timelineStore from './stores/timeline';
import utilsStore from './stores/utils';

window.settings = settings;

window.Alpine = Alpine;
Alpine.store('timeline', timelineStore);
Alpine.store('utils', utilsStore);

Alpine.start();
