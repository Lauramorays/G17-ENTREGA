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

    const TAMAÑO_PADRE = 110;
    const MAX_HIJOS = 3;

    // Cuánto se achica el padre al tener hijos
    const REDUCCION_PADRE = 0.82;

    // Distancia necesaria para generar hijos
    const ESTIRAMIENTO_NECESARIO = 1.45;

    // Fuerza de separación entre cuerpos
    const FUERZA_COLISION = 0.8;

    let figuras = [];
    let figuraEstirada = null;
    let punteroActivo = null;


    // =====================================================
    // CANVAS
    // =====================================================

    function ajustarCanvas() {

        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        if (figuras.length === 0) {
            crearPadres();
        }
    }

    window.addEventListener("resize", ajustarCanvas);


    // =====================================================
    // CREAR PADRES
    // =====================================================

    function crearPadres() {

        figuras = [];

        const posiciones = [
            [0.25, 0.30],
            [0.75, 0.30],
            [0.25, 0.70],
            [0.75, 0.70]
        ];

        for (let i = 0; i < 4; i++) {

            const figura = {
                x: canvas.width * posiciones[i][0],
                y: canvas.height * posiciones[i][1],

                tamaño: TAMAÑO_PADRE,

                color: colores[i],

                opacidad: 1,

                grosor: 5,

                // -------------------------
                // MOVIMIENTO
                // -------------------------

                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,

                faseMovimientoX: Math.random() * Math.PI * 2,
                faseMovimientoY: Math.random() * Math.PI * 2,

                velocidadMovimiento:
                    0.004 + Math.random() * 0.004,

                // -------------------------
                // RESPIRACIÓN
                // -------------------------

                faseRespiracion:
                    Math.random() * Math.PI * 2,

                velocidadRespiracion:
                    0.012 + Math.random() * 0.006,

                intensidadRespiracion:
                    0.045 + Math.random() * 0.025,

                // -------------------------
                // ESTIRAMIENTO
                // -------------------------

                estirando: false,

                puntero: null,

                escalaX: 1,
                escalaY: 1,

                // -------------------------
                // HERENCIA
                // -------------------------

                generacion: 0,

                padre: null,

                hijos: [],

                // -------------------------
                // CONTROL
                // -------------------------

                puedeReproducirse: true,

                creandoHijos: false
            };

            figuras.push(figura);
        }
    }


    // =====================================================
    // RADIO FÍSICO
    // =====================================================

    function radioFigura(figura) {

        return figura.tamaño * 0.5;
    }


    // =====================================================
    // MOVIMIENTO ORGÁNICO
    // =====================================================

    function moverFiguras() {

        figuras.forEach(figura => {

            if (figura.estirando) {
                return;
            }

            // Movimiento principal
            figura.x += figura.vx;
            figura.y += figura.vy;


            // Pequeñas variaciones orgánicas
            figura.faseMovimientoX +=
                figura.velocidadMovimiento;

            figura.faseMovimientoY +=
                figura.velocidadMovimiento * 0.8;


            figura.x +=
                Math.sin(figura.faseMovimientoX) * 0.10;

            figura.y +=
                Math.cos(figura.faseMovimientoY) * 0.10;


            // =================================================
            // BORDES
            // =================================================

            const radio = radioFigura(figura);

            if (figura.x - radio < 0) {

                figura.x = radio;

                figura.vx = Math.abs(figura.vx);
            }

            if (figura.x + radio > canvas.width) {

                figura.x = canvas.width - radio;

                figura.vx = -Math.abs(figura.vx);
            }

            if (figura.y - radio < 0) {

                figura.y = radio;

                figura.vy = Math.abs(figura.vy);
            }

            if (figura.y + radio > canvas.height) {

                figura.y = canvas.height - radio;

                figura.vy = -Math.abs(figura.vy);
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

                const dx = b.x - a.x;
                const dy = b.y - a.y;

                const distancia =
                    Math.sqrt(dx * dx + dy * dy);

                const radioA = radioFigura(a);
                const radioB = radioFigura(b);

                const distanciaMinima =
                    radioA + radioB;


                // No están tocándose
                if (distancia >= distanciaMinima) {
                    continue;
                }


                // Evitar división por cero
                let nx = 1;
                let ny = 0;

                if (distancia > 0) {

                    nx = dx / distancia;
                    ny = dy / distancia;
                }


                // Cuánto se están metiendo
                const penetracion =
                    distanciaMinima - distancia;


                // =================================================
                // SEPARACIÓN FÍSICA
                // =================================================

                if (!a.estirando && !b.estirando) {

                    a.x -= nx * penetracion * 0.5;
                    a.y -= ny * penetracion * 0.5;

                    b.x += nx * penetracion * 0.5;
                    b.y += ny * penetracion * 0.5;
                }

                else if (a.estirando) {

                    b.x += nx * penetracion;
                    b.y += ny * penetracion;
                }

                else if (b.estirando) {

                    a.x -= nx * penetracion;
                    a.y -= ny * penetracion;
                }


                // =================================================
                // REBOTE SUAVE
                // =================================================

                if (!a.estirando) {

                    a.vx -= nx * FUERZA_COLISION;
                    a.vy -= ny * FUERZA_COLISION;
                }

                if (!b.estirando) {

                    b.vx += nx * FUERZA_COLISION;
                    b.vy += ny * FUERZA_COLISION;
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

            const dx = x - figura.x;
            const dy = y - figura.y;

            const distancia =
                Math.sqrt(dx * dx + dy * dy);

            if (distancia <= radioFigura(figura)) {
                return figura;
            }
        }

        return null;
    }


    // =====================================================
    // CREAR HIJOS
    // =====================================================

    function crearHijos(padre) {

        if (!padre.puedeReproducirse) {
            return;
        }

        if (padre.hijos.length >= MAX_HIJOS) {
            return;
        }

        padre.puedeReproducirse = false;
        padre.creandoHijos = true;


        // =================================================
        // EL PADRE SE ACHICA
        // =================================================

        padre.tamaño *= REDUCCION_PADRE;


        // =================================================
        // CANTIDAD DE HIJOS
        // =================================================

        const cantidad =
            MAX_HIJOS - padre.hijos.length;


        for (let i = 0; i < cantidad; i++) {

            const angulo =
                (Math.PI * 2 / cantidad) * i;

            const distancia =
                padre.tamaño * 0.85;


            // Pequeña diferencia entre hermanos
            const variacion =
                0.90 + Math.random() * 0.15;


            const tamañoHijo =
                padre.tamaño *
                0.50 *
                variacion;


            const hijo = {

                // -------------------------
                // POSICIÓN
                // -------------------------

                x:
                    padre.x +
                    Math.cos(angulo) * distancia,

                y:
                    padre.y +
                    Math.sin(angulo) * distancia,


                // -------------------------
                // CARACTERÍSTICAS HEREDADAS
                // -------------------------

                tamaño: tamañoHijo,

                color: padre.color,

                opacidad:
                    padre.opacidad *
                    (0.78 + Math.random() * 0.12),

                grosor:
                    padre.grosor *
                    (0.85 + Math.random() * 0.10),


                // -------------------------
                // MOVIMIENTO
                // -------------------------

                vx:
                    padre.vx +
                    (Math.random() - 0.5) * 0.45,

                vy:
                    padre.vy +
                    (Math.random() - 0.5) * 0.45,


                faseMovimientoX:
                    Math.random() * Math.PI * 2,

                faseMovimientoY:
                    Math.random() * Math.PI * 2,

                velocidadMovimiento:
                    0.004 +
                    Math.random() * 0.006,


                // -------------------------
                // RESPIRACIÓN
                // -------------------------

                faseRespiracion:
                    Math.random() * Math.PI * 2,

                velocidadRespiracion:
                    0.012 +
                    Math.random() * 0.008,

                intensidadRespiracion:
                    0.04 +
                    Math.random() * 0.025,


                // -------------------------
                // ESTIRAMIENTO
                // -------------------------

                estirando: false,

                puntero: null,

                escalaX: 1,
                escalaY: 1,


                // -------------------------
                // GENERACIÓN
                // -------------------------

                generacion:
                    padre.generacion + 1,

                padre: padre,

                hijos: [],

                puedeReproducirse: true,

                creandoHijos: false
            };


            padre.hijos.push(hijo);

            figuras.push(hijo);
        }


        padre.creandoHijos = false;
    }


    // =====================================================
    // ESTIRAMIENTO
    // =====================================================

    function actualizarEstiramiento(x, y) {

        if (!figuraEstirada) {
            return;
        }

        const figura = figuraEstirada;

        const dx =
            x - figura.x;

        const dy =
            y - figura.y;

        const distancia =
            Math.sqrt(dx * dx + dy * dy);


        // =================================================
        // FACTOR DE ESTIRAMIENTO
        // =================================================

        const factor =
            Math.min(
                distancia / figura.tamaño,
                2
            );


        // Dirección
        const angulo =
            Math.atan2(dy, dx);


        /*
            El cuadrado se estira hacia
            donde llevamos el dedo.
        */

        figura.escalaX =
            1 + factor * 0.65;

        figura.escalaY =
            Math.max(
                0.60,
                1 - factor * 0.20
            );


        // =================================================
        // GENERAR HIJOS
        // =================================================

        if (
            factor >= ESTIRAMIENTO_NECESARIO &&
            figura.puedeReproducirse
        ) {

            crearHijos(figura);
        }
    }


    // =====================================================
    // POINTER DOWN
    // =====================================================

    canvas.addEventListener("pointerdown", function (e) {

        const rect =
            canvas.getBoundingClientRect();

        const x =
            e.clientX - rect.left;

        const y =
            e.clientY - rect.top;


        const figura =
            buscarFigura(x, y);


        if (!figura) {
            return;
        }


        figuraEstirada = figura;

        punteroActivo = e.pointerId;

        figura.estirando = true;

        figura.puntero = e.pointerId;

        canvas.setPointerCapture(e.pointerId);

        e.preventDefault();
    });


    // =====================================================
    // POINTER MOVE
    // =====================================================

    canvas.addEventListener("pointermove", function (e) {

        if (
            figuraEstirada === null ||
            punteroActivo !== e.pointerId
        ) {
            return;
        }


        const rect =
            canvas.getBoundingClientRect();

        const x =
            e.clientX - rect.left;

        const y =
            e.clientY - rect.top;


        actualizarEstiramiento(x, y);

        e.preventDefault();
    });


    // =====================================================
    // POINTER UP
    // =====================================================

    function terminarEstiramiento(e) {

        if (
            figuraEstirada === null ||
            punteroActivo !== e.pointerId
        ) {
            return;
        }


        figuraEstirada.estirando = false;

        figuraEstirada.puntero = null;

        figuraEstirada.escalaX = 1;

        figuraEstirada.escalaY = 1;


        figuraEstirada = null;

        punteroActivo = null;
    }


    canvas.addEventListener(
        "pointerup",
        terminarEstiramiento
    );

    canvas.addEventListener(
        "pointercancel",
        terminarEstiramiento
    );


    // =====================================================
    // DIBUJAR FIGURA
    // =====================================================

    function dibujarFigura(figura) {

        // Respiración
        figura.faseRespiracion +=
            figura.velocidadRespiracion;


        const respiracion =
            1 +
            Math.sin(figura.faseRespiracion) *
            figura.intensidadRespiracion;


        const tamaño =
            figura.tamaño * respiracion;


        ctx.save();

        ctx.translate(
            figura.x,
            figura.y
        );


        // =================================================
        // ESTIRAMIENTO
        // =================================================

        ctx.scale(
            figura.escalaX,
            figura.escalaY
        );


        // =================================================
        // OPACIDAD
        // =================================================

        ctx.globalAlpha =
            figura.opacidad;


        // =================================================
        // CUADRADO
        // =================================================

        ctx.fillStyle =
            figura.color;


        ctx.fillRect(
            -tamaño / 2,
            -tamaño / 2,
            tamaño,
            tamaño
        );


        // =================================================
        // BORDE
        // =================================================

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
    // ANIMACIÓN
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


        // 3. Dibujar
        figuras.forEach(figura => {

            dibujarFigura(figura);

        });


        requestAnimationFrame(animar);
    }


    // =====================================================
    // INICIAR
    // =====================================================

    ajustarCanvas();

    animar();

});