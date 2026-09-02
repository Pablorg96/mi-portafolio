const casos = [
    {
        title: "MYHIXEL Ring — Lanzamiento de Producto",
        desc: "Producción integral del vídeo de presentación del MYHIXEL Ring para Kickstarter. La campaña recaudó 327.109 € gracias a 2.898 patrocinadores. Concepto creativo, guión, locución, grabación, edición, color grading, diseño de sonido y postproducción completa.",
        video: "aZXZlhCO45U"
    },
    {
        title: "MYHIXEL Trainer — Campaña Kickstarter Estrella",
        desc: "Vídeo de lanzamiento del MYHIXEL Trainer para Kickstarter. La campaña más exitosa de MYHIXEL: 706.153 € recaudados con 3.276 patrocinadores. Producción integral desde concepto hasta postproducción, optimizada con contenido generado con IA.",
        video: "IbVQD4Ked40"
    },
    {
        title: "Línea de Cuidado Íntimo Masculino — Atresmedia",
        desc: "Vídeo de lanzamiento para la línea de cuidado íntimo masculino de MYHIXEL, producido para campaña en Atresmedia. Producción integral: concepto, guión, locución, grabación profesional, edición, color grading y postproducción con IA.",
        video: "D2Ire_zq_k4"
    }
];

function abrirModal(index) {
    const caso = casos[index];
    const modal = document.getElementById("modal");
    const modalVideo = document.getElementById("modalVideo");
    const modalTitle = document.getElementById("modalTitle");
    const modalDesc = document.getElementById("modalDesc");

    modalVideo.src = `https://www.youtube.com/embed/${caso.video}?autoplay=1`;
    modalTitle.textContent = caso.title;
    modalDesc.textContent = caso.desc;

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
}

function cerrarModal() {
    const modal = document.getElementById("modal");
    modal.classList.remove("active");
    document.getElementById("modalVideo").src = "";
    document.body.style.overflow = "auto";
}

window.onclick = function(event) {
    const modal = document.getElementById("modal");
    if (event.target == modal) {
        cerrarModal();
    }
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
    });
});

const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', function() {
    if (window.scrollY > 10) {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});

// Necesario para que GSAP reconozca la propiedad "scrollTrigger" en los tweens
gsap.registerPlugin(ScrollTrigger);

// Efecto hero: fondo blanco -> negro y vídeo encogiéndose ligeramente,
// todo sincronizado en el mismo tramo de scroll (termina al 40% del scroll del hero)
const heroVideoTl = gsap.timeline({
    scrollTrigger: {
        trigger: ".video-sticky-container",
        start: "top top",
        end: "+=40%",
        scrub: 0.6,
    }
});

heroVideoTl
    .to(".video-sticky-container", {
        backgroundColor: "#000000",
        ease: "power2.out"
    }, 0)
    .to(".video-wrapper video", {
        scale: 0.9,
        borderRadius: "24px",
        ease: "power2.out"
    }, 0)
    .to(".video-wrapper", {
        paddingLeft: "130px",
        paddingRight: "130px",
        ease: "power2.out"
    }, 0);

// Reveal con blur al hacer scroll (mismo efecto que el titular del Hero),
// aplicado a: texto de Overview + link, y título/link/tarjetas de Casos de Estudio.
document.querySelectorAll('.reveal-blur').forEach((el, i) => {
    const esTarjeta = el.classList.contains('caso-card');
    const tieneSubrayado = el.querySelector('.highlight-text') !== null;

    gsap.to(el, {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        duration: 1.1,
        ease: "power2.out",
        delay: esTarjeta ? (i % 6) * 0.12 : 0,
        scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
            onEnter: () => {
                if (tieneSubrayado) {
                    el._subrayadoTimeout = setTimeout(() => {
                        el.querySelector('.highlight-text').classList.add("animated");
                    }, 1100);
                }
            },
            onLeaveBack: () => {
                if (tieneSubrayado) {
                    clearTimeout(el._subrayadoTimeout);
                    el.querySelector('.highlight-text').classList.remove("animated");
                }
            }
        }
    });
});


// Servicios Interactive - Mouse Follower
gsap.registerPlugin(ScrollTrigger);

let mouseX = 0;
let mouseY = 0;
let activeImage = null;

// Track mouse position globalmente
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    if (activeImage) {
        // Easing suave con GSAP
        gsap.to(activeImage, {
            left: mouseX - 140,
            top: mouseY - 200,
            duration: 0.3,
            ease: "power2.out"
        });
    }
});

// Hover en cada fila de servicio
document.querySelectorAll('.servicio-row').forEach((row) => {
    const imageEl = row.querySelector('.servicio-image');
    const imageSrc = row.getAttribute('data-image');
    
    if (imageSrc) {
        imageEl.style.backgroundImage = `url('${imageSrc}')`;
    }
    
    row.addEventListener('mouseenter', () => {
        activeImage = imageEl;
        gsap.to(imageEl, {
            opacity: 1,
            duration: 0.3,
            ease: "power2.out"
        });
    });
    
    row.addEventListener('mouseleave', () => {
        activeImage = null;
        gsap.to(imageEl, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.out"
        });
    });
});

// Expandir descripción al hover
document.querySelectorAll('.servicio-row').forEach((row) => {
    row.addEventListener('mouseenter', () => {
        gsap.to(row, {
            minHeight: "auto",
            duration: 0.4,
            ease: "power2.out"
        });
    });
});
