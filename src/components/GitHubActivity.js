import React, { useState, useEffect } from 'react';

const GH_USER = 'Manikanta25055';
const CACHE_KEY = 'gh_activity_v2';
const CACHE_TTL = 30 * 60 * 1000;

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
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, ts } = JSON.parse(cached);
        if (Date.now() - ts < CACHE_TTL) {
          setProfile(data.profile); setEvents(data.events); setStatus('ok'); return;
        }
      }
    } catch (_) {}

    Promise.all([
      fetch(`https://api.github.com/users/${GH_USER}`).then(r => r.json()),
      fetch(`https://api.github.com/users/${GH_USER}/events?per_page=30`).then(r => r.json()),
    ])
      .then(([prof, raw]) => {
        const grouped = new Map();
        if (Array.isArray(raw)) {
          raw.filter(e => e.type === 'PushEvent').forEach(e => {
            const repo = e.repo.name.split('/')[1];
            if (!grouped.has(repo)) grouped.set(repo, { repo, commits: [], latestDate: e.created_at });
            const g = grouped.get(repo);
            (e.payload.commits || []).forEach(c => {
              g.commits.push({ message: (c.message || 'Pushed changes').split('\n')[0].slice(0, 55), date: e.created_at });
            });
          });
        }
        const pushes = Array.from(grouped.values()).slice(0, 5);
        const result = { profile: prof, events: pushes };
        setProfile(prof); setEvents(pushes); setStatus('ok');
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: result, ts: Date.now() })); } catch (_) {}
      })
      .catch(() => setStatus('error'));
  }, []);

  return (
    <div className="telemetry-doc">
      {/* Terminal header */}
      <div className="telemetry-header">
        <div className="telemetry-header-row">
          <span className="telemetry-prompt">&#62;&#62;</span>
          <span className="telemetry-title">GITHUB TELEMETRY FEED</span>
        </div>
        <div className="telemetry-meta">
          <span className="telemetry-user">USER: @{GH_USER}</span>
          <span className="telemetry-sep">|</span>
          <span className="telemetry-ts">LIVE FEED</span>
        </div>
      </div>

      <div className="telemetry-rule" />

      {/* Stats row */}
      <div className="telemetry-stats">
        {status === 'loading' ? (
          [1,2,3].map(i => <div key={i} className="telemetry-stat telemetry-skeleton" />)
        ) : profile ? (
          <>
            <div className="telemetry-stat">
              <div className="telemetry-stat-val">{profile.public_repos ?? '—'}</div>
              <div className="telemetry-stat-label">REPOS</div>
            </div>
            <div className="telemetry-stat">
              <div className="telemetry-stat-val">{profile.followers ?? '—'}</div>
              <div className="telemetry-stat-label">FOLLOWERS</div>
            </div>
            <div className="telemetry-stat">
              <div className="telemetry-stat-val">{profile.following ?? '—'}</div>
              <div className="telemetry-stat-label">FOLLOWING</div>
            </div>
          </>
        ) : null}
      </div>

      <div className="telemetry-rule" />

      {/* Commit log */}
      <div className="telemetry-log-label">PUSH LOG — RECENT COMMITS</div>
      <div className="telemetry-log">
        {status === 'loading' ? (
          [1,2,3].map(i => <div key={i} className="telemetry-log-entry telemetry-skeleton" style={{ height: '52px', marginBottom: '0.5rem' }} />)
        ) : events.length > 0 ? (
          events.map((group) => (
            <div key={group.repo} className="telemetry-repo-group">
              <div className="telemetry-repo-line">
                <span className="telemetry-prompt-sm">&#36;</span>
                <span className="telemetry-repo-name">{group.repo}</span>
                <span className="telemetry-repo-time">{relativeTime(group.latestDate)}</span>
              </div>
              {group.commits.slice(0, 3).map((c, j) => (
                <div key={j} className="telemetry-commit-line">
                  <span className="telemetry-commit-hash">{String(j + 1).padStart(3, '0')}</span>
                  <span className="telemetry-commit-msg">{c.message}</span>
                </div>
              ))}
              {group.commits.length > 3 && (
                <div className="telemetry-commit-more">... +{group.commits.length - 3} commits</div>
              )}
            </div>
          ))
        ) : (
          <div className="telemetry-empty">NO RECENT PUSH EVENTS FOUND</div>
        )}
      </div>

      <div className="telemetry-rule" />

      {/* Footer */}
      <div className="telemetry-footer">
        <a href={`https://github.com/${GH_USER}`} target="_blank" rel="noreferrer" className="telemetry-gh-link">
          &#62; VIEW FULL PROFILE ON GITHUB
        </a>
      </div>
    </div>
  );
};

export default GitHubActivity;
