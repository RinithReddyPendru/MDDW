import React from "react";

interface CertificateProps {
  userName: string;
  phcName: string;
  date: string;
}

export const Certificate = React.forwardRef<HTMLDivElement, CertificateProps>(({ userName, phcName, date }, ref) => {
  return (
    <div
      ref={ref}
      className="relative bg-white text-slate-800 p-8 w-[600px] h-[450px] mx-auto overflow-hidden shadow-2xl flex flex-col justify-center items-center text-center font-sans"
      style={{ border: "20px solid #D97000", boxSizing: "border-box" }}
    >
      {/* Decorative inner border */}
      <div className="absolute inset-2 border-4 border-[#059669] opacity-50 z-0"></div>

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        {/* Certificate Header */}
        <div className="mb-4 mt-2">
          <h1 className="text-4xl font-serif font-bold text-[#059669] mb-1 tracking-widest uppercase">Certificate</h1>
          <h2 className="text-sm font-semibold tracking-[0.2em] text-[#D97000] uppercase">of Completion</h2>
        </div>

        {/* Certificate Body */}
        <div className="mt-2 mb-6">
          <p className="italic text-slate-500 mb-2">This is to certify that</p>
          <p className="text-3xl font-bold text-slate-800 underline decoration-[#D97000] decoration-2 underline-offset-4 mb-2">
            {userName || "ASHA"}
          </p>
          <p className="text-sm text-slate-600 mb-6">from <span className="font-semibold text-slate-800">{phcName || "their PHC"}</span></p>
          
          <p className="text-sm px-10 leading-relaxed font-medium">
            has successfully completed the <strong className="text-[#059669]">MDDW Master Challenge</strong> training program, demonstrating exceptional knowledge in Minimum Dietary Diversity for Women.
          </p>
        </div>

        {/* Certificate Footer */}
        <div className="flex w-full justify-between items-end px-8 mt-auto pb-2">
          <div className="text-center w-[120px]">
            <div className="border-b border-slate-400 pb-1 mb-1 font-semibold text-sm">{date}</div>
            <div className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Date Awarded</div>
          </div>

          <div className="flex flex-col items-center justify-center -mb-2">
            <div className="text-5xl drop-shadow-md mb-1">🎖️</div>
            <div className="text-[9px] font-bold text-[#D97000] uppercase tracking-widest">Official Record</div>
          </div>

          <div className="text-center w-[120px]">
            <div className="border-b border-slate-400 pb-1 mb-1 font-serif italic font-bold text-lg text-slate-800">MDDW</div>
            <div className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Authorized By</div>
          </div>
        </div>
      </div>
    </div>
  );
});

Certificate.displayName = "Certificate";
