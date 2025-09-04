class PresentationController {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 14;
        this.isAnimating = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateSlideCounter();
        this.updateProgressBar();
        this.showCurrentSlide();
    }

    setupEventListeners() {
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                this.nextSlide();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.previousSlide();
            }
        });

        // Button navigation
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.previousSlide());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());

        // Thumbnail navigation
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => this.goToSlide(index + 1));
        });

        // Touch navigation for mobile
        let touchStartX = 0;
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        document.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) this.nextSlide();
                else this.previousSlide();
            }
        });
    }

    nextSlide() {
        if (this.isAnimating || this.currentSlide >= this.totalSlides) return;
        this.goToSlide(this.currentSlide + 1);
    }

    previousSlide() {
        if (this.isAnimating || this.currentSlide <= 1) return;
        this.goToSlide(this.currentSlide - 1);
    }

    goToSlide(slideNumber) {
        if (this.isAnimating || slideNumber === this.currentSlide || slideNumber < 1 || slideNumber > this.totalSlides) return;
        
        this.isAnimating = true;
        
        // Hide current slide
        const currentSlideEl = document.querySelector(`.slide[data-slide="${this.currentSlide}"]`);
        if (currentSlideEl) {
            currentSlideEl.classList.remove('active');
        }

        // Show new slide
        const newSlideEl = document.querySelector(`.slide[data-slide="${slideNumber}"]`);
        if (newSlideEl) {
            newSlideEl.classList.add('active');
        }

        this.currentSlide = slideNumber;
        this.updateSlideCounter();
        this.updateProgressBar();
        this.updateThumbnails();

        // Reset animation flag
        setTimeout(() => {
            this.isAnimating = false;
        }, 600);
    }

    showCurrentSlide() {
        const currentSlideEl = document.querySelector(`.slide[data-slide="${this.currentSlide}"]`);
        if (currentSlideEl) {
            currentSlideEl.classList.add('active');
        }
        this.updateThumbnails();
    }

    updateSlideCounter() {
        const currentSlideSpan = document.querySelector('.current-slide');
        const totalSlidesSpan = document.querySelector('.total-slides');
        
        if (currentSlideSpan) currentSlideSpan.textContent = this.currentSlide;
        if (totalSlidesSpan) totalSlidesSpan.textContent = this.totalSlides;
    }

    updateProgressBar() {
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            const progress = (this.currentSlide / this.totalSlides) * 100;
            progressFill.style.width = `${progress}%`;
        }
    }

    updateThumbnails() {
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, index) => {
            if (index + 1 === this.currentSlide) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });
    }
}

// Initialize presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PresentationController();
});
