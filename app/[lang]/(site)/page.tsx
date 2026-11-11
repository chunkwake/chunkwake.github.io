import { Hero } from '@/components/landing/hero';
import { BenchmarkLab } from '@/components/benchmark-lab';
import { LangNotFound } from '@/components/lang-not-found';
import {
  ArchitectureSection,
  CompatibilitySection,
  CtaSection,
  FeaturesSection,
  PluginsSection,
  RoadmapSection,
} from '@/components/landing/sections';
import { getCopy } from '@/lib/dictionary';
import { isLang } from '@/lib/i18n';

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) return <LangNotFound lang={lang} />;
  const copy = getCopy(lang);

  return (
    <>
      <Hero lang={lang} copy={copy} />
      <BenchmarkLab lang={lang} />
      <CompatibilitySection copy={copy} />
      <FeaturesSection lang={lang} copy={copy} />
      <PluginsSection lang={lang} copy={copy} />
      <ArchitectureSection copy={copy} />
      <RoadmapSection copy={copy} />
      <CtaSection lang={lang} copy={copy} />
    </>
  );
}
