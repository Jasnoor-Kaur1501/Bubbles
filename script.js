// ============================================================================
// DESK PET - A Browser-Based Interactive Pet
// ============================================================================

class DeskPet {
    constructor() {
        // DOM Elements
        this.petEl = document.getElementById('pet');
        this.sleepBubbleEl = document.getElementById('sleepBubble');
        this.hungerBar = document.getElementById('hungerBar');
        this.energyBar = document.getElementById('energyBar');
        this.happinessBar = document.getElementById('happinessBar');
        this.hungerValue = document.getElementById('hungerValue');
        this.energyValue = document.getElementById('energyValue');
        this.happinessValue = document.getElementById('happinessValue');
        this.levelValue = document.getElementById('levelValue');

        // Pet Position
        this.x = window.innerWidth / 2;
        this.y = window.innerHeight / 2;
        this.targetX = this.x;
        this.targetY = this.y;

        // Stats
        this.stats = {
            hunger: 100,
            energy: 100,
            happiness: 100,
            level: 1
        };

        // Pet State
        this.state = 'idle'; // idle, curious, playful, sleepy
        this.mode = 'follow'; // follow, wander, sleep
        this.lastMoodEmoji = '🐥';
        this.isFlipped = false;

        // Idle tracking
        this.lastMouseMove = Date.now();
        this.idleThreshold = 3000; // 3 seconds before wandering
        this.sleepThreshold = 8000; // 8 seconds before sleeping

        // Movement
        this.speed = 2;
        this.easing = 0.08;

        // Event listeners
        this.setupEventListeners();

        // Start animation loop
        this.animate();

        // Start stat decay
        this.startStatDecay();

        // Start state changes
        this.startStateChanges();

        // Initial render
        this.updateUI();
    }

    setupEventListeners() {
        // Mouse movement tracking
        document.addEventListener('mousemove', (e) => {
            this.targetX = e.clientX;
            this.targetY = e.clientY;
            this.lastMouseMove = Date.now();
            this.mode = 'follow';
        });

        // Pet click - jump and play
        this.petEl.addEventListener('click', () => {
            this.jump();
            this.stats.hap
