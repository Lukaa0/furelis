
let audio;
let isPlaying = false;
let confettiInterval;
let fireworksInterval;


function getBrazilianDate() {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const brazilTime = new Date(utc + (-3 * 3600000));
    return brazilTime;
}


function isTodayBirthday() {
    const now = getBrazilianDate();
    return now.getMonth() === 5 && now.getDate() === 7; 
}


function initAudio() {
    return new Promise((resolve, reject) => {
        try {
            audio = new Audio('./music/furelise.mp3');
            audio.loop = true;
            audio.volume = 0.7;
            audio.preload = 'auto';
            
            
            audio.addEventListener('canplaythrough', () => {
                console.log('🎵 Audio is ready to play');
                resolve();
            });
            
            audio.addEventListener('loadeddata', () => {
                console.log('🎵 Audio loaded successfully');
            });
            
            audio.addEventListener('error', (e) => {
                console.error('🎵 Audio error:', e);
                
                resolve();
            });
            
            
            audio.load();
            
            
            setTimeout(() => {
                console.log('🎵 Audio loading timeout, proceeding anyway');
                resolve();
            }, 3000);
            
        } catch (error) {
            console.error('🎵 Error loading audio:', error);
            
            resolve();
        }
    });
}


function playBirthdayMusic() {
    if (!audio) {
        console.log('🎵 Audio not loaded, initializing...');
        initAudio().then(() => {
            setTimeout(playBirthdayMusic, 500);
        });
        return;
    }
    
    if (isPlaying) {
        console.log('🎵 Music already playing');
        return;
    }
    
    try {
        audio.currentTime = 0;
        audio.volume = 0.7;
        
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                isPlaying = true;
                console.log('🎵 Birthday music is now playing!');
                showMusicIndicator();
                updateMusicToggle();
            }).catch((error) => {
                console.log('🎵 Autoplay prevented:', error.message);
                showClickToPlayMusic();
            });
        }
    } catch (error) {
        console.error('🎵 Error playing audio:', error);
        showClickToPlayMusic();
    }
}

function stopBirthdayMusic() {
    if (audio && isPlaying) {
        audio.pause();
        isPlaying = false;
        console.log('🎵 Music stopped');
        updateMusicToggle();
        
        const indicator = document.getElementById('music-indicator');
        if (indicator) indicator.remove();
        
        const equalizer = document.getElementById('music-equalizer');
        if (equalizer) equalizer.remove();
    }
}

function toggleMusic() {
    if (isPlaying) {
        stopBirthdayMusic();
    } else {
        playBirthdayMusic();
    }
}

function updateMusicToggle() {
    const toggle = document.getElementById('music-toggle');
    if (toggle) {
        if (isPlaying) {
            toggle.classList.add('playing');
            toggle.title = 'Click to stop music';
        } else {
            toggle.classList.remove('playing');
            toggle.title = 'Click to play music';
        }
    }
}

function initMusicToggle() {
    const toggle = document.getElementById('music-toggle');
    if (toggle) {
        toggle.addEventListener('click', toggleMusic);
        updateMusicToggle();
    }
}


function showMusicIndicator() {
    
    const existing = document.getElementById('music-indicator');
    if (existing) existing.remove();
    
    const indicator = document.createElement('div');
    indicator.id = 'music-indicator';
    indicator.innerHTML = '🎵 MUSIC PLAYING! 🎵';
    indicator.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1);
        background-size: 300% 300%;
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        font-size: 16px;
        font-weight: bold;
        z-index: 10000;
        box-shadow: 0 0 30px rgba(255,255,255,0.5);
        animation: mega-pulse 1s infinite, gradient-shift 3s ease-in-out infinite;
        border: 2px solid rgba(255,255,255,0.8);
    `;
    document.body.appendChild(indicator);
    
    
    createMusicalEqualizer();
}


function showClickToPlayMusic() {
    
    const existingBtn = document.getElementById('play-music-btn');
    if (existingBtn) existingBtn.remove();
    
    const button = document.createElement('button');
    button.innerHTML = '🎵 CLICK FOR MUSIC, IT DOESNT WORK AUTOMATICALLY! 🎵';
    button.id = 'play-music-btn';
    button.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
        background-size: 400% 400%;
        color: white;
        border: none;
        padding: 25px 45px;
        font-size: 20px;
        font-weight: bold;
        border-radius: 50px;
        cursor: pointer;
        z-index: 10001;
        animation: mega-pulse 1s infinite, rainbow-flow 3s ease-in-out infinite;
        box-shadow: 0 0 50px rgba(255,255,255,0.8);
        border: 3px solid rgba(255,255,255,0.9);
        text-shadow: 0 2px 10px rgba(0,0,0,0.5);
    `;
    
    button.onclick = () => {
        if (audio) {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    isPlaying = true;
                    console.log('🎵 Birthday music is now playing!');
                    showMusicIndicator();
                    button.remove();
                }).catch((error) => {
                    console.error('🎵 Still could not play audio:', error);
                    button.innerHTML = '🎵 Audio unavailable, but party continues! 🎉';
                    setTimeout(() => button.remove(), 3000);
                });
            }
        } else {
            console.log('🎵 Audio not loaded, trying to initialize...');
            initAudio().then(() => {
                playBirthdayMusic();
                button.remove();
            });
        }
    };
    
    document.body.appendChild(button);
}


function startMusicOnInteraction() {
    if (isTodayBirthday() && !isPlaying) {
        playBirthdayMusic();
    }
    
    document.removeEventListener('click', startMusicOnInteraction);
    document.removeEventListener('keydown', startMusicOnInteraction);
    document.removeEventListener('touchstart', startMusicOnInteraction);
}


class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.fireworks = [];
        this.resize();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 2,
            opacity: Math.random() * 0.5 + 0.2,
            color: isTodayBirthday() ? 
                `hsl(${Math.random() * 360}, 70%, 60%)` : 
                `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`
        };
    }
    
    createFirework(x, y) {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#fd79a8'];
        for (let i = 0; i < 15; i++) {
            this.fireworks.push({
                x: x,
                y: y,
                speedX: (Math.random() - 0.5) * 10,
                speedY: (Math.random() - 0.5) * 10,
                size: Math.random() * 3 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 60,
                maxLife: 60
            });
        }
    }
    
    update() {
        
        const targetCount = isTodayBirthday() ? 150 : 50;
        while (this.particles.length < targetCount) {
            this.particles.push(this.createParticle());
        }
        
        
        this.particles.forEach((particle, index) => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
        });
        
        
        this.fireworks.forEach((fw, index) => {
            fw.x += fw.speedX;
            fw.y += fw.speedY;
            fw.speedY += 0.2; 
            fw.life--;
            
            if (fw.life <= 0) {
                this.fireworks.splice(index, 1);
            }
        });
        
        
        if (isTodayBirthday() && Math.random() < 0.02) {
            this.createFirework(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height * 0.6
            );
        }
    }
    
    draw() {
        
        this.ctx.fillStyle = 'rgba(10, 10, 30, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = particle.color;
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        
        this.fireworks.forEach(fw => {
            this.ctx.beginPath();
            this.ctx.globalAlpha = fw.life / fw.maxLife;
            this.ctx.fillStyle = fw.color;
            this.ctx.arc(fw.x, fw.y, fw.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        this.ctx.globalAlpha = 1;
    }
    
    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}


class BirthdayRain {
    constructor() {
        this.container = document.getElementById('birthday-rain');
        this.emojis = ['🎉', '🎂', '🎈', '🎊', '✨', '🎁', '🇧🇷', '🌟', '💫', '🎵', '🎭', '🌈', '💝', '🎪'];
        this.isActive = false;
    }
    
    start() {
        if (this.isActive) return;
        this.isActive = true;
        this.createRain();
    }
    
    stop() {
        this.isActive = false;
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
    
    createRain() {
        if (!this.isActive || !this.container) return;
        
        const raindrop = document.createElement('div');
        raindrop.textContent = this.emojis[Math.floor(Math.random() * this.emojis.length)];
        raindrop.className = 'birthday-raindrop';
        raindrop.style.cssText = `
            position: absolute;
            font-size: ${Math.random() * 25 + 20}px;
            left: ${Math.random() * 100}%;
            top: -50px;
            animation: birthday-rain-fall ${Math.random() * 3 + 2}s linear forwards;
            z-index: 1000;
            pointer-events: none;
            transform: rotate(${Math.random() * 360}deg);
        `;
        
        this.container.appendChild(raindrop);
        
        setTimeout(() => {
            if (raindrop.parentNode) {
                raindrop.parentNode.removeChild(raindrop);
            }
        }, 5000);
        
        if (this.isActive) {
            setTimeout(() => this.createRain(), Math.random() * 200 + 100);
        }
    }
}


class MessageCarousel {
    constructor() {
        this.messages = document.querySelectorAll('.birthday-message');
        this.currentIndex = 0;
        this.isActive = false;
    }
    
    start() {
        if (this.isActive || this.messages.length === 0) return;
        this.isActive = true;
        this.showNext();
    }
    
    showNext() {
        if (!this.isActive) return;
        
        this.messages.forEach(msg => msg.classList.remove('active'));
        this.messages[this.currentIndex].classList.add('active');
        this.currentIndex = (this.currentIndex + 1) % this.messages.length;
        
        setTimeout(() => this.showNext(), 3000);
    }
}


function createFloatingImages() {
    const images = ['imgs/charlixcx.png', 'imgs/succession.png', 'imgs/taylor-swift.jpg', 'imgs/brazil.svg', 'imgs/cmbyn.jpg'];
    
    
    document.querySelectorAll('.floating-img').forEach(img => img.remove());
    
    for (let i = 0; i < 12; i++) {
        const img = document.createElement('img');
        img.src = images[i % images.length];
        img.className = 'floating-img';
        
        
        const startX = Math.random() * (window.innerWidth - 80);
        const startY = Math.random() * (window.innerHeight - 80);
        
        img.style.cssText = `
            position: fixed;
            width: ${60 + Math.random() * 40}px;
            height: ${60 + Math.random() * 40}px;
            border-radius: 50%;
            object-fit: cover;
            z-index: 2;
            opacity: 0.8;
            pointer-events: none;
            left: ${startX}px;
            top: ${startY}px;
            animation: epic-float-${(i % 8) + 1} ${6 + Math.random() * 8}s ease-in-out infinite;
            animation-delay: ${Math.random() * 3}s;
            filter: brightness(1.1) saturate(1.2);
            box-shadow: 0 0 20px rgba(255,255,255,0.3);
        `;
        
        
        img.addEventListener('click', (e) => {
            e.target.style.animation = 'spin 0.5s ease-in-out';
            setTimeout(() => {
                e.target.style.animation = img.style.animation;
            }, 500);
        });
        
        document.body.appendChild(img);
    }
}


function createConfettiExplosion(x, y) {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#fd79a8', '#a29bfe', '#6c5ce7'];
    
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.cssText = `
            position: fixed;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${x}px;
            top: ${y}px;
            z-index: 10000;
            pointer-events: none;
            animation: confetti-explosion ${Math.random() * 2 + 1}s ease-out forwards;
            transform: rotate(${Math.random() * 360}deg);
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, 3000);
    }
}


function addClickEffects() {
    document.addEventListener('click', (e) => {
        if (isTodayBirthday()) {
            createConfettiExplosion(e.clientX, e.clientY);
            
            
            if (Math.random() < 0.5) {
                createSpectacularFireworks(e.clientX, e.clientY);
            }
            
            
            const ripple = document.createElement('div');
            ripple.className = 'click-ripple';
            ripple.style.cssText = `
                position: fixed;
                width: 0px;
                height: 0px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%);
                left: ${e.clientX}px;
                top: ${e.clientY}px;
                z-index: 9999;
                pointer-events: none;
                animation: ripple-effect 0.6s ease-out forwards;
            `;
            
            document.body.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
            
            
            if (Math.random() < 0.3) {
                createFloatingWords();
            }
        }
    });
}


function updateCountdown() {
    const now = getBrazilianDate();
    let targetYear = now.getFullYear();
    let target = new Date(targetYear, 5, 7, 0, 0, 0, 0); 
    
    
    if (now > target) {
        target = new Date(targetYear + 1, 5, 7, 0, 0, 0, 0);
    }
    
    const diff = target - now;
    
    if (diff <= 0) {
        showBirthdayMode();
        return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}


function showCountdownMode() {
    document.getElementById('countdown-mode').classList.remove('hidden');
    document.getElementById('birthday-mode').classList.add('hidden');
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function showBirthdayMode() {
    document.getElementById('countdown-mode').classList.add('hidden');
    document.getElementById('birthday-mode').classList.remove('hidden');
    
    
    document.body.classList.add('birthday-mode');
    
    
    const rain = new BirthdayRain();
    rain.start();
    
    const carousel = new MessageCarousel();
    carousel.start();
      
    setTimeout(() => {
        triggerScreenGlitch();
        createCosmicParticles();
        addRainbowBorders();
        chaosifyBirthdayMessages();
        unleashEmojiChaos();
        createLaserBeams();
        createNeonWaves();
        createScreenFragments();
    }, 1000);
    
    
    setTimeout(() => {
        createDiscoBall();
        createMatrixRain();
    }, 3000);
    
    
    confettiInterval = setInterval(() => {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight * 0.5;
        createConfettiExplosion(x, y);
        
        
        if (Math.random() < 0.3) {
            triggerScreenGlitch();
        }
        
        
        if (Math.random() < 0.2) {
            createLaserBeams();
        }
        if (Math.random() < 0.15) {
            createNeonWaves();
        }
        if (Math.random() < 0.1) {
            createScreenFragments();
        }
    }, 3000);
    
    
    setTimeout(() => {
        playBirthdayMusic();
    }, 1000);
}




function triggerScreenGlitch() {
    const glitchOverlay = document.createElement('div');
    glitchOverlay.className = 'glitch-overlay';
    glitchOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        pointer-events: none;
        background: linear-gradient(45deg, 
            rgba(255,0,0,0.1) 0%, 
            rgba(0,255,0,0.1) 25%, 
            rgba(0,0,255,0.1) 50%, 
            rgba(255,255,0,0.1) 75%, 
            rgba(255,0,255,0.1) 100%);
        animation: glitch-chaos 0.3s ease-in-out;
        opacity: 0;
    `;
    
    document.body.appendChild(glitchOverlay);
    
    setTimeout(() => {
        glitchOverlay.style.opacity = '1';
        setTimeout(() => {
            glitchOverlay.style.opacity = '0';
            setTimeout(() => {
                if (glitchOverlay.parentNode) {
                    glitchOverlay.parentNode.removeChild(glitchOverlay);
                }
            }, 300);
        }, 100);
    }, 10);
}


function createMusicalEqualizer() {
    const existingEqualizer = document.getElementById('music-equalizer');
    if (existingEqualizer) return;

    const equalizer = document.createElement('div');
    equalizer.id = 'music-equalizer';
    equalizer.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        display: flex;
        gap: 3px;
        z-index: 10000;
        pointer-events: none;
    `;
    
    for (let i = 0; i < 10; i++) {
        const bar = document.createElement('div');
        bar.style.cssText = `
            width: 6px;
            height: ${Math.random() * 40 + 10}px;
            background: linear-gradient(to top, #ff6b6b, #4ecdc4, #45b7d1);
            border-radius: 3px;
            animation: equalizer-bar ${Math.random() * 0.5 + 0.3}s ease-in-out infinite alternate;
            animation-delay: ${Math.random() * 0.5}s;
        `;
        equalizer.appendChild(bar);
    }
    
    document.body.appendChild(equalizer);
}


function addRainbowBorders() {
    const elements = document.querySelectorAll('.time-unit, .birthday-img, .birthday-content');
    elements.forEach((el, index) => {
        el.style.border = '3px solid transparent';
        el.style.background = `linear-gradient(45deg, white, white) padding-box, 
                               linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7, #fd79a8) border-box`;
        el.style.animation += `, rainbow-border-${index % 3 + 1} 2s ease-in-out infinite`;
    });
}


function explodeText(element) {
    const text = element.textContent;
    element.innerHTML = '';
    
    text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.cssText = `
            display: inline-block;
            animation: text-explosion 0.8s ease-out forwards;
            animation-delay: ${index * 0.05}s;
            transform: scale(0) rotate(180deg);
        `;
        element.appendChild(span);
    });
}


function createCosmicParticles() {
    const cosmicContainer = document.createElement('div');
    cosmicContainer.id = 'cosmic-particles';
    cosmicContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        pointer-events: none;
        overflow: hidden;
    `;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 1}px;
            height: ${Math.random() * 4 + 1}px;
            background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: cosmic-drift ${Math.random() * 20 + 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        cosmicContainer.appendChild(particle);
    }
    
    document.body.appendChild(cosmicContainer);
}


function chaosifyBirthdayMessages() {
    const messages = document.querySelectorAll('.birthday-message h2');
    messages.forEach((msg, index) => {
        msg.addEventListener('mouseover', () => {
            explodeText(msg);
            triggerScreenGlitch();
        });
        
        
        setTimeout(() => {
            setInterval(() => {
                if (msg.parentElement.classList.contains('active')) {
                    triggerScreenGlitch();
                }
            }, 5000 + index * 1000);
        }, index * 2000);
    });
}


function unleashEmojiChaos() {
    const chaosEmojis = ['💥', '⚡', '🌪️', '🎆', '🎇', '✨', '💫', '🌟', '🔥', '💎', '🌈', '🎭', '🎪', '🎨'];
    
    setInterval(() => {
        if (isTodayBirthday()) {
            for (let i = 0; i < 5; i++) {
                const emoji = document.createElement('div');
                emoji.textContent = chaosEmojis[Math.floor(Math.random() * chaosEmojis.length)];
                emoji.style.cssText = `
                    position: fixed;
                    font-size: ${Math.random() * 30 + 20}px;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    z-index: 1001;
                    pointer-events: none;
                    animation: emoji-chaos ${Math.random() * 3 + 2}s ease-out forwards;
                `;
                
                document.body.appendChild(emoji);
                
                setTimeout(() => {
                    if (emoji.parentNode) {
                        emoji.parentNode.removeChild(emoji);
                    }
                }, 5000);
            }
        }
    }, 2000);
}


function createSpectacularFireworks(x, y) {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#fd79a8', '#a29bfe', '#6c5ce7', '#ff9ff3', '#74b9ff'];
    
    
    for (let i = 0; i < 50; i++) {
        const firework = document.createElement('div');
        firework.className = 'firework-particle';
        
        const angle = (i / 50) * Math.PI * 2;
        const velocity = Math.random() * 150 + 100;
        const size = Math.random() * 6 + 3;
        
        firework.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            z-index: 10000;
            pointer-events: none;
            box-shadow: 0 0 20px currentColor;
            animation: firework-explosion ${1.5 + Math.random() * 0.5}s ease-out forwards;
        `;
        
        
        firework.style.setProperty('--end-x', `${Math.cos(angle) * velocity}px`);
        firework.style.setProperty('--end-y', `${Math.sin(angle) * velocity}px`);
        
        document.body.appendChild(firework);
        
        setTimeout(() => {
            if (firework.parentNode) {
                firework.parentNode.removeChild(firework);
            }
        }, 2000);
    }
    
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: white;
                border-radius: 50%;
                left: ${x + (Math.random() - 0.5) * 100}px;
                top: ${y + (Math.random() - 0.5) * 100}px;
                z-index: 9999;
                pointer-events: none;
                animation: sparkle-fade 1s ease-out forwards;
                box-shadow: 0 0 10px white;
            `;
            document.body.appendChild(sparkle);
            
            setTimeout(() => {
                if (sparkle.parentNode) sparkle.parentNode.removeChild(sparkle);
            }, 1000);
        }, i * 50);
    }
}


function createPulsingBorders() {
    const elements = document.querySelectorAll('.birthday-img, .time-unit');
    elements.forEach((el, index) => {
        el.style.border = '4px solid transparent';
        el.style.background = `${el.style.background || 'rgba(255,255,255,0.1)'} padding-box, 
                               conic-gradient(from ${index * 60}deg, 
                                   #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, 
                                   #ffeaa7, #fd79a8, #a29bfe, #6c5ce7, #ff6b6b) border-box`;
        el.style.animation += `, border-pulse ${2 + index * 0.3}s ease-in-out infinite`;
    });
}


function createFloatingWords() {
    const words = ['BIRTHDAY!', 'PARTY!', 'CELEBRATION!', 'JOY!', 'HAPPINESS!', 'AMAZING!', 'WONDERFUL!'];
    
    for (let i = 0; i < 3; i++) {
        const word = document.createElement('div');
        word.textContent = words[Math.floor(Math.random() * words.length)];
        word.style.cssText = `
            position: fixed;
            font-size: ${30 + Math.random() * 20}px;
            font-weight: bold;
            color: transparent;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
            -webkit-background-clip: text;
            background-clip: text;
            left: ${Math.random() * (window.innerWidth - 200)}px;
            top: ${window.innerHeight + 50}px;
            z-index: 1001;
            pointer-events: none;
            animation: float-up ${3 + Math.random() * 2}s ease-out forwards;
            text-shadow: 0 0 20px rgba(255,255,255,0.5);
        `;
        
        document.body.appendChild(word);
        
        setTimeout(() => {
            if (word.parentNode) word.parentNode.removeChild(word);
        }, 5000);
    }
}


document.addEventListener('DOMContentLoaded', async () => {
    console.log('🎉 Birthday app loading...');
    
    
    try {
        await initAudio();
        console.log('🎵 Audio initialization complete');
    } catch (error) {
        console.error('🎵 Audio initialization failed:', error);
        setTimeout(() => showClickToPlayMusic(), 2000);
    }
    
    
    initMusicToggle();
    
    
    document.addEventListener('click', startMusicOnInteraction);
    document.addEventListener('keydown', startMusicOnInteraction);
    document.addEventListener('touchstart', startMusicOnInteraction);
    
    
    addClickEffects();
    
    
    const canvas = document.getElementById('particles');
    if (canvas) {
        const particleSystem = new ParticleSystem(canvas);
        particleSystem.animate();
    }
    
    
    createFloatingImages();
    
    
    if (isTodayBirthday()) {
        console.log('🎉 HAPPY BIRTHDAY MODE ACTIVATED! 🎉');
        showBirthdayMode();
    } else {
        console.log('⏰ Countdown mode activated');
        showCountdownMode();
    }
});


window.addEventListener('resize', () => {
    setTimeout(createFloatingImages, 100);
});


function createLaserBeams() {
    for (let i = 0; i < 3; i++) {
        const laser = document.createElement('div');
        laser.className = 'laser-beam';
        laser.style.cssText = `
            position: fixed;
            width: 2px;
            height: 100vh;
            background: linear-gradient(to bottom, 
                transparent 0%, 
                #ff006a 20%, 
                #ff4081 50%, 
                #ff006a 80%, 
                transparent 100%);
            left: ${Math.random() * 100}%;
            top: 0;
            z-index: 1001;
            pointer-events: none;
            animation: laser-sweep 3s ease-in-out;
            box-shadow: 0 0 20px #ff006a;
            transform-origin: center;
        `;
        
        document.body.appendChild(laser);
        
        setTimeout(() => {
            if (laser.parentNode) laser.parentNode.removeChild(laser);
        }, 3000);
    }
}


function createMatrixRain() {
    const characters = ['0', '1', 'ユ', 'カ', 'タ', 'ナ', 'ハ', 'マ', 'ヤ', 'ラ', 'ワ'];
    
    for (let i = 0; i < 20; i++) {
        const char = document.createElement('div');
        char.textContent = characters[Math.floor(Math.random() * characters.length)];
        char.style.cssText = `
            position: fixed;
            font-family: monospace;
            font-size: ${Math.random() * 20 + 15}px;
            color: #00ff41;
            left: ${Math.random() * 100}%;
            top: -50px;
            z-index: 1001;
            pointer-events: none;
            animation: matrix-fall ${Math.random() * 3 + 2}s linear;
            text-shadow: 0 0 10px #00ff41;
        `;
        
        document.body.appendChild(char);
        
        setTimeout(() => {
            if (char.parentNode) char.parentNode.removeChild(char);
        }, 5000);
    }
}


function createDiscoBall() {
    const existing = document.getElementById('disco-ball');
    if (existing) return;
    
    const disco = document.createElement('div');
    disco.id = 'disco-ball';
    disco.style.cssText = `
        position: fixed;
        width: 80px;
        height: 80px;
        background: conic-gradient(from 0deg, 
            #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, 
            #ffeaa7, #fd79a8, #a29bfe, #6c5ce7, #ff6b6b);
        border-radius: 50%;
        left: 50%;
        top: 10%;
        z-index: 1002;
        pointer-events: none;
        animation: disco-spin 2s linear infinite, disco-bounce 3s ease-in-out infinite;
        box-shadow: 0 0 50px rgba(255,255,255,0.8);
        transform: translateX(-50%);
    `;
    
    for (let i = 0; i < 20; i++) {
        const sparkle = document.createElement('div');
        sparkle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: white;
            border-radius: 50%;
            left: ${Math.random() * 80}px;
            top: ${Math.random() * 80}px;
            animation: sparkle ${Math.random() * 2 + 1}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        disco.appendChild(sparkle);
    }
    
    document.body.appendChild(disco);
    
    setTimeout(() => {
        if (disco.parentNode) disco.parentNode.removeChild(disco);
    }, 10000);
}


function createNeonWaves() {
    for (let i = 0; i < 5; i++) {
        const wave = document.createElement('div');
        wave.style.cssText = `
            position: fixed;
            width: 50px;
            height: 50px;
            border: 3px solid #00ffff;
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            z-index: 1001;
            pointer-events: none;
            animation: neon-expand 2s ease-out;
            box-shadow: 0 0 20px #00ffff, inset 0 0 20px #00ffff;
        `;
        
        document.body.appendChild(wave);
        
        setTimeout(() => {
            if (wave.parentNode) wave.parentNode.removeChild(wave);
        }, 2000);
    }
}


function createScreenFragments() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'];
    
    for (let i = 0; i < 10; i++) {
        const fragment = document.createElement('div');
        fragment.style.cssText = `
            position: fixed;
            width: ${Math.random() * 50 + 20}px;
            height: ${Math.random() * 50 + 20}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            z-index: 1001;
            pointer-events: none;
            animation: fragment-chaos ${Math.random() * 3 + 2}s ease-out;
            clip-path: polygon(20% 0%, 80% 0%, 100% 60%, 80% 100%, 20% 100%, 0% 60%);
            box-shadow: 0 0 20px currentColor;
        `;
        
        document.body.appendChild(fragment);
        
        setTimeout(() => {
            if (fragment.parentNode) fragment.parentNode.removeChild(fragment);
        }, 5000);
    }
}
