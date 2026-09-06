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


    // ============================================================
    // CREA EL ESTILO VISUAL DEL CUADRADO
    // ============================================================

    function aplicarEstiloCuadrado(cuadrado, color, numero) {

        cuadrado.style.setProperty("--color", color);

        /*
         * Cada cuadrado conserva su color original,
         * pero recibe luz, volumen y profundidad.
         */

        if (numero === 0) {

            // D9D9D9
            cuadrado.style.background = `
                radial-gradient(
                    circle at 32% 28%,
                    #FFFFFF 0%,
                    #F1F3F5 18%,
                    #D9D9D9 58%,
                    #AEB4BA 100%
                )
            `;

            cuadrado.style.boxShadow = `
                inset -8px -10px 18px rgba(70, 75, 82, 0.18),
                inset 8px 8px 16px rgba(255, 255, 255, 0.45),
                0 0 18px rgba(217, 217, 217, 0.18)
            `;

        } else if (numero === 1) {

            // 8BB2D3
            cuadrado.style.background = `
                radial-gradient(
                    circle at 32% 28%,
                    #DCECF9 0%,
                    #BBD8EC 18%,
                    #8BB2D3 58%,
                    #527A9C 100%
                )
            `;

            cuadrado.style.boxShadow = `
                inset -8px -10px 18px rgba(20, 55, 85, 0.20),
                inset 8px 8px 16px rgba(255, 255, 255, 0.30),
                0 0 18px rgba(139, 178, 211, 0.18)
            `;

        } else if (numero === 2) {

            // 202D64
            cuadrado.style.background = `
                radial-gradient(
                    circle at 32% 28%,
                    #6674A5 0%,
                    #46558C 18%,
                    #202D64 58%,
                    #10183B 100%
                )
            `;

            cuadrado.style.boxShadow = `
                inset -8px -10px 18px rgba(0, 0, 0, 0.30),
                inset 8px 8px 16px rgba(255, 255, 255, 0.16),
                0 0 18px rgba(32, 45, 100, 0.25)
            `;

        } else {

            // 2B538E
            cuadrado.style.background = `
                radial-gradient(
                    circle at 32% 28%,
                    #7EA7D0 0%,
                    #5687B9 18%,
                    #2B538E 58%,
                    #18355F 100%
                )
            `;

            cuadrado.style.boxShadow = `
                inset -8px -10px 18px rgba(10, 30, 55, 0.25),
                inset 8px 8px 16px rgba(255, 255, 255, 0.20),
                0 0 18px rgba(43, 83, 142, 0.22)
            `;
        }
    }


    // ============================================================
    // CREA LOS CUADRADOS DEL JUEGO
    // ============================================================

    function crearCuadrados() {

        contenedor.innerHTML = "";
        cuadrados = [];

        for (let i = 0; i < cantidadCuadrados; i++) {

            const cuadrado = document.createElement("div");

            cuadrado.classList.add("cuadrado");

            const color = colores[i % colores.length];

            aplicarEstiloCuadrado(
                cuadrado,
                color,
                i
            );

            cuadrado.dataset.numero = i;

            const objeto = {

                elemento: cuadrado,

                x: 0,
                y: 0,

                tamaño: 120,

                vx: (Math.random() - 0.5) * 0.45,
                vy: (Math.random() - 0.5) * 0.45,

                fase:
                    Math.random() *
                    Math.PI *
                    2,

                velocidadRespiracion:
                    0.00055 +
                    Math.random() * 0.00025,

                intensidadRespiracion:
                    0.055 +
                    Math.random() * 0.025,

                faseVertical:
                    Math.random() *
                    Math.PI *
                    2,

                velocidadVertical:
                    0.00048 +
                    Math.random() * 0.00022,

                empujeX: 0,
                empujeY: 0,

                rotacion:
                    (Math.random() - 0.5) * 8,

                rotacionObjetivo: 0,

                seleccionado: false
            };

            cuadrados.push(objeto);

            cuadrado.addEventListener(
                "click",
                function () {

                    tocarCuadrado(i);

                }
            );

            contenedor.appendChild(cuadrado);
        }

        actualizarTamaño();

        posicionarCuadrados();
    }


    // ============================================================
    // AJUSTA EL TAMAÑO
    // ============================================================

    function actualizarTamaño() {

        const tamaño =
            cantidadCuadrados <= 9
                ? 120
                : 100;

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


    // ============================================================
    // DISTRIBUYE LOS CUADRADOS INICIALMENTE
    // ============================================================

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

                cuadrado.x =
                    centroX +
                    (
                        columna -
                        (columnas - 1) / 2
                    ) *
                    espacioX -
                    cuadrado.tamaño / 2;

                cuadrado.y =
                    centroY +
                    (
                        fila -
                        (filas - 1) / 2
                    ) *
                    espacioY -
                    cuadrado.tamaño / 2;

            }
        );
    }


    // ============================================================
    // INICIA UNA NUEVA PARTIDA
    // ============================================================

    function iniciarJuego() {

        secuencia = [];

        posicionJugador = 0;

        jugando = false;

        mostrandoSecuencia = true;

        agregarPaso();

        setTimeout(
            function () {

                mostrarSecuencia();

            },
            800
        );
    }


    // ============================================================
    // AGREGA UN PASO A LA SECUENCIA
    // ============================================================

    function agregarPaso() {

        const numero =
            Math.floor(
                Math.random() *
                cantidadCuadrados
            );

        secuencia.push(numero);
    }


    // ============================================================
    // MUESTRA LA SECUENCIA
    // ============================================================

    async function mostrarSecuencia() {

        if (mostrandoSecuencia === false) {

            mostrandoSecuencia = true;
        }

        jugando = false;

        posicionJugador = 0;

        await esperar(500);

        for (
            let i = 0;
            i < secuencia.length;
            i++
        ) {

            await encenderCuadrado(
                secuencia[i]
            );

            await esperar(180);
        }

        mostrandoSecuencia = false;

        jugando = true;

        posicionJugador = 0;
    }


    // ============================================================
    // ILUMINA UN CUADRADO
    // ============================================================

    function encenderCuadrado(numero) {

        return new Promise(
            function (resolve) {

                const cuadrado =
                    cuadrados[numero];

                if (!cuadrado) {

                    resolve();

                    return;
                }

                cuadrado.seleccionado =
                    true;

                cuadrado.elemento.classList.add(
                    "activo"
                );

                cuadrado.rotacionObjetivo =
                    (Math.random() - 0.5) * 10;

                setTimeout(
                    function () {

                        cuadrado.seleccionado =
                            false;

                        cuadrado.elemento.classList.remove(
                            "activo"
                        );

                        cuadrado.rotacionObjetivo =
                            0;

                        setTimeout(
                            resolve,
                            100
                        );

                    },
                    600
                );
            }
        );
    }


    // ============================================================
    // PAUSA
    // ============================================================

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


    // ============================================================
    // COMPRUEBA LA RESPUESTA
    // ============================================================

    function tocarCuadrado(numero) {

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

        cuadrado.seleccionado =
            true;

        cuadrado.elemento.classList.add(
            "activo"
        );

        cuadrado.rotacionObjetivo =
            (Math.random() - 0.5) * 12;

        setTimeout(
            function () {

                cuadrado.seleccionado =
                    false;

                cuadrado.elemento.classList.remove(
                    "activo"
                );

                cuadrado.rotacionObjetivo =
                    0;

            },
            250
        );


        // ========================================================
        // COMPRUEBA SI ES CORRECTO
        // ========================================================

        if (
            numero !==
            secuencia[posicionJugador]
        ) {

            perder();

            return;
        }

        posicionJugador++;


        // ========================================================
        // COMPLETÓ TODA LA SECUENCIA
        // ========================================================

        if (
            posicionJugador >=
            secuencia.length
        ) {

            jugando = false;


            // ====================================================
            // CUANDO LA SECUENCIA LLEGA A LA CANTIDAD
            // AGREGA UN NUEVO CUADRADO
            // ====================================================

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

            } else {

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


    // ============================================================
    // AGREGA UN CUADRADO SIN REINICIAR
    // NI CAMBIAR LAS POSICIONES ANTERIORES
    // ============================================================

    function agregarCuadrado() {

        // Máximo de 12 cuadrados
        if (
            cantidadCuadrados >= 12
        ) {

            setTimeout(
                function () {

                    agregarPaso();

                    mostrarSecuencia();

                },
                800
            );

            return;
        }


        // Guarda la cantidad anterior
        const cantidadAnterior =
            cantidadCuadrados;


        // Aumenta la cantidad
        cantidadCuadrados++;


        // Índice del nuevo cuadrado
        const i =
            cantidadAnterior;


        // ========================================================
        // CREA SOLO EL NUEVO CUADRADO
        // ========================================================

        const cuadrado =
            document.createElement("div");

        cuadrado.classList.add(
            "cuadrado"
        );


        const color =
            colores[
                i % colores.length
            ];


        aplicarEstiloCuadrado(
            cuadrado,
            color,
            i
        );


        cuadrado.dataset.numero =
            i;


        // ========================================================
        // CREA EL OBJETO
        // ========================================================

        const objeto = {

            elemento: cuadrado,

            x: 0,
            y: 0,

            tamaño:
                cantidadCuadrados <= 9
                    ? 120
                    : 100,

            vx:
                (Math.random() - 0.5) *
                0.45,

            vy:
                (Math.random() - 0.5) *
                0.45,

            fase:
                Math.random() *
                Math.PI *
                2,

            velocidadRespiracion:
                0.00055 +
                Math.random() * 0.00025,

            intensidadRespiracion:
                0.055 +
                Math.random() * 0.025,

            faseVertical:
                Math.random() *
                Math.PI *
                2,

            velocidadVertical:
                0.00048 +
                Math.random() * 0.00022,

            empujeX: 0,
            empujeY: 0,

            rotacion:
                (Math.random() - 0.5) * 8,

            rotacionObjetivo: 0,

            seleccionado: false
        };


        cuadrados.push(objeto);


        // ========================================================
        // TAMAÑO
        // ========================================================

        cuadrado.style.width =
            objeto.tamaño + "px";

        cuadrado.style.height =
            objeto.tamaño + "px";


        // ========================================================
        // CLICK
        // ========================================================

        cuadrado.addEventListener(
            "click",
            function () {

                tocarCuadrado(i);

            }
        );


        contenedor.appendChild(
            cuadrado
        );


        // ========================================================
        // BUSCA UNA POSICIÓN LIBRE
        // SIN TOCAR LOS ANTERIORES
        // ========================================================

        const ancho =
            contenedor.clientWidth;

        const alto =
            contenedor.clientHeight;


        let encontrado = false;


        for (
            let intento = 0;
            intento < 100;
            intento++
        ) {

            const x =
                Math.random() *
                Math.max(
                    1,
                    ancho -
                    objeto.tamaño
                );


            const y =
                Math.random() *
                Math.max(
                    1,
                    alto -
                    objeto.tamaño
                );


            let libre = true;


            for (
                let j = 0;
                j < cuadrados.length - 1;
                j++
            ) {

                const otro =
                    cuadrados[j];


                const ax =
                    x +
                    objeto.tamaño / 2;

                const ay =
                    y +
                    objeto.tamaño / 2;


                const bx =
                    otro.x +
                    otro.tamaño / 2;

                const by =
                    otro.y +
                    otro.tamaño / 2;


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
                    objeto.tamaño / 2 +
                    otro.tamaño / 2;


                if (
                    distancia <
                    distanciaMinima
                ) {

                    libre = false;

                    break;
                }
            }


            if (libre) {

                objeto.x = x;

                objeto.y = y;

                encontrado = true;

                break;
            }
        }


        // ========================================================
        // SI NO ENCONTRÓ ESPACIO
        // ========================================================

        if (!encontrado) {

            objeto.x =
                Math.random() *
                Math.max(
                    1,
                    ancho -
                    objeto.tamaño
                );

            objeto.y =
                Math.random() *
                Math.max(
                    1,
                    alto -
                    objeto.tamaño
                );
        }


        // ========================================================
        // LA SECUENCIA SE CONSERVA
        // ========================================================

        posicionJugador = 0;


        setTimeout(
            function () {

                agregarPaso();

                mostrarSecuencia();

            },
            900
        );
    }


    // ============================================================
    // PIERDE
    // ============================================================

    function perder() {

        if (!jugando) {

            return;
        }

        jugando = false;

        mostrandoSecuencia = false;


        // ========================================================
        // REACCIÓN AL ERROR
        // ========================================================

        cuadrados.forEach(
            function (cuadrado) {

                cuadrado.seleccionado =
                    true;

                cuadrado.elemento.classList.add(
                    "activo"
                );

                cuadrado.vx *= -1.4;

                cuadrado.vy *= -1.4;

                cuadrado.rotacionObjetivo =
                    (Math.random() - 0.5) * 20;

            }
        );


        // ========================================================
        // QUITA EL EFECTO
        // ========================================================

        setTimeout(
            function () {

                cuadrados.forEach(
                    function (cuadrado) {

                        cuadrado.seleccionado =
                            false;

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


        // ========================================================
        // ELIMINA UN CUADRADO
        // ========================================================

        setTimeout(
            function () {

                cantidadCuadrados--;


                // ==================================================
                // SI YA NO QUEDAN
                // ==================================================

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


                // ==================================================
                // SOLO AL PERDER SE REORGANIZAN
                // ==================================================

                secuencia = [];

                posicionJugador = 0;

                crearCuadrados();


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


    // ============================================================
    // MOVIMIENTO ORGÁNICO
    // ============================================================

    function moverCuadrados() {

        const ancho =
            contenedor.clientWidth;

        const alto =
            contenedor.clientHeight;

        const tiempo =
            Date.now();


        cuadrados.forEach(
            function (cuadrado) {

                cuadrado.vx +=
                    Math.sin(
                        tiempo * 0.0007 +
                        cuadrado.fase
                    ) *
                    0.0012;


                cuadrado.vy +=
                    Math.cos(
                        tiempo * 0.0006 +
                        cuadrado.fase
                    ) *
                    0.0012;


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


                cuadrado.x +=
                    cuadrado.empujeX;

                cuadrado.y +=
                    cuadrado.empujeY;


                cuadrado.empujeX *=
                    0.92;

                cuadrado.empujeY *=
                    0.92;


                // Movimiento orgánico suave
                const movimientoOrganico =
                    Math.sin(
                        tiempo * 0.00035 +
                        cuadrado.fase
                    ) *
                    0.08;


                cuadrado.x +=
                    movimientoOrganico;


                // ==================================================
                // BORDE IZQUIERDO
                // ==================================================

                if (
                    cuadrado.x <= 0
                ) {

                    cuadrado.x = 0;

                    cuadrado.vx =
                        Math.abs(
                            cuadrado.vx
                        );
                }


                // ==================================================
                // BORDE DERECHO
                // ==================================================

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


                // ==================================================
                // BORDE SUPERIOR
                // ==================================================

                if (
                    cuadrado.y <= 0
                ) {

                    cuadrado.y = 0;

                    cuadrado.vy =
                        Math.abs(
                            cuadrado.vy
                        );
                }


                // ==================================================
                // BORDE INFERIOR
                // ==================================================

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


    // ============================================================
    // DETECTA Y RESUELVE COLISIONES
    // ============================================================

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


                const distanciaMinima =
                    a.tamaño / 2 +
                    b.tamaño / 2;


                // ==================================================
                // SI SE SUPERPONEN
                // ==================================================

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

                    } else {

                        nx =
                            dx /
                            distancia;

                        ny =
                            dy /
                            distancia;
                    }


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


                    // ==================================================
                    // VELOCIDAD RELATIVA
                    // ==================================================

                    const velocidadRelativa =
                        (b.vx - a.vx) *
                        nx +
                        (b.vy - a.vy) *
                        ny;


                    // ==================================================
                    // REBOTE
                    // ==================================================

                    if (
                        velocidadRelativa < 0
                    ) {

                        const rebote =
                            0.9;


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


    // ============================================================
    // DIBUJA LOS CUADRADOS Y SU RESPIRACIÓN
    // ============================================================

    function dibujarCuadrados() {

        const tiempo =
            Date.now();


        cuadrados.forEach(
            function (cuadrado) {


                // ==================================================
                // RESPIRACIÓN HORIZONTAL
                // ==================================================

                const pulso =
                    Math.sin(
                        tiempo *
                        cuadrado.velocidadRespiracion +
                        cuadrado.fase
                    );


                // ==================================================
                // RESPIRACIÓN VERTICAL
                // ==================================================

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


                // ==================================================
                // ROTACIÓN SUAVE
                // ==================================================

                cuadrado.rotacion +=
                    (
                        cuadrado.rotacionObjetivo -
                        cuadrado.rotacion
                    ) *
                    0.08;


                cuadrado.elemento.style.left =
                    cuadrado.x + "px";


                cuadrado.elemento.style.top =
                    cuadrado.y + "px";


                // ==================================================
                // RESPIRACIÓN + ROTACIÓN
                // ==================================================

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


                // ==================================================
                // CUADRADO SELECCIONADO
                // ==================================================

                if (
                    cuadrado.seleccionado
                ) {

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


                    // ==================================================
                    // RESTAURA EL BRILLO PROPIO DEL CUADRADO
                    // ==================================================

                    const numero =
                        Number(
                            cuadrado.elemento.dataset.numero
                        );

                    const color =
                        colores[
                            numero % colores.length
                        ];

                    aplicarEstiloCuadrado(
                        cuadrado.elemento,
                        color,
                        numero
                    );
                }
            }
        );
    }


    // ============================================================
    // BUCLE PRINCIPAL
    // ============================================================

    function animar() {

        moverCuadrados();

        detectarColisiones();

        dibujarCuadrados();

        requestAnimationFrame(
            animar
        );
    }


    // ============================================================
    // INICIA EL JUEGO
    // ============================================================

    crearCuadrados();

    animar();


    setTimeout(
        function () {

            iniciarJuego();

        },
        1000
    );

});