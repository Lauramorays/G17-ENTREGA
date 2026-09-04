const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


// =====================================
// PALETA
// =====================================

const colores = [
    "#202D64",
    "#2B538E",
    "#8BB2D3",
    "#D9D9D9"
];


// =====================================
// CONFIGURACIÓN
// =====================================

const VELOCIDAD_BASE = 0.45;

const VELOCIDAD_HIJOS = 0.65;

const FUERZA_COLISION = 0.35;

const INTERVALO_DESPRENDIMIENTO = 700;


// =====================================
// CANVAS
// =====================================

function ajustarCanvas() {

    const rect =
        canvas.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;

}

window.addEventListener(
    "resize",
    ajustarCanvas
);

ajustarCanvas();


// =====================================
// ARRAY
// =====================================

let triangulos = [];


// =====================================
// CREAR TRIÁNGULO
// =====================================

function crearTriangulo(
    x,
    y,
    tamaño,
    esHijo = false,
    color = null
) {

    const velocidad =
        esHijo
            ? VELOCIDAD_HIJOS
            : VELOCIDAD_BASE;


    return {

        x: x,
        y: y,

        vx:
            (Math.random() - 0.5) *
            velocidad,

        vy:
            (Math.random() - 0.5) *
            velocidad,


        tamaño: tamaño,


        color:
            color ||
            colores[
                Math.floor(
                    Math.random() *
                    colores.length
                )
            ],


        // =============================
        // RESPIRACIÓN
        // =============================

        fase:
            Math.random() *
            Math.PI *
            2,


        // Los hijos laten más rápido

        velocidadLatido:
            esHijo
                ? 0.13 + Math.random() * 0.07
                : 0.025 + Math.random() * 0.015,


        amplitudLatido:
            esHijo
                ? 0.13
                : 0.06,


        // =============================
        // TIPO
        // =============================

        esHijo: esHijo,

        vivo: true

    };

}


// =====================================
// 4 TRIÁNGULOS GRANDES INICIALES
// =====================================

function crearIniciales() {

    triangulos = [];


    const posiciones = [

        {
            x: canvas.width * 0.25,
            y: canvas.height * 0.30
        },

        {
            x: canvas.width * 0.75,
            y: canvas.height * 0.30
        },

        {
            x: canvas.width * 0.30,
            y: canvas.height * 0.70
        },

        {
            x: canvas.width * 0.70,
            y: canvas.height * 0.70
        }

    ];


    posiciones.forEach(
        posicion => {

            triangulos.push(

                crearTriangulo(
                    posicion.x,
                    posicion.y,
                    58,
                    false
                )

            );

        }
    );

}

crearIniciales();


// =====================================
// MOVIMIENTO
// =====================================

function moverTriangulos() {

    triangulos.forEach(
        triangulo => {

            if (!triangulo.vivo)
                return;


            // ==========================
            // MOVIMIENTO
            // ==========================

            triangulo.x +=
                triangulo.vx;

            triangulo.y +=
                triangulo.vy;


            // ==========================
            // LATIDO
            // ==========================

            triangulo.fase +=
                triangulo.velocidadLatido;


            // ==========================
            // BORDES
            // ==========================

            const margen =
                triangulo.tamaño *
                0.7;


            if (
                triangulo.x - margen < 0
            ) {

                triangulo.x =
                    margen;

                triangulo.vx *= -1;

            }


            if (
                triangulo.x + margen >
                canvas.width
            ) {

                triangulo.x =
                    canvas.width -
                    margen;

                triangulo.vx *= -1;

            }


            if (
                triangulo.y - margen < 0
            ) {

                triangulo.y =
                    margen;

                triangulo.vy *= -1;

            }


            if (
                triangulo.y + margen >
                canvas.height
            ) {

                triangulo.y =
                    canvas.height -
                    margen;

                triangulo.vy *= -1;

            }

        }
    );

}


// =====================================
// COLISIONES
// =====================================

function colisiones() {

    for (
        let i = 0;
        i < triangulos.length;
        i++
    ) {

        for (
            let j = i + 1;
            j < triangulos.length;
            j++
        ) {

            const a =
                triangulos[i];

            const b =
                triangulos[j];


            if (
                !a.vivo ||
                !b.vivo
            )
                continue;


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
                    a.tamaño +
                    b.tamaño
                ) * 0.45;


            if (
                distancia > 0 &&
                distancia <
                distanciaMinima
            ) {

                const nx =
                    dx / distancia;

                const ny =
                    dy / distancia;


                // ======================
                // EMPUJE
                // ======================

                a.vx -=
                    nx *
                    FUERZA_COLISION *
                    0.02;

                a.vy -=
                    ny *
                    FUERZA_COLISION *
                    0.02;


                b.vx +=
                    nx *
                    FUERZA_COLISION *
                    0.02;

                b.vy +=
                    ny *
                    FUERZA_COLISION *
                    0.02;


                // ======================
                // SEPARACIÓN
                // ======================

                const separacion =
                    distanciaMinima -
                    distancia;


                a.x -=
                    nx *
                    separacion *
                    0.5;

                a.y -=
                    ny *
                    separacion *
                    0.5;


                b.x +=
                    nx *
                    separacion *
                    0.5;

                b.y +=
                    ny *
                    separacion *
                    0.5;

            }

        }

    }

}


// =====================================
// CREAR TRIÁNGULO DESPRENDIDO
// =====================================

function desprenderTriangulo(
    padre
) {

    if (!padre.vivo)
        return;


    // ================================
    // TAMAÑO ALEATORIO
    // ================================

    const tamaños = [
        12,
        18,
        24,
        30,
        36
    ];


    const tamaño =
        tamaños[
            Math.floor(
                Math.random() *
                tamaños.length
            )
        ];


    // ================================
    // DIRECCIÓN ALEATORIA
    // ================================

    const angulo =
        Math.random() *
        Math.PI *
        2;


    const distancia =
        padre.tamaño *
        0.7;


    const x =
        padre.x +
        Math.cos(angulo) *
        distancia;


    const y =
        padre.y +
        Math.sin(angulo) *
        distancia;


    // ================================
    // CREAR HIJO
    // ================================

    const hijo =
        crearTriangulo(
            x,
            y,
            tamaño,
            true,
            padre.color
        );


    // ================================
    // SALE DESPRENDIÉNDOSE
    // ================================

    hijo.vx =
        Math.cos(angulo) *
        (
            0.4 +
            Math.random() *
            0.5
        );

    hijo.vy =
        Math.sin(angulo) *
        (
            0.4 +
            Math.random() *
            0.5
        );


    triangulos.push(hijo);

}


// =====================================
// DESPRENDIMIENTO AUTOMÁTICO
// =====================================

setInterval(
    function() {

        const padres =
            triangulos.filter(
                triangulo =>
                    triangulo.vivo &&
                    !triangulo.esHijo
            );


        padres.forEach(
            padre => {

                // Cada padre puede
                // desprender con cierta
                // probabilidad

                if (
                    Math.random() < 0.75
                ) {

                    desprenderTriangulo(
                        padre
                    );

                }

            }
        );


    },
    INTERVALO_DESPRENDIMIENTO
);


// =====================================
// DIBUJAR TRIÁNGULO
// =====================================

function dibujarTriangulo(
    triangulo
) {

    if (!triangulo.vivo)
        return;


    // =================================
    // LATIDO
    // =================================

    const latido =
        Math.sin(
            triangulo.fase
        ) *
        triangulo.amplitudLatido;


    const tamaño =
        triangulo.tamaño *
        (
            1 +
            latido
        );


    const altura =
        tamaño *
        Math.sqrt(3) /
        2;


    ctx.save();


    ctx.translate(
        triangulo.x,
        triangulo.y
    );


    // =================================
    // TRIÁNGULO
    // =================================

    ctx.beginPath();


    ctx.moveTo(
        0,
        -altura * 0.65
    );


    ctx.lineTo(
        -tamaño * 0.5,
        altura * 0.35
    );


    ctx.lineTo(
        tamaño * 0.5,
        altura * 0.35
    );


    ctx.closePath();


    ctx.fillStyle =
        triangulo.color;


    ctx.fill();


    ctx.restore();

}


// =====================================
// DIBUJAR
// =====================================

function dibujar() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    triangulos.forEach(
        triangulo =>
            dibujarTriangulo(
                triangulo
            )
    );

}


// =====================================
// BUSCAR TRIÁNGULO TOCADO
// =====================================

function buscarTriangulo(
    x,
    y
) {

    // Revisamos primero
    // los pequeños que están
    // arriba visualmente

    for (
        let i =
            triangulos.length - 1;
        i >= 0;
        i--
    ) {

        const triangulo =
            triangulos[i];


        if (!triangulo.vivo)
            continue;


        // Los padres NO desaparecen

        if (!triangulo.esHijo)
            continue;


        const dx =
            x - triangulo.x;

        const dy =
            y - triangulo.y;


        const radio =
            triangulo.tamaño *
            0.75;


        if (
            Math.sqrt(
                dx * dx +
                dy * dy
            ) < radio
        ) {

            return triangulo;

        }

    }


    return null;

}


// =====================================
// TOCAR TRIÁNGULO
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


        const triangulo =
            buscarTriangulo(
                x,
                y
            );


        if (triangulo) {

            // ==========================
            // DESAPARECE DE UNA
            // ==========================

            triangulo.vivo =
                false;


            mostrarMensaje(
                "DESAPARECIÓ"
            );


            // Lo eliminamos del array

            setTimeout(
                function() {

                    const indice =
                        triangulos.indexOf(
                            triangulo
                        );


                    if (
                        indice !== -1
                    ) {

                        triangulos.splice(
                            indice,
                            1
                        );

                    }

                },
                50
            );

        }

    }
);


// =====================================
// MENSAJE
// =====================================

let mensajeTimer;


function mostrarMensaje(
    texto
) {

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
            function() {

                mensaje.textContent =
                    "";

            },
            700
        );

}


// =====================================
// ANIMACIÓN
// =====================================

function animar() {

    moverTriangulos();

    colisiones();

    dibujar();

    requestAnimationFrame(
        animar
    );

}


animar();