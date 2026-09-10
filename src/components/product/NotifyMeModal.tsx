'use client';

import React, { useState } from 'react';

interface NotifyMeModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}

export const NotifyMeModal: React.FC<NotifyMeModalProps> = ({
  isOpen,
  onClose,
  productName,
}) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      try {
        const existing = JSON.parse(localStorage.getItem('cosmelia_stock_notifications') || '[]');
        localStorage.setItem(
          'cosmelia_stock_notifications',
          JSON.stringify([...existing, { email, product: productName, date: new Date().toISOString() }])
        );
      } catch {}
    }, 600);
  };

  const handleReset = () => {
    setSubmitted(false);
    setEmail('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-sm max-w-md w-full p-6 shadow-2xl border border-[#EAE8E1] relative">
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 text-[#8B92A2] hover:text-[#141416] transition-colors p-1"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {submitted ? (
          <div className="text-center py-4 space-y-3">
            <svg className="w-12 h-12 text-[#2D5A43] mx-auto animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-serif font-bold text-[#141416]">You're on the priority list!</h3>
            <p className="text-xs text-[#5E6472]">
              We'll send an email to <span className="font-semibold text-[#8C734B]">{email}</span> as soon as <span className="font-semibold">{productName}</span> is back in stock.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="w-full mt-4 py-3 bg-[#141416] hover:bg-[#8C734B] text-white text-xs uppercase tracking-widest font-semibold rounded-sm transition-colors"
            >
              Got it, thanks!
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FAF9F6] text-[#8C734B] border border-[#EAE8E1] flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-[#141416]">Back in Stock Notification</h3>
                <p className="text-xs text-[#8B92A2] line-clamp-1">{productName}</p>
              </div>
            </div>

            <p className="text-xs text-[#5E6472] font-light">
              Enter your email address below to receive an instant alert when this luxury beauty item is restocked.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3 pt-1">
              <div>
                <label className="block text-[10px] font-semibold text-[#141416] uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-sm text-xs border border-[#EAE8E1] bg-[#FAF9F6] text-[#141416] focus:outline-none focus:border-[#8C734B]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#8C734B] hover:bg-[#725D3A] text-white text-xs uppercase tracking-widest font-semibold rounded-sm transition-colors cursor-pointer disabled:opacity-75"
              >
                {loading ? 'Submitting...' : 'Notify Me When Restocked'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
