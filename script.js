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
    // =================================

    for (let i = 0; i < 3; i++) {

        figuras.push({

            tipo: "cuadrado",

            x: Math.random() * (canvas.width - 100) + 50,
            y: Math.random() * (canvas.height - 100) + 50,

            tamaño: 45,

            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,

            color: colores.cuadrado,

            radio: 32,

            destinoX: 0,
            destinoY: 0

        });

    }


    // =================================
    // CÍRCULOS
    // =================================

    for (let i = 0; i < 3; i++) {

        figuras.push({

            tipo: "circulo",

            x: Math.random() * (canvas.width - 100) + 50,
            y: Math.random() * (canvas.height - 100) + 50,

            tamaño: 25,

            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,

            color: colores.circulo,

            radio: 28,

            destinoX: 0,
            destinoY: 0

        });

    }


    // =================================
    // TRIÁNGULOS
    // =================================

    for (let i = 0; i < 3; i++) {

        figuras.push({

            tipo: "triangulo",

            x: Math.random() * (canvas.width - 100) + 50,
            y: Math.random() * (canvas.height - 100) + 50,

            tamaño: 30,

            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,

            color: colores.triangulo,

            radio: 32,

            destinoX: 0,
            destinoY: 0

        });

    }

}

crearFiguras();


// =====================================
// DIBUJAR
// =====================================

function dibujarFigura(figura) {

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
            -figura.tamaño / 2,
            -figura.tamaño / 2,
            figura.tamaño,
            figura.tamaño
        );

    }


    // =================================
    // CÍRCULO
    // =================================

    else if (figura.tipo === "circulo") {

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

    else if (figura.tipo === "triangulo") {

        const t = figura.tamaño;

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


    ctx.fillStyle =
        figura.color;

    ctx.fill();

    ctx.strokeStyle =
        figura.color;

    ctx.lineWidth = 2;

    ctx.stroke();

    ctx.restore();

}


// =====================================
// BORDES
// =====================================

function controlarBordes(figura) {

    if (figura.x - figura.radio < 0) {

        figura.x =
            figura.radio;

        figura.vx =
            Math.abs(figura.vx);

    }


    if (figura.x + figura.radio > canvas.width) {

        figura.x =
            canvas.width -
            figura.radio;

        figura.vx =
            -Math.abs(figura.vx);

    }


    if (figura.y - figura.radio < 0) {

        figura.y =
            figura.radio;

        figura.vy =
            Math.abs(figura.vy);

    }


    if (figura.y + figura.radio > canvas.height) {

        figura.y =
            canvas.height -
            figura.radio;

        figura.vy =
            -Math.abs(figura.vy);

    }

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

                const nx =
                    dx / distancia;

                const ny =
                    dy / distancia;

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


                const velocidadRelativa =
                    (b.vx - a.vx) * nx +
                    (b.vy - a.vy) * ny;


                if (
                    velocidadRelativa < 0
                ) {

                    const rebote = 0.8;

                    const impulso =
                        -(1 + rebote) *
                        velocidadRelativa /
                        2;


                    a.vx -=
                        impulso * nx;

                    a.vy -=
                        impulso * ny;


                    b.vx +=
                        impulso * nx;

                    b.vy +=
                        impulso * ny;

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

        tiempoAcomodamiento += 0.025;

        const velocidad = 0.08;


        figuras.forEach(figura => {

            figura.x +=
                (
                    figura.destinoX -
                    figura.x
                ) * velocidad;


            figura.y +=
                (
                    figura.destinoY -
                    figura.y
                ) * velocidad;

        });


        // Comprobar si llegaron

        let llegaron = true;


        figuras.forEach(figura => {

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

                llegaron = false;

            }

        });


        if (
            llegaron ||
            tiempoAcomodamiento > 150
        ) {

            figuras.forEach(figura => {

                figura.x =
                    figura.destinoX;

                figura.y =
                    figura.destinoY;

                figura.vx = 0;
                figura.vy = 0;

            });


            acomodando = false;
            acomodado = true;

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

    figuras.forEach(figura => {

        figura.x += figura.vx;

        figura.y += figura.vy;

        controlarBordes(figura);

    });


    detectarColisiones();

}


// =====================================
// ACOMODAR EN FILA
// =====================================

function acomodarFiguras() {

    if (
        acomodando ||
        acomodado
    ) {

        return;

    }


    acomodando = true;

    tiempoAcomodamiento = 0;


    if (mensaje) {

        mensaje.classList.add(
            "oculto"
        );

    }


    // =================================
    // CENTRO EXACTO
    // =================================

    const centroX =
        canvas.width / 2;

    const centroY =
        canvas.height / 2;


    // =================================
    // SEPARACIÓN
    // =================================

    const separacionX = 100;

    const separacionY = 100;


    // =================================
    // X
    // =================================

    const x1 =
        centroX - separacionX;

    const x2 =
        centroX;

    const x3 =
        centroX + separacionX;


    // =================================
    // Y
    // =================================

    const y1 =
        centroY - separacionY;

    const y2 =
        centroY;

    const y3 =
        centroY + separacionY;


    // =================================
    // CUADRADOS
    // =================================

    figuras[0].destinoX = x1;
    figuras[0].destinoY = y1;

    figuras[1].destinoX = x2;
    figuras[1].destinoY = y1;

    figuras[2].destinoX = x3;
    figuras[2].destinoY = y1;


    // =================================
    // CÍRCULOS
    // =================================

    figuras[3].destinoX = x1;
    figuras[3].destinoY = y2;

    figuras[4].destinoX = x2;
    figuras[4].destinoY = y2;

    figuras[5].destinoX = x3;
    figuras[5].destinoY = y2;


    // =================================
    // TRIÁNGULOS
    // =================================

    figuras[6].destinoX = x1;
    figuras[6].destinoY = y3;

    figuras[7].destinoX = x2;
    figuras[7].destinoY = y3;

    figuras[8].destinoX = x3;
    figuras[8].destinoY = y3;


    // =================================
    // DETENER VELOCIDAD
    // =================================

    figuras.forEach(figura => {

        figura.vx = 0;
        figura.vy = 0;

    });

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
// DETECTAR FIGURA
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


        if (figura) {

            abrirPagina(figura);

        }

        else {

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