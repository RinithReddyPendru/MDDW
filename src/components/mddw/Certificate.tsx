import React from "react";

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

    if (isPreview) {
      // Preview version — shown inline on the results page and progress page
      return (
        <div ref={ref} className="w-full max-w-lg rounded-xl shadow-sm border border-gray-200 bg-white mx-auto relative overflow-hidden">
          <img src="/certificate_template.jpg" alt="Certificate" className="w-full h-auto block" />
          {/* Name overlay */}
          <div className="absolute left-0 right-0 flex flex-col items-center" style={{ top: '33%' }}>
            <span className="font-bold text-gray-900 capitalize text-center px-4" style={{ fontSize: 'clamp(12px, 3.5vw, 24px)', fontFamily: 'Georgia, serif', letterSpacing: '0.05em' }}>
              {userName || "ASHA"}
            </span>
          </div>
          {/* Date overlay */}
          <div className="absolute" style={{ bottom: '7.5%', left: '13%' }}>
            <span className="text-gray-700 font-medium" style={{ fontSize: 'clamp(6px, 1.5vw, 11px)' }}>
              {formattedDate}
            </span>
          </div>
        </div>
      );
    }

    // Full-size version — used for html2canvas download (offscreen)
    return (
      <div ref={ref} className="relative bg-white" style={{ width: '1200px', height: '848px', overflow: 'hidden' }}>
        <img src="/certificate_template.jpg" alt="Certificate" style={{ width: '1200px', height: '848px', display: 'block' }} />
        {/* Name overlay */}
        <div className="absolute left-0 right-0 flex flex-col items-center" style={{ top: '33%' }}>
          <span style={{ fontSize: '36px', fontWeight: 'bold', fontFamily: 'Georgia, serif', color: '#1a1a1a', letterSpacing: '0.05em', textTransform: 'capitalize' }}>
            {userName || "ASHA"}
          </span>
        </div>
        {/* Date overlay */}
        <div className="absolute" style={{ bottom: '7.5%', left: '13%' }}>
          <span style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>
            {formattedDate}
          </span>
        </div>
      </div>
    );
  }
);

Certificate.displayName = "Certificate";
