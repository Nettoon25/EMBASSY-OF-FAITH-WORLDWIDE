
(() => {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        const root = document.documentElement;

        /* =========================================
           SHARED ELEMENTS
        ========================================= */
        const menuButton = document.querySelector('.menu-toggle');
        const navigation = document.querySelector('#primary-nav');
        const themeButton = document.querySelector('.theme-toggle');
        const themeIcon = themeButton?.querySelector('.theme-toggle-icon');
        const backToTop = document.querySelector('.back-top, #back-to-top');
        const year = document.querySelector('#year');

        if (year) {
            year.textContent = new Date().getFullYear();
        }

        /* =========================================
           THEME TOGGLE
           Persists the selected theme across pages.
        ========================================= */
        const THEME_KEY = 'eofw-theme';

        function updateThemeIcon(theme) {
            if (!themeIcon) return;

            // Replace these paths if your icon files use different names.
            themeIcon.src = theme === 'dark'
                ? '/images/sun.svg'
                : '/images/moon.svg';
        }

        function applyTheme(theme) {
            const isDark = theme === 'dark';

            root.setAttribute('data-theme', theme);
            root.style.colorScheme = theme;

            if (themeButton) {
                themeButton.setAttribute(
                    'aria-label',
                    isDark ? 'Switch to light mode' : 'Switch to dark mode'
                );

                themeButton.setAttribute('aria-pressed', String(isDark));

                themeButton.setAttribute(
                    'title',
                    isDark ? 'Switch to light theme' : 'Switch to dark theme'
                );
            }

            updateThemeIcon(theme);
        }

        let savedTheme = 'light';

        try {
            savedTheme = localStorage.getItem(THEME_KEY) || 'light';
        } catch (error) {
            // Continue using the default theme if storage is unavailable.
        }

        applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

        if (themeButton) {
            themeButton.addEventListener('click', () => {
                const nextTheme =
                    root.getAttribute('data-theme') === 'dark'
                        ? 'light'
                        : 'dark';

                applyTheme(nextTheme);

                try {
                    localStorage.setItem(THEME_KEY, nextTheme);
                } catch (error) {
                    // The theme still changes for the current page.
                }
            });
        }

        /* =========================================
           MOBILE NAVIGATION
        ========================================= */
        function closeMenu() {
            if (!menuButton || !navigation) return;

            menuButton.setAttribute('aria-expanded', 'false');
            menuButton.setAttribute('aria-label', 'Open navigation');
            navigation.classList.remove('is-open');
        }

        if (menuButton && navigation) {
            menuButton.addEventListener('click', () => {
                const isOpen =
                    menuButton.getAttribute('aria-expanded') === 'true';

                menuButton.setAttribute('aria-expanded', String(!isOpen));
                menuButton.setAttribute(
                    'aria-label',
                    isOpen ? 'Open navigation' : 'Close navigation'
                );

                navigation.classList.toggle('is-open', !isOpen);
            });

            navigation.querySelectorAll('a').forEach((link) => {
                link.addEventListener('click', closeMenu);
            });

            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') {
                    closeMenu();
                }
            });

            window.addEventListener('resize', () => {
                if (window.innerWidth > 980) {
                    closeMenu();
                }
            });
        }

        /* =========================================
           BACK TO TOP
        ========================================= */
        function updateBackToTop() {
            if (!backToTop) return;

            backToTop.classList.toggle(
                'is-visible',
                window.scrollY > 500
            );
        }

        if (backToTop) {
            window.addEventListener('scroll', updateBackToTop, {
                passive: true
            });

            updateBackToTop();

            backToTop.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        /* =========================================
           CALENDAR VIEW SELECTOR
        ========================================= */
        const calendarButtons = document.querySelectorAll('.calendar-view');
        const calendarPanels = document.querySelectorAll(
            '.calendar-panel, [data-calendar-panel]'
        );

        if (calendarButtons.length) {
            calendarButtons.forEach((button) => {
                button.addEventListener('click', () => {
                    const selectedView = button.dataset.view;

                    calendarButtons.forEach((item) => {
                        const isActive = item === button;

                        item.classList.toggle('is-active', isActive);
                        item.setAttribute(
                            'aria-pressed',
                            String(isActive)
                        );
                    });

                    calendarPanels.forEach((panel) => {
                        const panelView = panel.dataset.calendarPanel
                            || panel.id.replace(/^calendar-/, '');

                        panel.hidden = panelView !== selectedView;
                    });
                });
            });
        }

        /* =========================================
           CONTACT FORM
        ========================================= */
        const form = document.querySelector('#contact-form');

        if (form) {
            form.addEventListener('submit', (event) => {
                event.preventDefault();

                const data = new FormData(form);

                const name = String(data.get('name') || '').trim();
                const email = String(data.get('email') || '').trim();
                const topic = String(
                    data.get('topic') || 'General enquiry'
                ).trim();
                const message = String(
                    data.get('message') || ''
                ).trim();

                const status = document.querySelector('#form-status');

                // Replace with the verified recipient email address.
                const recipient = '';

                if (!name || !email || !message) {
                    if (status) {
                        status.textContent =
                            'Please complete the required fields.';
                    }
                    return;
                }

                if (!recipient) {
                    if (status) {
                        status.textContent =
                            'The contact email has not been configured yet.';
                    }
                    return;
                }

                const subject = encodeURIComponent(
                    `Website enquiry: ${topic}`
                );

                const body = encodeURIComponent(
                    `Name: ${name}\n` +
                    `Email: ${email}\n` +
                    `Topic: ${topic}\n\n` +
                    `Message:\n${message}`
                );

                if (status) {
                    status.textContent =
                        'Opening your email application.';
                }

                window.location.href =
                    `mailto:${recipient}?subject=${subject}&body=${body}`;
            });
        }

        /* =========================================
           GALLERY LIGHTBOX
        ========================================= */
        const gallery = document.querySelector('.gallery-grid');
        const lightbox = document.getElementById('galleryLightbox');

        if (!gallery || !lightbox) return;

        const lightboxImage = document.getElementById('lightboxImage');
        const lightboxCounter = document.getElementById('lightboxCounter');
        const lightboxCaption = document.getElementById('lightboxCaption');

        const closeButton = document.getElementById('lightboxClose');
        const previousButton = document.getElementById('lightboxPrev');
        const nextButton = document.getElementById('lightboxNext');

        if (
            !lightboxImage ||
            !lightboxCounter ||
            !lightboxCaption ||
            !closeButton ||
            !previousButton ||
            !nextButton
        ) {
            return;
        }

        const getImages = () =>
            Array.from(gallery.querySelectorAll('.gallery-item img'));

        let currentIndex = 0;
        let lastFocusedElement = null;

        function showImage(index) {
            const images = getImages();

            if (!images.length) return;

            currentIndex = (index + images.length) % images.length;

            const selectedImage = images[currentIndex];

            lightboxImage.src =
                selectedImage.currentSrc || selectedImage.src;

            lightboxImage.alt =
                selectedImage.alt || 'Gallery image';

            lightboxCounter.textContent =
                `${currentIndex + 1} / ${images.length}`;

            lightboxCaption.textContent =
                selectedImage.dataset.caption ||
                selectedImage.alt ||
                '';

            previousButton.disabled = images.length < 2;
            nextButton.disabled = images.length < 2;
        }

        function openLightbox(index) {
            lastFocusedElement = document.activeElement;

            showImage(index);

            lightbox.hidden = false;
            lightbox.setAttribute('aria-hidden', 'false');

            document.body.style.overflow = 'hidden';

            closeButton.focus();
        }

        function closeLightbox() {
            lightbox.hidden = true;
            lightbox.setAttribute('aria-hidden', 'true');

            document.body.style.overflow = '';

            lightboxImage.removeAttribute('src');

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

        gallery.addEventListener('click', (event) => {
            const image = event.target.closest('.gallery-item img');

            if (!image) return;

            const index = getImages().indexOf(image);

            if (index !== -1) {
                openLightbox(index);
            }
        });

        closeButton.addEventListener('click', closeLightbox);
        previousButton.addEventListener('click', showPrevious);
        nextButton.addEventListener('click', showNext);

        lightbox.addEventListener('click', (event) => {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (lightbox.hidden) return;

            if (event.key === 'Escape') {
                closeLightbox();
            } else if (event.key === 'ArrowLeft') {
                showPrevious();
            } else if (event.key === 'ArrowRight') {
                showNext();
            }
        });

        /* Touch swipe support */
        let touchStartX = 0;
        let touchStartY = 0;

        lightboxImage.addEventListener('touchstart', (event) => {
            if (!event.touches.length) return;

            touchStartX = event.touches[0].clientX;
            touchStartY = event.touches[0].clientY;
        }, { passive: true });

        lightboxImage.addEventListener('touchend', (event) => {
            if (!event.changedTouches.length) return;

            const deltaX =
                event.changedTouches[0].clientX - touchStartX;

            const deltaY =
                event.changedTouches[0].clientY - touchStartY;

            // Ignore vertical gestures and small horizontal movements.
            if (
                Math.abs(deltaX) > 50 &&
                Math.abs(deltaX) > Math.abs(deltaY)
            ) {
                if (deltaX < 0) {
                    showNext();
                } else {
                    showPrevious();
                }
            }
        }, { passive: true });
    });
})();