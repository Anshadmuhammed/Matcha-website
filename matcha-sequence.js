/**
 * MatchaSequence Component Logic
 * Renders an auto-playing high-quality image sequence on canvas.
 * 
 * Logic:
 * 1. Preload 40 frames.
 * 2. Play loop (ping-pong or cycle) automatically when section is visible.
 * 3. High-quality rendering via devicePixelRatio scaling.
 */

class MatchaSequence {
    constructor() {
        this.canvas = document.getElementById('hero-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d', { alpha: false }); // Optimize

        // High Quality Hint
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';

        this.frameCount = 40;
        this.images = [];
        this.imagesLoaded = 0;

        // Animation State
        this.currentFrame = 0;
        this.isPlaying = false;
        this.fps = 24;
        this.lastFrameTime = 0;
        this.frameInterval = 1000 / this.fps;

        // Configuration
        this.basePath = 'hero/seq/ezgif-frame-';
        this.extension = '.jpg';
        this.padLength = 3;

        // Intersection Observer to pause when off-screen
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.play();
                } else {
                    this.pause();
                }
            });
        }, { threshold: 0.1 });

        this.init();
    }

    init() {
        this.preloadImages();
        this.setupCanvas();
        this.observer.observe(this.canvas);
    }

    pad(num) {
        return num.toString().padStart(this.padLength, '0');
    }

    preloadImages() {
        for (let i = 1; i <= this.frameCount; i++) {
            const img = new Image();
            img.src = `${this.basePath}${this.pad(i)}${this.extension}`;
            img.onload = () => {
                this.imagesLoaded++;
            };
            this.images.push(img);
        }
    }

    setupCanvas() {
        const resize = () => {
            const parent = this.canvas.parentElement; // .hero-grid 
            if (!parent) return;

            const rect = parent.getBoundingClientRect();
            // Using parent logic: standard hero section now
            // But we want it to cover the screen or section? 
            // The CSS puts it absolute top:0 left:0 w:100% h:100% of .hero-section (parent)
            // Wait, hero-canvas is child of hero-grid? Or hero-section?

            // Check HTML structure in previous steps:
            // <section class="hero-section"><div class="hero-grid"><canvas>...
            // .hero-grid was sticky, now it is just relative.
            // .hero-section is relative, min-height 100vh.
            // .hero-grid height 100%.
            // Canvas position absolute top 0 left 0 width 100% height 100%. 
            // It should cover the area effectively.

            const dpr = window.devicePixelRatio || 1;

            // We want canvas to be as big as the window/section for full render
            const width = rect.width;
            const height = rect.height;

            this.canvas.width = width * dpr;
            this.canvas.height = height * dpr;

            this.canvas.style.width = `${width}px`;
            this.canvas.style.height = `${height}px`;

            this.ctx.scale(dpr, dpr);
            this.ctx.imageSmoothingEnabled = true;
            this.ctx.imageSmoothingQuality = 'high';

            this.renderFrame(this.currentFrame);
        };

        window.addEventListener('resize', resize);
        // Delay slighty to ensure layout
        setTimeout(resize, 50);
        setInterval(resize, 2000); // Check occasionally
    }

    play() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.lastFrameTime = performance.now();
        this.loop();
    }

    pause() {
        this.isPlaying = false;
    }

    loop(timestamp) {
        if (!this.isPlaying) return;

        const delta = timestamp - this.lastFrameTime;

        if (delta > this.frameInterval) {
            // Advance Frame
            this.currentFrame = (this.currentFrame + 1) % this.frameCount;
            this.renderFrame(this.currentFrame);
            this.lastFrameTime = timestamp - (delta % this.frameInterval);
        }

        requestAnimationFrame((t) => this.loop(t));
    }

    renderFrame(index) {
        if (!this.images[index] || !this.images[index].complete) return;

        const w = this.canvas.width / (window.devicePixelRatio || 1);
        const h = this.canvas.height / (window.devicePixelRatio || 1);

        // Object Fit: COVER
        const img = this.images[index];
        const scale = Math.max(w / img.width, h / img.height);
        const x = (w / 2) - (img.width / 2) * scale;
        const y = (h / 2) - (img.height / 2) * scale;

        // Clear logic
        // this.ctx.clearRect(0, 0, w, h); // Not strictly needed if we cover 100%

        this.ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MatchaSequence();
});
