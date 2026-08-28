document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Inject Navbar
    const navbarContainer = document.getElementById('navbar');
    if (navbarContainer) {
        navbarContainer.innerHTML = NavbarComponent;
    }

    // 2. Inject Footer
    const footerContainer = document.getElementById('footer');
    if (footerContainer) {
        footerContainer.innerHTML = FooterComponent;
    }

    // 3. Smooth Scrolling for anchor links (fallback/enhancement for JS logic)
    const smoothScrollLinks = document.querySelectorAll('.js-smooth-scroll');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Check if it's an internal link
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Mobile menu toggle logic could be added here in the future
});