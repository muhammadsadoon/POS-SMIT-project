import Providers from "@/components/providers";
import PageTransitionWrapper from "@/components/layouts/page-transition-wrapper";
import { ColorSchemeScript } from "@/components/theme-provider";
import "./globals.css";
import '@mantine/core/styles.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body cz-shortcut-listen="true" suppressHydrationWarning>
        <Providers>
          <PageTransitionWrapper>
            {children}
          </PageTransitionWrapper>
        </Providers>
      </body>
    </html>
  );
}
