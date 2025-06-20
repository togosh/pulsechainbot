document.addEventListener('DOMContentLoaded', function() {
    // Load Navbar and Footer
    loadComponent('/navbar.html', 'navbar-container');
    loadComponent('/footer.html', 'footer');

    // Contact Form Handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('.form-submit-btn');
            const messageDiv = contactForm.querySelector('.form-message');
            
            const formData = {
                name: contactForm.querySelector('#name').value,
                email: contactForm.querySelector('#email').value,
                message: contactForm.querySelector('#message').value
            };
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            messageDiv.style.display = 'none';

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                const result = await response.json();
                if (response.ok) {
                    messageDiv.className = 'form-message success';
                    messageDiv.textContent = 'Thank you! Your feedback has been sent.';
                    contactForm.reset();
                } else {
                    throw new Error(result.msg || 'An error occurred.');
                }
            } catch (error) {
                messageDiv.className = 'form-message error';
                messageDiv.textContent = error.message || 'Network error. Please try again.';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
                messageDiv.style.display = 'block';
            }
        });
    }
});

function loadComponent(url, elementId) {
    const element = document.getElementById(elementId) || document.querySelector(elementId);
    if (element) {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                element.innerHTML = data;
                if (elementId === 'footer') {
                    const yearSpan = document.getElementById('year');
                    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
                }
                if (elementId === 'navbar-container') {
                    const hamburger = document.querySelector('.hamburger-menu');
                    const navLinks = document.getElementById('nav-links');

                    if (hamburger && navLinks) {
                        hamburger.addEventListener('click', () => {
                            navLinks.classList.toggle('active');
                            const isExpanded = navLinks.classList.contains('active');
                            hamburger.setAttribute('aria-expanded', isExpanded);
                        });
                    }
                }
            })
            .catch(error => console.error(`Failed to load ${url}:`, error));
    }
}