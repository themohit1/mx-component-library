class Carousel {
  constructor(element) {
    this.carousel = element;
    this.viewport = this.carousel.querySelector('.carousel-viewport');
    this.container = this.carousel.querySelector('.carousel-container');
    this.slides = Array.from(this.container.children);
    this.prevButton = this.carousel.querySelector('[data-carousel-prev]');
    this.nextButton = this.carousel.querySelector('[data-carousel-next]');
    this.indicatorsContainer = this.carousel.querySelector('.carousel-indicators');
    this.indicators = [];
    
    this.currentIndex = 0;
    this.touchStartX = 0;
    this.touchEndX = 0;
    
    this.init();
  }
  
  init() {
    // Set initial active slide
    this.slides[0].classList.add('active');
    
    // Create indicators if they don't exist
    if (this.indicatorsContainer) {
      this.slides.forEach((_, index) => {
        const indicator = document.createElement('button');
        indicator.className = 'carousel-indicator';
        indicator.setAttribute('data-index', index);
        indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
        if (index === 0) indicator.setAttribute('data-active', '');
        
        indicator.addEventListener('click', () => this.goToSlide(index));
        this.indicatorsContainer.appendChild(indicator);
        this.indicators.push(indicator);
      });
    }
    
    // Event listeners for buttons
    if (this.prevButton) {
      this.prevButton.addEventListener('click', () => this.prev());
    }
    
    if (this.nextButton) {
      this.nextButton.addEventListener('click', () => this.next());
    }
    
    // Touch events for mobile
    this.container.addEventListener('touchstart', (e) => {
      this.touchStartX = e.touches[0].clientX;
    }, { passive: true });
    
    this.container.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].clientX;
      this.handleSwipe();
    }, { passive: true });
    
    // Keyboard navigation
    this.carousel.setAttribute('tabindex', '0');
    this.carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.prev();
      } else if (e.key === 'ArrowRight') {
        this.next();
      }
    });
    
    // Auto-play if data-autoplay is set
    if (this.carousel.dataset.autoplay === 'true') {
      const interval = parseInt(this.carousel.dataset.interval || '5000', 10);
      setInterval(() => this.next(), interval);
    }
  }
  
  updateActiveState() {
    // Update slide active state
    this.slides.forEach((slide, index) => {
      if (index === this.currentIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
    
    // Update indicator active state
    this.indicators.forEach((indicator, index) => {
      if (index === this.currentIndex) {
        indicator.setAttribute('data-active', '');
      } else {
        indicator.removeAttribute('data-active');
      }
    });
    
    // Update ARIA attributes
    this.slides.forEach((slide, index) => {
      slide.setAttribute('aria-hidden', index !== this.currentIndex);
    });
    
    // Disable/enable navigation buttons
    if (this.prevButton) {
      this.prevButton.disabled = this.currentIndex === 0;
    }
    
    if (this.nextButton) {
      this.nextButton.disabled = this.currentIndex === this.slides.length - 1;
    }
  }
  
  goToSlide(index) {
    if (index < 0 || index >= this.slides.length) return;
    
    this.currentIndex = index;
    this.container.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    this.updateActiveState();
  }
  
  next() {
    if (this.currentIndex < this.slides.length - 1) {
      this.goToSlide(this.currentIndex + 1);
    } else if (this.carousel.dataset.loop === 'true') {
      this.goToSlide(0);
    }
  }
  
  prev() {
    if (this.currentIndex > 0) {
      this.goToSlide(this.currentIndex - 1);
    } else if (this.carousel.dataset.loop === 'true') {
      this.goToSlide(this.slides.length - 1);
    }
  }
  
  handleSwipe() {
    const minSwipeDistance = 50;
    const swipeDistance = this.touchStartX - this.touchEndX;
    
    if (Math.abs(swipeDistance) < minSwipeDistance) return;
    
    if (swipeDistance > 0) {
      this.next();
    } else {
      this.prev();
    }
  }
}

// Initialize all carousels on the page
document.addEventListener('DOMContentLoaded', () => {
  const carousels = document.querySelectorAll('.carousel');
  carousels.forEach(carousel => new Carousel(carousel));
});

export default Carousel;
