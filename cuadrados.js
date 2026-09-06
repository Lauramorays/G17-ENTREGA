
// ============================================================
// CUADRADOS - MEMORIA
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    // ========================================================
    // CONFIGURACIÓN
    // ========================================================

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

    let procesandoPerdida = false;


    // ========================================================
    // ESTILO
    // ========================================================

    function aplicarEstiloCuadrado(elemento, color) {

        elemento.style.border = "none";
        elemento.style.outline = "none";
        elemento.style.borderRadius = "0";
        elemento.style.boxSizing = "border-box";


        if (color === "#D9D9D9") {

            elemento.style.background =
                "radial-gradient(circle at 35% 30%, #FFFFFF 0%, #D9D9D9 45%, #AEB4BA 100%)";

            elemento.style.boxShadow =
                "0 0 18px rgba(217,217,217,0.25), inset -8px -8px 15px rgba(0,0,0,0.12), inset 5px 5px 12px rgba(255,255,255,0.35)";

        }

        else if (color === "#8BB2D3") {

            elemento.style.background =
                "radial-gradient(circle at 35% 30%, #DCECF9 0%, #8BB2D3 48%, #527A9C 100%)";

            elemento.style.boxShadow =
                "0 0 18px rgba(139,178,211,0.25), inset -8px -8px 15px rgba(0,0,0,0.15), inset 5px 5px 12px rgba(255,255,255,0.25)";

        }

        else if (color === "#202D64") {

            elemento.style.background =
                "radial-gradient(circle at 35% 30%, #6674A5 0%, #202D64 50%, #10183B 100%)";

            elemento.style.boxShadow =
                "0 0 18px rgba(32,45,100,0.35), inset -8px -8px 15px rgba(0,0,0,0.25), inset 5px 5px 12px rgba(255,255,255,0.15)";

        }

        else if (color === "#2B538E") {

            elemento.style.background =
                "radial-gradient(circle at 35% 30%, #7EA7D0 0%, #2B538E 50%, #18355F 100%)";

            elemento.style.boxShadow =
                "0 0 18px rgba(43,83,142,0.35), inset -8px -8px 15px rgba(0,0,0,0.25), inset 5px 5px 12px rgba(255,255,255,0.18)";
        }
    }


    // ========================================================
    // CREAR CUADRADOS
    // ========================================================

    function crearCuadrados() {

        contenedor.innerHTML = "";

        cuadrados = [];


        for (let i = 0; i < cantidadCuadrados; i++) {

            crearCuadrado(i);
        }


        posicionarCuadrados();
    }


    // ========================================================
    // CREAR UN CUADRADO
    // ========================================================

    function crearCuadrado(indice) {

        const elemento =
            document.createElement("div");


        elemento.classList.add("cuadrado");


        const color =
            colores[indice % colores.length];


        aplicarEstiloCuadrado(
            elemento,
            color
        );


        contenedor.appendChild(
            elemento
        );


        const cuadrado = {

            elemento: elemento,

            x: 0,
            y: 0,

            vx:
                (Math.random() - 0.5) * 1.5,

            vy:
                (Math.random() - 0.5) * 1.5,

            tamaño: 120,

            color: color,


            // =================================================
            // RESPIRACIÓN
            // =================================================

            faseRespiracion:
                Math.random() *
                Math.PI * 2,

            faseSecundaria:
                Math.random() *
                Math.PI * 2,

            velocidadRespiracion:
                0.012 +
                Math.random() * 0.005,

            amplitudRespiracion:
                0.045 +
                Math.random() * 0.015,

            respiracionX: 1,

            respiracionY: 1,


            // MOVIMIENTO VERTICAL

            faseVertical:
                Math.random() *
                Math.PI * 2,

            velocidadVertical:
                0.008 +
                Math.random() * 0.008,


            // EMPUJE

            empujeX: 0,
            empujeY: 0,


            // ROTACIÓN

            rotacion:
                (Math.random() - 0.5) * 4,

            velocidadRotacion:
                (Math.random() - 0.5) * 0.015,


            // SELECCIÓN

            seleccionado: false,


            // APARICIÓN

            escalaAparicion: 0,

            opacidadAparicion: 0,

            apareciendo: true,

            tiempoAparicion: 0,


            // DESAPARICIÓN

            desapareciendo: false,

            tiempoDesaparicion: 0,

            escalaDesaparicion: 1,

            opacidadDesaparicion: 1,

            marcadoParaEliminar: false
        };


        cuadrados.push(cuadrado);


        // ----------------------------------------------------
        // CLICK
        // ----------------------------------------------------

        elemento.addEventListener(
            "click",
            function (e) {

                e.stopPropagation();

                const indiceActual =
                    cuadrados.indexOf(
                        cuadrado
                    );


                if (indiceActual !== -1) {

                    tocarCuadrado(
                        indiceActual
                    );
                }
            }
        );


        return cuadrado;
    }


    // ========================================================
    // TAMAÑO
    // ========================================================

    function actualizarTamaño() {

        const tamañoBase =
            cantidadCuadrados <= 9
                ? 120
                : 100;


        cuadrados.forEach(cuadrado => {

            if (!cuadrado.desapareciendo) {

                cuadrado.tamaño =
                    tamañoBase;
            }
        });
    }


    // ========================================================
    // POSICIONAR
    // ========================================================

    function posicionarCuadrados() {

        actualizarTamaño();


        const ancho =
            contenedor.clientWidth;

        const alto =
            contenedor.clientHeight;


        let columnas;


        if (cantidadCuadrados <= 4) {

            columnas = 2;

        }

        else if (cantidadCuadrados <= 9) {

            columnas = 3;

        }

        else {

            columnas = 4;
        }


        const filas =
            Math.ceil(
                cantidadCuadrados /
                columnas
            );


        const separacion =
            cantidadCuadrados <= 4
                ? 180
                : 150;


        const anchoTotal =
            (columnas - 1) *
            separacion;


        const altoTotal =
            (filas - 1) *
            separacion;


        const centroX =
            ancho / 2;

        const centroY =
            alto / 2;


        cuadrados.forEach(
            (cuadrado, i) => {

                const fila =
                    Math.floor(
                        i / columnas
                    );


                const columna =
                    i % columnas;


                cuadrado.x =
                    centroX -
                    anchoTotal / 2 +
                    columna *
                    separacion -
                    cuadrado.tamaño / 2;


                cuadrado.y =
                    centroY -
                    altoTotal / 2 +
                    fila *
                    separacion -
                    cuadrado.tamaño / 2;
            }
        );
    }


    // ========================================================
    // ESPERAR
    // ========================================================

    function esperar(ms) {

        return new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    ms
                )
        );
    }


    // ========================================================
    // INICIAR JUEGO
    // ========================================================

    async function iniciarJuego() {

        if (mostrandoSecuencia) return;

        if (procesandoPerdida) return;


        jugando = false;


        await esperar(500);


        if (secuencia.length === 0) {

            secuencia.push(
                Math.floor(
                    Math.random() *
                    cuadrados.length
                )
            );
        }


        posicionJugador = 0;


        mostrarSecuencia();
    }


    // ========================================================
    // AGREGAR PASO
    // ========================================================

    function agregarPaso() {

        if (cuadrados.length === 0) return;


        const indice =
            Math.floor(
                Math.random() *
                cuadrados.length
            );


        // NO SE BORRA LA SECUENCIA ANTERIOR

        secuencia.push(indice);


        posicionJugador = 0;


        mostrarSecuencia();
    }


    // ========================================================
    // MOSTRAR SECUENCIA
    // ========================================================

    async function mostrarSecuencia() {

        mostrandoSecuencia = true;

        jugando = false;


        await esperar(400);


        for (
            let i = 0;
            i < secuencia.length;
            i++
        ) {

            const indice =
                secuencia[i];


            const cuadrado =
                cuadrados[indice];


            if (
                cuadrado &&
                !cuadrado.desapareciendo
            ) {

                await encenderCuadrado(
                    cuadrado
                );
            }


            await esperar(180);
        }


        mostrandoSecuencia = false;

        jugando = true;

        posicionJugador = 0;
    }


    // ========================================================
    // ENCENDER
    // ========================================================

    function encenderCuadrado(cuadrado) {

        return new Promise(
            resolve => {

                if (
                    !cuadrado ||
                    cuadrado.desapareciendo
                ) {

                    resolve();

                    return;
                }


                cuadrado.seleccionado =
                    true;


                setTimeout(() => {

                    cuadrado.seleccionado =
                        false;

                    resolve();

                }, 500);
            }
        );
    }


    // ========================================================
    // TOCAR CUADRADO
    // ========================================================

    function tocarCuadrado(indice) {

        if (!jugando) return;

        if (mostrandoSecuencia) return;

        if (procesandoPerdida) return;


        const cuadrado =
            cuadrados[indice];


        if (!cuadrado) return;

        if (cuadrado.desapareciendo) {
            return;
        }


        // ----------------------------------------------------
        // EFECTO VISUAL
        // ----------------------------------------------------

        cuadrado.seleccionado =
            true;


        setTimeout(() => {

            cuadrado.seleccionado =
                false;

        }, 180);


        // ====================================================
        // CORRECTO
        // ====================================================

        if (
            indice ===
            secuencia[posicionJugador]
        ) {

            posicionJugador++;


            if (
                posicionJugador >=
                secuencia.length
            ) {

                jugando = false;


                if (
                    secuencia.length >=
                    cantidadCuadrados
                ) {

                    agregarCuadrado();

                }

                else {

                    setTimeout(() => {

                        agregarPaso();

                    }, 500);
                }
            }
        }


        // ====================================================
        // INCORRECTO
        // ====================================================

        else {

            perder(indice);
        }
    }


    // ========================================================
    // AGREGAR CUADRADO
    // ========================================================

    function agregarCuadrado() {

        if (cantidadCuadrados >= 12) {

            setTimeout(() => {

                agregarPaso();

            }, 500);

            return;
        }


        cantidadCuadrados++;


        const cuadradoNuevo =
            crearCuadrado(
                cuadrados.length
            );


        const tamaño =
            cuadradoNuevo.tamaño;


        const ancho =
            contenedor.clientWidth;

        const alto =
            contenedor.clientHeight;


        let encontrado = false;


        for (
            let intento = 0;
            intento < 200;
            intento++
        ) {

            const x =
                Math.random() *
                Math.max(
                    1,
                    ancho -
                    tamaño -
                    40
                ) +
                20;


            const y =
                Math.random() *
                Math.max(
                    1,
                    alto -
                    tamaño -
                    40
                ) +
                20;


            let libre = true;


            for (
                let i = 0;
                i < cuadrados.length - 1;
                i++
            ) {

                const otro =
                    cuadrados[i];


                const dx =
                    x - otro.x;


                const dy =
                    y - otro.y;


                const distancia =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );


                if (
                    distancia <
                    tamaño * 1.2
                ) {

                    libre = false;

                    break;
                }
            }


            if (libre) {

                cuadradoNuevo.x =
                    x;

                cuadradoNuevo.y =
                    y;

                encontrado = true;

                break;
            }
        }


        if (!encontrado) {

            cuadradoNuevo.x =
                Math.random() *
                Math.max(
                    1,
                    ancho - tamaño
                );


            cuadradoNuevo.y =
                Math.random() *
                Math.max(
                    1,
                    alto - tamaño
                );
        }


        // ====================================================
        // NO REINICIAR LA SECUENCIA
        // ====================================================

        setTimeout(() => {

            agregarPaso();

        }, 700);
    }


    // ========================================================
    // PERDER
    // ========================================================

    function perder(indiceError) {

        if (procesandoPerdida) return;


        procesandoPerdida = true;

        jugando = false;

        mostrandoSecuencia = false;


        cuadrados.forEach(
            cuadrado => {

                cuadrado.elemento.style.filter =
                    "brightness(1.35)";
            }
        );


        setTimeout(() => {

            cuadrados.forEach(
                cuadrado => {

                    cuadrado.elemento.style.filter =
                        "brightness(1)";
                }
            );

        }, 180);


        let indiceEliminar =
            indiceError;


        if (
            !cuadrados[indiceEliminar]
        ) {

            indiceEliminar =
                Math.floor(
                    Math.random() *
                    cuadrados.length
                );
        }


        iniciarDesaparicion(
            indiceEliminar
        );
    }


    // ========================================================
    // INICIAR DESAPARICIÓN
    // ========================================================

    function iniciarDesaparicion(indice) {

        const cuadrado =
            cuadrados[indice];


        if (!cuadrado) {

            terminarPerdida();

            return;
        }


        cuadrado.desapareciendo =
            true;


        cuadrado.tiempoDesaparicion =
            0;


        cuadrado.escalaDesaparicion =
            1;


        cuadrado.opacidadDesaparicion =
            1;


        cuadrado.seleccionado =
            false;


        cuadrado.vx *= 0.7;

        cuadrado.vy *= 0.7;
    }


    // ========================================================
    // ACTUALIZAR APARICIÓN
    // ========================================================

    function actualizarAparicion(cuadrado) {

        if (!cuadrado.apareciendo) {
            return;
        }


        cuadrado.tiempoAparicion +=
            0.025;


        const duracion = 1.0;


        let progreso =
            cuadrado.tiempoAparicion /
            duracion;


        if (progreso > 1) {
            progreso = 1;
        }


        const crecimiento =
            1 -
            Math.pow(
                1 - progreso,
                3
            );


        cuadrado.escalaAparicion =
            crecimiento;


        cuadrado.opacidadAparicion =
            Math.min(
                1,
                progreso * 1.35
            );


        if (progreso >= 1) {

            cuadrado.escalaAparicion =
                1;

            cuadrado.opacidadAparicion =
                1;

            cuadrado.apareciendo =
                false;
        }
    }


    // ========================================================
    // ACTUALIZAR DESAPARICIÓN
    // ========================================================

    function actualizarDesaparicion(cuadrado) {

        if (!cuadrado.desapareciendo) {
            return;
        }


        cuadrado.tiempoDesaparicion +=
            0.025;


        const duracion = 1.0;


        let progreso =
            cuadrado.tiempoDesaparicion /
            duracion;


        if (progreso > 1) {
            progreso = 1;
        }


        const reduccion =
            1 -
            Math.pow(
                1 - progreso,
                3
            );


        cuadrado.escalaDesaparicion =
            1 - reduccion;


        cuadrado.opacidadDesaparicion =
            1 - reduccion;


        if (progreso >= 1) {

            cuadrado.escalaDesaparicion =
                0;

            cuadrado.opacidadDesaparicion =
                0;

            cuadrado.marcadoParaEliminar =
                true;
        }
    }


    // ========================================================
    // TERMINAR PÉRDIDA
    // ========================================================

    function terminarPerdida() {

        cuadrados
            .filter(
                c =>
                    c.marcadoParaEliminar
            )
            .forEach(
                cuadrado => {

                    if (
                        cuadrado.elemento
                    ) {

                        cuadrado.elemento.remove();
                    }
                }
            );


        cuadrados =
            cuadrados.filter(
                c =>
                    !c.marcadoParaEliminar
            );


        cantidadCuadrados =
            cuadrados.length;


        // ====================================================
        // AQUÍ SÍ SE REINICIA TODO
        // ====================================================

        secuencia = [];

        posicionJugador = 0;


        if (
            cantidadCuadrados <= 0
        ) {

            cantidadCuadrados = 4;


            setTimeout(() => {

                crearCuadrados();


                setTimeout(() => {

                    procesandoPerdida =
                        false;

                    iniciarJuego();

                }, 900);

            }, 300);


            return;
        }


        setTimeout(() => {

            crearCuadrados();


            setTimeout(() => {

                procesandoPerdida =
                    false;

                iniciarJuego();

            }, 900);

        }, 300);
    }


    // ========================================================
    // MOVIMIENTO
    // ========================================================

    function moverCuadrados() {

        const ancho =
            contenedor.clientWidth;

        const alto =
            contenedor.clientHeight;


        cuadrados.forEach(
            cuadrado => {

                // ------------------------------------------------
                // MOVIMIENTO VERTICAL
                // ------------------------------------------------

                cuadrado.faseVertical +=
                    cuadrado.velocidadVertical;


                const movimientoVertical =
                    Math.sin(
                        cuadrado.faseVertical
                    ) * 0.08;


                cuadrado.x +=
                    cuadrado.vx +
                    cuadrado.empujeX;


                cuadrado.y +=
                    cuadrado.vy +
                    cuadrado.empujeY +
                    movimientoVertical;


                cuadrado.empujeX *=
                    0.94;


                cuadrado.empujeY *=
                    0.94;


                cuadrado.rotacion +=
                    cuadrado.velocidadRotacion;


                // =================================================
                // RESPIRACIÓN
                // =================================================

                cuadrado.faseRespiracion +=
                    cuadrado.velocidadRespiracion;

                cuadrado.faseSecundaria +=
                    cuadrado.velocidadRespiracion * 0.47;


                const ondaPrincipal =
                    Math.sin(
                        cuadrado.faseRespiracion
                    );


                const ondaSecundaria =
                    Math.sin(
                        cuadrado.faseSecundaria
                    );


                const respiracion =
                    ondaPrincipal *
                    cuadrado.amplitudRespiracion +
                    ondaSecundaria *
                    0.006;


                cuadrado.respiracionX =
                    1 + respiracion;


                cuadrado.respiracionY =
                    1 + respiracion * 0.94;


                const tamaño =
                    cuadrado.tamaño;


                // ------------------------------------------------
                // BORDE IZQUIERDO
                // ------------------------------------------------

                if (cuadrado.x <= 0) {

                    cuadrado.x = 0;

                    cuadrado.vx =
                        Math.abs(
                            cuadrado.vx
                        );
                }


                // ------------------------------------------------
                // BORDE DERECHO
                // ------------------------------------------------

                if (
                    cuadrado.x +
                    tamaño >=
                    ancho
                ) {

                    cuadrado.x =
                        ancho - tamaño;

                    cuadrado.vx =
                        -Math.abs(
                            cuadrado.vx
                        );
                }


                // ------------------------------------------------
                // BORDE SUPERIOR
                // ------------------------------------------------

                if (cuadrado.y <= 0) {

                    cuadrado.y = 0;

                    cuadrado.vy =
                        Math.abs(
                            cuadrado.vy
                        );
                }


                // ------------------------------------------------
                // BORDE INFERIOR
                // ------------------------------------------------

                if (
                    cuadrado.y +
                    tamaño >=
                    alto
                ) {

                    cuadrado.y =
                        alto - tamaño;

                    cuadrado.vy =
                        -Math.abs(
                            cuadrado.vy
                        );
                }
            }
        );
    }


    // ========================================================
    // COLISIONES
    // ========================================================

    function detectarColisiones() {

        for (
            let i = 0;
            i < cuadrados.length;
            i++
        ) {

            const a =
                cuadrados[i];


            if (
                a.marcadoParaEliminar
            ) {
                continue;
            }


            for (
                let j = i + 1;
                j < cuadrados.length;
                j++
            ) {

                const b =
                    cuadrados[j];


                if (
                    b.marcadoParaEliminar
                ) {
                    continue;
                }


                const centroAX =
                    a.x +
                    a.tamaño / 2;


                const centroAY =
                    a.y +
                    a.tamaño / 2;


                const centroBX =
                    b.x +
                    b.tamaño / 2;


                const centroBY =
                    b.y +
                    b.tamaño / 2;


                const dx =
                    centroBX -
                    centroAX;


                const dy =
                    centroBY -
                    centroAY;


                const distancia =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );


                const distanciaMinima =
                    (
                        a.tamaño +
                        b.tamaño
                    ) / 2;


                if (
                    distancia <
                    distanciaMinima &&
                    distancia > 0
                ) {

                    const nx =
                        dx / distancia;


                    const ny =
                        dy / distancia;


                    const solapamiento =
                        distanciaMinima -
                        distancia;


                    const separacion =
                        solapamiento / 2;


                    a.x -=
                        nx * separacion;


                    a.y -=
                        ny * separacion;


                    b.x +=
                        nx * separacion;


                    b.y +=
                        ny * separacion;


                    const velocidadAX =
                        a.vx;


                    const velocidadAY =
                        a.vy;


                    a.vx =
                        b.vx * 0.98;


                    a.vy =
                        b.vy * 0.98;


                    b.vx =
                        velocidadAX * 0.98;


                    b.vy =
                        velocidadAY * 0.98;


                    a.empujeX -=
                        nx * 0.12;


                    a.empujeY -=
                        ny * 0.12;


                    b.empujeX +=
                        nx * 0.12;


                    b.empujeY +=
                        ny * 0.12;
                }
            }
        }
    }


    // ========================================================
    // DIBUJAR
    // ========================================================

    function dibujarCuadrados() {

        cuadrados.forEach(
            cuadrado => {

                // --------------------------------------------
                // APARICIÓN
                // --------------------------------------------

                actualizarAparicion(
                    cuadrado
                );


                // --------------------------------------------
                // DESAPARICIÓN
                // --------------------------------------------

                actualizarDesaparicion(
                    cuadrado
                );


                // --------------------------------------------
                // ESCALA
                // --------------------------------------------

                let escala =
                    1;


                if (
                    cuadrado.apareciendo
                ) {

                    escala *=
                        cuadrado.escalaAparicion;
                }


                if (
                    cuadrado.desapareciendo
                ) {

                    escala *=
                        cuadrado.escalaDesaparicion;
                }


                // --------------------------------------------
                // POSICIÓN
                // --------------------------------------------

                cuadrado.elemento.style.left =
                    cuadrado.x + "px";


                cuadrado.elemento.style.top =
                    cuadrado.y + "px";


                cuadrado.elemento.style.width =
                    cuadrado.tamaño + "px";


                cuadrado.elemento.style.height =
                    cuadrado.tamaño + "px";


                // --------------------------------------------
                // OPACIDAD
                // --------------------------------------------

                let opacidad = 1;


                if (
                    cuadrado.apareciendo
                ) {

                    opacidad =
                        cuadrado.opacidadAparicion;
                }


                if (
                    cuadrado.desapareciendo
                ) {

                    opacidad =
                        cuadrado.opacidadDesaparicion;
                }


                cuadrado.elemento.style.opacity =
                    opacidad;


                // =================================================
                // TRANSFORMACIÓN
                // =================================================
                //
                // La respiración se aplica acá.
                // El cambio de tamaño es pequeño.
                //
                // X y Y son ligeramente diferentes para que
                // no parezca simplemente un zoom.
                // =================================================

                cuadrado.elemento.style.transform =
                    `scaleX(${escala * cuadrado.respiracionX}) scaleY(${escala * cuadrado.respiracionY}) rotate(${cuadrado.rotacion}deg)`;


                // --------------------------------------------
                // ESTILO NORMAL
                // --------------------------------------------

                aplicarEstiloCuadrado(
                    cuadrado.elemento,
                    cuadrado.color
                );


                // --------------------------------------------
                // SELECCIÓN
                // --------------------------------------------

                if (
                    cuadrado.seleccionado
                ) {

                    cuadrado.elemento.style.border =
                        "none";

                    cuadrado.elemento.style.outline =
                        "none";

                    cuadrado.elemento.style.boxShadow =
                        `0 0 30px ${COLOR_SELECCION}`;
                }
            }
        );


        // ====================================================
        // COMPROBAR DESAPARICIÓN TERMINADA
        // ====================================================

        const hayEliminado =
            cuadrados.some(
                cuadrado =>
                    cuadrado.marcadoParaEliminar
            );


        if (hayEliminado) {

            terminarPerdida();
        }
    }


    // ========================================================
    // ANIMACIÓN
    // ========================================================

    function animar() {

        moverCuadrados();

        detectarColisiones();

        dibujarCuadrados();

        requestAnimationFrame(
            animar
        );
    }


    // ========================================================
    // INICIO
    // ========================================================

    crearCuadrados();

    animar();


    setTimeout(() => {

        iniciarJuego();

    }, 1000);

});

