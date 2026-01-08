// Main JavaScript for KeypointJS Website

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const backToTop = document.getElementById('backToTop');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.querySelectorAll('.nav-link');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

// API Configuration
const GITHUB_API_URL = 'https://api.github.com/repos/anasbex-dev/keypointjs';
const NPM_API_URL = 'https://registry.npmjs.org/keypointjs';

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}

// Back to Top Button
function handleScroll() {
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
    
    updateActiveNavLink();
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Navigation
function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 100;
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Mobile Menu (without logo)
function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
    } else {
        createMobileMenu();
    }
}

function createMobileMenu() {
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    
    mobileMenu.innerHTML = `
        <div class="mobile-menu-header">
            <button class="mobile-menu-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <nav class="mobile-nav">
            <a href="#home" class="mobile-nav-link active"><i class="fas fa-home"></i> Home</a>
            <a href="#features" class="mobile-nav-link"><i class="fas fa-star"></i> Features</a>
            <a href="#architecture" class="mobile-nav-link"><i class="fas fa-layer-group"></i> Architecture</a>
            <a href="#docs" class="mobile-nav-link"><i class="fas fa-book"></i> Documentation</a>
            <a href="#examples" class="mobile-nav-link"><i class="fas fa-code"></i> Examples</a>
            <a href="https://github.com/anasbex-dev/keypointjs" class="mobile-nav-link"><i class="fab fa-github"></i> GitHub</a>
        </nav>
    `;
    
    document.body.appendChild(mobileMenu);
    
    const closeBtn = mobileMenu.querySelector('.mobile-menu-close');
    closeBtn.addEventListener('click', toggleMobileMenu);
    
    const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMobileMenu);
    });
    
    mobileMenu.classList.add('active');
}

// Tab Switching
function initTabs() {
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === `${tabId}-tab`) {
                    pane.classList.add('active');
                }
            });
        });
    });
}

// Fetch GitHub Data
async function fetchGitHubStats() {
    try {
        const response = await fetch(GITHUB_API_URL);
        if (!response.ok) throw new Error('GitHub API error');
        
        const data = await response.json();
        
        // Update GitHub stars in header
        const starsElement = document.getElementById('github-stars');
        if (starsElement) {
            starsElement.textContent = data.stargazers_count.toLocaleString();
        }
        
        // Update GitHub stars in stats section
        const starsCountElement = document.getElementById('github-stars-count');
        if (starsCountElement) {
            animateCounter(starsCountElement, data.stargazers_count);
        }
        
        // Update forks
        const forksElement = document.getElementById('github-forks');
        if (forksElement) {
            animateCounter(forksElement, data.forks_count);
        }
        
    } catch (error) {
        console.error('Error fetching GitHub stats:', error);
        showNotification('Failed to fetch GitHub data', 'error');
    }
}

// Fetch NPM Data
async function fetchNPMStats() {
    try {
        const response = await fetch(NPM_API_URL);
        if (!response.ok) throw new Error('NPM API error');
        
        const data = await response.json();
        
        // Get latest version
        const latestVersion = data['dist-tags'].latest;
        
        // Update version in hero badge
        const versionElement = document.getElementById('npm-version');
        if (versionElement) {
            versionElement.textContent = latestVersion;
        }
        
        // Update latest version in stats
        const latestVersionElement = document.getElementById('latest-version');
        if (latestVersionElement) {
            latestVersionElement.textContent = `v${latestVersion}`;
        }
        
        // Get total downloads (you might need a different API for this)
        // For now, we'll use a placeholder or you can use npm-stat.com API
        fetchTotalDownloads(latestVersion);
        
    } catch (error) {
        console.error('Error fetching NPM stats:', error);
        showNotification('Failed to fetch NPM data', 'error');
    }
}

// Fetch total downloads from npm-stat.com API
async function fetchTotalDownloads(version) {
    try {
        // Note: npm-stat.com requires a different approach
        // For simplicity, we'll use a placeholder or you can implement:
        // const response = await fetch(`https://api.npmjs.org/downloads/range/last-year/keypointjs`);
        
        // For now, let's update with a static value that you can replace
        const downloadsElement = document.getElementById('npm-downloads');
        const totalDownloadsElement = document.getElementById('total-downloads');
        
        if (downloadsElement) {
            downloadsElement.textContent = 'Loading...';
        }
        
        if (totalDownloadsElement) {
            // This is a placeholder - you'll need to implement actual NPM download stats
            // You can use: https://api.npmjs.org/downloads/range/last-year/keypointjs
            totalDownloadsElement.textContent = 'Loading...';
        }
        
        // Uncomment and implement when you have the actual API
        
        const response = await fetch('https://api.npmjs.org/downloads/range/last-year/keypointjs');
        const data = await response.json();
        const total = data.downloads.reduce((sum, day) => sum + day.downloads, 0);
        
        if (downloadsElement) {
            downloadsElement.textContent = `${total.toLocaleString()}+`;
        }
        
        if (totalDownloadsElement) {
            animateCounter(totalDownloadsElement, total);
        }
        
        
    } catch (error) {
        console.error('Error fetching download stats:', error);
    }
}

// Animated Counter
function animateCounter(element, target, duration = 2000) {
    if (!element || typeof target !== 'number') return;
    
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// Copy to Clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Code copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showNotification('Failed to copy code', 'error');
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10B981' : '#EF4444'};
        color: white;
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Smooth scrolling for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    initTheme();
    
    // Add event listeners
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (backToTop) backToTop.addEventListener('click', scrollToTop);
    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Initialize components
    initTabs();
    initSmoothScroll();
    
    // Fetch real-time data
    fetchGitHubStats();
    fetchNPMStats();
    
    // Handle scroll events
    window.addEventListener('scroll', handleScroll);
    
    // Initial scroll handling
    handleScroll();
    
    // Add animation classes
    const animateElements = document.querySelectorAll('.feature-card, .layer, .doc-card');
    animateElements.forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Refresh data every 5 minutes
    setInterval(() => {
        fetchGitHubStats();
        fetchNPMStats();
    }, 300000);
});

// Theme CSS variables
const style = document.createElement('style');
style.id = 'theme-variables';
style.textContent = `
    [data-theme="light"] {
        --dark: #F8FAFC;
        --darker: #F1F5F9;
        --light: #0F172A;
        --gray: #475569;
        --gray-dark: #CBD5E1;
    }
    
    [data-theme="light"] .section-dark {
        background-color: #E2E8F0;
    }
    
    [data-theme="light"] .header {
        background: rgba(248, 250, 252, 0.95);
    }
    
    [data-theme="light"] .feature-card,
    [data-theme="light"] .layer,
    [data-theme="light"] .stat,
    [data-theme="light"] .doc-card {
        background: rgba(255, 255, 255, 0.9);
        border-color: rgba(203, 213, 225, 0.5);
    }
    
    [data-theme="light"] .code-block,
    [data-theme="light"] .install-command {
        background: #1E293B;
    }
    
    [data-theme="light"] .tab-content {
        background: #1E293B;
    }
    
    [data-theme="light"] .footer {
        background: #E2E8F0;
        color: #0F172A;
    }
    
    [data-theme="light"] .footer h3,
    [data-theme="light"] .footer-section a {
        color: #0F172A;
    }
    
    [data-theme="light"] .mobile-menu {
        background: #F8FAFC;
    }
`;
document.head.appendChild(style);