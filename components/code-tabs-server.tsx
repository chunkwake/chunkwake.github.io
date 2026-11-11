import { codeToHtml } from 'shiki';
import { chunkwakeTheme } from '@/lib/code-theme';
import { CodeTabs, type CodeTab } from './code-tabs';

export async function CodeTabsServer({
  tabs,
  badge,
}: {
  tabs: { id: string; label: string; code: string; lang: string; icon?: 'java' | 'kotlin' }[];
  badge?: string;
}) {
  const highlighted: CodeTab[] = await Promise.all(
    tabs.map(async (tab) => ({
      id: tab.id,
      label: tab.label,
      icon: tab.icon,
      html: await codeToHtml(tab.code, {
        lang: tab.lang,
        theme: chunkwakeTheme,
      }),
    })),
  );

  return <CodeTabs tabs={highlighted} badge={badge} />;
}
