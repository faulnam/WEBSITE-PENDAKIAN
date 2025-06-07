// Main application JavaScript
class AlpineAdventures {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupSmoothScrolling();
    this.setupMobileMenu();
    this.setupThemeToggle();
    this.setupProductFiltering();
    this.setupScrollAnimations();
    this.setupContactForm();
    this.updateActiveNavLink();
  }

  setupEventListeners() {
    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        this.scrollToSection(targetId);
      });
    });

    // CTA button
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
      ctaButton.addEventListener('click', () => {
        this.scrollToSection('#mountains');
      });
    }

    // Window scroll events
    window.addEventListener('scroll', () => {
      this.updateActiveNavLink();
      this.handleScrollAnimations();
    });

    // Window resize events
    window.addEventListener('resize', () => {
      this.closeMobileMenu();
    });
  }

  setupSmoothScrolling() {
    // Enhanced smooth scrolling with easing
    this.scrollToSection = (targetId) => {
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = 80;
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        this.closeMobileMenu();
      }
    };
  }

  setupMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.nav-menu');

    if (toggle && menu) {
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !menu.contains(e.target)) {
          this.closeMobileMenu();
        }
      });
    }
  }

  closeMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.nav-menu');
    
    if (toggle && menu) {
      toggle.classList.remove('active');
      menu.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  setupThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle?.querySelector('i');
    
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    if (themeIcon) {
      themeIcon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        if (themeIcon) {
          themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }

        // Add animation effect
        themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
          themeToggle.style.transform = 'scale(1)';
        }, 150);
      });
    }
  }

  setupProductFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const category = button.getAttribute('data-category');
        
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Filter products with animation
        productCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          const shouldShow = category === 'all' || cardCategory === category;
          
          if (shouldShow) {
            card.style.display = 'block';
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 100);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  setupScrollAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, observerOptions);

    // Observe all animatable elements
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      this.observer.observe(el);
    });
  }

  handleScrollAnimations() {
    // Additional scroll-based animations
    const scrollTop = window.pageYOffset;
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
      const heroHeight = hero.offsetHeight;
      if (scrollTop < heroHeight) {
        hero.style.transform = `translateY(${scrollTop * 0.5}px)`;
      }
    }

    // Header background opacity
    const header = document.querySelector('.header');
    if (header) {
      const opacity = Math.min(scrollTop / 100, 1);
      header.style.background = `rgba(255, 255, 255, ${0.95 * opacity})`;
      
      if (document.documentElement.getAttribute('data-theme') === 'dark') {
        header.style.background = `rgba(23, 23, 23, ${0.95 * opacity})`;
      }
    }
  }

  updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    const scrollPosition = window.pageYOffset + 100; // Offset for header

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  setupContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !message) {
          this.showNotification('Please fill in all fields.', 'error');
          return;
        }

        if (!this.isValidEmail(email)) {
          this.showNotification('Please enter a valid email address.', 'error');
          return;
        }

        // Simulate form submission
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          contactForm.reset();
          this.showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        }, 2000);
      });
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
      <span>${message}</span>
      <button class="notification-close">
        <i class="fas fa-times"></i>
      </button>
    `;

    // Add notification styles
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      padding: 16px 20px;
      border-radius: 8px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      z-index: 10000;
      display: flex;
      align-items: center;
      gap: 12px;
      max-width: 400px;
      transform: translateX(100%);
      transition: transform 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      this.removeNotification(notification);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
      this.removeNotification(notification);
    }, 5000);
  }

  removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }
}

// Enhanced Mountain Data (for future reference)
const mountainsData = [
  {
    id: 1,
    name: "Mount Everest",
    location: "Nepal/Tibet",
    height: 8848,
    difficulty: "Expert",
    image_url: "https://images.pexels.com/photos/618833/pexels-photo-618833.jpeg",
    description: "The world's highest peak, offering the ultimate mountaineering challenge."
  },
  {
    id: 2,
    name: "K2",
    location: "Pakistan/China", 
    height: 8611,
    difficulty: "Expert",
    image_url: "https://images.pexels.com/photos/1624438/pexels-photo-1624438.jpeg",
    description: "Known as the 'Savage Mountain', K2 is considered one of the most difficult climbs."
  },
  {
    id: 3,
    name: "Mont Blanc",
    location: "France/Italy",
    height: 4809,
    difficulty: "Intermediate",
    image_url: "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg",
    description: "The highest peak in Western Europe, perfect for intermediate climbers."
  },
  {
    id: 4,
    name: "Matterhorn",
    location: "Switzerland/Italy",
    height: 4478,
    difficulty: "Advanced",
    image_url: "https://images.pexels.com/photos/1612461/pexels-photo-1612461.jpeg",
    description: "Iconic pyramid-shaped peak, a symbol of mountaineering excellence."
  },
  {
    id: 5,
    name: "Denali",
    location: "Alaska, USA",
    height: 6190,
    difficulty: "Advanced",
    image_url: "https://images.pexels.com/photos/1559825/pexels-photo-1559825.jpeg",
    description: "North America's highest peak, offering extreme cold weather challenges."
  },
  {
    id: 6,
    name: "Kilimanjaro",
    location: "Tanzania",
    height: 5895,
    difficulty: "Beginner",
    image_url: "https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg",
    description: "Africa's highest peak, accessible to beginners with proper preparation."
  }
];

// Enhanced Product Data (for future reference)
const productsData = [
  {
    id: 1,
    name: "Professional Hiking Poles",
    category: "hiking-gear",
    price: 129.99,
    description: "Lightweight carbon fiber poles with adjustable height",
    image_url: "https://images.pexels.com/photos/1266810/pexels-photo-1266810.jpeg"
  },
  {
    id: 2,
    name: "Mountain Hiking Boots",
    category: "shoes",
    price: 299.99,
    description: "Waterproof leather boots with superior grip",
    image_url: "https://images.pexels.com/photos/1230669/pexels-photo-1230669.jpeg"
  },
  {
    id: 3,
    name: "Alpine Backpack 65L",
    category: "backpacks",
    price: 249.99,
    description: "Multi-day expedition backpack with hydration system",
    image_url: "https://images.pexels.com/photos/1557626/pexels-photo-1557626.jpeg"
  },
  {
    id: 4,
    name: "GPS Navigation Device",
    category: "accessories",
    price: 399.99,
    description: "Rugged GPS with topographic maps and long battery life",
    image_url: "https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg"
  },
  {
    id: 5,
    name: "4-Season Mountain Tent",
    category: "hiking-gear",
    price: 549.99,
    description: "Lightweight tent designed for extreme weather conditions",
    image_url: "https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg"
  },
  {
    id: 6,
    name: "Safety Climbing Helmet",
    category: "accessories",
    price: 89.99,
    description: "Ultra-light helmet with superior impact protection",
    image_url: "https://images.pexels.com/photos/1687859/pexels-photo-1687859.jpeg"
  }
];

/*
SQL SCHEMA FOR FUTURE BACKEND IMPLEMENTATION:

-- Mountains Table
CREATE TABLE mountains (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    height INT NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    image_url TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products Table  
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    image_url TEXT,
    stock_quantity INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact Messages Table
CREATE TABLE contact_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users Table (for future user management)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Orders Table (for future e-commerce functionality)
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    shipping_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order Items Table
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Insert Sample Data
INSERT INTO mountains (name, location, height, difficulty, image_url, description) VALUES
('Mount Everest', 'Nepal/Tibet', 8848, 'Expert', 'https://images.pexels.com/photos/618833/pexels-photo-618833.jpeg', 'The world\'s highest peak'),
('K2', 'Pakistan/China', 8611, 'Expert', 'https://images.pexels.com/photos/1624438/pexels-photo-1624438.jpeg', 'The Savage Mountain'),
('Mont Blanc', 'France/Italy', 4809, 'Intermediate', 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg', 'Highest peak in Western Europe');

INSERT INTO categories (name, description) VALUES
('hiking-gear', 'Essential equipment for hiking and mountaineering'),
('shoes', 'Specialized footwear for mountain activities'),
('backpacks', 'Carrying solutions for outdoor adventures'),
('accessories', 'Additional gear and safety equipment');

INSERT INTO products (name, category, price, description, image_url) VALUES
('Professional Hiking Poles', 'hiking-gear', 129.99, 'Lightweight carbon fiber poles', 'https://images.pexels.com/photos/1266810/pexels-photo-1266810.jpeg'),
('Mountain Hiking Boots', 'shoes', 299.99, 'Waterproof leather boots', 'https://images.pexels.com/photos/1230669/pexels-photo-1230669.jpeg'),
('Alpine Backpack 65L', 'backpacks', 249.99, 'Multi-day expedition backpack', 'https://images.pexels.com/photos/1557626/pexels-photo-1557626.jpeg');
*/

// Performance optimization
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the application
  new AlpineAdventures();
  
  // Add loading completion class
  document.body.classList.add('loaded');
});

// Service Worker registration for potential PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Export for potential module usage
export { AlpineAdventures, mountainsData, productsData };


  // Smooth scroll for contact icon
  document.querySelectorAll('.scroll-to-contact').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector('#contact');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
