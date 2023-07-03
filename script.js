'use strict';

const body = document.querySelector('body');
const header = document.querySelector('.header');
const mainNav = document.querySelector('.main__nav');
const sectionHero = document.querySelector('.section__hero');
const openNavBtn = document.querySelector('.btn__mobile--nav');
/////////////////////////////////////////////////////
//DISPLAYING MAP
/////////////////////////////////////////////////////

//1. Getting coordinates of the company
// const getLocation = navigator.geolocation.getCurrentPosition(
//   function success(position) {
//     const { latitude, longitude } = position.coords;
//     console.log(latitude, longitude);
//   },
//   function error(err) {
//     console.error(`Couldn't retrieve data. Error: ${err.message}`);
//   }
// );

//2. Marking the location on the map
const lat = 43.3242444;
const long = 21.9036904;
let map = L.map('map').setView([lat, long], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

let marker = L.marker([lat, long]).addTo(map);

/////////////////////////////////////////////////////
//MOBILE NAVIGATION
/////////////////////////////////////////////////////
const navItems = document.querySelectorAll('.nav__item');

openNavBtn.addEventListener('click', function (e) {
  e.preventDefault();
  header.classList.toggle('nav--open');
  if (header.classList.contains('nav--open')) {
    body.classList.add('scroll--disabled');
  } else {
    body.classList.remove('scroll--disabled');
  }
});

navItems.forEach(item =>
  item.addEventListener('click', function (e) {
    e.preventDefault();
    header.classList.remove('nav--open');
    body.classList.remove('scroll--disabled');
  })
);
/////////////////////////////////////////////////////
//STICKY NAVIGATION
/////////////////////////////////////////////////////
const headerHeight = header.clientHeight;

let stickyNavHandler = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    header.classList.add('sticky');
  } else {
    header.classList.remove('sticky');
  }
};

let stickyNavOptions = {
  root: null,
  rootMargin: `-${headerHeight}px`,
  threshold: 0,
};

let stickyNavObserver = new IntersectionObserver(
  stickyNavHandler,
  stickyNavOptions
);

stickyNavObserver.observe(sectionHero);

//////////////////////////////////////////////////////////SMOOTH SCROLLING
////////////////////////////////////////////////////////
const scrollHandler = function (elClass) {
  document.querySelectorAll(elClass).forEach(el => {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      let id = e.target.getAttribute('href');
      if (!e.target.hasAttribute('href')) {
        id = e.target.parentElement.getAttribute('href');
      }
      document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    });
  });
};

scrollHandler('.nav__link');
scrollHandler('.company__logo');

//////////////////////////////////////////////////////
//FADE-IN EFFECT
/////////////////////////////////////////////////////
const sections = document.querySelectorAll('.section');
const fadeInOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.15,
};

const fadeInHandler = function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  });
};

const fadeInObserver = new IntersectionObserver(fadeInHandler, fadeInOptions);

sections.forEach(section => {
  fadeInObserver.observe(section);
  if (!section.classList.contains('section__hero')) {
    section.classList.add('section--hidden');
  }
});

//////////////////////////////////////////////////////
//FAQ ACCORDION
/////////////////////////////////////////////////////
const faqSummaries = document.querySelectorAll('.faq__summary');

faqSummaries.forEach(summary => {
  summary.addEventListener('click', function (e) {
    summary.classList.toggle('faq--active');
  });
});

//////////////////////////////////////////////////////
//LAZY IMAGE LOADING
/////////////////////////////////////////////////////

const lazyImg = document.querySelector('.feature__image');

const lazyImgHandler = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.add('visible');
  observer.unobserve(entry.target);
};

let lazyImgOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0,
};

let lazyImgObserver = new IntersectionObserver(lazyImgHandler, lazyImgOptions);

lazyImgObserver.observe(lazyImg);

//////////////////////////////////////////////////////
//TESTIMONIAL SLIDER
/////////////////////////////////////////////////////
const btnLeft = document.querySelector('.testimonial__btn--left');
const btnRight = document.querySelector('.testimonial__btn--right');
const testimonials = document.querySelectorAll('.testimonial');
const slideContainer = document.querySelector('.testimonial__slides');
const slides = document.querySelectorAll('.testimonial__slide');

let curActive = 0;
const maxSlide = slides.length;

const activeSlideHandler = function (slides, curActive) {
  slides.forEach(slide => {
    if (+slide.dataset.slide === curActive) {
      slide.classList.add('slide--active');
    } else {
      slide.classList.remove('slide--active');
    }
  });
};

const activeTestimonialHandler = function (testimonials, curActive) {
  testimonials.forEach(testimonial => {
    testimonial.style.transform = `translateX(${-100 * curActive}%)`;
  });
};

btnRight.addEventListener('click', function (e) {
  e.preventDefault();
  if (curActive === maxSlide - 1) {
    curActive = 0;
  } else {
    ++curActive;
  }
  activeTestimonialHandler(testimonials, curActive);
  activeSlideHandler(slides, curActive);
});

btnLeft.addEventListener('click', function (e) {
  e.preventDefault();
  if (curActive === 0) {
    curActive = maxSlide - 1;
  } else {
    --curActive;
  }
  activeTestimonialHandler(testimonials, curActive);
  activeSlideHandler(slides, curActive);
});
