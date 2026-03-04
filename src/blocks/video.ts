import {
  defineBlock,
  reference,
  text,
  number,
  boolean,
} from '@verevoir/schema';

export const videoBlock = defineBlock({
  name: 'video',
  fields: {
    asset: reference('Asset', 'asset'),
    alt: text('Alt Text').optional(),
    displayWidth: number('Display Width').int().min(1),
    displayHeight: number('Display Height').int().min(1),
    autoplay: boolean('Autoplay').default(false),
    loop: boolean('Loop').default(false),
  },
});
