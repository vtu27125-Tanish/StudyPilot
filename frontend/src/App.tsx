import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Upload from './pages/Upload';
import Tutor from './pages/Tutor';
import Quiz from './pages/Quiz';
import Dashboard from './pages/Dashboard';
import KnowledgeMap from './pages/KnowledgeMap';
import Flashcards from './pages/Flashcards';
import StudySchedule from './pages/StudySchedule';
import { BookOpen, UploadCloud, MessageSquare, Target, Map, Calendar, Layers, Sparkles, Bell, Search, User } from 'lucide-react';

function NavLink({ to, icon: Icon, children }: { to: string, icon: any, children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link to={to} className="block relative">
      {isActive && (
        <motion.div 
          layoutId="nav-pill"
          className="absolute inset-0 bg-blue-600/20 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)] rounded-xl"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      <div className={`relative flex items-center gap-3 p-3 rounded-xl transition-colors duration-300 ${
        isActive ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
      }`}>
        <Icon size={20} className={isActive ? 'animate-pulse' : ''} />
        <span className="font-medium tracking-wide">{children}</span>
      </div>
    </Link>
  );
}

function AnimatedRoute({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}

function App() {
  return (
    <Router>
      <Toaster position="top-right" toastOptions={{
        style: {
          background: 'rgba(30, 41, 59, 0.9)',
          color: '#fff',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)'
        }
      }} />
      <div className="flex h-screen bg-transparent text-slate-100 overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 glass-panel flex flex-col shadow-2xl border-r border-slate-700/50 z-20">
          <div className="p-8">
            <h1 className="text-3xl font-bold flex items-center gap-3 text-gradient">
              <Sparkles size={28} className="text-blue-400" />
              StudyPilot
            </h1>
            <p className="text-xs text-slate-500 mt-2 tracking-widest uppercase font-semibold">AI Study Companion</p>
          </div>
          <nav className="flex-1 px-6 space-y-2 overflow-y-auto pb-6 custom-scrollbar">
            <NavLink to="/" icon={Target}>Dashboard</NavLink>
            <NavLink to="/upload" icon={UploadCloud}>Ingestion</NavLink>
            <NavLink to="/tutor" icon={MessageSquare}>Tutor Chat</NavLink>
            <NavLink to="/quiz" icon={BookOpen}>Quizzes</NavLink>
            
            <div className="pt-6 pb-2">
              <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Advanced Tools</p>
            </div>
            
            <NavLink to="/map" icon={Map}>Knowledge Map</NavLink>
            <NavLink to="/flashcards" icon={Layers}>Flashcards</NavLink>
            <NavLink to="/schedule" icon={Calendar}>Study Schedule</NavLink>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none z-0"></div>
          
          {/* Top Navbar */}
          <header className="h-20 glass-panel border-b border-slate-700/50 flex items-center justify-between px-10 z-10 sticky top-0">
            <div className="flex items-center gap-4 bg-slate-900/50 border border-slate-700 rounded-full px-4 py-2 w-96 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
              <Search size={18} className="text-slate-400" />
              <input type="text" placeholder="Global search..." className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-slate-500" />
            </div>
            <div className="flex items-center gap-6">
              <button className="relative text-slate-400 hover:text-white transition">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-blue-500 rounded-full border-2 border-slate-900"></span>
              </button>
              <div className="flex items-center gap-3 border-l border-slate-700 pl-6 cursor-pointer hover:opacity-80 transition">
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">Alex Scholar</p>
                  <p className="text-xs text-blue-400">Level 12 Learner</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                  <User size={20} className="text-white" />
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto z-10 p-2">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<AnimatedRoute><Dashboard /></AnimatedRoute>} />
                <Route path="/upload" element={<AnimatedRoute><Upload /></AnimatedRoute>} />
                <Route path="/tutor" element={<AnimatedRoute><Tutor /></AnimatedRoute>} />
                <Route path="/quiz" element={<AnimatedRoute><Quiz /></AnimatedRoute>} />
                <Route path="/map" element={<AnimatedRoute><KnowledgeMap /></AnimatedRoute>} />
                <Route path="/flashcards" element={<AnimatedRoute><Flashcards /></AnimatedRoute>} />
                <Route path="/schedule" element={<AnimatedRoute><StudySchedule /></AnimatedRoute>} />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
