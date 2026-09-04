
document.addEventListener("DOMContentLoaded", function () {

    const contenedor =
        document.getElementById("contenedor");

    const mensaje =
        document.getElementById("mensaje");


    // ==========================================
    // COLORES
    // ==========================================

    const colores = [
        "#D9D9D9",
        "#8BB2D3",
        "#202D64",
        "#2B538E"
    ];


    // ==========================================
    // VARIABLES
    // ==========================================

    let cantidadCuadrados = 4;

    let cuadrados = [];

    let secuencia = [];

    let posicionJugador = 0;

    let jugando = false;


    // ==========================================
    // CREAR CUADRADOS
    // ==========================================

    function crearCuadrados() {

        contenedor.innerHTML = "";

        cuadrados = [];


        for (
            let i = 0;
            i < cantidadCuadrados;
            i++
        ) {

            const cuadrado =
                document.createElement("div");


            cuadrado.classList.add("cuadrado");


            const color =
                colores[i % colores.length];


            cuadrado.style.setProperty(
                "--color",
                color
            );


            cuadrado.style.backgroundColor =
                color;


            // Sin borde

            cuadrado.style.border =
                "none";

            cuadrado.style.outline =
                "none";

            cuadrado.style.boxShadow =
                "none";


            cuadrado.dataset.numero =
                i;


            // ==================================
            // OBJETO
            // ==================================

            const objeto = {

                elemento: cuadrado,

                x: 0,

                y: 0,

                // MOVIMIENTO LENTO

                vx:
                    (Math.random() - 0.5)
                    * 0.5,

                vy:
                    (Math.random() - 0.5)
                    * 0.5,

                tamaño: 120,

                fase:
                    Math.random()
                    * Math.PI
                    * 2,

                velocidadRespiracion:
                    0.0015 +
                    Math.random()
                    * 0.001,

                intensidad:
                    3 +
                    Math.random()
                    * 3,

                empujeX: 0,

                empujeY: 0,

                rotacion:
                    (Math.random() - 0.5)
                    * 8,

                rotacionObjetivo: 0
            };


            cuadrados.push(objeto);


            // ==================================
            // CLICK
            // ==================================

            cuadrado.addEventListener(
                "click",
                function () {

                    tocarCuadrado(i);

                }
            );


            contenedor.appendChild(
                cuadrado
            );

        }


        actualizarGrid();

        posicionarCuadrados();

    }


    // ==========================================
    // GRID
    // ==========================================

    function actualizarGrid() {

        if (cantidadCuadrados <= 4) {

            cuadrados.forEach(
                function (c) {

                    c.tamaño = 120;

                    c.elemento.style.width =
                        "120px";

                    c.elemento.style.height =
                        "120px";

                }
            );

        }

        else if (cantidadCuadrados <= 9) {

            cuadrados.forEach(
                function (c) {

                    c.tamaño = 120;

                    c.elemento.style.width =
                        "120px";

                    c.elemento.style.height =
                        "120px";

                }
            );

        }

        else {

            cuadrados.forEach(
                function (c) {

                    c.tamaño = 100;

                    c.elemento.style.width =
                        "100px";

                    c.elemento.style.height =
                        "100px";

                }
            );

        }

    }


    // ==========================================
    // POSICIÓN INICIAL
    // ==========================================

    function posicionarCuadrados() {

        const ancho =
            contenedor.clientWidth;

        const alto =
            contenedor.clientHeight;


        const columnas =
            cantidadCuadrados <= 4
                ? 2
                : cantidadCuadrados <= 9
                    ? 3
                    : 4;


        const espacioX =
            cantidadCuadrados <= 4
                ? 180
                : 150;


        const espacioY =
            cantidadCuadrados <= 4
                ? 180
                : 150;


        const filas =
            Math.ceil(
                cantidadCuadrados /
                columnas
            );


        const centroX =
            ancho / 2;

        const centroY =
            alto / 2;


        cuadrados.forEach(
            function (cuadrado, i) {

                const columna =
                    i % columnas;

                const fila =
                    Math.floor(
                        i / columnas
                    );


                const totalColumnas =
                    Math.min(
                        columnas,
                        cantidadCuadrados
                    );


                const x =
                    centroX +
                    (
                        columna -
                        (totalColumnas - 1) / 2
                    )
                    * espacioX
                    -
                    cuadrado.tamaño / 2;


                const y =
                    centroY +
                    (
                        fila -
                        (filas - 1) / 2
                    )
                    * espacioY
                    -
                    cuadrado.tamaño / 2;


                cuadrado.x = x;

                cuadrado.y = y;

            }
        );

    }


    // ==========================================
    // NUEVA RONDA
    // ==========================================

    function nuevaRonda() {

        posicionJugador = 0;

        jugando = false;


        const nuevoNumero =
            Math.floor(
                Math.random()
                * cantidadCuadrados
            );


        secuencia.push(
            nuevoNumero
        );


        mensaje.textContent =
            "MIRÁ LA SECUENCIA";


        setTimeout(
            function () {

                mostrarSecuencia();

            },
            600
        );

    }


    // ==========================================
    // MOSTRAR SECUENCIA
    // ==========================================

    async function mostrarSecuencia() {

        jugando = false;


        for (
            let i = 0;
            i < secuencia.length;
            i++
        ) {

            const numero =
                secuencia[i];


            await encenderCuadrado(
                numero
            );


            await esperar(250);

        }


        posicionJugador = 0;

        jugando = true;


        mensaje.textContent =
            "REPETÍ LA SECUENCIA";

    }


    // ==========================================
    // ENCENDER CUADRADO
    // ==========================================

    function encenderCuadrado(numero) {

        return new Promise(
            function (resolve) {

                const cuadrado =
                    cuadrados[numero];


                if (!cuadrado) {

                    resolve();

                    return;

                }


                // ==================================
                // BRILLO
                // ==================================

                cuadrado.elemento.classList.add(
                    "activo"
                );


                // Frenar suavemente mientras
                // muestra la secuencia

                cuadrado.vx *= 0.5;

                cuadrado.vy *= 0.5;


                cuadrado.rotacionObjetivo =
                    (
                        Math.random()
                        - 0.5
                    )
                    * 12;


                setTimeout(
                    function () {


                        // Quitar brillo

                        cuadrado.elemento.classList.remove(
                            "activo"
                        );


                        cuadrado.rotacionObjetivo =
                            0;


                        setTimeout(
                            function () {

                                resolve();

                            },
                            120
                        );


                    },
                    700
                );

            }
        );

    }


    // ==========================================
    // ESPERAR
    // ==========================================

    function esperar(tiempo) {

        return new Promise(
            function (resolve) {

                setTimeout(
                    resolve,
                    tiempo
                );

            }
        );

    }


    // ==========================================
    // TOCAR CUADRADO
    // ==========================================

    function tocarCuadrado(numero) {

        if (!jugando) {
            return;
        }


        const cuadrado =
            cuadrados[numero];


        // Pequeño destello al tocar

        cuadrado.elemento.classList.add(
            "activo"
        );


        cuadrado.vx +=
            (
                Math.random()
                - 0.5
            )
            * 0.5;


        cuadrado.vy +=
            (
                Math.random()
                - 0.5
            )
            * 0.5;


        cuadrado.rotacionObjetivo =
            (
                Math.random()
                - 0.5
            )
            * 15;


        setTimeout(
            function () {

                cuadrado.elemento.classList.remove(
                    "activo"
                );

                cuadrado.rotacionObjetivo =
                    0;

            },
            180
        );


        // ======================================
        // CORRECTO
        // ======================================

        if (
            numero ===
            secuencia[posicionJugador]
        ) {

            posicionJugador++;


            if (
                posicionJugador ===
                secuencia.length
            ) {

                jugando = false;


                mensaje.textContent =
                    "¡MUY BIEN!";


                // ==================================
                // APARECE OTRO
                // ==================================

                if (
                    secuencia.length ===
                    cantidadCuadrados
                ) {

                    setTimeout(
                        function () {

                            cantidadCuadrados++;


                            crearCuadrados();


                            mensaje.textContent =
                                "¡APARECIÓ OTRO!";


                            setTimeout(
                                function () {

                                    nuevaRonda();

                                },
                                1000
                            );

                        },
                        700
                    );

                }

                else {

                    setTimeout(
                        function () {

                            nuevaRonda();

                        },
                        1000
                    );

                }

            }

        }

        else {

            error();

        }

    }


    // ==========================================
    // ERROR
    // ==========================================

    function error() {

        jugando = false;


        mensaje.textContent =
            "TE EQUIVOCASTE";


        cuadrados.forEach(
            function (cuadrado) {

                cuadrado.elemento.classList.add(
                    "activo"
                );

                cuadrado.vx *= -1.3;

                cuadrado.vy *= -1.3;

            }
        );


        setTimeout(
            function () {

                cuadrados.forEach(
                    function (cuadrado) {

                        cuadrado.elemento.classList.remove(
                            "activo"
                        );

                    }
                );

            },
            400
        );


        setTimeout(
            function () {

                if (
                    cantidadCuadrados > 0
                ) {

                    cantidadCuadrados--;

                }


                secuencia = [];

                posicionJugador = 0;


                // ==================================
                // FIN DEL JUEGO
                // ==================================

                if (
                    cantidadCuadrados === 0
                ) {

                    mensaje.textContent =
                        "FIN DEL JUEGO";


                    setTimeout(
                        function () {

                            cantidadCuadrados = 4;

                            secuencia = [];

                            posicionJugador = 0;

                            crearCuadrados();


                            mensaje.textContent =
                                "NUEVAMENTE";


                            setTimeout(
                                function () {

                                    nuevaRonda();

                                },
                                1000
                            );

                        },
                        1500
                    );


                    return;

                }


                crearCuadrados();


                mensaje.textContent =
                    "PERDISTE UN CUADRADO";


                setTimeout(
                    function () {

                        nuevaRonda();

                    },
                    1000
                );


            },
            700
        );

    }


    // ==========================================
    // MOVIMIENTO LENTO
    // ==========================================

    function moverCuadrados() {

        const ancho =
            contenedor.clientWidth;

        const alto =
            contenedor.clientHeight;


        cuadrados.forEach(
            function (cuadrado) {


                // Movimiento orgánico MUY SUAVE

                cuadrado.vx +=

                    Math.sin(
                        Date.now()
                        * 0.0007
                        +
                        cuadrado.fase
                    )
                    * 0.0015;


                cuadrado.vy +=

                    Math.cos(
                        Date.now()
                        * 0.0006
                        +
                        cuadrado.fase
                    )
                    * 0.0015;


                // VELOCIDAD MÁXIMA LENTA

                const velocidadMaxima =
                    0.7;


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


                cuadrado.x +=
                    cuadrado.vx;


                cuadrado.y +=
                    cuadrado.vy;


                // Empuje

                cuadrado.x +=
                    cuadrado.empujeX;


                cuadrado.y +=
                    cuadrado.empujeY;


                cuadrado.empujeX *=
                    0.92;


                cuadrado.empujeY *=
                    0.92;


                const tamaño =
                    cuadrado.tamaño;


                // ==================================
                // PAREDES
                // ==================================

                if (
                    cuadrado.x <= 0
                ) {

                    cuadrado.x = 0;

                    cuadrado.vx *= -1;

                }


                if (
                    cuadrado.x + tamaño >= ancho
                ) {

                    cuadrado.x =
                        ancho - tamaño;

                    cuadrado.vx *= -1;

                }


                if (
                    cuadrado.y <= 0
                ) {

                    cuadrado.y = 0;

                    cuadrado.vy *= -1;

                }


                if (
                    cuadrado.y + tamaño >= alto
                ) {

                    cuadrado.y =
                        alto - tamaño;

                    cuadrado.vy *= -1;

                }

            }
        );

    }


    // ==========================================
    // COLISIONES
    // ==========================================

    function detectarColisiones() {


        for (
            let i = 0;
            i < cuadrados.length;
            i++
        ) {


            for (
                let j = i + 1;
                j < cuadrados.length;
                j++
            ) {


                const a =
                    cuadrados[i];

                const b =
                    cuadrados[j];


                const ax =
                    a.x +
                    a.tamaño / 2;

                const ay =
                    a.y +
                    a.tamaño / 2;


                const bx =
                    b.x +
                    b.tamaño / 2;

                const by =
                    b.y +
                    b.tamaño / 2;


                const dx =
                    bx - ax;

                const dy =
                    by - ay;


                const distancia =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );


                const radioA =
                    a.tamaño * 0.5;

                const radioB =
                    b.tamaño * 0.5;


                const distanciaMinima =
                    radioA +
                    radioB;


                if (
                    distancia <
                    distanciaMinima
                ) {


                    let nx;

                    let ny;


                    if (
                        distancia === 0
                    ) {

                        nx = 1;

                        ny = 0;

                    }

                    else {

                        nx =
                            dx /
                            distancia;

                        ny =
                            dy /
                            distancia;

                    }


                    // Separación

                    const penetracion =
                        distanciaMinima -
                        distancia;


                    const separacion =
                        penetracion / 2;


                    a.x -=
                        nx *
                        separacion;

                    a.y -=
                        ny *
                        separacion;


                    b.x +=
                        nx *
                        separacion;

                    b.y +=
                        ny *
                        separacion;


                    // Rebote

                    const velocidadRelativa =

                        (
                            b.vx -
                            a.vx
                        )
                        * nx

                        +

                        (
                            b.vy -
                            a.vy
                        )
                        * ny;


                    if (
                        velocidadRelativa < 0
                    ) {


                        const rebote =
                            1.1;


                        const impulso =
                            -velocidadRelativa
                            * rebote;


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


    // ==========================================
    // RESPIRACIÓN
    // ==========================================

    function dibujarCuadrados() {


        cuadrados.forEach(
            function (cuadrado) {


                const tiempo =
                    Date.now();


                const respiracion =

                    Math.sin(
                        tiempo *
                        cuadrado.velocidadRespiracion
                        +
                        cuadrado.fase
                    );


                const escala =

                    1 +

                    (
                        respiracion *
                        cuadrado.intensidad /
                        100
                    );


                cuadrado.elemento.style.left =
                    cuadrado.x + "px";


                cuadrado.elemento.style.top =
                    cuadrado.y + "px";


                // Rotación suave

                cuadrado.rotacion +=

                    (
                        cuadrado.rotacionObjetivo -
                        cuadrado.rotacion
                    )
                    * 0.08;


                cuadrado.elemento.style.transform =

                    `
                    scale(${escala})
                    rotate(${cuadrado.rotacion}deg)
                    `;

            }
        );

    }


    // ==========================================
    // ANIMACIÓN
    // ==========================================

    function animar() {

        moverCuadrados();

        detectarColisiones();

        dibujarCuadrados();


        requestAnimationFrame(
            animar
        );

    }


    // ==========================================
    // INICIAR
    // ==========================================

    crearCuadrados();

    animar();


    setTimeout(
        function () {

            mensaje.textContent =
                "MIRÁ LA SECUENCIA";

            nuevaRonda();

        },
        1000
    );

});

