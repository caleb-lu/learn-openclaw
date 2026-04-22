import { I18nProvider } from "@/lib/i18n";
import { Header } from "@/components/layout/header";
import type { Locale } from "@/lib/constants";
import { LOCALES } from "@/lib/constants";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const validLocale = (locale === "zh" ? "zh" : "en") as Locale;

  return (
    <I18nProvider locale={validLocale}>
      <html lang={validLocale} suppressHydrationWarning>
        <body className="flex min-h-screen flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
          <script
            dangerouslySetInnerHTML={{
              __html: `
                try {
                  const theme = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              `,
            }}
          />
          <Header />
          <main className="flex-1">
            {children}
          </main>
        </body>
      </html>
    </I18nProvider>
  );
}
