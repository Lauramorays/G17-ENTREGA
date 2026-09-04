document.addEventListener("DOMContentLoaded", function () {

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const mensaje = document.getElementById("mensaje");


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

    const RADIO_BASE = 55;

    // Movimiento normal
    const VELOCIDAD_NORMAL = 0.8;

    // Movimiento alterado
    const VELOCIDAD_ALTERADA = 1.8;

    // Movimiento cuando está calmado
    const VELOCIDAD_CALMA = 0.05;

    // Tiempo que permanece calmado después de soltar
    const TIEMPO_CALMA = 4000;


    // =====================================================
    // VARIABLES
    // =====================================================

    let circulos = [];

    // Guarda los dedos que están tocando
    const dedos = new Map();


    // =====================================================
    // CANVAS RESPONSIVE
    // =====================================================

    function ajustarCanvas() {

        const anchoAnterior = canvas.width;
        const altoAnterior = canvas.height;

        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;


        if (circulos.length > 0) {

            circulos.forEach(circulo => {

                if (anchoAnterior > 0) {

                    circulo.x =
                        circulo.x *
                        canvas.width /
                        anchoAnterior;

                }

                if (altoAnterior > 0) {

                    circulo.y =
                        circulo.y *
                        canvas.height /
                        altoAnterior;

                }

                controlarBordes(circulo);

            });

        } else {

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


        const radioResponsive =
            Math.min(
                RADIO_BASE,
                Math.min(
                    canvas.width,
                    canvas.height
                ) * 0.10
            );


        for (let i = 0; i < 4; i++) {

            // Dirección aleatoria
            const angulo =
                Math.random() *
                Math.PI *
                2;


            circulos.push({

                // =====================================
                // POSICIÓN
                // =====================================

                x:
                    canvas.width *
                    posiciones[i][0],

                y:
                    canvas.height *
                    posiciones[i][1],


                // =====================================
                // TAMAÑO
                // =====================================

                radio:
                    radioResponsive,

                radioOriginal:
                    radioResponsive,


                // =====================================
                // COLOR
                // =====================================

                color:
                    colores[i],


                // =====================================
                // MOVIMIENTO
                // =====================================

                vx:
                    Math.cos(angulo) *
                    VELOCIDAD_ALTERADA *
                    (0.6 + Math.random() * 0.4),

                vy:
                    Math.sin(angulo) *
                    VELOCIDAD_ALTERADA *
                    (0.6 + Math.random() * 0.4),


                // =====================================
                // MOVIMIENTO ORGÁNICO
                // =====================================

                faseX:
                    Math.random() *
                    Math.PI *
                    2,

                faseY:
                    Math.random() *
                    Math.PI *
                    2,

                velocidadOrganica:
                    0.015 +
                    Math.random() *
                    0.025,


                // =====================================
                // RESPIRACIÓN
                // =====================================

                faseRespiracion:
                    Math.random() *
                    Math.PI *
                    2,

                velocidadRespiracion:
                    0.025 +
                    Math.random() *
                    0.025,

                intensidadRespiracion:
                    0.05 +
                    Math.random() *
                    0.05,


                // =====================================
                // ALTERACIÓN
                // =====================================

                alterado: true,

                intensidadAlteracion:
                    0.6 +
                    Math.random() *
                    0.4,


                // =====================================
                // TITILEO
                // =====================================

                faseTitileo:
                    Math.random() *
                    Math.PI *
                    2,

                velocidadTitileo:
                    0.05 +
                    Math.random() *
                    0.08,

                intensidadTitileo:
                    0.35 +
                    Math.random() *
                    0.4,


                // =====================================
                // CALMA
                // =====================================

                calmado: false,

                tiempoCalmaInicio: 0,

                dedosSobre: []

            });

        }

    }


    // =====================================================
    // BORDES
    // =====================================================

    function controlarBordes(circulo) {

        const radio = circulo.radio;


        if (circulo.x - radio < 0) {

            circulo.x = radio;
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

            circulo.y = radio;

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
    // MOVIMIENTO
    // =====================================================

    function moverCirculos() {

        circulos.forEach(circulo => {

            // =====================================
            // SI ESTÁ CALMADO
            // =====================================

            if (circulo.calmado) {

                // Se mueve apenas
                circulo.x +=
                    circulo.vx;

                circulo.y +=
                    circulo.vy;


                // Reduce progresivamente su velocidad

                circulo.vx *= 0.98;
                circulo.vy *= 0.98;

            }


            // =====================================
            // SI ESTÁ ALTERADO
            // =====================================

            else {

                circulo.x +=
                    circulo.vx;

                circulo.y +=
                    circulo.vy;


                // Movimiento orgánico

                circulo.faseX +=
                    circulo.velocidadOrganica;

                circulo.faseY +=
                    circulo.velocidadOrganica *
                    0.8;


                circulo.x +=
                    Math.sin(
                        circulo.faseX
                    ) *
                    0.3;

                circulo.y +=
                    Math.cos(
                        circulo.faseY
                    ) *
                    0.3;


                // Pequeños cambios de dirección
                // para que parezcan inquietos

                circulo.vx +=
                    (Math.random() - 0.5) *
                    0.035 *
                    circulo.intensidadAlteracion;

                circulo.vy +=
                    (Math.random() - 0.5) *
                    0.035 *
                    circulo.intensidadAlteracion;


                // Limitar velocidad

                const velocidad =
                    Math.sqrt(
                        circulo.vx *
                        circulo.vx +

                        circulo.vy *
                        circulo.vy
                    );


                if (
                    velocidad >
                    VELOCIDAD_ALTERADA
                ) {

                    circulo.vx =
                        circulo.vx /
                        velocidad *
                        VELOCIDAD_ALTERADA;

                    circulo.vy =
                        circulo.vy /
                        velocidad *
                        VELOCIDAD_ALTERADA;

                }

            }


            controlarBordes(circulo);

        });

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

                const a = circulos[i];
                const b = circulos[j];


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
                    distancia >=
                    distanciaMinima
                ) {

                    continue;

                }


                if (distancia === 0) {

                    continue;

                }


                const nx =
                    dx / distancia;

                const ny =
                    dy / distancia;


                const penetracion =
                    distanciaMinima -
                    distancia;


                // Separar

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


                // Rebote

                const relativaX =
                    b.vx -
                    a.vx;

                const relativaY =
                    b.vy -
                    a.vy;


                const velocidadNormal =
                    relativaX *
                    nx +
                    relativaY *
                    ny;


                if (
                    velocidadNormal > 0
                ) {

                    continue;

                }


                const impulso =
                    -(1 + 0.8) *
                    velocidadNormal /
                    2;


                const impulsoX =
                    impulso * nx;

                const impulsoY =
                    impulso * ny;


                a.vx -=
                    impulsoX;

                a.vy -=
                    impulsoY;


                b.vx +=
                    impulsoX;

                b.vy +=
                    impulsoY;

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
    // POSICIÓN DEL PUNTERO
    // =====================================================

    function obtenerPosicion(e) {

        const rect =
            canvas.getBoundingClientRect();


        return {

            x:
                (e.clientX -
                    rect.left) *
                (
                    canvas.width /
                    rect.width
                ),

            y:
                (e.clientY -
                    rect.top) *
                (
                    canvas.height /
                    rect.height
                )

        };

    }


    // =====================================================
    // INICIAR CONTACTO
    // =====================================================

    function iniciarContacto(
        circulo,
        pointerId
    ) {

        // Evitar repetir el mismo dedo

        if (
            circulo.dedosSobre
                .includes(pointerId)
        ) {

            return;

        }


        circulo.dedosSobre.push(
            pointerId
        );


        dedos.set(
            pointerId,
            circulo
        );


        // =====================================
        // SI HAY DOS DEDOS
        // =====================================

        if (
            circulo.dedosSobre.length >= 2
        ) {

            calmarCirculo(circulo);

        }

    }


    // =====================================================
    // CALMAR CÍRCULO
    // =====================================================

    function calmarCirculo(circulo) {

        circulo.calmado = true;


        // Frenar inmediatamente

        circulo.vx = 0;
        circulo.vy = 0;


        mensaje.textContent =
            "TE DETUVISTE A ESCUCHAR";


        setTimeout(
            function () {

                mensaje.textContent =
                    "DOS DEDOS · MANTENÉ LA ATENCIÓN";

            },
            1500
        );

    }


    // =====================================================
    // SOLTAR CÍRCULO
    // =====================================================

    function soltarCirculo(circulo) {

        circulo.dedosSobre = [];


        // Si estaba calmado,
        // empieza el período de calma

        if (circulo.calmado) {

            circulo.tiempoCalmaInicio =
                performance.now();

        }

    }


    // =====================================================
    // ACTUALIZAR CALMA
    // =====================================================

    function actualizarCalma() {

        const ahora =
            performance.now();


        circulos.forEach(circulo => {

            if (!circulo.calmado) {

                return;

            }


            // Mientras hay dedos,
            // permanece completamente calmado

            if (
                circulo.dedosSobre.length >= 2
            ) {

                circulo.vx = 0;
                circulo.vy = 0;

                return;

            }


            // =====================================
            // TIEMPO DESDE QUE SE SOLTÓ
            // =====================================

            const tiempo =
                ahora -
                circulo.tiempoCalmaInicio;


            // Todavía está calmado

            if (
                tiempo <
                TIEMPO_CALMA
            ) {

                circulo.vx *= 0.98;
                circulo.vy *= 0.98;

                return;

            }


            // =====================================
            // VUELVE A ALTERARSE
            // =====================================

            circulo.calmado =
                false;


            const angulo =
                Math.random() *
                Math.PI *
                2;


            const velocidad =
                1.2 +
                Math.random() *
                0.8;


            circulo.vx =
                Math.cos(angulo) *
                velocidad;

            circulo.vy =
                Math.sin(angulo) *
                velocidad;


            circulo.intensidadAlteracion =
                0.6 +
                Math.random() *
                0.4;

        });

    }


    // =====================================================
    // POINTER DOWN
    // =====================================================

    canvas.addEventListener(
        "pointerdown",
        function (e) {

            const posicion =
                obtenerPosicion(e);


            const circulo =
                buscarCirculo(
                    posicion.x,
                    posicion.y
                );


            if (!circulo) {

                return;

            }


            iniciarContacto(
                circulo,
                e.pointerId
            );


            canvas.setPointerCapture(
                e.pointerId
            );


            e.preventDefault();

        }
    );


    // =====================================================
    // POINTER UP
    // =====================================================

    function terminarDedo(e) {

        const circulo =
            dedos.get(
                e.pointerId
            );


        if (!circulo) {

            return;

        }


        dedos.delete(
            e.pointerId
        );


        const indice =
            circulo.dedosSobre.indexOf(
                e.pointerId
            );


        if (
            indice !== -1
        ) {

            circulo.dedosSobre.splice(
                indice,
                1
            );

        }


        // Cuando ya no hay dedos,
        // comienza la calma posterior

        if (
            circulo.dedosSobre.length === 0
        ) {

            soltarCirculo(
                circulo
            );

        }

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
    // DIBUJAR CÍRCULO
    // =====================================================

    function dibujarCirculo(circulo) {

        // =====================================
        // RESPIRACIÓN
        // =====================================

        circulo.faseRespiracion +=
            circulo.velocidadRespiracion;


        let intensidad =
            circulo.intensidadRespiracion;


        // Cuando está calmado,
        // respira mucho más suavemente

        if (circulo.calmado) {

            intensidad *= 0.35;

        }


        const respiracion =
            1 +
            Math.sin(
                circulo.faseRespiracion
            ) *
            intensidad;


        const radio =
            circulo.radio *
            respiracion;


        // =====================================
        // TITILEO
        // =====================================

        let opacidad = 1;


        if (!circulo.calmado) {

            const titileo =
                (
                    Math.sin(
                        performance.now() *
                        circulo.velocidadTitileo +
                        circulo.faseTitileo
                    ) +
                    1
                ) /
                2;


            opacidad =
                1 -
                titileo *
                circulo.intensidadTitileo;

        }


        // =====================================
        // CÍRCULO
        // =====================================

        ctx.save();


        ctx.globalAlpha =
            opacidad;


        ctx.beginPath();


        ctx.arc(
            circulo.x,
            circulo.y,
            radio,
            0,
            Math.PI * 2
        );


        ctx.fillStyle =
            circulo.color;


        ctx.fill();


        ctx.restore();


        // =====================================
        // AURA DE CALMA
        // =====================================

        if (circulo.calmado) {

            ctx.save();


            ctx.globalAlpha = 0.18;


            ctx.beginPath();


            ctx.arc(
                circulo.x,
                circulo.y,
                radio + 12,
                0,
                Math.PI * 2
            );


            ctx.strokeStyle =
                "#D9D9D9";


            ctx.lineWidth = 2;


            ctx.stroke();


            ctx.restore();

        }

    }


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

        actualizarCalma();


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
    // INICIO
    // =====================================================

    ajustarCanvas();

    animar();

});