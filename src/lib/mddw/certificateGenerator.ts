import { certBgBase64 } from "./certificateBg";

export const generateNativeCertificate = async (
  userName: string,
  formattedDate: string,
  fileName: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 848;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Canvas 2D context not supported");
      }

      const img = new Image();
      img.src = certBgBase64;
      img.onload = () => {
        // Draw background
        ctx.drawImage(img, 0, 0, 1200, 848);

        // Name text
        ctx.fillStyle = "#cb1155";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "bold 48px Georgia, serif";
        
        // Handle letter-spacing if supported
        if ('letterSpacing' in ctx) {
          (ctx as any).letterSpacing = "0.05em";
        }
        
        // Name Y position: top 35% + half of 8% height = roughly 39% of 848 = 330px
        const nameY = 848 * 0.39;
        ctx.fillText(userName || "ASHA", 600, nameY);

        // Date text
        ctx.textAlign = "left";
        ctx.font = "600 18px sans-serif";
        // Reset letter spacing for date
        if ('letterSpacing' in ctx) {
          (ctx as any).letterSpacing = "0px";
        }
        
        // Date X: 16% of 1200 = 192
        // Date Y: bottom 8.5% -> 848 - (848 * 0.085) = 776
        const dateX = 1200 * 0.16;
        const dateY = 848 * 0.915;
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
