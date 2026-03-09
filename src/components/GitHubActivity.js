import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const GH_USER = 'Manikanta25055';
const CACHE_KEY = 'gh_activity_v2';
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

function relativeTime(dateStr) {
  const d = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
  if (d < 1) return 'today';
  if (d < 7) return `${d}d ago`;
  if (d < 30) return `${Math.floor(d / 7)}w ago`;
  if (d < 365) return `${Math.floor(d / 30)}mo ago`;
  return `${Math.floor(d / 365)}y ago`;
}

const GitHubActivity = () => {
  const [profile, setProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ok | error

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, ts } = JSON.parse(cached);
        if (Date.now() - ts < CACHE_TTL) {
          setProfile(data.profile);
          setEvents(data.events);
          setStatus('ok');
          return;
        }
      }
    } catch (_) {}

    Promise.all([
      fetch(`https://api.github.com/users/${GH_USER}`).then(r => r.json()),
      fetch(`https://api.github.com/users/${GH_USER}/events?per_page=20`).then(r => r.json()),
    ])
      .then(([prof, raw]) => {
        const pushes = Array.isArray(raw)
          ? raw
              .filter(e => e.type === 'PushEvent')
              .slice(0, 6)
              .map(e => ({
                repo: e.repo.name.split('/')[1],
                message: (e.payload.commits?.[0]?.message || 'Pushed changes').split('\n')[0].slice(0, 72),
                date: e.created_at,
                size: e.payload.size,
              }))
          : [];

        const result = { profile: prof, events: pushes };
        setProfile(prof);
        setEvents(pushes);
        setStatus('ok');
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: result, ts: Date.now() })); } catch (_) {}
      })
      .catch(() => setStatus('error'));
  }, []);

  if (status === 'error') return null;

  return (
    <section className="gh-activity" id="github-activity">
      <motion.div
        className="section-container"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="gh-layout">
          {/* Stats panel */}
          <div className="gh-stats-panel">
            <div className="gh-stats-header">
              <svg className="gh-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <div>
                <p className="gh-username">@{GH_USER}</p>
                <a
                  href={`https://github.com/${GH_USER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gh-profile-link"
                >
                  View profile
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M7 17L17 7M17 7H7M17 7v10"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="gh-stat-grid">
              {status === 'loading' ? (
                [1, 2, 3].map(i => <div key={i} className="gh-stat-item gh-skeleton" />)
              ) : profile ? (
                <>
                  <div className="gh-stat-item">
                    <span className="gh-stat-value">{profile.public_repos ?? '—'}</span>
                    <span className="gh-stat-label">Repos</span>
                  </div>
                  <div className="gh-stat-item">
                    <span className="gh-stat-value">{profile.followers ?? '—'}</span>
                    <span className="gh-stat-label">Followers</span>
                  </div>
                  <div className="gh-stat-item">
                    <span className="gh-stat-value">{profile.following ?? '—'}</span>
                    <span className="gh-stat-label">Following</span>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {/* Recent commits */}
          <div className="gh-feed">
            <p className="gh-feed-title">Recent commits</p>
            {status === 'loading' ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} className="gh-event gh-skeleton" style={{ height: '52px', marginBottom: '0.5rem' }} />
              ))
            ) : events.length > 0 ? (
              events.map((ev, i) => (
                <motion.div
                  key={i}
                  className="gh-event"
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <div className="gh-event-dot" />
                  <div className="gh-event-content">
                    <div className="gh-event-top">
                      <span className="gh-event-repo">{ev.repo}</span>
                      {ev.size > 1 && <span className="gh-event-count">+{ev.size}</span>}
                    </div>
                    <p className="gh-event-msg">{ev.message}</p>
                  </div>
                  <span className="gh-event-time">{relativeTime(ev.date)}</span>
                </motion.div>
              ))
            ) : (
              <p className="gh-empty">No recent activity</p>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default GitHubActivity;
