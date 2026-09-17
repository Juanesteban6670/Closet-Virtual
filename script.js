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

// Elementos del Tutorial
const tutorialOverlay = document.getElementById('tutorial-overlay');
const tutorialPasoNum = document.getElementById('tutorial-paso-num');
const tutorialTitulo = document.getElementById('tutorial-titulo');
const tutorialTexto = document.getElementById('tutorial-texto');
const btnSiguiente = document.getElementById('btn-siguiente');
const btnSaltar = document.getElementById('btn-saltar');

const stepModelo = document.getElementById('step-modelo');
const stepPrenda = document.getElementById('step-prenda');
const stepArmario = document.getElementById('step-armario');
const stepProbador = document.getElementById('step-probador');

let pasoActual = 1;

const pasosTutorial = [
    {
        num: "Paso 1 de 4",
        titulo: "Sube tu Foto de Modelo 🧍",
        texto: "Aquí debes subir una foto tuya de cuerpo entero o medio cuerpo. El sistema le quitará el fondo automáticamente.",
        elemento: stepModelo
    },
    {
        num: "Paso 2 de 4",
        titulo: "Agrega tus Prendas 👕",
        texto: "Escribe el nombre de tu prenda, elige la categoría y sube su foto. ¡También se le borrará el fondo de forma automática!",
        elemento: stepPrenda
    },
    {
        num: "Paso 3 de 4",
        titulo: "Tu Armario Digital 🧥",
        texto: "Todas las prendas que subas se guardarán aquí en forma de miniatura. Solo tócalas para ponértelas.",
        elemento: stepArmario
    },
    {
        num: "Paso 4 de 4",
        titulo: "El Probador Virtual ✨",
        texto: "Aquí aparecerá tu foto y las prendas que selecciones. Podrás arrastrarlas con el dedo o el mouse para armar tu outfit perfecto.",
        elemento: stepProbador
    }
];

function actualizarTutorial() {
    // Remover brillo anterior
    document.querySelectorAll('.highlight-step').forEach(el => el.classList.remove('highlight-step'));

    if (pasoActual <= pasosTutorial.length) {
        const current = pasosTutorial[pasoActual - 1];
        tutorialPasoNum.textContent = current.num;
        tutorialTitulo.textContent = current.titulo;
        tutorialTexto.textContent = current.texto;
        
        // Destacar visualmente el elemento enfocado
        current.elemento.classList.add('highlight-step');
        current.elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });

        if (pasoActual === pasosTutorial.length) {
            btnSiguiente.textContent = "¡Comenzar a usar!";
        } else {
            btnSiguiente.textContent = "Siguiente";
        }
    } else {
        cerrarTutorial();
    }
}

function cerrarTutorial() {
    document.querySelectorAll('.highlight-step').forEach(el => el.classList.remove('highlight-step'));
    tutorialOverlay.style.display = 'none';
}

btnSiguiente.addEventListener('click', () => {
    pasoActual++;
    actualizarTutorial();
});

btnSaltar.addEventListener('click', () => {
    cerrarTutorial();
});

// Iniciar tutorial al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    actualizarTutorial();
});

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
                    data[i + 3] = 0;
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

// Colocar prenda con soporte táctil y de ratón
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