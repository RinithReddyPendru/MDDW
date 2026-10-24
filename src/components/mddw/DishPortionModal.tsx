import React, { useState, useEffect } from "react";
import { X, Volume2, Check, Info } from "lucide-react";
import type { Lang } from "@/lib/mddw/translations";
import type { MotherDish } from "@/lib/mddw/motherAppData";
import {
  type PortionSize,
  getDishPortionInfo,
  getDishAccompaniments,
} from "@/lib/mddw/dishPortions";
import { playPop, playSuccess } from "@/lib/mddw/audio";

interface DishPortionModalProps {
  dish: MotherDish | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (dishId: string, portion: PortionSize, accompaniments: string[]) => void;
  onRemove?: (dishId: string) => void;
  isAlreadySelected?: boolean;
  initialPortion?: PortionSize;
  initialAccompaniments?: string[];
  lang: Lang;
}

export function DishPortionModal({
  dish,
  isOpen,
  onClose,
  onSave,
  onRemove,
  isAlreadySelected = false,
  initialPortion = "medium",
  initialAccompaniments = [],
  lang,
}: DishPortionModalProps) {
  const [selectedPortion, setSelectedPortion] = useState<PortionSize>(initialPortion);
  const [selectedSides, setSelectedSides] = useState<string[]>(initialAccompaniments);
  const [showSides, setShowSides] = useState<boolean>(initialAccompaniments.length > 0);

  // Sync state whenever dish or open changes
  useEffect(() => {
    if (isOpen && dish) {
      setSelectedPortion(initialPortion);
      setSelectedSides(initialAccompaniments);
      setShowSides(initialAccompaniments.length > 0);
    }
  }, [isOpen, dish, initialPortion, initialAccompaniments]);

  if (!isOpen || !dish) return null;

  const portionInfo = getDishPortionInfo(dish, lang);
  const accompaniments = getDishAccompaniments(dish);

  const selectedPortionObj = portionInfo.portions.find((p) => p.id === selectedPortion);
  const portionTitle = selectedPortionObj?.title[lang] || "Medium";

  const buttonLabel =
    lang === "te"
      ? `నా లాగ్‌కి ${portionTitle} జోడించు`
      : lang === "hi"
      ? `मेरे लॉग में ${portionTitle} जोड़ें`
      : `Add ${selectedPortion.charAt(0).toUpperCase() + selectedPortion.slice(1)} to my log`;

  const toggleSide = (id: string) => {
    playPop();
    setSelectedSides((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSpeech = () => {
    playPop();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const text =
        lang === "te"
          ? `${dish.name.te}. మీరు ఎంత తిన్నారు?`
          : lang === "hi"
          ? `${dish.name.hi}. आपने कितना खाया?`
          : `${dish.name.en}. How much did you eat?`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === "te" ? "te-IN" : lang === "hi" ? "hi-IN" : "en-IN";
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSave = () => {
    playSuccess();
    onSave(dish.id, selectedPortion, selectedSides);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Click outside backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal / Bottom Sheet Box */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] p-5 pt-3 shadow-2xl flex flex-col gap-4 max-h-[92dvh] overflow-y-auto animate-in slide-in-from-bottom duration-200 text-left">
        {/* Top Drag Handle Pill */}
        <div className="w-20 h-1.5 bg-[#CBD5E1] rounded-full mx-auto" />

        {/* ── TOP BAR: Close + Title + Audio ──────────────────────── */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#0D1B2A] hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-6 h-6 stroke-[2.5]" />
            </button>
            <h2 className="text-2xl font-black text-[#0D1B2A] tracking-tight">
              {lang === "te"
                ? "మీరు ఎంత తిన్నారు?"
                : lang === "hi"
                ? "आपने कितना खाया?"
                : "How much did you eat?"}
            </h2>
          </div>

          {/* Audio TTS Button */}
          <button
            type="button"
            onClick={handleSpeech}
            aria-label="Read aloud"
            className="w-12 h-12 rounded-full bg-[#FDE8EE] text-[#E91E63] flex items-center justify-center shadow-xs hover:bg-pink-100 active:scale-95 transition cursor-pointer shrink-0"
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>

        {/* ── DISH HEADER ────────────────────────────────────────── */}
        <div className="flex items-center gap-4">
          <div className="w-36 h-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0 shadow-2xs">
            <img
              src={portionInfo.headerImg}
              alt={dish.name[lang]}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="font-black text-2xl text-[#0D1B2A] leading-tight">
            {dish.name[lang]}
          </h3>
        </div>

        {/* ── 3 PORTION SIZE CARDS (Small, Medium, Large) ───────── */}
        <div className="grid grid-cols-3 gap-3">
          {portionInfo.portions.map((p) => {
            const isSelected = selectedPortion === p.id;

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  playPop();
                  setSelectedPortion(p.id);
                }}
                className={`rounded-2xl p-2.5 pt-3 pb-3 flex flex-col items-center text-center transition cursor-pointer relative min-h-[175px] justify-between ${
                  isSelected
                    ? "border-2 border-[#E91E63] bg-[#FFF0F5] shadow-xs"
                    : "border border-transparent bg-[#F8F9FA] hover:bg-slate-100/70"
                }`}
              >
                {/* Portion Image */}
                <div className="w-full h-20 flex items-center justify-center overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.title[lang]}
                    className="max-h-full max-w-full object-contain pointer-events-none drop-shadow-2xs"
                  />
                </div>

                {/* Portion Label & Amount */}
                <div className="flex flex-col items-center mt-1">
                  <span
                    className={`text-base font-extrabold leading-tight ${
                      isSelected ? "text-[#E91E63]" : "text-[#0D1B2A]"
                    }`}
                  >
                    {p.title[lang]}
                  </span>
                  <span
                    className={`text-sm mt-0.5 font-medium leading-tight ${
                      isSelected ? "text-[#D81B60]" : "text-[#7A8B9E]"
                    }`}
                  >
                    {p.amount}
                  </span>
                </div>

                {/* Bottom Pink Circle Checkmark (Only when selected) */}
                <div className="h-6 flex items-center justify-center mt-1">
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-[#E91E63] text-white flex items-center justify-center shadow-xs">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-6 h-6" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* ── PRIMARY ACTION BUTTON (Matches Screenshot) ───────── */}
        <button
          type="button"
          onClick={handleSave}
          className="w-full py-4 rounded-2xl bg-[#E91E63] hover:bg-[#D81B60] text-white font-extrabold text-lg flex items-center justify-center shadow-sm active:scale-[0.99] transition cursor-pointer"
        >
          <span>{buttonLabel}</span>
        </button>

        {/* ── OPTIONAL ACCOMPANIMENTS ACCORDION (If dish has sides) ── */}
        {accompaniments.length > 0 && (
          <div className="flex flex-col gap-2 pt-1 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowSides((prev) => !prev)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center justify-between py-1 transition cursor-pointer"
            >
              <span>
                {lang === "te"
                  ? "సాంబారు, చట్నీ లేదా సైడ్స్ తిన్నారా? (ఐచ్ఛికం)"
                  : lang === "hi"
                  ? "क्या सांभर, चटनी या अन्य कुछ खाया? (वैकल्पिक)"
                  : "Had sambar, chutney, or sides? (Optional)"}
              </span>
              <span className="text-[#E91E63] font-extrabold text-xs">
                {showSides ? "▲ Close" : `▼ Add sides (${selectedSides.length})`}
              </span>
            </button>

            {showSides && (
              <div className="grid grid-cols-3 gap-2 animate-in fade-in duration-150 pt-1">
                {accompaniments.map((side) => {
                  const isChecked = selectedSides.includes(side.id);

                  return (
                    <button
                      key={side.id}
                      type="button"
                      onClick={() => toggleSide(side.id)}
                      className={`p-2 rounded-2xl border flex items-center justify-between gap-1.5 transition cursor-pointer text-left ${
                        isChecked
                          ? "border-[#E91E63] bg-pink-50/50"
                          : "border-slate-200/90 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <img
                          src={side.image}
                          alt={side.name[lang]}
                          className="w-8 h-8 rounded-lg object-contain shrink-0"
                        />
                        <span className="text-[11px] font-bold text-slate-800 truncate leading-tight">
                          {side.name[lang]}
                        </span>
                      </div>

                      {/* Checkbox */}
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition ${
                          isChecked
                            ? "bg-[#E91E63] border-[#E91E63] text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── REMOVE FROM LOG (If already logged) ──────────────── */}
        {isAlreadySelected && onRemove && (
          <button
            type="button"
            onClick={() => {
              playPop();
              onRemove(dish.id);
              onClose();
            }}
            className="w-full py-1 text-xs font-extrabold text-rose-600 hover:text-rose-700 hover:underline transition cursor-pointer text-center"
          >
            {lang === "te"
              ? "లాగ్ నుండి తీసివేయండి"
              : lang === "hi"
              ? "लॉग से हटाएं"
              : "Remove from my log"}
          </button>
        )}
      </div>
    </div>
  );
}
