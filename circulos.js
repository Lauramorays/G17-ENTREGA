document.addEventListener("DOMContentLoaded", function () {

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");


    // =====================================================
    // COLORES
    // =====================================================

    const colores = [
        "#D9D9D9",
        "#8BB2D3",
        "#202D64",
        "#2B538E"
    ];


    // =====================================================
    // CONFIGURACIÓN
    // =====================================================

    const TAMAÑO_INICIAL = 55;

    const VELOCIDAD_MAXIMA = 0.8;

    const FUERZA_COLISION = 0.7;


    // =====================================================
    // VARIABLES
    // =====================================================

    let circulos = [];

    // Todos los dedos activos
    const dedos = new Map();

    // Deformación activa
    let deformacionActiva = null;


    // =====================================================
    // CANVAS
    // =====================================================

    function ajustarCanvas() {

        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        if (circulos.length === 0) {

            crearCirculos();

        }

    }


    window.addEventListener(
        "resize",
        ajustarCanvas
    );


    // =====================================================
    // CREAR CÍRCULOS
    // =====================================================

    function crearCirculos() {

        circulos = [];

        const posiciones = [

            [0.25, 0.30],
            [0.75, 0.30],
            [0.25, 0.70],
            [0.75, 0.70]

        ];


        for (let i = 0; i < 4; i++) {

            circulos.push({

                // =========================================
                // POSICIÓN
                // =========================================

                x:
                    canvas.width *
                    posiciones[i][0],

                y:
                    canvas.height *
                    posiciones[i][1],


                // =========================================
                // TAMAÑO
                // =========================================

                radio:
                    TAMAÑO_INICIAL,

                radioOriginal:
                    TAMAÑO_INICIAL,


                // =========================================
                // COLOR
                // =========================================

                color:
                    colores[i],


                // =========================================
                // MOVIMIENTO
                // =========================================

                vx:
                    (Math.random() - 0.5) *
                    VELOCIDAD_MAXIMA,

                vy:
                    (Math.random() - 0.5) *
                    VELOCIDAD_MAXIMA,


                // Movimiento orgánico

                faseX:
                    Math.random() *
                    Math.PI *
                    2,

                faseY:
                    Math.random() *
                    Math.PI *
                    2,

                velocidadOrganica:
                    0.004 +
                    Math.random() *
                    0.004,


                // =========================================
                // RESPIRACIÓN
                // =========================================

                faseRespiracion:
                    Math.random() *
                    Math.PI *
                    2,

                velocidadRespiracion:
                    0.012 +
                    Math.random() *
                    0.006,

                intensidadRespiracion:
                    0.035 +
                    Math.random() *
                    0.025,


                // =========================================
                // INTERACCIÓN
                // =========================================

                siendoMovido:
                    false,

                punteroMovimiento:
                    null,


                // =========================================
                // DEFORMACIÓN
                // =========================================

                deformando:
                    false,

                dedosDeformacion:
                    [],

                escalaX:
                    1,

                escalaY:
                    1,

                anguloDeformacion:
                    0

            });

        }

    }


    // =====================================================
    // RADIO FÍSICO
    // =====================================================

    function radioFisico(circulo) {

        return circulo.radio;

    }


    // =====================================================
    // MOVIMIENTO ORGÁNICO
    // =====================================================

    function moverCirculos() {

        circulos.forEach(circulo => {

            // Si lo estamos moviendo con un dedo
            // no hacemos movimiento automático.

            if (circulo.siendoMovido) {

                return;

            }


            // Si está siendo deformado
            // tampoco modificamos su posición.

            if (circulo.deformando) {

                return;

            }


            // =============================================
            // MOVIMIENTO PRINCIPAL
            // =============================================

            circulo.x += circulo.vx;

            circulo.y += circulo.vy;


            // =============================================
            // MOVIMIENTO ORGÁNICO
            // =============================================

            circulo.faseX +=
                circulo.velocidadOrganica;

            circulo.faseY +=
                circulo.velocidadOrganica *
                0.8;


            circulo.x +=
                Math.sin(circulo.faseX) *
                0.12;

            circulo.y +=
                Math.cos(circulo.faseY) *
                0.12;


            controlarBordes(circulo);

        });

    }


    // =====================================================
    // BORDES
    // =====================================================

    function controlarBordes(circulo) {

        const radio =
            radioFisico(circulo);


        if (circulo.x - radio < 0) {

            circulo.x =
                radio;

            circulo.vx =
                Math.abs(circulo.vx);

        }


        if (
            circulo.x + radio >
            canvas.width
        ) {

            circulo.x =
                canvas.width - radio;

            circulo.vx =
                -Math.abs(circulo.vx);

        }


        if (circulo.y - radio < 0) {

            circulo.y =
                radio;

            circulo.vy =
                Math.abs(circulo.vy);

        }


        if (
            circulo.y + radio >
            canvas.height
        ) {

            circulo.y =
                canvas.height - radio;

            circulo.vy =
                -Math.abs(circulo.vy);

        }

    }


    // =====================================================
    // COLISIONES
    // =====================================================

    function detectarColisiones() {

        for (
            let i = 0;
            i < circulos.length;
            i++
        ) {

            for (
                let j = i + 1;
                j < circulos.length;
                j++
            ) {

                const a =
                    circulos[i];

                const b =
                    circulos[j];


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
                    radioFisico(a) +
                    radioFisico(b);


                if (
                    distancia >=
                    distanciaMinima
                ) {

                    continue;

                }


                if (distancia === 0) {

                    continue;

                }


                // =========================================
                // NORMAL
                // =========================================

                const nx =
                    dx /
                    distancia;

                const ny =
                    dy /
                    distancia;


                // =========================================
                // SEPARAR
                // =========================================

                const penetracion =
                    distanciaMinima -
                    distancia;


                if (
                    !a.siendoMovido &&
                    !b.siendoMovido
                ) {

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


                else if (
                    a.siendoMovido
                ) {

                    b.x +=
                        nx *
                        penetracion;

                    b.y +=
                        ny *
                        penetracion;

                }


                else if (
                    b.siendoMovido
                ) {

                    a.x -=
                        nx *
                        penetracion;

                    a.y -=
                        ny *
                        penetracion;

                }


                // =========================================
                // IMPULSO
                // =========================================

                const relativaX =
                    b.vx - a.vx;

                const relativaY =
                    b.vy - a.vy;


                const velocidadNormal =
                    relativaX * nx +
                    relativaY * ny;


                if (
                    velocidadNormal > 0
                ) {

                    continue;

                }


                const impulso =
                    -(1 + 0.75) *
                    velocidadNormal /
                    2;


                const impulsoX =
                    impulso * nx;

                const impulsoY =
                    impulso * ny;


                if (!a.siendoMovido) {

                    a.vx -=
                        impulsoX *
                        FUERZA_COLISION;

                    a.vy -=
                        impulsoY *
                        FUERZA_COLISION;

                }


                if (!b.siendoMovido) {

                    b.vx +=
                        impulsoX *
                        FUERZA_COLISION;

                    b.vy +=
                        impulsoY *
                        FUERZA_COLISION;

                }

            }

        }

    }


    // =====================================================
    // BUSCAR CÍRCULO
    // =====================================================

    function buscarCirculo(x, y) {

        for (
            let i = circulos.length - 1;
            i >= 0;
            i--
        ) {

            const circulo =
                circulos[i];


            const dx =
                x - circulo.x;

            const dy =
                y - circulo.y;


            const distancia =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            if (
                distancia <=
                circulo.radio
            ) {

                return circulo;

            }

        }


        return null;

    }


    // =====================================================
    // DIBUJAR
    // =====================================================

    function dibujarCirculo(circulo) {

        // =========================================
        // RESPIRACIÓN
        // =========================================

        circulo.faseRespiracion +=
            circulo.velocidadRespiracion;


        const respiracion =
            1 +
            Math.sin(
                circulo.faseRespiracion
            ) *
            circulo.intensidadRespiracion;


        const radioRespirando =
            circulo.radio *
            respiracion;


        ctx.save();


        ctx.translate(
            circulo.x,
            circulo.y
        );


        // =========================================
        // DEFORMACIÓN
        // =========================================

        ctx.rotate(
            circulo.anguloDeformacion
        );


        ctx.scale(
            circulo.escalaX,
            circulo.escalaY
        );


        // =========================================
        // CÍRCULO
        // =========================================

        ctx.beginPath();


        ctx.arc(
            0,
            0,
            radioRespirando,
            0,
            Math.PI * 2
        );


        // =========================================
        // RELLENO
        // =========================================

        ctx.fillStyle =
            circulo.color;

        ctx.fill();


        // =========================================
        // BORDE
        // =========================================

        ctx.strokeStyle =
            circulo.color;

        ctx.lineWidth =
            3;

        ctx.stroke();


        ctx.restore();

    }


    // =====================================================
    // UN DEDO — MOVER
    // =====================================================

    function iniciarMovimiento(
        circulo,
        pointerId,
        x,
        y
    ) {

        circulo.siendoMovido =
            true;

        circulo.punteroMovimiento =
            pointerId;


        dedos.set(
            pointerId,
            {

                circulo:
                    circulo,

                tipo:
                    "movimiento",

                x:
                    x,

                y:
                    y

            }
        );

    }


    // =====================================================
    // DOS DEDOS — INICIAR DEFORMACIÓN
    // =====================================================

    function iniciarDeformacion(
        circulo,
        dedoA,
        dedoB
    ) {

        circulo.siendoMovido =
            false;


        circulo.deformando =
            true;


        circulo.dedosDeformacion = [

            dedoA,
            dedoB

        ];


        deformacionActiva = {

            circulo:
                circulo,

            dedoA:
                dedoA,

            dedoB:
                dedoB

        };


        actualizarDeformacion();

    }


    // =====================================================
    // ACTUALIZAR DEFORMACIÓN
    // =====================================================

    function actualizarDeformacion() {

        if (!deformacionActiva) {

            return;

        }


        const datos =
            deformacionActiva;


        const circulo =
            datos.circulo;


        const dedoA =
            datos.dedoA;


        const dedoB =
            datos.dedoB;


        if (
            !dedoA ||
            !dedoB
        ) {

            return;

        }


        // =========================================
        // DISTANCIA ENTRE LOS DOS DEDOS
        // =========================================

        const dx =
            dedoB.x -
            dedoA.x;

        const dy =
            dedoB.y -
            dedoA.y;


        const distancia =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        // =========================================
        // ÁNGULO
        // =========================================

        const angulo =
            Math.atan2(
                dy,
                dx
            );


        // =========================================
        // ESCALA
        // =========================================

        // Distancia pequeña =
        // poca deformación.

        const distanciaBase =
            70;


        let factor =
            distancia /
            distanciaBase;


        // =========================================
        // MÁXIMO DE ESTIRAMIENTO
        // =========================================

        // Permite llegar prácticamente
        // al tamaño completo de la pantalla.

        const factorMaximo =
            Math.max(
                canvas.width,
                canvas.height
            ) /
            distanciaBase;


        factor =
            Math.max(
                0.55,
                Math.min(
                    factor,
                    factorMaximo
                )
            );


        // =========================================
        // DEFORMACIÓN
        // =========================================

        circulo.escalaX =
            factor;


        circulo.escalaY =
            1 /
            Math.sqrt(factor);


        circulo.anguloDeformacion =
            angulo;

    }


    // =====================================================
    // VOLVER A LA FORMA ORIGINAL
    // =====================================================

    function restaurarForma(circulo) {

        circulo.deformando =
            false;

        circulo.dedosDeformacion =
            [];


        const animacion =
            setInterval(() => {

                circulo.escalaX +=
                    (1 -
                        circulo.escalaX) *
                    0.18;


                circulo.escalaY +=
                    (1 -
                        circulo.escalaY) *
                    0.18;


                circulo.anguloDeformacion *=
                    0.82;


                if (

                    Math.abs(
                        circulo.escalaX - 1
                    ) < 0.01 &&

                    Math.abs(
                        circulo.escalaY - 1
                    ) < 0.01

                ) {

                    circulo.escalaX =
                        1;

                    circulo.escalaY =
                        1;

                    circulo.anguloDeformacion =
                        0;


                    clearInterval(
                        animacion
                    );

                }

            }, 16);

    }


    // =====================================================
    // OBTENER POSICIÓN DEL PUNTERO
    // =====================================================

    function obtenerPosicion(e) {

        const rect =
            canvas.getBoundingClientRect();


        return {

            x:
                (e.clientX -
                    rect.left) *
                (canvas.width /
                    rect.width),

            y:
                (e.clientY -
                    rect.top) *
                (canvas.height /
                    rect.height)

        };

    }


    // =====================================================
    // POINTER DOWN
    // =====================================================

    canvas.addEventListener(
        "pointerdown",
        function (e) {

            const posicion =
                obtenerPosicion(e);


            const x =
                posicion.x;

            const y =
                posicion.y;


            const circulo =
                buscarCirculo(
                    x,
                    y
                );


            if (!circulo) {

                return;

            }


            // =========================================
            // ¿YA HAY UN DEDO SOBRE ESTE CÍRCULO?
            // =========================================

            const dedosDelCirculo =
                Array.from(
                    dedos.entries()
                ).filter(
                    ([id, dato]) =>
                        dato.circulo ===
                        circulo
                );


            // =========================================
            // SEGUNDO DEDO
            // =========================================

            if (
                dedosDelCirculo.length === 1
            ) {

                const [
                    primerId,
                    primerDato
                ] =
                    dedosDelCirculo[0];


                // El primer dedo conserva
                // su posición REAL.

                primerDato.tipo =
                    "deformacion";


                const dedoA =
                    primerDato;


                const dedoB = {

                    circulo:
                        circulo,

                    tipo:
                        "deformacion",

                    x:
                        x,

                    y:
                        y

                };


                dedos.set(
                    e.pointerId,
                    dedoB
                );


                iniciarDeformacion(
                    circulo,
                    dedoA,
                    dedoB
                );


                actualizarDeformacion();


                canvas.setPointerCapture(
                    e.pointerId
                );


                e.preventDefault();

                return;

            }


            // =========================================
            // PRIMER DEDO
            // =========================================

            iniciarMovimiento(
                circulo,
                e.pointerId,
                x,
                y
            );


            canvas.setPointerCapture(
                e.pointerId
            );


            e.preventDefault();

        }
    );


    // =====================================================
    // POINTER MOVE
    // =====================================================

    canvas.addEventListener(
        "pointermove",
        function (e) {

            const dato =
                dedos.get(
                    e.pointerId
                );


            if (!dato) {

                return;

            }


            const posicion =
                obtenerPosicion(e);


            const x =
                posicion.x;

            const y =
                posicion.y;


            // =========================================
            // DEFORMACIÓN
            // =========================================

            if (
                dato.tipo ===
                "deformacion"
            ) {

                dato.x =
                    x;

                dato.y =
                    y;


                actualizarDeformacion();


                e.preventDefault();

                return;

            }


            // =========================================
            // MOVIMIENTO CON UN DEDO
            // =========================================

            if (
                dato.tipo ===
                "movimiento"
            ) {

                const circulo =
                    dato.circulo;


                // Si está deformándose,
                // no mover.

                if (
                    circulo.deformando
                ) {

                    return;

                }


                circulo.x =
                    x;

                circulo.y =
                    y;


                dato.x =
                    x;

                dato.y =
                    y;


                circulo.vx =
                    0;

                circulo.vy =
                    0;


                e.preventDefault();

            }

        }
    );


    // =====================================================
    // POINTER UP
    // =====================================================

    function terminarDedo(e) {

        const dato =
            dedos.get(
                e.pointerId
            );


        if (!dato) {

            return;

        }


        const circulo =
            dato.circulo;


        // =========================================
        // SI ESTABA DEFORMANDO
        // =========================================

        if (
            dato.tipo ===
            "deformacion"
        ) {

            dedos.delete(
                e.pointerId
            );


            // Al soltar cualquiera
            // de los dos dedos,
            // vuelve a su forma.

            if (
                circulo.deformando
            ) {

                restaurarForma(
                    circulo
                );

            }


            // El otro dedo también
            // deja de controlar.

            circulo.siendoMovido =
                false;


            circulo.punteroMovimiento =
                null;


            deformacionActiva =
                null;


            // Eliminar cualquier otro
            // dedo asociado al círculo.

            dedos.forEach(
                (datoOtro, id) => {

                    if (
                        datoOtro.circulo ===
                        circulo
                    ) {

                        dedos.delete(id);

                    }

                }
            );


            return;

        }


        // =========================================
        // MOVIMIENTO
        // =========================================

        circulo.siendoMovido =
            false;

        circulo.punteroMovimiento =
            null;


        dedos.delete(
            e.pointerId
        );

    }


    canvas.addEventListener(
        "pointerup",
        terminarDedo
    );


    canvas.addEventListener(
        "pointercancel",
        terminarDedo
    );


    // =====================================================
    // ANIMACIÓN
    // =====================================================

    function animar() {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        moverCirculos();

        detectarColisiones();


        circulos.forEach(
            circulo => {

                dibujarCirculo(
                    circulo
                );

            }
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