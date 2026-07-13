import { Jimp } from "jimp";

async function measure() {
  const img = await Jimp.read("public/certificate_template.jpg");
  
  const y = 635; // The line we found
  
  for (let x = 100; x < 300; x++) {
    const color = img.getPixelColor(x, y);
    const r = (color >> 24) & 255;
    const g = (color >> 16) & 255;
    const b = (color >> 8) & 255;
    
    if (r < 200 && g < 200 && b < 200) {
      console.log(`x=${x} ( ${(x/img.width*100).toFixed(1)}% ): rgb(${r},${g},${b})`);
      break;
    }
  }
}

measure().catch(console.error);
