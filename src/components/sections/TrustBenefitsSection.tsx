import React from "react";

export const TrustBenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
        </svg>
      ),
      title: "Carefully Selected Products",
      description: "Thoughtfully curated beauty and self-care tools designed for daily home rituals.",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "Secure Checkout",
      description: "Protected transactions with industry-standard 256-bit encryption for peace of mind.",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      title: "Convenient Online Shopping",
      description: "Clear product details, simple ordering, and end-to-end tracked shipping updates.",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "Customer Support",
      description: "Dedicated assistance for any product, order, or shipping questions you may have.",
    },
  ];

  return (
    <section className="py-12 bg-white border-b border-[#EAE8E1]">
      <div className="luxury-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((b, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#FAF9F6] border border-[#EAE8E1] flex items-center justify-center text-[#8C734B] flex-shrink-0">
                {b.icon}
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#141416]">
                  {b.title}
                </h4>
                <p className="text-xs text-[#5E6472] font-light leading-relaxed">
                  {b.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
