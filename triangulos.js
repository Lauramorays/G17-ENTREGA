const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const colores = [
    "#202D64",
    "#2B538E",
    "#8BB2D3",
    "#D9D9D9"
];

const VELOCIDAD_MAXIMA = 0.8;
const VELOCIDAD_ABSOLUTA_MAXIMA = 2.2;
const FUERZA_COLISION = 0.4;

const TAMAÑO_INICIAL = 120;
const TAMAÑO_MAXIMO = 145;

const MAXIMO_TRIANGULOS = 9;

let triangulos = [];

// Ajusta el canvas al tamaño real del área de juego.
function ajustarCanvas() {
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;
}

window.addEventListener("resize", ajustarCanvas);
ajustarCanvas();

// Crea un triángulo con movimiento, respiración y color aleatorios.
function crearTriangulo(x, y, tamaño = TAMAÑO_INICIAL) {
    const angulo = Math.random() * Math.PI * 2;
    const colorInicial =
        colores[Math.floor(Math.random() * colores.length)];

    return {
        x: x,
        y: y,

        vx: (Math.random() - 0.5) * VELOCIDAD_MAXIMA,
        vy: (Math.random() - 0.5) * VELOCIDAD_MAXIMA,

        tamaño: tamaño,
        tamañoObjetivo: tamaño,

        color: colorInicial,
        colorObjetivo: colorInicial,

        angulo: angulo,
        anguloObjetivo: angulo,

        fase: Math.random() * Math.PI * 2,
        respiracion: 0,

        reaccion: 0,

        vivo: true
    };
}

// Crea los cuatro triángulos iniciales.
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
                TAMAÑO_INICIAL
            )
        );
    });
}

crearIniciales();

// Limita la velocidad para evitar que las colisiones acumulen demasiada energía.
function limitarVelocidad(triangulo) {
    let velocidad = Math.sqrt(
        triangulo.vx * triangulo.vx +
        triangulo.vy * triangulo.vy
    );

    if (velocidad > VELOCIDAD_ABSOLUTA_MAXIMA) {
        triangulo.vx =
            (triangulo.vx / velocidad) *
            VELOCIDAD_ABSOLUTA_MAXIMA;

        triangulo.vy =
            (triangulo.vy / velocidad) *
            VELOCIDAD_ABSOLUTA_MAXIMA;
    }
}

// Mueve los triángulos y mantiene su movimiento orgánico.
function moverTriangulos() {
    triangulos.forEach(triangulo => {
        if (!triangulo.vivo) return;

        triangulo.x += triangulo.vx;
        triangulo.y += triangulo.vy;

        // Movimiento suave de respiración.
        triangulo.fase += 0.025;

        triangulo.respiracion =
            Math.sin(triangulo.fase) * 0.06;

        // Cambia suavemente hacia el nuevo tamaño.
        triangulo.tamaño +=
            (triangulo.tamañoObjetivo -
                triangulo.tamaño) *
            0.035;

        // Cambia suavemente la rotación.
        triangulo.angulo +=
            (triangulo.anguloObjetivo -
                triangulo.angulo) *
            0.02;

        // Cambia suavemente el color.
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

        // Pequeña reacción después de una interacción.
        if (triangulo.reaccion > 0) {
            triangulo.reaccion -= 0.02;

            triangulo.angulo +=
                Math.sin(
                    triangulo.reaccion * 15
                ) * 0.01;
        }

        limitarVelocidad(triangulo);

        // Radio utilizado para detectar los bordes.
        const radio =
            triangulo.tamaño * 0.8;

        // Rebote contra el borde izquierdo.
        if (triangulo.x - radio < 0) {
            triangulo.x = radio;
            triangulo.vx =
                Math.abs(triangulo.vx);
        }

        // Rebote contra el borde derecho.
        if (
            triangulo.x + radio >
            canvas.width
        ) {
            triangulo.x =
                canvas.width - radio;

            triangulo.vx =
                -Math.abs(triangulo.vx);
        }

        // Rebote contra el borde superior.
        if (triangulo.y - radio < 0) {
            triangulo.y = radio;
            triangulo.vy =
                Math.abs(triangulo.vy);
        }

        // Rebote contra el borde inferior.
        if (
            triangulo.y + radio >
            canvas.height
        ) {
            triangulo.y =
                canvas.height - radio;

            triangulo.vy =
                -Math.abs(triangulo.vy);
        }
    });
}

// Detecta y resuelve las colisiones entre triángulos.
function colisiones() {
    for (
        let i = 0;
        i < triangulos.length;
        i++
    ) {
        const a = triangulos[i];

        if (!a.vivo) continue;

        for (
            let j = i + 1;
            j < triangulos.length;
            j++
        ) {
            const b = triangulos[j];

            if (!b.vivo) continue;

            const dx = b.x - a.x;
            const dy = b.y - a.y;

            const distancia =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );

            const distanciaMinima =
                (a.tamaño + b.tamaño) *
                0.55;

            if (
                distancia > 0 &&
                distancia < distanciaMinima
            ) {
                const nx =
                    dx / distancia;

                const ny =
                    dy / distancia;

                // Separa físicamente los triángulos.
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

                // Genera un pequeño impulso.
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

                // Evita velocidades excesivas.
                limitarVelocidad(a);
                limitarVelocidad(b);
            }
        }
    }
}

// Dibuja un triángulo equilátero.
function dibujarTriangulo(triangulo) {
    if (!triangulo.vivo) return;

    const escala =
        1 + triangulo.respiracion;

    const tamaño =
        triangulo.tamaño * escala;

    const altura =
        tamaño *
        Math.sqrt(3) /
        2;

    ctx.save();

    ctx.translate(
        triangulo.x,
        triangulo.y
    );

    ctx.rotate(
        triangulo.angulo
    );

    ctx.beginPath();

    // Triángulo equilátero centrado.
    ctx.moveTo(
        0,
        -altura * 2 / 3
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
        triangulo.color;

    ctx.fill();

    ctx.restore();
}

// Limpia y vuelve a dibujar todos los triángulos.
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

// Busca qué triángulo fue tocado.
function buscarTriangulo(x, y) {
    for (
        let i = triangulos.length - 1;
        i >= 0;
        i--
    ) {
        const triangulo =
            triangulos[i];

        if (!triangulo.vivo) continue;

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

// Ejecuta una reacción aleatoria cuando se toca un triángulo.
function accionImpredecible(triangulo) {
    const accion =
        Math.floor(
            Math.random() * 7
        );

    // Crece.
    if (accion === 0) {
        triangulo.tamañoObjetivo =
            Math.min(
                triangulo.tamaño * 1.8,
                TAMAÑO_MAXIMO
            );

        triangulo.reaccion = 1;
    }

    // Se mueve a otra posición.
    else if (accion === 1) {
        const margen = 100;

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

        triangulo.reaccion = 1;
    }

    // Cambia de color.
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
    }

    // Hace reaccionar a otros triángulos.
    else if (accion === 3) {
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
                    Math.random() * 2
                ) + 1
            );

        candidatos
            .sort(
                () =>
                    Math.random() - 0.5
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
                            otro.tamaño * 0.4,
                            TAMAÑO_MAXIMO
                        );
                }

                else if (tipo === 1) {
                    otro.vx *= 1.5;
                    otro.vy *= 1.5;

                    limitarVelocidad(
                        otro
                    );
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
    }

    // Cambia su velocidad.
    else if (accion === 4) {
        const factor =
            Math.random() < 0.5
                ? 0.45
                : 1.8;

        triangulo.vx *= factor;
        triangulo.vy *= factor;

        // Si queda prácticamente quieto,
        // recibe una pequeña velocidad nueva.
        if (
            Math.abs(triangulo.vx) < 0.05 &&
            Math.abs(triangulo.vy) < 0.05
        ) {
            triangulo.vx =
                (Math.random() - 0.5) *
                VELOCIDAD_MAXIMA;

            triangulo.vy =
                (Math.random() - 0.5) *
                VELOCIDAD_MAXIMA;
        }

        limitarVelocidad(
            triangulo
        );
    }

    // Crea otro triángulo solamente si todavía hay espacio.
    else if (accion === 5) {
        if (
            triangulos.length >=
            MAXIMO_TRIANGULOS
        ) {
            triangulo.reaccion = 1;
            return;
        }

        const nuevo =
            crearTriangulo(
                triangulo.x +
                    (Math.random() - 0.5) *
                        80,

                triangulo.y +
                    (Math.random() - 0.5) *
                        80,

                triangulo.tamaño * 0.65
            );

        nuevo.color =
            triangulo.color;

        nuevo.colorObjetivo =
            triangulo.color;

        nuevo.vx =
            triangulo.vx *
            (0.7 + Math.random() * 0.4);

        nuevo.vy =
            triangulo.vy *
            (0.7 + Math.random() * 0.4);

        limitarVelocidad(
            nuevo
        );

        triangulos.push(nuevo);

        triangulo.reaccion = 1;
    }

    // Hace desaparecer el triángulo.
    else if (accion === 6) {
        triangulo.vivo = false;

        // Lo elimina después de una pequeña pausa.
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
        }, 400);
    }
}

// Detecta mouse, toque y lápiz.
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

// Interpola suavemente entre dos colores.
function interpolarColor(
    color1,
    color2,
    cantidad
) {
    if (!color1 || !color2) {
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

// Bucle principal de animación.
function animar() {
    moverTriangulos();
    colisiones();
    dibujar();

    requestAnimationFrame(
        animar
    );
}

animar();