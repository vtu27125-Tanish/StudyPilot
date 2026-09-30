import { useState } from 'react';
import { Layers } from 'lucide-react';

export default function Flashcards() {
  const [flipped, setFlipped] = useState(false);
  
  const cards = [
    { front: "What is Backpropagation?", back: "The process of computing gradients of the loss function with respect to the network weights." },
    { front: "What is the purpose of Gradient Descent?", back: "To minimize the loss function by updating parameters in the opposite direction of the gradient." }
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextCard = () => {
    setFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  return (
    <div className="p-10 h-full flex flex-col items-center max-w-4xl mx-auto">
      <div className="w-full mb-10 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Layers className="text-blue-400" /> Targeted Revision
          </h2>
          <p className="text-slate-400">Flashcards dynamically generated for your weakest topics.</p>
        </div>
        <div className="bg-slate-800 px-4 py-2 rounded-lg text-slate-300 text-sm font-medium border border-slate-700">
          Card {currentIndex + 1} of {cards.length}
        </div>
      </div>
      
      <div 
        className="w-full max-w-2xl aspect-video glass-card rounded-3xl flex items-center justify-center p-12 cursor-pointer relative"
        style={{ perspective: "1000px" }}
        onClick={() => setFlipped(!flipped)}
      >
        <div className="text-center absolute inset-0 flex items-center justify-center p-12 transition-all duration-500 ease-in-out" 
             style={{ opacity: flipped ? 0 : 1, transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
          <p className="text-3xl font-bold text-white leading-relaxed">
            {cards[currentIndex].front}
          </p>
        </div>
        <div className="text-center absolute inset-0 flex items-center justify-center p-12 transition-all duration-500 ease-in-out"
             style={{ opacity: flipped ? 1 : 0, transform: flipped ? 'rotateY(0deg)' : 'rotateY(-180deg)' }}>
          <p className="text-2xl font-medium text-blue-200 leading-relaxed">
            {cards[currentIndex].back}
          </p>
        </div>
      </div>
      
      <p className="mt-6 text-slate-500 text-sm tracking-widest uppercase font-semibold">Click the card to flip</p>
      
      <button 
        onClick={nextCard}
        className="mt-12 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white px-10 py-4 rounded-full transition-all font-bold tracking-wide"
      >
        Next Card ➔
      </button>
    </div>
  );
}
