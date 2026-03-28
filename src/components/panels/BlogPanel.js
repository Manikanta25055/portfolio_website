import React, { useState } from 'react';
import { BLOG_POSTS } from '../../data/portfolio';

const BlogPanel = ({ onClose }) => {
  const [open, setOpen] = useState(null);

  if (open !== null) {
    const post = BLOG_POSTS[open];
    return (
      <div className="panel-overlay">
        <div className="panel-window">
          <div className="panel-header">
            <span className="panel-title">{post.title}</span>
            <span className="panel-close-hint">[ESC] BACK</span>
          </div>
          <div className="panel-body">
            <div className="panel-section">
              <div className="blog-meta">
                {post.date}&nbsp;&nbsp;|&nbsp;&nbsp;{post.readTime} READ
              </div>
              <div className="proj-tech-row" style={{ marginTop: 6 }}>
                {post.tags.map(t => (
                  <span key={t} className="proj-tech-tag">{t}</span>
                ))}
              </div>
            </div>
            {post.content.map((para, i) => (
              <div key={i} className="panel-section">
                <div className="panel-section-text">{para}</div>
              </div>
            ))}
            <div className="panel-nav-hint">[SPACE / ESC] BACK</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="panel-overlay">
      <div className="panel-window">
        <div className="panel-header">
          <span className="panel-title">GARY'S HOUSE — BLOG</span>
          <span className="panel-close-hint">[ESC] CLOSE</span>
        </div>
        <div className="panel-body">
          <div className="panel-section">
            <div className="panel-section-title">{BLOG_POSTS.length} POSTS</div>
          </div>
          {BLOG_POSTS.map((post, i) => (
            <div
              key={post.id}
              className="blog-card"
              onClick={() => setOpen(i)}
            >
              <div className="blog-card-title">{post.title}</div>
              <div className="blog-card-meta">
                {post.date}&nbsp;&nbsp;{post.readTime}
              </div>
              <div className="blog-card-excerpt">{post.excerpt}</div>
            </div>
          ))}
          <div className="panel-nav-hint">[CLICK] READ POST</div>
        </div>
      </div>
    </div>
  );
};

export default BlogPanel;
