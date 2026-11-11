import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { CommandsReference } from './commands-reference';
import { FeatureMatrix } from './feature-matrix';
import { LangIcon } from './lang-icon';
import { MatrixTotals } from './matrix-totals';
import { MigrationChecklist } from './migration-checklist';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    CommandsReference,
    FeatureMatrix,
    LangIcon,
    MatrixTotals,
    MigrationChecklist,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
