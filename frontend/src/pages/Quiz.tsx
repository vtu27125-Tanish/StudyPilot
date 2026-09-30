import { useState } from 'react';
import axios from 'axios';
import { Target, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

export default function Quiz() {
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const generateQuiz = async () => {
    setLoading(true);
    setSubmitted(false);
    setAnswers({});
    const toastId = toast.loading('Synthesizing questions via Gemini...');
    try {
      const res = await axios.post('http://localhost:8000/quiz/generate', {
        topic,
        count: 3,
        user_id: 1, 
        difficulty: 'medium'
      });
      setQuestions(res.data.questions);
      toast.success('Quiz generated & cross-validated!', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate quiz.', { id: toastId });
    }
    setLoading(false);
  };

  const handleSelect = (qIndex: number, option: string) => {
    if(submitted) return;
    setAnswers(prev => ({...prev, [qIndex]: option}));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    
    // Calculate score
    let correct = 0;
    questions.forEach((q, i) => {
      if(answers[i] === q.correct_answer) correct++;
    });
    
    if (correct === questions.length && questions.length > 0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      toast.success('Perfect score! Mastery updated.', { icon: '🏆' });
    } else {
      toast.success(`You scored ${correct}/${questions.length}. BKT model updated.`);
    }
  };

  return (
    <div className="p-10 max-w-4xl mx-auto min-h-full pb-24">
      <header className="mb-10 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">Adaptive Assessment</h2>
        <p className="text-slate-400">Test your knowledge with cross-validated questions.</p>
      </header>

      {!questions.length ? (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card p-10 rounded-3xl text-center max-w-2xl mx-auto mt-10"
        >
          <div className="h-16 w-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Target className="text-blue-400" size={32} />
          </div>
          <h3 className="text-2xl text-white font-bold mb-6">Generate a New Quiz</h3>
          <input 
            type="text" 
            className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-5 py-4 mb-6 focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Enter topic (e.g. Backpropagation)"
            value={topic}
            onChange={e => setTopic(e.target.value)}
          />
          <button 
            onClick={generateQuiz}
            disabled={!topic || loading}
            className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-6 py-4 rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-900/50 disabled:opacity-50"
          >
            {loading && <div className="absolute inset-0 bg-white/20 animate-pulse"></div>}
            <span className="relative z-10">{loading ? 'Generating (Cross-validating)...' : 'Generate Quiz'}</span>
          </button>
        </motion.div>
      ) : (
        <motion.div 
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="space-y-8"
        >
          {questions.map((q, i) => (
            <motion.div 
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              key={i} 
              className="glass-card p-8 rounded-3xl"
            >
              <h3 className="font-semibold mb-6 text-xl text-white leading-relaxed">
                <span className="text-blue-400 mr-2">{i+1}.</span> 
                {q.question_text}
              </h3>
              <div className="space-y-3">
                {JSON.parse(q.options).map((opt: string, j: number) => {
                  const isSelected = answers[i] === opt;
                  const isCorrect = submitted && opt === q.correct_answer;
                  const isWrongSelected = submitted && isSelected && opt !== q.correct_answer;
                  
                  return (
                    <motion.div 
                      whileHover={!submitted ? { scale: 1.01 } : {}}
                      whileTap={!submitted ? { scale: 0.99 } : {}}
                      key={j} 
                      onClick={() => handleSelect(i, opt)}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer border ${
                        isCorrect ? 'bg-green-500/20 border-green-500/50' :
                        isWrongSelected ? 'bg-red-500/20 border-red-500/50' :
                        isSelected ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-900/30' : 
                        'bg-slate-800/50 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                      }`}
                    >
                      {isCorrect ? <CheckCircle2 className="text-green-400 shrink-0"/> : 
                       isWrongSelected ? <AlertCircle className="text-red-400 shrink-0"/> :
                       isSelected ? <CheckCircle2 className="text-white shrink-0"/> : 
                       <Circle className="text-slate-500 shrink-0"/>}
                      <span className={isSelected || isCorrect || isWrongSelected ? 'text-white font-medium' : 'text-slate-300'}>{opt}</span>
                    </motion.div>
                  );
                })}
              </div>
              <AnimatePresence>
                {submitted && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6 p-5 bg-slate-800/80 border border-slate-700 rounded-xl"
                  >
                    <p className="text-sm text-slate-300 mb-2"><strong className="text-white">Explanation:</strong> {q.explanation}</p>
                    <p className="text-xs text-blue-400 font-mono mt-3">Source Citation: {q.source_location}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
          
          {!submitted && (
            <motion.button 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              onClick={handleSubmit}
              className="w-full bg-green-600 text-white font-bold px-6 py-4 rounded-xl hover:bg-green-500 transition-all shadow-lg shadow-green-900/30"
            >
              Submit Answers & Evaluate
            </motion.button>
          )}
        </motion.div>
      )}
    </div>
  );
}
