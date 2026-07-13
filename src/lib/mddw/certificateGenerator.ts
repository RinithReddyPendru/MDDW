import { certBgBase64 } from "./certificateBg";

export const generateNativeCertificate = async (
  userName: string,
  formattedDate: string,
  fileName: string,
  _element?: any // Ignored in Canvas mode
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement("canvas");
      // Double the base resolution (1024x682 -> 2048x1364) for ultra-sharp text
      canvas.width = 2048;
      canvas.height = 1364;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Canvas 2D context not supported");
      }

      const img = new Image();
      img.src = certBgBase64;
      img.onload = () => {
        // Draw background image perfectly filling the canvas
        ctx.drawImage(img, 0, 0, 2048, 1364);

        // 1. Draw the Name
        ctx.fillStyle = "#cb1155";
        ctx.textAlign = "center";
        
        // alphabetic baseline means the *bottom* of the letters (not counting tails like 'y') will sit on the coordinate
        ctx.textBaseline = "alphabetic";
        ctx.font = "bold 56px 'Times New Roman', Times, serif";
        
        if ('letterSpacing' in ctx) {
          (ctx as any).letterSpacing = "0.05em";
        }
        
        // Mathematical measurement: The drawn line in the image is exactly at 43.7% of the height
        // 1364px * 0.437 = 596px
        // We subtract 4px so the text rests just *slightly* above the line without cutting into it.
        const nameY = (1364 * 0.437) - 4;
        ctx.fillText(userName || "ASHA", 1024, nameY);

        // 2. Draw the Date
        ctx.fillStyle = "#333333"; // Use dark gray instead of pink to match label
        ctx.textAlign = "left";
        ctx.font = "400 28px sans-serif"; // Smaller and regular weight
        if ('letterSpacing' in ctx) {
          (ctx as any).letterSpacing = "0px";
        }
        
        // Date X: 18.5% -> 2048 * 0.185 = 378
        // Date Y: 93.1% -> 1364 * 0.931 = 1270 (line is exactly here)
        const dateX = 2048 * 0.185;
        const dateY = (1364 * 0.931) - 2; // subtract 2px padding to sit on the line
        ctx.fillText(formattedDate, dateX, dateY);

        // Trigger download
        const link = document.createElement("a");
        link.download = fileName;
        link.href = canvas.toDataURL("image/png");
        link.click();
        
        resolve();
      };
      
      img.onerror = () => reject(new Error("Failed to load certificate background image."));
    } catch (e) {
      reject(e);
    }
  });
};
