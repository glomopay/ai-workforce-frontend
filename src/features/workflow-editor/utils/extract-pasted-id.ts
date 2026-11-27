// Fields where users tend to paste a whole URL; a pasted match is replaced by the ID it captures.
const PASTED_ID_PATTERNS: Record<string, RegExp> = {
  spreadsheetId: /\/spreadsheets\/d\/([\w-]+)/,
};

export const extractPastedId = (propertyName: string, pasted: string): string | undefined => PASTED_ID_PATTERNS[propertyName]?.exec(pasted)?.[1];
