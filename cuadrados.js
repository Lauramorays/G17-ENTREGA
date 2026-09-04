document.addEventListener("DOMContentLoaded", function () {


    // ==========================================
    // CONTENEDOR
    // ==========================================

    const contenedor =
        document.getElementById("contenedor");


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
    // VARIABLES DEL JUEGO
    // ==========================================

    let cantidadCuadrados = 4;

    let cuadrados = [];

    let secuencia = [];

    let posicionJugador = 0;

    let jugando = false;

    let mostrandoSecuencia = false;

    let juegoIniciado = false;


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


            cuadrado.classList.add(
                "cuadrado"
            );


            const color =
                colores[
                    i % colores.length
                ];


            cuadrado.style.setProperty(
                "--color",
                color
            );


            cuadrado.style.backgroundColor =
                color;


            cuadrado.dataset.numero =
                i;


            // ==================================
            // OBJETO
            // ==================================

            const objeto = {

                elemento: cuadrado,

                x: 0,

                y: 0,

                tamaño: 120,


                // Movimiento

                vx:
                    (Math.random() - 0.5)
                    * 0.45,

                vy:
                    (Math.random() - 0.5)
                    * 0.45,


                // Respiración

                fase:
                    Math.random()
                    * Math.PI
                    * 2,

                velocidadRespiracion:
                    0.0015 +
                    Math.random()
                    * 0.001,

                intensidad:
                    2 +
                    Math.random()
                    * 2,


                // Empuje

                empujeX: 0,

                empujeY: 0,


                // Rotación

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


        actualizarTamaño();

        posicionarCuadrados();

    }


    // ==========================================
    // TAMAÑO
    // ==========================================

    function actualizarTamaño() {


        let tamaño;


        if (cantidadCuadrados <= 9) {

            tamaño = 120;

        }

        else {

            tamaño = 100;

        }


        cuadrados.forEach(
            function (cuadrado) {

                cuadrado.tamaño =
                    tamaño;

                cuadrado.elemento.style.width =
                    tamaño + "px";

                cuadrado.elemento.style.height =
                    tamaño + "px";

            }
        );

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


                const x =
                    centroX
                    +
                    (
                        columna -
                        (columnas - 1) / 2
                    )
                    *
                    espacioX
                    -
                    cuadrado.tamaño / 2;


                const y =
                    centroY
                    +
                    (
                        fila -
                        (filas - 1) / 2
                    )
                    *
                    espacioY
                    -
                    cuadrado.tamaño / 2;


                cuadrado.x =
                    x;


                cuadrado.y =
                    y;

            }
        );

    }


    // ==========================================
    // GENERAR PRIMERA SECUENCIA
    // ==========================================

    function iniciarJuego() {


        secuencia = [];

        posicionJugador = 0;

        jugando = false;

        mostrandoSecuencia = false;

        juegoIniciado = true;


        agregarPaso();


        setTimeout(
            function () {

                mostrarSecuencia();

            },
            800
        );

    }


    // ==========================================
    // AGREGAR PASO
    // ==========================================

    function agregarPaso() {


        const numero =
            Math.floor(
                Math.random()
                *
                cantidadCuadrados
            );


        secuencia.push(
            numero
        );

    }


    // ==========================================
    // MOSTRAR SECUENCIA
    // ==========================================

    async function mostrarSecuencia() {


        if (
            mostrandoSecuencia
        ) {

            return;

        }


        mostrandoSecuencia =
            true;


        jugando = false;


        posicionJugador = 0;


        // Pequeña pausa antes de comenzar

        await esperar(500);


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


            await esperar(180);

        }


        mostrandoSecuencia =
            false;


        jugando = true;


        posicionJugador = 0;

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


                // Encender

                cuadrado.elemento.classList.add(
                    "activo"
                );


                // Pequeño movimiento

                cuadrado.rotacionObjetivo =
                    (
                        Math.random()
                        - 0.5
                    )
                    *
                    10;


                // Duración de la luz

                setTimeout(
                    function () {


                        cuadrado.elemento.classList.remove(
                            "activo"
                        );


                        cuadrado.rotacionObjetivo =
                            0;


                        setTimeout(
                            function () {

                                resolve();

                            },
                            100
                        );


                    },
                    600
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


        // Si estamos mostrando la secuencia
        // no se puede tocar

        if (
            !jugando ||
            mostrandoSecuencia
        ) {

            return;

        }


        const cuadrado =
            cuadrados[numero];


        if (!cuadrado) {

            return;

        }


        // ==================================
        // DESTELLO
        // ==================================

        cuadrado.elemento.classList.add(
            "activo"
        );


        cuadrado.rotacionObjetivo =
            (
                Math.random()
                - 0.5
            )
            *
            12;


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


        // ==================================
        // COMPROBAR
        // ==================================

        if (
            numero !==
            secuencia[posicionJugador]
        ) {

            perder();

            return;

        }


        // Correcto

        posicionJugador++;


        // ==================================
        // TODA LA SECUENCIA CORRECTA
        // ==================================

        if (
            posicionJugador >=
            secuencia.length
        ) {


            jugando = false;


            // ==================================
            // ¿HAY QUE AGREGAR CUADRADO?
            // ==================================

            if (
                secuencia.length >=
                cantidadCuadrados
            ) {


                setTimeout(
                    function () {

                        agregarCuadrado();

                    },
                    700
                );


            }

            else {


                // ==================================
                // SIGUIENTE RONDA
                // ==================================

                setTimeout(
                    function () {

                        agregarPaso();

                        mostrarSecuencia();

                    },
                    900
                );

            }

        }

    }


    // ==========================================
    // AGREGAR CUADRADO
    // ==========================================

    function agregarCuadrado() {


        // Máximo de cuadrados

        if (
            cantidadCuadrados >= 12
        ) {

            // Seguimos jugando
            // sin agregar más

            setTimeout(
                function () {

                    agregarPaso();

                    mostrarSecuencia();

                },
                800
            );

            return;

        }


        // ==================================
        // AUMENTAR
        // ==================================

        cantidadCuadrados++;


        // ==================================
        // CREAR NUEVAMENTE
        // ==================================

        crearCuadrados();


        // ==================================
        // NUEVA SECUENCIA
        // ==================================

        secuencia = [];


        posicionJugador = 0;


        // Primero mostramos
        // la nueva secuencia

        setTimeout(
            function () {

                agregarPaso();

                mostrarSecuencia();

            },
            900
        );

    }


    // ==========================================
    // PERDER
    // ==========================================

    function perder() {


        if (
            !jugando
        ) {

            return;

        }


        jugando = false;

        mostrandoSecuencia = false;


        // ==================================
        // DESTELLO DE ERROR
        // ==================================

        cuadrados.forEach(
            function (cuadrado) {

                cuadrado.elemento.classList.add(
                    "activo"
                );


                cuadrado.vx *= -1.4;

                cuadrado.vy *= -1.4;


                cuadrado.rotacionObjetivo =
                    (
                        Math.random()
                        - 0.5
                    )
                    *
                    20;

            }
        );


        // ==================================
        // QUITAR LUZ
        // ==================================

        setTimeout(
            function () {

                cuadrados.forEach(
                    function (cuadrado) {

                        cuadrado.elemento.classList.remove(
                            "activo"
                        );

                        cuadrado.rotacionObjetivo =
                            0;

                    }
                );

            },
            350
        );


        // ==================================
        // PERDER UN CUADRADO
        // ==================================

        setTimeout(
            function () {


                cantidadCuadrados--;


                // ==================================
                // LLEGÓ A CERO
                // ==================================

                if (
                    cantidadCuadrados <= 0
                ) {


                    cantidadCuadrados = 4;


                    secuencia = [];


                    posicionJugador = 0;


                    crearCuadrados();


                    setTimeout(
                        function () {

                            iniciarJuego();

                        },
                        1000
                    );


                    return;

                }


                // ==================================
                // QUEDAN CUADRADOS
                // ==================================

                secuencia = [];


                posicionJugador = 0;


                crearCuadrados();


                // ==================================
                // NUEVA PARTIDA CON MENOS CUADRADOS
                // ==================================

                setTimeout(
                    function () {

                        agregarPaso();

                        mostrarSecuencia();

                    },
                    1000
                );


            },
            700
        );

    }


    // ==========================================
    // MOVIMIENTO
    // ==========================================

    function moverCuadrados() {


        const ancho =
            contenedor.clientWidth;


        const alto =
            contenedor.clientHeight;


        cuadrados.forEach(
            function (cuadrado) {


                // Movimiento orgánico

                const tiempo =
                    Date.now();


                cuadrado.vx +=

                    Math.sin(
                        tiempo
                        *
                        0.0007
                        +
                        cuadrado.fase
                    )
                    *
                    0.0012;


                cuadrado.vy +=

                    Math.cos(
                        tiempo
                        *
                        0.0006
                        +
                        cuadrado.fase
                    )
                    *
                    0.0012;


                // ==================================
                // VELOCIDAD MÁXIMA
                // ==================================

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


                // ==================================
                // MOVER
                // ==================================

                cuadrado.x +=
                    cuadrado.vx;


                cuadrado.y +=
                    cuadrado.vy;


                // ==================================
                // EMPUJE
                // ==================================

                cuadrado.x +=
                    cuadrado.empujeX;


                cuadrado.y +=
                    cuadrado.empujeY;


                cuadrado.empujeX *=
                    0.92;


                cuadrado.empujeY *=
                    0.92;


                // ==================================
                // PAREDES
                // ==================================

                if (
                    cuadrado.x <= 0
                ) {

                    cuadrado.x = 0;

                    cuadrado.vx =
                        Math.abs(
                            cuadrado.vx
                        );

                }


                if (
                    cuadrado.x +
                    cuadrado.tamaño >=
                    ancho
                ) {

                    cuadrado.x =
                        ancho -
                        cuadrado.tamaño;

                    cuadrado.vx =
                        -Math.abs(
                            cuadrado.vx
                        );

                }


                if (
                    cuadrado.y <= 0
                ) {

                    cuadrado.y = 0;

                    cuadrado.vy =
                        Math.abs(
                            cuadrado.vy
                        );

                }


                if (
                    cuadrado.y +
                    cuadrado.tamaño >=
                    alto
                ) {

                    cuadrado.y =
                        alto -
                        cuadrado.tamaño;

                    cuadrado.vy =
                        -Math.abs(
                            cuadrado.vy
                        );

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


                // ==================================
                // CENTROS
                // ==================================

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


                const distanciaMinima =
                    (
                        a.tamaño / 2
                    )
                    +
                    (
                        b.tamaño / 2
                    );


                // ==================================
                // COLISIÓN
                // ==================================

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


                    // ==================================
                    // SEPARAR
                    // ==================================

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


                    // ==================================
                    // REBOTE
                    // ==================================

                    const velocidadRelativa =

                        (
                            b.vx -
                            a.vx
                        )
                        *
                        nx

                        +

                        (
                            b.vy -
                            a.vy
                        )
                        *
                        ny;


                    if (
                        velocidadRelativa < 0
                    ) {


                        const rebote =
                            0.9;


                        const impulso =
                            -(
                                1 +
                                rebote
                            )
                            *
                            velocidadRelativa
                            /
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


    // ==========================================
    // DIBUJAR
    // ==========================================

    function dibujarCuadrados() {


        const tiempo =
            Date.now();


        cuadrados.forEach(
            function (cuadrado) {


                // ==================================
                // RESPIRACIÓN
                // ==================================

                const respiracion =

                    Math.sin(
                        tiempo
                        *
                        cuadrado.velocidadRespiracion
                        +
                        cuadrado.fase
                    );


                const escala =

                    1
                    +
                    (
                        respiracion
                        *
                        cuadrado.intensidad
                        /
                        100
                    );


                // ==================================
                // POSICIÓN
                // ==================================

                cuadrado.elemento.style.left =
                    cuadrado.x + "px";


                cuadrado.elemento.style.top =
                    cuadrado.y + "px";


                // ==================================
                // ROTACIÓN
                // ==================================

                cuadrado.rotacion +=

                    (
                        cuadrado.rotacionObjetivo -
                        cuadrado.rotacion
                    )
                    *
                    0.08;


                // ==================================
                // TRANSFORMACIÓN
                // ==================================

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


    // ==========================================
    // COMENZAR SIMÓN DICE
    // ==========================================

    setTimeout(
        function () {

            iniciarJuego();

        },
        1000
    );


});