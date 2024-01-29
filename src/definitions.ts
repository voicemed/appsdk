export interface VoicemedPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}
