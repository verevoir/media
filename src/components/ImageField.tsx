import { useEffect, useState } from 'react';
import type { AssetInfo } from '../types.js';
import { buildImageUrl } from '../url.js';
import { useAssetSource } from './AssetSourceContext.js';
import { useImgproxyConfig } from './ImgproxyConfigContext.js';

export interface ImageFieldProps {
  /** Currently selected asset ID (UUID) or empty string */
  value: string;
  /** Called when the user selects a different asset */
  onChange: (assetId: string) => void;
  /** Label displayed above the field */
  label?: string;
}

/**
 * Asset picker with thumbnail preview.
 *
 * Reads available assets from the AssetSource context and renders a select
 * dropdown. When an asset is selected, shows a thumbnail preview using
 * the imgproxy URL builder.
 */
export function ImageField({ value, onChange, label }: ImageFieldProps) {
  const source = useAssetSource();
  const config = useImgproxyConfig();
  const [assets, setAssets] = useState<AssetInfo[]>([]);
  const [selected, setSelected] = useState<AssetInfo | null>(null);

  useEffect(() => {
    source.listAssets({ limit: 100 }).then(setAssets);
  }, [source]);

  useEffect(() => {
    if (value) {
      source.getAsset(value).then(setSelected);
    } else {
      setSelected(null);
    }
  }, [value, source]);

  const thumbnailUrl =
    selected && selected.width
      ? buildImageUrl(selected, { width: 200, height: 150, fit: 'fit' }, config)
      : null;

  return (
    <div data-field="image">
      {label && <label>{label}</label>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-testid="image-field-select"
      >
        <option value="">Select an asset...</option>
        {assets.map((asset) => (
          <option key={asset.id} value={asset.id}>
            {asset.filename}
          </option>
        ))}
      </select>
      {thumbnailUrl && (
        <img
          src={thumbnailUrl}
          alt={selected?.filename ?? ''}
          data-testid="image-field-preview"
        />
      )}
    </div>
  );
}
