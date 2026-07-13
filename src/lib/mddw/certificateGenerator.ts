import html2canvas from "html2canvas";

/**
 * Generates a certificate PNG by capturing the hidden full-size
 * Certificate HTML element via html2canvas. This approach gives us
 * pixel-perfect results because the certificate is pure HTML/CSS
 * (no background image overlay positioning issues).
 */
export const generateNativeCertificate = async (
  _userName: string,
  _formattedDate: string,
  fileName: string,
  certificateElement?: HTMLDivElement | null
): Promise<void> => {
  if (!certificateElement) {
    throw new Error("Certificate element not found. Cannot generate certificate.");
  }

  try {
    const canvas = await html2canvas(certificateElement, {
      scale: 2,           // 2x for sharp output (2048×1364)
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      width: 1024,
      height: 682,
    });

    // Trigger download
    const link = document.createElement("a");
    link.download = fileName;
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (e) {
    console.error("Certificate generation failed:", e);
    throw e;
  }
};
