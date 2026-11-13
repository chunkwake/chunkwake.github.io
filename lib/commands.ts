import data from '@/content/data/commands.json';

export type CommandLevel = 0 | 2 | 3 | 4;

export type CommandEntry = {
  name: string;
  usage: string;
  level: CommandLevel;
  summary: { ru: string; en: string };
  difference: { ru: string; en: string };
  extension?: boolean;
  /** A new core command whose card still uses the Russian description. */
  untranslated?: boolean;
};

export type CommandGroup = {
  id: string;
  title: { ru: string; en: string };
  note: { ru: string; en: string };
  commands: CommandEntry[];
};

export const commandGroups = data.groups as CommandGroup[];

export const commandTotal = commandGroups.reduce((sum, group) => sum + group.commands.length, 0);

export const commandSource = data.source;
