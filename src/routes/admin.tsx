import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppHeader } from "@/components/mddw/AppHeader";
import { loadAdminDatabase, type AdminRow } from "@/lib/mddw/storage";
import { Lock, Users, Target, Award, ArrowLeft, X, Activity, Download } from "lucide-react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

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

type ScoreBracket = "Needs Review (<70)" | "Passing (70-99)" | "Perfect (100)";

function getBracket(score: number): ScoreBracket {
  if (score < 70) return "Needs Review (<70)";
  if (score < 100) return "Passing (70-99)";
  return "Perfect (100)";
}

function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [data, setData] = useState<AdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Drill-down state
  const [selectedCell, setSelectedCell] = useState<{ phc: string; bracket: ScoreBracket; ashas: AdminRow[] } | null>(null);

  // Authenticate
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === "1234") {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect PIN");
    }
  };

  // Real-time Firebase Listener
  useEffect(() => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    
    const q = query(collection(db, "quiz_scores"), orderBy("date", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        let localDb = loadAdminDatabase();
        if (localDb.length === 0) {
          localDb = MOCK_DATA;
          localStorage.setItem("mddw_admin_db", JSON.stringify(MOCK_DATA));
        }
        setData([...localDb].reverse());
      } else {
        const firebaseData = snapshot.docs.map(doc => {
          const d = doc.data();
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
      console.error("Firebase listen error", error);
      let localDb = loadAdminDatabase();
      if (localDb.length === 0) localDb = MOCK_DATA;
      setData([...localDb].reverse());
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAuthenticated]);

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Name,PHC,Phone,Score,Correct,Total\n"
      + data.map(e => `${new Date(e.date).toLocaleDateString()},"${e.name}","${e.phc || 'N/A'}","${e.phone || 'N/A'}",${e.score},${e.correct || 0},${e.total || 20}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `mddw_training_data_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
              <p className="text-muted-foreground mb-6 text-sm">Enter your secure PIN to view real-time analytics</p>
              
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

  // --- Derived Statistics ---
  const totalTrained = data.length;
  const avgScore = totalTrained ? Math.round(data.reduce((acc, curr) => acc + curr.score, 0) / totalTrained) : 0;
  const perfectScores = data.filter(d => d.score === 100).length;

  // Process data for the Heatmap Matrix
  const phcMap: Record<string, Record<ScoreBracket, AdminRow[]>> = {};
  const allBrackets: ScoreBracket[] = ["Needs Review (<70)", "Passing (70-99)", "Perfect (100)"];

  data.forEach(d => {
    const phc = d.phc || "Unknown PHC";
    if (!phcMap[phc]) {
      phcMap[phc] = {
        "Needs Review (<70)": [],
        "Passing (70-99)": [],
        "Perfect (100)": []
      };
    }
    const bracket = getBracket(d.score);
    phcMap[phc][bracket].push(d);
  });

  const phcNames = Object.keys(phcMap).sort();

  // Helper for cell coloring
  const getCellColor = (bracket: ScoreBracket, count: number) => {
    if (count === 0) return "bg-gray-100/50 text-gray-400";
    if (bracket === "Needs Review (<70)") {
      return count > 5 ? "bg-red-500 text-white" : count > 2 ? "bg-red-400 text-white" : "bg-red-200 text-red-900";
    }
    if (bracket === "Passing (70-99)") {
      return count > 5 ? "bg-yellow-400 text-yellow-950" : "bg-yellow-200 text-yellow-900";
    }
    if (bracket === "Perfect (100)") {
      return count > 5 ? "bg-green-500 text-white" : "bg-green-300 text-green-950";
    }
    return "bg-gray-100";
  };

  return (
    <main 
      className="min-h-dvh flex flex-col bg-slate-50 relative pb-10"
    >
      <div className="relative z-10 flex flex-col h-full w-full">
        <AppHeader />
        
        <div className="mx-auto w-full max-w-7xl px-4 py-6 flex flex-col gap-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border/50 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </div>
              <span className="text-xs font-bold text-green-600 uppercase tracking-widest">Live Firestore Sync</span>
            </div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
              <Target className="w-8 h-8 text-primary" /> Training Performance Matrix
            </h1>
            <p className="text-muted-foreground mt-1 text-sm font-medium">
              Real-time heat map of ASHA completions by PHC and score bracket.
            </p>
          </div>
          
          <button 
            onClick={exportData}
            className="flex items-center gap-2 bg-white border border-border hover:bg-slate-50 text-foreground font-bold py-2.5 px-4 rounded-xl transition shadow-sm text-sm"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row gap-6"
          >
            {/* Left Column: Heatmap & KPIs */}
            <div className="flex-1 flex flex-col gap-6">
              
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Total Trained</p>
                    <p className="text-2xl font-black text-foreground">{totalTrained}</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <Target className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Avg Score</p>
                    <p className="text-2xl font-black text-foreground">{avgScore}%</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <Award className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Perfect Scores</p>
                    <p className="text-2xl font-black text-foreground">{perfectScores}</p>
                  </div>
                </div>
              </div>

              {/* Heatmap Matrix */}
              <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-border bg-slate-50/50">
                  <h2 className="text-lg font-bold text-foreground">PHC Diagnostics Heatmap</h2>
                  <p className="text-sm text-muted-foreground">Click any block to view the specific ASHAs in that group.</p>
                </div>
                
                <div className="p-6 overflow-x-auto">
                  <div className="min-w-[600px]">
                    {/* Header Row */}
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider pt-2">Primary Health Center</div>
                      {allBrackets.map(b => (
                        <div key={b} className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center pt-2">
                          {b}
                        </div>
                      ))}
                    </div>

                    {/* Data Rows */}
                    <div className="flex flex-col gap-3">
                      {phcNames.map(phc => (
                        <div key={phc} className="grid grid-cols-4 gap-4 items-center group">
                          <div className="font-semibold text-sm text-slate-700 truncate pr-4" title={phc}>{phc}</div>
                          
                          {allBrackets.map(bracket => {
                            const ashas = phcMap[phc][bracket];
                            const count = ashas.length;
                            return (
                              <button
                                key={`${phc}-${bracket}`}
                                onClick={() => count > 0 && setSelectedCell({ phc, bracket, ashas })}
                                disabled={count === 0}
                                className={`
                                  h-12 rounded-xl flex items-center justify-center text-lg font-bold transition-all
                                  ${getCellColor(bracket, count)}
                                  ${count > 0 ? 'hover:scale-[1.03] hover:shadow-md cursor-pointer active:scale-95' : 'cursor-default opacity-50'}
                                `}
                              >
                                {count > 0 ? count : '-'}
                              </button>
                            );
                          })}
                        </div>
                      ))}
                      
                      {phcNames.length === 0 && (
                        <div className="py-12 text-center text-muted-foreground font-medium bg-slate-50 rounded-xl border border-dashed border-border">
                          No training data available yet.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Feed */}
            <div className="w-full lg:w-80 flex flex-col gap-4">
              <div className="bg-white rounded-3xl border border-border shadow-sm flex flex-col h-full max-h-[800px] overflow-hidden">
                <div className="p-5 border-b border-border bg-slate-50/50 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-foreground">Live Feed</h3>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                  <AnimatePresence initial={false}>
                    {data.slice(0, 15).map((row, i) => (
                      <motion.div
                        key={`${row.date}-${row.name}-${i}`}
                        initial={{ opacity: 0, x: -20, height: 0 }}
                        animate={{ opacity: 1, x: 0, height: 'auto' }}
                        className="p-3 rounded-xl bg-slate-50 border border-border text-sm flex flex-col gap-1"
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-foreground truncate pr-2">{row.name}</span>
                          <span className={`font-black ${row.score >= 80 ? 'text-green-600' : row.score < 50 ? 'text-red-500' : 'text-orange-500'}`}>
                            {row.score}%
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground flex justify-between">
                          <span className="truncate">{row.phc}</span>
                          <span>
                            {new Date(row.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {data.length === 0 && (
                    <div className="text-center text-sm text-muted-foreground py-8">
                      Waiting for activity...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        </div>
      </div>

      {/* Drill Down Modal */}
      <AnimatePresence>
        {selectedCell && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedCell(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-border flex flex-col max-h-[85vh]"
            >
              <div className="p-6 border-b border-border flex justify-between items-start bg-slate-50">
                <div>
                  <h3 className="text-xl font-black text-foreground">{selectedCell.phc}</h3>
                  <p className="text-sm font-bold mt-1 text-muted-foreground uppercase tracking-wider">{selectedCell.bracket}</p>
                </div>
                <button 
                  onClick={() => setSelectedCell(null)}
                  className="p-2 bg-slate-200 hover:bg-slate-300 rounded-full transition active:scale-95"
                >
                  <X className="w-5 h-5 text-slate-700" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1 bg-white">
                <div className="flex flex-col gap-3">
                  {selectedCell.ashas.map((asha, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-border flex justify-between items-center">
                      <div>
                        <p className="font-bold text-foreground text-base">{asha.name}</p>
                        <p className="text-sm text-slate-500 font-mono mt-1">{asha.phone || "No phone provided"}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-black ${asha.score >= 80 ? 'text-green-500' : asha.score < 50 ? 'text-red-500' : 'text-orange-500'}`}>
                          {asha.score}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(asha.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
