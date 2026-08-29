import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { Clock, Calendar, ArrowRight } from 'lucide-react';

export const BlogList: React.FC = () => {
  const { data, activeLanguage, navigateTo } = useData();

  const section = (data.pageSections || []).find(s => s.sectionKey === 'blog');
  if (section && !section.isEnabled) return null;

  const publishedPosts = useMemo(() => {
    return (data.blogPosts || [])
      .filter(p => p.status === 'published')
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }, [data.blogPosts]);

  if (publishedPosts.length === 0) return null;

  return (
    <section id="blog" className="py-20 sm:py-28 max-w-5xl mx-auto px-6 sm:px-8 border-t border-slate-200">
      
      {/* Section Header */}
      <div className="mb-10">
        <p className="text-xs font-mono uppercase tracking-widest text-red-600 font-bold mb-1.5">
          08 / {activeLanguage === 'fr' ? 'Articles' : 'Insights'}
        </p>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
          {activeLanguage === 'fr' ? 'Publications & Veille Technique' : 'Engineering Articles'}
        </h2>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {publishedPosts.map((post) => (
          <article
            key={post.id}
            className="group rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg hover:border-red-500/50 transition-all flex flex-col justify-between"
          >
            <div>
              {post.coverImage && (
                <div className="aspect-video w-full overflow-hidden bg-slate-100">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              <div className="p-6 sm:p-8">
                {/* Meta: Category, Read time, Date */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-3">
                  {post.category && (
                    <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-600 border border-red-200">
                      {post.category}
                    </span>
                  )}
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-red-600" />
                    <span>{post.readTimeMinutes} min</span>
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{post.publishedAt}</span>
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-950 group-hover:text-red-600 transition-colors mb-3 leading-snug">
                  {post.title}
                </h3>

                {/* Summary */}
                <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed mb-6">
                  {post.summary}
                </p>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {post.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-slate-100 text-slate-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="px-6 sm:px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => navigateTo('blog-detail', post.slug)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-red-600 transition-colors cursor-pointer"
              >
                <span>{activeLanguage === 'fr' ? 'Lire l’article' : 'Read Article'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </article>
        ))}
      </div>

    </section>
  );
};
