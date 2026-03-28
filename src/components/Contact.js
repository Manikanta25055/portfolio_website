import React, { useState } from 'react';

const CONTACT_LINES = [
  { label: 'EMAIL', val: 'mgonugondlamanikanta@gmail.com', href: 'mailto:mgonugondlamanikanta@gmail.com' },
  { label: 'GITHUB', val: 'github.com/Manikanta25055', href: 'https://github.com/Manikanta25055' },
  { label: 'LINKEDIN', val: 'linkedin.com/in/manikanta-gonugondla', href: 'https://www.linkedin.com/in/manikanta-gonugondla-349bb729a/' },
  { label: 'LOCATION', val: 'Hyderabad, India — Bangalore (Work)', href: null },
];

const ContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');

  const validate = () => {
    const e = { name: '', email: '', message: '' };
    if (!form.name.trim()) e.name = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid';
    if (!form.message.trim()) e.message = 'Required';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;
    const fieldErrors = validate();
    if (Object.values(fieldErrors).some(v => v)) { setErrors(fieldErrors); return; }
    setStatus('sending');
    try {
      const res = await fetch('https://formsubmit.co/ajax/mgonugondlamanikanta@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, message: form.message, _subject: `Portfolio: ${form.name}`, _captcha: 'false' }),
      });
      const data = await res.json();
      if (res.ok && data.success) { setStatus('success'); setForm({ name: '', email: '', message: '' }); }
      else setStatus('error');
    } catch { setStatus('error'); }
  };

  return (
    <form className="receipt-form" onSubmit={handleSubmit} noValidate>
      <div className="receipt-form-field">
        <label className="receipt-form-label">FROM NAME</label>
        <input
          className={`receipt-form-input${errors.name ? ' receipt-input-error' : ''}`}
          type="text" name="name" value={form.name} onChange={handleChange} autoComplete="name"
          placeholder="Your name"
        />
        {errors.name && <span className="receipt-field-err">{errors.name}</span>}
      </div>
      <div className="receipt-form-field">
        <label className="receipt-form-label">REPLY TO</label>
        <input
          className={`receipt-form-input${errors.email ? ' receipt-input-error' : ''}`}
          type="email" name="email" value={form.email} onChange={handleChange} autoComplete="email"
          placeholder="your@email.com"
        />
        {errors.email && <span className="receipt-field-err">{errors.email}</span>}
      </div>
      <div className="receipt-form-field">
        <label className="receipt-form-label">MESSAGE BODY</label>
        <textarea
          className={`receipt-form-textarea${errors.message ? ' receipt-input-error' : ''}`}
          name="message" value={form.message} onChange={handleChange} rows={4}
          placeholder="Your message..."
        />
        {errors.message && <span className="receipt-field-err">{errors.message}</span>}
      </div>
      <div className="receipt-form-rule" />
      <button className={`receipt-submit${status === 'sending' ? ' sending' : ''}`} type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'TRANSMITTING...' : 'SEND TRANSMISSION'}
      </button>
      {status === 'success' && <p className="receipt-status receipt-status--ok">TRANSMITTED. I will respond shortly.</p>}
      {status === 'error' && <p className="receipt-status receipt-status--err">FAILED. Try direct email above.</p>}
    </form>
  );
};

const Contact = () => (
  <div className="receipt-doc">
    {/* Header */}
    <div className="receipt-header">
      <div className="receipt-header-left">
        <div className="receipt-logo">GVM</div>
        <div className="receipt-org">TRANSMISSION TERMINAL</div>
      </div>
      <div className="receipt-header-right">
        <div className="receipt-ref">TRM-2025-CONTACT</div>
        <div className="receipt-date">03.2026</div>
      </div>
    </div>

    <div className="receipt-divider receipt-divider--dashed" />

    {/* Contact lines */}
    <div className="receipt-lines">
      {CONTACT_LINES.map(({ label, val, href }) => (
        <div key={label} className="receipt-line">
          <span className="receipt-line-label">{label}</span>
          {href
            ? <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="receipt-line-val receipt-line-link">{val}</a>
            : <span className="receipt-line-val">{val}</span>
          }
        </div>
      ))}
    </div>

    <div className="receipt-divider receipt-divider--dashed" />

    {/* Form section */}
    <div className="receipt-section-label">SEND MESSAGE</div>
    <ContactForm />

    <div className="receipt-divider receipt-divider--dashed" />

    {/* Footer */}
    <div className="receipt-footer">
      <div className="receipt-footer-text">RESPONSE TIME: 24-48 HRS</div>
      <div className="receipt-footer-text">EST. 2023 · HYDERABAD, INDIA</div>
    </div>
  </div>
);

export default Contact;
