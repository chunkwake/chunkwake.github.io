import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { FeatureMatrix } from './feature-matrix';
import { LangIcon } from './lang-icon';
import { MatrixTotals } from './matrix-totals';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    FeatureMatrix,
    LangIcon,
    MatrixTotals,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
