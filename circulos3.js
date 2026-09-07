
// ============================================================
// COLABORACIÓN
// circulos3.js
// ============================================================
//
// INTERACCIÓN:
//
// - Comienzan 4 círculos.
// - Los 4 se mueven lentamente y respiran.
//
// PRIMERA ETAPA:
//
// - Hay que tocar los 4 círculos al mismo tiempo.
// - Se necesitan 4 dedos sobre los 4 círculos.
// - Los 4 quedan conectados.
// - La unión se ve mediante pequeños círculos,
//   formando una red / telaraña.
// - Recién cuando los 4 están conectados aparece
//   el círculo número 5.
//
// DESPUÉS:
//
// - El nuevo círculo aparece solo.
// - El nuevo círculo queda libre.
// - Se puede agarrar con un dedo.
// - Para crear otro círculo hay que volver a generar
//   una colaboración con los círculos disponibles.
// - Los círculos aparecen SIEMPRE DE A UNO.
//
// IMPORTANTE:
//
// - Las conexiones permanecen solamente mientras
//   los dedos permanecen apoyados.
// - Si se levanta un dedo, la conexión desaparece.
// - No hay distancia mínima.
// - No hay tiempo de espera.
// - No hay aro de selección.
// - No se ilumina el fondo.
// ============================================================


// ============================================================
// CONFIGURACIÓN
// ============================================================

const colores = [
    "#D9D9D9",
    "#8BB2D3",
    "#202D64",
    "#2B538E"
];

const COLOR_SELECCION = "#C4CEE5";

const RADIO_BASE = 55;


// Movimiento tranquilo
const VELOCIDAD_MAXIMA = 0.38;


// Colisiones suaves
const FUERZA_COLISION = 0.45;


// Respiración suave
const AMPLITUD_RESPIRACION_MIN = 1.2;
const AMPLITUD_RESPIRACION_MAX = 2.8;


// ============================================================
// CANVAS
// ============================================================

const canvas =
    document.getElementById("canvas");

const ctx =
    canvas.getContext("2d");

canvas.style.touchAction = "none";


// ============================================================
// VARIABLES
// ============================================================

let circulos = [];


// Punteros activos.
//
// Cada puntero guarda:
//
// {
//     id,
//     circulo
// }

const punteros =
    new Map();


// Conexiones activas.
//
// Una conexión puede tener varios círculos.
//
// {
//     id,
//     circulos: [...],
//     hijoId
// }

const conexiones = [];


// Identificadores
let siguienteIdConexion = 1;
let siguienteIdCirculo = 1;


// ============================================================
// ETAPA DE COLABORACIÓN
// ============================================================
//
// false:
// todavía estamos en los 4 círculos iniciales.
//
// true:
// ya apareció el quinto y se puede continuar
// generando círculos de a uno.
//
// ============================================================

let primeraColaboracionRealizada = false;


// ============================================================
// POSICIONES INICIALES
// IGUALES A IDENTIDAD
// ============================================================

const posicionesIniciales = [

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


// ============================================================
// AJUSTAR CANVAS
// ============================================================

function ajustarCanvas() {

    canvas.width =
        canvas.clientWidth;

    canvas.height =
        canvas.clientHeight;


    if (
        circulos.length === 0
    ) {

        crearCirculosIniciales();
    }
}


// ============================================================
// CREAR LOS 4 CÍRCULOS INICIALES
// ============================================================

function crearCirculosIniciales() {

    circulos = [];

    for (
        let i = 0;
        i < 4;
        i++
    ) {

        const posicion =
            posicionesIniciales[i];


        const angulo =
            Math.random() *
            Math.PI *
            2;


        const velocidad =
            0.12 +
            Math.random() *
            0.22;


        const circulo =
            crearCirculo(

                canvas.width *
                posicion.x,

                canvas.height *
                posicion.y,

                colores[
                    i %
                    colores.length
                ]
            );


        circulo.vx =
            Math.cos(angulo) *
            velocidad;


        circulo.vy =
            Math.sin(angulo) *
            velocidad;


        circulos.push(
            circulo
        );
    }
}


// ============================================================
// CREAR CÍRCULO
// ============================================================

function crearCirculo(
    x,
    y,
    color
) {

    return {

        // ----------------------------------------------------
        // IDENTIFICACIÓN
        // ----------------------------------------------------

        id:
            siguienteIdCirculo++,


        // ----------------------------------------------------
        // POSICIÓN
        // ----------------------------------------------------

        x,
        y,


        // ----------------------------------------------------
        // TAMAÑO
        // ----------------------------------------------------

        radio:
            RADIO_BASE,

        radioOriginal:
            RADIO_BASE,


        // ----------------------------------------------------
        // COLOR
        // ----------------------------------------------------

        color,


        // ----------------------------------------------------
        // MOVIMIENTO
        // ----------------------------------------------------

        vx: 0,
        vy: 0,


        faseMovimiento:
            Math.random() *
            Math.PI *
            2,


        velocidadMovimiento:
            0.003 +
            Math.random() *
            0.003,


        // ----------------------------------------------------
        // RESPIRACIÓN
        // ----------------------------------------------------

        faseRespiracion:
            Math.random() *
            Math.PI *
            2,


        velocidadRespiracion:
            0.0008 +
            Math.random() *
            0.0008,


        amplitudRespiracion:
            AMPLITUD_RESPIRACION_MIN +
            Math.random() *
            (
                AMPLITUD_RESPIRACION_MAX -
                AMPLITUD_RESPIRACION_MIN
            ),


        respiracion: 0,


        // ----------------------------------------------------
        // INTERACCIÓN
        // ----------------------------------------------------

        siendoMovido:
            false,


        punteroMovimiento:
            null,


        offsetX: 0,
        offsetY: 0,


        // Dedos sobre este círculo

        punteros:
            new Set(),


        // Conexiones

        conexiones:
            new Set(),


        // ----------------------------------------------------
        // DEPENDENCIA
        // ----------------------------------------------------

        creadoPor:
            null,


        // ----------------------------------------------------
        // ESTADO VISUAL
        // ----------------------------------------------------

        seleccionado:
            false
    };
}


// ============================================================
// BUSCAR CÍRCULO
// ============================================================

function buscarCirculo(
    x,
    y
) {

    for (
        let i =
            circulos.length - 1;

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
            circulo.radio + 10
        ) {

            return circulo;
        }
    }


    return null;
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

        const posicion =
            obtenerPosicion(e);


        const circulo =
            buscarCirculo(
                posicion.x,
                posicion.y
            );


        // ----------------------------------------------------
        // TOCAR EL FONDO
        // NO HACE NADA
        // ----------------------------------------------------

        if (!circulo) {

            return;
        }


        e.preventDefault();


        try {

            canvas.setPointerCapture(
                e.pointerId
            );

        } catch (error) {}


        // ----------------------------------------------------
        // EL MISMO DEDO NO PUEDE ESTAR DOS VECES
        // ----------------------------------------------------

        if (
            punteros.has(
                e.pointerId
            )
        ) {

            return;
        }


        // ----------------------------------------------------
        // UN CÍRCULO = UN DEDO
        // ----------------------------------------------------

        if (
            circulo.punteroMovimiento !==
            null
        ) {

            return;
        }


        // ----------------------------------------------------
        // REGISTRAR PUNTERO
        // ----------------------------------------------------

        punteros.set(
            e.pointerId,
            {

                id:
                    e.pointerId,

                circulo:
                    circulo
            }
        );


        circulo.punteros.add(
            e.pointerId
        );


        circulo.seleccionado =
            true;


        circulo.siendoMovido =
            true;


        circulo.punteroMovimiento =
            e.pointerId;


        circulo.offsetX =
            posicion.x -
            circulo.x;


        circulo.offsetY =
            posicion.y -
            circulo.y;


        // ----------------------------------------------------
        // REVISAR COLABORACIÓN
        // ----------------------------------------------------

        actualizarColaboracion();
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

        const datos =
            punteros.get(
                e.pointerId
            );


        if (!datos) {

            return;
        }


        const circulo =
            datos.circulo;


        if (
            circulo.punteroMovimiento !==
            e.pointerId
        ) {

            return;
        }


        const posicion =
            obtenerPosicion(e);


        // ----------------------------------------------------
        // MOVER EL CÍRCULO
        // ----------------------------------------------------

        const destinoX =
            posicion.x -
            circulo.offsetX;


        const destinoY =
            posicion.y -
            circulo.offsetY;


        circulo.x +=
            (
                destinoX -
                circulo.x
            ) *
            0.42;


        circulo.y +=
            (
                destinoY -
                circulo.y
            ) *
            0.42;


        controlarBordes(
            circulo
        );
    }
);


// ============================================================
// POINTER UP
// ============================================================

canvas.addEventListener(
    "pointerup",
    function(e) {

        terminarPuntero(
            e.pointerId
        );
    }
);


// ============================================================
// POINTER CANCEL
// ============================================================

canvas.addEventListener(
    "pointercancel",
    function(e) {

        terminarPuntero(
            e.pointerId
        );
    }
);


// ============================================================
// TERMINAR PUNTERO
// ============================================================

function terminarPuntero(
    pointerId
) {

    const datos =
        punteros.get(
            pointerId
        );


    if (!datos) {

        return;
    }


    const circulo =
        datos.circulo;


    circulo.punteros.delete(
        pointerId
    );


    if (
        circulo.punteroMovimiento ===
        pointerId
    ) {

        circulo.punteroMovimiento =
            null;


        circulo.siendoMovido =
            false;


        if (
            circulo.punteros.size ===
            0
        ) {

            circulo.seleccionado =
                false;
        }
    }


    punteros.delete(
        pointerId
    );


    try {

        canvas.releasePointerCapture(
            pointerId
        );

    } catch (_) {}


    // --------------------------------------------------------
    // AL SOLTAR UN DEDO:
    //
    // Las conexiones se actualizan.
    // --------------------------------------------------------

    actualizarColaboracion();
}


// ============================================================
// ACTUALIZAR COLABORACIÓN
// ============================================================
//
// ESTA ES LA PARTE IMPORTANTE.
//
// Antes de que aparezca el círculo 5:
//
//     tienen que estar seleccionados
//     LOS 4 CÍRCULOS.
//
// Después de que ya existe el 5:
//
//     una nueva colaboración puede hacerse
//     con 2 o más círculos.
//
// Pero solamente se genera UN círculo nuevo
// por colaboración.
//
// ============================================================

function actualizarColaboracion() {

    // --------------------------------------------------------
    // CÍRCULOS ACTUALMENTE TOCADOS
    // --------------------------------------------------------

    const seleccionados =
        circulos.filter(
            circulo =>
                circulo.punteros.size > 0
        );


    // ========================================================
    // PRIMERA COLABORACIÓN
    // ========================================================
    //
    // Para crear el círculo 5:
    //
    // DEBEN ESTAR LOS 4 CÍRCULOS TOCADOS.
    //
    // ========================================================

    if (
        !primeraColaboracionRealizada
    ) {

        if (
            seleccionados.length >= 4
        ) {

            // Confirmar que son exactamente
            // los 4 círculos iniciales.

            const cuatroIniciales =
                circulos.every(
                    circulo =>
                        circulo.punteros.size >
                        0
                );


            if (
                cuatroIniciales
            ) {

                // Crear una única conexión
                // que une los cuatro.

                crearConexionMultiple(
                    seleccionados
                );


                primeraColaboracionRealizada =
                    true;
            }
        }


        return;
    }


    // ========================================================
    // DESPUÉS DEL CÍRCULO 5
    // ========================================================
    //
    // Para cada grupo nuevo de 2 o más círculos
    // tocados se crea un círculo.
    //
    // Siempre solamente UNO.
    //
    // ========================================================

    if (
        seleccionados.length >= 2
    ) {

        // Buscar si ya existe una conexión
        // con exactamente estos círculos.

        const conexionExistente =
            buscarConexionPorCirculos(
                seleccionados
            );


        // Si todavía no existe,
        // crear una nueva.

        if (
            !conexionExistente
        ) {

            crearConexionMultiple(
                seleccionados
            );
        }
    }


    // ========================================================
    // ELIMINAR CONEXIONES QUE YA NO TIENEN
    // LOS DEDOS APOYADOS
    // ========================================================

    limpiarConexionesInactivas();
}


// ============================================================
// CREAR CONEXIÓN MÚLTIPLE
// ============================================================
//
// Recibe 2, 3, 4, etc. círculos.
//
// La conexión es una red entre todos ellos.
//
// Y genera UN SOLO círculo nuevo.
// ============================================================

function crearConexionMultiple(
    grupo
) {

    if (
        grupo.length < 2
    ) {

        return;
    }


    const conexion = {

        id:
            siguienteIdConexion++,

        circulos:
            [...grupo],

        hijoId:
            null
    };


    conexiones.push(
        conexion
    );


    // --------------------------------------------------------
    // Guardar referencia en cada círculo
    // --------------------------------------------------------

    for (
        const circulo
        of grupo
    ) {

        circulo.conexiones.add(
            conexion.id
        );
    }


    // --------------------------------------------------------
    // CREAR UN ÚNICO CÍRCULO
    // --------------------------------------------------------

    const nuevoCirculo =
        crearCirculoNuevo();


    nuevoCirculo.creadoPor =
        conexion.id;


    circulos.push(
        nuevoCirculo
    );


    conexion.hijoId =
        nuevoCirculo.id;
}


// ============================================================
// BUSCAR CONEXIÓN POR GRUPO
// ============================================================

function buscarConexionPorCirculos(
    grupo
) {

    for (
        const conexion
        of conexiones
    ) {

        if (
            conexion.circulos.length !==
            grupo.length
        ) {

            continue;
        }


        const mismoGrupo =
            grupo.every(
                circulo =>
                    conexion.circulos.includes(
                        circulo
                    )
            );


        if (
            mismoGrupo
        ) {

            return conexion;
        }
    }


    return null;
}


// ============================================================
// LIMPIAR CONEXIONES INACTIVAS
// ============================================================
//
// Una conexión está activa únicamente cuando
// TODOS los círculos que la forman siguen
// teniendo un dedo apoyado.
//
// Si uno se suelta:
//      → la conexión desaparece.
//
// Y su círculo hijo desaparece si no tiene
// otra conexión activa.
// ============================================================

function limpiarConexionesInactivas() {

    for (
        let i =
            conexiones.length - 1;

        i >= 0;

        i--
    ) {

        const conexion =
            conexiones[i];


        const sigueActiva =
            conexion.circulos.every(
                circulo =>
                    circulo.punteros.size >
                    0
            );


        if (
            !sigueActiva
        ) {

            eliminarConexion(
                conexion
            );
        }
    }
}


// ============================================================
// ELIMINAR CONEXIÓN
// ============================================================

function eliminarConexion(
    conexion
) {

    const index =
        conexiones.indexOf(
            conexion
        );


    if (
        index !== -1
    ) {

        conexiones.splice(
            index,
            1
        );
    }


    // --------------------------------------------------------
    // Quitar referencia de los círculos
    // --------------------------------------------------------

    for (
        const circulo
        of conexion.circulos
    ) {

        circulo.conexiones.delete(
            conexion.id
        );
    }


    // --------------------------------------------------------
    // ELIMINAR HIJO
    // --------------------------------------------------------

    if (
        conexion.hijoId !== null
    ) {

        const hijo =
            circulos.find(
                circulo =>
                    circulo.id ===
                    conexion.hijoId
            );


        if (hijo) {

            // Si el hijo no tiene otra conexión,
            // desaparece.

            if (
                hijo.conexiones.size ===
                0
            ) {

                eliminarCirculoDependiente(
                    hijo
                );
            }
        }
    }
}


// ============================================================
// ELIMINAR CÍRCULO DEPENDIENTE
// ============================================================

function eliminarCirculoDependiente(
    circulo
) {

    // --------------------------------------------------------
    // Si tiene conexiones, eliminarlas primero.
    // --------------------------------------------------------

    const conexionesDelCirculo =
        conexiones.filter(
            conexion =>
                conexion.circulos.includes(
                    circulo
                )
        );


    for (
        const conexion
        of conexionesDelCirculo
    ) {

        eliminarConexion(
            conexion
        );
    }


    // --------------------------------------------------------
    // Eliminar punteros
    // --------------------------------------------------------

    for (
        const [pointerId, datos]
        of punteros
    ) {

        if (
            datos.circulo ===
            circulo
        ) {

            punteros.delete(
                pointerId
            );
        }
    }


    // --------------------------------------------------------
    // Eliminar círculo
    // --------------------------------------------------------

    const index =
        circulos.indexOf(
            circulo
        );


    if (
        index !== -1
    ) {

        circulos.splice(
            index,
            1
        );
    }
}


// ============================================================
// CREAR CÍRCULO NUEVO
// ============================================================
//
// Cada colaboración genera solamente UNO.
//
// Aparece en otro lugar del espacio.
// ============================================================

function crearCirculoNuevo() {

    let x;
    let y;

    let intentos = 0;


    do {

        x =
            RADIO_BASE +
            Math.random() *
            (
                canvas.width -
                RADIO_BASE * 2
            );


        y =
            RADIO_BASE +
            Math.random() *
            (
                canvas.height -
                RADIO_BASE * 2
            );


        intentos++;

    } while (
        intentos < 100 &&
        estaDemasiadoCercaDeOtros(
            x,
            y,
            RADIO_BASE
        )
    );


    const color =
        colores[
            Math.floor(
                Math.random() *
                colores.length
            )
        ];


    const nuevo =
        crearCirculo(
            x,
            y,
            color
        );


    // --------------------------------------------------------
    // Movimiento inicial muy suave
    // --------------------------------------------------------

    const angulo =
        Math.random() *
        Math.PI *
        2;


    const velocidad =
        0.10 +
        Math.random() *
        0.18;


    nuevo.vx =
        Math.cos(angulo) *
        velocidad;


    nuevo.vy =
        Math.sin(angulo) *
        velocidad;


    return nuevo;
}


// ============================================================
// EVITAR CÍRCULOS DEMASIADO JUNTOS
// ============================================================

function estaDemasiadoCercaDeOtros(
    x,
    y,
    radio
) {

    for (
        const circulo
        of circulos
    ) {

        const dx =
            x -
            circulo.x;

        const dy =
            y -
            circulo.y;


        const distancia =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (
            distancia <
            radio +
            circulo.radio +
            40
        ) {

            return true;
        }
    }


    return false;
}


// ============================================================
// MOVIMIENTO
// ============================================================

function moverCirculos() {

    for (
        const circulo
        of circulos
    ) {

        // ----------------------------------------------------
        // RESPIRACIÓN
        // ----------------------------------------------------

        circulo.faseRespiracion +=
            circulo.velocidadRespiracion;


        const respiracion =
            Math.sin(
                circulo.faseRespiracion
            ) *
            circulo.amplitudRespiracion;


        circulo.respiracion =
            respiracion;


        // ----------------------------------------------------
        // MOVIMIENTO
        // ----------------------------------------------------

        if (
            !circulo.siendoMovido
        ) {

            circulo.faseMovimiento +=
                circulo.velocidadMovimiento;


            const movimientoX =
                Math.sin(
                    circulo.faseMovimiento
                ) *
                0.018;


            const movimientoY =
                Math.cos(
                    circulo.faseMovimiento *
                    0.83
                ) *
                0.018;


            circulo.vx +=
                movimientoX;


            circulo.vy +=
                movimientoY;


            // ------------------------------------------------
            // LIMITAR VELOCIDAD
            // ------------------------------------------------

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

                circulo.vx =
                    (
                        circulo.vx /
                        velocidad
                    ) *
                    VELOCIDAD_MAXIMA;


                circulo.vy =
                    (
                        circulo.vy /
                        velocidad
                    ) *
                    VELOCIDAD_MAXIMA;
            }


            circulo.x +=
                circulo.vx;


            circulo.y +=
                circulo.vy;
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

    const radio =
        circulo.radio;


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
            ) *
            0.8;
    }


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
            ) *
            0.8;
    }


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
            ) *
            0.8;
    }


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
            ) *
            0.8;
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


            const distanciaMinima =
                a.radio +
                b.radio;


            if (
                distancia === 0
            ) {

                continue;
            }


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


                const penetracion =
                    distanciaMinima -
                    distancia;


                const mitad =
                    penetracion *
                    0.5;


                // ------------------------------------------------
                // SEPARACIÓN
                // ------------------------------------------------

                if (
                    !a.siendoMovido
                ) {

                    a.x -=
                        nx *
                        mitad;

                    a.y -=
                        ny *
                        mitad;
                }


                if (
                    !b.siendoMovido
                ) {

                    b.x +=
                        nx *
                        mitad;

                    b.y +=
                        ny *
                        mitad;
                }


                // ------------------------------------------------
                // REBOTE
                // ------------------------------------------------

                const rvx =
                    b.vx -
                    a.vx;


                const rvy =
                    b.vy -
                    a.vy;


                const velocidadNormal =
                    rvx *
                    nx +
                    rvy *
                    ny;


                if (
                    velocidadNormal <
                    0
                ) {

                    const impulso =
                        -velocidadNormal *
                        FUERZA_COLISION;


                    if (
                        !a.siendoMovido
                    ) {

                        a.vx -=
                            nx *
                            impulso;

                        a.vy -=
                            ny *
                            impulso;
                    }


                    if (
                        !b.siendoMovido
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
// GRADIENTE
// ============================================================

function obtenerGradiente(
    circulo,
    radio
) {

    const grad =
        ctx.createRadialGradient(

            circulo.x -
                radio * 0.35,

            circulo.y -
                radio * 0.35,

            radio * 0.08,


            circulo.x,

            circulo.y,

            radio * 1.35
        );


    if (
        circulo.color ===
        "#D9D9D9"
    ) {

        grad.addColorStop(
            0,
            "#FFFFFF"
        );

        grad.addColorStop(
            0.45,
            "#D9D9D9"
        );

        grad.addColorStop(
            1,
            "#AEB4BA"
        );
    }


    else if (
        circulo.color ===
        "#8BB2D3"
    ) {

        grad.addColorStop(
            0,
            "#DCECF9"
        );

        grad.addColorStop(
            0.48,
            "#8BB2D3"
        );

        grad.addColorStop(
            1,
            "#527A9C"
        );
    }


    else if (
        circulo.color ===
        "#202D64"
    ) {

        grad.addColorStop(
            0,
            "#6674A5"
        );

        grad.addColorStop(
            0.50,
            "#202D64"
        );

        grad.addColorStop(
            1,
            "#10183B"
        );
    }


    else {

        grad.addColorStop(
            0,
            "#7EA7D0"
        );

        grad.addColorStop(
            0.50,
            "#2B538E"
        );

        grad.addColorStop(
            1,
            "#18355F"
        );
    }


    return grad;
}


// ============================================================
// DIBUJAR CÍRCULO
// ============================================================

function dibujarCirculo(
    circulo
) {

    const radio =
        circulo.radio +
        circulo.respiracion;


    ctx.save();


    // --------------------------------------------------------
    // SOMBRA MUY SUAVE
    // --------------------------------------------------------

    if (
        circulo.seleccionado
    ) {

        ctx.shadowColor =
            "rgba(196,206,229,0.16)";

        ctx.shadowBlur =
            6;

        ctx.shadowOffsetY =
            1;

    } else {

        ctx.shadowColor =
            "rgba(30,60,100,0.08)";

        ctx.shadowBlur =
            3;

        ctx.shadowOffsetY =
            1;
    }


    // --------------------------------------------------------
    // CÍRCULO
    // --------------------------------------------------------

    ctx.beginPath();

    ctx.arc(
        circulo.x,
        circulo.y,
        radio,
        0,
        Math.PI * 2
    );


    ctx.fillStyle =
        obtenerGradiente(
            circulo,
            radio
        );


    ctx.fill();


    ctx.shadowBlur =
        0;

    ctx.shadowOffsetY =
        0;


    // --------------------------------------------------------
    // BORDE
    // --------------------------------------------------------

    if (
        circulo.seleccionado
    ) {

        ctx.strokeStyle =
            "rgba(196,206,229,0.45)";

        ctx.lineWidth =
            1.2;

    } else {

        ctx.strokeStyle =
            "rgba(190,205,225,0.15)";

        ctx.lineWidth =
            0.7;
    }


    ctx.stroke();


    // --------------------------------------------------------
    // LUZ INTERIOR
    // --------------------------------------------------------

    const luz =
        ctx.createRadialGradient(

            circulo.x -
                radio * 0.30,

            circulo.y -
                radio * 0.30,

            0,


            circulo.x,

            circulo.y,

            radio
        );


    luz.addColorStop(
        0,
        "rgba(255,255,255,0.22)"
    );


    luz.addColorStop(
        0.35,
        "rgba(255,255,255,0.06)"
    );


    luz.addColorStop(
        0.72,
        "rgba(255,255,255,0)"
    );


    luz.addColorStop(
        1,
        "rgba(0,0,0,0.08)"
    );


    ctx.beginPath();

    ctx.arc(
        circulo.x,
        circulo.y,
        radio,
        0,
        Math.PI * 2
    );


    ctx.fillStyle =
        luz;


    ctx.fill();


    ctx.restore();
}


// ============================================================
// DIBUJAR CONEXIONES
// ============================================================
//
// Las conexiones son redes de pequeños puntos.
//
// Para 2 círculos:
//      se dibuja una telaraña entre ambos.
//
// Para 3 o 4:
//      se conectan todos entre sí.
//
// No se utiliza una línea sólida.
// ============================================================

function dibujarConexiones() {

    for (
        const conexion
        of conexiones
    ) {

        const grupo =
            conexion.circulos;


        // ----------------------------------------------------
        // CONECTAR CADA PAR
        // ----------------------------------------------------

        for (
            let i = 0;
            i < grupo.length;
            i++
        ) {

            for (
                let j = i + 1;
                j < grupo.length;
                j++
            ) {

                dibujarRedEntre(
                    grupo[i],
                    grupo[j],
                    conexion.id
                );
            }
        }
    }
}


// ============================================================
// RED ENTRE DOS CÍRCULOS
// ============================================================

function dibujarRedEntre(
    a,
    b,
    idConexion
) {

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
        distancia < 1
    ) {

        return;
    }


    const nx =
        -dy /
        distancia;


    const ny =
        dx /
        distancia;


    // --------------------------------------------------------
    // CANTIDAD DE PUNTOS
    // --------------------------------------------------------

    const cantidad =
        Math.max(
            10,
            Math.min(
                30,
                Math.floor(
                    distancia / 16
                )
            )
        );


    ctx.save();


    // --------------------------------------------------------
    // RED PRINCIPAL
    // --------------------------------------------------------

    for (
        let i = 1;
        i < cantidad;
        i++
    ) {

        const t =
            i /
            cantidad;


        // Onda suave

        const onda =
            Math.sin(
                t *
                Math.PI *
                3 +
                idConexion
            ) *
            3;


        const x =
            a.x +
            dx *
            t +
            nx *
            onda;


        const y =
            a.y +
            dy *
            t +
            ny *
            onda;


        const radioPunto =
            i % 3 === 0
                ? 2.1
                : 1.4;


        ctx.beginPath();

        ctx.arc(
            x,
            y,
            radioPunto,
            0,
            Math.PI * 2
        );


        ctx.fillStyle =
            "rgba(196,206,229,0.60)";


        ctx.fill();
    }


    // --------------------------------------------------------
    // PUNTOS SECUNDARIOS
    // --------------------------------------------------------

    for (
        let i = 2;
        i < cantidad;
        i += 3
    ) {

        const t =
            i /
            cantidad;


        const onda =
            Math.sin(
                t *
                Math.PI *
                4 +
                idConexion *
                1.7
            ) *
            7;


        const x =
            a.x +
            dx *
            t +
            nx *
            onda;


        const y =
            a.y +
            dy *
            t +
            ny *
            onda;


        ctx.beginPath();

        ctx.arc(
            x,
            y,
            1,
            0,
            Math.PI * 2
        );


        ctx.fillStyle =
            "rgba(196,206,229,0.28)";


        ctx.fill();
    }


    ctx.restore();
}


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


    // Movimiento

    moverCirculos();


    // Colisiones

    detectarColisiones();


    // Conexiones detrás de los círculos

    dibujarConexiones();


    // Círculos

    for (
        const circulo
        of circulos
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
    function() {

        ajustarCanvas();


        for (
            const circulo
            of circulos
        ) {

            controlarBordes(
                circulo
            );
        }
    }
);


// ============================================================
// INICIO
// ============================================================

ajustarCanvas();

animar();

