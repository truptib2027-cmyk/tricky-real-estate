/**
 * TRICKY REAL ESTATE - LUXURY DUBAI PROPERTY SALES
 * Interactive Scripts & Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initProperties();
  initMortgageCalculator();
  initForms();
  initModals();
});

/* --------------------------------------------------------------------------
   1. Header Scroll Logic (Transparent -> White with Charcoal Logo & Shadow)
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  const headerLogo = document.querySelector('.site-header .brand-logo');

  if (!header || !headerLogo) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
      headerLogo.classList.remove('logo-white');
      headerLogo.classList.add('logo-charcoal');
    } else {
      header.classList.remove('scrolled');
      headerLogo.classList.remove('logo-charcoal');
      headerLogo.classList.add('logo-white');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check on load
}

/* --------------------------------------------------------------------------
   2. Mobile Fullscreen Menu
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu a');

  if (!toggleBtn || !mobileMenu) return;

  const toggle = () => {
    const isOpen = mobileMenu.classList.toggle('open');
    toggleBtn.classList.toggle('active');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  toggleBtn.addEventListener('click', toggle);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      toggleBtn.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* --------------------------------------------------------------------------
   3. Properties Data & Interactive Filtering
   -------------------------------------------------------------------------- */
const PROPERTIES_DATA = [
  {
    id: 'prop-1',
    name: 'Villa Seraphina',
    category: 'villa',
    type: 'ready',
    badge: 'READY • PRIVATE BEACH',
    area: 'Palm Jumeirah',
    price: 54000000,
    priceDisplay: 'From AED 54,000,000',
    image: 'assets/images/palm_villa.jpg',
    beds: '6 Bedrooms',
    baths: '8 Bathrooms',
    size: '14,200 Sq.Ft.',
    handover: 'Immediate',
    description: 'A bespoke beachfront sanctuary on the exclusive Fronds of Palm Jumeirah. Features private infinity pool, travertine marble terraces, direct Persian Gulf beach frontage, Italian artisan interiors, staff quarters, and 5-car subterranean gallery.',
    features: ['Private White Sand Beach', 'Infinity Horizon Pool', 'Bespoke Italian Kitchen', 'Smart Home Automation', 'Subterranean Parking', 'Panoramic Skyline Views']
  },
  {
    id: 'prop-2',
    name: 'The Aurelia Residences',
    category: 'off-plan',
    type: 'off-plan',
    badge: 'OFF-PLAN • Q4 2026',
    area: 'Downtown Dubai',
    price: 6200000,
    priceDisplay: 'From AED 6,200,000',
    image: 'assets/images/offplan_tower.jpg',
    beds: '3 & 4 Bedrooms',
    baths: '4 Bathrooms',
    size: '3,450 Sq.Ft.',
    handover: 'Q4 2026 (60/40 Plan)',
    description: 'An avant-garde sculptural tower ascending over Downtown Dubai with cascading sky gardens and private cantilevered glass plunge pools. Unhindered vistas of Burj Khalifa and Dubai Canal with 7-star branded concierge services.',
    features: ['Burj Khalifa & Canal Views', 'Cantilevered Glass Pool', 'Sky Lounge & Cigar Room', 'Valet & 24/7 Concierge', '60/40 Flexible Payment Plan', 'High Investment Yield (8.4%)']
  },
  {
    id: 'prop-3',
    name: 'The Grand Sky Penthouse',
    category: 'penthouse',
    type: 'ready',
    badge: 'READY • TRI-LEVEL PENTHOUSE',
    area: 'Dubai Marina',
    price: 28500000,
    priceDisplay: 'From AED 28,500,000',
    image: 'assets/images/penthouse.jpg',
    beds: '5 Bedrooms',
    baths: '6 Bathrooms',
    size: '9,800 Sq.Ft.',
    handover: 'Immediate',
    description: 'Crown jewel tri-level sky penthouse perched above the glittering Dubai Marina yachts. Boasting double-height 7-meter ceilings, private internal elevator, rooftop sunset deck with infinity jacuzzi, and 360-degree marine and city views.',
    features: ['Double-Height Ceilings', 'Private Internal Elevator', 'Rooftop Sunset Jacuzzi', 'Bespoke Bronze Finishes', 'Private Yacht Berth Option', 'Dedicated Butler Service']
  },
  {
    id: 'prop-4',
    name: 'Belvedere Park Estate',
    category: 'villa',
    type: 'ready',
    badge: 'READY • GOLF COURSE ESTATE',
    area: 'Dubai Hills Estate',
    price: 32500000,
    priceDisplay: 'From AED 32,500,000',
    image: 'assets/images/golf_mansion.jpg',
    beds: '6 Bedrooms',
    baths: '7 Bathrooms',
    size: '12,600 Sq.Ft.',
    handover: 'Immediate',
    description: 'Ultra-contemporary architectural mansion fronting the 18-hole championship golf course in Dubai Hills Estate. Features seamless indoor-outdoor living, dual gourmet kitchens, sunken fire pit, and skyline backdrop at sunset.',
    features: ['Direct Golf Course Frontage', 'Infinity Lap Pool & Sunken Lounge', 'Dual Professional Kitchens', 'Private Gym & Spa Sanctuary', 'Expansive Rooftop Terrace', 'Gated Elite Community']
  },
  {
    id: 'prop-5',
    name: 'Azure Beachfront Villa',
    category: 'villa',
    type: 'ready',
    badge: 'READY • WATERFRONT',
    area: 'Jumeirah Bay Island',
    price: 48000000,
    priceDisplay: 'From AED 48,000,000',
    image: 'assets/images/beachfront_residence.jpg',
    beds: '5 Bedrooms',
    baths: '6 Bathrooms',
    size: '10,500 Sq.Ft.',
    handover: 'Immediate',
    description: 'Rare low-density waterfront villa on Jumeirah Bay Island. Ultra-pure minimalism rendered in Portuguese limestone, zero-edge pool meeting the turquoise tide, and tranquil views of the Arabian Gulf horizon.',
    features: ['Private Island Location', 'Zero-Edge Swimming Pool', 'Direct Shoreline Access', 'Custom Minimalist Cabinetry', 'Wine Cellar & Tasting Room', 'Discreet VIP Security']
  },
  {
    id: 'prop-6',
    name: 'Solstice Water Tower',
    category: 'off-plan',
    type: 'off-plan',
    badge: 'OFF-PLAN • Q2 2027',
    area: 'Dubai Creek Harbour',
    price: 4950000,
    priceDisplay: 'From AED 4,950,000',
    image: 'assets/images/offplan_tower.jpg',
    beds: '2, 3 & 4 Bedrooms',
    baths: '3 Bathrooms',
    size: '2,200 Sq.Ft.',
    handover: 'Q2 2027 (70/30 Plan)',
    description: 'A visionary waterfront development situated directly along the Dubai Creek marina promenade. Features panoramic floor-to-ceiling glass, sunrise yoga decks, wellness club, and effortless water taxi access to Downtown Dubai.',
    features: ['Marina Promenade Location', 'Floor-to-Ceiling Thermal Glass', 'Resort-Style Lagoon Amenities', '70/30 Construction Payment Plan', 'Anticipated 9.1% Net Yield', 'Smart Energy Efficiency']
  }
];

function initProperties() {
  const grid = document.querySelector('.property-grid');
  const tabBtns = document.querySelectorAll('.tab-btn');

  if (!grid) return;

  function render(items) {
    grid.innerHTML = '';
    items.forEach(prop => {
      const card = document.createElement('article');
      card.className = 'property-card';
      card.dataset.id = prop.id;

      card.innerHTML = `
        <div class="property-image-wrapper">
          <img src="${prop.image}" alt="${prop.name}" loading="lazy">
          <div class="property-badge ${prop.type === 'off-plan' ? 'off-plan' : ''}">${prop.badge}</div>
        </div>
        <div class="property-content">
          <div class="property-gold-line"></div>
          <h3 class="property-name">${prop.name}</h3>
          <div class="property-meta">
            ${prop.area} &nbsp;&bull;&nbsp; <span class="property-price-highlight">${prop.priceDisplay}</span>
          </div>
          <div class="property-specs">
            <div class="property-spec-item"><span class="spec-val">${prop.beds}</span></div>
            <div class="property-spec-item">&bull;</div>
            <div class="property-spec-item"><span class="spec-val">${prop.size}</span></div>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        openPropertyModal(prop);
      });

      grid.appendChild(card);
    });
  }

  // Initial render
  render(PROPERTIES_DATA);

  // Tab Filtering
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      if (filter === 'all') {
        render(PROPERTIES_DATA);
      } else if (filter === 'ready') {
        render(PROPERTIES_DATA.filter(p => p.type === 'ready'));
      } else if (filter === 'off-plan') {
        render(PROPERTIES_DATA.filter(p => p.type === 'off-plan'));
      } else {
        render(PROPERTIES_DATA.filter(p => p.category === filter));
      }
    });
  });

  // Hero Quick Search integration
  const heroSearchBtn = document.getElementById('heroSearchBtn');
  if (heroSearchBtn) {
    heroSearchBtn.addEventListener('click', () => {
      const typeSelect = document.getElementById('searchType')?.value;
      const commSelect = document.getElementById('searchCommunity')?.value;
      const priceSelect = document.getElementById('searchPrice')?.value;

      let filtered = [...PROPERTIES_DATA];

      if (typeSelect && typeSelect !== 'all') {
        filtered = filtered.filter(p => p.type === typeSelect);
      }
      if (commSelect && commSelect !== 'all') {
        filtered = filtered.filter(p => p.area.toLowerCase().includes(commSelect.toLowerCase()));
      }
      if (priceSelect && priceSelect !== 'all') {
        if (priceSelect === 'under10m') {
          filtered = filtered.filter(p => p.price < 10000000);
        } else if (priceSelect === '10m-30m') {
          filtered = filtered.filter(p => p.price >= 10000000 && p.price <= 30000000);
        } else if (priceSelect === 'above30m') {
          filtered = filtered.filter(p => p.price > 30000000);
        }
      }

      render(filtered.length ? filtered : PROPERTIES_DATA);

      // Smooth scroll down to properties
      const target = document.getElementById('properties');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

/* --------------------------------------------------------------------------
   4. Dubai Mortgage Calculator (Prices in AED)
   -------------------------------------------------------------------------- */
function initMortgageCalculator() {
  const priceSlider = document.getElementById('calcPriceSlider');
  const priceDisplay = document.getElementById('calcPriceDisplay');
  const downSlider = document.getElementById('calcDownSlider');
  const downDisplay = document.getElementById('calcDownDisplay');
  const termSlider = document.getElementById('calcTermSlider');
  const termDisplay = document.getElementById('calcTermDisplay');
  const rateSlider = document.getElementById('calcRateSlider');
  const rateDisplay = document.getElementById('calcRateDisplay');

  const monthlyOut = document.getElementById('calcMonthlyPayment');
  const loanOut = document.getElementById('calcLoanAmount');
  const downAmtOut = document.getElementById('calcDownAmount');
  const interestOut = document.getElementById('calcTotalInterest');
  const dldFeeOut = document.getElementById('calcDldFee');

  if (!priceSlider) return;

  function formatAED(amount) {
    return 'AED ' + Math.round(amount).toLocaleString('en-US');
  }

  function update() {
    const price = parseFloat(priceSlider.value);
    const downPct = parseFloat(downSlider.value);
    const termYears = parseFloat(termSlider.value);
    const annualRate = parseFloat(rateSlider.value);

    // Update labels
    priceDisplay.textContent = formatAED(price);
    downDisplay.textContent = `${downPct}% (${formatAED(price * (downPct / 100))})`;
    termDisplay.textContent = `${termYears} Years`;
    rateDisplay.textContent = `${annualRate.toFixed(2)}%`;

    // Calculations
    const downPaymentAmount = price * (downPct / 100);
    const principal = price - downPaymentAmount;
    const monthlyRate = (annualRate / 100) / 12;
    const numMonths = termYears * 12;

    let monthlyPayment = 0;
    if (monthlyRate > 0) {
      monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numMonths)) / (Math.pow(1 + monthlyRate, numMonths) - 1);
    } else {
      monthlyPayment = principal / numMonths;
    }

    const totalRepaid = monthlyPayment * numMonths;
    const totalInterest = totalRepaid - principal;
    const dldFee = (price * 0.04) + 4000; // 4% DLD fee + admin

    // Render results
    monthlyOut.textContent = Math.round(monthlyPayment).toLocaleString('en-US');
    loanOut.textContent = formatAED(principal);
    downAmtOut.textContent = formatAED(downPaymentAmount);
    interestOut.textContent = formatAED(totalInterest);
    dldFeeOut.textContent = formatAED(dldFee);
  }

  [priceSlider, downSlider, termSlider, rateSlider].forEach(slider => {
    slider.addEventListener('input', update);
  });

  update();
}

/* --------------------------------------------------------------------------
   5. Modals & Popups
   -------------------------------------------------------------------------- */
let activeModal = null;

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  activeModal = modal;
}

function closeModal() {
  if (activeModal) {
    activeModal.classList.remove('active');
    document.body.style.overflow = '';
    activeModal = null;
  }
}

function openPropertyModal(prop) {
  const modal = document.getElementById('propertyDetailModal');
  if (!modal) return;

  document.getElementById('modalPropImage').src = prop.image;
  document.getElementById('modalPropBadge').textContent = prop.badge;
  document.getElementById('modalPropName').textContent = prop.name;
  document.getElementById('modalPropMeta').textContent = `${prop.area} • ${prop.priceDisplay}`;
  document.getElementById('modalPropDesc').textContent = prop.description;

  document.getElementById('modalSpecBeds').textContent = prop.beds;
  document.getElementById('modalSpecBaths').textContent = prop.baths;
  document.getElementById('modalSpecSize').textContent = prop.size;
  document.getElementById('modalSpecHandover').textContent = prop.handover;

  const featuresList = document.getElementById('modalFeaturesList');
  if (featuresList) {
    featuresList.innerHTML = prop.features.map(f => `<li>• ${f}</li>`).join('');
  }

  // Pre-fill interest form button
  const inquireBtn = document.getElementById('modalInquireBtn');
  if (inquireBtn) {
    inquireBtn.onclick = () => {
      closeModal();
      const contactSec = document.getElementById('contact');
      if (contactSec) {
        contactSec.scrollIntoView({ behavior: 'smooth' });
        const notes = document.getElementById('contactMessage');
        if (notes) {
          notes.value = `I am inquiring specifically about: ${prop.name} (${prop.area}, ${prop.priceDisplay}).`;
        }
      }
    };
  }

  openModal('propertyDetailModal');
}

function initModals() {
  const closeBtns = document.querySelectorAll('.modal-close-btn');
  closeBtns.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  const overlays = document.querySelectorAll('.modal-overlay');
  overlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Global "Register Interest" CTA buttons trigger modal or scroll to contact
  const registerBtns = document.querySelectorAll('.trigger-register');
  registerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('registerInterestModal');
    });
  });

  // Valuation triggers
  const valuationBtns = document.querySelectorAll('.trigger-valuation');
  valuationBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('valuationModal');
    });
  });
}

/* --------------------------------------------------------------------------
   6. Form Handling (STRICTLY NO EMAIL SENDING PER SPECIFICATION)
   Interactive VIP receipt modal & toast feedback
   -------------------------------------------------------------------------- */
function showToast(title, body) {
  const toast = document.getElementById('toastNotice');
  if (!toast) return;

  toast.querySelector('.toast-title').textContent = title;
  toast.querySelector('.toast-body').textContent = body;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 5000);
}

function initForms() {
  const contactForm = document.getElementById('mainContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName')?.value || 'Valued Client';
      const refId = 'TRK-' + Math.floor(100000 + Math.random() * 900000);

      showToast(
        'VIP Inquiry Received',
        `Thank you, ${name}. Your consultation request [Ref #${refId}] has been registered. A Senior Private Client Advisor will contact you discreetly within 2 hours.`
      );
      contactForm.reset();
    });
  }

  const modalForm = document.getElementById('modalRegisterForm');
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal();
      const refId = 'TRK-' + Math.floor(100000 + Math.random() * 900000);

      showToast(
        'Registration Confirmed',
        `Your priority allocation interest [Ref #${refId}] has been logged. Our Dubai advisory desk will be in touch shortly.`
      );
      modalForm.reset();
    });
  }

  const valuationForm = document.getElementById('valuationForm');
  if (valuationForm) {
    valuationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal();
      const refId = 'VAL-' + Math.floor(100000 + Math.random() * 900000);

      showToast(
        'Valuation Dossier Initiated',
        `Confidential valuation dossier [Ref #${refId}] created. Our head of private sales will reach out for a discreet consultation.`
      );
      valuationForm.reset();
    });
  }
}
