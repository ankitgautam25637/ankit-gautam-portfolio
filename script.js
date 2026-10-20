/**
 * Ankit Gautam - Portfolio Interactive Script
 * Vanilla JavaScript (No Frameworks)
 */

function initPortfolio() {
  // Always open on Home section first when website loads
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  // 1. Navigation Sticky & ScrollSpy
  const navbar = document.getElementById('mainNavbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const mobileToggle = document.getElementById('mobileNavToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');

  // Set Home as active initially
  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#home') {
      link.classList.add('active');
    }
  });
  mobileNavLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#home') {
      link.classList.add('active');
    }
  });

  // Handle Scroll Effects
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Navbar scrolled state
    if (scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // WhatsApp & Back to top button
    if (backToTopBtn) {
      backToTopBtn.classList.add('visible');
    }

    // ScrollSpy active state
    let currentSectionId = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
      mobileNavLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });

  // Mobile Drawer Toggle
  if (mobileToggle && mobileDrawer) {
    const closeDrawer = () => {
      mobileDrawer.classList.remove('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    };

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileDrawer.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (mobileDrawer.classList.contains('open')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });

    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeDrawer();
      });
    });

    // Close on Hire Me click inside drawer
    const drawerHireBtn = mobileDrawer.querySelector('.btn-hire');
    if (drawerHireBtn) {
      drawerHireBtn.addEventListener('click', () => {
        closeDrawer();
      });
    }

    // Close when clicking outside drawer
    document.addEventListener('click', (e) => {
      if (mobileDrawer.classList.contains('open') && !mobileDrawer.contains(e.target) && !mobileToggle.contains(e.target)) {
        closeDrawer();
      }
    });

    // Close when resizing above tablet breakpoint
    window.addEventListener('resize', () => {
      if (window.innerWidth > 992 && mobileDrawer.classList.contains('open')) {
        closeDrawer();
      }
    });
  }

  // Smooth Scroll on Back to Top
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  // 2. Animated Stats Counter (Hero)
  const statsRow = document.querySelector('.hero-stats-row');
  const statNumbers = document.querySelectorAll('.stat-number');
  let hasAnimatedStats = false;

  const animateStats = () => {
    if (hasAnimatedStats) return;
    hasAnimatedStats = true;

    const statsData = Array.from(statNumbers).map((stat) => {
      const targetStr = (stat.getAttribute('data-target') || stat.textContent).trim();
      const numVal = parseInt(targetStr, 10) || 0;
      const isPercentage = targetStr.includes('%');
      const isPlus = targetStr.includes('+');
      const isOrdinal = /th|rd|nd|st/i.test(targetStr);

      const format = (n) => {
        if (isOrdinal) {
          if (n === 0) return '0';
          if (n === 1) return '1st';
          if (n === 2) return '2nd';
          if (n === 3) return '3rd';
          return `${n}th`;
        }
        if (isPercentage) return `${n}%`;
        if (isPlus) return `${n}+`;
        return `${n}`;
      };

      // Set initial value to 0
      stat.textContent = format(0);

      return {
        element: stat,
        targetNum: numVal,
        targetStr: targetStr,
        format: format,
        lastVal: -1
      };
    });

    const duration = 1800; // 1.8s smooth duration
    let startTimestamp = null;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth easeOutCubic curve
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      statsData.forEach((item) => {
        if (progress < 1) {
          const currentVal = Math.round(easeProgress * item.targetNum);
          if (currentVal !== item.lastVal) {
            item.lastVal = currentVal;
            item.element.textContent = item.format(currentVal);
          }
        } else {
          item.element.textContent = item.targetStr;
        }
      });

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    // Brief delay to ensure initial render is visible
    setTimeout(() => {
      requestAnimationFrame(step);
    }, 120);
  };

  // Start when section becomes visible, or on load/refresh
  if ('IntersectionObserver' in window && statsRow) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateStats();
          statsObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15
    });

    statsObserver.observe(statsRow);
  } else {
    setTimeout(animateStats, 250);
  }

  // 3. Modal Management
  const modals = document.querySelectorAll('.portfolio-modal');
  const modalCloseBtns = document.querySelectorAll('.modal-close-btn');

  const openModal = (modalId) => {
    const targetModal = document.getElementById(modalId);
    if (targetModal) {
      targetModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = (modal) => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  modalCloseBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.portfolio-modal');
      if (modal) closeModal(modal);
    });
  });

  modals.forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // ESC key closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modals.forEach((modal) => {
        if (modal.classList.contains('active')) closeModal(modal);
      });
    }
  });

  // 4. Resume Modal Trigger
  const resumeBtns = document.querySelectorAll('.btn-resume-view');
  resumeBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('resumeModal');
    });
  });

  // 5. Hire Me Modal Trigger
  const hireBtns = document.querySelectorAll('.btn-hire, .btn-lets-work');
  hireBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        // Focus name input
        const nameInput = document.getElementById('contactName');
        if (nameInput) {
          setTimeout(() => nameInput.focus(), 600);
        }
        showToast('Direct contact initiated! Feel free to leave your message.');
      }
    });
  });

  // 6. Project Modal Details
  const projectData = {
    school: {
      title: 'Mentor Educational Platform',
      category: 'Frontend & UI Engineering',
      image: './assets/images/mentor_proj.jpeg',
      tags: ['HTML5', 'CSS3', 'Bootstrap 5', 'JavaScript', 'Responsive'],
      description: 'A modern, responsive educational template & website built with Bootstrap. Features modern hero showcases, course listings, trainer profiles, upcoming events, student reviews, and an interactive contact interface.',
      features: [
        'Modern Responsive Hero Section with Bootstrap',
        'Interactive Course Catalog & Filter System',
        'Trainer Profiles & Student Testimonials',
        'Upcoming Events Showcase & Registration',
        'High-Performance Mobile-First Design'
      ],
      demoUrl: 'https://ankit-menter.netlify.app/',
      githubUrl: 'https://github.com/ankitgautam'
    },
    college: {
      title: 'Plantora Nursery & Garden Greens',
      category: 'Full Stack & UI Engineering',
      image: './assets/images/plantora_proj.jpeg',
      tags: ['HTML5', 'CSS3', 'JavaScript', 'E-Commerce', 'Responsive'],
      description: 'A botanical nursery web experience for plant enthusiasts. Features a modern online catalog for plants, care guides, plant categories, greenhouse gallery, customer reviews, and cart management.',
      features: [
        'Botanical Nursery Catalog with Filter Options',
        'Plant Care Guides & Maintenance Tips',
        'Greenhouse Showcase Gallery & Reviews',
        'Clean Eco-Friendly UI with Fast Navigation',
        'Mobile-Optimized Shopping Experience'
      ],
      demoUrl: 'https://ankitpreeminent-cannoli.netlify.app/',
      githubUrl: 'https://github.com/ankitgautam'
    },
    portfolio: {
      title: 'Personal Portfolio (Ankit Gautam)',
      category: 'Frontend & UI Engineering',
      image: './assets/images/portfolio_proj.jpeg',
      tags: ['HTML5', 'CSS3', 'Vanilla JavaScript', 'Font Awesome'],
      description: 'The personal developer portfolio of Ankit Gautam, engineered with vanilla web technologies. Features an electric blue dark navy theme, high-contrast typography, interactive components, responsive timeline, and seamless form validation.',
      features: [
        'Pure Vanilla Stack (Zero Framework Overhead)',
        'Electric-Blue Radial Aura & Glow Rings',
        'Interactive Modals, Form Validation & Toasts',
        'Pixel-Perfect Responsive Alignment',
        'Optimized High Performance Score'
      ],
      demoUrl: '#',
      githubUrl: 'https://github.com/ankitgautam'
    }
  };

  const projectCardBtns = document.querySelectorAll('.project-action-btn, .project-card');
  projectCardBtns.forEach((item) => {
    item.addEventListener('click', (e) => {
      // Never open modal if clicked on View Website button
      if (e.target.closest('.btn-view-website')) {
        return;
      }
      // If clicked on an external link or anchor inside
      const card = item.closest('.project-card') || item;
      const key = card.getAttribute('data-project-key');
      if (key && projectData[key]) {
        e.preventDefault();
        const data = projectData[key];
        const modal = document.getElementById('projectModal');
        if (modal) {
          modal.querySelector('#modalProjectTitle').textContent = data.title;
          modal.querySelector('#modalProjectCategory').textContent = data.category;
          modal.querySelector('#modalProjectImg').src = data.image;
          modal.querySelector('#modalProjectImg').alt = data.title;
          modal.querySelector('#modalProjectDesc').textContent = data.description;
          
          // Tags
          const tagsContainer = modal.querySelector('#modalProjectTags');
          tagsContainer.innerHTML = data.tags.map(t => `<span class="tech-tag">${t}</span>`).join('');
          
          // Features
          const featuresContainer = modal.querySelector('#modalProjectFeatures');
          featuresContainer.innerHTML = data.features.map(f => `<li><i class="fa-solid fa-circle-check text-blue" style="margin-right: 8px;"></i>${f}</li>`).join('');
          
          openModal('projectModal');
        }
      }
    });
  });

  // "View All Projects" Modal
  const viewAllProjectsBtn = document.getElementById('viewAllProjectsBtn');
  if (viewAllProjectsBtn) {
    viewAllProjectsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const pImg = document.getElementById('portfolioProjectImg');
      const mImg = document.getElementById('modalPortfolioProjectImg');
      if (pImg && mImg && pImg.src) {
        mImg.src = pImg.src;
      }
      openModal('allProjectsModal');
    });
  }

  // Storage helper for photos & certificates across refreshes
  const openPhotoDB = () => {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        reject(new Error('IndexedDB not supported'));
        return;
      }
      const req = indexedDB.open('AnkitPortfolioPhotosDB', 1);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('photos')) {
          db.createObjectStore('photos');
        }
      };
      req.onsuccess = (e) => resolve(e.target.result);
      req.onerror = (e) => reject(e.target.error);
    });
  };

  const savePhotoToDB = async (key, dataUrl) => {
    try {
      const db = await openPhotoDB();
      const tx = db.transaction('photos', 'readwrite');
      tx.objectStore('photos').put(dataUrl, key);
    } catch (err) {
      console.warn('Could not store to IndexedDB', err);
    }
  };

  const getPhotoFromDB = async (key) => {
    try {
      const db = await openPhotoDB();
      return new Promise((resolve) => {
        const tx = db.transaction('photos', 'readonly');
        const req = tx.objectStore('photos').get(key);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  };

  const deletePhotoFromDB = async (key) => {
    try {
      const db = await openPhotoDB();
      const tx = db.transaction('photos', 'readwrite');
      tx.objectStore('photos').delete(key);
    } catch (err) {
      console.warn('Could not delete from IndexedDB', err);
    }
  };

  // 7. Certificate Modals
  const certCards = document.querySelectorAll('.cert-card');
  const certData = {
    adca: {
      title: 'ADCA (Advanced Diploma in Computer Applications)',
      issuer: 'Keerti Computer Institute',
      skills: 'Office Automation, Database Management, Graphic Design Basics, OS Architecture, Advanced Computing',
      duration: '1 Year Comprehensive Diploma',
      id: 'KCI-ADCA-2023-8942'
    },
    icat: {
      title: 'Internship Common Aptitude Test (ICAT)',
      issuer: 'Certificate of Participation • Internship Studio',
      skills: 'Quantitative Aptitude, Logical & Visual Reasoning, Data Interpretation, Verbal Ability, Practical Problem Solving',
      duration: 'Ankit Gautam • National Aptitude Test',
      id: 'ICAT-PART-ANKIT-GAUTAM'
    },
    fullstack: {
      title: 'Full Stack Web Development Internship & Certificate',
      issuer: 'CodeAlpha',
      skills: 'HTML5, CSS3, JavaScript, PHP, MySQL, REST APIs, Git Version Control, UI/UX Optimization',
      duration: 'Intensive Practical Program',
      id: 'CA-FS-2024-6721'
    }
  };

  let currentCertKey = 'icat';
  const certImgContainer = document.getElementById('modalCertImgContainer');
  const certImg = document.getElementById('modalCertImg');
  const uploadCertDocBtn = document.getElementById('uploadCertDocBtn');
  const certDocFileInput = document.getElementById('certDocFileInput');

  certCards.forEach((card) => {
    card.addEventListener('click', async (e) => {
      // If clicked on View Certificate button
      const certBtn = e.target.closest('.btn-view-cert');
      if (certBtn) {
        const href = certBtn.getAttribute('href');
        if (href && href !== '#' && href !== 'javascript:void(0)') {
          return; // Allow direct opening of external certificate URL in new tab
        }
        // If href is not yet configured, prevent page jump and open the certificate detail modal
        e.preventDefault();
      }

      const key = card.getAttribute('data-cert-key');
      if (key && certData[key]) {
        currentCertKey = key;
        const item = certData[key];
        const modal = document.getElementById('certModal');
        if (modal) {
          modal.querySelector('#modalCertTitle').textContent = item.title;
          modal.querySelector('#modalCertIssuer').textContent = item.issuer;
          modal.querySelector('#modalCertDuration').textContent = item.duration;
          modal.querySelector('#modalCertId').textContent = item.id;
          modal.querySelector('#modalCertSkills').textContent = item.skills;

          // Check if custom uploaded certificate exists
          let certImgSrc = null;
          try {
            certImgSrc = localStorage.getItem(`ankitCert_${key}`);
          } catch (e) {
            console.warn(e);
          }
          if (!certImgSrc) {
            certImgSrc = await getPhotoFromDB(`ankitCert_${key}`);
          }

          if (certImgSrc && certImg && certImgContainer) {
            certImg.src = certImgSrc;
            certImgContainer.style.display = 'block';
          } else if (certImgContainer) {
            certImgContainer.style.display = 'none';
          }

          openModal('certModal');
        }
      }
    });
  });

  if (uploadCertDocBtn && certDocFileInput) {
    uploadCertDocBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      certDocFileInput.click();
    });

    certDocFileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid certificate image file (PNG, JPG, WEBP).');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        if (certImg && certImgContainer) {
          certImg.src = dataUrl;
          certImgContainer.style.display = 'block';
        }

        const key = currentCertKey || 'icat';
        try {
          localStorage.setItem(`ankitCert_${key}`, dataUrl);
        } catch (err) {
          console.warn('LocalStorage limit reached', err);
        }
        savePhotoToDB(`ankitCert_${key}`, dataUrl);

        showToast('Certificate document saved and displayed successfully!');
      };
      reader.readAsDataURL(file);
    });
  }

  // 8. Contact Form Validation & Submission
  const contactForm = document.getElementById('portfolioContactForm');
  const contactStatusAlert = document.getElementById('contactStatusAlert');

  if (contactForm) {
    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const subjectInput = document.getElementById('contactSubject');
    const messageInput = document.getElementById('contactMessage');
    const submitBtn = document.getElementById('contactSubmitBtn') || contactForm.querySelector('button[type="submit"]');

    let isSubmitting = false;

    // Helper validation
    const validateField = (input, condition, errorId) => {
      const errorEl = document.getElementById(errorId);
      if (!condition) {
        input.style.borderColor = '#ef4444';
        if (errorEl) errorEl.classList.add('visible');
        return false;
      } else {
        input.style.borderColor = '#e2e8f0';
        if (errorEl) errorEl.classList.remove('visible');
        return true;
      }
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Live validation on typing
    const setupLiveValidation = (input, validator, errorId) => {
      if (!input) return;
      input.addEventListener('input', () => {
        const errorEl = document.getElementById(errorId);
        if (errorEl && errorEl.classList.contains('visible')) {
          validateField(input, validator(input.value.trim()), errorId);
        }
      });
    };

    setupLiveValidation(nameInput, (v) => v.length >= 2, 'nameError');
    setupLiveValidation(emailInput, (v) => emailRegex.test(v), 'emailError');
    setupLiveValidation(subjectInput, (v) => v.length >= 3, 'subjectError');
    setupLiveValidation(messageInput, (v) => v.length >= 10, 'messageError');

    const showStatus = (type, html) => {
      if (!contactStatusAlert) return;
      contactStatusAlert.className = `contact-status-alert ${type}`;
      contactStatusAlert.innerHTML = html;
      contactStatusAlert.style.display = 'flex';
    };

    const hideStatus = () => {
      if (!contactStatusAlert) return;
      contactStatusAlert.style.display = 'none';
      contactStatusAlert.innerHTML = '';
    };

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (isSubmitting) return;

      const nameVal = nameInput.value.trim();
      const emailVal = emailInput.value.trim();
      const subjectVal = subjectInput.value.trim();
      const messageVal = messageInput.value.trim();

      const isNameValid = validateField(nameInput, nameVal.length >= 2, 'nameError');
      const isEmailValid = validateField(emailInput, emailRegex.test(emailVal), 'emailError');
      const isSubjectValid = validateField(subjectInput, subjectVal.length >= 3, 'subjectError');
      const isMessageValid = validateField(messageInput, messageVal.length >= 10, 'messageError');

      if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
        showStatus('error', '<i class="fa-solid fa-circle-exclamation"></i> Please fill in all required fields properly.');
        return;
      }

      hideStatus();
      isSubmitting = true;
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
      submitBtn.style.cursor = 'not-allowed';
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending Message...';

      const payload = {
        name: nameVal,
        email: emailVal,
        subject: subjectVal,
        message: messageVal,
        _subject: `[Portfolio Contact] ${subjectVal}`,
        _replyto: emailVal,
        _template: 'table',
        _captcha: 'false'
      };

      try {
        let sent = false;
        let resultMsg = 'Your message has been sent successfully to Ankit Gautam!';

        // Step 1: Try backend API endpoint if running on a web server
        if (window.location.protocol !== 'file:') {
          try {
            const apiRes = await fetch('/api/contact', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify(payload)
            });

            if (apiRes.ok) {
              const apiData = await apiRes.json();
              if (apiData.success) {
                sent = true;
                if (apiData.message) resultMsg = apiData.message;
              }
            }
          } catch (apiErr) {
            console.warn('Backend /api/contact unavailable, trying direct secure provider:', apiErr);
          }
        }

        // Step 2: Fallback to direct FormSubmit provider if backend route was not reached
        if (!sent) {
          const targetUrl = 'https://formsubmit.co/ajax/ankitgautam25637@gmail.com';
          const directRes = await fetch(targetUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
          });

          const directData = await directRes.json().catch(() => ({}));
          if (directRes.ok || directData.success === 'true' || directData.success === true) {
            sent = true;
          } else if (directData.message && directData.message.includes('Activation')) {
            sent = true;
            resultMsg = 'Message delivered! FormSubmit activation email sent to ankitgautam25637@gmail.com.';
          } else {
            throw new Error(directData.message || 'Direct service submission failed.');
          }
        }

        if (sent) {
          contactForm.reset();
          [nameInput, emailInput, subjectInput, messageInput].forEach(inp => {
            if (inp) inp.style.borderColor = '#e2e8f0';
          });
          showStatus('success', `<i class="fa-solid fa-circle-check"></i> ${resultMsg}`);
          showToast('Thank you! Your message has been sent to ankitgautam25637@gmail.com.');
        } else {
          throw new Error('Could not send message.');
        }
      } catch (error) {
        console.error('Contact submission error:', error);
        showStatus('error', '<i class="fa-solid fa-circle-exclamation"></i> Unable to send message right now. Please try again or email directly at <a href="mailto:ankitgautam25637@gmail.com" style="color: inherit; text-decoration: underline; font-weight: 700;">ankitgautam25637@gmail.com</a>.');
        showToast('Sending failed. Please try again or email directly.');
      } finally {
        isSubmitting = false;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.style.cursor = 'pointer';
        submitBtn.innerHTML = originalBtnHtml;
      }
    });
  }

  // 9. Newsletter Form Submission
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      if (input && input.value.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
        input.value = '';
        showToast('Subscribed! You will receive tech updates and project announcements.');
      } else {
        showToast('Please enter a valid email address.');
      }
    });
  }

  // 10. Toast Notification System
  function showToast(message) {
    let toast = document.getElementById('toastNotice');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toastNotice';
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #38bdf8;"></i> <span>${message}</span>`;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  // 11. Copy Email Helper
  const copyEmailBtns = document.querySelectorAll('.btn-copy-email');
  copyEmailBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText('ankitgautam@gmail.com').then(() => {
        showToast('Email address copied to clipboard: ankitgautam@gmail.com');
      });
    });
  });

  // 15. Smooth Word-by-Word Animation for "Full Stack Web Developer"
  const animatedRoleContainer = document.getElementById('heroRoleAnimated');
  if (animatedRoleContainer) {
    const words = animatedRoleContainer.querySelectorAll('.role-word');
    if (words.length > 0) {
      let isAnimating = true;
      let animTimeoutIds = [];

      const clearAllTimers = () => {
        animTimeoutIds.forEach(id => clearTimeout(id));
        animTimeoutIds = [];
      };

      const runWordAnimation = () => {
        if (!isAnimating) return;
        clearAllTimers();

        // Clear previous state
        words.forEach(w => {
          w.classList.remove('active', 'fade-out');
        });

        // Sequence timings: slightly fast, smooth, professional
        const stepDelay = 260; // ms between each word
        const holdTime = 1700; // ms to keep the full title visible for reading
        const fadeOutTime = 240; // ms for smooth exit
        const pauseBeforeRestart = 150; // ms before restarting from "Full"

        // Word 0: Full
        animTimeoutIds.push(setTimeout(() => {
          if (!isAnimating) return;
          if (words[0]) words[0].classList.add('active');
        }, 80));

        // Word 1: Stack
        animTimeoutIds.push(setTimeout(() => {
          if (!isAnimating) return;
          if (words[1]) words[1].classList.add('active');
        }, 80 + stepDelay));

        // Word 2: Web
        animTimeoutIds.push(setTimeout(() => {
          if (!isAnimating) return;
          if (words[2]) words[2].classList.add('active');
        }, 80 + stepDelay * 2));

        // Word 3: Developer
        animTimeoutIds.push(setTimeout(() => {
          if (!isAnimating) return;
          if (words[3]) words[3].classList.add('active');
        }, 80 + stepDelay * 3));

        // After all words have appeared ("Full Stack Web Developer"), hold, then fade out and loop
        const totalAppearTime = 80 + stepDelay * 3;
        const fadeOutStart = totalAppearTime + holdTime;

        animTimeoutIds.push(setTimeout(() => {
          if (!isAnimating) return;
          words.forEach(w => w.classList.add('fade-out'));
        }, fadeOutStart));

        // Restart loop smoothly from "Full"
        animTimeoutIds.push(setTimeout(() => {
          if (!isAnimating) return;
          runWordAnimation();
        }, fadeOutStart + fadeOutTime + pauseBeforeRestart));
      };

      runWordAnimation();

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          isAnimating = false;
          clearAllTimers();
        } else {
          isAnimating = true;
          runWordAnimation();
        }
      });
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPortfolio);
} else {
  initPortfolio();
}

// Ensure viewport starts at Home upon full resource load
window.addEventListener('load', () => {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
});
