// ============================================================
// EXPECTATIVA
// triangulos3.js
// ============================================================
//
// INICIO:
// - 4 triángulos forman un triángulo grande.
// - La figura respira suavemente.
//
// AL TOCAR:
// - La figura se desarma LENTAMENTE.
// - Las piezas se alejan desde su posición original.
// - NO aparecen en lugares aleatorios.
//
// INTERACCIÓN:
// - 1 dedo sobre una pieza = moverla.
// - 2 dedos sobre 2 piezas diferentes = mover ambas.
// - 2 dedos sobre la misma pieza = rotarla.
//
// ARMADO:
// - Al acercar una pieza a su lugar, se encaja.
// - Con 3 piezas colocadas, la última puede:
//      * completar
//      * ser rechazada
//
// ============================================================


const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.style.touchAction = "none";


// ============================================================
// COLORES
// ============================================================

const COLORES = [
    "#202D64",
    "#2B538E",
    "#8BB2D3",
    "#D9D9D9"
];


// ============================================================
// TAMAÑO
// ============================================================

const LADO = 135;

const ALTURA =
    LADO * Math.sqrt(3) / 2;


// ============================================================
// VARIABLES DEL CANVAS
// ============================================================

let piezas = [];

let centroX = 0;
let centroY = 0;

let figuraArmada = true;

let primeraCarga = true;


// ============================================================
// ESTADO DEL DESARME
// ============================================================

let desarmando = false;

let tiempoDesarme = 0;

const DURACION_DESARME = 1100;


// ============================================================
// INTERACCIÓN MULTITOUCH
// ============================================================
//
// Cada dedo puede controlar una pieza diferente.
//
// pointerId -> pieza
//
// ============================================================

const punteros = new Map();


// ============================================================
// AZAR
// ============================================================

let resultadoAzar = 3;


// ============================================================
// CONFIGURACIÓN
// ============================================================

const DISTANCIA_ENCAJE = 60;

const AMPLITUD_RESPIRACION = 0.035;

const VELOCIDAD_RESPIRACION = 0.0025;

const FUERZA_COLISION = 0.35;


// ============================================================
// ESTILOS
// ============================================================

const ESTILOS = {

    "#202D64": {
        claro: "#6674A5",
        medio: "#202D64",
        oscuro: "#10183B",
        sombra: "rgba(32,45,100,0.35)"
    },

    "#2B538E": {
        claro: "#7EA7D0",
        medio: "#2B538E",
        oscuro: "#18355F",
        sombra: "rgba(43,83,142,0.35)"
    },

    "#8BB2D3": {
        claro: "#DCECF9",
        medio: "#8BB2D3",
        oscuro: "#527A9C",
        sombra: "rgba(139,178,211,0.25)"
    },

    "#D9D9D9": {
        claro: "#FFFFFF",
        medio: "#D9D9D9",
        oscuro: "#AEB4BA",
        sombra: "rgba(217,217,217,0.25)"
    }
};


// ============================================================
// AJUSTAR CANVAS
// ============================================================

function ajustarCanvas() {

    const rect =
        canvas.getBoundingClientRect();


    canvas.width =
        rect.width ||
        window.innerWidth * 0.95;


    canvas.height =
        rect.height ||
        window.innerHeight * 0.95;


    centroX =
        canvas.width / 2;


    centroY =
        canvas.height / 2;


    if (primeraCarga) {

        crearFigura();

        primeraCarga = false;
    }
}


// ============================================================
// CREAR FIGURA
// ============================================================

function crearFigura() {

    piezas = [];


    // ========================================================
    // VÉRTICES DEL TRIÁNGULO GRANDE
    // ========================================================

    const A = {

        x: centroX,

        y:
            centroY -
            ALTURA * 2 / 3
    };


    const B = {

        x:
            centroX -
            LADO / 2,

        y:
            centroY +
            ALTURA / 3
    };


    const C = {

        x:
            centroX +
            LADO / 2,

        y:
            centroY +
            ALTURA / 3
    };


    const D = {

        x:
            centroX -
            LADO,

        y:
            centroY +
            ALTURA * 4 / 3
    };


    const E = {

        x:
            centroX,

        y:
            centroY +
            ALTURA * 4 / 3
    };


    const F = {

        x:
            centroX +
            LADO,

        y:
            centroY +
            ALTURA * 4 / 3
    };


    // ========================================================
    // PIEZA SUPERIOR
    // ========================================================

    agregarPieza(
        0,
        {
            a: A,
            b: B,
            c: C
        },
        false
    );


    // ========================================================
    // PIEZA IZQUIERDA
    // ========================================================

    agregarPieza(
        1,
        {
            a: B,
            b: D,
            c: E
        },
        false
    );


    // ========================================================
    // PIEZA DERECHA
    // ========================================================

    agregarPieza(
        2,
        {
            a: C,
            b: E,
            c: F
        },
        false
    );


    // ========================================================
    // PIEZA CENTRAL
    // ========================================================

    agregarPieza(
        3,
        {
            a: B,
            b: C,
            c: E
        },
        true
    );


    figuraArmada = true;
}


// ============================================================
// AGREGAR PIEZA
// ============================================================

function agregarPieza(
    id,
    vertices,
    invertido
) {

    const centro =
        centroTriangulo(
            vertices.a,
            vertices.b,
            vertices.c
        );


    piezas.push({

        id: id,


        // ----------------------------------------------------
        // POSICIÓN ACTUAL
        // ----------------------------------------------------

        x: centro.x,

        y: centro.y,


        // ----------------------------------------------------
        // POSICIÓN OBJETIVO
        // ----------------------------------------------------

        objetivoX: centro.x,

        objetivoY: centro.y,


        // ----------------------------------------------------
        // POSICIÓN DE DESARME
        // ----------------------------------------------------

        desarmeX: centro.x,

        desarmeY: centro.y,


        // ----------------------------------------------------
        // VELOCIDAD
        // ----------------------------------------------------

        vx: 0,

        vy: 0,


        // ----------------------------------------------------
        // ROTACIÓN
        // ----------------------------------------------------

        angulo: 0,

        anguloObjetivo: 0,


        // ----------------------------------------------------
        // FORMA
        // ----------------------------------------------------

        invertido: invertido,


        // ----------------------------------------------------
        // COLOR
        // ----------------------------------------------------

        color: COLORES[id],


        // ----------------------------------------------------
        // RESPIRACIÓN
        // ----------------------------------------------------

        fase:
            Math.random() *
            Math.PI *
            2,


        escala: 1,


        // ----------------------------------------------------
        // ESTADOS
        // ----------------------------------------------------

        colocada: true,

        libre: false,

        seleccionada: false,


        // ----------------------------------------------------
        // DEDO QUE LA CONTROLA
        // ----------------------------------------------------

        pointerId: null
    });
}


// ============================================================
// CENTRO DEL TRIÁNGULO
// ============================================================

function centroTriangulo(a, b, c) {

    return {

        x:
            (
                a.x +
                b.x +
                c.x
            ) / 3,

        y:
            (
                a.y +
                b.y +
                c.y
            ) / 3
    };
}


// ============================================================
// GENERAR AZAR
// ============================================================

function generarAzar() {

    resultadoAzar =
        Math.floor(
            Math.random() * 3
        ) + 1;
}


// ============================================================
// COMENZAR DESARME
// ============================================================

function comenzarDesarme() {

    if (
        desarmando ||
        !figuraArmada
    ) {

        return;
    }


    figuraArmada = false;

    desarmando = true;

    tiempoDesarme =
        performance.now();


    generarAzar();


    // ========================================================
    // CADA PIEZA SE ALEJA DEL CENTRO
    // ========================================================

    piezas.forEach(
        pieza => {

            const dx =
                pieza.x -
                centroX;


            const dy =
                pieza.y -
                centroY;


            const distancia =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            let nx;
            let ny;


            if (
                distancia > 0
            ) {

                nx =
                    dx / distancia;

                ny =
                    dy / distancia;

            } else {

                nx = 0;

                ny = -1;
            }


            // ------------------------------------------------
            // DISTANCIA DE SEPARACIÓN
            // ------------------------------------------------
            //
            // No es aleatoria.
            // Cada pieza sabe hacia dónde alejarse.
            //
            // ------------------------------------------------

            const distanciaExtra =
                95 +
                pieza.id * 12;


            pieza.desarmeX =
                pieza.x +
                nx *
                distanciaExtra;


            pieza.desarmeY =
                pieza.y +
                ny *
                distanciaExtra;


            // ------------------------------------------------
            // Rotación suave
            // ------------------------------------------------

            pieza.angulo =
                0;


            pieza.vx = 0;

            pieza.vy = 0;


            pieza.colocada =
                false;


            pieza.libre =
                false;


            pieza.seleccionada =
                false;


            pieza.pointerId =
                null;
        }
    );
}


// ============================================================
// ACTUALIZAR DESARME
// ============================================================

function actualizarDesarme() {

    if (!desarmando) {

        return;
    }


    const ahora =
        performance.now();


    const progreso =
        Math.min(
            (
                ahora -
                tiempoDesarme
            ) /
            DURACION_DESARME,
            1
        );


    // --------------------------------------------------------
    // Movimiento suave
    // --------------------------------------------------------

    const suave =
        1 -
        Math.pow(
            1 - progreso,
            3
        );


    piezas.forEach(
        pieza => {

            const inicioX =
                pieza.objetivoX;


            const inicioY =
                pieza.objetivoY;


            pieza.x =
                inicioX +
                (
                    pieza.desarmeX -
                    inicioX
                ) *
                suave;


            pieza.y =
                inicioY +
                (
                    pieza.desarmeY -
                    inicioY
                ) *
                suave;


            // ------------------------------------------------
            // Rotación mientras se separa
            // ------------------------------------------------

            pieza.angulo =
                (
                    pieza.id % 2 === 0
                        ? 1
                        : -1
                ) *
                0.35 *
                suave;
        }
    );


    // --------------------------------------------------------
    // TERMINÓ EL DESARME
    // --------------------------------------------------------

    if (
        progreso >= 1
    ) {

        desarmando = false;


        piezas.forEach(
            pieza => {

                pieza.libre = true;


                // --------------------------------------------
                // Movimiento suave desde el punto alcanzado
                // --------------------------------------------

                const dx =
                    pieza.x -
                    centroX;


                const dy =
                    pieza.y -
                    centroY;


                const distancia =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );


                if (
                    distancia > 0
                ) {

                    pieza.vx =
                        (
                            dx /
                            distancia
                        ) *
                        0.35;


                    pieza.vy =
                        (
                            dy /
                            distancia
                        ) *
                        0.35;
                }
            }
        );
    }
}


// ============================================================
// ACTUALIZAR
// ============================================================

function actualizar() {

    const tiempo =
        performance.now();


    // ========================================================
    // DESARME
    // ========================================================

    actualizarDesarme();


    // ========================================================
    // RESPIRACIÓN Y MOVIMIENTO
    // ========================================================

    piezas.forEach(
        pieza => {

            // ------------------------------------------------
            // RESPIRACIÓN
            // ------------------------------------------------

            pieza.escala =
                1 +
                Math.sin(
                    tiempo *
                    VELOCIDAD_RESPIRACION +
                    pieza.fase
                ) *
                AMPLITUD_RESPIRACION;


            // ------------------------------------------------
            // MOVIMIENTO LIBRE
            // ------------------------------------------------

            if (
                pieza.libre &&
                !pieza.seleccionada
            ) {

                pieza.x +=
                    pieza.vx;

                pieza.y +=
                    pieza.vy;


                // --------------------------------------------
                // Fricción muy suave
                // --------------------------------------------

                pieza.vx *= 0.997;

                pieza.vy *= 0.997;


                controlarBordes(
                    pieza
                );
            }
        }
    );


    // ========================================================
    // COLISIONES
    // ========================================================

    resolverColisiones();


    // ========================================================
    // PIEZAS ENCAJADAS
    // ========================================================

    piezas.forEach(
        pieza => {

            if (
                pieza.colocada &&
                !pieza.libre
            ) {

                pieza.x =
                    pieza.objetivoX;

                pieza.y =
                    pieza.objetivoY;

                pieza.angulo =
                    pieza.anguloObjetivo;

                pieza.vx = 0;

                pieza.vy = 0;
            }
        }
    );
}


// ============================================================
// BORDES
// ============================================================

function controlarBordes(pieza) {

    const margen =
        LADO * 0.55;


    if (
        pieza.x <
        margen
    ) {

        pieza.x =
            margen;

        pieza.vx =
            Math.abs(
                pieza.vx
            );
    }


    if (
        pieza.x >
        canvas.width -
        margen
    ) {

        pieza.x =
            canvas.width -
            margen;

        pieza.vx =
            -Math.abs(
                pieza.vx
            );
    }


    if (
        pieza.y <
        margen
    ) {

        pieza.y =
            margen;

        pieza.vy =
            Math.abs(
                pieza.vy
            );
    }


    if (
        pieza.y >
        canvas.height -
        margen
    ) {

        pieza.y =
            canvas.height -
            margen;

        pieza.vy =
            -Math.abs(
                pieza.vy
            );
    }
}


// ============================================================
// COLISIONES
// ============================================================

function resolverColisiones() {

    for (
        let i = 0;
        i < piezas.length;
        i++
    ) {

        for (
            let j = i + 1;
            j < piezas.length;
            j++
        ) {

            const a =
                piezas[i];

            const b =
                piezas[j];


            if (
                !a.libre &&
                !b.libre
            ) {

                continue;
            }


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
                LADO * 0.72;


            if (
                distancia > 0 &&
                distancia <
                distanciaMinima
            ) {

                const nx =
                    dx / distancia;

                const ny =
                    dy / distancia;


                const diferencia =
                    distanciaMinima -
                    distancia;


                // ------------------------------------------------
                // Separación
                // ------------------------------------------------

                if (
                    a.libre &&
                    !a.seleccionada
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
                    b.libre &&
                    !b.seleccionada
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


                // ------------------------------------------------
                // Rebote
                // ------------------------------------------------

                if (
                    a.libre &&
                    !a.seleccionada
                ) {

                    a.vx -=
                        nx *
                        FUERZA_COLISION;

                    a.vy -=
                        ny *
                        FUERZA_COLISION;
                }


                if (
                    b.libre &&
                    !b.seleccionada
                ) {

                    b.vx +=
                        nx *
                        FUERZA_COLISION;

                    b.vy +=
                        ny *
                        FUERZA_COLISION;
                }
            }
        }
    }
}


// ============================================================
// BUSCAR PIEZA
// ============================================================

function buscarPieza(x, y) {

    for (
        let i =
            piezas.length - 1;
        i >= 0;
        i--
    ) {

        const pieza =
            piezas[i];


        if (
            !pieza.libre
        ) {

            continue;
        }


        const dx =
            x -
            pieza.x;


        const dy =
            y -
            pieza.y;


        const distancia =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (
            distancia <
            LADO * 0.78
        ) {

            return pieza;
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

        e.preventDefault();


        const rect =
            canvas.getBoundingClientRect();


        const x =
            e.clientX -
            rect.left;


        const y =
            e.clientY -
            rect.top;


        // ====================================================
        // FIGURA ARMADA
        // ====================================================

        if (
            figuraArmada
        ) {

            const dx =
                x -
                centroX;


            const dy =
                y -
                centroY;


            const distancia =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            if (
                distancia >
                LADO * 1.5
            ) {

                return;
            }


            comenzarDesarme();

            return;
        }


        // ====================================================
        // SI TODAVÍA SE ESTÁ DESARMANDO
        // ====================================================

        if (
            desarmando
        ) {

            return;
        }


        // ====================================================
        // BUSCAR PIEZA
        // ====================================================

        const pieza =
            buscarPieza(
                x,
                y
            );


        if (!pieza) {

            return;
        }


        // ====================================================
        // REGISTRAR EL DEDO
        // ====================================================

        punteros.set(
            e.pointerId,
            {
                x: x,
                y: y,

                pieza: pieza,

                offsetX:
                    x - pieza.x,

                offsetY:
                    y - pieza.y
            }
        );


        try {

            canvas.setPointerCapture(
                e.pointerId
            );

        } catch (error) {}


        pieza.seleccionada =
            true;


        pieza.pointerId =
            e.pointerId;


        // ====================================================
        // DOS DEDOS SOBRE LA MISMA PIEZA
        // = ROTACIÓN
        // ====================================================

        const dedosMismaPieza =
            Array.from(
                punteros.values()
            ).filter(
                p =>
                    p.pieza === pieza
            );


        if (
            dedosMismaPieza.length === 2
        ) {

            prepararRotacion(
                pieza,
                dedosMismaPieza
            );
        }
    }
);


// ============================================================
// INFORMACIÓN DE ROTACIÓN
// ============================================================

const rotaciones = new Map();


// ============================================================
// PREPARAR ROTACIÓN
// ============================================================

function prepararRotacion(
    pieza,
    dedos
) {

    if (
        dedos.length < 2
    ) {

        return;
    }


    const p1 =
        dedos[0];

    const p2 =
        dedos[1];


    const angulo =
        Math.atan2(
            p2.y - p1.y,
            p2.x - p1.x
        );


    rotaciones.set(
        pieza.id,
        {

            anguloInicial:
                angulo,

            rotacionInicial:
                pieza.angulo
        }
    );
}


// ============================================================
// ACTUALIZAR ROTACIONES
// ============================================================

function actualizarRotaciones() {

    rotaciones.forEach(
        (datos, piezaId) => {

            const pieza =
                piezas.find(
                    p =>
                        p.id === piezaId
                );


            if (!pieza) {
                return;
            }


            const dedos =
                Array.from(
                    punteros.values()
                ).filter(
                    p =>
                        p.pieza === pieza
                );


            if (
                dedos.length < 2
            ) {

                rotaciones.delete(
                    piezaId
                );

                return;
            }


            const p1 =
                dedos[0];

            const p2 =
                dedos[1];


            const anguloActual =
                Math.atan2(
                    p2.y - p1.y,
                    p2.x - p1.x
                );


            const diferencia =
                anguloActual -
                datos.anguloInicial;


            pieza.angulo =
                datos.rotacionInicial +
                diferencia;
        }
    );
}


// ============================================================
// POINTER MOVE
// ============================================================

canvas.addEventListener(
    "pointermove",
    function(e) {

        e.preventDefault();


        const datos =
            punteros.get(
                e.pointerId
            );


        if (!datos) {

            return;
        }


        const rect =
            canvas.getBoundingClientRect();


        const x =
            e.clientX -
            rect.left;


        const y =
            e.clientY -
            rect.top;


        datos.x = x;

        datos.y = y;


        const pieza =
            datos.pieza;


        if (!pieza) {

            return;
        }


        // ====================================================
        // DOS DEDOS SOBRE LA MISMA PIEZA
        // ====================================================

        const dedos =
            Array.from(
                punteros.values()
            ).filter(
                p =>
                    p.pieza === pieza
            );


        if (
            dedos.length >= 2
        ) {

            if (
                !rotaciones.has(
                    pieza.id
                )
            ) {

                prepararRotacion(
                    pieza,
                    dedos
                );
            }


            actualizarRotaciones();

            return;
        }


        // ====================================================
        // UN DEDO = MOVER
        // ====================================================

        if (
            dedos.length === 1
        ) {

            pieza.x =
                x -
                datos.offsetX;


            pieza.y =
                y -
                datos.offsetY;


            pieza.vx = 0;

            pieza.vy = 0;
        }
    }
);


// ============================================================
// POINTER UP
// ============================================================

canvas.addEventListener(
    "pointerup",
    finalizarPointer
);


// ============================================================
// POINTER CANCEL
// ============================================================

canvas.addEventListener(
    "pointercancel",
    finalizarPointer
);


// ============================================================
// FINALIZAR DEDO
// ============================================================

function finalizarPointer(e) {

    const datos =
        punteros.get(
            e.pointerId
        );


    if (!datos) {

        return;
    }


    const pieza =
        datos.pieza;


    punteros.delete(
        e.pointerId
    );


    try {

        canvas.releasePointerCapture(
            e.pointerId
        );

    } catch (error) {}


    if (!pieza) {

        return;
    }


    // ========================================================
    // VER SI TODAVÍA HAY OTRO DEDO EN LA MISMA PIEZA
    // ========================================================

    const dedosRestantes =
        Array.from(
            punteros.values()
        ).filter(
            p =>
                p.pieza === pieza
        );


    if (
        dedosRestantes.length > 0
    ) {

        // -----------------------------------------------
        // Todavía puede seguir moviéndose.
        // -----------------------------------------------

        if (
            dedosRestantes.length === 1
        ) {

            rotaciones.delete(
                pieza.id
            );


            const restante =
                dedosRestantes[0];


            restante.offsetX =
                restante.x -
                pieza.x;


            restante.offsetY =
                restante.y -
                pieza.y;
        }


        return;
    }


    // ========================================================
    // YA NO HAY DEDOS EN ESTA PIEZA
    // ========================================================

    rotaciones.delete(
        pieza.id
    );


    pieza.seleccionada =
        false;


    pieza.pointerId =
        null;


    intentarEncajar(
        pieza
    );
}


// ============================================================
// INTENTAR ENCAJAR
// ============================================================

function intentarEncajar(pieza) {

    if (
        !pieza ||
        !pieza.libre
    ) {

        return;
    }


    const dx =
        pieza.objetivoX -
        pieza.x;


    const dy =
        pieza.objetivoY -
        pieza.y;


    const distancia =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    // ========================================================
    // ESTÁ CERCA
    // ========================================================

    if (
        distancia <
        DISTANCIA_ENCAJE
    ) {

        const cantidadColocadas =
            piezas.filter(
                p =>
                    p.colocada
            ).length;


        // ====================================================
        // ES LA ÚLTIMA
        // ====================================================

        if (
            cantidadColocadas === 3
        ) {

            // -----------------------------------------------
            // RESULTADO 1 O 2 = RECHAZAR
            // -----------------------------------------------

            if (
                resultadoAzar !== 3
            ) {

                rechazarUltima(
                    pieza
                );

                return;
            }
        }


        // ====================================================
        // ENCAJAR
        // ====================================================

        pieza.x =
            pieza.objetivoX;


        pieza.y =
            pieza.objetivoY;


        pieza.angulo =
            pieza.anguloObjetivo;


        pieza.vx = 0;

        pieza.vy = 0;


        pieza.colocada =
            true;


        pieza.libre =
            false;


        verificarArmado();


        return;
    }


    // ========================================================
    // NO ENCAJÓ
    // ========================================================

    const direccion =
        Math.atan2(
            dy,
            dx
        );


    pieza.vx =
        Math.cos(
            direccion
        ) * 0.3;


    pieza.vy =
        Math.sin(
            direccion
        ) * 0.3;
}


// ============================================================
// VERIFICAR ARMADO
// ============================================================

function verificarArmado() {

    const cantidad =
        piezas.filter(
            pieza =>
                pieza.colocada
        ).length;


    if (
        cantidad < 4
    ) {

        return;
    }


    completarFigura();
}


// ============================================================
// RECHAZAR ÚLTIMA
// ============================================================

function rechazarUltima(pieza) {

    if (!pieza) {

        return;
    }


    pieza.colocada =
        false;


    pieza.libre =
        true;


    pieza.seleccionada =
        false;


    // ========================================================
    // REBOTE
    // ========================================================

    const dx =
        pieza.x -
        centroX;


    const dy =
        pieza.y -
        centroY;


    const distancia =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    if (
        distancia > 0
    ) {

        pieza.vx =
            (
                dx /
                distancia
            ) * 3.5;


        pieza.vy =
            (
                dy /
                distancia
            ) * 3.5;

    } else {

        pieza.vx = 0;

        pieza.vy = -3.5;
    }


    pieza.angulo +=
        0.5;


    // ========================================================
    // DESARMAR TODO DESPUÉS DEL RECHAZO
    // ========================================================

    setTimeout(
        function() {

            romperTodo();

        },
        450
    );
}


// ============================================================
// ROMPER TODO
// ============================================================
//
// IMPORTANTE:
// NO aparecen aleatoriamente.
//
// Se separan desde la posición actual,
// alejándose progresivamente del centro.
//
// ============================================================

function romperTodo() {

    figuraArmada = false;

    desarmando = true;

    tiempoDesarme =
        performance.now();


    piezas.forEach(
        pieza => {

            pieza.colocada =
                false;


            pieza.libre =
                false;


            pieza.seleccionada =
                false;


            pieza.pointerId =
                null;


            // ------------------------------------------------
            // Dirección desde el centro
            // ------------------------------------------------

            const dx =
                pieza.x -
                centroX;


            const dy =
                pieza.y -
                centroY;


            const distancia =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            let nx;
            let ny;


            if (
                distancia > 0
            ) {

                nx =
                    dx / distancia;

                ny =
                    dy / distancia;

            } else {

                nx = 0;

                ny = -1;
            }


            // ------------------------------------------------
            // Nueva posición de separación
            // ------------------------------------------------

            pieza.desarmeX =
                pieza.x +
                nx *
                (
                    80 +
                    pieza.id * 15
                );


            pieza.desarmeY =
                pieza.y +
                ny *
                (
                    80 +
                    pieza.id * 15
                );


            pieza.vx = 0;

            pieza.vy = 0;
        }
    );


    generarAzar();
}


// ============================================================
// COMPLETAR FIGURA
// ============================================================

function completarFigura() {

    figuraArmada = true;


    piezas.forEach(
        pieza => {

            pieza.x =
                pieza.objetivoX;


            pieza.y =
                pieza.objetivoY;


            pieza.angulo =
                pieza.anguloObjetivo;


            pieza.vx = 0;

            pieza.vy = 0;


            pieza.colocada =
                true;


            pieza.libre =
                false;


            pieza.seleccionada =
                false;
        }
    );


    // --------------------------------------------------------
    // Nueva ronda
    // --------------------------------------------------------

    setTimeout(
        function() {

            nuevaRonda();

        },
        1600
    );
}


// ============================================================
// NUEVA RONDA
// ============================================================

function nuevaRonda() {

    generarAzar();


    piezas.forEach(
        pieza => {

            pieza.x =
                pieza.objetivoX;


            pieza.y =
                pieza.objetivoY;


            pieza.angulo =
                pieza.anguloObjetivo;


            pieza.vx = 0;

            pieza.vy = 0;


            pieza.colocada =
                true;


            pieza.libre =
                false;


            pieza.seleccionada =
                false;


            pieza.pointerId =
                null;
        }
    );


    figuraArmada =
        true;
}


// ============================================================
// DIBUJAR TRIÁNGULO
// ============================================================

function dibujarTriangulo(pieza) {

    const estilo =
        ESTILOS[pieza.color];


    ctx.save();


    ctx.translate(
        pieza.x,
        pieza.y
    );


    ctx.rotate(
        pieza.angulo
    );


    ctx.scale(
        pieza.escala,
        pieza.escala
    );


    // ========================================================
    // FORMA
    // ========================================================

    ctx.beginPath();


    if (
        pieza.invertido
    ) {

        // ----------------------------------------------------
        // TRIÁNGULO CENTRAL INVERTIDO
        // ----------------------------------------------------

        ctx.moveTo(
            0,
            ALTURA * 2 / 3
        );


        ctx.lineTo(
            -LADO / 2,
            -ALTURA / 3
        );


        ctx.lineTo(
            LADO / 2,
            -ALTURA / 3
        );

    } else {

        // ----------------------------------------------------
        // TRIÁNGULO NORMAL
        // ----------------------------------------------------

        ctx.moveTo(
            0,
            -ALTURA * 2 / 3
        );


        ctx.lineTo(
            -LADO / 2,
            ALTURA / 3
        );


        ctx.lineTo(
            LADO / 2,
            ALTURA / 3
        );
    }


    ctx.closePath();


    // ========================================================
    // SOMBRA
    // ========================================================

    ctx.shadowColor =
        estilo.sombra;


    ctx.shadowBlur =
        12;


    ctx.shadowOffsetX =
        0;


    ctx.shadowOffsetY =
        2;


    // ========================================================
    // GRADIENTE
    // ========================================================

    const gradiente =
        ctx.createRadialGradient(

            -LADO * 0.18,

            -ALTURA * 0.25,

            5,

            0,

            0,

            LADO * 0.8
        );


    gradiente.addColorStop(
        0,
        estilo.claro
    );


    gradiente.addColorStop(
        0.52,
        estilo.medio
    );


    gradiente.addColorStop(
        1,
        estilo.oscuro
    );


    ctx.fillStyle =
        gradiente;


    ctx.fill();


    // ========================================================
    // BRILLO
    // ========================================================

    ctx.shadowColor =
        "transparent";


    ctx.shadowBlur =
        0;


    ctx.save();


    ctx.clip();


    const brillo =
        ctx.createRadialGradient(

            -LADO * 0.18,

            -ALTURA * 0.25,

            2,

            -LADO * 0.18,

            -ALTURA * 0.25,

            LADO * 0.65
        );


    brillo.addColorStop(
        0,
        "rgba(255,255,255,0.18)"
    );


    brillo.addColorStop(
        0.5,
        "rgba(255,255,255,0.05)"
    );


    brillo.addColorStop(
        1,
        "rgba(255,255,255,0)"
    );


    ctx.fillStyle =
        brillo;


    ctx.fill();


    ctx.restore();


    // ========================================================
    // BORDE SUAVE
    // ========================================================

    ctx.beginPath();


    if (
        pieza.invertido
    ) {

        ctx.moveTo(
            0,
            ALTURA * 2 / 3
        );


        ctx.lineTo(
            -LADO / 2,
            -ALTURA / 3
        );


        ctx.lineTo(
            LADO / 2,
            -ALTURA / 3
        );

    } else {

        ctx.moveTo(
            0,
            -ALTURA * 2 / 3
        );


        ctx.lineTo(
            -LADO / 2,
            ALTURA / 3
        );


        ctx.lineTo(
            LADO / 2,
            ALTURA / 3
        );
    }


    ctx.closePath();


    ctx.strokeStyle =
        "rgba(196,206,229,0.12)";


    ctx.lineWidth =
        0.7;


    ctx.stroke();


    ctx.restore();
}


// ============================================================
// DIBUJAR
// ============================================================

function dibujar() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // --------------------------------------------------------
    // Piezas normales
    // --------------------------------------------------------

    piezas.forEach(
        pieza => {

            if (
                !pieza.seleccionada
            ) {

                dibujarTriangulo(
                    pieza
                );
            }
        }
    );


    // --------------------------------------------------------
    // Piezas seleccionadas arriba
    // --------------------------------------------------------

    piezas.forEach(
        pieza => {

            if (
                pieza.seleccionada
            ) {

                dibujarTriangulo(
                    pieza
                );
            }
        }
    );
}


// ============================================================
// ANIMACIÓN
// ============================================================

function animar() {

    actualizar();

    dibujar();

    requestAnimationFrame(
        animar
    );
}


// ============================================================
// EVITAR GESTOS DEL NAVEGADOR
// ============================================================

canvas.addEventListener(
    "gesturestart",
    function(e) {

        e.preventDefault();
    }
);


canvas.addEventListener(
    "gesturechange",
    function(e) {

        e.preventDefault();
    }
);


canvas.addEventListener(
    "gestureend",
    function(e) {

        e.preventDefault();
    }
);


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
// INICIAR
// ============================================================

ajustarCanvas();

generarAzar();

animar();