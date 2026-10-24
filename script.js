(() => {
  'use strict';
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');
  const year = document.querySelector('#year');
  const backTop = document.querySelector('.back-top');
  if (year) year.textContent = new Date().getFullYear();

  // Theme toggle: shared by every page, persists across navigation and reloads.
  const themeButton = document.querySelector('.theme-toggle');
  const themeLabel = themeButton?.querySelector('.theme-label');
  const themeIcon = themeButton?.querySelector('.theme-icon');
  const root = document.documentElement;
  const THEME_KEY = 'eofw-theme';
  function applyTheme(theme) {
    const dark = theme === 'dark';
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    root.style.colorScheme = dark ? 'dark' : 'light';
    if (themeButton) {
      themeButton.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      themeButton.setAttribute('aria-pressed', String(dark));
      themeButton.setAttribute('title', dark ? 'Switch to light theme' : 'Switch to dark theme');
    }
    if (themeLabel) themeLabel.textContent = dark ? 'Light mode' : 'Dark mode';
    if (themeIcon) themeIcon.textContent = dark ? '☀' : '◐';
  }
  let savedTheme = null;
  try { savedTheme = localStorage.getItem(THEME_KEY); } catch (_) {}
  applyTheme(savedTheme === 'dark' ? 'dark' : 'light');
  if (themeButton) themeButton.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (_) {}
  });
  function closeMenu(){ if(!menuButton || !nav) return; menuButton.setAttribute('aria-expanded','false'); menuButton.setAttribute('aria-label','Open navigation'); nav.classList.remove('is-open'); }
  if(menuButton && nav){
    menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation');nav.classList.toggle('is-open',open);});
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
    window.addEventListener('resize',()=>{if(window.innerWidth>980)closeMenu();});
  }
  const updateBackTop=()=>{if(backTop)backTop.classList.toggle('is-visible',window.scrollY>500);};
  window.addEventListener('scroll',updateBackTop,{passive:true});updateBackTop();
  if(backTop)backTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  // Calendar view selector on Events page.
  const calendarButtons = document.querySelectorAll('.calendar-view');
  if (calendarButtons.length) {
    calendarButtons.forEach(button => button.addEventListener('click', () => {
      const view = button.dataset.view;
      calendarButtons.forEach(item => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      document.querySelectorAll('.calendar-panel').forEach(panel => {
        panel.hidden = panel.id !== 'calendar-' + view;
      });
    }));
  }
  const form=document.querySelector('#contact-form');
  if(form){form.addEventListener('submit',e=>{e.preventDefault();const data=new FormData(form);const name=String(data.get('name')||'').trim();const email=String(data.get('email')||'').trim();const topic=String(data.get('topic')||'General enquiry');const message=String(data.get('message')||'').trim();const status=document.querySelector('#form-status');const recipient='';
    if(!name||!email||!message){if(status)status.textContent='Please complete the required fields.';return;}
    const subject=encodeURIComponent('Website enquiry: '+topic);const body=encodeURIComponent('Name: '+name+'\nEmail: '+email+'\nTopic: '+topic+'\n\nMessage:\n'+message);
    if(status)status.textContent='Opening your email application. If it does not open, contact the church directly.';
    // Add the church's verified email address to recipient once confirmed.
    window.location.href='mailto:'+recipient+'?subject='+subject+'&body='+body;
  });}
})();



document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.querySelector(".menu-toggle");
    const navigation = document.querySelector("#primary-navigation");
    const backToTop = document.querySelector("#back-to-top");

    /* Mobile navigation */
    if (menuButton && navigation) {
        menuButton.addEventListener("click", () => {
            const isOpen =
                menuButton.getAttribute("aria-expanded") === "true";

            menuButton.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );

            navigation.classList.toggle("is-open", !isOpen);
        });

        navigation.addEventListener("click", (event) => {
            if (event.target.closest("a")) {
                navigation.classList.remove("is-open");
                menuButton.setAttribute("aria-expanded", "false");
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                navigation.classList.remove("is-open");
                menuButton.setAttribute("aria-expanded", "false");
            }
        });
    }

    /* Back-to-top visibility */
    if (backToTop) {
        const updateBackToTop = () => {
            backToTop.hidden = window.scrollY < 500;
        };

        window.addEventListener("scroll", updateBackToTop, {
            passive: true
        });

        updateBackToTop();

        backToTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }
});



document.addEventListener("DOMContentLoaded", () => {
    const calendarButtons = document.querySelectorAll(".calendar-view");

    const calendarPanels = document.querySelectorAll(
        "[data-calendar-panel]"
    );

    calendarButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const selectedView = button.dataset.view;

            // Update the selected button.
            calendarButtons.forEach((item) => {
                const isActive = item === button;

                item.classList.toggle("is-active", isActive);
                item.setAttribute("aria-pressed", String(isActive));
            });

            // Display only the selected calendar panel.
            calendarPanels.forEach((panel) => {
                panel.hidden = panel.dataset.calendarPanel !== selectedView;
            });
        });
    });
});


/* =========================================
   GALLERY LIGHTBOX FUNCTIONALITY
========================================= */

(() => {
    const gallery = document.querySelector(".gallery-grid");
    const lightbox = document.getElementById("galleryLightbox");

    if (!gallery || !lightbox) return;

    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxCounter = document.getElementById("lightboxCounter");
    const lightboxCaption = document.getElementById("lightboxCaption");

    const closeButton = document.getElementById("lightboxClose");
    const previousButton = document.getElementById("lightboxPrev");
    const nextButton = document.getElementById("lightboxNext");

    const getImages = () =>
        Array.from(gallery.querySelectorAll(".gallery-item img"));

    let currentIndex = 0;
    let lastFocusedElement = null;

    function showImage(index) {
        const images = getImages();

        if (!images.length) return;

        // Wrap around at the beginning and end.
        currentIndex = (index + images.length) % images.length;

        const selectedImage = images[currentIndex];

        lightboxImage.src = selectedImage.currentSrc || selectedImage.src;
        lightboxImage.alt = selectedImage.alt || "Gallery image";

        lightboxCounter.textContent =
            `${currentIndex + 1} / ${images.length}`;

        lightboxCaption.textContent =
            selectedImage.dataset.caption ||
            selectedImage.alt ||
            "";

        previousButton.disabled = images.length < 2;
        nextButton.disabled = images.length < 2;
    }

    function openLightbox(index) {
        lastFocusedElement = document.activeElement;

        showImage(index);

        lightbox.hidden = false;
        lightbox.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";

        closeButton.focus();
    }

    function closeLightbox() {
        lightbox.hidden = true;
        lightbox.setAttribute("aria-hidden", "true");

        document.body.style.overflow = "";

        lightboxImage.removeAttribute("src");

        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    }

    function showPrevious() {
        showImage(currentIndex - 1);
    }

    function showNext() {
        showImage(currentIndex + 1);
    }

    // Open when a gallery image is clicked.
    gallery.addEventListener("click", (event) => {
        const image = event.target.closest(".gallery-item img");

        if (!image) return;

        const images = getImages();
        const index = images.indexOf(image);

        if (index !== -1) {
            openLightbox(index);
        }
    });

    // Close button.
    closeButton.addEventListener("click", closeLightbox);

    // Navigation arrows.
    previousButton.addEventListener("click", showPrevious);
    nextButton.addEventListener("click", showNext);

    // Close when clicking the dark background.
    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard controls.
    document.addEventListener("keydown", (event) => {
        if (lightbox.hidden) return;

        if (event.key === "Escape") {
            closeLightbox();
        } else if (event.key === "ArrowLeft") {
            showPrevious();
        } else if (event.key === "ArrowRight") {
            showNext();
        }
    });

    // Touch swipe support for mobile phones.
    let touchStartX = 0;
    let touchStartY = 0;

    lightboxImage.addEventListener("touchstart", (event) => {
        if (!event.touches.length) return;

        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    }, { passive: true });

    lightboxImage.addEventListener("touchend", (event) => {
        if (!event.changedTouches.length) return;

        const deltaX = event.changedTouches[0].clientX - touchStartX;
        const deltaY = event.changedTouches[0].clientY - touchStartY;

        // Only interpret a clear horizontal swipe as navigation.
        if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX < 0) {
                showNext();
            } else {
                showPrevious();
            }
        }
    }, { passive: true });
})();
