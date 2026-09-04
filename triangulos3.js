const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Colores de los cuatro triángulos.
const colores = [
    "#202D64",
    "#2B538E",
    "#8BB2D3",
    "#D9D9D9"
];

// Configuración general del juego.
const LADO = 120;
const VELOCIDAD_MIN = 0.35;
const VELOCIDAD_MAX = 0.8;
const DISTANCIA_COLOCACION = 45;

// Calcula la altura de un triángulo equilátero.
const ALTURA =
    LADO * Math.sqrt(3) / 2;

// Guarda las cuatro piezas.
let piezas = [];

// Guarda la pieza que se está arrastrando.
let piezaSeleccionada = null;

let offsetX = 0;
let offsetY = 0;

// Indica si el juego ya fue iniciado.
let juegoIniciado = false;

// Evita que el desarme se ejecute varias veces.
let desarmando = false;


// =====================================
// CANVAS RESPONSIVE
// =====================================

function ajustarCanvas() {

    const rect =
        canvas.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;

    // Al comenzar se crean las piezas.
    if (!juegoIniciado) {
        crearPiezas();
    }
}

window.addEventListener(
    "resize",
    ajustarCanvas
);


// =====================================
// CREAR LOS 4 TRIÁNGULOS
// =====================================

function crearPiezas() {

    piezas = [];

    const cx =
        canvas.width / 2;

    const cy =
        canvas.height / 2;


    // Vértices del triángulo grande.

    const A = {
        x: cx,
        y: cy - ALTURA
    };

    const B = {
        x: cx - LADO,
        y: cy + ALTURA
    };

    const C = {
        x: cx + LADO,
        y: cy + ALTURA
    };


    // Puntos medios.

    const AB = {
        x: (A.x + B.x) / 2,
        y: (A.y + B.y) / 2
    };

    const AC = {
        x: (A.x + C.x) / 2,
        y: (A.y + C.y) / 2
    };

    const BC = {
        x: (B.x + C.x) / 2,
        y: (B.y + C.y) / 2
    };


    // Centro de cada uno de los cuatro triángulos.

    const centro0 = centroTriangulo(
        A,
        AB,
        AC
    );

    const centro1 = centroTriangulo(
        AB,
        B,
        BC
    );

    const centro2 = centroTriangulo(
        AC,
        BC,
        C
    );

    const centro3 = centroTriangulo(
        AB,
        AC,
        BC
    );


    const centros = [
        centro0,
        centro1,
        centro2,
        centro3
    ];


    // Crea las cuatro piezas.

    centros.forEach(
        (centro, indice) => {

            piezas.push({

                id: indice,

                x: centro.x,
                y: centro.y,

                objetivoX: centro.x,
                objetivoY: centro.y,

                vx: 0,
                vy: 0,

                lado: LADO,

                color:
                    colores[indice],

                colocada: true,

                libre: false,

                respiracion:
                    Math.random() *
                    Math.PI *
                    2,

                velocidadRespiracion:
                    0.025 +
                    Math.random() * 0.01

            });

        }
    );
}


// =====================================
// CENTRO DE TRIÁNGULO
// =====================================

function centroTriangulo(a, b, c) {

    return {

        x:
            (a.x + b.x + c.x) / 3,

        y:
            (a.y + b.y + c.y) / 3

    };
}


// =====================================
// INICIAR DESARME
// =====================================

function desarmar() {

    if (juegoIniciado)
        return;

    juegoIniciado = true;


    piezas.forEach(
        (pieza, indice) => {

            pieza.colocada = false;
            pieza.libre = true;


            // Cada pieza sale en una dirección diferente.

            const angulo =
                (
                    indice *
                    Math.PI / 2
                ) +
                Math.random() * 0.5;


            const distancia =
                100 +
                Math.random() * 100;


            pieza.x =
                canvas.width / 2 +
                Math.cos(angulo) *
                distancia;


            pieza.y =
                canvas.height / 2 +
                Math.sin(angulo) *
                distancia;


            // Cada pieza recibe una velocidad aleatoria.

            const velocidad =
                VELOCIDAD_MIN +
                Math.random() *
                (
                    VELOCIDAD_MAX -
                    VELOCIDAD_MIN
                );


            pieza.vx =
                Math.cos(angulo) *
                velocidad;


            pieza.vy =
                Math.sin(angulo) *
                velocidad;

        }
    );


    mostrarMensaje(
        "SE DESARMÓ"
    );
}


// =====================================
// MOVIMIENTO
// =====================================

function moverPiezas() {

    piezas.forEach(
        pieza => {

            // Genera el movimiento orgánico de respiración.

            pieza.respiracion +=
                pieza.velocidadRespiracion;


            const pulso =
                Math.sin(
                    pieza.respiracion
                );


            pieza.escala =
                1 +
                pulso * 0.045;


            // Las piezas libres se mueven.

            if (
                pieza.libre &&
                pieza !== piezaSeleccionada
            ) {

                pieza.x += pieza.vx;
                pieza.y += pieza.vy;


                // Rebote contra los bordes.

                const margen =
                    pieza.lado * 0.45;


                if (
                    pieza.x - margen < 0
                ) {

                    pieza.x = margen;

                    pieza.vx *= -1;
                }


                if (
                    pieza.x + margen >
                    canvas.width
                ) {

                    pieza.x =
                        canvas.width -
                        margen;

                    pieza.vx *= -1;
                }


                if (
                    pieza.y - margen < 0
                ) {

                    pieza.y = margen;

                    pieza.vy *= -1;
                }


                if (
                    pieza.y + margen >
                    canvas.height
                ) {

                    pieza.y =
                        canvas.height -
                        margen;

                    pieza.vy *= -1;
                }
            }
        }
    );
}


// =====================================
// COLISIONES
// =====================================

function colisiones() {

    if (!juegoIniciado)
        return;


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


            // Calcula la distancia entre las piezas.

            const dx =
                b.x - a.x;

            const dy =
                b.y - a.y;


            const distancia =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            if (distancia === 0)
                continue;


            // Distancia a partir de la cual
            // las piezas se consideran en contacto.

            const distanciaMinima =
                a.lado * 0.82;


            if (
                distancia >=
                distanciaMinima
            )
                continue;


            // Dirección del empuje.

            const nx =
                dx / distancia;

            const ny =
                dy / distancia;


            const penetracion =
                distanciaMinima -
                distancia;


            // Las dos piezas están libres.

            if (
                a.libre &&
                b.libre
            ) {

                // Evita que se atraviesen.

                a.x -=
                    nx *
                    penetracion *
                    0.5;

                a.y -=
                    ny *
                    penetracion *
                    0.5;


                b.x +=
                    nx *
                    penetracion *
                    0.5;

                b.y +=
                    ny *
                    penetracion *
                    0.5;


                // Empuja suavemente las piezas.

                const fuerza = 0.12;


                a.vx -=
                    nx *
                    fuerza;

                a.vy -=
                    ny *
                    fuerza;


                b.vx +=
                    nx *
                    fuerza;

                b.vy +=
                    ny *
                    fuerza;
            }


            // A está siendo arrastrada.

            else if (
                a === piezaSeleccionada &&
                b.libre
            ) {

                b.x +=
                    nx *
                    penetracion;

                b.y +=
                    ny *
                    penetracion;


                b.vx +=
                    nx *
                    0.18;

                b.vy +=
                    ny *
                    0.18;
            }


            // B está siendo arrastrada.

            else if (
                b === piezaSeleccionada &&
                a.libre
            ) {

                a.x -=
                    nx *
                    penetracion;

                a.y -=
                    ny *
                    penetracion;


                a.vx -=
                    nx *
                    0.18;

                a.vy -=
                    ny *
                    0.18;
            }


            // A libre y B colocada.

            else if (
                a.libre &&
                b.colocada &&
                b !== piezaSeleccionada
            ) {

                a.x -=
                    nx *
                    penetracion;

                a.y -=
                    ny *
                    penetracion;


                a.vx -=
                    nx *
                    0.12;

                a.vy -=
                    ny *
                    0.12;
            }


            // B libre y A colocada.

            else if (
                b.libre &&
                a.colocada &&
                a !== piezaSeleccionada
            ) {

                b.x +=
                    nx *
                    penetracion;

                b.y +=
                    ny *
                    penetracion;


                b.vx +=
                    nx *
                    0.12;

                b.vy +=
                    ny *
                    0.12;
            }
        }
    }
}


// =====================================
// DIBUJAR TRIÁNGULO EQUILÁTERO
// =====================================

function dibujarPieza(pieza) {

    const escala =
        pieza.escala || 1;


    const lado =
        pieza.lado *
        escala;


    const altura =
        lado *
        Math.sqrt(3) /
        2;


    ctx.save();


    ctx.translate(
        pieza.x,
        pieza.y
    );


    ctx.beginPath();


    // El triángulo central está invertido.

    if (pieza.id === 3) {

        ctx.moveTo(
            -lado / 2,
            -altura / 3
        );

        ctx.lineTo(
            lado / 2,
            -altura / 3
        );

        ctx.lineTo(
            0,
            altura * 2 / 3
        );

    } else {

        // Los otros tres triángulos
        // apuntan hacia arriba.

        ctx.moveTo(
            0,
            -altura * 2 / 3
        );

        ctx.lineTo(
            -lado / 2,
            altura / 3
        );

        ctx.lineTo(
            lado / 2,
            altura / 3
        );
    }


    ctx.closePath();


    ctx.fillStyle =
        pieza.color;


    ctx.fill();


    ctx.restore();
}


// =====================================
// DIBUJAR TODO
// =====================================

function dibujar() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    piezas.forEach(
        pieza => {

            dibujarPieza(
                pieza
            );

        }
    );
}


// =====================================
// BUSCAR PIEZA
// =====================================

function buscarPieza(x, y) {

    for (
        let i = piezas.length - 1;
        i >= 0;
        i--
    ) {

        const pieza =
            piezas[i];


        const dx =
            x - pieza.x;

        const dy =
            y - pieza.y;


        const distancia =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        // Detecta si el toque está sobre la pieza.

        if (
            distancia <
            pieza.lado * 0.65
        ) {

            return pieza;
        }
    }


    return null;
}


// =====================================
// COLOCAR PIEZA
// =====================================

function intentarColocar(pieza) {

    const distancia =
        Math.sqrt(

            Math.pow(
                pieza.x -
                pieza.objetivoX,
                2
            )

            +

            Math.pow(
                pieza.y -
                pieza.objetivoY,
                2
            )
        );


    // Si está suficientemente cerca
    // de su posición original, se acomoda.

    if (
        distancia <
        DISTANCIA_COLOCACION
    ) {

        pieza.x =
            pieza.objetivoX;

        pieza.y =
            pieza.objetivoY;


        pieza.vx = 0;
        pieza.vy = 0;


        pieza.colocada =
            true;

        pieza.libre =
            false;


        verificarPiezas();
    }
}


// =====================================
// VERIFICAR CUÁNTAS ESTÁN COLOCADAS
// =====================================

function verificarPiezas() {

    const cantidad =
        piezas.filter(
            pieza =>
                pieza.colocada
        ).length;


    if (cantidad === 1) {

        mostrarMensaje(
            "1 DE 4"
        );
    }


    if (cantidad === 2) {

        mostrarMensaje(
            "2 DE 4"
        );
    }


    if (cantidad === 3) {

        mostrarMensaje(
            "CASI..."
        );
    }


    // Cuando las cuatro piezas están colocadas,
    // el triángulo vuelve a desarmarse.

    if (cantidad === 4) {

        mostrarMensaje(
            "CASI COMPLETO..."
        );


        setTimeout(
            romperNuevamente,
            700
        );
    }
}


// =====================================
// ROMPER OTRA VEZ
// =====================================

function romperNuevamente() {

    if (desarmando)
        return;


    desarmando = true;


    mostrarMensaje(
        "SE VOLVIÓ A DESARMAR"
    );


    setTimeout(
        () => {

            piezas.forEach(
                (pieza, indice) => {

                    pieza.colocada =
                        false;

                    pieza.libre =
                        true;


                    // Nueva dirección de salida.

                    const angulo =
                        (
                            indice *
                            Math.PI / 2
                        ) +
                        Math.random() *
                        0.7;


                    const distancia =
                        110 +
                        Math.random() *
                        90;


                    pieza.x =
                        canvas.width / 2 +
                        Math.cos(angulo) *
                        distancia;


                    pieza.y =
                        canvas.height / 2 +
                        Math.sin(angulo) *
                        distancia;


                    // Nueva velocidad.

                    const velocidad =
                        0.45 +
                        Math.random() *
                        0.45;


                    pieza.vx =
                        Math.cos(angulo) *
                        velocidad;


                    pieza.vy =
                        Math.sin(angulo) *
                        velocidad;
                }
            );


            desarmando = false;


            mostrarMensaje(
                "INTENTÁ ARMARLO DE NUEVO"
            );

        },
        500
    );
}


// =====================================
// TOCAR
// =====================================

canvas.addEventListener(
    "pointerdown",
    function(event) {

        const rect =
            canvas.getBoundingClientRect();


        const x =
            event.clientX -
            rect.left;


        const y =
            event.clientY -
            rect.top;


        const pieza =
            buscarPieza(x, y);


        if (!pieza)
            return;


        // Primer toque:
        // desarma el triángulo.

        if (!juegoIniciado) {

            desarmar();


            piezaSeleccionada =
                pieza;


            pieza.x = x;
            pieza.y = y;

            pieza.vx = 0;
            pieza.vy = 0;


            offsetX = 0;
            offsetY = 0;


            canvas.setPointerCapture(
                event.pointerId
            );


            return;
        }


        // Selecciona una pieza para moverla.

        piezaSeleccionada =
            pieza;


        offsetX =
            x - pieza.x;

        offsetY =
            y - pieza.y;


        // Una pieza colocada vuelve a estar libre.

        pieza.colocada =
            false;

        pieza.libre =
            true;


        pieza.vx = 0;
        pieza.vy = 0;


        canvas.setPointerCapture(
            event.pointerId
        );
    }
);


// =====================================
// MOVER CON EL DEDO / MOUSE
// =====================================

canvas.addEventListener(
    "pointermove",
    function(event) {

        if (!piezaSeleccionada)
            return;


        const rect =
            canvas.getBoundingClientRect();


        const x =
            event.clientX -
            rect.left;


        const y =
            event.clientY -
            rect.top;


        piezaSeleccionada.x =
            x - offsetX;

        piezaSeleccionada.y =
            y - offsetY;
    }
);


// =====================================
// SOLTAR
// =====================================

canvas.addEventListener(
    "pointerup",
    function(event) {

        if (!piezaSeleccionada)
            return;


        intentarColocar(
            piezaSeleccionada
        );


        // Si no se colocó,
        // vuelve a moverse.

        if (
            !piezaSeleccionada.colocada
        ) {

            piezaSeleccionada.libre =
                true;


            piezaSeleccionada.vx =
                (
                    Math.random() -
                    0.5
                ) * 0.5;


            piezaSeleccionada.vy =
                (
                    Math.random() -
                    0.5
                ) * 0.5;
        }


        piezaSeleccionada =
            null;
    }
);


// =====================================
// MENSAJES
// =====================================

let mensajeTimer;


function mostrarMensaje(texto) {

    const mensaje =
        document.getElementById(
            "mensaje"
        );


    mensaje.textContent =
        texto;


    clearTimeout(
        mensajeTimer
    );


    mensajeTimer =
        setTimeout(
            () => {

                if (!juegoIniciado) {

                    mensaje.textContent =
                        "TOCÁ UNA PIEZA";

                } else {

                    mensaje.textContent =
                        "RECONSTRUÍ EL TRIÁNGULO";
                }

            },
            1200
        );
}


// =====================================
// ANIMACIÓN
// =====================================

function animar() {

    moverPiezas();

    colisiones();

    dibujar();

    requestAnimationFrame(
        animar
    );
}


// =====================================
// INICIO
// =====================================

ajustarCanvas();

animar();