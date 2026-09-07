
// ============================================================
// EMPATÍA
// circulos2.js
// ============================================================
//
// - 4 círculos comienzan tranquilos.
// - Esperan 1 segundo.
// - Después comienzan a alterarse progresivamente.
// - Cada círculo respira con un ritmo diferente.
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

// Tiempo inicial tranquilo
const TIEMPO_TRANQUILO = 1000;

// Tiempo que tarda en aparecer la alteración
// después del segundo inicial
const TIEMPO_TRANSICION = 1800;


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

let tiempoInicio = 0;

let transicionComenzada = false;


// ============================================================
// AJUSTAR CANVAS
// ============================================================

function ajustarCanvas() {

    const rect =
        canvas.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;

    if (circulos.length === 0) {

        crearCirculos();

        tiempoInicio =
            performance.now();
    }
}


// ============================================================
// CREAR CÍRCULOS
// ============================================================

function crearCirculos() {

    circulos = [];

    for (
        let i = 0;
        i < CANTIDAD_CIRCULOS;
        i++
    ) {

        // ----------------------------------------------------
        // DIRECCIÓN DE MOVIMIENTO
        // ----------------------------------------------------

        const angulo =
            Math.random() *
            Math.PI *
            2;


        // ----------------------------------------------------
        // VELOCIDAD
        //
        // Al principio todos se mueven muy lentamente.
        // Después aumentarán progresivamente.
        // ----------------------------------------------------

        const velocidadInicial =
            0.08 +
            Math.random() * 0.10;


        const velocidadFinal =
            0.55 +
            Math.random() *
            (VELOCIDAD_MAXIMA - 0.55);


        const velocidadObjetivoX =
            Math.cos(angulo) *
            velocidadFinal;

        const velocidadObjetivoY =
            Math.sin(angulo) *
            velocidadFinal;


        // ----------------------------------------------------
        // RESPIRACIÓN
        //
        // Cada círculo tiene un ritmo diferente.
        // ----------------------------------------------------

        const frecuenciaRespiracion =
            0.002 +
            Math.random() *
            0.0035;


        const amplitudRespiracion =
            5 +
            Math.random() *
            8;


        const faseRespiracion =
            Math.random() *
            Math.PI *
            2;


        // ----------------------------------------------------
        // CÍRCULO
        // ----------------------------------------------------

        circulos.push({

            // ------------------------------------------------
            // POSICIÓN
            // ------------------------------------------------

            x:
                canvas.width *
                posiciones[i].x,

            y:
                canvas.height *
                posiciones[i].y,


            // ------------------------------------------------
            // TAMAÑO
            // ------------------------------------------------

            radioBase:
                RADIO_BASE,

            radio:
                RADIO_BASE,


            // ------------------------------------------------
            // COLOR
            // ------------------------------------------------

            color:
                colores[
                    i %
                    colores.length
                ],


            // ------------------------------------------------
            // MOVIMIENTO
            // ------------------------------------------------

            vx:
                Math.cos(angulo) *
                velocidadInicial,

            vy:
                Math.sin(angulo) *
                velocidadInicial,


            velocidadObjetivoX:
                velocidadObjetivoX,

            velocidadObjetivoY:
                velocidadObjetivoY,


            // ------------------------------------------------
            // ALTERACIÓN
            //
            // Todos comienzan tranquilos.
            // ------------------------------------------------

            alteracion:
                false,


            // ------------------------------------------------
            // RESPIRACIÓN
            // ------------------------------------------------

            frecuenciaRespiracion:
                frecuenciaRespiracion,

            amplitudRespiracion:
                amplitudRespiracion,

            faseRespiracion:
                faseRespiracion,


            // ------------------------------------------------
            // CALMA
            // ------------------------------------------------

            nivelCalma:
                1,

            calmadoPermanentemente:
                false,


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

function detectarCirculo(
    x,
    y
) {

    for (
        let i = circulos.length - 1;
        i >= 0;
        i--
    ) {

        const circulo =
            circulos[i];

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
// INICIAR ALTERACIÓN
// ============================================================
//
// Después de 1 segundo comienza una transición.
// Cada círculo aumenta su alteración de manera progresiva.
//
// ============================================================

function actualizarAlteracion(
    tiempo
) {

    if (
        tiempoInicio === 0
    ) {
        return;
    }


    const tiempoTranscurrido =
        tiempo -
        tiempoInicio;


    // --------------------------------------------------------
    // PRIMER SEGUNDO
    // TODOS TRANQUILOS
    // --------------------------------------------------------

    if (
        tiempoTranscurrido <
        TIEMPO_TRANQUILO
    ) {

        return;
    }


    // --------------------------------------------------------
    // TRANSICIÓN
    // --------------------------------------------------------

    const tiempoDesdeAlteracion =
        tiempoTranscurrido -
        TIEMPO_TRANQUILO;


    let progreso =
        tiempoDesdeAlteracion /
        TIEMPO_TRANSICION;


    progreso =
        Math.max(
            0,
            Math.min(
                1,
                progreso
            )
        );


    // Suavizar transición

    const suavizado =
        progreso *
        progreso *
        (
            3 -
            2 *
            progreso
        );


    transicionComenzada =
        true;


    for (
        const circulo
        of circulos
    ) {

        if (
            circulo.calmadoPermanentemente
        ) {
            continue;
        }


        // ----------------------------------------------------
        // ALTERACIÓN PROGRESIVA
        // ----------------------------------------------------

        circulo.nivelCalma =
            1 -
            suavizado;

        circulo.alteracion =
            suavizado > 0.05;


        // Cuando termina la transición,
        // queda completamente alterado.

        if (
            suavizado >= 0.999
        ) {

            circulo.nivelCalma = 0;

            circulo.alteracion =
                true;
        }
    }
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
            const circulo
            of seleccionados
        ) {

            if (
                !circulo.calmadoPermanentemente
            ) {

                circulo.nivelCalma +=
                    0.018;


                if (
                    circulo.nivelCalma >= 1
                ) {

                    circulo.nivelCalma =
                        1;

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
        const circulo
        of circulos
    ) {

        if (
            circulo.calmadoPermanentemente
        ) {

            circulo.nivelCalma +=
                (
                    1 -
                    circulo.nivelCalma
                ) *
                0.04;


            if (
                circulo.nivelCalma >
                0.999
            ) {

                circulo.nivelCalma =
                    1;
            }
        }
    }
}


// ============================================================
// MOVER CÍRCULOS
// ============================================================

function moverCirculos() {

    for (
        const circulo
        of circulos
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


        controlarBordes(
            circulo
        );
    }
}


// ============================================================
// BORDES
// ============================================================

function controlarBordes(
    circulo
) {

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

            const a =
                circulos[i];

            const b =
                circulos[j];


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
                distancia <
                distanciaMinima
            ) {

                const nx =
                    dx /
                    distancia;

                const ny =
                    dy /
                    distancia;


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
                    b.vx -
                    a.vx;


                const velocidadRelativaY =
                    b.vy -
                    a.vy;


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

    let factorRespiracion;


    if (
        circulo.calmadoPermanentemente
    ) {

        // Respiración muy tranquila

        factorRespiracion =
            0.18;

    }

    else {

        // Alteración:
        // cuanto menor es la calma,
        // más fuerte respira.

        factorRespiracion =
            1 -
            circulo.nivelCalma;
    }


    const respiracion =
        Math.sin(

            tiempo *
            circulo.frecuenciaRespiracion +

            circulo.faseRespiracion

        ) *

        circulo.amplitudRespiracion *

        factorRespiracion;


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

    ctx.shadowBlur =
        0;

    ctx.shadowOffsetX =
        0;

    ctx.shadowOffsetY =
        0;


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
        circulo.seleccionado
            ? "rgba(196,206,229,0.40)"
            : "rgba(190,205,225,0.15)";


    ctx.lineWidth =
        circulo.seleccionado
            ? 1.1
            : 0.7;


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
        // TOCAR FUERA
        // NO HACE NADA
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
        // ARRASTRAR
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


    // Primero:
    // tranquilo → alterado

    actualizarAlteracion(
        tiempo
    );


    // Después:
    // interacción de empatía

    actualizarCalma();


    // Movimiento

    moverCirculos();


    // Colisiones

    detectarColisiones();


    // Dibujar

    for (
        const circulo
        of circulos
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

