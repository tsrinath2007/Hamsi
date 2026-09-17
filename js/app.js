/**
 * MAIN APPLICATION LOGIC
 * Manages the letter unfolding transition, typewriter entrance,
 * confetti triggers on reaching the birthday message, and replay scroll.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const openingScreen = document.getElementById('opening-screen');
  const btnOpenLetter = document.getElementById('btn-open-letter');
  const letterJourney = document.getElementById('letter-journey');
  const a4LetterSection = document.getElementById('a4-letter-section');
  const soundtrackSection = document.getElementById('soundtrack-section');
  const centerpieceTarget = document.getElementById('centerpiece-target');
  const btnConfettiParty = document.getElementById('btn-confetti-party');
  const btnReplaySoundtrack = document.getElementById('btn-replay-soundtrack');
  const bigPulsingHeart = document.querySelector('.big-pulsing-heart');

  // ============================================================
  // 1. OPEN LETTER TRANSITION (Paper Unfolding Animation & Scroll)
  // ============================================================
  if (btnOpenLetter && letterJourney) {
    // Ensure letter journey is marked revealed immediately
    letterJourney.classList.add('revealed');

    btnOpenLetter.addEventListener('click', () => {
      // Play music if not already started
      if (window.musicController && typeof window.musicController.play === 'function') {
        window.musicController.play();
      }

      // Pulse the button and trigger burst
      if (window.emitMusicNote) {
        window.emitMusicNote(btnOpenLetter);
      }

      // Smoothly scroll down to the A4 letter sheet
      if (a4LetterSection) {
        a4LetterSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // ============================================================
  // 2. SOFT TYPEWRITER ENTRANCE FOR TITLE
  // ============================================================
  const titleEl = document.getElementById('typewriter-title');
  if (titleEl) {
    titleEl.style.opacity = '0';
    titleEl.style.transform = 'translateY(8px)';
    titleEl.style.transition = 'opacity 0.9s ease, transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1)';
    
    setTimeout(() => {
      titleEl.style.opacity = '1';
      titleEl.style.transform = 'translateY(0)';
    }, 200);
  }

  // ============================================================
  // 3. CONFETTI ENGINE (Centerpiece Scroll & Button)
  // ============================================================
  let confettiTriggered = false;

  function triggerPastelConfetti() {
    if (typeof confetti !== 'function') return;

    // Soft pastel scrapbook paper confetti colors
    const colors = ['#ffb7b2', '#ffe5ec', '#fef08a', '#bae6fd', '#ffffff', '#e63946'];

    // Left cannon
    confetti({
      particleCount: 45,
      angle: 60,
      spread: 55,
      origin: { x: 0.15, y: 0.65 },
      colors: colors,
      shapes: ['circle', 'square'],
      scalar: 1.1,
      ticks: 200,
      gravity: 0.8
    });

    // Right cannon
    confetti({
      particleCount: 45,
      angle: 120,
      spread: 55,
      origin: { x: 0.85, y: 0.65 },
      colors: colors,
      shapes: ['circle', 'square'],
      scalar: 1.1,
      ticks: 200,
      gravity: 0.8
    });

    // Gentle center flutter
    setTimeout(() => {
      confetti({
        particleCount: 30,
        spread: 90,
        origin: { x: 0.5, y: 0.5 },
        colors: colors,
        scalar: 1.2,
        gravity: 0.7
      });
    }, 250);
  }

  // IntersectionObserver: Trigger ONLY when user scrolls to "Happy Birthday" centerpiece
  if (centerpieceTarget && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !confettiTriggered) {
          confettiTriggered = true;
          triggerPastelConfetti();
        }
      });
    }, {
      threshold: 0.45
    });

    observer.observe(centerpieceTarget);
  }

  // Manual confetti party button
  if (btnConfettiParty) {
    btnConfettiParty.addEventListener('click', (e) => {
      e.preventDefault();
      triggerPastelConfetti();
      if (window.emitMusicNote) {
        window.emitMusicNote(btnConfettiParty);
      }
    });
  }

  // ============================================================
  // 4. "REPLAY OUR SOUNDTRACK 🎵" BUTTON
  // ============================================================
  if (btnReplaySoundtrack && soundtrackSection) {
    btnReplaySoundtrack.addEventListener('click', () => {
      soundtrackSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Highlight flash animation on the song cards
      const cards = soundtrackSection.querySelectorAll('.song-card');
      cards.forEach((card, idx) => {
        setTimeout(() => {
          card.style.transition = 'transform 0.3s ease, background 0.3s ease';
          card.style.transform = 'scale(1.04)';
          setTimeout(() => {
            card.style.transform = '';
          }, 400);
        }, idx * 100);
      });
    });
  }

  // ============================================================
  // 5. BIG HEART CLICK INTERACTION
  // ============================================================
  if (bigPulsingHeart) {
    bigPulsingHeart.addEventListener('click', (e) => {
      triggerPastelConfetti();
      if (window.emitMusicNote) {
        window.emitMusicNote(bigPulsingHeart);
      }
    });
  }

  // ============================================================
  // 6. SCROLL REVEAL FOR SCRAPBOOK CARDS
  // ============================================================
  const scrollElements = document.querySelectorAll('[data-scroll-reveal]');
  if ('IntersectionObserver' in window && scrollElements.length > 0) {
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = entry.target.classList.contains('card-tilt-1') ? 'rotate(-2deg) translateY(0)'
            : entry.target.classList.contains('card-tilt-2') ? 'rotate(1.8deg) translateY(0)'
            : entry.target.classList.contains('card-tilt-3') ? 'rotate(-1.5deg) translateY(0)'
            : 'rotate(2.2deg) translateY(0)';
          cardObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2
    });

    scrollElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(25px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
      cardObserver.observe(el);
    });
  }

});
