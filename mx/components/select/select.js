// Minimal JS for custom select (shadcn-like)
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.select').forEach(function (select) {
    const trigger = select.querySelector('.select-trigger');
    const content = select.querySelector('.select-content');
    const value = select.querySelector('.select-value');
    const items = select.querySelectorAll('.select-item');

    // Open/close logic
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      document.querySelectorAll('.select.open').forEach(s => {
        if (s !== select) s.classList.remove('open');
      });
      select.classList.toggle('open');
    });

    // Select item logic
    items.forEach(function (item) {
      item.addEventListener('click', function (e) {
        e.stopPropagation();
        value.textContent = item.textContent;
        items.forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        select.classList.remove('open');
      });
    });
  });

  // Close on outside click
  document.addEventListener('click', function () {
    document.querySelectorAll('.select.open').forEach(s => s.classList.remove('open'));
  });
});
