const quotes = [
    {
        text: "Cultivo una rosa blanca en junio como en enero, para el amigo sincero que me da su mano franca.",
        author: "José Martí"
    },
    {
        text: "Dame la mano y danzaremos; dame la mano y me amarás. Como una sola flor seremos.",
        author: "Gabriela Mistral"
    },
    {
        text: "La amistad es un alma que habita en dos cuerpos; un corazón que habita en dos almas.",
        author: "Aristóteles"
    },
    {
        text: "Una amiga es alguien que conoce la canción de tu corazón y puede cantarla cuando a ti se te olvida la letra.",
        author: "Anónimo"
    },
    {
        text: "Amiga mía, tú justificas mi existencia: si no te conozco, no he vivido.",
        author: "Luis Cernuda (adaptado)"
    },
    {
        text: "La amistad duplica las alegrías y divide las angustias por la mitad.",
        author: "Francis Bacon"
    },
    {
        text: "Caminando con una amiga en la oscuridad es mejor que caminar sola en la luz.",
        author: "Helen Keller"
    },
    {
        text: "No camines detrás de mí, tal vez no te guíe. No camines delante de mí, tal vez no te siga. Solo camina a mi lado.",
        author: "Albert Camus"
    },
    {
        text: "Las flores de mi jardín florecen con tu risa, amiga del alma.",
        author: "Verso Popular"
    },
    {
        text: "Tu amistad es el regalo que no sabía que necesitaba, pero que ahora no puedo soltar.",
        author: "Anónimo"
    }
];

const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const nextBtn = document.getElementById('next-quote');
const heartsContainer = document.getElementById('hearts-container');
const musicBtn = document.getElementById('music-toggle');
const musicIcon = document.getElementById('music-icon');
const welcomeOverlay = document.getElementById('welcome-overlay');
const startBtn = document.getElementById('start-btn');
const card = document.getElementById('main-card');
const bgMusic = document.getElementById('bg-music');

let currentQuoteIndex = -1;
let isTyping = false;
let musicStarted = false;
let typingTimeout;

// EXPERIENCE START
startBtn.addEventListener('click', () => {
    welcomeOverlay.classList.add('fade-out');
    document.body.classList.remove('is-loading');

    // Play local audio
    if (bgMusic) {
        bgMusic.play().then(() => {
            musicIcon.innerText = '🔊';
            musicStarted = true;
        }).catch(err => {
            console.error("Error playing audio:", err);
        });
    }
});

// TYPEWRITER
function typeWriter(text, element) {
    if (typingTimeout) clearTimeout(typingTimeout);
    isTyping = true;
    element.innerHTML = '<span class="typewriter"></span>';
    const span = element.querySelector('.typewriter');
    let i = 0;

    function step() {
        if (i < text.length) {
            span.textContent += text.charAt(i);
            i++;
            typingTimeout = setTimeout(step, 40);
        } else {
            isTyping = false;
        }
    }
    step();
}

function displayNextQuote() {
    let nextIndex;
    do {
        nextIndex = Math.floor(Math.random() * quotes.length);
    } while (nextIndex === currentQuoteIndex);

    currentQuoteIndex = nextIndex;
    const quote = quotes[currentQuoteIndex];

    quoteAuthor.style.transition = 'none';
    quoteAuthor.style.opacity = '0';

    setTimeout(() => {
        typeWriter(`"${quote.text}"`, quoteText);

        const duration = (quote.text.length * 40) + 400;
        setTimeout(() => {
            if (currentQuoteIndex === nextIndex) {
                quoteAuthor.textContent = quote.author;
                quoteAuthor.style.transition = 'opacity 1.5s ease';
                quoteAuthor.style.opacity = '1';
            }
        }, duration);
    }, 200);
}

// PARALLAX (Desktop only)
if (window.matchMedia("(hover: hover)").matches) {
    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth / 2 - e.pageX) / 30;
        const y = (window.innerHeight / 2 - e.pageY) / 30;
        card.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
    });
}

// HEARTS
function createHeart(x, y) {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = '♥';

    const isCustom = x !== undefined;
    heart.style.left = isCustom ? `${x}px` : `${Math.random() * 100}vw`;
    heart.style.top = isCustom ? `${y}px` : '110vh';

    const size = Math.random() * 20 + 10;
    heart.style.fontSize = `${size}px`;
    heart.style.opacity = Math.random() * 0.5 + 0.3;
    heart.style.animationDuration = `${Math.random() * 3 + 4}s`;

    heartsContainer.appendChild(heart);
    setTimeout(() => heart.remove(), 7000);
}

// INTERACTION
document.addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON' && musicStarted) {
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                createHeart(e.clientX + (Math.random() * 60 - 30), e.clientY + (Math.random() * 60 - 30));
            }, i * 60);
        }
    }
});

musicBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!bgMusic) return;

    if (bgMusic.paused) {
        bgMusic.play();
        musicIcon.innerText = '🔊';
    } else {
        bgMusic.pause();
        musicIcon.innerText = '🔇';
    }
});

nextBtn.addEventListener('click', displayNextQuote);

// COUNTDOWN
function updateCountdown() {
    const now = new Date();
    let target = new Date(now.getFullYear(), 1, 14); // Feb 14
    if (now > target) target.setFullYear(now.getFullYear() + 1);

    const diff = target - now;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    document.getElementById('days').innerText = d.toString().padStart(2, '0');
    document.getElementById('hours').innerText = h.toString().padStart(2, '0');
    document.getElementById('mins').innerText = m.toString().padStart(2, '0');
    document.getElementById('secs').innerText = s.toString().padStart(2, '0');
}

// INIT
displayNextQuote();
setInterval(updateCountdown, 1000);
updateCountdown();
setInterval(() => createHeart(), 600);
setInterval(displayNextQuote, 15000);
