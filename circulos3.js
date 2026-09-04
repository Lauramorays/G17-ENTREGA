document.addEventListener("DOMContentLoaded", function () {

    const canvas =
        document.getElementById("canvas");

    const ctx =
        canvas.getContext("2d");

    const mensaje =
        document.getElementById("mensaje");


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

    const VELOCIDAD_MAXIMA = 0.8;

    const FUERZA_COLISION = 0.7;


    // Cantidad inicial de dedos

    let dedosNecesarios = 2;


    // Máximo de dedos que puede pedir el juego

    const MAXIMO_DEDOs = 5;


    // =====================================================
    // VARIABLES
    // =====================================================

    let circulos = [];

    const dedos = new Map();

    let colaboracionActiva = false;

    let colaboracionCompletada = false;


    // =====================================================
    // CANVAS RESPONSIVE
    // =====================================================

    function ajustarCanvas() {

        const anchoAnterior =
            canvas.width;

        const altoAnterior =
            canvas.height;


        canvas.width =
            canvas.clientWidth;

        canvas.height =
            canvas.clientHeight;


        if (circulos.length > 0) {

            circulos.forEach(
                circulo => {

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


                    controlarBordes(
                        circulo
                    );

                }
            );

        }

        else {

            crearCirculosIniciales();

        }

    }


    window.addEventListener(
        "resize",
        ajustarCanvas
    );


    // =====================================================
    // CREAR CÍRCULOS INICIALES
    // =====================================================

    function crearCirculosIniciales() {

        circulos = [];


        const posiciones = [

            [0.20, 0.30],
            [0.80, 0.30],
            [0.20, 0.70],
            [0.80, 0.70]

        ];


        const radioResponsive =
            Math.min(

                RADIO_BASE,

                Math.min(
                    canvas.width,
                    canvas.height
                ) * 0.10

            );


        for (
            let i = 0;
            i < 4;
            i++
        ) {

            crearCirculo(

                canvas.width *
                posiciones[i][0],

                canvas.height *
                posiciones[i][1],

                colores[i],

                radioResponsive

            );

        }

    }


    // =====================================================
    // CREAR CÍRCULO
    // =====================================================

    function crearCirculo(
        x,
        y,
        color,
        radio
    ) {

        circulos.push({

            // ---------------------------------------------
            // POSICIÓN
            // ---------------------------------------------

            x: x,

            y: y,


            // ---------------------------------------------
            // TAMAÑO
            // ---------------------------------------------

            radio: radio,

            radioOriginal: radio,


            // ---------------------------------------------
            // COLOR
            // ---------------------------------------------

            color: color,


            // ---------------------------------------------
            // MOVIMIENTO
            // ---------------------------------------------

            vx:
                (Math.random() - 0.5) *
                VELOCIDAD_MAXIMA,

            vy:
                (Math.random() - 0.5) *
                VELOCIDAD_MAXIMA,


            // ---------------------------------------------
            // MOVIMIENTO ORGÁNICO
            // ---------------------------------------------

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


            // ---------------------------------------------
            // RESPIRACIÓN
            // ---------------------------------------------

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


            // ---------------------------------------------
            // APARICIÓN
            // ---------------------------------------------

            aparicion: 0,

            nuevo: true

        });

    }


    // =====================================================
    // BORDES
    // =====================================================

    function controlarBordes(circulo) {

        const radio =
            circulo.radio;


        if (
            circulo.x - radio < 0
        ) {

            circulo.x =
                radio;

            circulo.vx =
                Math.abs(
                    circulo.vx
                );

        }


        if (
            circulo.x + radio >
            canvas.width
        ) {

            circulo.x =
                canvas.width - radio;

            circulo.vx =
                -Math.abs(
                    circulo.vx
                );

        }


        if (
            circulo.y - radio < 0
        ) {

            circulo.y =
                radio;

            circulo.vy =
                Math.abs(
                    circulo.vy
                );

        }


        if (
            circulo.y + radio >
            canvas.height
        ) {

            circulo.y =
                canvas.height - radio;

            circulo.vy =
                -Math.abs(
                    circulo.vy
                );

        }

    }


    // =====================================================
    // MOVIMIENTO
    // =====================================================

    function moverCirculos() {

        circulos.forEach(
            circulo => {

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
                    0.12;


                circulo.y +=
                    Math.cos(
                        circulo.faseY
                    ) *
                    0.12;


                controlarBordes(
                    circulo
                );


                // Aparición progresiva

                if (
                    circulo.nuevo
                ) {

                    circulo.aparicion +=
                        0.025;


                    if (
                        circulo.aparicion >= 1
                    ) {

                        circulo.aparicion =
                            1;

                        circulo.nuevo =
                            false;

                    }

                }

            }
        );

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
                    a.radio +
                    b.radio;


                if (
                    distancia >=
                    distanciaMinima
                ) {

                    continue;

                }


                if (
                    distancia === 0
                ) {

                    continue;

                }


                const nx =
                    dx /
                    distancia;

                const ny =
                    dy /
                    distancia;


                const penetracion =
                    distanciaMinima -
                    distancia;


                // Separación

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
                    -(1 + 0.75) *
                    velocidadNormal /
                    2;


                const impulsoX =
                    impulso *
                    nx;

                const impulsoY =
                    impulso *
                    ny;


                a.vx -=
                    impulsoX *
                    FUERZA_COLISION;

                a.vy -=
                    impulsoY *
                    FUERZA_COLISION;


                b.vx +=
                    impulsoX *
                    FUERZA_COLISION;

                b.vy +=
                    impulsoY *
                    FUERZA_COLISION;

            }

        }

    }


    // =====================================================
    // BUSCAR CÍRCULO
    // =====================================================

    function buscarCirculo(
        x,
        y
    ) {

        for (
            let i = circulos.length - 1;
            i >= 0;
            i--
        ) {

            const circulo =
                circulos[i];


            const dx =
                x -
                circulo.x;

            const dy =
                y -
                circulo.y;


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
    // OBTENER CÍRCULOS PRESIONADOS
    // =====================================================

    function obtenerCirculosPresionados() {

        const resultado = [];


        dedos.forEach(
            dato => {

                if (
                    !resultado.includes(
                        dato.circulo
                    )
                ) {

                    resultado.push(
                        dato.circulo
                    );

                }

            }
        );


        return resultado;

    }


    // =====================================================
    // COMPROBAR COLABORACIÓN
    // =====================================================

    function comprobarColaboracion() {

        const circulosPresionados =
            obtenerCirculosPresionados();


        // Todavía no hay suficientes dedos

        if (
            circulosPresionados.length <
            dedosNecesarios
        ) {

            colaboracionActiva =
                false;

            colaboracionCompletada =
                false;

            return;

        }


        // Ya tenemos la cantidad necesaria

        if (
            circulosPresionados.length ===
            dedosNecesarios
        ) {

            if (
                !colaboracionActiva
            ) {

                colaboracionActiva =
                    true;

                colaboracionCompletada =
                    false;

            }


            if (
                !colaboracionCompletada
            ) {

                completarColaboracion(
                    circulosPresionados
                );

            }

        }

    }


    // =====================================================
    // COMPLETAR COLABORACIÓN
    // =====================================================

    function completarColaboracion(
        circulosPresionados
    ) {

        colaboracionCompletada =
            true;


        // ---------------------------------------------
        // Crear conexiones entre todos los círculos
        // presionados
        // ---------------------------------------------

        // Las conexiones NO se guardan.
        // Se dibujan mientras los dedos estén activos.


        mensaje.textContent =
            "COLABORACIÓN " +
            dedosNecesarios +
            " / " +
            dedosNecesarios;


        // ---------------------------------------------
        // Aparece un nuevo círculo
        // ---------------------------------------------

        setTimeout(
            function () {

                crearNuevoCirculo();


                // Aumentar la dificultad

                if (
                    dedosNecesarios <
                    MAXIMO_DEDOs
                ) {

                    dedosNecesarios++;

                }


                colaboracionActiva =
                    false;

                colaboracionCompletada =
                    false;


                mensaje.textContent =
                    dedosNecesarios +
                    " DEDOS · CONECTÁ";

            },
            700
        );

    }


    // =====================================================
    // CREAR NUEVO CÍRCULO
    // =====================================================

    function crearNuevoCirculo() {

        const radio =
            Math.min(

                RADIO_BASE,

                Math.min(
                    canvas.width,
                    canvas.height
                ) * 0.10

            );


        let x;

        let y;

        let intentos =
            0;


        do {

            x =
                radio +
                Math.random() *
                (
                    canvas.width -
                    radio * 2
                );


            y =
                radio +
                Math.random() *
                (
                    canvas.height -
                    radio * 2
                );


            intentos++;

        }
        while (
            posicionCercaDeOtro(
                x,
                y,
                radio
            )
            &&
            intentos < 50
        );


        const color =
            colores[
                circulos.length %
                colores.length
            ];


        crearCirculo(

            x,

            y,

            color,

            radio

        );


        mensaje.textContent =
            "NUEVA PRESENCIA";

    }


    // =====================================================
    // REVISAR POSICIÓN
    // =====================================================

    function posicionCercaDeOtro(
        x,
        y,
        radio
    ) {

        return circulos.some(
            circulo => {

                const dx =
                    circulo.x -
                    x;

                const dy =
                    circulo.y -
                    y;


                const distancia =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );


                return (
                    distancia <
                    radio +
                    circulo.radio +
                    30
                );

            }
        );

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


            // -----------------------------------------
            // Guardar dedo
            // -----------------------------------------

            dedos.set(
                e.pointerId,
                {

                    circulo:
                        circulo,

                    x:
                        posicion.x,

                    y:
                        posicion.y

                }
            );


            canvas.setPointerCapture(
                e.pointerId
            );


            comprobarColaboracion();


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


            dato.x =
                posicion.x;

            dato.y =
                posicion.y;


            // Si el dedo se mueve demasiado
            // fuera del círculo original,
            // deja de contar como presión.

            const dx =
                posicion.x -
                dato.circulo.x;

            const dy =
                posicion.y -
                dato.circulo.y;


            const distancia =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            if (
                distancia >
                dato.circulo.radio * 1.5
            ) {

                dedos.delete(
                    e.pointerId
                );


                colaboracionActiva =
                    false;

                colaboracionCompletada =
                    false;

            }


            e.preventDefault();

        }
    );


    // =====================================================
    // POINTER UP
    // =====================================================

    function terminarDedo(e) {

        if (
            !dedos.has(
                e.pointerId
            )
        ) {

            return;

        }


        dedos.delete(
            e.pointerId
        );


        // Al soltar cualquier dedo
        // desaparece la colaboración.

        colaboracionActiva =
            false;

        colaboracionCompletada =
            false;

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
    // DIBUJAR CONEXIONES
    // =====================================================

    function dibujarConexiones() {

        const circulosPresionados =
            obtenerCirculosPresionados();


        // Solo dibujar si tenemos exactamente
        // la cantidad de dedos necesaria.

        if (
            circulosPresionados.length !==
            dedosNecesarios
        ) {

            return;

        }


        // -------------------------------------------------
        // Conectar cada círculo con el siguiente
        // -------------------------------------------------

        for (
            let i = 0;
            i <
            circulosPresionados.length - 1;
            i++
        ) {

            const a =
                circulosPresionados[i];

            const b =
                circulosPresionados[i + 1];


            dibujarConexion(
                a,
                b
            );

        }

    }


    // =====================================================
    // DIBUJAR UNA CONEXIÓN
    // =====================================================

    function dibujarConexion(
        a,
        b
    ) {

        const dx =
            b.x - a.x;

        const dy =
            b.y - a.y;


        const distancia =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        const cantidad =
            Math.max(
                4,
                Math.floor(
                    distancia / 14
                )
            );


        // Pequeños círculos

        for (
            let i = 1;
            i < cantidad;
            i++
        ) {

            const porcentaje =
                i /
                cantidad;


            const x =
                a.x +
                dx *
                porcentaje;


            const y =
                a.y +
                dy *
                porcentaje;


            // Opacidad baja

            const opacidad =
                0.12 +
                0.16 *
                (
                    1 -
                    porcentaje
                );


            ctx.save();


            ctx.globalAlpha =
                opacidad;


            ctx.beginPath();


            ctx.arc(

                x,

                y,

                2.5,

                0,

                Math.PI * 2

            );


            ctx.fillStyle =
                "#D9D9D9";


            ctx.fill();


            ctx.restore();

        }

    }


    // =====================================================
    // DIBUJAR CÍRCULO
    // =====================================================

    function dibujarCirculo(
        circulo
    ) {

        // -----------------------------------------
        // RESPIRACIÓN
        // -----------------------------------------

        circulo.faseRespiracion +=
            circulo.velocidadRespiracion;


        const respiracion =
            1 +
            Math.sin(
                circulo.faseRespiracion
            ) *
            circulo.intensidadRespiracion;


        const radio =
            circulo.radio *
            respiracion;


        // -----------------------------------------
        // APARICIÓN
        // -----------------------------------------

        let escala =
            1;

        let opacidad =
            1;


        if (
            circulo.nuevo
        ) {

            escala =
                circulo.aparicion;

            opacidad =
                circulo.aparicion;

        }


        // -----------------------------------------
        // DIBUJAR
        // -----------------------------------------

        ctx.save();


        ctx.globalAlpha =
            opacidad;


        ctx.beginPath();


        ctx.arc(

            circulo.x,

            circulo.y,

            radio *
            escala,

            0,

            Math.PI * 2

        );


        ctx.fillStyle =
            circulo.color;


        ctx.fill();


        ctx.restore();

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

        dibujarConexiones();


        circulos.forEach(
            circulo => {

                dibujarCirculo(
                    circulo
                );

            }
        );


        // Mientras haya suficientes círculos,
        // revisar continuamente la colaboración.

        if (
            dedos.size >=
            dedosNecesarios
        ) {

            comprobarColaboracion();

        }


        requestAnimationFrame(
            animar
        );

    }


    // =====================================================
    // INICIO
    // =====================================================

    ajustarCanvas();

    mensaje.textContent =
        "2 DEDOS · CONECTÁ";

    animar();

});