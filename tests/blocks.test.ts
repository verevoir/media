import { describe, it, expect } from 'vitest';
import { imageBlock } from '../src/blocks/image.js';
import { videoBlock } from '../src/blocks/video.js';

describe('imageBlock', () => {
  it('should accept valid image data', () => {
    const data = {
      asset: '550e8400-e29b-41d4-a716-446655440000',
      alt: 'A photo',
      displayWidth: 800,
      displayHeight: 600,
    };

    expect(() => imageBlock.validate(data)).not.toThrow();
  });

  it('should accept image data without optional alt', () => {
    const data = {
      asset: '550e8400-e29b-41d4-a716-446655440000',
      displayWidth: 800,
      displayHeight: 600,
    };

    expect(() => imageBlock.validate(data)).not.toThrow();
  });

  it('should reject non-UUID asset reference', () => {
    const data = {
      asset: 'not-a-uuid',
      displayWidth: 800,
      displayHeight: 600,
    };

    expect(() => imageBlock.validate(data)).toThrow();
  });

  it('should reject non-integer display dimensions', () => {
    const data = {
      asset: '550e8400-e29b-41d4-a716-446655440000',
      displayWidth: 800.5,
      displayHeight: 600,
    };

    expect(() => imageBlock.validate(data)).toThrow();
  });

  it('should reject zero display dimensions', () => {
    const data = {
      asset: '550e8400-e29b-41d4-a716-446655440000',
      displayWidth: 0,
      displayHeight: 600,
    };

    expect(() => imageBlock.validate(data)).toThrow();
  });
});

describe('videoBlock', () => {
  it('should accept valid video data with defaults', () => {
    const data = {
      asset: '550e8400-e29b-41d4-a716-446655440000',
      displayWidth: 1280,
      displayHeight: 720,
    };

    expect(() => videoBlock.validate(data)).not.toThrow();
  });

  it('should accept video data with all fields', () => {
    const data = {
      asset: '550e8400-e29b-41d4-a716-446655440000',
      alt: 'A video clip',
      displayWidth: 1280,
      displayHeight: 720,
      autoplay: true,
      loop: true,
    };

    expect(() => videoBlock.validate(data)).not.toThrow();
  });

  it('should reject non-boolean autoplay', () => {
    const data = {
      asset: '550e8400-e29b-41d4-a716-446655440000',
      displayWidth: 1280,
      displayHeight: 720,
      autoplay: 'yes',
    };

    expect(() => videoBlock.validate(data)).toThrow();
  });
});
