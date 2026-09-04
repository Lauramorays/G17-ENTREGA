const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


// =====================================================
// COLORES
// =====================================================

const colores = [
    "#D9D9D9",
    "#8BB2D3",
    "#202D64",
    "#2B538E"
];


// =====================================================
// CONFIGURACIÓN
// =====================================================

const TAMAÑO_INICIAL = 105;
const TAMAÑO_MINIMO = 12;

const PERDIDA_TAMAÑO = 0.045;
const PERDIDA_OPACIDAD = 0.00045;
const PERDIDA_LINEA = 0.0008;

const VELOCIDAD_MAXIMA = 0.45;


// =====================================================
// VARIABLES
// =====================================================

let cuadrados = [];

let cuadradoSeleccionado = null;
let punteroActivo = null;


// =====================================================
// AJUSTAR CANVAS
// =====================================================

function ajustarCanvas() {

    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;
}


// =====================================================
// CREAR CUADRADOS
// =====================================================

function crearCuadrados() {

    cuadrados = [];

    const posiciones = [
        { x: 0.27, y: 0.30 },
        { x: 0.73, y: 0.30 },
        { x: 0.27, y: 0.68 },
        { x: 0.73, y: 0.68 }
    ];

    for (let i = 0; i < 4; i++) {

        cuadrados.push({

            x: canvas.width * posiciones[i].x,
            y: canvas.height * posiciones[i].y,

            ultimoX: canvas.width * posiciones[i].x,
            ultimoY: canvas.height * posiciones[i].y,

            tamaño: TAMAÑO_INICIAL,

            color: colores[i],

            opacidad: 1,

            linea: 3,

            vx: (Math.random() - 0.5) * VELOCIDAD_MAXIMA,
            vy: (Math.random() - 0.5) * VELOCIDAD_MAXIMA,

            fase: Math.random() * Math.PI * 2,

            velocidadRespiracion:
                0.015 + Math.random() * 0.01,

            seleccionado: false,

            puntero: null,

            chocando: false,

            caducando: false,

            agotado: false,

            desapareciendo: false

        });
    }
}


// =====================================================
// DISTANCIA ENTRE DOS CUADRADOS
// =====================================================

function distancia(a, b) {

    const dx = a.x - b.x;
    const dy = a.y - b.y;

    return Math.sqrt(dx * dx + dy * dy);
}


// =====================================================
// MOVIMIENTO NATURAL
// =====================================================

function moverCuadrados() {

    for (const cuadrado of cuadrados) {

        if (
            cuadrado.seleccionado ||
            cuadrado.desapareciendo
        ) {
            continue;
        }


        // Movimiento suave y orgánico

        cuadrado.fase += cuadrado.velocidadRespiracion;


        cuadrado.vx +=
            Math.sin(cuadrado.fase) * 0.002;

        cuadrado.vy +=
            Math.cos(cuadrado.fase * 0.8) * 0.002;


        // Limitar velocidad

        cuadrado.vx = Math.max(
            -VELOCIDAD_MAXIMA,
            Math.min(
                VELOCIDAD_MAXIMA,
                cuadrado.vx
            )
        );

        cuadrado.vy = Math.max(
            -VELOCIDAD_MAXIMA,
            Math.min(
                VELOCIDAD_MAXIMA,
                cuadrado.vy
            )
        );


        cuadrado.x += cuadrado.vx;
        cuadrado.y += cuadrado.vy;


        // Mantener dentro de la pantalla

        const mitad = cuadrado.tamaño / 2;


        if (cuadrado.x - mitad < 0) {

            cuadrado.x = mitad;
            cuadrado.vx *= -1;
        }


        if (cuadrado.x + mitad > canvas.width) {

            cuadrado.x = canvas.width - mitad;
            cuadrado.vx *= -1;
        }


        if (cuadrado.y - mitad < 0) {

            cuadrado.y = mitad;
            cuadrado.vy *= -1;
        }


        if (cuadrado.y + mitad > canvas.height) {

            cuadrado.y = canvas.height - mitad;
            cuadrado.vy *= -1;
        }
    }
}


// =====================================================
// COLISIONES
// =====================================================

function detectarColisiones() {

    // Primero limpiamos estados

    for (const cuadrado of cuadrados) {

        cuadrado.chocando = false;
        cuadrado.caducando = false;
    }


    // Revisamos todos los pares

    for (let i = 0; i < cuadrados.length; i++) {

        for (let j = i + 1; j < cuadrados.length; j++) {

            const a = cuadrados[i];
            const b = cuadrados[j];


            if (
                a.desapareciendo ||
                b.desapareciendo
            ) {
                continue;
            }


            const d = distancia(a, b);

            const radioA = a.tamaño / 2;
            const radioB = b.tamaño / 2;

            const distanciaChoque =
                radioA + radioB;


            // ¿Están tocándose?

            if (d < distanciaChoque) {

                a.chocando = true;
                b.chocando = true;


                // =================================================
                // IMPORTANTE:
                // SOLO CADUCAN SI EL USUARIO ESTÁ MANIPULANDO
                // ALGUNO DE LOS CUADRADOS
                // =================================================

                if (
                    a.seleccionado ||
                    b.seleccionado
                ) {

                    a.caducando = true;
                    b.caducando = true;

                    aplicarCaducidad(a);
                    aplicarCaducidad(b);
                }


                // =================================================
                // SEPARAR LOS CUADRADOS
                // =================================================

                if (d === 0) {

                    b.x += 1;

                } else {

                    const diferencia =
                        distanciaChoque - d;

                    const nx =
                        (b.x - a.x) / d;

                    const ny =
                        (b.y - a.y) / d;


                    if (!a.seleccionado) {

                        a.x -= nx * diferencia * 0.5;
                        a.y -= ny * diferencia * 0.5;
                    }


                    if (!b.seleccionado) {

                        b.x += nx * diferencia * 0.5;
                        b.y += ny * diferencia * 0.5;
                    }
                }


                // Rebote natural

                if (!a.seleccionado) {

                    a.vx *= -1;
                    a.vy *= -1;
                }


                if (!b.seleccionado) {

                    b.vx *= -1;
                    b.vy *= -1;
                }
            }
        }
    }
}


// =====================================================
// CADUCIDAD
// =====================================================

function aplicarCaducidad(cuadrado) {

    if (cuadrado.agotado) {
        return;
    }


    // Reducir tamaño

    cuadrado.tamaño -= PERDIDA_TAMAÑO;


    // Reducir opacidad

    cuadrado.opacidad -= PERDIDA_OPACIDAD;


    // Reducir grosor

    cuadrado.linea -= PERDIDA_LINEA;


    // Límites

    if (cuadrado.tamaño < TAMAÑO_MINIMO) {

        cuadrado.tamaño = TAMAÑO_MINIMO;
    }


    if (cuadrado.opacidad < 0.08) {

        cuadrado.opacidad = 0.08;
    }


    if (cuadrado.linea < 1) {

        cuadrado.linea = 1;
    }


    // Se agotó

    if (
        cuadrado.tamaño <= TAMAÑO_MINIMO &&
        cuadrado.opacidad <= 0.08
    ) {

        cuadrado.agotado = true;
    }


    const mensaje =
        document.getElementById("mensaje");


    if (mensaje) {

        mensaje.textContent =
            "PERDIENDO PROPIEDADES...";

        mensaje.style.opacity = "0.7";
    }
}


// =====================================================
// DESAPARICIÓN
// =====================================================

function actualizarDesaparicion() {

    for (const cuadrado of cuadrados) {

        if (!cuadrado.desapareciendo) {
            continue;
        }


        cuadrado.opacidad -= 0.025;

        cuadrado.tamaño -= 0.5;


        if (cuadrado.opacidad <= 0) {

            cuadrado.opacidad = 0;
            cuadrado.tamaño = 0;
        }
    }


    // Eliminar cuadrados completamente desaparecidos

    cuadrados =
        cuadrados.filter(
            cuadrado =>
                cuadrado.opacidad > 0
        );
}


// =====================================================
// DIBUJAR CUADRADO
// =====================================================

function dibujarCuadrado(cuadrado) {

    if (
        cuadrado.opacidad <= 0 ||
        cuadrado.tamaño <= 0
    ) {
        return;
    }


    ctx.save();


    ctx.translate(
        cuadrado.x,
        cuadrado.y
    );


    // =================================================
    // EFECTO DE RESPIRACIÓN
    // =================================================

    let respiracion =
        1 +
        Math.sin(cuadrado.fase) * 0.035;


    if (cuadrado.caducando) {

        respiracion =
            1 +
            Math.sin(cuadrado.fase) * 0.015;
    }


    const tamaño =
        cuadrado.tamaño * respiracion;


    // =================================================
    // CUADRADO RELLENO
    // =================================================

    ctx.globalAlpha =
        cuadrado.opacidad;


    ctx.fillStyle =
        cuadrado.color;


    ctx.fillRect(

        -tamaño / 2,

        -tamaño / 2,

        tamaño,

        tamaño
    );


    // =================================================
    // BORDE
    // =================================================

    ctx.strokeStyle =
        cuadrado.color;


    ctx.lineWidth =
        cuadrado.linea;


    ctx.globalAlpha =
        cuadrado.opacidad * 0.9;


    ctx.strokeRect(

        -tamaño / 2,

        -tamaño / 2,

        tamaño,

        tamaño
    );


    // =================================================
    // INDICADOR DE SELECCIÓN
    // =================================================

    if (cuadrado.seleccionado) {

        ctx.globalAlpha =
            0.35;


        ctx.lineWidth = 2;


        ctx.strokeStyle =
            "#FFFFFF";


        ctx.strokeRect(

            -tamaño / 2 - 8,

            -tamaño / 2 - 8,

            tamaño + 16,

            tamaño + 16
        );
    }


    // =================================================
    // INDICADOR DE CHOQUE
    // =================================================

    if (cuadrado.chocando) {

        ctx.globalAlpha =
            0.15;


        ctx.strokeStyle =
            "#FFFFFF";


        ctx.lineWidth = 3;


        ctx.strokeRect(

            -tamaño / 2 - 4,

            -tamaño / 2 - 4,

            tamaño + 8,

            tamaño + 8
        );
    }


    ctx.restore();


    ctx.globalAlpha = 1;
}


// =====================================================
// DIBUJAR TODO
// =====================================================

function dibujar() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    for (const cuadrado of cuadrados) {

        dibujarCuadrado(cuadrado);
    }
}


// =====================================================
// BUSCAR CUADRADO TOCADO
// =====================================================

function obtenerCuadradoEnPosicion(x, y) {

    for (
        let i = cuadrados.length - 1;
        i >= 0;
        i--
    ) {

        const cuadrado =
            cuadrados[i];


        if (cuadrado.desapareciendo) {
            continue;
        }


        const mitad =
            cuadrado.tamaño / 2;


        if (
            x >= cuadrado.x - mitad &&
            x <= cuadrado.x + mitad &&
            y >= cuadrado.y - mitad &&
            y <= cuadrado.y + mitad
        ) {

            return cuadrado;
        }
    }


    return null;
}


// =====================================================
// POINTER DOWN
// =====================================================

canvas.addEventListener(
    "pointerdown",
    function (evento) {

        const rect =
            canvas.getBoundingClientRect();


        const x =
            evento.clientX - rect.left;


        const y =
            evento.clientY - rect.top;


        const cuadrado =
            obtenerCuadradoEnPosicion(x, y);


        if (!cuadrado) {
            return;
        }


        // Capturar el puntero

        canvas.setPointerCapture(
            evento.pointerId
        );


        cuadradoSeleccionado =
            cuadrado;


        punteroActivo =
            evento.pointerId;


        cuadrado.seleccionado =
            true;


        cuadrado.puntero =
            evento.pointerId;


        // Detener movimiento automático

        cuadrado.vx = 0;
        cuadrado.vy = 0;


        const mensaje =
            document.getElementById("mensaje");


        if (mensaje) {

            mensaje.textContent =
                "HACÉ QUE SE TOQUEN";

            mensaje.style.opacity =
                "0.7";
        }
    }
);


// =====================================================
// POINTER MOVE
// =====================================================

canvas.addEventListener(
    "pointermove",
    function (evento) {

        if (
            cuadradoSeleccionado === null ||
            punteroActivo !== evento.pointerId
        ) {
            return;
        }


        const rect =
            canvas.getBoundingClientRect();


        const x =
            evento.clientX - rect.left;


        const y =
            evento.clientY - rect.top;


        const cuadrado =
            cuadradoSeleccionado;


        const mitad =
            cuadrado.tamaño / 2;


        // Mantenerlo dentro de la pantalla

        cuadrado.x =
            Math.max(
                mitad,
                Math.min(
                    canvas.width - mitad,
                    x
                )
            );


        cuadrado.y =
            Math.max(
                mitad,
                Math.min(
                    canvas.height - mitad,
                    y
                )
            );
    }
);


// =====================================================
// POINTER UP
// =====================================================

canvas.addEventListener(
    "pointerup",
    function (evento) {

        if (
            cuadradoSeleccionado === null ||
            punteroActivo !== evento.pointerId
        ) {
            return;
        }


        const cuadrado =
            cuadradoSeleccionado;


        cuadrado.seleccionado =
            false;


        cuadrado.puntero =
            null;


        // =================================================
        // SI ESTÁ AGOTADO, DESAPARECE
        // =================================================

        if (cuadrado.agotado) {

            cuadrado.desapareciendo =
                true;


            const mensaje =
                document.getElementById("mensaje");


            if (mensaje) {

                mensaje.textContent =
                    "CADUCÓ";
            }

        } else {

            // Volver a moverse

            cuadrado.vx =
                (Math.random() - 0.5)
                * VELOCIDAD_MAXIMA;


            cuadrado.vy =
                (Math.random() - 0.5)
                * VELOCIDAD_MAXIMA;


            const mensaje =
                document.getElementById("mensaje");


            if (mensaje) {

                mensaje.textContent =
                    "TOCÁ Y HACÉ CHOCAR";
            }
        }


        cuadradoSeleccionado =
            null;


        punteroActivo =
            null;
    }
);


// =====================================================
// CANCELAR POINTER
// =====================================================

canvas.addEventListener(
    "pointercancel",
    function (evento) {

        if (
            cuadradoSeleccionado === null ||
            punteroActivo !== evento.pointerId
        ) {
            return;
        }


        cuadradoSeleccionado.seleccionado =
            false;


        cuadradoSeleccionado.puntero =
            null;


        cuadradoSeleccionado =
            null;


        punteroActivo =
            null;
    }
);


// =====================================================
// ANIMACIÓN
// =====================================================

function animar() {

    moverCuadrados();

    detectarColisiones();

    actualizarDesaparicion();

    dibujar();

    requestAnimationFrame(animar);
}


// =====================================================
// INICIAR
// =====================================================

ajustarCanvas();

crearCuadrados();

animar();


// =====================================================
// REDIMENSIONAR VENTANA
// =====================================================

window.addEventListener(
    "resize",
    function () {

        ajustarCanvas();
    }
);