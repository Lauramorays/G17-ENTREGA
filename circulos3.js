// ============================================================
// COLABORACIÓN
// circulos3.js
// ============================================================
//
// COMPORTAMIENTO:
//
// - Comienzan 4 círculos.
// - Al tocar 2 círculos aparecen inmediatamente puntitos
//   rectos entre ellos para mostrar que están unidos.
// - Con solo 2 círculos NO aparece un círculo nuevo.
// - Cuando los 4 círculos iniciales están tocados
//   simultáneamente con 4 dedos, aparece el círculo #5.
// - La conexión inicial se mantiene mientras los 4 dedos
//   estén apoyados.
// - Después del primer grupo, las conexiones son
//   independientes de a dos círculos.
// - Para crear un nuevo círculo debe participar el círculo
//   más nuevo + otro círculo disponible.
// - Solo aparece UN círculo nuevo por colaboración.
// - No se crean conexiones duplicadas.
// - Si se pierde una conexión, desaparece SU círculo hijo.
// - Si se pierden dos conexiones, desaparecen dos hijos.
// - NO se eliminan automáticamente los descendientes.
// - Los 4 círculos iniciales nunca desaparecen.
//
// ESTÉTICA:
//
// - Movimiento orgánico.
// - Respiración.
// - Colisiones.
// - Gradientes.
// - Líneas formadas por pequeños puntos.
// - Los puntos de conexión son rectos.
// - Los círculos nuevos aparecen creciendo.
// - Los círculos que pierden su conexión desaparecen
//   achicándose progresivamente.
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

const RADIO_BASE = 55;

const VELOCIDAD_MAXIMA = 0.38;
const FUERZA_COLISION = 0.45;

const AMPLITUD_RESPIRACION_MIN = 1.2;
const AMPLITUD_RESPIRACION_MAX = 2.8;


// ============================================================
// ANIMACIÓN DE APARICIÓN / DESAPARICIÓN
// ============================================================

const ESCALA_INICIAL =
    0.08;

const VELOCIDAD_APARICION =
    0.055;

const VELOCIDAD_DESAPARICION =
    0.045;


// ============================================================
// VARIABLES
// ============================================================

let circulos = [];

const punteros = new Map();

let conexiones = [];

let siguienteIdConexion = 1;
let siguienteIdCirculo = 1;

let primeraColaboracionRealizada = false;


// ============================================================
// POSICIONES INICIALES
// ============================================================

const posicionesIniciales = [
    [0.25, 0.30],
    [0.75, 0.30],
    [0.25, 0.70],
    [0.75, 0.70]
];


// ============================================================
// AJUSTAR CANVAS
// ============================================================

function ajustarCanvas() {

    const rect =
        canvas.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;
}


// ============================================================
// CREAR CÍRCULO
// ============================================================

function crearCirculo(
    x,
    y,
    color,
    esInicial = false
) {

    const circulo = {

        id:
            siguienteIdCirculo++,

        x,
        y,

        radio:
            RADIO_BASE,

        radioOriginal:
            RADIO_BASE,

        color,

        vx:
            (Math.random() - 0.5) *
            0.18,

        vy:
            (Math.random() - 0.5) *
            0.18,


        // ----------------------------------------------------
        // MOVIMIENTO ORGÁNICO
        // ----------------------------------------------------

        faseMovimiento:
            Math.random() *
            Math.PI *
            2,

        velocidadMovimiento:
            0.006 +
            Math.random() *
            0.004,


        // ----------------------------------------------------
        // RESPIRACIÓN
        // ----------------------------------------------------

        faseRespiracion:
            Math.random() *
            Math.PI *
            2,

        velocidadRespiracion:
            0.008 +
            Math.random() *
            0.006,

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

        siendoMovido: false,

        punteroMovimiento: null,

        offsetX: 0,
        offsetY: 0,

        punteros:
            new Set(),

        conexiones:
            new Set(),

        seleccionado:
            false,


        // ----------------------------------------------------
        // COLABORACIÓN
        // ----------------------------------------------------

        creadoPor:
            null,

        esInicial,


        // ----------------------------------------------------
        // ANIMACIÓN
        // ----------------------------------------------------

        // Los iniciales aparecen directamente
        // a tamaño completo.
        escala:
            esInicial
                ? 1
                : ESCALA_INICIAL,

        eliminando:
            false
    };


    circulos.push(
        circulo
    );


    return circulo;
}


// ============================================================
// INICIAR CÍRCULOS
// ============================================================

function iniciarCirculos() {

    circulos = [];

    conexiones = [];

    punteros.clear();

    siguienteIdCirculo = 1;
    siguienteIdConexion = 1;

    primeraColaboracionRealizada =
        false;


    for (
        let i = 0;
        i < posicionesIniciales.length;
        i++
    ) {

        const [px, py] =
            posicionesIniciales[i];


        crearCirculo(

            canvas.width * px,

            canvas.height * py,

            colores[
                i %
                colores.length
            ],

            true
        );
    }
}


// ============================================================
// OBTENER RADIO REAL
// ============================================================

function obtenerRadioReal(
    circulo
) {

    return (
        circulo.radio +
        circulo.respiracion
    ) *
    circulo.escala;
}


// ============================================================
// ACTUALIZAR ANIMACIÓN DE ESCALA
// ============================================================

function actualizarEscala(
    circulo
) {

    // ========================================================
    // APARICIÓN
    // ========================================================

    if (
        !circulo.eliminando
    ) {

        if (
            circulo.escala < 1
        ) {

            circulo.escala +=
                VELOCIDAD_APARICION;


            if (
                circulo.escala >= 1
            ) {

                circulo.escala = 1;
            }
        }

        return;
    }


    // ========================================================
    // DESAPARICIÓN
    // ========================================================

    circulo.escala -=
        VELOCIDAD_DESAPARICION;


    if (
        circulo.escala < 0
    ) {

        circulo.escala = 0;
    }
}


// ============================================================
// BUSCAR CÍRCULO
// ============================================================

function encontrarCirculo(
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


        if (
            circulo.eliminando
        ) {

            continue;
        }


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


        const radioReal =
            obtenerRadioReal(
                circulo
            ) +
            8;


        if (
            distancia <=
            radioReal
        ) {

            return circulo;
        }
    }


    return null;
}


// ============================================================
// POINTER DOWN
// ============================================================

canvas.addEventListener(
    "pointerdown",
    function(e) {

        const posicion =
            obtenerPosicionPuntero(e);


        const circulo =
            encontrarCirculo(
                posicion.x,
                posicion.y
            );


        if (!circulo) {
            return;
        }


        e.preventDefault();


        try {

            canvas.setPointerCapture(
                e.pointerId
            );

        } catch (_) {}


        // ----------------------------------------------------
        // Un puntero por círculo
        // ----------------------------------------------------

        if (
            circulo.punteroMovimiento !==
            null
        ) {

            return;
        }


        // ----------------------------------------------------
        // Registrar puntero
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


        circulo.punteroMovimiento =
            e.pointerId;


        circulo.siendoMovido =
            true;


        circulo.seleccionado =
            true;


        circulo.offsetX =
            posicion.x -
            circulo.x;


        circulo.offsetY =
            posicion.y -
            circulo.y;


        // ----------------------------------------------------
        // Actualizar conexiones inmediatamente
        // ----------------------------------------------------

        actualizarColaboracion();

    }
);


// ============================================================
// POINTER MOVE
// ============================================================

canvas.addEventListener(
    "pointermove",
    function(e) {

        const dato =
            punteros.get(
                e.pointerId
            );


        if (!dato) {
            return;
        }


        const circulo =
            dato.circulo;


        if (
            !circulo ||
            circulo.punteroMovimiento !==
            e.pointerId
        ) {

            return;
        }


        e.preventDefault();


        const posicion =
            obtenerPosicionPuntero(e);


        // ----------------------------------------------------
        // Movimiento suave
        // ----------------------------------------------------

        circulo.x +=
            (
                posicion.x -
                circulo.offsetX -
                circulo.x
            ) * 0.42;


        circulo.y +=
            (
                posicion.y -
                circulo.offsetY -
                circulo.y
            ) * 0.42;


        controlarBordes(
            circulo
        );


        // ----------------------------------------------------
        // Actualizar conexiones
        // ----------------------------------------------------

        actualizarColaboracion();

    }
);


// ============================================================
// POINTER UP
// ============================================================

canvas.addEventListener(
    "pointerup",
    terminarPuntero
);


canvas.addEventListener(
    "pointercancel",
    terminarPuntero
);


// ============================================================
// TERMINAR PUNTERO
// ============================================================

function terminarPuntero(e) {

    const dato =
        punteros.get(
            e.pointerId
        );


    if (!dato) {
        return;
    }


    const circulo =
        dato.circulo;


    punteros.delete(
        e.pointerId
    );


    if (circulo) {

        circulo.punteros.delete(
            e.pointerId
        );


        if (
            circulo.punteroMovimiento ===
            e.pointerId
        ) {

            circulo.punteroMovimiento =
                null;

            circulo.siendoMovido =
                false;
        }


        circulo.seleccionado =
            circulo.punteros.size >
            0;
    }


    try {

        canvas.releasePointerCapture(
            e.pointerId
        );

    } catch (_) {}


    // --------------------------------------------------------
    // Comprobar conexiones
    // --------------------------------------------------------

    actualizarColaboracion();
}


// ============================================================
// OBTENER POSICIÓN DEL PUNTERO
// ============================================================

function obtenerPosicionPuntero(e) {

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
// BUSCAR CONEXIÓN ENTRE DOS CÍRCULOS
// ============================================================

function buscarConexionEntre(
    a,
    b
) {

    return conexiones.find(
        conexion => {

            if (
                conexion.tipo !==
                "par"
            ) {

                return false;
            }


            const tieneA =
                conexion.circulos.includes(
                    a.id
                );


            const tieneB =
                conexion.circulos.includes(
                    b.id
                );


            return tieneA && tieneB;
        }
    );
}


// ============================================================
// BUSCAR CONEXIÓN INICIAL
// ============================================================

function buscarConexionInicial() {

    return conexiones.find(
        conexion =>
            conexion.tipo ===
            "inicial"
    );
}


// ============================================================
// OBTENER CÍRCULOS INICIALES SELECCIONADOS
// ============================================================

function obtenerInicialesSeleccionados() {

    return circulos.filter(
        circulo =>
            circulo.esInicial &&
            circulo.punteros.size > 0
    );
}


// ============================================================
// DIBUJAR PREVISUALIZACIÓN DE CONEXIONES
// ============================================================

function dibujarConexionesPrevias() {

    if (
        primeraColaboracionRealizada
    ) {

        return;
    }


    const seleccionados =
        obtenerInicialesSeleccionados();


    if (
        seleccionados.length < 2
    ) {

        return;
    }


    for (
        let i = 0;
        i < seleccionados.length;
        i++
    ) {

        for (
            let j = i + 1;
            j < seleccionados.length;
            j++
        ) {

            dibujarConexionPunteada(

                seleccionados[i],

                seleccionados[j]
            );
        }
    }
}


// ============================================================
// CREAR CONEXIÓN INICIAL
// ============================================================

function crearConexionInicial(
    iniciales
) {

    if (
        buscarConexionInicial()
    ) {

        return;
    }


    // --------------------------------------------------------
    // CREAR EL CÍRCULO #5
    // --------------------------------------------------------

    const nuevoCirculo =
        crearCirculo(

            canvas.width * 0.5,

            canvas.height * 0.5,

            colores[
                circulos.length %
                colores.length
            ],

            false
        );


    nuevoCirculo.creadoPor =
        iniciales.map(
            c => c.id
        );


    // --------------------------------------------------------
    // Crear conexión inicial
    // --------------------------------------------------------

    const conexion = {

        id:
            siguienteIdConexion++,

        tipo:
            "inicial",

        circulos:
            iniciales.map(
                c => c.id
            ),

        hijoId:
            nuevoCirculo.id
    };


    conexiones.push(
        conexion
    );


    iniciales.forEach(
        circulo => {

            circulo.conexiones.add(
                conexion.id
            );
        }
    );


    primeraColaboracionRealizada =
        true;
}


// ============================================================
// CREAR CONEXIÓN ENTRE DOS CÍRCULOS
// ============================================================

function crearConexionPar(
    a,
    b
) {

    if (!a || !b) {
        return;
    }


    if (
        a.id === b.id
    ) {

        return;
    }


    // --------------------------------------------------------
    // No duplicar conexiones
    // --------------------------------------------------------

    if (
        buscarConexionEntre(
            a,
            b
        )
    ) {

        return;
    }


    // --------------------------------------------------------
    // Crear nuevo círculo
    // --------------------------------------------------------

    const nuevoCirculo =
        crearCirculo(

            (a.x + b.x) / 2,

            (a.y + b.y) / 2,

            colores[
                circulos.length %
                colores.length
            ],

            false
        );


    nuevoCirculo.creadoPor =
        [
            a.id,
            b.id
        ];


    // --------------------------------------------------------
    // Crear conexión
    // --------------------------------------------------------

    const conexion = {

        id:
            siguienteIdConexion++,

        tipo:
            "par",

        circulos: [
            a.id,
            b.id
        ],

        hijoId:
            nuevoCirculo.id
    };


    conexiones.push(
        conexion
    );


    a.conexiones.add(
        conexion.id
    );


    b.conexiones.add(
        conexion.id
    );
}


// ============================================================
// OBTENER CÍRCULO MÁS NUEVO
// ============================================================

function obtenerCirculoMasNuevo() {

    let masNuevo = null;


    for (
        const circulo of circulos
    ) {

        if (
            circulo.esInicial ||
            circulo.eliminando
        ) {

            continue;
        }


        if (
            !masNuevo ||
            circulo.id >
            masNuevo.id
        ) {

            masNuevo =
                circulo;
        }
    }


    return masNuevo;
}


// ============================================================
// ACTUALIZAR COLABORACIÓN
// ============================================================

function actualizarColaboracion() {

    // --------------------------------------------------------
    // Primero revisar conexiones perdidas
    // --------------------------------------------------------

    limpiarConexionesInactivas();


    const seleccionados =
        circulos.filter(
            circulo =>
                !circulo.eliminando &&
                circulo.punteros.size > 0
        );


    // ========================================================
    // PRIMERA COLABORACIÓN
    // ========================================================

    if (
        !primeraColaboracionRealizada
    ) {

        const iniciales =
            circulos.filter(
                circulo =>
                    circulo.esInicial
            );


        const todosIniciales =
            iniciales.length === 4 &&
            iniciales.every(
                circulo =>
                    circulo.punteros.size >
                    0
            );


        if (
            todosIniciales
        ) {

            crearConexionInicial(
                iniciales
            );
        }


        return;
    }


    // ========================================================
    // DESPUÉS DE LA PRIMERA COLABORACIÓN
    // ========================================================

    const masNuevo =
        obtenerCirculoMasNuevo();


    if (!masNuevo) {
        return;
    }


    // --------------------------------------------------------
    // El círculo más nuevo debe participar
    // --------------------------------------------------------

    if (
        masNuevo.punteros.size === 0
    ) {

        return;
    }


    // --------------------------------------------------------
    // Buscar UN círculo adicional
    // --------------------------------------------------------

    const otro =
        seleccionados.find(
            circulo =>
                circulo.id !==
                masNuevo.id
        );


    if (!otro) {
        return;
    }


    // --------------------------------------------------------
    // No duplicar
    // --------------------------------------------------------

    if (
        buscarConexionEntre(
            masNuevo,
            otro
        )
    ) {

        return;
    }


    // --------------------------------------------------------
    // Crear solamente UN círculo
    // --------------------------------------------------------

    crearConexionPar(
        masNuevo,
        otro
    );
}


// ============================================================
// LIMPIAR CONEXIONES INACTIVAS
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


        // ====================================================
        // CONEXIÓN INICIAL
        // ====================================================

        if (
            conexion.tipo ===
            "inicial"
        ) {

            const activa =
                conexion.circulos.every(
                    id => {

                        const circulo =
                            circulos.find(
                                c =>
                                    c.id ===
                                    id
                            );


                        return (
                            circulo &&
                            circulo.punteros.size >
                            0
                        );
                    }
                );


            if (!activa) {

                eliminarConexion(
                    conexion
                );
            }


            continue;
        }


        // ====================================================
        // CONEXIÓN DE DOS
        // ====================================================

        if (
            conexion.tipo ===
            "par"
        ) {

            const activa =
                conexion.circulos.every(
                    id => {

                        const circulo =
                            circulos.find(
                                c =>
                                    c.id ===
                                    id
                            );


                        return (
                            circulo &&
                            circulo.punteros.size >
                            0
                        );
                    }
                );


            if (!activa) {

                eliminarConexion(
                    conexion
                );
            }
        }
    }
}


// ============================================================
// ELIMINAR CONEXIÓN
// ============================================================

function eliminarConexion(
    conexion
) {

    const indice =
        conexiones.indexOf(
            conexion
        );


    if (
        indice === -1
    ) {

        return;
    }


    // --------------------------------------------------------
    // Sacar conexión de la lista
    // --------------------------------------------------------

    conexiones.splice(
        indice,
        1
    );


    // --------------------------------------------------------
    // Sacar referencias de los círculos
    // --------------------------------------------------------

    conexion.circulos.forEach(
        id => {

            const circulo =
                circulos.find(
                    c =>
                        c.id === id
                );


            if (circulo) {

                circulo.conexiones.delete(
                    conexion.id
                );
            }
        }
    );


    // --------------------------------------------------------
    // Buscar hijo
    // --------------------------------------------------------

    const hijo =
        circulos.find(
            c =>
                c.id ===
                conexion.hijoId
        );


    if (!hijo) {

        comprobarReinicioInicial();

        return;
    }


    // ========================================================
    // LOS 4 INICIALES NUNCA SE BORRAN
    // ========================================================

    if (
        hijo.esInicial
    ) {

        comprobarReinicioInicial();

        return;
    }


    // --------------------------------------------------------
    // IMPORTANTE:
    //
    // El hijo NO se elimina instantáneamente.
    // Comienza una animación de desaparición.
    //
    // Sus descendientes permanecen.
    // --------------------------------------------------------

    iniciarDesaparicion(
        hijo
    );


    comprobarReinicioInicial();
}


// ============================================================
// INICIAR DESAPARICIÓN
// ============================================================

function iniciarDesaparicion(
    circulo
) {

    if (!circulo) {
        return;
    }


    if (
        circulo.esInicial
    ) {

        return;
    }


    // Si ya está desapareciendo,
    // no volver a iniciar la animación.
    if (
        circulo.eliminando
    ) {

        return;
    }


    circulo.eliminando =
        true;


    circulo.seleccionado =
        false;


    circulo.siendoMovido =
        false;


    circulo.punteroMovimiento =
        null;


    // --------------------------------------------------------
    // Quitar punteros
    // --------------------------------------------------------

    circulo.punteros.forEach(
        pointerId => {

            punteros.delete(
                pointerId
            );
        }
    );


    circulo.punteros.clear();


    // --------------------------------------------------------
    // La escala empieza desde donde estaba.
    // No vuelve a crecer antes de desaparecer.
    // --------------------------------------------------------

    if (
        circulo.escala <= 0
    ) {

        circulo.escala = 1;
    }
}


// ============================================================
// ELIMINAR CÍRCULO DIRECTAMENTE
// ============================================================
//
// Esta función solamente se utiliza para retirar
// definitivamente un círculo cuando ya terminó
// su animación de desaparición.
//
// NO elimina descendientes.
// ============================================================

function eliminarCirculoDirecto(
    circulo
) {

    if (!circulo) {
        return;
    }


    if (
        circulo.esInicial
    ) {

        return;
    }


    // --------------------------------------------------------
    // Quitar punteros
    // --------------------------------------------------------

    circulo.punteros.forEach(
        pointerId => {

            punteros.delete(
                pointerId
            );
        }
    );


    circulo.punteros.clear();


    circulo.punteroMovimiento =
        null;


    circulo.siendoMovido =
        false;


    circulo.seleccionado =
        false;


    // ========================================================
    // QUITAR CONEXIONES DEL CÍRCULO
    //
    // PERO NO ELIMINAR SUS HIJOS.
    // ========================================================

    const conexionesDelCirculo =
        conexiones.filter(
            conexion =>
                conexion.circulos.includes(
                    circulo.id
                )
        );


    conexionesDelCirculo.forEach(
        conexion => {

            const indice =
                conexiones.indexOf(
                    conexion
                );


            if (
                indice !== -1
            ) {

                conexiones.splice(
                    indice,
                    1
                );
            }


            conexion.circulos.forEach(
                id => {

                    const otro =
                        circulos.find(
                            c =>
                                c.id ===
                                id
                        );


                    if (otro) {

                        otro.conexiones.delete(
                            conexion.id
                        );
                    }
                }
            );


            // NO tocamos conexion.hijoId.
            // Los descendientes permanecen.
        }
    );


    // ========================================================
    // QUITAR CÍRCULO
    // ========================================================

    const indiceCirculo =
        circulos.indexOf(
            circulo
        );


    if (
        indiceCirculo !== -1
    ) {

        circulos.splice(
            indiceCirculo,
            1
        );
    }
}


// ============================================================
// ACTUALIZAR CÍRCULOS QUE ESTÁN DESAPARECIENDO
// ============================================================

function actualizarDesapariciones() {

    for (
        let i =
            circulos.length - 1;
        i >= 0;
        i--
    ) {

        const circulo =
            circulos[i];


        if (
            !circulo.eliminando
        ) {

            continue;
        }


        // ----------------------------------------------------
        // Si terminó de achicarse,
        // ahora sí se elimina.
        // ----------------------------------------------------

        if (
            circulo.escala <= 0
        ) {

            eliminarCirculoDirecto(
                circulo
            );
        }
    }
}


// ============================================================
// COMPROBAR REINICIO DE PRIMERA COLABORACIÓN
// ============================================================

function comprobarReinicioInicial() {

    const quedanGenerados =
        circulos.some(
            circulo =>
                !circulo.esInicial &&
                !circulo.eliminando
        );


    // --------------------------------------------------------
    // Si no queda ningún círculo generado,
    // vuelve al estado inicial.
    // --------------------------------------------------------

    if (
        !quedanGenerados
    ) {

        primeraColaboracionRealizada =
            false;
    }
}


// ============================================================
// CONTROLAR BORDES
// ============================================================

function controlarBordes(
    circulo
) {

    const radio =
        obtenerRadioReal(
            circulo
        );


    if (
        circulo.x - radio < 0
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
        circulo.x + radio >
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
        circulo.y - radio < 0
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
        circulo.y + radio >
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
// ACTUALIZAR MOVIMIENTO
// ============================================================

function actualizarCirculo(
    circulo
) {

    // ========================================================
    // ANIMACIÓN DE APARICIÓN / DESAPARICIÓN
    // ========================================================

    actualizarEscala(
        circulo
    );


    // ========================================================
    // RESPIRACIÓN
    // ========================================================

    circulo.faseRespiracion +=
        circulo.velocidadRespiracion;


    const respiracion =
        Math.sin(
            circulo.faseRespiracion
        ) *
        circulo.amplitudRespiracion;


    circulo.respiracion =
        respiracion;


    // ========================================================
    // MOVIMIENTO ORGÁNICO
    // ========================================================

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


// ============================================================
// COLISIONES
// ============================================================

function resolverColisiones() {

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


            // ------------------------------------------------
            // Los que están desapareciendo
            // no interfieren físicamente.
            // ------------------------------------------------

            if (
                a.eliminando ||
                b.eliminando
            ) {

                continue;
            }


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
                obtenerRadioReal(
                    a
                );


            const radioB =
                obtenerRadioReal(
                    b
                );


            const distanciaMinima =
                radioA +
                radioB;


            if (
                distancia <
                distanciaMinima
            ) {

                let nx;
                let ny;


                if (
                    distancia === 0
                ) {

                    nx = 1;
                    ny = 0;

                } else {

                    nx =
                        dx /
                        distancia;

                    ny =
                        dy /
                        distancia;
                }


                const penetracion =
                    distanciaMinima -
                    distancia;


                const mitad =
                    penetracion *
                    0.5;


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


                const velocidadRelativa =
                    (
                        b.vx -
                        a.vx
                    ) *
                    nx +

                    (
                        b.vy -
                        a.vy
                    ) *
                    ny;


                if (
                    velocidadRelativa <
                    0
                ) {

                    const impulso =
                        -velocidadRelativa *
                        FUERZA_COLISION;


                    if (
                        !a.siendoMovido
                    ) {

                        a.vx -=
                            nx *
                            impulso *
                            0.5;

                        a.vy -=
                            ny *
                            impulso *
                            0.5;
                    }


                    if (
                        !b.siendoMovido
                    ) {

                        b.vx +=
                            nx *
                            impulso *
                            0.5;

                        b.vy +=
                            ny *
                            impulso *
                            0.5;
                    }
                }
            }
        }
    }
}


// ============================================================
// OBTENER GRADIENTE
// ============================================================

function obtenerGradiente(
    circulo,
    radio
) {

    const gradient =
        ctx.createRadialGradient(

            circulo.x -
                radio * 0.35,

            circulo.y -
                radio * 0.35,

            radio * 0.08,

            circulo.x,

            circulo.y,

            radio * 1.1
        );


    if (
        circulo.color ===
        "#D9D9D9"
    ) {

        gradient.addColorStop(
            0,
            "#FFFFFF"
        );


        gradient.addColorStop(
            0.45,
            "#D9D9D9"
        );


        gradient.addColorStop(
            1,
            "#AEB4BA"
        );

    } else if (
        circulo.color ===
        "#8BB2D3"
    ) {

        gradient.addColorStop(
            0,
            "#DCECF9"
        );


        gradient.addColorStop(
            0.48,
            "#8BB2D3"
        );


        gradient.addColorStop(
            1,
            "#527A9C"
        );

    } else if (
        circulo.color ===
        "#202D64"
    ) {

        gradient.addColorStop(
            0,
            "#6674A5"
        );


        gradient.addColorStop(
            0.50,
            "#202D64"
        );


        gradient.addColorStop(
            1,
            "#10183B"
        );

    } else {

        gradient.addColorStop(
            0,
            "#7EA7D0"
        );


        gradient.addColorStop(
            0.50,
            "#2B538E"
        );


        gradient.addColorStop(
            1,
            "#18355F"
        );
    }


    return gradient;
}


// ============================================================
// DIBUJAR CONEXIÓN DE PUNTITOS
// ============================================================

function dibujarConexionPunteada(
    circuloA,
    circuloB
) {

    if (
        !circuloA ||
        !circuloB
    ) {

        return;
    }


    const dx =
        circuloB.x -
        circuloA.x;


    const dy =
        circuloB.y -
        circuloA.y;


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


    const ux =
        dx /
        distancia;


    const uy =
        dy /
        distancia;


    const radioA =
        obtenerRadioReal(
            circuloA
        );


    const radioB =
        obtenerRadioReal(
            circuloB
        );


    const inicioX =
        circuloA.x +
        ux * radioA;


    const inicioY =
        circuloA.y +
        uy * radioA;


    const finalX =
        circuloB.x -
        ux * radioB;


    const finalY =
        circuloB.y -
        uy * radioB;


    const distanciaInterior =
        Math.sqrt(
            (
                finalX -
                inicioX
            ) *
            (
                finalX -
                inicioX
            ) +

            (
                finalY -
                inicioY
            ) *
            (
                finalY -
                inicioY
            )
        );


    if (
        distanciaInterior <= 0
    ) {

        return;
    }


    const separacion = 10;


    const cantidad =
        Math.max(
            2,
            Math.floor(
                distanciaInterior /
                separacion
            )
        );


    // ========================================================
    // PUNTOS PRINCIPALES
    // ========================================================

    for (
        let i = 0;
        i <= cantidad;
        i++
    ) {

        const t =
            i /
            cantidad;


        const x =
            inicioX +
            (
                finalX -
                inicioX
            ) *
            t;


        const y =
            inicioY +
            (
                finalY -
                inicioY
            ) *
            t;


        ctx.beginPath();


        ctx.arc(
            x,
            y,
            2.1,
            0,
            Math.PI * 2
        );


        ctx.fillStyle =
            "rgba(196,206,229,0.60)";


        ctx.fill();
    }


    // ========================================================
    // PUNTOS SECUNDARIOS
    // ========================================================

    for (
        let i = 1;
        i < cantidad;
        i += 3
    ) {

        const t =
            i /
            cantidad;


        const x =
            inicioX +
            (
                finalX -
                inicioX
            ) *
            t;


        const y =
            inicioY +
            (
                finalY -
                inicioY
            ) *
            t;


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
}


// ============================================================
// DIBUJAR TODAS LAS CONEXIONES
// ============================================================

function dibujarConexiones() {

    dibujarConexionesPrevias();


    conexiones.forEach(
        conexion => {

            // =================================================
            // CONEXIÓN INICIAL
            // =================================================

            if (
                conexion.tipo ===
                "inicial"
            ) {

                const grupo =
                    conexion.circulos
                        .map(
                            id =>
                                circulos.find(
                                    c =>
                                        c.id ===
                                        id
                                )
                        )
                        .filter(Boolean);


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

                        dibujarConexionPunteada(

                            grupo[i],

                            grupo[j]
                        );
                    }
                }


                return;
            }


            // =================================================
            // CONEXIÓN DE DOS
            // =================================================

            if (
                conexion.tipo ===
                "par"
            ) {

                const a =
                    circulos.find(
                        c =>
                            c.id ===
                            conexion.circulos[0]
                    );


                const b =
                    circulos.find(
                        c =>
                            c.id ===
                            conexion.circulos[1]
                    );


                if (
                    a &&
                    b
                ) {

                    dibujarConexionPunteada(
                        a,
                        b
                    );
                }
            }
        }
    );
}


// ============================================================
// DIBUJAR CÍRCULO
// ============================================================

function dibujarCirculo(
    circulo
) {

    // ========================================================
    // RADIO CON ANIMACIÓN
    // ========================================================

    const radio =
        obtenerRadioReal(
            circulo
        );


    // ========================================================
    // SOMBRA
    // ========================================================

    if (
        circulo.seleccionado
    ) {

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


    // ========================================================
    // CÍRCULO PRINCIPAL
    // ========================================================

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


    // --------------------------------------------------------
    // Quitar sombra
    // --------------------------------------------------------

    ctx.shadowColor =
        "transparent";


    ctx.shadowBlur = 0;


    ctx.shadowOffsetY = 0;


    // ========================================================
    // BORDE
    // ========================================================

    ctx.beginPath();


    ctx.arc(
        circulo.x,
        circulo.y,
        radio,
        0,
        Math.PI * 2
    );


    if (
        circulo.seleccionado
    ) {

        ctx.strokeStyle =
            "rgba(196,206,229,0.45)";


        ctx.lineWidth = 1.2;

    } else {

        ctx.strokeStyle =
            "rgba(190,205,225,0.15)";


        ctx.lineWidth = 0.7;
    }


    ctx.stroke();


    // ========================================================
    // LUZ INTERIOR
    // ========================================================

    const interior =
        ctx.createRadialGradient(

            circulo.x -
                radio * 0.35,

            circulo.y -
                radio * 0.35,

            radio * 0.05,

            circulo.x,

            circulo.y,

            radio
        );


    interior.addColorStop(
        0,
        "rgba(255,255,255,0.22)"
    );


    interior.addColorStop(
        0.32,
        "rgba(255,255,255,0.06)"
    );


    interior.addColorStop(
        0.68,
        "rgba(255,255,255,0)"
    );


    interior.addColorStop(
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
        interior;


    ctx.fill();
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


    // --------------------------------------------------------
    // Movimiento, respiración y aparición/desaparición
    // --------------------------------------------------------

    circulos.forEach(
        circulo => {

            actualizarCirculo(
                circulo
            );
        }
    );


    // --------------------------------------------------------
    // Colisiones
    // --------------------------------------------------------

    resolverColisiones();


    // --------------------------------------------------------
    // Conexiones
    // --------------------------------------------------------

    dibujarConexiones();


    // --------------------------------------------------------
    // Círculos
    // --------------------------------------------------------

    circulos.forEach(
        circulo => {

            // Si está completamente desaparecido
            // no se dibuja.
            if (
                circulo.escala <= 0
            ) {

                return;
            }


            dibujarCirculo(
                circulo
            );
        }
    );


    // --------------------------------------------------------
    // Eliminar definitivamente los que terminaron
    // su animación de desaparición.
    // --------------------------------------------------------

    actualizarDesapariciones();


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


        circulos.forEach(
            circulo => {

                controlarBordes(
                    circulo
                );
            }
        );
    }
);


// ============================================================
// INICIO
// ============================================================

ajustarCanvas();

iniciarCirculos();

animar();