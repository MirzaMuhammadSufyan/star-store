import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Target, Award, Rocket, CheckCircle2 } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-24">
      {/* Hero */}
      <section className="text-center max-w-4xl mx-auto space-y-8">
         <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="w-20 h-20 bg-orange-500/10 text-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-8"
         >
            <Shield size={40} />
         </motion.div>
         <h1 className="text-5xl md:text-7xl font-black dark:text-white leading-tight">Elevating the <span className="text-orange-500">Digital Commerce</span> Standard.</h1>
         <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 leading-relaxed">Star Store was founded with a single mission: to bridge the gap between premium tech manufacturers and discerning enthusiasts through verified, high-performance affiliate curation.</p>
      </section>

      {/* Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         {[
           { icon: Users, title: 'Expert Curation', desc: 'Every product is hand-vetted by our team of tech specialists.' },
           { icon: Target, title: 'Accuracy First', desc: 'Real-time price tracking and stock verification across partners.' },
           { icon: Award, title: 'Elite Partners', desc: 'We only work with official brand stores and authorized retailers.' },
           { icon: Rocket, title: 'Future Ready', desc: 'Always staying two steps ahead of the global tech curve.' },
         ].map((item, i) => (
           <motion.div
             key={i}
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             className="glass-card p-8 bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 space-y-4"
           >
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                 <item.icon size={24} />
              </div>
              <h3 className="text-xl font-bold dark:text-white">{item.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
           </motion.div>
         ))}
      </section>

      {/* Story */}
      <section className="flex flex-col lg:flex-row items-center gap-16">
         <div className="lg:w-1/2 space-y-8">
            <h2 className="text-4xl font-black dark:text-white">A New Paradigm in Affiliate Marketing.</h2>
            <div className="space-y-6 text-gray-500 dark:text-gray-400 leading-relaxed">
               <p>In an era of digital noise and unreliable reviews, Star Store stands as a beacon of trust and transparency. We don't just list products; we build comprehensive digital ecosystems that empower users to make informed, high-value decisions. Our commitment to quality means every single item in our catalog has been through a rigorous selection process, ensuring it meets our high standards for performance and reliability.</p>
               <p>Our sophisticated backend parsing technology ensures that you always get the latest metadata, real-time pricing, and accurate availability from our official partner stores. This precision is matched by our premium glassy design, which provides a distraction-free and aesthetically pleasing environment for exploring the next generation of high-end technology.</p>
               <p>We believe that technology should be accessible, understandable, and expertly curated. That's why we invest heavily in original content, detailed guides, and authentic reviews to help you navigate the complex world of modern gadgets with confidence and ease.</p>
            </div>
            <div className="grid grid-cols-2 gap-6">
               {['Verified Brands', '24/7 Monitoring', 'Safe Redirects', 'Expert Reviews'].map(check => (
                 <div key={check} className="flex items-center gap-3 text-sm font-bold dark:text-white">
                    <CheckCircle2 className="text-green-500" size={18} /> {check}
                 </div>
               ))}
            </div>
         </div>
         <div className="lg:w-1/2 relative">
            <div className="aspect-square bg-gradient-to-br from-orange-500/20 to-orange-400/20 rounded-[3rem] overflow-hidden glass-card border-gray-100 dark:border-white/10">
               <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c" className="w-full h-full object-cover" alt="" />
            </div>
            <div className="absolute -bottom-8 -left-8 glass-card p-8 bg-white dark:bg-premium-dark max-w-xs space-y-2 border-gray-100 dark:border-white/10 shadow-2xl">
               <h4 className="text-4xl font-black text-orange-500">10k+</h4>
               <p className="text-sm font-bold dark:text-white">Active monthly users trust our expert recommendations.</p>
            </div>
         </div>
      </section>
    </div>
  );
};

export default AboutPage;
