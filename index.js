import  './scss/main.scss'
import Slideshow from './components/Slideshow';

document.addEventListener("DOMContentLoaded", function(event) {
  let slider = new Slideshow(document.querySelector('.Slideshow'))
  slider.on('afterNext', () => console.log('after next') )
});
