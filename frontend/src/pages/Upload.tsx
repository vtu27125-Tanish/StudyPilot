import { useState } from 'react';
import axios from 'axios';
import { UploadCloud, FileText, Film, Layers, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    setStatus('uploading');
    const toastId = toast.loading('Uploading and processing document...');
    
    try {
      // Simulate progress
      const interval = setInterval(() => {
        setProgress(p => Math.min(p + (Math.random() * 15), 90));
      }, 500);

      const res = await axios.post('http://localhost:8000/upload', formData);
      clearInterval(interval);
      setProgress(100);
      
      toast.success(`Processing complete! ID: ${res.data.document_id}`, { id: toastId });
      setStatus('done');
      
      setTimeout(() => {
        setFile(null);
        setStatus('');
        setProgress(0);
      }, 3000);
      
    } catch (err) {
      toast.error('Upload failed. Please try again.', { id: toastId });
      setStatus('error');
    }
  };

  return (
    <div className="p-10 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[80vh]">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h2 className="text-4xl font-bold text-gradient mb-4">Ingest Knowledge</h2>
        <p className="text-slate-400 max-w-lg mx-auto">Upload PDFs, PPTXs, or MP4s. Our pipeline will automatically transcribe audio, parse text, and use Vision AI to caption diagrams.</p>
      </motion.div>

      <div className="w-full relative">
        <motion.div 
          animate={{ scale: isDragging ? 1.02 : 1 }}
          className={`glass-card p-12 rounded-3xl border-2 border-dashed transition-all duration-300 relative overflow-hidden ${
            isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-slate-600 hover:border-slate-500'
          }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              setFile(e.dataTransfer.files[0]);
              toast.success(`${e.dataTransfer.files[0].name} selected`);
            }
          }}
        >
          {isDragging && <div className="absolute inset-0 bg-blue-500/5 backdrop-blur-sm z-0"></div>}
          
          <div className="relative z-10 text-center">
            <motion.div 
              animate={{ y: isDragging ? -10 : 0 }}
              className="h-24 w-24 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-white/10"
            >
              <UploadCloud className="h-10 w-10 text-blue-400" />
            </motion.div>
            
            <input 
              type="file" 
              onChange={e => {
                if (e.target.files) {
                  setFile(e.target.files[0]);
                  toast.success(`${e.target.files[0].name} selected`);
                }
              }}
              className="hidden"
              id="file-upload"
            />
            
            <h3 className="text-2xl font-semibold text-white mb-2">
              <label htmlFor="file-upload" className="cursor-pointer text-blue-400 hover:text-blue-300 transition mr-2">
                Browse files
              </label>
              or drag and drop
            </h3>
            <p className="text-slate-400 mt-2 flex items-center justify-center gap-6">
              <span className="flex items-center gap-2"><FileText size={16}/> PDF</span>
              <span className="flex items-center gap-2"><Layers size={16}/> PPTX</span>
              <span className="flex items-center gap-2"><Film size={16}/> MP4</span>
            </p>
          </div>
        </motion.div>

        <AnimatePresence>
          {file && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-8 glass-card p-6 rounded-2xl flex items-center justify-between border-l-4 border-l-blue-500 relative overflow-hidden"
            >
              {status === 'uploading' && (
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-blue-500/10 z-0 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              )}
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="h-12 w-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-medium">{file.name}</p>
                  <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              
              <div className="relative z-10">
                {status === 'uploading' ? (
                  <span className="text-blue-400 font-bold px-8 py-3">{Math.round(progress)}%</span>
                ) : status === 'done' ? (
                  <span className="text-green-400 font-bold px-8 py-3 flex items-center gap-2"><CheckCircle2/> Complete</span>
                ) : (
                  <button 
                    onClick={handleUpload}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all font-semibold shadow-lg shadow-blue-900/50"
                  >
                    Start Processing
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
