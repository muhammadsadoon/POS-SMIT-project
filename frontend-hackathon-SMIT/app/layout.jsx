import { Providers } from '@/components/Providers';

export const metadata = {
  title: 'POS/Inventory Management Dashboard',
  description: 'A modern POS and inventory management system',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body cz-shortcut-listen="true">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

