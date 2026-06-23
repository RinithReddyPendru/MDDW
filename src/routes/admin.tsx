import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AppHeader } from "@/components/mddw/AppHeader";
import { loadProgress } from "@/lib/mddw/storage";
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

// Real data type from Sheet
interface SheetRow {
  date: string;
  name: string;
  phc: string;
  phone: string;
  score: number;
  level: number;
  passed: boolean;
}

// Mock Data for Fallback
const MOCK_DATA: SheetRow[] = [
  { date: new Date(Date.now() - 86400000 * 1).toISOString(), name: "Lakshmi M.", phc: "Rampur PHC", phone: "9876543210", score: 90, level: 3, passed: true },
  { date: new Date(Date.now() - 86400000 * 2).toISOString(), name: "Sujata Devi", phc: "Guntur PHC", phone: "9876543211", score: 80, level: 2, passed: true },
  { date: new Date(Date.now() - 86400000 * 2).toISOString(), name: "Kamala R.", phc: "Rampur PHC", phone: "9876543212", score: 60, level: 1, passed: true },
  { date: new Date(Date.now() - 86400000 * 3).toISOString(), name: "Anjali P.", phc: "Vijayawada Hub", phone: "9876543213", score: 100, level: 3, passed: true },
  { date: new Date(Date.now() - 86400000 * 4).toISOString(), name: "Radha V.", phc: "Guntur PHC", phone: "9876543214", score: 40, level: 1, passed: false },
  { date: new Date(Date.now() - 86400000 * 5).toISOString(), name: "Meena K.", phc: "Vijayawada Hub", phone: "9876543215", score: 70, level: 2, passed: true },
  { date: new Date(Date.now() - 86400000 * 6).toISOString(), name: "Parvati S.", phc: "Rampur PHC", phone: "9876543216", score: 90, level: 3, passed: true },
  { date: new Date(Date.now() - 86400000 * 7).toISOString(), name: "Geeta N.", phc: "Guntur PHC", phone: "9876543217", score: 50, level: 1, passed: false },
  { date: new Date(Date.now() - 86400000 * 8).toISOString(), name: "Sunita Reddy", phc: "Vijayawada Hub", phone: "9876543218", score: 80, level: 2, passed: true },
];

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [data, setData] = useState<SheetRow[]>([]);
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

  // Fetch from Google Sheets
  const fetchData = async () => {
    setLoading(true);
    const p = loadProgress();
    const url = p.sheetsWebhookUrl;

    if (!url) {
      setData(MOCK_DATA);
      setIsMock(true);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(url);
      const text = await response.text();
      
      try {
        const json = JSON.parse(text);
        if (Array.isArray(json)) {
          setData(json);
          setIsMock(false);
        } else {
          throw new Error("Invalid format");
        }
      } catch (e) {
        console.warn("Could not parse JSON. The Apps Script likely misses a doGet() function. Falling back to Mock Data.");
        setData(MOCK_DATA);
        setIsMock(true);
      }
    } catch (error) {
      console.error("Fetch failed", error);
      setData(MOCK_DATA);
      setIsMock(true);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-dvh flex flex-col bg-background pb-10">
        <AppHeader />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm glass rounded-[2rem] p-8 border border-border/50 shadow-2xl text-center"
          >
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-extrabold mb-2 text-foreground">Admin Access</h1>
            <p className="text-muted-foreground text-sm mb-6">Enter PIN to view training analytics.</p>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <input
                type="password"
                placeholder="Enter PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full bg-background border-2 border-border/50 rounded-xl px-4 py-3 text-center text-xl font-black tracking-[0.5em] outline-none focus:border-primary transition"
                autoFocus
              />
              <button 
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-xl transition shadow-md active:scale-95"
              >
                Unlock Dashboard
              </button>
            </form>
          </motion.div>
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
    <main className="min-h-dvh flex flex-col bg-background pb-10">
      <AppHeader />
      
      <div className="mx-auto w-full max-w-5xl px-4 py-6 flex flex-col gap-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border/30 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
              <Target className="w-8 h-8 text-primary" /> MDD-W Training Hub
            </h1>
            <p className="text-muted-foreground mt-1 text-sm font-medium">
              Real-time analytics and performance monitoring
            </p>
          </div>
          {isMock && (
            <div className="bg-amber-500/10 text-amber-500 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 border border-amber-500/20">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              Displaying Demo Mock Data
            </div>
          )}
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
    </main>
  );
}
