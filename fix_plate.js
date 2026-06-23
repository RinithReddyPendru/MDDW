const fs = require('fs');
let code = fs.readFileSync('src/routes/plate.tsx', 'utf8');

const target = `            <Link
              to="/"
              className="flex-1 rounded-xl bg-primary text-primary-foreground py-2.5 font-bold text-center active:scale-[0.98] transition text-xs shadow-md"
            >`;

const replacement = `            <button
              onClick={() => {
                const groups = Array.from(activeGroups).map(id => FOOD_GROUPS.find(g => g.id === id)?.name).join(', ');
                const text = \`Look at this Healthy Plate I built on the MDDW App! I got \${activeGroups.size}/10 food groups: \${groups}. Build yours today!\`;
                window.open(\`https://wa.me/?text=\${encodeURIComponent(text)}\`, '_blank');
              }}
              className="flex-1 rounded-xl bg-green-500 hover:bg-green-600 text-white py-2.5 font-bold text-center active:scale-[0.98] transition text-xs shadow-md"
            >
              💬 {t("shareWhatsapp")}
            </button>
            <Link
              to="/"
              className="flex-1 rounded-xl bg-primary text-primary-foreground py-2.5 font-bold text-center active:scale-[0.98] transition text-xs shadow-md"
            >`;

code = code.replace(target, replacement);

fs.writeFileSync('src/routes/plate.tsx', code);
