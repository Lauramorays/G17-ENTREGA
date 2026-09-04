// =====================================================
// COLABORACIÓN
// =====================================================
// Este juego trabaja con varios círculos que se mueven
// de manera orgánica por el espacio.
//
// El objetivo es seleccionar diferentes círculos con
// dedos o mouse y acercarlos para generar una conexión.
//
// Cuando se alcanza la cantidad de círculos necesaria,
// comienza una pequeña espera y finalmente se produce
// la unión.
//
// La estética, tamaños, velocidades, respiración,
// colisiones y colores mantienen el mismo sistema
// visual que las demás experiencias.
// =====================================================


// Esperamos a que toda la página esté cargada antes
// de comenzar a trabajar con el canvas.
document.addEventListener("DOMContentLoaded", function () {

    // =================================================
    // REFERENCIAS AL CANVAS
    // =================================================

    // Buscamos el canvas donde se dibujará toda
    // la experiencia.
    const canvas = document.getElementById("canvas");

    // Obtenemos el contexto 2D para poder dibujar
    // círculos, conexiones y efectos.
    const ctx = canvas.getContext("2d");


    // =================================================
    // CONFIGURACIÓN GENERAL
    // =================================================

    // Radio base de los círculos.
    const RADIO_BASE = 55;

    // Velocidad máxima utilizada por los círculos.
    // Se mantiene similar al resto del sistema.
    const VELOCIDAD_MAXIMA = 1.5;

    // Fuerza con la que los círculos se separan
    // cuando chocan entre ellos.
    const FUERZA_COLISION = 0.8;


    // =================================================
    // CONFIGURACIÓN DE COLABORACIÓN
    // =================================================

    // Cantidad de círculos diferentes que deben
    // seleccionarse para generar una colaboración.
    let dedosNecesarios = 2;

    // Cantidad máxima de dedos que puede utilizar
    // la interacción.
    const MAXIMO_DEDOS = 4;

    // Tiempo que deben mantenerse seleccionados
    // los círculos antes de completar la unión.
    const TIEMPO_UNION = 900;

    // Distancia máxima que puede alejarse el dedo
    // del centro del círculo antes de romper la unión.
    const DISTANCIA_MAXIMA_DEDO = 75;


    // =================================================
    // COLORES
    // =================================================

    // Colores utilizados por todo el sistema visual.
    const COLORES = [
        "#D9D9D9",
        "#8BB2D3",
        "#202D64"
    ];

    // Color utilizado para marcar la selección.
    const COLOR_SELECCION = "#C4CEE5";


    // =================================================
    // VARIABLES PRINCIPALES
    // =================================================

    // Array donde guardamos todos los círculos.
    let circulos = [];

    // Map donde registramos cada dedo o puntero.
    //
    // Cada pointerId representa una interacción distinta.
    const dedos = new Map();

    // Guarda el temporizador que controla el tiempo
    // necesario para completar una colaboración.
    let temporizadorUnion = null;


    // =================================================
    // AJUSTE DEL CANVAS
    // =================================================
    // Hace que el canvas ocupe todo el espacio disponible
    // y se adapte cuando cambia el tamaño de la ventana.
    // =================================================

    function ajustarCanvas() {

        // Obtenemos el tamaño real del contenedor.
        const rect = canvas.getBoundingClientRect();

        // Guardamos las dimensiones internas del canvas.
        canvas.width = rect.width;
        canvas.height = rect.height;

        // Si todavía no existen círculos, los creamos.
        if (circulos.length === 0) {
            crearCirculosIniciales();
        }
    }


    // =================================================
    // CREAR CÍRCULOS INICIALES
    // =================================================

    function crearCirculosIniciales() {

        // Limpiamos cualquier círculo anterior.
        circulos = [];

        // Creamos cuatro círculos.
        for (let i = 0; i < 4; i++) {

            // Posiciones iniciales distribuidas
            // por diferentes sectores del canvas.
            const posiciones = [
                {
                    x: canvas.width * 0.20,
                    y: canvas.height * 0.30
                },
                {
                    x: canvas.width * 0.80,
                    y: canvas.height * 0.30
                },
                {
                    x: canvas.width * 0.20,
                    y: canvas.height * 0.70
                },
                {
                    x: canvas.width * 0.80,
                    y: canvas.height * 0.70
                }
            ];

            // Elegimos una posición para este círculo.
            const posicion = posiciones[i];

            // Creamos el objeto círculo.
            circulos.push({

                // Posición horizontal.
                x: posicion.x,

                // Posición vertical.
                y: posicion.y,

                // Radio actual.
                radio: RADIO_BASE,

                // Guardamos el radio original.
                radioOriginal: RADIO_BASE,

                // Cada círculo recibe uno de los colores
                // de la paleta.
                color: COLORES[i % COLORES.length],

                // Velocidad horizontal aleatoria.
                vx: (Math.random() - 0.5) * VELOCIDAD_MAXIMA,

                // Velocidad vertical aleatoria.
                vy: (Math.random() - 0.5) * VELOCIDAD_MAXIMA,

                // Fase utilizada para el movimiento orgánico.
                faseX: Math.random() * Math.PI * 2,

                // Segunda fase del movimiento orgánico.
                faseY: Math.random() * Math.PI * 2,

                // Velocidad del movimiento orgánico.
                velocidadOrganica:
                    0.005 + Math.random() * 0.004,

                // Fase independiente para la respiración.
                faseRespiracion:
                    Math.random() * Math.PI * 2,

                // Velocidad de respiración.
                velocidadRespiracion:
                    0.015 + Math.random() * 0.01,

                // Intensidad de la respiración.
                intensidadRespiracion:
                    0.025 + Math.random() * 0.02,

                // Aparición progresiva.
                aparicion: 0,

                // Indica si acaba de aparecer.
                nuevo: true,

                // Indica si está seleccionado.
                seleccionado: false,

                // Indica si está congelado.
                congelado: false
            });
        }
    }


    // =================================================
    // BUSCAR CÍRCULO
    // =================================================
    // Devuelve el círculo que se encuentra debajo
    // de la posición indicada.
    // =================================================

    function buscarCirculo(x, y) {

        // Recorremos todos los círculos.
        for (let i = circulos.length - 1; i >= 0; i--) {

            const circulo = circulos[i];

            // Calculamos la distancia entre el puntero
            // y el centro del círculo.
            const dx = x - circulo.x;
            const dy = y - circulo.y;

            const distancia = Math.sqrt(
                dx * dx + dy * dy
            );

            // Si está dentro del radio,
            // encontramos el círculo.
            if (distancia <= circulo.radio) {
                return circulo;
            }
        }

        // Si no encontramos ninguno, devolvemos null.
        return null;
    }


    // =================================================
    // COMPROBAR POSICIÓN DEL DEDO
    // =================================================
    // Comprueba si el dedo continúa suficientemente
    // cerca del círculo seleccionado.
    // =================================================

    function comprobarPosicionDedo(dedo) {

        // Si no existe círculo asociado,
        // no hacemos nada.
        if (!dedo.circulo) {
            return false;
        }

        // Distancia horizontal entre dedo y círculo.
        const dx =
            dedo.x - dedo.circulo.x;

        // Distancia vertical entre dedo y círculo.
        const dy =
            dedo.y - dedo.circulo.y;

        // Distancia total.
        const distancia = Math.sqrt(
            dx * dx + dy * dy
        );

        // Devuelve true si el dedo sigue cerca.
        return distancia <= DISTANCIA_MAXIMA_DEDO;
    }


    // =================================================
    // ACTUALIZAR SELECCIÓN
    // =================================================

    function actualizarSeleccion() {

        // Primero quitamos la selección de todos.
        circulos.forEach(circulo => {
            circulo.seleccionado = false;
            circulo.congelado = false;
        });

        // Recorremos todos los dedos/punteros activos.
        dedos.forEach(dedo => {

            // Si tiene un círculo asociado,
            // lo seleccionamos.
            if (dedo.circulo) {

                dedo.circulo.seleccionado = true;

                // Los círculos seleccionados se congelan
                // para que sea más fácil colaborar con ellos.
                dedo.circulo.congelado = true;
            }
        });
    }


    // =================================================
    // ROMPER COLABORACIÓN
    // =================================================
    // Se ejecuta cuando uno de los dedos se aleja
    // demasiado o abandona la interacción.
    // =================================================

    function romperColaboracion() {

        // Cancelamos el temporizador de unión.
        if (temporizadorUnion !== null) {

            clearTimeout(temporizadorUnion);

            temporizadorUnion = null;
        }

        // Quitamos la congelación.
        circulos.forEach(circulo => {

            circulo.congelado = false;
        });
    }


    // =================================================
    // COMPROBAR SI PUEDE HABER UNA UNIÓN
    // =================================================

    function comprobarUnion() {

        // Creamos un Set para guardar círculos únicos.
        const seleccionados = new Set();

        // Recorremos todos los dedos activos.
        dedos.forEach(dedo => {

            if (dedo.circulo) {
                seleccionados.add(dedo.circulo);
            }
        });

        // Si no tenemos la cantidad necesaria,
        // cancelamos cualquier unión pendiente.
        if (seleccionados.size < dedosNecesarios) {

            if (temporizadorUnion !== null) {

                clearTimeout(temporizadorUnion);

                temporizadorUnion = null;
            }

            return;
        }

        // Si ya existe un temporizador,
        // no creamos otro.
        if (temporizadorUnion !== null) {
            return;
        }

        // Comenzamos el tiempo necesario
        // para completar la colaboración.
        temporizadorUnion = setTimeout(() => {

            completarUnion();

        }, TIEMPO_UNION);
    }


    // =================================================
    // COMPLETAR UNIÓN
    // =================================================

    function completarUnion() {

        // Obtenemos los círculos actualmente seleccionados.
        const seleccionados = new Set();

        dedos.forEach(dedo => {

            if (dedo.circulo) {
                seleccionados.add(dedo.circulo);
            }
        });

        // Si por algún motivo ya no hay suficientes
        // círculos, cancelamos.
        if (seleccionados.size < dedosNecesarios) {

            temporizadorUnion = null;

            return;
        }

        // Eliminamos los círculos seleccionados.
        circulos = circulos.filter(
            circulo => !seleccionados.has(circulo)
        );

        // Quitamos de los dedos las referencias
        // a los círculos que desaparecieron.
        dedos.forEach((dedo, pointerId) => {

            if (dedo.circulo &&
                seleccionados.has(dedo.circulo)) {

                dedos.delete(pointerId);
            }
        });

        // Aumentamos la cantidad necesaria para
        // la siguiente colaboración.
        if (dedosNecesarios < MAXIMO_DEDOS) {

            dedosNecesarios++;
        }

        // Volvemos a generar círculos si quedaron
        // menos de cuatro.
        while (circulos.length < 4) {

            crearCirculoNuevo();
        }

        // Reiniciamos el temporizador.
        temporizadorUnion = null;

        // Actualizamos las selecciones.
        actualizarSeleccion();
    }


    // =================================================
    // CREAR CÍRCULO NUEVO
    // =================================================

    function crearCirculoNuevo() {

        // Creamos un margen para evitar que aparezca
        // exactamente sobre el borde.
        const margen = RADIO_BASE + 20;

        // Posición aleatoria.
        const x =
            margen +
            Math.random() *
            (canvas.width - margen * 2);

        const y =
            margen +
            Math.random() *
            (canvas.height - margen * 2);

        // Creamos el nuevo círculo.
        circulos.push({

            x: x,

            y: y,

            radio: RADIO_BASE,

            radioOriginal: RADIO_BASE,

            color:
                COLORES[
                    Math.floor(
                        Math.random() *
                        COLORES.length
                    )
                ],

            vx:
                (Math.random() - 0.5) *
                VELOCIDAD_MAXIMA,

            vy:
                (Math.random() - 0.5) *
                VELOCIDAD_MAXIMA,

            faseX:
                Math.random() *
                Math.PI * 2,

            faseY:
                Math.random() *
                Math.PI * 2,

            velocidadOrganica:
                0.005 +
                Math.random() *
                0.004,

            faseRespiracion:
                Math.random() *
                Math.PI * 2,

            velocidadRespiracion:
                0.015 +
                Math.random() *
                0.01,

            intensidadRespiracion:
                0.025 +
                Math.random() *
                0.02,

            aparicion: 0,

            nuevo: true,

            seleccionado: false,

            congelado: false
        });
    }


    // =================================================
    // ACTUALIZAR MOVIMIENTO
    // =================================================

    function moverCirculos() {

        // Recorremos todos los círculos.
        circulos.forEach(circulo => {

            // Si está seleccionado,
            // no lo movemos.
            if (circulo.congelado) {
                return;
            }

            // Aumentamos las fases del movimiento.
            circulo.faseX +=
                circulo.velocidadOrganica;

            circulo.faseY +=
                circulo.velocidadOrganica;

            // Movimiento orgánico horizontal.
            const movimientoX =
                Math.sin(circulo.faseX) *
                0.025;

            // Movimiento orgánico vertical.
            const movimientoY =
                Math.cos(circulo.faseY) *
                0.025;

            // Aplicamos la velocidad.
            circulo.x +=
                circulo.vx +
                movimientoX;

            circulo.y +=
                circulo.vy +
                movimientoY;

            // =================================================
            // RESPIRACIÓN
            // =================================================

            circulo.faseRespiracion +=
                circulo.velocidadRespiracion;

            // La respiración modifica ligeramente
            // el tamaño visual.
            const respiracion =
                1 +
                Math.sin(
                    circulo.faseRespiracion
                ) *
                circulo.intensidadRespiracion;

            // Guardamos el radio visual actual.
            circulo.radioVisual =
                circulo.radio *
                respiracion;

            // =================================================
            // REBOTE CONTRA LOS BORDES
            // =================================================

            if (
                circulo.x -
                circulo.radio <
                0
            ) {

                circulo.x =
                    circulo.radio;

                circulo.vx =
                    Math.abs(circulo.vx);
            }

            if (
                circulo.x +
                circulo.radio >
                canvas.width
            ) {

                circulo.x =
                    canvas.width -
                    circulo.radio;

                circulo.vx =
                    -Math.abs(circulo.vx);
            }

            if (
                circulo.y -
                circulo.radio <
                0
            ) {

                circulo.y =
                    circulo.radio;

                circulo.vy =
                    Math.abs(circulo.vy);
            }

            if (
                circulo.y +
                circulo.radio >
                canvas.height
            ) {

                circulo.y =
                    canvas.height -
                    circulo.radio;

                circulo.vy =
                    -Math.abs(circulo.vy);
            }
        });
    }


    // =================================================
    // COLISIONES ENTRE CÍRCULOS
    // =================================================

    function comprobarColisiones() {

        // Comparamos cada círculo con todos los demás.
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

                // Diferencia horizontal.
                const dx = b.x - a.x;

                // Diferencia vertical.
                const dy = b.y - a.y;

                // Distancia entre centros.
                const distancia = Math.sqrt(
                    dx * dx +
                    dy * dy
                );

                // Distancia mínima necesaria
                // para que no se superpongan.
                const distanciaMinima =
                    a.radio +
                    b.radio;

                // Si están chocando...
                if (
                    distancia > 0 &&
                    distancia < distanciaMinima
                ) {

                    // Vector normalizado.
                    const nx =
                        dx / distancia;

                    const ny =
                        dy / distancia;

                    // Cuánto se están superponiendo.
                    const solapamiento =
                        distanciaMinima -
                        distancia;

                    // Si los dos están libres,
                    // ambos reciben la mitad del desplazamiento.
                    if (
                        !a.congelado &&
                        !b.congelado
                    ) {

                        a.x -=
                            nx *
                            solapamiento *
                            0.5;

                        a.y -=
                            ny *
                            solapamiento *
                            0.5;

                        b.x +=
                            nx *
                            solapamiento *
                            0.5;

                        b.y +=
                            ny *
                            solapamiento *
                            0.5;
                    }

                    // Si solamente A está congelado,
                    // movemos B.
                    else if (
                        a.congelado &&
                        !b.congelado
                    ) {

                        b.x +=
                            nx *
                            solapamiento;

                        b.y +=
                            ny *
                            solapamiento;
                    }

                    // Si solamente B está congelado,
                    // movemos A.
                    else if (
                        !a.congelado &&
                        b.congelado
                    ) {

                        a.x -=
                            nx *
                            solapamiento;

                        a.y -=
                            ny *
                            solapamiento;
                    }

                    // Rebote físico sencillo.
                    const velocidadRelativaX =
                        b.vx - a.vx;

                    const velocidadRelativaY =
                        b.vy - a.vy;

                    const velocidadNormal =
                        velocidadRelativaX * nx +
                        velocidadRelativaY * ny;

                    // Si ya se están separando,
                    // no aplicamos otro impulso.
                    if (velocidadNormal > 0) {
                        continue;
                    }

                    // Calculamos el impulso.
                    const impulso =
                        -velocidadNormal *
                        FUERZA_COLISION;

                    // Aplicamos el rebote.
                    if (!a.congelado) {

                        a.vx -=
                            impulso * nx;

                        a.vy -=
                            impulso * ny;
                    }

                    if (!b.congelado) {

                        b.vx +=
                            impulso * nx;

                        b.vy +=
                            impulso * ny;
                    }
                }
            }
        }
    }


    // =================================================
    // DIBUJAR BORDE DE SELECCIÓN
    // =================================================
    // Este es el cambio principal que pediste.
    //
    // El borde NO es una línea encima del círculo.
    //
    // Es un contorno circular que sigue la forma
    // del objeto y queda ligeramente separado.
    // =================================================

    function dibujarSeleccion(
        circulo,
        radioVisual
    ) {

        // Si el círculo no está seleccionado,
        // no dibujamos el borde.
        if (!circulo.seleccionado) {
            return;
        }

        // Guardamos el estado actual del canvas
        // para no afectar otros dibujos.
        ctx.save();

        // El borde queda unos píxeles afuera
        // del círculo.
        const radioBorde =
            radioVisual + 7;

        // Creamos el círculo del borde.
        ctx.beginPath();

        ctx.arc(
            circulo.x,
            circulo.y,
            radioBorde,
            0,
            Math.PI * 2
        );

        // Color claro utilizado por el sistema
        // para indicar interacción.
        ctx.strokeStyle =
            COLOR_SELECCION;

        // Grosor del contorno.
        ctx.lineWidth = 2;

        // Brillo suave alrededor.
        ctx.shadowColor =
            COLOR_SELECCION;

        ctx.shadowBlur = 10;

        // Transparencia del borde.
        ctx.globalAlpha = 0.95;

        // Dibujamos el contorno.
        ctx.stroke();

        // Restauramos el canvas.
        ctx.restore();
    }


    // =================================================
    // DIBUJAR CONEXIONES
    // =================================================
    // Une visualmente los círculos que están
    // seleccionados por diferentes dedos.
    // =================================================

    function dibujarConexiones() {

        // Obtenemos únicamente los círculos seleccionados.
        const seleccionados =
            circulos.filter(
                circulo =>
                    circulo.seleccionado
            );

        // Si hay menos de dos,
        // no hay conexión que dibujar.
        if (seleccionados.length < 2) {
            return;
        }

        // Dibujamos una conexión entre cada pareja.
        for (
            let i = 0;
            i < seleccionados.length;
            i++
        ) {

            for (
                let j = i + 1;
                j < seleccionados.length;
                j++
            ) {

                const a = seleccionados[i];

                const b = seleccionados[j];

                // Distancia horizontal.
                const dx =
                    b.x - a.x;

                // Distancia vertical.
                const dy =
                    b.y - a.y;

                // Distancia entre centros.
                const distancia =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );

                // Cantidad de pequeños elementos
                // que forman la conexión.
                const cantidad =
                    Math.max(
                        2,
                        Math.floor(
                            distancia / 14
                        )
                    );

                // Dibujamos pequeños círculos
                // siguiendo la línea entre ambos.
                for (
                    let k = 1;
                    k < cantidad;
                    k++
                ) {

                    // Posición proporcional.
                    const porcentaje =
                        k / cantidad;

                    const x =
                        a.x +
                        dx *
                        porcentaje;

                    const y =
                        a.y +
                        dy *
                        porcentaje;

                    // Dibujamos el pequeño nodo.
                    ctx.beginPath();

                    ctx.arc(
                        x,
                        y,
                        4,
                        0,
                        Math.PI * 2
                    );

                    ctx.fillStyle =
                        COLOR_SELECCION;

                    ctx.globalAlpha = 0.85;

                    ctx.fill();
                }
            }
        }

        // Restauramos transparencia.
        ctx.globalAlpha = 1;
    }


    // =================================================
    // DIBUJAR CÍRCULO
    // =================================================

    function dibujarCirculo(circulo) {

        // =================================================
        // APARICIÓN
        // =================================================

        // Los círculos aparecen suavemente.
        if (circulo.aparicion < 1) {

            circulo.aparicion += 0.025;

            if (circulo.aparicion > 1) {
                circulo.aparicion = 1;
            }
        }

        // =================================================
        // RESPIRACIÓN
        // =================================================

        // Calculamos nuevamente la respiración
        // para que el borde pueda seguir exactamente
        // el tamaño visual del objeto.
        const respiracion =
            1 +
            Math.sin(
                circulo.faseRespiracion
            ) *
            circulo.intensidadRespiracion;

        // Radio visual real.
        const radioVisual =
            circulo.radio *
            respiracion *
            circulo.aparicion;

        // =================================================
        // DIBUJO DEL CÍRCULO
        // =================================================

        ctx.save();

        // Transparencia utilizada durante la aparición.
        ctx.globalAlpha =
            circulo.aparicion;

        // Creamos el círculo.
        ctx.beginPath();

        ctx.arc(
            circulo.x,
            circulo.y,
            radioVisual,
            0,
            Math.PI * 2
        );

        // Aplicamos su color.
        ctx.fillStyle =
            circulo.color;

        // Si está seleccionado,
        // agregamos un brillo suave al objeto.
        if (circulo.seleccionado) {

            ctx.shadowColor =
                COLOR_SELECCION;

            ctx.shadowBlur = 12;
        }

        // Pintamos el círculo.
        ctx.fill();

        // Restauramos el estado.
        ctx.restore();


        // =================================================
        // BORDE DE SELECCIÓN
        // =================================================
        // Lo dibujamos después del círculo para que
        // quede claramente visible por fuera.
        // =================================================

        if (circulo.aparicion > 0) {

            dibujarSeleccion(
                circulo,
                radioVisual
            );
        }
    }


    // =================================================
    // DIBUJAR TODO
    // =================================================

    function dibujar() {

        // Limpiamos todo el canvas.
        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        // Primero dibujamos las conexiones,
        // para que queden detrás de los círculos.
        dibujarConexiones();

        // Después dibujamos todos los círculos.
        circulos.forEach(circulo => {

            dibujarCirculo(circulo);
        });
    }


    // =================================================
    // BUCLE PRINCIPAL
    // =================================================
    // Esta función se ejecuta continuamente para
    // actualizar movimiento y redibujar la escena.
    // =================================================

    function animar() {

        // Movemos los círculos.
        moverCirculos();

        // Comprobamos sus colisiones.
        comprobarColisiones();

        // Actualizamos la selección.
        actualizarSeleccion();

        // Comprobamos si se puede producir una unión.
        comprobarUnion();

        // Dibujamos todo.
        dibujar();

        // Volvemos a llamar a la animación.
        requestAnimationFrame(animar);
    }


    // =================================================
    // POINTER DOWN
    // =================================================
    // Se ejecuta tanto con:
    // - mouse
    // - dedo
    // - lápiz/stylus
    //
    // Ya NO bloqueamos el mouse.
    // =================================================

    canvas.addEventListener(
        "pointerdown",
        function (e) {

            // Evitamos comportamientos propios
            // del navegador.
            e.preventDefault();

            // Obtenemos la posición del canvas.
            const rect =
                canvas.getBoundingClientRect();

            const x =
                e.clientX -
                rect.left;

            const y =
                e.clientY -
                rect.top;

            // Buscamos qué círculo fue tocado.
            const circulo =
                buscarCirculo(x, y);

            // Si no tocamos ningún círculo,
            // no hacemos nada.
            if (!circulo) {
                return;
            }

            // Evitamos que dos dedos diferentes
            // seleccionen el mismo círculo.
            for (const dedo of dedos.values()) {

                if (
                    dedo.circulo === circulo
                ) {

                    return;
                }
            }

            // Guardamos el puntero.
            dedos.set(
                e.pointerId,
                {
                    circulo: circulo,
                    x: x,
                    y: y
                }
            );

            // Capturamos el puntero para seguir
            // recibiendo movimientos aunque salga
            // momentáneamente del canvas.
            try {

                canvas.setPointerCapture(
                    e.pointerId
                );

            } catch (error) {
                // Algunos navegadores pueden no
                // permitirlo; en ese caso continuamos.
            }

            // Actualizamos la selección.
            actualizarSeleccion();

            // Comprobamos si comienza una colaboración.
            comprobarUnion();
        }
    );


    // =================================================
    // POINTER MOVE
    // =================================================
    // Actualiza la posición del dedo o mouse.
    // =================================================

    canvas.addEventListener(
        "pointermove",
        function (e) {

            // Si este puntero no está participando,
            // no hacemos nada.
            if (!dedos.has(e.pointerId)) {
                return;
            }

            // Obtenemos posición relativa al canvas.
            const rect =
                canvas.getBoundingClientRect();

            const x =
                e.clientX -
                rect.left;

            const y =
                e.clientY -
                rect.top;

            // Obtenemos el dedo correspondiente.
            const dedo =
                dedos.get(e.pointerId);

            // Actualizamos su posición.
            dedo.x = x;

            dedo.y = y;

            // Comprobamos si se alejó demasiado
            // del círculo seleccionado.
            if (
                !comprobarPosicionDedo(dedo)
            ) {

                // Rompemos la colaboración.
                romperColaboracion();

                // Quitamos este puntero.
                dedos.delete(
                    e.pointerId
                );

                // Actualizamos la selección.
                actualizarSeleccion();

                return;
            }

            // Mantenemos actualizada la selección.
            actualizarSeleccion();

            // Volvemos a comprobar la unión.
            comprobarUnion();
        }
    );


    // =================================================
    // FINALIZAR DEDO / MOUSE
    // =================================================

    function terminarDedo(e) {

        // Si no existe este puntero,
        // no hacemos nada.
        if (!dedos.has(e.pointerId)) {
            return;
        }

        // Eliminamos el puntero.
        dedos.delete(
            e.pointerId
        );

        // Al soltar un dedo o mouse,
        // la colaboración se rompe.
        romperColaboracion();

        // Actualizamos los círculos.
        actualizarSeleccion();

        // Volvemos a comprobar la unión.
        comprobarUnion();
    }


    // =================================================
    // POINTER UP
    // =================================================

    canvas.addEventListener(
        "pointerup",
        terminarDedo
    );


    // =================================================
    // POINTER CANCEL
    // =================================================
    // Se utiliza cuando el navegador cancela
    // la interacción.
    // =================================================

    canvas.addEventListener(
        "pointercancel",
        terminarDedo
    );


    // =================================================
    // EVITAR SCROLL EN TOUCH
    // =================================================

    // Le indicamos al navegador que el canvas
    // controla directamente las interacciones táctiles.
    canvas.style.touchAction = "none";


    // =================================================
    // REDIMENSIONAR CANVAS
    // =================================================

    window.addEventListener(
        "resize",
        function () {

            // Ajustamos nuevamente el tamaño.
            ajustarCanvas();
        }
    );


    // =================================================
    // INICIAR EXPERIENCIA
    // =================================================

    // Configuramos el canvas.
    ajustarCanvas();

    // Comenzamos el ciclo de animación.
    animar();

});