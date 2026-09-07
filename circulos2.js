
// ============================================================
// EMPATÍA
// circulos2.js
// ============================================================
//
// - 4 círculos comienzan en las mismas posiciones que IDENTIDAD.
// - Algunos comienzan alterados y otros tranquilos al azar.
// - Todos permanecen en movimiento constante.
// - Mouse y touch habilitados.
// - Se puede agarrar y mover cada círculo.
// - 1 círculo seleccionado: se puede mover, pero NO se calma.
// - 2 o más círculos seleccionados: comienzan a calmarse.
// - Al soltar: los círculos calmados permanecen calmados.
// - Los calmados se mueven lento y respiran suavemente.
// - Clic fuera de un círculo: no ocurre nada.
// - Sin brillo ni aro exterior.
// - Estética basada en IDENTIDAD.
// ============================================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.style.touchAction = "none";

// ============================================================
// COLORES
// ============================================================

const colores = [
    "#D9D9D9",
    "#8BB2D3",
    "#202D64",
    "#2B538E"
];

// ============================================================
// CONFIGURACIÓN
// ============================================================

const CANTIDAD_CIRCULOS = 4;
const RADIO_BASE = 55;

const VELOCIDAD_MAXIMA = 1.5;

// ============================================================
// POSICIONES INICIALES
// IGUALES A IDENTIDAD
// ============================================================

const posiciones = [
    { x: 0.25, y: 0.30 },
    { x: 0.75, y: 0.30 },
    { x: 0.25, y: 0.70 },
    { x: 0.75, y: 0.70 }
];

// ============================================================
// VARIABLES
// ============================================================

let circulos = [];
let punteros = new Map();


// ============================================================
// AJUSTAR CANVAS
// ============================================================

function ajustarCanvas() {

    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;

    if (circulos.length === 0) {
        crearCirculos();
    }
}


// ============================================================
// CREAR CÍRCULOS
// ============================================================

function crearCirculos() {

    circulos = [];

    for (let i = 0; i < CANTIDAD_CIRCULOS; i++) {

        // ----------------------------------------------------
        // ALTERACIÓN ALEATORIA
        // ----------------------------------------------------

        const alterado = Math.random() < 0.5;

        const angulo =
            Math.random() * Math.PI * 2;

        const velocidadBase =
            0.55 +
            Math.random() *
            (VELOCIDAD_MAXIMA - 0.55);

        const velocidad =
            alterado
                ? velocidadBase
                : velocidadBase * 0.45;

        // ----------------------------------------------------
        // VELOCIDAD INICIAL
        // ----------------------------------------------------

        const velocidadObjetivoX =
            Math.cos(angulo) * velocidad;

        const velocidadObjetivoY =
            Math.sin(angulo) * velocidad;

        // ----------------------------------------------------
        // CÍRCULO
        // ----------------------------------------------------

        circulos.push({

            // Posición igual a IDENTIDAD
            x:
                canvas.width *
                posiciones[i].x,

            y:
                canvas.height *
                posiciones[i].y,

            radioBase:
                RADIO_BASE,

            radio:
                RADIO_BASE,

            color:
                colores[i % colores.length],

            // Movimiento
            vx:
                velocidadObjetivoX,

            vy:
                velocidadObjetivoY,

            velocidadObjetivoX:
                velocidadObjetivoX,

            velocidadObjetivoY:
                velocidadObjetivoY,

            // Alteración
            alteracion:
                alterado,

            // ------------------------------------------------
            // RESPIRACIÓN
            // ------------------------------------------------

            frecuenciaRespiracion:
                0.002 +
                Math.random() *
                0.0035,

            amplitudRespiracion:
                alterado
                    ? 3 + Math.random() * 9
                    : 1.2 + Math.random() * 2,

            faseRespiracion:
                Math.random() *
                Math.PI * 2,

            // ------------------------------------------------
            // CALMA
            // ------------------------------------------------

            nivelCalma:
                alterado
                    ? 0
                    : 1,

            calmadoPermanentemente:
                !alterado,

            // ------------------------------------------------
            // SELECCIÓN
            // ------------------------------------------------

            seleccionado:
                false,

            punterosSobre:
                new Set()
        });
    }
}


// ============================================================
// DETECTAR CÍRCULO
// ============================================================

function detectarCirculo(x, y) {

    for (
        let i = circulos.length - 1;
        i >= 0;
        i--
    ) {

        const circulo = circulos[i];

        const distancia =
            Math.hypot(
                x - circulo.x,
                y - circulo.y
            );

        if (
            distancia <=
            circulo.radio + 15
        ) {

            return circulo;
        }
    }

    return null;
}


// ============================================================
// ACTUALIZAR CALMA
// ============================================================

function actualizarCalma() {

    // --------------------------------------------------------
    // Buscar cuántos círculos están seleccionados
    // --------------------------------------------------------

    const seleccionados =
        circulos.filter(
            circulo =>
                circulo.seleccionado
        );

    const cantidadSeleccionados =
        seleccionados.length;

    // --------------------------------------------------------
    // CON 2 O MÁS CÍRCULOS SELECCIONADOS
    // SE CALMAN TODOS LOS SELECCIONADOS
    // --------------------------------------------------------

    if (
        cantidadSeleccionados >= 2
    ) {

        for (
            const circulo of seleccionados
        ) {

            if (
                !circulo.calmadoPermanentemente
            ) {

                circulo.nivelCalma +=
                    0.018;

                if (
                    circulo.nivelCalma >= 1
                ) {

                    circulo.nivelCalma = 1;

                    circulo.calmadoPermanentemente =
                        true;

                    circulo.alteracion =
                        false;
                }
            }
        }
    }

    // --------------------------------------------------------
    // LOS CÍRCULOS QUE YA ESTÁN CALMADOS
    // NO VUELVEN A ALTERARSE
    // --------------------------------------------------------

    for (
        const circulo of circulos
    ) {

        if (
            circulo.calmadoPermanentemente
        ) {

            circulo.nivelCalma +=
                (1 - circulo.nivelCalma) *
                0.04;

            if (
                circulo.nivelCalma >
                0.999
            ) {

                circulo.nivelCalma = 1;
            }
        }
    }
}


// ============================================================
// MOVER CÍRCULOS
// ============================================================

function moverCirculos() {

    for (
        const circulo of circulos
    ) {

        // ----------------------------------------------------
        // SI ESTÁ SELECCIONADO
        // LO CONTROLA EL MOUSE / DEDO
        // ----------------------------------------------------

        if (
            circulo.seleccionado
        ) {
            continue;
        }

        // ----------------------------------------------------
        // CÍRCULO CALMADO
        // ----------------------------------------------------

        if (
            circulo.calmadoPermanentemente
        ) {

            // Movimiento lento y constante

            circulo.vx +=
                (
                    circulo.velocidadObjetivoX *
                    0.28 -
                    circulo.vx
                ) *
                0.01;

            circulo.vy +=
                (
                    circulo.velocidadObjetivoY *
                    0.28 -
                    circulo.vy
                ) *
                0.01;

            circulo.x +=
                circulo.vx;

            circulo.y +=
                circulo.vy;
        }

        // ----------------------------------------------------
        // CÍRCULO ALTERADO
        // ----------------------------------------------------

        else {

            circulo.vx +=
                (
                    circulo.velocidadObjetivoX -
                    circulo.vx
                ) *
                0.03;

            circulo.vy +=
                (
                    circulo.velocidadObjetivoY -
                    circulo.vy
                ) *
                0.03;

            const factorMovimiento =
                1 -
                circulo.nivelCalma;

            circulo.x +=
                circulo.vx *
                factorMovimiento;

            circulo.y +=
                circulo.vy *
                factorMovimiento;
        }

        controlarBordes(circulo);
    }
}


// ============================================================
// BORDES
// ============================================================

function controlarBordes(circulo) {

    const margen =
        circulo.radio;

    if (
        circulo.x - margen < 0
    ) {

        circulo.x =
            margen;

        circulo.vx =
            Math.abs(
                circulo.vx
            );
    }

    if (
        circulo.x + margen >
        canvas.width
    ) {

        circulo.x =
            canvas.width -
            margen;

        circulo.vx =
            -Math.abs(
                circulo.vx
            );
    }

    if (
        circulo.y - margen < 0
    ) {

        circulo.y =
            margen;

        circulo.vy =
            Math.abs(
                circulo.vy
            );
    }

    if (
        circulo.y + margen >
        canvas.height
    ) {

        circulo.y =
            canvas.height -
            margen;

        circulo.vy =
            -Math.abs(
                circulo.vy
            );
    }
}


// ============================================================
// COLISIONES
// ============================================================

function detectarColisiones() {

    for (
        let i = 0;
        i < circulos.length;
        i++
    ) {

        for (
            let j = i + 1;
            j < circulos.length;
            j++
        ) {

            const a = circulos[i];
            const b = circulos[j];

            const dx =
                b.x - a.x;

            const dy =
                b.y - a.y;

            const distancia =
                Math.hypot(
                    dx,
                    dy
                );

            const distanciaMinima =
                a.radio +
                b.radio;

            if (
                distancia > 0 &&
                distancia < distanciaMinima
            ) {

                const nx =
                    dx / distancia;

                const ny =
                    dy / distancia;

                const penetracion =
                    distanciaMinima -
                    distancia;

                const separacion =
                    penetracion *
                    0.5;

                // ------------------------------------------------
                // SEPARACIÓN
                // ------------------------------------------------

                if (
                    !a.seleccionado
                ) {

                    a.x -=
                        nx *
                        separacion;

                    a.y -=
                        ny *
                        separacion;
                }

                if (
                    !b.seleccionado
                ) {

                    b.x +=
                        nx *
                        separacion;

                    b.y +=
                        ny *
                        separacion;
                }

                // ------------------------------------------------
                // REBOTE
                // ------------------------------------------------

                const velocidadRelativaX =
                    b.vx - a.vx;

                const velocidadRelativaY =
                    b.vy - a.vy;

                const velocidadNormal =
                    velocidadRelativaX *
                    nx +
                    velocidadRelativaY *
                    ny;

                if (
                    velocidadNormal < 0
                ) {

                    const rebote =
                        0.8;

                    const impulso =
                        -(1 + rebote) *
                        velocidadNormal /
                        2;

                    if (
                        !a.seleccionado
                    ) {

                        a.vx -=
                            impulso *
                            nx;

                        a.vy -=
                            impulso *
                            ny;
                    }

                    if (
                        !b.seleccionado
                    ) {

                        b.vx +=
                            impulso *
                            nx;

                        b.vy +=
                            impulso *
                            ny;
                    }
                }
            }
        }
    }
}


// ============================================================
// GRADIENTE
// ============================================================

function obtenerGradiente(
    circulo,
    radio
) {

    const gradiente =
        ctx.createRadialGradient(

            circulo.x -
            radio * 0.35,

            circulo.y -
            radio * 0.35,

            radio * 0.1,

            circulo.x,
            circulo.y,

            radio * 1.35
        );

    if (
        circulo.color ===
        "#D9D9D9"
    ) {

        gradiente.addColorStop(
            0,
            "#FFFFFF"
        );

        gradiente.addColorStop(
            0.45,
            "#D9D9D9"
        );

        gradiente.addColorStop(
            1,
            "#AEB4BA"
        );
    }

    else if (
        circulo.color ===
        "#8BB2D3"
    ) {

        gradiente.addColorStop(
            0,
            "#DCECF9"
        );

        gradiente.addColorStop(
            0.48,
            "#8BB2D3"
        );

        gradiente.addColorStop(
            1,
            "#527A9C"
        );
    }

    else if (
        circulo.color ===
        "#202D64"
    ) {

        gradiente.addColorStop(
            0,
            "#6674A5"
        );

        gradiente.addColorStop(
            0.50,
            "#202D64"
        );

        gradiente.addColorStop(
            1,
            "#10183B"
        );
    }

    else if (
        circulo.color ===
        "#2B538E"
    ) {

        gradiente.addColorStop(
            0,
            "#7EA7D0"
        );

        gradiente.addColorStop(
            0.50,
            "#2B538E"
        );

        gradiente.addColorStop(
            1,
            "#18355F"
        );
    }

    return gradiente;
}


// ============================================================
// DIBUJAR CÍRCULO
// ============================================================

function dibujarCirculo(
    circulo,
    tiempo
) {

    // --------------------------------------------------------
    // RESPIRACIÓN
    // --------------------------------------------------------

    const factorCalma =
        circulo.calmadoPermanentemente
            ? 0.18
            : 1 -
              circulo.nivelCalma;

    const respiracion =
        Math.sin(
            tiempo *
            circulo.frecuenciaRespiracion +
            circulo.faseRespiracion
        ) *
        circulo.amplitudRespiracion *
        factorCalma;

    const radioVisual =
        circulo.radioBase +
        respiracion;

    circulo.radio =
        radioVisual;

    // --------------------------------------------------------
    // SIN SOMBRA EXTERIOR
    // --------------------------------------------------------

    ctx.shadowColor =
        "transparent";

    ctx.shadowBlur = 0;

    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // --------------------------------------------------------
    // CÍRCULO
    // --------------------------------------------------------

    ctx.beginPath();

    ctx.arc(
        circulo.x,
        circulo.y,
        radioVisual,
        0,
        Math.PI * 2
    );

    ctx.closePath();

    ctx.fillStyle =
        obtenerGradiente(
            circulo,
            radioVisual
        );

    ctx.fill();

    // --------------------------------------------------------
    // BORDE MUY SUTIL
    // --------------------------------------------------------

    ctx.strokeStyle =
        "rgba(190,205,225,0.15)";

    ctx.lineWidth =
        0.7;

    ctx.stroke();

    // --------------------------------------------------------
    // LUZ INTERNA
    // --------------------------------------------------------

    const luz =
        ctx.createRadialGradient(

            circulo.x -
            radioVisual *
            0.35,

            circulo.y -
            radioVisual *
            0.40,

            radioVisual *
            0.05,

            circulo.x,
            circulo.y,

            radioVisual
        );

    luz.addColorStop(
        0,
        "rgba(255,255,255,0.25)"
    );

    luz.addColorStop(
        0.35,
        "rgba(255,255,255,0.06)"
    );

    luz.addColorStop(
        0.70,
        "rgba(255,255,255,0)"
    );

    luz.addColorStop(
        1,
        "rgba(0,0,0,0.10)"
    );

    ctx.beginPath();

    ctx.arc(
        circulo.x,
        circulo.y,
        radioVisual,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        luz;

    ctx.fill();
}


// ============================================================
// POSICIÓN DEL PUNTERO
// ============================================================

function obtenerPosicion(e) {

    const rect =
        canvas.getBoundingClientRect();

    return {

        x:
            (
                e.clientX -
                rect.left
            ) *
            (
                canvas.width /
                rect.width
            ),

        y:
            (
                e.clientY -
                rect.top
            ) *
            (
                canvas.height /
                rect.height
            )
    };
}


// ============================================================
// POINTER DOWN
// ============================================================

canvas.addEventListener(
    "pointerdown",
    function(e) {

        e.preventDefault();

        const posicion =
            obtenerPosicion(e);

        const circulo =
            detectarCirculo(
                posicion.x,
                posicion.y
            );

        // ----------------------------------------------------
        // SI TOCA FUERA NO PASA NADA
        // ----------------------------------------------------

        if (!circulo) {
            return;
        }

        try {

            canvas.setPointerCapture(
                e.pointerId
            );

        } catch (_) {}

        // ----------------------------------------------------
        // GUARDAR PUNTERO
        // ----------------------------------------------------

        punteros.set(
            e.pointerId,
            {

                x:
                    posicion.x,

                y:
                    posicion.y,

                circulo:
                    circulo,

                offsetX:
                    circulo.x -
                    posicion.x,

                offsetY:
                    circulo.y -
                    posicion.y
            }
        );

        circulo.punterosSobre.add(
            e.pointerId
        );

        circulo.seleccionado =
            true;
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

        const puntero =
            punteros.get(
                e.pointerId
            );

        if (!puntero) {
            return;
        }

        const posicion =
            obtenerPosicion(e);

        puntero.x =
            posicion.x;

        puntero.y =
            posicion.y;

        const circulo =
            puntero.circulo;

        // ----------------------------------------------------
        // ARRASTRAR CÍRCULO
        // ----------------------------------------------------

        circulo.x =
            posicion.x +
            puntero.offsetX;

        circulo.y =
            posicion.y +
            puntero.offsetY;
    },
    {
        passive: false
    }
);


// ============================================================
// TERMINAR PUNTERO
// ============================================================

function terminarPuntero(e) {

    const puntero =
        punteros.get(
            e.pointerId
        );

    if (!puntero) {
        return;
    }

    const circulo =
        puntero.circulo;

    circulo.punterosSobre.delete(
        e.pointerId
    );

    punteros.delete(
        e.pointerId
    );

    // --------------------------------------------------------
    // DEJA DE ESTAR SELECCIONADO
    //
    // Si se calmó, queda calmado.
    // --------------------------------------------------------

    circulo.seleccionado =
        circulo.punterosSobre.size >
        0;

    try {

        canvas.releasePointerCapture(
            e.pointerId
        );

    } catch (_) {}
}


// ============================================================
// POINTER UP
// ============================================================

canvas.addEventListener(
    "pointerup",
    function(e) {

        e.preventDefault();

        terminarPuntero(e);
    },
    {
        passive: false
    }
);


// ============================================================
// POINTER CANCEL
// ============================================================

canvas.addEventListener(
    "pointercancel",
    function(e) {

        e.preventDefault();

        terminarPuntero(e);
    },
    {
        passive: false
    }
);


// ============================================================
// ANIMACIÓN
// ============================================================

function animar(tiempo) {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Actualizar calma
    actualizarCalma();

    // Movimiento
    moverCirculos();

    // Colisiones
    detectarColisiones();

    // Dibujar
    for (
        const circulo of circulos
    ) {

        dibujarCirculo(
            circulo,
            tiempo
        );
    }

    requestAnimationFrame(
        animar
    );
}


// ============================================================
// REDIMENSIONAR
// ============================================================

window.addEventListener(
    "resize",
    function() {

        ajustarCanvas();
    }
);


// ============================================================
// INICIO
// ============================================================

ajustarCanvas();

requestAnimationFrame(
    animar
);

