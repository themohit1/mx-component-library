document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.toggle-group').forEach(function (group) {
    const isSingle = group.getAttribute('data-type') === 'single';
    const items = group.querySelectorAll('.toggle');

    items.forEach(function (item) {
      item.addEventListener('click', function () {
        if (item.disabled || group.hasAttribute('disabled')) return;

        if (isSingle) {
          const currentActive = group.querySelector('.toggle.active');
          if (currentActive && currentActive !== item) {
            currentActive.classList.remove('active');
            currentActive.setAttribute('aria-pressed', 'false');
          }
        }

        const pressed = item.getAttribute('aria-pressed') === 'true';
        item.setAttribute('aria-pressed', String(!pressed));
        item.classList.toggle('active', !pressed);
      });
    });
  });
});
