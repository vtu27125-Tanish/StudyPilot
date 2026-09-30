import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { Target, TrendingUp, Sparkles, AlertCircle, BookOpen, Clock, Brain, ChevronRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useState } from 'react';

const progressionData = [
  { session: 'Sep 10', mastery: 0.1, predicted: 0.1 },
  { session: 'Sep 12', mastery: 0.35, predicted: 0.25 },
  { session: 'Sep 15', mastery: 0.25, predicted: 0.2 },
  { session: 'Sep 16', mastery: 0.55, predicted: 0.45 },
  { session: 'Sep 20', mastery: 0.45, predicted: 0.35 },
  { session: 'Sep 22', mastery: 0.75, predicted: 0.60 },
  { session: 'Sep 25', mastery: 0.7, predicted: 0.65 },
  { session: 'Sep 30', mastery: 0.92, predicted: 0.85 },
];

const domainData = [
  { subject: 'NLP', A: 90, fullMark: 100 },
  { subject: 'Vision', A: 65, fullMark: 100 },
  { subject: 'RL', A: 40, fullMark: 100 },
  { subject: 'Optimization', A: 85, fullMark: 100 },
  { subject: 'Foundations', A: 95, fullMark: 100 },
];

const studyPlan = [
  { 
    id: 1,
    date: "Today, 4:00 PM", 
    topic: "Reinforcement Learning Basics", 
    type: "New Concept",
    reason: "Prerequisite for Q-Learning", 
    urgent: false,
    icon: Brain,
    color: "from-blue-500 to-indigo-500"
  },
  { 
    id: 2,
    date: "Today, 6:30 PM", 
    topic: "Backpropagation", 
    type: "Spaced Repetition",
    reason: "Memory strength dropping below 70%", 
    urgent: true,
    icon: AlertCircle,
    color: "from-orange-500 to-red-500"
  },
  { 
    id: 3,
    date: "Tomorrow, 10:00 AM", 
    topic: "Transformer Architectures", 
    type: "Deep Dive",
    reason: "Continuation of NLP track", 
    urgent: false,
    icon: BookOpen,
    color: "from-purple-500 to-pink-500"
  }
];

const activityData = Array.from({ length: 30 }, (_, i) => ({
  day: i,
  score: Math.floor(Math.random() * 100)
}));

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function Dashboard() {
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);

  return (
    <div className="p-8 max-w-[1600px] mx-auto h-full overflow-y-auto pb-24 space-y-8">
      {/* Header Section */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-3 border border-blue-500/20">
            <Zap size={14} /> Level 12 Scholar
          </div>
          <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">
            Welcome back, <span className="text-gradient">Alex</span>
          </h2>
          <p className="text-slate-400 text-lg">Your cognitive model has updated. Ready for your next session?</p>
        </div>
        
        <div className="flex gap-4">
          <button className="px-6 py-3 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-700 transition border border-slate-700">
            View Analytics
          </button>
          <button className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-500 transition shadow-[0_0_20px_rgba(37,99,235,0.3)]">
            Start Learning
          </button>
        </div>
      </motion.header>

      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="show"
        className="grid grid-cols-12 gap-6"
      >
        {/* Top Stats */}
        <motion.div variants={itemVariants} className="col-span-12 sm:col-span-6 xl:col-span-3 glass-card p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-all"></div>
          <p className="text-sm text-slate-400 font-medium mb-2">Overall Mastery</p>
          <div className="flex items-end gap-3">
            <h3 className="text-4xl font-bold text-white">92<span className="text-2xl text-slate-500">%</span></h3>
            <span className="text-green-400 text-sm font-medium flex items-center mb-1"><TrendingUp size={14} className="mr-1"/> +12%</span>
          </div>
          <div className="mt-4 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} className="bg-blue-500 h-full rounded-full"></motion.div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="col-span-12 sm:col-span-6 xl:col-span-3 glass-card p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl group-hover:bg-purple-500/30 transition-all"></div>
          <p className="text-sm text-slate-400 font-medium mb-2">Current Streak</p>
          <div className="flex items-end gap-3">
            <h3 className="text-4xl font-bold text-white">14<span className="text-2xl text-slate-500">d</span></h3>
            <span className="text-slate-400 text-sm font-medium mb-1">Personal Best: 21d</span>
          </div>
          <div className="mt-4 flex gap-1 h-8 items-end">
            {activityData.slice(-14).map((d, i) => (
              <div key={i} className="flex-1 bg-purple-500/20 rounded-sm hover:bg-purple-500/50 transition-colors" style={{ height: `${Math.max(20, d.score)}%` }}></div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="col-span-12 sm:col-span-6 xl:col-span-3 glass-card p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-green-500/20 rounded-full blur-2xl group-hover:bg-green-500/30 transition-all"></div>
          <p className="text-sm text-slate-400 font-medium mb-2">Topics Mastered</p>
          <div className="flex items-end gap-3">
            <h3 className="text-4xl font-bold text-white">48</h3>
            <span className="text-slate-400 text-sm font-medium mb-1">/ 64 Total</span>
          </div>
          <div className="mt-4 flex -space-x-2">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center relative z-10 hover:z-20 transition-transform hover:scale-110">
                <Sparkles size={12} className={i <= 3 ? "text-green-400" : "text-slate-600"} />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="col-span-12 sm:col-span-6 xl:col-span-3 glass-card p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/20 rounded-full blur-2xl group-hover:bg-amber-500/30 transition-all"></div>
          <p className="text-sm text-slate-400 font-medium mb-2">Study Hours</p>
          <div className="flex items-end gap-3">
            <h3 className="text-4xl font-bold text-white">124<span className="text-2xl text-slate-500">h</span></h3>
            <span className="text-amber-400 text-sm font-medium mb-1 flex items-center"><TrendingUp size={14} className="mr-1"/> Top 5%</span>
          </div>
          <div className="mt-4 w-full flex items-center gap-2">
            <Clock size={16} className="text-amber-400"/>
            <span className="text-sm text-slate-400">4.2h this week</span>
          </div>
        </motion.div>

        {/* Main Chart Area */}
        <motion.div variants={itemVariants} className="col-span-12 lg:col-span-8 glass-card p-8 rounded-3xl flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">Cognitive Model Progression</h3>
              <p className="text-slate-400 text-sm">Actual mastery (BKT) vs. Predicted forgetting curve</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-slate-300">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500/50"></div>
                <span className="text-sm text-slate-300">Predicted</span>
              </div>
            </div>
          </div>
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMastery" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="session" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} dx={-10} tickFormatter={(val) => `${Math.round(val * 100)}%`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: any) => [`${Math.round(Number(value) * 100)}%`, undefined]}
                />
                <Area type="monotone" dataKey="predicted" name="Predicted" stroke="#a855f7" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPredicted)" />
                <Area type="monotone" dataKey="mastery" name="Actual Mastery" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorMastery)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Radar Chart Area */}
        <motion.div variants={itemVariants} className="col-span-12 lg:col-span-4 glass-card p-8 rounded-3xl flex flex-col">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white mb-1">Knowledge Domains</h3>
            <p className="text-slate-400 text-sm">Competency radar relative to cohort</p>
          </div>
          <div className="flex-1 w-full flex items-center justify-center -ml-4 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="65%" data={domainData}>
                <PolarGrid stroke="rgba(255,255,255,0.15)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Mastery" dataKey="A" stroke="#8b5cf6" strokeWidth={2} fill="#8b5cf6" fillOpacity={0.4} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Dynamic Study Plan */}
        <motion.div variants={itemVariants} className="col-span-12 glass-card p-8 rounded-3xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
                <Target className="text-blue-400" /> Optimal Study Path
              </h3>
              <p className="text-slate-400">AI-generated schedule based on your forgetting curve and syllabus priorities.</p>
            </div>
            <button className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center transition">
              View Full Calendar <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {studyPlan.map((plan) => (
              <motion.div 
                key={plan.id}
                whileHover={{ y: -5 }}
                onHoverStart={() => setHoveredPlan(plan.id)}
                onHoverEnd={() => setHoveredPlan(null)}
                className={`p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden group cursor-pointer ${plan.urgent ? 'bg-orange-950/20 border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.1)]' : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600'}`}
              >
                {/* Background Gradient */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${plan.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500 rounded-full`}></div>
                
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${plan.color} bg-opacity-20 shadow-lg relative z-10`}>
                    <plan.icon className="text-white" size={24} />
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">{plan.type}</span>
                    <span className={`text-sm font-medium ${plan.urgent ? 'text-orange-400' : 'text-blue-400'}`}>{plan.date}</span>
                  </div>
                </div>
                
                <h4 className="text-xl font-bold text-white mb-2 leading-tight relative z-10">{plan.topic}</h4>
                <p className="text-slate-400 text-sm mb-6 relative z-10">{plan.reason}</p>
                
                <div className="flex items-center justify-between mt-auto relative z-10">
                  <span className="text-sm font-medium text-slate-500 group-hover:text-slate-300 transition-colors flex items-center gap-1">
                    <Clock size={14} /> ~25 mins
                  </span>
                  <button className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${hoveredPlan === plan.id ? 'bg-white text-slate-900 shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-110' : 'bg-slate-800 text-white'}`}>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

