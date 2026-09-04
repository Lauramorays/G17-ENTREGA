const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const colores = [
    "#202D64",
    "#2B538E",
    "#8BB2D3",
    "#D9D9D9"
];

const VELOCIDAD_MAXIMA = 0.8;
const FUERZA_COLISION = 0.4;

let triangulos = [];


// ===============================
// AJUSTAR CANVAS
// ===============================

function ajustarCanvas() {

    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;

}

window.addEventListener("resize", ajustarCanvas);

ajustarCanvas();


// ===============================
// CREAR TRIÁNGULO
// ===============================

function crearTriangulo(x, y, tamaño = 45) {

    const angulo = Math.random() * Math.PI * 2;

    return {

        x: x,
        y: y,

        vx: (Math.random() - 0.5) * VELOCIDAD_MAXIMA,
        vy: (Math.random() - 0.5) * VELOCIDAD_MAXIMA,

        tamaño: tamaño,
        tamañoObjetivo: tamaño,

        color: colores[
            Math.floor(Math.random() * colores.length)
        ],

        colorObjetivo: colores[
            Math.floor(Math.random() * colores.length)
        ],

        angulo: angulo,
        anguloObjetivo: angulo,

        fase: Math.random() * Math.PI * 2,

        respiracion: 0,

        reaccion: 0,

        vivo: true

    };

}


// ===============================
// 4 TRIÁNGULOS INICIALES
// ===============================

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

    posiciones.forEach(pos => {

        triangulos.push(
            crearTriangulo(
                pos.x,
                pos.y,
                45
            )
        );

    });

}

crearIniciales();


// ===============================
// DISTANCIA
// ===============================

function distancia(a, b) {

    const dx = a.x - b.x;
    const dy = a.y - b.y;

    return Math.sqrt(
        dx * dx +
        dy * dy
    );

}


// ===============================
// MOVIMIENTO
// ===============================

function moverTriangulos() {

    triangulos.forEach(triangulo => {

        if (!triangulo.vivo) return;


        // Movimiento autónomo
        triangulo.x += triangulo.vx;
        triangulo.y += triangulo.vy;


        // ===========================
        // RESPIRACIÓN
        // ===========================

        triangulo.fase += 0.025;

        triangulo.respiracion =
            Math.sin(triangulo.fase) * 0.06;


        // ===========================
        // INTERPOLAR TAMAÑO
        // ===========================

        triangulo.tamaño +=
            (
                triangulo.tamañoObjetivo -
                triangulo.tamaño
            ) * 0.035;


        // ===========================
        // ROTACIÓN ORGÁNICA
        // ===========================

        triangulo.angulo +=
            (
                triangulo.anguloObjetivo -
                triangulo.angulo
            ) * 0.02;


        // ===========================
        // COLOR
        // ===========================

        if (triangulo.color !== triangulo.colorObjetivo) {

            triangulo.color =
                interpolarColor(
                    triangulo.color,
                    triangulo.colorObjetivo,
                    0.025
                );

        }


        // ===========================
        // REACCIÓN
        // ===========================

        if (triangulo.reaccion > 0) {

            triangulo.reaccion -= 0.02;

            triangulo.angulo +=
                Math.sin(triangulo.reaccion * 15) * 0.01;

        }


        // ===========================
        // BORDES
        // ===========================

        const radio =
            triangulo.tamaño * 0.8;


        if (triangulo.x - radio < 0) {

            triangulo.x = radio;
            triangulo.vx *= -1;

        }


        if (triangulo.x + radio > canvas.width) {

            triangulo.x =
                canvas.width - radio;

            triangulo.vx *= -1;

        }


        if (triangulo.y - radio < 0) {

            triangulo.y = radio;
            triangulo.vy *= -1;

        }


        if (triangulo.y + radio > canvas.height) {

            triangulo.y =
                canvas.height - radio;

            triangulo.vy *= -1;

        }

    });

}


// ===============================
// COLISIONES
// ===============================

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

            const a = triangulos[i];
            const b = triangulos[j];

            if (!a.vivo || !b.vivo) continue;


            const dx = b.x - a.x;
            const dy = b.y - a.y;

            const d =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            const distanciaMinima =
                (a.tamaño + b.tamaño) * 0.55;


            if (
                d > 0 &&
                d < distanciaMinima
            ) {

                const nx = dx / d;
                const ny = dy / d;

                const fuerza =
                    FUERZA_COLISION;


                a.vx -= nx * fuerza * 0.02;
                a.vy -= ny * fuerza * 0.02;

                b.vx += nx * fuerza * 0.02;
                b.vy += ny * fuerza * 0.02;


                // Separación

                const separacion =
                    distanciaMinima - d;


                a.x -= nx * separacion * 0.5;
                a.y -= ny * separacion * 0.5;

                b.x += nx * separacion * 0.5;
                b.y += ny * separacion * 0.5;

            }

        }

    }

}


// ===============================
// DIBUJAR TRIÁNGULO
// ===============================

function dibujarTriangulo(triangulo) {

    if (!triangulo.vivo) return;


    const escala =
        1 + triangulo.respiracion;


    const tamaño =
        triangulo.tamaño * escala;


    const altura =
        tamaño * Math.sqrt(3) / 2;


    ctx.save();

    ctx.translate(
        triangulo.x,
        triangulo.y
    );

    ctx.rotate(
        triangulo.angulo
    );


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


// ===============================
// DIBUJAR TODO
// ===============================

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


// ===============================
// BUSCAR TRIÁNGULO
// ===============================

function buscarTriangulo(x, y) {

    for (
        let i = triangulos.length - 1;
        i >= 0;
        i--
    ) {

        const triangulo =
            triangulos[i];


        if (!triangulo.vivo)
            continue;


        const dx =
            x - triangulo.x;

        const dy =
            y - triangulo.y;


        const radio =
            triangulo.tamaño * 0.75;


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


// ===============================
// ACCIÓN IMPREDECIBLE
// ===============================

function accionImpredecible(triangulo) {

    const accion =
        Math.floor(
            Math.random() * 7
        );


    // ===========================
    // 1. CRECER
    // ===========================

    if (accion === 0) {

        triangulo.tamañoObjetivo =
            Math.min(
                triangulo.tamaño * 1.8,
                130
            );

        triangulo.reaccion = 1;

        mostrarMensaje("CRECIÓ");

    }


    // ===========================
    // 2. CAMBIAR POSICIÓN
    // ===========================

    else if (accion === 1) {

        const margen = 80;

        triangulo.x =
            margen +
            Math.random() *
            (canvas.width - margen * 2);

        triangulo.y =
            margen +
            Math.random() *
            (canvas.height - margen * 2);

        triangulo.reaccion = 1;

        mostrarMensaje("CAMBIÓ DE LUGAR");

    }


    // ===========================
    // 3. CAMBIAR COLOR
    // ===========================

    else if (accion === 2) {

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

        triangulo.reaccion = 1;

        mostrarMensaje("CAMBIÓ");

    }


    // ===========================
    // 4. HACER REACCIONAR A OTROS
    // ===========================

    else if (accion === 3) {

        const cantidad =
            Math.min(
                triangulos.length - 1,
                Math.floor(
                    Math.random() * 3
                ) + 1
            );


        const candidatos =
            triangulos.filter(
                t =>
                    t !== triangulo &&
                    t.vivo
            );


        candidatos
            .sort(
                () => Math.random() - 0.5
            )
            .slice(0, cantidad)
            .forEach(otro => {

                const tipo =
                    Math.floor(
                        Math.random() * 3
                    );


                if (tipo === 0) {

                    otro.tamañoObjetivo =
                        Math.min(
                            otro.tamaño * 1.5,
                            110
                        );

                }

                else if (tipo === 1) {

                    otro.vx *= 1.8;
                    otro.vy *= 1.8;

                }

                else {

                    otro.colorObjetivo =
                        colores[
                            Math.floor(
                                Math.random() *
                                colores.length
                            )
                        ];

                }


                otro.reaccion = 1;

            });


        mostrarMensaje("TODO REACCIONÓ");

    }


    // ===========================
    // 5. CAMBIAR VELOCIDAD
    // ===========================

    else if (accion === 4) {

        const factor =
            Math.random() < 0.5
                ? 0.35
                : 2.5;


        triangulo.vx *= factor;
        triangulo.vy *= factor;


        // Evitar que quede completamente quieto

        if (
            Math.abs(triangulo.vx) < 0.08 &&
            Math.abs(triangulo.vy) < 0.08
        ) {

            triangulo.vx =
                (Math.random() - 0.5) *
                VELOCIDAD_MAXIMA;

            triangulo.vy =
                (Math.random() - 0.5) *
                VELOCIDAD_MAXIMA;

        }


        // Limitar velocidad

        const velocidad =
            Math.sqrt(
                triangulo.vx ** 2 +
                triangulo.vy ** 2
            );


        if (
            velocidad >
            VELOCIDAD_MAXIMA * 3
        ) {

            triangulo.vx =
                (triangulo.vx / velocidad) *
                VELOCIDAD_MAXIMA * 3;

            triangulo.vy =
                (triangulo.vy / velocidad) *
                VELOCIDAD_MAXIMA * 3;

        }


        mostrarMensaje("CAMBIÓ LA VELOCIDAD");

    }


    // ===========================
    // 6. MULTIPLICARSE
    // ===========================

    else if (accion === 5) {

        const nuevo =
            crearTriangulo(
                triangulo.x +
                (Math.random() - 0.5) * 80,

                triangulo.y +
                (Math.random() - 0.5) * 80,

                triangulo.tamaño * 0.65
            );


        // Hereda algunas características

        nuevo.color =
            triangulo.color;

        nuevo.colorObjetivo =
            triangulo.color;

        nuevo.vx =
            triangulo.vx *
            (0.8 + Math.random() * 0.5);

        nuevo.vy =
            triangulo.vy *
            (0.8 + Math.random() * 0.5);


        triangulos.push(nuevo);

        triangulo.reaccion = 1;

        mostrarMensaje("SE MULTIPLICÓ");

    }


    // ===========================
    // 7. DESAPARECER
    // ===========================

    else if (accion === 6) {

        triangulo.vivo = false;

        mostrarMensaje("DESAPARECIÓ");


        // Sacarlo después de un pequeño tiempo

        setTimeout(() => {

            const indice =
                triangulos.indexOf(
                    triangulo
                );


            if (indice !== -1) {

                triangulos.splice(
                    indice,
                    1
                );

            }

        }, 500);

    }

}


// ===============================
// MENSAJE
// ===============================

let mensajeTimer = null;

function mostrarMensaje(texto) {

    const mensaje =
        document.getElementById("mensaje");


    mensaje.textContent =
        texto;


    clearTimeout(
        mensajeTimer
    );


    mensajeTimer =
        setTimeout(() => {

            mensaje.textContent =
                "TOCÁ UN TRIÁNGULO";

        }, 1000);

}


// ===============================
// COLOR
// ===============================

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
            color1.substring(1, 3),
            16
        );

    const g1 =
        parseInt(
            color1.substring(3, 5),
            16
        );

    const b1 =
        parseInt(
            color1.substring(5, 7),
            16
        );


    const r2 =
        parseInt(
            color2.substring(1, 3),
            16
        );

    const g2 =
        parseInt(
            color2.substring(3, 5),
            16
        );

    const b2 =
        parseInt(
            color2.substring(5, 7),
            16
        );


    const r =
        Math.round(
            r1 +
            (r2 - r1) *
            cantidad
        );

    const g =
        Math.round(
            g1 +
            (g2 - g1) *
            cantidad
        );

    const b =
        Math.round(
            b1 +
            (b2 - b1) *
            cantidad
        );


    return (
        "#" +
        r.toString(16).padStart(2, "0") +
        g.toString(16).padStart(2, "0") +
        b.toString(16).padStart(2, "0")
    );

}


// ===============================
// TOQUE
// ===============================

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

            accionImpredecible(
                triangulo
            );

        }

    }
);


// ===============================
// ANIMACIÓN
// ===============================

function animar() {

    moverTriangulos();

    colisiones();

    dibujar();

    requestAnimationFrame(
        animar
    );

}

animar();