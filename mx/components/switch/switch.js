/**
 * Switch Component
 * A toggle switch component that can be toggled on and off.
 * 
 * Usage:
 * <label class="switch">
 *   <input type="checkbox" class="switch-input" data-switch>
 *   <span class="switch-track">
 *     <span class="switch-thumb"></span>
 *   </span>
 *   <span class="switch-label">Label</span>
 * </label>
 * 
 * Options:
 * - data-size: 'sm' or 'lg' - Changes the size of the switch
 * - disabled - Add this attribute to disable the switch
 * - checked - Add this attribute to set the initial state to checked
 */

class Switch {
  constructor(element) {
    this.element = element;
    this.input = this.element.querySelector('input[type="checkbox"]');
    this.track = this.element.querySelector('.switch-track');
    this.thumb = this.element.querySelector('.switch-thumb');
    
    if (!this.input || !this.track || !this.thumb) {
      console.warn('Switch component is missing required elements');
      return;
    }
    
    this.init();
  }
  
  init() {
    // Add ARIA attributes
    this.input.setAttribute('role', 'switch');
    this.input.setAttribute('aria-checked', this.input.checked);
    
    // Add size class if specified
    const size = this.input.getAttribute('data-size');
    if (size === 'sm' || size === 'lg') {
      this.element.classList.add(`switch-${size}`);
    }
    
    // Add disabled class if needed
    if (this.input.disabled) {
      this.element.classList.add('switch-disabled');
    }
    
    // Add event listeners
    this.input.addEventListener('change', this.handleChange.bind(this));
    this.input.addEventListener('keydown', this.handleKeyDown.bind(this));
  }
  
  handleChange() {
    this.input.setAttribute('aria-checked', this.input.checked);
    
    // Dispatch custom event
    const event = new CustomEvent('switch:change', {
      bubbles: true,
      detail: { checked: this.input.checked }
    });
    this.input.dispatchEvent(event);
  }
  
  handleKeyDown(event) {
    // Allow toggling with space or enter key
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.input.checked = !this.input.checked;
      this.handleChange();
    }
  }
  
  // Public method to toggle the switch
  toggle() {
    this.input.checked = !this.input.checked;
    this.handleChange();
  }
  
  // Public method to set the checked state
  setChecked(checked) {
    this.input.checked = checked;
    this.handleChange();
  }
}

// Auto-initialize switches
document.addEventListener('DOMContentLoaded', () => {
  const switches = document.querySelectorAll('[data-switch]');
  switches.forEach(switchEl => {
    // Find the parent label or create one if it doesn't exist
    const label = switchEl.closest('.switch') || switchEl.parentElement;
    new Switch(label);
  });
});
