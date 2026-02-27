import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { ImgproxyConfig } from '../types.js';

const ImgproxyConfigContext = createContext<ImgproxyConfig | null>(null);

export interface ImgproxyConfigProviderProps {
  config: ImgproxyConfig;
  children: ReactNode;
}

export function ImgproxyConfigProvider({
  config,
  children,
}: ImgproxyConfigProviderProps) {
  return (
    <ImgproxyConfigContext.Provider value={config}>
      {children}
    </ImgproxyConfigContext.Provider>
  );
}

export function useImgproxyConfig(): ImgproxyConfig {
  const config = useContext(ImgproxyConfigContext);
  if (!config) {
    throw new Error(
      'useImgproxyConfig must be used within an ImgproxyConfigProvider',
    );
  }
  return config;
}
