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

type PaymentType = 'monthly' | 'annual' | 'lifetime';
type PartnerMode = 'creator' | 'business';

const CREATOR_RATE = 0.50;

const MEMBERSHIP_PRICING = {
  individual:             { monthly: 4.99,  annual: 49,  lifetime: 99  },
  individualPlus:         { monthly: 9.99,  annual: 99,  lifetime: 199 },
  family:                 { monthly: 9.99,  annual: 99,  lifetime: 199 },
  familyPlus:             { monthly: 19.99, annual: 200, lifetime: 399 },
  careCircle:             { monthly: 29.99, annual: 300, lifetime: 599 },
  parentsRetirement:      { monthly: 7.99,  annual: 79,  lifetime: 159 },
  parentsRetirementPlus:  { monthly: 14.99, annual: 149, lifetime: 299 },
  under26Regular:         { monthly: 4.99,  annual: 49,  lifetime: undefined as number | undefined },
  under26Plus:            { monthly: 9.99,  annual: 99,  lifetime: undefined as number | undefined },
} as const;

type MembershipKey = keyof typeof MEMBERSHIP_PRICING;

const MEMBERSHIP_DISPLAY: { key: MembershipKey; name: string }[] = [
  { key: 'individual',            name: 'Individual' },
  { key: 'individualPlus',        name: 'Individual Plus' },
  { key: 'family',                name: 'Family' },
  { key: 'familyPlus',            name: 'Family Plus' },
  { key: 'careCircle',            name: 'Care Circle' },
  { key: 'parentsRetirement',     name: 'Parents & Retirement' },
  { key: 'parentsRetirementPlus', name: 'Parents & Retirement Plus' },
  { key: 'under26Regular',        name: 'Under 26 Regular' },
  { key: 'under26Plus',           name: 'Under 26 Plus' },
];

const BUSINESS_TIERS = [
  { threshold: 0,     rate: 0.40, label: 'Under 5K',          desc: 'Under 5,000 qualifying memberships' },
  { threshold: 5000,  rate: 0.45, label: '5K–9,999',        desc: '5,000–9,999 qualifying memberships' },
  { threshold: 10000, rate: 0.50, label: '10K–24,999',      desc: '10,000–24,999 qualifying memberships' },
  { threshold: 25000, rate: 0.55, label: '25K+',            desc: '25,000+ qualifying memberships' },
] as const;

const VOLUME_TICK_LABELS: Record<number, string> = {
  100: '100',
  500: '500',
  1000: '1K',
  5000: '5K',
  10000: '10K',
  25000: '25K+',
};

const VOLUME_PRESETS = [100, 500, 1000, 5000, 10000, 25000];

const PRICE_LABELS: Record<PaymentType, string> = {
  monthly: 'monthly',
  annual: 'annual',
  lifetime: 'lifetime',
};

function getPrice(key: MembershipKey, payment: PaymentType): number | undefined {
  return MEMBERSHIP_PRICING[key][payment];
}

function isCommissionable(payment: PaymentType): boolean {
  return payment === 'annual' || payment === 'lifetime';
}

function getEarnings(key: MembershipKey, payment: PaymentType): number {
  if (!isCommissionable(payment)) return 0;
  const price = getPrice(key, payment);
  if (price === undefined) return 0;
  return price * CREATOR_RATE;
}

function getBusinessRate(volume: number): number {
  let rate = BUSINESS_TIERS[0].rate;
  for (const tier of BUSINESS_TIERS) {
    if (volume >= tier.threshold) rate = tier.rate;
  }
  return rate;
}

const BUSINESS_DEFAULT_MIX: Record<MembershipKey, number> = {
  individual: 0.10,
  individualPlus: 0.10,
  family: 0.30,
  familyPlus: 0.25,
  careCircle: 0.15,
  parentsRetirement: 0.05,
  parentsRetirementPlus: 0.05,
  under26Regular: 0,
  under26Plus: 0,
};

function getAveragePrice(mix: Record<MembershipKey, number>, payment: PaymentType): number {
  let total = 0;
  for (const m of MEMBERSHIP_DISPLAY) {
    const price = getPrice(m.key, payment);
    if (price !== undefined) total += mix[m.key] * price;
  }
  return total;
}

const compliancePoints = [
  { title: 'Not insurance', body: 'Careverse memberships are benefits and savings programs\u2014not health insurance or medical care.' },
  { title: 'No medical advice', body: 'Partners cannot diagnose, recommend treatment, or promise health outcomes.' },
  { title: 'Use approved messaging', body: 'Follow current Careverse product, marketing, and brand guidelines.' },
];

type FaqItem = [string, string];
type FaqCategory = { title: string; items: FaqItem[] };

const faqCategories: FaqCategory[] = [
  {
    title: 'Businesses & agencies',
    items: [
      ['Can businesses and agencies partner with Careverse?', 'Yes. Businesses and agencies can offer Careverse to the people they serve and earn margin on qualifying membership sales.'],
      ['Can businesses and agencies use their own branding?', 'Yes. Businesses and agencies can offer Careverse through a fully white-label customer experience.'],
      ['Do I need to be a healthcare business?', 'No. Businesses and agencies from other industries can partner with Careverse.'],
    ],
  },
  {
    title: 'Creators',
    items: [
      ['Can I become a Careverse creator?', 'Yes. Creators can share Careverse with their communities and earn commission on qualifying membership conversions.'],
      ['Do I need a large following?', 'No. There is no follower minimum.'],
      ['Do I need to be a healthcare professional?', 'No. You do not need a medical license or healthcare credential to become a creator.'],
      ['Can creators use their own branding?', 'Yes. Creators can use a branded or co-branded Careverse experience.'],
    ],
  },
  {
    title: 'Earnings & partnerships',
    items: [
      ['How do partners earn?', 'Creators earn commission on qualifying membership conversions. Businesses and agencies earn margin on qualifying membership sales.'],
    ],
  },
  {
    title: 'Promotion & compliance',
    items: [
      ['Is Careverse insurance?', 'No. Careverse memberships are benefits and savings programs\u2014not health insurance or medical care.'],
      ['Can partners give medical advice?', 'No. Partners should not diagnose conditions, recommend or stop treatment, or promise health outcomes.'],
      ['Do partners need to disclose their relationship with Careverse?', 'When a partner is promoting or endorsing Careverse and has a material financial relationship that isn’t otherwise clear, that relationship should be clearly disclosed. Creator-specific disclosure guidance is provided during onboarding.'],
      ['What can’t partners do?', 'Partners may not make misleading health or savings claims, promise guaranteed outcomes or savings, present Careverse as insurance or medical care, create fake reviews or testimonials, or encourage people to change or stop medical treatment.'],
    ],
  },
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
  const [conversions, setConversions] = useState<number[]>([1, 0, 1, 1, 0, 0, 0, 0, 0]);
  const [partnerMode, setPartnerMode] = useState<PartnerMode>('creator');
  const [businessVolume, setBusinessVolume] = useState<number>(1000);
  const [businessMix, setBusinessMix] = useState<Record<MembershipKey, number>>({ ...BUSINESS_DEFAULT_MIX });
  const [bizPaymentType, setBizPaymentType] = useState<PaymentType>('annual');

  const creatorCanEarn = isCommissionable(paymentType);
  const visibleMemberships = MEMBERSHIP_DISPLAY.filter((m) => getPrice(m.key, paymentType) !== undefined);

  const creatorEarnings = creatorCanEarn
    ? MEMBERSHIP_DISPLAY.reduce((sum, m, i) => sum + getEarnings(m.key, paymentType) * conversions[i], 0)
    : 0;
  const creatorQualifying = creatorCanEarn
    ? MEMBERSHIP_DISPLAY.reduce((sum, m, i) => sum + conversions[i], 0)
    : 0;

  const creatorBreakdown = creatorCanEarn
    ? MEMBERSHIP_DISPLAY.map((m, i) => ({ name: m.name, count: conversions[i], subtotal: getEarnings(m.key, paymentType) * conversions[i] }))
        .filter((item) => item.count > 0)
    : [];

  const updateConversion = (index: number, value: number) => {
    const next = [...conversions];
    next[index] = Math.max(0, isNaN(value) ? 0 : value);
    setConversions(next);
  };

  const bizCanEarn = isCommissionable(bizPaymentType);
  const bizRate = getBusinessRate(businessVolume);
  const bizAvgPrice = getAveragePrice(businessMix, bizPaymentType);
  const bizEarnings = bizCanEarn ? businessVolume * bizAvgPrice * bizRate : 0;

  const bizVolumeIndex = Math.max(0, VOLUME_PRESETS.indexOf(businessVolume));
  const activeBizTier = BUSINESS_TIERS.find((t, i) =>
    businessVolume >= t.threshold &&
    (i === BUSINESS_TIERS.length - 1 || businessVolume < BUSINESS_TIERS[i + 1].threshold)
  ) ?? BUSINESS_TIERS[0];

  const updateMix = (key: MembershipKey, value: number) => {
    setBusinessMix((prev) => ({ ...prev, [key]: Math.max(0, Math.min(100, isNaN(value) ? 0 : value)) }));
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
            <a href="#pricing" onClick={() => setMenuOpen(false)}>Partners earn</a>
            <a href="#why" onClick={() => setMenuOpen(false)}>Meet Lidia</a>
            <a href="#memberships" onClick={() => setMenuOpen(false)}>Memberships</a>
            <a href="#how" onClick={() => setMenuOpen(false)}>How it works</a>
            <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
            <a className="button button-small" href="https://careverse-creator-application.vercel.app/" onClick={() => setMenuOpen(false)}>Become a partner <ArrowRight size={16} /></a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero">
    <div className="hero-copy reveal">
            <div className="hero-top">
              <h1 className="hero-title-stacked">Get paid<br />by helping<br />people&nbsp;<span className="care-word">get&nbsp;care</span>.</h1>
            </div>
            <p className="hero-statement">Building the world's largest AI-powered care network.</p>
            <p className="hero-commission-line">Careverse brings people, providers, services, and benefits together to make finding and managing care easier, with AI-powered care assistance, free for everyone.</p>
            <div className="hero-actions">
              <a className="button" href="https://careverse-creator-application.vercel.app/">Become a partner <ArrowRight size={17} /></a>
              <a className="button button-secondary" href="#how">See how it works <ArrowRight size={17} /></a>
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
              </div>
            </div>

            <div className="partner-right reveal">
              <h2 className="partner-earn-heading">HOW PARTNERS EARN</h2>
              <p className="partner-earn-support">Choose your partner type and see what qualifying membership conversions could earn.</p>

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
                <p className="partner-sub">Earn 50% on qualifying membership conversions you drive.</p>

                <div className="calc-calculator">
                  <div className="calc-controls-col">
                    <div className="calc-billing-toggle">
                      <button className={paymentType === 'monthly' ? 'calc-billing-btn active' : 'calc-billing-btn'} onClick={() => setPaymentType('monthly')} aria-pressed={paymentType === 'monthly'}>Monthly</button>
                      <button className={paymentType === 'annual' ? 'calc-billing-btn active' : 'calc-billing-btn'} onClick={() => setPaymentType('annual')} aria-pressed={paymentType === 'annual'}>Annual</button>
                      <button className={paymentType === 'lifetime' ? 'calc-billing-btn active' : 'calc-billing-btn'} onClick={() => setPaymentType('lifetime')} aria-pressed={paymentType === 'lifetime'}>Lifetime</button>
                    </div>

                    <div className="calc-membership-list">
                      {MEMBERSHIP_DISPLAY.map((m, i) => {
                        const price = getPrice(m.key, paymentType);
                        const earnings = getEarnings(m.key, paymentType);
                        const isAvailable = price !== undefined;
                        if (!isAvailable) {
                          return (
                            <div key={m.name} className="calc-row calc-row-disabled">
                              <div className="calc-row-info">
                                <span className="calc-row-name">{m.name}</span>
                                <span className="calc-row-rate calc-row-rate-na">Not available {PRICE_LABELS[paymentType]}</span>
                              </div>
                            </div>
                          );
                        }
                        return (
                          <div key={m.name} className="calc-row">
                            <div className="calc-row-info">
                              <span className="calc-row-name">{m.name}</span>
                              <span className="calc-row-rate">${price.toLocaleString('en-US', { minimumFractionDigits: price % 1 !== 0 ? 2 : 0, maximumFractionDigits: 2 })} {PRICE_LABELS[paymentType]}{creatorCanEarn ? ` · ${earnings.toFixed(2)} per conversion` : ''}</span>
                            </div>
                            <div className="calc-stepper">
                              <button onClick={() => updateConversion(i, conversions[i] - 1)} aria-label={`Decrease ${m.name} conversions`}><Minus size={14} /></button>
                              <input type="number" min={0} value={conversions[i]} onChange={(e) => updateConversion(i, parseInt(e.target.value))} aria-label={`${m.name} conversions`} />
                              <button onClick={() => updateConversion(i, conversions[i] + 1)} aria-label={`Increase ${m.name} conversions`}><Plus size={14} /></button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {!creatorCanEarn && (
                      <p className="calc-monthly-note">Monthly memberships are currently not commissionable.</p>
                    )}
                    <p className="calc-mix-note">Mix conversions across any combination of memberships.</p>
                  </div>

                  <div className="calc-earnings-panel">
                    <span className="calc-earnings-eyebrow">Estimated partner earnings</span>
                    <div className="calc-earnings-amount">${creatorEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <div className="calc-earnings-rate"><span className="calc-red-accent">50%</span> commission</div>
                    <div className="calc-earnings-count">{creatorQualifying} qualifying membership{creatorQualifying !== 1 ? 's' : ''}</div>

                    {creatorBreakdown.length > 0 ? (
                      <div className="calc-breakdown">
                        {creatorBreakdown.map(({ name, count, subtotal }) => (
                          <div key={name} className="calc-breakdown-row">
                            <span>{count} {name}</span>
                            <strong>${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="calc-breakdown calc-breakdown-empty-state">
                        <p>{creatorCanEarn ? 'Set conversions to see your breakdown.' : 'Monthly memberships are not commissionable.'}</p>
                      </div>
                    )}

                    <a className="calc-cta-btn" href="https://careverse-creator-application.vercel.app/">Apply to creator network <ArrowRight size={15} /></a>
                    <p className="calc-disclaimer">Illustrative only. Actual earnings depend on qualifying conversions, membership mix, applicable partner terms, refunds, cancellations and any rate changes communicated by Careverse.{!creatorCanEarn ? ' Monthly memberships are currently not commissionable.' : ''}</p>
                  </div>
                </div>
              </div>

              <div className={partnerMode === 'business' ? 'partner-state partner-state-active' : 'partner-state'}>
                <p className="biz-sub">Partner economics scale with the qualifying membership volume you bring.</p>

                <div className="biz-explorer">
                  <div className="biz-rate-inline">
                    <span className="biz-rate-pct">{Math.round(bizRate * 100)}%</span>
                    <span className="biz-rate-word">partner rate</span>
                    <span className="biz-rate-tier">{activeBizTier.desc}</span>
                  </div>
                  <div className="biz-slider-wrap">
                    <div className="biz-slider-ticks">
                      {VOLUME_PRESETS.map((tick) => (
                        <span key={tick} className={`biz-slider-tick ${businessVolume === tick ? 'biz-slider-tick-active' : ''}`} onClick={() => setBusinessVolume(tick)}>{VOLUME_TICK_LABELS[tick]}</span>
                      ))}
                    </div>
                    <input
                      type="range"
                      className="biz-slider"
                      min={0}
                      max={VOLUME_PRESETS.length - 1}
                      step={1}
                      value={bizVolumeIndex}
                      onChange={(e) => setBusinessVolume(VOLUME_PRESETS[parseInt(e.target.value)])}
                      aria-label="Qualifying membership volume"
                    />
                    <div className="biz-slider-value">{businessVolume.toLocaleString()} memberships</div>
                  </div>
                </div>

                <div className="calc-calculator calc-calculator-biz">
                  <div className="calc-controls-col">
                    <div className="calc-billing-toggle">
                      <button className={bizPaymentType === 'monthly' ? 'calc-billing-btn active' : 'calc-billing-btn'} onClick={() => setBizPaymentType('monthly')} aria-pressed={bizPaymentType === 'monthly'}>Monthly</button>
                      <button className={bizPaymentType === 'annual' ? 'calc-billing-btn active' : 'calc-billing-btn'} onClick={() => setBizPaymentType('annual')} aria-pressed={bizPaymentType === 'annual'}>Annual</button>
                      <button className={bizPaymentType === 'lifetime' ? 'calc-billing-btn active' : 'calc-billing-btn'} onClick={() => setBizPaymentType('lifetime')} aria-pressed={bizPaymentType === 'lifetime'}>Lifetime</button>
                    </div>

                    <span className="calculator-step-label">Membership mix</span>
                    <div className="biz-mix-list">
                      {MEMBERSHIP_DISPLAY.map((m) => {
                        const price = getPrice(m.key, bizPaymentType);
                        if (price === undefined) return null;
                        return (
                          <div key={m.key} className="biz-mix-row">
                            <div className="biz-mix-info">
                              <span className="biz-mix-name">{m.name}</span>
                              <span className="biz-mix-price">${price.toLocaleString('en-US', { minimumFractionDigits: price % 1 !== 0 ? 2 : 0, maximumFractionDigits: 2 })} {PRICE_LABELS[bizPaymentType]}</span>
                            </div>
                            <div className="biz-mix-control">
                              <input
                                type="number"
                                min={0}
                                max={100}
                                value={businessMix[m.key]}
                                onChange={(e) => updateMix(m.key, parseFloat(e.target.value))}
                                aria-label={`${m.name} mix percentage`}
                              />
                              <span className="biz-mix-pct">%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {!bizCanEarn && (
                      <p className="calc-monthly-note">Monthly memberships are currently not commissionable.</p>
                    )}
                  </div>

                  <div className="calc-earnings-panel">
                    <span className="calc-earnings-eyebrow">Estimated earnings</span>
                    <div className="calc-earnings-amount">${bizEarnings.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
                    <div className="calc-earnings-rate"><span className="calc-red-accent">{Math.round(bizRate * 100)}%</span> partner rate</div>
                    <div className="calc-earnings-count">{businessVolume.toLocaleString()} qualifying memberships</div>

                    <a className="calc-cta-btn" href="https://careverse-creator-application.vercel.app/">Become a partner <ArrowRight size={15} /></a>
                    <p className="calc-disclaimer">Illustrative only. Actual earnings depend on qualifying conversions, membership mix, applicable partner terms, refunds, cancellations and any rate changes communicated by Careverse.{!bizCanEarn ? ' Monthly memberships are currently not commissionable.' : ''}</p>
                  </div>
                </div>

                <div className="biz-capabilities">
                  White-label storefront <span className="biz-cap-dot">·</span> Tracking &amp; attribution <span className="biz-cap-dot">·</span> Payouts handled
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5 — Healthcare should feel easier */}
        <section className="section easier-section">
          <div className="container easier-content">
            <h2 className="easier-title reveal">Healthcare should feel easier.</h2>
            <p className="easier-subtitle reveal reveal-delay-1">Finding care shouldn't mean figuring everything out on your own.</p>
            <ul className="easier-questions reveal reveal-delay-2">
              <li>Which doctor should I see?</li>
              <li>Is that doctor covered by my insurance?</li>
              <li>What are my options?</li>
              <li>Where do I go?</li>
              <li>What will it cost?</li>
              <li>What do I do next?</li>
            </ul>
            <p className="easier-footer-line reveal reveal-delay-3">You shouldn't have to become an expert just to get the care you need.</p>
          </div>
        </section>

        {/* 6 — Meet Lidia */}
        <section className="section problem-section" id="why">
          <div className="container problem-grid">
            <div className="problem-left reveal">
              <h2 className="problem-headline">MEET LIDIA</h2>
              <p className="problem-lede">Your free AI care assistant.</p>
              <p className="problem-body">When you don't know what to do next, start with Lidia. She helps you navigate and manage your care, from understanding your options and insurance to finding the right providers and figuring out what to do next.</p>
              <p className="problem-note">Just tell her what's going on.</p>
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
                <div className="how-photo"><img className="how-img-1" src="/images/jelle-van-leest-VV_U4PmDmHs-unsplash.jpg" alt="Partner applying to join the Careverse program" /></div>
                <h3>Apply</h3>
                <p>Tell us about your business, brand, or what you create.</p>
              </article>
              <article className="how-step reveal reveal-delay-2">
                <div className="how-photo"><img className="how-img-2" src="/images/rohan-krishnan-d8kp7EPgAmQ-unsplash.jpg" alt="Laptop and phone representing partner approval" /></div>
                <h3>Get approved</h3>
                <p>We’ll review your application and confirm your partner setup.</p>
              </article>
              <article className="how-step reveal reveal-delay-3">
                <div className="how-photo"><img className="how-img-3" src="/images/john-FlPc9_VocJ4-unsplash.jpg" alt="Partner getting set up with account, payouts, and tracking" /></div>
                <h3>Get set up</h3>
                <p>Set up your account, payouts, tracking, and customer-facing experience.</p>
              </article>
              <article className="how-step reveal reveal-delay-4">
                <div className="how-photo"><img className="how-img-4" src="/images/nick-morrison-FHnnjk1Yj7Y-unsplash.jpg" alt="Partner launching and earning on qualifying membership conversions" /></div>
                <h3>Launch and earn</h3>
                <p>Go live, share Careverse with the people you serve, and earn on qualifying membership conversions.</p>
              </article>
            </div>
          </div>
        </section>

        {/* 9 — FAQ / The details */}
        <section className="section faq-section" id="faq">
          <div className="container">
            <div className="faq-heading">
              <h2>Frequently asked questions</h2>
              <p>Everything you need to know about Careverse, partnering, earnings, and program guidelines.</p>
            </div>

            <div className="faq-compliance-strip">
              <h3 className="faq-compliance-title">Before you promote Careverse</h3>
              <div className="faq-compliance-grid">
                {compliancePoints.map((pt) => (
                  <div key={pt.title} className="faq-compliance-item">
                    <span className="faq-compliance-item-title">{pt.title}</span>
                    <span className="faq-compliance-item-body">{pt.body}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="faq-categories">
              {faqCategories.map((cat, catIndex) => (
                <div key={cat.title} className="faq-category-card">
                  <h3 className="faq-category-title">{cat.title}</h3>
                  <div className="faq-category-items">
                    {cat.items.map(([question, answer], itemIndex) => (
                      <details key={question} open={catIndex === 0 && itemIndex === 0}>
                        <summary>{question}<span><ChevronDown size={18} /></span></summary>
                        <p>{answer}</p>
                      </details>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
      </main>

      <footer className="site-footer"><div className="container footer-top"><div className="footer-brand"><a className="brand brand-light" href="#top"><img className="brand-wordmark" src="/careverse_wordmark.svg" alt="Careverse" /></a><p>Care, made easier to find.</p></div><div className="footer-apply"><span>Build the next chapter of care.</span><a className="button button-small" href="https://careverse-creator-application.vercel.app/">Apply to join <ArrowRight size={16} /></a></div></div><div className="container footer-disclaimer"><p>Careverse memberships are a benefits and savings program — not health insurance or medical care. Currently available in the United States and Canada.</p></div><div className="container footer-bottom"><span>Careverse™</span><div><a href="#faq">Privacy</a><a href="#faq">Terms</a><a href="#faq">Creator guidelines</a><a href="mailto:info@careverse.ai">Contact</a></div><span className="footer-social"><Instagram size={16} /> @careverse.ai</span></div></footer>
    </div>
  );
}

export default App;
