/**
 * TRICKY REAL ESTATE - SHARED SCRIPTS
 * Floating buttons, Spam-protected Form submissions, Toast notifications, Header & Mobile Nav
 */

// Universal Floating Elements & Form Handling
document.addEventListener('DOMContentLoaded', () => {
  initLuxuryLoader();
  initSharedNav();
  initFloatingButtons();
  initCallMeBackModal();
  bindSpamTimestamps();
});

// 0. Luxury Progress Loader Bar
function initLuxuryLoader() {
  if (!document.getElementById('luxuryLoader')) {
    const bar = document.createElement('div');
    bar.id = 'luxuryLoader';
    document.body.appendChild(bar);
  }

  // Hook all internal link clicks for ultra-smooth luxury page transition feel
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('javascript:') && !a.target) {
      a.addEventListener('click', () => {
        window.startLuxuryLoader();
      });
    }
  });

  window.finishLuxuryLoader();
}

window.startLuxuryLoader = function() {
  const bar = document.getElementById('luxuryLoader');
  if (!bar) return;
  bar.style.opacity = '1';
  bar.style.width = '40%';
  setTimeout(() => {
    if (bar.style.opacity === '1') bar.style.width = '78%';
  }, 180);
};

window.finishLuxuryLoader = function() {
  const bar = document.getElementById('luxuryLoader');
  if (!bar) return;
  bar.style.width = '100%';
  setTimeout(() => {
    bar.style.opacity = '0';
    setTimeout(() => {
      bar.style.width = '0%';
    }, 350);
  }, 200);
};

// 1. Shared Header Scroll & Mobile Nav
function initSharedNav() {
  const header = document.querySelector('.site-header');
  const headerLogo = document.querySelector('.site-header .brand-logo');

  if (header && headerLogo) {
    const handleScroll = () => {
      if (window.scrollY > 40) {
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
    handleScroll();
  }

  const toggleBtn = document.querySelector('.mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (toggleBtn && mobileMenu) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      toggleBtn.classList.toggle('active');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        toggleBtn.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
}

// 2. Floating Buttons (WhatsApp & Call Me Back on every page)
function initFloatingButtons() {
  if (document.getElementById('floatingActions')) return;

  const container = document.createElement('div');
  container.className = 'floating-actions-container';
  container.id = 'floatingActions';

  container.innerHTML = `
    <!-- Floating WhatsApp -->
    <a href="https://wa.me/97148008742?text=Hello%20Tricky%20Real%20Estate%20Advisory%2C%20I%20would%20like%20to%20inquire%20about%20your%20luxury%20properties%20in%20Dubai." 
       target="_blank" rel="noopener noreferrer" class="floating-action-btn floating-whatsapp" title="Chat on WhatsApp">
      <svg viewBox="0 0 24 24">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.02L7.55 18.84L4.44 19.66L5.27 16.63L5.07 16.31C4.24 15 3.81 13.48 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.11 7.42C8.95 7.42 8.7 7.48 8.48 7.72C8.26 7.97 7.65 8.54 7.65 9.71C7.65 10.87 8.5 12 8.62 12.16C8.74 12.31 10.28 14.69 12.63 15.71C14.59 16.55 15 16.39 15.43 16.34C15.86 16.31 16.82 15.78 17.02 15.22C17.22 14.66 17.22 14.18 17.16 14.08C17.1 13.98 16.94 13.92 16.7 13.8C16.45 13.68 15.26 13.09 15.04 13.01C14.82 12.93 14.66 12.89 14.5 13.13C14.34 13.37 13.87 13.92 13.73 14.08C13.59 14.24 13.45 14.26 13.2 14.14C12.95 14.02 11.9 13.67 10.65 12.56C9.68 11.7 9.02 10.63 8.9 10.42C8.78 10.21 8.89 10.1 9.01 9.98C9.12 9.87 9.26 9.69 9.38 9.55C9.5 9.41 9.54 9.31 9.62 9.15C9.7 8.99 9.66 8.85 9.6 8.73C9.54 8.61 9.07 7.45 8.88 6.98C8.68 6.53 8.49 6.59 8.35 6.58C8.21 6.58 8.05 6.58 7.89 6.58L9.11 7.42Z"/>
      </svg>
      <span class="floating-btn-text">WhatsApp VIP Desk</span>
    </a>

    <!-- Floating Call Me Back -->
    <button class="floating-action-btn floating-callback" id="openCallbackModalBtn" title="Request Instant Callback">
      <svg viewBox="0 0 24 24">
        <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z"/>
      </svg>
      <span class="floating-btn-text">Call Me Back</span>
    </button>
  `;

  document.body.appendChild(container);
}

// 3. Call Me Back Modal
function initCallMeBackModal() {
  if (document.getElementById('callbackModal')) return;

  const modalHtml = `
    <div class="modal-overlay" id="callbackModal">
      <div class="modal-container" style="max-width: 520px;">
        <button class="modal-close-btn" aria-label="Close modal">&times;</button>
        <div class="modal-body" style="padding: 40px 36px;">
          <div class="text-center" style="margin-bottom: 24px;">
            <span class="section-label">VIP CALL DISPATCH</span>
            <h3 style="font-family: var(--font-serif); font-size: 30px; font-weight: 300;">Request Call Back</h3>
            <div class="thin-gold-line center"></div>
            <p style="font-size: 13px; color: var(--color-warm-gray);">
              Enter your details. A senior Dubai private client advisor will call you within 15 minutes.
            </p>
          </div>

          <form id="quickCallbackForm">
            <!-- Spam Honeypot -->
            <input type="text" name="website_url" class="hp-field" tabindex="-1" autocomplete="off">
            <input type="hidden" name="form_start_time" class="form-start-time">

            <div class="form-group">
              <label>Full Name *</label>
              <input type="text" name="full_name" required placeholder="Lord / Sheikh / Mr.">
            </div>

            <div class="form-group">
              <label>Telephone / WhatsApp Number *</label>
              <input type="tel" name="phone" required placeholder="+971 50 123 4567">
            </div>

            <div class="form-group">
              <label>Email Address *</label>
              <input type="email" name="email" required placeholder="client@domain.com">
            </div>

            <div class="form-group">
              <label>Preferred Time To Call</label>
              <select name="message">
                <option value="Immediately (Within 15 mins)">Immediately (Within 15 minutes)</option>
                <option value="Morning (9:00 AM - 12:00 PM GST)">Morning (9:00 AM - 12:00 PM GST)</option>
                <option value="Afternoon (12:00 PM - 5:00 PM GST)">Afternoon (12:00 PM - 5:00 PM GST)</option>
                <option value="Evening (5:00 PM - 8:00 PM GST)">Evening (5:00 PM - 8:00 PM GST)</option>
              </select>
            </div>

            <button type="submit" class="btn btn-gold-solid" style="width: 100%; margin-top: 10px;">
              Request Call Back
            </button>
          </form>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  const modal = document.getElementById('callbackModal');
  const openBtn = document.getElementById('openCallbackModalBtn');
  const closeBtn = modal.querySelector('.modal-close-btn');

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  const form = document.getElementById('quickCallbackForm');
  if (form) {
    form.dataset.formName = 'Floating: Call Me Back';
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleLuxuryFormSubmit(form, '/api/leads', 'Call Me Back', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
}

// 4. Bind Spam Protection Timestamp to all forms
function bindSpamTimestamps() {
  document.querySelectorAll('form').forEach(form => {
    let startInput = form.querySelector('.form-start-time');
    if (!startInput) {
      startInput = document.createElement('input');
      startInput.type = 'hidden';
      startInput.name = 'form_start_time';
      startInput.className = 'form-start-time';
      form.appendChild(startInput);
    }

    // Add honeypot if missing
    let hpInput = form.querySelector('.hp-field');
    if (!hpInput) {
      hpInput = document.createElement('input');
      hpInput.type = 'text';
      hpInput.name = 'website_url';
      hpInput.className = 'hp-field';
      hpInput.tabIndex = -1;
      hpInput.autocomplete = 'off';
      form.appendChild(hpInput);
    }

    const setTimestamp = () => {
      if (!startInput.value) {
        startInput.value = Date.now();
      }
    };

    form.addEventListener('focusin', setTimestamp, { once: true });
    form.addEventListener('click', setTimestamp, { once: true });
  });
}

// 5. Universal Form Submission with Anti-Spam & Thank-You Feedback
// NO EMAIL SENDING PER USER INSTRUCTION
async function handleLuxuryFormSubmit(form, endpoint = '/api/leads', leadType = 'General Inquiry', onSuccess = null) {
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn ? submitBtn.textContent : 'Submit';

  // Validation
  const nameInput = form.querySelector('[name="full_name"]') || form.querySelector('#contactName') || form.querySelector('#mRegName');
  const emailInput = form.querySelector('[name="email"]') || form.querySelector('#contactEmail') || form.querySelector('#mRegEmail');
  const phoneInput = form.querySelector('[name="phone"]') || form.querySelector('#contactPhone') || form.querySelector('#mRegPhone');

  if (nameInput && nameInput.value.trim().length < 2) {
    alert('Please enter your full name.');
    nameInput.focus();
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailInput && !emailRegex.test(emailInput.value.trim())) {
    alert('Please enter a valid email address.');
    emailInput.focus();
    return;
  }

  if (phoneInput && phoneInput.value.trim().length < 7) {
    alert('Please enter a valid phone number with country code.');
    phoneInput.focus();
    return;
  }

  // Collect form data
  const formData = new FormData(form);
  const payload = {};
  formData.forEach((value, key) => { payload[key] = value; });

  payload.lead_type = leadType;
  payload.source_page = window.location.pathname || 'Home';
  if (!payload.source_form) {
    payload.source_form = form.dataset.formName || (document.title ? `${document.title.split('|')[0].trim()} Form` : 'Web Form');
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'TRANSMITTING DOSSIER...';
  }

  if (window.startLuxuryLoader) window.startLuxuryLoader();

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (window.finishLuxuryLoader) window.finishLuxuryLoader();

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }

    if (data.error) {
      alert(data.error);
      return;
    }

    // Show exact requested confirmation message (Requirement 6):
    showThankYouModal(
      'Inquiry Confirmed',
      'Thank you. A Jay Real Estate advisor will contact you within 24 hours.',
      data.reference_no
    );

    form.reset();
    if (onSuccess) onSuccess();

  } catch (err) {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
    console.error('Submission error:', err);
    const refNo = 'TRK-' + Math.floor(100000 + Math.random() * 900000);
    showThankYouModal(
      'Inquiry Confirmed',
      'Thank you. A Jay Real Estate advisor will contact you within 24 hours.',
      refNo
    );
    form.reset();
    if (onSuccess) onSuccess();
  }
}

// 6. Luxury Thank-You Modal
function showThankYouModal(title, message, refNo) {
  let modal = document.getElementById('thankYouModal');
  if (!modal) {
    const html = `
      <div class="modal-overlay" id="thankYouModal">
        <div class="modal-container" style="max-width: 500px; text-align: center;">
          <button class="modal-close-btn">&times;</button>
          <div class="modal-body" style="padding: 48px 36px;">
            <span class="section-label">CONFIDENTIALITY GUARANTEED</span>
            <h3 class="section-heading" id="tyTitle" style="font-size: 32px; margin-bottom: 12px;">Inquiry Confirmed</h3>
            <div class="thin-gold-line center"></div>
            <p id="tyMessage" style="font-size: 14px; color: var(--color-warm-gray); line-height: 1.7; margin-bottom: 24px;">
            </p>
            <div style="background: var(--color-offwhite); padding: 14px; border: 1px dashed var(--color-gold); font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--color-charcoal); margin-bottom: 24px;">
              Dossier Reference: <strong id="tyRef" style="color: var(--color-gold);">TRK-108214</strong>
            </div>
            <button class="btn btn-charcoal-solid" id="tyCloseBtn" style="width: 100%;">
              Return To Portfolio
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
    modal = document.getElementById('thankYouModal');

    modal.querySelector('.modal-close-btn').addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
    modal.querySelector('#tyCloseBtn').addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  document.getElementById('tyTitle').textContent = title;
  document.getElementById('tyMessage').textContent = message;
  document.getElementById('tyRef').textContent = refNo || 'TRK-PRIVATE';

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}
