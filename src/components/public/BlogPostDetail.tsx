import React from 'react';
import Markdown from 'react-markdown';
import { useData } from '../../context/DataContext';
import { ArrowLeft, Clock, Calendar, User, Tag } from 'lucide-react';

export const BlogPostDetail: React.FC = () => {
  const { data, selectedSlug, navigateTo, t } = useData();

  const post = (data.blogPosts || []).find(p => p.slug === selectedSlug || p.id === selectedSlug);

  if (!post) {
    return (
      <div className="py-24 text-center max-w-xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Article Not Found</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">The requested engineering article could not be located.</p>
        <button
          onClick={() => navigateTo('portfolio')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('blog.back_to_articles', 'Back to Articles')}</span>
        </button>
      </div>
    );
  }

  return (
    <article className="py-10 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Button */}
        <div>
          <button
            onClick={() => navigateTo('portfolio')}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('blog.back_to_articles', 'Back to Articles')}</span>
          </button>
        </div>

        {/* Header Meta */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            {post.category && (
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                {post.category}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readTimeMinutes} {t('blog.min_read', 'min read')}</span>
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{post.publishedAt}</span>
            </span>
            {post.author && (
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                <span>{post.author}</span>
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {post.summary}
          </p>
        </div>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-md">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {/* Markdown Content */}
        <div className="p-6 sm:p-10 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="markdown-body text-slate-800 dark:text-slate-200">
            <Markdown>{post.content}</Markdown>
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <Tag className="w-4 h-4 text-slate-400" />
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
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
