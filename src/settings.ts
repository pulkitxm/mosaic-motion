import {z} from 'zod';

export const engineSchema = z.object({
  tileMotion: z.number().min(0).max(2).step(.05),
  revealSoftness: z.number().min(0).max(1).step(.05),
  lighting: z.number().min(0).max(1).step(.05),
  grain: z.number().min(0).max(.3).step(.01),
  seed: z.number().int().min(0).max(99999),
});

export const journeySchema = engineSchema.extend({
  durationSeconds: z.number().min(15).max(90),
  soundtrack: z.boolean(),
});

export const labSchema = engineSchema.extend({
  scene: z.enum(['portrait', 'lounge', 'flight', 'suite', 'dinner', 'card']),
});

export const engineDefaults = {tileMotion: .85, revealSoftness: .36, lighting: .55, grain: .075, seed: 42};
export const journeyDefaults = {...engineDefaults, durationSeconds: 30, soundtrack: true};
export const labDefaults = {...engineDefaults, scene: 'portrait' as const};
export type JourneyProps = z.infer<typeof journeySchema>;
export type LabProps = z.infer<typeof labSchema>;
