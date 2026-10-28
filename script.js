(() => {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        const root = document.documentElement;

        /* =========================================
           SHARED ELEMENTS
        ========================================= */

    const menuButton = document.querySelector('#menuToggle');
const navigation = document.querySelector('#site-nav');

        const themeButton = document.querySelector('.theme-toggle');
        const themeIcon = document.querySelector(
            '#theme-icon, .theme-toggle-icon'
        );
        const backToTop = document.querySelector(
            '.back-top, #back-to-top'
        );
        const year = document.querySelector('#year');

        if (year) {
            year.textContent = new Date().getFullYear();
        }

        /* =========================================
           THEME TOGGLE
           Saves the selected theme.
        ========================================= */

        const THEME_KEY = 'eofw-theme';

        function updateThemeIcon(theme) {
            if (!themeIcon) return;

            // Keep the existing theme.png unless separate icons
            // are specified using data-light-src/data-dark-src.
            const iconForCurrentTheme = theme === 'dark'
                ? themeIcon.dataset.lightSrc
                : themeIcon.dataset.darkSrc;

            if (iconForCurrentTheme) {
                themeIcon.src = iconForCurrentTheme;
            }
        }

        function applyTheme(theme) {
            const isDark = theme === 'dark';

            root.setAttribute('data-theme', theme);
            root.style.colorScheme = theme;

            if (themeButton) {
                themeButton.setAttribute(
                    'aria-label',
                    isDark
                        ? 'Switch to light mode'
                        : 'Switch to dark mode'
                );

                themeButton.setAttribute(
                    'aria-pressed',
                    String(isDark)
                );

                themeButton.setAttribute(
                    'title',
                    isDark
                        ? 'Switch to light theme'
                        : 'Switch to dark theme'
                );
            }

            updateThemeIcon(theme);
        }

        let savedTheme = 'light';

        try {
            savedTheme = localStorage.getItem(THEME_KEY) || 'light';
        } catch (error) {
            // Use the default theme if browser storage is unavailable.
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
                    // The theme still changes on the current page.
                }
            });
        }
        /* =========================================
           MOBILE NAVIGATION & IMAGE ICONS
        ========================================= */

        const menuOpenIcon = document.querySelector('.menu-icon-open');
        const menuCloseIcon = document.querySelector('.menu-icon-close');

        function setMenuState(isOpen) {
            if (!menuButton || !navigation) return;

            // Open or close the navigation links.
            navigation.classList.toggle('is-open', isOpen);

            // Keep accessibility attributes in sync.
            menuButton.setAttribute('aria-expanded', String(isOpen));
            menuButton.setAttribute(
                'aria-label',
                isOpen ? 'Close navigation' : 'Open navigation'
            );

            // Display exactly one icon at a time.
            if (menuOpenIcon) {
                menuOpenIcon.classList.toggle('is-active', !isOpen);
            }

            if (menuCloseIcon) {
                menuCloseIcon.classList.toggle('is-active', isOpen);
            }
        }

        if (menuButton && navigation) {
            menuButton.addEventListener('click', () => {
                const isOpen =
                    menuButton.getAttribute('aria-expanded') === 'true';

                setMenuState(!isOpen);
            });

            // Close the menu after a navigation link is selected.
            navigation.querySelectorAll('a').forEach((link) => {
                link.addEventListener('click', () => {
                    setMenuState(false);
                });
            });

            // Close the menu when Escape is pressed.
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') {
                    setMenuState(false);
                }
            });

            // Reset the menu when returning to desktop layout.
            window.addEventListener('resize', () => {
                if (window.innerWidth > 980) {
                    setMenuState(false);
                }
            });

            // Start with the menu closed and hamburger visible.
            setMenuState(false);
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
            window.addEventListener(
                'scroll',
                updateBackToTop,
                { passive: true }
            );

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

        const calendarButtons = document.querySelectorAll(
            '.calendar-view'
        );

        const calendarPanels = document.querySelectorAll(
            '.calendar-panel, [data-calendar-panel]'
        );

        if (calendarButtons.length) {
            calendarButtons.forEach((button) => {
                button.addEventListener('click', () => {
                    const selectedView = button.dataset.view;

                    calendarButtons.forEach((item) => {
                        const isActive = item === button;

                        item.classList.toggle(
                            'is-active',
                            isActive
                        );

                        item.setAttribute(
                            'aria-pressed',
                            String(isActive)
                        );
                    });

                    calendarPanels.forEach((panel) => {
                        const panelView =
                            panel.dataset.calendarPanel ||
                            panel.id.replace(/^calendar-/, '');

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

                const name = String(
                    data.get('name') || ''
                ).trim();

                const email = String(
                    data.get('email') || ''
                ).trim();

                const topic = String(
                    data.get('topic') || 'General enquiry'
                ).trim();

                const message = String(
                    data.get('message') || ''
                ).trim();

                const status = document.querySelector('#form-status');

                // Replace with your verified recipient email address.
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
            Array.from(
                gallery.querySelectorAll('.gallery-item img')
            );

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

        /* =========================================
           GALLERY TOUCH SWIPE SUPPORT
        ========================================= */

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

            // Ignore vertical swipes and small movements.
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