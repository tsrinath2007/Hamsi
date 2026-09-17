/**
 * ============================================================
 * 📸 MEDIA GALLERY CONFIGURATION
 * Simply add, edit, or remove objects in this MEDIA array!
 * 
 * Supported types: "image" or "video"
 * No other code needs to change anywhere in the project.
 * ============================================================
 */
const MEDIA = [
  {
    type: "image",
    src: "assets/memories/photo-01.jpg",
    caption: "core memory ❤️"
  },
  {
    type: "video",
    src: "assets/memories/video-01.mp4",
    caption: "why were we like this 💀"
  },
  {
    type: "image",
    src: "assets/memories/photo-02.jpg",
    caption: "unhinged laughter & zero regrets ✨"
  },
  {
    type: "image",
    src: "assets/memories/photo-03.jpg",
    caption: "screaming Anirudh lyrics at full volume 🎧"
  },
  {
    type: "video",
    src: "assets/memories/video-02.mp4",
    caption: "evidence we were never normal 😂"
  },
  {
    type: "image",
    src: "assets/memories/photo-04.jpg",
    caption: "same energy, always ⚡"
  },
  {
    type: "image",
    src: "assets/memories/photo-05.jpg",
    caption: "never getting rid of you ♾️❤️"
  },
  {
    type: "image",
    src: "assets/memories/photo-06.jpg",
    caption: "best memories with my favourite human 🌸"
  },
  {
    type: "image",
    src: "assets/memories/photo-07.jpg",
    caption: "absolute chaotic duo 🦋"
  },
  {
    type: "image",
    src: "assets/memories/photo-08.jpg",
    caption: "golden hour vibes ☀️"
  },
  {
    type: "image",
    src: "assets/memories/photo-09.jpg",
    caption: "smiles that made my day brighter 💫"
  },
  {
    type: "image",
    src: "assets/memories/photo-10.jpg",
    caption: "partner in every single crime 💖"
  },
  {
    type: "image",
    src: "assets/memories/photo-11.jpg",
    caption: "through every high and low 🌈"
  },
  {
    type: "image",
    src: "assets/memories/photo-12.jpg",
    caption: "cheers to another year of you! 🥂✨"
  }
];

// Expose globally for convenience
window.MEDIA = MEDIA;

// ============================================================
// AUTOMATIC SCRAPBOOK POLAROID RENDERER
// (You do NOT need to touch anything below this line!)
// ============================================================
(function () {
  'use strict';

  const tapeColors = ['tape-pink', 'tape-yellow', 'tape-blue'];
  const tiltClasses = ['polaroid-tilt-1', 'polaroid-tilt-2', 'polaroid-tilt-3', 'polaroid-tilt-4'];
  let currentLightboxIndex = 0;

  // Camera doodle placeholder SVG for missing image files
  const doodlePlaceholderSVG = `
    <div class="polaroid-placeholder">
      <svg viewBox="0 0 80 80" width="60" height="60">
        <rect x="10" y="22" width="60" height="44" rx="6" fill="#fffdf8" stroke="#222" stroke-width="2.5"/>
        <circle cx="40" cy="44" r="14" fill="#ffccd5" stroke="#222" stroke-width="2"/>
        <circle cx="40" cy="44" r="6" fill="#222"/>
        <rect x="22" y="14" width="16" height="8" rx="2" fill="#fef08a" stroke="#222" stroke-width="2"/>
        <circle cx="58" cy="30" r="3" fill="#e63946"/>
      </svg>
      <span class="placeholder-tag">Add photo in assets/memories/ 📸</span>
    </div>
  `;

  // Video doodle placeholder SVG for missing video files
  const videoPlaceholderSVG = `
    <div class="polaroid-placeholder">
      <svg viewBox="0 0 80 80" width="60" height="60">
        <rect x="10" y="20" width="60" height="46" rx="6" fill="#fffdf8" stroke="#222" stroke-width="2.5"/>
        <polygon points="34,32 54,43 34,54" fill="#e63946" stroke="#222" stroke-width="2" stroke-linejoin="round"/>
        <circle cx="20" cy="28" r="2.5" fill="#222"/>
        <circle cx="28" cy="28" r="2.5" fill="#222"/>
      </svg>
      <span class="placeholder-tag">Add video in assets/memories/ 🎬</span>
    </div>
  `;

  // Function to render all memories from the MEDIA array
  function renderMemoriesGallery() {
    const galleryContainer = document.getElementById('memories-gallery');
    if (!galleryContainer) return;

    // Clear existing contents to support dynamic re-renders
    galleryContainer.innerHTML = '';

    MEDIA.forEach((item, index) => {
      const card = document.createElement('div');
      const tiltClass = tiltClasses[index % tiltClasses.length];
      const tapeColor = tapeColors[index % tapeColors.length];

      card.className = `polaroid-card paper-texture ${tiltClass}`;
      card.setAttribute('data-index', index);

      let mediaHTML = '';
      if (item.type === 'video') {
        mediaHTML = `
          <div class="polaroid-media-wrap video-wrap">
            <video class="polaroid-video" preload="metadata" playsinline muted>
              <source src="${item.src}" type="video/mp4">
            </video>
            <div class="video-play-badge" title="Watch Video">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="#fff">
                <polygon points="8,5 19,12 8,19"/>
              </svg>
            </div>
            <div class="media-error-overlay hidden">${videoPlaceholderSVG}</div>
          </div>
        `;
      } else {
        mediaHTML = `
          <div class="polaroid-media-wrap">
            <img class="polaroid-img" src="${item.src}" alt="${item.caption || 'Scrapbook memory'}" loading="eager" decoding="async">
            <div class="media-error-overlay hidden">${doodlePlaceholderSVG}</div>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="tape-washi ${tapeColor} polaroid-tape"></div>
        ${mediaHTML}
        <div class="polaroid-footer">
          <p class="polaroid-caption">${item.caption || ''}</p>
        </div>
      `;

      // Handle missing files gracefully with retry
      const img = card.querySelector('img');
      const video = card.querySelector('video');
      const errorOverlay = card.querySelector('.media-error-overlay');

      if (img) {
        let retried = false;
        const onImgLoad = () => {
          img.style.display = 'block';
          if (errorOverlay) errorOverlay.classList.add('hidden');
        };
        const onImgError = () => {
          if (!retried) {
            retried = true;
            setTimeout(() => {
              img.src = `${item.src}?retry=${Date.now()}`;
            }, 300);
            return;
          }
          img.style.display = 'none';
          if (errorOverlay) errorOverlay.classList.remove('hidden');
        };

        if (img.complete && img.naturalWidth > 0) {
          onImgLoad();
        } else {
          img.addEventListener('load', onImgLoad);
          img.addEventListener('error', onImgError);
        }
      }

      if (video) {
        video.addEventListener('loadeddata', () => {
          video.style.display = 'block';
          if (errorOverlay) errorOverlay.classList.add('hidden');
        });
        video.addEventListener('error', () => {
          // If video format issue in card preview, keep play badge so lightbox can still open
          const badge = card.querySelector('.video-play-badge');
          if (badge) badge.style.display = 'flex';
        });
      }

      // Lightbox click trigger
      card.addEventListener('click', () => {
        openLightbox(index);
      });

      galleryContainer.appendChild(card);
    });
  }

  // Lightbox Modal Controls
  function openLightbox(index) {
    if (index < 0) index = MEDIA.length - 1;
    if (index >= MEDIA.length) index = 0;
    currentLightboxIndex = index;
    const item = MEDIA[currentLightboxIndex];

    const lightboxModal = document.getElementById('memories-lightbox');
    const lightboxContent = document.getElementById('lightbox-media-container');
    const lightboxCaption = document.getElementById('lightbox-caption');

    if (!lightboxModal || !lightboxContent) return;

    // Pause and clean up any previous video
    const prevVid = lightboxContent.querySelector('video');
    if (prevVid) {
      prevVid.pause();
      prevVid.src = '';
    }
    lightboxContent.innerHTML = '';

    if (item.type === 'video') {
      const vid = document.createElement('video');
      vid.controls = true;
      vid.autoplay = true;
      vid.playsInline = true;
      vid.preload = 'auto';
      vid.className = 'lightbox-media-video';

      const source = document.createElement('source');
      source.src = item.src;
      source.type = 'video/mp4';
      vid.appendChild(source);

      vid.addEventListener('error', () => {
        lightboxContent.innerHTML = `
          <div style="padding: 2rem; color: #fff; text-align: center;">
            <p style="font-size: 1.2rem; margin-bottom: 0.5rem;">🎬 Video playback error</p>
            <p style="font-size: 0.9rem; opacity: 0.8;">Unable to play ${item.src}</p>
          </div>
        `;
      });

      lightboxContent.appendChild(vid);
      vid.load();
      vid.play().catch(() => {
        // Autoplay may be blocked by browser policy without user gesture
      });
    } else {
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.caption || 'Memory';
      img.className = 'lightbox-media-img';

      img.addEventListener('error', () => {
        lightboxContent.innerHTML = `
          <div style="padding: 2rem; color: #fff; text-align: center;">
            <p style="font-size: 1.2rem; margin-bottom: 0.5rem;">📸 Image not found</p>
            <p style="font-size: 0.9rem; opacity: 0.8;">Check if ${item.src} exists.</p>
          </div>
        `;
      });

      lightboxContent.appendChild(img);
    }

    if (lightboxCaption) {
      lightboxCaption.innerHTML = `<span>${item.caption || ''}</span> <span style="display:block; font-size: 0.95rem; opacity: 0.55; margin-top: 0.3rem;">(${currentLightboxIndex + 1} of ${MEDIA.length})</span>`;
    }

    lightboxModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function nextLightbox() {
    openLightbox((currentLightboxIndex + 1) % MEDIA.length);
  }

  function prevLightbox() {
    openLightbox((currentLightboxIndex - 1 + MEDIA.length) % MEDIA.length);
  }

  function closeLightbox() {
    const lightboxModal = document.getElementById('memories-lightbox');
    const lightboxContent = document.getElementById('lightbox-media-container');

    if (!lightboxModal) return;
    lightboxModal.classList.add('hidden');
    if (lightboxContent) {
      const vid = lightboxContent.querySelector('video');
      if (vid) {
        vid.pause();
        vid.src = '';
        vid.load();
      }
      lightboxContent.innerHTML = '';
    }
    document.body.style.overflow = '';
  }

  // Initialize on page load
  document.addEventListener('DOMContentLoaded', () => {
    renderMemoriesGallery();

    const lightboxModal = document.getElementById('memories-lightbox');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }
    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        prevLightbox();
      });
    }
    if (lightboxNext) {
      lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        nextLightbox();
      });
    }

    if (lightboxModal) {
      lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
          closeLightbox();
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (!lightboxModal || lightboxModal.classList.contains('hidden')) return;

      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        nextLightbox();
      } else if (e.key === 'ArrowLeft') {
        prevLightbox();
      }
    });
  });

  // Expose render function and lightbox for live updates
  window.renderMemoriesGallery = renderMemoriesGallery;
  window.openLightbox = openLightbox;
  window.closeLightbox = closeLightbox;

})();
