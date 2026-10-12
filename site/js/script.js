
/* =====================================
   1. Loading animation
===================================== */

window.addEventListener("load", () => {
    const loader = document.querySelector(".loader-wrapper");

    if (!loader) return;

    // Fade out after 2 seconds
    setTimeout(() => {
        loader.style.opacity = "0";

        // Hide the loader after the fade-out
        setTimeout(() => {
            loader.style.display = "none";
        }, 500);

    }, 2000);
});


/* =====================================
   2. Header effect on scroll
===================================== */

document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".header");

    function handleHeaderScroll() {
        if (!header) return;

        header.classList.toggle("scrolled", window.scrollY > 50);
    }

    window.addEventListener("scroll", handleHeaderScroll, {
        passive: true
    });

    handleHeaderScroll();


    /* =====================================
       3. Smooth scrolling
    ===================================== */

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", event => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (target) {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });
});
// Apparition au scroll
const revealTargets = document.querySelectorAll(
    ".section-title-container, .about-tagline, .about-heading, .about-content p, .skill-item"
);

revealTargets.forEach(el => el.classList.add("reveal"));

const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el = entry.target;

        // décalage progressif entre les cartes de compétences
        if (el.classList.contains("skill-item")) {
            const index = [...el.parentElement.children].indexOf(el);
            el.style.transitionDelay = `${index * 80}ms`;
        }

        el.classList.add("visible");
        obs.unobserve(el);
    });
}, { threshold: 0.15 });

revealTargets.forEach(el => revealObserver.observe(el));

// Lien actif du menu selon la section visible
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(l => l.classList.remove("active"));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add("active");
    });
}, { rootMargin: "-50% 0px -50% 0px" });

sections.forEach(s => navObserver.observe(s));

// Apparition des étapes de la timeline
const timelineItems = document.querySelectorAll(".timeline-item");

const timelineObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
    });
}, { threshold: 0.2 });

timelineItems.forEach(item => timelineObserver.observe(item));
// Certifications : apparition + filtres
const certificationCards = document.querySelectorAll(".certification-card");
const filterButtons = document.querySelectorAll(".filter-btn");

const certificationObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const index = [...el.parentElement.children].indexOf(el);
        el.style.transitionDelay = `${(index % 4) * 100}ms`;
        el.classList.add("visible");
        obs.unobserve(el);
    });
}, { threshold: 0.15 });

certificationCards.forEach(card => {
    card.classList.add("reveal");
    certificationObserver.observe(card);
});

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.dataset.filter;

        certificationCards.forEach(card => {
            const show = filter === "all" || card.dataset.category === filter;
            card.classList.toggle("hidden", !show);

            if (show) {
                card.style.transitionDelay = "0ms";
                card.classList.add("visible");
            }
        });
    });
});



// Contact : apparition + validation du formulaire
document.querySelectorAll(".contact-info, .contact-link, .contact-form").forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${i * 100}ms`;
    revealObserver.observe(el);
});

const contactForm = document.getElementById("contactForm");

if (contactForm) {
    const status = document.getElementById("formStatus");
    const fields = contactForm.querySelectorAll(".form-control");

    const rules = {
        name:    v => v.trim().length >= 2 || "Please enter your name (2 characters minimum).",
        email:   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || "Please enter a valid email address.",
        message: v => v.trim().length >= 10 || "Your message is too short (10 characters minimum)."
    };

    function validateField(field) {
        const result = rules[field.name](field.value);
        const group = field.closest(".form-group");
        group.querySelector(".field-error")?.remove();

        if (result !== true) {
            field.classList.add("invalid");
            const error = document.createElement("span");
            error.className = "field-error";
            error.textContent = result;
            group.appendChild(error);
            return false;
        }

        field.classList.remove("invalid");
        return true;
    }

    // Validation en direct une fois le champ quitté, puis à chaque frappe
    fields.forEach(field => {
        field.addEventListener("blur", () => validateField(field));
        field.addEventListener("input", () => {
            if (field.classList.contains("invalid")) validateField(field);
        });
    });

    contactForm.addEventListener("submit", event => {
        event.preventDefault();
        status.className = "form-status";
        status.textContent = "";

        const allValid = [...fields].map(validateField).every(Boolean);
        if (!allValid) {
            status.classList.add("error");
            status.textContent = "Please fix the highlighted fields.";
            return;
        }

        const data = new FormData(contactForm);
        const subject = encodeURIComponent(`Portfolio contact from ${data.get("name")}`);
        const body = encodeURIComponent(
            `${data.get("message")}\n\n---\nName: ${data.get("name")}\nEmail: ${data.get("email")}`
        );

        // Ouvre le client mail de la visiteuse avec le message prérempli
        window.location.href = `mailto:safaeoujri2@gmail.com?subject=${subject}&body=${body}`;

        status.classList.add("success");
        status.textContent = "Your email app is opening with your message ready to send.";
        contactForm.reset();
    });
}


// Footer : année automatique + bouton retour en haut
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const backToTop = document.getElementById("backToTop");
if (backToTop) {
    window.addEventListener("scroll", () => {
        backToTop.classList.toggle("show", window.scrollY > 500);
    }, { passive: true });

    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}