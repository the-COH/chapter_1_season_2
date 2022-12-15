import * as prettier from 'prettier';

export async function printJsonObjectAsTypescriptConst(constName: string, obj: unknown): Promise<string> {
  const gen = `// GENERATED FILE - edits will be lost\n\nexport const ${constName} = ${JSON.stringify(obj, null, 2)} as const;`;
  const options = await prettier.resolveConfig(__dirname + '/.prettierrc');
  return prettier.format(gen, {
    parser: 'typescript',
    ...options,
  });
}
