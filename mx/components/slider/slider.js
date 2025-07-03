/**
 * Slider Component
 * A customizable slider component that allows users to select a value from a range.
 *
 * Usage:
 * <div data-slider data-min="0" data-max="100" data-step="1" data-value="50"></div>
 *
 * Options:
 * - data-min: The minimum value of the slider.
 * - data-max: The maximum value of the slider.
 * - data-step: The step interval of the slider.
 * - data-value: The initial value of the slider.
 * - data-disabled: Disables the slider.
 */

class Slider {
  constructor(element) {
    this.element = element;
    this.min = parseFloat(this.element.getAttribute('data-min')) || 0;
    this.max = parseFloat(this.element.getAttribute('data-max')) || 100;
    this.step = parseFloat(this.element.getAttribute('data-step')) || 1;
    this.value = parseFloat(this.element.getAttribute('data-value')) || this.min;
    this.isDisabled = this.element.hasAttribute('data-disabled');

    this.track = null;
    this.range = null;
    this.thumb = null;

    this.isDragging = false;

    this.init();
  }

  init() {
    this.element.classList.add('slider');
    if (this.isDisabled) {
      this.element.classList.add('slider-disabled');
    }

    // Create the inner elements
    this.track = document.createElement('div');
    this.track.className = 'slider-track';

    this.range = document.createElement('div');
    this.range.className = 'slider-range';

    this.thumb = document.createElement('div');
    this.thumb.className = 'slider-thumb';
    this.thumb.setAttribute('role', 'slider');
    this.thumb.setAttribute('aria-valuemin', this.min);
    this.thumb.setAttribute('aria-valuemax', this.max);
    this.thumb.setAttribute('tabindex', this.isDisabled ? '-1' : '0');

    this.track.appendChild(this.range);
    this.element.appendChild(this.track);
    this.element.appendChild(this.thumb);

    this.setValue(this.value);
    this.addEventListeners();
  }

  addEventListeners() {
    if (this.isDisabled) return;

    this.thumb.addEventListener('mousedown', this.handleDragStart.bind(this));
    this.thumb.addEventListener('touchstart', this.handleDragStart.bind(this));

    document.addEventListener('mousemove', this.handleDragMove.bind(this));
    document.addEventListener('touchmove', this.handleDragMove.bind(this));

    document.addEventListener('mouseup', this.handleDragEnd.bind(this));
    document.addEventListener('touchend', this.handleDragEnd.bind(this));

    this.thumb.addEventListener('keydown', this.handleKeyDown.bind(this));
    this.element.addEventListener('click', this.handleClick.bind(this));
  }

  handleDragStart(event) {
    if (this.isDisabled) return;
    this.isDragging = true;
    this.element.classList.add('is-dragging');
    this.thumb.focus();
  }

  handleDragMove(event) {
    if (!this.isDragging || this.isDisabled) return;
    event.preventDefault();

    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const rect = this.track.getBoundingClientRect();
    let percent = (clientX - rect.left) / rect.width;
    percent = Math.max(0, Math.min(1, percent));

    let newValue = this.min + percent * (this.max - this.min);
    this.setValue(newValue);
  }

  handleDragEnd(event) {
    if (this.isDragging) {
        this.isDragging = false;
        this.element.classList.remove('is-dragging');
    }
  }

  handleClick(event) {
    if (this.isDisabled || event.target === this.thumb) return;

    const rect = this.track.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    let newValue = this.min + percent * (this.max - this.min);
    this.setValue(newValue);
  }

  handleKeyDown(event) {
    if (this.isDisabled) return;
    let newValue = this.value;
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        newValue -= this.step;
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        newValue += this.step;
        break;
      case 'Home':
        newValue = this.min;
        break;
      case 'End':
        newValue = this.max;
        break;
      default:
        return;
    }
    event.preventDefault();
    this.setValue(newValue);
  }

  setValue(newValue) {
    // Clamp the value within min and max
    let value = Math.max(this.min, Math.min(this.max, newValue));

    // Snap to the nearest step
    const stepCount = (value - this.min) / this.step;
    value = this.min + Math.round(stepCount) * this.step;
    
    // Ensure value is within bounds after snapping
    value = Math.max(this.min, Math.min(this.max, value));

    if (this.value === value) return;

    this.value = value;
    this.element.setAttribute('data-value', this.value);
    this.thumb.setAttribute('aria-valuenow', this.value);
    this.updateUI();
  }

  updateUI() {
    const percent = (this.value - this.min) / (this.max - this.min);
    this.range.style.width = `${percent * 100}%`;
    this.thumb.style.left = `${percent * 100}%`;
  }
  
  dispatchChangeEvent() {
    const changeEvent = new CustomEvent('slider:change', {
      bubbles: true,
      detail: { value: this.value }
    });
    this.element.dispatchEvent(changeEvent);
  }
}

// Auto-initialize sliders
document.addEventListener('DOMContentLoaded', () => {
  const sliders = document.querySelectorAll('[data-slider]');
  sliders.forEach(slider => new Slider(slider));
});
