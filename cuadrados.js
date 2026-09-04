
document.addEventListener("DOMContentLoaded", function () {

    const contenedor = document.getElementById("contenedor");
    const mensaje = document.getElementById("mensaje");


    // ==========================================
    // COLORES
    // ==========================================

    const colores = [
        "#FF4F70",
        "#FFD84D",
        "#4DE1FF",
        "#B56CFF",
        "#FF914D",
        "#70FF8A",
        "#FF70D9",
        "#9D70FF",
        "#70FFD9"
    ];


    // ==========================================
    // CANTIDAD DE CUADRADOS
    // ==========================================

    let cantidadCuadrados = 4;


    // ==========================================
    // CUADRADOS
    // ==========================================

    let cuadrados = [];


    // ==========================================
    // SECUENCIA
    // ==========================================

    let secuencia = [];

    let posicionJugador = 0;

    let jugando = false;


    // ==========================================
    // CREAR CUADRADOS
    // ==========================================

    function crearCuadrados() {

        contenedor.innerHTML = "";

        cuadrados = [];


        for (let i = 0; i < cantidadCuadrados; i++) {

            const cuadrado =
                document.createElement("div");

            cuadrado.classList.add("cuadrado");


            const color =
                colores[i % colores.length];


            cuadrado.style.setProperty(
                "--color",
                color
            );


            cuadrado.style.borderColor =
                color;


            cuadrado.dataset.numero = i;


            cuadrado.addEventListener(
                "click",
                function () {

                    tocarCuadrado(i);

                }
            );


            contenedor.appendChild(cuadrado);

            cuadrados.push(cuadrado);

        }


        actualizarGrid();

    }


    // ==========================================
    // ORGANIZAR CUADRADOS
    // ==========================================

    function actualizarGrid() {

        // 1 a 4 cuadrados
        if (cantidadCuadrados <= 4) {

            contenedor.style.gridTemplateColumns =
                "repeat(2, 120px)";

            cuadrados.forEach(c => {

                c.style.width = "120px";
                c.style.height = "120px";

            });

        }

        // 5 a 9 cuadrados
        else if (cantidadCuadrados <= 9) {

            contenedor.style.gridTemplateColumns =
                "repeat(3, 120px)";

            cuadrados.forEach(c => {

                c.style.width = "120px";
                c.style.height = "120px";

            });

        }

        // Más de 9
        else {

            contenedor.style.gridTemplateColumns =
                "repeat(4, 100px)";

            cuadrados.forEach(c => {

                c.style.width = "100px";
                c.style.height = "100px";

            });

        }

    }


    // ==========================================
    // NUEVA RONDA
    // ==========================================

    function nuevaRonda() {

        posicionJugador = 0;

        jugando = false;


        // Agregar una nueva posición
        const nuevoNumero =
            Math.floor(
                Math.random() * cantidadCuadrados
            );


        secuencia.push(nuevoNumero);


        mensaje.textContent =
            "MIRÁ LA SECUENCIA";


        setTimeout(function () {

            mostrarSecuencia();

        }, 600);

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


            await encenderCuadrado(numero);


            await esperar(200);

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

        return new Promise(function (resolve) {

            const cuadrado =
                cuadrados[numero];


            if (!cuadrado) {

                resolve();

                return;

            }


            cuadrado.classList.add("activo");


            setTimeout(function () {

                cuadrado.classList.remove(
                    "activo"
                );


                setTimeout(function () {

                    resolve();

                }, 100);

            }, 600);

        });

    }


    // ==========================================
    // ESPERAR
    // ==========================================

    function esperar(tiempo) {

        return new Promise(function (resolve) {

            setTimeout(
                resolve,
                tiempo
            );

        });

    }


    // ==========================================
    // TOCAR CUADRADO
    // ==========================================

    function tocarCuadrado(numero) {

        if (!jugando) {

            return;

        }


        // --------------------------------------
        // EFECTO DEL CLIC
        // --------------------------------------

        cuadrados[numero]
            .classList.add("activo");


        setTimeout(function () {

            cuadrados[numero]
                .classList.remove("activo");

        }, 200);


        // ======================================
        // RESPUESTA CORRECTA
        // ======================================

        if (
            numero ===
            secuencia[posicionJugador]
        ) {

            posicionJugador++;


            // ==================================
            // SECUENCIA COMPLETA
            // ==================================

            if (
                posicionJugador ===
                secuencia.length
            ) {

                jugando = false;


                mensaje.textContent =
                    "¡MUY BIEN!";


                // --------------------------------
                // SI LA SECUENCIA LLEGÓ AL
                // TOTAL DE CUADRADOS
                // --------------------------------

                if (
                    secuencia.length ===
                    cantidadCuadrados
                ) {

                    setTimeout(function () {

                        // AGREGAR CUADRADO
                        cantidadCuadrados++;


                        // Crear el nuevo
                        crearCuadrados();


                        mensaje.textContent =
                            "¡APARECIÓ OTRO!";


                        setTimeout(function () {

                            nuevaRonda();

                        }, 1000);


                    }, 700);

                }

                else {

                    // --------------------------------
                    // CONTINUAR
                    // --------------------------------

                    setTimeout(function () {

                        nuevaRonda();

                    }, 1000);

                }

            }

        }

        // ======================================
        // RESPUESTA INCORRECTA
        // ======================================

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


        // --------------------------------------
        // PARPADEAR TODOS LOS CUADRADOS
        // --------------------------------------

        cuadrados.forEach(function (cuadrado) {

            cuadrado.classList.add(
                "activo"
            );

        });


        setTimeout(function () {

            cuadrados.forEach(function (cuadrado) {

                cuadrado.classList.remove(
                    "activo"
                );

            });

        }, 400);


        // --------------------------------------
        // ELIMINAR UN CUADRADO
        // --------------------------------------

        setTimeout(function () {


            // Si todavía hay cuadrados
            if (cantidadCuadrados > 0) {

                cantidadCuadrados--;

            }


            // ----------------------------------
            // REINICIAR SECUENCIA
            // ----------------------------------

            secuencia = [];

            posicionJugador = 0;


            // ----------------------------------
            // ¿QUEDARON 0?
            // ----------------------------------

            if (cantidadCuadrados === 0) {

                mensaje.textContent =
                    "FIN DEL JUEGO";


                setTimeout(function () {

                    // Volver a empezar
                    cantidadCuadrados = 4;

                    secuencia = [];

                    posicionJugador = 0;


                    crearCuadrados();


                    mensaje.textContent =
                        "NUEVAMENTE";


                    setTimeout(function () {

                        nuevaRonda();

                    }, 1000);


                }, 1500);


                return;

            }


            // ----------------------------------
            // CREAR NUEVAMENTE LOS CUADRADOS
            // ----------------------------------

            crearCuadrados();


            mensaje.textContent =
                "PERDISTE UN CUADRADO";


            // ----------------------------------
            // COMENZAR DE NUEVO
            // ----------------------------------

            setTimeout(function () {

                nuevaRonda();

            }, 1000);


        }, 700);

    }


    // ==========================================
    // INICIAR
    // ==========================================

    crearCuadrados();


    setTimeout(function () {

        mensaje.textContent =
            "MIRÁ LA SECUENCIA";


        nuevaRonda();

    }, 1000);

});

