// ============================================================
// EXPECTATIVA
// triangulos3.js
// ============================================================
//
// - 4 triángulos equiláteros.
// - Al comenzar forman PERFECTAMENTE un triángulo grande.
// - Todos respiran suavemente.
// - Al tocar la figura se desarma.
// - 1 dedo = mover.
// - 2 dedos = rotar.
// - Al acercarse a su lugar, la pieza encaja.
// - Cuando quedan 3 piezas colocadas:
//      resultado 1 o 2 = falla y se desarma
//      resultado 3 = permite completar
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

const ALTURA = LADO * Math.sqrt(3) / 2;


// ============================================================
// VARIABLES
// ============================================================

let piezas = [];

let centroX = 0;
let centroY = 0;

let figuraArmada = true;

let primeraCarga = true;


// ============================================================
// INTERACCIÓN
// ============================================================

const punteros = new Map();

let piezaSeleccionada = null;

let modoRotacion = false;

let offsetX = 0;
let offsetY = 0;

let anguloInicialDedos = 0;
let anguloInicialPieza = 0;


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

const FUERZA_COLISION = 0.45;


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

    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width || window.innerWidth * 0.95;
    canvas.height = rect.height || window.innerHeight * 0.95;

    centroX = canvas.width / 2;
    centroY = canvas.height / 2;

    if (primeraCarga) {

        crearFigura();

        primeraCarga = false;
    }
}


// ============================================================
// CREAR FIGURA
// ============================================================
//
// ESTA ES LA PARTE CORREGIDA.
//
// Los cuatro triángulos comparten exactamente los mismos
// vértices.
//
//                 A
//                / \
//               /   \
//              /_____\
//             B\     /C
//               \   /
//              / \ / \
//             /___E___\
//            D         F
//
// ============================================================

function crearFigura() {

    piezas = [];


    // --------------------------------------------------------
    // VÉRTICES EXACTOS DEL TRIÁNGULO GRANDE
    // --------------------------------------------------------
    //
    // El triángulo grande tiene lado 2 * LADO.
    //
    // Su altura es 2 * ALTURA.
    //
    // --------------------------------------------------------

    const A = {
        x: centroX,
        y: centroY - ALTURA * 2 / 3
    };


    const B = {
        x: centroX - LADO / 2,
        y: centroY + ALTURA / 3
    };


    const C = {
        x: centroX + LADO / 2,
        y: centroY + ALTURA / 3
    };


    const D = {
        x: centroX - LADO,
        y: centroY + ALTURA * 4 / 3
    };


    const E = {
        x: centroX,
        y: centroY + ALTURA * 4 / 3
    };


    const F = {
        x: centroX + LADO,
        y: centroY + ALTURA * 4 / 3
    };


    // ========================================================
    // TRIÁNGULO SUPERIOR
    // ========================================================

    const superior = {

        a: A,
        b: B,
        c: C
    };


    // ========================================================
    // TRIÁNGULO INFERIOR IZQUIERDO
    // ========================================================

    const izquierdo = {

        a: B,
        b: D,
        c: E
    };


    // ========================================================
    // TRIÁNGULO INFERIOR DERECHO
    // ========================================================

    const derecho = {

        a: C,
        b: E,
        c: F
    };


    // ========================================================
    // TRIÁNGULO CENTRAL INVERTIDO
    // ========================================================

    const central = {

        a: B,
        b: C,
        c: E
    };


    // ========================================================
    // CREAR PIEZAS
    // ========================================================

    agregarPieza(
        0,
        superior,
        false
    );


    agregarPieza(
        1,
        izquierdo,
        false
    );


    agregarPieza(
        2,
        derecho,
        false
    );


    agregarPieza(
        3,
        central,
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

        x: centro.x,
        y: centro.y,

        objetivoX: centro.x,
        objetivoY: centro.y,

        vx: 0,
        vy: 0,

        angulo: 0,
        anguloObjetivo: 0,

        invertido: invertido,

        color: COLORES[id],

        fase:
            Math.random() *
            Math.PI *
            2,

        escala: 1,

        colocada: true,

        libre: false,

        seleccionada: false
    });
}


// ============================================================
// CENTRO DEL TRIÁNGULO
// ============================================================

function centroTriangulo(a, b, c) {

    return {

        x:
            (a.x + b.x + c.x) / 3,

        y:
            (a.y + b.y + c.y) / 3
    };
}


// ============================================================
// GENERAR RESULTADO ALEATORIO
// ============================================================

function generarAzar() {

    resultadoAzar =
        Math.floor(
            Math.random() * 3
        ) + 1;
}


// ============================================================
// DESARMAR
// ============================================================

function desarmar() {

    if (!figuraArmada) {
        return;
    }

    figuraArmada = false;

    generarAzar();


    const posiciones = [];


    // --------------------------------------------------------
    // BUSCAR POSICIONES SEPARADAS
    // --------------------------------------------------------

    piezas.forEach(() => {

        let x;
        let y;

        let valido = false;

        let intentos = 0;


        while (
            !valido &&
            intentos < 100
        ) {

            x =
                LADO +
                Math.random() *
                (
                    canvas.width -
                    LADO * 2
                );


            y =
                LADO +
                Math.random() *
                (
                    canvas.height -
                    LADO * 2
                );


            valido = true;


            posiciones.forEach(
                posicion => {

                    const dx =
                        x - posicion.x;

                    const dy =
                        y - posicion.y;

                    const distancia =
                        Math.sqrt(
                            dx * dx +
                            dy * dy
                        );


                    if (
                        distancia <
                        LADO * 1.2
                    ) {

                        valido = false;
                    }
                }
            );


            intentos++;
        }


        posiciones.push({
            x: x,
            y: y
        });
    });


    // --------------------------------------------------------
    // APLICAR POSICIONES
    // --------------------------------------------------------

    piezas.forEach(
        (pieza, i) => {

            pieza.x =
                posiciones[i].x;

            pieza.y =
                posiciones[i].y;


            pieza.colocada =
                false;

            pieza.libre =
                true;

            pieza.seleccionada =
                false;


            const direccion =
                Math.random() *
                Math.PI *
                2;


            const velocidad =
                0.6 +
                Math.random() *
                1.2;


            pieza.vx =
                Math.cos(
                    direccion
                ) * velocidad;


            pieza.vy =
                Math.sin(
                    direccion
                ) * velocidad;


            pieza.angulo =
                (
                    Math.random() -
                    0.5
                ) *
                Math.PI *
                1.8;
        }
    );
}


// ============================================================
// ACTUALIZAR
// ============================================================

function actualizar() {

    const tiempo =
        performance.now();


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
            // MOVIMIENTO
            // ------------------------------------------------

            if (
                pieza.libre &&
                !pieza.seleccionada
            ) {

                pieza.x += pieza.vx;
                pieza.y += pieza.vy;


                pieza.vx *= 0.998;
                pieza.vy *= 0.998;


                if (
                    Math.abs(pieza.vx) < 0.03 &&
                    Math.abs(pieza.vy) < 0.03
                ) {

                    const direccion =
                        Math.random() *
                        Math.PI *
                        2;


                    pieza.vx +=
                        Math.cos(
                            direccion
                        ) * 0.02;


                    pieza.vy +=
                        Math.sin(
                            direccion
                        ) * 0.02;
                }


                controlarBordes(pieza);
            }
        }
    );


    resolverColisiones();


    // --------------------------------------------------------
    // PIEZAS ENCAJADAS
    // --------------------------------------------------------

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
        pieza.x < margen
    ) {

        pieza.x = margen;

        pieza.vx =
            Math.abs(pieza.vx);
    }


    if (
        pieza.x >
        canvas.width - margen
    ) {

        pieza.x =
            canvas.width - margen;

        pieza.vx =
            -Math.abs(pieza.vx);
    }


    if (
        pieza.y < margen
    ) {

        pieza.y = margen;

        pieza.vy =
            Math.abs(pieza.vy);
    }


    if (
        pieza.y >
        canvas.height - margen
    ) {

        pieza.y =
            canvas.height - margen;

        pieza.vy =
            -Math.abs(pieza.vy);
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

            const a = piezas[i];
            const b = piezas[j];


            if (
                !a.libre &&
                !b.libre
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
        let i = piezas.length - 1;
        i >= 0;
        i--
    ) {

        const pieza =
            piezas[i];


        if (!pieza.libre) {
            continue;
        }


        const dx =
            x - pieza.x;

        const dy =
            y - pieza.y;


        const distancia =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (
            distancia <
            LADO * 0.75
        ) {

            return pieza;
        }
    }


    return null;
}


// ============================================================
// ÁNGULO ENTRE LOS DOS DEDOS
// ============================================================

function obtenerAnguloDedos() {

    const valores =
        Array.from(
            punteros.values()
        );


    if (
        valores.length < 2
    ) {

        return 0;
    }


    const p1 = valores[0];
    const p2 = valores[1];


    return Math.atan2(
        p2.y - p1.y,
        p2.x - p1.x
    );
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
            e.clientX - rect.left;

        const y =
            e.clientY - rect.top;


        // ====================================================
        // FIGURA ARMADA
        // ====================================================

        if (figuraArmada) {

            const dx =
                x - centroX;

            const dy =
                y - centroY;


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


            desarmar();

            return;
        }


        // ====================================================
        // FIGURA DESARMADA
        // ====================================================

        punteros.set(
            e.pointerId,
            {
                x: x,
                y: y
            }
        );


        try {

            canvas.setPointerCapture(
                e.pointerId
            );

        } catch (error) {}


        // ====================================================
        // PRIMER DEDO
        // ====================================================

        if (
            punteros.size === 1
        ) {

            const pieza =
                buscarPieza(
                    x,
                    y
                );


            if (!pieza) {

                punteros.delete(
                    e.pointerId
                );

                return;
            }


            piezaSeleccionada =
                pieza;


            pieza.seleccionada =
                true;


            offsetX =
                x - pieza.x;

            offsetY =
                y - pieza.y;


            modoRotacion =
                false;
        }


        // ====================================================
        // SEGUNDO DEDO
        // ====================================================

        else if (
            punteros.size === 2 &&
            piezaSeleccionada
        ) {

            const dx =
                x -
                piezaSeleccionada.x;

            const dy =
                y -
                piezaSeleccionada.y;


            const distancia =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            if (
                distancia <
                LADO * 1.2
            ) {

                modoRotacion =
                    true;


                anguloInicialDedos =
                    obtenerAnguloDedos();


                anguloInicialPieza =
                    piezaSeleccionada.angulo;
            }
        }
    }
);


// ============================================================
// POINTER MOVE
// ============================================================

canvas.addEventListener(
    "pointermove",
    function(e) {

        e.preventDefault();


        if (
            !punteros.has(
                e.pointerId
            )
        ) {

            return;
        }


        const rect =
            canvas.getBoundingClientRect();


        const x =
            e.clientX - rect.left;

        const y =
            e.clientY - rect.top;


        punteros.set(
            e.pointerId,
            {
                x: x,
                y: y
            }
        );


        if (
            !piezaSeleccionada
        ) {

            return;
        }


        // ====================================================
        // ROTACIÓN
        // ====================================================

        if (
            punteros.size >= 2 &&
            modoRotacion
        ) {

            const anguloActual =
                obtenerAnguloDedos();


            const diferencia =
                anguloActual -
                anguloInicialDedos;


            piezaSeleccionada.angulo =
                anguloInicialPieza +
                diferencia;


            return;
        }


        // ====================================================
        // MOVIMIENTO
        // ====================================================

        if (
            punteros.size === 1
        ) {

            piezaSeleccionada.x =
                x - offsetX;

            piezaSeleccionada.y =
                y - offsetY;


            piezaSeleccionada.vx = 0;
            piezaSeleccionada.vy = 0;
        }
    }
);


// ============================================================
// TERMINAR POINTER
// ============================================================

function terminarPointer(e) {

    punteros.delete(
        e.pointerId
    );


    try {

        canvas.releasePointerCapture(
            e.pointerId
        );

    } catch (error) {}


    // --------------------------------------------------------
    // TODAVÍA QUEDA UN DEDO
    // --------------------------------------------------------

    if (
        punteros.size > 0
    ) {

        if (
            punteros.size === 1 &&
            piezaSeleccionada
        ) {

            modoRotacion = false;


            const restante =
                Array.from(
                    punteros.values()
                )[0];


            offsetX =
                restante.x -
                piezaSeleccionada.x;


            offsetY =
                restante.y -
                piezaSeleccionada.y;
        }


        return;
    }


    // --------------------------------------------------------
    // NO QUEDAN DEDOS
    // --------------------------------------------------------

    if (
        !piezaSeleccionada
    ) {

        return;
    }


    const pieza =
        piezaSeleccionada;


    pieza.seleccionada =
        false;


    piezaSeleccionada =
        null;


    modoRotacion =
        false;


    intentarEncajar(
        pieza
    );
}


// ============================================================
// POINTER UP
// ============================================================

canvas.addEventListener(
    "pointerup",
    terminarPointer
);


// ============================================================
// POINTER CANCEL
// ============================================================

canvas.addEventListener(
    "pointercancel",
    terminarPointer
);


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

        const colocadas =
            piezas.filter(
                p =>
                    p.colocada
            ).length;


        // ----------------------------------------------------
        // SI YA HAY 3 COLOCADAS
        // ----------------------------------------------------
        //
        // AQUÍ SE DECIDE EL AZAR.
        //
        // ----------------------------------------------------

        if (
            colocadas === 3
        ) {

            if (
                resultadoAzar !== 3
            ) {

                rechazarUltima(
                    pieza
                );

                return;
            }
        }


        // ----------------------------------------------------
        // ENCAJAR
        // ----------------------------------------------------

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
    // NO ESTÁ CERCA
    // ========================================================

    const direccion =
        Math.atan2(
            dy,
            dx
        );


    pieza.vx =
        Math.cos(
            direccion
        ) * 0.4;


    pieza.vy =
        Math.sin(
            direccion
        ) * 0.4;
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
// RECHAZAR ÚLTIMA PIEZA
// ============================================================

function rechazarUltima(pieza) {

    if (!pieza) {
        return;
    }


    pieza.colocada =
        false;

    pieza.libre =
        true;


    // --------------------------------------------------------
    // REBOTE
    // --------------------------------------------------------

    const direccion =
        Math.random() *
        Math.PI *
        2;


    const fuerza =
        4 +
        Math.random() * 2;


    pieza.vx =
        Math.cos(
            direccion
        ) * fuerza;


    pieza.vy =
        Math.sin(
            direccion
        ) * fuerza;


    pieza.angulo +=
        (
            Math.random() -
            0.5
        ) * 1.5;


    // --------------------------------------------------------
    // DESARMAR TODO
    // --------------------------------------------------------

    setTimeout(
        function() {

            romperTodo();

        },
        500
    );
}


// ============================================================
// COMPLETAR FIGURA
// ============================================================

function completarFigura() {

    figuraArmada =
        true;


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
    // NUEVA RONDA
    // --------------------------------------------------------

    setTimeout(
        function() {

            nuevaRonda();

        },
        1600
    );
}


// ============================================================
// ROMPER TODO
// ============================================================

function romperTodo() {

    figuraArmada =
        false;


    piezas.forEach(
        pieza => {

            pieza.colocada =
                false;

            pieza.libre =
                true;

            pieza.seleccionada =
                false;


            // ------------------------------------------------
            // POSICIÓN ALEATORIA
            // ------------------------------------------------

            pieza.x =
                LADO +
                Math.random() *
                (
                    canvas.width -
                    LADO * 2
                );


            pieza.y =
                LADO +
                Math.random() *
                (
                    canvas.height -
                    LADO * 2
                );


            // ------------------------------------------------
            // MOVIMIENTO
            // ------------------------------------------------

            const direccion =
                Math.random() *
                Math.PI *
                2;


            const velocidad =
                0.6 +
                Math.random() *
                1.2;


            pieza.vx =
                Math.cos(
                    direccion
                ) * velocidad;


            pieza.vy =
                Math.sin(
                    direccion
                ) * velocidad;


            // ------------------------------------------------
            // ROTACIÓN
            // ------------------------------------------------

            pieza.angulo =
                (
                    Math.random() -
                    0.5
                ) *
                Math.PI *
                1.8;
        }
    );


    generarAzar();
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
        // CENTRAL INVERTIDO
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

    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;


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

    ctx.shadowBlur = 0;


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
// EVITAR GESTOS
// ============================================================

canvas.addEventListener(
    "gesturestart",
    e => e.preventDefault()
);

canvas.addEventListener(
    "gesturechange",
    e => e.preventDefault()
);

canvas.addEventListener(
    "gestureend",
    e => e.preventDefault()
);


// ============================================================
// REDIMENSIONAR
// ============================================================

window.addEventListener(
    "resize",
    ajustarCanvas
);


// ============================================================
// INICIAR
// ============================================================

ajustarCanvas();

generarAzar();

animar();