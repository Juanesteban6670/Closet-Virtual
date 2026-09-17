// Elementos del DOM
const inputModelo = document.getElementById('input-modelo');
const probadorCanvas = document.getElementById('probador-canvas');
const placeholderModelo = document.getElementById('placeholder-modelo');

const inputPrenda = document.getElementById('input-prenda');
const nombrePrenda = document.getElementById('nombre-prenda');
const categoriaPrenda = document.getElementById('categoria-prenda');
const btnAgregar = document.getElementById('btn-agregar');
const gridArmario = document.getElementById('grid-armario');
const tituloArmario = document.getElementById('titulo-armario');
const btnLimpiar = document.getElementById('btn-limpiar');

// Elementos del Tutorial Rosita
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
let contadorPrendas = 0;

const pasosTutorial = [
    {
        num: "Paso 1 de 4",
        titulo: "Tu Foto de Modelo 🪞",
        texto: "Sube una foto tuya bonita de cuerpo entero o medio cuerpo. ¡El fondo se borrará solito!",
        elemento: stepModelo
    },
    {
        num: "Paso 2 de 4",
        titulo: "Agrega tus Prendas 🛍️",
        texto: "Escribe el nombre de tu ropita, elige su categoría y sube su foto para guardarla en tu closet.",
        elemento: stepPrenda
    },
    {
        num: "Paso 3 de 4",
        titulo: "Tu Armario Mágico 👗",
        texto: "Aquí se guardarán todas tus prendas ordenadas. ¡Solo tócalas para ponértelas en el maniquí!",
        elemento: stepArmario
    },
    {
        num: "Paso 4 de 4",
        titulo: "El Probador Virtual ✨",
        texto: "Aquí podrás ver tu look completo y arrastrar la ropita con tu dedo para acomodarla perfecta.",
        elemento: stepProbador
    }
];

function actualizarTutorial() {
    // 1. Limpiar todos los brillos anteriores de los elementos
    [stepModelo, stepPrenda, stepArmario, stepProbador].forEach(el => {
        if (el) el.classList.remove('highlight-step');
    });

    if (pasoActual <= pasosTutorial.length) {
        const current = pasosTutorial[pasoActual - 1];
        tutorialPasoNum.textContent = current.num;
        tutorialTitulo.textContent = current.titulo;
        tutorialTexto.textContent = current.texto;
        
        // 2. Aplicar brillo únicamente al paso activo actual
        if (current.elemento) {
            current.elemento.classList.add('highlight-step');
            current.elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        if (pasoActual === pasosTutorial.length) {
            btnSiguiente.textContent = "¡A crear outfits! 💖";
        } else {
            btnSiguiente.textContent = "¡Siguiente! 💖";
        }
    } else {
        cerrarTutorial();
    }
}

function cerrarTutorial() {
    [stepModelo, stepPrenda, stepArmario, stepProbador].forEach(el => {
        if (el) el.classList.remove('highlight-step');
    });
    if (tutorialOverlay) {
        tutorialOverlay.style.display = 'none';
    }
}

// Evento limpio para avanzar sin duplicar capas
btnSiguiente.onclick = function() {
    pasoActual++;
    actualizarTutorial();
};

btnSaltar.onclick = function() {
    cerrarTutorial();
};

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

// Agregar prenda al armario con contador y botón de eliminar
btnAgregar.addEventListener('click', () => {
    const nombre = nombrePrenda.value.trim();
    const file = inputPrenda.files[0];

    if (!nombre || !file) {
        alert("¡Por favor ingresa un nombre y selecciona una fotito para la prenda! 🌸");
        return;
    }

    quitarFondoAutomatico(file, (processedImageUrl) => {
        contadorPrendas++;
        tituloArmario.textContent = `3. Tu Armario (${contadorPrendas} prendas) 👗`;

        const wrapper = document.createElement('div');
        wrapper.className = 'item-armario-wrapper';

        const imgMiniatura = document.createElement('img');
        imgMiniatura.src = processedImageUrl;
        imgMiniatura.className = 'miniatura-prenda';
        imgMiniatura.title = nombre;

        const btnEliminar = document.createElement('button');
        btnEliminar.className = 'btn-eliminar-prenda';
        btnEliminar.textContent = '✕';
        btnEliminar.title = 'Eliminar prenda';
        btnEliminar.addEventListener('click', (e) => {
            e.stopPropagation();
            wrapper.remove();
            contadorPrendas = Math.max(0, contadorPrendas - 1);
            tituloArmario.textContent = `3. Tu Armario (${contadorPrendas} prendas) 👗`;
        });

        imgMiniatura.addEventListener('click', () => {
            colocarPrendaEnModelo(processedImageUrl, nombre);
        });

        wrapper.appendChild(imgMiniatura);
        wrapper.appendChild(btnEliminar);
        gridArmario.appendChild(wrapper);

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