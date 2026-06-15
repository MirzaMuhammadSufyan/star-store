import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, ArrowRight, Check, Sparkles, Smile, Laptop, Watch, Headphones, Zap, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const GiftFinder = () => {
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState({});
  const navigate = useNavigate();

  const steps = [
    {
      question: "Who are we shopping for today?",
      options: [
        { id: 'me', label: 'Myself', icon: Smile },
        { id: 'friend', label: 'A Techy Friend', icon: Zap },
        { id: 'family', label: 'Family Member', icon: Gift }
      ]
    },
    {
      question: "What's their primary interest?",
      options: [
        { id: 'work', label: 'Work & Productivity', icon: Laptop },
        { id: 'health', label: 'Health & Lifestyle', icon: Watch },
        { id: 'entertainment', label: 'Audio & Fun', icon: Headphones }
      ]
    },
    {
      question: "Choose a budget vibe",
      options: [
        { id: 'budget', label: 'Budget Friendly', icon: Check },
        { id: 'mid', label: 'Mid-Range Elite', icon: Sparkles },
        { id: 'ultra', label: 'Ultra Premium', icon: Zap }
      ]
    }
  ];

  const handleOption = (id) => {
    setAnswers({ ...answers, [step]: id });
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setStep(step + 1); // Conclusion
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      <AnimatePresence mode="wait">
        {step < steps.length ? (
          <motion.div
            key={`step-${step}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-12 text-center"
          >
            <div className="space-y-4">
              <span className="text-orange-500 font-black uppercase text-xs tracking-widest bg-orange-500/10 px-4 py-1.5 rounded-full border border-orange-500/20">
                Step {step + 1} of {steps.length}
              </span>
              <h1 className="text-4xl md:text-6xl font-black dark:text-white">{steps[step].question}</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {steps[step].options.map((opt) => (
                <motion.button
                  key={opt.id}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onPointerUp={() => handleOption(opt.id)}
                  className="glass-card p-10 bg-white dark:bg-white/5 border-orange-500/10 hover:border-orange-500 group relative overflow-hidden"
                >
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-all" />
                  <opt.icon className="mx-auto mb-6 text-orange-500" size={48} />
                  <span className="text-xl font-bold dark:text-white">{opt.label}</span>
                </motion.button>
              ))}
            </div>

            {step > 0 && (
              <button
                onPointerUp={() => setStep(step - 1)}
                className="text-gray-400 font-bold hover:text-orange-500 transition-colors uppercase text-xs tracking-widest flex items-center justify-center gap-2 mx-auto"
              >
                <RotateCcw size={14} /> Oops, go back
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="conclusion"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 md:p-24 text-center space-y-10 bg-orange-500 text-white relative overflow-hidden"
          >
            <Sparkles className="absolute top-10 right-10 opacity-20 animate-spin-slow" size={120} />
            <div className="space-y-4 relative z-10">
              <h2 className="text-5xl md:text-7xl font-black">We found your matches!</h2>
              <p className="text-xl text-white/80 max-w-xl mx-auto">Based on your taste for {answers[1]} and {answers[2]} budget, we've curated a personalized list.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
              <Button
                size="lg"
                variant="glass"
                className="bg-white text-orange-600 border-white px-10 h-16 text-xl"
                onPointerUp={() => navigate('/catalog')}
              >
                See Recommendations <ArrowRight className="ml-3" />
              </Button>
              <button
                onPointerUp={reset}
                className="text-white/80 font-black uppercase text-sm tracking-widest hover:text-white"
              >
                Restart Quiz
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GiftFinder;
