/**
 * Separator Component
 * A simple separator line that can be used to divide content
 * 
 * Usage:
 * <div data-separator></div>
 * 
 * Options:
 * - data-vertical: Makes the separator vertical
 */

class Separator {
  constructor(element) {
    this.element = element;
    this.init();
  }

  init() {
    // Add base class
    this.element.classList.add('separator');

    // Check for vertical orientation
    if (this.element.hasAttribute('data-vertical')) {
      this.element.classList.add('separator-vertical');
    }
  }
}

// Auto-initialize separators
document.addEventListener('DOMContentLoaded', () => {
  const separators = document.querySelectorAll('[data-separator]');
  separators.forEach(separator => new Separator(separator));
});
