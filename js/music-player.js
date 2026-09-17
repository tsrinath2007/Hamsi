/**
 * NATIVE HTML5 MUSIC PLAYER CONTROLLER
 * Full custom in-website audio player with zero external redirects.
 * Supports locally hosted MP3s in assets/music/ with seamless
 * fallback to Web Audio API ambient acoustic chords and "Add your soundtrack 🎧" banner.
 */

(function () {
  'use strict';

  // 1. Tracks Registry (Local files)
  const TRACKS = [
    {
      id: 'gaali',
      title: 'Gaali Vaaluga',
      movie: 'Agnyaathavaasi',
      artist: 'Anirudh Ravichander',
      file: 'assets/music/gaali-vaaluga.mp3',
      defaultDuration: 222, // 3:42
      frequencies: [293.66, 369.99, 440.00, 587.33, 493.88], // D Major acoustic vibe
      vibe: 'Pure Anirudh Magic 🍃'
    },
    {
      id: 'aayasher',
      title: 'Aaya Sher',
      movie: 'The Paradise',
      artist: 'Anirudh Ravichander',
      file: 'assets/music/aaya-sher.mp3',
      defaultDuration: 289, // 4:49
      frequencies: [220.00, 293.66, 369.99, 440.00, 587.33], // Lion roar energetic vibe
      vibe: 'Pure Anirudh Addiction 🔥'
    },
    {
      id: 'pilla',
      title: 'Pilla',
      movie: 'Agnyaathavaasi',
      artist: 'Anirudh Ravichander',
      file: 'assets/music/pilla.mp3',
      defaultDuration: 214, // 3:34
      frequencies: [261.63, 329.63, 392.00, 523.25, 440.00], // C Major carefree vibe
      vibe: 'Carefree & Vibing ✨'
    },
    {
      id: 'kadalalle',
      title: 'Kadalalle',
      movie: 'Dear Comrade',
      artist: 'Justin Prabhakaran • Sid Sriram',
      file: 'assets/music/kadalalle.mp3',
      defaultDuration: 260, // 4:20
      frequencies: [220.00, 261.63, 329.63, 392.00, 440.00], // A Minor soulful vibe
      vibe: 'Deep & Pure Soul 🌊'
    },
    {
      id: 'priyathama',
      title: 'Priyathama Priyathama',
      movie: 'Majili',
      artist: 'Gopi Sundar • Chinmayi Sripaada',
      file: 'assets/music/priyathama.mp3',
      defaultDuration: 245, // 4:05
      frequencies: [246.94, 293.66, 369.99, 440.00, 493.88], // B Minor nostalgia
      vibe: 'Pure Emotional Nostalgia 🥹'
    },
    {
      id: 'inkem',
      title: 'Inkem Inkem Inkem Kaavaale',
      movie: 'Geetha Govindam',
      artist: 'Gopi Sundar • Sid Sriram',
      file: 'assets/music/inkem-inkem.mp3',
      defaultDuration: 267, // 4:27
      frequencies: [329.63, 392.00, 440.00, 493.88, 587.33], // E Minor romantic gratitude
      vibe: 'Endless Gratitude ❤️'
    },
    {
      id: 'ohmybaby',
      title: 'Oh My Baby',
      movie: 'Guntur Kaaram',
      artist: 'Thaman S • Shilpa Rao',
      file: 'assets/music/oh-my-baby.mp3',
      defaultDuration: 188, // 3:08
      frequencies: [261.63, 293.66, 329.63, 392.00, 440.00], // Pentatonic bounce
      vibe: 'Catchy & Addictive 🎧'
    }
  ];

  let currentTrackIndex = 0;
  let isPlaying = false;
  let volume = 0.8;
  let playbackMode = 'uninitialized'; // 'local' | 'fallback'

  // Web Audio Context for graceful fallback ambient acoustic melody
  let audioCtx = null;
  let synthInterval = null;
  let fallbackTimerInterval = null;
  let fallbackCurrentTime = 0;

  // DOM Elements
  const audioPlayer = document.getElementById('audioPlayer');
  const toastEl = document.getElementById('soundtrack-status-toast');
  const toastTitle = document.getElementById('toast-title');
  const toastDesc = document.getElementById('toast-desc');

  // Opening Player
  const openingTrackTitle = document.getElementById('opening-track-title');
  const openingTrackMovie = document.getElementById('opening-track-movie');
  const openingVinyl = document.getElementById('opening-vinyl');
  const btnPlayPause = document.getElementById('btn-play-pause');
  const playIcon = btnPlayPause ? btnPlayPause.querySelector('.play-icon') : null;
  const pauseIcon = btnPlayPause ? btnPlayPause.querySelector('.pause-icon') : null;
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const currentTimeEl = document.getElementById('current-time');
  const totalTimeEl = document.getElementById('total-time');
  const progressFill = document.getElementById('progress-fill');
  const progressKnob = document.getElementById('progress-knob');
  const progressBarContainer = document.getElementById('progress-bar-container');
  const volumeSlider = document.getElementById('volume-slider');
  const playerBadge = document.getElementById('player-badge');
  const audioModeHint = document.getElementById('audio-mode-hint');

  // Persistent Bottom Mini-Player
  const miniSongName = document.getElementById('mini-song-name');
  const miniArtistMovie = document.getElementById('mini-artist-movie');
  const miniSpinningCd = document.getElementById('mini-spinning-cd');
  const miniBtnPlay = document.getElementById('mini-btn-play');
  const miniPlayIcon = miniBtnPlay ? miniBtnPlay.querySelector('.mini-play-icon') : null;
  const miniPauseIcon = miniBtnPlay ? miniBtnPlay.querySelector('.mini-pause-icon') : null;
  const miniBtnPrev = document.getElementById('mini-btn-prev');
  const miniBtnNext = document.getElementById('mini-btn-next');
  const miniProgressBar = document.getElementById('mini-progress-bar');
  const miniProgressFill = document.getElementById('mini-progress-fill');
  const miniCurrentTimeEl = document.getElementById('mini-current-time');
  const miniTotalTimeEl = document.getElementById('mini-total-time');
  const miniTagText = document.getElementById('mini-tag-text');

  // Song Cards
  const songCards = document.querySelectorAll('.song-card');

  // Time format helper
  function formatTime(sec) {
    if (isNaN(sec) || sec < 0) sec = 0;
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  // Show Toast Status Message
  let toastTimeout = null;
  function showToast(title, desc) {
    if (!toastEl) return;
    if (toastTitle) toastTitle.textContent = title;
    if (toastDesc) toastDesc.textContent = desc;
    toastEl.classList.remove('hidden');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastEl.classList.add('hidden');
    }, 5500);
  }

  // Web Audio Synth for Ambient Acoustic Lo-Fi Chords
  function initAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playAcousticPluck(freq, duration = 1.3) {
    if (!audioCtx || volume <= 0) return;
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.14 * volume, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      // Ignore audio glitches
    }
  }

  let noteSequenceIdx = 0;
  function startAmbientSynthLoop() {
    stopAmbientSynthLoop();
    initAudioContext();
    const track = TRACKS[currentTrackIndex];
    const freqs = track.frequencies || [261.63, 329.63, 392.00, 523.25];

    synthInterval = setInterval(() => {
      if (!isPlaying || playbackMode !== 'fallback') return;
      const f = freqs[noteSequenceIdx % freqs.length];
      playAcousticPluck(f, 1.4);
      noteSequenceIdx++;

      // Animated music note floating around vinyl
      if (Math.random() > 0.4 && window.emitMusicNote) {
        window.emitMusicNote(openingVinyl || miniSpinningCd);
      }
    }, 700);

    // Fallback timer simulation
    if (fallbackTimerInterval) clearInterval(fallbackTimerInterval);
    fallbackTimerInterval = setInterval(() => {
      if (!isPlaying || playbackMode !== 'fallback') return;
      fallbackCurrentTime += 1;
      const totalDur = track.defaultDuration;
      if (fallbackCurrentTime >= totalDur) {
        fallbackCurrentTime = 0;
        nextTrack();
      } else {
        updateProgressDisplay(fallbackCurrentTime, totalDur);
      }
    }, 1000);
  }

  function stopAmbientSynthLoop() {
    if (synthInterval) {
      clearInterval(synthInterval);
      synthInterval = null;
    }
    if (fallbackTimerInterval) {
      clearInterval(fallbackTimerInterval);
      fallbackTimerInterval = null;
    }
  }

  // Load Track into HTML5 Audio
  function loadTrack(index) {
    if (index < 0) index = TRACKS.length - 1;
    if (index >= TRACKS.length) index = 0;
    currentTrackIndex = index;
    const track = TRACKS[currentTrackIndex];

    stopAmbientSynthLoop();
    fallbackCurrentTime = 0;
    noteSequenceIdx = 0;

    if (audioPlayer) {
      audioPlayer.src = track.file;
      audioPlayer.volume = volume;
      audioPlayer.load();
    }

    updateUI();
  }

  // Start Playback
  function play() {
    initAudioContext();
    const track = TRACKS[currentTrackIndex];

    if (!audioPlayer.src || audioPlayer.src.endsWith('#') || !audioPlayer.src.includes(track.file)) {
      audioPlayer.src = track.file;
      audioPlayer.volume = volume;
    }

    const playPromise = audioPlayer.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          playbackMode = 'local';
          isPlaying = true;
          if (miniTagText) miniTagText.textContent = 'LOCAL AUDIO 🎧';
          if (audioModeHint) audioModeHint.innerHTML = `<span>🎧 Playing local track • <strong>${track.title}</strong></span>`;
          updateUI();
        })
        .catch((err) => {
          // File not found or autoplay restrictions: gracefully fall back to ambient melody
          playbackMode = 'fallback';
          isPlaying = true;
          if (miniTagText) miniTagText.textContent = 'AMBIENT MELODY ✨';
          if (audioModeHint) audioModeHint.innerHTML = `<span>✨ Ambient melody playing • Drop MP3s in <code>assets/music/</code></span>`;
          showToast('Add your soundtrack 🎧', `Place ${track.title}.mp3 in assets/music/ or enjoy our ambient melody!`);
          startAmbientSynthLoop();
          updateUI();
        });
    } else {
      isPlaying = true;
      updateUI();
    }
  }

  // Pause Playback
  function pause() {
    isPlaying = false;
    if (audioPlayer) audioPlayer.pause();
    stopAmbientSynthLoop();
    updateUI();
  }

  function togglePlay() {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }

  function nextTrack() {
    const nextIdx = (currentTrackIndex + 1) % TRACKS.length; // Loops back to 0 automatically
    selectTrack(nextIdx, true);
  }

  function prevTrack() {
    const prevIdx = (currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
    selectTrack(prevIdx, true);
  }

  function selectTrack(index, autoPlay = true) {
    loadTrack(index);
    if (autoPlay) {
      play();
      if (window.emitMusicNote) {
        window.emitMusicNote(openingVinyl || miniSpinningCd);
      }
    } else {
      updateUI();
    }
  }

  // Update UI Elements
  function updateUI() {
    const track = TRACKS[currentTrackIndex];

    // Titles and Meta
    if (openingTrackTitle) openingTrackTitle.textContent = track.title;
    if (openingTrackMovie) openingTrackMovie.textContent = `${track.movie} • ${track.artist}`;
    if (miniSongName) miniSongName.textContent = track.title;
    if (miniArtistMovie) miniArtistMovie.textContent = `${track.movie} • ${track.artist}`;

    // Badges
    if (playerBadge) {
      playerBadge.textContent = isPlaying 
        ? (playbackMode === 'local' ? 'PLAYING 🎧' : 'AMBIENT MODE 🎵') 
        : 'PAUSED';
    }

    // Play/Pause Icons
    if (isPlaying) {
      if (playIcon) playIcon.classList.add('hidden');
      if (pauseIcon) pauseIcon.classList.remove('hidden');
      if (miniPlayIcon) miniPlayIcon.classList.add('hidden');
      if (miniPauseIcon) miniPauseIcon.classList.remove('hidden');
      if (openingVinyl) openingVinyl.classList.add('spinning');
      if (miniSpinningCd) miniSpinningCd.classList.add('spinning');
    } else {
      if (playIcon) playIcon.classList.remove('hidden');
      if (pauseIcon) pauseIcon.classList.add('hidden');
      if (miniPlayIcon) miniPlayIcon.classList.remove('hidden');
      if (miniPauseIcon) miniPauseIcon.classList.add('hidden');
      if (openingVinyl) openingVinyl.classList.remove('spinning');
      if (miniSpinningCd) miniSpinningCd.classList.remove('spinning');
    }

    // Active Card State
    const currentTrack = TRACKS[currentTrackIndex];
    const currentCards = document.querySelectorAll('.song-card');
    currentCards.forEach((card, idx) => {
      const cardSongId = card.dataset.songId;
      const isCurrent = cardSongId ? (cardSongId === currentTrack.id) : (idx === currentTrackIndex);
      if (isCurrent) {
        card.classList.add('active-song');
        const playBtnSpan = card.querySelector('.card-play-btn span');
        if (playBtnSpan) {
          playBtnSpan.textContent = isPlaying ? 'Playing...' : 'Paused';
        }
        const eqBars = card.querySelector('.equalizer-bars');
        if (eqBars) {
          eqBars.classList.toggle('animating', isPlaying);
        }
      } else {
        card.classList.remove('active-song');
        const playBtnSpan = card.querySelector('.card-play-btn span');
        if (playBtnSpan) playBtnSpan.textContent = 'Play Track';
        const eqBars = card.querySelector('.equalizer-bars');
        if (eqBars) eqBars.classList.remove('animating');
      }
    });

    // Durations
    const dur = (audioPlayer && audioPlayer.duration && !isNaN(audioPlayer.duration))
      ? audioPlayer.duration
      : track.defaultDuration;
    const cur = (audioPlayer && !isNaN(audioPlayer.currentTime) && playbackMode === 'local')
      ? audioPlayer.currentTime
      : fallbackCurrentTime;

    updateProgressDisplay(cur, dur);
  }

  function updateProgressDisplay(curr, dur) {
    if (currentTimeEl) currentTimeEl.textContent = formatTime(curr);
    if (totalTimeEl) totalTimeEl.textContent = formatTime(dur);
    if (miniCurrentTimeEl) miniCurrentTimeEl.textContent = formatTime(curr);
    if (miniTotalTimeEl) miniTotalTimeEl.textContent = formatTime(dur);

    const pct = Math.min(100, (curr / dur) * 100);
    if (progressFill) progressFill.style.width = `${pct}%`;
    if (progressKnob) progressKnob.style.left = `${pct}%`;
    if (miniProgressFill) miniProgressFill.style.width = `${pct}%`;
  }

  // HTML5 Audio Event Listeners
  if (audioPlayer) {
    audioPlayer.addEventListener('timeupdate', () => {
      if (playbackMode === 'local') {
        updateProgressDisplay(audioPlayer.currentTime, audioPlayer.duration || TRACKS[currentTrackIndex].defaultDuration);
      }
    });

    audioPlayer.addEventListener('loadedmetadata', () => {
      if (playbackMode === 'local') {
        updateProgressDisplay(audioPlayer.currentTime, audioPlayer.duration);
      }
    });

    audioPlayer.addEventListener('ended', () => {
      // Loop automatically to next song; loops back to first track after last track
      nextTrack();
    });

    audioPlayer.addEventListener('error', (e) => {
      // If MP3 file is not found, gracefully fall back
      if (playbackMode !== 'fallback' && isPlaying) {
        playbackMode = 'fallback';
        startAmbientSynthLoop();
        showToast('Add your soundtrack 🎧', `Place your MP3 files in assets/music/ or enjoy our ambient melody!`);
        updateUI();
      }
    });
  }

  // Bind Buttons
  if (btnPlayPause) btnPlayPause.addEventListener('click', togglePlay);
  if (miniBtnPlay) miniBtnPlay.addEventListener('click', togglePlay);
  if (btnPrev) btnPrev.addEventListener('click', prevTrack);
  if (miniBtnPrev) miniBtnPrev.addEventListener('click', prevTrack);
  if (btnNext) btnNext.addEventListener('click', nextTrack);
  if (miniBtnNext) miniBtnNext.addEventListener('click', nextTrack);

  // Volume Slider
  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      volume = parseFloat(e.target.value);
      if (audioPlayer) audioPlayer.volume = volume;
    });
  }

  // Seeking on Progress Bar
  function handleSeek(container, e) {
    const rect = container.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const track = TRACKS[currentTrackIndex];
    const dur = (audioPlayer && audioPlayer.duration && !isNaN(audioPlayer.duration) && playbackMode === 'local')
      ? audioPlayer.duration
      : track.defaultDuration;
    const targetTime = ratio * dur;

    if (playbackMode === 'local' && audioPlayer) {
      audioPlayer.currentTime = targetTime;
    } else {
      fallbackCurrentTime = Math.floor(targetTime);
    }
    updateProgressDisplay(targetTime, dur);
  }

  if (progressBarContainer) {
    progressBarContainer.addEventListener('click', (e) => handleSeek(progressBarContainer, e));
  }
  if (miniProgressBar) {
    miniProgressBar.addEventListener('click', (e) => handleSeek(miniProgressBar, e));
  }

  // Song Cards Click
  const allSongCards = document.querySelectorAll('.song-card');
  allSongCards.forEach((card, index) => {
    function handleCardActivation() {
      const cardSongId = card.dataset.songId;
      let targetIdx = index;
      if (cardSongId) {
        const found = TRACKS.findIndex(t => t.id === cardSongId);
        if (found !== -1) targetIdx = found;
      }
      if (currentTrackIndex === targetIdx && isPlaying) {
        pause();
      } else {
        selectTrack(targetIdx, true);
      }
    }

    card.addEventListener('click', handleCardActivation);

    const cardPlayBtn = card.querySelector('.card-play-btn');
    if (cardPlayBtn) {
      cardPlayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleCardActivation();
      });
    }
  });

  // Initial setup: load track 0 (Gaali Vaaluga)
  loadTrack(0);

  // Expose global controller
  window.musicController = {
    play,
    pause,
    togglePlay,
    selectTrack,
    nextTrack,
    prevTrack,
    TRACKS
  };

})();
