// ============================================================
// EMPATÍA
// circulos2.js
// ============================================================
// 1 segundo inicial: círculos tranquilos.
// Después: cada círculo se altera con una intensidad diferente.
//
// INTERACCIÓN:
// - Mouse / 1 dedo: selecciona y congela el círculo.
// - 2 o más dedos: comienza a calmarlo.
// - Al soltar: vuelve progresivamente a alterarse.
//
// El mouse y el touch utilizan Pointer Events.
// ============================================================


// ============================================================
// CANVAS
// ============================================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


// Ajusta el tamaño real del canvas al tamaño visible.
function ajustarCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}

ajustarCanvas();


// Si cambia el tamaño de la ventana, actualizamos el canvas.
window.addEventListener("resize", ajustarCanvas);


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

// Cantidad de círculos.
const CANTIDAD_CIRCULOS = 4;

// Tamaño base.
// Similar al tamaño de los cuadrados de MEMORIA.
const RADIO_BASE = 55;

// Velocidad máxima del sistema.
// Se acerca a la velocidad utilizada en el inicio.
const VELOCIDAD_MAXIMA = 1.5;

// Durante este tiempo permanecen completamente tranquilos.
const TIEMPO_TRANQUILO = 1000;


// ============================================================
// VARIABLES
// ============================================================

let circulos = [];

// Momento en que comenzó el juego.
const inicioJuego = performance.now();

// Indica si ya comenzó la alteración.
let estadoAlterado = false;


// ============================================================
// CREAR CÍRCULOS
// ============================================================

function crearCirculos() {

    circulos = [];

    for (let i = 0; i < CANTIDAD_CIRCULOS; i++) {

        // Cada círculo recibe una intensidad diferente.
        // Esto hace que algunos se alteren mucho y otros poco.
        const alteracion = 0.45 + Math.random() * 0.55;


        // Dirección aleatoria.
        const angulo = Math.random() * Math.PI * 2;


        // Velocidad diferente para cada círculo.
        const velocidad =
            0.65 +
            Math.random() * 0.85;


        circulos.push({

            // ------------------------------------------------
            // POSICIÓN
            // ------------------------------------------------

            x:
                Math.random() *
                (canvas.width - 180) +
                90,

            y:
                Math.random() *
                (canvas.height - 180) +
                90,


            // ------------------------------------------------
            // VELOCIDAD
            // ------------------------------------------------

            // Durante el primer segundo están quietos.
            vx: 0,
            vy: 0,


            // Velocidad que alcanzarán cuando se alteren.
            velocidadObjetivoX:
                Math.cos(angulo) *
                velocidad *
                alteracion,

            velocidadObjetivoY:
                Math.sin(angulo) *
                velocidad *
                alteracion,


            // ------------------------------------------------
            // TAMAÑO
            // ------------------------------------------------

            radioBase: RADIO_BASE,
            radio: RADIO_BASE,


            // ------------------------------------------------
            // ALTERACIÓN
            // ------------------------------------------------

            // Intensidad individual.
            alteracion: alteracion,


            // ------------------------------------------------
            // RESPIRACIÓN
            // ------------------------------------------------

            // La frecuencia aumenta con la alteración.
            frecuenciaRespiracion:
                0.002 +
                Math.random() * 0.0035,

            // Amplitud diferente para cada círculo.
            amplitudRespiracion:
                3 +
                Math.random() * 9,

            // Hace que no respiren todos al mismo tiempo.
            faseRespiracion:
                Math.random() *
                Math.PI *
                2,


            // ------------------------------------------------
            // CALMA
            // ------------------------------------------------

            // 0 = completamente alterado.
            // 1 = completamente calmado.
            nivelCalma: 0,


            // ------------------------------------------------
            // PUNTEROS
            // ------------------------------------------------

            // Aquí guardamos mouse y dedos.
            dedosSobre: new Set(),


            // ------------------------------------------------
            // SELECCIÓN
            // ------------------------------------------------

            seleccionado: false,


            // ------------------------------------------------
            // COLOR
            // ------------------------------------------------

            color:
                colores[i % colores.length]
        });
    }
}

crearCirculos();


// ============================================================
// DETECTAR CÍRCULO
// ============================================================

function detectarCirculo(x, y) {

    // Buscamos primero el círculo que esté arriba.
    for (let i = circulos.length - 1; i >= 0; i--) {

        const circulo = circulos[i];

        const dx = x - circulo.x;
        const dy = y - circulo.y;

        const distancia =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        // Área de contacto ligeramente mayor.
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
// CONTROLAR BORDES
// ============================================================

function controlarBordes(circulo) {

    // Izquierda.
    if (circulo.x - circulo.radio < 0) {

        circulo.x = circulo.radio;
        circulo.vx = Math.abs(circulo.vx);
    }


    // Derecha.
    if (
        circulo.x +
        circulo.radio >
        canvas.width
    ) {

        circulo.x =
            canvas.width -
            circulo.radio;

        circulo.vx =
            -Math.abs(circulo.vx);
    }


    // Arriba.
    if (circulo.y - circulo.radio < 0) {

        circulo.y = circulo.radio;
        circulo.vy = Math.abs(circulo.vy);
    }


    // Abajo.
    if (
        circulo.y +
        circulo.radio >
        canvas.height
    ) {

        circulo.y =
            canvas.height -
            circulo.radio;

        circulo.vy =
            -Math.abs(circulo.vy);
    }
}


// ============================================================
// COLISIONES
// ============================================================

function detectarColisiones() {

    for (let i = 0; i < circulos.length; i++) {

        for (
            let j = i + 1;
            j < circulos.length;
            j++
        ) {

            const a = circulos[i];
            const b = circulos[j];

            const dx = b.x - a.x;
            const dy = b.y - a.y;

            const distancia =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );

            const distanciaMinima =
                a.radio +
                b.radio;


            // Si se están tocando.
            if (
                distancia <
                    distanciaMinima &&
                distancia > 0
            ) {

                const nx =
                    dx / distancia;

                const ny =
                    dy / distancia;

                const separacion =
                    distanciaMinima -
                    distancia;


                // Separamos físicamente los círculos.
                a.x -=
                    nx *
                    separacion *
                    0.5;

                a.y -=
                    ny *
                    separacion *
                    0.5;

                b.x +=
                    nx *
                    separacion *
                    0.5;

                b.y +=
                    ny *
                    separacion *
                    0.5;


                // Calculamos la velocidad relativa.
                const velocidadRelativa =
                    (b.vx - a.vx) * nx +
                    (b.vy - a.vy) * ny;


                // Si se acercan, rebotan.
                if (
                    velocidadRelativa < 0
                ) {

                    const rebote = 0.8;

                    const impulso =
                        -(1 + rebote) *
                        velocidadRelativa /
                        2;

                    a.vx -=
                        impulso * nx;

                    a.vy -=
                        impulso * ny;

                    b.vx +=
                        impulso * nx;

                    b.vy +=
                        impulso * ny;
                }
            }
        }
    }
}


// ============================================================
// CALMA
// ============================================================

function actualizarEstadosCalma() {

    circulos.forEach(circulo => {

        const cantidadDedos =
            circulo.dedosSobre.size;


        // ----------------------------------------------------
        // NINGÚN CONTACTO
        // ----------------------------------------------------

        if (cantidadDedos === 0) {

            circulo.seleccionado = false;

            // Si estaba calmado, vuelve lentamente
            // hacia el estado alterado.
            circulo.nivelCalma -= 0.006;

            if (
                circulo.nivelCalma < 0
            ) {
                circulo.nivelCalma = 0;
            }

            return;
        }


        // ----------------------------------------------------
        // UN CONTACTO
        // ----------------------------------------------------

        if (cantidadDedos === 1) {

            // Se muestra el contorno.
            circulo.seleccionado = true;

            // Un solo dedo NO calma.
            // El círculo queda en el estado que tenía.

            return;
        }


        // ----------------------------------------------------
        // DOS O MÁS CONTACTOS
        // ----------------------------------------------------

        if (cantidadDedos >= 2) {

            circulo.seleccionado = true;

            // La calma avanza progresivamente.
            circulo.nivelCalma += 0.018;

            if (
                circulo.nivelCalma > 1
            ) {
                circulo.nivelCalma = 1;
            }
        }
    });
}


// ============================================================
// MOVER CÍRCULOS
// ============================================================

function moverCirculos() {

    circulos.forEach(circulo => {

        const cantidadDedos =
            circulo.dedosSobre.size;


        // ----------------------------------------------------
        // FACTOR DE MOVIMIENTO
        // ----------------------------------------------------
        //
        // 0 = completamente quieto.
        // 1 = movimiento completo.
        //

        const factorMovimiento =
            1 -
            circulo.nivelCalma;


        // ----------------------------------------------------
        // SI NO ESTÁ TOCADO
        // ----------------------------------------------------

        if (
            cantidadDedos === 0 &&
            estadoAlterado
        ) {

            // Llevamos la velocidad hacia su velocidad
            // objetivo.
            circulo.vx +=
                (
                    circulo.velocidadObjetivoX -
                    circulo.vx
                ) * 0.03;

            circulo.vy +=
                (
                    circulo.velocidadObjetivoY -
                    circulo.vy
                ) * 0.03;
        }


        // ----------------------------------------------------
        // SI ESTÁ TOCADO
        // ----------------------------------------------------

        if (
            cantidadDedos >= 1
        ) {

            // Frenamos el movimiento rápidamente.
            circulo.vx *= 0.70;
            circulo.vy *= 0.70;
        }


        // ----------------------------------------------------
        // MOVIMIENTO
        // ----------------------------------------------------

        circulo.x +=
            circulo.vx *
            factorMovimiento;

        circulo.y +=
            circulo.vy *
            factorMovimiento;


        // ----------------------------------------------------
        // BORDES
        // ----------------------------------------------------

        controlarBordes(circulo);
    });
}


// ============================================================
// BORDE DE SELECCIÓN
// ============================================================
// El borde sigue exactamente la forma del círculo.
// No es una línea arriba.
// ============================================================

function dibujarBordeSeleccion(
    circulo,
    radioVisual
) {

    ctx.save();

    ctx.beginPath();


    // Contorno circular alrededor del objeto.
    ctx.arc(
        circulo.x,
        circulo.y,
        radioVisual + 7,
        0,
        Math.PI * 2
    );


    // Color del sistema utilizado para selección.
    ctx.strokeStyle = "#C4CEE5";


    // Grosor del contorno.
    ctx.lineWidth = 2;


    // Pequeño brillo para hacerlo visible.
    ctx.shadowColor = "#C4CEE5";
    ctx.shadowBlur = 10;


    ctx.stroke();

    ctx.restore();
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

    // Cuando está calmado, la respiración disminuye.
    const factorAlteracion =
        1 -
        circulo.nivelCalma;


    const respiracion =
        Math.sin(
            tiempo *
                circulo.frecuenciaRespiracion +
                circulo.faseRespiracion
        ) *
        circulo.amplitudRespiracion *
        factorAlteracion;


    // Tamaño final.
    const radioVisual =
        circulo.radioBase +
        respiracion;


    // --------------------------------------------------------
    // CÍRCULO
    // --------------------------------------------------------

    ctx.save();


    // Si está seleccionado, aumentamos el brillo.
    if (
        circulo.seleccionado
    ) {

        ctx.shadowColor =
            circulo.color;

        ctx.shadowBlur = 18;
    }


    ctx.beginPath();

    ctx.arc(
        circulo.x,
        circulo.y,
        radioVisual,
        0,
        Math.PI * 2
    );


    // Relleno.
    ctx.fillStyle =
        circulo.color;

    ctx.fill();


    // Borde propio del círculo.
    ctx.strokeStyle =
        circulo.color;

    ctx.lineWidth = 2;

    ctx.stroke();


    ctx.restore();


    // --------------------------------------------------------
    // CONTORNO DE SELECCIÓN
    // --------------------------------------------------------

    if (
        circulo.seleccionado
    ) {

        dibujarBordeSeleccion(
            circulo,
            radioVisual
        );
    }
}


// ============================================================
// COORDENADAS
// ============================================================

function obtenerCoordenadas(
    clientX,
    clientY
) {

    const rect =
        canvas.getBoundingClientRect();


    return {

        x:
            (clientX - rect.left) *
            canvas.width /
            rect.width,

        y:
            (clientY - rect.top) *
            canvas.height /
            rect.height
    };
}


// ============================================================
// POINTER DOWN
// ============================================================
// Funciona tanto con mouse como con pantalla táctil.
// ============================================================

canvas.addEventListener(
    "pointerdown",
    function(event) {

        event.preventDefault();


        const posicion =
            obtenerCoordenadas(
                event.clientX,
                event.clientY
            );


        const circulo =
            detectarCirculo(
                posicion.x,
                posicion.y
            );


        // Si el puntero comenzó sobre un círculo.
        if (circulo) {

            // Guardamos este puntero.
            circulo.dedosSobre.add(
                event.pointerId
            );


            // Activamos el contorno.
            circulo.seleccionado = true;


            // Capturamos el puntero.
            canvas.setPointerCapture(
                event.pointerId
            );
        }

    },
    { passive: false }
);


// ============================================================
// POINTER MOVE
// ============================================================

canvas.addEventListener(
    "pointermove",
    function(event) {

        event.preventDefault();

        // No movemos el círculo con el puntero.
        // El contacto sirve para interactuar con él.

    },
    { passive: false }
);


// ============================================================
// POINTER UP
// ============================================================

canvas.addEventListener(
    "pointerup",
    function(event) {

        event.preventDefault();


        // Quitamos este puntero de cualquier círculo.
        circulos.forEach(circulo => {

            circulo.dedosSobre.delete(
                event.pointerId
            );


            // Si no quedan contactos,
            // desaparece el contorno.
            if (
                circulo.dedosSobre.size === 0
            ) {

                circulo.seleccionado = false;
            }
        });


        // Liberamos el puntero capturado.
        if (
            canvas.hasPointerCapture &&
            canvas.hasPointerCapture(
                event.pointerId
            )
        ) {

            canvas.releasePointerCapture(
                event.pointerId
            );
        }

    },
    { passive: false }
);


// ============================================================
// POINTER CANCEL
// ============================================================

canvas.addEventListener(
    "pointercancel",
    function(event) {

        circulos.forEach(circulo => {

            circulo.dedosSobre.delete(
                event.pointerId
            );


            if (
                circulo.dedosSobre.size === 0
            ) {

                circulo.seleccionado = false;
            }
        });
    }
);


// ============================================================
// ANIMACIÓN
// ============================================================

function animar(tiempo) {

    // Limpiamos el canvas.
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // --------------------------------------------------------
    // ESPERA INICIAL
    // --------------------------------------------------------

    const tiempoTranscurrido =
        tiempo -
        inicioJuego;


    // Después de 1 segundo comienza la alteración.
    if (
        !estadoAlterado &&
        tiempoTranscurrido >=
            TIEMPO_TRANQUILO
    ) {

        estadoAlterado = true;
    }


    // --------------------------------------------------------
    // ACTUALIZAR
    // --------------------------------------------------------

    actualizarEstadosCalma();

    moverCirculos();

    detectarColisiones();


    // --------------------------------------------------------
    // DIBUJAR
    // --------------------------------------------------------

    circulos.forEach(circulo => {

        dibujarCirculo(
            circulo,
            tiempo
        );
    });


    // Siguiente frame.
    requestAnimationFrame(animar);
}


// ============================================================
// INICIAR
// ============================================================

requestAnimationFrame(animar);