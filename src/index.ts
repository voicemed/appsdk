import { registerPlugin } from '@capacitor/core';

import type { VoicemedPlugin } from './definitions';

const Voicemed = registerPlugin<VoicemedPlugin>('Voicemed', {
  web: () => import('./web').then(m => new m.VoicemedWeb()),
});

export * from './definitions';
export { Voicemed };
