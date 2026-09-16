// Elementos del DOM
const inputModelo = document.getElementById('input-modelo');
const probadorCanvas = document.getElementById('probador-canvas');
const placeholderModelo = document.getElementById('placeholder-modelo');

const inputPrenda = document.getElementById('input-prenda');
const nombrePrenda = document.getElementById('nombre-prenda');
const categoriaPrenda = document.getElementById('categoria-prenda');
const btnAgregar = document.getElementById('btn-agregar');
const gridArmario = document.getElementById('grid-armario');
const btnLimpiar = document.getElementById('btn-limpiar');

// Función automática para remover fondo por tolerancia de color
function quitarFondoAutomatico(file, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imgData.data;

            const rFondo = data[0];
            const gFondo = data[1];
            const bFondo = data[2];
            const tolerancia = 40;

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                if (
                    Math.abs(r - rFondo) < tolerancia &&
                    Math.abs(g - gFondo) < tolerancia &&
                    Math.abs(b - bFondo) < tolerancia
                ) {
                    data[i + 3] = 0; // Transparente
                }
            }

            ctx.putImageData(imgData, 0, 0);
            callback(canvas.toDataURL('image/png'));
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Subir foto de modelo
inputModelo.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        quitarFondoAutomatico(file, (processedImageUrl) => {
            if (placeholderModelo) {
                placeholderModelo.style.display = 'none';
            }

            let imgModelo = document.getElementById('img-modelo-canvas');
            if (!imgModelo) {
                imgModelo = document.createElement('img');
                imgModelo.id = 'img-modelo-canvas';
                probadorCanvas.prepend(imgModelo);
            }
            imgModelo.src = processedImageUrl;
        });
    }
});

// Agregar prenda al armario
btnAgregar.addEventListener('click', () => {
    const nombre = nombrePrenda.value.trim();
    const file = inputPrenda.files[0];

    if (!nombre || !file) {
        alert("Por favor ingresa un nombre y selecciona una foto para la prenda.");
        return;
    }

    quitarFondoAutomatico(file, (processedImageUrl) => {
        const imgMiniatura = document.createElement('img');
        imgMiniatura.src = processedImageUrl;
        imgMiniatura.className = 'miniatura-prenda';
        imgMiniatura.title = nombre;

        imgMiniatura.addEventListener('click', () => {
            colocarPrendaEnModelo(processedImageUrl, nombre);
        });

        gridArmario.appendChild(imgMiniatura);

        nombrePrenda.value = '';
        inputPrenda.value = '';
    });
});

// Colocar prenda con soporte táctil (Móvil) y Mouse (Escritorio)
function colocarPrendaEnModelo(url, nombre) {
    const prendaCanvas = document.createElement('img');
    prendaCanvas.src = url;
    prendaCanvas.className = 'prenda-en-modelo';
    prendaCanvas.alt = nombre;
    
    prendaCanvas.style.top = '120px';
    prendaCanvas.style.left = '90px';

    let isDragging = false;
    let startX, startY;
    let initialLeft, initialTop;

    // --- EVENTOS TÁCTILES (MÓVILES) ---
    prendaCanvas.addEventListener('touchstart', (e) => {
        isDragging = true;
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        initialLeft = prendaCanvas.offsetLeft;
        initialTop = prendaCanvas.offsetTop;
        prendaCanvas.style.zIndex = 10;
    });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        const dx = touch.clientX - startX;
        const dy = touch.clientY - startY;
        prendaCanvas.style.left = `${initialLeft + dx}px`;
        prendaCanvas.style.top = `${initialTop + dy}px`;
    }, { passive: false });

    window.addEventListener('touchend', () => {
        isDragging = false;
    });

    // --- EVENTOS DE RATÓN (PC / COMPATIBILIDAD) ---
    prendaCanvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX - prendaCanvas.offsetLeft;
        startY = e.clientY - prendaCanvas.offsetTop;
        prendaCanvas.style.zIndex = 10;
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        let x = e.clientX - startX;
        let y = e.clientY - startY;
        prendaCanvas.style.left = `${x}px`;
        prendaCanvas.style.top = `${y}px`;
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    probadorCanvas.appendChild(prendaCanvas);
}

// Limpiar modelo
btnLimpiar.addEventListener('click', () => {
    const prendas = probadorCanvas.querySelectorAll('.prenda-en-modelo');
    prendas.forEach(prenda => prenda.remove());
});