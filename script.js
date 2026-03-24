/**
 * Desk Pet Script
 * Vanilla JavaScript implementation of an interactive screen creature.
 */

// --- Configuration & Constants ---
const CONFIG = {
    STATS_DECREASE_INTERVAL: 3000, // ms
    STATE_CHANGE_INTERVAL: 5000,   // ms
    IDLE_WANDER_TIMEOUT: 3000,     // ms
    IDLE_SLEEP_TIMEOUT: 15000,     // ms
    PET_SIZE: 60,
    EASING: 0.08,                  // Base follow easing
    WANDER_SPEED: 2,
    CURIOUS_SPEED_MULT: 1.5,
    SLEEPY_SPEED_MULT: 0.5,
};

// --- State Management ---
const petState = {
    // Position
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    targetX: window.innerWidth / 2,
    targetY: window.innerHeight / 2,
    velocityX: 0,
    velocityY: 0,
    
    // Behavior Modes: 'follow', 'wander', 'sleep'
    mode: 'follow',
    
    // Personality States: 'idle', 'curious', 'playful', 'sleepy'
    personality: 'idle',
    
    // Stats
    stats: {
        hunger: 80,
        energy: 100,
        happiness: 70,
        level: 1
    },
    
    // Internal trackers
    lastMouseMove: Date.now(),
    isFlipped: false,
    currentEmoji: '🐥'
};

// --- DOM Elements ---
const elements = {
    petContainer: document.getElementById('pet-container'),
    pet: document.getElementById('pet'),
    sleepBubble: document.getElementById('sleep-bubble'),
    stateLabel: document.getElementById('state-label'),
    hungerBar: document.getElementById('hunger-bar'),
    energyBar: document.getElementById('energy-bar'),
    happinessBar: document.getElementById('happiness-bar'),
    hungerText: document.getElementById('hunger-text'),
    energyText: document.getElementById('energy-text'),
    happinessText: document.getElementById('happiness-text'),
    levelText: document.getElementById('level-text'),
    feedBtn: document.getElementById('feed-btn'),
    playBtn: document.getElementById('play-btn'),
    petBtn: document.getElementById('pet-btn')
};

// --- Initialization ---
function init() {
    setupEventListeners();
    startStatsLoop();
    startPersonalityLoop();
    requestAnimationFrame(update);
    updateUI();
}

// --- Event Listeners ---
function setupEventListeners() {
    window.addEventListener('mousemove', (e) => {
        petState.lastMouseMove = Date.now();
        
        // If we were sleeping or wandering, wake up/switch to follow
        if (petState.mode !== 'follow') {
            petState.mode = 'follow';
            elements.sleepBubble.classList.add('hidden');
        }
        
        petState.targetX = e.clientX;
        petState.targetY = e.clientY;
    });

    elements.petContainer.addEventListener('click', () => {
        jump();
        petState.stats.happiness = Math.min(100, petState.stats.happiness + 2);
        updateUI();
    });

    elements.feedBtn.addEventListener('click', () => {
        petState.stats.hunger = Math.min(100, petState.stats.hunger + 20);
        updateUI();
    });

    elements.playBtn.addEventListener('click', () => {
        if (petState.stats.energy > 10) {
            petState.stats.happiness = Math.min(100, petState.stats.happiness + 15);
            petState.stats.energy = Math.max(0, petState.stats.energy - 20);
            updateUI();
        }
    });

    elements.petBtn.addEventListener('click', () => {
        petState.stats.happiness = Math.min(100, petState.stats.happiness + 5);
        updateUI();
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        clampPosition();
    });
}

// --- Core Loops ---

function startStatsLoop() {
    setInterval(() => {
        if (petState.mode === 'sleep') {
            // Recover energy while sleeping
            petState.stats.energy = Math.min(100, petState.stats.energy + 5);
            petState.stats.hunger = Math.max(0, petState.stats.hunger - 1);
        } else {
            petState.stats.hunger = Math.max(0, petState.stats.hunger - 2);
            petState.stats.energy = Math.max(0, petState.stats.energy - 1);
            petState.stats.happiness = Math.max(0, petState.stats.happiness - 1);
        }
        
        checkLevelUp();
        updateUI();
        updateMood();
    }, CONFIG.STATS_DECREASE_INTERVAL);
}

function startPersonalityLoop() {
    setInterval(() => {
        if (petState.mode === 'sleep') return;

        const personalities = ['idle', 'curious', 'playful', 'sleepy'];
        petState.personality = personalities[Math.floor(Math.random() * personalities.length)];
        elements.stateLabel.textContent = petState.personality;
        
        // Visual feedback for playful state
        if (petState.personality === 'playful') {
            elements.pet.classList.add('animate-wiggle');
        } else {
            elements.pet.classList.remove('animate-wiggle');
        }
    }, CONFIG.STATE_CHANGE_INTERVAL);
}

// --- Animation & Movement ---

function update() {
    const now = Date.now();
    const idleTime = now - petState.lastMouseMove;

    // Determine Mode based on idle time
    if (idleTime > CONFIG.IDLE_SLEEP_TIMEOUT) {
        if (petState.mode !== 'sleep') {
            petState.mode = 'sleep';
            elements.sleepBubble.classList.remove('hidden');
            elements.pet.classList.remove('animate-wiggle');
        }
    } else if (idleTime > CONFIG.IDLE_WANDER_TIMEOUT) {
        if (petState.mode !== 'wander') {
            petState.mode = 'wander';
            setNewWanderTarget();
        }
    }

    // Movement Logic
    if (petState.mode === 'follow') {
        let easing = CONFIG.EASING;
        if (petState.personality === 'curious') easing *= CONFIG.CURIOUS_SPEED_MULT;
        if (petState.personality === 'sleepy') easing *= CONFIG.SLEEPY_SPEED_MULT;

        const dx = petState.targetX - petState.x;
        const dy = petState.targetY - petState.y;
        
        petState.x += dx * easing;
        petState.y += dy * easing;
        
        updateFlip(dx);
    } 
    else if (petState.mode === 'wander') {
        const dx = petState.targetX - petState.x;
        const dy = petState.targetY - petState.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 5) {
            setNewWanderTarget();
        } else {
            let speed = CONFIG.WANDER_SPEED;
            if (petState.personality === 'sleepy') speed *= CONFIG.SLEEPY_SPEED_MULT;
            
            petState.x += (dx / distance) * speed;
            petState.y += (dy / distance) * speed;
            updateFlip(dx);
        }
    }

    clampPosition();
    applyTransform();

    requestAnimationFrame(update);
}
function setNewWanderTarget() {
    const margin = 100;
    petState.targetX = margin + Math.random() * (window.innerWidth - margin * 2);
    petState.targetY = margin + Math.random() * (window.innerHeight - margin * 2);
}

function clampPosition() {
    const halfSize = CONFIG.PET_SIZE / 2;
    petState.x = Math.max(halfSize, Math.min(window.innerWidth - halfSize, petState.x));
    petState.y = Math.max(halfSize, Math.min(window.innerHeight - halfSize, petState.y));
}

function applyTransform() {
    // We use translate for position and scaleX for flipping
    // To avoid breaking positioning, we combine them
    const flip = petState.isFlipped ? -1 : 1;
    elements.petContainer.style.transform = `translate(${petState.x - CONFIG.PET_SIZE/2}px, ${petState.y - CONFIG.PET_SIZE/2}px)`;
    elements.pet.style.transform = `scaleX(${flip})`;
}

function updateFlip(dx) {
    if (Math.abs(dx) > 1) {
        petState.isFlipped = dx < 0;
    }
}



