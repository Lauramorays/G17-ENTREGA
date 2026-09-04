document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // OBTENER EL CANVAS
    // =====================================================

    // Buscamos el canvas que está en cuadrados2.html
    const canvas = document.getElementById("canvas");

    // Obtenemos el contexto 2D para poder dibujar las figuras
    const ctx = canvas.getContext("2d");


    // =====================================================
    // COLORES DEL SISTEMA
    // =====================================================

    // Estos son los mismos colores utilizados
    // en el resto de las experiencias
    const colores = [
        "#D9D9D9",
        "#8BB2D3",
        "#202D64",
        "#2B538E"
    ];


    // =====================================================
    // CONFIGURACIÓN GENERAL
    // =====================================================

    // Tamaño de los 4 cuadrados iniciales
    const TAMAÑO_INICIAL = 110;

    // Cantidad máxima de generaciones
    // 0 = padres
    // 1 = hijos
    // 2 = nietos
    // 3 = tercera generación
    const MAX_GENERACIONES = 3;

    // Distancia entre los dos dedos necesaria
    // para que ocurra la separación
    const DISTANCIA_SEPARACION = 180;

    // Fuerza utilizada cuando dos cuadrados chocan
    const FUERZA_COLISION = 0.45;


    // =====================================================
    // VARIABLES DEL SISTEMA
    // =====================================================

    // Array donde guardamos todos los cuadrados
    let figuras = [];

    // Guarda los dos dedos que están tocando la pantalla
    let dedos = new Map();

    // Guarda el cuadrado que estamos estirando
    let figuraEstirada = null;


    // =====================================================
    // AJUSTAR EL CANVAS
    // =====================================================

    function ajustarCanvas() {

        // El canvas toma exactamente el tamaño
        // visual que tiene en pantalla
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;


        // Si todavía no existen figuras,
        // creamos los 4 cuadrados iniciales
        if (figuras.length === 0) {

            crearFigurasIniciales();
        }
    }


    // Si cambia el tamaño de la ventana,
    // volvemos a ajustar el canvas
    window.addEventListener(
        "resize",
        ajustarCanvas
    );


    // =====================================================
    // CREAR LOS 4 CUADRADOS INICIALES
    // =====================================================

    function crearFigurasIniciales() {

        // Vaciamos el sistema
        figuras = [];


        // Posiciones iniciales de los 4 cuadrados
        // expresadas como porcentaje del canvas
        const posiciones = [

            [0.25, 0.30],

            [0.75, 0.30],

            [0.25, 0.70],

            [0.75, 0.70]
        ];


        // Creamos los cuatro cuadrados
        for (let i = 0; i < 4; i++) {

            const figura = crearFigura({

                // Posición horizontal
                x:
                    canvas.width *
                    posiciones[i][0],

                // Posición vertical
                y:
                    canvas.height *
                    posiciones[i][1],

                // Tamaño inicial
                tamaño:
                    TAMAÑO_INICIAL,

                // Cada cuadrado comienza
                // con un color diferente
                color:
                    colores[i],

                // Todos empiezan en generación 0
                generacion:
                    0,

                // No tienen padre porque son
                // las primeras figuras del sistema
                padre:
                    null
            });


            // Agregamos el cuadrado al sistema
            figuras.push(figura);
        }
    }


    // =====================================================
    // CREAR UNA FIGURA
    // =====================================================

    function crearFigura(datos) {

        // Devolvemos un objeto que contiene
        // todas las características de un cuadrado
        return {

            // -------------------------------------------------
            // POSICIÓN
            // -------------------------------------------------

            x:
                datos.x,

            y:
                datos.y,


            // -------------------------------------------------
            // TAMAÑO
            // -------------------------------------------------

            tamaño:
                datos.tamaño,


            // -------------------------------------------------
            // COLOR
            // -------------------------------------------------

            color:
                datos.color,


            // -------------------------------------------------
            // OPACIDAD
            // -------------------------------------------------

            opacidad:
                datos.opacidad ?? 1,


            // -------------------------------------------------
            // GROSOR DEL BORDE
            // -------------------------------------------------

            grosor:
                datos.grosor ?? 4,


            // =================================================
            // MOVIMIENTO
            // =================================================

            // Velocidad horizontal
            vx:
                datos.vx ??
                (Math.random() - 0.5) * 0.35,

            // Velocidad vertical
            vy:
                datos.vy ??
                (Math.random() - 0.5) * 0.35,


            // Fases utilizadas para generar
            // pequeñas variaciones orgánicas
            faseMovimientoX:
                Math.random() *
                Math.PI *
                2,

            faseMovimientoY:
                Math.random() *
                Math.PI *
                2,


            // Velocidad de las pequeñas oscilaciones
            velocidadMovimiento:
                0.004 +
                Math.random() *
                0.004,


            // =================================================
            // RESPIRACIÓN
            // =================================================

            // Cada cuadrado cambia levemente
            // de tamaño con el tiempo
            faseRespiracion:
                Math.random() *
                Math.PI *
                2,

            // Velocidad de la respiración
            velocidadRespiracion:
                0.012 +
                Math.random() *
                0.006,

            // Intensidad de la respiración
            intensidadRespiracion:
                0.045 +
                Math.random() *
                0.02,


            // =================================================
            // ESTIRAMIENTO
            // =================================================

            // Indica si el cuadrado está siendo
            // manipulado con dos dedos
            estirando:
                false,

            // Escala horizontal
            escalaX:
                1,

            // Escala vertical
            escalaY:
                1,

            // Dirección en la que se está estirando
            anguloEstiramiento:
                0,


            // =================================================
            // HERENCIA
            // =================================================

            // Número de generación
            generacion:
                datos.generacion,

            // Referencia al padre
            padre:
                datos.padre,

            // Array donde se guardan los hijos
            hijos:
                [],

            // La figura puede reproducirse
            // solamente si todavía no alcanzó
            // la generación máxima
            puedeReproducirse:
                datos.generacion <
                MAX_GENERACIONES,


            // =================================================
            // SEPARACIÓN
            // =================================================

            // Indica si está realizando
            // la animación de nacimiento
            separando:
                false,

            // Progreso de la animación
            progresoSeparacion:
                0,

            // Evita crear hijos dos veces
            hijosCreados:
                false
        };
    }


    // =====================================================
    // RADIO FÍSICO DEL CUADRADO
    // =====================================================

    function radioFigura(figura) {

        // El radio es la mitad del tamaño
        return figura.tamaño * 0.5;
    }


    // =====================================================
    // MOVIMIENTO ORGÁNICO
    // =====================================================

    function moverFiguras() {

        // Recorremos todos los cuadrados
        figuras.forEach(figura => {


            // Si está siendo estirado
            // no se mueve por sí solo
            if (
                figura.estirando ||
                figura.separando
            ) {

                return;
            }


            // -------------------------------------------------
            // MOVIMIENTO PRINCIPAL
            // -------------------------------------------------

            figura.x +=
                figura.vx;

            figura.y +=
                figura.vy;


            // -------------------------------------------------
            // MOVIMIENTO ORGÁNICO
            // -------------------------------------------------

            // Avanzamos las fases
            figura.faseMovimientoX +=
                figura.velocidadMovimiento;

            figura.faseMovimientoY +=
                figura.velocidadMovimiento *
                0.8;


            // Agregamos pequeños movimientos
            // sinusoidales para que no parezca
            // un movimiento totalmente mecánico
            figura.x +=
                Math.sin(
                    figura.faseMovimientoX
                ) *
                0.08;

            figura.y +=
                Math.cos(
                    figura.faseMovimientoY
                ) *
                0.08;


            // -------------------------------------------------
            // LIMITAR A LOS BORDES
            // -------------------------------------------------

            limitarDentroDelCanvas(figura);
        });
    }


    // =====================================================
    // MANTENER FIGURAS DENTRO DEL CANVAS
    // =====================================================

    function limitarDentroDelCanvas(figura) {

        // Obtenemos el radio del cuadrado
        const radio =
            radioFigura(figura);


        // Si toca el borde izquierdo
        if (
            figura.x - radio < 0
        ) {

            figura.x =
                radio;
        }


        // Si toca el borde derecho
        if (
            figura.x + radio >
            canvas.width
        ) {

            figura.x =
                canvas.width -
                radio;
        }


        // Si toca el borde superior
        if (
            figura.y - radio < 0
        ) {

            figura.y =
                radio;
        }


        // Si toca el borde inferior
        if (
            figura.y + radio >
            canvas.height
        ) {

            figura.y =
                canvas.height -
                radio;
        }
    }


    // =====================================================
    // COLISIONES ENTRE CUADRADOS
    // =====================================================

    function resolverColisiones() {

        // Comparamos cada cuadrado con los demás
        for (
            let i = 0;
            i < figuras.length;
            i++
        ) {

            for (
                let j = i + 1;
                j < figuras.length;
                j++
            ) {

                const a =
                    figuras[i];

                const b =
                    figuras[j];


                // Si alguno está naciendo,
                // no hacemos colisión durante ese momento
                if (
                    a.separando ||
                    b.separando
                ) {

                    continue;
                }


                // Diferencia entre posiciones
                const dx =
                    b.x - a.x;

                const dy =
                    b.y - a.y;


                // Distancia entre los centros
                const distancia =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );


                // Distancia mínima para que
                // los cuadrados no se superpongan
                const distanciaMinima =
                    radioFigura(a) +
                    radioFigura(b);


                // Si no se están tocando,
                // no hacemos nada
                if (
                    distancia >=
                    distanciaMinima
                ) {

                    continue;
                }


                // Dirección de la colisión
                let nx = 1;
                let ny = 0;


                // Evitamos división por cero
                if (
                    distancia > 0
                ) {

                    nx =
                        dx /
                        distancia;

                    ny =
                        dy /
                        distancia;
                }


                // Cuánto se superponen
                const penetracion =
                    distanciaMinima -
                    distancia;


                // -------------------------------------------------
                // SEPARAR LOS CUERPOS
                // -------------------------------------------------

                if (
                    !a.estirando &&
                    !b.estirando
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


                // Si A está siendo estirado,
                // solamente movemos B
                else if (
                    a.estirando
                ) {

                    b.x +=
                        nx *
                        penetracion;

                    b.y +=
                        ny *
                        penetracion;
                }


                // Si B está siendo estirado,
                // solamente movemos A
                else if (
                    b.estirando
                ) {

                    a.x -=
                        nx *
                        penetracion;

                    a.y -=
                        ny *
                        penetracion;
                }


                // -------------------------------------------------
                // REBOTE SUAVE
                // -------------------------------------------------

                if (
                    !a.estirando
                ) {

                    a.vx -=
                        nx *
                        FUERZA_COLISION;

                    a.vy -=
                        ny *
                        FUERZA_COLISION;
                }


                if (
                    !b.estirando
                ) {

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
    // BUSCAR CUADRADO DEBAJO DE UN PUNTO
    // =====================================================

    function buscarFigura(x, y) {

        // Recorremos desde la última figura
        // para detectar primero las que estén arriba
        for (
            let i = figuras.length - 1;
            i >= 0;
            i--
        ) {

            const figura =
                figuras[i];


            // Distancia horizontal
            const dx =
                x - figura.x;

            // Distancia vertical
            const dy =
                y - figura.y;


            // Distancia al centro
            const distancia =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            // Si el dedo está suficientemente cerca,
            // consideramos que tocó la figura
            if (
                distancia <=
                radioFigura(figura) *
                1.2
            ) {

                return figura;
            }
        }


        // No se encontró ninguna figura
        return null;
    }


    // =====================================================
    // DISTANCIA ENTRE LOS DOS DEDOS
    // =====================================================

    function distanciaDedos() {

        // Convertimos los dedos guardados
        // en un array
        const puntos =
            Array.from(
                dedos.values()
            );


        // Necesitamos exactamente dos dedos
        if (
            puntos.length < 2
        ) {

            return 0;
        }


        // Primer dedo
        const a =
            puntos[0];

        // Segundo dedo
        const b =
            puntos[1];


        // Distancia horizontal
        const dx =
            b.x - a.x;

        // Distancia vertical
        const dy =
            b.y - a.y;


        // Distancia entre ambos dedos
        return Math.sqrt(
            dx * dx +
            dy * dy
        );
    }


    // =====================================================
    // COMENZAR EL ESTIRAMIENTO
    // =====================================================

    function comenzarEstiramiento() {

        // Solamente funciona con dos dedos
        if (
            dedos.size !== 2
        ) {

            return;
        }


        // Obtenemos los dos puntos
        const puntos =
            Array.from(
                dedos.values()
            );


        // Variable para guardar
        // el cuadrado seleccionado
        let figura = null;


        // Buscamos una figura debajo
        // de cualquiera de los dedos
        for (
            const punto of puntos
        ) {

            const encontrada =
                buscarFigura(
                    punto.x,
                    punto.y
                );


            if (
                encontrada
            ) {

                figura =
                    encontrada;

                break;
            }
        }


        // Si no tocamos ningún cuadrado,
        // no hacemos nada
        if (
            !figura
        ) {

            return;
        }


        // Si ya no puede reproducirse,
        // no permitimos otra separación
        if (
            !figura.puedeReproducirse
        ) {

            return;
        }


        // Guardamos el cuadrado seleccionado
        figuraEstirada =
            figura;


        // Activamos el estado de estiramiento
        figura.estirando =
            true;


        // Comienza con su forma original
        figura.escalaX =
            1;

        figura.escalaY =
            1;
    }


    // =====================================================
    // ACTUALIZAR EL ESTIRAMIENTO
    // =====================================================

    function actualizarEstiramiento() {

        // Si no hay figura seleccionada,
        // no hacemos nada
        if (
            !figuraEstirada
        ) {

            return;
        }


        // Si ya no hay dos dedos,
        // detenemos el proceso
        if (
            dedos.size !== 2
        ) {

            return;
        }


        // Guardamos la figura seleccionada
        const figura =
            figuraEstirada;


        // Obtenemos los dos dedos
        const puntos =
            Array.from(
                dedos.values()
            );


        // -------------------------------------------------
        // DIRECCIÓN DE LOS DEDOS
        // -------------------------------------------------

        // Diferencia horizontal
        const dx =
            puntos[1].x -
            puntos[0].x;


        // Diferencia vertical
        const dy =
            puntos[1].y -
            puntos[0].y;


        // Ángulo que forman los dedos
        const angulo =
            Math.atan2(
                dy,
                dx
            );


        // Guardamos la dirección
        // para utilizarla al separar
        figura.anguloEstiramiento =
            angulo;


        // -------------------------------------------------
        // CALCULAR CUÁNTO SE SEPARARON
        // -------------------------------------------------

        const distancia =
            distanciaDedos();


        // -------------------------------------------------
        // FACTOR DE ESTIRAMIENTO
        // -------------------------------------------------

        // Convertimos la distancia de los dedos
        // en un valor entre 0 y 1 aproximadamente
        const factor =
            Math.min(
                distancia /
                DISTANCIA_SEPARACION,
                1
            );


        // -------------------------------------------------
        // ESTIRAR EL CUADRADO
        // -------------------------------------------------

        // El cuadrado se alarga en la dirección
        // de los dos dedos
        figura.escalaX =
            1 +
            factor *
            0.75;


        // Se comprime levemente
        // en el otro eje
        figura.escalaY =
            1 -
            factor *
            0.22;


        // Evitamos que se deforme demasiado
        figura.escalaY =
            Math.max(
                0.78,
                figura.escalaY
            );


        // -------------------------------------------------
        // IMPORTANTE
        // -------------------------------------------------
        //
        // NO movemos el cuadrado hacia
        // el centro de los dedos.
        //
        // De esta manera permanece en su lugar
        // y solamente se estira.
        //


        // -------------------------------------------------
        // SEPARACIÓN
        // -------------------------------------------------

        // Cuando los dedos alcanzan
        // la distancia necesaria,
        // comienza la herencia
        if (
            distancia >=
            DISTANCIA_SEPARACION
        ) {

            separarFigura(
                figura
            );
        }
    }


    // =====================================================
    // CREAR LOS DOS HIJOS
    // =====================================================

    function separarFigura(padre) {

        // Evitamos ejecutar dos veces
        // la misma separación
        if (
            padre.separando ||
            padre.hijosCreados
        ) {

            return;
        }


        // Marcamos que está ocurriendo
        // una separación
        padre.separando =
            true;


        padre.hijosCreados =
            true;


        // El padre deja de estirarse
        padre.estirando =
            false;


        // Volvemos a convertirlo
        // visualmente en un cuadrado
        padre.escalaX =
            1;

        padre.escalaY =
            1;


        // -------------------------------------------------
        // COMPROBAR GENERACIÓN
        // -------------------------------------------------

        // Si llegó a la generación máxima,
        // no puede crear más hijos
        if (
            padre.generacion >=
            MAX_GENERACIONES
        ) {

            padre.separando =
                false;

            padre.hijosCreados =
                false;

            padre.puedeReproducirse =
                false;

            figuraEstirada =
                null;

            dedos.clear();

            return;
        }


        // -------------------------------------------------
        // GUARDAR EL CENTRO DEL PADRE
        // -------------------------------------------------

        // Esta es la posición REAL del padre.
        //
        // Los hijos van a nacer desde acá.
        //
        // Esto evita que se vayan a una esquina
        // siguiendo los dedos.
        const centroX =
            padre.x;

        const centroY =
            padre.y;


        // -------------------------------------------------
        // DIRECCIÓN DE SEPARACIÓN
        // -------------------------------------------------

        // Utilizamos la dirección
        // que tenían los dos dedos
        const angulo =
            padre.anguloEstiramiento;


        // -------------------------------------------------
        // DISTANCIA DE LOS HIJOS
        // -------------------------------------------------

        // Define qué tan separados
        // van a quedar los dos hijos
        const separacion =
            padre.tamaño *
            0.65;


        // -------------------------------------------------
        // TAMAÑO HEREDADO
        // -------------------------------------------------

        // Los hijos son más pequeños
        // que el padre
        const tamañoHijo =
            padre.tamaño *
            0.62;


        // -------------------------------------------------
        // CALCULAR POSICIONES DE LOS HIJOS
        // -------------------------------------------------

        const posiciones = [

            // Primer hijo
            {

                x:
                    centroX +
                    Math.cos(angulo) *
                    separacion,

                y:
                    centroY +
                    Math.sin(angulo) *
                    separacion
            },


            // Segundo hijo
            {

                x:
                    centroX -
                    Math.cos(angulo) *
                    separacion,

                y:
                    centroY -
                    Math.sin(angulo) *
                    separacion
            }
        ];


        // -------------------------------------------------
        // CREAR LOS DOS HIJOS
        // -------------------------------------------------

        for (
            let i = 0;
            i < 2;
            i++
        ) {


            // Creamos un nuevo cuadrado
            const hijo =
                crearFigura({

                    // El hijo comienza
                    // exactamente donde estaba el padre
                    x:
                        centroX,

                    y:
                        centroY,


                    // Hereda el tamaño
                    // pero con una pequeña variación
                    tamaño:
                        tamañoHijo *
                        (
                            0.94 +
                            Math.random() *
                            0.10
                        ),


                    // HEREDA EL COLOR
                    color:
                        padre.color,


                    // HEREDA LA OPACIDAD
                    opacidad:
                        padre.opacidad *
                        (
                            0.92 +
                            Math.random() *
                            0.06
                        ),


                    // HEREDA EL GROSOR
                    grosor:
                        padre.grosor *
                        (
                            0.92 +
                            Math.random() *
                            0.08
                        ),


                    // HEREDA PARTE DEL MOVIMIENTO
                    vx:
                        padre.vx +
                        (
                            Math.random() -
                            0.5
                        ) *
                        0.20,

                    vy:
                        padre.vy +
                        (
                            Math.random() -
                            0.5
                        ) *
                        0.20,


                    // Aumenta una generación
                    generacion:
                        padre.generacion +
                        1,


                    // Guardamos quién es su padre
                    padre:
                        padre
                });


            // Guardamos el hijo dentro
            // del registro del padre
            padre.hijos.push(
                hijo
            );


            // Agregamos el hijo
            // al sistema general
            figuras.push(
                hijo
            );


            // -------------------------------------------------
            // ANIMACIÓN DEL NACIMIENTO
            // -------------------------------------------------

            // El hijo comienza en el centro
            // y luego se desplaza hacia afuera
            hijo.separando =
                true;


            hijo.progresoSeparacion =
                0;


            // Guardamos el destino final
            hijo.destinoX =
                posiciones[i].x;

            hijo.destinoY =
                posiciones[i].y;
        }


        // El padre ya no puede reproducirse
        padre.puedeReproducirse =
            false;


        // Terminamos la interacción
        figuraEstirada =
            null;


        dedos.clear();
    }


    // =====================================================
    // ANIMAR NACIMIENTO DE LOS HIJOS
    // =====================================================

    function actualizarSeparaciones() {

        // Recorremos todos los cuadrados
        figuras.forEach(figura => {


            // Si no está naciendo,
            // no hacemos nada
            if (
                !figura.separando
            ) {

                return;
            }


            // Aumentamos el progreso
            figura.progresoSeparacion +=
                0.035;


            // Limitamos el progreso entre 0 y 1
            const progreso =
                Math.min(
                    figura.progresoSeparacion,
                    1
                );


            // -------------------------------------------------
            // MOVIMIENTO SUAVE
            // -------------------------------------------------

            // La interpolación hace que el movimiento
            // empiece lento y termine suavemente
            const suavizado =
                1 -
                Math.pow(
                    1 - progreso,
                    3
                );


            // Movemos el hijo hacia
            // su posición final
            figura.x +=
                (
                    figura.destinoX -
                    figura.x
                ) *
                (
                    0.08 +
                    suavizado *
                    0.04
                );


            figura.y +=
                (
                    figura.destinoY -
                    figura.y
                ) *
                (
                    0.08 +
                    suavizado *
                    0.04
                );


            // Evitamos que salga del canvas
            limitarDentroDelCanvas(
                figura
            );


            // -------------------------------------------------
            // FINALIZAR NACIMIENTO
            // -------------------------------------------------

            if (
                progreso >= 1
            ) {

                figura.x =
                    figura.destinoX;

                figura.y =
                    figura.destinoY;


                // El hijo vuelve a su comportamiento normal
                figura.separando =
                    false;
            }
        });
    }


    // =====================================================
    // TOUCHSTART
    // =====================================================

    canvas.addEventListener(
        "touchstart",
        function (e) {

            // Evitamos que el navegador
            // interprete el gesto como zoom o scroll
            e.preventDefault();


            // Posición real del canvas
            const rect =
                canvas.getBoundingClientRect();


            // Guardamos todos los dedos nuevos
            for (
                let i = 0;
                i < e.changedTouches.length;
                i++
            ) {

                const touch =
                    e.changedTouches[i];


                // Guardamos la posición
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


            // Cuando hay exactamente dos dedos,
            // comenzamos el estiramiento
            if (
                dedos.size === 2
            ) {

                comenzarEstiramiento();
            }

        },
        {
            passive: false
        }
    );


    // =====================================================
    // TOUCHMOVE
    // =====================================================

    canvas.addEventListener(
        "touchmove",
        function (e) {

            // Evitamos comportamientos del navegador
            e.preventDefault();


            // Obtenemos la posición del canvas
            const rect =
                canvas.getBoundingClientRect();


            // Actualizamos la posición
            // de cada dedo
            for (
                let i = 0;
                i < e.changedTouches.length;
                i++
            ) {

                const touch =
                    e.changedTouches[i];


                // Si conocemos ese dedo,
                // actualizamos su posición
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


            // Actualizamos el estiramiento
            actualizarEstiramiento();

        },
        {
            passive: false
        }
    );


    // =====================================================
    // TOUCHEND
    // =====================================================

    canvas.addEventListener(
        "touchend",
        function (e) {

            // Evitamos comportamiento del navegador
            e.preventDefault();


            // Eliminamos los dedos que se levantaron
            for (
                let i = 0;
                i < e.changedTouches.length;
                i++
            ) {

                dedos.delete(
                    e.changedTouches[i].identifier
                );
            }


            // -------------------------------------------------
            // SI NO LLEGÓ A SEPARARSE
            // -------------------------------------------------

            // Si soltamos antes de llegar
            // a la distancia necesaria,
            // el cuadrado vuelve a su forma original
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
    // TOUCHCANCEL
    // =====================================================

    canvas.addEventListener(
        "touchcancel",
        function () {

            // Eliminamos todos los dedos
            dedos.clear();


            // Si había una figura estirada,
            // la devolvemos a su estado normal
            if (
                figuraEstirada
            ) {

                figuraEstirada.estirando =
                    false;

                figuraEstirada.escalaX =
                    1;

                figuraEstirada.escalaY =
                    1;
            }


            // Quitamos la selección
            figuraEstirada =
                null;
        }
    );


    // =====================================================
    // DIBUJAR CADA CUADRADO
    // =====================================================

    function dibujarFigura(figura) {

        // -------------------------------------------------
        // RESPIRACIÓN
        // -------------------------------------------------

        // Avanzamos la fase de respiración
        figura.faseRespiracion +=
            figura.velocidadRespiracion;


        // Calculamos una pequeña variación
        // de tamaño
        const respiracion =
            1 +
            Math.sin(
                figura.faseRespiracion
            ) *
            figura.intensidadRespiracion;


        // Tamaño final
        const tamaño =
            figura.tamaño *
            respiracion;


        // Guardamos el estado del canvas
        ctx.save();


        // Movemos el origen al centro
        // del cuadrado
        ctx.translate(
            figura.x,
            figura.y
        );


        // -------------------------------------------------
        // ROTACIÓN DURANTE EL ESTIRAMIENTO
        // -------------------------------------------------

        if (
            figura.estirando
        ) {

            // Rotamos el cuadrado
            // siguiendo la dirección de los dedos
            ctx.rotate(
                figura.anguloEstiramiento
            );
        }


        // -------------------------------------------------
        // ESTIRAMIENTO
        // -------------------------------------------------

        ctx.scale(
            figura.escalaX,
            figura.escalaY
        );


        // -------------------------------------------------
        // OPACIDAD
        // -------------------------------------------------

        ctx.globalAlpha =
            figura.opacidad;


        // -------------------------------------------------
        // CUADRADO
        // -------------------------------------------------

        // Color de relleno
        ctx.fillStyle =
            figura.color;


        // Dibujamos el cuadrado
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


        // Restauramos el estado anterior
        ctx.restore();
    }


    // =====================================================
    // ANIMACIÓN PRINCIPAL
    // =====================================================

    function animar() {

        // Limpiamos todo el canvas
        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        // -------------------------------------------------
        // 1. MOVIMIENTO
        // -------------------------------------------------

        moverFiguras();


        // -------------------------------------------------
        // 2. COLISIONES
        // -------------------------------------------------

        resolverColisiones();


        // -------------------------------------------------
        // 3. NACIMIENTO / SEPARACIÓN
        // -------------------------------------------------

        actualizarSeparaciones();


        // -------------------------------------------------
        // 4. DIBUJAR
        // -------------------------------------------------

        figuras.forEach(
            dibujarFigura
        );


        // Volvemos a ejecutar la animación
        // en el siguiente frame
        requestAnimationFrame(
            animar
        );
    }


    // =====================================================
    // INICIAR EL SISTEMA
    // =====================================================

    // Primero ajustamos el canvas
    ajustarCanvas();


    // Después iniciamos la animación
    animar();

});