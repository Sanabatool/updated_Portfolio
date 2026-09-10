/* ============================================================
   NAVIGATION — mobile toggle + active-section highlighting
============================================================ */
const menuIcon = document.getElementById('menu-icon');
const navbar = document.getElementById('navbar');

menuIcon.addEventListener('click', () => {
  const isOpen = navbar.classList.toggle('open');
  menuIcon.setAttribute('aria-expanded', isOpen);
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navbar.classList.remove('open'));
});

const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[data-section="${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-45% 0px -45% 0px' });

sections.forEach(s => sectionObserver.observe(s));

/* ============================================================
   ROLE TYPEWRITER — rotates through her role titles
============================================================ */
const roles = [
  'AI/ML Developer',
  'NLP & RAG Engineer',
  'Full-Stack Developer',
  'Aspiring Educator'
];
const roleEl = document.getElementById('roleType');
let roleIndex = 0, charIndex = roles[0].length, deleting = false;

function tickRole() {
  const current = roles[roleIndex];
  if (!deleting) {
    charIndex++;
    if (charIndex > current.length) { deleting = true; setTimeout(tickRole, 1600); return; }
  } else {
    charIndex--;
    if (charIndex < 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; charIndex = 0; }
  }
  roleEl.textContent = current.slice(0, charIndex);
  setTimeout(tickRole, deleting ? 40 : 70);
}
setTimeout(tickRole, 3200); // start after boot sequence settles

/* ============================================================
   AI CORE — subtle mouse parallax tilt
============================================================ */
const aiCore = document.getElementById('aiCore');
if (window.matchMedia('(hover: hover)').matches) {
  document.querySelector('.home-visual')?.addEventListener('mousemove', (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    aiCore.style.transform = `rotateY(${x * 14}deg) rotateX(${y * -14}deg)`;
  });
  document.querySelector('.home-visual')?.addEventListener('mouseleave', () => {
    aiCore.style.transform = 'rotateY(0deg) rotateX(0deg)';
  });
  aiCore.style.transition = 'transform 0.3s ease-out';
  aiCore.style.transformStyle = 'preserve-3d';
}

/* ============================================================
   BACK TO TOP
============================================================ */
document.getElementById('toTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================================
   CONTACT FORM
   Static sites can't send email by themselves, so this posts to
   a form backend (Formspree) instead of your own server.
   1. Create a free form at https://formspree.io and grab its ID
      (looks like "https://formspree.io/f/xyzabcde").
   2. Paste that URL below as CONTACT_FORM_ENDPOINT.
   Until you do, the form just shows a demo confirmation.
============================================================ */
const CONTACT_FORM_ENDPOINT = "https://formspree.io/f/xrpgrdzp"; 

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!CONTACT_FORM_ENDPOINT) {
    formStatus.textContent = '> demo mode — add your Formspree endpoint in script.js to actually send this.';
    return;
  }

  formStatus.textContent = '> sending...';
  try {
    const response = await fetch(CONTACT_FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(contactForm)
    });
    if (response.ok) {
      formStatus.textContent = '> message sent — thanks, I\'ll get back to you soon.';
      contactForm.reset();
    } else {
      formStatus.textContent = '> something went wrong — please email me directly instead.';
    }
  } catch (err) {
    formStatus.textContent = '> network error — please email me directly instead.';
  }
});

/* The Download CV button (see index.html) points straight at
   assets/Sana-Batool-CV.pdf with a `download` attribute — once
   that file exists in your repo, the browser downloads it with
   no JavaScript needed. Nothing to wire up here. */

/* ============================================================
   AI CHAT ASSISTANT — rule-based, keyword-matched responses
============================================================ */
const chatToggle = document.getElementById('chatToggle');
const chatPanel = document.getElementById('chatPanel');
const chatClose = document.getElementById('chatClose');
const chatBody = document.getElementById('chatBody');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatQuick = document.getElementById('chatQuick');

const knowledgeBase = [
  {
    keys: ['skill', 'tech', 'stack', 'language', 'framework'],
    reply: "My core stack spans two worlds: <strong>AI/ML</strong> — Python, TensorFlow, Scikit-learn, spaCy, NLTK, OpenCV, Transformers, and RAG — and <strong>full-stack web</strong> — JavaScript, React, PHP, Laravel, and MySQL. Scroll to the Skills section for the full breakdown."
  },
  {
    keys: ['experience', 'work', 'job', 'company', 'career'],
    reply: "I've worked across four companies: Lead Web Developer at AveronX, Application Programmer at YoungDev Technologies (AI chatbots & computer vision), Web Application Developer at ICreativez Technologies, and Front-End Developer at Qonkar Technologies. Details are in the Experience timeline above."
  },
  {
    keys: ['project', 'intellilearn', 'built', 'made', 'portfolio piece'],
    reply: "My flagship project is <strong>IntelliLearn</strong> — an AI-integrated e-learning platform with an NLP chatbot for course Q&amp;A, built for my final year project and published in IJIST. I've also built a real-time age/gender recognition model with OpenCV, a Laravel e-commerce platform, and a blog CMS."
  },
  {
    keys: ['research', 'paper', 'publication', 'ijist', 'cset'],
    reply: "My paper, 'E-Learning Platform with AI-Based NLP Chatbot', is published in IJIST — you can read it via the link in the Projects section. I also presented research at the CSET 2026 International Conference in February 2026."
  },
  {
    keys: ['education', 'degree', 'university', 'cgpa', 'quest', 'study'],
    reply: "I hold a B.S. in Information Technology from QUEST, Nawabshah (2021–2025) with a CGPA of 3.79/4.00. My thesis was on an E-Learning Platform with AI Integration."
  },
  {
    keys: ['certificate', 'certification', 'course', 'coursera'],
    reply: "I'm certified in Google Data Analytics, Web Development (NFTP), OOP &amp; Data Structures in C++ (University of Illinois), and Computer Networking (Google). See the Certifications section for dates."
  },
  {
    keys: ['contact', 'email', 'hire', 'reach', 'available', 'opportunity', 'job offer'],
    reply: "I'm open to AI/ML and software development roles. Use the contact form above, or reach me directly at info@gmail.com."
  },
  {
    keys: ['ai', 'nlp', 'machine learning', 'ml', 'rag', 'chatbot'],
    reply: "AI/ML is where I focus most: NLP pipelines with spaCy and NLTK, retrieval-augmented generation (RAG), Transformers, and computer vision with OpenCV. This chat widget itself is a small taste of the conversational interfaces I like building."
  },
  {
    keys: ['award', 'honour', 'honor', 'achievement', 'competition'],
    reply: "My project was shortlisted in the top 27 of 460+ nationwide entries in a STEM competition run by Lok Sahaita STS with NED University. I also received the Prime Minister's Youth Laptop Scheme and served as Media Secretary of the QUEST Debating Society."
  },
  {
    keys: ['teach', 'educator', 'teaching', 'mentor'],
    reply: "Alongside development, I'm an aspiring educator — I care about curriculum design and explaining AI concepts clearly, which is part of why IntelliLearn focuses on tutoring and Q&amp;A."
  },
  {
    keys: ['hello', 'hi', 'hey', 'salam', 'assalam'],
    reply: "Hi there! I'm a small assistant trained on Sana's résumé. Ask me about her skills, experience, projects, education, or how to get in touch."
  },
  {
    keys: ['who are you', 'what are you', 'bot', 'robot'],
    reply: "I'm a lightweight, rule-based assistant built into this portfolio — no external AI service, just a keyword-matched guide to Sana's work. Try one of the quick questions below."
  }
];

const fallbackReplies = [
  "I don't have a specific answer for that, but I can tell you about Sana's skills, experience, projects, research, or how to get in touch — just ask.",
  "Good question — I'm limited to Sana's résumé topics. Try asking about her AI/ML work, her experience, or her published research."
];

const quickQuestions = [
  "What are your skills?",
  "Tell me about IntelliLearn",
  "Where have you worked?",
  "How can I contact you?"
];

let chatOpened = false;

function openChat() {
  chatPanel.classList.add('open');
  chatPanel.setAttribute('aria-hidden', 'false');
  chatToggle.setAttribute('aria-expanded', 'true');
  if (!chatOpened) {
    chatOpened = true;
    renderQuickQuestions();
    typeBotMessage("Hi, I'm Sana's assistant. I can answer questions about her skills, experience, projects, and research — what would you like to know?");
  }
  chatInput.focus();
}

function closeChat() {
  chatPanel.classList.remove('open');
  chatPanel.setAttribute('aria-hidden', 'true');
  chatToggle.setAttribute('aria-expanded', 'false');
}

chatToggle.addEventListener('click', () => {
  chatPanel.classList.contains('open') ? closeChat() : openChat();
});
chatClose.addEventListener('click', closeChat);

function appendMessage(text, sender) {
  const msg = document.createElement('div');
  msg.className = `chat-msg ${sender}`;
  msg.innerHTML = text;
  chatBody.appendChild(msg);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function typeBotMessage(text) {
  const typing = document.createElement('div');
  typing.className = 'typing-dots';
  typing.innerHTML = '<span></span><span></span><span></span>';
  chatBody.appendChild(typing);
  chatBody.scrollTop = chatBody.scrollHeight;

  const delay = 500 + Math.min(text.length * 8, 900);
  setTimeout(() => {
    typing.remove();
    appendMessage(text, 'bot');
  }, delay);
}

function renderQuickQuestions() {
  chatQuick.innerHTML = '';
  quickQuestions.forEach(q => {
    const btn = document.createElement('button');
    btn.textContent = q;
    btn.addEventListener('click', () => handleUserMessage(q));
    chatQuick.appendChild(btn);
  });
}

function findReply(message) {
  const lower = message.toLowerCase();
  for (const entry of knowledgeBase) {
    if (entry.keys.some(k => lower.includes(k))) return entry.reply;
  }
  return fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
}

function handleUserMessage(text) {
  appendMessage(text, 'user');
  const reply = findReply(text);
  typeBotMessage(reply);
}

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;
  handleUserMessage(text);
  chatInput.value = '';
});

/* open the assistant once, automatically, after the boot sequence —
   a single orchestrated invite rather than a repeated nag */
setTimeout(() => {
  if (!chatOpened) {
    chatToggle.classList.add('chat-toggle-hint');
  }
}, 6000);
