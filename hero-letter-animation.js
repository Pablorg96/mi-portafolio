// Opcional: Si quieres animar letra por letra en lugar de línea por línea
document.addEventListener('DOMContentLoaded', function() {
    const titleLines = document.querySelectorAll('.hero-title .words');
    
    titleLines.forEach((line, lineIndex) => {
        const text = line.textContent;
        const letters = text.split('');
        let html = '';
        let charIndex = 0;
        
        letters.forEach((char, index) => {
            const delay = lineIndex * 0.3 + (index * 0.05);
            html += `<span style="display: inline-block; animation: letterReveal 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s forwards; opacity: 0; transform: translateY(10px);">${char}</span>`;
        });
        
        line.innerHTML = html;
    });
});

// Keyframe para letra por letra
const style = document.createElement('style');
style.textContent = `
    @keyframes letterReveal {
        0% {
            opacity: 0;
            transform: translateY(10px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
