import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { StatusBar } from '@/components/status-bar';
import { ScrollReveal } from '@/components/scroll-reveal';
import { ScrollProgress } from '@/components/scroll-progress';
import { getCopy } from '@/lib/dictionary';

export default async function SiteLayout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: React.ReactNode;
}) {
  const { lang } = await params;
  const copy = getCopy(lang);

  return (
    <div className="cw-site">
      <ScrollProgress />
      <ScrollReveal />
      <SiteHeader lang={lang} copy={copy} />
      <main className="cw-main">{children}</main>
      <SiteFooter lang={lang} copy={copy} />
      <StatusBar />
    </div>
  );
}
