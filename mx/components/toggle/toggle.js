// shadcn-style toggle button (HTML/CSS/JS)
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.toggle').forEach(function (toggle) {
    // If the toggle is inside a toggle-group, let the group's script handle it.
    if (toggle.closest('.toggle-group')) {
      return;
    }

    toggle.addEventListener('click', function () {
      if (toggle.disabled) return;
      const pressed = toggle.getAttribute('aria-pressed') === 'true';
      toggle.setAttribute('aria-pressed', String(!pressed));
      toggle.classList.toggle('active', !pressed);
    });
  });
});
