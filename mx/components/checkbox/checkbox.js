class Checkbox {
  constructor(element) {
    this.checkbox = element;
    this.input = this.checkbox.querySelector('input[type="checkbox"]');
    this.checkboxIndicator = this.checkbox.querySelector('.checkbox');
    
    // Set initial state
    this.updateCheckbox();
    
    // Add event listeners
    this.input.addEventListener('change', () => this.updateCheckbox());
    
    // Support for toggling by clicking anywhere in the container
    this.checkbox.addEventListener('click', (e) => {
      // Only proceed if the click wasn't on the input itself (to avoid double-triggering)
      if (e.target !== this.input && !this.input.disabled) {
        e.preventDefault();
        this.input.checked = !this.input.checked;
        this.input.dispatchEvent(new Event('change'));
      }
    });
  }
  
  updateCheckbox() {
    this.checkboxIndicator.classList.toggle('checkbox-checked', this.input.checked);
    
    // Update ARIA attributes
    this.input.setAttribute('aria-checked', this.input.checked);
    
    // Dispatch custom event
    this.input.dispatchEvent(new CustomEvent('checkbox-change', {
      detail: { checked: this.input.checked },
      bubbles: true
    }));
  }
  
  // Public method to set checked state
  setChecked(checked) {
    this.input.checked = checked;
    this.updateCheckbox();
  }
  
  // Public method to toggle checked state
  toggle() {
    this.input.checked = !this.input.checked;
    this.updateCheckbox();
  }
  

}

// Initialize all checkboxes on page load
document.addEventListener('DOMContentLoaded', () => {
  const checkboxes = document.querySelectorAll('.checkbox-container');
  checkboxes.forEach(checkbox => new Checkbox(checkbox));
});

export default Checkbox;
