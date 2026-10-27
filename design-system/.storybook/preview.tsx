import type { Preview, Decorator } from '@storybook/react-vite';
import { useEffect } from 'react';
import '../src/styles/base.css';

/** Sets the theme on <html> the same way the product does, then frames the story on the app canvas. */
const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme as 'light' | 'dark' | 'system';
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') delete root.dataset.theme;
    else root.dataset.theme = theme;
    document.body.style.background = 'var(--lo-color-canvas)';
  }, [theme]);
  const onSurface = context.parameters.surface === 'card';
  return (
    <div
      className="lo-root"
      style={{
        background: 'var(--lo-color-canvas)',
        padding: context.parameters.layout === 'fullscreen' ? 0 : 24,
        minHeight: '100%',
      }}
    >
      {onSurface ? (
        <div style={{ background: 'var(--lo-color-surface)', borderRadius: 12, boxShadow: 'var(--lo-shadow-card)', padding: 20, maxWidth: 720 }}>
          <Story />
        </div>
      ) : (
        <Story />
      )}
    </div>
  );
};

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Color theme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
          { value: 'system', title: 'Match system' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
  decorators: [withTheme],
  parameters: {
    layout: 'padded',
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    options: {
      storySort: { order: ['Foundations', ['Introduction', 'Color', 'Typography', 'Spacing and radius', 'Icons'], 'Components', 'Patterns'] },
    },
    // Accessibility violations fail the story tests. Fix them; don't downgrade this.
    a11y: { test: 'error' },
  },
};

export default preview;
