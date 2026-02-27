import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { AssetSource } from '../types.js';

const AssetSourceContext = createContext<AssetSource | null>(null);

export interface AssetSourceProviderProps {
  source: AssetSource;
  children: ReactNode;
}

export function AssetSourceProvider({
  source,
  children,
}: AssetSourceProviderProps) {
  return (
    <AssetSourceContext.Provider value={source}>
      {children}
    </AssetSourceContext.Provider>
  );
}

export function useAssetSource(): AssetSource {
  const source = useContext(AssetSourceContext);
  if (!source) {
    throw new Error(
      'useAssetSource must be used within an AssetSourceProvider',
    );
  }
  return source;
}
