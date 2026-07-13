import React from "react";
import { certBgBase64 } from "@/lib/mddw/certificateBg";

interface CertificateProps {
  userName: string;
  phcName?: string;
  date?: string;
  lang?: string;
  isPreview?: boolean;
  score?: number;
  pct?: number;
  t?: (key: string) => string;
}

export const Certificate = React.forwardRef<HTMLDivElement, CertificateProps>(
  ({ userName, phcName, date, lang = "en", isPreview = false }, ref) => {
    
    const formattedDate = date || new Date().toLocaleDateString(
      lang === "en" ? "en-US" : lang === "hi" ? "hi-IN" : "te-IN", 
      { year: "numeric", month: "long", day: "numeric" }
    );

    // We use responsive percentages so it perfectly scales down for preview
    // Top: 360px / 682px = 52.8%
    // Date Top: 600px / 682px = 88%
    // Date Left: 190px / 1024px = 18.5%
    const content = (
      <>
        {/* The beautiful original background image */}
        <img 
          src={certBgBase64} 
          alt="Certificate Background" 
          className="absolute inset-0 w-full h-full object-cover block"
        />
        
        {/* Name overlay - perfectly positioned in the blank space below the ribbon */}
        <div 
          className="absolute left-0 right-0 flex justify-center items-center"
          style={{ top: '52.8%' }}
        >
          <span 
            className="font-bold capitalize text-center px-4"
            style={{ 
              color: '#cb1155', 
              fontSize: isPreview ? 'clamp(16px, 4.5vw, 32px)' : '48px', 
              fontFamily: '"Times New Roman", Times, serif', 
              letterSpacing: '0.05em',
              lineHeight: 1
            }}
          >
            {userName || "ASHA"}
          </span>
        </div>

        {/* Date overlay */}
        <div 
          className="absolute flex flex-col justify-end"
          style={{ top: '88%', left: '18.5%' }}
        >
          <span 
            className="font-semibold"
            style={{ 
              color: '#cb1155', 
              fontSize: isPreview ? 'clamp(8px, 2vw, 14px)' : '20px' 
            }}
          >
            {formattedDate}
          </span>
        </div>
      </>
    );

    if (isPreview) {
      return (
        <div 
          ref={ref} 
          className="w-full max-w-lg rounded-xl shadow-sm border border-gray-200 bg-white mx-auto relative overflow-hidden" 
          style={{ aspectRatio: '1024/682' }}
        >
          {content}
        </div>
      );
    }

    return (
      <div 
        ref={ref} 
        className="relative bg-white" 
        style={{ width: '1024px', height: '682px', overflow: 'hidden' }}
      >
        {content}
      </div>
    );
  }
);

Certificate.displayName = "Certificate";
