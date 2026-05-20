/* ============================================
   ÁVILA & ASOCIADOS — script.js
   Interactividad principal de la página
============================================ */

// ============ AOS (Animate On Scroll) ============
AOS.init({
  duration: 800,
  easing: 'ease-out-cubic',
  once: true,
  offset: 60
});

// ============ NAVBAR: efecto glassmorphism al hacer scroll ============
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ============ MENÚ HAMBURGUESA (móvil) ============
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open');
  document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
});

function closeMobile() {
  hamburger.classList.remove('open');
  mobileNav.classList.remove('open');
  document.body.style.overflow = '';
}

// ============ SMOOTH SCROLL para enlaces internos ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 76; // altura del navbar fijo
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ============ FORMULARIO → WHATSAPP ============
function submitForm() {
  const nombre   = document.getElementById('nombre').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const email    = document.getElementById('email').value.trim();
  const area     = document.getElementById('area').value;
  const mensaje  = document.getElementById('mensaje').value.trim();

  if (!nombre || !email || !mensaje) {
    alert('Por favor complete los campos obligatorios: nombre, correo y mensaje.');
    return;
  }

  // Construir mensaje organizado para WhatsApp
  const texto = `*📋 NUEVA CONSULTA — Avila & Asociados*

*👤 Nombre:* ${nombre}
*📞 Teléfono:* ${telefono || 'No indicado'}
*📧 Correo:* ${email}
*⚖️ Servicio:* ${area || 'No especificado'}

*📝 Descripción del caso:*
${mensaje}

_Mensaje enviado desde el sitio web._`;

  // Número de WhatsApp de la firma
  const numero = '573045719954';
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;

  // Abrir WhatsApp directamente
  window.open(url, '_blank');

  // Limpiar el formulario
  document.getElementById('nombre').value = '';
  document.getElementById('telefono').value = '';
  document.getElementById('email').value = '';
  document.getElementById('area').value = '';
  document.getElementById('mensaje').value = '';
}

// ============ ANIMACIÓN DE CONTADORES (sección estadísticas) ============
function animateCounters() {
  document.querySelectorAll('.stat-number').forEach(el => {
    const text  = el.textContent.trim();

    // Detectar prefijo (ej: "+"), número y sufijo (ej: "%") con regex segura
    const match = text.match(/^([^0-9]*)(\d+)([^0-9]*)$/);
    if (!match) return;

    const prefix = match[1]; // ej: "+"
    const target = parseInt(match[2]); // ej: 98
    const suffix = match[3]; // ej: "%"

    let start = 0;
    const duration = 1800;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = prefix + Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  });
}

// Lanzar contadores cuando la sección entra en el viewport
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      statsObserver.disconnect(); // ejecutar solo una vez
    }
  });
}, { threshold: 0.3 });

const statsSection = document.getElementById('stats');
if (statsSection) statsObserver.observe(statsSection);