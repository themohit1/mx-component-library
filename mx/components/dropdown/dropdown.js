class DropdownMenu {
  constructor(element) {
    this.dropdown = element;
    this.trigger = this.dropdown.querySelector('[data-dropdown-trigger]');
    this.menu = this.dropdown.querySelector('[data-dropdown-menu]');
    this.items = Array.from(this.menu?.querySelectorAll('[role="menuitem"]') || []);
    this.isOpen = false;
    this.position = this.dropdown.dataset.position || 'bottom-start';
    this.initialize();
  }

  initialize() {
    // Set ARIA attributes
    this.trigger?.setAttribute('aria-haspopup', 'menu');
    this.trigger?.setAttribute('aria-expanded', 'false');
    this.menu?.setAttribute('role', 'menu');
    this.menu?.setAttribute('aria-orientation', 'vertical');
    this.menu?.setAttribute('tabindex', '-1');
    this.menu?.setAttribute('aria-hidden', 'true');

    // Add position class
    this.dropdown.classList.add(`dropdown-${this.position}`);

    // Add event listeners
    this.trigger?.addEventListener('click', (e) => this.toggle(e));
    this.trigger?.addEventListener('keydown', (e) => this.handleTriggerKeyDown(e));
    
    // Close when clicking outside
    document.addEventListener('click', (e) => this.handleClickOutside(e));
  }


  toggle(e) {
    e.stopPropagation();
    this.isOpen ? this.close() : this.open();
  }

  open() {
    if (this.isOpen) return;
    
    this.isOpen = true;
    this.trigger?.setAttribute('aria-expanded', 'true');
    this.menu?.setAttribute('aria-hidden', 'false');
    this.dropdown.classList.add('dropdown-open');
    
    // Focus first item when opening
    setTimeout(() => {
      const firstItem = this.items[0];
      firstItem?.focus();
    }, 0);
    
    // Add event listeners for keyboard navigation
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  close() {
    if (!this.isOpen) return;
    
    this.isOpen = false;
    this.trigger?.setAttribute('aria-expanded', 'false');
    this.menu?.setAttribute('aria-hidden', 'true');
    this.dropdown.classList.remove('dropdown-open');
    
    // Return focus to trigger
    this.trigger?.focus();
    
    // Remove event listeners
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }

  handleClickOutside(event) {
    if (!this.dropdown.contains(event.target)) {
      this.close();
    }
  }

  handleTriggerKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      this.open();
      
      // Focus first item when opening with keyboard
      const firstItem = this.items[0];
      firstItem?.focus();
    } else if (e.key === 'Escape') {
      this.close();
    }
  }

  handleKeyDown(e) {
    if (!this.isOpen) return;

    const currentIndex = this.items.indexOf(document.activeElement);
    let nextIndex = currentIndex;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        nextIndex = (currentIndex + 1) % this.items.length;
        break;
      case 'ArrowUp':
        e.preventDefault();
        nextIndex = (currentIndex - 1 + this.items.length) % this.items.length;
        break;
      case 'Home':
        e.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        nextIndex = this.items.length - 1;
        break;
      case 'Escape':
        e.preventDefault();
        this.close();
        return;
      case 'Tab':
        this.close();
        return;
      default:
        return;
    }

    this.items[nextIndex]?.focus();
  }
}

// Auto-initialize dropdowns
document.addEventListener('DOMContentLoaded', () => {
  const dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach(dropdown => {
    new DropdownMenu(dropdown);
  });
});
