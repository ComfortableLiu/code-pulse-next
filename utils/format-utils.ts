import * as prettier from 'prettier/standalone';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import * as parserBabel from 'prettier/parser-babel';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import * as parserHtml from 'prettier/parser-html';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import * as parserMarkdown from 'prettier/parser-markdown';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import * as parserTypescript from 'prettier/parser-typescript';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import * as parserPostcss from 'prettier/parser-postcss';
import prettierPluginEstree from "prettier/plugins/estree";

/**
 * 格式化代码
 * @param text
 * @param parser - 'babel' | 'json' | 'html' | 'css' | 'markdown' | 'text' | 'typescript'
 */
export async function formatCode(text: string, parser: 'babel' | 'json' | 'html' | 'css' | 'markdown' | 'text' | 'typescript') {
  if (!parser || parser === 'text') return text
  return prettier.format(text, {
    parser,
    tabWidth: 2,
    singleQuote: true,
    semi: false,
    useTabs: false,
    trailingComma: "all",
    printWidth: parser === 'json' ? 1 : undefined,
    plugins: [
      parserBabel,
      parserHtml,
      parserMarkdown,
      prettierPluginEstree,
      parserTypescript,
      parserPostcss,
    ],
  });
}
