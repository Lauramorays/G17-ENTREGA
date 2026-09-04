document.addEventListener("DOMContentLoaded", function () {

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    // =====================================================
    // CONFIGURACIÓN
    // =====================================================

    const colores = [
        "#D9D9D9",
        "#8BB2D3",
        "#202D64",
        "#2B538E"
    ];

    const TAMAÑO_INICIAL = 110;

    // Tamaño máximo de una familia
    const MAX_GENERACIONES = 3;

    // Distancia entre los dos dedos necesaria para separar
    const DISTANCIA_SEPARACION = 180;

    // Cuánto puede estirarse antes de separarse
    const ESTIRAMIENTO_MAXIMO = 1.65;

    // Fuerza de las colisiones
    const FUERZA_COLISION = 0.45;

    let figuras = [];

    // Dos dedos activos
    let dedos = new Map();

    // Figura que se está estirando
    let figuraEstirada = null;

    // =====================================================
    // CANVAS
    // =====================================================

    function ajustarCanvas() {

        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        if (figuras.length === 0) {
            crearFigurasIniciales();
        }
    }

    window.addEventListener("resize", ajustarCanvas);


    // =====================================================
    // CREAR LAS 4 FIGURAS INICIALES
    // =====================================================

    function crearFigurasIniciales() {

        figuras = [];

        const posiciones = [
            [0.25, 0.30],
            [0.75, 0.30],
            [0.25, 0.70],
            [0.75, 0.70]
        ];

        for (let i = 0; i < 4; i++) {

            const figura = crearFigura({
                x: canvas.width * posiciones[i][0],
                y: canvas.height * posiciones[i][1],
                tamaño: TAMAÑO_INICIAL,
                color: colores[i],
                generacion: 0,
                padre: null
            });

            figuras.push(figura);
        }
    }


    // =====================================================
    // CREAR UNA FIGURA
    // =====================================================

    function crearFigura(datos) {

        return {

            // -------------------------------------------------
            // POSICIÓN
            // -------------------------------------------------

            x: datos.x,
            y: datos.y,

            tamaño: datos.tamaño,

            color: datos.color,

            opacidad: datos.opacidad ?? 1,

            grosor: datos.grosor ?? 4,


            // -------------------------------------------------
            // MOVIMIENTO
            // -------------------------------------------------

            vx:
                datos.vx ??
                (Math.random() - 0.5) * 0.35,

            vy:
                datos.vy ??
                (Math.random() - 0.5) * 0.35,

            faseMovimientoX:
                Math.random() * Math.PI * 2,

            faseMovimientoY:
                Math.random() * Math.PI * 2,

            velocidadMovimiento:
                0.004 + Math.random() * 0.004,


            // -------------------------------------------------
            // RESPIRACIÓN
            // -------------------------------------------------

            faseRespiracion:
                Math.random() * Math.PI * 2,

            velocidadRespiracion:
                0.012 + Math.random() * 0.006,

            intensidadRespiracion:
                0.045 + Math.random() * 0.02,


            // -------------------------------------------------
            // ESTIRAMIENTO
            // -------------------------------------------------

            estirando: false,

            escalaX: 1,
            escalaY: 1,

            anguloEstiramiento: 0,


            // -------------------------------------------------
            // HERENCIA
            // -------------------------------------------------

            generacion:
                datos.generacion,

            padre:
                datos.padre,

            hijos: [],

            puedeReproducirse:
                datos.generacion < MAX_GENERACIONES,


            // -------------------------------------------------
            // SEPARACIÓN
            // -------------------------------------------------

            separando: false,

            progresoSeparacion: 0,

            hijosCreados: false
        };
    }


    // =====================================================
    // RADIO
    // =====================================================

    function radioFigura(figura) {

        return figura.tamaño * 0.5;
    }


    // =====================================================
    // MOVIMIENTO ORGÁNICO
    // =====================================================

    function moverFiguras() {

        figuras.forEach(figura => {

            // Mientras se manipula no tiene movimiento libre
            if (figura.estirando || figura.separando) {
                return;
            }

            figura.x += figura.vx;
            figura.y += figura.vy;


            // Movimiento orgánico

            figura.faseMovimientoX +=
                figura.velocidadMovimiento;

            figura.faseMovimientoY +=
                figura.velocidadMovimiento * 0.8;


            figura.x +=
                Math.sin(figura.faseMovimientoX) * 0.08;

            figura.y +=
                Math.cos(figura.faseMovimientoY) * 0.08;


            // -------------------------------------------------
            // BORDES
            // -------------------------------------------------

            const radio = radioFigura(figura);

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
        });
    }


    // =====================================================
    // COLISIONES
    // =====================================================

    function resolverColisiones() {

        for (let i = 0; i < figuras.length; i++) {

            for (let j = i + 1; j < figuras.length; j++) {

                const a = figuras[i];
                const b = figuras[j];

                if (a.separando || b.separando) {
                    continue;
                }

                const dx = b.x - a.x;
                const dy = b.y - a.y;

                const distancia =
                    Math.sqrt(dx * dx + dy * dy);

                const distanciaMinima =
                    radioFigura(a) +
                    radioFigura(b);

                if (distancia >= distanciaMinima) {
                    continue;
                }

                let nx = 1;
                let ny = 0;

                if (distancia > 0) {

                    nx =
                        dx / distancia;

                    ny =
                        dy / distancia;
                }

                const penetracion =
                    distanciaMinima - distancia;


                // Separación física

                if (!a.estirando && !b.estirando) {

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
                }

                else if (a.estirando) {

                    b.x +=
                        nx *
                        penetracion;

                    b.y +=
                        ny *
                        penetracion;
                }

                else if (b.estirando) {

                    a.x -=
                        nx *
                        penetracion;

                    a.y -=
                        ny *
                        penetracion;
                }


                // Rebote suave

                if (!a.estirando) {

                    a.vx -=
                        nx *
                        FUERZA_COLISION;

                    a.vy -=
                        ny *
                        FUERZA_COLISION;
                }

                if (!b.estirando) {

                    b.vx +=
                        nx *
                        FUERZA_COLISION;

                    b.vy +=
                        ny *
                        FUERZA_COLISION;
                }
            }
        }
    }


    // =====================================================
    // BUSCAR FIGURA
    // =====================================================

    function buscarFigura(x, y) {

        for (let i = figuras.length - 1; i >= 0; i--) {

            const figura = figuras[i];

            const dx =
                x - figura.x;

            const dy =
                y - figura.y;

            const distancia =
                Math.sqrt(dx * dx + dy * dy);

            if (
                distancia <=
                radioFigura(figura) * 1.2
            ) {

                return figura;
            }
        }

        return null;
    }


    // =====================================================
    // OBTENER DISTANCIA ENTRE LOS DOS DEDOS
    // =====================================================

    function distanciaDedos() {

        const puntos =
            Array.from(dedos.values());

        if (puntos.length < 2) {
            return 0;
        }

        const a = puntos[0];
        const b = puntos[1];

        const dx =
            b.x - a.x;

        const dy =
            b.y - a.y;

        return Math.sqrt(
            dx * dx +
            dy * dy
        );
    }


    // =====================================================
    // CENTRO DE LOS DOS DEDOS
    // =====================================================

    function centroDedos() {

        const puntos =
            Array.from(dedos.values());

        if (puntos.length < 2) {
            return null;
        }

        return {

            x:
                (puntos[0].x +
                    puntos[1].x) / 2,

            y:
                (puntos[0].y +
                    puntos[1].y) / 2
        };
    }


    // =====================================================
    // COMENZAR ESTIRAMIENTO
    // =====================================================

    function comenzarEstiramiento() {

        if (dedos.size !== 2) {
            return;
        }

        const puntos =
            Array.from(dedos.values());

        // Buscar una figura debajo de alguno
        // de los dos dedos

        let figura = null;

        for (const punto of puntos) {

            const encontrada =
                buscarFigura(
                    punto.x,
                    punto.y
                );

            if (encontrada) {

                figura = encontrada;
                break;
            }
        }

        if (!figura) {
            return;
        }

        if (!figura.puedeReproducirse) {
            return;
        }

        figuraEstirada = figura;

        figura.estirando = true;

        figura.escalaX = 1;

        figura.escalaY = 1;

        figura.anguloEstiramiento = 0;
    }


    // =====================================================
    // ACTUALIZAR ESTIRAMIENTO
    // =====================================================

    function actualizarEstiramiento() {

        if (!figuraEstirada) {
            return;
        }

        if (dedos.size !== 2) {
            return;
        }

        const figura =
            figuraEstirada;

        const puntos =
            Array.from(dedos.values());

        const distancia =
            distanciaDedos();

        const centro =
            centroDedos();


        // -------------------------------------------------
        // DIRECCIÓN ENTRE LOS DEDOS
        // -------------------------------------------------

        const dx =
            puntos[1].x -
            puntos[0].x;

        const dy =
            puntos[1].y -
            puntos[0].y;

        const angulo =
            Math.atan2(dy, dx);


        figura.anguloEstiramiento =
            angulo;


        // -------------------------------------------------
        // FACTOR DE ESTIRAMIENTO
        // -------------------------------------------------

        const factor =
            Math.min(
                distancia /
                DISTANCIA_SEPARACION,
                ESTIRAMIENTO_MAXIMO
            );


        // -------------------------------------------------
        // EL CUADRADO SE ESTIRA
        // -------------------------------------------------

        figura.escalaX =
            1 +
            (factor - 0.3) *
            0.75;

        figura.escalaX =
            Math.max(
                1,
                figura.escalaX
            );

        figura.escalaY =
            1 -
            Math.min(
                (factor - 0.3) * 0.25,
                0.25
            );


        // -------------------------------------------------
        // SIGUE EL CENTRO DE LOS DEDOS
        // -------------------------------------------------

        if (centro) {

            figura.x +=
                (centro.x - figura.x) *
                0.12;

            figura.y +=
                (centro.y - figura.y) *
                0.12;
        }


        // -------------------------------------------------
        // CUANDO LLEGA AL LÍMITE
        // RECIÉN AHÍ SE SEPARA
        // -------------------------------------------------

        if (
            distancia >=
            DISTANCIA_SEPARACION
        ) {

            separarFigura(figura);
        }
    }


    // =====================================================
    // SEPARAR Y CREAR HIJOS
    // =====================================================

    function separarFigura(padre) {

        if (
            padre.separando ||
            padre.hijosCreados
        ) {
            return;
        }

        padre.separando = true;

        padre.hijosCreados = true;

        padre.estirando = false;


        // Volver a cuadrado
        padre.escalaX = 1;
        padre.escalaY = 1;


        // -------------------------------------------------
        // SI YA ES LA ÚLTIMA GENERACIÓN
        // -------------------------------------------------

        if (
            padre.generacion >=
            MAX_GENERACIONES
        ) {

            padre.separando = false;

            padre.hijosCreados = false;

            padre.puedeReproducirse = false;

            return;
        }


        // -------------------------------------------------
        // CREAR DOS HIJOS
        // -------------------------------------------------

        const tamañoHijo =
            padre.tamaño * 0.62;

        const angulo =
            padre.anguloEstiramiento;


        const separacion =
            padre.tamaño * 0.75;


        const posiciones = [

            {
                x:
                    padre.x +
                    Math.cos(angulo) *
                    separacion,

                y:
                    padre.y +
                    Math.sin(angulo) *
                    separacion
            },

            {
                x:
                    padre.x -
                    Math.cos(angulo) *
                    separacion,

                y:
                    padre.y -
                    Math.sin(angulo) *
                    separacion
            }
        ];


        for (let i = 0; i < 2; i++) {

            // -------------------------------------------------
            // HERENCIA
            // -------------------------------------------------

            const hijo =
                crearFigura({

                    x:
                        padre.x,

                    y:
                        padre.y,

                    tamaño:
                        tamañoHijo *
                        (
                            0.94 +
                            Math.random() * 0.10
                        ),

                    // MISMO COLOR DEL PADRE
                    color:
                        padre.color,

                    // Hereda opacidad
                    opacidad:
                        padre.opacidad *
                        (
                            0.92 +
                            Math.random() * 0.06
                        ),

                    // Hereda grosor
                    grosor:
                        padre.grosor *
                        (
                            0.92 +
                            Math.random() * 0.08
                        ),

                    // Hereda movimiento
                    vx:
                        padre.vx +
                        (Math.random() - 0.5) *
                        0.20,

                    vy:
                        padre.vy +
                        (Math.random() - 0.5) *
                        0.20,

                    generacion:
                        padre.generacion + 1,

                    padre:
                        padre
                });


            // Guardamos la relación
            padre.hijos.push(hijo);

            figuras.push(hijo);


            // -------------------------------------------------
            // ANIMACIÓN DE NACIMIENTO
            // -------------------------------------------------

            hijo.separando = true;

            hijo.progresoSeparacion = 0;

            hijo.destinoX =
                posiciones[i].x;

            hijo.destinoY =
                posiciones[i].y;
        }


        // El padre queda como elemento de la generación anterior
        padre.puedeReproducirse = false;

        figuraEstirada = null;

        dedos.clear();
    }


    // =====================================================
    // ANIMAR SEPARACIÓN
    // =====================================================

    function actualizarSeparaciones() {

        figuras.forEach(figura => {

            if (!figura.separando) {
                return;
            }

            figura.progresoSeparacion += 0.035;

            const progreso =
                Math.min(
                    figura.progresoSeparacion,
                    1
                );


            // Movimiento suave
            const suavizado =
                1 -
                Math.pow(
                    1 - progreso,
                    3
                );


            figura.x =
                figura.x +
                (
                    figura.destinoX -
                    figura.x
                ) *
                0.12;

            figura.y =
                figura.y +
                (
                    figura.destinoY -
                    figura.y
                ) *
                0.12;


            // Al terminar
            if (progreso >= 1) {

                figura.x =
                    figura.destinoX;

                figura.y =
                    figura.destinoY;

                figura.separando = false;
            }
        });
    }


    // =====================================================
    // TOUCH START
    // =====================================================

    canvas.addEventListener(
        "touchstart",
        function (e) {

            e.preventDefault();

            const rect =
                canvas.getBoundingClientRect();


            for (
                let i = 0;
                i < e.changedTouches.length;
                i++
            ) {

                const touch =
                    e.changedTouches[i];

                dedos.set(
                    touch.identifier,
                    {

                        x:
                            touch.clientX -
                            rect.left,

                        y:
                            touch.clientY -
                            rect.top
                    }
                );
            }


            // SOLO CUANDO HAY DOS DEDOS
            if (dedos.size === 2) {

                comenzarEstiramiento();
            }

        },
        {
            passive: false
        }
    );


    // =====================================================
    // TOUCH MOVE
    // =====================================================

    canvas.addEventListener(
        "touchmove",
        function (e) {

            e.preventDefault();

            const rect =
                canvas.getBoundingClientRect();


            for (
                let i = 0;
                i < e.changedTouches.length;
                i++
            ) {

                const touch =
                    e.changedTouches[i];

                if (
                    dedos.has(
                        touch.identifier
                    )
                ) {

                    dedos.set(
                        touch.identifier,
                        {

                            x:
                                touch.clientX -
                                rect.left,

                            y:
                                touch.clientY -
                                rect.top
                        }
                    );
                }
            }


            actualizarEstiramiento();

        },
        {
            passive: false
        }
    );


    // =====================================================
    // TOUCH END
    // =====================================================

    canvas.addEventListener(
        "touchend",
        function (e) {

            e.preventDefault();


            for (
                let i = 0;
                i < e.changedTouches.length;
                i++
            ) {

                dedos.delete(
                    e.changedTouches[i].identifier
                );
            }


            // Si soltamos antes del límite
            // vuelve suavemente a su forma original

            if (
                figuraEstirada &&
                dedos.size < 2
            ) {

                figuraEstirada.estirando =
                    false;

                figuraEstirada.escalaX =
                    1;

                figuraEstirada.escalaY =
                    1;

                figuraEstirada =
                    null;
            }

        },
        {
            passive: false
        }
    );


    // =====================================================
    // TOUCH CANCEL
    // =====================================================

    canvas.addEventListener(
        "touchcancel",
        function () {

            dedos.clear();

            if (figuraEstirada) {

                figuraEstirada.estirando =
                    false;

                figuraEstirada.escalaX =
                    1;

                figuraEstirada.escalaY =
                    1;
            }

            figuraEstirada = null;
        }
    );


    // =====================================================
    // DIBUJAR
    // =====================================================

    function dibujarFigura(figura) {

        // Respiración

        figura.faseRespiracion +=
            figura.velocidadRespiracion;


        const respiracion =
            1 +
            Math.sin(
                figura.faseRespiracion
            ) *
            figura.intensidadRespiracion;


        const tamaño =
            figura.tamaño *
            respiracion;


        ctx.save();


        ctx.translate(
            figura.x,
            figura.y
        );


        // Durante el estiramiento
        // rotamos el eje del cuadrado

        if (figura.estirando) {

            ctx.rotate(
                figura.anguloEstiramiento
            );
        }


        // Escala

        ctx.scale(
            figura.escalaX,
            figura.escalaY
        );


        ctx.globalAlpha =
            figura.opacidad;


        // -------------------------------------------------
        // CUADRADO
        // -------------------------------------------------

        ctx.fillStyle =
            figura.color;


        ctx.fillRect(
            -tamaño / 2,
            -tamaño / 2,
            tamaño,
            tamaño
        );


        // -------------------------------------------------
        // BORDE
        // -------------------------------------------------

        ctx.strokeStyle =
            figura.color;

        ctx.lineWidth =
            figura.grosor;


        ctx.strokeRect(
            -tamaño / 2,
            -tamaño / 2,
            tamaño,
            tamaño
        );


        ctx.restore();
    }


    // =====================================================
    // ANIMACIÓN PRINCIPAL
    // =====================================================

    function animar() {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        // 1. Movimiento
        moverFiguras();


        // 2. Colisiones
        resolverColisiones();


        // 3. Separaciones
        actualizarSeparaciones();


        // 4. Dibujar
        figuras.forEach(
            dibujarFigura
        );


        requestAnimationFrame(
            animar
        );
    }


    // =====================================================
    // INICIAR
    // =====================================================

    ajustarCanvas();

    animar();

});