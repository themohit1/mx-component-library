class Dialog {
  constructor(element) {
    this.dialog = element;
    this.trigger = document.querySelector(`[data-dialog-trigger="${this.dialog.id}"]`);
    this.closeButtons = this.dialog.querySelectorAll('[data-dialog-close]');
    this.initialized = false;
    
    this.init();
  }
  
  init() {
    if (this.initialized) return;
    
    // Add ARIA attributes
    this.dialog.setAttribute('role', 'dialog');
    this.dialog.setAttribute('aria-modal', 'true');
    this.dialog.setAttribute('aria-hidden', 'true');
    
    // Add event listeners
    if (this.trigger) {
      this.trigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    }
    
    this.closeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.close();
      });
    });
    
    // Close on overlay click
    this.dialog.addEventListener('click', (e) => {
      if (e.target === this.dialog) {
        this.close();
      }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.dialog.classList.contains('dialog-open')) {
        this.close();
      }
    });
    
    this.initialized = true;
  }
  
  open() {
    document.body.style.overflow = 'hidden';
    this.dialog.classList.add('dialog-open');
    this.dialog.setAttribute('aria-hidden', 'false');
    
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
    
    // Add focus trap
    this.dialog.addEventListener('keydown', this.handleKeyDown.bind(this));
  }
  
  close() {
    document.body.style.overflow = '';
    this.dialog.classList.remove('dialog-open');
    this.dialog.setAttribute('aria-hidden', 'true');
    
    // Remove focus trap
    this.dialog.removeEventListener('keydown', this.handleKeyDown.bind(this));
    
    // Return focus to trigger
    if (this.trigger) {
      this.trigger.focus();
    }
  }
  
  getFocusableElements() {
    const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    return Array.from(this.dialog.querySelectorAll(selector))
      .filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
  }
  
  handleKeyDown(e) {
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

// Auto-initialize dialogs
document.addEventListener('DOMContentLoaded', () => {
  const dialogs = document.querySelectorAll('.dialog');
  dialogs.forEach(dialog => {
    new Dialog(dialog);
  });
});
