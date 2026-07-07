import { certBgBase64 } from "./certificateBg";

export const generateNativeCertificate = async (
  userName: string,
  formattedDate: string,
  fileName: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 2400;
      canvas.height = 1696;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Canvas 2D context not supported");
      }

      const img = new Image();
      img.src = certBgBase64;
      img.onload = () => {
        // Draw background
        ctx.drawImage(img, 0, 0, 2400, 1696);

        // Name text
        ctx.fillStyle = "#cb1155";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "bold 96px Georgia, serif";
        
        // Handle letter-spacing if supported
        if ('letterSpacing' in ctx) {
          (ctx as any).letterSpacing = "0.05em";
        }
        
        // Name Y position: lowered to 43.5% to place it below the ribbon
        const nameY = 1696 * 0.435;
        ctx.fillText(userName || "ASHA", 1200, nameY);

        // Date text
        ctx.textAlign = "left";
        ctx.font = "600 36px sans-serif";
        // Reset letter spacing for date
        if ('letterSpacing' in ctx) {
          (ctx as any).letterSpacing = "0px";
        }
        
        // Date X: Moved right to 20% to avoid overlapping "Date: " text
        // Date Y: Moved down to 92.5% to rest perfectly on the underline
        const dateX = 2400 * 0.20;
        const dateY = 1696 * 0.925;
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
