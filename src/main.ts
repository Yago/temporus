import Alpine from 'alpinejs';

import timelineStore from './stores/timeline';
import utilsStore from './stores/utils';

window.Alpine = Alpine;
Alpine.store('timeline', timelineStore);
Alpine.store('utils', utilsStore);

Alpine.start();
