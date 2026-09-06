
// ============================================================
// HERENCIA
// cuadrados2.js
// ============================================================
//
// INTERACCIÓN:
// - Comienzan 4 cuadrados.
// - Se mueven solos.
// - Chocan entre ellos y con los bordes.
// - Respiran de manera lenta, visible y orgánica.
// - Con 1 dedo / mouse se puede mover un cuadrado.
// - Con 2 dedos sobre el mismo cuadrado se puede estirar.
// - Al separar suficientemente los dedos, el cuadrado se divide.
// - El padre permanece.
// - Los hijos heredan el color y características del padre.
// - Los hijos también pueden volver a dividirse.
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
// FIGURAS
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
// MOUSE
// ============================================================

let mouseActivo = false;

let figuraMouse = null;

let offsetMouseX = 0;
let offsetMouseY = 0;


// ============================================================
// AJUSTAR CANVAS
// ============================================================

function ajustarCanvas() {

    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;
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

        vx: (Math.random() - 0.5) * VELOCIDAD,
        vy: (Math.random() - 0.5) * VELOCIDAD,

        // ----------------------------------------------------
        // ROTACIÓN
        // ----------------------------------------------------

        rotacion: Math.random() * Math.PI * 2,

        velocidadRotacion:
            (Math.random() - 0.5) * 0.004,

        // ----------------------------------------------------
        // MOVIMIENTO ORGÁNICO
        // ----------------------------------------------------

        fase:
            Math.random() * Math.PI * 2,

        // ----------------------------------------------------
        // RESPIRACIÓN
        // ----------------------------------------------------

       faseRespiracion:
    Math.random() * Math.PI * 2,

faseSecundaria:
    Math.random() * Math.PI * 2,

velocidadRespiracion:
    0.012 + Math.random() * 0.05,

amplitudRespiracion:
    0.045 + Math.random() * 0.015,

respiracionX: 1,
respiracionY: 1,
        // ----------------------------------------------------
        // HERENCIA
        // ----------------------------------------------------

        generacion: 0,

        reproducciones: 0,

        // ----------------------------------------------------
        // ESTIRAMIENTO
        // ----------------------------------------------------

        estirando: false,

        escalaX: 1,

        escalaY: 1,

        anguloEstiramiento: 0

    };
}


// ============================================================
// CREAR FIGURAS INICIALES
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

    const radio = figura.tamano / 2;

    if (figura.x - radio < 0) {

        figura.x = radio;

        figura.vx *= -1;
    }

    if (figura.x + radio > canvas.width) {

        figura.x = canvas.width - radio;

        figura.vx *= -1;
    }

    if (figura.y - radio < 0) {

        figura.y = radio;

        figura.vy *= -1;
    }

    if (figura.y + radio > canvas.height) {

        figura.y = canvas.height - radio;

        figura.vy *= -1;
    }
}


// ============================================================
// RESPIRACIÓN
// ============================================================

function actualizarRespiracion(figura) {

    // --------------------------------------------------------
    // Avanza lentamente la respiración
    // --------------------------------------------------------

    figura.faseRespiracion +=
        figura.velocidadRespiracion;

    figura.faseSecundaria +=
        figura.velocidadRespiracion * 0.47;


    // --------------------------------------------------------
    // Onda principal
    // --------------------------------------------------------

    const ondaPrincipal =
        Math.sin(figura.faseRespiracion);


    // --------------------------------------------------------
    // Onda secundaria
    // --------------------------------------------------------

    const ondaSecundaria =
        Math.sin(figura.faseSecundaria);


    // --------------------------------------------------------
    // RESPIRACIÓN
    //
    // 6% - 7.5% de cambio de tamaño.
    //
    // Es suficientemente visible,
    // pero sigue siendo lenta.
    // --------------------------------------------------------

    const respiracion =
        ondaPrincipal * figura.amplitudRespiracion +
        ondaSecundaria * 0.008;


    // --------------------------------------------------------
    // X y Y ligeramente diferentes
    //
    // Esto evita que parezca simplemente un zoom.
    // --------------------------------------------------------

    figura.respiracionX =
        1 + respiracion;

    figura.respiracionY =
        1 + respiracion * 0.82;
}


// ============================================================
// ACTUALIZAR MOVIMIENTO
// ============================================================

function actualizarMovimiento() {

    figuras.forEach(figura => {

        // ----------------------------------------------------
        // Si está siendo controlada por dos dedos,
        // no hacemos movimiento automático.
        // ----------------------------------------------------

        if (
            figura === figuraSeleccionada &&
            gestoActivo
        ) {

            actualizarRespiracion(figura);

            return;
        }


        // ----------------------------------------------------
        // Si está siendo controlada con mouse,
        // tampoco hacemos movimiento automático.
        // ----------------------------------------------------

        if (
            figura === figuraMouse &&
            mouseActivo
        ) {

            actualizarRespiracion(figura);

            return;
        }


        // ----------------------------------------------------
        // Movimiento normal
        // ----------------------------------------------------

        figura.x += figura.vx;

        figura.y += figura.vy;


        // ----------------------------------------------------
        // Movimiento orgánico
        // ----------------------------------------------------

        figura.fase += 0.015;


        figura.x +=
            Math.sin(figura.fase) * 0.15;


        figura.y +=
            Math.cos(figura.fase * 0.8) * 0.15;


        // ----------------------------------------------------
        // Rotación
        // ----------------------------------------------------

        figura.rotacion +=
            figura.velocidadRotacion;


        // ----------------------------------------------------
        // Respiración
        // ----------------------------------------------------

        actualizarRespiracion(figura);


        // ----------------------------------------------------
        // Bordes
        // ----------------------------------------------------

        limitarFigura(figura);

    });
}


// ============================================================
// DETECTAR COLISIONES
// ============================================================

function detectarColisiones() {

    for (let i = 0; i < figuras.length; i++) {

        for (let j = i + 1; j < figuras.length; j++) {

            const a = figuras[i];

            const b = figuras[j];


            // ------------------------------------------------
            // Distancia
            // ------------------------------------------------

            const dx = b.x - a.x;

            const dy = b.y - a.y;

            const distancia =
                Math.sqrt(dx * dx + dy * dy);


            // ------------------------------------------------
            // Distancia mínima
            // ------------------------------------------------

            const distanciaMinima =
                (a.tamano + b.tamano) / 2;


            // ------------------------------------------------
            // Hay choque
            // ------------------------------------------------

            if (
                distancia < distanciaMinima &&
                distancia > 0
            ) {

                const nx =
                    dx / distancia;

                const ny =
                    dy / distancia;


                const solapamiento =
                    distanciaMinima - distancia;


                // ------------------------------------------------
                // Separar figuras
                // ------------------------------------------------

                a.x -=
                    nx * solapamiento * 0.5;

                a.y -=
                    ny * solapamiento * 0.5;


                b.x +=
                    nx * solapamiento * 0.5;

                b.y +=
                    ny * solapamiento * 0.5;


                // ------------------------------------------------
                // Fuerza de choque
                // ------------------------------------------------

                a.vx -=
                    nx * FUERZA_CHOQUE;

                a.vy -=
                    ny * FUERZA_CHOQUE;


                b.vx +=
                    nx * FUERZA_CHOQUE;

                b.vy +=
                    ny * FUERZA_CHOQUE;


                // ------------------------------------------------
                // Volver a limitar
                // ------------------------------------------------

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

        const figura = figuras[i];


        // ----------------------------------------------------
        // Consideramos también la respiración
        // para que la zona táctil acompañe el tamaño.
        // ----------------------------------------------------

        const mitad =
            (figura.tamano / 2) *
            Math.max(
                figura.respiracionX,
                figura.respiracionY
            );


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
// CALCULAR DISTANCIA ENTRE LOS DOS DEDOS
// ============================================================

function calcularDistancia() {

    const dx =
        dedo2.x - dedo1.x;

    const dy =
        dedo2.y - dedo1.y;


    return Math.sqrt(
        dx * dx +
        dy * dy
    );
}


// ============================================================
// CONVERTIR TOUCH A POSICIÓN DEL CANVAS
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
// COMENZAR GESTO
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


    // --------------------------------------------------------
    // Los dos dedos deben estar sobre la misma figura
    // --------------------------------------------------------

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


    gestoActivo = true;


    figuraSeleccionada.estirando =
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


    // --------------------------------------------------------
    // Distancia actual
    // --------------------------------------------------------

    const distanciaActual =
        calcularDistancia();


    // --------------------------------------------------------
    // Cuánto se separaron
    // --------------------------------------------------------

    const aumento =
        Math.max(
            0,
            distanciaActual -
            distanciaInicial
        );


    // --------------------------------------------------------
    // Estiramiento
    // --------------------------------------------------------

    let escala =
        1 +
        aumento /
        DISTANCIA_SEPARACION *
        0.65;


    escala =
        Math.min(
            escala,
            1.65
        );


    // --------------------------------------------------------
    // Dirección del estiramiento
    // --------------------------------------------------------

    const angulo =
        Math.atan2(
            dedo2.y - dedo1.y,
            dedo2.x - dedo1.x
        );


    figuraSeleccionada.escalaX =
        escala;

    figuraSeleccionada.escalaY =
        1;

    figuraSeleccionada.anguloEstiramiento =
        angulo;


    // --------------------------------------------------------
    // Crear hijos
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
    // Dirección entre los dedos
    // --------------------------------------------------------

    const dx =
        dedo2.x - dedo1.x;

    const dy =
        dedo2.y - dedo1.y;


    const distancia =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    let nx = 1;

    let ny = 0;


    if (distancia > 0) {

        nx =
            dx / distancia;

        ny =
            dy / distancia;
    }


    // --------------------------------------------------------
    // Tamaño de los hijos
    // --------------------------------------------------------

    const tamanoHijo =
        padre.tamano *
        REDUCCION_HIJO;


    // --------------------------------------------------------
    // Separación inicial
    // --------------------------------------------------------

    const distanciaHijo = 35;


    let x1 =
        padre.x -
        nx * distanciaHijo;

    let y1 =
        padre.y -
        ny * distanciaHijo;


    let x2 =
        padre.x +
        nx * distanciaHijo;

    let y2 =
        padre.y +
        ny * distanciaHijo;


    // --------------------------------------------------------
    // Mantener dentro del canvas
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


    // --------------------------------------------------------
    // Hereda movimiento del padre
    // --------------------------------------------------------

    hijo1.vx =
        padre.vx -
        nx * 1.1;


    hijo1.vy =
        padre.vy -
        ny * 1.1;


    // --------------------------------------------------------
    // Hereda rotación
    // --------------------------------------------------------

    hijo1.rotacion =
        padre.rotacion;


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


    // --------------------------------------------------------
    // Hereda movimiento del padre
    // --------------------------------------------------------

    hijo2.vx =
        padre.vx +
        nx * 1.1;


    hijo2.vy =
        padre.vy +
        ny * 1.1;


    // --------------------------------------------------------
    // Hereda rotación
    // --------------------------------------------------------

    hijo2.rotacion =
        padre.rotacion;


    // ========================================================
    // AGREGAR HIJOS
    // ========================================================

    figuras.push(
        hijo1,
        hijo2
    );


    // ========================================================
    // EL PADRE NO DESAPARECE
    // ========================================================

    padre.estirando = false;

    padre.escalaX = 1;

    padre.escalaY = 1;

    padre.reproducciones++;


    // ========================================================
    // FINALIZAR GESTO
    // ========================================================

    gestoActivo = false;

    figuraSeleccionada = null;

    dedo1ID = null;

    dedo2ID = null;
}


// ============================================================
// DIBUJAR FIGURA
// ============================================================

function dibujarFigura(figura) {

    ctx.save();


    // --------------------------------------------------------
    // Posición
    // --------------------------------------------------------

    ctx.translate(
        figura.x,
        figura.y
    );


    // --------------------------------------------------------
    // Rotación
    // --------------------------------------------------------

    ctx.rotate(
        figura.rotacion
    );


    // --------------------------------------------------------
    // Estiramiento
    // --------------------------------------------------------

    if (figura.estirando) {

        ctx.rotate(
            figura.anguloEstiramiento -
            figura.rotacion
        );


        ctx.scale(
            figura.escalaX,
            figura.escalaY
        );
    }


    // ========================================================
    // RESPIRACIÓN
    //
    // Se aplica directamente al tamaño visual.
    // ========================================================

    ctx.scale(
        figura.respiracionX,
        figura.respiracionY
    );


    // --------------------------------------------------------
    // Tamaño
    // --------------------------------------------------------

    const mitad =
        figura.tamano / 2;


    // ========================================================
    // GRADIENTES EXACTOS DE MEMORIA
    // ========================================================

    let gradiente;


    if (figura.color === "#D9D9D9") {

        gradiente =
            ctx.createRadialGradient(
                -mitad * 0.30,
                -mitad * 0.35,
                0,
                0,
                0,
                mitad * 1.25
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


        // ----------------------------------------------------
        // BOX SHADOW
        // ----------------------------------------------------

        ctx.shadowColor =
            "rgba(217,217,217,0.25)";

        ctx.shadowBlur = 18;

        ctx.shadowOffsetX = 0;

        ctx.shadowOffsetY = 0;
    }


    else if (
        figura.color === "#8BB2D3"
    ) {

        gradiente =
            ctx.createRadialGradient(
                -mitad * 0.30,
                -mitad * 0.35,
                0,
                0,
                0,
                mitad * 1.25
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


        // ----------------------------------------------------
        // BOX SHADOW
        // ----------------------------------------------------

        ctx.shadowColor =
            "rgba(139,178,211,0.25)";

        ctx.shadowBlur = 18;

        ctx.shadowOffsetX = 0;

        ctx.shadowOffsetY = 0;
    }


    else if (
        figura.color === "#202D64"
    ) {

        gradiente =
            ctx.createRadialGradient(
                -mitad * 0.30,
                -mitad * 0.35,
                0,
                0,
                0,
                mitad * 1.25
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


        // ----------------------------------------------------
        // BOX SHADOW
        // ----------------------------------------------------

        ctx.shadowColor =
            "rgba(32,45,100,0.35)";

        ctx.shadowBlur = 18;

        ctx.shadowOffsetX = 0;

        ctx.shadowOffsetY = 0;
    }


    else if (
        figura.color === "#2B538E"
    ) {

        gradiente =
            ctx.createRadialGradient(
                -mitad * 0.30,
                -mitad * 0.35,
                0,
                0,
                0,
                mitad * 1.25
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


        // ----------------------------------------------------
        // BOX SHADOW
        // ----------------------------------------------------

        ctx.shadowColor =
            "rgba(43,83,142,0.35)";

        ctx.shadowBlur = 18;

        ctx.shadowOffsetX = 0;

        ctx.shadowOffsetY = 0;
    }


    // ========================================================
    // CUADRADO
    // ========================================================

    ctx.fillStyle =
        gradiente;


    ctx.fillRect(
        -mitad,
        -mitad,
        figura.tamano,
        figura.tamano
    );


    // --------------------------------------------------------
    // Quitamos la sombra exterior antes de hacer
    // el efecto interno.
    // --------------------------------------------------------

    ctx.shadowColor =
        "transparent";

    ctx.shadowBlur = 0;


    // ========================================================
    // SOMBRA INTERNA
    // ========================================================

    // --------------------------------------------------------
    // Parte oscura inferior derecha
    // --------------------------------------------------------

    const sombraInterna =
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
        0.48,
        "rgba(255,255,255,0)"
    );


    sombraInterna.addColorStop(
        1,
        "rgba(0,0,0,0.18)"
    );


    ctx.fillStyle =
        sombraInterna;


    ctx.fillRect(
        -mitad,
        -mitad,
        figura.tamano,
        figura.tamano
    );


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
// ANIMACIÓN PRINCIPAL
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
// TOUCH START
// ============================================================

canvas.addEventListener(
    "touchstart",
    function(evento) {

        evento.preventDefault();


        // ----------------------------------------------------
        // Dos dedos
        // ----------------------------------------------------

        if (
            evento.touches.length === 2
        ) {

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


        // ----------------------------------------------------
        // Un dedo
        // ----------------------------------------------------

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


            if (figura) {

                figuraMouse =
                    figura;

                mouseActivo = true;


                offsetMouseX =
                    figura.x -
                    posicion.x;

                offsetMouseY =
                    figura.y -
                    posicion.y;
            }
        }

    },
    {
        passive: false
    }
);


// ============================================================
// TOUCH MOVE
// ============================================================

canvas.addEventListener(
    "touchmove",
    function(evento) {

        evento.preventDefault();


        // ----------------------------------------------------
        // Dos dedos
        // ----------------------------------------------------

        if (gestoActivo) {

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


        // ----------------------------------------------------
        // Un dedo
        // ----------------------------------------------------

        if (
            mouseActivo &&
            figuraMouse &&
            evento.touches.length === 1
        ) {

            const posicion =
                obtenerTouch(
                    evento.touches[0]
                );


            figuraMouse.x =
                posicion.x +
                offsetMouseX;


            figuraMouse.y =
                posicion.y +
                offsetMouseY;


            limitarFigura(
                figuraMouse
            );
        }

    },
    {
        passive: false
    }
);


// ============================================================
// FINALIZAR TOUCH
// ============================================================

function finalizarGesto(evento) {

    evento.preventDefault();


    // --------------------------------------------------------
    // Si se estaba haciendo herencia
    // --------------------------------------------------------

    if (
        gestoActivo &&
        evento.touches.length < 2
    ) {

        if (
            figuraSeleccionada
        ) {

            figuraSeleccionada.estirando =
                false;

            figuraSeleccionada.escalaX =
                1;

            figuraSeleccionada.escalaY =
                1;
        }


        gestoActivo = false;

        figuraSeleccionada = null;

        dedo1ID = null;

        dedo2ID = null;
    }


    // --------------------------------------------------------
    // Finalizar movimiento de un dedo
    // --------------------------------------------------------

    if (
        evento.touches.length === 0
    ) {

        mouseActivo = false;

        figuraMouse = null;
    }
}


canvas.addEventListener(
    "touchend",
    finalizarGesto,
    {
        passive: false
    }
);


canvas.addEventListener(
    "touchcancel",
    finalizarGesto,
    {
        passive: false
    }
);


// ============================================================
// MOUSE DOWN
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
            buscarFigura(x, y);


        if (!figura) {
            return;
        }


        figuraMouse =
            figura;

        mouseActivo = true;


        offsetMouseX =
            figura.x - x;

        offsetMouseY =
            figura.y - y;
    }
);


// ============================================================
// MOUSE MOVE
// ============================================================

canvas.addEventListener(
    "mousemove",
    function(evento) {

        if (
            !mouseActivo ||
            !figuraMouse
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


        figuraMouse.x =
            x + offsetMouseX;

        figuraMouse.y =
            y + offsetMouseY;


        limitarFigura(
            figuraMouse
        );
    }
);


// ============================================================
// MOUSE UP
// ============================================================

canvas.addEventListener(
    "mouseup",
    function() {

        mouseActivo = false;

        figuraMouse = null;
    }
);


canvas.addEventListener(
    "mouseleave",
    function() {

        mouseActivo = false;

        figuraMouse = null;
    }
);


// ============================================================
// TECLADO
// ============================================================

let figuraTeclado = null;


document.addEventListener(
    "keydown",
    function(evento) {

        // ----------------------------------------------------
        // Si todavía no hay figura seleccionada,
        // seleccionamos la primera.
        // ----------------------------------------------------

        if (
            !figuraTeclado &&
            figuras.length > 0
        ) {

            figuraTeclado =
                figuras[0];
        }


        if (!figuraTeclado) {
            return;
        }


        const paso = 5;


        if (
            evento.key === "ArrowLeft"
        ) {

            figuraTeclado.x -= paso;
        }


        if (
            evento.key === "ArrowRight"
        ) {

            figuraTeclado.x += paso;
        }


        if (
            evento.key === "ArrowUp"
        ) {

            figuraTeclado.y -= paso;
        }


        if (
            evento.key === "ArrowDown"
        ) {

            figuraTeclado.y += paso;
        }


        limitarFigura(
            figuraTeclado
        );
    }
);


// ============================================================
// INICIAR
// ============================================================

ajustarCanvas();

crearFigurasIniciales();


// ============================================================
// INICIAR ANIMACIÓN
// ============================================================

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

