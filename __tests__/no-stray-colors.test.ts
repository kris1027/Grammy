import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

// Spec 0003: every colour comes from src/ui/theme.ts. This scan fails on a hex
// colour literal anywhere else in src/.

const SRC = join(__dirname, '..', 'src');
const ALLOWED = join('ui', 'theme.ts');
const HEX = /#[0-9a-fA-F]{3,8}\b/g;

const filesIn = (dir: string): readonly string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? filesIn(path) : /\.tsx?$/.test(name) ? [path] : [];
  });

test('no hex colour literal in src/ outside theme.ts (covers: AC-1)', () => {
  const found = filesIn(SRC)
    .filter((path) => relative(SRC, path) !== ALLOWED)
    .flatMap((path) =>
      (readFileSync(path, 'utf8').match(HEX) ?? []).map((hex) => `${relative(SRC, path)}: ${hex}`),
    );

  expect(found).toEqual([]);
});
