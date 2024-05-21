import gsap from "https://cdn.skypack.dev/gsap@3.10.4";
import ScrollTrigger from "https://cdn.skypack.dev/gsap@3.10.4/dist/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

let isTouchDevice = window.matchMedia('(hover: none)').matches;

const elLinks = Array.from(document.querySelectorAll('a')).filter(el => !el.classList.contains('choice'));
const elItems = document.querySelectorAll('li');
if (!isTouchDevice) {
  elLinks.forEach(elLink => {
    elLink.addEventListener('mouseleave', () => onLinkLeave(elLink));
    elLink.addEventListener('mouseenter', () => onLinkEnter(elLink));
  });
}

elItems.forEach(elItem => {
  const timeline = gsap.timeline({
    scrollTrigger: {
      once: true,
      trigger: elItem,
      start: "top bottom",
      end: "top bottom",
      toggleActions: "play none play play"
    }
  });

  if (isTouchDevice) {
    titleFadeIn(elItem, timeline);
  }

  const bbox = elItem.getBoundingClientRect();
  if (bbox.bottom > 0 && bbox.top < window.innerHeight) {
    const elImage = elItem.querySelector('img');
    if (elImage.complete) {
      timeline.to(elItem, {
        opacity: 1,
        duration: 0.5,
        ease: 'power1.out',
        delay: Math.random() * 0.5 + 0.1
      });
    } else {
      elImage.addEventListener('load', () => {
        timeline.to(elItem, {
          opacity: 1,
          duration: 0.5,
          ease: 'power1.out',
          delay: Math.random() * 0.5 + 0.1
        });
      });
    }
    return;
  }

  timeline.from(elItem, {
    y: innerWidth > 960 ? 150 : 50,
    duration: 0.6,
    ease: "power2.out",
  });
  timeline.fromTo(elItem, {
    opacity: 0
  }, {
    opacity: 1,
    duration: 0.6,
    ease: "power2.out",
  });
});

function titleFadeIn (elItem, timeline) {
  const elTitle = elItem.querySelector('span');
  gsap.set(elTitle, {
    y: 0
  });
  timeline.fromTo(elTitle, {
    opacity: 0
  }, {
    opacity: 1,
    duration: 0.4,
    ease: "power2.inOut",
    scrollTrigger: {
      trigger: elItem,
      start: "center 75%",
      end: "center 40%",
      toggleActions: "play reverse restart reverse"
    }
  });
}

function onLinkEnter (elHoveredLink) {
  gsap.to(elHoveredLink, {
    x: 0,
    y: 0,
    scale: 1.2,
    overwrite: true,
    duration: 0.6,
    ease: 'power3.out'
  });

  elLinks.forEach(elLink => {
    if (elLink === elHoveredLink) return;
    let x = (elLink.bbox.x - elHoveredLink.bbox.x) * 0.2;
    let y = (elLink.bbox.y - elHoveredLink.bbox.y) * 0.2;
    gsap.to(elLink, {
      scale: 0.8,
      x,
      y,
      overwrite: true,
      duration: 0.6,
      ease: 'power2.out'
    });
  });
}

function onLinkLeave (elLink) {
  gsap.to(elLinks, {
    x: 0,
    y: 0,
    scale: 1,
    delay: 0.1,
    overwrite: true
  });
}

function calculateBboxes () {
  elLinks.forEach(elLink => {
    elLink.bbox = elLink.getBoundingClientRect();
  });
}
window.addEventListener('resize', calculateBboxes);
const resizeObserver = new ResizeObserver(() => {
  calculateBboxes();
});
elLinks.forEach(elLink => {
  resizeObserver.observe(elLink);
});
calculateBboxes();