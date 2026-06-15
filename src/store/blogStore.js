import { create } from 'zustand';

const BLOG_POSTS = [
  {
    id: '1',
    title: 'Why the Sony WH-1000XM5 is the King of ANC',
    excerpt: 'We dive deep into the tech behind Sony’s latest flagship headphones and why they remain the top choice for travelers.',
    content: 'The Sony WH-1000XM5 headphones rewrite the rules for distraction-free listening. Built with two processors controlling eight microphones, they offer unprecedented noise cancellation and exceptional call quality. In this review, we explore the design changes, the improved sound profile, and the battery life that lasts for days. Whether you are in a noisy office or on a long-haul flight, the WH-1000XM5 creates a personal sanctuary of sound.',
    category: 'Reviews',
    author: 'Audio Expert',
    date: 'Oct 24, 2024',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    title: 'The Future of Work: MacBook Pro M3 Max Analysis',
    excerpt: 'How Apple’s new chips are changing the landscape for creative professionals and developers alike.',
    content: 'The 14-inch MacBook Pro blasts forward with M3 Pro and M3 Max, incredibly sophisticated chips that bring phenomenal performance and specialized capabilities for the most demanding workflows. We tested the M3 Max with heavy 8K video rendering and large-scale software compilation, and the results were staggering. The efficiency of Apple Silicon continues to lead the industry, offering desktop-class power in a portable form factor.',
    category: 'Technology',
    author: 'Tech Guru',
    date: 'Nov 12, 2024',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    title: 'Minimalist Desk Setup: Essential Accessories for 2025',
    excerpt: 'Streamline your workflow with these hand-picked accessories designed for peak productivity and aesthetics.',
    content: 'A clean desk is a clean mind. For 2025, the focus is on high-quality, long-lasting peripherals that reduce clutter. We highlight the Logitech MX Master 3S for its precision and the Keychron mechanical keyboards for their tactile feedback. We also discuss cable management solutions and ergonomic monitor arms that can transform your workspace into a productivity powerhouse.',
    category: 'Lifestyle',
    author: 'Design Enthusiast',
    date: 'Dec 05, 2024',
    image: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '4',
    title: '5 Tips for Better Sleep with Wearable Tech',
    excerpt: 'Optimize your recovery and wake up refreshed by leveraging the data from your smartwatch.',
    content: 'Sleep tracking has become one of the most powerful features of modern wearables. By monitoring heart rate variability (HRV), respiratory rate, and sleep stages, devices like the Apple Watch Ultra 2 and Oura Ring provide actionable insights. We recommend setting a consistent sleep schedule, using the "Wind Down" feature, and reviewing your weekly trends rather than daily fluctuations. Understanding your deep sleep versus REM cycles can help you make better lifestyle choices during the day.',
    category: 'Guides',
    author: 'Health Tech Specialist',
    date: 'Dec 12, 2024',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800'
  }
];

export const useBlogStore = create((set) => ({
  posts: BLOG_POSTS,
  categories: ['All', 'Reviews', 'Technology', 'Lifestyle', 'Guides']
}));
