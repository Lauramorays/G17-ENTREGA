
// ============================================================
// EMPATÍA
// circulos2.js
// ============================================================
//
// - 4 círculos comienzan juntos en el centro.
// - Se dispersan suavemente desde el centro.
// - La alteración inicial es aleatoria.
// - Mouse y touch habilitados.
// - Un círculo seleccionado se puede arrastrar.
// - Con 1 círculo seleccionado: solo se mueve, NO se calma.
// - Con 2 o más círculos seleccionados: todos empiezan a calmarse.
// - Al soltar: los círculos calmados permanecen calmados.
// - Los círculos calmados se mueven lento y tienen respiración suave.
// - Estética basada en IDENTIDAD.
// - Sin aro fuerte alrededor de los círculos.
// ============================================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.style.touchAction = "none";

const colores = [
    "#D9D9D9",
    "#8BB2D3",
    "#202D64",
    "#2B538E"
];

const COLOR_SELECCION = "#C4CEE5";

const CANTIDAD_CIRCULOS = 4;
const RADIO_BASE = 55;

const VELOCIDAD_MAXIMA = 1.5;
const TIEMPO_TRANQUILO = 1000;

// ------------------------------------------------------------
// CÍRCULOS
// ------------------------------------------------------------

let circulos = [];
let punteros = new Map();

let tiempoInicio = performance.now();
let iniciado = false;


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

    const centroX = canvas.width / 2;
    const centroY = canvas.height / 2;

    for (let i = 0; i < CANTIDAD_CIRCULOS; i++) {

        // ----------------------------------------------------
        // Alteración aleatoria
        // ----------------------------------------------------

        const alterado = Math.random() < 0.5;

        const angulo = Math.random() * Math.PI * 2;

        const velocidadBase =
            0.45 + Math.random() * (VELOCIDAD_MAXIMA - 0.45);

        const velocidadAlterada = alterado
            ? velocidadBase
            : velocidadBase * 0.45;

        const vx = Math.cos(angulo) * velocidadAlterada;
        const vy = Math.sin(angulo) * velocidadAlterada;

        // ----------------------------------------------------
        // Todos comienzan en el centro
        // ----------------------------------------------------

        circulos.push({

            x: centroX,
            y: centroY,

            radioBase: RADIO_BASE,
            radio: RADIO_BASE,

            color: colores[i % colores.length],

            vx: 0,
            vy: 0,

            velocidadObjetivoX: vx,
            velocidadObjetivoY: vy,

            alteracion: alterado,

            // Respiración
            frecuenciaRespiracion:
                0.002 + Math.random() * 0.0035,

            amplitudRespiracion:
                alterado
                    ? 3 + Math.random() * 9
                    : 1.2 + Math.random() * 2,

            faseRespiracion:
                Math.random() * Math.PI * 2,

            // Estado de calma
            nivelCalma: 0,

            calmadoPermanentemente: !alterado,

            // Selección
            seleccionado: false,

            punterosSobre: new Set(),

            // Dispersión inicial
            anguloDispersión: angulo,

            distanciaDispersión:
                80 + Math.random() * 170,

            velocidadDispersión:
                0.008 + Math.random() * 0.006,

            progresoDispersión: 0,

            destinoX: centroX,
            destinoY: centroY
        });
    }
}


// ============================================================
// DETECTAR CÍRCULO
// ============================================================

function detectarCirculo(x, y) {

    // Buscar primero desde el último hacia el primero
    // para facilitar la selección cuando se superponen.

    for (let i = circulos.length - 1; i >= 0; i--) {

        const circulo = circulos[i];

        const distancia = Math.hypot(
            x - circulo.x,
            y - circulo.y
        );

        if (distancia <= circulo.radio + 15) {
            return circulo;
        }
    }

    return null;
}


// ============================================================
// ACTUALIZAR ESTADO DE CALMA
// ============================================================

function actualizarCalma() {

    // --------------------------------------------------------
    // Cantidad de círculos seleccionados
    // --------------------------------------------------------

    const seleccionados = circulos.filter(
        circulo => circulo.seleccionado
    );

    const cantidadSeleccionados = seleccionados.length;

    // --------------------------------------------------------
    // Si hay 2 o más seleccionados,
    // TODOS los seleccionados comienzan a calmarse.
    // --------------------------------------------------------

    if (cantidadSeleccionados >= 2) {

        for (const circulo of seleccionados) {

            if (!circulo.calmadoPermanentemente) {

                circulo.nivelCalma += 0.018;

                if (circulo.nivelCalma >= 1) {

                    circulo.nivelCalma = 1;

                    circulo.calmadoPermanentemente = true;
                    circulo.alteracion = false;
                }
            }
        }
    }

    // --------------------------------------------------------
    // Si hay menos de 2 seleccionados NO se aumenta la calma.
    //
    // IMPORTANTE:
    // Si un círculo ya se calmó, no vuelve a alterarse.
    // --------------------------------------------------------

    for (const circulo of circulos) {

        if (circulo.calmadoPermanentemente) {

            circulo.nivelCalma +=
                (1 - circulo.nivelCalma) * 0.04;

            if (circulo.nivelCalma > 0.999) {
                circulo.nivelCalma = 1;
            }
        }
    }
}


// ============================================================
// DISPERSIÓN INICIAL
// ============================================================

function actualizarDispersión() {

    const tiempo = performance.now() - tiempoInicio;

    if (tiempo < TIEMPO_TRANQUILO) {
        return;
    }

    if (!iniciado) {
        iniciado = true;
    }

    for (const circulo of circulos) {

        if (circulo.progresoDispersión >= 1) {
            continue;
        }

        // Avance lento
        circulo.progresoDispersión +=
            circulo.velocidadDispersión;

        if (circulo.progresoDispersión > 1) {
            circulo.progresoDispersión = 1;
        }

        const progreso =
            circulo.progresoDispersión;

        // Suavizado
        const suave =
            progreso * progreso * (3 - 2 * progreso);

        const centroX = canvas.width / 2;
        const centroY = canvas.height / 2;

        const objetivoX =
            centroX +
            Math.cos(circulo.anguloDispersión) *
            circulo.distanciaDispersión;

        const objetivoY =
            centroY +
            Math.sin(circulo.anguloDispersión) *
            circulo.distanciaDispersión;

        circulo.x =
            centroX +
            (objetivoX - centroX) * suave;

        circulo.y =
            centroY +
            (objetivoY - centroY) * suave;

        // Cuando termina la dispersión,
        // empieza el movimiento normal.

        if (progreso >= 1) {

            circulo.x = objetivoX;
            circulo.y = objetivoY;

            circulo.vx =
                circulo.velocidadObjetivoX;

            circulo.vy =
                circulo.velocidadObjetivoY;
        }
    }
}


// ============================================================
// MOVER CÍRCULOS
// ============================================================

function moverCirculos() {

    const tiempo =
        performance.now() - tiempoInicio;

    if (tiempo < TIEMPO_TRANQUILO) {
        return;
    }

    for (const circulo of circulos) {

        // Mientras se dispersa no usamos el movimiento normal.
        if (circulo.progresoDispersión < 1) {
            continue;
        }

        // ----------------------------------------------------
        // Si está siendo seleccionado,
        // su posición la controla el puntero.
        // ----------------------------------------------------

        if (circulo.seleccionado) {
            continue;
        }

        // ----------------------------------------------------
        // Factor de movimiento según calma
        // ----------------------------------------------------

        let factorMovimiento;

        if (circulo.calmadoPermanentemente) {

            // Movimiento muy tranquilo
            factorMovimiento = 0.28;

        } else {

            factorMovimiento =
                1 - circulo.nivelCalma;
        }

        // ----------------------------------------------------
        // Movimiento normal
        // ----------------------------------------------------

        if (!circulo.calmadoPermanentemente) {

            circulo.vx +=
                (circulo.velocidadObjetivoX - circulo.vx)
                * 0.03;

            circulo.vy +=
                (circulo.velocidadObjetivoY - circulo.vy)
                * 0.03;
        }

        else {

            // Una vez calmado, reducimos progresivamente
            // la velocidad hasta dejarla tranquila.

            circulo.vx *= 0.995;
            circulo.vy *= 0.995;

            const velocidad =
                Math.hypot(circulo.vx, circulo.vy);

            if (velocidad < 0.12) {

                circulo.vx +=
                    (circulo.velocidadObjetivoX * 0.18
                    - circulo.vx) * 0.01;

                circulo.vy +=
                    (circulo.velocidadObjetivoY * 0.18
                    - circulo.vy) * 0.01;
            }
        }

        circulo.x +=
            circulo.vx * factorMovimiento;

        circulo.y +=
            circulo.vy * factorMovimiento;

        controlarBordes(circulo);
    }
}


// ============================================================
// BORDES
// ============================================================

function controlarBordes(circulo) {

    const margen = circulo.radio;

    if (circulo.x - margen < 0) {

        circulo.x = margen;

        circulo.vx = Math.abs(circulo.vx);
    }

    if (circulo.x + margen > canvas.width) {

        circulo.x = canvas.width - margen;

        circulo.vx = -Math.abs(circulo.vx);
    }

    if (circulo.y - margen < 0) {

        circulo.y = margen;

        circulo.vy = Math.abs(circulo.vy);
    }

    if (circulo.y + margen > canvas.height) {

        circulo.y = canvas.height - margen;

        circulo.vy = -Math.abs(circulo.vy);
    }
}


// ============================================================
// COLISIONES ENTRE CÍRCULOS
// ============================================================

function detectarColisiones() {

    for (let i = 0; i < circulos.length; i++) {

        for (let j = i + 1; j < circulos.length; j++) {

            const a = circulos[i];
            const b = circulos[j];

            const dx = b.x - a.x;
            const dy = b.y - a.y;

            const distancia =
                Math.hypot(dx, dy);

            const distanciaMinima =
                a.radio + b.radio;

            if (
                distancia > 0 &&
                distancia < distanciaMinima
            ) {

                const nx = dx / distancia;
                const ny = dy / distancia;

                const penetracion =
                    distanciaMinima - distancia;

                // Separación
                const separacion =
                    penetracion * 0.5;

                if (!a.seleccionado) {

                    a.x -= nx * separacion;
                    a.y -= ny * separacion;
                }

                if (!b.seleccionado) {

                    b.x += nx * separacion;
                    b.y += ny * separacion;
                }

                // ------------------------------------------------
                // Rebote
                // ------------------------------------------------

                const velocidadRelativaX =
                    b.vx - a.vx;

                const velocidadRelativaY =
                    b.vy - a.vy;

                const velocidadNormal =
                    velocidadRelativaX * nx +
                    velocidadRelativaY * ny;

                if (velocidadNormal < 0) {

                    const rebote = 0.8;

                    const impulso =
                        -(1 + rebote) *
                        velocidadNormal /
                        2;

                    if (!a.seleccionado) {

                        a.vx -=
                            impulso * nx;

                        a.vy -=
                            impulso * ny;
                    }

                    if (!b.seleccionado) {

                        b.vx +=
                            impulso * nx;

                        b.vy +=
                            impulso * ny;
                    }
                }
            }
        }
    }
}


// ============================================================
// GRADIENTES
// ============================================================

function obtenerGradiente(circulo, radio) {

    const gradiente =
        ctx.createRadialGradient(
            circulo.x - radio * 0.35,
            circulo.y - radio * 0.35,
            radio * 0.1,

            circulo.x,
            circulo.y,
            radio * 1.35
        );

    if (circulo.color === "#D9D9D9") {

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

    else if (circulo.color === "#8BB2D3") {

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

    else if (circulo.color === "#202D64") {

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

    else if (circulo.color === "#2B538E") {

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

function dibujarCirculo(circulo, tiempo) {

    // --------------------------------------------------------
    // Respiración
    // --------------------------------------------------------

    const factorCalma =
        circulo.calmadoPermanentemente
            ? 0.18
            : 1 - circulo.nivelCalma;

    const respiracion =
        Math.sin(
            tiempo *
            circulo.frecuenciaRespiracion +
            circulo.faseRespiracion
        )
        *
        circulo.amplitudRespiracion
        *
        factorCalma;

    const radioVisual =
        circulo.radioBase +
        respiracion;

    circulo.radio = radioVisual;

    // --------------------------------------------------------
    // Sombra / brillo mínimo
    // --------------------------------------------------------

    if (circulo.seleccionado) {

        ctx.shadowColor =
            "rgba(196,206,229,0.16)";

        ctx.shadowBlur = 6;
        ctx.shadowOffsetY = 1;

    } else {

        ctx.shadowColor =
            "rgba(30,60,100,0.08)";

        ctx.shadowBlur = 3;
        ctx.shadowOffsetY = 1;
    }

    // --------------------------------------------------------
    // Forma
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
    // Borde muy sutil
    // --------------------------------------------------------

    if (circulo.seleccionado) {

        ctx.strokeStyle =
            "rgba(196,206,229,0.45)";

        ctx.lineWidth = 1.2;

    } else {

        ctx.strokeStyle =
            "rgba(190,205,225,0.15)";

        ctx.lineWidth = 0.7;
    }

    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // --------------------------------------------------------
    // Luz interna
    // --------------------------------------------------------

    const luz =
        ctx.createRadialGradient(
            circulo.x - radioVisual * 0.35,
            circulo.y - radioVisual * 0.40,
            radioVisual * 0.05,

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

    ctx.fillStyle = luz;

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
            (e.clientX - rect.left)
            * (canvas.width / rect.width),

        y:
            (e.clientY - rect.top)
            * (canvas.height / rect.height)
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

        if (!circulo) {
            return;
        }

        try {
            canvas.setPointerCapture(e.pointerId);
        } catch (_) {}

        // ----------------------------------------------------
        // Guardar puntero
        // ----------------------------------------------------

        punteros.set(
            e.pointerId,
            {
                x: posicion.x,
                y: posicion.y,
                circulo: circulo
            }
        );

        circulo.punterosSobre.add(
            e.pointerId
        );

        circulo.seleccionado = true;

        // ----------------------------------------------------
        // Guardamos la posición relativa
        // para poder arrastrar sin que el círculo salte.
        // ----------------------------------------------------

        const puntero =
            punteros.get(e.pointerId);

        puntero.offsetX =
            circulo.x - posicion.x;

        puntero.offsetY =
            circulo.y - posicion.y;
    },
    { passive: false }
);


// ============================================================
// POINTER MOVE
// ============================================================

canvas.addEventListener(
    "pointermove",
    function(e) {

        e.preventDefault();

        const puntero =
            punteros.get(e.pointerId);

        if (!puntero) {
            return;
        }

        const posicion =
            obtenerPosicion(e);

        puntero.x = posicion.x;
        puntero.y = posicion.y;

        const circulo =
            puntero.circulo;

        // ----------------------------------------------------
        // El círculo sigue al mouse / dedo
        // ----------------------------------------------------

        circulo.x =
            posicion.x +
            puntero.offsetX;

        circulo.y =
            posicion.y +
            puntero.offsetY;
    },
    { passive: false }
);


// ============================================================
// TERMINAR PUNTERO
// ============================================================

function terminarPuntero(e) {

    const puntero =
        punteros.get(e.pointerId);

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
    // El círculo deja de estar seleccionado.
    //
    // IMPORTANTE:
    // si ya se calmó, permanece calmado.
    // --------------------------------------------------------

    circulo.seleccionado =
        circulo.punterosSobre.size > 0;

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
    { passive: false }
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
    { passive: false }
);


// ============================================================
// POINTER LEAVE
// ============================================================

canvas.addEventListener(
    "pointerleave",
    function(e) {

        // No hacemos nada.
        // El círculo continúa seleccionado mientras
        // el pointer siga capturado.
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

    // --------------------------------------------------------
    // Primero dispersión
    // --------------------------------------------------------

    actualizarDispersión();

    // --------------------------------------------------------
    // Actualizar calma
    // --------------------------------------------------------

    actualizarCalma();

    // --------------------------------------------------------
    // Movimiento
    // --------------------------------------------------------

    moverCirculos();

    // --------------------------------------------------------
    // Colisiones
    // --------------------------------------------------------

    detectarColisiones();

    // --------------------------------------------------------
    // Dibujar
    // --------------------------------------------------------

    for (const circulo of circulos) {

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

