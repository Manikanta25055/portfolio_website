import React, { useState } from 'react';
import { BLOG_POSTS } from '../../data/portfolio';

const BlogPanel = () => {
  const [open, setOpen] = useState(null);

  if (open !== null) {
    const post = BLOG_POSTS[open];
    return (
      <div className="panel-overlay">
        <div className="panel-window">
          <div className="panel-header">
            <span className="panel-title">PC MAIL</span>
            <span className="panel-close-hint">B BUTTON: BACK</span>
          </div>
          <div className="panel-body">
            <div className="panel-section">
              <div className="panel-section-title">{post.title}</div>
              <div className="panel-section-text">{post.date} | {post.readTime}</div>
            </div>
            <div className="proj-tech-row">
              {post.tags.map((tag) => (
                <span key={tag} className="proj-tech-tag">{tag}</span>
              ))}
            </div>
            {post.content.map((para, i) => (
              <div key={i} className="panel-section">
                <div className="panel-section-text">{para}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="panel-overlay">
      <div className="panel-window">
        <div className="panel-header">
          <span className="panel-title">BILL'S PC</span>
          <span className="panel-close-hint">B BUTTON: CLOSE</span>
        </div>
        <div className="panel-body">
          <div className="panel-section">
            <div className="panel-section-title">MESSAGE ARCHIVE</div>
            <div className="panel-section-text">Read dev logs like stored trainer mail.</div>
          </div>
          <div className="proj-list">
            {BLOG_POSTS.map((post, i) => (
              <button
                key={post.id}
                className="proj-list-item"
                onClick={() => setOpen(i)}
                type="button"
              >
                <span className="proj-list-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="proj-list-title">{post.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPanel;
