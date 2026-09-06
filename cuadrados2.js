
// ============================================================
// HERENCIA
// cuadrados2.js
// ============================================================
//
// INTERACCIÓN:
//
// - Comienzan 4 cuadrados.
// - Se mueven solos.
// - Chocan entre ellos y con los bordes.
//
// CON UN DEDO:
// - Se puede agarrar y mover un cuadrado.
// - No se puede dividir.
//
// CON DOS DEDOS:
// - Los dos dedos deben tocar el mismo cuadrado.
// - Al separar los dedos, el cuadrado se ESTIRA.
// - La deformación aumenta progresivamente.
// - Al llegar a cierta distancia se produce la HERENCIA.
//
// HERENCIA:
// - El padre permanece.
// - Se crean dos hijos.
// - Los hijos heredan color, tamaño y dirección.
// - Los hijos pueden volver a generar hijos.
//
// TECLADO:
// - 1 - 9: seleccionar cuadrado.
// - Flechas: mover cuadrado.
// - A / D: estirar horizontalmente.
// - W / S: estirar verticalmente.
// - ESPACIO: realizar herencia.
// - ESC: cancelar.
//
// ESTÉTICA:
// - Igual a MEMORIA.
// - Cuadrados perfectos.
// - Sin bordes.
// - Sin outline.
// - Sin esquinas redondeadas.
// - Mismos degradados.
// - Mismas sombras.
// - Mismo nivel de brillo.
// ============================================================


// ============================================================
// CANVAS
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
// ARRAY DE FIGURAS
// ============================================================

let figuras = [];


// ============================================================
// GESTO DE DOS DEDOS
// ============================================================

let gestoActivo = false;

let figuraSeleccionada = null;

let dedo1ID = null;

let dedo2ID = null;

let dedo1 = {
    x: 0,
    y: 0
};

let dedo2 = {
    x: 0,
    y: 0
};

let distanciaInicial = 0;


// ============================================================
// MOVIMIENTO CON UN DEDO
// ============================================================

let movimientoUnDedo = false;

let dedoMovimientoID = null;

let desplazamientoDedo = {
    x: 0,
    y: 0
};


// ============================================================
// MOUSE
// ============================================================

let mouseActivo = false;

let mouseFigura = null;

let desplazamientoMouse = {
    x: 0,
    y: 0
};


// ============================================================
// TECLADO
// ============================================================

let figuraTeclado = null;

let tecladoEstirando = false;

let distanciaTeclado = 0;

let anguloTeclado = 0;


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
// CREAR FIGURA
// ============================================================

function crearFigura(
    x,
    y,
    color,
    tamano = TAMANO_INICIAL
) {

    return {

        // ----------------------------------------------------
        // POSICIÓN
        // ----------------------------------------------------

        x: x,
        y: y,


        // ----------------------------------------------------
        // TAMAÑO
        // ----------------------------------------------------

        tamano: tamano,


        // ----------------------------------------------------
        // COLOR
        // ----------------------------------------------------

        color: color,


        // ----------------------------------------------------
        // MOVIMIENTO
        // ----------------------------------------------------

        vx:
            (Math.random() - 0.5) *
            VELOCIDAD,

        vy:
            (Math.random() - 0.5) *
            VELOCIDAD,


        // ----------------------------------------------------
        // ROTACIÓN
        // ----------------------------------------------------

        rotacion:
            Math.random() *
            Math.PI *
            2,

        velocidadRotacion:
            (Math.random() - 0.5) *
            0.004,


        // ----------------------------------------------------
        // RESPIRACIÓN
        // ----------------------------------------------------

        fase:
            Math.random() *
            Math.PI *
            2,

        velocidadRespiracion:
            0.012 +
            Math.random() *
            0.008,

        intensidadRespiracion:
            0.018 +
            Math.random() *
            0.012,


        // ----------------------------------------------------
        // GENERACIÓN
        // ----------------------------------------------------

        generacion: 0,

        reproducciones: 0,


        // ----------------------------------------------------
        // ESTIRAMIENTO
        // ----------------------------------------------------

        estirando: false,

        escalaX: 1,

        escalaY: 1,

        anguloEstiramiento: 0,

        intensidadEstiramiento: 0,

        tension: 0,


        // ----------------------------------------------------
        // APARICIÓN
        // ----------------------------------------------------

        aparicion: 1,

        velocidadAparicion: 0.045,


        // ----------------------------------------------------
        // SELECCIÓN
        // ----------------------------------------------------

        seleccionado: false
    };
}


// ============================================================
// CREAR LAS 4 FIGURAS INICIALES
// ============================================================

function crearFigurasIniciales() {

    figuras = [];


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


// ============================================================
// LIMITAR FIGURA A LOS BORDES
// ============================================================

function limitarFigura(figura) {

    const radio =
        figura.tamano / 2;


    if (
        figura.x - radio < 0
    ) {

        figura.x =
            radio;

        figura.vx =
            Math.abs(
                figura.vx
            );
    }


    if (
        figura.x + radio >
        canvas.width
    ) {

        figura.x =
            canvas.width - radio;

        figura.vx =
            -Math.abs(
                figura.vx
            );
    }


    if (
        figura.y - radio < 0
    ) {

        figura.y =
            radio;

        figura.vy =
            Math.abs(
                figura.vy
            );
    }


    if (
        figura.y + radio >
        canvas.height
    ) {

        figura.y =
            canvas.height - radio;

        figura.vy =
            -Math.abs(
                figura.vy
            );
    }
}


// ============================================================
// ACTUALIZAR MOVIMIENTO
// ============================================================

function actualizarMovimiento() {

    figuras.forEach(
        figura => {

            // ------------------------------------------------
            // FIGURA MANIPULADA
            // ------------------------------------------------

            if (
                figura === figuraSeleccionada &&
                (
                    gestoActivo ||
                    movimientoUnDedo
                )
            ) {

                return;
            }


            if (
                figura === mouseFigura &&
                mouseActivo
            ) {

                return;
            }


            if (
                figura === figuraTeclado
            ) {

                return;
            }


            // ------------------------------------------------
            // MOVIMIENTO AUTOMÁTICO
            // ------------------------------------------------

            figura.x +=
                figura.vx;

            figura.y +=
                figura.vy;


            // ------------------------------------------------
            // MOVIMIENTO ORGÁNICO
            // ------------------------------------------------

            figura.fase +=
                figura.velocidadRespiracion;


            figura.x +=
                Math.sin(
                    figura.fase
                ) * 0.15;


            figura.y +=
                Math.cos(
                    figura.fase * 0.8
                ) * 0.15;


            // ------------------------------------------------
            // ROTACIÓN
            // ------------------------------------------------

            figura.rotacion +=
                figura.velocidadRotacion;


            // ------------------------------------------------
            // APARICIÓN
            // ------------------------------------------------

            if (
                figura.aparicion < 1
            ) {

                figura.aparicion +=
                    figura.velocidadAparicion;

                if (
                    figura.aparicion > 1
                ) {

                    figura.aparicion = 1;
                }
            }


            limitarFigura(figura);
        }
    );
}


// ============================================================
// COLISIONES
// ============================================================

function detectarColisiones() {

    for (
        let i = 0;
        i < figuras.length;
        i++
    ) {

        for (
            let j = i + 1;
            j < figuras.length;
            j++
        ) {

            const a =
                figuras[i];

            const b =
                figuras[j];


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
                (
                    a.tamano +
                    b.tamano
                ) / 2;


            if (
                distancia <
                distanciaMinima &&
                distancia > 0
            ) {

                const nx =
                    dx / distancia;

                const ny =
                    dy / distancia;


                const solapamiento =
                    distanciaMinima -
                    distancia;


                a.x -=
                    nx *
                    solapamiento *
                    0.5;

                a.y -=
                    ny *
                    solapamiento *
                    0.5;


                b.x +=
                    nx *
                    solapamiento *
                    0.5;

                b.y +=
                    ny *
                    solapamiento *
                    0.5;


                const velocidadAX =
                    a.vx;

                const velocidadAY =
                    a.vy;


                a.vx =
                    b.vx *
                    0.92;

                a.vy =
                    b.vy *
                    0.92;


                b.vx =
                    velocidadAX *
                    0.92;

                b.vy =
                    velocidadAY *
                    0.92;


                a.vx -=
                    nx *
                    FUERZA_CHOQUE *
                    0.15;

                a.vy -=
                    ny *
                    FUERZA_CHOQUE *
                    0.15;


                b.vx +=
                    nx *
                    FUERZA_CHOQUE *
                    0.15;

                b.vy +=
                    ny *
                    FUERZA_CHOQUE *
                    0.15;


                limitarFigura(a);

                limitarFigura(b);
            }
        }
    }
}


// ============================================================
// BUSCAR FIGURA
// ============================================================

function buscarFigura(x, y) {

    for (
        let i = figuras.length - 1;
        i >= 0;
        i--
    ) {

        const figura =
            figuras[i];


        const mitad =
            figura.tamano / 2;


        if (
            x >= figura.x - mitad &&
            x <= figura.x + mitad &&
            y >= figura.y - mitad &&
            y <= figura.y + mitad
        ) {

            return figura;
        }
    }


    return null;
}


// ============================================================
// DISTANCIA ENTRE DEDOS
// ============================================================

function calcularDistancia() {

    const dx =
        dedo2.x -
        dedo1.x;

    const dy =
        dedo2.y -
        dedo1.y;


    return Math.sqrt(
        dx * dx +
        dy * dy
    );
}


// ============================================================
// OBTENER TOUCH
// ============================================================

function obtenerTouch(touch) {

    const rect =
        canvas.getBoundingClientRect();


    return {

        x:
            touch.clientX -
            rect.left,

        y:
            touch.clientY -
            rect.top
    };
}


// ============================================================
// COMENZAR GESTO DE DOS DEDOS
// ============================================================

function comenzarGesto() {

    const figura1 =
        buscarFigura(
            dedo1.x,
            dedo1.y
        );


    const figura2 =
        buscarFigura(
            dedo2.x,
            dedo2.y
        );


    // Los dos dedos deben tocar
    // exactamente el mismo cuadrado.

    if (
        !figura1 ||
        !figura2 ||
        figura1 !== figura2
    ) {

        return;
    }


    figuraSeleccionada =
        figura1;


    distanciaInicial =
        calcularDistancia();


    gestoActivo =
        true;


    movimientoUnDedo =
        false;


    figuraSeleccionada.estirando =
        true;


    figuraSeleccionada.seleccionado =
        true;
}


// ============================================================
// ACTUALIZAR GESTO
// ============================================================

function actualizarGesto() {

    if (
        !gestoActivo ||
        !figuraSeleccionada
    ) {

        return;
    }


    const distanciaActual =
        calcularDistancia();


    const aumento =
        Math.max(
            0,
            distanciaActual -
            distanciaInicial
        );


    // --------------------------------------------------------
    // PROGRESO
    // --------------------------------------------------------

    let progreso =
        aumento /
        DISTANCIA_SEPARACION;


    progreso =
        Math.max(
            0,
            Math.min(
                1,
                progreso
            )
        );


    // --------------------------------------------------------
    // ESTIRAMIENTO
    // --------------------------------------------------------

    const escala =
        1 +
        progreso *
        0.65;


    const angulo =
        Math.atan2(
            dedo2.y -
            dedo1.y,

            dedo2.x -
            dedo1.x
        );


    figuraSeleccionada.escalaX =
        escala;


    figuraSeleccionada.escalaY =
        1 -
        progreso *
        0.12;


    figuraSeleccionada.anguloEstiramiento =
        angulo;


    figuraSeleccionada.intensidadEstiramiento =
        progreso;


    figuraSeleccionada.tension =
        progreso;


    // --------------------------------------------------------
    // HERENCIA
    // --------------------------------------------------------

    if (
        distanciaActual >=
        DISTANCIA_SEPARACION
    ) {

        crearHijos(
            figuraSeleccionada
        );
    }
}


// ============================================================
// CREAR HIJOS
// ============================================================

function crearHijos(padre) {

    if (!padre) {
        return;
    }


    // --------------------------------------------------------
    // DIRECCIÓN ENTRE LOS DEDOS
    // --------------------------------------------------------

    const dx =
        dedo2.x -
        dedo1.x;

    const dy =
        dedo2.y -
        dedo1.y;


    const distancia =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    let nx = 1;

    let ny = 0;


    if (
        distancia > 0
    ) {

        nx =
            dx / distancia;

        ny =
            dy / distancia;
    }


    // --------------------------------------------------------
    // TAMAÑO HEREDADO
    // --------------------------------------------------------

    const tamanoHijo =
        padre.tamano *
        REDUCCION_HIJO;


    // --------------------------------------------------------
    // SEPARACIÓN
    // --------------------------------------------------------

    const distanciaHijo =
        padre.tamano *
        0.48;


    let x1 =
        padre.x -
        nx *
        distanciaHijo;


    let y1 =
        padre.y -
        ny *
        distanciaHijo;


    let x2 =
        padre.x +
        nx *
        distanciaHijo;


    let y2 =
        padre.y +
        ny *
        distanciaHijo;


    // --------------------------------------------------------
    // LIMITAR HIJOS
    // --------------------------------------------------------

    const radio =
        tamanoHijo / 2;


    x1 =
        Math.max(
            radio,
            Math.min(
                canvas.width - radio,
                x1
            )
        );


    y1 =
        Math.max(
            radio,
            Math.min(
                canvas.height - radio,
                y1
            )
        );


    x2 =
        Math.max(
            radio,
            Math.min(
                canvas.width - radio,
                x2
            )
        );


    y2 =
        Math.max(
            radio,
            Math.min(
                canvas.height - radio,
                y2
            )
        );


    // ========================================================
    // HIJO 1
    // ========================================================

    const hijo1 =
        crearFigura(
            x1,
            y1,
            padre.color,
            tamanoHijo
        );


    hijo1.generacion =
        padre.generacion + 1;


    // Hereda la dirección del padre
    // y recibe impulso hacia atrás.

    hijo1.vx =
        padre.vx -
        nx *
        1.1;

    hijo1.vy =
        padre.vy -
        ny *
        1.1;


    // ========================================================
    // HIJO 2
    // ========================================================

    const hijo2 =
        crearFigura(
            x2,
            y2,
            padre.color,
            tamanoHijo
        );


    hijo2.generacion =
        padre.generacion + 1;


    // Hereda la dirección del padre
    // y recibe impulso hacia adelante.

    hijo2.vx =
        padre.vx +
        nx *
        1.1;

    hijo2.vy =
        padre.vy +
        ny *
        1.1;


    // ========================================================
    // AGREGAR HIJOS
    // ========================================================

    figuras.push(
        hijo1,
        hijo2
    );


    // ========================================================
    // RESTAURAR PADRE
    // ========================================================

    padre.estirando =
        false;

    padre.escalaX =
        1;

    padre.escalaY =
        1;

    padre.intensidadEstiramiento =
        0;

    padre.tension =
        0;

    padre.seleccionado =
        false;


    padre.reproducciones++;


    // ========================================================
    // FINALIZAR GESTO
    // ========================================================

    gestoActivo =
        false;

    figuraSeleccionada =
        null;

    dedo1ID =
        null;

    dedo2ID =
        null;
}


// ============================================================
// CANCELAR GESTO
// ============================================================

function cancelarGesto() {

    if (
        figuraSeleccionada
    ) {

        figuraSeleccionada.estirando =
            false;

        figuraSeleccionada.escalaX =
            1;

        figuraSeleccionada.escalaY =
            1;

        figuraSeleccionada.intensidadEstiramiento =
            0;

        figuraSeleccionada.tension =
            0;

        figuraSeleccionada.seleccionado =
            false;
    }


    gestoActivo =
        false;

    movimientoUnDedo =
        false;

    figuraSeleccionada =
        null;

    dedo1ID =
        null;

    dedo2ID =
        null;
}


// ============================================================
// GRADIENTE
// EXACTAMENTE IGUAL A MEMORIA
// ============================================================

function crearGradiente(figura) {

    const tamano =
        figura.tamano;


    const gradiente =
        ctx.createRadialGradient(

            -tamano * 0.20,
            -tamano * 0.25,
            tamano * 0.05,

            tamano * 0.10,
            tamano * 0.10,
            tamano * 0.85
        );


    // ========================================================
    // BLANCO / GRIS
    // ========================================================

    if (
        figura.color === "#D9D9D9"
    ) {

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


    // ========================================================
    // CELESTE
    // ========================================================

    else if (
        figura.color === "#8BB2D3"
    ) {

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


    // ========================================================
    // AZUL OSCURO
    // ========================================================

    else if (
        figura.color === "#202D64"
    ) {

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


    // ========================================================
    // AZUL
    // ========================================================

    else if (
        figura.color === "#2B538E"
    ) {

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


    return gradiente;
}


// ============================================================
// DIBUJAR FIGURA
// ============================================================

function dibujarFigura(figura) {

    ctx.save();


    // --------------------------------------------------------
    // CENTRO
    // --------------------------------------------------------

    ctx.translate(
        figura.x,
        figura.y
    );


    // --------------------------------------------------------
    // RESPIRACIÓN
    // --------------------------------------------------------

    const respiracion =
        1 +
        Math.sin(
            figura.fase
        ) *
        figura.intensidadRespiracion;


    // --------------------------------------------------------
    // ROTACIÓN
    // --------------------------------------------------------

    ctx.rotate(
        figura.rotacion
    );


    // --------------------------------------------------------
    // ESTIRAMIENTO
    // --------------------------------------------------------

    if (
        figura.estirando
    ) {

        ctx.rotate(
            figura.anguloEstiramiento -
            figura.rotacion
        );


        ctx.scale(
            figura.escalaX *
            respiracion,

            figura.escalaY *
            respiracion
        );
    }

    else {

        ctx.scale(
            respiracion,
            respiracion
        );
    }


    // --------------------------------------------------------
    // OPACIDAD
    // --------------------------------------------------------

    ctx.globalAlpha =
        figura.aparicion;


    // ========================================================
    // SOMBRA / BRILLO
    // EXACTAMENTE IGUAL A MEMORIA
    // ========================================================

    if (
        figura.color === "#D9D9D9"
    ) {

        ctx.shadowColor =
            "rgba(217,217,217,0.25)";

        ctx.shadowBlur =
            18;

        ctx.shadowOffsetX =
            0;

        ctx.shadowOffsetY =
            0;
    }

    else if (
        figura.color === "#8BB2D3"
    ) {

        ctx.shadowColor =
            "rgba(139,178,211,0.25)";

        ctx.shadowBlur =
            18;

        ctx.shadowOffsetX =
            0;

        ctx.shadowOffsetY =
            0;
    }

    else if (
        figura.color === "#202D64"
    ) {

        ctx.shadowColor =
            "rgba(32,45,100,0.35)";

        ctx.shadowBlur =
            18;

        ctx.shadowOffsetX =
            0;

        ctx.shadowOffsetY =
            0;
    }

    else if (
        figura.color === "#2B538E"
    ) {

        ctx.shadowColor =
            "rgba(43,83,142,0.35)";

        ctx.shadowBlur =
            18;

        ctx.shadowOffsetX =
            0;

        ctx.shadowOffsetY =
            0;
    }


    // --------------------------------------------------------
    // DEGRADADO
    // --------------------------------------------------------

    ctx.fillStyle =
        crearGradiente(figura);


    // --------------------------------------------------------
    // CUADRADO
    // --------------------------------------------------------

    const mitad =
        figura.tamano / 2;


    ctx.fillRect(
        -mitad,
        -mitad,
        figura.tamano,
        figura.tamano
    );


    // --------------------------------------------------------
    // QUITAR SOMBRA ANTES DE LA CAPA INTERNA
    // --------------------------------------------------------

    ctx.shadowBlur =
        0;


    // ========================================================
    // SOMBRA INTERNA / PROFUNDIDAD
    // BASADA EN MEMORIA
    // ========================================================

    let sombraInterna;


    if (
        figura.color === "#D9D9D9"
    ) {

        sombraInterna =
            ctx.createLinearGradient(
                -mitad,
                -mitad,
                mitad,
                mitad
            );

        sombraInterna.addColorStop(
            0,
            "rgba(255,255,255,0.35)"
        );

        sombraInterna.addColorStop(
            0.45,
            "rgba(255,255,255,0)"
        );

        sombraInterna.addColorStop(
            1,
            "rgba(0,0,0,0.12)"
        );
    }

    else if (
        figura.color === "#8BB2D3"
    ) {

        sombraInterna =
            ctx.createLinearGradient(
                -mitad,
                -mitad,
                mitad,
                mitad
            );

        sombraInterna.addColorStop(
            0,
            "rgba(255,255,255,0.25)"
        );

        sombraInterna.addColorStop(
            0.45,
            "rgba(255,255,255,0)"
        );

        sombraInterna.addColorStop(
            1,
            "rgba(0,0,0,0.15)"
        );
    }

    else if (
        figura.color === "#202D64"
    ) {

        sombraInterna =
            ctx.createLinearGradient(
                -mitad,
                -mitad,
                mitad,
                mitad
            );

        sombraInterna.addColorStop(
            0,
            "rgba(255,255,255,0.15)"
        );

        sombraInterna.addColorStop(
            0.45,
            "rgba(255,255,255,0)"
        );

        sombraInterna.addColorStop(
            1,
            "rgba(0,0,0,0.25)"
        );
    }

    else {

        sombraInterna =
            ctx.createLinearGradient(
                -mitad,
                -mitad,
                mitad,
                mitad
            );

        sombraInterna.addColorStop(
            0,
            "rgba(255,255,255,0.18)"
        );

        sombraInterna.addColorStop(
            0.45,
            "rgba(255,255,255,0)"
        );

        sombraInterna.addColorStop(
            1,
            "rgba(0,0,0,0.25)"
        );
    }


    ctx.fillStyle =
        sombraInterna;


    ctx.fillRect(
        -mitad,
        -mitad,
        figura.tamano,
        figura.tamano
    );


    // ========================================================
    // SELECCIÓN
    // ========================================================
    //
    // NO SE DIBUJA NINGÚN BORDE.
    //
    // La selección se comunica solamente mediante
    // el comportamiento de estiramiento.
    // ========================================================


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


    figuras.forEach(
        dibujarFigura
    );
}


// ============================================================
// TOUCHSTART
// ============================================================

canvas.addEventListener(
    "touchstart",
    function(evento) {

        evento.preventDefault();


        // ====================================================
        // DOS DEDOS
        // ====================================================

        if (
            evento.touches.length === 2
        ) {

            movimientoUnDedo =
                false;


            const touch1 =
                evento.touches[0];

            const touch2 =
                evento.touches[1];


            dedo1ID =
                touch1.identifier;

            dedo2ID =
                touch2.identifier;


            dedo1 =
                obtenerTouch(touch1);

            dedo2 =
                obtenerTouch(touch2);


            comenzarGesto();


            return;
        }


        // ====================================================
        // UN DEDO
        // ====================================================

        if (
            evento.touches.length === 1
        ) {

            const touch =
                evento.touches[0];


            const posicion =
                obtenerTouch(touch);


            const figura =
                buscarFigura(
                    posicion.x,
                    posicion.y
                );


            if (!figura) {
                return;
            }


            figuraSeleccionada =
                figura;


            movimientoUnDedo =
                true;


            dedoMovimientoID =
                touch.identifier;


            desplazamientoDedo.x =
                posicion.x -
                figura.x;


            desplazamientoDedo.y =
                posicion.y -
                figura.y;


            figura.seleccionado =
                true;
        }

    },
    {
        passive: false
    }
);


// ============================================================
// TOUCHMOVE
// ============================================================

canvas.addEventListener(
    "touchmove",
    function(evento) {

        evento.preventDefault();


        // ====================================================
        // DOS DEDOS
        // ====================================================

        if (
            gestoActivo
        ) {

            for (
                let i = 0;
                i < evento.touches.length;
                i++
            ) {

                const touch =
                    evento.touches[i];


                if (
                    touch.identifier ===
                    dedo1ID
                ) {

                    dedo1 =
                        obtenerTouch(touch);
                }


                if (
                    touch.identifier ===
                    dedo2ID
                ) {

                    dedo2 =
                        obtenerTouch(touch);
                }
            }


            actualizarGesto();


            return;
        }


        // ====================================================
        // UN DEDO
        // ====================================================

        if (
            movimientoUnDedo &&
            figuraSeleccionada
        ) {

            for (
                let i = 0;
                i < evento.touches.length;
                i++
            ) {

                const touch =
                    evento.touches[i];


                if (
                    touch.identifier ===
                    dedoMovimientoID
                ) {

                    const posicion =
                        obtenerTouch(touch);


                    figuraSeleccionada.x =
                        posicion.x -
                        desplazamientoDedo.x;


                    figuraSeleccionada.y =
                        posicion.y -
                        desplazamientoDedo.y;


                    limitarFigura(
                        figuraSeleccionada
                    );
                }
            }
        }

    },
    {
        passive: false
    }
);


// ============================================================
// TOUCHEND
// ============================================================

canvas.addEventListener(
    "touchend",
    function(evento) {

        evento.preventDefault();


        if (
            gestoActivo &&
            evento.touches.length >= 2
        ) {

            return;
        }


        if (
            gestoActivo
        ) {

            cancelarGesto();

            return;
        }


        if (
            movimientoUnDedo
        ) {

            if (
                figuraSeleccionada
            ) {

                figuraSeleccionada.seleccionado =
                    false;
            }


            movimientoUnDedo =
                false;

            figuraSeleccionada =
                null;

            dedoMovimientoID =
                null;
        }

    },
    {
        passive: false
    }
);


// ============================================================
// TOUCHCANCEL
// ============================================================

canvas.addEventListener(
    "touchcancel",
    function(evento) {

        evento.preventDefault();

        cancelarGesto();

    },
    {
        passive: false
    }
);


// ============================================================
// MOUSE
// ============================================================
//
// El mouse funciona como un dedo.
// Solo permite mover.
// ============================================================

canvas.addEventListener(
    "mousedown",
    function(evento) {

        const rect =
            canvas.getBoundingClientRect();


        const x =
            evento.clientX -
            rect.left;

        const y =
            evento.clientY -
            rect.top;


        const figura =
            buscarFigura(
                x,
                y
            );


        if (!figura) {
            return;
        }


        mouseActivo =
            true;


        mouseFigura =
            figura;


        desplazamientoMouse.x =
            x -
            figura.x;


        desplazamientoMouse.y =
            y -
            figura.y;


        figura.seleccionado =
            true;
    }
);


canvas.addEventListener(
    "mousemove",
    function(evento) {

        if (
            !mouseActivo ||
            !mouseFigura
        ) {

            return;
        }


        const rect =
            canvas.getBoundingClientRect();


        const x =
            evento.clientX -
            rect.left;

        const y =
            evento.clientY -
            rect.top;


        mouseFigura.x =
            x -
            desplazamientoMouse.x;


        mouseFigura.y =
            y -
            desplazamientoMouse.y;


        limitarFigura(
            mouseFigura
        );
    }
);


canvas.addEventListener(
    "mouseup",
    function() {

        if (
            mouseFigura
        ) {

            mouseFigura.seleccionado =
                false;
        }


        mouseActivo =
            false;

        mouseFigura =
            null;
    }
);


canvas.addEventListener(
    "mouseleave",
    function() {

        if (
            mouseFigura
        ) {

            mouseFigura.seleccionado =
                false;
        }


        mouseActivo =
            false;

        mouseFigura =
            null;
    }
);


// ============================================================
// TECLADO
// ============================================================

document.addEventListener(
    "keydown",
    function(evento) {

        const tecla =
            evento.key.toLowerCase();


        // ====================================================
        // SELECCIONAR FIGURA
        // ====================================================

        if (
            tecla >= "1" &&
            tecla <= "9"
        ) {

            const indice =
                parseInt(tecla) - 1;


            if (
                figuras[indice]
            ) {

                if (
                    figuraTeclado
                ) {

                    figuraTeclado.seleccionado =
                        false;
                }


                figuraTeclado =
                    figuras[indice];


                figuraTeclado.seleccionado =
                    true;


                tecladoEstirando =
                    false;

                distanciaTeclado =
                    0;
            }


            return;
        }


        if (
            !figuraTeclado
        ) {

            return;
        }


        // ====================================================
        // MOVER
        // ====================================================

        const velocidadTeclado =
            4;


        if (
            tecla === "arrowleft"
        ) {

            figuraTeclado.x -=
                velocidadTeclado;
        }


        if (
            tecla === "arrowright"
        ) {

            figuraTeclado.x +=
                velocidadTeclado;
        }


        if (
            tecla === "arrowup"
        ) {

            figuraTeclado.y -=
                velocidadTeclado;
        }


        if (
            tecla === "arrowdown"
        ) {

            figuraTeclado.y +=
                velocidadTeclado;
        }


        // ====================================================
        // ESTIRAMIENTO
        // ====================================================

        if (
            tecla === "a"
        ) {

            tecladoEstirando =
                true;

            distanciaTeclado +=
                8;

            anguloTeclado =
                Math.PI;
        }


        if (
            tecla === "d"
        ) {

            tecladoEstirando =
                true;

            distanciaTeclado +=
                8;

            anguloTeclado =
                0;
        }


        if (
            tecla === "w"
        ) {

            tecladoEstirando =
                true;

            distanciaTeclado +=
                8;

            anguloTeclado =
                -Math.PI / 2;
        }


        if (
            tecla === "s"
        ) {

            tecladoEstirando =
                true;

            distanciaTeclado +=
                8;

            anguloTeclado =
                Math.PI / 2;
        }


        // ====================================================
        // VISUAL DE ESTIRAMIENTO
        // ====================================================

        if (
            tecladoEstirando
        ) {

            const progreso =
                Math.min(
                    1,
                    distanciaTeclado /
                    DISTANCIA_SEPARACION
                );


            figuraTeclado.estirando =
                true;


            figuraTeclado.escalaX =
                1 +
                progreso *
                0.65;


            figuraTeclado.escalaY =
                1 -
                progreso *
                0.12;


            figuraTeclado.anguloEstiramiento =
                anguloTeclado;


            figuraTeclado.intensidadEstiramiento =
                progreso;


            figuraTeclado.tension =
                progreso;
        }


        // ====================================================
        // ESPACIO = HERENCIA
        // ====================================================

        if (
            tecla === " "
        ) {

            if (
                tecladoEstirando &&
                distanciaTeclado >=
                DISTANCIA_SEPARACION
            ) {

                // Para que crearHijos pueda calcular
                // correctamente la dirección del teclado.

                const distancia =
                    DISTANCIA_SEPARACION;


                dedo1.x =
                    figuraTeclado.x -
                    Math.cos(
                        anguloTeclado
                    ) *
                    distancia /
                    2;


                dedo1.y =
                    figuraTeclado.y -
                    Math.sin(
                        anguloTeclado
                    ) *
                    distancia /
                    2;


                dedo2.x =
                    figuraTeclado.x +
                    Math.cos(
                        anguloTeclado
                    ) *
                    distancia /
                    2;


                dedo2.y =
                    figuraTeclado.y +
                    Math.sin(
                        anguloTeclado
                    ) *
                    distancia /
                    2;


                crearHijos(
                    figuraTeclado
                );


                tecladoEstirando =
                    false;

                distanciaTeclado =
                    0;

                figuraTeclado =
                    null;
            }
        }


        // ====================================================
        // ESC = CANCELAR
        // ====================================================

        if (
            tecla === "escape"
        ) {

            if (
                figuraTeclado
            ) {

                figuraTeclado.estirando =
                    false;

                figuraTeclado.escalaX =
                    1;

                figuraTeclado.escalaY =
                    1;

                figuraTeclado.tension =
                    0;

                figuraTeclado.intensidadEstiramiento =
                    0;

                figuraTeclado.seleccionado =
                    false;
            }


            tecladoEstirando =
                false;

            distanciaTeclado =
                0;

            figuraTeclado =
                null;
        }


        if (
            figuraTeclado
        ) {

            limitarFigura(
                figuraTeclado
            );
        }
    }
);


// ============================================================
// ANIMACIÓN
// ============================================================

function animar() {

    actualizarMovimiento();

    detectarColisiones();

    dibujar();

    requestAnimationFrame(
        animar
    );
}


// ============================================================
// INICIO
// ============================================================

ajustarCanvas();

crearFigurasIniciales();

animar();


// ============================================================
// RESIZE
// ============================================================

window.addEventListener(
    "resize",
    function() {

        ajustarCanvas();


        figuras.forEach(
            limitarFigura
        );
    }
);

