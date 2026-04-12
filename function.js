// 1. SELECTORS
const navContainer = document.querySelector(".nav-container");
const navLinks = document.getElementById("nav-links");
const hamburger = document.getElementById("hamburger");
const toggleSwitch = document.querySelector('#checkbox');
const videoElement = document.querySelector('#bg-video');
const videoSource = document.querySelector('#bg-video source');

// 2. NAVBAR SCROLL ANIMATION
window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        navContainer.classList.add("scrolled");
    } else {
        navContainer.classList.remove("scrolled");
    }
});

// 3. HAMBURGER MENU TOGGLE
hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links button').forEach(button => {
    button.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// 4. THEME & VIDEO SWITCHER logic
const darkVideo = "assets/dark-bg.mp4";
const lightVideo = "assets/light-bg.mp4";

function updateVideo(src) {
    if (videoSource && videoElement) {
        videoSource.src = src;
        videoElement.load();
        videoElement.play(); 
    }
}

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        updateVideo(lightVideo);
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        updateVideo(darkVideo);
    }    
}

// Initialization
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'light') {
        toggleSwitch.checked = true;
        updateVideo(lightVideo);
    }
}

toggleSwitch.addEventListener('change', switchTheme, false);

// 5. COUNTER ANIMATION (Keep your existing logic)
const startCounter = (el, target) => {
    let current = 0;
    const increment = target / 100;
    el.classList.add('is-rolling'); 
    const updateCount = () => {
        if (current < target) {
            current += increment;
            el.innerText = Math.ceil(current).toLocaleString();
            setTimeout(updateCount, 20);
        } else {
            el.innerText = target.toLocaleString();
            el.classList.remove('is-rolling'); 
        }
    };
    updateCount();
};

// Intersection Observer for Counters
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const numEl = entry.target.querySelector('.counter-number');
            const target = parseInt(numEl.getAttribute('data-target'));
            startCounter(numEl, target);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.counter-card').forEach(card => observer.observe(card));

// ==========================================
// 6. MODAL & LIVE DEMO LOGIC (Video + HTML)
// ==========================================
const demoLinks = document.querySelectorAll('.demo-link[data-url]');
const modalOverlay = document.getElementById('demo-modal');
const modalBody = modalOverlay ? modalOverlay.querySelector('.modal-body') : null;
const closeModalBtn = document.getElementById('close-modal');

if (modalOverlay && modalBody && closeModalBtn) {
    
    demoLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const url = link.getAttribute('data-url');
            
            // Clear previous content
            modalBody.innerHTML = ''; 

            if (url.toLowerCase().endsWith('.mp4') || url.toLowerCase().endsWith('.mov')) {
                // 1. Create Video Element if URL is a video
                const videoPlayer = document.createElement('video');
                videoPlayer.src = url;
                videoPlayer.controls = true;
                videoPlayer.autoplay = true;
                videoPlayer.style.width = "100%";
                videoPlayer.style.height = "100%";
                videoPlayer.style.borderRadius = "10px";
                modalBody.appendChild(videoPlayer);
            } else {
                // 2. Create Iframe if URL is an HTML page
                const iframe = document.createElement('iframe');
                iframe.src = url;
                iframe.style.width = "100%";
                iframe.style.height = "100%";
                iframe.style.border = "none";
                modalBody.appendChild(iframe);
            }

            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeModal = () => {
        modalOverlay.classList.remove('active');
        modalBody.innerHTML = ''; // Stops video/audio immediately
        document.body.style.overflow = 'auto';
    };

    closeModalBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
}