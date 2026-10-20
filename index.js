import z from '@deepseek-ai/schemastery';

/** Durable preference edited from this bundle's configuration page. */
export const Config = z.object({
  language: z.union(['auto', 'en', 'zh']).default('auto').volatile(),
});

export function apply(ctx) {
  ctx.inject(['settings'], child => {
    child.effect(() => child.settings.configure({ auto: false }, ctx.fiber));
  });
}
