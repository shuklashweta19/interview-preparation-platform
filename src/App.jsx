import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard, FileText, MessagesSquare, Code2, BookmarkCheck,
  NotebookPen, Flame, Map, LogOut, Mic, Send, ChevronRight, Check,
  Upload, Star, Clock, Target, TrendingUp, Award, Lock, CheckCircle2,
  Circle, X, Search, Filter
} from "lucide-react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";

/* ---------------------------------------------------------------
   DESIGN TOKENS
   bg:      #0B0E14 (ink)      surface: #12161F     surface-2: #1A1F2B
   text:    #E7E9EE            muted:   #8A92A3
   accent:  #3DDC97 (mint)     accent-2: #F5A623 (amber)   danger: #E2725B
   display font: Space Grotesk · body: Inter · mono: JetBrains Mono
----------------------------------------------------------------- */

const FONTS_LINK = "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap";

const colors = {
  bg: "#0B0E14",
  surface: "#12161F",
  surface2: "#1A1F2B",
  border: "#242B3A",
  text: "#E7E9EE",
  muted: "#8A92A3",
  faint: "#5C6275",
  accent: "#3DDC97",
  accentDim: "#1F4D3C",
  amber: "#F5A623",
  amberDim: "#4A3A14",
  danger: "#E2725B",
  dangerDim: "#4A2A22",
};

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "interview", label: "Mock interview", icon: MessagesSquare },
  { id: "resume", label: "Resume review", icon: FileText },
  { id: "problems", label: "Coding problems", icon: Code2 },
  { id: "daily", label: "Daily challenge", icon: Flame },
  { id: "bookmarks", label: "Bookmarks", icon: BookmarkCheck },
  { id: "notes", label: "Notes", icon: NotebookPen },
  { id: "roadmap", label: "Roadmap", icon: Map },
];

/* ---------------------------------------------------------------
   MOCK DATA
----------------------------------------------------------------- */

const USER = { name: "Aditi Sharma", role: "SDE-2 candidate", streak: 12, score: 742 };

const radarData = [
  { skill: "DSA", value: 78 },
  { skill: "System design", value: 55 },
  { skill: "Communication", value: 82 },
  { skill: "Behavioral", value: 70 },
  { skill: "Resume", value: 64 },
  { skill: "Coding speed", value: 72 },
];

const progressTrend = [
  { week: "W1", score: 410 },
  { week: "W2", score: 470 },
  { week: "W3", score: 510 },
  { week: "W4", score: 560 },
  { week: "W5", score: 615 },
  { week: "W6", score: 660 },
  { week: "W7", score: 700 },
  { week: "W8", score: 742 },
];

const heatmap = Array.from({ length: 70 }, (_, i) => ({
  id: i,
  level: [0, 0, 1, 2, 3, 1, 0, 2, 3, 4][Math.floor(Math.random() * 10)] && Math.floor(Math.random() * 4),
}));

const interviewQuestions = [
  {
    q: "Tell me about a time you disagreed with a teammate's technical decision. How did you handle it?",
    type: "Behavioral",
  },
  {
    q: "Given an array of integers, find two numbers that add up to a target value. Walk me through your approach.",
    type: "DSA",
  },
  {
    q: "How would you design a URL shortening service like bit.ly?",
    type: "System design",
  },
  {
    q: "What happens when you type a URL into a browser and hit enter?",
    type: "Fundamentals",
  },
];

const mockFeedback = {
  score: 7.8,
  strengths: [
    "Clear structure — you led with the situation and outcome up front.",
    "Good use of a concrete example rather than a generic answer.",
  ],
  improvements: [
    "Quantify the impact (e.g. \"reduced review time by 30%\") to make the result land harder.",
    "You trailed off at the end — close with what you'd do differently next time.",
  ],
};

const problems = [
  { id: 1, title: "Two Sum", difficulty: "Easy", topic: "Arrays", solved: true, bookmarked: false },
  { id: 2, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", topic: "Sliding Window", solved: true, bookmarked: true },
  { id: 3, title: "Merge K Sorted Lists", difficulty: "Hard", topic: "Heap", solved: false, bookmarked: true },
  { id: 4, title: "Valid Parentheses", difficulty: "Easy", topic: "Stack", solved: true, bookmarked: false },
  { id: 5, title: "Course Schedule", difficulty: "Medium", topic: "Graphs", solved: false, bookmarked: false },
  { id: 6, title: "LRU Cache", difficulty: "Medium", topic: "Design", solved: false, bookmarked: true },
  { id: 7, title: "Word Break", difficulty: "Medium", topic: "Dynamic Programming", solved: false, bookmarked: false },
  { id: 8, title: "Median of Two Sorted Arrays", difficulty: "Hard", topic: "Binary Search", solved: false, bookmarked: false },
];

const notesData = [
  { id: 1, title: "Sliding window pattern", body: "Use two pointers, expand right until condition breaks, then shrink left. Great for substring / subarray problems with a constraint.", tag: "DSA" },
  { id: 2, title: "STAR method reminder", body: "Situation, Task, Action, Result. Always close with a measurable result and a reflection.", tag: "Behavioral" },
  { id: 3, title: "Load balancer notes", body: "Round robin is simplest but ignores server load. Least-connections is better under uneven request cost.", tag: "System design" },
];

const roadmapStages = [
  { title: "Foundations", desc: "Arrays, strings, hashing, complexity analysis", status: "done" },
  { title: "Core patterns", desc: "Two pointers, sliding window, recursion, backtracking", status: "done" },
  { title: "Trees & graphs", desc: "BFS/DFS, traversals, topological sort", status: "active" },
  { title: "System design basics", desc: "Scaling, caching, load balancing, databases", status: "locked" },
  { title: "Mock interview gauntlet", desc: "5 full-length mixed interviews with AI feedback", status: "locked" },
  { title: "Offer-ready", desc: "Resume polish, negotiation prep, final review", status: "locked" },
];

/* ---------------------------------------------------------------
   SHARED UI PRIMITIVES
----------------------------------------------------------------- */

function Pill({ children, tone = "muted" }) {
  const tones = {
    muted: { bg: colors.surface2, fg: colors.muted },
    accent: { bg: colors.accentDim, fg: colors.accent },
    amber: { bg: colors.amberDim, fg: colors.amber },
    danger: { bg: colors.dangerDim, fg: colors.danger },
  };
  const t = tones[tone];
  return (
    <span style={{
      background: t.bg, color: t.fg, fontSize: 12, fontWeight: 500,
      padding: "3px 9px", borderRadius: 20, fontFamily: "Inter, sans-serif",
      whiteSpace: "nowrap",
    }}>{children}</span>
  );
}

function Card({ children, style = {}, padding = 20 }) {
  return (
    <div style={{
      background: colors.surface, border: `1px solid ${colors.border}`,
      borderRadius: 14, padding, ...style,
    }}>{children}</div>
  );
}

function SectionTitle({ children, sub }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <h2 style={{
        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
        fontSize: 22, color: colors.text, margin: 0,
      }}>{children}</h2>
      {sub && <p style={{ color: colors.muted, fontSize: 14, margin: "4px 0 0", fontFamily: "Inter, sans-serif" }}>{sub}</p>}
    </div>
  );
}

/* ---------------------------------------------------------------
   LOGIN SCREEN
----------------------------------------------------------------- */

function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  return (
    <div style={{
      minHeight: "100vh", background: colors.bg, display: "flex",
      alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif",
      padding: 20,
    }}>
      <div style={{ display: "flex", width: "100%", maxWidth: 880, minHeight: 520, borderRadius: 18, overflow: "hidden", border: `1px solid ${colors.border}` }}>
        {/* left panel - terminal signature */}
        <div style={{
          flex: 1.1, background: colors.surface, padding: 36, display: "flex",
          flexDirection: "column", justifyContent: "space-between",
          borderRight: `1px solid ${colors.border}`,
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
              <div style={{ width: 9, height: 9, borderRadius: 9, background: colors.danger }} />
              <div style={{ width: 9, height: 9, borderRadius: 9, background: colors.amber }} />
              <div style={{ width: 9, height: 9, borderRadius: 9, background: colors.accent }} />
              <span style={{ color: colors.faint, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, marginLeft: 8 }}>interview.ai — session</span>
            </div>
            <TerminalTyper />
          </div>
          <div style={{ color: colors.faint, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
            12-day streak · 742 readiness score
          </div>
        </div>

        {/* right panel - form */}
        <div style={{ flex: 1, background: colors.surface2, padding: 36, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 26, color: colors.text, margin: "0 0 6px" }}>
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p style={{ color: colors.muted, fontSize: 14, margin: "0 0 24px" }}>
            {mode === "login" ? "Sign in to pick up where you left off." : "Start practicing for your next interview."}
          </p>

          {mode === "register" && <FormField label="Full name" placeholder="Aditi Sharma" />}
          <FormField label="Email" placeholder="you@example.com" />
          <FormField label="Password" placeholder="••••••••" type="password" />

          <button onClick={onLogin} style={{
            marginTop: 8, background: colors.accent, color: "#06120D", border: "none",
            borderRadius: 10, padding: "12px 16px", fontWeight: 600, fontSize: 14,
            cursor: "pointer", fontFamily: "Inter, sans-serif",
          }}>
            {mode === "login" ? "Sign in" : "Create account"}
          </button>

          <p style={{ color: colors.muted, fontSize: 13, marginTop: 18, textAlign: "center" }}>
            {mode === "login" ? "New here? " : "Already have an account? "}
            <span
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              style={{ color: colors.accent, cursor: "pointer", fontWeight: 500 }}
            >
              {mode === "login" ? "Create an account" : "Sign in"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, placeholder, type = "text" }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12, color: colors.muted, display: "block", marginBottom: 6 }}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        style={{
          width: "100%", background: colors.bg, border: `1px solid ${colors.border}`,
          borderRadius: 8, padding: "10px 12px", color: colors.text, fontSize: 14,
          fontFamily: "Inter, sans-serif", boxSizing: "border-box", outline: "none",
        }}
      />
    </div>
  );
}

function TerminalTyper() {
  const fullText = "What's the time complexity of your solution, and can you do better?";
  const [shown, setShown] = useState("");
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i++;
      setShown(fullText.slice(0, i));
      if (i >= fullText.length) clearInterval(t);
    }, 35);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13.5, lineHeight: 1.8, color: colors.text }}>
      <div style={{ color: colors.faint }}>$ ai-interviewer --start --track=backend</div>
      <div style={{ color: colors.accent, marginTop: 14 }}>AI ›</div>
      <div style={{ marginTop: 4 }}>
        {shown}<span style={{ opacity: shown.length < fullText.length ? 1 : 0 }}>▌</span>
      </div>
      <div style={{ marginTop: 22, color: colors.faint }}>candidate › <span style={{ color: colors.muted }}>typing<Dots /></span></div>
    </div>
  );
}

function Dots() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setN((v) => (v + 1) % 4), 400);
    return () => clearInterval(t);
  }, []);
  return <span>{".".repeat(n)}</span>;
}

/* ---------------------------------------------------------------
   APP SHELL
----------------------------------------------------------------- */

function Shell({ active, setActive, onLogout, children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: colors.bg, fontFamily: "Inter, sans-serif" }}>
      {/* activity rail */}
      <div style={{
        width: 232, background: colors.surface, borderRight: `1px solid ${colors.border}`,
        display: "flex", flexDirection: "column", padding: "20px 14px", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "0 8px 22px" }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, background: colors.accentDim,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Code2 size={16} color={colors.accent} />
          </div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 15, color: colors.text }}>interview.ai</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setActive(item.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "9px 10px",
                  borderRadius: 8, cursor: "pointer",
                  background: isActive ? colors.surface2 : "transparent",
                  color: isActive ? colors.text : colors.muted,
                  borderLeft: isActive ? `2px solid ${colors.accent}` : "2px solid transparent",
                }}
              >
                <Icon size={16} />
                <span style={{ fontSize: 13.5, fontWeight: isActive ? 500 : 400 }}>{item.label}</span>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: "auto", paddingTop: 16, borderTop: `1px solid ${colors.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 8px" }}>
            <div style={{
              width: 30, height: 30, borderRadius: "50%", background: colors.amberDim,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, color: colors.amber, fontWeight: 600,
            }}>AS</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, color: colors.text, fontWeight: 500 }}>{USER.name}</div>
              <div style={{ fontSize: 11, color: colors.muted }}>{USER.role}</div>
            </div>
            <LogOut size={15} color={colors.muted} style={{ cursor: "pointer" }} onClick={onLogout} />
          </div>
        </div>
      </div>

      {/* content */}
      <div style={{ flex: 1, padding: "28px 36px", overflowY: "auto" }}>
        {children}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   DASHBOARD
----------------------------------------------------------------- */

function Dashboard({ setActive }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 26 }}>
        <div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 26, color: colors.text, margin: 0 }}>
            Good to see you, Aditi
          </h1>
          <p style={{ color: colors.muted, fontSize: 14, margin: "4px 0 0" }}>Here's where your prep stands today.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Pill tone="amber"><Flame size={11} style={{ verticalAlign: -1, marginRight: 4 }} />12-day streak</Pill>
          <Pill tone="accent"><Target size={11} style={{ verticalAlign: -1, marginRight: 4 }} />Readiness 742</Pill>
        </div>
      </div>

      {/* stat row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
        <StatCard icon={CheckCircle2} label="Problems solved" value="142" delta="+8 this week" />
        <StatCard icon={MessagesSquare} label="Mock interviews" value="23" delta="+3 this week" />
        <StatCard icon={Award} label="Avg. feedback score" value="7.6 / 10" delta="+0.4" />
        <StatCard icon={Clock} label="Hours practiced" value="58.5h" delta="+6.2h" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16, marginBottom: 16 }}>
        <Card>
          <SectionTitle sub="Your readiness score over the last 8 weeks">Progress trend</SectionTitle>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressTrend} margin={{ left: -20 }}>
                <CartesianGrid stroke={colors.border} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" tick={{ fill: colors.muted, fontSize: 11 }} axisLine={{ stroke: colors.border }} tickLine={false} />
                <YAxis tick={{ fill: colors.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: colors.surface2, border: `1px solid ${colors.border}`, borderRadius: 8, fontSize: 12 }} labelStyle={{ color: colors.text }} />
                <Line type="monotone" dataKey="score" stroke={colors.accent} strokeWidth={2.5} dot={{ r: 3, fill: colors.accent }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <SectionTitle sub="Skill breakdown">Strength radar</SectionTitle>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke={colors.border} />
                <PolarAngleAxis dataKey="skill" tick={{ fill: colors.muted, fontSize: 10.5 }} />
                <Radar dataKey="value" stroke={colors.accent} fill={colors.accent} fillOpacity={0.25} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <SectionTitle sub="Last 10 weeks of practice activity">Consistency</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(14, 1fr)", gap: 4 }}>
            {heatmap.map((d) => {
              const shades = [colors.surface2, "#1A4A38", "#1F7A52", colors.accent];
              return <div key={d.id} style={{ width: "100%", paddingBottom: "100%", position: "relative", borderRadius: 3, background: shades[d.level] || colors.surface2 }} />;
            })}
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 10, fontSize: 11, color: colors.muted }}>
            <span>Less</span>
            {[colors.surface2, "#1A4A38", "#1F7A52", colors.accent].map((c, i) => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
            ))}
            <span>More</span>
          </div>
        </Card>

        <Card>
          <SectionTitle sub="Pick up where you left off">Quick actions</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <QuickAction label="Continue mock interview" desc="System design · question 2 of 5" onClick={() => setActive("interview")} />
            <QuickAction label="Today's daily challenge" desc="Reverse a linked list in groups of k" onClick={() => setActive("daily")} />
            <QuickAction label="Re-score your resume" desc="Last scored 3 days ago — 78/100" onClick={() => setActive("resume")} />
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, delta }) {
  return (
    <Card padding={16}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <div style={{ width: 26, height: 26, borderRadius: 7, background: colors.surface2, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={14} color={colors.accent} />
        </div>
        <span style={{ fontSize: 12, color: colors.muted }}>{label}</span>
      </div>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: colors.text }}>{value}</div>
      <div style={{ fontSize: 11.5, color: colors.accent, marginTop: 2 }}>{delta}</div>
    </Card>
  );
}

function QuickAction({ label, desc, onClick }) {
  return (
    <div onClick={onClick} style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "12px 14px", background: colors.surface2, borderRadius: 10, cursor: "pointer",
    }}>
      <div>
        <div style={{ fontSize: 13.5, color: colors.text, fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>{desc}</div>
      </div>
      <ChevronRight size={16} color={colors.muted} />
    </div>
  );
}

/* ---------------------------------------------------------------
   MOCK INTERVIEW
----------------------------------------------------------------- */

function MockInterview() {
  const [qIndex, setQIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [recording, setRecording] = useState(false);

  const current = interviewQuestions[qIndex];

  const handleSubmit = () => {
    if (!answer.trim()) return;
    setSubmitted(true);
  };

  const next = () => {
    setSubmitted(false);
    setAnswer("");
    setQIndex((i) => (i + 1) % interviewQuestions.length);
  };

  return (
    <div>
      <SectionTitle sub="AI-led mock interview with real-time evaluation">Mock interview</SectionTitle>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16 }}>
        <Card padding={0} style={{ overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${colors.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: 8, background: colors.accent }} />
              <span style={{ fontSize: 13, color: colors.text, fontWeight: 500 }}>Live session</span>
            </div>
            <Pill tone="muted">Question {qIndex + 1} of {interviewQuestions.length}</Pill>
          </div>

          <div style={{ padding: 24 }}>
            <Pill tone="accent">{current.type}</Pill>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, color: colors.text, lineHeight: 1.7, marginTop: 14 }}>
              {current.q}
            </p>

            {!submitted ? (
              <>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type or speak your answer..."
                  rows={6}
                  style={{
                    width: "100%", marginTop: 18, background: colors.bg, border: `1px solid ${colors.border}`,
                    borderRadius: 10, padding: 14, color: colors.text, fontSize: 13.5, fontFamily: "Inter, sans-serif",
                    resize: "vertical", boxSizing: "border-box", outline: "none",
                  }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
                  <button
                    onClick={() => setRecording((r) => !r)}
                    style={{
                      display: "flex", alignItems: "center", gap: 6, background: recording ? colors.dangerDim : colors.surface2,
                      color: recording ? colors.danger : colors.muted, border: "none", borderRadius: 8,
                      padding: "9px 14px", fontSize: 13, cursor: "pointer", fontFamily: "Inter, sans-serif",
                    }}
                  >
                    <Mic size={14} />{recording ? "Recording... tap to stop" : "Answer by voice"}
                  </button>
                  <button
                    onClick={handleSubmit}
                    style={{
                      display: "flex", alignItems: "center", gap: 6, background: colors.accent, color: "#06120D",
                      border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer",
                    }}
                  >
                    <Send size={14} />Submit answer
                  </button>
                </div>
              </>
            ) : (
              <FeedbackPanel onNext={next} />
            )}
          </div>
        </Card>

        <Card>
          <div style={{ fontSize: 13, fontWeight: 500, color: colors.text, marginBottom: 12 }}>Session outline</div>
          {interviewQuestions.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: i < interviewQuestions.length - 1 ? `1px solid ${colors.border}` : "none" }}>
              {i < qIndex ? <CheckCircle2 size={14} color={colors.accent} /> : i === qIndex ? <Circle size={14} color={colors.amber} /> : <Circle size={14} color={colors.faint} />}
              <span style={{ fontSize: 12.5, color: i === qIndex ? colors.text : colors.muted }}>{item.type}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function FeedbackPanel({ onNext }) {
  return (
    <div style={{ marginTop: 18, background: colors.surface2, borderRadius: 10, padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: colors.text }}>AI feedback</span>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: colors.accent }}>{mockFeedback.score}/10</span>
      </div>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11.5, color: colors.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 }}>Strengths</div>
        {mockFeedback.strengths.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: colors.text, marginBottom: 6, lineHeight: 1.5 }}>
            <Check size={14} color={colors.accent} style={{ flexShrink: 0, marginTop: 2 }} /><span>{s}</span>
          </div>
        ))}
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11.5, color: colors.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 }}>Areas to improve</div>
        {mockFeedback.improvements.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: colors.text, marginBottom: 6, lineHeight: 1.5 }}>
            <X size={14} color={colors.danger} style={{ flexShrink: 0, marginTop: 2 }} /><span>{s}</span>
          </div>
        ))}
      </div>
      <button onClick={onNext} style={{
        background: colors.accent, color: "#06120D", border: "none", borderRadius: 8,
        padding: "9px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer",
      }}>Next question</button>
    </div>
  );
}

/* ---------------------------------------------------------------
   RESUME REVIEW
----------------------------------------------------------------- */

function ResumeReview() {
  const [uploaded, setUploaded] = useState(false);
  const atsScore = 78;
  const breakdown = [
    { label: "Keyword match", value: 82 },
    { label: "Formatting", value: 91 },
    { label: "Action verbs", value: 68 },
    { label: "Quantified impact", value: 64 },
  ];
  return (
    <div>
      <SectionTitle sub="Upload your resume for an instant ATS score and AI feedback">AI resume review</SectionTitle>

      {!uploaded ? (
        <Card style={{ textAlign: "center", padding: 50, border: `1.5px dashed ${colors.border}` }} >
          <Upload size={28} color={colors.muted} style={{ marginBottom: 10 }} />
          <div style={{ fontSize: 14, color: colors.text, marginBottom: 4 }}>Drop your resume here, or click to browse</div>
          <div style={{ fontSize: 12, color: colors.muted, marginBottom: 18 }}>PDF or DOCX, up to 5MB</div>
          <button onClick={() => setUploaded(true)} style={{
            background: colors.accent, color: "#06120D", border: "none", borderRadius: 8,
            padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>Upload resume (demo)</button>
        </Card>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 16 }}>
          <Card style={{ textAlign: "center" }}>
            <div style={{ fontSize: 12, color: colors.muted, marginBottom: 10 }}>ATS score</div>
            <div style={{ position: "relative", width: 140, height: 140, margin: "0 auto" }}>
              <svg width="140" height="140" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r="60" stroke={colors.surface2} strokeWidth="12" fill="none" />
                <circle
                  cx="70" cy="70" r="60" stroke={colors.accent} strokeWidth="12" fill="none"
                  strokeDasharray={`${(atsScore / 100) * 377} 377`} strokeLinecap="round"
                  transform="rotate(-90 70 70)"
                />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 30, fontWeight: 700, color: colors.text }}>{atsScore}</span>
                <span style={{ fontSize: 11, color: colors.muted }}>out of 100</span>
              </div>
            </div>
            <Pill tone="amber">Good — small fixes will help</Pill>
            <button onClick={() => setUploaded(false)} style={{
              display: "block", margin: "16px auto 0", background: "none", border: "none",
              color: colors.muted, fontSize: 12, cursor: "pointer", textDecoration: "underline",
            }}>Upload a different file</button>
          </Card>

          <Card>
            <div style={{ fontSize: 13, fontWeight: 500, color: colors.text, marginBottom: 14 }}>Score breakdown</div>
            {breakdown.map((b) => (
              <div key={b.label} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 6 }}>
                  <span style={{ color: colors.muted }}>{b.label}</span>
                  <span style={{ color: colors.text, fontWeight: 500 }}>{b.value}%</span>
                </div>
                <div style={{ height: 6, background: colors.surface2, borderRadius: 4 }}>
                  <div style={{ width: `${b.value}%`, height: "100%", background: colors.accent, borderRadius: 4 }} />
                </div>
              </div>
            ))}
            <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${colors.border}` }}>
              <div style={{ fontSize: 11.5, color: colors.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.4 }}>AI suggestions</div>
              <div style={{ fontSize: 13, color: colors.text, lineHeight: 1.6, marginBottom: 8 }}>
                "Built backend services" → try "Built and shipped 4 backend services handling 2M+ daily requests."
              </div>
              <div style={{ fontSize: 13, color: colors.text, lineHeight: 1.6 }}>
                Add a metrics line under each project — recruiters scan for numbers first.
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------
   CODING PROBLEMS
----------------------------------------------------------------- */

function difficultyTone(d) {
  if (d === "Easy") return "accent";
  if (d === "Medium") return "amber";
  return "danger";
}

function ProblemsList({ initialFilter }) {
  const [filter, setFilter] = useState(initialFilter || "All");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState(problems);

  const toggleBookmark = (id) => {
    setItems((prev) => prev.map((p) => p.id === id ? { ...p, bookmarked: !p.bookmarked } : p));
  };

  const filtered = items.filter((p) => {
    const matchesFilter = filter === "All" || p.difficulty === filter || (filter === "Bookmarked" && p.bookmarked);
    const matchesQuery = p.title.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <div>
      <SectionTitle sub="Curated DSA problems mapped to common interview patterns">Coding problems</SectionTitle>

      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, padding: "8px 12px" }}>
          <Search size={14} color={colors.muted} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search problems..."
            style={{ background: "none", border: "none", outline: "none", color: colors.text, fontSize: 13, width: "100%" }}
          />
        </div>
        {["All", "Easy", "Medium", "Hard", "Bookmarked"].map((f) => (
          <div key={f} onClick={() => setFilter(f)} style={{
            padding: "8px 14px", borderRadius: 8, fontSize: 12.5, cursor: "pointer",
            background: filter === f ? colors.surface2 : "transparent",
            border: `1px solid ${filter === f ? colors.border : "transparent"}`,
            color: filter === f ? colors.text : colors.muted, whiteSpace: "nowrap",
          }}>{f}</div>
        ))}
      </div>

      <Card padding={0}>
        {filtered.map((p, i) => (
          <div key={p.id} style={{
            display: "flex", alignItems: "center", gap: 14, padding: "14px 18px",
            borderBottom: i < filtered.length - 1 ? `1px solid ${colors.border}` : "none",
          }}>
            {p.solved ? <CheckCircle2 size={16} color={colors.accent} /> : <Circle size={16} color={colors.faint} />}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, color: colors.text, fontWeight: 500 }}>{p.title}</div>
              <div style={{ fontSize: 11.5, color: colors.muted, marginTop: 2 }}>{p.topic}</div>
            </div>
            <Pill tone={difficultyTone(p.difficulty)}>{p.difficulty}</Pill>
            <BookmarkCheck
              size={16}
              color={p.bookmarked ? colors.amber : colors.faint}
              fill={p.bookmarked ? colors.amber : "none"}
              style={{ cursor: "pointer" }}
              onClick={() => toggleBookmark(p.id)}
            />
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: 30, textAlign: "center", color: colors.muted, fontSize: 13 }}>No problems match your search.</div>
        )}
      </Card>
    </div>
  );
}

/* ---------------------------------------------------------------
   DAILY CHALLENGE
----------------------------------------------------------------- */

function DailyChallenge() {
  const [done, setDone] = useState(false);
  return (
    <div>
      <SectionTitle sub="One fresh problem every day to keep your streak alive">Daily challenge</SectionTitle>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <Pill tone="amber">Medium</Pill>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 19, color: colors.text, margin: "12px 0 6px" }}>
              Reverse nodes in k-group
            </h3>
            <p style={{ color: colors.muted, fontSize: 13.5, lineHeight: 1.6, maxWidth: 480 }}>
              Given a linked list, reverse the nodes of the list k at a time and return the modified list.
              k is a positive integer and is less than or equal to the length of the list.
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <Flame size={26} color={colors.amber} />
            <div style={{ fontSize: 12, color: colors.muted, marginTop: 4 }}>12-day streak</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, margin: "20px 0", fontSize: 12.5, color: colors.muted }}>
          <span>Topic: Linked List</span>
          <span>·</span>
          <span>Acceptance: 54%</span>
          <span>·</span>
          <span>4,210 attempted today</span>
        </div>

        {!done ? (
          <button onClick={() => setDone(true)} style={{
            background: colors.accent, color: "#06120D", border: "none", borderRadius: 8,
            padding: "10px 20px", fontSize: 13.5, fontWeight: 600, cursor: "pointer",
          }}>Mark as solved</button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: colors.accent, fontSize: 13.5 }}>
            <CheckCircle2 size={16} /> Streak extended to 13 days. See you tomorrow.
          </div>
        )}
      </Card>
    </div>
  );
}

/* ---------------------------------------------------------------
   BOOKMARKS (reuses problems list filtered)
----------------------------------------------------------------- */

function Bookmarks() {
  return <ProblemsList initialFilter="Bookmarked" />;
}

/* ---------------------------------------------------------------
   NOTES
----------------------------------------------------------------- */

function Notes() {
  const [notes, setNotes] = useState(notesData);
  const [draft, setDraft] = useState("");

  const addNote = () => {
    if (!draft.trim()) return;
    setNotes([{ id: Date.now(), title: "Untitled note", body: draft, tag: "General" }, ...notes]);
    setDraft("");
  };

  return (
    <div>
      <SectionTitle sub="Jot down patterns, mistakes, and things to remember">Notes</SectionTitle>

      <Card style={{ marginBottom: 16 }}>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Write a quick note..."
          rows={3}
          style={{
            width: "100%", background: colors.bg, border: `1px solid ${colors.border}`,
            borderRadius: 10, padding: 12, color: colors.text, fontSize: 13.5,
            fontFamily: "Inter, sans-serif", resize: "vertical", boxSizing: "border-box", outline: "none",
          }}
        />
        <button onClick={addNote} style={{
          marginTop: 10, background: colors.accent, color: "#06120D", border: "none",
          borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer",
        }}>Add note</button>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
        {notes.map((n) => (
          <Card key={n.id} padding={16}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <span style={{ fontSize: 14, color: colors.text, fontWeight: 500 }}>{n.title}</span>
              <Pill>{n.tag}</Pill>
            </div>
            <p style={{ fontSize: 13, color: colors.muted, lineHeight: 1.6, margin: 0 }}>{n.body}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   ROADMAP
----------------------------------------------------------------- */

function Roadmap() {
  return (
    <div>
      <SectionTitle sub="A guided path from fundamentals to offer-ready">Interview roadmap</SectionTitle>
      <div style={{ position: "relative", paddingLeft: 28 }}>
        <div style={{ position: "absolute", left: 9, top: 6, bottom: 6, width: 2, background: colors.border }} />
        {roadmapStages.map((stage, i) => (
          <div key={i} style={{ position: "relative", marginBottom: 22 }}>
            <div style={{
              position: "absolute", left: -28, top: 2, width: 20, height: 20, borderRadius: "50%",
              background: stage.status === "done" ? colors.accent : stage.status === "active" ? colors.surface : colors.surface2,
              border: stage.status === "active" ? `2px solid ${colors.amber}` : "none",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {stage.status === "done" && <Check size={12} color="#06120D" />}
              {stage.status === "locked" && <Lock size={10} color={colors.faint} />}
            </div>
            <Card padding={16} style={{ opacity: stage.status === "locked" ? 0.55 : 1, marginLeft: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14.5, color: colors.text, fontWeight: 500 }}>{stage.title}</span>
                {stage.status === "active" && <Pill tone="amber">In progress</Pill>}
                {stage.status === "done" && <Pill tone="accent">Complete</Pill>}
                {stage.status === "locked" && <Pill>Locked</Pill>}
              </div>
              <p style={{ fontSize: 13, color: colors.muted, margin: "6px 0 0" }}>{stage.desc}</p>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   ROOT APP
----------------------------------------------------------------- */

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [active, setActive] = useState("dashboard");

  if (!loggedIn) {
    return <LoginScreen onLogin={() => setLoggedIn(true)} />;
  }

  const pages = {
    dashboard: <Dashboard setActive={setActive} />,
    interview: <MockInterview />,
    resume: <ResumeReview />,
    problems: <ProblemsList />,
    daily: <DailyChallenge />,
    bookmarks: <Bookmarks />,
    notes: <Notes />,
    roadmap: <Roadmap />,
  };

  return (
    <Shell active={active} setActive={setActive} onLogout={() => setLoggedIn(false)}>
      {pages[active]}
    </Shell>
  );
}
