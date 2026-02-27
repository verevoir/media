import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  ImgproxyConfigProvider,
  useImgproxyConfig,
} from '../../src/components/ImgproxyConfigContext.js';

function Consumer() {
  const config = useImgproxyConfig();
  return <div data-testid="consumer">{config.baseUrl}</div>;
}

describe('ImgproxyConfigContext', () => {
  it('should provide the config to children', () => {
    render(
      <ImgproxyConfigProvider
        config={{ baseUrl: 'https://imgproxy.example.com' }}
      >
        <Consumer />
      </ImgproxyConfigProvider>,
    );

    expect(screen.getByTestId('consumer')).toHaveTextContent(
      'https://imgproxy.example.com',
    );
  });

  it('should throw when used outside provider', () => {
    expect(() => render(<Consumer />)).toThrow(
      'useImgproxyConfig must be used within an ImgproxyConfigProvider',
    );
  });
});
