import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppHeader } from "@/components/mddw/AppHeader";
import { loadAdminDatabase, type AdminRow } from "@/lib/mddw/storage";
import { Lock, Users, Target, Award, Download, Trophy, Clock, Phone } from "lucide-react";

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

function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [data, setData] = useState<AdminRow[]>([]);
  const [loading, setLoading] = useState(true);

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
    let unsubscribe: (() => void) | undefined;
    
    const initFirebase = async () => {
      try {
        const { collection, onSnapshot, query, orderBy } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");

        const q = query(collection(db, "quiz_scores"), orderBy("date", "desc"));
        
        unsubscribe = onSnapshot(q, (snapshot) => {
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
      } catch (err) {
        console.error("Failed to load Firebase", err);
        let localDb = loadAdminDatabase();
        if (localDb.length === 0) localDb = MOCK_DATA;
        setData([...localDb].reverse());
        setLoading(false);
      }
    };

    initFirebase();

    return () => {
      if (unsubscribe) unsubscribe();
    };
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

  // --- Live Leaderboard Processing ---
  // Sort by score (desc), then by date (desc) to break ties so recent completions float up
  const leaderboardData = useMemo(() => {
    return [...data].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [data]);

  return (
    <main 
      className="min-h-dvh flex flex-col bg-[#F8FAFC] relative pb-10"
    >
      <div className="relative z-10 flex flex-col h-full w-full">
        <AppHeader />
        
        <div className="mx-auto w-full max-w-6xl px-4 py-8 flex flex-col gap-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border/50 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </div>
              <span className="text-xs font-bold text-green-600 uppercase tracking-widest">Live Sync Active</span>
            </div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
              <Trophy className="w-8 h-8 text-primary" /> Live Leaderboard
            </h1>
            <p className="text-muted-foreground mt-1 text-sm font-medium">
              Real-time feed of ASHA completions ranked by score.
            </p>
          </div>
          
          <button 
            onClick={exportData}
            className="flex items-center gap-2 bg-white border border-border hover:bg-slate-50 text-foreground font-bold py-2.5 px-5 rounded-xl transition shadow-sm text-sm"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* KPI Cards */}
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

            {/* The Live List */}
            <div className="bg-white rounded-[2rem] border border-border/50 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
              
              {/* Header Row */}
              <div className="grid grid-cols-[80px_2fr_2fr_1fr_120px] gap-4 p-6 border-b border-border/50 bg-slate-50/80 backdrop-blur-xl text-xs font-bold text-slate-500 uppercase tracking-widest sticky top-0 z-10">
                <div className="text-center">Rank</div>
                <div>ASHA Name</div>
                <div>PHC / Village</div>
                <div className="text-right">Score</div>
                <div className="text-right">Time</div>
              </div>

              {/* List Body */}
              <div className="flex flex-col p-3 gap-2 max-h-[800px] overflow-y-auto bg-slate-50/30">
                <AnimatePresence initial={false}>
                  {leaderboardData.map((row, i) => {
                    // Visual styling for top 3
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

                    const timeStr = new Date(row.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    // Use a unique key based on the row's exact time + name so Framer Motion animates changes correctly
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
                        {/* Rank */}
                        <div className="flex justify-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg ${rankBg}`}>
                            {i + 1}
                          </div>
                        </div>

                        {/* Name & Phone */}
                        <div className="flex flex-col truncate pr-4">
                          <span className="font-bold text-slate-800 text-lg truncate">{row.name}</span>
                          <span className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {row.phone || "No phone"}
                          </span>
                        </div>

                        {/* PHC */}
                        <div className="flex items-center">
                          <span className="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg truncate max-w-full">
                            {row.phc}
                          </span>
                        </div>

                        {/* Score */}
                        <div className="flex justify-end">
                          <div className={`px-4 py-1.5 rounded-xl text-base font-black border ${
                            row.score >= 80 ? 'bg-green-50 text-green-700 border-green-200' : 
                            row.score < 70 ? 'bg-red-50 text-red-600 border-red-100' : 
                            'bg-orange-50 text-orange-700 border-orange-200'
                          }`}>
                            {row.score}%
                          </div>
                        </div>

                        {/* Time */}
                        <div className="flex justify-end text-right">
                          <span className="text-sm font-medium text-slate-400 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" /> {timeStr}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                
                {leaderboardData.length === 0 && (
                  <div className="py-20 text-center text-slate-400 font-medium flex flex-col items-center gap-4">
                    <Trophy className="w-12 h-12 text-slate-200" />
                    No training scores yet. The leaderboard is waiting for its first champion!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </main>
  );
}
