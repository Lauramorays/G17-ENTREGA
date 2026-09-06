
// ============================================================
// HERENCIA
// cuadrados2.js
// ============================================================
//
// INTERACCIÓN:
// - Comienzan 4 cuadrados.
// - Se mueven solos.
// - Chocan entre ellos y con los bordes.
// - Tienen movimiento de respiración.
// - Con un dedo se pueden arrastrar.
// - Con dos dedos sobre el mismo cuadrado se puede estirar.
// - Al estirarlo, la punta hacia donde se tira se va afinando.
// - Al llegar al máximo, genera hijos.
// - El padre permanece.
// - Después de generar hijos rebota y recupera su forma.
// - Si se suelta antes del máximo también rebota y recupera
//   su forma original.
//
// ============================================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


// ============================================================
// COLORES
// ============================================================

const COLORES = [
    "#D9D9D9",
    "#8BB2D3",
    "#202D64",
    "#2B538E"
];


// ============================================================
// CONFIGURACIÓN
// ============================================================

const TAMANO_INICIAL = 110;

const DISTANCIA_SEPARACION = 180;

const REDUCCION_HIJO = 0.82;

const VELOCIDAD = 0.7;

const FUERZA_CHOQUE = 0.8;


// ============================================================
// DEFORMACIÓN ELÁSTICA
// ============================================================

const DEFORMACION_MAXIMA = 1.65;

const COMPRESION_MAXIMA = 0.68;

const FUERZA_REBOTE = 0.16;

const AMORTIGUACION_REBOTE = 0.82;


// ============================================================
// AJUSTAR CANVAS
// ============================================================

function ajustarCanvas() {

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

}

ajustarCanvas();

window.addEventListener("resize", ajustarCanvas);


// ============================================================
// FIGURAS
// ============================================================

const figuras = [];


// ============================================================
// CREAR FIGURA
// ============================================================

function crearFigura(x, y, color, tamano = TAMANO_INICIAL) {

    return {

        x: x,
        y: y,

        vx: (Math.random() - 0.5) * VELOCIDAD,
        vy: (Math.random() - 0.5) * VELOCIDAD,

        color: color,

        tamano: tamano,

        rotacion: Math.random() * Math.PI * 2,

        velocidadRotacion:
            (Math.random() - 0.5) * 0.002,

        // ----------------------------------------
        // RESPIRACIÓN
        // ----------------------------------------

        faseRespiracion:
            Math.random() * Math.PI * 2,

        faseSecundaria:
            Math.random() * Math.PI * 2,

        velocidadRespiracion:
            0.012 + Math.random() * 0.005,

        amplitudRespiracion:
            0.045 + Math.random() * 0.015,

        respiracionX: 1,
        respiracionY: 1,

        // ----------------------------------------
        // GESTO
        // ----------------------------------------

        seleccionada: false,

        gesticulando: false,

        puntosGesto: [],

        distanciaInicialGesto: 0,

        distanciaActualGesto: 0,

        escalaGesto: 1,

        compresionGesto: 1,

        direccionGestoX: 1,

        direccionGestoY: 0,

        // ----------------------------------------
        // REBOTE ELÁSTICO
        // ----------------------------------------

        rebotando: false,

        velocidadRebote: 0,

        deformacionRebote: 0,

        direccionReboteX: 1,

        direccionReboteY: 0,

        inclinacionDeformacion: 0,

        // ----------------------------------------
        // HERENCIA
        // ----------------------------------------

        reproducciones: 0

    };

}


// ============================================================
// FIGURAS INICIALES
// ============================================================

function crearFigurasIniciales() {

    figuras.length = 0;

    figuras.push(
        crearFigura(
            canvas.width * 0.25,
            canvas.height * 0.30,
            COLORES[0]
        )
    );

    figuras.push(
        crearFigura(
            canvas.width * 0.75,
            canvas.height * 0.30,
            COLORES[1]
        )
    );

    figuras.push(
        crearFigura(
            canvas.width * 0.25,
            canvas.height * 0.70,
            COLORES[2]
        )
    );

    figuras.push(
        crearFigura(
            canvas.width * 0.75,
            canvas.height * 0.70,
            COLORES[3]
        )
    );

}

crearFigurasIniciales();


// ============================================================
// RESPIRACIÓN
// ============================================================

function actualizarRespiracion(figura) {

    figura.faseRespiracion +=
        figura.velocidadRespiracion;

    figura.faseSecundaria +=
        figura.velocidadRespiracion * 0.47;

    const ondaPrincipal =
        Math.sin(figura.faseRespiracion);

    const ondaSecundaria =
        Math.sin(figura.faseSecundaria);

    const respiracion =
        ondaPrincipal * figura.amplitudRespiracion +
        ondaSecundaria * 0.008;

    figura.respiracionX =
        1 + respiracion;

    figura.respiracionY =
        1 + respiracion * 0.82;

}


// ============================================================
// REBOTE ELÁSTICO
// ============================================================

function iniciarRebote(figura) {

    figura.rebotando = true;

    figura.velocidadRebote = FUERZA_REBOTE;

    figura.deformacionRebote = 1;

}


// ============================================================
// ACTUALIZAR REBOTE
// ============================================================

function actualizarRebote(figura) {

    if (!figura.rebotando) {
        return;
    }

    figura.velocidadRebote *= AMORTIGUACION_REBOTE;

    figura.deformacionRebote +=
        figura.velocidadRebote *
        figura.direccionReboteX;

    figura.deformacionRebote *= 0.94;

    if (
        Math.abs(figura.deformacionRebote) < 0.015 &&
        Math.abs(figura.velocidadRebote) < 0.008
    ) {

        figura.deformacionRebote = 0;

        figura.velocidadRebote = 0;

        figura.rebotando = false;

    }

}


// ============================================================
// ACTUALIZAR GESTO
// ============================================================

function actualizarGesto(figura) {

    if (!figura.gesticulando) {
        return;
    }

    if (figura.puntosGesto.length < 2) {
        return;
    }

    const p1 = figura.puntosGesto[0];

    const p2 = figura.puntosGesto[1];

    const dx = p2.x - p1.x;

    const dy = p2.y - p1.y;

    const distancia =
        Math.sqrt(dx * dx + dy * dy);

    figura.distanciaActualGesto = distancia;

    if (figura.distanciaInicialGesto <= 0) {
        return;
    }

    let progreso =
        (distancia - figura.distanciaInicialGesto) /
        DISTANCIA_SEPARACION;

    progreso =
        Math.max(0, Math.min(1, progreso));


    // ----------------------------------------
    // DIRECCIÓN DEL ESTIRAMIENTO
    // ----------------------------------------

    if (distancia > 0) {

        figura.direccionGestoX =
            dx / distancia;

        figura.direccionGestoY =
            dy / distancia;

    }


    // ----------------------------------------
    // ESCALA PRINCIPAL
    // ----------------------------------------

    figura.escalaGesto =
        1 +
        (DEFORMACION_MAXIMA - 1) *
        progreso;


    // ----------------------------------------
    // COMPRESIÓN
    // ----------------------------------------

    figura.compresionGesto =
        1 -
        (1 - COMPRESION_MAXIMA) *
        progreso;


    // ----------------------------------------
    // INCLINACIÓN
    // ----------------------------------------

    figura.inclinacionDeformacion =
        Math.atan2(
            figura.direccionGestoY,
            figura.direccionGestoX
        );


    // ----------------------------------------
    // LLEGÓ AL MÁXIMO
    // ----------------------------------------

    if (progreso >= 1) {

        if (!figura._yaGeneroHijos) {

            figura._yaGeneroHijos = true;

            crearHijos(figura);

            iniciarRebote(figura);

        }

    }

}


// ============================================================
// CREAR HIJOS
// ============================================================

function crearHijos(padre) {

    if (padre.reproducciones >= 3) {
        return;
    }

    const cantidadHijos = 2;

    const dx = padre.direccionGestoX;

    const dy = padre.direccionGestoY;

    const perpendicularX = -dy;

    const perpendicularY = dx;

    const distancia =
        padre.tamano * 0.95;

    for (let i = 0; i < cantidadHijos; i++) {

        const lado =
            i === 0 ? -1 : 1;

        const hijoX =
            padre.x +
            perpendicularX *
            distancia *
            lado;

        const hijoY =
            padre.y +
            perpendicularY *
            distancia *
            lado;

        const hijo =
            crearFigura(
                hijoX,
                hijoY,
                padre.color,
                padre.tamano * REDUCCION_HIJO
            );


        // ----------------------------------------
        // VELOCIDAD DEL HIJO
        // ----------------------------------------

        hijo.vx =
            padre.vx +
            dx *
            1.1 +
            perpendicularX *
            lado *
            0.45;

        hijo.vy =
            padre.vy +
            dy *
            1.1 +
            perpendicularY *
            lado *
            0.45;


        hijo.rotacion =
            padre.rotacion;

        hijo.reproducciones =
            padre.reproducciones + 1;


        figuras.push(hijo);

    }

    padre.reproducciones++;

}


// ============================================================
// FINALIZAR GESTO
// ============================================================

function finalizarGesto(figura) {

    if (!figura.gesticulando) {
        return;
    }

    figura.gesticulando = false;

    figura.puntosGesto = [];

    // ----------------------------------------
    // SI NO LLEGÓ AL MÁXIMO,
    // TAMBIÉN REBOTA Y RECUPERA LA FORMA
    // ----------------------------------------

    if (!figura._yaGeneroHijos) {

        iniciarRebote(figura);

    }

    figura._yaGeneroHijos = false;

}


// ============================================================
// MOVIMIENTO
// ============================================================

function actualizarMovimiento(figura) {

    if (figura.seleccionada) {
        return;
    }

    figura.x += figura.vx;

    figura.y += figura.vy;

    figura.rotacion +=
        figura.velocidadRotacion;


    // ----------------------------------------
    // TAMAÑO REAL CON RESPIRACIÓN
    // ----------------------------------------

    const ancho =
        figura.tamano *
        figura.respiracionX;

    const alto =
        figura.tamano *
        figura.respiracionY;


    // ----------------------------------------
    // BORDES
    // ----------------------------------------

    const margenX = ancho / 2;

    const margenY = alto / 2;


    if (figura.x - margenX < 0) {

        figura.x = margenX;

        figura.vx =
            Math.abs(figura.vx);

    }


    if (figura.x + margenX > canvas.width) {

        figura.x =
            canvas.width - margenX;

        figura.vx =
            -Math.abs(figura.vx);

    }


    if (figura.y - margenY < 0) {

        figura.y = margenY;

        figura.vy =
            Math.abs(figura.vy);

    }


    if (figura.y + margenY > canvas.height) {

        figura.y =
            canvas.height - margenY;

        figura.vy =
            -Math.abs(figura.vy);

    }

}


// ============================================================
// COLISIONES
// ============================================================

function resolverColisiones() {

    for (let i = 0; i < figuras.length; i++) {

        for (let j = i + 1; j < figuras.length; j++) {

            const a = figuras[i];

            const b = figuras[j];

            const dx = b.x - a.x;

            const dy = b.y - a.y;

            const distancia =
                Math.sqrt(dx * dx + dy * dy);

            const distanciaMinima =
                (
                    a.tamano +
                    b.tamano
                ) / 2;


            if (
                distancia > 0 &&
                distancia < distanciaMinima
            ) {

                const nx =
                    dx / distancia;

                const ny =
                    dy / distancia;

                const diferencia =
                    distanciaMinima -
                    distancia;


                // --------------------------------
                // SEPARAR
                // --------------------------------

                if (!a.seleccionada) {

                    a.x -=
                        nx *
                        diferencia *
                        0.5;

                    a.y -=
                        ny *
                        diferencia *
                        0.5;

                }


                if (!b.seleccionada) {

                    b.x +=
                        nx *
                        diferencia *
                        0.5;

                    b.y +=
                        ny *
                        diferencia *
                        0.5;

                }


                // --------------------------------
                // VELOCIDAD RELATIVA
                // --------------------------------

                const velocidadRelativa =
                    (b.vx - a.vx) * nx +
                    (b.vy - a.vy) * ny;


                if (velocidadRelativa < 0) {

                    const impulso =
                        -velocidadRelativa *
                        FUERZA_CHOQUE;


                    if (!a.seleccionada) {

                        a.vx -=
                            nx * impulso;

                        a.vy -=
                            ny * impulso;

                    }


                    if (!b.seleccionada) {

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
// DIBUJAR CUADRADO DEFORMADO
// ============================================================
//
// ESTA ES LA PARTE MODIFICADA.
//
// En lugar de utilizar fillRect(), se construye una forma
// mediante curvas.
//
// Cuando se estira:
// - el extremo hacia donde se tira se alarga
// - la punta se hace más pequeña
// - los laterales se curvan
// - el lado contrario se comprime
//
// Al terminar el gesto, los valores vuelven progresivamente
// a 1 y la figura vuelve a ser un cuadrado.
// ============================================================

function dibujarCuadradoDeformado(figura) {

    const t = figura.tamano;

    let escalaX = figura.respiracionX;

    let escalaY = figura.respiracionY;


    // ----------------------------------------
    // PROGRESO DEL ESTIRAMIENTO
    // ----------------------------------------

    let progreso = 0;

    if (
        figura.gesticulando &&
        figura.distanciaInicialGesto > 0
    ) {

        progreso =
            (
                figura.distanciaActualGesto -
                figura.distanciaInicialGesto
            ) /
            DISTANCIA_SEPARACION;

    }

    progreso =
        Math.max(0, Math.min(1, progreso));


    // ----------------------------------------
    // REBOTE
    // ----------------------------------------

    let rebote =
        figura.deformacionRebote;


    // ----------------------------------------
    // DEFORMACIÓN TOTAL
    // ----------------------------------------

    let deformacion =
        progreso;


    if (figura.rebotando) {

        deformacion += rebote;

    }


    deformacion =
        Math.max(
            -0.15,
            Math.min(1, deformacion)
        );


    // ----------------------------------------
    // DIRECCIÓN
    // ----------------------------------------

    let angulo =
        figura.gesticulando ||
        figura.rebotando
            ? figura.inclinacionDeformacion
            : 0;


    // ----------------------------------------
    // GUARDAR CONTEXTO
    // ----------------------------------------

    ctx.save();

    ctx.translate(
        figura.x,
        figura.y
    );

    ctx.rotate(
        figura.rotacion
    );


    // ----------------------------------------
    // ROTACIÓN DE LA DEFORMACIÓN
    // ----------------------------------------

    if (
        figura.gesticulando ||
        figura.rebotando
    ) {

        ctx.rotate(
            angulo
        );

    }


    // ----------------------------------------
    // ESCALA
    // ----------------------------------------

    ctx.scale(
        escalaX,
        escalaY
    );


    const mitad =
        t / 2;


    // ----------------------------------------
    // ESTIRAMIENTO
    // ----------------------------------------

    const largo =
        mitad *
        (
            1 +
            deformacion *
            0.85
        );


    // ----------------------------------------
    // ACHICAMIENTO DE LA PUNTA
    // ----------------------------------------
    //
    // Cuanto más se estira, menor es el ancho
    // de la punta.
    //
    // 1     = cuadrado normal
    // 0.75  = punta ligeramente reducida
    // 0.40  = punta bastante fina
    //
    // ----------------------------------------

    const punta =
        mitad *
        (
            1 -
            deformacion *
            0.60
        );


    // ----------------------------------------
    // ANCHO DE LA BASE
    // ----------------------------------------

    const base =
        mitad *
        (
            1 +
            deformacion *
            0.08
        );


    // ----------------------------------------
    // CURVATURA
    // ----------------------------------------

    const curva =
        mitad *
        (
            0.10 +
            deformacion *
            0.25
        );


    // ========================================================
    // GRADIENTE
    // ========================================================

    let gradiente;


    if (figura.color === "#D9D9D9") {

        gradiente =
            ctx.createRadialGradient(
                -mitad * 0.35,
                -mitad * 0.35,
                2,
                0,
                0,
                mitad * 1.5
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

    else if (figura.color === "#8BB2D3") {

        gradiente =
            ctx.createRadialGradient(
                -mitad * 0.35,
                -mitad * 0.35,
                2,
                0,
                0,
                mitad * 1.5
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

    else if (figura.color === "#202D64") {

        gradiente =
            ctx.createRadialGradient(
                -mitad * 0.35,
                -mitad * 0.35,
                2,
                0,
                0,
                mitad * 1.5
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
                -mitad * 0.35,
                -mitad * 0.35,
                2,
                0,
                0,
                mitad * 1.5
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
    // SOMBRA EXTERIOR
    // ========================================================

    if (figura.color === "#D9D9D9") {

        ctx.shadowColor =
            "rgba(217,217,217,0.25)";

    }

    else if (figura.color === "#8BB2D3") {

        ctx.shadowColor =
            "rgba(139,178,211,0.25)";

    }

    else {

        ctx.shadowColor =
            "rgba(43,83,142,0.35)";

    }

    ctx.shadowBlur = 18;

    ctx.shadowOffsetX = 0;

    ctx.shadowOffsetY = 0;


    // ========================================================
    // CREAR FORMA
    // ========================================================

    ctx.beginPath();


    // ----------------------------------------
    // PUNTA DERECHA
    // ----------------------------------------

    ctx.moveTo(
        largo,
        0
    );


    // ----------------------------------------
    // PARTE SUPERIOR
    // ----------------------------------------

    ctx.quadraticCurveTo(
        largo * 0.72,
        -punta,
        0,
        -base
    );


    // ----------------------------------------
    // LADO IZQUIERDO
    // ----------------------------------------

    ctx.quadraticCurveTo(
        -mitad - curva * deformacion,
        -mitad * 0.35,
        -mitad,
        0
    );


    ctx.quadraticCurveTo(
        -mitad - curva * deformacion,
        mitad * 0.35,
        0,
        base
    );


    // ----------------------------------------
    // PARTE INFERIOR
    // ----------------------------------------

    ctx.quadraticCurveTo(
        largo * 0.72,
        punta,
        largo,
        0
    );


    ctx.closePath();


    // ========================================================
    // RELLENO
    // ========================================================

    ctx.fillStyle =
        gradiente;

    ctx.fill();


    // ========================================================
    // SOMBRA INTERNA
    // ========================================================

    ctx.shadowBlur = 0;

    ctx.shadowColor = "transparent";


    const sombra =
        ctx.createLinearGradient(
            -mitad,
            -mitad,
            mitad,
            mitad
        );


    sombra.addColorStop(
        0,
        "rgba(255,255,255,0.22)"
    );

    sombra.addColorStop(
        0.45,
        "rgba(255,255,255,0)"
    );

    sombra.addColorStop(
        1,
        "rgba(0,0,0,0.20)"
    );


    ctx.fillStyle =
        sombra;

    ctx.fill();


    // ========================================================
    // RESTAURAR
    // ========================================================

    ctx.restore();

}


// ============================================================
// DIBUJAR TODAS LAS FIGURAS
// ============================================================

function dibujar() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    for (const figura of figuras) {

        dibujarCuadradoDeformado(figura);

    }

}


// ============================================================
// ACTUALIZAR
// ============================================================

function actualizar() {

    for (const figura of figuras) {

        actualizarRespiracion(figura);

        actualizarRebote(figura);

        actualizarGesto(figura);

        actualizarMovimiento(figura);

    }


    resolverColisiones();

    dibujar();

    requestAnimationFrame(actualizar);

}

actualizar();


// ============================================================
// UTILIDADES DE PUNTO
// ============================================================

function obtenerPunto(evento) {

    const rect =
        canvas.getBoundingClientRect();

    return {

        x:
            evento.clientX -
            rect.left,

        y:
            evento.clientY -
            rect.top

    };

}


// ============================================================
// BUSCAR FIGURA
// ============================================================

function encontrarFigura(x, y) {

    for (
        let i = figuras.length - 1;
        i >= 0;
        i--
    ) {

        const figura = figuras[i];

        const dx =
            x - figura.x;

        const dy =
            y - figura.y;

        const distancia =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (
            distancia <
            figura.tamano
        ) {

            return figura;

        }

    }

    return null;

}


// ============================================================
// MOUSE
// ============================================================

let figuraMouse = null;

let mouseActivo = false;


canvas.addEventListener(
    "mousedown",
    function(evento) {

        const punto =
            obtenerPunto(evento);

        const figura =
            encontrarFigura(
                punto.x,
                punto.y
            );


        if (!figura) {
            return;
        }


        figuraMouse = figura;

        mouseActivo = true;

        figura.seleccionada = true;

        figura.x = punto.x;

        figura.y = punto.y;

    }
);


canvas.addEventListener(
    "mousemove",
    function(evento) {

        if (
            !mouseActivo ||
            !figuraMouse
        ) {
            return;
        }


        const punto =
            obtenerPunto(evento);


        figuraMouse.x =
            punto.x;

        figuraMouse.y =
            punto.y;

    }
);


canvas.addEventListener(
    "mouseup",
    function() {

        if (figuraMouse) {

            figuraMouse.seleccionada =
                false;

        }

        figuraMouse = null;

        mouseActivo = false;

    }
);


canvas.addEventListener(
    "mouseleave",
    function() {

        if (figuraMouse) {

            figuraMouse.seleccionada =
                false;

        }

        figuraMouse = null;

        mouseActivo = false;

    }
);


// ============================================================
// TOUCH
// ============================================================

let figuraTouch = null;


// ------------------------------------------------------------
// TOUCH START
// ------------------------------------------------------------

canvas.addEventListener(
    "touchstart",
    function(evento) {

        evento.preventDefault();

        const touches =
            evento.touches;


        // ----------------------------------------
        // DOS DEDOS
        // ----------------------------------------

        if (touches.length >= 2) {

            const p1 =
                obtenerPunto(
                    touches[0]
                );

            const p2 =
                obtenerPunto(
                    touches[1]
                );


            const figura1 =
                encontrarFigura(
                    p1.x,
                    p1.y
                );

            const figura2 =
                encontrarFigura(
                    p2.x,
                    p2.y
                );


            // ------------------------------------
            // LOS DOS DEDOS TIENEN QUE ESTAR
            // SOBRE EL MISMO CUADRADO
            // ------------------------------------

            if (
                figura1 &&
                figura1 === figura2
            ) {

                figuraTouch =
                    figura1;

                figuraTouch.gesticulando =
                    true;

                figuraTouch.seleccionada =
                    true;

                figuraTouch.puntosGesto = [
                    p1,
                    p2
                ];


                const dx =
                    p2.x - p1.x;

                const dy =
                    p2.y - p1.y;


                figuraTouch.distanciaInicialGesto =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );


                figuraTouch.distanciaActualGesto =
                    figuraTouch.distanciaInicialGesto;

            }


            return;

        }


        // ----------------------------------------
        // UN DEDO
        // ----------------------------------------

        if (touches.length === 1) {

            const punto =
                obtenerPunto(
                    touches[0]
                );


            const figura =
                encontrarFigura(
                    punto.x,
                    punto.y
                );


            if (figura) {

                figuraTouch =
                    figura;

                figuraTouch.seleccionada =
                    true;

                figuraTouch.x =
                    punto.x;

                figuraTouch.y =
                    punto.y;

            }

        }

    },
    {
        passive: false
    }
);


// ------------------------------------------------------------
// TOUCH MOVE
// ------------------------------------------------------------

canvas.addEventListener(
    "touchmove",
    function(evento) {

        evento.preventDefault();

        if (!figuraTouch) {
            return;
        }


        // ----------------------------------------
        // DOS DEDOS
        // ----------------------------------------

        if (
            evento.touches.length >= 2 &&
            figuraTouch.gesticulando
        ) {

            const p1 =
                obtenerPunto(
                    evento.touches[0]
                );

            const p2 =
                obtenerPunto(
                    evento.touches[1]
                );


            figuraTouch.puntosGesto = [
                p1,
                p2
            ];


            return;

        }


        // ----------------------------------------
        // UN DEDO
        // ----------------------------------------

        if (
            evento.touches.length === 1 &&
            !figuraTouch.gesticulando
        ) {

            const punto =
                obtenerPunto(
                    evento.touches[0]
                );


            figuraTouch.x =
                punto.x;

            figuraTouch.y =
                punto.y;

        }

    },
    {
        passive: false
    }
);


// ------------------------------------------------------------
// TOUCH END
// ------------------------------------------------------------

canvas.addEventListener(
    "touchend",
    function(evento) {

        evento.preventDefault();


        if (figuraTouch) {

            finalizarGesto(
                figuraTouch
            );


            figuraTouch.seleccionada =
                false;

        }


        figuraTouch = null;

    },
    {
        passive: false
    }
);


// ============================================================
// TECLADO
// ============================================================

window.addEventListener(
    "keydown",
    function(evento) {

        if (figuras.length === 0) {
            return;
        }


        const figura =
            figuras[0];


        const velocidad =
            8;


        if (evento.key === "ArrowLeft") {

            figura.x -= velocidad;

        }


        if (evento.key === "ArrowRight") {

            figura.x += velocidad;

        }


        if (evento.key === "ArrowUp") {

            figura.y -= velocidad;

        }


        if (evento.key === "ArrowDown") {

            figura.y += velocidad;

        }

    }
);

