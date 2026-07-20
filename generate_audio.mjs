import fs from 'fs';
import path from 'path';
import * as googleTTS from 'google-tts-api';

const outDir = path.join(process.cwd(), 'public', 'audio');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const FOOD_GROUPS = [
  { id: "grains", en: "Grains & Starches", hi: "अनाज और स्टार्च", te: "ధాన్యాలు మరియు పిండి పదార్థాలు" },
  { id: "pulses", en: "Pulses & Beans", hi: "दालें और फलियाँ", te: "పప్పులు మరియు చిక్కుళ్లు" },
  { id: "nuts", en: "Nuts & Seeds", hi: "मेवे और बीज", te: "గింజలు మరియు విత్తనాలు" },
  { id: "dairy", en: "Dairy", hi: "डेयरी", te: "పాలు మరియు పాల పదార్థాలు" },
  { id: "meat", en: "Meat, Fish & Poultry", hi: "मांस, मछली और मुर्गी", te: "మాంసం మరియు చేపలు" },
  { id: "eggs", en: "Eggs", hi: "अंडे", te: "గుడ్లు" },
  { id: "dglv", en: "Dark Green Leafy Veg", hi: "हरी पत्तेदार सब्जियाँ", te: "ఆకుకూరలు" },
  { id: "vitaminA", en: "Vitamin A Rich", hi: "विटामिन A से भरपूर", te: "విటమిన్ ఎ ఉన్నవి" },
  { id: "otherVeg", en: "Other Vegetables", hi: "अन्य सब्जियाँ", te: "ఇతర కూరగాయలు" },
  { id: "otherFruit", en: "Other Fruits", hi: "अन्य फल", te: "ఇతర పండ్లు" }
];

async function generate() {
  for (const group of FOOD_GROUPS) {
    for (const lang of ['en', 'hi', 'te']) {
      const text = group[lang];
      const langCode = lang === 'te' ? 'te-IN' : lang === 'hi' ? 'hi-IN' : 'en-US';
      const fileName = `${langCode}_${group.id}.mp3`;
      const filePath = path.join(outDir, fileName);
      
      console.log(`Generating ${fileName}...`);
      try {
        const url = googleTTS.getAudioUrl(text, {
          lang: langCode,
          slow: false,
          host: 'https://translate.google.com',
        });
        
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();
        fs.writeFileSync(filePath, Buffer.from(buffer));
        
        // Wait a bit to avoid rate limits
        await new Promise(r => setTimeout(r, 1000));
      } catch (err) {
        console.error(`Failed to generate ${fileName}:`, err.message);
      }
    }
  }
  console.log("Audio generation complete!");
}

generate();
