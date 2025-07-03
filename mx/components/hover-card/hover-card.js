class HoverCard {
  constructor(element) {
    this.container = element;
    this.trigger = this.container.querySelector('[data-hover-card-trigger]');
    this.content = this.container.querySelector('[data-hover-card-content]');
    this.arrow = this.container.querySelector('[data-hover-card-arrow]');
    this.delay = parseInt(this.container.dataset.delay) || 200;
    this.openTimeout = null;
    this.closeTimeout = null;
    this.isOpen = false;
    this.arrowSize = 10;
    this.arrowOffset = 5;
    this.viewportPadding = 8;

    this.init();
  }

  init() {
    if (!this.trigger || !this.content) return;

    // Set initial ARIA attributes
    this.trigger.setAttribute('aria-haspopup', 'dialog');
    this.trigger.setAttribute('aria-expanded', 'false');
    this.content.setAttribute('role', 'tooltip');
    this.content.setAttribute('hidden', '');

    // Add event listeners
    this.trigger.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
    this.trigger.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    this.content.addEventListener('mouseenter', this.handleContentMouseEnter.bind(this));
    this.content.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    
    // For keyboard navigation
    this.trigger.addEventListener('focus', this.handleFocus.bind(this));
    this.trigger.addEventListener('blur', this.handleBlur.bind(this));
    
    // Close when pressing Escape
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    
    // Close when clicking outside
    document.addEventListener('click', this.handleClickOutside.bind(this));
  }

  handleMouseEnter() {
    clearTimeout(this.closeTimeout);
    this.openTimeout = setTimeout(() => this.open(), this.delay);
  }

  handleMouseLeave() {
    clearTimeout(this.openTimeout);
    this.closeTimeout = setTimeout(() => this.close(), 100);
  }

  handleContentMouseEnter() {
    clearTimeout(this.closeTimeout);
  }

  handleFocus() {
    this.open();
  }

  handleBlur() {
    // Use setTimeout to allow click events to fire on the content
    setTimeout(() => {
      if (!this.content.contains(document.activeElement) && document.activeElement !== this.trigger) {
        this.close();
      }
    }, 0);
  }

  handleKeyDown(event) {
    if (event.key === 'Escape' && this.isOpen) {
      event.preventDefault();
      this.close();
      this.trigger.focus();
    }
  }

  handleClickOutside(event) {
    if (
      this.isOpen && 
      !this.container.contains(event.target) && 
      !this.content.contains(event.target)
    ) {
      this.close();
    }
  }

  open() {
    if (this.isOpen) return;
    
    clearTimeout(this.closeTimeout);
    this.isOpen = true;
    this.trigger.setAttribute('aria-expanded', 'true');
    this.content.removeAttribute('hidden');
    this.content.setAttribute('data-state', 'open');
    
    // Position the content
    this.positionContent();
    
    // Add event listener for window resize
    window.addEventListener('resize', this.handleResize = () => this.positionContent());
    
    // Dispatch open event
    this.container.dispatchEvent(new CustomEvent('hoverCardOpen', { detail: { container: this.container } }));
  }

  close() {
    if (!this.isOpen) return;
    
    clearTimeout(this.openTimeout);
    this.isOpen = false;
    this.trigger.setAttribute('aria-expanded', 'false');
    this.content.setAttribute('data-state', 'closed');
    
    // Wait for animation to complete before hiding
    setTimeout(() => {
      if (!this.isOpen) {
        this.content.setAttribute('hidden', '');
      }
    }, 150);
    
    // Remove resize event listener
    window.removeEventListener('resize', this.handleResize);
    
    // Dispatch close event
    this.container.dispatchEvent(new CustomEvent('hoverCardClose', { detail: { container: this.container } }));
  }

  positionContent() {
    if (!this.isOpen) return;

    const triggerRect = this.trigger.getBoundingClientRect();
    const contentRect = this.content.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate available space around the trigger
    const space = {
      top: triggerRect.top - this.viewportPadding,
      right: viewportWidth - triggerRect.right - this.viewportPadding,
      bottom: viewportHeight - triggerRect.bottom - this.viewportPadding,
      left: triggerRect.left - this.viewportPadding
    };
    
    // Determine the best position based on available space
    let position = 'top';
    let maxSpace = space.top;
    
    if (space.right > maxSpace) { position = 'right'; maxSpace = space.right; }
    if (space.bottom > maxSpace) { position = 'bottom'; maxSpace = space.bottom; }
    if (space.left > maxSpace) { position = 'left'; }
    
    // If not enough space in preferred position, try other positions
    const minSpace = 100; // Minimum space required for the content
    if (maxSpace < minSpace) {
      if (position === 'top' || position === 'bottom') {
        position = space.right > space.left ? 'right' : 'left';
      } else {
        position = space.top > space.bottom ? 'top' : 'bottom';
      }
    }
    
    // Calculate position coordinates
    let top, left, arrowPosition;
    const arrowSize = this.arrow ? this.arrowSize : 0;
    
    switch (position) {
      case 'top':
        top = triggerRect.top - contentRect.height - arrowSize - 8;
        left = triggerRect.left + (triggerRect.width / 2) - (contentRect.width / 2);
        arrowPosition = 'bottom';
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height / 2) - (contentRect.height / 2);
        left = triggerRect.right + arrowSize + 8;
        arrowPosition = 'left';
        break;
      case 'bottom':
        top = triggerRect.bottom + arrowSize + 8;
        left = triggerRect.left + (triggerRect.width / 2) - (contentRect.width / 2);
        arrowPosition = 'top';
        break;
      case 'left':
      default:
        top = triggerRect.top + (triggerRect.height / 2) - (contentRect.height / 2);
        left = triggerRect.left - contentRect.width - arrowSize - 8;
        arrowPosition = 'right';
        break;
    }
    
    // Adjust position to stay within viewport
    left = Math.max(this.viewportPadding, Math.min(left, viewportWidth - contentRect.width - this.viewportPadding));
    top = Math.max(this.viewportPadding, Math.min(top, viewportHeight - contentRect.height - this.viewportPadding));
    
    // Apply styles
    this.content.style.position = 'fixed';
    this.content.style.top = `${Math.round(top)}px`;
    this.content.style.left = `${Math.round(left)}px`;
    this.content.style.width = `${contentRect.width}px`;
    
    // Position arrow if it exists
    if (this.arrow) {
      this.arrow.setAttribute('data-placement', arrowPosition);
      
      // Calculate arrow position relative to trigger
      const triggerCenterX = triggerRect.left + (triggerRect.width / 2);
      const triggerCenterY = triggerRect.top + (triggerRect.height / 2);
      
      // Position arrow pointing to the trigger
      switch (arrowPosition) {
        case 'top':
          this.arrow.style.top = '0';
          this.arrow.style.left = `${Math.min(
            Math.max(10, triggerCenterX - left - (this.arrowSize / 2)),
            contentRect.width - this.arrowSize - 10
          )}px`;
          break;
        case 'right':
          this.arrow.style.top = `${Math.min(
            Math.max(10, triggerCenterY - top - (this.arrowSize / 2)),
            contentRect.height - this.arrowSize - 10
          )}px`;
          this.arrow.style.right = '0';
          break;
        case 'bottom':
          this.arrow.style.bottom = '0';
          this.arrow.style.left = `${Math.min(
            Math.max(10, triggerCenterX - left - (this.arrowSize / 2)),
            contentRect.width - this.arrowSize - 10
          )}px`;
          break;
        case 'left':
          this.arrow.style.top = `${Math.min(
            Math.max(10, triggerCenterY - top - (this.arrowSize / 2)),
            contentRect.height - this.arrowSize - 10
          )}px`;
          this.arrow.style.left = '0';
          break;
      }
    }
    
    // Update container class for styling
    this.container.className = [
      'hover-card',
      `hover-card-${position}`,
      this.container.className.split(' ').filter(c => !c.startsWith('hover-card-')).join(' ')
    ].filter(Boolean).join(' ');
  }
}

// Auto-initialize hover cards
document.addEventListener('DOMContentLoaded', () => {
  const hoverCards = document.querySelectorAll('[data-hover-card]');
  hoverCards.forEach(card => new HoverCard(card));
});
