import Providers from "@/components/providers";
import "./globals.css";
import '@mantine/core/styles.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        cz-shortcut-listen="true"
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
