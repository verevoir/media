import type { MouseEvent } from 'react';
import type { Hotspot } from '../types.js';

export interface HotspotOverlayProps {
  /** Source URL for the image preview */
  src: string;
  /** Current hotspot value, or null if not set */
  hotspot: Hotspot | null;
  /** Called when the user clicks to set a new hotspot */
  onChange: (hotspot: Hotspot) => void;
}

/**
 * Click-to-set hotspot overlay on an image preview.
 *
 * Renders the image with a positioned marker showing the current hotspot.
 * Clicking anywhere on the image converts pixel coordinates to 0–1
 * normalised percentages and calls onChange.
 */
export function HotspotOverlay({
  src,
  hotspot,
  onChange,
}: HotspotOverlayProps) {
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    onChange({
      x: Math.round(x * 1000) / 1000,
      y: Math.round(y * 1000) / 1000,
    });
  };

  return (
    <div
      data-testid="hotspot-overlay"
      onClick={handleClick}
      style={{
        position: 'relative',
        display: 'inline-block',
        cursor: 'crosshair',
      }}
    >
      <img src={src} alt="Hotspot preview" style={{ display: 'block' }} />
      {hotspot && (
        <div
          data-testid="hotspot-marker"
          style={{
            position: 'absolute',
            left: `${hotspot.x * 100}%`,
            top: `${hotspot.y * 100}%`,
            width: 16,
            height: 16,
            marginLeft: -8,
            marginTop: -8,
            borderRadius: '50%',
            border: '2px solid white',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}
