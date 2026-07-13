import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

const CONTACT_INFO = [
  { icon: Mail,   title: 'Email',    value: 'support@starstore.com',  desc: 'Response within 2 hours' },
  { icon: Phone,  title: 'Phone',    value: '+1 (555) 000-1111',       desc: 'Mon–Fri, 9am to 6pm' },
  { icon: MapPin, title: 'Location', value: '77 Silicon Valley Blvd', desc: 'San Jose, CA 95112' },
];

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [success,    setSuccess]    = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setSuccess(true); }, 1800);
  };

  const inputCls = 'w-full px-4 py-3 text-[15px] border border-gray-200 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all';

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 text-center">
          <p className="text-xs text-amber-700 uppercase tracking-widest font-semibold mb-3">Get in Touch</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            We'd Love to Hear From You
          </h1>
          <p className="mt-4 text-gray-600 text-base max-w-xl mx-auto">
            Questions about a product, partnership inquiry, or just want to say hello — our team is here to help.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Contact info */}
          <div className="space-y-4">
            {CONTACT_INFO.map(({ icon: Icon, title, value, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white border border-gray-200 rounded-lg p-5 flex items-start gap-4 shadow-card hover:shadow-lift hover:border-amber-300 transition-all"
              >
                <div className="w-10 h-10 bg-amber-50 border border-amber-100 rounded-lg flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-amber-700" strokeWidth={1.75} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-0.5">{title}</p>
                  <p className="text-sm font-semibold text-gray-900">{value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </div>
              </motion.div>
            ))}

            {/* Note */}
            <div className="bg-amber-600 rounded-lg p-6 text-white">
              <h4 className="font-semibold text-lg mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Partnership Inquiries</h4>
              <p className="text-amber-100 text-base leading-relaxed">Interested in featuring your products or collaborating with us? Send us a message and we'll respond within 24 hours.</p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-card">
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-16 text-center gap-5"
                  >
                    <div className="w-16 h-16 bg-green-50 border border-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 size={32} className="text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Message Sent!</h3>
                      <p className="text-gray-500 text-sm">We'll get back to you within 2 hours.</p>
                    </div>
                    <Button variant="secondary" onClick={() => setSuccess(false)}>Send Another</Button>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 block mb-1.5">Full Name *</label>
                        <input type="text" required placeholder="Jane Doe" className={inputCls} />
                      </div>
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 block mb-1.5">Email Address *</label>
                        <input type="email" required placeholder="jane@example.com" className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 block mb-1.5">Subject *</label>
                      <input type="text" required placeholder="e.g. Partnership Opportunity" className={inputCls} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 block mb-1.5">Message *</label>
                      <textarea
                        required
                        rows={6}
                        placeholder="Tell us how we can help…"
                        className={`${inputCls} resize-none`}
                      />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <p className="text-xs text-gray-400 max-w-[16rem]">
                        By submitting you agree to our <a href="/legal/privacy" className="text-amber-700 hover:underline">Privacy Policy</a>.
                      </p>
                      <Button type="submit" variant="accent" size="lg" disabled={submitting} className="gap-2 min-w-[140px]">
                        {submitting ? <><Loader2 size={16} className="animate-spin" /> Sending…</> : <><Send size={16} /> Send Message</>}
                      </Button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
