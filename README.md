# 👗 Closet Virtual & Probador Móvil 👕

Una aplicación web interactiva desarrollada con **HTML5, CSS3 y JavaScript puro (Vanilla JS)** que te permite gestionar tu armario, quitar el fondo de las fotos de forma automática y armar tus *outfits* directamente sobre una foto tuya de modelo, todo optimizado tanto para computadoras como para **cualquier teléfono móvil**.

---

## ✨ Características Principales

- **📸 Subida y Procesamiento de Fotos:** Sube fotos de tu ropa y de ti mismo directamente desde la galería o la cámara de tu celular.
- **🪄 Remoción Automática de Fondo:** El sistema detecta el fondo plano (idealmente blanco o liso) y lo vuelve transparente automáticamente al instante.
- **📱 100% Responsivo y Táctil:** Adaptado para pantallas verticales de celulares con soporte completo para gestos táctiles (*touch events*), permitiéndote arrastrar las prendas con el dedo de forma fluida.
- **🧥 Armario Interactivo:** Organiza tu ropa virtualmente y colócala en el maniquí con un solo toque.
- **⚙️ Sin Servidores Externos:** Funciona completamente en el lado del cliente (*Client-side*), sin necesidad de bases de datos complejas ni dependencias pesadas.

---

## 📂 Estructura del Proyecto

```text
Closet-Virtual/
│
├── index.html        # Estructura principal de la interfaz y panel de control
├── style.css         # Estilos visuales adaptados a móviles y escritorio
└── script.js         # Lógica de procesamiento de imágenes, armario y eventos táctiles
