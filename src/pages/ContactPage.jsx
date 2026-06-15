import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const ContactPage = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-16">
      <div className="text-center max-w-2xl mx-auto space-y-6">
         <h1 className="text-5xl md:text-8xl font-black dark:text-white">Get in <span className="text-orange-500">Touch</span></h1>
         <p className="text-xl text-gray-500 dark:text-gray-400">Have questions about a product or your order? Our elite support team is standing by to assist you 24/7.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact Info */}
        <div className="lg:col-span-1 space-y-8">
           {[
             { icon: Mail, title: 'Email Support', val: 'support@starstore.com', desc: 'Direct response within 2 hours' },
             { icon: Phone, title: 'Call Us', val: '+1 (555) STAR-STORE', desc: 'Mon-Fri from 9am to 6pm' },
             { icon: MapPin, title: 'Global Office', val: '77 Silicon Valley Blvd', desc: 'San Jose, CA 95112' },
           ].map((item, i) => (
             <div key={i} className="glass-card p-8 bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 flex items-start gap-6 hover:border-orange-500/30 transition-colors">
               <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
                  <item.icon size={24} />
               </div>
               <div className="space-y-1">
                  <h3 className="text-lg font-bold dark:text-white">{item.title}</h3>
                  <p className="text-orange-600 dark:text-orange-400 font-black">{item.val}</p>
                  <p className="text-xs text-gray-400 font-medium">{item.desc}</p>
               </div>
             </div>
           ))}

           <div className="glass-card p-10 bg-orange-500 text-white relative overflow-hidden border-none">
              <div className="relative z-10 space-y-4">
                 <h4 className="text-2xl font-black">24/7 Live Chat</h4>
                 <p className="text-white/70 text-sm">Need immediate assistance? Our AI-driven support bot can handle most inquiries instantly.</p>
                 <Button variant="glass" className="border-white/20 text-white bg-white/10 w-full h-14 font-black uppercase text-xs tracking-widest gap-2">
                    <MessageSquare size={18} /> Start Chatting
                 </Button>
              </div>
              <Globe className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10" />
           </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
           <motion.div
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="glass-card p-8 md:p-12 bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 space-y-8"
           >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <Input label="Full Name" placeholder="Jane Doe" />
                 <Input label="Email Address" placeholder="jane@example.com" type="email" />
              </div>
              <Input label="Subject" placeholder="How can we help?" />
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-gray-400">Message</label>
                <textarea
                  className="w-full h-40 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/10 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-gray-900 dark:text-white transition-all resize-none"
                  placeholder="Tell us more about your inquiry..."
                ></textarea>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                 <p className="text-xs text-gray-400 max-w-xs">By submitting this form, you agree to our Privacy Policy and Terms of Service.</p>
                 <Button className="w-full sm:w-auto px-12 h-14 gap-3 text-lg">
                    Send Message <Send size={20} />
                 </Button>
              </div>
           </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
