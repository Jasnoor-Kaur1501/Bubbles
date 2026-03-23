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

