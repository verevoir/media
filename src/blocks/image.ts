import { defineBlock, reference, text, number } from '@nextlake/schema';

export const imageBlock = defineBlock({
  name: 'image',
  fields: {
    asset: reference('Asset', 'asset'),
    alt: text('Alt Text').optional(),
    displayWidth: number('Display Width').int().min(1),
    displayHeight: number('Display Height').int().min(1),
  },
});
