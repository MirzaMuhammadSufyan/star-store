import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, FileText, Scale, Cookie, Mail, RotateCcw } from 'lucide-react';
import SEO from '../components/SEO';
import { SITE_URL } from '../config/site';

const content = {
  privacy: {
    title: 'Privacy Policy',
    icon: Shield,
    updated: 'June 10, 2024',
    text: `At Star Store, accessible from ${SITE_URL}, one of our main priorities is the privacy of our visitors. This Privacy Policy document explains what information is collected and recorded by Star Store and how we use it. We use Google AdSense (when you consent to advertising cookies), a third-party advertising service, which uses cookies (including the DoubleClick DART cookie) to serve ads based on a user's prior visits to our website and other sites on the Internet. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites.`,
    points: [
      'Google, as a third-party vendor, uses cookies to serve ads on this site through Google AdSense.',
      "Users may opt out of personalized advertising by visiting Google's Ads Settings, and third-party vendors may also be opted out via the Network Advertising Initiative opt-out page.",
      'We collect standard log data (IP address, browser type, referring/exit pages, timestamps) for analytics and to keep the site secure — this data is not used to personally identify individual visitors.',
      'Affiliate and analytics partners (including AliExpress affiliate tracking) may set their own cookies to attribute purchases; those third parties have their own privacy policies governing that data.',
      'Users may request access to, correction of, or deletion of any personal data we hold by contacting us at the email below.',
    ],
  },
  terms: {
    title: 'Terms of Service',
    icon: FileText,
    updated: 'May 15, 2024',
    text: `By accessing this website, you agree to be bound by these Terms of Service. Do not continue to use Star Store if you do not agree to all of the terms and conditions stated on this page. The following terminology applies to these Terms and Conditions, Privacy Statement, and Disclaimer Notice, and all related agreements.`,
    points: [
      'All content on this site (text, graphics, logos, and product imagery) is provided for informational purposes and remains the property of Star Store or its respective licensors.',
      'Product prices, availability, and specifications shown here are sourced from third-party merchants and are subject to change without notice on the merchant\'s own site.',
      'Star Store acts solely as a discovery and referral platform; the actual sale, fulfillment, and support of any product is handled entirely by the third-party merchant you are redirected to.',
      'We reserve the right to modify or discontinue any part of the service at any time without prior notice.',
      'Continued use of the site after changes to these Terms constitutes acceptance of the revised Terms.',
    ],
  },
  disclaimer: {
    title: 'Legal Disclaimer',
    icon: Scale,
    updated: 'May 20, 2024',
    text: `Star Store is a participant in several affiliate marketing programs, which means we may earn commissions on editorially chosen products purchased through links to retailer sites such as AliExpress. This comes at no additional cost to you. We aim to provide honest, accurate information about the products we feature, but we do not guarantee the accuracy of pricing, stock availability, or shipping timelines listed on third-party sites.`,
    points: [
      'Every outbound "Buy" link on this site is a monetized affiliate link unless explicitly stated otherwise.',
      'Editorial coverage and product selection are based on genuine research; affiliate relationships do not determine which products we choose to feature.',
      'Star Store is not responsible for the accuracy of third-party product listings, order fulfillment, refunds, or customer service — these are handled entirely by the merchant.',
      'This disclaimer applies site-wide, including all Journal articles, product pages, and category listings that contain outbound affiliate links.',
    ],
  },
  cookies: {
    title: 'Cookie Policy',
    icon: Cookie,
    updated: 'July 12, 2026',
    text: `We use cookies to help you navigate the site efficiently and to perform certain functions, including remembering your preferences, tracking affiliate link attribution, and (with your consent) serving relevant advertising through Google AdSense. You can Accept, Reject, or Manage non-essential cookies at any time using the cookie banner or the Cookie settings link in the site footer.`,
    points: [
      'Necessary cookies — required for core site functionality (consent memory, saved/favourite items); cannot be disabled.',
      'Advertising cookies — set by Google AdSense and its partners only after you opt in via the cookie banner.',
      'Analytics cookies — help us understand product-click performance; enabled only after you opt in.',
      'Affiliate tracking cookies — used to attribute purchases on merchant sites when you choose to allow affiliate attribution.',
      'You can reopen Cookie settings from the footer at any time, or control cookies through your browser; disabling necessary cookies may affect site functionality.',
    ],
  },
  shipping: {
    title: 'Shipping Policy',
    icon: FileText,
    updated: 'Jan 05, 2024',
    text: 'Star Store does not ship products directly. All orders are placed and fulfilled by the third-party merchant you are redirected to at checkout, and shipping timelines, costs, and carriers are determined entirely by that merchant.',
    points: [
      'Estimated delivery windows are shown on the merchant\'s checkout page, not on Star Store.',
      'Shipping charges, if any, are calculated and displayed by the merchant before you complete your purchase.',
      'International orders may be subject to customs fees determined by the destination country and the merchant\'s shipping policy.',
      'For shipment tracking or delays, please contact the merchant directly using the order confirmation they provide.',
    ],
  },
  refunds: {
    title: 'Refunds & Returns',
    icon: RotateCcw,
    updated: 'Jan 05, 2024',
    text: 'Because purchases are completed and fulfilled directly by third-party merchants, all refund and return requests are handled by that merchant under their own return policy, not by Star Store.',
    points: [
      'Review the specific merchant\'s return window and eligibility requirements before purchasing — these vary by store.',
      'Items are typically eligible for return only if unused, unworn, and in original packaging, per the merchant\'s terms.',
      'Star Store can assist by pointing you to the correct merchant support channel if you\'re unsure how to start a return.',
      'Refunds, once approved by the merchant, are issued to your original payment method according to their processing timelines.',
    ],
  },
};

const LegalPage = () => {
  const { type } = useParams();
  const page = content[type] || content.privacy;
  const PageIcon = page.icon;

  return (
    <div className="bg-canvas min-h-screen">
      <SEO
        title={page.title}
        description={page.text.slice(0, 155).trim()}
        url={`/legal/${type || 'privacy'}`}
      />
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 text-center">
          <div className="w-12 h-12 bg-amber-50 border border-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <PageIcon size={22} className="text-amber-700" strokeWidth={1.75} />
          </div>
          <p className="text-xs text-amber-700 uppercase tracking-widest font-semibold mb-2">Legal</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            {page.title}
          </h1>
          <p className="mt-3 text-sm text-gray-500">Last updated: {page.updated}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-xl p-8 md:p-12 space-y-8 shadow-card"
        >
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Overview</h2>
            <p className="text-gray-600 leading-relaxed">{page.text}</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Detailed Guidelines</h2>
            <ul className="space-y-3">
              {page.points.map(item => (
                <li key={item} className="flex items-start gap-3 text-gray-600 leading-relaxed">
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
