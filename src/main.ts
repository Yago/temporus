import Alpine from 'alpinejs';

import focus from '@alpinejs/focus';
import persist from '@alpinejs/persist';
import sort from '@alpinejs/sort';

import settings from './config/settings.json';
import timelineStore from './stores/timeline';
import utilsStore from './stores/utils';

window.settings = settings;

window.Alpine = Alpine;

Alpine.plugin(persist);
Alpine.plugin(focus);
Alpine.plugin(sort);

Alpine.store('timeline', timelineStore);
Alpine.store('utils', utilsStore);

Alpine.start();
