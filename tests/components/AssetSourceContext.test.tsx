import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  AssetSourceProvider,
  useAssetSource,
} from '../../src/components/AssetSourceContext.js';
import type { AssetSource } from '../../src/types.js';

const mockSource: AssetSource = {
  async getAsset() {
    return null;
  },
  async listAssets() {
    return [];
  },
};

function Consumer() {
  const source = useAssetSource();
  return <div data-testid="consumer">{source ? 'connected' : 'none'}</div>;
}

describe('AssetSourceContext', () => {
  it('should provide the source to children', () => {
    render(
      <AssetSourceProvider source={mockSource}>
        <Consumer />
      </AssetSourceProvider>,
    );

    expect(screen.getByTestId('consumer')).toHaveTextContent('connected');
  });

  it('should throw when used outside provider', () => {
    expect(() => render(<Consumer />)).toThrow(
      'useAssetSource must be used within an AssetSourceProvider',
    );
  });
});
