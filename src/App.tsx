import { useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  Instagram,
  Menu,
  Minus,
  Plus,
  X,
} from 'lucide-react';

type PaymentType = 'annual' | 'lifetime';
type PartnerMode = 'creator' | 'business';

const BUSINESS_ECONOMICS = {
  memberships: {
    individual: 149,
    family: 399,
    premium: 999,
  },
  mixes: {
    conservative: { individual: 0.70, family: 0.25, premium: 0.05 },
    higherValue: { individual: 0.50, family: 0.35, premium: 0.15 },
  },
  tiers: [
    { min: 0, max: 4999, rate: 0.30 },
    { min: 5000, max: 9999, rate: 0.35 },
    { min: 10000, max: 24999, rate: 0.40 },
    { min: 25000, max: Infinity, rate: 0.45 },
  ],
  volumePresets: [100, 500, 1000, 5000, 10000],
  volumeMin: 100,
  volumeMax: 25000,
  volumeStep: 100,
} as const;

type MixKey = keyof typeof BUSINESS_ECONOMICS.mixes;

type Mix = typeof BUSINESS_ECONOMICS.mixes[MixKey];

function calculateAverageMembershipValue(mix: Mix): number {
  const m = BUSINESS_ECONOMICS.memberships;
  return mix.individual * m.individual + mix.family * m.family + mix.premium * m.premium;
}

function getPartnerTier(volume: number) {
  return BUSINESS_ECONOMICS.tiers.find((t) => volume >= t.min && volume <= t.max) ?? BUSINESS_ECONOMICS.tiers[0];
}

function getPartnerRate(volume: number): number {
  return getPartnerTier(volume).rate;
}

function calculateEarningsRange(volume: number): { low: number; high: number } {
  const rate = getPartnerRate(volume);
  const lowAvg = calculateAverageMembershipValue(BUSINESS_ECONOMICS.mixes.conservative);
  const highAvg = calculateAverageMembershipValue(BUSINESS_ECONOMICS.mixes.higherValue);
  return { low: volume * lowAvg * rate, high: volume * highAvg * rate };
}

type Pkg = {
  name: string;
  annual?: { price: number; earnings: number };
  lifetime?: { price: number; earnings: number };
};

const packages: Pkg[] = [
  { name: 'Individual', annual: { price: 149, earnings: 74.50 }, lifetime: { price: 249, earnings: 124.50 } },
  { name: 'Family', annual: { price: 399, earnings: 199.50 }, lifetime: { price: 599, earnings: 299.50 } },
  { name: 'Family Plus', annual: { price: 799, earnings: 399.50 }, lifetime: { price: 999, earnings: 499.50 } },
  { name: 'Care Circle', annual: { price: 1099, earnings: 549.50 }, lifetime: { price: 1499, earnings: 749.50 } },
  { name: 'Parents & Retirement', annual: { price: 299, earnings: 149.50 }, lifetime: { price: 449, earnings: 224.50 } },
  { name: 'Under 26 Regular', annual: { price: 209, earnings: 104.50 } },
  { name: 'Under 26 Gold', annual: { price: 299, earnings: 149.50 } },
];

const faqs = [
  ['What is Careverse?', 'Careverse is a care-navigation platform. Its free AI assistant, Lidia, helps people find, compare and organize care and benefits. Paid Careverse memberships add a funded care allowance and member pricing on participating services. Careverse is a benefits and navigation service — not health insurance, not medical care, and not a medical provider.'],
  ['How do I join the Creator Network?', 'Click Apply, submit your public channel and a short note about the care stories you share. If you’re a fit, we’ll onboard you and open your affiliate link.'],
  ['What do I need to become a Careverse creator?', 'Authentic health, wellness, beauty, fitness, or caregiving content, plus at least one active public channel. No follower minimum. You do not need a medical license.'],
  ['How will I know when I make a sale?', 'Full referral, sales, and commission stats live in your affiliate dashboard.'],
  ['Can I give medical advice?', 'No. Share your experience and point people to Careverse. Don’t diagnose, promise outcomes, or tell anyone to start or stop treatment.'],
  ['What can’t I promote?', 'No fake reviews, buying engagement, claiming Careverse replaces a doctor, or targeting people in a medical crisis with scare tactics. Don\'t call Careverse insurance or imply it\'s medical coverage. Don\'t promise specific savings, discounts, or dollar amounts.'],
  ['Do I have to disclose that I\'m paid?', 'Yes. FTC rules require you to clearly disclose your affiliate relationship in any content promoting Careverse (e.g., #ad or \'paid partnership\'). We\'ll give you the exact language in your creator kit.'],
  ['Is Careverse insurance?', 'No. Careverse memberships are a benefits and savings program — not health insurance or medical care.'],
  ['Where is Careverse available?', 'Careverse packages are currently available in the United States and Canada, in USD and CAD.'],
];

function LidiaConversation() {
  return (
    <div className="lidia-card">
      <header className="lidia-header">
        <div className="lidia-avatar">
          <svg className="lidia-avatar-bg" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="28" fill="#F8E5D8" fillOpacity="0.6" />
            <path d="M32 6C44 6 56 16 56 31C56 46 45 56 31 56C17 56 8 45 8 32C8 18 19 6 32 6Z" fill="#EFCAB6" fillOpacity="0.55" />
            <path d="M34 11C43 12 51 20 51 32C51 43 43 51 32 51C20 51 13 41 14 30C15 18 24 10 34 11Z" fill="#E6AE96" fillOpacity="0.45" />
          </svg>
          <div className="lidia-heart">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        </div>
        <div className="lidia-meta">
          <h3 className="lidia-name">Lidia</h3>
          <div className="lidia-status">
            <span className="lidia-status-role">Care assistant</span>
            <span className="lidia-status-dot-sep">•</span>
            <span className="lidia-status-avail">available<span className="lidia-avail-dot" /></span>
          </div>
        </div>
      </header>

      <div className="lidia-messages">
        <div className="lidia-msg-user fade-seq-1">
          <p>I'm taking care of my mom. She fell ill and I don't know what to do.</p>
        </div>
        <div className="lidia-msg-lidia fade-seq-2">
          <p>Let's take it one step at a time. Tell me what's going on, and I'll help you figure out where to start.</p>
        </div>
        <div className="lidia-msg-user fade-seq-3">
          <p>She has a doctor but I feel like I'm trying to figure everything out myself.</p>
        </div>
        <div className="lidia-msg-lidia fade-seq-4">
          <p>You don't have to figure it all out at once. I can help you understand what she needs, find options, and organize the next steps — including working with the care she already has.</p>
        </div>
      </div>

      <div className="lidia-next-steps fade-seq-5">
        <div className="lidia-steps-list">
          <div className="lidia-step"><span className="lidia-step-text">Find a specialist</span></div>
          <div className="lidia-step"><span className="lidia-step-text">Understand a bill</span></div>
          <div className="lidia-step"><span className="lidia-step-text">Organize next steps</span></div>
        </div>
      </div>

    </div>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [paymentType, setPaymentType] = useState<PaymentType>('annual');
  const [conversions, setConversions] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [partnerMode, setPartnerMode] = useState<PartnerMode>('creator');
  const [businessVolume, setBusinessVolume] = useState<number>(1000);

  const visiblePackages = packages.filter((pkg) => paymentType === 'annual' || pkg.lifetime !== undefined);
  const visibleIndices = packages.map((pkg, i) => i).filter((i) => paymentType === 'annual' || packages[i].lifetime !== undefined);

  const getEarnings = (pkg: Pkg) => (paymentType === 'annual' ? pkg.annual!.earnings : pkg.lifetime!.earnings);
  const getPrice = (pkg: Pkg) => (paymentType === 'annual' ? pkg.annual!.price : pkg.lifetime!.price);

  const totalEarnings = visibleIndices.reduce((sum, i) => sum + getEarnings(packages[i]) * conversions[i], 0);
  const activeBreakdown = visibleIndices
    .map((i) => ({ name: packages[i].name, count: conversions[i], subtotal: getEarnings(packages[i]) * conversions[i] }))
    .filter((item) => item.count > 0);
  const updateConversion = (index: number, value: number) => {
    const next = [...conversions];
    next[index] = Math.max(0, isNaN(value) ? 0 : value);
    setConversions(next);
  };

  return (
    <div className="page-wash">
      <header className="site-header">
        <div className="container nav-inner">
          <div className="brand-group">
            <a className="brand" href="#top" aria-label="Careverse home">
              <img className="brand-wordmark" src="/careverse_wordmark.svg" alt="Careverse" />
            </a>
            <span className="brand-tag">Partner program</span>
          </div>
          <button className="mobile-menu" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <nav className={menuOpen ? 'main-nav open' : 'main-nav'}>
            <a href="#pricing" onClick={() => setMenuOpen(false)}>Earn</a>
            <a href="#how" onClick={() => setMenuOpen(false)}>How it works</a>
            <a href="#why" onClick={() => setMenuOpen(false)}>Meet Lidia</a>
            <a href="#memberships" onClick={() => setMenuOpen(false)}>Memberships</a>
            <a href="#pricing" onClick={() => setMenuOpen(false)}>Who it’s for</a>
            <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
            <a className="button button-small" href="https://careverse-creator-application.vercel.app/" onClick={() => setMenuOpen(false)}>Apply to join <ArrowRight size={16} /></a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero">
    <div className="hero-copy reveal">
            <div className="hero-top">
              <h1>Bring <span className="care-word">care</span> benefits to the <span style={{ whiteSpace: 'nowrap' }}>people you serve</span>.</h1>
            </div>
            <p className="hero-commission-line">Offer Careverse memberships under your brand and earn margin on every conversion. We handle the product, technology, tracking, and payouts—with compliance-ready infrastructure.</p>
            <div className="hero-actions">
              <a className="button" href="https://careverse-creator-application.vercel.app/">Become a partner <ArrowRight size={17} /></a>
            </div>
          </div>
          <div className="hero-visual" aria-label="Careverse mobile care experience">
            <div className="device-stage">
              <div className="sat-glow sat-glow-lidia" />
              <div className="sat-glow sat-glow-cta" />
              <aside className="float-card sat sat-lidia">
                <img src="/images/lidia-card.png" alt="Lidia, Careverse care assistant" />
              </aside>
              <aside className="float-card sat sat-cta">
                <img src="/images/compare-prescription-button.png" alt="Compare prescriptions" />
              </aside>
              <div className="phone-glow" />
              <div className="phone">
                <img className="phone-screen" src="/images/uploaded-careverse-membership-phone.png" alt="Careverse membership benefits on mobile" />
              </div>
              <p className="hero-microcopy">Careverse memberships are a benefits and savings program — not health insurance or medical care. Currently available in the United States and Canada.</p>
            </div>
          </div>
          <a className="scroll-cue" href="#pricing" aria-label="Scroll to see the offer">
            <span className="scroll-cue-line" />
            <svg className="scroll-cue-arrow" viewBox="0 0 24 14" fill="none" aria-hidden="true">
              <path d="M2 2 L12 12 L22 2" stroke="currentColor" stroke-width="2.5"
                    stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </a>
        </section>

        <section className="trust-strip">
          <div className="container trust-items">
            <span className="trust-label">White-label ready</span>
            <span><i /> Margin on every conversion</span>
            <span><i /> Product, technology &amp; payouts handled</span>
          </div>
        </section>

        <section className="section partner-section" id="pricing">
          <div className="container partner-grid">
            <div className="partner-left reveal">
              <h2 className="partner-heading">PARTNERS WE WORK WITH</h2>
              <div className="partner-types">
                <div className="partner-type">
                  <h3>Creators</h3>
                  <p>Share Careverse with your audience.</p>
                </div>
                <div className="partner-type">
                  <h3>Businesses &amp; organizations</h3>
                  <p>Add Careverse memberships to your existing offerings.</p>
                </div>
                <div className="partner-type">
                  <h3>Networks</h3>
                  <p className="partner-type-intro">Bring Careverse to the partners you manage.</p>
                  <p className="partner-type-sub">For organizations that manage creators, agencies, affiliates, sellers, or other partners.</p>
                </div>
              </div>
            </div>

            <div className="partner-right reveal">
              <h2 className="partner-earn-heading">HOW PARTNERS EARN</h2>

              <div className="partner-mode-toggle">
                <button
                  className={partnerMode === 'creator' ? 'partner-mode-btn active' : 'partner-mode-btn'}
                  onClick={() => setPartnerMode('creator')}
                  aria-pressed={partnerMode === 'creator'}
                >As a creator</button>
                <button
                  className={partnerMode === 'business' ? 'partner-mode-btn active' : 'partner-mode-btn'}
                  onClick={() => setPartnerMode('business')}
                  aria-pressed={partnerMode === 'business'}
                >As a business</button>
              </div>

              <div className={partnerMode === 'creator' ? 'partner-state partner-state-active' : 'partner-state'}>
                <p className="partner-lead">Earn from the people you reach.</p>
                <div className="pricing-grid">
                  {visiblePackages.map((pkg) => (
                    <article key={pkg.name} className="pricing-card">
                      <span className="pricing-card-label">{pkg.name}</span>
                      <div className="pricing-price"><span className="pricing-amount">${getPrice(pkg)}</span></div>
                      <span className="pricing-earnings">You earn ${getEarnings(pkg).toFixed(2)}</span>
                    </article>
                  ))}
                </div>

                <div className="calculator">
                  <div className="calculator-controls">
                    <div className="calc-toggle">
                      <button className={paymentType === 'annual' ? 'calc-toggle-btn active' : 'calc-toggle-btn'} onClick={() => setPaymentType('annual')} aria-pressed={paymentType === 'annual'}>Annual</button>
                      <button className={paymentType === 'lifetime' ? 'calc-toggle-btn active' : 'calc-toggle-btn'} onClick={() => setPaymentType('lifetime')} aria-pressed={paymentType === 'lifetime'}>Lifetime</button>
                    </div>
                    <span className="calculator-step-label">Model your conversions</span>
                    {packages.map((pkg, index) => {
                      const isAvailable = paymentType === 'annual' || pkg.lifetime !== undefined;
                      if (!isAvailable) {
                        return (
                          <div key={pkg.name} className="conv-row conv-row-disabled">
                            <div className="conv-row-info">
                              <span className="conv-row-name">{pkg.name}</span>
                              <span className="conv-row-rate conv-row-rate-disabled">Annual only</span>
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div key={pkg.name} className="conv-row">
                          <div className="conv-row-info">
                            <span className="conv-row-name">{pkg.name}</span>
                            <span className="conv-row-rate">${getEarnings(pkg).toFixed(2)} per conversion</span>
                          </div>
                          <div className="conv-stepper">
                            <button onClick={() => updateConversion(index, conversions[index] - 1)} aria-label={`Decrease ${pkg.name} conversions`}><Minus size={14} /></button>
                            <input type="number" min={0} value={conversions[index]} onChange={(e) => updateConversion(index, parseInt(e.target.value))} aria-label={`${pkg.name} conversions`} />
                            <button onClick={() => updateConversion(index, conversions[index] + 1)} aria-label={`Increase ${pkg.name} conversions`}><Plus size={14} /></button>
                          </div>
                        </div>
                      );
                    })}
                    <p className="calculator-note">Mix conversions across any combination of packages.</p>
                  </div>
                  <div className="calculator-result">
                    <span className="result-eyebrow">Estimated one-time earnings</span>
                    <div className="result-main"><small>Estimated one-time earnings</small><strong>${totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></div>
                    {activeBreakdown.length > 0 ? (
                      <div className="result-breakdown">
                        {activeBreakdown.map(({ name, count, subtotal }) => (
                          <div key={name} className="breakdown-row">
                            <span>{count} {name}</span>
                            <strong>${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                          </div>
                        ))}
                        <div className="breakdown-total">
                          <span>Total</span>
                          <strong>${totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                        </div>
                      </div>
                    ) : (
                      <div className="result-breakdown"><p className="breakdown-empty">Set conversions above to see your breakdown.</p></div>
                    )}
                    <div className="result-commission-badge">50% commission · annual &amp; lifetime</div>
                    <a className="calculator-cta" href="https://careverse-creator-application.vercel.app/">Apply to creator network <ArrowRight size={15} /></a>
                    <small className="result-disclaimer">For example purposes only. Commission applies to qualifying annual and lifetime membership conversions; monthly memberships are not commissionable. Actual earnings vary by conversions and applicable program terms.</small>
                  </div>
                </div>
              </div>

              <div className={partnerMode === 'business' ? 'partner-state partner-state-active' : 'partner-state'}>
                <h3 className="biz-headline">Bring more memberships. Unlock better partner economics.</h3>
                <p className="biz-sub">Partner economics can scale with the volume you bring.</p>

                <div className="biz-progression">
                  <div className="biz-progression-track">
                    {BUSINESS_ECONOMICS.tiers.map((tier, i) => {
                      const isActive = businessVolume >= tier.min && businessVolume <= tier.max;
                      const volumeLabel = tier.min === 0 ? 'Under 5,000' : tier.max === Infinity ? '25,000+' : `${tier.min.toLocaleString()}–${tier.max.toLocaleString()}`;
                      return (
                        <div key={i} className={`biz-tier ${isActive ? 'biz-tier-active' : ''}`}>
                          <span className="biz-tier-rate">{Math.round(tier.rate * 100)}%</span>
                          <span className="biz-tier-volume">{volumeLabel}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="biz-explorer">
                  <span className="biz-explorer-label">What could your volume be worth?</span>
                  <div className="biz-slider-wrap">
                    <div className="biz-slider-ticks">
                      {[100, 500, 1000, 5000, 10000, 25000].map((tick) => (
                        <span key={tick} className="biz-slider-tick" onClick={() => setBusinessVolume(tick)}>{tick.toLocaleString()}</span>
                      ))}
                    </div>
                    <input
                      type="range"
                      className="biz-slider"
                      min={BUSINESS_ECONOMICS.volumeMin}
                      max={BUSINESS_ECONOMICS.volumeMax}
                      step={BUSINESS_ECONOMICS.volumeStep}
                      value={businessVolume}
                      onChange={(e) => setBusinessVolume(parseInt(e.target.value))}
                      aria-label="Qualifying membership volume"
                    />
                    <div className="biz-slider-value">{businessVolume.toLocaleString()} memberships</div>
                  </div>
                </div>

                <div className="biz-result">
                  <div className="biz-result-row">
                    <span className="biz-result-label">Qualifying memberships</span>
                    <span className="biz-result-value">{businessVolume.toLocaleString()}</span>
                  </div>
                  <div className="biz-result-row">
                    <span className="biz-result-label">Illustrative partner rate</span>
                    <span className="biz-result-value">{Math.round(getPartnerRate(businessVolume) * 100)}%</span>
                  </div>
                  <div className="biz-result-earnings">
                    <span className="biz-result-earnings-label">Estimated partner earnings</span>
                    {(() => {
                      const range = calculateEarningsRange(businessVolume);
                      return (
                        <strong className="biz-result-earnings-value">
                          ${range.low.toLocaleString('en-US', { maximumFractionDigits: 0 })}–${range.high.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                        </strong>
                      );
                    })()}
                  </div>
                  <p className="biz-disclosure">Illustrative only. Actual earnings vary based on membership mix, qualifying conversions, and applicable partner terms.</p>
                </div>

                <div className="biz-capabilities">
                  White-label storefront <span className="biz-cap-dot">·</span> Tracking &amp; attribution <span className="biz-cap-dot">·</span> Payouts handled
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Network Partners */}
        <section className="section network-section" id="network">
          <div className="container network-grid">
            <div className="network-diagram-col">
              <svg className="network-diagram" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 920" width="100%" height="100%" role="img" aria-label="Network partner ecosystem diagram">
                <defs>
                  <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'); .font-sans { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; } .text-ink { fill: #18191D; } .text-body { fill: #4A4D55; } .text-muted { fill: #6B6E76; } .text-light { fill: #92959E; } .text-red { fill: #E1062C; }`}</style>
                  <radialGradient id="heroGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#E1062C" stopOpacity="0.05" /><stop offset="60%" stopColor="#E1062C" stopOpacity="0.02" /><stop offset="100%" stopColor="#E1062C" stopOpacity="0" /></radialGradient>
                  <linearGradient id="heroFill" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#FFFDFB" /><stop offset="100%" stopColor="#FAF5EE" /></linearGradient>
                  <filter id="shadowHero" x="-25%" y="-25%" width="150%" height="160%"><feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#18191D" floodOpacity="0.04" /><feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#18191D" floodOpacity="0.07" /><feDropShadow dx="0" dy="28" stdDeviation="36" floodColor="#18191D" floodOpacity="0.04" /></filter>
                  <filter id="shadowCard" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#18191D" floodOpacity="0.03" /><feDropShadow dx="0" dy="8" stdDeviation="14" floodColor="#18191D" floodOpacity="0.05" /><feDropShadow dx="0" dy="20" stdDeviation="28" floodColor="#18191D" floodOpacity="0.025" /></filter>
                  <filter id="shadowSubCard" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#18191D" floodOpacity="0.03" /><feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#18191D" floodOpacity="0.04" /></filter>
                  <filter id="shadowBadge" x="-20%" y="-30%" width="140%" height="160%"><feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#18191D" floodOpacity="0.04" /></filter>
                </defs>
                <rect width="1280" height="920" fill="#F6F3EE" />
                <ellipse cx="640" cy="190" rx="360" ry="240" fill="url(#heroGlow)" />
                <g className="font-sans"><text x="640" y="88" textAnchor="middle" className="text-muted" fontSize="11.5" fontWeight="700" letterSpacing="0.22em">WHITE-LABEL  <tspan fill="#D2CCC0" fontWeight="400">·</tspan>  TRACKING  <tspan fill="#D2CCC0" fontWeight="400">·</tspan>  TECHNOLOGY  <tspan fill="#D2CCC0" fontWeight="400">·</tspan>  PAYOUTS</text></g>
                <g className="network-lines">
                  <line x1="640" y1="263" x2="640" y2="375" stroke="#CEC8BC" strokeWidth="2.5" strokeLinecap="round" className="network-line" style={{ animationDelay: '0.1s' }} />
                  <line x1="270" y1="375" x2="1010" y2="375" stroke="#CEC8BC" strokeWidth="1.5" strokeLinecap="round" className="network-line" style={{ animationDelay: '0.3s' }} />
                  <line x1="270" y1="375" x2="270" y2="450" stroke="#CEC8BC" strokeWidth="1.5" strokeLinecap="round" className="network-line" style={{ animationDelay: '0.5s' }} />
                  <line x1="640" y1="375" x2="640" y2="450" stroke="#CEC8BC" strokeWidth="1.5" strokeLinecap="round" className="network-line" style={{ animationDelay: '0.5s' }} />
                  <line x1="1010" y1="375" x2="1010" y2="450" stroke="#CEC8BC" strokeWidth="1.5" strokeLinecap="round" className="network-line" style={{ animationDelay: '0.5s' }} />
                  <circle cx="640" cy="375" r="3.5" fill="#8C887F" />
                  <circle cx="270" cy="375" r="2.5" fill="#B2ACA0" />
                  <circle cx="1010" cy="375" r="2.5" fill="#B2ACA0" />
                  <line x1="270" y1="554" x2="270" y2="690" stroke="#CEC8BC" strokeWidth="1.5" strokeLinecap="round" className="network-line" style={{ animationDelay: '0.8s' }} />
                </g>
                <g transform="translate(662, 319)" className="font-sans network-label" style={{ animationDelay: '1s' }}>
                  <rect x="-8" y="-15" width="168" height="30" rx="15" fill="#FFFFFF" stroke="#E6E1D8" strokeWidth="1" filter="url(#shadowBadge)" />
                  <circle cx="7" cy="0" r="3.5" fill="#E1062C" />
                  <text x="18" y="4.5" className="text-ink" fontSize="13" fontWeight="700" letterSpacing="-0.01em">network override</text>
                </g>
                <g transform="translate(292, 622)" className="font-sans network-label" style={{ animationDelay: '1.2s' }}>
                  <rect x="-8" y="-15" width="162" height="30" rx="15" fill="#FFFFFF" stroke="#E6E1D8" strokeWidth="1" filter="url(#shadowBadge)" />
                  <circle cx="7" cy="0" r="3.5" fill="#E1062C" />
                  <text x="18" y="4.5" className="text-ink" fontSize="13" fontWeight="700" letterSpacing="-0.01em">partner override</text>
                </g>
                <g transform="translate(450, 137)" className="font-sans network-node" style={{ animationDelay: '0s' }}>
                  <rect width="380" height="126" rx="24" fill="url(#heroFill)" stroke="#18191D" strokeWidth="1.5" filter="url(#shadowHero)" />
                  <rect x="176" y="16" width="28" height="3" rx="1.5" fill="#E1062C" />
                  <text x="190" y="64" textAnchor="middle" className="text-ink" fontSize="19" fontWeight="800" letterSpacing="0.08em">NETWORK PARTNER</text>
                  <g transform="translate(190, 96)"><rect x="-56" y="-12" width="112" height="24" rx="12" fill="#F3EFE7" stroke="#E6E1D8" strokeWidth="1" /><text x="0" y="4" textAnchor="middle" className="text-body" fontSize="12.5" fontWeight="500" letterSpacing="-0.01em">Direct rate</text></g>
                </g>
                <g transform="translate(140, 450)" className="font-sans network-node" style={{ animationDelay: '0.4s' }}>
                  <rect width="260" height="104" rx="18" fill="#FFFFFF" stroke="#E6E1D8" strokeWidth="1.25" filter="url(#shadowCard)" />
                  <text x="130" y="49" textAnchor="middle" className="text-ink" fontSize="16" fontWeight="800" letterSpacing="0.08em">PARTNER</text>
                  <text x="130" y="77" textAnchor="middle" className="text-muted" fontSize="13" fontWeight="500">People they serve</text>
                </g>
                <g transform="translate(510, 450)" className="font-sans network-node" style={{ animationDelay: '0.5s' }}>
                  <rect width="260" height="104" rx="18" fill="#FFFFFF" stroke="#E6E1D8" strokeWidth="1.25" filter="url(#shadowCard)" />
                  <text x="130" y="49" textAnchor="middle" className="text-ink" fontSize="16" fontWeight="800" letterSpacing="0.08em">PARTNER</text>
                  <text x="130" y="77" textAnchor="middle" className="text-muted" fontSize="13" fontWeight="500">People they serve</text>
                </g>
                <g transform="translate(880, 450)" className="font-sans network-node" style={{ animationDelay: '0.6s' }}>
                  <rect width="260" height="104" rx="18" fill="#FFFFFF" stroke="#E6E1D8" strokeWidth="1.25" filter="url(#shadowCard)" />
                  <text x="130" y="49" textAnchor="middle" className="text-ink" fontSize="16" fontWeight="800" letterSpacing="0.08em">PARTNER</text>
                  <text x="130" y="77" textAnchor="middle" className="text-muted" fontSize="13" fontWeight="500">People they serve</text>
                </g>
                <g transform="translate(162, 690)" className="font-sans network-node" style={{ animationDelay: '0.9s' }}>
                  <rect width="216" height="88" rx="16" fill="#FFFFFF" stroke="#E6E1D8" strokeWidth="1.25" filter="url(#shadowSubCard)" />
                  <text x="108" y="42" textAnchor="middle" className="text-ink" fontSize="14" fontWeight="800" letterSpacing="0.07em">SUB-PARTNER</text>
                  <text x="108" y="66" textAnchor="middle" className="text-muted" fontSize="12" fontWeight="500">People they serve</text>
                </g>
              </svg>
            </div>
            <div className="network-copy-col reveal reveal-delay-1">
              <div className="eyebrow"><span className="eyebrow-line" />NETWORK PARTNERS</div>
              <h2 className="network-heading">Grow your business through your network.</h2>
              <p className="network-lede">Your economics can be structured around the volume generated across your network, with additional upside for qualifying business generated by participating partners.</p>
              <div className="network-blocks">
                <div className="network-block">
                  <h3 className="network-block-title">Bring your partners</h3>
                  <p className="network-block-body">Bring the creators, agencies, affiliates, sellers, or other partners you already manage.</p>
                </div>
                <div className="network-block">
                  <h3 className="network-block-title">Let partners own the relationship</h3>
                  <p className="network-block-body">Each partner can offer memberships through their own customer-facing experience while maintaining their relationship with the people they serve.</p>
                </div>
                <div className="network-block">
                  <h3 className="network-block-title">Earn across the network</h3>
                  <p className="network-block-body">Earn on your own qualifying conversions, plus a fixed override on qualifying business generated by partners you bring into the network.</p>
                </div>
              </div>
              <p className="network-footer-line">Network economics are structured around your distribution, volume, and partner model.</p>
              <a className="button" href="https://careverse-creator-application.vercel.app/">Become a partner <ArrowRight size={17} /></a>
            </div>
          </div>
        </section>

        {/* 5 — Healthcare should feel easier */}
        <section className="section easier-section">
          <div className="container">
            <h2 className="easier-title reveal">Healthcare should feel easier.</h2>
            <div className="easier-grid">
              <div className="easier-col reveal reveal-delay-1">
                <h3>Navigate what you have</h3>
                <ul className="easier-list">
                  <li>Doctors</li>
                  <li>Specialists</li>
                  <li>Insurance</li>
                  <li>Providers</li>
                  <li>Pharmacies</li>
                </ul>
              </div>
              <div className="easier-col reveal reveal-delay-2">
                <h3>Access more of what you need</h3>
                <p className="easier-lead">Carverse memberships contain benefits you can put towards things like:</p>
                <ul className="easier-list">
                  <li>Dental &amp; vision</li>
                  <li>Mental health &amp; counseling</li>
                  <li>Physical therapy &amp; rehab</li>
                  <li>Fitness, nutrition &amp; wellbeing</li>
                  <li>Spa, salon &amp; personal care</li>
                  <li>Home help &amp; caregiver support</li>
                  <li>Pet care</li>
                </ul>
              </div>
            </div>
            <p className="easier-footer-line reveal">Lidia helps you make sense of all of it.</p>
          </div>
        </section>

        {/* 6 — Meet Lidia */}
        <section className="section problem-section" id="why">
          <div className="container problem-grid">
            <div className="problem-left reveal">
              <h2 className="problem-headline">MEET LIDIA</h2>
              <p className="problem-lede">When you don't know what to do next, start with Lidia.</p>
              <p className="problem-body">She helps people make sense of their care, find options, and organize the next step — whether they're figuring it out for themselves or helping someone they love.</p>
              <p className="problem-note">Lidia is free for everyone to use — with or without a membership.</p>
            </div>
            <div className="problem-right reveal">
              <LidiaConversation />
            </div>
          </div>
        </section>

        {/* 7 — How Lidia helps */}
        <section className="section helps-section">
          <div className="container">
            <h2 className="helps-title reveal">HOW LIDIA HELPS</h2>
            <div className="helps-columns">
              <article className="helps-col reveal reveal-delay-1">
                <span className="helps-number">01</span>
                <h3>Understand</h3>
                <p>Make sense of a diagnosis, a bill, or what your benefits actually cover.</p>
              </article>
              <article className="helps-col reveal reveal-delay-2">
                <span className="helps-number">02</span>
                <h3>Find</h3>
                <p>Find the right specialist, provider, or membership benefit.</p>
              </article>
              <article className="helps-col reveal reveal-delay-3">
                <span className="helps-number">03</span>
                <h3>Plan</h3>
                <p>Know your next step and what it'll cost.</p>
              </article>
              <article className="helps-col reveal reveal-delay-4">
                <span className="helps-number">04</span>
                <h3>Organize</h3>
                <p>Keep appointments, forms, and follow-ups in one place.</p>
              </article>
            </div>
          </div>
        </section>

        {/* What you're earning commission on (memberships) — moved here */}
        <section className="memberships-section" id="memberships">
          <div className="container">
            <div className="memberships-block1 reveal">
              <div className="memberships-photo-col">
                <div className="memberships-photo-wrap">
                  <img className="memberships-photo" src="/images/careverse-cover-photo.jpg" alt="Careverse membership benefits" />
                </div>
                <p className="memberships-disclaimer">Careverse memberships are paid benefits programs, not health insurance or medical care. Benefits, eligibility and qualifying services vary by membership and applicable terms.</p>
              </div>
              <div className="memberships-text">
                <h2 className="memberships-title">What you're <span className="memberships-red">offering</span> the people you serve</h2>
                <p className="memberships-bridge">Careverse gives people another way to navigate and access care. Lidia helps them understand their options and find their next step, while optional memberships add benefits that can make care more accessible and affordable.</p>
                <div className="memberships-sublabel">What people get with a Careverse membership</div>
                <div className="memberships-rows">
                  <div className="memberships-row">
                    <div className="memberships-row-label">Money toward eligible care</div>
                    <p className="memberships-row-body">Eligible memberships include a funded allowance that can be used toward qualifying care services and products.</p>
                  </div>
                  <div className="memberships-row">
                    <div className="memberships-row-label">Member pricing on participating services</div>
                    <p className="memberships-row-body">Members can access participating services and offers at member prices, with the member paying the provider for the service.</p>
                  </div>
                  <div className="memberships-row">
                    <div className="memberships-row-label">Benefits for different needs</div>
                    <p className="memberships-row-body">Memberships are designed around different needs — from individual and family care to broader household needs.</p>
                  </div>
                </div>
              </div>
            </div>

            <a className="button memberships-cta reveal" href="https://careverse-care-benefits-preview.wcbjp5qnc6.chatgpt.site/#memberships" target="_blank" rel="noopener">Explore Careverse memberships</a>
          </div>
        </section>

        {/* 3 — Join the Careverse partner program today */}
        <section className="section how-section" id="how">
          <div className="container">
            <div className="center-intro reveal"><h2>Join the Careverse partner program today</h2></div>
            <div className="how-arrow reveal" aria-hidden="true" />
            <div className="how-steps">
              <article className="how-step reveal reveal-delay-1">
                <div className="how-photo"><img className="how-img-1" src="/images/jelle-van-leest-VV_U4PmDmHs-unsplash.jpg" alt="Creator applying to join the Careverse network" /></div>
                <h3>Apply</h3>
                <p>Tell us about yourself and what you create.</p>
              </article>
              <article className="how-step reveal reveal-delay-2">
                <div className="how-photo"><img className="how-img-2" src="/images/rohan-krishnan-d8kp7EPgAmQ-unsplash.jpg" alt="Laptop and phone representing creator approval" /></div>
                <h3>Get approved</h3>
                <p>Our team will review your eligibility.</p>
              </article>
              <article className="how-step reveal reveal-delay-3">
                <div className="how-photo"><img className="how-img-3" src="/images/john-FlPc9_VocJ4-unsplash.jpg" alt="Creator getting onboarded with affiliate tools" /></div>
                <h3>Get onboarded</h3>
                <p>Get your affiliate link, dashboard, and Creator Kit with everything you need to start creating.</p>
              </article>
              <article className="how-step reveal reveal-delay-4">
                <div className="how-photo"><img className="how-img-4" src="/images/nick-morrison-FHnnjk1Yj7Y-unsplash.jpg" alt="Creator sharing content and earning commission" /></div>
                <h3>Share and earn</h3>
                <p>Create content that drives qualifying membership conversions (with clear paid-partnership disclosure) and earn 50% commission.</p>
              </article>
            </div>
          </div>
        </section>

        {/* 9 — FAQ / The details */}
        <section className="section faq-section" id="faq">
          <div className="container faq-grid"><div className="faq-heading"><div className="eyebrow">The details</div><h2>Good questions deserve clear answers.</h2><p>Still curious? Reach the creator team at <a href="mailto:info@careverse.ai">info@careverse.ai</a>.</p></div><div className="faq-list">{faqs.map(([question, answer], index) => <details key={question} open={index === 0}><summary>{question}<span><ChevronDown size={18} /></span></summary><p>{answer}</p></details>)}</div></div>
        </section>
      </main>

      <footer className="site-footer"><div className="container footer-top"><div className="footer-brand"><a className="brand brand-light" href="#top"><img className="brand-wordmark" src="/careverse_wordmark.svg" alt="Careverse" /></a><p>Care, made easier to find.</p></div><div className="footer-apply"><span>Build the next chapter of care.</span><a className="button button-small" href="https://careverse-creator-application.vercel.app/">Apply to join <ArrowRight size={16} /></a></div></div><div className="container footer-disclaimer"><p>Careverse memberships are a benefits and savings program — not health insurance or medical care. Currently available in the United States and Canada.</p></div><div className="container footer-bottom"><span>Careverse™</span><div><a href="#faq">Privacy</a><a href="#faq">Terms</a><a href="#faq">Creator guidelines</a><a href="mailto:info@careverse.ai">Contact</a></div><span className="footer-social"><Instagram size={16} /> @careverse.ai</span></div></footer>
    </div>
  );
}

export default App;
