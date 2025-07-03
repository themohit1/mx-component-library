class Drawer {
  constructor(element) {
    this.drawer = element;
    this.trigger = document.querySelector(`[data-drawer-trigger="${this.drawer.id}"]`);
    this.closeButtons = this.drawer.querySelectorAll('[data-drawer-close]');
    this.initialized = false;
    this.isOpen = false;
    
    this.init();
  }
  
  init() {
    if (this.initialized) return;
    
    // Set default position if not specified
    if (!this.drawer.classList.contains('drawer-right') && 
        !this.drawer.classList.contains('drawer-left') &&
        !this.drawer.classList.contains('drawer-top') &&
        !this.drawer.classList.contains('drawer-bottom')) {
      this.drawer.classList.add('drawer-right');
    }
    
    // Add ARIA attributes
    this.drawer.setAttribute('role', 'dialog');
    this.drawer.setAttribute('aria-modal', 'true');
    this.drawer.setAttribute('aria-hidden', 'true');
    
    // Add event listeners
    if (this.trigger) {
      this.trigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggle();
      });
    }
    
    this.closeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.close();
      });
    });
    
    // Close on overlay click
    const overlay = this.drawer.querySelector('.drawer-overlay');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this.close();
        }
      });
    }
    
    // Close on Escape key
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    
    this.initialized = true;
  }
  
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
  
  open() {
    if (this.isOpen) return;
    
    document.body.style.overflow = 'hidden';
    this.drawer.classList.add('drawer-open');
    this.drawer.setAttribute('aria-hidden', 'false');
    this.isOpen = true;
    
    // Focus trap
    this.focusableElements = this.getFocusableElements();
    this.firstFocusableElement = this.focusableElements[0];
    this.lastFocusableElement = this.focusableElements[this.focusableElements.length - 1];
    
    // Set focus to first focusable element
    setTimeout(() => {
      if (this.firstFocusableElement) {
        this.firstFocusableElement.focus();
      }
    }, 0);
    
    // Dispatch custom event
    this.drawer.dispatchEvent(new CustomEvent('drawer:open', { bubbles: true }));
  }
  
  close() {
    if (!this.isOpen) return;
    
    document.body.style.overflow = '';
    this.drawer.classList.remove('drawer-open');
    this.drawer.setAttribute('aria-hidden', 'true');
    this.isOpen = false;
    
    // Return focus to trigger
    if (this.trigger) {
      this.trigger.focus();
    }
    
    // Dispatch custom event
    this.drawer.dispatchEvent(new CustomEvent('drawer:close', { bubbles: true }));
  }
  
  getFocusableElements() {
    const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    return Array.from(this.drawer.querySelectorAll(selector))
      .filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
  }
  
  handleKeyDown(e) {
    if (!this.isOpen) return;
    
    if (e.key === 'Escape') {
      e.preventDefault();
      this.close();
      return;
    }
    
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      if (document.activeElement === this.firstFocusableElement) {
        e.preventDefault();
        this.lastFocusableElement.focus();
      }
    } else {
      if (document.activeElement === this.lastFocusableElement) {
        e.preventDefault();
        this.firstFocusableElement.focus();
      }
    }
  }
}

// Auto-initialize drawers
document.addEventListener('DOMContentLoaded', () => {
  const drawers = document.querySelectorAll('.drawer');
  drawers.forEach(drawer => {
    new Drawer(drawer);
  });
});
