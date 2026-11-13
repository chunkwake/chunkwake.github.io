export type TerminalEvent = {
  type: 'input' | 'output';
  text: string;
  at: number;
  level?: 'info' | 'warn' | 'error';
};

export type TerminalDemoData = {
  id: string;
  shell: 'cli' | 'console';
  prompt: string;
  title: { ru: string; en: string };
  description: { ru: string; en: string };
  events: TerminalEvent[];
  capturedAt: string;
  core: {
    repo: string;
    branch: string;
    coreSha: string | null;
  };
  binary: {
    version: string;
    profile: string;
  };
  fixture: string;
};

export async function loadTerminalDemo(id: string): Promise<TerminalDemoData> {
  const response = await fetch(`/terminal/${encodeURIComponent(id)}.json`, {
    cache: 'no-cache',
  });

  if (!response.ok) throw new Error(`terminal demo ${id}: HTTP ${response.status}`);
  return (await response.json()) as TerminalDemoData;
}
