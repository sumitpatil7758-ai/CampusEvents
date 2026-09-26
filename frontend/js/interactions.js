/**
 * CampusConnect - Interactive 3D Tilt & Micro-Interactions
 * 
 * Features:
 * - Dynamic 3D perspective mouse tilt (rotateX, rotateY, scale3d)
 * - Parallax depth for inner elements (icons, badges with translateZ)
 * - Smooth hover transition and spring-back reset
 * - Auto-binding to new dynamically rendered cards (eventsGrid, featuredEvents)
 */

(function () {
  'use strict';

  // Configuration for 3D Tilt Effect
  const TILT_CONFIG = {
    maxTilt: 8,         // Maximum tilt rotation in degrees
    perspective: 1000,  // CSS 3D perspective distance in px
    scale: 1.02,        // Scale-up factor on hover
    speed: 300,         // Transition speed in ms
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)' // Silky smooth easing curve
  };

  /**
   * Applies the interactive mouse-tilt effect to an individual card element
   * @param {HTMLElement} card - The element to attach tilt listeners to
   */
  function applyTiltToElement(card) {
    if (card._hasTiltApplied) return;
    card._hasTiltApplied = true;

    // Enable 3D transform rendering on card
    card.style.transformStyle = 'preserve-3d';
    card.style.transition = `transform ${TILT_CONFIG.speed}ms ${TILT_CONFIG.easing}, box-shadow 300ms ease`;

    // Mouse Move: calculate rotation relative to center of card
    card.addEventListener('mousemove', function (e) {
      const rect = card.getBoundingClientRect();
      const cardWidth = rect.width;
      const cardHeight = rect.height;

      // Cursor position inside element (0 to cardWidth / cardHeight)
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Normalized coordinates from -1 to 1 (0 at center)
      const xPercent = (mouseX / cardWidth) * 2 - 1;
      const yPercent = (mouseY / cardHeight) * 2 - 1;

      // Calculate degrees of rotation
      // Note: rotating around X axis tilts up/down; rotating around Y axis tilts left/right
      const rotateX = (-yPercent * TILT_CONFIG.maxTilt).toFixed(2);
      const rotateY = (xPercent * TILT_CONFIG.maxTilt).toFixed(2);

      // Apply 3D transform with depth and slight scale
      card.style.transform = `perspective(${TILT_CONFIG.perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${TILT_CONFIG.scale}, ${TILT_CONFIG.scale}, ${TILT_CONFIG.scale})`;

      // Give inner icons/badges subtle parallax depth
      const innerFloatingElements = card.querySelectorAll('.stat-icon, .bento-icon, .badge, .event-card-image');
      innerFloatingElements.forEach(el => {
        el.style.transform = 'translateZ(20px)';
        el.style.transition = 'transform 200ms ease';
      });
    });

    // Mouse Leave: smoothly reset to original flat position
    card.addEventListener('mouseleave', function () {
      card.style.transform = `perspective(${TILT_CONFIG.perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;

      const innerFloatingElements = card.querySelectorAll('.stat-icon, .bento-icon, .badge, .event-card-image');
      innerFloatingElements.forEach(el => {
        el.style.transform = 'translateZ(0px)';
      });
    });
  }

  /**
   * Initializes 3D tilt across all cards in the DOM
   */
  window.init3DTilt = function () {
    const cardSelectors = [
      '.event-card',
      '.stat-card',
      '.bento-card',
      '.dashboard-card',
      '.step-card',
      '.quick-action-btn',
      '.form-card',
      '.tilt-card'
    ];

    const cards = document.querySelectorAll(cardSelectors.join(', '));
    cards.forEach(card => applyTiltToElement(card));
  };

  /**
   * MutationObserver to automatically attach 3D tilt whenever new
   * event cards are fetched and inserted into the DOM by API scripts.
   */
  function setupDynamicCardObserver() {
    const observer = new MutationObserver((mutations) => {
      let shouldScan = false;
      for (const mutation of mutations) {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
          shouldScan = true;
          break;
        }
      }
      if (shouldScan) {
        window.init3DTilt();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.init3DTilt();
      setupDynamicCardObserver();
    });
  } else {
    window.init3DTilt();
    setupDynamicCardObserver();
  }
})();
