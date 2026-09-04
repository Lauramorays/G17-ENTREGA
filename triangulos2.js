const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Colores utilizados por los triángulos.
const colores = [
    "#202D64",
    "#2B538E",
    "#8BB2D3",
    "#D9D9D9"
];

// Configuración del movimiento y desprendimiento.
const VELOCIDAD_BASE = 0.45;
const VELOCIDAD_HIJOS = 0.65;
const FUERZA_COLISION = 0.35;
const INTERVALO_DESPRENDIMIENTO = 700;

// Canvas.
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

// Guarda todos los triángulos.
let triangulos = [];

// Crea un triángulo con sus características.
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

        // Fase para generar la respiración.
        fase:
            Math.random() *
            Math.PI *
            2,

        // Los hijos tienen un latido más rápido.
        velocidadLatido:
            esHijo
                ? 0.13 +
                  Math.random() * 0.07
                : 0.025 +
                  Math.random() * 0.015,

        amplitudLatido:
            esHijo
                ? 0.13
                : 0.06,

        esHijo: esHijo,

        vivo: true
    };
}

// Crea los 4 triángulos grandes iniciales.
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

                    // Ahora tienen el mismo tamaño
                    // que los triángulos de Incertidumbre.
                    120,

                    false
                )
            );
        }
    );
}

crearIniciales();

// Movimiento de los triángulos.
function moverTriangulos() {

    triangulos.forEach(
        triangulo => {

            if (!triangulo.vivo)
                return;

            // Movimiento.
            triangulo.x +=
                triangulo.vx;

            triangulo.y +=
                triangulo.vy;

            // Respiración.
            triangulo.fase +=
                triangulo.velocidadLatido;

            // Límites del canvas.
            const margen =
                triangulo.tamaño *
                0.7;

            // Borde izquierdo.
            if (
                triangulo.x -
                    margen <
                0
            ) {

                triangulo.x =
                    margen;

                triangulo.vx *= -1;
            }

            // Borde derecho.
            if (
                triangulo.x +
                    margen >
                canvas.width
            ) {

                triangulo.x =
                    canvas.width -
                    margen;

                triangulo.vx *= -1;
            }

            // Borde superior.
            if (
                triangulo.y -
                    margen <
                0
            ) {

                triangulo.y =
                    margen;

                triangulo.vy *= -1;
            }

            // Borde inferior.
            if (
                triangulo.y +
                    margen >
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

// Detecta las colisiones entre los triángulos.
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

                // Empuja los triángulos al chocar.
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

                // Evita que queden superpuestos.
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

// Crea un triángulo que se desprende de un padre.
function desprenderTriangulo(
    padre
) {

    if (!padre.vivo)
        return;

    // Tamaños de los triángulos desprendidos.
    // Son más grandes que antes.
    const tamaños = [
        45,
        50,
        55,
        60,
        65
    ];

    const tamaño =
        tamaños[
            Math.floor(
                Math.random() *
                tamaños.length
            )
        ];

    // Dirección aleatoria del desprendimiento.
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

    // El hijo conserva el color del padre.
    const hijo =
        crearTriangulo(
            x,
            y,
            tamaño,
            true,
            padre.color
        );

    // El hijo sale disparado desde el padre.
    hijo.vx =
        Math.cos(angulo) *
        (
            0.4 +
            Math.random() * 0.5
        );

    hijo.vy =
        Math.sin(angulo) *
        (
            0.4 +
            Math.random() * 0.5
        );

    // Se agrega el nuevo triángulo.
    // No se modifica la cantidad ni la lógica
    // original de desprendimiento.
    triangulos.push(hijo);
}

// Desprendimiento automático.
setInterval(
    function() {

        // Busca solamente los padres.
        const padres =
            triangulos.filter(
                triangulo =>
                    triangulo.vivo &&
                    !triangulo.esHijo
            );

        padres.forEach(
            padre => {

                // Se mantiene la misma probabilidad
                // original de desprendimiento.
                if (
                    Math.random() <
                    0.75
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

// Dibuja cada triángulo.
function dibujarTriangulo(
    triangulo
) {

    if (!triangulo.vivo)
        return;

    // Genera el latido orgánico.
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

    // Altura de un triángulo equilátero.
    const altura =
        tamaño *
        Math.sqrt(3) /
        2;

    ctx.save();

    ctx.translate(
        triangulo.x,
        triangulo.y
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

// Dibuja todos los triángulos.
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

// Busca solamente los triángulos hijos.
function buscarTriangulo(
    x,
    y
) {

    // Revisa primero los últimos creados.
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

        // Los padres no pueden tocarse
        // para eliminarlos.
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

// Al tocar un triángulo desprendido,
// este desaparece.
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

            // El hijo desaparece.
            triangulo.vivo =
                false;

            // Se elimina del array.
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