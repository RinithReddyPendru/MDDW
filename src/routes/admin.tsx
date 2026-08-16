import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AppHeader } from "@/components/mddw/AppHeader";
import { loadProgress, saveProgress, loadAdminDatabase, type AdminRow } from "@/lib/mddw/storage";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Lock, Users, Target, Award, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminDashboard,
});

// We don't need SheetRow here anymore since it's exactly AdminRow

// Mock Data for Fallback/Seed
const MOCK_DATA: AdminRow[] = [
  { date: new Date(Date.now() - 86400000 * 1).toISOString(), name: "Lakshmi M.", phc: "Rampur PHC", phone: "9876543210", score: 90 },
  { date: new Date(Date.now() - 86400000 * 2).toISOString(), name: "Sujata Devi", phc: "Guntur PHC", phone: "9876543211", score: 80 },
  { date: new Date(Date.now() - 86400000 * 2).toISOString(), name: "Kamala R.", phc: "Rampur PHC", phone: "9876543212", score: 60 },
  { date: new Date(Date.now() - 86400000 * 3).toISOString(), name: "Anjali P.", phc: "Vijayawada Hub", phone: "9876543213", score: 100 },
  { date: new Date(Date.now() - 86400000 * 4).toISOString(), name: "Radha V.", phc: "Guntur PHC", phone: "9876543214", score: 40 },
  { date: new Date(Date.now() - 86400000 * 5).toISOString(), name: "Meena K.", phc: "Vijayawada Hub", phone: "9876543215", score: 70 },
  { date: new Date(Date.now() - 86400000 * 6).toISOString(), name: "Parvati S.", phc: "Rampur PHC", phone: "9876543216", score: 90 },
  { date: new Date(Date.now() - 86400000 * 7).toISOString(), name: "Geeta N.", phc: "Guntur PHC", phone: "9876543217", score: 50 },
  { date: new Date(Date.now() - 86400000 * 8).toISOString(), name: "Sunita Reddy", phc: "Vijayawada Hub", phone: "9876543218", score: 80 },
];

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [data, setData] = useState<AdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(false);

  // Authenticate
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === "1234") {
      setIsAuthenticated(true);
      fetchData();
    } else {
      alert("Incorrect PIN");
    }
  };

  // Fetch from Firebase Firestore
  const fetchData = async () => {
    setLoading(true);
    try {
      const { collection, getDocs } = await import("firebase/firestore");
      const { db } = await import("../lib/firebase");
      
      const snapshot = await getDocs(collection(db, "quiz_scores"));
      
      if (snapshot.empty) {
        // Fallback to local DB if Firebase is empty (useful for migration/first run)
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
        
        // Sort newest first
        firebaseData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setData(firebaseData);
      }
      setIsMock(false);
    } catch (e) {
      console.error("Failed to fetch from Firebase, falling back to local DB", e);
      let localDb = loadAdminDatabase();
      if (localDb.length === 0) localDb = MOCK_DATA;
      setData([...localDb].reverse());
      setIsMock(false);
    } finally {
      setLoading(false);
    }
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
              <p className="text-muted-foreground mb-6 text-sm">Enter your secure PIN to view analytics</p>
              
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
  const perfectScores = data.filter(d => d.score >= 90).length;

  // PHC Performance
  const phcMap: Record<string, { total: number; count: number }> = {};
  data.forEach(d => {
    const phc = d.phc || "Unknown";
    if (!phcMap[phc]) phcMap[phc] = { total: 0, count: 0 };
    phcMap[phc].total += d.score;
    phcMap[phc].count += 1;
  });
  const phcData = Object.keys(phcMap).map(phc => ({
    name: phc,
    avgScore: Math.round(phcMap[phc].total / phcMap[phc].count)
  })).sort((a, b) => b.avgScore - a.avgScore);

  // Score Distribution
  const dist = { "0-40": 0, "50-70": 0, "80-90": 0, "100": 0 };
  data.forEach(d => {
    if (d.score <= 40) dist["0-40"]++;
    else if (d.score <= 70) dist["50-70"]++;
    else if (d.score <= 90) dist["80-90"]++;
    else dist["100"]++;
  });
  const distData = Object.keys(dist).map(k => ({ range: k, count: dist[k as keyof typeof dist] }));

  return (
    <main 
      className="min-h-dvh flex flex-col bg-cover bg-center relative pb-10"
      style={{ backgroundImage: 'url("/dashboard_hero.png")' }}
    >
      <div className="absolute inset-0 bg-background/90 backdrop-blur-3xl z-0" />
      <div className="relative z-10 flex flex-col h-full w-full">
        <AppHeader />
        
        <div className="mx-auto w-full max-w-5xl px-4 py-6 flex flex-col gap-8">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-border/30 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
              <Target className="w-8 h-8 text-primary" /> MDD-W Training Hub
            </h1>
            <p className="text-muted-foreground mt-1 text-sm font-medium">
              Real-time analytics and performance monitoring powered by Firebase
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-8"
          >
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass p-6 rounded-3xl border border-border/50 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                  <Users className="w-7 h-7 text-blue-500" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider">Total Trained</p>
                  <p className="text-3xl font-black text-foreground">{totalTrained}</p>
                </div>
              </div>

              <div className="glass p-6 rounded-3xl border border-border/50 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center">
                  <Target className="w-7 h-7 text-green-500" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider">Avg Score</p>
                  <p className="text-3xl font-black text-foreground">{avgScore}%</p>
                </div>
              </div>

              <div className="glass p-6 rounded-3xl border border-border/50 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                  <Award className="w-7 h-7 text-purple-500" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider">Perfect Scores</p>
                  <p className="text-3xl font-black text-foreground">{perfectScores}</p>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* PHC Performance Chart */}
              <div className="glass p-6 rounded-[2rem] border border-border/50 shadow-sm flex flex-col">
                <h2 className="text-lg font-bold mb-6 text-foreground flex items-center gap-2">
                  <div className="w-2 h-6 bg-primary rounded-full"></div> 
                  Top Performing PHCs
                </h2>
                <div className="flex-1 min-h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={phcData} layout="vertical" margin={{ left: 30, right: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="currentColor" className="opacity-10" />
                      <XAxis type="number" domain={[0, 100]} hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: 'currentColor', opacity: 0.7, fontSize: 12, fontWeight: 600}} />
                      <Tooltip 
                        cursor={{fill: 'currentColor', opacity: 0.05}}
                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="avgScore" fill="var(--primary)" radius={[0, 10, 10, 0]}>
                        {phcData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Score Distribution */}
              <div className="glass p-6 rounded-[2rem] border border-border/50 shadow-sm flex flex-col">
                <h2 className="text-lg font-bold mb-6 text-foreground flex items-center gap-2">
                  <div className="w-2 h-6 bg-amber-500 rounded-full"></div> 
                  Score Distribution
                </h2>
                <div className="flex-1 min-h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={distData} margin={{ top: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
                      <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{fill: 'currentColor', opacity: 0.7, fontSize: 12, fontWeight: 600}} dy={10} />
                      <YAxis hide />
                      <Tooltip 
                        cursor={{fill: 'currentColor', opacity: 0.05}}
                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="count" fill="var(--primary)" radius={[10, 10, 0, 0]}>
                        {distData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[(index+2) % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Recent Activity Table */}
            <div className="glass rounded-[2rem] border border-border/50 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border/30">
                <h2 className="text-lg font-bold text-foreground">Recent Training Activity</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted/50 text-muted-foreground font-bold tracking-wider">
                    <tr>
                      <th className="px-6 py-4 rounded-tl-xl">Date</th>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">PHC / Village</th>
                      <th className="px-6 py-4">Phone</th>
                      <th className="px-6 py-4 rounded-tr-xl text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.slice(0, 10).map((row, i) => (
                      <tr key={i} className="border-b border-border/10 hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-muted-foreground">
                          {new Date(row.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 font-bold text-foreground">
                          {row.name}
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
                            {row.phc}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground font-medium">
                          {row.phone || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`font-black text-lg ${row.score >= 90 ? "text-green-500" : row.score >= 70 ? "text-blue-500" : "text-amber-500"}`}>
                            {row.score}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </motion.div>
        )}
        </div>
      </div>
    </main>
  );
}
