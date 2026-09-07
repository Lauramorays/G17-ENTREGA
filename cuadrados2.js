
// ============================================================
// HERENCIA
// cuadrados2.js
// ============================================================
//
// INTERACCIÓN:
// - Comienzan 4 cuadrados.
// - Se mueven solos.
// - Chocan entre ellos y con los bordes.
// - Con UN dedo: el cuadrado solamente se mueve.
// - Con DOS dedos sobre EL MISMO cuadrado: se deforma.
// - Al estirarlo completamente: genera 3 hijos.
// - El padre NO desaparece.
// - Después de generar hijos, el padre vuelve rápidamente
//   pero de forma visible a su forma PERFECTAMENTE CUADRADA.
// - Los hijos heredan el color y pueden volver a generar hijos.
// ============================================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


// ============================================================
// COLORES
// ============================================================

const COLORES = [
    "#D9D9D9",
    "#8BB2D3",
    "#202D64",
    "#2B538E"
];


// ============================================================
// CONFIGURACIÓN
// ============================================================

const TAMANO_INICIAL = 110;

const DISTANCIA_SEPARACION = 180;

const REDUCCION_HIJO = 0.82;

const VELOCIDAD = 0.7;

const FUERZA_CHOQUE = 0.8;


// ============================================================
// DEFORMACIÓN
// ============================================================

const DEFORMACION_MAXIMA = 1;

const ESTIRAMIENTO_MAXIMO = 2.0;


// ============================================================
// RETRACCIÓN
// ============================================================
//
// Antes era demasiado lenta o podía quedarse deformado.
//
// Ahora:
// - empieza inmediatamente después de crear los hijos
// - dura aproximadamente 300 ms
// - vuelve a cuadrado
// - tiene una pequeña elasticidad al final
//

const DURACION_RETRACCION = 320;


// ============================================================
// CANVAS
// ============================================================

function ajustarCanvas() {

    const rect = canvas.getBoundingClientRect();

    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", ajustarCanvas);

ajustarCanvas();


// ============================================================
// VARIABLES
// ============================================================

let figuras = [];

let siguienteId = 0;


// ============================================================
// DEDOS ACTIVOS
// ============================================================
//
// Cada dedo queda asociado a un cuadrado concreto.
//
// Esto es importante para que:
// dedo 1 -> cuadrado A
// dedo 2 -> SOLO pueda unirse al cuadrado A
//
// y no ocurra:
// dedo 1 -> cuadrado A
// dedo 2 -> cuadrado B
//

const punteros = new Map();


// ============================================================
// CREAR FIGURA
// ============================================================

function crearFigura(x, y, color, tamano = TAMANO_INICIAL) {

    return {

        id: siguienteId++,

        x: x,
        y: y,

        vx: (Math.random() - 0.5) * VELOCIDAD,
        vy: (Math.random() - 0.5) * VELOCIDAD,

        tamano: tamano,

        color: color,

        angulo: Math.random() * Math.PI * 2,

        velocidadAngulo:
            (Math.random() - 0.5) * 0.002,

        // ----------------------------------------------------
        // RESPIRACIÓN
        // ----------------------------------------------------

        faseRespiracion:
            Math.random() * Math.PI * 2,

        faseSecundaria:
            Math.random() * Math.PI * 2,

        velocidadRespiracion:
            0.012 + Math.random() * 0.005,

        amplitudRespiracion:
            0.045 + Math.random() * 0.015,

        respiracionX: 1,

        respiracionY: 1,

        // ----------------------------------------------------
        // GESTO
        // ----------------------------------------------------

        dedos: new Map(),

        distanciaInicial: 0,

        deformacionActual: 0,

        direccionEstiramiento: 0,

        escalaGesto: 1,

        compresionGesto: 1,

        // ----------------------------------------------------
        // RETRACCIÓN
        // ----------------------------------------------------

        rebotando: false,

        inicioRetraccion: 0,

        deformacionInicioRetraccion: 0,

        // ----------------------------------------------------
        // CONTROL
        // ----------------------------------------------------

        arrastrado: false,

        // ----------------------------------------------------
        // HERENCIA
        // ----------------------------------------------------

        generaciones: 0,

        puedeReproducirse: true
    };
}


// ============================================================
// CUADRADOS INICIALES
// ============================================================

function crearIniciales() {

    figuras = [];

    const rect = canvas.getBoundingClientRect();

    const posiciones = [

        {
            x: rect.width * 0.25,
            y: rect.height * 0.30
        },

        {
            x: rect.width * 0.75,
            y: rect.height * 0.30
        },

        {
            x: rect.width * 0.25,
            y: rect.height * 0.70
        },

        {
            x: rect.width * 0.75,
            y: rect.height * 0.70
        }
    ];

    posiciones.forEach((pos, i) => {

        figuras.push(
            crearFigura(
                pos.x,
                pos.y,
                COLORES[i % COLORES.length]
            )
        );

    });
}

crearIniciales();


// ============================================================
// GRADIENTES
// ============================================================

function obtenerGradiente(figura) {

    const s = figura.tamano;

    let gradiente;

    if (figura.color === "#D9D9D9") {

        gradiente = ctx.createRadialGradient(
            -s * 0.25,
            -s * 0.25,
            s * 0.05,
            0,
            0,
            s
        );

        gradiente.addColorStop(0, "#FFFFFF");
        gradiente.addColorStop(0.45, "#D9D9D9");
        gradiente.addColorStop(1, "#AEB4BA");

    }

    else if (figura.color === "#8BB2D3") {

        gradiente = ctx.createRadialGradient(
            -s * 0.25,
            -s * 0.25,
            s * 0.05,
            0,
            0,
            s
        );

        gradiente.addColorStop(0, "#DCECF9");
        gradiente.addColorStop(0.48, "#8BB2D3");
        gradiente.addColorStop(1, "#527A9C");

    }

    else if (figura.color === "#202D64") {

        gradiente = ctx.createRadialGradient(
            -s * 0.25,
            -s * 0.25,
            s * 0.05,
            0,
            0,
            s
        );

        gradiente.addColorStop(0, "#6674A5");
        gradiente.addColorStop(0.50, "#202D64");
        gradiente.addColorStop(1, "#10183B");

    }

    else {

        gradiente = ctx.createRadialGradient(
            -s * 0.25,
            -s * 0.25,
            s * 0.05,
            0,
            0,
            s
        );

        gradiente.addColorStop(0, "#7EA7D0");
        gradiente.addColorStop(0.50, "#2B538E");
        gradiente.addColorStop(1, "#18355F");
    }

    return gradiente;
}


// ============================================================
// RESPIRACIÓN
// ============================================================

function actualizarRespiracion(figura) {

    figura.faseRespiracion += figura.velocidadRespiracion;

    figura.faseSecundaria +=
        figura.velocidadRespiracion * 0.47;

    const ondaPrincipal =
        Math.sin(figura.faseRespiracion);

    const ondaSecundaria =
        Math.sin(figura.faseSecundaria);

    const respiracion =
        ondaPrincipal * figura.amplitudRespiracion +
        ondaSecundaria * 0.008;

    figura.respiracionX = 1 + respiracion;

    figura.respiracionY =
        1 + respiracion * 0.82;
}


// ============================================================
// ACTUALIZAR RETRACCIÓN
// ============================================================

function actualizarRetraccion(figura) {

    if (!figura.rebotando) return;

    const ahora = performance.now();

    const transcurrido =
        ahora - figura.inicioRetraccion;

    let progreso =
        transcurrido / DURACION_RETRACCION;

    if (progreso >= 1) {

        figura.rebotando = false;

        figura.deformacionActual = 0;

        figura.escalaGesto = 1;

        figura.compresionGesto = 1;

        figura.direccionEstiramiento = 0;

        return;
    }

    // --------------------------------------------------------
    // Curva rápida al principio y suave al final.
    // --------------------------------------------------------

    const suavizado =
        1 - Math.pow(1 - progreso, 3);

    let deformacion =
        figura.deformacionInicioRetraccion *
        (1 - suavizado);

    // --------------------------------------------------------
    // Pequeño rebote visual al final.
    // --------------------------------------------------------

    if (progreso > 0.78) {

        const rebote =
            Math.sin(
                (progreso - 0.78) /
                0.22 *
                Math.PI
            ) * 0.035 *
            (1 - progreso);

        deformacion += rebote;
    }

    figura.deformacionActual =
        Math.max(0, deformacion);

    const d =
        figura.deformacionActual;

    figura.escalaGesto =
        1 + (ESTIRAMIENTO_MAXIMO - 1) * d;

    figura.compresionGesto =
        1 - 0.35 * d;
}


// ============================================================
// INICIAR RETRACCIÓN
// ============================================================

function iniciarRetraccion(figura) {

    figura.rebotando = true;

    figura.inicioRetraccion =
        performance.now();

    figura.deformacionInicioRetraccion =
        figura.deformacionActual;
}


// ============================================================
// ACTUALIZAR MOVIMIENTO
// ============================================================

function actualizarMovimiento(figura) {

    // --------------------------------------------------------
    // Mientras se arrastra, el dedo controla la posición.
    // --------------------------------------------------------

    if (figura.arrastrado) return;

    figura.x += figura.vx;

    figura.y += figura.vy;

    figura.angulo += figura.velocidadAngulo;

    actualizarRespiracion(figura);

    // --------------------------------------------------------
    // BORDES
    // --------------------------------------------------------

    const rect = canvas.getBoundingClientRect();

    const margen =
        figura.tamano *
        0.5 *
        Math.max(
            figura.escalaGesto,
            1
        );

    if (figura.x - margen < 0) {

        figura.x = margen;

        figura.vx *= -1;
    }

    if (figura.x + margen > rect.width) {

        figura.x = rect.width - margen;

        figura.vx *= -1;
    }

    if (figura.y - margen < 0) {

        figura.y = margen;

        figura.vy *= -1;
    }

    if (figura.y + margen > rect.height) {

        figura.y = rect.height - margen;

        figura.vy *= -1;
    }
}


// ============================================================
// COLISIONES
// ============================================================

function actualizarColisiones() {

    for (let i = 0; i < figuras.length; i++) {

        for (let j = i + 1; j < figuras.length; j++) {

            const a = figuras[i];

            const b = figuras[j];

            const dx = b.x - a.x;

            const dy = b.y - a.y;

            const distancia =
                Math.sqrt(dx * dx + dy * dy);

            const radioA =
                a.tamano *
                0.5 *
                Math.max(a.escalaGesto, 1);

            const radioB =
                b.tamano *
                0.5 *
                Math.max(b.escalaGesto, 1);

            const distanciaMinima =
                radioA + radioB;

            if (
                distancia > 0 &&
                distancia < distanciaMinima
            ) {

                const nx = dx / distancia;

                const ny = dy / distancia;

                const penetracion =
                    distanciaMinima - distancia;

                const separacion =
                    penetracion * 0.5;

                a.x -= nx * separacion;
                a.y -= ny * separacion;

                b.x += nx * separacion;
                b.y += ny * separacion;

                const velocidadRelativa =
                    (b.vx - a.vx) * nx +
                    (b.vy - a.vy) * ny;

                if (velocidadRelativa < 0) {

                    const impulso =
                        velocidadRelativa *
                        FUERZA_CHOQUE;

                    a.vx += nx * impulso;
                    a.vy += ny * impulso;

                    b.vx -= nx * impulso;
                    b.vy -= ny * impulso;
                }
            }
        }
    }
}


// ============================================================
// OBTENER FIGURA TOCADA
// ============================================================
//
// IMPORTANTE:
//
// Se comprueba primero la figura que está más arriba
// visualmente.
//
// Además se utiliza el tamaño REAL de la figura deformada.
//
// Esto hace mucho más preciso el agarre con los dedos.
//

function obtenerFiguraEnPunto(x, y) {

    for (let i = figuras.length - 1; i >= 0; i--) {

        const figura = figuras[i];

        const dx = x - figura.x;

        const dy = y - figura.y;

        const cos = Math.cos(-figura.angulo);

        const sin = Math.sin(-figura.angulo);

        const localX =
            dx * cos - dy * sin;

        const localY =
            dx * sin + dy * cos;

        const mitad =
            figura.tamano * 0.5;

        const escalaX =
            figura.escalaGesto;

        const escalaY =
            figura.compresionGesto;

        const radioX =
            mitad * escalaX + 18;

        const radioY =
            mitad * escalaY + 18;

        // ----------------------------------------------------
        // Hitbox ligeramente ampliada para dedos.
        // ----------------------------------------------------

        if (
            Math.abs(localX) <= radioX &&
            Math.abs(localY) <= radioY
        ) {

            return figura;
        }
    }

    return null;
}


// ============================================================
// OBTENER POSICIÓN DEL PUNTERO
// ============================================================

function obtenerPosicionPuntero(e) {

    const rect =
        canvas.getBoundingClientRect();

    return {

        x: e.clientX - rect.left,

        y: e.clientY - rect.top
    };
}


// ============================================================
// POINTER DOWN
// ============================================================

canvas.addEventListener(
    "pointerdown",
    function(e) {

        e.preventDefault();

        const pos =
            obtenerPosicionPuntero(e);

        const figura =
            obtenerFiguraEnPunto(
                pos.x,
                pos.y
            );

        if (!figura) return;

        // ----------------------------------------------------
        // Capturamos el dedo.
        // ----------------------------------------------------

        try {
            canvas.setPointerCapture(e.pointerId);
        } catch (_) {}

        // ----------------------------------------------------
        // Guardamos qué figura tomó este dedo.
        // ----------------------------------------------------

        punteros.set(
            e.pointerId,
            {
                figura: figura,
                x: pos.x,
                y: pos.y
            }
        );

        // ----------------------------------------------------
        // Si todavía no hay dedos en la figura:
        // movimiento normal.
        // ----------------------------------------------------

        if (figura.dedos.size === 0) {

            figura.dedos.set(
                e.pointerId,
                {
                    x: pos.x,
                    y: pos.y
                }
            );

            figura.arrastrado = true;

            return;
        }

        // ----------------------------------------------------
        // Si ya hay UN dedo:
        //
        // El segundo dedo tiene que estar sobre el MISMO
        // cuadrado.
        // ----------------------------------------------------

        if (figura.dedos.size === 1) {

            figura.dedos.set(
                e.pointerId,
                {
                    x: pos.x,
                    y: pos.y
                }
            );

            const dedos =
                Array.from(
                    figura.dedos.values()
                );

            const dx =
                dedos[1].x -
                dedos[0].x;

            const dy =
                dedos[1].y -
                dedos[0].y;

            figura.distanciaInicial =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );

            // ------------------------------------------------
            // Evitamos que una distancia inicial demasiado
            // pequeña produzca una deformación inmediata.
            // ------------------------------------------------

            if (figura.distanciaInicial < 10) {

                figura.distanciaInicial = 10;
            }

            figura.arrastrado = false;

            return;
        }
    },
    {
        passive: false
    }
);


// ============================================================
// POINTER MOVE
// ============================================================

canvas.addEventListener(
    "pointermove",
    function(e) {

        e.preventDefault();

        const registro =
            punteros.get(e.pointerId);

        if (!registro) return;

        const figura =
            registro.figura;

        const pos =
            obtenerPosicionPuntero(e);

        registro.x = pos.x;
        registro.y = pos.y;

        // ----------------------------------------------------
        // Actualizamos la posición del dedo dentro de la
        // figura.
        // ----------------------------------------------------

        if (figura.dedos.has(e.pointerId)) {

            figura.dedos.get(
                e.pointerId
            ).x = pos.x;

            figura.dedos.get(
                e.pointerId
            ).y = pos.y;
        }

        // ----------------------------------------------------
        // UN SOLO DEDO
        //
        // Solo mueve.
        // NO deforma.
        // ----------------------------------------------------

        if (figura.dedos.size === 1) {

            figura.x = pos.x;

            figura.y = pos.y;

            figura.arrastrado = true;

            return;
        }

        // ----------------------------------------------------
        // DOS DEDOS
        //
        // Recién acá se puede deformar.
        // ----------------------------------------------------

        if (figura.dedos.size === 2) {

            const dedos =
                Array.from(
                    figura.dedos.values()
                );

            const dx =
                dedos[1].x -
                dedos[0].x;

            const dy =
                dedos[1].y -
                dedos[0].y;

            const distancia =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );

            const distanciaInicial =
                figura.distanciaInicial;

            // ------------------------------------------------
            // Cuánto se separaron respecto al inicio.
            // ------------------------------------------------

            let progreso =
                (distancia - distanciaInicial) /
                (
                    distanciaInicial *
                    (ESTIRAMIENTO_MAXIMO - 1)
                );

            progreso =
                Math.max(
                    0,
                    Math.min(1, progreso)
                );

            // ------------------------------------------------
            // Solo deformamos si REALMENTE se están
            // separando.
            // ------------------------------------------------

            if (distancia > distanciaInicial) {

                figura.deformacionActual =
                    progreso;

                figura.escalaGesto =
                    1 +
                    (ESTIRAMIENTO_MAXIMO - 1) *
                    progreso;

                figura.compresionGesto =
                    1 -
                    0.35 *
                    progreso;

                figura.direccionEstiramiento =
                    Math.atan2(
                        dy,
                        dx
                    );

            } else {

                figura.deformacionActual = 0;

                figura.escalaGesto = 1;

                figura.compresionGesto = 1;
            }

            // ------------------------------------------------
            // El centro sigue a los dos dedos.
            // ------------------------------------------------

            figura.x =
                (dedos[0].x +
                 dedos[1].x) / 2;

            figura.y =
                (dedos[0].y +
                 dedos[1].y) / 2;

            // ------------------------------------------------
            // Llegó al máximo.
            // Crear hijos.
            // ------------------------------------------------

            if (
                figura.deformacionActual >=
                DEFORMACION_MAXIMA
            ) {

                crearHijos(figura);

                // ------------------------------------------------
                // MUY IMPORTANTE:
                //
                // Después de crear los hijos comenzamos
                // inmediatamente la retracción.
                // ------------------------------------------------

                iniciarRetraccion(figura);

                // ------------------------------------------------
                // Reiniciamos la distancia para que no vuelva
                // a crear hijos continuamente.
                // ------------------------------------------------

                figura.distanciaInicial =
                    distancia;

                figura.deformacionActual =
                    1;
            }
        }
    },
    {
        passive: false
    }
);


// ============================================================
// POINTER UP
// ============================================================

function soltarPuntero(e) {

    const registro =
        punteros.get(e.pointerId);

    if (!registro) return;

    const figura =
        registro.figura;

    figura.dedos.delete(
        e.pointerId
    );

    punteros.delete(
        e.pointerId
    );

    try {
        canvas.releasePointerCapture(
            e.pointerId
        );
    } catch (_) {}

    // --------------------------------------------------------
    // Si queda un dedo:
    // volvemos al modo movimiento.
    // --------------------------------------------------------

    if (figura.dedos.size === 1) {

        figura.deformacionActual = 0;

        figura.escalaGesto = 1;

        figura.compresionGesto = 1;

        figura.arrastrado = true;

        return;
    }

    // --------------------------------------------------------
    // Si se soltaron los dos dedos mientras estaba deformado,
    // vuelve a su forma original.
    // --------------------------------------------------------

    if (
        figura.deformacionActual > 0 &&
        !figura.rebotando
    ) {

        iniciarRetraccion(figura);
    }

    figura.arrastrado = false;
}


canvas.addEventListener(
    "pointerup",
    soltarPuntero
);

canvas.addEventListener(
    "pointercancel",
    soltarPuntero
);

canvas.addEventListener(
    "pointerleave",
    function(e) {

        // No eliminamos el puntero inmediatamente.
        // Si el navegador mantiene el pointer capture,
        // el gesto puede continuar correctamente.
    }
);


// ============================================================
// CREAR HIJOS
// ============================================================

function crearHijos(padre) {

    if (!padre.puedeReproducirse) {
        return;
    }

    const cantidad = 3;

    const direccion =
        padre.direccionEstiramiento;

    const distancia =
        DISTANCIA_SEPARACION;

    for (let i = 0; i < cantidad; i++) {

        // ----------------------------------------------------
        // Separación angular de los hijos.
        // ----------------------------------------------------

        const variacion =
            (i - 1) * 0.45;

        const angulo =
            direccion + variacion;

        const x =
            padre.x +
            Math.cos(angulo) *
            distancia;

        const y =
            padre.y +
            Math.sin(angulo) *
            distancia;

        const hijo =
            crearFigura(
                x,
                y,
                padre.color,
                padre.tamano *
                REDUCCION_HIJO
            );

        // ----------------------------------------------------
        // Los hijos salen impulsados hacia afuera.
        // ----------------------------------------------------

        hijo.vx =
            padre.vx +
            Math.cos(angulo) *
            0.8;

        hijo.vy =
            padre.vy +
            Math.sin(angulo) *
            0.8;

        hijo.angulo =
            padre.angulo;

        hijo.generaciones =
            padre.generaciones + 1;

        figuras.push(hijo);
    }

    // --------------------------------------------------------
    // El padre sigue existiendo.
    // --------------------------------------------------------

    padre.puedeReproducirse = true;
}


// ============================================================
// DIBUJAR FIGURA
// ============================================================

function dibujarFigura(figura) {

    ctx.save();

    ctx.translate(
        figura.x,
        figura.y
    );

    ctx.rotate(figura.angulo);

    // --------------------------------------------------------
    // Escalas normales de respiración.
    // --------------------------------------------------------

    const respiracionX =
        figura.respiracionX;

    const respiracionY =
        figura.respiracionY;

    // --------------------------------------------------------
    // DEFORMACIÓN
    // --------------------------------------------------------

    const deformacion =
        figura.deformacionActual;

    const escalaX =
        figura.escalaGesto *
        respiracionX;

    const escalaY =
        figura.compresionGesto *
        respiracionY;

    ctx.scale(
        escalaX,
        escalaY
    );

    const mitad =
        figura.tamano / 2;

    const gradiente =
        obtenerGradiente(figura);

    ctx.fillStyle =
        gradiente;

    // --------------------------------------------------------
    // SOMBRA
    // --------------------------------------------------------

    ctx.shadowColor =
        figura.color;

    ctx.shadowBlur =
        deformacion > 0
            ? 25
            : 18;

    ctx.shadowOffsetX = 0;

    ctx.shadowOffsetY = 0;

    // ========================================================
    // CUADRADO PERFECTO
    // ========================================================
    //
    // Cuando no está deformado, dibujamos un cuadrado REAL.
    //
    // No roundedRect.
    // No curva.
    // No deformación.
    //
    // Esto asegura que vuelva exactamente a su forma inicial.
    //

    if (deformacion <= 0.001) {

        ctx.beginPath();

        ctx.rect(
            -mitad,
            -mitad,
            figura.tamano,
            figura.tamano
        );

        ctx.fill();

    }

    // ========================================================
    // MASA BLANDA
    // ========================================================
    //
    // Mientras se estira:
    // - los lados se curvan
    // - las esquinas se vuelven orgánicas
    // - no aparece una punta
    // - parece una masa de goma/latex
    //

    else {

        const estiramiento =
            deformacion;

        const largo =
            mitad *
            (1 + estiramiento * 0.95);

        const ancho =
            mitad *
            (1 - estiramiento * 0.28);

        const curva =
            10 +
            estiramiento * 22;

        const deformacionCurva =
            Math.sin(
                figura.faseRespiracion
            ) *
            3 *
            estiramiento;

        ctx.beginPath();

        // ----------------------------------------------------
        // Arriba
        // ----------------------------------------------------

        ctx.moveTo(
            -largo + curva,
            -ancho
        );

        ctx.quadraticCurveTo(
            0,
            -ancho -
            deformacionCurva,
            largo - curva,
            -ancho
        );

        // ----------------------------------------------------
        // Derecha
        // ----------------------------------------------------

        ctx.quadraticCurveTo(
            largo +
            deformacionCurva,
            0,
            largo - curva,
            ancho
        );

        // ----------------------------------------------------
        // Abajo
        // ----------------------------------------------------

        ctx.quadraticCurveTo(
            0,
            ancho +
            deformacionCurva,
            -largo + curva,
            ancho
        );

        // ----------------------------------------------------
        // Izquierda
        // ----------------------------------------------------

        ctx.quadraticCurveTo(
            -largo -
            deformacionCurva,
            0,
            -largo + curva,
            -ancho
        );

        ctx.closePath();

        ctx.fill();
    }

    // ========================================================
    // BRILLO INTERNO
    // ========================================================

    ctx.shadowBlur = 0;

    ctx.globalAlpha = 0.16;

    const brillo =
        ctx.createRadialGradient(
            -mitad * 0.35,
            -mitad * 0.35,
            1,
            0,
            0,
            mitad * 1.4
        );

    brillo.addColorStop(
        0,
        "#FFFFFF"
    );

    brillo.addColorStop(
        1,
        "rgba(255,255,255,0)"
    );

    ctx.fillStyle =
        brillo;

    ctx.fill();

    ctx.restore();
}


// ============================================================
// ACTUALIZAR TODO
// ============================================================

function actualizar() {

    figuras.forEach(figura => {

        actualizarMovimiento(figura);

        actualizarRetraccion(figura);

    });

    actualizarColisiones();
}


// ============================================================
// DIBUJAR TODO
// ============================================================

function dibujar() {

    const rect =
        canvas.getBoundingClientRect();

    ctx.clearRect(
        0,
        0,
        rect.width,
        rect.height
    );

    figuras.forEach(
        dibujarFigura
    );
}


// ============================================================
// LOOP
// ============================================================

function animar() {

    actualizar();

    dibujar();

    requestAnimationFrame(animar);
}

animar();

