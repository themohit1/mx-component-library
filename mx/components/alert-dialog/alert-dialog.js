document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.alert-dialog-trigger').forEach(function (trigger) {
    var dialog = document.getElementById(trigger.getAttribute('data-target'));
    if (!dialog) return;
    trigger.addEventListener('click', function () {
      dialog.classList.add('open');
      // Focus the first focusable button
      setTimeout(function () {
        var btn = dialog.querySelector('button, [tabindex]:not([tabindex="-1"])');
        if (btn) btn.focus();
      }, 10);
    });
    // Close on backdrop click
    dialog.querySelector('.alert-dialog-backdrop').addEventListener('click', function () {
      dialog.classList.remove('open');
    });
    // Close on Cancel or Action click
    dialog.querySelectorAll('.alert-dialog-cancel, .alert-dialog-action').forEach(function (btn) {
      btn.addEventListener('click', function () {
        dialog.classList.remove('open');
      });
    });
    // ESC key closes
    dialog.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') dialog.classList.remove('open');
    });
  });
});
