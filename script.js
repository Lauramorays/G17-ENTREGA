
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const mensaje = document.getElementById("mensaje");

let figuras = [];

let acomodando = false;
let acomodado = false;

let tiempoAcomodamiento = 0;


// =====================================
// COLORES
// =====================================

const colores = {
    cuadrado: "#D9D9D9",
    circulo: "#8BB2D3",
    triangulo: "#202D64"
};


// =====================================
// NOMBRES DE LAS EXPERIENCIAS
// =====================================

const nombres = [
    "MEMORIA",
    "HERENCIA",
    "CADUCIDAD",

    "IDENTIDAD",
    "EMPATÍA",
    "COLABORACIÓN",

    "INCERTIDUMBRE",
    "ANCIEDAD",
    "EXPECTATIVA"
];


// =====================================
// CANVAS
// =====================================

function ajustarCanvas() {

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

}

ajustarCanvas();

window.addEventListener("resize", () => {

    ajustarCanvas();

});


// =====================================
// CREAR FIGURAS
// =====================================

function crearFiguras() {

    figuras = [];


    // =================================
    // CUADRADOS
    // MEMORIA - HERENCIA - CADUCIDAD
    // =================================

    for (let i = 0; i < 3; i++) {

        figuras.push({

            tipo: "cuadrado",

            nombre: nombres[i],

            x:
                Math.random() *
                (canvas.width - 120) +
                60,

            y:
                Math.random() *
                (canvas.height - 120) +
                60,

            tamaño: 45,

            vx:
                (Math.random() - 0.5) *
                1.5,

            vy:
                (Math.random() - 0.5) *
                1.5,

            color:
                colores.cuadrado,

            radio: 32,

            destinoX: 0,
            destinoY: 0,

            faseRespiracion:
                Math.random() *
                Math.PI *
                2,

            velocidadRespiracion:
                0.0012 +
                Math.random() *
                0.0004,

            intensidadRespiracion:
                0.055 +
                Math.random() *
                0.02,

            escala: 1

        });

    }


    // =================================
    // CÍRCULOS
    // IDENTIDAD - EMPATÍA - COLABORACIÓN
    // =================================

    for (let i = 0; i < 3; i++) {

        figuras.push({

            tipo: "circulo",

            nombre: nombres[i + 3],

            x:
                Math.random() *
                (canvas.width - 120) +
                60,

            y:
                Math.random() *
                (canvas.height - 120) +
                60,

            tamaño: 25,

            vx:
                (Math.random() - 0.5) *
                1.5,

            vy:
                (Math.random() - 0.5) *
                1.5,

            color:
                colores.circulo,

            radio: 28,

            destinoX: 0,
            destinoY: 0,

            faseRespiracion:
                Math.random() *
                Math.PI *
                2,

            velocidadRespiracion:
                0.0012 +
                Math.random() *
                0.0004,

            intensidadRespiracion:
                0.055 +
                Math.random() *
                0.02,

            escala: 1

        });

    }


    // =================================
    // TRIÁNGULOS
    // INCERTIDUMBRE - DESPRENDIMIENTO - EXPECTATIVA
    // =================================

    for (let i = 0; i < 3; i++) {

        figuras.push({

            tipo: "triangulo",

            nombre: nombres[i + 6],

            x:
                Math.random() *
                (canvas.width - 120) +
                60,

            y:
                Math.random() *
                (canvas.height - 120) +
                60,

            tamaño: 30,

            vx:
                (Math.random() - 0.5) *
                1.5,

            vy:
                (Math.random() - 0.5) *
                1.5,

            color:
                colores.triangulo,

            radio: 32,

            destinoX: 0,
            destinoY: 0,

            faseRespiracion:
                Math.random() *
                Math.PI *
                2,

            velocidadRespiracion:
                0.0012 +
                Math.random() *
                0.0004,

            intensidadRespiracion:
                0.055 +
                Math.random() *
                0.02,

            escala: 1

        });

    }

}

crearFiguras();


// =====================================
// CREAR DEGRADADO
// =====================================

function crearGradiente(figura) {

    const radio =
        figura.tamaño * 1.5;

    let gradiente;


    // =================================
    // CUADRADO
    // =================================

    if (
        figura.tipo === "cuadrado"
    ) {

        gradiente =
            ctx.createRadialGradient(

                -figura.tamaño * 0.35,
                -figura.tamaño * 0.35,
                figura.tamaño * 0.05,

                0,
                0,
                radio

            );


        gradiente.addColorStop(
            0,
            "#FFFFFF"
        );

        gradiente.addColorStop(
            0.18,
            "#F1F3F5"
        );

        gradiente.addColorStop(
            0.58,
            "#D9D9D9"
        );

        gradiente.addColorStop(
            1,
            "#AEB4BA"
        );

    }


    // =================================
    // CÍRCULO
    // =================================

    else if (
        figura.tipo === "circulo"
    ) {

        gradiente =
            ctx.createRadialGradient(

                -figura.tamaño * 0.35,
                -figura.tamaño * 0.35,
                figura.tamaño * 0.05,

                0,
                0,
                radio

            );


        gradiente.addColorStop(
            0,
            "#DCECF9"
        );

        gradiente.addColorStop(
            0.20,
            "#BBD8EC"
        );

        gradiente.addColorStop(
            0.60,
            "#8BB2D3"
        );

        gradiente.addColorStop(
            1,
            "#527A9C"
        );

    }


    // =================================
    // TRIÁNGULO
    // =================================

    else {

        gradiente =
            ctx.createRadialGradient(

                -figura.tamaño * 0.35,
                -figura.tamaño * 0.35,
                figura.tamaño * 0.05,

                0,
                0,
                radio

            );


        gradiente.addColorStop(
            0,
            "#6674A5"
        );

        gradiente.addColorStop(
            0.22,
            "#46558C"
        );

        gradiente.addColorStop(
            0.60,
            "#202D64"
        );

        gradiente.addColorStop(
            1,
            "#10183B"
        );

    }


    return gradiente;

}


// =====================================
// DIBUJAR FIGURA
// =====================================

function dibujarFigura(figura) {

    ctx.save();


    ctx.translate(
        figura.x,
        figura.y
    );


    // =================================
    // RESPIRACIÓN
    // =================================

    const tiempo =
        Date.now();


    const respiracion =
        Math.sin(

            tiempo *
            figura.velocidadRespiracion +
            figura.faseRespiracion

        );


    figura.escala =
        1 +
        respiracion *
        figura.intensidadRespiracion;


    ctx.scale(
        figura.escala,
        figura.escala
    );


    ctx.beginPath();


    // =================================
    // CUADRADO
    // =================================

    if (
        figura.tipo === "cuadrado"
    ) {

        ctx.rect(

            -figura.tamaño / 2,
            -figura.tamaño / 2,

            figura.tamaño,
            figura.tamaño

        );

    }


    // =================================
    // CÍRCULO
    // =================================

    else if (
        figura.tipo === "circulo"
    ) {

        ctx.arc(

            0,
            0,

            figura.tamaño,

            0,
            Math.PI * 2

        );

    }


    // =================================
    // TRIÁNGULO
    // =================================

    else if (
        figura.tipo === "triangulo"
    ) {

        const t =
            figura.tamaño;


        ctx.moveTo(
            0,
            -t
        );


        ctx.lineTo(
            t * 0.866,
            t / 2
        );


        ctx.lineTo(
            -t * 0.866,
            t / 2
        );


        ctx.closePath();

    }


    // =================================
    // DEGRADADO
    // =================================

    ctx.fillStyle =
        crearGradiente(figura);

    ctx.fill();


    // =================================
    // BORDE
    // =================================

    ctx.strokeStyle =
        figura.color;

    ctx.lineWidth =
        1.2;

    ctx.stroke();


    // =================================
    // BRILLO SUAVE
    // =================================

    ctx.shadowColor =
        figura.color;

    ctx.shadowBlur =
        12;

    ctx.globalAlpha =
        0.18;

    ctx.stroke();


    ctx.globalAlpha =
        1;


    ctx.restore();

}


// =====================================
// DIBUJAR NOMBRE
// =====================================

function dibujarNombre(figura) {

    // =================================
    // NO MOSTRAR AL INICIO
    // =================================

    if (!acomodado) {

        return;

    }


    ctx.save();


    ctx.translate(
        figura.x,
        figura.y
    );


    // =================================
    // MOVIMIENTO SUTIL
    // =================================

    const tiempo =
        Date.now();


    const respiracion =
        Math.sin(

            tiempo *
            figura.velocidadRespiracion +
            figura.faseRespiracion

        );


    ctx.translate(
        0,
        respiracion * 1.5
    );


    // =================================
    // DISTANCIA DEL TEXTO
    // =================================

    let distancia =
        55;


    if (
        figura.tipo === "circulo"
    ) {

        distancia =
            48;

    }


    if (
        figura.tipo === "triangulo"
    ) {

        distancia =
            58;

    }


    // =================================
    // CONFIGURACIÓN DEL TEXTO
    // =================================

    ctx.font =
        "10px Arial";

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";

    ctx.fillStyle =
        "#C4CEE5";

    ctx.globalAlpha =
        0.9;


    // =================================
    // TEXTO
    // =================================

    const texto =
        figura.nombre;


    const espacio =
        7;


    const anchoTotal =
        (texto.length - 1) *
        espacio;


    texto.split("").forEach(
        (letra, i) => {

            const x =
                -anchoTotal / 2 +
                i * espacio;


            ctx.fillText(
                letra,
                x,
                distancia
            );

        }
    );


    ctx.restore();

}


// =====================================
// BORDES
// =====================================

function controlarBordes(figura) {

    if (
        figura.x -
        figura.radio <
        0
    ) {

        figura.x =
            figura.radio;

        figura.vx =
            Math.abs(
                figura.vx
            );

    }


    if (
        figura.x +
        figura.radio >
        canvas.width
    ) {

        figura.x =
            canvas.width -
            figura.radio;

        figura.vx =
            -Math.abs(
                figura.vx
            );

    }


    if (
        figura.y -
        figura.radio <
        0
    ) {

        figura.y =
            figura.radio;

        figura.vy =
            Math.abs(
                figura.vy
            );

    }


    if (
        figura.y +
        figura.radio >
        canvas.height
    ) {

        figura.y =
            canvas.height -
            figura.radio;

        figura.vy =
            -Math.abs(
                figura.vy
            );

    }

}


// =====================================
// COLISIONES
// =====================================

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
                a.radio +
                b.radio;


            if (
                distancia <
                distanciaMinima &&
                distancia > 0
            ) {

                const nx =
                    dx / distancia;

                const ny =
                    dy / distancia;


                const separacion =
                    distanciaMinima -
                    distancia;


                // =================================
                // SEPARACIÓN
                // =================================

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


                // =================================
                // REBOTE
                // =================================

                const velocidadRelativa =
                    (b.vx - a.vx) *
                    nx +
                    (b.vy - a.vy) *
                    ny;


                if (
                    velocidadRelativa < 0
                ) {

                    const rebote =
                        0.8;


                    const impulso =
                        -(1 + rebote) *
                        velocidadRelativa /
                        2;


                    a.vx -=
                        impulso *
                        nx;

                    a.vy -=
                        impulso *
                        ny;


                    b.vx +=
                        impulso *
                        nx;

                    b.vy +=
                        impulso *
                        ny;

                }

            }

        }

    }

}


// =====================================
// MOVIMIENTO
// =====================================

function moverFiguras() {

    // =================================
    // ACOMODANDO
    // =================================

    if (acomodando) {

        tiempoAcomodamiento +=
            0.025;


        const velocidad =
            0.08;


        figuras.forEach(
            figura => {

                figura.x +=
                    (
                        figura.destinoX -
                        figura.x
                    ) *
                    velocidad;


                figura.y +=
                    (
                        figura.destinoY -
                        figura.y
                    ) *
                    velocidad;

            }
        );


        // =================================
        // COMPROBAR SI LLEGARON
        // =================================

        let llegaron =
            true;


        figuras.forEach(
            figura => {

                const distanciaX =
                    Math.abs(
                        figura.destinoX -
                        figura.x
                    );


                const distanciaY =
                    Math.abs(
                        figura.destinoY -
                        figura.y
                    );


                if (
                    distanciaX > 0.5 ||
                    distanciaY > 0.5
                ) {

                    llegaron =
                        false;

                }

            }
        );


        // =================================
        // TERMINAR
        // =================================

        if (
            llegaron ||
            tiempoAcomodamiento > 150
        ) {

            figuras.forEach(
                figura => {

                    figura.x =
                        figura.destinoX;

                    figura.y =
                        figura.destinoY;

                    figura.vx =
                        0;

                    figura.vy =
                        0;

                }
            );


            acomodando =
                false;

            acomodado =
                true;

        }


        return;

    }


    // =================================
    // YA ACOMODADAS
    // =================================

    if (acomodado) {

        return;

    }


    // =================================
    // MOVIMIENTO NORMAL
    // =================================

    figuras.forEach(
        figura => {

            figura.x +=
                figura.vx;

            figura.y +=
                figura.vy;


            controlarBordes(
                figura
            );

        }
    );


    detectarColisiones();

}


// =====================================
// ACOMODAR EN 3 FILAS
// =====================================

function acomodarFiguras() {

    if (
        acomodando ||
        acomodado
    ) {

        return;

    }


    acomodando =
        true;


    tiempoAcomodamiento =
        0;


    if (mensaje) {

        mensaje.classList.add(
            "oculto"
        );

    }


    // =================================
    // CENTRO
    // =================================

    const centroX =
        canvas.width / 2;

    const centroY =
        canvas.height / 2;


    // =================================
    // SEPARACIÓN
    // =================================

    const separacionX =
        100;

    const separacionY =
        100;


    // =================================
    // COLUMNAS
    // =================================

    const x1 =
        centroX -
        separacionX;

    const x2 =
        centroX;

    const x3 =
        centroX +
        separacionX;


    // =================================
    // FILAS
    // =================================

    const y1 =
        centroY -
        separacionY;

    const y2 =
        centroY;

    const y3 =
        centroY +
        separacionY;


    // =================================
    // FILA 1
    // MEMORIA
    // HERENCIA
    // CADUCIDAD
    // =================================

    figuras[0].destinoX =
        x1;

    figuras[0].destinoY =
        y1;


    figuras[1].destinoX =
        x2;

    figuras[1].destinoY =
        y1;


    figuras[2].destinoX =
        x3;

    figuras[2].destinoY =
        y1;


    // =================================
    // FILA 2
    // IDENTIDAD
    // EMPATÍA
    // COLABORACIÓN
    // =================================

    figuras[3].destinoX =
        x1;

    figuras[3].destinoY =
        y2;


    figuras[4].destinoX =
        x2;

    figuras[4].destinoY =
        y2;


    figuras[5].destinoX =
        x3;

    figuras[5].destinoY =
        y2;


    // =================================
    // FILA 3
    // INCERTIDUMBRE
    // DESPRENDIMIENTO
    // EXPECTATIVA
    // =================================

    figuras[6].destinoX =
        x1;

    figuras[6].destinoY =
        y3;


    figuras[7].destinoX =
        x2;

    figuras[7].destinoY =
        y3;


    figuras[8].destinoX =
        x3;

    figuras[8].destinoY =
        y3;


    // =================================
    // DETENER VELOCIDAD
    // =================================

    figuras.forEach(
        figura => {

            figura.vx =
                0;

            figura.vy =
                0;

        }
    );

}


// =====================================
// ANIMACIÓN
// =====================================

function animar() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    moverFiguras();


    figuras.forEach(
        figura => {

            dibujarFigura(
                figura
            );

            dibujarNombre(
                figura
            );

        }
    );


    requestAnimationFrame(
        animar
    );

}

animar();


// =====================================
// DETECTAR FIGURA TOCADA
// =====================================

function detectarFiguraTocada(
    x,
    y
) {

    for (
        let i = figuras.length - 1;
        i >= 0;
        i--
    ) {

        const figura =
            figuras[i];


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
            distancia <=
            figura.radio
        ) {

            return figura;

        }

    }


    return null;

}


// =====================================
// NAVEGACIÓN
// =====================================

function abrirPagina(
    figura
) {

    // =================================
    // BLOQUEADA HASTA ALINEARSE
    // =================================

    if (!acomodado) {

        return;

    }


    const numero =
        figuras.indexOf(
            figura
        );


    // =================================
    // CUADRADOS
    // =================================

    if (
        numero === 0
    ) {

        // MEMORIA
        window.location.href =
            "cuadrados.html";

    }

    else if (
        numero === 1
    ) {

        // HERENCIA
        window.location.href =
            "cuadrados2.html";

    }

    else if (
        numero === 2
    ) {

        // CADUCIDAD
        window.location.href =
            "cuadrados3.html";

    }


    // =================================
    // CÍRCULOS
    // =================================

    else if (
        numero === 3
    ) {

        // IDENTIDAD
        window.location.href =
            "circulos.html";

    }

    else if (
        numero === 4
    ) {

        // EMPATÍA
        window.location.href =
            "circulos2.html";

    }

    else if (
        numero === 5
    ) {

        // COLABORACIÓN
        window.location.href =
            "circulos3.html";

    }


    // =================================
    // TRIÁNGULOS
    // =================================

    else if (
        numero === 6
    ) {

        // INCERTIDUMBRE
        window.location.href =
            "triangulos.html";

    }

    else if (
        numero === 7
    ) {

        // DESPRENDIMIENTO
        window.location.href =
            "triangulos2.html";

    }

    else if (
        numero === 8
    ) {

        // EXPECTATIVA
        window.location.href =
            "triangulos3.html";

    }

}


// =====================================
// COORDENADAS
// =====================================

function obtenerCoordenadas(
    clientX,
    clientY
) {

    const rect =
        canvas.getBoundingClientRect();


    return {

        x:
            (clientX - rect.left) *
            canvas.width /
            rect.width,

        y:
            (clientY - rect.top) *
            canvas.height /
            rect.height

    };

}


// =====================================
// CLICK
// =====================================

canvas.addEventListener(
    "click",
    function(event) {

        const posicion =
            obtenerCoordenadas(
                event.clientX,
                event.clientY
            );


        const figura =
            detectarFiguraTocada(
                posicion.x,
                posicion.y
            );


        // =================================
        // SI TOCA UNA FIGURA
        // =================================

        if (figura) {

            // Antes de acomodarse:
            // no hace absolutamente nada.

            if (!acomodado) {

                return;

            }


            // Después de acomodarse:
            // abre la experiencia.

            abrirPagina(
                figura
            );

            return;

        }


        // =================================
        // SI TOCA ESPACIO VACÍO
        // =================================

        if (
            !acomodando &&
            !acomodado
        ) {

            acomodarFiguras();

        }

    }
);


// =====================================
// TOUCH
// =====================================

canvas.addEventListener(
    "touchstart",
    function(event) {

        event.preventDefault();


        const toque =
            event.touches[0];


        const posicion =
            obtenerCoordenadas(
                toque.clientX,
                toque.clientY
            );


        const figura =
            detectarFiguraTocada(
                posicion.x,
                posicion.y
            );


        // =================================
        // SI TOCA UNA FIGURA
        // =================================

        if (figura) {

            // Navegación bloqueada
            // hasta estar alineadas.

            if (!acomodado) {

                return;

            }


            abrirPagina(
                figura
            );

            return;

        }


        // =================================
        // SI TOCA ESPACIO VACÍO
        // =================================

        if (
            !acomodando &&
            !acomodado
        ) {

            acomodarFiguras();

        }

    },
    {
        passive: false
    }
);

