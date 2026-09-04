// ============================================================
// CUADRADOS 3 - CADUCIDAD
// ============================================================
//
// INTERACCIÓN:
//
// - Comienzan 4 cuadrados.
// - Se mueven solos.
// - Chocan entre ellos y con los bordes.
// - Los cuadrados tienen movimiento orgánico.
// - La interacción se realiza con DOS dedos.
// - Cada dedo debe tocar un cuadrado diferente.
// - Al mantener los dos dedos sobre los cuadrados,
//   comienza la CADUCIDAD.
// - Los cuadrados pierden progresivamente:
//      • tamaño
//      • opacidad
//      • grosor visual
// - Al dejar de tocar, la caducidad se detiene.
// - Cuando un cuadrado llega al tamaño mínimo,
//   desaparece.
// ============================================================


// ============================================================
// CANVAS
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

// Tamaño inicial de los cuadrados.
const TAMANO_INICIAL = 110;

// Tamaño mínimo antes de desaparecer.
const TAMANO_MINIMO = 8;

// Velocidad de movimiento.
const VELOCIDAD = 0.7;

// Fuerza del choque.
const FUERZA_CHOQUE = 0.8;

// Velocidad de caducidad.
const VELOCIDAD_CADUCIDAD = 0.18;

// Velocidad de recuperación cuando se dejan de tocar.
const VELOCIDAD_RECUPERACION = 0.04;


// ============================================================
// ARRAY DE FIGURAS
// ============================================================

let figuras = [];


// ============================================================
// VARIABLES DEL GESTO DE DOS DEDOS
// ============================================================

let dedo1ID = null;
let dedo2ID = null;

let figura1Seleccionada = null;
let figura2Seleccionada = null;

let dosDedosActivos = false;


// ============================================================
// AJUSTAR CANVAS
// ============================================================

function ajustarCanvas() {

    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;
}


// ============================================================
// CREAR FIGURA
// ============================================================

function crearFigura(x, y, color) {

    return {

        // -------------------------
        // POSICIÓN
        // -------------------------

        x: x,
        y: y,

        // -------------------------
        // TAMAÑO
        // -------------------------

        tamano: TAMANO_INICIAL,

        tamanoOriginal: TAMANO_INICIAL,

        // -------------------------
        // COLOR
        // -------------------------

        color: color,

        // -------------------------
        // MOVIMIENTO
        // -------------------------

        vx: (Math.random() - 0.5) * VELOCIDAD,
        vy: (Math.random() - 0.5) * VELOCIDAD,

        // -------------------------
        // ROTACIÓN
        // -------------------------

        rotacion: Math.random() * Math.PI * 2,

        velocidadRotacion:
            (Math.random() - 0.5) * 0.004,

        // -------------------------
        // MOVIMIENTO ORGÁNICO
        // -------------------------

        fase: Math.random() * Math.PI * 2,

        // -------------------------
        // CADUCIDAD
        // -------------------------

        caducidad: 0,

        // 0 = nueva
        // 1 = completamente caducada

        opacidad: 1,

        // -------------------------
        // ESTADO
        // -------------------------

        muriendo: false,

        activa: true
    };
}


// ============================================================
// CREAR FIGURAS INICIALES
// ============================================================

function crearFigurasIniciales() {

    figuras = [];

    figuras.push(
        crearFigura(
            canvas.width * 0.25,
            canvas.height * 0.30,
            COLORES[0]
        )
    );

    figuras.push(
        crearFigura(
            canvas.width * 0.75,
            canvas.height * 0.30,
            COLORES[1]
        )
    );

    figuras.push(
        crearFigura(
            canvas.width * 0.25,
            canvas.height * 0.70,
            COLORES[2]
        )
    );

    figuras.push(
        crearFigura(
            canvas.width * 0.75,
            canvas.height * 0.70,
            COLORES[3]
        )
    );
}


// ============================================================
// LIMITAR FIGURA A LOS BORDES
// ============================================================

function limitarFigura(figura) {

    const radio = figura.tamano / 2;

    if (figura.x - radio < 0) {

        figura.x = radio;

        figura.vx *= -1;
    }

    if (figura.x + radio > canvas.width) {

        figura.x =
            canvas.width - radio;

        figura.vx *= -1;
    }

    if (figura.y - radio < 0) {

        figura.y = radio;

        figura.vy *= -1;
    }

    if (figura.y + radio > canvas.height) {

        figura.y =
            canvas.height - radio;

        figura.vy *= -1;
    }
}


// ============================================================
// ACTUALIZAR MOVIMIENTO
// ============================================================

function actualizarMovimiento() {

    figuras.forEach(figura => {

        if (!figura.activa) {
            return;
        }

        // Movimiento principal.

        figura.x += figura.vx;
        figura.y += figura.vy;

        // Movimiento orgánico.

        figura.fase += 0.015;

        figura.x +=
            Math.sin(figura.fase) * 0.15;

        figura.y +=
            Math.cos(figura.fase * 0.8) * 0.15;

        // Rotación.

        figura.rotacion +=
            figura.velocidadRotacion;

        // Limitar a pantalla.

        limitarFigura(figura);
    });
}


// ============================================================
// COLISIONES
// ============================================================

function detectarColisiones() {

    for (
        let i = 0;
        i < figuras.length;
        i++
    ) {

        for (
            let j = i + 1;
            j < figuras.length;
            j++
        ) {

            const a = figuras[i];
            const b = figuras[j];

            if (
                !a.activa ||
                !b.activa
            ) {
                continue;
            }

            const dx = b.x - a.x;
            const dy = b.y - a.y;

            const distancia =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );

            const distanciaMinima =
                (a.tamano + b.tamano) / 2;

            if (
                distancia < distanciaMinima &&
                distancia > 0
            ) {

                const nx =
                    dx / distancia;

                const ny =
                    dy / distancia;

                const solapamiento =
                    distanciaMinima - distancia;

                // Separar.

                a.x -=
                    nx * solapamiento * 0.5;

                a.y -=
                    ny * solapamiento * 0.5;

                b.x +=
                    nx * solapamiento * 0.5;

                b.y +=
                    ny * solapamiento * 0.5;

                // Impulso.

                a.vx -=
                    nx * FUERZA_CHOQUE;

                a.vy -=
                    ny * FUERZA_CHOQUE;

                b.vx +=
                    nx * FUERZA_CHOQUE;

                b.vy +=
                    ny * FUERZA_CHOQUE;

                limitarFigura(a);
                limitarFigura(b);
            }
        }
    }
}


// ============================================================
// BUSCAR FIGURA
// ============================================================

function buscarFigura(x, y) {

    for (
        let i = figuras.length - 1;
        i >= 0;
        i--
    ) {

        const figura = figuras[i];

        if (!figura.activa) {
            continue;
        }

        const mitad =
            figura.tamano / 2;

        if (
            x >= figura.x - mitad &&
            x <= figura.x + mitad &&
            y >= figura.y - mitad &&
            y <= figura.y + mitad
        ) {

            return figura;
        }
    }

    return null;
}


// ============================================================
// OBTENER POSICIÓN DEL TOUCH
// ============================================================

function obtenerTouch(touch) {

    const rect =
        canvas.getBoundingClientRect();

    return {

        x:
            touch.clientX - rect.left,

        y:
            touch.clientY - rect.top
    };
}


// ============================================================
// INICIAR INTERACCIÓN
// ============================================================

function iniciarInteraccion() {

    if (
        dedo1ID === null ||
        dedo2ID === null
    ) {
        return;
    }

    if (
        !figura1Seleccionada ||
        !figura2Seleccionada
    ) {
        return;
    }

    // Los dos dedos tienen que estar
    // sobre DOS cuadrados diferentes.

    if (
        figura1Seleccionada ===
        figura2Seleccionada
    ) {
        figura1Seleccionada = null;
        figura2Seleccionada = null;

        dosDedosActivos = false;

        return;
    }

    dosDedosActivos = true;

    figura1Seleccionada.muriendo = true;
    figura2Seleccionada.muriendo = true;
}


// ============================================================
// ACTUALIZAR CADUCIDAD
// ============================================================

function actualizarCaducidad() {

    figuras.forEach(figura => {

        if (!figura.activa) {
            return;
        }

        // ----------------------------------------------------
        // CADUCIDAD
        // ----------------------------------------------------

        if (
            dosDedosActivos &&
            (
                figura === figura1Seleccionada ||
                figura === figura2Seleccionada
            )
        ) {

            figura.caducidad +=
                VELOCIDAD_CADUCIDAD;

            figura.caducidad =
                Math.min(
                    figura.caducidad,
                    1
                );
        }

        // ----------------------------------------------------
        // RECUPERACIÓN
        // ----------------------------------------------------

        else if (
            figura.caducidad > 0 &&
            !figura.muriendo
        ) {

            figura.caducidad -=
                VELOCIDAD_RECUPERACION;

            figura.caducidad =
                Math.max(
                    figura.caducidad,
                    0
                );
        }

        // ----------------------------------------------------
        // APLICAR CADUCIDAD
        // ----------------------------------------------------

        figura.tamano =
            figura.tamanoOriginal *
            (
                1 -
                figura.caducidad * 0.92
            );

        figura.opacidad =
            1 -
            figura.caducidad;

        // ----------------------------------------------------
        // DESAPARECER
        // ----------------------------------------------------

        if (
            figura.tamano <= TAMANO_MINIMO ||
            figura.opacidad <= 0.02
        ) {

            figura.activa = false;

            figura.muriendo = false;
        }
    });

    // Limpiar figuras desaparecidas.

    figuras =
        figuras.filter(
            figura => figura.activa
        );
}


// ============================================================
// DIBUJAR FIGURA
// ============================================================

function dibujarFigura(figura) {

    if (!figura.activa) {
        return;
    }

    ctx.save();

    // Centro.

    ctx.translate(
        figura.x,
        figura.y
    );

    // Rotación.

    ctx.rotate(
        figura.rotacion
    );

    // Opacidad.

    ctx.globalAlpha =
        figura.opacidad;

    // Color.

    ctx.fillStyle =
        figura.color;

    // Cuadrado.

    ctx.fillRect(
        -figura.tamano / 2,
        -figura.tamano / 2,
        figura.tamano,
        figura.tamano
    );

    ctx.restore();
}


// ============================================================
// DIBUJAR TODO
// ============================================================

function dibujar() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    figuras.forEach(
        dibujarFigura
    );
}


// ============================================================
// TOUCHSTART
// ============================================================

canvas.addEventListener(
    "touchstart",
    function(evento) {

        evento.preventDefault();

        // ----------------------------------------------------
        // PRIMER DEDO
        // ----------------------------------------------------

        if (
            evento.touches.length === 1
        ) {

            const touch =
                evento.touches[0];

            dedo1ID =
                touch.identifier;

            const posicion =
                obtenerTouch(touch);

            figura1Seleccionada =
                buscarFigura(
                    posicion.x,
                    posicion.y
                );
        }

        // ----------------------------------------------------
        // SEGUNDO DEDO
        // ----------------------------------------------------

        if (
            evento.touches.length >= 2
        ) {

            const touch1 =
                evento.touches[0];

            const touch2 =
                evento.touches[1];

            dedo1ID =
                touch1.identifier;

            dedo2ID =
                touch2.identifier;

            const posicion1 =
                obtenerTouch(touch1);

            const posicion2 =
                obtenerTouch(touch2);

            figura1Seleccionada =
                buscarFigura(
                    posicion1.x,
                    posicion1.y
                );

            figura2Seleccionada =
                buscarFigura(
                    posicion2.x,
                    posicion2.y
                );

            iniciarInteraccion();
        }
    },
    {
        passive: false
    }
);


// ============================================================
// TOUCHMOVE
// ============================================================

canvas.addEventListener(
    "touchmove",
    function(evento) {

        evento.preventDefault();

        if (!dosDedosActivos) {
            return;
        }

        // No necesitamos mover las figuras
        // con los dedos.
        //
        // Los dedos solamente mantienen
        // activa la caducidad.
    },
    {
        passive: false
    }
);


// ============================================================
// FINALIZAR INTERACCIÓN
// ============================================================

function finalizarInteraccion(evento) {

    evento.preventDefault();

    // Al retirar cualquiera de los dedos,
    // termina la interacción.

    if (
        evento.touches.length < 2
    ) {

        dosDedosActivos = false;

        if (figura1Seleccionada) {
            figura1Seleccionada.muriendo = false;
        }

        if (figura2Seleccionada) {
            figura2Seleccionada.muriendo = false;
        }

        figura1Seleccionada = null;
        figura2Seleccionada = null;

        dedo1ID = null;
        dedo2ID = null;
    }
}


// ============================================================
// TOUCHEND
// ============================================================

canvas.addEventListener(
    "touchend",
    finalizarInteraccion,
    {
        passive: false
    }
);


// ============================================================
// TOUCHCANCEL
// ============================================================

canvas.addEventListener(
    "touchcancel",
    finalizarInteraccion,
    {
        passive: false
    }
);


// ============================================================
// INICIALIZACIÓN
// ============================================================

ajustarCanvas();

crearFigurasIniciales();


// ============================================================
// ANIMACIÓN
// ============================================================

function animar() {

    actualizarMovimiento();

    detectarColisiones();

    actualizarCaducidad();

    dibujar();

    requestAnimationFrame(
        animar
    );
}

animar();


// ============================================================
// CAMBIO DE TAMAÑO
// ============================================================

window.addEventListener(
    "resize",
    function() {

        ajustarCanvas();

        figuras.forEach(
            limitarFigura
        );
    }
);