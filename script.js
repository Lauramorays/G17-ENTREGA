const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const mensaje = document.getElementById("mensaje");

let figuras = [];
let acomodando = false;
let acomodado = false;


// =====================================
// COLORES
// =====================================

const colores = {
    cuadrado: "#D9D9D9",
    circulo: "#8BB2D3",
    triangulo: "#202D64"
};


// =====================================
// AJUSTAR CANVAS
// =====================================

function ajustarCanvas() {

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

}

ajustarCanvas();

window.addEventListener("resize", ajustarCanvas);


// =====================================
// CREAR FIGURAS
// =====================================

function crearFiguras() {

    figuras = [];


    // =================================
    // 3 CUADRADOS
    // =================================

    for (let i = 0; i < 3; i++) {

        figuras.push({

            tipo: "cuadrado",

            x: Math.random() * (canvas.width - 100) + 50,
            y: Math.random() * (canvas.height - 100) + 50,

            tamaño: 45,

            vx: (Math.random() - 0.5) * 1.2,
            vy: (Math.random() - 0.5) * 1.2,

            color: colores.cuadrado,

            destinoX: 0,
            destinoY: 0,

            radio: 32,

            // RESPIRACIÓN
            faseRespiracion: Math.random() * Math.PI * 2,
            velocidadRespiracion:
                0.012 + Math.random() * 0.006,

            intensidadRespiracion:
                0.035 + Math.random() * 0.02,

            // MOVIMIENTO ORGÁNICO
            faseX: Math.random() * Math.PI * 2,
            faseY: Math.random() * Math.PI * 2,

            velocidadOrganica:
                0.006 + Math.random() * 0.004
        });

    }


    // =================================
    // 3 CÍRCULOS
    // =================================

    for (let i = 0; i < 3; i++) {

        figuras.push({

            tipo: "circulo",

            x: Math.random() * (canvas.width - 100) + 50,
            y: Math.random() * (canvas.height - 100) + 50,

            tamaño: 25,

            vx: (Math.random() - 0.5) * 1.2,
            vy: (Math.random() - 0.5) * 1.2,

            color: colores.circulo,

            destinoX: 0,
            destinoY: 0,

            radio: 28,

            faseRespiracion:
                Math.random() * Math.PI * 2,

            velocidadRespiracion:
                0.012 + Math.random() * 0.006,

            intensidadRespiracion:
                0.035 + Math.random() * 0.02,

            faseX:
                Math.random() * Math.PI * 2,

            faseY:
                Math.random() * Math.PI * 2,

            velocidadOrganica:
                0.006 + Math.random() * 0.004
        });

    }


    // =================================
    // 3 TRIÁNGULOS
    // =================================

    for (let i = 0; i < 3; i++) {

        figuras.push({

            tipo: "triangulo",

            x: Math.random() * (canvas.width - 100) + 50,
            y: Math.random() * (canvas.height - 100) + 50,

            tamaño: 30,

            vx: (Math.random() - 0.5) * 1.2,
            vy: (Math.random() - 0.5) * 1.2,

            color: colores.triangulo,

            destinoX: 0,
            destinoY: 0,

            radio: 32,

            faseRespiracion:
                Math.random() * Math.PI * 2,

            velocidadRespiracion:
                0.012 + Math.random() * 0.006,

            intensidadRespiracion:
                0.035 + Math.random() * 0.02,

            faseX:
                Math.random() * Math.PI * 2,

            faseY:
                Math.random() * Math.PI * 2,

            velocidadOrganica:
                0.006 + Math.random() * 0.004
        });

    }

}

crearFiguras();


// =====================================
// DIBUJAR FIGURA
// =====================================

function dibujarFigura(figura) {

    // =================================
    // RESPIRACIÓN
    // =================================

    figura.faseRespiracion +=
        figura.velocidadRespiracion;

    const respiracion =
        1 +
        Math.sin(figura.faseRespiracion) *
        figura.intensidadRespiracion;


    const tamaño =
        figura.tamaño * respiracion;


    ctx.save();

    ctx.translate(
        figura.x,
        figura.y
    );

    ctx.beginPath();


    // =================================
    // CUADRADO
    // =================================

    if (figura.tipo === "cuadrado") {

        ctx.rect(
            -tamaño / 2,
            -tamaño / 2,
            tamaño,
            tamaño
        );

    }


    // =================================
    // CÍRCULO
    // =================================

    if (figura.tipo === "circulo") {

        ctx.arc(
            0,
            0,
            tamaño,
            0,
            Math.PI * 2
        );

    }


    // =================================
    // TRIÁNGULO
    // =================================

    if (figura.tipo === "triangulo") {

        const t = tamaño;

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
    // FIGURA LLENA
    // =================================

    ctx.fillStyle = figura.color;

    ctx.fill();


    // Borde muy sutil
    ctx.strokeStyle = figura.color;

    ctx.lineWidth = 2;

    ctx.stroke();


    ctx.restore();

}


// =====================================
// COLISIONES
// =====================================

function detectarColisiones() {

    for (let i = 0; i < figuras.length; i++) {

        for (let j = i + 1; j < figuras.length; j++) {

            const a = figuras[i];
            const b = figuras[j];


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
                distancia < distanciaMinima &&
                distancia > 0
            ) {

                // =================================
                // DIRECCIÓN DEL CHOQUE
                // =================================

                const nx =
                    dx / distancia;

                const ny =
                    dy / distancia;


                // =================================
                // SEPARAR
                // =================================

                const penetracion =
                    distanciaMinima -
                    distancia;


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


                // =================================
                // VELOCIDAD RELATIVA
                // =================================

                const relativaX =
                    b.vx - a.vx;

                const relativaY =
                    b.vy - a.vy;


                const velocidadNormal =
                    relativaX * nx +
                    relativaY * ny;


                // Ya se están separando
                if (velocidadNormal > 0) {
                    continue;
                }


                // =================================
                // REBOTE SUAVE
                // =================================

                const rebote = 0.8;


                const impulso =
                    -(1 + rebote) *
                    velocidadNormal /
                    2;


                const impulsoX =
                    impulso * nx;

                const impulsoY =
                    impulso * ny;


                a.vx -= impulsoX;
                a.vy -= impulsoY;


                b.vx += impulsoX;
                b.vy += impulsoY;

            }

        }

    }

}


// =====================================
// BORDES
// =====================================

function controlarBordes(figura) {

    const radio =
        figura.radio;


    if (figura.x - radio < 0) {

        figura.x = radio;

        figura.vx =
            Math.abs(figura.vx);

    }


    if (figura.x + radio > canvas.width) {

        figura.x =
            canvas.width - radio;

        figura.vx =
            -Math.abs(figura.vx);

    }


    if (figura.y - radio < 0) {

        figura.y = radio;

        figura.vy =
            Math.abs(figura.vy);

    }


    if (figura.y + radio > canvas.height) {

        figura.y =
            canvas.height - radio;

        figura.vy =
            -Math.abs(figura.vy);

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

        figuras.forEach(figura => {

            figura.x +=
                (figura.destinoX -
                    figura.x) * 0.06;

            figura.y +=
                (figura.destinoY -
                    figura.y) * 0.06;

        });

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

    figuras.forEach(figura => {

        figura.x += figura.vx;
        figura.y += figura.vy;


        // Pequeño movimiento orgánico
        figura.faseX +=
            figura.velocidadOrganica;

        figura.faseY +=
            figura.velocidadOrganica * 0.8;


        figura.x +=
            Math.sin(figura.faseX) *
            0.08;

        figura.y +=
            Math.cos(figura.faseY) *
            0.08;


        controlarBordes(figura);

    });


    // =================================
    // COLISIONES
    // =================================

    detectarColisiones();

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


    figuras.forEach(figura => {

        dibujarFigura(figura);

    });


    requestAnimationFrame(animar);

}

animar();


// =====================================
// ACOMODAR FIGURAS
// =====================================

function acomodarFiguras() {

    if (
        acomodando ||
        acomodado
    ) {
        return;
    }


    acomodando = true;

    mensaje.classList.add("oculto");


    const espacioX = 85;

    const centroX =
        canvas.width / 2;


    const posicionesX = [

        centroX - espacioX,

        centroX,

        centroX + espacioX

    ];


    const espacioY = 110;

    const centroY =
        canvas.height / 2;


    const posicionesY = [

        centroY - espacioY,

        centroY,

        centroY + espacioY

    ];


    // =================================
    // CUADRADOS
    // =================================

    figuras[0].destinoX =
        posicionesX[0];

    figuras[0].destinoY =
        posicionesY[0];


    figuras[1].destinoX =
        posicionesX[1];

    figuras[1].destinoY =
        posicionesY[0];


    figuras[2].destinoX =
        posicionesX[2];

    figuras[2].destinoY =
        posicionesY[0];


    // =================================
    // CÍRCULOS
    // =================================

    figuras[3].destinoX =
        posicionesX[0];

    figuras[3].destinoY =
        posicionesY[1];


    figuras[4].destinoX =
        posicionesX[1];

    figuras[4].destinoY =
        posicionesY[1];


    figuras[5].destinoX =
        posicionesX[2];

    figuras[5].destinoY =
        posicionesY[1];


    // =================================
    // TRIÁNGULOS
    // =================================

    figuras[6].destinoX =
        posicionesX[0];

    figuras[6].destinoY =
        posicionesY[2];


    figuras[7].destinoX =
        posicionesX[1];

    figuras[7].destinoY =
        posicionesY[2];


    figuras[8].destinoX =
        posicionesX[2];

    figuras[8].destinoY =
        posicionesY[2];


    // =================================
    // DETENER MOVIMIENTO
    // =================================

    figuras.forEach(figura => {

        figura.vx = 0;
        figura.vy = 0;

    });


    setTimeout(() => {

        acomodando = false;

        acomodado = true;

    }, 2000);

}


// =====================================
// DETECTAR FIGURA TOCADA
// =====================================

function detectarFiguraTocada(x, y) {

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

function abrirPagina(figura) {

    const numero =
        figuras.indexOf(figura);


    if (numero === 0) {

        window.location.href =
            "cuadrados.html";

    }

    else if (numero === 1) {

        window.location.href =
            "cuadrados2.html";

    }

    else if (numero === 2) {

        window.location.href =
            "cuadrados3.html";

    }

    else if (numero === 3) {

        window.location.href =
            "circulos.html";

    }

    else if (numero === 4) {

        window.location.href =
            "circulos2.html";

    }

    else if (numero === 5) {

        window.location.href =
            "circulos3.html";

    }

    else if (numero === 6) {

        window.location.href =
            "triangulos.html";

    }

    else if (numero === 7) {

        window.location.href =
            "triangulos2.html";

    }

    else if (numero === 8) {

        window.location.href =
            "triangulos3.html";

    }

}


// =====================================
// CLICK
// =====================================

canvas.addEventListener(
    "click",
    function (event) {

        const rect =
            canvas.getBoundingClientRect();


        const x =
            (event.clientX -
                rect.left) *
            (canvas.width /
                rect.width);


        const y =
            (event.clientY -
                rect.top) *
            (canvas.height /
                rect.height);


        const figura =
            detectarFiguraTocada(x, y);


        if (figura) {

            abrirPagina(figura);

        }

        else {

            acomodarFiguras();

        }

    }
);


// =====================================
// TOUCH CELULAR / TABLET
// =====================================

canvas.addEventListener(
    "touchstart",
    function (event) {

        event.preventDefault();


        const rect =
            canvas.getBoundingClientRect();


        const toque =
            event.touches[0];


        const x =
            (toque.clientX -
                rect.left) *
            (canvas.width /
                rect.width);


        const y =
            (toque.clientY -
                rect.top) *
            (canvas.height /
                rect.height);


        const figura =
            detectarFiguraTocada(x, y);


        if (figura) {

            abrirPagina(figura);

        }

        else {

            acomodarFiguras();

        }

    },
    {
        passive: false
    }
);