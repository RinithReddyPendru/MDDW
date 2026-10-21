import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppHeader } from "@/components/mddw/AppHeader";
import { loadAdminDatabase, type AdminRow } from "@/lib/mddw/storage";
import { 
  Lock, Users, Target, Award, Download, Trophy, Clock, Phone, 
  UtensilsCrossed, ExternalLink, Search, Flame, Sparkles, CheckCircle2, 
  ChevronRight, X, Trash2, Shield
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminDashboard,
});

// Mock Data for Fallback/Seed
const MOCK_DATA: AdminRow[] = [
  { date: new Date(Date.now() - 86400000 * 1).toISOString(), name: "Lakshmi M.", phc: "Rampur PHC", phone: "9876543210", score: 90, correct: 18, total: 20 },
  { date: new Date(Date.now() - 86400000 * 2).toISOString(), name: "Sujata Devi", phc: "Guntur PHC", phone: "9876543211", score: 80, correct: 16, total: 20 },
  { date: new Date(Date.now() - 86400000 * 2).toISOString(), name: "Kamala R.", phc: "Rampur PHC", phone: "9876543212", score: 60, correct: 12, total: 20 },
  { date: new Date(Date.now() - 86400000 * 3).toISOString(), name: "Anjali P.", phc: "Vijayawada Hub", phone: "9876543213", score: 100, correct: 20, total: 20 },
  { date: new Date(Date.now() - 86400000 * 4).toISOString(), name: "Radha V.", phc: "Guntur PHC", phone: "9876543214", score: 40, correct: 8, total: 20 },
  { date: new Date(Date.now() - 86400000 * 5).toISOString(), name: "Meena K.", phc: "Vijayawada Hub", phone: "9876543215", score: 70, correct: 14, total: 20 },
  { date: new Date(Date.now() - 86400000 * 6).toISOString(), name: "Parvati S.", phc: "Rampur PHC", phone: "9876543216", score: 90, correct: 18, total: 20 },
  { date: new Date(Date.now() - 86400000 * 7).toISOString(), name: "Geeta N.", phc: "Guntur PHC", phone: "9876543217", score: 50, correct: 10, total: 20 },
  { date: new Date(Date.now() - 86400000 * 8).toISOString(), name: "Sunita Reddy", phc: "Vijayawada Hub", phone: "9876543218", score: 100, correct: 20, total: 20 },
];

export interface FoodScanItem {
  firestoreId: string;
  id: string;
  name: string;
  category: string;
  mealLabel?: string;
  timeLabel?: string;
  status: string;
  imageUrl?: string;
  calories?: number;
  protein_g?: number;
  carbs_g?: number;
  fiber_g?: number;
  iron_mg?: number;
  calcium_mg?: number;
  items?: any[];
  timestamp?: number;
  created_at_iso?: string;
  source?: string;
}

function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [activeTab, setActiveTab] = useState<"scans" | "quiz">("scans");

  // Quiz Data
  const [data, setData] = useState<AdminRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Food Scanner Data
  const [foodScans, setFoodScans] = useState<FoodScanItem[]>([]);
  const [scansLoading, setScansLoading] = useState(true);
  const [scanSearch, setScanSearch] = useState("");
  const [scanStatusFilter, setScanStatusFilter] = useState("ALL");
  const [inspectingScan, setInspectingScan] = useState<FoodScanItem | null>(null);

  // Authenticate
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === "1234") {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect PIN");
    }
  };

  // Real-time Firebase Listeners (quiz_scores + food_scanner)
  useEffect(() => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setScansLoading(true);
    let unsubQuiz: (() => void) | undefined;
    let unsubScans: (() => void) | undefined;
    
    const initFirebase = async () => {
      try {
        const { collection, onSnapshot, query, orderBy, limit } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");

        // 1. Quiz Scores Listener
        const qQuiz = query(collection(db, "quiz_scores"), orderBy("date", "desc"));
        unsubQuiz = onSnapshot(qQuiz, (snapshot) => {
          if (snapshot.empty) {
            let localDb = loadAdminDatabase();
            if (localDb.length === 0) {
              localDb = MOCK_DATA;
              localStorage.setItem("mddw_admin_db", JSON.stringify(MOCK_DATA));
            }
            setData([...localDb].reverse());
          } else {
            const firebaseData = snapshot.docs.map(docSnap => {
              const d = docSnap.data();
              return {
                date: d.date || new Date().toISOString(),
                name: d.userName || "Unknown",
                phc: d.phcName || "Unknown",
                score: d.score || 0,
                correct: d.correct || 0,
                total: d.total || 20,
                phone: d.phone || ""
              };
            });
            setData(firebaseData);
          }
          setLoading(false);
        }, (error) => {
          console.error("Firebase quiz listen error", error);
          let localDb = loadAdminDatabase();
          if (localDb.length === 0) localDb = MOCK_DATA;
          setData([...localDb].reverse());
          setLoading(false);
        });

        // 2. Food Scanner Listener (Collection: food_scanner)
        const qScans = collection(db, "food_scanner");
        unsubScans = onSnapshot(qScans, (snapshot) => {
          const list: FoodScanItem[] = [];
          snapshot.forEach(docSnap => {
            const d = docSnap.data();
            list.push({
              firestoreId: docSnap.id,
              id: d.id || docSnap.id,
              name: d.name || "Unnamed Dish",
              category: d.category || "OTHER",
              mealLabel: d.mealLabel || "Meal",
              timeLabel: d.timeLabel || "",
              status: d.status || "Scanned",
              imageUrl: d.imageUrl,
              calories: Number(d.calories) || 0,
              protein_g: Number(d.protein_g) || 0,
              carbs_g: Number(d.carbs_g) || 0,
              fiber_g: Number(d.fiber_g) || 0,
              iron_mg: Number(d.iron_mg) || 0,
              calcium_mg: Number(d.calcium_mg) || 0,
              items: d.items || [],
              timestamp: d.timestamp || 0,
              created_at_iso: d.created_at_iso || "",
              source: d.source || "Telugu Food Scanner"
            });
          });
          list.sort((a, b) => {
            const ta = a.timestamp || (a.created_at_iso ? new Date(a.created_at_iso).getTime() : 0);
            const tb = b.timestamp || (b.created_at_iso ? new Date(b.created_at_iso).getTime() : 0);
            return tb - ta;
          });
          setFoodScans(list);
          setScansLoading(false);
        }, (err) => {
          console.error("food_scanner listen error", err);
          setScansLoading(false);
        });

      } catch (err) {
        console.error("Failed to load Firebase", err);
        let localDb = loadAdminDatabase();
        if (localDb.length === 0) localDb = MOCK_DATA;
        setData([...localDb].reverse());
        setLoading(false);
        setScansLoading(false);
      }
    };

    initFirebase();

    return () => {
      if (unsubQuiz) unsubQuiz();
      if (unsubScans) unsubScans();
    };
  }, [isAuthenticated]);

  // Export Quiz Data
  const exportQuizData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Name,PHC,Phone,Score,Correct,Total\n"
      + data.map(e => `${new Date(e.date).toLocaleDateString()},"${e.name}","${e.phc || 'N/A'}","${e.phone || 'N/A'}",${e.score},${e.correct || 0},${e.total || 20}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `mddw_quiz_scores_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Food Scans Data
  const exportScansData = () => {
    if (foodScans.length === 0) {
      alert("No scans available to export.");
      return;
    }
    const headers = ["DocID,Dish Name,Category,Meal,Status,Calories,Protein_g,Carbs_g,Fiber_g,Iron_mg,Calcium_mg,Date"];
    const rows = foodScans.map(s => `"${s.firestoreId}","${(s.name || '').replace(/"/g, '""')}","${s.category || ''}","${s.mealLabel || ''}","${s.status}",${s.calories},${s.protein_g},${s.carbs_g},${s.fiber_g},${s.iron_mg},${s.calcium_mg},"${s.created_at_iso || new Date(s.timestamp || 0).toISOString()}"`);
    const csv = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = `food_scans_dataset_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Delete Scan
  const deleteScan = async (firestoreId: string) => {
    if (!confirm("Are you sure you want to delete this scan from Firestore?")) return;
    try {
      const { doc, deleteDoc } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");
      await deleteDoc(doc(db, "food_scanner", firestoreId));
      setInspectingScan(null);
    } catch (e: any) {
      alert("Failed to delete scan: " + e.message);
    }
  };

  // Derived Quiz Metrics
  const totalTrained = data.length;
  const avgScore = totalTrained ? Math.round(data.reduce((acc, curr) => acc + curr.score, 0) / totalTrained) : 0;
  const perfectScores = data.filter(d => d.score === 100).length;

  const leaderboardData = useMemo(() => {
    return [...data].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const getTime = (dateVal: any) => {
        if (!dateVal) return 0;
        if (typeof dateVal.toDate === 'function') return dateVal.toDate().getTime();
        if (typeof dateVal === 'object' && 'seconds' in dateVal) return dateVal.seconds * 1000;
        const t = new Date(dateVal).getTime();
        return isNaN(t) ? 0 : t;
      };
      return getTime(b.date) - getTime(a.date);
    });
  }, [data]);

  // Derived Food Scan Metrics & Filtering
  const filteredScans = useMemo(() => {
    return foodScans.filter((scan) => {
      if (scanStatusFilter !== "ALL") {
        if (scan.status.toLowerCase() !== scanStatusFilter.toLowerCase()) return false;
      }
      if (scanSearch.trim()) {
        const q = scanSearch.toLowerCase();
        const matches = (scan.name || "").toLowerCase().includes(q) ||
          (scan.category || "").toLowerCase().includes(q) ||
          (scan.firestoreId || "").toLowerCase().includes(q) ||
          (scan.mealLabel || "").toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [foodScans, scanSearch, scanStatusFilter]);

  const totalScansCount = foodScans.length;
  const loggedScansCount = foodScans.filter(s => s.status.toLowerCase() === "logged").length;
  const avgScanCal = totalScansCount 
    ? Math.round(foodScans.reduce((acc, s) => acc + (s.calories || 0), 0) / totalScansCount) 
    : 0;
  const uniqueDishCount = new Set(foodScans.map(s => (s.name || '').trim().toLowerCase()).filter(Boolean)).size;

  if (!isAuthenticated) {
    return (
      <main 
        className="min-h-dvh flex flex-col bg-cover bg-center relative pb-10"
        style={{ backgroundImage: 'url("/dashboard_hero.png")' }}
      >
        <div className="absolute inset-0 bg-background/85 backdrop-blur-2xl z-0" />
        <div className="relative z-10 flex flex-col h-full w-full">
          <AppHeader />
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-sm bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 border border-white/50 shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-extrabold mb-2 text-foreground">Admin Access</h1>
              <p className="text-muted-foreground mb-6 text-sm">Enter secure PIN to view scans & training analytics</p>
              
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <input
                    type="password"
                    placeholder="Enter PIN (1234)"
                    className="p-4 rounded-2xl bg-white/50 border-2 border-border focus:border-primary focus:ring-0 outline-none text-center text-xl tracking-widest transition-all"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    autoFocus
                  />
                </div>
                <button type="submit" className="bg-primary text-primary-foreground font-bold p-4 rounded-2xl active:scale-[0.98] transition mt-2">
                  Unlock Dashboard
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh flex flex-col bg-[#F8FAFC] relative pb-16">
      <div className="relative z-10 flex flex-col h-full w-full">
        <AppHeader />
        
        <div className="mx-auto w-full max-w-6xl px-4 py-8 flex flex-col gap-6">
        
          {/* Top Bar with Live Indicator & Standalone Link */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-border/50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                  Live Firestore Synced (mddw-app)
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
                <Shield className="w-8 h-8 text-primary" /> Admin Command Center
              </h1>
              <p className="text-muted-foreground text-sm font-medium">
                Live monitoring for both user food scans and ASHA training quiz completions.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <a
                href="https://telugu-food-scanner.vercel.app/admin"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 py-2.5 px-4 rounded-xl transition shadow-sm"
                title="Open standalone food scanner admin"
              >
                <span>🍛 Standalone Scanner Admin</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {activeTab === "scans" ? (
                <button 
                  onClick={exportScansData}
                  className="flex items-center gap-2 bg-white border border-border hover:bg-slate-50 text-foreground font-bold py-2.5 px-4 rounded-xl transition shadow-sm text-sm"
                >
                  <Download className="w-4 h-4" /> Export Scans CSV
                </button>
              ) : (
                <button 
                  onClick={exportQuizData}
                  className="flex items-center gap-2 bg-white border border-border hover:bg-slate-50 text-foreground font-bold py-2.5 px-4 rounded-xl transition shadow-sm text-sm"
                >
                  <Download className="w-4 h-4" /> Export Quiz CSV
                </button>
              )}
            </div>
          </div>

          {/* Navigation Tab Switcher */}
          <div className="flex items-center gap-2 bg-slate-200/60 p-1.5 rounded-2xl w-fit">
            <button
              onClick={() => setActiveTab("scans")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === "scans"
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <UtensilsCrossed className="w-4 h-4 text-amber-500" />
              <span>🍛 User Food Scans</span>
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-800 font-black">
                {totalScansCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("quiz")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === "quiz"
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Trophy className="w-4 h-4 text-primary" />
              <span>🏆 ASHA Quiz Scores</span>
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary font-black">
                {totalTrained}
              </span>
            </button>
          </div>

          {/* TAB 1: FOOD SCANS */}
          {activeTab === "scans" && (
            <div className="flex flex-col gap-6">
              {/* Scan KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-border/50 shadow-sm flex flex-col gap-1">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Scans</span>
                  <span className="text-3xl font-black text-slate-800">{totalScansCount}</span>
                  <span className="text-xs text-muted-foreground">Recorded in Firestore</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-border/50 shadow-sm flex flex-col gap-1">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Logged Scans</span>
                  <span className="text-3xl font-black text-emerald-600">{loggedScansCount}</span>
                  <span className="text-xs text-muted-foreground">Added to daily diary</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-border/50 shadow-sm flex flex-col gap-1">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Avg Calories</span>
                  <span className="text-3xl font-black text-amber-600">{avgScanCal} kcal</span>
                  <span className="text-xs text-muted-foreground">Per recognized plate</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-border/50 shadow-sm flex flex-col gap-1">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Unique Dishes</span>
                  <span className="text-3xl font-black text-indigo-600">{uniqueDishCount}</span>
                  <span className="text-xs text-muted-foreground">Telugu & South Indian</span>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="bg-white p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-96">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={scanSearch}
                    onChange={(e) => setScanSearch(e.target.value)}
                    placeholder="Search dish name, meal, or ID..."
                    className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-border rounded-xl outline-none focus:border-primary transition"
                  />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <select
                    value={scanStatusFilter}
                    onChange={(e) => setScanStatusFilter(e.target.value)}
                    className="px-3 py-2 text-sm bg-slate-50 border border-border rounded-xl font-medium outline-none cursor-pointer"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="Logged">Logged Only</option>
                    <option value="Scanned">Scanned Only</option>
                  </select>
                </div>
              </div>

              {/* Scans Grid */}
              {scansLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full"></div>
                </div>
              ) : filteredScans.length === 0 ? (
                <div className="bg-white rounded-3xl p-16 text-center border border-border/50 flex flex-col items-center justify-center gap-3">
                  <span className="text-5xl">🍽️</span>
                  <h3 className="text-lg font-bold text-foreground">No Scans Found</h3>
                  <p className="text-muted-foreground text-sm max-w-md">
                    No scans match your current filter. When someone scans food in the scanner, their photo and nutrition values appear here live.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredScans.map((scan) => {
                    const isLogged = scan.status.toLowerCase() === "logged";
                    return (
                      <div
                        key={scan.firestoreId}
                        onClick={() => setInspectingScan(scan)}
                        className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm hover:shadow-md hover:border-amber-400 transition cursor-pointer flex flex-col group"
                      >
                        {/* Food Image */}
                        <div className="relative w-full h-44 bg-slate-900 overflow-hidden">
                          {scan.imageUrl ? (
                            <img
                              src={scan.imageUrl}
                              alt={scan.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-1">
                              <UtensilsCrossed className="w-8 h-8 opacity-40" />
                              <span className="text-xs">No image data</span>
                            </div>
                          )}

                          <span className={`absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-[11px] font-black text-white shadow-md ${
                            isLogged ? 'bg-emerald-600' : 'bg-amber-600'
                          }`}>
                            {isLogged ? "✓ Logged" : "Scanned"}
                          </span>

                          <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-black/70 text-slate-200 backdrop-blur-sm">
                            {scan.timeLabel || "Recently"}
                          </span>
                        </div>

                        {/* Card Info */}
                        <div className="p-4 flex flex-col gap-3 flex-1">
                          <div>
                            <h3 className="font-bold text-foreground text-base line-clamp-1 group-hover:text-amber-600 transition">
                              {scan.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                                {scan.mealLabel || "Meal"}
                              </span>
                              <span className="text-xs text-muted-foreground truncate">
                                {scan.category}
                              </span>
                            </div>
                          </div>

                          {/* 4 Nutrient Pills */}
                          <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 border border-border/40 text-xs">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">Calories</span>
                              <span className="font-extrabold text-amber-600">{Math.round(scan.calories || 0)} kcal</span>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">Protein</span>
                              <span className="font-extrabold text-blue-600">{Number(scan.protein_g || 0).toFixed(1)}g</span>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">Iron</span>
                              <span className="font-extrabold text-rose-600">{Number(scan.iron_mg || 0).toFixed(1)}mg</span>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">Calcium</span>
                              <span className="font-extrabold text-purple-600">{Math.round(scan.calcium_mg || 0)}mg</span>
                            </div>
                          </div>

                          <div className="mt-auto pt-2 flex items-center justify-between text-xs text-muted-foreground">
                            <span>{scan.items?.length ? `${scan.items.length} items detected` : '1 dish plate'}</span>
                            <span className="font-bold text-amber-600 flex items-center gap-1 group-hover:translate-x-0.5 transition">
                              Inspect <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ASHA QUIZ SCORES */}
          {activeTab === "quiz" && (
            <div className="flex flex-col gap-8">
              {/* Quiz KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-border/50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                    <Users className="w-7 h-7 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Trained</p>
                    <p className="text-3xl font-black text-slate-800">{totalTrained}</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-border/50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                    <Target className="w-7 h-7 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Average Score</p>
                    <p className="text-3xl font-black text-slate-800">{avgScore}%</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-border/50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                    <Award className="w-7 h-7 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Perfect Scores</p>
                    <p className="text-3xl font-black text-slate-800">{perfectScores}</p>
                  </div>
                </div>
              </div>

              {/* Quiz Leaderboard List */}
              <div className="bg-white rounded-[2rem] border border-border/50 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
                <div className="grid grid-cols-[80px_2fr_2fr_1fr_120px] gap-4 p-6 border-b border-border/50 bg-slate-50/80 backdrop-blur-xl text-xs font-bold text-slate-500 uppercase tracking-widest sticky top-0 z-10">
                  <div className="text-center">Rank</div>
                  <div>ASHA Name</div>
                  <div>PHC / Village</div>
                  <div className="text-right">Score</div>
                  <div className="text-right">Time</div>
                </div>

                <div className="flex flex-col p-3 gap-2 max-h-[800px] overflow-y-auto bg-slate-50/30">
                  <AnimatePresence initial={false}>
                    {leaderboardData.map((row, i) => {
                      const isGold = i === 0;
                      const isSilver = i === 1;
                      const isBronze = i === 2;
                      
                      let bgClass = "bg-white border-border/40 hover:border-border/80";
                      let rankBg = "bg-slate-100 text-slate-500";
                      
                      if (isGold) {
                        bgClass = "bg-gradient-to-r from-amber-50/50 to-white border-amber-200 shadow-[0_4px_15px_-3px_rgba(251,191,36,0.15)]";
                        rankBg = "bg-amber-400 text-amber-950 shadow-inner";
                      } else if (isSilver) {
                        bgClass = "bg-gradient-to-r from-slate-50 to-white border-slate-300 shadow-sm";
                        rankBg = "bg-slate-300 text-slate-800 shadow-inner";
                      } else if (isBronze) {
                        bgClass = "bg-gradient-to-r from-orange-50/30 to-white border-orange-200 shadow-sm";
                        rankBg = "bg-orange-300 text-orange-950 shadow-inner";
                      }

                      let timeStr = "--:--";
                      try {
                        let dateObj = new Date(row.date);
                        if (row.date && typeof (row.date as any).toDate === 'function') {
                          dateObj = (row.date as any).toDate();
                        } else if (row.date && typeof row.date === 'object' && 'seconds' in row.date) {
                          dateObj = new Date((row.date as any).seconds * 1000);
                        }
                        if (!isNaN(dateObj.getTime())) {
                          timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        }
                      } catch (e) {
                        console.error("Invalid date format", row.date);
                      }

                      const uniqueKey = `${row.name}-${row.date}`;

                      return (
                        <motion.div
                          layout
                          key={uniqueKey}
                          initial={{ opacity: 0, scale: 0.95, y: -20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                          className={`grid grid-cols-[80px_2fr_2fr_1fr_120px] gap-4 items-center p-4 rounded-2xl border transition-all ${bgClass}`}
                        >
                          <div className="flex justify-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg ${rankBg}`}>
                              {i + 1}
                            </div>
                          </div>

                          <div className="flex flex-col truncate pr-4">
                            <span className="font-bold text-slate-800 text-lg truncate">{row.name}</span>
                            <span className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {row.phone || "No phone"}
                            </span>
                          </div>

                          <div className="flex items-center">
                            <span className="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg truncate max-w-full">
                              {row.phc}
                            </span>
                          </div>

                          <div className="flex justify-end">
                            <div className={`px-4 py-1.5 rounded-xl text-base font-black border ${
                              row.score >= 80 ? 'bg-green-50 text-green-700 border-green-200' : 
                              row.score < 70 ? 'bg-red-50 text-red-600 border-red-100' : 
                              'bg-orange-50 text-orange-700 border-orange-200'
                            }`}>
                              {row.score}%
                            </div>
                          </div>

                          <div className="flex justify-end text-right">
                            <span className="text-sm font-medium text-slate-400 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" /> {timeStr}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* DETAILED SCAN INSPECTION MODAL */}
      <AnimatePresence>
        {inspectingScan && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setInspectingScan(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-border flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-white z-10">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🔍</span>
                  <h2 className="text-lg font-black text-foreground">Scan Dossier & Nutrition</h2>
                </div>
                <button
                  onClick={() => setInspectingScan(null)}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 flex flex-col gap-6">
                {/* Photo */}
                <div className="w-full h-64 bg-slate-900 rounded-2xl overflow-hidden relative shadow-inner">
                  {inspectingScan.imageUrl ? (
                    <img
                      src={inspectingScan.imageUrl}
                      alt={inspectingScan.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      No Image Recorded
                    </div>
                  )}
                  <span className="absolute bottom-3 left-3 px-3 py-1 rounded-lg text-xs font-bold bg-black/75 text-white backdrop-blur-sm">
                    {inspectingScan.timeLabel || "Recently Scanned"}
                  </span>
                </div>

                {/* Identity & Status */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-black text-white ${
                      inspectingScan.status.toLowerCase() === 'logged' ? 'bg-emerald-600' : 'bg-amber-600'
                    }`}>
                      {inspectingScan.status}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-600">
                      {inspectingScan.mealLabel || "Meal"}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto font-mono">
                      ID: {inspectingScan.firestoreId}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-foreground">
                    {inspectingScan.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Category: {inspectingScan.category} • Source: {inspectingScan.source || "Annapurna Telugu Food Scanner"}
                  </p>
                </div>

                {/* 6 Macro & Micro Nutrition Grid */}
                <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-border/50 text-center">
                  <div className="bg-white p-3 rounded-xl border border-border/40 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Calories</span>
                    <span className="text-lg font-black text-amber-600">{Math.round(inspectingScan.calories || 0)} kcal</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-border/40 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Protein</span>
                    <span className="text-lg font-black text-blue-600">{Number(inspectingScan.protein_g || 0).toFixed(1)} g</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-border/40 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Carbohydrates</span>
                    <span className="text-lg font-black text-emerald-600">{Number(inspectingScan.carbs_g || 0).toFixed(1)} g</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-border/40 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Dietary Fiber</span>
                    <span className="text-lg font-black text-indigo-600">{Number(inspectingScan.fiber_g || 0).toFixed(1)} g</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-border/40 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Iron</span>
                    <span className="text-lg font-black text-rose-600">{Number(inspectingScan.iron_mg || 0).toFixed(2)} mg</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-border/40 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Calcium</span>
                    <span className="text-lg font-black text-purple-600">{Math.round(inspectingScan.calcium_mg || 0)} mg</span>
                  </div>
                </div>

                {/* Items List */}
                {inspectingScan.items && inspectingScan.items.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Detected Items on Plate
                    </h4>
                    <div className="flex flex-col gap-2">
                      {inspectingScan.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-border/40 text-sm">
                          <div>
                            <span className="font-bold text-foreground">{item.name_en || item.name}</span>
                            {item.name_te && <span className="text-xs text-amber-600 ml-2">({item.name_te})</span>}
                            <div className="text-xs text-muted-foreground">{item.cluster || item.portion_label || ""}</div>
                          </div>
                          <div className="text-right">
                            {item.grams && <span className="font-bold text-foreground">{item.grams}g</span>}
                            {item.calories && <div className="text-xs text-amber-600">{Math.round(item.calories)} kcal</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-border flex items-center justify-between bg-slate-50/80">
                <button
                  onClick={() => deleteScan(inspectingScan.firestoreId)}
                  className="flex items-center gap-2 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-4 py-2.5 rounded-xl border border-rose-200 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Scan</span>
                </button>
                <button
                  onClick={() => setInspectingScan(null)}
                  className="bg-primary text-primary-foreground font-bold px-6 py-2.5 rounded-xl text-sm transition"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
