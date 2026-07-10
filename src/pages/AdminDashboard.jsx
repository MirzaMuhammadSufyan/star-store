import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Search, BarChart3, TrendingUp, MousePointer2, Users, Zap, FileText } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { useBlogStore } from '../store/blogStore';
import { deleteBlogPost, publishSeedArticle } from '../services/blogService';
import { SEED_ARTICLES } from '../content/seedArticles';
import { useAnalyticsStore } from '../store/analyticsStore';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import ProductForm from '../components/ProductForm';
import CreatePostForm from '../components/blog/CreatePostForm';

const TAB_BTN = 'px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-all';

const AdminDashboard = () => {
  const { dbProducts, deleteProduct, dbLoading: productsLoading } = useProductStore();
  const { posts: blogPosts } = useBlogStore();
  const { clicks, getStats, fetchClicks } = useAnalyticsStore();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  const [isFormOpen,     setIsFormOpen]     = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingBlog,    setEditingBlog]    = useState(null);
  const [isBlogFormOpen, setIsBlogFormOpen] = useState(false);
  const [searchQuery,    setSearchQuery]    = useState('');
  const [activeTab,      setActiveTab]      = useState('inventory');
  const [syncKeywords,   setSyncKeywords]   = useState('');
  const [syncResults,    setSyncResults]    = useState([]);
  const [isSyncing,      setIsSyncing]      = useState(false);

  const stats = getStats();
  const totalClicks = clicks.length;

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(dbProducts)) return [];
    const q = searchQuery.toLowerCase();
    return dbProducts.filter(p =>
      (p.title || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q)
    );
  }, [dbProducts, searchQuery]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const unsub = fetchClicks();
    return () => { if (typeof unsub === 'function') unsub(); };
  }, [fetchClicks, isAuthenticated]);

  const topProducts = useMemo(() => {
    if (!Array.isArray(dbProducts)) return [];
    return [...dbProducts].sort((a, b) => (stats[b.id] || 0) - (stats[a.id] || 0)).slice(0, 5);
  }, [dbProducts, stats]);

  const handleEdit   = (p) => { setEditingProduct(p); setIsFormOpen(true); };
  const handleAddNew = ()  => { setEditingProduct(null); setIsFormOpen(true); };

  const handleSync = async () => {
    if (!syncKeywords.trim()) return;
    setIsSyncing(true);
    setSyncResults([]);
    try {
      const results = await useProductStore.getState().syncFromAliExpress(syncKeywords.trim());
      setSyncResults(results || []);
    } catch (e) { console.error(e); }
    finally { setIsSyncing(false); }
  };

  const handleImportOne = async (product) => {
    const { addProduct } = useProductStore.getState();
    const link = product.promotion_link || '';
    await addProduct({
      title: product.product_title,
      price: product.target_sale_price,
      image: product.product_main_image_url,
      merchant: 'AliExpress',
      affiliateLink: link,
      promotion_link: link,
      product_id: product.product_id,
      category: product.second_level_category_name || '',
      original_price: product.original_price,
      evaluate_rate: product.evaluate_rate,
    });
  };

  const [importingAll, setImportingAll] = useState(false);
  const [importedIds,  setImportedIds]  = useState(new Set());
  const [publishingSeed, setPublishingSeed] = useState(null);
  const [seedMessage, setSeedMessage] = useState('');

  const publishedSeedKeys = useMemo(
    () => new Set(blogPosts.filter((p) => p.seedKey).map((p) => p.seedKey)),
    [blogPosts],
  );

  const handlePublishSeed = async (seedKey) => {
    setPublishingSeed(seedKey);
    setSeedMessage('');
    try {
      const { id, created } = await publishSeedArticle(seedKey);
      setSeedMessage(created ? `Published (id: ${id})` : `Updated existing article (id: ${id})`);
    } catch (e) {
      setSeedMessage(e.message || 'Failed to publish seed article');
    } finally {
      setPublishingSeed(null);
    }
  };

  const handleImportAll = async () => {
    if (!syncResults.length) return;
    setImportingAll(true);
    for (const product of syncResults) {
      await handleImportOne(product);
      setImportedIds(prev => new Set([...prev, product.product_id]));
    }
    setImportingAll(false);
  };

  if (productsLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-gray-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading Dashboard…</p>
        </div>
      </div>
    );
  }

  const TABS = ['inventory', 'analytics', 'blogs', 'sync'];

  const thCls = 'py-3.5 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500 text-left';
  const tdCls = 'py-4 px-4 text-[15px]';

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-amber-700 uppercase tracking-widest font-semibold mb-1">Management</p>
            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Tab switcher */}
            <div className="flex bg-gray-100 border border-gray-200 p-1 rounded-lg gap-0.5">
              {TABS.map(t => (
                <button key={t} onClick={() => setActiveTab(t)}
                  className={`${TAB_BTN} ${activeTab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <Button
              variant="accent"
              size="md"
              className="gap-2"
              onClick={activeTab === 'blogs' ? () => { setEditingBlog(null); setIsBlogFormOpen(true); } : handleAddNew}
            >
              <Plus size={16} /> {activeTab === 'blogs' ? 'New Blog' : 'New Product'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Inventory ── */}
        {activeTab === 'inventory' && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <div className="relative max-w-sm">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  placeholder="Search products…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr>
                    <th className={thCls}>Product</th>
                    <th className={thCls}>Category</th>
                    <th className={thCls}>Merchant</th>
                    <th className={thCls}>Clicks</th>
                    <th className={`${thCls} text-right`}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredProducts.map((product, idx) => {
                    const firestoreId = product.id; // Firestore doc ID — always use for delete/edit
                    const pid         = product.product_id || product.id || idx; // display / analytics key
                    const title    = product.product_title || product.title;
                    const image    = product.product_main_image_url || product.image;
                    const price    = product.target_sale_price || product.price;
                    const merchant = product.merchant || 'AliExpress';
                    return (
                      <tr key={firestoreId || idx} className="hover:bg-amber-50/40 transition-colors">
                        <td className={tdCls}>
                          <div className="flex items-center gap-3">
                            <img src={image} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-50 shrink-0" />
                            <div>
                              <p className="text-sm font-semibold text-gray-900 line-clamp-1">{title}</p>
                              <p className="text-xs text-gray-400">${price}</p>
                            </div>
                          </div>
                        </td>
                        <td className={tdCls}>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-medium">{product.category || 'Deal'}</span>
                        </td>
                        <td className={tdCls}>
                          <span className="text-sm font-semibold text-amber-700">{merchant}</span>
                        </td>
                        <td className={tdCls}>
                          <div className="flex items-center gap-1.5">
                            <MousePointer2 size={13} className="text-amber-600" />
                            <span className="font-bold text-gray-900">{stats[pid] || 0}</span>
                          </div>
                        </td>
                        <td className={`${tdCls} text-right`}>
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleEdit(product)} className="p-2 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors">
                              <Edit2 size={15} />
                            </button>
                            <button onClick={() => { if (window.confirm('Delete this product?')) deleteProduct(firestoreId); }}
                              className="p-2 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredProducts.length === 0 && (
                    <tr><td colSpan="5" className="py-16 text-center text-gray-400 text-sm">No products found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Blogs ── */}
        {activeTab === 'blogs' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 bg-amber-50 border border-amber-100 rounded-lg flex items-center justify-center shrink-0">
                  <FileText size={17} className="text-amber-700" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Curated Editorials</h3>
                  <p className="text-xs text-gray-400 mt-0.5">One-click publish for pre-written articles. Safe to run again — existing posts are updated, not duplicated.</p>
                </div>
              </div>
              <div className="space-y-3">
                {SEED_ARTICLES.map((seed) => {
                  const isLive = publishedSeedKeys.has(seed.seedKey);
                  const busy = publishingSeed === seed.seedKey;
                  return (
                    <div key={seed.seedKey} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 line-clamp-1">{seed.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{seed.excerpt}</p>
                        <p className="text-[10px] uppercase tracking-wider text-amber-700 font-semibold mt-1">{seed.category}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {isLive && (
                          <span className="text-xs text-green-700 font-semibold px-2.5 py-1 bg-green-50 border border-green-200 rounded">Live</span>
                        )}
                        <Button
                          size="sm"
                          variant={isLive ? 'secondary' : 'accent'}
                          disabled={busy}
                          onClick={() => handlePublishSeed(seed.seedKey)}
                        >
                          {busy ? 'Publishing…' : isLive ? 'Update' : 'Publish'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
              {seedMessage && (
                <p className="mt-3 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded px-3 py-2">{seedMessage}</p>
              )}
            </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr>
                    <th className={thCls}>Article</th>
                    <th className={thCls}>Category</th>
                    <th className={thCls}>Author</th>
                    <th className={thCls}>Date</th>
                    <th className={`${thCls} text-right`}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {blogPosts.map(post => (
                    <tr key={post.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className={tdCls}>
                        <div className="flex items-center gap-3">
                          <img src={post.image} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-gray-900 line-clamp-1">{post.title}</p>
                            <p className="text-xs text-gray-400 line-clamp-1 max-w-[200px]">{post.excerpt}</p>
                            {post.status === 'draft' && (
                              <span className="mt-1 inline-block text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                Draft
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className={tdCls}>
                        <span className="text-xs bg-amber-50 border border-amber-200 text-amber-700 px-2 py-1 rounded font-semibold">{post.category}</span>
                      </td>
                      <td className={tdCls}><span className="text-sm text-gray-700">{post.author}</span></td>
                      <td className={tdCls}><span className="text-sm text-gray-400">{post.date}</span></td>
                      <td className={`${tdCls} text-right`}>
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => { setEditingBlog(post); setIsBlogFormOpen(true); }} className="p-2 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors">
                            <Edit2 size={15} />
                          </button>
                          <button onClick={() => { if (window.confirm('Delete this post?')) deleteBlogPost(post.id); }} className="p-2 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {blogPosts.length === 0 && (
                    <tr><td colSpan="5" className="py-16 text-center text-gray-400 text-sm">No blog posts yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          </div>
        )}

        {/* ── Analytics ── */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Clicks',       val: totalClicks,                                      icon: MousePointer2 },
                { label: 'Unique Merchants',   val: new Set(clicks.map(c => c.merchant)).size,        icon: TrendingUp    },
                { label: 'Conv. Intent',       val: (totalClicks * 0.15).toFixed(0),                  icon: BarChart3     },
                { label: 'Products Tracked',   val: filteredProducts.length,                           icon: Users         },
              ].map((s, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg p-5">
                  <div className="w-9 h-9 bg-amber-50 border border-amber-100 rounded-lg flex items-center justify-center mb-3">
                    <s.icon size={17} className="text-amber-700" strokeWidth={1.75} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{s.val}</p>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  <TrendingUp size={18} className="text-amber-600" /> Top Products by Clicks
                </h3>
                <div className="space-y-4">
                  {topProducts.map((p, i) => (
                    <div key={p.id} className="flex items-center gap-4">
                      <span className="text-xl font-bold text-gray-200 w-7 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                      <img src={p.image} alt="" className="w-10 h-10 rounded object-cover shrink-0" />
                      <div className="flex-grow min-w-0">
                        <p className="text-sm font-semibold text-gray-900 line-clamp-1">{p.title}</p>
                        <p className="text-xs text-amber-700">{p.merchant || 'Partner'}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-gray-900">{stats[p.id] || 0}</p>
                        <p className="text-[9px] text-gray-400 uppercase tracking-wider">clicks</p>
                      </div>
                    </div>
                  ))}
                  {topProducts.length === 0 && <p className="text-gray-400 text-sm text-center py-8">No analytics data yet.</p>}
                </div>
              </div>

              <div className="bg-amber-600 rounded-lg p-8 text-white relative overflow-hidden flex flex-col justify-center">
                <div className="relative z-10 space-y-4">
                  <h3 className="text-2xl font-bold leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Optimization Report Ready.</h3>
                  <p className="text-amber-100 text-base leading-relaxed">Based on the last 30 days, we recommend increasing coverage for <strong>Photography</strong> and <strong>Wearables</strong> to boost conversions by 24%.</p>
                  <Button variant="secondary" className="w-fit text-gray-900">Generate Strategy PDF</Button>
                </div>
                <BarChart3 className="absolute -right-8 -bottom-8 w-48 h-48 opacity-10" />
              </div>
            </div>
          </div>
        )}

        {/* ── Sync ── */}
        {activeTab === 'sync' && (
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-5 border-b border-gray-100 space-y-4">
              <div>
                <h3 className="font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>AliExpress Product Sync</h3>
                <p className="text-xs text-gray-400 mt-0.5">Search products on AliExpress, then import them to your store in bulk.</p>
              </div>
              <div className="flex gap-3">
                <div className="relative flex-grow">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    placeholder="Keywords to search (e.g. 'gaming mouse', 'wireless earbuds')…"
                    value={syncKeywords}
                    onChange={e => setSyncKeywords(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSync()}
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                </div>
                <Button variant="accent" onClick={handleSync} disabled={isSyncing} className="gap-2 shrink-0">
                  {isSyncing ? <><Zap size={14} className="animate-spin" /> Searching…</> : <><Search size={14} /> Search</>}
                </Button>
              </div>
              {syncResults.length > 0 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">{syncResults.length} products found</p>
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={handleImportAll}
                    disabled={importingAll}
                    className="gap-2"
                  >
                    {importingAll
                      ? <><Zap size={13} className="animate-spin" /> Importing ({importedIds.size}/{syncResults.length})…</>
                      : <><Plus size={13} /> Import All to Store</>
                    }
                  </Button>
                </div>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr>
                    <th className={thCls}>Product</th>
                    <th className={thCls}>Category</th>
                    <th className={thCls}>Price</th>
                    <th className={`${thCls} text-right`}>Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {isSyncing && (
                    <tr><td colSpan="4" className="py-16 text-center">
                      <div className="w-7 h-7 border-2 border-gray-200 border-t-amber-500 rounded-full animate-spin mx-auto" />
                      <p className="text-gray-400 text-sm mt-3">Fetching from AliExpress…</p>
                    </td></tr>
                  )}
                  {!isSyncing && syncResults.map((product, idx) => {
                    const imported = importedIds.has(product.product_id);
                    return (
                      <tr key={product.product_id || idx} className="hover:bg-amber-50/40 transition-colors">
                        <td className={tdCls}>
                          <div className="flex items-center gap-3">
                            <img src={product.product_main_image_url} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                            <div>
                              <p className="text-sm font-semibold text-gray-900 line-clamp-1">{product.product_title}</p>
                              <p className="text-xs text-gray-400">ID: {product.product_id}</p>
                            </div>
                          </div>
                        </td>
                        <td className={tdCls}><span className="text-sm text-amber-700 font-semibold">{product.second_level_category_name}</span></td>
                        <td className={tdCls}>
                          <span className="font-bold text-gray-900">${product.target_sale_price}</span>
                          {product.original_price && product.original_price !== product.target_sale_price && (
                            <span className="ml-2 text-xs text-gray-400 line-through">${product.original_price}</span>
                          )}
                        </td>
                        <td className={`${tdCls} text-right`}>
                          {imported ? (
                            <span className="text-xs text-green-600 font-semibold px-3 py-1.5 bg-green-50 border border-green-200 rounded">✓ Imported</span>
                          ) : (
                            <Button size="sm" variant="secondary" onClick={async () => {
                              await handleImportOne(product);
                              setImportedIds(prev => new Set([...prev, product.product_id]));
                            }}>Import</Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {!isSyncing && syncResults.length === 0 && (
                    <tr><td colSpan="4" className="py-16 text-center text-gray-400 text-sm">
                      Enter keywords above and click Search to find AliExpress products.
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isFormOpen && <ProductForm product={editingProduct} onClose={() => setIsFormOpen(false)} />}
        {isBlogFormOpen && <CreatePostForm post={editingBlog} onClose={() => setIsBlogFormOpen(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
