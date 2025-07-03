document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.accordion').forEach(function (accordion) {
    const type = accordion.getAttribute('data-type') || 'single';
    const collapsible = accordion.hasAttribute('data-collapsible');
    accordion.querySelectorAll('.accordion-trigger').forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        const item = trigger.closest('.accordion-item');
        if (type === 'single') {
          accordion.querySelectorAll('.accordion-item').forEach(function (otherItem) {
            if (otherItem !== item) otherItem.classList.remove('open');
          });
          if (collapsible && item.classList.contains('open')) {
            item.classList.remove('open');
          } else {
            item.classList.add('open');
          }
        } else {
          item.classList.toggle('open');
        }
      });
    });
  });
});
