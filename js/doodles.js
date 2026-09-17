/**
 * DOODLES & AMBIENT ANIMATIONS
 * Handles floating background particles, click heart bursts,
 * and decorative doodle interactions.
 */

(function () {
  'use strict';

  const particlesContainer = document.getElementById('ambient-particles');
  const doodleIcons = ['🎵', '🎶', '✨', '❤️', '🎧', '★', '☁️', '🌸'];

  // 1. Spawning Ambient Floating Particles
  function spawnAmbientParticle() {
    if (!particlesContainer) return;
    
    // Limit active particles to prevent lag
    if (particlesContainer.children.length > 18) return;

    const particle = document.createElement('span');
    particle.className = 'floating-particle';
    particle.textContent = doodleIcons[Math.floor(Math.random() * doodleIcons.length)];
    
    const startLeft = Math.random() * 95; // 0 to 95vw
    const duration = 6 + Math.random() * 5; // 6 to 11s
    const size = 0.9 + Math.random() * 0.7; // 0.9 to 1.6rem
    
    particle.style.left = `${startLeft}vw`;
    particle.style.fontSize = `${size}rem`;
    particle.style.animationDuration = `${duration}s`;
    
    // Soft pastel color tints for text icons
    const colors = ['#222', '#e63946', '#ff85a1', '#73777f', '#eab308'];
    particle.style.color = colors[Math.floor(Math.random() * colors.length)];

    particlesContainer.appendChild(particle);

    setTimeout(() => {
      if (particle.parentNode) {
        particle.remove();
      }
    }, duration * 1000);
  }

  // Periodic particle emission
  setInterval(spawnAmbientParticle, 1200);
  for (let i = 0; i < 6; i++) {
    setTimeout(spawnAmbientParticle, i * 400);
  }

  // 2. Interactive Click/Tap Burst Doodles
  document.addEventListener('pointerdown', function (e) {
    // Avoid interfering with form elements or buttons
    if (e.target.closest('input') || e.target.closest('select')) return;

    createClickBurst(e.clientX, e.clientY);
  });

  function createClickBurst(x, y) {
    const burstCount = 4 + Math.floor(Math.random() * 3);
    const burstSymbols = ['❤️', '✨', '🎵', '💕'];

    for (let i = 0; i < burstCount; i++) {
      const el = document.createElement('div');
      el.textContent = burstSymbols[Math.floor(Math.random() * burstSymbols.length)];
      el.style.position = 'fixed';
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.pointerEvents = 'none';
      el.style.userSelect = 'none';
      el.style.zIndex = '9999';
      el.style.fontSize = `${0.85 + Math.random() * 0.5}rem`;
      el.style.transition = 'transform 0.75s cubic-bezier(0.1, 0.8, 0.2, 1), opacity 0.75s ease-out';
      el.style.transform = 'translate(-50%, -50%) scale(0.6)';
      el.style.opacity = '1';

      document.body.appendChild(el);

      const angle = (Math.PI * 2 * i) / burstCount + (Math.random() - 0.5) * 0.5;
      const distance = 30 + Math.random() * 45;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance - 20;

      requestAnimationFrame(() => {
        el.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1.1) rotate(${(Math.random() - 0.5) * 40}deg)`;
        el.style.opacity = '0';
      });

      setTimeout(() => {
        if (el.parentNode) el.remove();
      }, 800);
    }
  }

  // 3. Export utility to emit music notes from music players
  window.emitMusicNote = function (sourceElement) {
    if (!sourceElement) return;
    const rect = sourceElement.getBoundingClientRect();
    const note = document.createElement('span');
    const symbols = ['🎵', '🎶', '♩', '♪'];
    note.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    note.style.position = 'fixed';
    note.style.left = `${rect.left + rect.width / 2}px`;
    note.style.top = `${rect.top}px`;
    note.style.pointerEvents = 'none';
    note.style.zIndex = '9999';
    note.style.fontSize = '1.3rem';
    note.style.color = '#e63946';
    note.style.transition = 'transform 1.2s ease-out, opacity 1.2s ease-out';
    note.style.transform = 'translate(-50%, 0) scale(0.8)';
    note.style.opacity = '1';

    document.body.appendChild(note);

    const driftX = (Math.random() - 0.5) * 60;
    const driftY = -50 - Math.random() * 40;

    requestAnimationFrame(() => {
      note.style.transform = `translate(calc(-50% + ${driftX}px), ${driftY}px) scale(1.2) rotate(${(Math.random() - 0.5) * 30}deg)`;
      note.style.opacity = '0';
    });

    setTimeout(() => {
      if (note.parentNode) note.remove();
    }, 1300);
  };

})();
