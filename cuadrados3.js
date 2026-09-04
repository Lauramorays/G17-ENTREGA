
// ============================================================
// CADUCIDAD
// ============================================================
// Este juego pertenece al mismo sistema que MEMORIA y HERENCIA.
//
// SISTEMA:
// - Comienza con 4 cuadrados.
// - Los cuadrados se mueven solos.
// - Tienen cuerpo físico.
// - Chocan entre sí.
// - Mantienen movimiento orgánico y respiración.
// - La interacción es exclusivamente táctil.
//
// INTERACCIÓN:
// - Se toca y arrastra un cuadrado.
// - Al hacerlo chocar contra otro cuadrado,
//   ambos comienzan a perder propiedades.
// - La pérdida es mucho más visible que en la versión anterior.
// - Pierden:
//      • tamaño
//      • opacidad
//      • grosor del borde
// - Si continúan chocando, se degradan.
// - Cuando un cuadrado queda completamente agotado,
//   desaparece.
//
// No hay mouse.
// No hay texto necesario para comprender la interacción.
// ============================================================


// ============================================================
// CANVAS
// ============================================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


// ============================================================
// COLORES DEL SISTEMA
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

// Tamaño inicial de los cuadrados.
const TAMAÑO_INICIAL = 110;

// Tamaño mínimo antes de desaparecer.
const TAMAÑO_MINIMO = 10;


// ------------------------------------------------------------
// PÉRDIDA DE PROPIEDADES
// ------------------------------------------------------------
// Estos valores son deliberadamente mayores que los anteriores.
// La intención es que el usuario pueda VER claramente
// que el objeto está perdiendo su estado.
//
// La pérdida ocurre por cada cuadro de animación mientras
// existe contacto entre dos cuadrados y uno está siendo tocado.

const PERDIDA_TAMAÑO = 0.22;

const PERDIDA_OPACIDAD = 0.0035;

const PERDIDA_LINEA = 0.018;


// ------------------------------------------------------------
// VELOCIDAD
// ------------------------------------------------------------
// Mismo criterio que el inicio:
// velocidad aleatoria basada en 1.5.

const VELOCIDAD_BASE = 1.5;


// ------------------------------------------------------------
// FÍSICA
// ------------------------------------------------------------

// Rebote utilizado cuando los cuerpos chocan.
const REBOTE = 0.8;


// ------------------------------------------------------------
// CONTACTO
// ------------------------------------------------------------
// Tiempo que debe mantenerse un contacto para que
// la pérdida se intensifique.

const CONTACTO_INTENSO = 12;


// ============================================================
// VARIABLES
// ============================================================

let cuadrados = [];


// Cuadrado que está siendo manipulado.
let cuadradoSeleccionado = null;


// Identificador del dedo que lo está manipulando.
let dedoActivo = null;


// ============================================================
// AJUSTAR CANVAS
// ============================================================
// El tamaño interno del canvas coincide con el tamaño visible.

function ajustarCanvas() {

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

}


// ============================================================
// CREAR CUADRADOS
// ============================================================

function crearCuadrados() {

    cuadrados = [];


    // Las cuatro posiciones iniciales.
    //
    // Se distribuyen en cuatro zonas del espacio,
    // dejando el centro libre para que puedan encontrarse.

    const posiciones = [

        {
            x: 0.27,
            y: 0.30
        },

        {
            x: 0.73,
            y: 0.30
        },

        {
            x: 0.27,
            y: 0.68
        },

        {
            x: 0.73,
            y: 0.68
        }

    ];


    for (let i = 0; i < 4; i++) {

        cuadrados.push({

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

            tamaño:
                TAMAÑO_INICIAL,


            // ------------------------------------------------
            // COLOR
            // ------------------------------------------------

            color:
                colores[i],


            // ------------------------------------------------
            // PROPIEDADES
            // ------------------------------------------------

            opacidad: 1,

            linea: 3,


            // ------------------------------------------------
            // MOVIMIENTO
            // ------------------------------------------------
            // Igual que el sistema del inicio.

            vx:
                (Math.random() - 0.5) *
                VELOCIDAD_BASE,

            vy:
                (Math.random() - 0.5) *
                VELOCIDAD_BASE,


            // ------------------------------------------------
            // RESPIRACIÓN
            // ------------------------------------------------

            fase:
                Math.random() *
                Math.PI *
                2,

            velocidadRespiracion:
                0.0015 +
                Math.random() *
                0.001,


            // ------------------------------------------------
            // ESTADOS
            // ------------------------------------------------

            seleccionado: false,

            agotado: false,

            desapareciendo: false,


            // Indica si actualmente está tocando
            // a otro cuadrado.

            chocando: false,


            // Acumulador de tiempo de contacto.

            tiempoContacto: 0

        });

    }

}


// ============================================================
// CONTROLAR BORDES
// ============================================================
// El cuerpo del cuadrado no puede atravesar el borde.

function controlarBordes(cuadrado) {

    const radio =
        cuadrado.tamaño / 2;


    if (cuadrado.x - radio < 0) {

        cuadrado.x = radio;

        cuadrado.vx =
            Math.abs(cuadrado.vx);

    }


    if (
        cuadrado.x + radio >
        canvas.width
    ) {

        cuadrado.x =
            canvas.width - radio;

        cuadrado.vx =
            -Math.abs(cuadrado.vx);

    }


    if (cuadrado.y - radio < 0) {

        cuadrado.y = radio;

        cuadrado.vy =
            Math.abs(cuadrado.vy);

    }


    if (
        cuadrado.y + radio >
        canvas.height
    ) {

        cuadrado.y =
            canvas.height - radio;

        cuadrado.vy =
            -Math.abs(cuadrado.vy);

    }

}


// ============================================================
// MOVIMIENTO
// ============================================================

function moverCuadrados() {

    for (const cuadrado of cuadrados) {

        // Un cuadrado manipulado por el dedo
        // no se mueve automáticamente.

        if (
            cuadrado.seleccionado ||
            cuadrado.desapareciendo
        ) {

            continue;

        }


        // ----------------------------------------------------
        // RESPIRACIÓN / MOVIMIENTO ORGÁNICO
        // ----------------------------------------------------

        cuadrado.fase +=
            cuadrado.velocidadRespiracion;


        // Pequeñas variaciones de dirección.
        // Esto evita un movimiento completamente mecánico.

        cuadrado.vx +=
            Math.sin(
                cuadrado.fase
            ) * 0.001;


        cuadrado.vy +=
            Math.cos(
                cuadrado.fase * 0.8
            ) * 0.001;


        // ----------------------------------------------------
        // LIMITAR VELOCIDAD
        // ----------------------------------------------------

        const velocidad =
            Math.sqrt(
                cuadrado.vx *
                cuadrado.vx +

                cuadrado.vy *
                cuadrado.vy
            );


        if (
            velocidad >
            VELOCIDAD_BASE
        ) {

            cuadrado.vx =
                (cuadrado.vx / velocidad) *
                VELOCIDAD_BASE;

            cuadrado.vy =
                (cuadrado.vy / velocidad) *
                VELOCIDAD_BASE;

        }


        // ----------------------------------------------------
        // MOVER
        // ----------------------------------------------------

        cuadrado.x +=
            cuadrado.vx;

        cuadrado.y +=
            cuadrado.vy;


        // ----------------------------------------------------
        // BORDES
        // ----------------------------------------------------

        controlarBordes(cuadrado);

    }

}


// ============================================================
// DISTANCIA ENTRE CUADRADOS
// ============================================================

function distancia(a, b) {

    const dx =
        b.x - a.x;

    const dy =
        b.y - a.y;


    return Math.sqrt(
        dx * dx +
        dy * dy
    );

}


// ============================================================
// APLICAR CADUCIDAD
// ============================================================
// Esta es la parte central de la experiencia.
//
// Cuanto más tiempo permanecen chocando mientras
// el usuario manipula un cuadrado, más propiedades pierden.
//
// La pérdida es ahora bastante más rápida para que
// el fenómeno sea perceptible visualmente.

function aplicarCaducidad(cuadrado, intensidad = 1) {

    if (
        cuadrado.agotado ||
        cuadrado.desapareciendo
    ) {

        return;

    }


    // --------------------------------------------------------
    // PERDER TAMAÑO
    // --------------------------------------------------------

    cuadrado.tamaño -=
        PERDIDA_TAMAÑO *
        intensidad;


    // --------------------------------------------------------
    // PERDER OPACIDAD
    // --------------------------------------------------------

    cuadrado.opacidad -=
        PERDIDA_OPACIDAD *
        intensidad;


    // --------------------------------------------------------
    // PERDER GROSOR
    // --------------------------------------------------------

    cuadrado.linea -=
        PERDIDA_LINEA *
        intensidad;


    // --------------------------------------------------------
    // LÍMITES
    // --------------------------------------------------------

    if (
        cuadrado.tamaño <
        TAMAÑO_MINIMO
    ) {

        cuadrado.tamaño =
            TAMAÑO_MINIMO;

    }


    if (
        cuadrado.opacidad <
        0.03
    ) {

        cuadrado.opacidad =
            0.03;

    }


    if (
        cuadrado.linea <
        0.4
    ) {

        cuadrado.linea =
            0.4;

    }


    // --------------------------------------------------------
    // AGOTAMIENTO
    // --------------------------------------------------------
    // Cuando prácticamente perdió todas sus propiedades,
    // comienza la desaparición.

    if (
        cuadrado.tamaño <=
            TAMAÑO_MINIMO &&
        cuadrado.opacidad <=
            0.03
    ) {

        cuadrado.agotado = true;

    }

}


// ============================================================
// COLISIONES
// ============================================================
// Se utiliza un cuerpo físico circular para cada cuadrado.
//
// Esto evita que los cuadrados simplemente se atraviesen.
//
// IMPORTANTE:
// La caducidad solamente ocurre cuando el usuario
// está manipulando al menos uno de los cuadrados.

function detectarColisiones() {

    // --------------------------------------------------------
    // REINICIAR ESTADOS
    // --------------------------------------------------------

    for (const cuadrado of cuadrados) {

        cuadrado.chocando = false;

    }


    // --------------------------------------------------------
    // REVISAR PARES
    // --------------------------------------------------------

    for (
        let i = 0;
        i < cuadrados.length;
        i++
    ) {

        for (
            let j = i + 1;
            j < cuadrados.length;
            j++
        ) {

            const a =
                cuadrados[i];

            const b =
                cuadrados[j];


            if (
                a.desapareciendo ||
                b.desapareciendo
            ) {

                continue;

            }


            // ------------------------------------------------
            // DISTANCIA
            // ------------------------------------------------

            const d =
                distancia(a, b);


            // ------------------------------------------------
            // CUERPOS
            // ------------------------------------------------
            // El tamaño visual determina el cuerpo físico.

            const radioA =
                a.tamaño / 2;

            const radioB =
                b.tamaño / 2;


            const distanciaMinima =
                radioA + radioB;


            // ------------------------------------------------
            // ¿HAY CONTACTO?
            // ------------------------------------------------

            if (
                d <
                distanciaMinima
            ) {

                a.chocando = true;
                b.chocando = true;


                // ------------------------------------------------
                // SEPARAR LOS CUERPOS
                // ------------------------------------------------

                if (d === 0) {

                    b.x += 1;

                } else {

                    const diferencia =
                        distanciaMinima - d;


                    const nx =
                        (b.x - a.x) /
                        d;


                    const ny =
                        (b.y - a.y) /
                        d;


                    // El cuadrado que está siendo
                    // manipulado permanece bajo el dedo.

                    if (
                        !a.seleccionado
                    ) {

                        a.x -=
                            nx *
                            diferencia *
                            0.5;

                        a.y -=
                            ny *
                            diferencia *
                            0.5;

                    }


                    if (
                        !b.seleccionado
                    ) {

                        b.x +=
                            nx *
                            diferencia *
                            0.5;

                        b.y +=
                            ny *
                            diferencia *
                            0.5;

                    }

                }


                // ------------------------------------------------
                // CADUCIDAD
                // ------------------------------------------------
                // Si al menos uno está siendo manipulado,
                // ambos pierden propiedades.

                if (
                    a.seleccionado ||
                    b.seleccionado
                ) {

                    a.tiempoContacto += 1;
                    b.tiempoContacto += 1;


                    // ------------------------------------------------
                    // INTENSIDAD
                    // ------------------------------------------------
                    // Cuanto más tiempo permanecen juntos,
                    // más rápida se vuelve la degradación.

                    let intensidad = 1;


                    if (
                        a.tiempoContacto >
                        CONTACTO_INTENSO
                    ) {

                        intensidad = 1.8;

                    }


                    if (
                        a.tiempoContacto >
                        CONTACTO_INTENSO * 2
                    ) {

                        intensidad = 2.5;

                    }


                    if (
                        a.tiempoContacto >
                        CONTACTO_INTENSO * 4
                    ) {

                        intensidad = 3.2;

                    }


                    aplicarCaducidad(
                        a,
                        intensidad
                    );


                    aplicarCaducidad(
                        b,
                        intensidad
                    );

                }


                // ------------------------------------------------
                // REBOTE
                // ------------------------------------------------
                // El objeto manipulado no rebota.
                // El otro objeto sí responde físicamente.

                if (
                    !a.seleccionado
                ) {

                    a.vx *= -REBOTE;
                    a.vy *= -REBOTE;

                }


                if (
                    !b.seleccionado
                ) {

                    b.vx *= -REBOTE;
                    b.vy *= -REBOTE;

                }

            }

        }

    }

}


// ============================================================
// ACTUALIZAR TIEMPO DE CONTACTO
// ============================================================
// Si los cuadrados dejan de tocarse,
// el acumulador vuelve lentamente a cero.
//
// Esto evita que un choque anterior mantenga
// permanentemente la intensidad máxima.

function actualizarContacto() {

    for (const cuadrado of cuadrados) {

        if (
            !cuadrado.chocando
        ) {

            cuadrado.tiempoContacto =
                Math.max(
                    0,
                    cuadrado.tiempoContacto - 0.5
                );

        }

    }

}


// ============================================================
// ACTUALIZAR DESAPARICIÓN
// ============================================================

function actualizarDesaparicion() {

    for (const cuadrado of cuadrados) {

        // Si llegó al agotamiento,
        // empieza a desaparecer.

        if (
            cuadrado.agotado &&
            !cuadrado.desapareciendo
        ) {

            cuadrado.desapareciendo =
                true;

        }


        if (
            !cuadrado.desapareciendo
        ) {

            continue;

        }


        // ----------------------------------------------------
        // DESAPARICIÓN
        // ----------------------------------------------------

        cuadrado.opacidad -=
            0.018;


        cuadrado.tamaño -=
            0.35;


        if (
            cuadrado.opacidad <= 0 ||
            cuadrado.tamaño <= 0
        ) {

            cuadrado.opacidad = 0;

            cuadrado.tamaño = 0;

        }

    }


    // --------------------------------------------------------
    // ELIMINAR COMPLETAMENTE
    // --------------------------------------------------------

    cuadrados =
        cuadrados.filter(
            cuadrado =>
                cuadrado.opacidad > 0
        );

}


// ============================================================
// DIBUJAR CUADRADO
// ============================================================

function dibujarCuadrado(cuadrado) {

    if (
        cuadrado.opacidad <= 0 ||
        cuadrado.tamaño <= 0
    ) {

        return;

    }


    ctx.save();


    // --------------------------------------------------------
    // POSICIÓN
    // --------------------------------------------------------

    ctx.translate(
        cuadrado.x,
        cuadrado.y
    );


    // --------------------------------------------------------
    // RESPIRACIÓN
    // --------------------------------------------------------
    // Incluso durante la caducidad,
    // el objeto conserva un pequeño comportamiento orgánico.

    let respiracion =
        1 +
        Math.sin(
            cuadrado.fase
        ) *
        0.025;


    // Cuando está chocando, la respiración
    // se vuelve un poco más pequeña.

    if (
        cuadrado.chocando
    ) {

        respiracion =
            1 +
            Math.sin(
                cuadrado.fase
            ) *
            0.015;

    }


    const tamaño =
        cuadrado.tamaño *
        respiracion;


    // --------------------------------------------------------
    // OPACIDAD
    // --------------------------------------------------------

    ctx.globalAlpha =
        cuadrado.opacidad;


    // --------------------------------------------------------
    // CUADRADO
    // --------------------------------------------------------

    ctx.fillStyle =
        cuadrado.color;


    ctx.fillRect(

        -tamaño / 2,

        -tamaño / 2,

        tamaño,

        tamaño

    );


    // --------------------------------------------------------
    // BORDE
    // --------------------------------------------------------

    ctx.strokeStyle =
        cuadrado.color;


    ctx.lineWidth =
        cuadrado.linea;


    ctx.globalAlpha =
        cuadrado.opacidad *
        0.9;


    ctx.strokeRect(

        -tamaño / 2,

        -tamaño / 2,

        tamaño,

        tamaño

    );


    // --------------------------------------------------------
    // EFECTO DE CONTACTO
    // --------------------------------------------------------
    // Cuando hay un choque activo,
    // aparece un brillo muy leve.
    //
    // No se agrega ningún indicador textual.

    if (
        cuadrado.chocando
    ) {

        ctx.globalAlpha =
            cuadrado.opacidad *
            0.22;


        ctx.shadowBlur =
            15;


        ctx.shadowColor =
            cuadrado.color;


        ctx.strokeStyle =
            cuadrado.color;


        ctx.lineWidth = 3;


        ctx.strokeRect(

            -tamaño / 2 - 4,

            -tamaño / 2 - 4,

            tamaño + 8,

            tamaño + 8

        );


        ctx.shadowBlur = 0;

    }


    // --------------------------------------------------------
    // INDICADOR TÁCTIL
    // --------------------------------------------------------
    // Cuando el usuario está agarrando un cuadrado,
    // aparece un pequeño cambio visual.
    //
    // No es un botón ni una interfaz:
    // es una respuesta física al contacto.

    if (
        cuadrado.seleccionado
    ) {

        ctx.globalAlpha =
            cuadrado.opacidad *
            0.25;


        ctx.strokeStyle =
            "#FFFFFF";


        ctx.lineWidth = 2;


        ctx.strokeRect(

            -tamaño / 2 - 7,

            -tamaño / 2 - 7,

            tamaño + 14,

            tamaño + 14

        );

    }


    ctx.restore();


    ctx.globalAlpha = 1;

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


    for (
        const cuadrado of cuadrados
    ) {

        dibujarCuadrado(
            cuadrado
        );

    }

}


// ============================================================
// BUSCAR CUADRADO TOCADO
// ============================================================

function obtenerCuadradoEnPosicion(
    x,
    y
) {

    // Recorremos desde el último
    // para detectar correctamente
    // el objeto que esté arriba.

    for (
        let i = cuadrados.length - 1;
        i >= 0;
        i--
    ) {

        const cuadrado =
            cuadrados[i];


        if (
            cuadrado.desapareciendo
        ) {

            continue;

        }


        const mitad =
            cuadrado.tamaño / 2;


        if (

            x >=
                cuadrado.x - mitad &&

            x <=
                cuadrado.x + mitad &&

            y >=
                cuadrado.y - mitad &&

            y <=
                cuadrado.y + mitad

        ) {

            return cuadrado;

        }

    }


    return null;

}


// ============================================================
// OBTENER POSICIÓN DE TOUCH
// ============================================================

function obtenerPosicionTouch(touch) {

    const rect =
        canvas.getBoundingClientRect();


    return {

        x:
            (touch.clientX - rect.left) *
            canvas.width /
            rect.width,

        y:
            (touch.clientY - rect.top) *
            canvas.height /
            rect.height

    };

}


// ============================================================
// TOUCH START
// ============================================================
// El dedo toca un cuadrado y comienza a arrastrarlo.

canvas.addEventListener(

    "touchstart",

    function (evento) {

        evento.preventDefault();


        // Solamente utilizamos el primer dedo.
        // Esta experiencia trabaja con arrastre individual.

        if (
            cuadradoSeleccionado
        ) {

            return;

        }


        const touch =
            evento.changedTouches[0];


        const posicion =
            obtenerPosicionTouch(
                touch
            );


        const cuadrado =
            obtenerCuadradoEnPosicion(
                posicion.x,
                posicion.y
            );


        if (
            !cuadrado
        ) {

            return;

        }


        // Guardar cuadrado.

        cuadradoSeleccionado =
            cuadrado;


        dedoActivo =
            touch.identifier;


        cuadrado.seleccionado =
            true;


        // Detener movimiento automático.

        cuadrado.vx = 0;
        cuadrado.vy = 0;

    },

    {
        passive: false
    }

);


// ============================================================
// TOUCH MOVE
// ============================================================
// El cuadrado sigue directamente al dedo.

canvas.addEventListener(

    "touchmove",

    function (evento) {

        evento.preventDefault();


        if (
            !cuadradoSeleccionado
        ) {

            return;

        }


        let touchEncontrado =
            null;


        // Buscar específicamente
        // el dedo que inició la interacción.

        for (
            const touch of evento.touches
        ) {

            if (
                touch.identifier ===
                dedoActivo
            ) {

                touchEncontrado =
                    touch;

                break;

            }

        }


        if (
            !touchEncontrado
        ) {

            return;

        }


        const posicion =
            obtenerPosicionTouch(
                touchEncontrado
            );


        const cuadrado =
            cuadradoSeleccionado;


        const mitad =
            cuadrado.tamaño / 2;


        // ----------------------------------------------------
        // POSICIÓN
        // ----------------------------------------------------
        // El objeto sigue al dedo,
        // pero nunca puede salir del canvas.

        cuadrado.x =
            Math.max(
                mitad,
                Math.min(
                    canvas.width - mitad,
                    posicion.x
                )
            );


        cuadrado.y =
            Math.max(
                mitad,
                Math.min(
                    canvas.height - mitad,
                    posicion.y
                )
            );

    },

    {
        passive: false
    }

);


// ============================================================
// FINALIZAR TOUCH
// ============================================================

function terminarTouch(evento) {

    if (
        !cuadradoSeleccionado
    ) {

        return;

    }


    let perteneceAlDedo =
        false;


    for (
        const touch of evento.changedTouches
    ) {

        if (
            touch.identifier ===
            dedoActivo
        ) {

            perteneceAlDedo =
                true;

            break;

        }

    }


    if (
        !perteneceAlDedo
    ) {

        return;

    }


    const cuadrado =
        cuadradoSeleccionado;


    cuadrado.seleccionado =
        false;


    // --------------------------------------------------------
    // SI ESTÁ AGOTADO
    // --------------------------------------------------------

    if (
        cuadrado.agotado
    ) {

        cuadrado.desapareciendo =
            true;

    } else {

        // ----------------------------------------------------
        // VOLVER AL MOVIMIENTO
        // ----------------------------------------------------

        cuadrado.vx =
            (Math.random() - 0.5) *
            VELOCIDAD_BASE;


        cuadrado.vy =
            (Math.random() - 0.5) *
            VELOCIDAD_BASE;

    }


    cuadradoSeleccionado =
        null;


    dedoActivo =
        null;

}


// ============================================================
// TOUCH END
// ============================================================

canvas.addEventListener(

    "touchend",

    function (evento) {

        evento.preventDefault();

        terminarTouch(evento);

    },

    {
        passive: false
    }

);


// ============================================================
// TOUCH CANCEL
// ============================================================

canvas.addEventListener(

    "touchcancel",

    function (evento) {

        evento.preventDefault();

        terminarTouch(evento);

    },

    {
        passive: false
    }

);


// ============================================================
// ANIMACIÓN
// ============================================================

function animar() {

    // Actualizar movimiento.

    moverCuadrados();


    // Detectar cuerpos que chocan.

    detectarColisiones();


    // Reducir lentamente los contactos
    // que ya terminaron.

    actualizarContacto();


    // Eliminar objetos agotados.

    actualizarDesaparicion();


    // Dibujar.

    dibujar();


    // Continuar animación.

    requestAnimationFrame(
        animar
    );

}


// ============================================================
// INICIO
// ============================================================

ajustarCanvas();

crearCuadrados();

animar();


// ============================================================
// RESIZE
// ============================================================

window.addEventListener(
    "resize",
    function () {

        ajustarCanvas();

        // Volver a contener los cuadrados
        // después de cambiar el tamaño.

        cuadrados.forEach(
            cuadrado => {

                controlarBordes(
                    cuadrado
                );

            }
        );

    }
);

