import { Jimp } from "jimp";

async function measure() {
  const img = await Jimp.read("public/certificate_template.jpg");
  const width = img.width;
  const height = img.height;
  
  console.log(`Image size: ${width}x${height}`);
  
  // The ribbon is pink. The line is also a dark color.
  // Let's sample pixels down the vertical center (x = width/2)
  const x = Math.floor(width / 2);
  
  for (let y = 200; y < 400; y++) {
    const color = img.getPixelColor(x, y);
    const r = (color >> 24) & 255;
    const g = (color >> 16) & 255;
    const b = (color >> 8) & 255;
    
    // Print the color if it's not white/off-white
    if (r < 240 || g < 240 || b < 240) {
      console.log(`y=${y} ( ${((y/height)*100).toFixed(1)}% ): rgb(${r},${g},${b})`);
    }
  }
}

measure().catch(console.error);
