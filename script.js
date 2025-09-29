const carousel = document.querySelector('.carousel');
const items = Array.from(carousel.children);
const container = document.querySelector('.carousel-container');
let currentIndex = 0;

function updatePositions() {
    const centerX = container.offsetWidth / 2;
    const centerY = container.offsetHeight / 2;

    items.forEach((item, index) => {
        const pos = (index - currentIndex + items.length) % items.length;
        if (pos === 0) {
            item.dataset.position = 'center';
            item.style.transform = `translate(${centerX - item.offsetWidth / 2}px, ${centerY - item.offsetHeight / 2}px) translateZ(150px) scale(1.2)`;
            item.style.opacity = 1;
            item.style.zIndex = 13;
        } else if (pos === 1) {
            item.dataset.position = 'right';
            item.style.transform = `translate(${centerX - item.offsetWidth / 2 + 300}px, ${centerY - item.offsetHeight / 2 + 50}px) rotateY(-15deg)`;
            item.style.opacity = 0.7;
            item.style.zIndex = 11;
        } else if (pos === 2) {
            item.dataset.position = 'left';
            item.style.transform = `translate(${centerX - item.offsetWidth / 2 - 300}px, ${centerY - item.offsetHeight / 2 + 50}px) rotateY(15deg)`;
            item.style.opacity = 0.7;
            item.style.zIndex = 11;
        } else {
            item.style.transform = 'none';
            item.style.opacity = 0;
            item.style.zIndex = 0;
        }
    });
}

function rotateCarousel() {
    currentIndex = (currentIndex + 1) % items.length;
    updatePositions();
}

updatePositions();
setInterval(rotateCarousel, 5000);
window.onresize = updatePositions;
