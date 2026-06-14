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
        ]
    }
};

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
        this.userButtons = document.querySelectorAll('.user-btn');

        // State variables
        this.currentUser = 'V';
        this.userScores = this.loadScores();

        // Audio synth setup
        this.synth = new AudioSynth();

        // Settings (restored from active user profile)
        const profile = this.userScores[this.currentUser];
        this.clef = profile.clef || 'treble';
        this.difficulty = profile.difficulty || 'easy';
        this.mode = profile.mode || 'practice';
        this.timeLimit = profile.timeLimit || 60;
        this.audioEnabled = profile.audioEnabled !== undefined ? profile.audioEnabled : true;
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
            btn.addEventListener('click', () => this.handleAnswer(btn.dataset.note, btn));
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

        // User switcher buttons
        this.userButtons.forEach(btn => {
            btn.addEventListener('click', () => this.switchUser(btn.dataset.user));
        });

        // Reset stats button
        this.resetBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to reset all stats for the current user?")) {
                this.userScores[this.currentUser] = {
                    highScore: 0,
                    totalAnswers: 0,
                    correctAnswers: 0,
                    clef: this.clef,
                    difficulty: this.difficulty,
                    mode: this.mode,
                    audioEnabled: this.audioEnabled
                };
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
                    this.handleAnswer(key, btn);
                }
            }
        });
    }

    loadScores() {
        const saved = localStorage.getItem('noteHeroScores_v2');
        if (saved) return JSON.parse(saved);
        return {
            'V': { highScore: 0, totalAnswers: 0, correctAnswers: 0, clef: 'treble', difficulty: 'easy', mode: 'practice', timeLimit: 60, audioEnabled: true },
            'I': { highScore: 0, totalAnswers: 0, correctAnswers: 0, clef: 'treble', difficulty: 'easy', mode: 'practice', timeLimit: 60, audioEnabled: true },
            'J': { highScore: 0, totalAnswers: 0, correctAnswers: 0, clef: 'treble', difficulty: 'easy', mode: 'practice', timeLimit: 60, audioEnabled: true }
        };
    }

    saveScores() {
        this.userScores[this.currentUser].clef = this.clef;
        this.userScores[this.currentUser].difficulty = this.difficulty;
        this.userScores[this.currentUser].mode = this.mode;
        this.userScores[this.currentUser].timeLimit = this.timeLimit;
        this.userScores[this.currentUser].audioEnabled = this.audioEnabled;
        localStorage.setItem('noteHeroScores_v2', JSON.stringify(this.userScores));
    }

    switchUser(userId) {
        this.saveScores();

        this.currentUser = userId;
        const profile = this.userScores[userId];

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

        this.userButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.user === userId);
        });
        
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
        const profile = this.userScores[this.currentUser];
        
        this.scoreElement.textContent = this.score;
        this.streakElement.textContent = this.streak;
        this.statHighscore.textContent = profile.highScore || 0;
        this.statTotal.textContent = profile.totalAnswers || 0;

        let accuracy = '0%';
        if (profile.totalAnswers > 0) {
            accuracy = `${Math.round((profile.correctAnswers / profile.totalAnswers) * 100)}%`;
        }
        this.statAccuracy.textContent = accuracy;
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
        
        const profile = this.userScores[this.currentUser];
        let isNewHigh = false;
        if (this.score > (profile.highScore || 0)) {
            profile.highScore = this.score;
            isNewHigh = true;
        }
        this.saveScores();
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

    handleAnswer(selectedNote, btnElement) {
        if (!this.canAnswer || !this.gameActive) return;
        this.canAnswer = false;

        const isCorrect = selectedNote === this.currentNote.name[0];
        
        this.sessionTotal++;
        this.userScores[this.currentUser].totalAnswers++;

        if (isCorrect) {
            this.sessionCorrect++;
            this.userScores[this.currentUser].correctAnswers++;

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
