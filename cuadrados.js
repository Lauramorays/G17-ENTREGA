
document.addEventListener("DOMContentLoaded", function () {

    const contenedor = document.getElementById("contenedor");

    const colores = [
        "#D9D9D9",
        "#8BB2D3",
        "#202D64",
        "#2B538E"
    ];

    const COLOR_SELECCION = "#C4CEE5";

    let cantidadCuadrados = 4;
    let cuadrados = [];
    let secuencia = [];
    let posicionJugador = 0;
    let jugando = false;
    let mostrandoSecuencia = false;


    // Crea los cuadrados del juego
    function crearCuadrados() {

        contenedor.innerHTML = "";
        cuadrados = [];

        for (let i = 0; i < cantidadCuadrados; i++) {

            const cuadrado = document.createElement("div");

            cuadrado.classList.add("cuadrado");

            const color = colores[i % colores.length];

            cuadrado.style.setProperty("--color", color);
            cuadrado.style.backgroundColor = color;

            cuadrado.dataset.numero = i;

            const objeto = {

                elemento: cuadrado,

                x: 0,
                y: 0,
                tamaño: 120,

                vx: (Math.random() - 0.5) * 0.45,
                vy: (Math.random() - 0.5) * 0.45,

                fase: Math.random() * Math.PI * 2,

                velocidadRespiracion:
                    0.00055 + Math.random() * 0.00025,

                intensidadRespiracion:
                    0.055 + Math.random() * 0.025,

                faseVertical:
                    Math.random() * Math.PI * 2,

                velocidadVertical:
                    0.00048 + Math.random() * 0.00022,

                empujeX: 0,
                empujeY: 0,

                rotacion: (Math.random() - 0.5) * 8,
                rotacionObjetivo: 0,

                seleccionado: false
            };

            cuadrados.push(objeto);

            cuadrado.addEventListener("click", function () {
                tocarCuadrado(i);
            });

            contenedor.appendChild(cuadrado);
        }

        actualizarTamaño();
        posicionarCuadrados();
    }


    // Ajusta el tamaño según la cantidad de cuadrados
    function actualizarTamaño() {

        const tamaño = cantidadCuadrados <= 9 ? 120 : 100;

        cuadrados.forEach(function (cuadrado) {

            cuadrado.tamaño = tamaño;

            cuadrado.elemento.style.width =
                tamaño + "px";

            cuadrado.elemento.style.height =
                tamaño + "px";
        });
    }


    // Distribuye los cuadrados inicialmente
    function posicionarCuadrados() {

        const ancho = contenedor.clientWidth;
        const alto = contenedor.clientHeight;

        const columnas =
            cantidadCuadrados <= 4
                ? 2
                : cantidadCuadrados <= 9
                    ? 3
                    : 4;

        const espacioX =
            cantidadCuadrados <= 4 ? 180 : 150;

        const espacioY =
            cantidadCuadrados <= 4 ? 180 : 150;

        const filas =
            Math.ceil(cantidadCuadrados / columnas);

        const centroX = ancho / 2;
        const centroY = alto / 2;

        cuadrados.forEach(function (cuadrado, i) {

            const columna = i % columnas;
            const fila = Math.floor(i / columnas);

            cuadrado.x =
                centroX +
                (columna - (columnas - 1) / 2) *
                espacioX -
                cuadrado.tamaño / 2;

            cuadrado.y =
                centroY +
                (fila - (filas - 1) / 2) *
                espacioY -
                cuadrado.tamaño / 2;
        });
    }


    // Inicia una nueva partida
    function iniciarJuego() {

        secuencia = [];
        posicionJugador = 0;
        jugando = false;
        mostrandoSecuencia = true;

        agregarPaso();

        setTimeout(function () {
            mostrarSecuencia();
        }, 800);
    }


    // Agrega un elemento a la secuencia
    function agregarPaso() {

        const numero =
            Math.floor(
                Math.random() * cantidadCuadrados
            );

        secuencia.push(numero);
    }


    // Muestra la secuencia al jugador
    async function mostrarSecuencia() {

        if (mostrandoSecuencia === false) {
            mostrandoSecuencia = true;
        }

        jugando = false;
        posicionJugador = 0;

        await esperar(500);

        for (let i = 0; i < secuencia.length; i++) {

            await encenderCuadrado(secuencia[i]);

            await esperar(180);
        }

        mostrandoSecuencia = false;
        jugando = true;
        posicionJugador = 0;
    }


    // Ilumina un cuadrado
    function encenderCuadrado(numero) {

        return new Promise(function (resolve) {

            const cuadrado = cuadrados[numero];

            if (!cuadrado) {
                resolve();
                return;
            }

            cuadrado.seleccionado = true;
            cuadrado.elemento.classList.add("activo");

            cuadrado.rotacionObjetivo =
                (Math.random() - 0.5) * 10;

            setTimeout(function () {

                cuadrado.seleccionado = false;

                cuadrado.elemento.classList.remove("activo");

                cuadrado.rotacionObjetivo = 0;

                setTimeout(resolve, 100);

            }, 600);
        });
    }


    // Pausa
    function esperar(tiempo) {

        return new Promise(function (resolve) {
            setTimeout(resolve, tiempo);
        });
    }


    // Comprueba la respuesta del jugador
    function tocarCuadrado(numero) {

        if (!jugando || mostrandoSecuencia) {
            return;
        }

        const cuadrado = cuadrados[numero];

        if (!cuadrado) {
            return;
        }

        cuadrado.seleccionado = true;
        cuadrado.elemento.classList.add("activo");

        cuadrado.rotacionObjetivo =
            (Math.random() - 0.5) * 12;

        setTimeout(function () {

            cuadrado.seleccionado = false;

            cuadrado.elemento.classList.remove("activo");

            cuadrado.rotacionObjetivo = 0;

        }, 250);


        if (numero !== secuencia[posicionJugador]) {

            perder();
            return;
        }

        posicionJugador++;


        if (posicionJugador >= secuencia.length) {

            jugando = false;

            if (secuencia.length >= cantidadCuadrados) {

                setTimeout(function () {
                    agregarCuadrado();
                }, 700);

            } else {

                setTimeout(function () {

                    agregarPaso();
                    mostrarSecuencia();

                }, 900);
            }
        }
    }


    // Agrega un nuevo cuadrado
    function agregarCuadrado() {

        if (cantidadCuadrados >= 12) {

            setTimeout(function () {

                agregarPaso();
                mostrarSecuencia();

            }, 800);

            return;
        }

        cantidadCuadrados++;

        crearCuadrados();

        secuencia = [];
        posicionJugador = 0;

        setTimeout(function () {

            agregarPaso();
            mostrarSecuencia();

        }, 900);
    }


    // Reduce la cantidad de cuadrados cuando se pierde
    function perder() {

        if (!jugando) {
            return;
        }

        jugando = false;
        mostrandoSecuencia = false;

        cuadrados.forEach(function (cuadrado) {

            cuadrado.seleccionado = true;

            cuadrado.elemento.classList.add("activo");

            cuadrado.vx *= -1.4;
            cuadrado.vy *= -1.4;

            cuadrado.rotacionObjetivo =
                (Math.random() - 0.5) * 20;
        });


        setTimeout(function () {

            cuadrados.forEach(function (cuadrado) {

                cuadrado.seleccionado = false;

                cuadrado.elemento.classList.remove("activo");

                cuadrado.rotacionObjetivo = 0;
            });

        }, 350);


        setTimeout(function () {

            cantidadCuadrados--;

            if (cantidadCuadrados <= 0) {

                cantidadCuadrados = 4;

                secuencia = [];
                posicionJugador = 0;

                crearCuadrados();

                setTimeout(function () {
                    iniciarJuego();
                }, 1000);

                return;
            }

            secuencia = [];
            posicionJugador = 0;

            crearCuadrados();

            setTimeout(function () {

                agregarPaso();
                mostrarSecuencia();

            }, 1000);

        }, 700);
    }


    // Movimiento orgánico
    function moverCuadrados() {

        const ancho = contenedor.clientWidth;
        const alto = contenedor.clientHeight;

        const tiempo = Date.now();

        cuadrados.forEach(function (cuadrado) {

            cuadrado.vx +=
                Math.sin(
                    tiempo * 0.0007 +
                    cuadrado.fase
                ) * 0.0012;

            cuadrado.vy +=
                Math.cos(
                    tiempo * 0.0006 +
                    cuadrado.fase
                ) * 0.0012;


            const velocidadMaxima = 0.7;

            cuadrado.vx =
                Math.max(
                    -velocidadMaxima,
                    Math.min(
                        velocidadMaxima,
                        cuadrado.vx
                    )
                );

            cuadrado.vy =
                Math.max(
                    -velocidadMaxima,
                    Math.min(
                        velocidadMaxima,
                        cuadrado.vy
                    )
                );


            cuadrado.x += cuadrado.vx;
            cuadrado.y += cuadrado.vy;

            cuadrado.x += cuadrado.empujeX;
            cuadrado.y += cuadrado.empujeY;

            cuadrado.empujeX *= 0.92;
            cuadrado.empujeY *= 0.92;


            const movimientoOrganico =
                Math.sin(
                    tiempo * 0.00035 +
                    cuadrado.fase
                ) * 0.08;

            cuadrado.x += movimientoOrganico;


            if (cuadrado.x <= 0) {

                cuadrado.x = 0;
                cuadrado.vx = Math.abs(cuadrado.vx);
            }


            if (
                cuadrado.x + cuadrado.tamaño >=
                ancho
            ) {

                cuadrado.x =
                    ancho - cuadrado.tamaño;

                cuadrado.vx =
                    -Math.abs(cuadrado.vx);
            }


            if (cuadrado.y <= 0) {

                cuadrado.y = 0;
                cuadrado.vy = Math.abs(cuadrado.vy);
            }


            if (
                cuadrado.y + cuadrado.tamaño >=
                alto
            ) {

                cuadrado.y =
                    alto - cuadrado.tamaño;

                cuadrado.vy =
                    -Math.abs(cuadrado.vy);
            }
        });
    }


    // Detecta y resuelve las colisiones
    function detectarColisiones() {

        for (let i = 0; i < cuadrados.length; i++) {

            for (
                let j = i + 1;
                j < cuadrados.length;
                j++
            ) {

                const a = cuadrados[i];
                const b = cuadrados[j];

                const ax =
                    a.x + a.tamaño / 2;

                const ay =
                    a.y + a.tamaño / 2;

                const bx =
                    b.x + b.tamaño / 2;

                const by =
                    b.y + b.tamaño / 2;

                const dx = bx - ax;
                const dy = by - ay;

                const distancia =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );

                const distanciaMinima =
                    a.tamaño / 2 +
                    b.tamaño / 2;


                if (distancia < distanciaMinima) {

                    let nx;
                    let ny;

                    if (distancia === 0) {

                        nx = 1;
                        ny = 0;

                    } else {

                        nx = dx / distancia;
                        ny = dy / distancia;
                    }


                    const penetracion =
                        distanciaMinima - distancia;

                    const separacion =
                        penetracion / 2;


                    a.x -= nx * separacion;
                    a.y -= ny * separacion;

                    b.x += nx * separacion;
                    b.y += ny * separacion;


                    const velocidadRelativa =
                        (b.vx - a.vx) * nx +
                        (b.vy - a.vy) * ny;


                    if (velocidadRelativa < 0) {

                        const rebote = 0.9;

                        const impulso =
                            -(1 + rebote) *
                            velocidadRelativa /
                            2;


                        a.vx -= impulso * nx;
                        a.vy -= impulso * ny;

                        b.vx += impulso * nx;
                        b.vy += impulso * ny;
                    }
                }
            }
        }
    }


    // Dibuja los cuadrados y su respiración
    function dibujarCuadrados() {

        const tiempo = Date.now();

        cuadrados.forEach(function (cuadrado) {


            // Respiración horizontal
            const pulso =
                Math.sin(
                    tiempo *
                    cuadrado.velocidadRespiracion +
                    cuadrado.fase
                );


            // Respiración vertical
            const pulsoVertical =
                Math.sin(
                    tiempo *
                    cuadrado.velocidadVertical +
                    cuadrado.faseVertical
                );


            const escalaX =
                1 +
                pulso *
                cuadrado.intensidadRespiracion;


            const escalaY =
                1 +
                pulsoVertical *
                cuadrado.intensidadRespiracion *
                0.82;


            cuadrado.rotacion +=
                (
                    cuadrado.rotacionObjetivo -
                    cuadrado.rotacion
                ) * 0.08;


            cuadrado.elemento.style.left =
                cuadrado.x + "px";

            cuadrado.elemento.style.top =
                cuadrado.y + "px";


            cuadrado.elemento.style.transform =

                `
                translate(
                    -${(escalaX - 1) * cuadrado.tamaño / 2}px,
                    -${(escalaY - 1) * cuadrado.tamaño / 2}px
                )
                scaleX(${escalaX})
                scaleY(${escalaY})
                rotate(${cuadrado.rotacion}deg)
                `;


            // Borde exterior cuando está seleccionado
            if (cuadrado.seleccionado) {

                cuadrado.elemento.style.outline =
                    `2px solid ${COLOR_SELECCION}`;

                cuadrado.elemento.style.outlineOffset =
                    "7px";

                cuadrado.elemento.style.boxShadow =
                    `
                    0 0 12px ${COLOR_SELECCION},
                    0 0 25px ${COLOR_SELECCION}
                    `;

            } else {

                cuadrado.elemento.style.outline =
                    "none";

                cuadrado.elemento.style.outlineOffset =
                    "0";

                cuadrado.elemento.style.boxShadow =
                    "none";
            }
        });
    }


    // Bucle principal
    function animar() {

        moverCuadrados();

        detectarColisiones();

        dibujarCuadrados();

        requestAnimationFrame(animar);
    }


    // Iniciar juego
    crearCuadrados();

    animar();

    setTimeout(function () {
        iniciarJuego();
    }, 1000);

});
