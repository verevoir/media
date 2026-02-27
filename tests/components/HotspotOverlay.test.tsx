import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HotspotOverlay } from '../../src/components/HotspotOverlay.js';

describe('HotspotOverlay', () => {
  it('should render the image', () => {
    render(
      <HotspotOverlay
        src="https://example.com/photo.jpg"
        hotspot={null}
        onChange={() => {}}
      />,
    );

    const img = screen.getByAltText('Hotspot preview');
    expect(img).toBeInTheDocument();
  });

  it('should show a marker when hotspot is set', () => {
    render(
      <HotspotOverlay
        src="https://example.com/photo.jpg"
        hotspot={{ x: 0.5, y: 0.3 }}
        onChange={() => {}}
      />,
    );

    expect(screen.getByTestId('hotspot-marker')).toBeInTheDocument();
  });

  it('should not show a marker when hotspot is null', () => {
    render(
      <HotspotOverlay
        src="https://example.com/photo.jpg"
        hotspot={null}
        onChange={() => {}}
      />,
    );

    expect(screen.queryByTestId('hotspot-marker')).toBeNull();
  });

  it('should call onChange with normalised coordinates on click', () => {
    const onChange = vi.fn();

    render(
      <HotspotOverlay
        src="https://example.com/photo.jpg"
        hotspot={null}
        onChange={onChange}
      />,
    );

    const overlay = screen.getByTestId('hotspot-overlay');

    // Mock getBoundingClientRect for deterministic coords
    vi.spyOn(overlay, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 400,
      height: 300,
      right: 400,
      bottom: 300,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    fireEvent.click(overlay, { clientX: 200, clientY: 150 });

    expect(onChange).toHaveBeenCalledWith({ x: 0.5, y: 0.5 });
  });
});
