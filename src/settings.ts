import {z} from 'zod';

export const engineSchema = z.object({
  tileMotion: z.number().min(0).max(2),
  revealSoftness: z.number().min(0).max(1),
  lighting: z.number().min(0).max(1),
  grain: z.number().min(0).max(.3),
  seed: z.number().int().min(0).max(99999),
});

export const journeySchema = engineSchema.extend({
  durationSeconds: z.number().min(15).max(90),
  soundtrack: z.boolean(),
});

export const labSchema = engineSchema.extend({
  scene: z.enum(['portrait', 'lounge', 'flight', 'suite', 'dinner', 'card']),
  assetFolder: z.string(),
  revealMode: z.enum(['automatic', 'spiral', 'wave', 'curtain']),
  originX: z.number().min(0).max(1800),
  originY: z.number().min(0).max(1080),
});

export type JourneyProps = z.infer<typeof journeySchema>;
export type LabProps = z.infer<typeof labSchema>;
