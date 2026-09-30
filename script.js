/* =====================================================
   TARIQ ELECTRICAL — script.js
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Navbar scroll effect ---- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Page Tab Switcher Mode ---- */
  const pageViews = document.querySelectorAll('.page-view');
  const navLinks = document.querySelectorAll('.nav-link');

  function showPage(targetHash) {
    let cleanHash = targetHash ? targetHash.split('?')[0] : '#home';
    if (!cleanHash || cleanHash === '#') {
      cleanHash = '#home';
    }
    if (cleanHash === '#clients') {
      cleanHash = '#portfolio';
    }

    const pageId = cleanHash.replace('#', '');
    const targetPage = document.getElementById(pageId);

    if (targetPage && targetPage.classList.contains('page-view')) {
      const allPages = document.querySelectorAll('.page-view');
      allPages.forEach(page => page.classList.remove('active-page'));
      targetPage.classList.add('active-page');
      window.scrollTo({ top: 0, behavior: 'instant' });

      // Highlight corresponding navbar link
      document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${pageId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      // Instantly reveal all animation elements on active page
      const revealItems = targetPage.querySelectorAll('[data-reveal]');
      revealItems.forEach(item => item.classList.add('revealed'));
    }
  }

  // Handle URL hash routing
  window.addEventListener('hashchange', () => {
    showPage(window.location.hash);
  });

  // Initial load
  showPage(window.location.hash || '#home');

  // Intercept clicks on internal links
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (anchor) {
      const href = anchor.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        let pageTarget = href;
        if (href === '#clients') pageTarget = '#portfolio';
        
        const pageEl = document.querySelector(pageTarget);
        if (pageEl && pageEl.classList.contains('page-view')) {
          e.preventDefault();
          if (window.location.hash !== pageTarget) {
            window.location.hash = pageTarget;
          } else {
            showPage(pageTarget);
          }
        }
      }
    }
  });

  /* ---- Mobile hamburger ---- */
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinksContainer.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close menu on nav link click
  navLinksContainer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinksContainer.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
    });
  });

  /* ---- Scroll reveal ---- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  // Add data-reveal to all major elements
  const revealTargets = document.querySelectorAll(
    '.service-card, .product-card, .portfolio-card, .portfolio-feature, .cert-card, .timeline-item, .contact-card, .about-highlight'
  );
  revealTargets.forEach((el, i) => {
    el.setAttribute('data-reveal', '');
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    revealObserver.observe(el);
  });

  /* ---- Contact Form Handlers (WhatsApp + Email) ---- */
  const form = document.getElementById('contact-form');
  const emailBtn = document.getElementById('form-email-btn');

  function getFormData() {
    const name    = document.getElementById('form-name').value.trim();
    const phone   = document.getElementById('form-phone').value.trim();
    const company = document.getElementById('form-company').value.trim();
    const service = document.getElementById('form-service').value;
    const message = document.getElementById('form-message').value.trim();

    if (!name || !phone || !message) {
      showFormError('Please fill in your name, phone/contact and site details.');
      return null;
    }

    const serviceLabel = {
      'panel-design':  'Panel Design & Fabrication',
      'ats':           'ATS Power Controller',
      'installation':  'Installation & Commissioning',
      'maintenance':   'Maintenance / AMC Contract',
      'testing':       'Testing & Inspection',
      'components':    'Components / Parts Supply',
      'other':         'Other',
      '':              'General Enquiry',
    }[service] || service;

    return { name, phone, company, serviceLabel, message };
  }

  if (form) {
    // Send via WhatsApp
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = getFormData();
      if (!data) return;

      const text = [
        `Hello Tariq,`,
        ``,
        `*Name:* ${data.name}`,
        `*Phone:* ${data.phone}`,
        data.company ? `*Company:* ${data.company}` : '',
        data.serviceLabel ? `*Service:* ${data.serviceLabel}` : '',
        ``,
        `*Details:*`,
        data.message,
      ].filter(Boolean).join('\n');

      const waUrl = `https://wa.me/923338076667?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');

      const btn = document.getElementById('form-submit-btn');
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '✓ Opening WhatsApp...';
      btn.style.background = '#16a34a';
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        form.reset();
      }, 3000);
    });
  }

  /* ---- Email Helper Modal & Actions ---- */
  const emailModal = document.getElementById('email-modal');
  const emailModalClose = document.getElementById('email-modal-close');
  const modalGmailBtn = document.getElementById('modal-gmail-btn');
  const modalAppBtn = document.getElementById('modal-app-btn');
  const modalCopyBtn = document.getElementById('modal-copy-btn');
  const modalCopyText = document.getElementById('modal-copy-text');

  function openEmailModal(subject = 'Inquiry for Saim Electric Service', body = 'Hello Tariq,\n\nI would like to inquire about Saim Electric Service control panel and power services.\n\nBest regards,') {
    const toEmail = 'mtariqn@gmail.com';
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(toEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const mailtoUrl = `mailto:${toEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    if (modalGmailBtn) modalGmailBtn.href = gmailUrl;
    if (modalAppBtn) modalAppBtn.href = mailtoUrl;

    if (emailModal) {
      emailModal.classList.add('active');
      emailModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeEmailModal() {
    if (emailModal) {
      emailModal.classList.remove('active');
      emailModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (emailModalClose) {
    emailModalClose.addEventListener('click', closeEmailModal);
  }

  if (emailModal) {
    emailModal.addEventListener('click', (e) => {
      if (e.target === emailModal) closeEmailModal();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && emailModal.classList.contains('active')) {
        closeEmailModal();
      }
    });
  }

  if (modalCopyBtn) {
    modalCopyBtn.addEventListener('click', async () => {
      const email = 'mtariqn@gmail.com';
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(email);
        } else {
          const tempInput = document.createElement('input');
          tempInput.value = email;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          tempInput.remove();
        }
        if (modalCopyText) {
          const original = modalCopyText.textContent;
          modalCopyText.textContent = '✓ Copied to clipboard!';
          modalCopyBtn.style.borderColor = '#22c55e';
          modalCopyBtn.style.color = '#22c55e';
          setTimeout(() => {
            modalCopyText.textContent = original;
            modalCopyBtn.style.borderColor = '';
            modalCopyBtn.style.color = '';
          }, 2500);
        }
      } catch (err) {
        console.error('Failed to copy', err);
      }
    });
  }

  // Hook all standard email links (Hero, Contact card, Footer) to the helper modal
  const standardEmailLinks = document.querySelectorAll('#hero-email-btn, #contact-email, #footer-email');
  standardEmailLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openEmailModal(
        'Inquiry for Saim Electric Service',
        'Hello Tariq,\n\nI saw your portfolio and would like to discuss an electrical control panel / power project with Saim Electric Service.\n\nBest regards,'
      );
    });
  });

  if (emailBtn) {
    // Send via Email button in contact form
    emailBtn.addEventListener('click', () => {
      const name = document.getElementById('form-name')?.value.trim() || '';
      const phone = document.getElementById('form-phone')?.value.trim() || '';
      const company = document.getElementById('form-company')?.value.trim() || '';
      const service = document.getElementById('form-service')?.value || '';
      const message = document.getElementById('form-message')?.value.trim() || '';

      const serviceLabel = {
        'panel-design': 'Panel Design & Fabrication',
        'ats': 'ATS Power Controller',
        'installation': 'Installation & Commissioning',
        'maintenance': 'Maintenance / AMC Contract',
        'testing': 'Testing & Inspection',
        'components': 'Components / Parts Supply',
        'other': 'Other',
        '': 'General Inquiry',
      }[service] || service;

      const subjectName = name ? ` - ${name}` : '';
      const subject = `Inquiry: ${serviceLabel}${subjectName}`;

      const body = [
        `Hello Tariq,`,
        ``,
        name ? `Name: ${name}` : '',
        phone ? `Phone: ${phone}` : '',
        company ? `Company: ${company}` : '',
        `Service Required: ${serviceLabel}`,
        ``,
        `Site / Requirement Details:`,
        message ? message : '(No additional details entered yet)',
      ].filter(Boolean).join('\n');

      openEmailModal(subject, body);
    });
  }

  function showFormError(msg) {
    const existing = document.querySelector('.form-error');
    if (existing) existing.remove();
    const err = document.createElement('p');
    err.className = 'form-error';
    err.textContent = msg;
    err.style.cssText = 'color:#f97316;font-size:0.85rem;font-weight:600;margin-top:-8px;';
    form.insertBefore(err, form.querySelector('.btn-submit'));
    setTimeout(() => err.remove(), 4000);
  }



  /* ---- Stat counter animation ---- */
  const statNums = document.querySelectorAll('.stat-num, .highlight-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const text = el.textContent;
    const num  = parseInt(text.replace(/\D/g, ''), 10);
    const suffix = text.replace(/[\d]/g, '');
    if (isNaN(num)) return;
    let start = 0;
    const duration = 1200;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * num) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

});
