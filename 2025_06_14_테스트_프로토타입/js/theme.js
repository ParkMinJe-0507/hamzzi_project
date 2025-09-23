document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggle-mode');
  const icon = document.querySelector('.mode-icon');

  function updateIcon() {
    icon.textContent = document.body.classList.contains('dark') ? '🌙' : '☀️';
  }

  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    updateIcon();
  });

  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
  }
  updateIcon();
});
