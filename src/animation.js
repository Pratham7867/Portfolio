import {gsap} from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register plugin
gsap.registerPlugin(ScrollTrigger);


const projects = [
  {
    title: "Moveis-Hub",
    description: "A dynamic movie explorer app where users can browse, search, and discover films with ease",
    link: "https://movies-hub-topaz.vercel.app/"
  },
  {
    title: "Refocuz",
    description: "Refocuz is a clone project built to strengthen my skills in modern web development and front-end design.",
    link: "https://refokuz.vercel.app/"
  },
  {
    title: "Tala-Snack",
    description: "Tala Snack is a clone project built for learning purposes, focusing on front-end development and UI implementation.",
    link: "https://get-tala-two.vercel.app/"
  },
  {
    title: "3D Page",
    description: "A 3D interactive web page built to explore creative web design using Three.js, animations, and modern UI techniques",
    link: "https://3-d-page-self.vercel.app/"
  },
  {
    title: "Hallogram",
    description: "A web project showcasing 3D models styled as holograms, built to experiment with Three.js and creative visual effects.",
    link: "https://hologram-umber.vercel.app/"
  },
  {
    title: "Coffee-Smoke",
    description: "A visually engaging project that brings a hot cup of coffee to life with animated steam effects",
    link: "https://coffee-smoke-rust.vercel.app/"
  }
];

const grid = document.getElementById("projectsGrid");
const highlight = document.getElementById("hoverHighlight");

projects.forEach(project => {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <h4>${project.title}</h4>
    <p>${project.description}</p>
  `;
  grid.appendChild(card);

  // On click: open project link
  card.addEventListener("click", () => {
    window.open(project.link, "_blank");
  });

  // Mouse enter: move highlight to card
  card.addEventListener("mouseenter", () => {
    const rect = card.getBoundingClientRect();
    const gridRect = grid.getBoundingClientRect();

    const extra = 24; // highlight padding
    highlight.style.width = rect.width + extra + "px";
    highlight.style.height = rect.height + extra + "px";
    highlight.style.transform = `translate(${rect.left - gridRect.left - extra / 2}px, ${rect.top - gridRect.top - extra / 2}px)`;
    highlight.style.opacity = "1";
  });

  card.addEventListener("mouseleave", () => {
    highlight.style.opacity = "0";
  });

  grid.addEventListener("mouseleave", () => {
    highlight.style.opacity = "0";
  });
});


// ✅ Resume download button
document.addEventListener("DOMContentLoaded", () => {
  const resumeBtn = document.getElementById("downloadResume");
  if (resumeBtn) {
    resumeBtn.addEventListener("click", () => {
      const resumeUrl = "/Pratham_Gedam_Resume.pdf"; // place in public/
      const link = document.createElement("a");
      link.href = resumeUrl;
      link.download = "Pratham_Resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
});


// ✅ Animate .links once with gsap.from
function animation() {
const tl = gsap.timeline({ defaults: { duration: 0.4, ease: "power3.out", opacity: 0 } });

tl.from(".links", { y: -100 })
  .from(".moveto", { x: -50 }, "+=0.1")
  .from("#h1", { x: -50 }, "+=0.1")
  .from("h3", { x: -50 }, "+=0.1")
  .from("summary", { x: -50 }, "+=0.1")
  .from(".b", { x: -50 }, "+=0.1");


  gsap.from(".intro .container > *", {
    scrollTrigger: {
      trigger: ".intro",
      start: "top 80%",
      end: "top 30%",
      toggleActions: "play none none reverse",
      markers: false
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    stagger: 0.2
  });

  // 🔹 Projects Section
  gsap.from("#projectsGrid .card", {
    scrollTrigger: {
      trigger: "#projectsGrid",
      start: "top 80%",
      end: "top 30%",
      toggleActions: "play none none reverse",
      markers: false
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    stagger: 0.2
  });

  // 🔹 Skills Section
  gsap.from(".section:nth-of-type(2) h2", {
    scrollTrigger: {
      trigger: ".section:nth-of-type(2)",
      start: "top 80%",
      end: "top 30%",
      toggleActions: "play none none reverse",
      markers: false
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
  });

  // 🔹 Contact Section
  gsap.from(".contact > *", {
    scrollTrigger: {
      trigger: ".contact",
      start: "top 80%",
      end: "top 30%",
      toggleActions: "play none none reverse",
      markers: false
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    stagger: 0.2
  });
}

animation()

// email submision 
const form = document.getElementById("contactForm");
const statusMessage = document.getElementById("statusMessage");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: "POST",
      headers: { Accept: "application/json" }, // helps with mobile
      body: formData,
    });

    if (response.ok) {
      statusMessage.innerText = "✅ Message sent successfully!";
      statusMessage.style.color = "green";
      form.reset();
    } else {
      statusMessage.innerText = "❌ Failed to send. Try again.";
      statusMessage.style.color = "red";
    }
  } catch (error) {
    statusMessage.innerText = "❌ Network error. Check connection.";
    statusMessage.style.color = "red";
  }
});


// amomation for typing effect
const words = ["Web Developer", "Vibe Coder", "Prompt Engineer"];
const typingElement = document.getElementById("typing");

let wordIndex = 0;
let charIndex = 0;
let typingDelay = 150;
let erasingDelay = 100;
let newWordDelay = 1500; // Delay before typing next word

function type() {
  if (charIndex < words[wordIndex].length) {
    typingElement.textContent += words[wordIndex].charAt(charIndex);
    charIndex++;
    setTimeout(type, typingDelay);
  } else {
    setTimeout(erase, newWordDelay);
  }
}

function erase() {
  if (charIndex > 0) {
    typingElement.textContent = words[wordIndex].substring(0, charIndex - 1);
    charIndex--;
    setTimeout(erase, erasingDelay);
  } else {
    wordIndex = (wordIndex + 1) % words.length;
    setTimeout(type, typingDelay);
  }
}

// Start typing on load
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(type, newWordDelay);
});
