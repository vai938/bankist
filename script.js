'use strict';

///////////////////////////////////////
// DOM is the interface between JS and the browser or html documents
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const nav = document.querySelector('.nav');
const section1 = document.querySelector('#section--1')

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// 1. Add event listener to the common parent element
// 2. Determine what element originated the element
// Page navigation

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy (Event delegation)
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' })
  }
});

//  Tabbed component

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');


// console.log(tabs);
// console.log(tabsContainer);
// console.log(tabsContent);

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab')
  console.log(clicked);

  // Guard clause
  if (!clicked) return

  // Active tabs
  tabs.forEach((t) => t.classList.remove('operations__tab--active'))
  clicked.classList.add('operations__tab--active')

  // Activate content area
  tabsContent.forEach((t) => t.classList.remove('operations__content--active'))
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active')
})

// Menu fade animations
const handleOver = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img')
    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this
    })
  }
}
nav.addEventListener('mouseover', handleOver.bind(0.5))

nav.addEventListener('mouseout', handleOver.bind(1))


// Sticky navigation

// const initialCoords= section1.getBoundingClientRect();

// window.addEventListener('scroll',function(){
//   if (window.scrollY> initialCoords.top) nav.classList.add('sticky')
//   else nav.classList.remove('sticky')
// })


// Sticky navigation Intersection observer API

// const obsCallBack= function(entries, observer){
//   entries.forEach((entry)=>{
//     console.log(entry);
//   })
// };
// const obsOptions= {
//   root: null,
//   threshold: 0.1
// }
// const observer= new IntersectionObserver(obsCallBack, obsOptions);
// observer.observe(section1)

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky')
  else nav.classList.remove('sticky')
}
const header = document.querySelector('.header');
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: '-90px'
});

headerObserver.observe(header)


// Reveal sections
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);
  if (!entry.isIntersecting) return
  entry.target.classList.remove('section--hidden')
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return
  entry.target.src = entry.target.dataset.src
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img')
  });
  observer.unobserve(entry.target)
}
const imgTargets = document.querySelectorAll('img[data-src]');
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '-200px',
});
imgTargets.forEach(img => imgObserver.observe(img))


// Slider
const slider= function(){
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const btnLeft = document.querySelector('.slider__btn--left')
const btnRight = document.querySelector('.slider__btn--right')
let currSlide = 0;
const maxSlide = slides.length;
const dotContainer = document.querySelector('.dots');
// slider.style.transform = 'scale(0.4) translateX(-800px)';
// slider.style.overflow = 'visible'
// console.log(slider);

const goToSlide = function (slide) {
  slides.forEach((s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`))
}

const nextSlide = function () {
  if (currSlide === maxSlide - 1) {
    currSlide = 0;
  } else {
    currSlide++;
  }
  goToSlide(currSlide);
  activateDot(currSlide);
}
const prevSlide = function () {
  if (currSlide === 0) {
    currSlide = maxSlide - 1;
  } else {
    currSlide--;
  }
  goToSlide(currSlide);
  activateDot(currSlide);
}

btnRight.addEventListener('click', nextSlide)
btnLeft.addEventListener('click', prevSlide)

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') prevSlide();
  e.key === 'ArrowRight' && nextSlide();
})

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML('beforeend',
      `<button class="dots__dot" data-slide= "${i}"></button>`)
  })
}

const activateDot = function (slide) {
  document.querySelectorAll('.dots__dot').forEach(dot =>
    dot.classList.remove('dots__dot--active'));
  document.querySelector(`.dots__dot[data-slide= "${slide}"]`)
    .classList.add('dots__dot--active')
}

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    goToSlide(slide)
    activateDot(slide);
  }
})
const init = function () {
  goToSlide(0);
  createDots();
  activateDot(0)
}
init();};
slider();

// window.addEventListener('beforeunload',function(e){
//   e.preventDefault();
//   e.returnValue= '';
// })
// btnLeft.addEventListener('click',function(){
//   currSlide++;
//   slides.forEach((s,i)=> (s.style.transform= `translateX(${100*(i+currSlide-1)}%)`))

// })
//////////////////////////////////////////////////////////////////
// tabs.forEach((t)=> t.addEventListener('click',()=> 
//   console.log('jai ho')))
// DOM traversing
/*
const h1= document.querySelector('h1');
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children);
// h1.firstElementChild.style.color= 'red';
h1.lastElementChild.style.color= 'red';
console.log(h1.parentNode);
console.log(h1.parentElement);
h1.closest('.header').style.background= 'var(--gradient-secondary)';

// Going sideways sibling
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);
console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function(el){
  if (el !== h1) el.style.transform= 'scale(0.5)'
})

*/


// document.querySelectorAll('.nav__link').forEach(function(el){
//   el.addEventListener('click',function(e){
//     e.preventDefault();
//     const id= this.getAttribute('href');  
//     document.querySelector(id).scrollIntoView({behavior: 'smooth'})
//   })
// })
////////////////////////////////////////////////////////

// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);
/*
const header= document.querySelector('.header');
const allSections= document.querySelectorAll('.section');
console.log(allSections);

const allButtons= document.getElementsByTagName('button');
console.log(allButtons);

const allBtns= document.getElementsByClassName('btn');
console.log(allBtns);

const message= document.createElement('div');
message.classList.add('cookie-message');
// message.textContent= 'Using cookie for improved functionality.';
message.innerHTML= 'Using cookie for improved functionality. <button class= "btn btn--close-cookie">Got it!</button>'
// header.prepend(message);
header.append(message);
// header.before(message);
// header.after(message);
// header.append(message.cloneNode(true));

// Deleting elements
document.querySelector('.btn--close-cookie').addEventListener('click',function(){
// document.querySelector('.btn--close-cookie').addEventListener('click',function(){
  // message.remove();
  message.parentElement.removeChild(message);
})

// Styles
message.style.backgroundColor= '#37383d';
console.log(getComputedStyle(message).color);

message.style.height= Number.parseFloat(getComputedStyle(message).height)+ 40+'px';
console.log(Number.parseFloat(45.3333949494949,2));

document.documentElement.style.setProperty('--color-primary','orangered');

// Attributes
const logo= document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.className);
console.log(logo.getAttribute('designer'));
logo.setAttribute('company','bankist');

console.log(logo.dataset.versionNum);

// Classes

// logo.classList.add()
// logo.classList.remove()
// logo.classList.toggle()
// logo.classList.contains()


const btnScrollTo= document.querySelector('.btn--scroll-to');
const section1= document.querySelector('#section--1');

btnScrollTo.addEventListener('click',function(e){
  const s1coords= section1.getBoundingClientRect();
  console.log(s1coords);
  // console.log(e.target.getBoundingClientRect());
  console.log('Current scroll x/y',window.pageXOffset, window.pageYOffset);
  // console.log('Height width of viewport',
  // document.documentElement.clientHeight,
  // document.documentElement.clientWidth);
  // s1coords top means current top position to section and offset means ekdm top to top position.
  // window.scrollTo(s1coords.left+window.pageXOffset, s1coords.top+ window.pageYOffset)
  // window.scrollTo({
  //   left: s1coords.left+window.pageXOffset,
  //   top: s1coords.top+ window.pageYOffset,
  //   behavior: "smooth"
  // })
  section1.scrollIntoView({behavior: "smooth"})
})

const alertH1= function(e){
  alert("jai ho mouseEnter");
}
const h1= document.querySelector('h1');
h1.addEventListener('mouseenter', alertH1)

// h1.onmouseenter= function(e){
//   alert("onmouseenter")
// }

setTimeout(()=>
h1.removeEventListener('mouseenter', alertH1),4000)

const randomInt= (min, max)=>
  Math.floor(Math.random()* (max-min+1)+ min);
  const randomColor= ()=>
  `rgba(${randomInt(0,255)},${randomInt(0,255)},${randomInt(0,255)})`;

document.querySelector('.nav__link').addEventListener('click',function(e){
  this.style.backgroundColor= randomColor();
  console.log(e.target,e.currentTarget);
  // Stopping the propagation.
  e.stopPropagation();
},true)
document.querySelector('.nav__links').addEventListener('click',function(e){
  this.style.backgroundColor= randomColor();
  console.log(e.target,e.currentTarget);
  e.stopPropagation();
})
document.querySelector('.nav').addEventListener('click',function(e){
  this.style.backgroundColor= randomColor();
  console.log(e.target,e.currentTarget);
  e.stopPropagation();
})
*/