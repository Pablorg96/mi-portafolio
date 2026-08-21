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
