import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

import { theme } from '@/theme';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <ScrollViewStyleReset />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              input:-webkit-autofill,
              input:-webkit-autofill:hover,
              input:-webkit-autofill:focus,
              input:-webkit-autofill:active {
                -webkit-box-shadow: 0 0 0 1000px ${theme.colors.surface} inset !important;
                -webkit-text-fill-color: ${theme.colors.text.primary} !important;
                caret-color: ${theme.colors.text.primary} !important;
                transition: background-color 9999s ease-out 0s;
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
