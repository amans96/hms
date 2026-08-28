// Centralized UI Components for injection

const NavbarComponent = `
<nav class="bg-white border-b border-gray-100 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
            <div class="flex-shrink-0">
                <a href="index.html" class="text-2xl font-light tracking-wide text-charcoal uppercase">
                    Grand Haven
                </a>
            </div>
            
            <div class="hidden md:flex items-center space-x-8">
                <a href="index.html" class="text-sm font-medium text-charcoal hover:text-gold transition-colors">Home</a>
                <a href="index.html#rooms" class="text-sm font-medium text-gray-500 hover:text-gold transition-colors">Rooms</a>
                <a href="index.html#food" class="text-sm font-medium text-gray-500 hover:text-gold transition-colors">Dining</a>
                <a href="about.html" class="text-sm font-medium text-gray-500 hover:text-gold transition-colors">About</a>
                <a href="login.html" class="text-sm font-medium text-gray-500 hover:text-gold transition-colors">Login</a>
                <a href="signup.html" class="text-sm font-medium text-gray-500 hover:text-gold transition-colors">Sign Up</a>
                <a href="rooms.html" class="px-5 py-2 bg-charcoal text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors">
                    Book Now
                </a>
            </div>

            <div class="md:hidden flex items-center">
                <button type="button" onclick="document.getElementById('mobile-menu').classList.toggle('hidden')" class="text-gray-500 hover:text-charcoal focus:outline-none">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                </button>
            </div>
        </div>
    </div>

    <div id="mobile-menu" class="md:hidden hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
        <div class="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            <a href="index.html" class="block px-3 py-2 text-base font-medium text-charcoal hover:text-gold transition-colors">Home</a>
            <a href="../html/room.html" class="block px-3 py-2 text-base font-medium text-gray-500 hover:text-gold transition-colors">Rooms</a>
            <a href="index.html#food" class="block px-3 py-2 text-base font-medium text-gray-500 hover:text-gold transition-colors">Dining</a>
            <a href="about.html" class="block px-3 py-2 text-base font-medium text-gray-500 hover:text-gold transition-colors">About</a>
            <a href="login.html" class="block px-3 py-2 text-base font-medium text-gray-500 hover:text-gold transition-colors">Login</a>
            <a href="signup.html" class="block px-3 py-2 text-base font-medium text-gray-500 hover:text-gold transition-colors">Sign Up</a>
            <a href="room.html" class="block mt-4 px-3 py-2 mx-3 text-center bg-charcoal text-white text-base font-medium rounded hover:bg-gray-800 transition-colors">
                Book Now
            </a>
        </div>
    </div>
</nav>
`;

const FooterComponent = `
<footer class="bg-charcoal text-white pt-16 pb-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div class="md:col-span-2">
                <h3 class="text-2xl font-light tracking-wide uppercase mb-6 text-white">Grand Haven</h3>
                <p class="text-gray-400 font-light max-w-sm">
                    Experience luxury, comfort, and attentive service. Your perfect stay begins here.
                </p>
            </div>
            
            <div>
                <h4 class="text-sm font-semibold tracking-widest uppercase mb-6 text-gold">Explore</h4>
                <ul class="space-y-4">
                    <li><a href="index.html#rooms" class="text-gray-400 hover:text-white transition-colors">Rooms & Suites</a></li>
                    <li><a href="index.html#food" class="text-gray-400 hover:text-white transition-colors">Dining</a></li>
                    <li><a href="about.html" class="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                    <li><a href="contact.html" class="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                </ul>
            </div>

            <div>
                <h4 class="text-sm font-semibold tracking-widest uppercase mb-6 text-gold">Contact</h4>
                <ul class="space-y-4 text-gray-400 font-light">
                    <li>123 Luxury Avenue</li>
                    <li>City, Country</li>
                    <li>+1 (555) 123-4567</li>
                    <li>info@grandhaven.com</li>
                </ul>
            </div>
        </div>
        
        <div class="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>&copy; ${new Date().getFullYear()} Grand Haven Hotel. All rights reserved.</p>
            <div class="flex space-x-6 mt-4 md:mt-0">
                <a href="#" class="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" class="hover:text-white transition-colors">Terms of Service</a>
            </div>
        </div>
    </div>
</footer>
`;