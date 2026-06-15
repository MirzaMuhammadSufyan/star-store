/**
 * Simulation of an automated product data fetcher.
 * In a real production app, this would call a backend service that scrapes
 * or uses APIs (Amazon PA-API, etc.) to fetch metadata.
 */

export const fetchProductDataFromUrl = async (url) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  if (!url.includes('amazon.com') && !url.includes('aws.amazon.com')) {
    throw new Error('Please provide a valid Amazon or AWS product URL');
  }

  // Mocked parsed data based on URL patterns
  // In reality, this would be the result of a scraping service
  const mockData = {
    title: "Premium Wireless Noise Cancelling Headphones",
    description: "Experience world-class noise cancellation and premium sound quality with these elite headphones. Features include 30-hour battery life, touch sensor controls, and speak-to-chat technology.",
    price: "348.00",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000",
    category: "Electronics",
    affiliateLink: url
  };

  // Customizing mock data based on URL keywords for better demo feel
  if (url.toLowerCase().includes('watch')) {
    mockData.title = "Elite Smartwatch Series X";
    mockData.description = "The most advanced smartwatch yet, featuring blood oxygen measurement, ECG app, and Always-On Retina display.";
    mockData.price = "429.00";
    mockData.image = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000";
    mockData.category = "Wearables";
  } else if (url.toLowerCase().includes('camera')) {
    mockData.title = "Professional Mirrorless Camera Z9";
    mockData.description = "Capture stunning 45.7MP stills and 8K video. The ultimate tool for professional photographers and videographers.";
    mockData.price = "2499.00";
    mockData.image = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000";
    mockData.category = "Photography";
  }

  return mockData;
};
