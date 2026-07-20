import fs from 'fs';

const mealsData = fs.readFileSync('src/lib/mddw/mealsData.ts', 'utf-8');
const translations = fs.readFileSync('src/lib/mddw/translations.ts', 'utf-8');

const nameKeys = [...mealsData.matchAll(/nameKey:\s*"([^"]+)"/g)].map(m => m[1]);

const uniqueKeys = [...new Set(nameKeys)];

for (const key of uniqueKeys) {
  if (!translations.includes(`  ${key}:`)) {
    console.log(`Missing in translations: ${key}`);
  }
}
