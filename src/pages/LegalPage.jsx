import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, FileText, Scale, Cookie, Mail, RotateCcw } from 'lucide-react';

const LegalPage = () => {
  const { type } = useParams();

  const content = {
    privacy: {
      title: 'Privacy Policy',
      icon: Shield,
      updated: 'June 10, 2024',
      text: `At Star Store, accessible from starstore.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Star Store and how we use it. We use Google AdSense, which uses cookies to serve ads based on a user's prior visits to our website. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.`
    },
    terms: {
      title: 'Terms of Service',
      icon: FileText,
      updated: 'May 15, 2024',
      text: `By accessing this website, we assume you accept these terms and conditions. Do not continue to use Star Store if you do not agree to take all of the terms and conditions stated on this page. The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements.`
    },
    disclaimer: {
      title: 'Legal Disclaimer',
      icon: Scale,
      updated: 'May 20, 2024',
      text: `Star Store is a participant in several affiliate marketing programs, which means we may get paid commissions on editorially chosen products purchased through our links to retailer sites. We provide honest information about products, but we do not guarantee the accuracy of pricing or availability on third-party sites.`
    },
    cookies: {
      title: 'Cookie Policy',
      icon: Cookie,
      updated: 'June 10, 2024',
      text: `We use cookies to help you navigate efficiently and perform certain functions. You will find detailed information about all cookies under each consent category below. The cookies that are categorized as "Necessary" are stored on your browser as they are essential for enabling the basic functionalities of the site.`
    },
    shipping: {
        title: 'Shipping Policy',
        icon: FileText,
        updated: 'Jan 05, 2024',
        text: 'All orders are processed within 2-3 business days. Orders are not shipped or delivered on weekends or holidays. Shipping charges for your order will be calculated and displayed at checkout.'
    },
    refunds: {
        title: 'Refunds & Returns',
        icon: RotateCcw,
        updated: 'Jan 05, 2024',
        text: 'We have a 30-day return policy, which means you have 30 days after receiving your item to request a return. To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging.'
    }
  };

  const page = content[type] || content.privacy;
  const PageIcon = page.icon;

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
         <div className="w-16 h-16 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center mx-auto">
            <PageIcon size={32} />
         </div>
         <h1 className="text-4xl md:text-5xl font-black dark:text-white">{page.title}</h1>
         <p className="text-gray-500 font-medium">Last updated: {page.updated}</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 md:p-12 bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 prose prose-lg dark:prose-invert max-w-none"
      >
        <h2>Overview</h2>
        <p>{page.text}</p>
        
        <h2>Detailed Guidelines</h2>
        <p>This is a placeholder for detailed legal text that would be specifically tailored to your business operations. For Google AdSense approval, it is essential that your Privacy Policy specifically mentions the use of cookies and data tracking for advertising purposes.</p>
        
        <ul>
          <li>Data Collection Methods</li>
          <li>Third-party sharing policies</li>
          <li>User Rights and Data Protection</li>
          <li>Contact information for legal inquiries</li>
        </ul>

        <div className="mt-12 p-8 rounded-3xl bg-gray-50 dark:bg-black/20 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
           <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white shrink-0">
              <Mail size={24} />
           </div>
           <div>
              <h4 className="text-lg font-bold dark:text-white">Questions about our {page.title}?</h4>
              <p className="text-sm text-gray-500">Reach out to our legal department at legal@starstore.com</p>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LegalPage;
