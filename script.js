const carousel = document.querySelector('.carousel');
const items = Array.from(carousel.children);
let currentIndex = 0;

function updatePositions() {
    items.forEach((item, index) => {
        const pos = (index - currentIndex + items.length) % items.length;
        if (pos === 0) {
            item.dataset.position = 'center';
        } else if (pos === 1) {
            item.dataset.position = 'right';
        } else if (pos === items.length - 1) {
            item.dataset.position = 'left';
        } else {
            item.dataset.position = 'back';
        }
    });
}

function rotateCarousel() {
    currentIndex = (currentIndex + 1) % items.length;
    carousel.style.transform = `rotateY(${currentIndex * -60}deg)`;
    updatePositions();
}

updatePositions();
setInterval(rotateCarousel, 5000);
