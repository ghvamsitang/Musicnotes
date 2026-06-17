// Note Hero - Core Logic & Sound Engine

let VF = null;

// Audio Synthesizer using Web Audio API
class AudioSynth {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    playNote(noteName, octave) {
        if (!this.enabled) return;
        try {
            this.init();
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }

            const freq = this.getFrequency(noteName, octave);
            if (!freq) return;

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.type = 'triangle'; // Warm woodwind-like timbre
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

            const now = this.ctx.currentTime;
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

            osc.start(now);
            osc.stop(now + 0.8);
        } catch (e) {
            console.warn("Audio playback failed (user interaction may be required):", e);
        }
    }

    playSuccess() {
        if (!this.enabled) return;
        try {
            this.init();
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }

            const now = this.ctx.currentTime;
            // Short, uplifting C-major chime arpeggio
            const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5
            freqs.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + idx * 0.08);
                
                gain.gain.setValueAtTime(0.12, now + idx * 0.08);
                gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
                
                osc.start(now + idx * 0.08);
                osc.stop(now + idx * 0.08 + 0.25);
            });
        } catch (e) {
            console.warn("Success audio playback failed:", e);
        }
    }

    playFailure() {
        if (!this.enabled) return;
        try {
            this.init();
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }

            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(120, now);
            osc.frequency.linearRampToValueAtTime(85, now + 0.3);
            
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.linearRampToValueAtTime(0.001, now + 0.3);
            
            osc.start(now);
            osc.stop(now + 0.3);
        } catch (e) {
            console.warn("Failure audio playback failed:", e);
        }
    }

    getFrequency(note, octave) {
        const notesMap = {
            'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4,
            'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9,
            'A#': 10, 'Bb': 10, 'B': 11
        };
        const keyNumber = notesMap[note];
        if (keyNumber === undefined) return null;
        
        const midi = 12 * (octave + 1) + keyNumber;
        return 440 * Math.pow(2, (midi - 69) / 12);
    }
}

// Musically accurate note ranges for different difficulty settings
const NOTE_RANGES = {
    easy: {
        treble: [
            { name: 'E', octave: 4 },
            { name: 'F', octave: 4 },
            { name: 'G', octave: 4 },
            { name: 'A', octave: 4 },
            { name: 'B', octave: 4 },
            { name: 'C', octave: 5 },
            { name: 'D', octave: 5 },
            { name: 'E', octave: 5 },
            { name: 'F', octave: 5 }
        ],
        bass: [
            { name: 'G', octave: 2 },
            { name: 'A', octave: 2 },
            { name: 'B', octave: 2 },
            { name: 'C', octave: 3 },
            { name: 'D', octave: 3 },
            { name: 'E', octave: 3 },
            { name: 'F', octave: 3 },
            { name: 'G', octave: 3 },
            { name: 'A', octave: 3 }
        ],
        guitar: [
            { name: 'E', octave: 2 }, { name: 'F', octave: 2 }, { name: 'G', octave: 2 },
            { name: 'A', octave: 2 }, { name: 'B', octave: 2 },
            { name: 'C', octave: 3 }, { name: 'D', octave: 3 }, { name: 'E', octave: 3 },
            { name: 'F', octave: 3 }, { name: 'G', octave: 3 }, { name: 'A', octave: 3 },
            { name: 'B', octave: 3 },
            { name: 'C', octave: 4 }, { name: 'D', octave: 4 }, { name: 'E', octave: 4 },
            { name: 'F', octave: 4 }, { name: 'G', octave: 4 }, { name: 'A', octave: 4 },
        ]
    },
    medium: {
        treble: [
            { name: 'C', octave: 4 },
            { name: 'D', octave: 4 },
            { name: 'E', octave: 4 },
            { name: 'F', octave: 4 },
            { name: 'F#', octave: 4 },
            { name: 'G', octave: 4 },
            { name: 'A', octave: 4 },
            { name: 'Bb', octave: 4 },
            { name: 'B', octave: 4 },
            { name: 'C', octave: 5 },
            { name: 'C#', octave: 5 },
            { name: 'D', octave: 5 },
            { name: 'Eb', octave: 5 },
            { name: 'E', octave: 5 },
            { name: 'F', octave: 5 },
            { name: 'G', octave: 5 },
            { name: 'A', octave: 5 }
        ],
        bass: [
            { name: 'E', octave: 2 },
            { name: 'F', octave: 2 },
            { name: 'G', octave: 2 },
            { name: 'A', octave: 2 },
            { name: 'Bb', octave: 2 },
            { name: 'B', octave: 2 },
            { name: 'C', octave: 3 },
            { name: 'C#', octave: 3 },
            { name: 'D', octave: 3 },
            { name: 'Eb', octave: 3 },
            { name: 'E', octave: 3 },
            { name: 'F', octave: 3 },
            { name: 'F#', octave: 3 },
            { name: 'G', octave: 3 },
            { name: 'A', octave: 3 },
            { name: 'B', octave: 3 },
            { name: 'C', octave: 4 }
        ],
        guitar: [
            { name: 'E', octave: 2 }, { name: 'F', octave: 2 }, { name: 'F#', octave: 2 },
            { name: 'G', octave: 2 }, { name: 'G#', octave: 2 },
            { name: 'A', octave: 2 }, { name: 'A#', octave: 2 }, { name: 'B', octave: 2 },
            { name: 'C', octave: 3 }, { name: 'C#', octave: 3 }, { name: 'D', octave: 3 },
            { name: 'D#', octave: 3 }, { name: 'E', octave: 3 }, { name: 'F', octave: 3 },
            { name: 'F#', octave: 3 }, { name: 'G', octave: 3 }, { name: 'G#', octave: 3 },
            { name: 'A', octave: 3 }, { name: 'A#', octave: 3 }, { name: 'B', octave: 3 },
            { name: 'C', octave: 4 }, { name: 'C#', octave: 4 }, { name: 'D', octave: 4 },
            { name: 'D#', octave: 4 }, { name: 'E', octave: 4 }, { name: 'F', octave: 4 },
            { name: 'F#', octave: 4 }, { name: 'G', octave: 4 }, { name: 'G#', octave: 4 },
            { name: 'A', octave: 4 }, { name: 'A#', octave: 4 }, { name: 'B', octave: 4 },
            { name: 'C', octave: 5 },
        ]
    },
    hard: {
        treble: [
            { name: 'A', octave: 3 },
            { name: 'Bb', octave: 3 },
            { name: 'B', octave: 3 },
            { name: 'C', octave: 4 },
            { name: 'C#', octave: 4 },
            { name: 'D', octave: 4 },
            { name: 'Eb', octave: 4 },
            { name: 'E', octave: 4 },
            { name: 'F', octave: 4 },
            { name: 'F#', octave: 4 },
            { name: 'G', octave: 4 },
            { name: 'G#', octave: 4 },
            { name: 'A', octave: 4 },
            { name: 'Bb', octave: 4 },
            { name: 'B', octave: 4 },
            { name: 'C', octave: 5 },
            { name: 'C#', octave: 5 },
            { name: 'D', octave: 5 },
            { name: 'Eb', octave: 5 },
            { name: 'E', octave: 5 },
            { name: 'F', octave: 5 },
            { name: 'F#', octave: 5 },
            { name: 'G', octave: 5 },
            { name: 'G#', octave: 5 },
            { name: 'A', octave: 5 },
            { name: 'Bb', octave: 5 },
            { name: 'B', octave: 5 },
            { name: 'C', octave: 6 },
            { name: 'C#', octave: 6 },
            { name: 'D', octave: 6 },
            { name: 'E', octave: 6 }
        ],
        bass: [
            { name: 'C', octave: 2 },
            { name: 'C#', octave: 2 },
            { name: 'D', octave: 2 },
            { name: 'Eb', octave: 2 },
            { name: 'E', octave: 2 },
            { name: 'F', octave: 2 },
            { name: 'F#', octave: 2 },
            { name: 'G', octave: 2 },
            { name: 'A', octave: 2 },
            { name: 'Bb', octave: 2 },
            { name: 'B', octave: 2 },
            { name: 'C', octave: 3 },
            { name: 'C#', octave: 3 },
            { name: 'D', octave: 3 },
            { name: 'Eb', octave: 3 },
            { name: 'E', octave: 3 },
            { name: 'F', octave: 3 },
            { name: 'F#', octave: 3 },
            { name: 'G', octave: 3 },
            { name: 'G#', octave: 3 },
            { name: 'A', octave: 3 },
            { name: 'Bb', octave: 3 },
            { name: 'B', octave: 3 },
            { name: 'C', octave: 4 },
            { name: 'C#', octave: 4 },
            { name: 'D', octave: 4 },
            { name: 'Eb', octave: 4 },
            { name: 'E', octave: 4 },
            { name: 'F', octave: 4 },
            { name: 'G', octave: 4 }
        ],
        guitar: [
            { name: 'E', octave: 2 },
            { name: 'F', octave: 2 }, { name: 'F#', octave: 2 }, { name: 'G', octave: 2 },
            { name: 'G#', octave: 2 }, { name: 'A', octave: 2 }, { name: 'A#', octave: 2 },
            { name: 'B', octave: 2 },
            { name: 'C', octave: 3 }, { name: 'C#', octave: 3 }, { name: 'D', octave: 3 },
            { name: 'D#', octave: 3 }, { name: 'E', octave: 3 }, { name: 'F', octave: 3 },
            { name: 'F#', octave: 3 }, { name: 'G', octave: 3 }, { name: 'G#', octave: 3 },
            { name: 'A', octave: 3 }, { name: 'A#', octave: 3 }, { name: 'B', octave: 3 },
            { name: 'C', octave: 4 }, { name: 'C#', octave: 4 }, { name: 'D', octave: 4 },
            { name: 'D#', octave: 4 }, { name: 'E', octave: 4 }, { name: 'F', octave: 4 },
            { name: 'F#', octave: 4 }, { name: 'G', octave: 4 }, { name: 'G#', octave: 4 },
            { name: 'A', octave: 4 }, { name: 'A#', octave: 4 }, { name: 'B', octave: 4 },
            { name: 'C', octave: 5 }, { name: 'C#', octave: 5 }, { name: 'D', octave: 5 },
            { name: 'D#', octave: 5 }, { name: 'E', octave: 5 },
        ]
    }
};

// Guitar fretboard constants
// Strings ordered from low E (top, thickest) to high e (bottom, thinnest)
// This matches the standard "looking from above" view of a guitar fretboard
const GUITAR_STRINGS = [
    { label: 'E', name: 'E', octave: 2 },
    { label: 'A', name: 'A', octave: 2 },
    { label: 'D', name: 'D', octave: 3 },
    { label: 'G', name: 'G', octave: 3 },
    { label: 'B', name: 'B', octave: 3 },
    { label: 'e', name: 'E', octave: 4 },
];

const NOTE_SEMITONES = { 'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11 };

function noteToMidi(name, octave) {
    return NOTE_SEMITONES[name] + (octave + 1) * 12;
}

function findFretPosition(noteName, octave) {
    const targetMidi = noteToMidi(noteName, octave);
    let best = null;
    for (let s = 0; s < GUITAR_STRINGS.length; s++) {
        const str = GUITAR_STRINGS[s];
        const openMidi = noteToMidi(str.name, str.octave);
        const fret = targetMidi - openMidi;
        if (fret >= 0 && fret <= 12) {
            if (!best || fret < best.fret) {
                best = { stringIndex: s, fret, label: str.label };
            }
        }
    }
    return best;
}

class MusicQuiz {
    constructor() {
        // DOM Elements
        this.container = document.getElementById('staff-container');
        this.scoreElement = document.getElementById('score');
        this.streakElement = document.getElementById('streak');
        this.feedbackElement = document.getElementById('feedback');
        
        this.startBtn = document.getElementById('start-btn');
        this.startScreen = document.getElementById('start-screen');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.goScoreElement = document.getElementById('go-score');
        this.goAccuracyElement = document.getElementById('go-accuracy');
        this.restartBtn = document.getElementById('restart-btn');
        this.loadingIndicator = document.getElementById('loading-indicator');
        
        this.timerBarContainer = document.getElementById('timer-bar-container');
        this.timerBar = document.getElementById('timer-bar');
        this.streakContainer = document.getElementById('streak-container');
        this.timerTextContainer = document.getElementById('timer-text-container');
        this.timerTextElement = document.getElementById('timer-text');
        
        this.clefSelector = document.getElementById('clef-selector');
        this.difficultySelector = document.getElementById('difficulty-selector');
        this.modeSelector = document.getElementById('mode-selector');
        this.durationSelector = document.getElementById('duration-selector');
        this.audioToggle = document.getElementById('audio-toggle');
        
        this.statHighscore = document.getElementById('stat-highscore');
        this.statAccuracy = document.getElementById('stat-accuracy');
        this.statTotal = document.getElementById('stat-total');
        this.resetBtn = document.getElementById('reset-game');
        
        this.noteButtons = document.querySelectorAll('.note-btn');
        this.accidentalButtons = document.querySelectorAll('.accidental-btn');
        this.userInput = document.getElementById('user-input');
        this.selectedAccidental = '';

        // Audio synth setup
        this.synth = new AudioSynth();

        // Load scores and restore last active user
        this.userScores = this.loadScores();
        this.currentUser = localStorage.getItem('noteHeroLastUser') || '';

        if (this.currentUser && this.userScores[this.currentUser]) {
            const profile = this.userScores[this.currentUser];
            this.clef = profile.clef || 'treble';
            this.difficulty = profile.difficulty || 'easy';
            this.mode = profile.mode || 'practice';
            this.timeLimit = profile.timeLimit || 60;
            this.audioEnabled = profile.audioEnabled !== undefined ? profile.audioEnabled : true;
            this.userInput.value = this.currentUser;
        } else {
            this.clef = 'treble';
            this.difficulty = 'easy';
            this.mode = 'practice';
            this.timeLimit = 60;
            this.audioEnabled = true;
            this.currentUser = '';
        }
        this.synth.enabled = this.audioEnabled;

        this.score = 0;
        this.streak = 0;
        this.currentNote = null;
        this.activeQuestionClef = 'treble';
        this.canAnswer = false;
        
        // Time Attack Timer Variables
        this.timer = null;
        this.timeLeft = 60;
        this.gameActive = false;
        
        // Session statistics
        this.sessionCorrect = 0;
        this.sessionTotal = 0;

        if (window.Vex) {
            VF = Vex.Flow;
            if (this.loadingIndicator) {
                this.loadingIndicator.style.display = 'none';
            }
            this.init();
        } else {
            console.error("VexFlow not loaded");
            if (this.loadingIndicator) {
                this.loadingIndicator.textContent = "Error: Music engine failed to load.";
            }
            this.feedbackElement.textContent = "Error: Music engine not loaded.";
            this.feedbackElement.className = 'feedback-text visible error';
        }
    }

    init() {
        this.setupEventListeners();
        this.updateSettingsUI();
        this.updateStatsUI();
        this.showStartScreen();
    }

    setupEventListeners() {
        // Note button clicks
        this.noteButtons.forEach(btn => {
            btn.addEventListener('click', () => this.handleAnswer(btn.dataset.note + this.selectedAccidental, btn));
        });

        // Accidental selector
        this.accidentalButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectedAccidental = btn.dataset.accidental;
                this.accidentalButtons.forEach(b => b.classList.toggle('active', b.dataset.accidental === this.selectedAccidental));
            });
        });

        // Clef selector segmented control
        this.clefSelector.addEventListener('click', (e) => {
            const btn = e.target.closest('.seg-btn');
            if (!btn) return;
            this.clef = btn.dataset.val;
            this.updateSettingsUI();
            this.saveScores();
            this.resetGame();
        });

        // Difficulty selector segmented control
        this.difficultySelector.addEventListener('click', (e) => {
            const btn = e.target.closest('.seg-btn');
            if (!btn) return;
            this.difficulty = btn.dataset.val;
            this.updateSettingsUI();
            this.saveScores();
            this.resetGame();
        });

        // Mode selector segmented control
        this.modeSelector.addEventListener('click', (e) => {
            const btn = e.target.closest('.seg-btn');
            if (!btn) return;
            this.mode = btn.dataset.val;
            this.updateSettingsUI();
            this.saveScores();
            this.resetGame();
        });

        // Duration selector segmented control
        this.durationSelector.addEventListener('click', (e) => {
            const btn = e.target.closest('.seg-btn');
            if (!btn) return;
            this.timeLimit = parseInt(btn.dataset.val);
            this.updateSettingsUI();
            this.saveScores();
            this.resetGame();
        });

        // Audio toggle
        this.audioToggle.addEventListener('click', () => {
            this.audioEnabled = !this.audioEnabled;
            this.synth.enabled = this.audioEnabled;
            this.updateSettingsUI();
            this.saveScores();
            
            // Warm auditory feedback when enabled
            if (this.audioEnabled) {
                this.synth.playNote('C', 4);
            }
        });

        // Reference guide toggle
        const guideToggleBtn = document.getElementById('guide-toggle-btn');
        const guideContent = document.getElementById('guide-content');
        if (guideToggleBtn && guideContent) {
            guideToggleBtn.addEventListener('click', () => {
                const isHidden = guideContent.classList.contains('hidden');
                guideContent.classList.toggle('hidden');
                guideToggleBtn.querySelector('.toggle-arrow').textContent = isHidden ? '▲' : '▼';
            });
        }

        // Reference guide tabs
        const tabBtns = document.querySelectorAll('.guide-tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const tabId = btn.dataset.tab;
                document.querySelectorAll('.guide-tab-content').forEach(content => {
                    content.classList.toggle('active', content.id === tabId);
                });
            });
        });

        // Start screen button
        this.startBtn.addEventListener('click', () => {
            this.startGame();
        });

        // Game over screen play again button
        this.restartBtn.addEventListener('click', () => {
            this.startGame();
        });

        // User initials input
        this.userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.setUser(this.userInput.value);
            }
        });
        this.userInput.addEventListener('blur', () => {
            if (this.userInput.value.trim().toUpperCase() !== this.currentUser) {
                this.setUser(this.userInput.value);
            }
        });

        // Reset stats button
        this.resetBtn.addEventListener('click', () => {
            if (!this.currentUser) return;
            if (confirm("Are you sure you want to reset all stats for the current user?")) {
                this.userScores[this.currentUser] = this.defaultProfile();
                this.userScores[this.currentUser].clef = this.clef;
                this.userScores[this.currentUser].difficulty = this.difficulty;
                this.userScores[this.currentUser].mode = this.mode;
                this.userScores[this.currentUser].audioEnabled = this.audioEnabled;
                this.saveScores();
                this.score = 0;
                this.streak = 0;
                this.sessionCorrect = 0;
                this.sessionTotal = 0;
                this.updateStatsUI();
                this.resetGame();
            }
        });

        // Keyboard Shortcuts
        document.addEventListener('keydown', (e) => {
            if (!this.canAnswer || !this.gameActive) return;
            const key = e.key.toUpperCase();
            if (['A', 'B', 'C', 'D', 'E', 'F', 'G'].includes(key)) {
                const btn = Array.from(this.noteButtons).find(b => b.dataset.note === key);
                if (btn) {
                    this.handleAnswer(key + this.selectedAccidental, btn);
                }
            }
        });
    }

    loadScores() {
        const saved = localStorage.getItem('noteHeroScores_v2');
        return saved ? JSON.parse(saved) : {};
    }

    saveScores() {
        if (!this.currentUser) return;
        if (!this.userScores[this.currentUser]) {
            this.userScores[this.currentUser] = this.defaultProfile();
        }
        this.userScores[this.currentUser].clef = this.clef;
        this.userScores[this.currentUser].difficulty = this.difficulty;
        this.userScores[this.currentUser].mode = this.mode;
        this.userScores[this.currentUser].timeLimit = this.timeLimit;
        this.userScores[this.currentUser].audioEnabled = this.audioEnabled;
        localStorage.setItem('noteHeroScores_v2', JSON.stringify(this.userScores));
    }

    defaultProfile() {
        return { highScore: 0, totalAnswers: 0, correctAnswers: 0, clef: 'treble', difficulty: 'easy', mode: 'practice', timeLimit: 60, audioEnabled: true };
    }

    setUser(input) {
        const initials = input.trim().toUpperCase();
        if (!initials) return;

        this.saveScores();

        this.currentUser = initials;
        localStorage.setItem('noteHeroLastUser', this.currentUser);

        if (!this.userScores[this.currentUser]) {
            this.userScores[this.currentUser] = this.defaultProfile();
        }

        const profile = this.userScores[this.currentUser];
        this.clef = profile.clef || 'treble';
        this.difficulty = profile.difficulty || 'easy';
        this.mode = profile.mode || 'practice';
        this.timeLimit = profile.timeLimit || 60;
        this.audioEnabled = profile.audioEnabled !== undefined ? profile.audioEnabled : true;
        this.synth.enabled = this.audioEnabled;

        this.endGameLoop();
        this.score = 0;
        this.streak = 0;
        this.sessionCorrect = 0;
        this.sessionTotal = 0;

        this.userInput.value = this.currentUser;
        this.updateSettingsUI();
        this.updateStatsUI();
        this.showStartScreen();
    }

    updateSettingsUI() {
        // Clef
        const clefBtns = this.clefSelector.querySelectorAll('.seg-btn');
        clefBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.val === this.clef);
        });

        // Difficulty
        const diffBtns = this.difficultySelector.querySelectorAll('.seg-btn');
        diffBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.val === this.difficulty);
        });

        // Game Mode
        const modeBtns = this.modeSelector.querySelectorAll('.seg-btn');
        modeBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.val === this.mode);
        });

        // Duration
        const durationBtns = this.durationSelector.querySelectorAll('.seg-btn');
        durationBtns.forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.val) === this.timeLimit);
        });

        // Show/hide time limit setting based on game mode
        const timeLimitSetting = document.getElementById('time-limit-setting');
        if (this.mode === 'timeattack') {
            timeLimitSetting.classList.remove('hidden');
        } else {
            timeLimitSetting.classList.add('hidden');
        }

        // Audio
        this.audioToggle.classList.toggle('active', this.audioEnabled);
        this.audioToggle.innerHTML = `<span class="audio-icon">${this.audioEnabled ? '🔊' : '🔇'}</span> Sound ${this.audioEnabled ? 'On' : 'Off'}`;
    }

    updateStatsUI() {
        const profile = this.currentUser ? this.userScores[this.currentUser] : null;
        
        this.scoreElement.textContent = this.score;
        this.streakElement.textContent = this.streak;

        if (profile) {
            this.statHighscore.textContent = profile.highScore || 0;
            this.statTotal.textContent = profile.totalAnswers || 0;
            let accuracy = '0%';
            if (profile.totalAnswers > 0) {
                accuracy = `${Math.round((profile.correctAnswers / profile.totalAnswers) * 100)}%`;
            }
            this.statAccuracy.textContent = accuracy;
        } else {
            this.statHighscore.textContent = '0';
            this.statTotal.textContent = '0';
            this.statAccuracy.textContent = '0%';
        }
    }

    showStartScreen() {
        this.startScreen.classList.remove('hidden');
        this.gameOverScreen.classList.add('hidden');
        this.timerBarContainer.classList.remove('active');
        this.gameActive = false;
        this.canAnswer = false;
        this.container.innerHTML = `<div class="staff-placeholder" style="color:var(--text-muted);font-weight:600;">Hero Note Quiz</div>`;
    }

    startGame() {
        this.startScreen.classList.add('hidden');
        this.gameOverScreen.classList.add('hidden');
        
        this.score = 0;
        this.streak = 0;
        this.gameActive = true;
        this.canAnswer = true;
        this.sessionCorrect = 0;
        this.sessionTotal = 0;
        
        this.updateStatsUI();
        
        if (this.mode === 'timeattack') {
            this.timeLeft = this.timeLimit;
            this.timerBarContainer.classList.add('active');
            this.streakContainer.classList.add('hidden');
            this.timerTextContainer.classList.remove('hidden');
            this.startTimer();
        } else {
            this.timerBarContainer.classList.remove('active');
            this.streakContainer.classList.remove('hidden');
            this.timerTextContainer.classList.add('hidden');
        }
        
        this.generateNewQuestion();
    }

    resetGame() {
        this.endGameLoop();
        this.score = 0;
        this.streak = 0;
        this.showStartScreen();
    }

    endGameLoop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.gameActive = false;
        this.canAnswer = false;
    }

    startTimer() {
        if (this.timer) clearInterval(this.timer);
        this.updateTimerUI();
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerUI();
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    updateTimerUI() {
        this.timerTextElement.textContent = `${this.timeLeft}s`;
        const percentage = (this.timeLeft / this.timeLimit) * 100;
        this.timerBar.style.width = `${percentage}%`;
        
        if (this.timeLeft <= 10) {
            this.timerBar.style.background = 'var(--error-color)';
            this.timerBar.style.boxShadow = '0 0 10px var(--error-glow)';
        } else {
            this.timerBar.style.background = 'linear-gradient(to right, var(--accent-color), var(--secondary-color))';
            this.timerBar.style.boxShadow = '0 0 8px var(--accent-color)';
        }
    }

    endGame() {
        this.endGameLoop();
        
        let isNewHigh = false;
        if (this.currentUser) {
            const profile = this.userScores[this.currentUser];
            if (this.score > (profile.highScore || 0)) {
                profile.highScore = this.score;
                isNewHigh = true;
            }
            this.saveScores();
        }
        this.updateStatsUI();
        
        this.synth.playSuccess();

        this.goScoreElement.textContent = this.score;
        
        let accuracy = '0%';
        if (this.sessionTotal > 0) {
            accuracy = `${Math.round((this.sessionCorrect / this.sessionTotal) * 100)}%`;
        }
        this.goAccuracyElement.textContent = accuracy;
        
        const heading = this.gameOverScreen.querySelector('h2');
        if (isNewHigh) {
            heading.textContent = "New High Score!";
        } else {
            heading.textContent = "Game Over!";
        }

        this.gameOverScreen.classList.remove('hidden');
    }

    generateNewQuestion() {
        if (!this.gameActive) return;

        this.canAnswer = true;
        this.feedbackElement.className = 'feedback-text visible';
        this.feedbackElement.textContent = 'Identify the note...';
        this.noteButtons.forEach(btn => btn.className = 'note-btn');
        this.selectedAccidental = '';
        this.accidentalButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.accidental === ''));
        
        // Pick the active clef
        if (this.clef === 'mixed') {
            this.activeQuestionClef = Math.random() < 0.5 ? 'treble' : 'bass';
        } else {
            this.activeQuestionClef = this.clef;
        }

        // Get pool for clef and difficulty
        const notePool = NOTE_RANGES[this.difficulty][this.activeQuestionClef];
        const selected = notePool[Math.floor(Math.random() * notePool.length)];
        this.currentNote = selected;
        
        console.log("New question generated:", this.currentNote, "Clef:", this.activeQuestionClef);
        this.renderStaff();

        // Auditory cue
        setTimeout(() => {
            if (this.gameActive && this.currentNote) {
                this.synth.playNote(this.currentNote.name, this.currentNote.octave);
            }
        }, 120);
    }

    renderStaff() {
        if (this.activeQuestionClef === 'guitar') {
            this.renderFretboard();
            return;
        }
        if (!VF) return;
        this.container.innerHTML = '';
        
        const renderer = new VF.Renderer(this.container, VF.Renderer.Backends.SVG);
        renderer.resize(250, 150);
        const context = renderer.getContext();
        
        // Light grey lines on custom slate card background
        context.setFillStyle("#e2e8f0");
        context.setStrokeStyle("#e2e8f0");
        context.setFont("Outfit", 12, "bold");

        const stave = new VF.Stave(10, 20, 230);
        stave.setContext(context);
        stave.addClef(this.activeQuestionClef);
        stave.draw();

        const vexflowKey = `${this.currentNote.name.toLowerCase()}/${this.currentNote.octave}`;
        const staveNote = new VF.StaveNote({
            clef: this.activeQuestionClef,
            keys: [vexflowKey],
            duration: "q"
        });
        
        // Add accidental modifier if present
        const accidentalChar = this.currentNote.name.includes('#') ? '#' : (this.currentNote.name.includes('b') ? 'b' : null);
        if (accidentalChar) {
            staveNote.addModifier(new VF.Accidental(accidentalChar), 0);
        }
        
        // Sky blue highlight note
        staveNote.setStyle({ fillStyle: "#38bdf8", strokeStyle: "#38bdf8" });

        const voice = new VF.Voice({ num_beats: 1, beat_value: 4 });
        voice.addTickables([staveNote]);

        new VF.Formatter().joinVoices([voice]).format([voice], 150);
        voice.draw(context, stave);

        const svg = this.container.querySelector('svg');
        if (svg) {
            svg.style.filter = 'drop-shadow(0 0 5px rgba(56, 189, 248, 0.35))';
        }
    }

    renderFretboard() {
        this.container.innerHTML = '';

        const pos = findFretPosition(this.currentNote.name, this.currentNote.octave);
        if (!pos) {
            this.container.innerHTML = `<div class="staff-placeholder" style="color:var(--text-muted);font-weight:600;">Note out of range</div>`;
            return;
        }

        const fretWidth = 32;
        const stringGap = 16;
        const marginLeft = 50;
        const marginTop = 18;
        const numFrets = 6;

        let startFret = Math.max(0, pos.fret - 2);
        if (startFret + numFrets > 12) startFret = Math.max(0, 12 - numFrets);
        
        // Always show the nut (fret 0) if the note is within the first 6 frets
        if (pos.fret < 6) startFret = 0;

        const svgWidth = 250;
        const svgHeight = 148;

        const stringYs = [];
        for (let s = 0; s < 6; s++) {
            stringYs.push(marginTop + s * stringGap);
        }
        const bottomY = stringYs[5] + 3;
        const leftX = marginLeft;
        const rightX = leftX + numFrets * fretWidth;

        let svg = `<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;

        // Fret lines
        for (let f = 0; f <= numFrets; f++) {
            const x = leftX + f * fretWidth;
            const isNut = (startFret + f === 0);
            const width = isNut ? 3 : 1;
            const opacity = isNut ? 0.9 : 0.35;
            svg += `<line x1="${x}" y1="${stringYs[0] - 4}" x2="${x}" y2="${bottomY}" stroke="#94a3b8" stroke-width="${width}" stroke-opacity="${opacity}"/>`;
        }

        // Fret markers (dots on 3, 5, 7, 9, 12)
        for (let f = 0; f < numFrets; f++) {
            const fretNum = startFret + f + 1;
            if ([3, 5, 7, 9].includes(fretNum)) {
                const cx = leftX + f * fretWidth + fretWidth / 2;
                const cy = (stringYs[0] + stringYs[5]) / 2;
                svg += `<circle cx="${cx}" cy="${cy}" r="3" fill="#475569" opacity="0.4"/>`;
            } else if (fretNum === 12) {
                const cx = leftX + f * fretWidth + fretWidth / 2;
                const gap = stringYs[2] - stringYs[1];
                svg += `<circle cx="${cx}" cy="${(stringYs[1] + stringYs[2]) / 2}" r="3" fill="#475569" opacity="0.4"/>`;
                svg += `<circle cx="${cx}" cy="${(stringYs[3] + stringYs[4]) / 2}" r="3" fill="#475569" opacity="0.4"/>`;
            }
        }

        // String lines
        for (let s = 0; s < 6; s++) {
            const y = stringYs[s];
            const thickness = 1.2 + s * 0.15;
            svg += `<line x1="${leftX}" y1="${y}" x2="${rightX}" y2="${y}" stroke="#cbd5e1" stroke-width="${thickness}" stroke-opacity="0.5"/>`;
        }

        // String labels - now ordered from low E (top) to high e (bottom)
        const labels = ['E', 'A', 'D', 'G', 'B', 'e'];
        for (let s = 0; s < 6; s++) {
            svg += `<text x="${marginLeft - 10}" y="${stringYs[s] + 4}" text-anchor="end" fill="#94a3b8" font-size="11" font-weight="700" font-family="Outfit, sans-serif">${labels[s]}</text>`;
        }

        // Fret numbers
        for (let f = 0; f < numFrets; f++) {
            const fretNum = startFret + f + 1;
            const x = leftX + f * fretWidth + fretWidth / 2;
            svg += `<text x="${x}" y="${bottomY + 14}" text-anchor="middle" fill="#64748b" font-size="9" font-weight="600" font-family="Outfit, sans-serif">${fretNum}</text>`;
        }

        // Note marker (highlighted dot)
        let noteX;
        if (pos.fret === 0 && startFret === 0) {
            // Open string: place marker at the nut (left edge)
            noteX = leftX;
        } else {
            // Fretted note: place marker between the fret lines
            noteX = leftX + (pos.fret - startFret - 1) * fretWidth + fretWidth / 2;
        }
        const noteY = stringYs[pos.stringIndex];
        svg += `<circle cx="${noteX}" cy="${noteY}" r="7" fill="#38bdf8" stroke="#38bdf8" stroke-width="1.5" opacity="0.9"/>`;
        svg += `<circle cx="${noteX}" cy="${noteY}" r="3" fill="#ffffff" opacity="0.6"/>`;

        // Fret number badge next to the note marker
        if (pos.fret > 0) {
            svg += `<text x="${noteX + 11}" y="${noteY + 1}" text-anchor="start" fill="#38bdf8" font-size="8" font-weight="700" font-family="Outfit, sans-serif" opacity="0.85">fret ${pos.fret}</text>`;
        }

        svg += '</svg>';

        this.container.innerHTML = svg;

        const svgEl = this.container.querySelector('svg');
        if (svgEl) {
            svgEl.style.filter = 'drop-shadow(0 0 6px rgba(56, 189, 248, 0.3))';
        }
    }

    handleAnswer(selectedNote, btnElement) {
        if (!this.canAnswer || !this.gameActive) return;
        this.canAnswer = false;

        const isCorrect = selectedNote === this.currentNote.name;
        
        this.sessionTotal++;
        if (this.currentUser) this.userScores[this.currentUser].totalAnswers++;

        if (isCorrect) {
            this.sessionCorrect++;
            if (this.currentUser) this.userScores[this.currentUser].correctAnswers++;

            if (this.mode === 'timeattack') {
                this.score += 10;
            } else {
                this.score += 10 + (this.streak * 2);
            }
            this.streak++;
            
            this.showFeedback('Correct!', 'success');
            btnElement.classList.add('correct');
            document.querySelector('.quiz-card').classList.add('bounce');
            this.synth.playSuccess();
        } else {
            this.streak = 0;
            
            if (this.mode === 'timeattack') {
                // Timer penalty or score penalty
                this.score = Math.max(0, this.score - 5);
            }
            
            this.showFeedback(`Incorrect! It was ${this.currentNote.name}`, 'error');
            btnElement.classList.add('wrong');
            document.querySelector('.quiz-card').classList.add('shake');
            this.synth.playFailure();
            
            // Highlight correct answer button
            this.noteButtons.forEach(btn => {
                if (btn.dataset.note === this.currentNote.name[0]) {
                    btn.classList.add('correct');
                }
            });
        }

        this.saveScores();
        this.updateStatsUI();

        setTimeout(() => {
            document.querySelector('.quiz-card').classList.remove('bounce', 'shake');
            if (this.gameActive) {
                this.generateNewQuestion();
            }
        }, 1300);
    }

    showFeedback(text, type) {
        this.feedbackElement.textContent = text;
        this.feedbackElement.className = `feedback-text visible ${type}`;
    }
}

// Start the quiz app on window load
window.addEventListener('load', () => {
    new MusicQuiz();
});
