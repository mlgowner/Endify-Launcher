const carousel = document.querySelector('.carousel');
const items = Array.from(carousel.children);
const container = document.querySelector('.carousel-container');
let currentIndex = 0;

function updatePositions() {
    const centerX = container.offsetWidth / 2;
    const centerY = container.offsetHeight / 2;

    items.forEach((item, index) => {
        const pos = (index - currentIndex + items.length) % items.length;
        const angle = (pos * 120 - 60) * (Math.PI / 180); // 120 градусов между позициями
        const radius = 200; // Радиус вращения

        if (pos === 0) {
            item.dataset.position = 'center';
            item.style.transform = `translate(${centerX - item.offsetWidth / 2}px, ${centerY - item.offsetHeight / 2}px) translateZ(150px) scale(1.2)`;
        } else if (pos === 1) {
            item.dataset.position = 'right';
            item.style.transform = `translate(${centerX - item.offsetWidth / 2 + radius * Math.cos(angle + Math.PI / 6)}px, ${centerY - item.offsetHeight / 2 + radius * Math.sin(angle + Math.PI / 6) + 50}px) rotateY(-60deg)`;
        } else if (pos === items.length - 1) {
            item.dataset.position = 'left';
            item.style.transform = `translate(${centerX - item.offsetWidth / 2 + radius * Math.cos(angle - Math.PI / 6)}px, ${centerY - item.offsetHeight / 2 + radius * Math.sin(angle - Math.PI / 6) + 50}px) rotateY(60deg)`;
        } else {
            item.dataset.position = 'back';
            item.style.transform = `translate(${centerX - item.offsetWidth / 2}px, ${centerY - item.offsetHeight / 2}px) translateZ(-200px) scale(0.8)`;
        }
        item.style.opacity = pos === 0 ? 1 : pos === 1 || pos === items.length - 1 ? 0.7 : 0.5;
        item.style.zIndex = pos === 0 ? 3 : pos === 1 || pos === items.length - 1 ? 2 : 1;
    });
}

function rotateCarousel() {
    currentIndex = (currentIndex + 1) % items.length;
    updatePositions();
}

updatePositions();
setInterval(rotateCarousel, 5000);
