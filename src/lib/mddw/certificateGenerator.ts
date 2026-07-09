import { certBgBase64 } from "./certificateBg";

export const generateNativeCertificate = async (
  userName: string,
  formattedDate: string,
  fileName: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // We use 2048x1364 to perfectly match the 1.5 aspect ratio of the 1024x682 background image, 
      // preventing any blurriness or stretching from happening on the canvas.
      const canvas = document.createElement("canvas");
      canvas.width = 2048;
      canvas.height = 1364;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Canvas 2D context not supported");
      }

      const img = new Image();
      img.src = certBgBase64;
      img.onload = () => {
        // Draw background
        ctx.drawImage(img, 0, 0, 2048, 1364);

        // Name text
        ctx.fillStyle = "#cb1155";
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.font = "bold 84px 'Times New Roman', Times, serif";
        
        // Handle letter-spacing if supported
        if ('letterSpacing' in ctx) {
          (ctx as any).letterSpacing = "0.05em";
        }
        
        // Name Y position: 54% to sit below "PROUDLY PRESENTED TO"
        const nameY = 1364 * 0.54;
        ctx.fillText(userName || "ASHA", 1024, nameY);

        // Date text
        ctx.textAlign = "left";
        ctx.font = "600 36px sans-serif";
        // Reset letter spacing for date
        if ('letterSpacing' in ctx) {
          (ctx as any).letterSpacing = "0px";
        }
        
        // Date X: Moved right to 19% to avoid overlapping "Date: " text
        // Date Y: Moved down to 93% to rest perfectly on the underline
        const dateX = 2048 * 0.19;
        const dateY = 1364 * 0.90;
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
