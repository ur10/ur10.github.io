// script.js
let images = document.querySelectorAll('.carousel img');
let index = 0;

setInterval(() => {
    images[index].style.display = 'none';
    index = (index + 1) % images.length;
    images[index].style.display = 'block';
}, 3000);
