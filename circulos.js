
// ============================================================
// IDENTIDAD
// circulos.js
// ============================================================
//
// INTERACCIÓN:
// - 4 círculos se mueven solos.
// - Chocan entre sí y con los bordes.
// - Un dedo / mouse permite mover un círculo.
// - Dos dedos sobre el mismo círculo lo estiran.
// - El círculo parece intentar dividirse en dos,
//   pero NUNCA se duplica.
// - Al soltar los dedos vuelve lentamente a su forma original.
//
// ESTÉTICA:
// - Misma estética visual que MEMORIA.
// - Degradados radiales.
// - Volumen.
// - Luz interior.
// - Brillo MUY suave.
// - Sin aro luminoso fuerte.
//
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

const COLOR_SELECCION = "#C4CEE5";

// ============================================================
// CONFIGURACIÓN
// ============================================================

const TAMAÑO_INICIAL = 55;
const VELOCIDAD_MAXIMA = 0.8;
const FUERZA_COLISION = 0.7;

// Cantidad de puntos que forman orgánicamente
// el contorno del círculo.
const PUNTOS_FORMA = 44;

// ============================================================
// CÍRCULOS
// ============================================================

const circulos = [];

// ============================================================
// AJUSTAR CANVAS
// ============================================================

function ajustarCanvas() {

    const ancho =
        canvas.clientWidth ||
        canvas.parentElement?.clientWidth ||
        window.innerWidth;

    const alto =
        canvas.clientHeight ||
        canvas.parentElement?.clientHeight ||
        window.innerHeight;

    canvas.width = ancho;
    canvas.height = alto;

    if (circulos.length === 0) {
        crearCirculos();
    }
}

// ============================================================
// CREAR CÍRCULOS
// ============================================================

function crearCirculos() {

    const posiciones = [
        [0.25, 0.30],
        [0.75, 0.30],
        [0.25, 0.70],
        [0.75, 0.70]
    ];

    for (let i = 0; i < 4; i++) {

        const puntosForma = [];

        // ----------------------------------------------------
        // CREAR LOS 44 PUNTOS DEL CONTORNO
        // ----------------------------------------------------

        for (let j = 0; j < PUNTOS_FORMA; j++) {

            const angulo =
                (j / PUNTOS_FORMA) *
                Math.PI * 2;

            puntosForma.push({

                angle: angulo,

                r: TAMAÑO_INICIAL,

                vr: 0
            });
        }

        circulos.push({

            // ----------------------------
            // POSICIÓN
            // ----------------------------

            x:
                canvas.width *
                posiciones[i][0],

            y:
                canvas.height *
                posiciones[i][1],

            // ----------------------------
            // TAMAÑO
            // ----------------------------

            radio: TAMAÑO_INICIAL,

            radioOriginal:
                TAMAÑO_INICIAL,

            // ----------------------------
            // COLOR
            // ----------------------------

            color:
                colores[i],

            // ----------------------------
            // MOVIMIENTO
            // ----------------------------

            vx:
                (Math.random() - 0.5) *
                VELOCIDAD_MAXIMA,

            vy:
                (Math.random() - 0.5) *
                VELOCIDAD_MAXIMA,

            // ----------------------------
            // MOVIMIENTO ORGÁNICO
            // ----------------------------

            faseOrganica:
                Math.random() *
                Math.PI * 2,

            velocidadOrganica:
                0.008 +
                Math.random() * 0.004,

            // ----------------------------
            // RESPIRACIÓN
            // ----------------------------

            faseRespiracion:
                Math.random() *
                Math.PI * 2,

            velocidadRespiracion:
                0.012 +
                Math.random() * 0.005,

            amplitudRespiracion:
                0.045 +
                Math.random() * 0.015,

            respiracionX: 1,
            respiracionY: 1,

            // ----------------------------
            // FORMA ORGÁNICA
            // ----------------------------

            puntosForma:
                puntosForma,

            // ----------------------------
            // INTERACCIÓN
            // ----------------------------

            siendoMovido: false,

            punteroMovimiento: null,

            // ----------------------------
            // DEFORMACIÓN
            // ----------------------------

            deformando: false,

            dedosDeformacion: [],

            // Se mantienen para no romper
            // la estructura anterior.
            escalaX: 1,
            escalaY: 1,
            anguloDeformacion: 0,

            // ----------------------------
            // SELECCIÓN
            // ----------------------------

            seleccionado: false
        });
    }
}

// ============================================================
// MOVER CÍRCULOS
// ============================================================

function moverCirculos() {

    for (const circulo of circulos) {

        // Si está siendo manipulado,
        // no tiene movimiento automático.

        if (
            circulo.siendoMovido ||
            circulo.deformando
        ) {
            continue;
        }

        // ----------------------------
        // MOVIMIENTO ORGÁNICO
        // ----------------------------

        circulo.faseOrganica +=
            circulo.velocidadOrganica;

        const movimientoX =
            Math.sin(
                circulo.faseOrganica
            ) * 0.08;

        const movimientoY =
            Math.cos(
                circulo.faseOrganica * 0.8
            ) * 0.08;

        circulo.x +=
            circulo.vx +
            movimientoX;

        circulo.y +=
            circulo.vy +
            movimientoY;

        // ----------------------------
        // RESPIRACIÓN
        // ----------------------------

        circulo.faseRespiracion +=
            circulo.velocidadRespiracion;

        const respiracion =
            Math.sin(
                circulo.faseRespiracion
            ) *
            circulo.amplitudRespiracion;

        circulo.respiracionX =
            1 + respiracion;

        circulo.respiracionY =
            1 + respiracion * 0.94;

        // ----------------------------
        // BORDE IZQUIERDO
        // ----------------------------

        if (
            circulo.x -
            circulo.radio *
            circulo.respiracionX < 0
        ) {

            circulo.x =
                circulo.radio *
                circulo.respiracionX;

            circulo.vx =
                Math.abs(circulo.vx);
        }

        // ----------------------------
        // BORDE DERECHO
        // ----------------------------

        if (
            circulo.x +
            circulo.radio *
            circulo.respiracionX >
            canvas.width
        ) {

            circulo.x =
                canvas.width -
                circulo.radio *
                circulo.respiracionX;

            circulo.vx =
                -Math.abs(circulo.vx);
        }

        // ----------------------------
        // BORDE SUPERIOR
        // ----------------------------

        if (
            circulo.y -
            circulo.radio *
            circulo.respiracionY < 0
        ) {

            circulo.y =
                circulo.radio *
                circulo.respiracionY;

            circulo.vy =
                Math.abs(circulo.vy);
        }

        // ----------------------------
        // BORDE INFERIOR
        // ----------------------------

        if (
            circulo.y +
            circulo.radio *
            circulo.respiracionY >
            canvas.height
        ) {

            circulo.y =
                canvas.height -
                circulo.radio *
                circulo.respiracionY;

            circulo.vy =
                -Math.abs(circulo.vy);
        }
    }
}

// ============================================================
// COLISIONES ENTRE CÍRCULOS
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
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );

            const radioA =
                a.radio *
                Math.max(
                    a.respiracionX,
                    a.respiracionY
                );

            const radioB =
                b.radio *
                Math.max(
                    b.respiracionX,
                    b.respiracionY
                );

            const distanciaMinima =
                radioA + radioB;

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

                // ----------------------------
                // SEPARACIÓN
                // ----------------------------

                const separacion =
                    penetracion * 0.5;

                if (
                    !a.siendoMovido &&
                    !a.deformando
                ) {

                    a.x -=
                        nx *
                        separacion;

                    a.y -=
                        ny *
                        separacion;
                }

                if (
                    !b.siendoMovido &&
                    !b.deformando
                ) {

                    b.x +=
                        nx *
                        separacion;

                    b.y +=
                        ny *
                        separacion;
                }

                // ----------------------------
                // IMPULSO
                // ----------------------------

                const velocidadRelativaX =
                    b.vx - a.vx;

                const velocidadRelativaY =
                    b.vy - a.vy;

                const velocidadRelativa =
                    velocidadRelativaX * nx +
                    velocidadRelativaY * ny;

                if (
                    velocidadRelativa < 0
                ) {

                    const impulso =
                        -velocidadRelativa *
                        FUERZA_COLISION;

                    if (
                        !a.siendoMovido &&
                        !a.deformando
                    ) {

                        a.vx -=
                            nx *
                            impulso;

                        a.vy -=
                            ny *
                            impulso;
                    }

                    if (
                        !b.siendoMovido &&
                        !b.deformando
                    ) {

                        b.vx +=
                            nx *
                            impulso;

                        b.vy +=
                            ny *
                            impulso;
                    }
                }
            }
        }
    }
}

// ============================================================
// BUSCAR CÍRCULO
// ============================================================

function buscarCirculo(x, y) {

    for (
        let i = circulos.length - 1;
        i >= 0;
        i--
    ) {

        const circulo =
            circulos[i];

        const dx =
            x - circulo.x;

        const dy =
            y - circulo.y;

        const distancia =
            Math.sqrt(
                dx * dx +
                dy * dy
            );

        if (
            distancia <=
            circulo.radio * 1.25
        ) {

            return circulo;
        }
    }

    return null;
}

// ============================================================
// DEGRADADOS
// ============================================================

function obtenerGradiente(
    circulo,
    radio
) {

    const gradiente =
        ctx.createRadialGradient(
            -radio * 0.35,
            -radio * 0.30,
            radio * 0.05,
            0,
            0,
            radio * 1.2
        );

    if (
        circulo.color === "#D9D9D9"
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
        circulo.color === "#8BB2D3"
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
        circulo.color === "#202D64"
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
        circulo.color === "#2B538E"
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

function dibujarCirculo(circulo) {

    ctx.save();

    ctx.translate(
        circulo.x,
        circulo.y
    );

    // ========================================================
    // RESPIRACIÓN
    // ========================================================

    const respiracion =
        1 +
        Math.sin(
            circulo.faseRespiracion
        ) *
        circulo.amplitudRespiracion;

    // ========================================================
    // CONSTRUIR FORMA
    // ========================================================

    ctx.beginPath();

    for (
        let i = 0;
        i <= PUNTOS_FORMA;
        i++
    ) {

        const punto =
            circulo.puntosForma[
                i % PUNTOS_FORMA
            ];

        const radio =
            punto.r *
            respiracion;

        const x =
            Math.cos(punto.angle) *
            radio;

        const y =
            Math.sin(punto.angle) *
            radio;

        if (i === 0) {

            ctx.moveTo(
                x,
                y
            );

        } else {

            ctx.lineTo(
                x,
                y
            );
        }
    }

    ctx.closePath();

    // ========================================================
    // DEGRADADO
    // ========================================================

    const radioVisual =
        circulo.radio *
        Math.max(
            circulo.respiracionX,
            circulo.respiracionY
        );

    ctx.fillStyle =
        obtenerGradiente(
            circulo,
            radioVisual
        );

    // ========================================================
    // BRILLO EXTERIOR MUY SUAVE
    // ========================================================

    // Antes era mucho más fuerte.
    // Ahora queda apenas una sombra detrás.

    if (circulo.seleccionado) {

        ctx.shadowColor =
            "rgba(196, 206, 229, 0.18)";

        ctx.shadowBlur = 7;

    } else {

        ctx.shadowColor =
            "rgba(30, 60, 100, 0.10)";

        ctx.shadowBlur = 4;
    }

    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 1;

    ctx.fill();

    // ========================================================
    // QUITAR SOMBRA ANTES DEL RESTO
    // ========================================================

    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";

    // ========================================================
    // BORDE MUY DISCRETO
    // ========================================================

    ctx.strokeStyle =
        circulo.seleccionado
            ? "rgba(196,206,229,0.55)"
            : "rgba(190,205,225,0.16)";

    ctx.lineWidth =
        circulo.seleccionado
            ? 1.2
            : 0.7;

    ctx.stroke();

    // ========================================================
    // LUZ INTERIOR
    // ========================================================

    ctx.save();

    ctx.globalCompositeOperation =
        "source-atop";

    const luzInterior =
        ctx.createRadialGradient(
            -radioVisual * 0.35,
            -radioVisual * 0.35,
            0,
            0,
            0,
            radioVisual
        );

    luzInterior.addColorStop(
        0,
        "rgba(255,255,255,0.25)"
    );

    luzInterior.addColorStop(
        0.35,
        "rgba(255,255,255,0.06)"
    );

    luzInterior.addColorStop(
        0.75,
        "rgba(255,255,255,0)"
    );

    luzInterior.addColorStop(
        1,
        "rgba(0,0,0,0.10)"
    );

    ctx.beginPath();

    for (
        let i = 0;
        i <= PUNTOS_FORMA;
        i++
    ) {

        const punto =
            circulo.puntosForma[
                i % PUNTOS_FORMA
            ];

        const radio =
            punto.r *
            respiracion;

        const x =
            Math.cos(punto.angle) *
            radio;

        const y =
            Math.sin(punto.angle) *
            radio;

        if (i === 0) {

            ctx.moveTo(
                x,
                y
            );

        } else {

            ctx.lineTo(
                x,
                y
            );
        }
    }

    ctx.closePath();

    ctx.fillStyle =
        luzInterior;

    ctx.fill();

    ctx.restore();

    ctx.restore();
}

// ============================================================
// INICIAR DEFORMACIÓN
// ============================================================

function iniciarDeformacion(
    circulo
) {

    circulo.deformando = true;

    circulo.siendoMovido = false;

    circulo.vx = 0;
    circulo.vy = 0;

    circulo.seleccionado = true;
}

// ============================================================
// ACTUALIZAR DEFORMACIÓN
// ============================================================
//
// ESTA ES LA PARTE COPIADA DEL COMPORTAMIENTO
// DEL EJEMPLO DE IDENTIDAD.
//
// En lugar de escalar un círculo,
// cada punto del borde cambia su radio.
//
// Esto permite que:
//
//       (  O  )
//
// se transforme en:
//
//       (====)
//
// y luego en:
//
//       (  O  )
//
// sin crear nunca otro círculo.
// ============================================================

function actualizarDeformacion(
    circulo
) {

    if (
        circulo.dedosDeformacion.length <
        2
    ) {
        return;
    }

    const dedoA =
        circulo.dedosDeformacion[0];

    const dedoB =
        circulo.dedosDeformacion[1];

    // ========================================================
    // DISTANCIA ENTRE LOS DEDOS
    // ========================================================

    const dx =
        dedoB.x -
        dedoA.x;

    const dy =
        dedoB.y -
        dedoA.y;

    const distancia =
        Math.sqrt(
            dx * dx +
            dy * dy
        );

    // ========================================================
    // ÁNGULO DEL ESTIRAMIENTO
    // ========================================================

    const angulo =
        Math.atan2(
            dy,
            dx
        );

    circulo.anguloDeformacion =
        angulo;

    // ========================================================
    // CENTRO ENTRE LOS DOS DEDOS
    // ========================================================

    circulo.x =
        (dedoA.x + dedoB.x) / 2;

    circulo.y =
        (dedoA.y + dedoB.y) / 2;

    // ========================================================
    // ACTUALIZAR CADA PUNTO DEL CONTORNO
    // ========================================================

    for (
        const punto of
        circulo.puntosForma
    ) {

        // ----------------------------------------------------
        // Qué tanto apunta este punto hacia el eje
        // formado por los dos dedos.
        // ----------------------------------------------------

        const align =
            Math.cos(
                punto.angle -
                angulo
            );

        // ----------------------------------------------------
        // Cuánto se puede estirar.
        //
        // Este es el comportamiento del ejemplo.
        // ----------------------------------------------------

        const stretch =
            Math.min(
                circulo.radioOriginal * 1.3,
                distancia * 0.30
            );

        // ----------------------------------------------------
        // Puntos que apuntan hacia los dedos:
        // se alargan.
        //
        // Puntos laterales:
        // se comprimen suavemente.
        // ----------------------------------------------------

        const targetR =
            circulo.radioOriginal +
            (
                align *
                align *
                stretch
            ) -
            (
                1 -
                align * align
            ) *
            stretch *
            0.35;

        // ----------------------------------------------------
        // Movimiento suave del borde
        // ----------------------------------------------------

        punto.vr +=
            (
                targetR -
                punto.r
            ) *
            0.12;

        punto.vr *= 0.72;

        punto.r +=
            punto.vr;

        // ----------------------------------------------------
        // Evitar que la forma se haga demasiado pequeña.
        // ----------------------------------------------------

        punto.r =
            Math.max(
                circulo.radioOriginal * 0.55,
                punto.r
            );
    }
}

// ============================================================
// DEFORMACIÓN CON UN SOLO DEDO
// ============================================================
//
// Permite que el círculo también tenga una deformación
// orgánica cuando se lo mueve con un solo dedo.
// ============================================================

function actualizarDeformacionUnDedo(
    circulo
) {

    if (
        circulo.dedosDeformacion.length !== 1
    ) {
        return;
    }

    const dedo =
        circulo.dedosDeformacion[0];

    for (
        const punto of
        circulo.puntosForma
    ) {

        const px =
            circulo.x +
            Math.cos(punto.angle) *
            circulo.radioOriginal;

        const py =
            circulo.y +
            Math.sin(punto.angle) *
            circulo.radioOriginal;

        const dx =
            dedo.x - px;

        const dy =
            dedo.y - py;

        const distancia =
            Math.sqrt(
                dx * dx +
                dy * dy
            );

        const influencia =
            Math.max(
                0,
                1 -
                distancia /
                (
                    circulo.radioOriginal *
                    1.4
                )
            );

        const distanciaCentro =
            Math.sqrt(
                Math.pow(
                    dedo.x -
                    circulo.x,
                    2
                ) +
                Math.pow(
                    dedo.y -
                    circulo.y,
                    2
                )
            );

        const targetR =
            circulo.radioOriginal +
            influencia *
            distanciaCentro *
            0.35;

        punto.vr +=
            (
                targetR -
                punto.r
            ) *
            0.12;

        punto.vr *= 0.72;

        punto.r +=
            punto.vr;

        punto.r =
            Math.max(
                circulo.radioOriginal * 0.65,
                punto.r
            );
    }
}

// ============================================================
// RESTAURAR FORMA
// ============================================================
//
// Los puntos vuelven lentamente a formar un círculo.
// ============================================================

function restaurarForma(
    circulo
) {

    circulo.deformando = false;

    circulo.seleccionado = false;

    // No usamos setInterval.
    // La recuperación se hace dentro
    // de la animación para que sea más suave.
}

// ============================================================
// RECUPERACIÓN NATURAL DE LA FORMA
// ============================================================

function recuperarForma(
    circulo
) {

    // Si está deformándose,
    // no recuperamos todavía.

    if (
        circulo.deformando
    ) {
        return;
    }

    for (
        const punto of
        circulo.puntosForma
    ) {

        const target =
            circulo.radioOriginal;

        punto.vr +=
            (
                target -
                punto.r
            ) *
            0.10;

        punto.vr *= 0.72;

        punto.r +=
            punto.vr;

        // Evitar pequeños errores acumulados.

        if (
            Math.abs(
                punto.r -
                target
            ) < 0.01
        ) {

            punto.r =
                target;

            punto.vr = 0;
        }
    }
}

// ============================================================
// OBTENER POSICIÓN
// ============================================================

function obtenerPosicion(e) {

    const rect =
        canvas.getBoundingClientRect();

    return {

        x:
            e.clientX -
            rect.left,

        y:
            e.clientY -
            rect.top
    };
}

// ============================================================
// POINTER DOWN
// ============================================================

canvas.addEventListener(
    "pointerdown",
    (e) => {

        e.preventDefault();

        const posicion =
            obtenerPosicion(e);

        const circulo =
            buscarCirculo(
                posicion.x,
                posicion.y
            );

        if (!circulo) {
            return;
        }

        // --------------------------------
        // Capturar puntero
        // --------------------------------

        try {

            canvas.setPointerCapture(
                e.pointerId
            );

        } catch (error) {}

        // --------------------------------
        // PRIMER DEDO
        // --------------------------------

        if (
            !circulo.siendoMovido &&
            !circulo.deformando
        ) {

            circulo.siendoMovido =
                true;

            circulo.punteroMovimiento =
                e.pointerId;

            circulo.seleccionado =
                true;

            circulo.dedosDeformacion = [

                {
                    id:
                        e.pointerId,

                    x:
                        posicion.x,

                    y:
                        posicion.y,

                    tipo:
                        "movimiento"
                }
            ];

            return;
        }

        // --------------------------------
        // SEGUNDO DEDO
        // --------------------------------

        if (
            circulo.siendoMovido &&
            circulo.punteroMovimiento !==
            e.pointerId
        ) {

            const primerDedo =
                circulo.dedosDeformacion[0];

            if (primerDedo) {

                primerDedo.tipo =
                    "deformacion";
            }

            circulo.dedosDeformacion.push({

                id:
                    e.pointerId,

                x:
                    posicion.x,

                y:
                    posicion.y,

                tipo:
                    "deformacion"
            });

            iniciarDeformacion(
                circulo
            );

            actualizarDeformacion(
                circulo
            );
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
    (e) => {

        e.preventDefault();

        const posicion =
            obtenerPosicion(e);

        for (
            const circulo of
            circulos
        ) {

            // --------------------------------
            // BUSCAR PUNTERO
            // --------------------------------

            const dedo =
                circulo.dedosDeformacion.find(
                    d =>
                        d.id ===
                        e.pointerId
                );

            // --------------------------------
            // DEFORMACIÓN
            // --------------------------------

            if (
                circulo.deformando &&
                dedo
            ) {

                dedo.x =
                    posicion.x;

                dedo.y =
                    posicion.y;

                actualizarDeformacion(
                    circulo
                );

                continue;
            }

            // --------------------------------
            // MOVIMIENTO NORMAL
            // --------------------------------

            if (
                circulo.siendoMovido &&
                circulo.punteroMovimiento ===
                e.pointerId
            ) {

                circulo.x =
                    posicion.x;

                circulo.y =
                    posicion.y;

                if (
                    circulo.dedosDeformacion.length
                ) {

                    circulo.dedosDeformacion[0].x =
                        posicion.x;

                    circulo.dedosDeformacion[0].y =
                        posicion.y;

                    // Pequeña deformación orgánica
                    // con un solo dedo.

                    actualizarDeformacionUnDedo(
                        circulo
                    );
                }
            }
        }
    },
    {
        passive: false
    }
);

// ============================================================
// TERMINAR DEDO
// ============================================================

function terminarDedo(e) {

    for (
        const circulo of
        circulos
    ) {

        const indice =
            circulo.dedosDeformacion.findIndex(
                d =>
                    d.id ===
                    e.pointerId
            );

        if (
            indice === -1
        ) {
            continue;
        }

        // --------------------------------
        // Si estaba deformado
        // --------------------------------

        if (
            circulo.deformando
        ) {

            circulo.dedosDeformacion = [];

            circulo.siendoMovido =
                false;

            circulo.punteroMovimiento =
                null;

            restaurarForma(
                circulo
            );

            return;
        }

        // --------------------------------
        // Eliminar dedo
        // --------------------------------

        circulo.dedosDeformacion.splice(
            indice,
            1
        );

        // --------------------------------
        // Movimiento normal
        // --------------------------------

        circulo.siendoMovido =
            false;

        circulo.punteroMovimiento =
            null;

        circulo.seleccionado =
            false;
    }
}

// ============================================================
// POINTER UP
// ============================================================

canvas.addEventListener(
    "pointerup",
    terminarDedo,
    {
        passive: false
    }
);

// ============================================================
// POINTER CANCEL
// ============================================================

canvas.addEventListener(
    "pointercancel",
    terminarDedo,
    {
        passive: false
    }
);

// ============================================================
// POINTER LEAVE
// ============================================================

canvas.addEventListener(
    "pointerleave",
    () => {

        // No hacemos nada.
        // El puntero puede seguir capturado.
    }
);

// ============================================================
// ANIMACIÓN
// ============================================================

function animar() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // ----------------------------
    // MOVIMIENTO
    // ----------------------------

    moverCirculos();

    // ----------------------------
    // COLISIONES
    // ----------------------------

    detectarColisiones();

    // ----------------------------
    // RECUPERAR FORMAS
    // ----------------------------

    for (
        const circulo of
        circulos
    ) {

        recuperarForma(
            circulo
        );
    }

    // ----------------------------
    // DIBUJAR
    // ----------------------------

    for (
        const circulo of
        circulos
    ) {

        dibujarCirculo(
            circulo
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
    () => {

        ajustarCanvas();
    }
);

// ============================================================
// INICIO
// ============================================================

ajustarCanvas();

animar();

