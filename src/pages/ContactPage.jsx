import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Globe, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate real backend processing
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      const submission = {
        id: Date.now(),
        type: 'contact',
        timestamp: new Date().toISOString()
      };
      const existing = JSON.parse(localStorage.getItem('form_submissions') || '[]');
      localStorage.setItem('form_submissions', JSON.stringify([...existing, submission]));
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-16">
      <div className="text-center max-w-2xl mx-auto space-y-6">
         <h1 className="text-4xl md:text-7xl font-black dark:text-white text-orange-950 tracking-tighter">Get in <span className="text-orange-500">Touch</span></h1>
         <p className="text-lg text-gray-500 dark:text-gray-400">Have questions about a product or partnership? Our elite support team is standing by to assist you 24/7.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact Info */}
        <div className="lg:col-span-1 space-y-8">
           {[
             { icon: Mail, title: 'Email Support', val: 'concierge@starstore.com', desc: 'Direct response within 2 hours' },
             { icon: Phone, title: 'Call Us', val: '+1 (555) STAR-ELITE', desc: 'Mon-Fri from 9am to 6pm' },
             { icon: MapPin, title: 'Global Office', val: '77 Silicon Valley Blvd', desc: 'San Jose, CA 95112' },
           ].map((item, i) => (
             <motion.div 
               key={i} 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: i * 0.1 }}
               className="glass-card p-8 bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 flex items-start gap-6 hover:border-orange-500/30 transition-colors"
             >
               <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
                  <item.icon size={24} />
               </div>
               <div className="space-y-1">
                  <h3 className="text-lg font-bold dark:text-white">{item.title}</h3>
                  <p className="text-orange-600 dark:text-orange-400 font-black">{item.val}</p>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">{item.desc}</p>
               </div>
             </motion.div>
           ))}

           <div className="glass-card p-10 bg-orange-500 text-white relative overflow-hidden border-none shadow-2xl shadow-orange-500/20">
              <div className="relative z-10 space-y-4">
                 <h4 className="text-2xl font-black">24/7 Live Chat</h4>
                 <p className="text-white/70 text-sm">Need immediate assistance? Our AI-driven support bot can handle most inquiries instantly.</p>
                 <Button variant="glass" className="border-white/20 text-white bg-white/10 w-full h-14 font-black uppercase text-[10px] tracking-[0.2em] gap-2">
                    <MessageSquare size={16} /> Start Chatting
                 </Button>
              </div>
              <Globe className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10" />
           </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="glass-card p-8 md:p-12 bg-white dark:bg-white/2 border-gray-100 dark:border-white/5 space-y-8 relative overflow-hidden"
           >
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-20 text-center space-y-6"
                  >
                    <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center">
                       <CheckCircle2 size={48} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-3xl font-black dark:text-white">Message Dispatched</h3>
                      <p className="text-gray-500">Your inquiry has been encrypted and sent to our team. We'll be in touch shortly.</p>
                    </div>
                    <Button onPointerUp={() => setIsSuccess(false)} variant="glass" className="text-orange-500 border-orange-500/20">Send Another</Button>
                  </motion.div>
                ) : (
                  <form key="form" onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <Input label="Full Name" placeholder="Jane Doe" required />
                       <Input label="Email Address" placeholder="jane@example.com" type="email" required />
                    </div>
                    <Input label="Inquiry Subject" placeholder="Ex: Partnership Opportunity" required />
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-1">Your Message</label>
                      <textarea 
                        required
                        className="w-full h-48 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/10 rounded-2xl p-6 focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-gray-900 dark:text-white transition-all resize-none font-medium"
                        placeholder="Detail your request or feedback here..."
                      ></textarea>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest max-w-[15rem]">
                         By submitting, you agree to our <span className="text-orange-500 underline">Privacy Guidelines</span>.
                       </p>
                       <Button 
                         type="submit" 
                         disabled={isSubmitting}
                         className="w-full sm:w-auto px-12 h-16 gap-3 text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-orange-500/20"
                       >
                          {isSubmitting ? <Loader2 className="animate-spin" /> : "Transmit Message"}
                          {!isSubmitting && <Send size={18} />}
                       </Button>
                    </div>
                  </form>
                )}
              </AnimatePresence>
           </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
