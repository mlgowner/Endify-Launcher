const carousel = document.querySelector('.carousel');
const items = Array.from(carousel.children);
const container = document.queryselector('.carousel-container');

function updatePositions() {
    const centerY = container.offsetHeight / 2;
    items.forEach(item => {
        item.style.position = 'absolute';
        item.style.width = '100%';
        item.style.left = '50%';
        item.style.transform = `translateX(-50%) translateY(${centerY - item.offsetHeight / 2}px)`;
    });
}

updatePositions();
window.onresize = updatePositions;
