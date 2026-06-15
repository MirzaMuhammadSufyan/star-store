import { create } from 'zustand';

export const useBlogStore = create((set) => ({
  posts: [
    {
      id: '1',
      title: 'Top 10 Tech Gadgets for 2025',
      excerpt: 'Discover the most innovative technology trends and gadgets that will define the upcoming year.',
      content: 'Detailed article content about technology trends...',
      category: 'Technology',
      author: 'Tech Expert',
      date: 'May 15, 2024',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c'
    },
    {
      id: '2',
      title: 'The Future of Wearable Devices',
      excerpt: 'How smartwatches and health monitors are evolving to become essential lifestyle tools.',
      content: 'Comprehensive analysis of wearable tech...',
      category: 'Wearables',
      author: 'Gadget Guru',
      date: 'June 2, 2024',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'
    },
    {
      id: '3',
      title: 'Why Smart Home Integration Matters',
      excerpt: 'Learn how to create a seamless ecosystem within your home for maximum efficiency.',
      content: 'Guide to smart home automation...',
      category: 'Smart Home',
      author: 'Home Specialist',
      date: 'June 10, 2024',
      image: 'https://images.unsplash.com/photo-1558002038-1055907df827'
    }
  ],
  categories: ['All', 'Technology', 'Wearables', 'Smart Home', 'Lifestyle']
}));
