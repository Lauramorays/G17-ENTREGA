// ============================================================
// INCERTIDUMBRE
// triangulos.js
// ============================================================
//
// COMPORTAMIENTO:
//
// - Comienzan 4 triángulos.
// - Se mueven solos.
// - Colisionan entre ellos.
// - Tienen movimiento orgánico.
// - Al tocar un triángulo puede ocurrir una acción
//   impredecible.
// - Pueden crecer.
// - Pueden cambiar de posición.
// - Pueden cambiar de color.
// - Pueden afectar a otros triángulos.
// - Pueden cambiar su velocidad.
// - Pueden crear otro triángulo.
// - Pueden desaparecer.
//
// ESTÉTICA:
//
// - Triángulos equiláteros.
// - Gradientes como COLABORACIÓN.
// - Sombra suave.
// - Luz interior.
// - Movimiento orgánico.
// - Respiración.
// - Sin iluminación de pantalla al tocar fuera.
// ============================================================


const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


// ============================================================
// CONFIGURACIÓN DEL CANVAS
// ============================================================

canvas.style.touchAction = "none";


// ============================================================
// COLORES
// ============================================================

const colores = [
    "#202D64",
    "#2B538E",
    "#8BB2D3",
    "#D9D9D9"
];


// ============================================================
// CONFIGURACIÓN
// ============================================================

const VELOCIDAD_MAXIMA = 0.8;

const VELOCIDAD_ABSOLUTA_MAXIMA = 2.2;

const FUERZA_COLISION = 0.4;


// ------------------------------------------------------------
// TAMAÑOS
// ------------------------------------------------------------
//
// Un poco más grandes que antes.
//

const TAMAÑO_INICIAL = 135;

const TAMAÑO_MAXIMO = 160;


// ------------------------------------------------------------
// CANTIDAD MÁXIMA
// ------------------------------------------------------------

const MAXIMO_TRIANGULOS = 9;


// ============================================================
// VARIABLES
// ============================================================

let triangulos = [];


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


window.addEventListener(
    "resize",
    ajustarCanvas
);


ajustarCanvas();


// ============================================================
// CREAR TRIÁNGULO
// ============================================================

function crearTriangulo(
    x,
    y,
    tamaño = TAMAÑO_INICIAL
) {

    const angulo =
        Math.random() *
        Math.PI *
        2;


    const colorInicial =
        colores[
            Math.floor(
                Math.random() *
                colores.length
            )
        ];


    return {

        x: x,

        y: y,


        // ----------------------------------------------------
        // MOVIMIENTO
        // ----------------------------------------------------

        vx:
            (Math.random() - 0.5) *
            VELOCIDAD_MAXIMA,

        vy:
            (Math.random() - 0.5) *
            VELOCIDAD_MAXIMA,


        // ----------------------------------------------------
        // TAMAÑO
        // ----------------------------------------------------

        tamaño:
            tamaño,

        tamañoObjetivo:
            tamaño,


        // ----------------------------------------------------
        // COLOR
        // ----------------------------------------------------

        color:
            colorInicial,

        colorObjetivo:
            colorInicial,


        // ----------------------------------------------------
        // ROTACIÓN
        // ----------------------------------------------------

        angulo:
            angulo,

        anguloObjetivo:
            angulo,


        // ----------------------------------------------------
        // RESPIRACIÓN
        // ----------------------------------------------------

        fase:
            Math.random() *
            Math.PI *
            2,

        respiracion:
            0,


        // ----------------------------------------------------
        // REACCIÓN
        // ----------------------------------------------------

        reaccion:
            0,


        // ----------------------------------------------------
        // ESTADO
        // ----------------------------------------------------

        vivo:
            true
    };
}


// ============================================================
// CREAR TRIÁNGULOS INICIALES
// ============================================================

function crearIniciales() {

    triangulos = [];


    const posiciones = [

        {
            x:
                canvas.width *
                0.25,

            y:
                canvas.height *
                0.30
        },

        {
            x:
                canvas.width *
                0.75,

            y:
                canvas.height *
                0.30
        },

        {
            x:
                canvas.width *
                0.30,

            y:
                canvas.height *
                0.70
        },

        {
            x:
                canvas.width *
                0.70,

            y:
                canvas.height *
                0.70
        }
    ];


    posiciones.forEach(
        pos => {

            triangulos.push(

                crearTriangulo(

                    pos.x,

                    pos.y,

                    TAMAÑO_INICIAL
                )
            );
        }
    );
}


crearIniciales();


// ============================================================
// LIMITAR VELOCIDAD
// ============================================================

function limitarVelocidad(
    triangulo
) {

    let velocidad =
        Math.sqrt(

            triangulo.vx *
            triangulo.vx +

            triangulo.vy *
            triangulo.vy
        );


    if (
        velocidad >
        VELOCIDAD_ABSOLUTA_MAXIMA
    ) {

        triangulo.vx =
            (
                triangulo.vx /
                velocidad
            ) *
            VELOCIDAD_ABSOLUTA_MAXIMA;


        triangulo.vy =
            (
                triangulo.vy /
                velocidad
            ) *
            VELOCIDAD_ABSOLUTA_MAXIMA;
    }
}


// ============================================================
// MOVER TRIÁNGULOS
// ============================================================

function moverTriangulos() {

    triangulos.forEach(
        triangulo => {

            if (
                !triangulo.vivo
            ) {

                return;
            }


            // ------------------------------------------------
            // MOVIMIENTO
            // ------------------------------------------------

            triangulo.x +=
                triangulo.vx;


            triangulo.y +=
                triangulo.vy;


            // ------------------------------------------------
            // RESPIRACIÓN
            // ------------------------------------------------

            triangulo.fase +=
                0.025;


            triangulo.respiracion =
                Math.sin(
                    triangulo.fase
                ) *
                0.06;


            // ------------------------------------------------
            // CAMBIO DE TAMAÑO
            // ------------------------------------------------

            triangulo.tamaño +=

                (
                    triangulo.tamañoObjetivo -
                    triangulo.tamaño
                ) *
                0.035;


            // ------------------------------------------------
            // ROTACIÓN
            // ------------------------------------------------

            triangulo.angulo +=

                (
                    triangulo.anguloObjetivo -
                    triangulo.angulo
                ) *
                0.02;


            // ------------------------------------------------
            // COLOR
            // ------------------------------------------------

            if (
                triangulo.color !==
                triangulo.colorObjetivo
            ) {

                triangulo.color =
                    interpolarColor(

                        triangulo.color,

                        triangulo.colorObjetivo,

                        0.025
                    );
            }


            // ------------------------------------------------
            // REACCIÓN
            // ------------------------------------------------

            if (
                triangulo.reaccion >
                0
            ) {

                triangulo.reaccion -=
                    0.02;


                triangulo.angulo +=

                    Math.sin(
                        triangulo.reaccion *
                        15
                    ) *
                    0.01;
            }


            // ------------------------------------------------
            // VELOCIDAD
            // ------------------------------------------------

            limitarVelocidad(
                triangulo
            );


            // ------------------------------------------------
            // BORDES
            // ------------------------------------------------

            const radio =
                triangulo.tamaño *
                0.8;


            // ------------------------------------------------
            // BORDE IZQUIERDO
            // ------------------------------------------------

            if (
                triangulo.x -
                radio <
                0
            ) {

                triangulo.x =
                    radio;


                triangulo.vx =
                    Math.abs(
                        triangulo.vx
                    );
            }


            // ------------------------------------------------
            // BORDE DERECHO
            // ------------------------------------------------

            if (
                triangulo.x +
                radio >
                canvas.width
            ) {

                triangulo.x =
                    canvas.width -
                    radio;


                triangulo.vx =
                    -Math.abs(
                        triangulo.vx
                    );
            }


            // ------------------------------------------------
            // BORDE SUPERIOR
            // ------------------------------------------------

            if (
                triangulo.y -
                radio <
                0
            ) {

                triangulo.y =
                    radio;


                triangulo.vy =
                    Math.abs(
                        triangulo.vy
                    );
            }


            // ------------------------------------------------
            // BORDE INFERIOR
            // ------------------------------------------------

            if (
                triangulo.y +
                radio >
                canvas.height
            ) {

                triangulo.y =
                    canvas.height -
                    radio;


                triangulo.vy =
                    -Math.abs(
                        triangulo.vy
                    );
            }
        }
    );
}


// ============================================================
// COLISIONES
// ============================================================

function colisiones() {

    for (
        let i = 0;
        i < triangulos.length;
        i++
    ) {

        const a =
            triangulos[i];


        if (
            !a.vivo
        ) {

            continue;
        }


        for (
            let j = i + 1;
            j < triangulos.length;
            j++
        ) {

            const b =
                triangulos[j];


            if (
                !b.vivo
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
                (
                    a.tamaño +
                    b.tamaño
                ) *
                0.55;


            if (
                distancia > 0 &&
                distancia <
                distanciaMinima
            ) {

                const nx =
                    dx /
                    distancia;


                const ny =
                    dy /
                    distancia;


                // --------------------------------------------
                // SEPARACIÓN
                // --------------------------------------------

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


                // --------------------------------------------
                // IMPULSO
                // --------------------------------------------

                a.vx -=
                    nx *
                    FUERZA_COLISION;


                a.vy -=
                    ny *
                    FUERZA_COLISION;


                b.vx +=
                    nx *
                    FUERZA_COLISION;


                b.vy +=
                    ny *
                    FUERZA_COLISION;


                limitarVelocidad(
                    a
                );


                limitarVelocidad(
                    b
                );
            }
        }
    }
}


// ============================================================
// GRADIENTE DEL TRIÁNGULO
// ============================================================
//
// Misma estética de COLABORACIÓN.
//

function obtenerGradiente(
    triangulo,
    tamaño
) {

    const gradient =
        ctx.createRadialGradient(

            triangulo.x -
                tamaño * 0.20,

            triangulo.y -
                tamaño * 0.25,

            tamaño * 0.08,

            triangulo.x,

            triangulo.y,

            tamaño * 0.95
        );


    // ========================================================
    // AZUL OSCURO
    // ========================================================

    if (
        triangulo.color ===
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
    }


    // ========================================================
    // AZUL
    // ========================================================

    else if (
        triangulo.color ===
        "#2B538E"
    ) {

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


    // ========================================================
    // CELESTE
    // ========================================================

    else if (
        triangulo.color ===
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
    }


    // ========================================================
    // GRIS
    // ========================================================

    else {

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
    }


    return gradient;
}


// ============================================================
// DIBUJAR TRIÁNGULO
// ============================================================

function dibujarTriangulo(
    triangulo
) {

    if (
        !triangulo.vivo
    ) {

        return;
    }


    // ========================================================
    // ESCALA DE RESPIRACIÓN
    // ========================================================

    const escala =
        1 +
        triangulo.respiracion;


    const tamaño =
        triangulo.tamaño *
        escala;


    const altura =
        tamaño *
        Math.sqrt(3) /
        2;


    ctx.save();


    // ========================================================
    // POSICIÓN
    // ========================================================

    ctx.translate(

        triangulo.x,

        triangulo.y
    );


    // ========================================================
    // ROTACIÓN
    // ========================================================

    ctx.rotate(
        triangulo.angulo
    );


    // ========================================================
    // SOMBRA
    // ========================================================

    ctx.shadowColor =
        "rgba(30,60,100,0.12)";


    ctx.shadowBlur =
        8;


    ctx.shadowOffsetY =
        2;


    // ========================================================
    // TRIÁNGULO PRINCIPAL
    // ========================================================

    ctx.beginPath();


    // --------------------------------------------------------
    // TRIÁNGULO EQUILÁTERO CENTRADO
    // --------------------------------------------------------

    ctx.moveTo(

        0,

        -altura *
        2 / 3
    );


    ctx.lineTo(

        -tamaño / 2,

        altura / 3
    );


    ctx.lineTo(

        tamaño / 2,

        altura / 3
    );


    ctx.closePath();


    ctx.fillStyle =
        obtenerGradiente(

            triangulo,

            tamaño
        );


    ctx.fill();


    // ========================================================
    // QUITAR SOMBRA
    // ========================================================

    ctx.shadowColor =
        "transparent";


    ctx.shadowBlur =
        0;


    ctx.shadowOffsetY =
        0;


    // ========================================================
    // BORDE SUAVE
    // ========================================================

    ctx.beginPath();


    ctx.moveTo(

        0,

        -altura *
        2 / 3
    );


    ctx.lineTo(

        -tamaño / 2,

        altura / 3
    );


    ctx.lineTo(

        tamaño / 2,

        altura / 3
    );


    ctx.closePath();


    ctx.strokeStyle =
        "rgba(190,205,225,0.15)";


    ctx.lineWidth =
        0.8;


    ctx.stroke();


    // ========================================================
    // LUZ INTERIOR
    // ========================================================

    const interior =
        ctx.createRadialGradient(

            -tamaño * 0.18,

            -tamaño * 0.22,

            tamaño * 0.04,

            0,

            0,

            tamaño * 0.80
        );


    interior.addColorStop(
        0,
        "rgba(255,255,255,0.22)"
    );


    interior.addColorStop(
        0.30,
        "rgba(255,255,255,0.07)"
    );


    interior.addColorStop(
        0.65,
        "rgba(255,255,255,0)"
    );


    interior.addColorStop(
        1,
        "rgba(0,0,0,0.08)"
    );


    ctx.beginPath();


    ctx.moveTo(

        0,

        -altura *
        2 / 3
    );


    ctx.lineTo(

        -tamaño / 2,

        altura / 3
    );


    ctx.lineTo(

        tamaño / 2,

        altura / 3
    );


    ctx.closePath();


    ctx.fillStyle =
        interior;


    ctx.fill();


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


    triangulos.forEach(
        dibujarTriangulo
    );
}


// ============================================================
// BUSCAR TRIÁNGULO
// ============================================================

function buscarTriangulo(
    x,
    y
) {

    for (
        let i =
            triangulos.length - 1;

        i >= 0;

        i--
    ) {

        const triangulo =
            triangulos[i];


        if (
            !triangulo.vivo
        ) {

            continue;
        }


        const dx =
            x -
            triangulo.x;


        const dy =
            y -
            triangulo.y;


        const radio =
            triangulo.tamaño *
            0.75;


        if (
            Math.sqrt(
                dx * dx +
                dy * dy
            ) <
            radio
        ) {

            return triangulo;
        }
    }


    return null;
}


// ============================================================
// ACCIÓN IMPREDECIBLE
// ============================================================

function accionImpredecible(
    triangulo
) {

    const accion =
        Math.floor(
            Math.random() *
            7
        );


    // ========================================================
    // 0 — CRECE
    // ========================================================

    if (
        accion === 0
    ) {

        triangulo.tamañoObjetivo =
            Math.min(

                triangulo.tamaño *
                1.8,

                TAMAÑO_MAXIMO
            );


        triangulo.reaccion =
            1;
    }


    // ========================================================
    // 1 — CAMBIA DE POSICIÓN
    // ========================================================

    else if (
        accion === 1
    ) {

        const margen =
            100;


        triangulo.x =
            margen +
            Math.random() *
            Math.max(

                1,

                canvas.width -
                margen * 2
            );


        triangulo.y =
            margen +
            Math.random() *
            Math.max(

                1,

                canvas.height -
                margen * 2
            );


        triangulo.reaccion =
            1;
    }


    // ========================================================
    // 2 — CAMBIA DE COLOR
    // ========================================================

    else if (
        accion === 2
    ) {

        let nuevoColor;


        do {

            nuevoColor =
                colores[
                    Math.floor(
                        Math.random() *
                        colores.length
                    )
                ];

        } while (
            nuevoColor ===
            triangulo.colorObjetivo
        );


        triangulo.colorObjetivo =
            nuevoColor;


        triangulo.reaccion =
            1;
    }


    // ========================================================
    // 3 — HACE REACCIONAR A OTROS
    // ========================================================

    else if (
        accion === 3
    ) {

        const candidatos =
            triangulos.filter(
                t =>
                    t !== triangulo &&
                    t.vivo
            );


        const cantidad =
            Math.min(

                candidatos.length,

                Math.floor(
                    Math.random() *
                    2
                ) +
                1
            );


        candidatos

            .sort(
                () =>
                    Math.random() -
                    0.5
            )

            .slice(
                0,
                cantidad
            )

            .forEach(
                otro => {

                    const tipo =
                        Math.floor(
                            Math.random() *
                            3
                        );


                    // ----------------------------------------
                    // CAMBIA TAMAÑO
                    // ----------------------------------------

                    if (
                        tipo === 0
                    ) {

                        otro.tamañoObjetivo =
                            Math.min(

                                otro.tamaño *
                                0.4,

                                TAMAÑO_MAXIMO
                            );
                    }


                    // ----------------------------------------
                    // CAMBIA VELOCIDAD
                    // ----------------------------------------

                    else if (
                        tipo === 1
                    ) {

                        otro.vx *=
                            1.5;


                        otro.vy *=
                            1.5;


                        limitarVelocidad(
                            otro
                        );
                    }


                    // ----------------------------------------
                    // CAMBIA COLOR
                    // ----------------------------------------

                    else {

                        otro.colorObjetivo =
                            colores[
                                Math.floor(
                                    Math.random() *
                                    colores.length
                                )
                            ];
                    }


                    otro.reaccion =
                        1;
                }
            );
    }


    // ========================================================
    // 4 — CAMBIA VELOCIDAD
    // ========================================================

    else if (
        accion === 4
    ) {

        const factor =
            Math.random() <
            0.5
                ? 0.45
                : 1.8;


        triangulo.vx *=
            factor;


        triangulo.vy *=
            factor;


        // ----------------------------------------------------
        // Si queda prácticamente quieto,
        // recibe una nueva velocidad.
        // ----------------------------------------------------

        if (
            Math.abs(
                triangulo.vx
            ) <
            0.05 &&

            Math.abs(
                triangulo.vy
            ) <
            0.05
        ) {

            triangulo.vx =
                (
                    Math.random() -
                    0.5
                ) *
                VELOCIDAD_MAXIMA;


            triangulo.vy =
                (
                    Math.random() -
                    0.5
                ) *
                VELOCIDAD_MAXIMA;
        }


        limitarVelocidad(
            triangulo
        );
    }


    // ========================================================
    // 5 — CREA OTRO TRIÁNGULO
    // ========================================================

    else if (
        accion === 5
    ) {

        if (
            triangulos.length >=
            MAXIMO_TRIANGULOS
        ) {

            triangulo.reaccion =
                1;

            return;
        }


        const nuevo =
            crearTriangulo(

                triangulo.x +
                    (
                        Math.random() -
                        0.5
                    ) *
                    80,

                triangulo.y +
                    (
                        Math.random() -
                        0.5
                    ) *
                    80,

                triangulo.tamaño *
                0.65
            );


        // ----------------------------------------------------
        // Hereda el color.
        // ----------------------------------------------------

        nuevo.color =
            triangulo.color;


        nuevo.colorObjetivo =
            triangulo.color;


        // ----------------------------------------------------
        // Hereda parte del movimiento.
        // ----------------------------------------------------

        nuevo.vx =
            triangulo.vx *
            (
                0.7 +
                Math.random() *
                0.4
            );


        nuevo.vy =
            triangulo.vy *
            (
                0.7 +
                Math.random() *
                0.4
            );


        limitarVelocidad(
            nuevo
        );


        triangulos.push(
            nuevo
        );


        triangulo.reaccion =
            1;
    }


    // ========================================================
    // 6 — DESAPARECE
    // ========================================================

    else if (
        accion === 6
    ) {

        triangulo.vivo =
            false;


        // ----------------------------------------------------
        // Lo elimina después de una pequeña pausa.
        // ----------------------------------------------------

        setTimeout(
            () => {

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
            400
        );
    }
}


// ============================================================
// INTERACCIÓN
// ============================================================
//
// Solo reacciona cuando se toca un triángulo.
// Tocar fuera NO genera ninguna iluminación
// ni efecto sobre la pantalla.
//

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


        if (
            triangulo
        ) {

            accionImpredecible(
                triangulo
            );
        }
    }
);


// ============================================================
// INTERPOLAR COLOR
// ============================================================

function interpolarColor(
    color1,
    color2,
    cantidad
) {

    if (
        !color1 ||
        !color2
    ) {

        return color2;
    }


    const r1 =
        parseInt(
            color1.substring(
                1,
                3
            ),
            16
        );


    const g1 =
        parseInt(
            color1.substring(
                3,
                5
            ),
            16
        );


    const b1 =
        parseInt(
            color1.substring(
                5,
                7
            ),
            16
        );


    const r2 =
        parseInt(
            color2.substring(
                1,
                3
            ),
            16
        );


    const g2 =
        parseInt(
            color2.substring(
                3,
                5
            ),
            16
        );


    const b2 =
        parseInt(
            color2.substring(
                5,
                7
            ),
            16
        );


    const r =
        Math.round(

            r1 +
            (
                r2 -
                r1
            ) *
            cantidad
        );


    const g =
        Math.round(

            g1 +
            (
                g2 -
                g1
            ) *
            cantidad
        );


    const b =
        Math.round(

            b1 +
            (
                b2 -
                b1
            ) *
            cantidad
        );


    return (

        "#" +

        r.toString(
            16
        ).padStart(
            2,
            "0"
        ) +

        g.toString(
            16
        ).padStart(
            2,
            "0"
        ) +

        b.toString(
            16
        ).padStart(
            2,
            "0"
        )
    );
}


// ============================================================
// BUCLE PRINCIPAL
// ============================================================

function animar() {

    moverTriangulos();

    colisiones();

    dibujar();


    requestAnimationFrame(
        animar
    );
}


// ============================================================
// INICIAR ANIMACIÓN
// ============================================================

animar();