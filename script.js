// Interactivity: nav toggle, robust smooth scrolling with header offset, and contact mailto fallback
document.addEventListener('DOMContentLoaded', function () {
  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  var navToggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('nav');
  navToggle?.addEventListener('click', function () {
    if (!nav) return;
    nav.classList.toggle('show');
  });

  // Get header height for scroll offset (reads CSS var if set)
  function getHeaderHeight() {
    var rootStyles = getComputedStyle(document.documentElement);
    var v = rootStyles.getPropertyValue('--header-height');
    var px = parseInt(v, 10);
    return isNaN(px) ? 72 : px;
  }

  // Smooth scroll to internal anchor, accounting for fixed header
  function scrollToAnchor(targetEl) {
    if (!targetEl) return;
    var headerOffset = getHeaderHeight() + 12; // match CSS breathing room
    var elementPosition = targetEl.getBoundingClientRect().top + window.pageYOffset;
    var offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  // Attach click handlers to internal links and close mobile nav after click
  var internalLinks = document.querySelectorAll('a[href^="#"]');
  internalLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      if (!href || href === '#') return;

      // find element target
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        scrollToAnchor(target);
        // close mobile nav if open
        if (nav && nav.classList.contains('show')) nav.classList.remove('show');
      }
    });
  });

  // Contact form handling (mailto fallback)
  var form = document.getElementById('contact-form');
  var formMsg = document.getElementById('form-msg');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nameInput = document.getElementById('name');
      var emailInput = document.getElementById('email');
      var messageInput = document.getElementById('message');

      var name = nameInput ? nameInput.value.trim() : '';
      var email = emailInput ? emailInput.value.trim() : '';
      var message = messageInput ? messageInput.value.trim() : '';

      if (!name || !email || !message) {
        if (formMsg) formMsg.textContent = 'Please fill in all fields.';
        return;
      }

      var subject = encodeURIComponent('Portfolio Contact from ' + name);
      var body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);
      var mailto = 'mailto:you@example.com?subject=' + subject + '&body=' + body;

      // Try to open mail client
      window.location.href = mailto;

      if (formMsg) formMsg.textContent = 'Opening your mail app...';
      setTimeout(function () {
        if (formMsg) formMsg.textContent = '';
        form.reset();
      }, 1800);
    });
  }
});