import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Target, Award, Rocket, CheckCircle2 } from 'lucide-react';

const FadeUp = ({ children, delay = 0, className = '' }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay }} className={className}>
    {children}
  </motion.div>
);

const VALUES = [
  { icon: Users,  title: 'Expert Curation',  desc: 'Every product is hand-vetted by our team of tech specialists before it reaches the store.' },
  { icon: Target, title: 'Accuracy First',   desc: 'Real-time price tracking and stock verification across all partner stores.' },
  { icon: Award,  title: 'Elite Partners',   desc: 'We only work with official brand stores and authorized retailers.' },
  { icon: Rocket, title: 'Always Evolving',  desc: 'Constantly improving our catalog to stay ahead of the global tech curve.' },
];

const CHECKS = ['Verified Brands', '24/7 Monitoring', 'Safe Redirects', 'Expert Reviews'];

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 text-center">
          <FadeUp>
            <p className="text-xs text-amber-700 uppercase tracking-widest font-semibold mb-3">Our Story</p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              Elevating the Standard<br />in Affiliate Commerce.
            </h1>
            <p className="mt-5 text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Star Store was founded with one mission: connect discerning shoppers with premium tech through verified, trustworthy affiliate curation.
            </p>
          </FadeUp>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">

        {/* Values grid */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((item, i) => (
              <FadeUp key={i} delay={i * 0.07}>
                <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 hover:border-amber-300 hover:shadow-sm transition-all">
                  <div className="w-10 h-10 bg-amber-50 border border-amber-100 rounded-lg flex items-center justify-center">
                    <item.icon size={20} className="text-amber-700" strokeWidth={1.75} />
                  </div>
                  <h3 className="font-semibold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>{item.title}</h3>
                  <p className="text-base text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* Story section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <FadeUp>
            <div className="space-y-6">
              <div>
                <p className="text-xs text-amber-700 uppercase tracking-widest font-semibold mb-2">Our Mission</p>
                <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                  A New Paradigm in Affiliate Marketing.
                </h2>
              </div>
              <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
                <p>In an era of digital noise and unreliable reviews, Star Store stands as a beacon of trust and transparency. We don't just list products — we build curated collections that empower you to make informed, high-value decisions.</p>
                <p>Our commitment to quality means every item in our catalog has been through a rigorous selection process. We verify affiliate links, check pricing accuracy, and ensure every product meets our standards before it appears in the store.</p>
                <p>We believe great technology should be accessible and easy to discover. That's why we invest in original editorial content, detailed guides, and honest reviews to help you navigate the world of modern gadgets with confidence.</p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                {CHECKS.map(c => (
                  <div key={c} className="flex items-center gap-2.5 text-sm text-gray-700 font-medium">
                    <CheckCircle2 size={16} className="text-green-500 shrink-0" /> {c}
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="relative">
              <div className="aspect-square overflow-hidden rounded-xl bg-gray-100">
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" alt="Team" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-5 -left-5 bg-white border border-gray-200 rounded-lg p-6 shadow-lg max-w-[200px]">
                <p className="text-3xl font-bold text-amber-600" style={{ fontFamily: "'Playfair Display', serif" }}>10k+</p>
                <p className="text-xs text-gray-500 mt-1 leading-snug">Active monthly users trust our expert recommendations.</p>
              </div>
            </div>
          </FadeUp>
        </section>

        {/* Stats */}
        <section className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100">
            {[
              { num: '10K+', label: 'Monthly Users' },
              { num: '200+', label: 'Curated Products' },
              { num: '4.9',  label: 'Average Rating' },
              { num: '100%', label: 'Verified Links' },
            ].map(({ num, label }) => (
              <div key={label} className="py-8 px-6 text-center">
                <p className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>{num}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-2">{label}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
