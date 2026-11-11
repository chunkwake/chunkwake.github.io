import type { ThemeRegistration } from 'shiki';

export const chunkwakeTheme: ThemeRegistration = {
  name: 'chunkwake',
  type: 'dark',
  colors: {
    'editor.background': '#141414',
    'editor.foreground': '#d3d3ce',
  },
  tokenColors: [
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#80807a', fontStyle: 'italic' } },
    { scope: ['keyword', 'storage.type', 'storage.modifier', 'keyword.control'], settings: { foreground: '#c2a98a' } },
    { scope: ['string', 'constant.character', 'string.unquoted'], settings: { foreground: '#9db283' } },
    { scope: ['constant.numeric', 'constant.language'], settings: { foreground: '#c7a96b' } },
    { scope: ['entity.name.function', 'support.function', 'meta.function-call'], settings: { foreground: '#a8b6c4' } },
    { scope: ['entity.name.type', 'support.class', 'entity.other.inherited-class'], settings: { foreground: '#b9a9c4' } },
    { scope: ['variable', 'variable.other', 'meta.object-literal.key', 'support.type.property-name'], settings: { foreground: '#e7e7e7' } },
    { scope: ['punctuation', 'meta.brace'], settings: { foreground: '#9a9a96' } },
    { scope: ['entity.name.tag', 'support.type.property-name.yaml'], settings: { foreground: '#c2a98a' } },
  ],
};
