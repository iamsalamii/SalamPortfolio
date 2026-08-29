import React from 'react';
import Markdown from 'react-markdown';
import { useData } from '../../context/DataContext';
import { ArrowLeft, Clock, Calendar, User, Tag } from 'lucide-react';

export const BlogPostDetail: React.FC = () => {
  const { data, selectedSlug, navigateTo, activeLanguage } = useData();

  const post = (data.blogPosts || []).find(p => p.slug === selectedSlug || p.id === selectedSlug);

  if (!post) {
    return (
      <div className="py-24 text-center max-w-xl mx-auto px-4">
        <h2 className="text-2xl font-extrabold text-slate-950 mb-4">Article introuvable</h2>
        <p className="text-sm text-slate-500 mb-6">L'article demandé n'a pas pu être chargé.</p>
        <button
          onClick={() => navigateTo('portfolio')}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{activeLanguage === 'fr' ? 'Retour aux articles' : 'Back to Articles'}</span>
        </button>
      </div>
    );
  }

  return (
    <article className="py-12 md:py-20 max-w-4xl mx-auto px-6 sm:px-8">
      <div className="space-y-8">
        
        {/* Back Button */}
        <div>
          <button
            onClick={() => navigateTo('portfolio')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-red-50 text-slate-700 hover:text-red-600 text-xs font-semibold border border-slate-200 shadow-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{activeLanguage === 'fr' ? 'Retour aux articles' : 'Back to Articles'}</span>
          </button>
        </div>

        {/* Header Meta */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            {post.category && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-200">
                {post.category}
              </span>
            )}
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-red-600" />
              <span>{post.readTimeMinutes} min de lecture</span>
            </span>
            <span className="flex items-center gap-1 font-mono">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{post.publishedAt}</span>
            </span>
            {post.author && (
              <span className="flex items-center gap-1 font-semibold text-slate-800">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>{post.author}</span>
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {post.summary}
          </p>
        </div>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="aspect-video w-full rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-md">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Markdown Content */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <div className="markdown-body text-slate-800 leading-relaxed">
            <Markdown>{post.content}</Markdown>
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="pt-6 border-t border-slate-200 flex items-center gap-2">
            <Tag className="w-4 h-4 text-red-600" />
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-xs font-mono bg-white text-slate-800 border border-slate-200 shadow-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </article>
  );
};
