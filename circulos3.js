
// ============================================================
// COLABORACIÓN
// circulos3.js
// ============================================================
//
// INTERACCIÓN:
//
// - Comienzan 4 círculos.
// - Los círculos se mueven lentamente y respiran.
// - 1 dedo sobre un círculo:
//      → permite moverlo.
//
// - 2 dedos sobre 2 círculos diferentes:
//      → los dos círculos quedan conectados.
//      → la conexión aparece como pequeños círculos,
//        formando una especie de telaraña.
//      → la conexión aparece inmediatamente.
//
// - Mientras los dos dedos permanezcan apoyados:
//      → la conexión permanece visible.
//
// - Al realizar una conexión:
//      → aparece un nuevo círculo en otro lugar del espacio.
//
// - El nuevo círculo queda libre.
// - Para utilizarlo hay que tocarlo con otro dedo.
//
// - Si se levanta uno de los dedos:
//      → la conexión se pierde.
//      → el círculo creado por esa conexión desaparece
//        si no pertenece a otra conexión activa.
//
// - Se pueden crear nuevas conexiones sucesivamente.
//
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

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.style.touchAction = "none";


// ============================================================
// VARIABLES
// ============================================================

let circulos = [];


// Cada dedo/puntero tiene:
// {
//     id,
//     circulo
// }

const punteros = new Map();


// Conexiones activas:
//
// {
//     id,
//     circuloA,
//     circuloB,
//     hijoId
// }

const conexiones = [];

let siguienteIdConexion = 1;
let siguienteIdCirculo = 1;


// ============================================================
// POSICIONES INICIALES
// IGUALES A IDENTIDAD
// ============================================================

const posicionesIniciales = [
    { x: 0.25, y: 0.30 },
    { x: 0.75, y: 0.30 },
    { x: 0.25, y: 0.70 },
    { x: 0.75, y: 0.70 }
];


// ============================================================
// AJUSTAR CANVAS
// ============================================================

function ajustarCanvas() {

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    if (circulos.length === 0) {
        crearCirculosIniciales();
    }
}


// ============================================================
// CREAR CÍRCULOS INICIALES
// ============================================================

function crearCirculosIniciales() {

    circulos = [];

    for (let i = 0; i < 4; i++) {

        const posicion = posicionesIniciales[i];

        const angulo = Math.random() * Math.PI * 2;

        const velocidad =
            0.12 + Math.random() * VELOCIDAD_MAXIMA;

        const circulo = crearCirculo(
            canvas.width * posicion.x,
            canvas.height * posicion.y,
            colores[i % colores.length]
        );

        circulo.vx = Math.cos(angulo) * velocidad;
        circulo.vy = Math.sin(angulo) * velocidad;

        circulos.push(circulo);
    }
}


// ============================================================
// CREAR UN CÍRCULO
// ============================================================

function crearCirculo(x, y, color) {

    const circulo = {

        id: siguienteIdCirculo++,

        x,
        y,

        radio: RADIO_BASE,
        radioOriginal: RADIO_BASE,

        color,

        vx: 0,
        vy: 0,

        // Movimiento orgánico
        faseMovimiento: Math.random() * Math.PI * 2,

        velocidadMovimiento:
            0.003 + Math.random() * 0.003,

        // Respiración
        faseRespiracion:
            Math.random() * Math.PI * 2,

        velocidadRespiracion:
            0.0008 + Math.random() * 0.0008,

        amplitudRespiracion:
            AMPLITUD_RESPIRACION_MIN +
            Math.random() *
            (AMPLITUD_RESPIRACION_MAX -
             AMPLITUD_RESPIRACION_MIN),

        respiracion: 0,

        // Interacción
        siendoMovido: false,

        punteroMovimiento: null,

        offsetX: 0,
        offsetY: 0,

        // Punteros actualmente apoyados
        punteros: new Set(),

        // Conexiones
        conexiones: new Set(),

        // Si fue creado por una conexión
        creadoPor: null,

        // Si está seleccionado
        seleccionado: false
    };

    return circulo;
}


// ============================================================
// BUSCAR CÍRCULO
// ============================================================

function buscarCirculo(x, y) {

    for (let i = circulos.length - 1; i >= 0; i--) {

        const circulo = circulos[i];

        const dx = x - circulo.x;
        const dy = y - circulo.y;

        const distancia = Math.sqrt(
            dx * dx + dy * dy
        );

        if (distancia <= circulo.radio + 10) {
            return circulo;
        }
    }

    return null;
}


// ============================================================
// POSICIÓN DEL PUNTERO
// ============================================================

function obtenerPosicion(e) {

    const rect = canvas.getBoundingClientRect();

    return {

        x:
            (e.clientX - rect.left) *
            (canvas.width / rect.width),

        y:
            (e.clientY - rect.top) *
            (canvas.height / rect.height)
    };
}


// ============================================================
// POINTER DOWN
// ============================================================

canvas.addEventListener("pointerdown", function(e) {

    const posicion = obtenerPosicion(e);

    const circulo = buscarCirculo(
        posicion.x,
        posicion.y
    );

    // Si se toca el fondo no pasa absolutamente nada
    if (!circulo) {
        return;
    }

    e.preventDefault();

    try {
        canvas.setPointerCapture(e.pointerId);
    } catch (error) {}

    // Un mismo dedo no puede controlar dos círculos
    if (punteros.has(e.pointerId)) {
        return;
    }

    // Un círculo puede tener solamente un dedo
    // controlándolo directamente.
    //
    // Esto evita que dos dedos sobre el mismo círculo
    // generen una falsa colaboración.

    if (
        circulo.punteroMovimiento !== null &&
        circulo.punteroMovimiento !== e.pointerId
    ) {
        return;
    }


    // Registrar el puntero

    punteros.set(e.pointerId, {
        id: e.pointerId,
        circulo: circulo
    });

    circulo.punteros.add(e.pointerId);

    circulo.seleccionado = true;

    circulo.siendoMovido = true;

    circulo.punteroMovimiento = e.pointerId;

    circulo.offsetX =
        posicion.x - circulo.x;

    circulo.offsetY =
        posicion.y - circulo.y;


    // Revisar inmediatamente si ahora existen
    // dos círculos distintos conectados.

    actualizarConexiones();
});


// ============================================================
// POINTER MOVE
// ============================================================

canvas.addEventListener("pointermove", function(e) {

    const datos = punteros.get(e.pointerId);

    if (!datos) {
        return;
    }

    const circulo = datos.circulo;

    if (
        circulo.punteroMovimiento !==
        e.pointerId
    ) {
        return;
    }

    const posicion = obtenerPosicion(e);

    // El círculo sigue al dedo de manera suave.

    const destinoX =
        posicion.x - circulo.offsetX;

    const destinoY =
        posicion.y - circulo.offsetY;

    circulo.x +=
        (destinoX - circulo.x) * 0.42;

    circulo.y +=
        (destinoY - circulo.y) * 0.42;

    // Evitar que salga completamente del canvas

    controlarBordes(circulo);
});


// ============================================================
// POINTER UP
// ============================================================

canvas.addEventListener("pointerup", function(e) {

    terminarPuntero(e.pointerId);

});


// ============================================================
// POINTER CANCEL
// ============================================================

canvas.addEventListener("pointercancel", function(e) {

    terminarPuntero(e.pointerId);

});


// ============================================================
// TERMINAR PUNTERO
// ============================================================

function terminarPuntero(pointerId) {

    const datos = punteros.get(pointerId);

    if (!datos) {
        return;
    }

    const circulo = datos.circulo;

    circulo.punteros.delete(pointerId);

    if (
        circulo.punteroMovimiento ===
        pointerId
    ) {

        circulo.punteroMovimiento = null;

        circulo.siendoMovido = false;

        if (circulo.punteros.size === 0) {
            circulo.seleccionado = false;
        }
    }

    punteros.delete(pointerId);


    // Ahora que se soltó el dedo,
    // las conexiones se actualizan.

    actualizarConexiones();
}


// ============================================================
// ACTUALIZAR CONEXIONES
// ============================================================
//
// Una conexión existe únicamente cuando:
// - hay un dedo sobre el círculo A
// - hay otro dedo sobre el círculo B
// - A y B son diferentes
//
// No hay distancia mínima.
// No hay tiempo de espera.
// ============================================================

function actualizarConexiones() {

    const paresActuales = new Set();

    const circulosConPuntero = [];

    for (const datos of punteros.values()) {

        if (!datos.circulo) {
            continue;
        }

        if (
            !circulosConPuntero.includes(
                datos.circulo
            )
        ) {

            circulosConPuntero.push(
                datos.circulo
            );
        }
    }


    // Crear todas las conexiones posibles
    // entre círculos diferentes que tengan dedos.

    for (
        let i = 0;
        i < circulosConPuntero.length;
        i++
    ) {

        for (
            let j = i + 1;
            j < circulosConPuntero.length;
            j++
        ) {

            const circuloA =
                circulosConPuntero[i];

            const circuloB =
                circulosConPuntero[j];

            const idPar =
                crearIdPar(
                    circuloA.id,
                    circuloB.id
                );

            paresActuales.add(idPar);


            // Buscar si ya existe

            let conexion =
                conexiones.find(
                    c => c.idPar === idPar
                );


            // Si no existe, crearla

            if (!conexion) {

                conexion = {

                    id:
                        siguienteIdConexion++,

                    idPar,

                    circuloA,
                    circuloB,

                    hijoId: null
                };

                conexiones.push(conexion);

                circuloA.conexiones.add(
                    conexion.id
                );

                circuloB.conexiones.add(
                    conexion.id
                );


                // Crear inmediatamente
                // el nuevo círculo.

                const nuevoCirculo =
                    crearCirculoNuevo(
                        circuloA,
                        circuloB
                    );

                nuevoCirculo.creadoPor =
                    conexion.id;

                circulos.push(
                    nuevoCirculo
                );

                conexion.hijoId =
                    nuevoCirculo.id;
            }
        }
    }


    // Eliminar conexiones que ya no existen

    for (
        let i = conexiones.length - 1;
        i >= 0;
        i--
    ) {

        const conexion =
            conexiones[i];

        if (
            !paresActuales.has(
                conexion.idPar
            )
        ) {

            eliminarConexion(
                conexion
            );
        }
    }
}


// ============================================================
// ID ÚNICO DE PAREJA
// ============================================================

function crearIdPar(idA, idB) {

    if (idA < idB) {
        return `${idA}-${idB}`;
    }

    return `${idB}-${idA}`;
}


// ============================================================
// CREAR NUEVO CÍRCULO
// ============================================================
//
// El nuevo círculo aparece en otro lugar del espacio.
// Nunca aparece pegado a los círculos que lo generaron.
// ============================================================

function crearCirculoNuevo(
    circuloA,
    circuloB
) {

    let x;
    let y;

    let intentos = 0;

    do {

        x =
            RADIO_BASE +
            Math.random() *
            (canvas.width -
             RADIO_BASE * 2);

        y =
            RADIO_BASE +
            Math.random() *
            (canvas.height -
             RADIO_BASE * 2);

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


    const angulo =
        Math.random() *
        Math.PI *
        2;

    const velocidad =
        0.10 +
        Math.random() *
        0.22;

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

    for (const circulo of circulos) {

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
// ELIMINAR CONEXIÓN
// ============================================================

function eliminarConexion(
    conexion
) {

    const index =
        conexiones.indexOf(
            conexion
        );

    if (index !== -1) {

        conexiones.splice(
            index,
            1
        );
    }


    conexion.circuloA.conexiones.delete(
        conexion.id
    );

    conexion.circuloB.conexiones.delete(
        conexion.id
    );


    // Si la conexión tenía un círculo hijo,
    // revisar si ese círculo todavía tiene
    // alguna otra conexión activa.

    if (
        conexion.hijoId !== null
    ) {

        const hijo =
            circulos.find(
                c =>
                    c.id ===
                    conexion.hijoId
            );

        if (hijo) {

            const tieneOtraConexion =
                hijo.conexiones.size > 0;

            if (
                !tieneOtraConexion
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

    // Primero eliminar cualquier conexión
    // que todavía dependa de este círculo.

    const conexionesDelCirculo =
        conexiones.filter(
            conexion =>
                conexion.circuloA === circulo ||
                conexion.circuloB === circulo
        );

    for (
        const conexion
        of conexionesDelCirculo
    ) {

        eliminarConexion(
            conexion
        );
    }


    // Eliminar referencias de punteros

    for (
        const [pointerId, datos]
        of punteros
    ) {

        if (
            datos.circulo === circulo
        ) {

            punteros.delete(
                pointerId
            );
        }
    }


    // Finalmente eliminarlo del array

    const index =
        circulos.indexOf(
            circulo
        );

    if (index !== -1) {

        circulos.splice(
            index,
            1
        );
    }
}


// ============================================================
// MOVIMIENTO
// ============================================================

function moverCirculos() {

    const tiempo =
        performance.now();


    for (const circulo of circulos) {

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


            // Movimiento muy suave

            circulo.vx +=
                movimientoX;

            circulo.vy +=
                movimientoY;


            // Limitar velocidad

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
                    (circulo.vx /
                     velocidad) *
                    VELOCIDAD_MAXIMA;

                circulo.vy =
                    (circulo.vy /
                     velocidad) *
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
        circulo.x - radio < 0
    ) {

        circulo.x = radio;

        circulo.vx =
            Math.abs(
                circulo.vx
            ) * 0.8;
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
            ) * 0.8;
    }


    if (
        circulo.y - radio < 0
    ) {

        circulo.y = radio;

        circulo.vy =
            Math.abs(
                circulo.vy
            ) * 0.8;
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
            ) * 0.8;
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

            const a =
                circulos[i];

            const b =
                circulos[j];


            const dx =
                b.x - a.x;

            const dy =
                b.y - a.y;

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
                    dx / distancia;

                const ny =
                    dy / distancia;

                const penetracion =
                    distanciaMinima -
                    distancia;


                // Separación

                const mitad =
                    penetracion *
                    0.5;

                if (
                    !a.siendoMovido
                ) {

                    a.x -=
                        nx * mitad;

                    a.y -=
                        ny * mitad;
                }

                if (
                    !b.siendoMovido
                ) {

                    b.x +=
                        nx * mitad;

                    b.y +=
                        ny * mitad;
                }


                // Velocidades

                const rvx =
                    b.vx -
                    a.vx;

                const rvy =
                    b.vy -
                    a.vy;

                const velocidadNormal =
                    rvx * nx +
                    rvy * ny;


                if (
                    velocidadNormal < 0
                ) {

                    const impulso =
                        -velocidadNormal *
                        FUERZA_COLISION;

                    if (
                        !a.siendoMovido
                    ) {

                        a.vx -=
                            nx * impulso;

                        a.vy -=
                            ny * impulso;
                    }

                    if (
                        !b.siendoMovido
                    ) {

                        b.vx +=
                            nx * impulso;

                        b.vy +=
                            ny * impulso;
                    }
                }
            }
        }
    }
}


// ============================================================
// GRADIENTES
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

        ctx.shadowBlur = 6;

        ctx.shadowOffsetY = 1;

    } else {

        ctx.shadowColor =
            "rgba(30,60,100,0.08)";

        ctx.shadowBlur = 3;

        ctx.shadowOffsetY = 1;
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


    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;


    // --------------------------------------------------------
    // BORDE SUTIL
    // --------------------------------------------------------

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

    ctx.fillStyle = luz;

    ctx.fill();


    ctx.restore();
}


// ============================================================
// DIBUJAR CONEXIONES
// ============================================================
//
// La unión NO es una línea sólida.
//
// Se construye con pequeños círculos que siguen
// una trayectoria ligeramente ondulada,
// dando sensación de telaraña.
// ============================================================

function dibujarConexiones() {

    for (
        const conexion
        of conexiones
    ) {

        const a =
            conexion.circuloA;

        const b =
            conexion.circuloB;


        const dx =
            b.x - a.x;

        const dy =
            b.y - a.y;

        const distancia =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (
            distancia < 1
        ) {
            continue;
        }


        const nx =
            -dy / distancia;

        const ny =
            dx / distancia;


        // Cantidad de pequeños círculos

        const cantidad =
            Math.max(
                10,
                Math.min(
                    26,
                    Math.floor(
                        distancia / 18
                    )
                )
            );


        ctx.save();


        // ----------------------------------------------------
        // PEQUEÑOS PUNTOS
        // ----------------------------------------------------

        for (
            let i = 1;
            i < cantidad;
            i++
        ) {

            const t =
                i / cantidad;


            // Curva suave tipo telaraña

            const onda =
                Math.sin(
                    t * Math.PI * 3 +
                    conexion.id
                ) *
                3;


            const x =
                a.x +
                dx * t +
                nx * onda;

            const y =
                a.y +
                dy * t +
                ny * onda;


            // Alternar tamaño para que
            // parezca una red orgánica

            const radioPunto =
                i % 3 === 0
                    ? 2.2
                    : 1.45;


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


        // ----------------------------------------------------
        // SEGUNDA FILA DE PUNTOS
        // ----------------------------------------------------
        //
        // Una segunda línea muy tenue hace que la unión
        // parezca más una pequeña red/telaraña.
        // ----------------------------------------------------

        for (
            let i = 2;
            i < cantidad;
            i += 3
        ) {

            const t =
                i / cantidad;


            const onda =
                Math.sin(
                    t * Math.PI * 4 +
                    conexion.id * 1.7
                ) *
                7;


            const x =
                a.x +
                dx * t +
                nx * onda;

            const y =
                a.y +
                dy * t +
                ny * onda;


            ctx.beginPath();

            ctx.arc(
                x,
                y,
                1.0,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                "rgba(196,206,229,0.28)";

            ctx.fill();
        }


        ctx.restore();
    }
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


    moverCirculos();

    detectarColisiones();


    // Primero las conexiones,
    // para que queden visualmente detrás
    // de los círculos.

    dibujarConexiones();


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

