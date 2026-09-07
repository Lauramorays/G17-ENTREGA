// ============================================================
// EMPATÍA
// circulos2.js
// ============================================================
//
// COMPORTAMIENTO:
//
// - Los 4 círculos comienzan tranquilos.
// - Permanecen tranquilos durante unos segundos.
// - Después cada círculo se altera en un momento diferente.
// - Cada círculo se altera directamente, sin transición lenta.
// - Los círculos alterados respiran fuerte y rápido.
// - Los círculos alterados se mueven rápido y de forma errática.
// - Al tocar 2 o más círculos al mismo tiempo, se calman.
// - Se pueden calmar grupos de 2, 3 o 4.
// - Al soltar los dedos permanecen calmados.
// - Calmado + calmado = siguen calmados.
// - Calmado + alterado = el calmado se altera.
// - Si todos están calmados, permanecen calmados.
//
// ============================================================


// ============================================================
// CANVAS
// ============================================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


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


// ------------------------------------------------------------
// VELOCIDAD
// ------------------------------------------------------------
//
// Alterados = mucho más rápidos
//

const VELOCIDAD_MAXIMA = 1.35;

const VELOCIDAD_MINIMA_ALTERADA = 0.75;


// ------------------------------------------------------------
// COLISIONES
// ------------------------------------------------------------

const FUERZA_COLISION = 0.7;


// ============================================================
// RESPIRACIÓN ALTERADA
// ============================================================
//
// Mucho más visible y rápida.
//

const AMPLITUD_RESPIRACION_MIN = 7;

const AMPLITUD_RESPIRACION_MAX = 13;

const VELOCIDAD_RESPIRACION_MIN = 0.025;

const VELOCIDAD_RESPIRACION_MAX = 0.045;


// ============================================================
// RESPIRACIÓN CALMADA
// ============================================================

const AMPLITUD_RESPIRACION_CALMADA = 0.7;

const VELOCIDAD_RESPIRACION_CALMADA = 0.0035;


// ============================================================
// MOVIMIENTO CALMADO
// ============================================================

const VELOCIDAD_MOVIMIENTO_CALMADO = 0.18;


// ============================================================
// TIEMPO INICIAL TRANQUILO
// ============================================================

const TIEMPO_TRANQUILO_INICIAL = 2500;


// ============================================================
// TIEMPO INDIVIDUAL DE ALTERACIÓN
// ============================================================
//
// Después de los 2.5 segundos:
//
// círculo 1 -> inmediatamente
// círculo 2 -> 0.85 s después
// círculo 3 -> 1.75 s después
// círculo 4 -> 2.85 s después
//
// ============================================================

const TIEMPOS_ALTERACION = [
    0,
    850,
    1750,
    2850
];


// ============================================================
// VARIABLES
// ============================================================

let circulos = [];

let punteros = new Map();

let siguienteId = 0;

let tiempoInicio = performance.now();


// ============================================================
// AJUSTAR CANVAS
// ============================================================

function ajustarCanvas() {

    const rect =
        canvas.getBoundingClientRect();

    canvas.width =
        rect.width;

    canvas.height =
        rect.height;
}


// ============================================================
// LIMITAR
// ============================================================

function limitar(valor, minimo, maximo) {

    return Math.max(
        minimo,
        Math.min(
            maximo,
            valor
        )
    );
}


// ============================================================
// CREAR CÍRCULO
// ============================================================

function crearCirculo(
    x,
    y,
    color,
    indice
) {

    // --------------------------------------------------------
    // VELOCIDAD INDIVIDUAL
    // --------------------------------------------------------

    const velocidadMovimiento =
        0.35 +
        Math.random() *
        0.30;


    // --------------------------------------------------------
    // RESPIRACIÓN INDIVIDUAL
    // --------------------------------------------------------

    const amplitudRespiracion =
        AMPLITUD_RESPIRACION_MIN +
        Math.random() *
        (
            AMPLITUD_RESPIRACION_MAX -
            AMPLITUD_RESPIRACION_MIN
        );


    const velocidadRespiracion =
        VELOCIDAD_RESPIRACION_MIN +
        Math.random() *
        (
            VELOCIDAD_RESPIRACION_MAX -
            VELOCIDAD_RESPIRACION_MIN
        );


    return {

        id: siguienteId++,

        indice: indice,


        // ====================================================
        // POSICIÓN
        // ====================================================

        x: x,

        y: y,


        // ====================================================
        // TAMAÑO
        // ====================================================

        radio: TAMAÑO_INICIAL,

        radioOriginal: TAMAÑO_INICIAL,


        // ====================================================
        // COLOR
        // ====================================================

        color: color,


        // ====================================================
        // MOVIMIENTO
        // ====================================================

        vx:
            (Math.random() * 2 - 1) *
            velocidadMovimiento,

        vy:
            (Math.random() * 2 - 1) *
            velocidadMovimiento,


        velocidadMovimiento:
            velocidadMovimiento,

        velocidadMovimientoOriginal:
            velocidadMovimiento,


        // ====================================================
        // RESPIRACIÓN
        // ====================================================

        faseRespiracion:
            Math.random() *
            Math.PI *
            2,


        velocidadRespiracion:
            VELOCIDAD_RESPIRACION_CALMADA,


        velocidadRespiracionOriginal:
            velocidadRespiracion,


        amplitudRespiracion:
            AMPLITUD_RESPIRACION_CALMADA,


        amplitudRespiracionOriginal:
            amplitudRespiracion,


        respiracion: 0,


        // ====================================================
        // MOVIMIENTO ORGÁNICO
        // ====================================================

        faseMovimiento:
            Math.random() *
            Math.PI *
            2,


        velocidadFaseMovimiento:
            0.004 +
            Math.random() *
            0.004,


        // ====================================================
        // MOVIMIENTO ERRÁTICO
        // ====================================================

        faseErratica:
            Math.random() *
            Math.PI *
            2,


        velocidadErratica:
            0.025 +
            Math.random() *
            0.035,


        fuerzaErratica:
            0.018 +
            Math.random() *
            0.028,


        // Segundo movimiento errático
        // para evitar que sea demasiado regular

        faseErraticaSecundaria:
            Math.random() *
            Math.PI *
            2,


        velocidadErraticaSecundaria:
            0.04 +
            Math.random() *
            0.04,


        // ====================================================
        // CAMBIO DE DIRECCIÓN
        // ====================================================

        objetivoDireccionX:
            Math.random() * 2 - 1,

        objetivoDireccionY:
            Math.random() * 2 - 1,


        tiempoCambioDireccion:
            500 +
            Math.random() *
            900,


        siguienteCambioDireccion:
            performance.now() +
            500 +
            Math.random() *
            900,


        // ====================================================
        // INTERACCIÓN
        // ====================================================

        siendoMovido: false,

        punterosMovimiento: [],


        // ====================================================
        // ESTADO
        // ====================================================

        calmado: true,

        alterandose: false,

        yaSeAltero: false,


        // ====================================================
        // TIEMPO DE ALTERACIÓN
        // ====================================================

        tiempoAlteracion:
            TIEMPOS_ALTERACION[indice],


        // ====================================================
        // DEFORMACIÓN
        // ====================================================

        escalaX: 1,

        escalaY: 1,

        anguloDeformacion: 0
    };
}


// ============================================================
// CREAR LOS 4 CÍRCULOS
// ============================================================

function crearCirculosIniciales() {

    circulos = [];

    siguienteId = 0;


    const posiciones = [

        {
            x: 0.25,
            y: 0.30
        },

        {
            x: 0.75,
            y: 0.30
        },

        {
            x: 0.25,
            y: 0.70
        },

        {
            x: 0.75,
            y: 0.70
        }

    ];


    for (let i = 0; i < 4; i++) {

        const circulo =
            crearCirculo(

                canvas.width *
                posiciones[i].x,

                canvas.height *
                posiciones[i].y,

                colores[i],

                i
            );


        circulos.push(
            circulo
        );
    }
}


// ============================================================
// INICIALIZAR
// ============================================================

ajustarCanvas();

crearCirculosIniciales();


// ============================================================
// RESIZE
// ============================================================

window.addEventListener(
    "resize",
    () => {

        ajustarCanvas();

    }
);


// ============================================================
// ¿TODOS ESTÁN CALMADOS?
// ============================================================

function todosCalmados() {

    return (
        circulos.length > 0 &&
        circulos.every(
            circulo =>
                circulo.calmado
        )
    );
}


// ============================================================
// ALTERAR CÍRCULO
// ============================================================

function alterarCirculo(circulo) {

    // --------------------------------------------------------
    // SI TODOS ESTÁN CALMADOS
    // NO SE ALTERA NINGUNO
    // --------------------------------------------------------

    if (todosCalmados()) {

        return;
    }


    // --------------------------------------------------------
    // SI YA ESTÁ ALTERADO
    // --------------------------------------------------------

    if (!circulo.calmado) {

        return;
    }


    // --------------------------------------------------------
    // ALTERAR
    // --------------------------------------------------------

    circulo.calmado = false;

    circulo.alterandose = false;

    circulo.yaSeAltero = true;


    // ========================================================
    // RESPIRACIÓN FUERTE INMEDIATA
    // ========================================================

    circulo.amplitudRespiracion =
        circulo.amplitudRespiracionOriginal;


    circulo.velocidadRespiracion =
        circulo.velocidadRespiracionOriginal;


    // ========================================================
    // MOVIMIENTO RÁPIDO
    // ========================================================

    circulo.velocidadMovimiento =
        circulo.velocidadMovimientoOriginal *
        2.2;


    // --------------------------------------------------------
    // Dirección aleatoria
    // --------------------------------------------------------

    const angulo =
        Math.random() *
        Math.PI *
        2;


    const velocidad =
        VELOCIDAD_MINIMA_ALTERADA +
        Math.random() *
        (
            VELOCIDAD_MAXIMA -
            VELOCIDAD_MINIMA_ALTERADA
        );


    circulo.vx =
        Math.cos(angulo) *
        velocidad;


    circulo.vy =
        Math.sin(angulo) *
        velocidad;


    // --------------------------------------------------------
    // Nuevo cambio de dirección
    // --------------------------------------------------------

    circulo.siguienteCambioDireccion =
        performance.now() +
        250 +
        Math.random() *
        500;
}


// ============================================================
// CALMAR CÍRCULO
// ============================================================

function calmarCirculo(circulo) {

    // --------------------------------------------------------
    // YA CALMADO
    // --------------------------------------------------------

    if (circulo.calmado) {

        return;
    }


    // --------------------------------------------------------
    // CALMAR
    // --------------------------------------------------------

    circulo.calmado = true;

    circulo.alterandose = false;


    // ========================================================
    // REDUCIR VELOCIDAD
    // ========================================================

    const velocidadActual =
        Math.sqrt(
            circulo.vx *
            circulo.vx +

            circulo.vy *
            circulo.vy
        );


    if (
        velocidadActual >
        VELOCIDAD_MOVIMIENTO_CALMADO
    ) {

        const factor =
            VELOCIDAD_MOVIMIENTO_CALMADO /
            velocidadActual;


        circulo.vx *=
            factor;


        circulo.vy *=
            factor;
    }


    circulo.velocidadMovimiento =
        VELOCIDAD_MOVIMIENTO_CALMADO;


    // ========================================================
    // REDUCIR RESPIRACIÓN
    // ========================================================

    circulo.amplitudRespiracion =
        AMPLITUD_RESPIRACION_CALMADA;


    circulo.velocidadRespiracion =
        VELOCIDAD_RESPIRACION_CALMADA;
}


// ============================================================
// ALTERACIÓN INICIAL INDIVIDUAL
// ============================================================

function actualizarAlteracionInicial(ahora) {

    const tiempo =
        ahora -
        tiempoInicio;


    // ========================================================
    // PRIMEROS 2.5 SEGUNDOS
    // TODOS TRANQUILOS
    // ========================================================

    if (
        tiempo <
        TIEMPO_TRANQUILO_INICIAL
    ) {

        for (
            const circulo of circulos
        ) {

            circulo.amplitudRespiracion =
                AMPLITUD_RESPIRACION_CALMADA;


            circulo.velocidadRespiracion =
                VELOCIDAD_RESPIRACION_CALMADA;


            circulo.velocidadMovimiento =
                VELOCIDAD_MOVIMIENTO_CALMADO;
        }


        return;
    }


    // ========================================================
    // TIEMPO DESDE QUE TERMINÓ LA CALMA
    // ========================================================

    const tiempoAlteracion =
        tiempo -
        TIEMPO_TRANQUILO_INICIAL;


    // ========================================================
    // ALTERAR INDIVIDUALMENTE
    // ========================================================

    for (
        const circulo of circulos
    ) {

        // ----------------------------------------------------
        // SI YA ESTÁ ALTERADO
        // ----------------------------------------------------

        if (
            circulo.yaSeAltero
        ) {

            continue;
        }


        // ----------------------------------------------------
        // LLEGÓ SU MOMENTO
        // ----------------------------------------------------

        if (
            tiempoAlteracion >=
            circulo.tiempoAlteracion
        ) {

            // -----------------------------------------------
            // IMPORTANTE:
            //
            // Entra directamente alterado.
            // No existe una transición gradual.
            // -----------------------------------------------

            circulo.calmado =
                false;


            circulo.yaSeAltero =
                true;


            // -----------------------------------------------
            // RESPIRACIÓN FUERTE
            // -----------------------------------------------

            circulo.amplitudRespiracion =
                circulo.amplitudRespiracionOriginal;


            circulo.velocidadRespiracion =
                circulo.velocidadRespiracionOriginal;


            // -----------------------------------------------
            // MOVIMIENTO RÁPIDO
            // -----------------------------------------------

            circulo.velocidadMovimiento =
                circulo.velocidadMovimientoOriginal *
                2.2;


            // -----------------------------------------------
            // DIRECCIÓN ALEATORIA
            // -----------------------------------------------

            const angulo =
                Math.random() *
                Math.PI *
                2;


            const velocidad =
                VELOCIDAD_MINIMA_ALTERADA +
                Math.random() *
                (
                    VELOCIDAD_MAXIMA -
                    VELOCIDAD_MINIMA_ALTERADA
                );


            circulo.vx =
                Math.cos(angulo) *
                velocidad;


            circulo.vy =
                Math.sin(angulo) *
                velocidad;


            // -----------------------------------------------
            // PRIMER CAMBIO DE DIRECCIÓN
            // -----------------------------------------------

            circulo.siguienteCambioDireccion =
                ahora +
                250 +
                Math.random() *
                500;
        }
    }
}


// ============================================================
// ACTUALIZAR RESPIRACIÓN
// ============================================================

function actualizarRespiracion(circulo) {

    circulo.faseRespiracion +=
        circulo.velocidadRespiracion;


    // ========================================================
    // ALTERADO
    // ========================================================

    if (
        !circulo.calmado
    ) {

        // ----------------------------------------------------
        // Variación irregular de amplitud
        // ----------------------------------------------------

        const variacion =
            Math.sin(
                circulo.faseRespiracion *
                0.37
            ) *
            0.18;


        // ----------------------------------------------------
        // Segundo movimiento respiratorio
        // ----------------------------------------------------

        const variacionSecundaria =
            Math.sin(
                circulo.faseRespiracion *
                1.71
            ) *
            0.08;


        const amplitud =
            circulo.amplitudRespiracion *
            (
                1 +
                variacion +
                variacionSecundaria
            );


        circulo.respiracion =
            Math.sin(
                circulo.faseRespiracion
            ) *
            amplitud;
    }


    // ========================================================
    // CALMADO
    // ========================================================

    else {

        circulo.respiracion =
            Math.sin(
                circulo.faseRespiracion
            ) *
            circulo.amplitudRespiracion;
    }
}


// ============================================================
// ACTUALIZAR MOVIMIENTO
// ============================================================

function actualizarMovimiento(circulo, ahora) {

    // ========================================================
    // CÍRCULO ALTERADO
    // ========================================================

    if (
        !circulo.calmado
    ) {

        // ----------------------------------------------------
        // FASE ERRÁTICA
        // ----------------------------------------------------

        circulo.faseErratica +=
            circulo.velocidadErratica;


        circulo.faseErraticaSecundaria +=
            circulo.velocidadErraticaSecundaria;


        // ----------------------------------------------------
        // CAMBIOS CONTINUOS DE DIRECCIÓN
        // ----------------------------------------------------

        const cambioX =
            Math.sin(
                circulo.faseErratica
            ) *
            circulo.fuerzaErratica;


        const cambioY =
            Math.cos(
                circulo.faseErratica *
                1.37
            ) *
            circulo.fuerzaErratica;


        const cambioSecundarioX =
            Math.cos(
                circulo.faseErraticaSecundaria
            ) *
            circulo.fuerzaErratica *
            0.65;


        const cambioSecundarioY =
            Math.sin(
                circulo.faseErraticaSecundaria *
                1.43
            ) *
            circulo.fuerzaErratica *
            0.65;


        circulo.vx +=
            cambioX +
            cambioSecundarioX;


        circulo.vy +=
            cambioY +
            cambioSecundarioY;


        // ====================================================
        // CAMBIO DE DIRECCIÓN MÁS BRUSCO
        // ====================================================

        if (
            ahora >
            circulo.siguienteCambioDireccion
        ) {

            circulo.objetivoDireccionX =
                Math.random() * 2 - 1;


            circulo.objetivoDireccionY =
                Math.random() * 2 - 1;


            const objetivoModulo =
                Math.sqrt(
                    circulo.objetivoDireccionX *
                    circulo.objetivoDireccionX +

                    circulo.objetivoDireccionY *
                    circulo.objetivoDireccionY
                );


            if (
                objetivoModulo > 0
            ) {

                circulo.objetivoDireccionX /=
                    objetivoModulo;


                circulo.objetivoDireccionY /=
                    objetivoModulo;
            }


            // ------------------------------------------------
            // Cambios rápidos e impredecibles
            // ------------------------------------------------

            const nuevaVelocidad =
                VELOCIDAD_MINIMA_ALTERADA +
                Math.random() *
                (
                    VELOCIDAD_MAXIMA -
                    VELOCIDAD_MINIMA_ALTERADA
                );


            circulo.vx +=
                circulo.objetivoDireccionX *
                nuevaVelocidad *
                0.45;


            circulo.vy +=
                circulo.objetivoDireccionY *
                nuevaVelocidad *
                0.45;


            circulo.siguienteCambioDireccion =
                ahora +
                circulo.tiempoCambioDireccion *
                (
                    0.35 +
                    Math.random() *
                    0.65
                );
        }


        // ====================================================
        // LIMITAR VELOCIDAD ALTERADA
        // ====================================================

        const velocidad =
            Math.sqrt(
                circulo.vx *
                circulo.vx +

                circulo.vy *
                circulo.vy
            );


        if (
            velocidad >
            VELOCIDAD_MAXIMA
        ) {

            const factor =
                VELOCIDAD_MAXIMA /
                velocidad;


            circulo.vx *=
                factor;


            circulo.vy *=
                factor;
        }


        // ----------------------------------------------------
        // Evitar que se vuelva demasiado lento
        // ----------------------------------------------------

        else if (
            velocidad <
            VELOCIDAD_MINIMA_ALTERADA
        ) {

            const factor =
                VELOCIDAD_MINIMA_ALTERADA /
                Math.max(
                    velocidad,
                    0.001
                );


            circulo.vx *=
                factor;


            circulo.vy *=
                factor;
        }
    }


    // ========================================================
    // CÍRCULO CALMADO
    // ========================================================

    else {

        circulo.faseMovimiento +=
            circulo.velocidadFaseMovimiento;


        const movimientoCalmoX =
            Math.sin(
                circulo.faseMovimiento
            ) *
            0.012;


        const movimientoCalmoY =
            Math.cos(
                circulo.faseMovimiento *
                0.83
            ) *
            0.012;


        circulo.vx *=
            0.995;


        circulo.vy *=
            0.995;


        circulo.x +=
            circulo.vx +
            movimientoCalmoX;


        circulo.y +=
            circulo.vy +
            movimientoCalmoY;


        // ----------------------------------------------------
        // Límites
        // ----------------------------------------------------

        mantenerDentroCanvas(
            circulo
        );


        return;
    }


    // ========================================================
    // MOVIMIENTO ALTERADO
    // ========================================================

    circulo.x +=
        circulo.vx;


    circulo.y +=
        circulo.vy;


    // ========================================================
    // MOVIMIENTO ORGÁNICO ADICIONAL
    // ========================================================

    circulo.faseMovimiento +=
        circulo.velocidadFaseMovimiento *
        2;


    circulo.x +=
        Math.sin(
            circulo.faseMovimiento
        ) *
        0.035;


    circulo.y +=
        Math.cos(
            circulo.faseMovimiento *
            0.83
        ) *
        0.035;


    // ========================================================
    // LÍMITES
    // ========================================================

    mantenerDentroCanvas(
        circulo
    );
}


// ============================================================
// MANTENER DENTRO DEL CANVAS
// ============================================================

function mantenerDentroCanvas(circulo) {

    const radio =
        circulo.radio +
        Math.abs(
            circulo.respiracion
        );


    // --------------------------------------------------------
    // IZQUIERDA
    // --------------------------------------------------------

    if (
        circulo.x -
        radio <
        0
    ) {

        circulo.x =
            radio;


        circulo.vx =
            Math.abs(
                circulo.vx
            );


        // Alterados salen con una pequeña desviación
        if (
            !circulo.calmado
        ) {

            circulo.vy +=
                (
                    Math.random() *
                    2 -
                    1
                ) *
                0.15;
        }
    }


    // --------------------------------------------------------
    // DERECHA
    // --------------------------------------------------------

    if (
        circulo.x +
        radio >
        canvas.width
    ) {

        circulo.x =
            canvas.width -
            radio;


        circulo.vx =
            -Math.abs(
                circulo.vx
            );


        if (
            !circulo.calmado
        ) {

            circulo.vy +=
                (
                    Math.random() *
                    2 -
                    1
                ) *
                0.15;
        }
    }


    // --------------------------------------------------------
    // ARRIBA
    // --------------------------------------------------------

    if (
        circulo.y -
        radio <
        0
    ) {

        circulo.y =
            radio;


        circulo.vy =
            Math.abs(
                circulo.vy
            );


        if (
            !circulo.calmado
        ) {

            circulo.vx +=
                (
                    Math.random() *
                    2 -
                    1
                ) *
                0.15;
        }
    }


    // --------------------------------------------------------
    // ABAJO
    // --------------------------------------------------------

    if (
        circulo.y +
        radio >
        canvas.height
    ) {

        circulo.y =
            canvas.height -
            radio;


        circulo.vy =
            -Math.abs(
                circulo.vy
            );


        if (
            !circulo.calmado
        ) {

            circulo.vx +=
                (
                    Math.random() *
                    2 -
                    1
                ) *
                0.15;
        }
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
                b.x -
                a.x;


            const dy =
                b.y -
                a.y;


            const distancia =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            if (
                distancia <= 0
            ) {

                continue;
            }


            // =================================================
            // RADIOS
            // =================================================

            const radioA =
                a.radio +
                Math.abs(
                    a.respiracion
                );


            const radioB =
                b.radio +
                Math.abs(
                    b.respiracion
                );


            const distanciaMinima =
                radioA +
                radioB;


            // =================================================
            // COLISIÓN
            // =================================================

            if (
                distancia <
                distanciaMinima
            ) {

                const nx =
                    dx /
                    distancia;


                const ny =
                    dy /
                    distancia;


                // ------------------------------------------------
                // SEPARACIÓN
                // ------------------------------------------------

                const penetracion =
                    distanciaMinima -
                    distancia;


                const separacion =
                    penetracion *
                    0.5;


                if (
                    !a.siendoMovido
                ) {

                    a.x -=
                        nx *
                        separacion;


                    a.y -=
                        ny *
                        separacion;
                }


                if (
                    !b.siendoMovido
                ) {

                    b.x +=
                        nx *
                        separacion;


                    b.y +=
                        ny *
                        separacion;
                }


                // ------------------------------------------------
                // VELOCIDAD RELATIVA
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


                // ------------------------------------------------
                // IMPULSO
                // ------------------------------------------------

                if (
                    velocidadNormal < 0
                ) {

                    const impulso =
                        velocidadNormal *
                        FUERZA_COLISION;


                    a.vx +=
                        nx *
                        impulso;


                    a.vy +=
                        ny *
                        impulso;


                    b.vx -=
                        nx *
                        impulso;


                    b.vy -=
                        ny *
                        impulso;
                }


                // =================================================
                // EMPATÍA
                // =================================================
                //
                // Calmado + alterado:
                // el calmado se altera.
                //
                // Calmado + calmado:
                // no pasa nada.
                //
                // Alterado + alterado:
                // no pasa nada.
                //
                // =================================================

                if (
                    a.calmado &&
                    !b.calmado
                ) {

                    alterarCirculo(
                        a
                    );
                }


                if (
                    b.calmado &&
                    !a.calmado
                ) {

                    alterarCirculo(
                        b
                    );
                }
            }
        }
    }
}


// ============================================================
// OBTENER CÍRCULO BAJO EL PUNTERO
// ============================================================

function obtenerCirculo(x, y) {

    for (
        let i = circulos.length - 1;
        i >= 0;
        i--
    ) {

        const circulo =
            circulos[i];


        const dx =
            x -
            circulo.x;


        const dy =
            y -
            circulo.y;


        const radio =
            circulo.radio +
            Math.abs(
                circulo.respiracion
            );


        if (
            dx * dx +
            dy * dy <=
            radio * radio
        ) {

            return circulo;
        }
    }


    return null;
}


// ============================================================
// OBTENER CÍRCULOS SELECCIONADOS
// ============================================================

function obtenerCirculosSeleccionados() {

    const seleccionados = [];


    for (
        const circulo of circulos
    ) {

        if (
            circulo.punterosMovimiento.length >
            0
        ) {

            seleccionados.push(
                circulo
            );
        }
    }


    return seleccionados;
}


// ============================================================
// CALMAR GRUPO
// ============================================================

function calmarGrupo() {

    const seleccionados =
        obtenerCirculosSeleccionados();


    // --------------------------------------------------------
    // NECESITAMOS 2 O MÁS
    // --------------------------------------------------------

    if (
        seleccionados.length <
        2
    ) {

        return;
    }


    // --------------------------------------------------------
    // CALMAR TODOS LOS SELECCIONADOS
    // --------------------------------------------------------

    for (
        const circulo of seleccionados
    ) {

        calmarCirculo(
            circulo
        );
    }
}


// ============================================================
// POINTER DOWN
// ============================================================

function manejarPointerDown(event) {

    event.preventDefault();


    const rect =
        canvas.getBoundingClientRect();


    const x =
        event.clientX -
        rect.left;


    const y =
        event.clientY -
        rect.top;


    const circulo =
        obtenerCirculo(
            x,
            y
        );


    if (!circulo) {

        return;
    }


    // --------------------------------------------------------
    // CAPTURAR POINTER
    // --------------------------------------------------------

    try {

        canvas.setPointerCapture(
            event.pointerId
        );

    }
    catch (error) {}


    // --------------------------------------------------------
    // GUARDAR POINTER
    // --------------------------------------------------------

    punteros.set(
        event.pointerId,
        {
            circulo: circulo,

            x: x,

            y: y
        }
    );


    // --------------------------------------------------------
    // ASOCIAR POINTER
    // --------------------------------------------------------

    if (
        !circulo.punterosMovimiento.includes(
            event.pointerId
        )
    ) {

        circulo.punterosMovimiento.push(
            event.pointerId
        );
    }


    circulo.siendoMovido =
        true;


    // --------------------------------------------------------
    // INTENTAR CALMAR GRUPO
    // --------------------------------------------------------

    calmarGrupo();
}


// ============================================================
// POINTER MOVE
// ============================================================

function manejarPointerMove(event) {

    if (
        !punteros.has(
            event.pointerId
        )
    ) {

        return;
    }


    event.preventDefault();


    const datos =
        punteros.get(
            event.pointerId
        );


    const circulo =
        datos.circulo;


    const rect =
        canvas.getBoundingClientRect();


    const x =
        event.clientX -
        rect.left;


    const y =
        event.clientY -
        rect.top;


    // --------------------------------------------------------
    // DELTA
    // --------------------------------------------------------

    const dx =
        x -
        datos.x;


    const dy =
        y -
        datos.y;


    datos.x =
        x;


    datos.y =
        y;


    // --------------------------------------------------------
    // MOVER
    // --------------------------------------------------------

    circulo.x +=
        dx;


    circulo.y +=
        dy;


    // --------------------------------------------------------
    // VELOCIDAD DEL ARRASTRE
    // --------------------------------------------------------

    circulo.vx =
        circulo.vx *
        0.85 +
        dx *
        0.15;


    circulo.vy =
        circulo.vy *
        0.85 +
        dy *
        0.15;


    // --------------------------------------------------------
    // CALMAR GRUPO
    // --------------------------------------------------------

    calmarGrupo();
}


// ============================================================
// POINTER UP
// ============================================================

function manejarPointerUp(event) {

    event.preventDefault();


    if (
        !punteros.has(
            event.pointerId
        )
    ) {

        return;
    }


    const datos =
        punteros.get(
            event.pointerId
        );


    const circulo =
        datos.circulo;


    // --------------------------------------------------------
    // QUITAR POINTER
    // --------------------------------------------------------

    circulo.punterosMovimiento =
        circulo.punterosMovimiento.filter(
            id =>
                id !==
                event.pointerId
        );


    circulo.siendoMovido =
        circulo.punterosMovimiento.length >
        0;


    punteros.delete(
        event.pointerId
    );


    // --------------------------------------------------------
    // IMPORTANTE:
    //
    // AL SOLTAR NO SE ALTERA.
    //
    // Si estaba calmado, queda calmado.
    // --------------------------------------------------------
}


// ============================================================
// EVENTOS POINTER
// ============================================================

canvas.addEventListener(
    "pointerdown",
    manejarPointerDown
);


canvas.addEventListener(
    "pointermove",
    manejarPointerMove
);


canvas.addEventListener(
    "pointerup",
    manejarPointerUp
);


canvas.addEventListener(
    "pointercancel",
    manejarPointerUp
);


canvas.addEventListener(
    "pointerleave",
    manejarPointerUp
);


// ============================================================
// DIBUJAR CÍRCULO
// ============================================================

function dibujarCirculo(circulo) {

    const radio =
        circulo.radio +
        circulo.respiracion;


    ctx.save();


    ctx.translate(
        circulo.x,
        circulo.y
    );


    // --------------------------------------------------------
    // DEFORMACIÓN
    // --------------------------------------------------------

    ctx.rotate(
        circulo.anguloDeformacion
    );


    ctx.scale(
        circulo.escalaX,
        circulo.escalaY
    );


    // ========================================================
    // GRADIENTES
    // ========================================================

    let gradiente;


    if (
        circulo.color ===
        "#D9D9D9"
    ) {

        gradiente =
            ctx.createRadialGradient(

                -radio * 0.35,

                -radio * 0.35,

                radio * 0.05,

                0,

                0,

                radio
            );


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

        gradiente =
            ctx.createRadialGradient(

                -radio * 0.35,

                -radio * 0.35,

                radio * 0.05,

                0,

                0,

                radio
            );


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

        gradiente =
            ctx.createRadialGradient(

                -radio * 0.35,

                -radio * 0.35,

                radio * 0.05,

                0,

                0,

                radio
            );


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


    else {

        gradiente =
            ctx.createRadialGradient(

                -radio * 0.35,

                -radio * 0.35,

                radio * 0.05,

                0,

                0,

                radio
            );


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


    // ========================================================
    // SOMBRA
    // ========================================================

    if (
        circulo.siendoMovido
    ) {

        ctx.shadowColor =
            "rgba(196,206,229,0.18)";

        ctx.shadowBlur =
            7;
    }

    else {

        ctx.shadowColor =
            "rgba(30,60,100,0.10)";

        ctx.shadowBlur =
            4;
    }


    // ========================================================
    // CÍRCULO
    // ========================================================

    ctx.beginPath();


    ctx.arc(
        0,
        0,
        radio,
        0,
        Math.PI * 2
    );


    ctx.fillStyle =
        gradiente;


    ctx.fill();


    // ========================================================
    // BORDE
    // ========================================================

    if (
        circulo.siendoMovido
    ) {

        ctx.strokeStyle =
            "rgba(196,206,229,0.55)";

        ctx.lineWidth =
            1.2;
    }

    else {

        ctx.strokeStyle =
            "rgba(190,205,225,0.16)";

        ctx.lineWidth =
            0.7;
    }


    ctx.stroke();


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


    for (
        const circulo of circulos
    ) {

        dibujarCirculo(
            circulo
        );
    }
}


// ============================================================
// ACTUALIZAR
// ============================================================

function actualizar(ahora) {

    // --------------------------------------------------------
    // ALTERACIÓN INDIVIDUAL
    // --------------------------------------------------------

    actualizarAlteracionInicial(
        ahora
    );


    // --------------------------------------------------------
    // ACTUALIZAR CÍRCULOS
    // --------------------------------------------------------

    for (
        const circulo of circulos
    ) {

        actualizarRespiracion(
            circulo
        );


        if (
            !circulo.siendoMovido
        ) {

            actualizarMovimiento(
                circulo,
                ahora
            );
        }
    }


    // --------------------------------------------------------
    // COLISIONES
    // --------------------------------------------------------

    detectarColisiones();


    // --------------------------------------------------------
    // DIBUJAR
    // --------------------------------------------------------

    dibujar();


    // --------------------------------------------------------
    // SIGUIENTE FRAME
    // --------------------------------------------------------

    requestAnimationFrame(
        actualizar
    );
}


// ============================================================
// INICIAR
// ============================================================

requestAnimationFrame(
    actualizar
);