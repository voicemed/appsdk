import { WebPlugin } from '@capacitor/core';

import type { VoicemedPlugin } from './definitions';

export class VoicemedWeb extends WebPlugin implements VoicemedPlugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}
