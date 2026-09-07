
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

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

const VELOCIDAD_BASE = 0.65;
const VELOCIDAD_HIJOS = 0.95;

const VELOCIDAD_MAXIMA = 2.2;

const FUERZA_COLISION = 0.45;

// Más rápido que antes.
const INTERVALO_DESPRENDIMIENTO = 450;

// MISMO TAMAÑO QUE INCERTIDUMBRE.
const TAMAÑO_INICIAL = 135;

// ============================================================
// CANVAS
// ============================================================

function ajustarCanvas() {

    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;
}

window.addEventListener(
    "resize",
    ajustarCanvas
);

ajustarCanvas();

// ============================================================
// TRIÁNGULOS
// ============================================================

let triangulos = [];

// ============================================================
// CREAR TRIÁNGULO
// ============================================================

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

        // ====================================================
        // RESPIRACIÓN
        // ====================================================

        fase:
            Math.random() *
            Math.PI *
            2,

        velocidadLatido:
            esHijo
                ? 0.16 +
                  Math.random() * 0.10
                : 0.035 +
                  Math.random() * 0.025,

        amplitudLatido:
            esHijo
                ? 0.15
                : 0.07,

        // ====================================================
        // MOVIMIENTO ERRÁTICO
        // ====================================================

        faseMovimiento:
            Math.random() *
            Math.PI *
            2,

        velocidadCambio:
            0.025 +
            Math.random() * 0.035,

        esHijo: esHijo,

        vivo: true
    };
}

// ============================================================
// CREAR TRIÁNGULOS INICIALES
// ============================================================

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
                    TAMAÑO_INICIAL,
                    false
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

    const velocidad =
        Math.sqrt(
            triangulo.vx *
                triangulo.vx +
            triangulo.vy *
                triangulo.vy
        );

    if (
        velocidad >
        VELOCIDAD_MAXIMA
    ) {

        triangulo.vx =
            (
                triangulo.vx /
                velocidad
            ) *
            VELOCIDAD_MAXIMA;

        triangulo.vy =
            (
                triangulo.vy /
                velocidad
            ) *
            VELOCIDAD_MAXIMA;
    }
}

// ============================================================
// MOVIMIENTO
// ============================================================

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

            // =================================================
            // RESPIRACIÓN
            // =================================================

            triangulo.fase +=
                triangulo.velocidadLatido;

            // =================================================
            // MOVIMIENTO ERRÁTICO
            // =================================================

            triangulo.faseMovimiento +=
                triangulo.velocidadCambio;

            triangulo.vx +=
                Math.sin(
                    triangulo.faseMovimiento
                ) *
                (
                    triangulo.esHijo
                        ? 0.045
                        : 0.025
                );

            triangulo.vy +=
                Math.cos(
                    triangulo.faseMovimiento *
                    1.37
                ) *
                (
                    triangulo.esHijo
                        ? 0.045
                        : 0.025
                );

            // Cambios bruscos ocasionales.
            if (
                Math.random() <
                (
                    triangulo.esHijo
                        ? 0.018
                        : 0.008
                )
            ) {

                triangulo.vx +=
                    (
                        Math.random() -
                        0.5
                    ) *
                    (
                        triangulo.esHijo
                            ? 0.35
                            : 0.20
                    );

                triangulo.vy +=
                    (
                        Math.random() -
                        0.5
                    ) *
                    (
                        triangulo.esHijo
                            ? 0.35
                            : 0.20
                    );
            }

            limitarVelocidad(
                triangulo
            );

            // =================================================
            // BORDES
            // =================================================

            const margen =
                triangulo.tamaño *
                0.7;

            // Izquierda.
            if (
                triangulo.x -
                    margen <
                0
            ) {

                triangulo.x =
                    margen;

                triangulo.vx =
                    Math.abs(
                        triangulo.vx
                    );

                triangulo.vy +=
                    (
                        Math.random() -
                        0.5
                    ) *
                    0.15;
            }

            // Derecha.
            if (
                triangulo.x +
                    margen >
                canvas.width
            ) {

                triangulo.x =
                    canvas.width -
                    margen;

                triangulo.vx =
                    -Math.abs(
                        triangulo.vx
                    );

                triangulo.vy +=
                    (
                        Math.random() -
                        0.5
                    ) *
                    0.15;
            }

            // Arriba.
            if (
                triangulo.y -
                    margen <
                0
            ) {

                triangulo.y =
                    margen;

                triangulo.vy =
                    Math.abs(
                        triangulo.vy
                    );

                triangulo.vx +=
                    (
                        Math.random() -
                        0.5
                    ) *
                    0.15;
            }

            // Abajo.
            if (
                triangulo.y +
                    margen >
                canvas.height
            ) {

                triangulo.y =
                    canvas.height -
                    margen;

                triangulo.vy =
                    -Math.abs(
                        triangulo.vy
                    );

                triangulo.vx +=
                    (
                        Math.random() -
                        0.5
                    ) *
                    0.15;
            }

            limitarVelocidad(
                triangulo
            );
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
                ) *
                0.45;

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

                // Empuje.
                a.vx -=
                    nx *
                    FUERZA_COLISION *
                    0.035;

                a.vy -=
                    ny *
                    FUERZA_COLISION *
                    0.035;

                b.vx +=
                    nx *
                    FUERZA_COLISION *
                    0.035;

                b.vy +=
                    ny *
                    FUERZA_COLISION *
                    0.035;

                // Separación.
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

                limitarVelocidad(a);
                limitarVelocidad(b);
            }
        }
    }
}

// ============================================================
// DESPRENDER TRIÁNGULO
// ============================================================

function desprenderTriangulo(
    padre
) {

    if (!padre.vivo)
        return;

    // Tamaño de los hijos.
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

    // Dirección aleatoria.
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

    // ========================================================
    // SALIDA RÁPIDA
    // ========================================================

    const velocidadSalida =
        0.65 +
        Math.random() *
        0.65;

    hijo.vx =
        Math.cos(angulo) *
        velocidadSalida;

    hijo.vy =
        Math.sin(angulo) *
        velocidadSalida;

    // Desvío aleatorio.
    hijo.vx +=
        (
            Math.random() -
            0.5
        ) *
        0.35;

    hijo.vy +=
        (
            Math.random() -
            0.5
        ) *
        0.35;

    limitarVelocidad(
        hijo
    );

    triangulos.push(
        hijo
    );
}

// ============================================================
// DESPRENDIMIENTO AUTOMÁTICO
// ============================================================

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

                // Mayor cantidad de desprendimientos.
                if (
                    Math.random() <
                    0.88
                ) {

                    desprenderTriangulo(
                        padre
                    );
                }

                // Posibilidad de que salgan
                // dos en el mismo momento.
                if (
                    Math.random() <
                    0.18
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

// ============================================================
// GRADIENTE
// ============================================================

function obtenerGradiente(
    triangulo,
    tamaño
) {

    const gradiente =
        ctx.createRadialGradient(
            -tamaño * 0.18,
            -tamaño * 0.22,
            tamaño * 0.04,

            0,
            0,
            tamaño * 0.75
        );

    if (
        triangulo.color ===
        "#D9D9D9"
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

    else if (
        triangulo.color ===
        "#8BB2D3"
    ) {

        gradiente.addColorStop(
            0,
            "#DCECF9"
        );

        gradiente.addColorStop(
            0.45,
            "#8BB2D3"
        );

        gradiente.addColorStop(
            1,
            "#527A9C"
        );
    }

    else if (
        triangulo.color ===
        "#202D64"
    ) {

        gradiente.addColorStop(
            0,
            "#6674A5"
        );

        gradiente.addColorStop(
            0.45,
            "#202D64"
        );

        gradiente.addColorStop(
            1,
            "#10183B"
        );
    }

    else {

        gradiente.addColorStop(
            0,
            "#7EA7D0"
        );

        gradiente.addColorStop(
            0.45,
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
// DIBUJAR TRIÁNGULO
// ============================================================

function dibujarTriangulo(
    triangulo
) {

    if (!triangulo.vivo)
        return;

    // Latido.
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

    // ========================================================
    // FORMA
    // ========================================================

    ctx.beginPath();

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

    // ========================================================
    // SOMBRA
    // ========================================================

    if (
        triangulo.color ===
        "#D9D9D9"
    ) {

        ctx.shadowColor =
            "rgba(217,217,217,0.25)";

    }

    else if (
        triangulo.color ===
        "#8BB2D3"
    ) {

        ctx.shadowColor =
            "rgba(139,178,211,0.30)";

    }

    else if (
        triangulo.color ===
        "#202D64"
    ) {

        ctx.shadowColor =
            "rgba(32,45,100,0.35)";

    }

    else {

        ctx.shadowColor =
            "rgba(43,83,142,0.35)";
    }

    ctx.shadowBlur = 13;
    ctx.shadowOffsetY = 1;

    // ========================================================
    // DEGRADADO
    // ========================================================

    ctx.fillStyle =
        obtenerGradiente(
            triangulo,
            tamaño
        );

    ctx.fill();

    // Quitamos la sombra.
    ctx.shadowBlur = 0;

    // ========================================================
    // BRILLO INTERIOR
    // ========================================================

    ctx.beginPath();

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

    const brillo =
        ctx.createRadialGradient(
            -tamaño * 0.15,
            -tamaño * 0.22,
            0,

            0,
            0,
            tamaño * 0.7
        );

    brillo.addColorStop(
        0,
        "rgba(255,255,255,0.25)"
    );

    brillo.addColorStop(
        0.35,
        "rgba(255,255,255,0.06)"
    );

    brillo.addColorStop(
        0.75,
        "rgba(0,0,0,0)"
    );

    brillo.addColorStop(
        1,
        "rgba(0,0,0,0.12)"
    );

    ctx.fillStyle =
        brillo;

    ctx.fill();

    // ========================================================
    // BORDE SUAVE
    // ========================================================

    ctx.beginPath();

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

    ctx.strokeStyle =
        "rgba(196,206,229,0.16)";

    ctx.lineWidth = 0.8;

    ctx.stroke();

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

    triangulos.forEach(
        triangulo =>
            dibujarTriangulo(
                triangulo
            )
    );
}

// ============================================================
// BUSCAR HIJO
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

        if (!triangulo.vivo)
            continue;

        // Los padres no se pueden eliminar.
        if (!triangulo.esHijo)
            continue;

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
            ) < radio
        ) {

            return triangulo;
        }
    }

    return null;
}

// ============================================================
// INTERACCIÓN
// ============================================================

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

// ============================================================
// ANIMACIÓN
// ============================================================

function animar() {

    moverTriangulos();

    colisiones();

    dibujar();

    requestAnimationFrame(
        animar
    );
}

animar();

