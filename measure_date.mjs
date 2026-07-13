import { Jimp } from "jimp";

async function measure() {
  const img = await Jimp.read("public/certificate_template.jpg");
  const width = img.width;
  const height = img.height;
  
  const x = Math.floor(width * 0.2); // Left side for the date
  
  for (let y = 550; y < 650; y++) {
    const color = img.getPixelColor(x, y);
    const r = (color >> 24) & 255;
    const g = (color >> 16) & 255;
    const b = (color >> 8) & 255;
    
    if (r < 240 || g < 240 || b < 240) {
      console.log(`y=${y} ( ${((y/height)*100).toFixed(1)}% ): rgb(${r},${g},${b})`);
    }
  }
}

measure().catch(console.error);
