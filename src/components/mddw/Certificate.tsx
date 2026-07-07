import React from "react";
import { certBgBase64 } from "@/lib/mddw/certificateBg";

interface CertificateProps {
  userName: string;
  phcName?: string;
  date?: string;
  lang?: string;
  isPreview?: boolean;
}

export const Certificate = React.forwardRef<HTMLDivElement, CertificateProps>(
  ({ userName, phcName, date, lang = "en", isPreview = false }, ref) => {
    
    const formattedDate = date || new Date().toLocaleDateString(
      lang === "en" ? "en-US" : lang === "hi" ? "hi-IN" : "te-IN", 
      { year: "numeric", month: "long", day: "numeric" }
    );

    // Using #cb1155 to match the certificate's pinkish red
    if (isPreview) {
      return (
        <div ref={ref} className="w-full max-w-lg rounded-xl shadow-sm border border-gray-200 bg-white mx-auto relative overflow-hidden" style={{ aspectRatio: '1200/848' }}>
          <img src={certBgBase64} alt="Certificate" className="absolute inset-0 w-full h-full object-cover block" />
          {/* Name overlay */}
          <div className="absolute left-0 right-0 flex flex-col items-center justify-center" style={{ top: '35%', height: '8%' }}>
            <span className="font-bold capitalize text-center px-4" style={{ color: '#cb1155', fontSize: 'clamp(16px, 4.5vw, 32px)', fontFamily: 'Georgia, serif', letterSpacing: '0.05em' }}>
              {userName || "ASHA"}
            </span>
          </div>
          {/* Date overlay */}
          <div className="absolute" style={{ bottom: '8.5%', left: '16%' }}>
            <span className="font-semibold" style={{ color: '#cb1155', fontSize: 'clamp(8px, 2vw, 14px)' }}>
              {formattedDate}
            </span>
          </div>
        </div>
      );
    }

    return (
      <div ref={ref} className="relative bg-white" style={{ width: '1200px', height: '848px', overflow: 'hidden' }}>
        <img src={certBgBase64} alt="Certificate" style={{ width: '1200px', height: '848px', display: 'block' }} />
        {/* Name overlay */}
        <div className="absolute left-0 right-0 flex flex-col items-center justify-center" style={{ top: '35%', height: '8%' }}>
          <span style={{ fontSize: '48px', fontWeight: 'bold', fontFamily: 'Georgia, serif', color: '#cb1155', letterSpacing: '0.05em', textTransform: 'capitalize' }}>
            {userName || "ASHA"}
          </span>
        </div>
        {/* Date overlay */}
        <div className="absolute" style={{ bottom: '8.5%', left: '16%' }}>
          <span style={{ fontSize: '18px', fontWeight: 600, color: '#cb1155' }}>
            {formattedDate}
          </span>
        </div>
      </div>
    );
  }
);

Certificate.displayName = "Certificate";
