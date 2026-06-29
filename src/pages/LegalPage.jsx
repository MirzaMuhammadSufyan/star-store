import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, FileText, Scale, Cookie, Mail, RotateCcw } from 'lucide-react';

const content = {
  privacy: {
    title: 'Privacy Policy',
    icon: Shield,
    updated: 'June 10, 2024',
    text: `At Star Store, accessible from starstore.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Star Store and how we use it. We use Google AdSense, which uses cookies to serve ads based on a user's prior visits to our website. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.`,
  },
  terms: {
    title: 'Terms of Service',
    icon: FileText,
    updated: 'May 15, 2024',
    text: `By accessing this website, we assume you accept these terms and conditions. Do not continue to use Star Store if you do not agree to take all of the terms and conditions stated on this page. The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements.`,
  },
  disclaimer: {
    title: 'Legal Disclaimer',
    icon: Scale,
    updated: 'May 20, 2024',
    text: `Star Store is a participant in several affiliate marketing programs, which means we may get paid commissions on editorially chosen products purchased through our links to retailer sites. We provide honest information about products, but we do not guarantee the accuracy of pricing or availability on third-party sites.`,
  },
  cookies: {
    title: 'Cookie Policy',
    icon: Cookie,
    updated: 'June 10, 2024',
    text: `We use cookies to help you navigate efficiently and perform certain functions. You will find detailed information about all cookies under each consent category below. The cookies that are categorized as "Necessary" are stored on your browser as they are essential for enabling the basic functionalities of the site.`,
  },
  shipping: {
    title: 'Shipping Policy',
    icon: FileText,
    updated: 'Jan 05, 2024',
    text: 'All orders are processed within 2-3 business days. Orders are not shipped or delivered on weekends or holidays. Shipping charges for your order will be calculated and displayed at checkout.',
  },
  refunds: {
    title: 'Refunds & Returns',
    icon: RotateCcw,
    updated: 'Jan 05, 2024',
    text: 'We have a 30-day return policy, which means you have 30 days after receiving your item to request a return. To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging.',
  },
};

const LegalPage = () => {
  const { type } = useParams();
  const page = content[type] || content.privacy;
  const PageIcon = page.icon;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 text-center">
          <div className="w-12 h-12 bg-amber-50 border border-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <PageIcon size={22} className="text-amber-700" strokeWidth={1.75} />
          </div>
          <p className="text-xs text-amber-700 uppercase tracking-widest font-semibold mb-2">Legal</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            {page.title}
          </h1>
          <p className="mt-3 text-sm text-gray-400">Last updated: {page.updated}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-xl p-8 md:p-12 space-y-8"
        >
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Overview</h2>
            <p className="text-gray-600 leading-relaxed">{page.text}</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Detailed Guidelines</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              This is a placeholder for detailed legal text that would be specifically tailored to your business operations. For Google AdSense approval, it is essential that your Privacy Policy specifically mentions the use of cookies and data tracking for advertising purposes.
            </p>
            <ul className="space-y-2">
              {['Data Collection Methods', 'Third-party sharing policies', 'User Rights and Data Protection', 'Contact information for legal inquiries'].map(item => (
                <li key={item} className="flex items-start gap-3 text-gray-600">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Contact block */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
            <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center text-white shrink-0">
              <Mail size={20} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-0.5">Questions about our {page.title}?</h4>
              <p className="text-sm text-gray-500">Reach out to our legal department at <a href="mailto:legal@starstore.com" className="text-amber-700 hover:underline">legal@starstore.com</a></p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LegalPage;
