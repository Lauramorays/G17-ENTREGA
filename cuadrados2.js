
// ============================================================
// HERENCIA
// ============================================================
// Este juego mantiene el mismo sistema visual y físico del inicio.
//
// INTERACCIÓN:
// - Comienza con 4 cuadrados.
// - Los cuadrados se mueven solos.
// - Tienen cuerpo físico y chocan entre sí.
// - Para activar HERENCIA se necesitan DOS dedos.
// - Los dos dedos deben tocar el MISMO cuadrado.
// - Al separar los dedos:
//      1. El cuadrado comienza a estirarse.
//      2. La tensión aumenta.
//      3. Cuando llega al límite, se divide.
//      4. Aparecen dos cuadrados hijos.
//      5. Los hijos heredan el color y características.
//      6. Los hijos se separan y continúan moviéndose.
//
// No se utiliza mouse.
// La interacción es exclusivamente táctil.
// ============================================================


// ============================================================
// CANVAS
// ============================================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


// ============================================================
// COLORES DEL SISTEMA
// ============================================================

const colores = [
    "#D9D9D9",
    "#8BB2D3",
    "#202D64",
    "#2B538E"
];


// ============================================================
// CONFIGURACIÓN GENERAL
// ============================================================

// Cantidad inicial de cuadrados.
const CANTIDAD_INICIAL = 4;

// Tamaño visual normal del cuadrado.
// Se mantiene cercano al lenguaje visual del sistema.
const TAMANO_INICIAL = 110;

// Radio físico.
// Este valor determina el espacio que ocupa el cuerpo.
const RADIO_BASE = 32;

// Velocidad máxima de movimiento.
// Es equivalente al sistema utilizado en el inicio.
const VELOCIDAD_BASE = 1.5;

// Rebote de las colisiones.
const REBOTE = 0.8;

// Distancia necesaria entre los dedos para comenzar
// a generar una separación importante.
const DISTANCIA_SEPARACION = 170;

// Distancia a partir de la cual se produce la división.
const DISTANCIA_RUPTURA = 230;

// Cuánto se reduce el tamaño de los hijos.
const REDUCCION_HIJO = 0.82;

// Tiempo que dura visualmente la tensión antes de dividirse.
const TIEMPO_TENSION = 180;


// ============================================================
// VARIABLES DEL JUEGO
// ============================================================

let figuras = [];


// Guarda los dos dedos que están participando
// en la interacción.
let dedoA = null;
let dedoB = null;


// Cuadrado que está siendo estirado.
let figuraEstirada = null;


// Tiempo acumulado de la tensión.
let tiempoTension = 0;


// Indica si actualmente hay una división en proceso.
let dividiendo = false;


// ============================================================
// AJUSTAR CANVAS
// ============================================================
// El canvas interno debe tener exactamente las dimensiones
// visibles para que las coordenadas táctiles coincidan.

function ajustarCanvas() {

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

}

ajustarCanvas();


// Cuando cambia el tamaño de la ventana,
// volvemos a ajustar el canvas.

window.addEventListener("resize", () => {

    ajustarCanvas();

    // Evitamos que las figuras queden fuera
    // después de cambiar el tamaño de la pantalla.

    figuras.forEach(figura => {

        controlarBordes(figura);

    });

});


// ============================================================
// CREAR CUADRADOS INICIALES
// ============================================================

function crearFiguras() {

    figuras = [];

    for (let i = 0; i < CANTIDAD_INICIAL; i++) {

        const figura = {

            // Tipo de objeto.
            tipo: "cuadrado",

            // Posición inicial aleatoria.
            x: Math.random() * (canvas.width - 160) + 80,
            y: Math.random() * (canvas.height - 160) + 80,

            // Tamaño visual.
            tamaño: TAMANO_INICIAL,

            // Velocidad.
            // Se utiliza el mismo rango que en el inicio.
            vx: (Math.random() - 0.5) * VELOCIDAD_BASE,
            vy: (Math.random() - 0.5) * VELOCIDAD_BASE,

            // Color heredable.
            color: colores[i % colores.length],

            // Cuerpo físico.
            radio: RADIO_BASE,

            // Generación.
            // Los iniciales son generación 0.
            generacion: 0,

            // Pequeña variación para que cada célula
            // tenga una respiración ligeramente distinta.
            fase: Math.random() * Math.PI * 2,

            // Velocidad de respiración.
            respiracion: 0.0015 + Math.random() * 0.001,

            // Escala actual.
            escala: 1,

            // Valores utilizados durante el estiramiento.
            estiramientoX: 1,
            estiramientoY: 1

        };

        figuras.push(figura);

    }

}

crearFiguras();


// ============================================================
// DIBUJAR CUADRADO
// ============================================================
// El cuadrado puede respirar y estirarse,
// pero siempre conserva una geometría cuadrada
// cuando no está siendo separado.

function dibujarFigura(figura) {

    ctx.save();

    ctx.translate(figura.x, figura.y);


    // --------------------------------------------------------
    // RESPIRACIÓN
    // --------------------------------------------------------
    // Movimiento orgánico muy pequeño.
    // Cuando no está siendo estirado, el objeto respira
    // uniformemente para no perder su forma cuadrada.

    const respiracion =
        1 +
        Math.sin(
            performance.now() * figura.respiracion +
            figura.fase
        ) * 0.025;


    // --------------------------------------------------------
    // ESCALA
    // --------------------------------------------------------

    let escalaX = respiracion * figura.estiramientoX;
    let escalaY = respiracion * figura.estiramientoY;

    ctx.scale(escalaX, escalaY);


    // --------------------------------------------------------
    // DIBUJO
    // --------------------------------------------------------

    ctx.beginPath();

    ctx.rect(
        -figura.tamaño / 2,
        -figura.tamaño / 2,
        figura.tamaño,
        figura.tamaño
    );


    // Color principal.
    ctx.fillStyle = figura.color;

    ctx.fill();


    // Borde muy sutil del mismo color.
    ctx.strokeStyle = figura.color;
    ctx.lineWidth = 2;

    ctx.stroke();


    // --------------------------------------------------------
    // TENSIÓN
    // --------------------------------------------------------
    // Cuando el cuadrado está siendo estirado,
    // aparece un brillo muy sutil.
    //
    // No se agrega ningún texto ni indicador.

    if (figura === figuraEstirada) {

        ctx.shadowBlur = 18;
        ctx.shadowColor = figura.color;

        ctx.beginPath();

        ctx.rect(
            -figura.tamaño / 2,
            -figura.tamaño / 2,
            figura.tamaño,
            figura.tamaño
        );

        ctx.strokeStyle = figura.color;
        ctx.lineWidth = 3;

        ctx.stroke();

        ctx.shadowBlur = 0;

    }


    ctx.restore();

}


// ============================================================
// CONTROLAR BORDES
// ============================================================
// El cuerpo físico nunca puede atravesar el borde del canvas.

function controlarBordes(figura) {

    if (figura.x - figura.radio < 0) {

        figura.x = figura.radio;
        figura.vx = Math.abs(figura.vx);

    }


    if (figura.x + figura.radio > canvas.width) {

        figura.x = canvas.width - figura.radio;
        figura.vx = -Math.abs(figura.vx);

    }


    if (figura.y - figura.radio < 0) {

        figura.y = figura.radio;
        figura.vy = Math.abs(figura.vy);

    }


    if (figura.y + figura.radio > canvas.height) {

        figura.y = canvas.height - figura.radio;
        figura.vy = -Math.abs(figura.vy);

    }

}


// ============================================================
// COLISIONES ENTRE CUADRADOS
// ============================================================
// Utilizamos prácticamente el mismo sistema de colisiones
// que tiene el inicio.
//
// Cada cuadrado tiene un "cuerpo" definido por su radio.
// Si dos cuerpos se superponen, se separan y rebotan.

function detectarColisiones() {

    for (let i = 0; i < figuras.length; i++) {

        for (let j = i + 1; j < figuras.length; j++) {

            const a = figuras[i];
            const b = figuras[j];


            const dx = b.x - a.x;
            const dy = b.y - a.y;

            const distancia =
                Math.sqrt(dx * dx + dy * dy);


            const distanciaMinima =
                a.radio + b.radio;


            if (
                distancia < distanciaMinima &&
                distancia > 0
            ) {

                // Vector normal de la colisión.

                const nx = dx / distancia;
                const ny = dy / distancia;


                // Cuánto se superpusieron.

                const separacion =
                    distanciaMinima - distancia;


                // Separamos ambos cuerpos.

                a.x -= nx * separacion * 0.5;
                a.y -= ny * separacion * 0.5;

                b.x += nx * separacion * 0.5;
                b.y += ny * separacion * 0.5;


                // Velocidad relativa.

                const velocidadRelativa =
                    (b.vx - a.vx) * nx +
                    (b.vy - a.vy) * ny;


                // Si se están acercando,
                // producimos un pequeño rebote.

                if (velocidadRelativa < 0) {

                    const impulso =
                        -(1 + REBOTE) *
                        velocidadRelativa /
                        2;


                    a.vx -= impulso * nx;
                    a.vy -= impulso * ny;

                    b.vx += impulso * nx;
                    b.vy += impulso * ny;

                }

            }

        }

    }

}


// ============================================================
// MOVIMIENTO
// ============================================================

function moverFiguras() {

    figuras.forEach(figura => {

        // ----------------------------------------------------
        // FIGURA ESTIRADA
        // ----------------------------------------------------
        // Mientras los dos dedos están actuando sobre ella,
        // la figura no se mueve libremente.
        //
        // Esto permite que el gesto se sienta físico.

        if (figura === figuraEstirada) {

            return;

        }


        // ----------------------------------------------------
        // MOVIMIENTO NORMAL
        // ----------------------------------------------------

        figura.x += figura.vx;
        figura.y += figura.vy;


        // ----------------------------------------------------
        // VARIACIÓN ORGÁNICA
        // ----------------------------------------------------
        // Pequeñas modificaciones en la dirección.
        // Esto evita que las figuras parezcan objetos
        // completamente mecánicos.

        figura.vx +=
            Math.sin(
                performance.now() * 0.00025 +
                figura.fase
            ) * 0.001;

        figura.vy +=
            Math.cos(
                performance.now() * 0.00025 +
                figura.fase
            ) * 0.001;


        // ----------------------------------------------------
        // LIMITAR VELOCIDAD
        // ----------------------------------------------------
        // Evitamos que las pequeñas variaciones acumuladas
        // hagan que una figura acelere demasiado.

        const velocidad =
            Math.sqrt(
                figura.vx * figura.vx +
                figura.vy * figura.vy
            );


        if (velocidad > VELOCIDAD_BASE) {

            figura.vx =
                (figura.vx / velocidad) *
                VELOCIDAD_BASE;

            figura.vy =
                (figura.vy / velocidad) *
                VELOCIDAD_BASE;

        }


        // ----------------------------------------------------
        // BORDES
        // ----------------------------------------------------

        controlarBordes(figura);

    });


    // Las colisiones se realizan después del movimiento.
    detectarColisiones();

}


// ============================================================
// OBTENER COORDENADAS TÁCTILES
// ============================================================
// Convierte la posición de la pantalla a la posición real
// dentro del canvas.

function obtenerCoordenadas(clientX, clientY) {

    const rect =
        canvas.getBoundingClientRect();


    return {

        x:
            (clientX - rect.left) *
            canvas.width /
            rect.width,

        y:
            (clientY - rect.top) *
            canvas.height /
            rect.height

    };

}


// ============================================================
// DETECTAR CUADRADO TOCADO
// ============================================================

function detectarFiguraTocada(x, y) {

    // Comenzamos desde el último objeto creado.
    // Esto permite detectar correctamente el que está arriba.

    for (
        let i = figuras.length - 1;
        i >= 0;
        i--
    ) {

        const figura = figuras[i];


        const dx = x - figura.x;
        const dy = y - figura.y;


        const distancia =
            Math.sqrt(dx * dx + dy * dy);


        if (distancia <= figura.radio) {

            return figura;

        }

    }


    return null;

}


// ============================================================
// INICIAR ESTIRAMIENTO
// ============================================================
// Ambos dedos deben comenzar sobre el mismo cuadrado.

function iniciarEstiramiento(touch1, touch2) {

    const posicion1 =
        obtenerCoordenadas(
            touch1.clientX,
            touch1.clientY
        );


    const posicion2 =
        obtenerCoordenadas(
            touch2.clientX,
            touch2.clientY
        );


    const figura1 =
        detectarFiguraTocada(
            posicion1.x,
            posicion1.y
        );


    const figura2 =
        detectarFiguraTocada(
            posicion2.x,
            posicion2.y
        );


    // Si los dedos no están sobre el mismo cuadrado,
    // no se inicia ninguna interacción.

    if (
        !figura1 ||
        !figura2 ||
        figura1 !== figura2
    ) {

        dedoA = null;
        dedoB = null;
        figuraEstirada = null;

        return;

    }


    // Guardamos ambos dedos.

    dedoA = {

        id: touch1.identifier,

        x: posicion1.x,
        y: posicion1.y

    };


    dedoB = {

        id: touch2.identifier,

        x: posicion2.x,
        y: posicion2.y

    };


    // Guardamos el cuadrado.

    figuraEstirada = figura1;


    // Reiniciamos la tensión.

    tiempoTension = 0;

}


// ============================================================
// ACTUALIZAR ESTIRAMIENTO
// ============================================================

function actualizarEstiramiento(touch1, touch2) {

    if (!figuraEstirada) return;


    const posicion1 =
        obtenerCoordenadas(
            touch1.clientX,
            touch1.clientY
        );


    const posicion2 =
        obtenerCoordenadas(
            touch2.clientX,
            touch2.clientY
        );


    // --------------------------------------------------------
    // DISTANCIA ENTRE LOS DEDOS
    // --------------------------------------------------------

    const dx =
        posicion2.x - posicion1.x;

    const dy =
        posicion2.y - posicion1.y;


    const distancia =
        Math.sqrt(dx * dx + dy * dy);


    // --------------------------------------------------------
    // ÁNGULO DEL ESTIRAMIENTO
    // --------------------------------------------------------

    const angulo =
        Math.atan2(dy, dx);


    // --------------------------------------------------------
    // TENSIÓN
    // --------------------------------------------------------
    // Antes de dividirse, el objeto se estira.
    //
    // La escala máxima está limitada para que nunca
    // se deforme indefinidamente.

    const progreso =
        Math.min(
            distancia / DISTANCIA_RUPTURA,
            1
        );


    const estiramiento =
        1 +
        progreso * 0.65;


    // --------------------------------------------------------
    // ESTIRAMIENTO SEGÚN DIRECCIÓN
    // --------------------------------------------------------
    // Se calcula cuánto del estiramiento corresponde
    // al eje horizontal y cuánto al vertical.
    //
    // Esto hace que el objeto se estire hacia la dirección
    // real de los dedos.

    const horizontal =
        Math.abs(Math.cos(angulo));

    const vertical =
        Math.abs(Math.sin(angulo));


    figuraEstirada.estiramientoX =
        1 +
        (estiramiento - 1) *
        (0.35 + horizontal * 0.65);


    figuraEstirada.estiramientoY =
        1 +
        (estiramiento - 1) *
        (0.35 + vertical * 0.65);


    // --------------------------------------------------------
    // TIEMPO DE TENSIÓN
    // --------------------------------------------------------

    if (distancia > DISTANCIA_SEPARACION) {

        tiempoTension += 1;

    } else {

        // Si los dedos vuelven a acercarse,
        // la tensión disminuye.

        tiempoTension =
            Math.max(
                0,
                tiempoTension - 3
            );

    }


    // --------------------------------------------------------
    // RUPTURA
    // --------------------------------------------------------

    if (
        distancia >= DISTANCIA_RUPTURA &&
        tiempoTension >= TIEMPO_TENSION
    ) {

        dividirFigura();

    }

}


// ============================================================
// CREAR HIJOS
// ============================================================
// Cuando un cuadrado se divide,
// aparecen dos cuadrados nuevos.
//
// Los dos heredan:
// - color
// - generación
// - características visuales
//
// Pero adquieren nuevas posiciones y velocidades.

function dividirFigura() {

    if (!figuraEstirada) return;

    if (dividiendo) return;

    dividiendo = true;


    const padre = figuraEstirada;


    // --------------------------------------------------------
    // DIRECCIÓN DE SEPARACIÓN
    // --------------------------------------------------------

    let dx =
        dedoB.x - dedoA.x;

    let dy =
        dedoB.y - dedoA.y;


    const distancia =
        Math.sqrt(dx * dx + dy * dy);


    // Si por alguna razón la distancia es 0,
    // usamos una dirección horizontal.

    if (distancia === 0) {

        dx = 1;
        dy = 0;

    } else {

        dx /= distancia;
        dy /= distancia;

    }


    // --------------------------------------------------------
    // TAMAÑO DEL HIJO
    // --------------------------------------------------------

    const tamañoHijo =
        padre.tamaño *
        REDUCCION_HIJO;


    // El radio también disminuye.

    const radioHijo =
        padre.radio *
        REDUCCION_HIJO;


    // --------------------------------------------------------
    // DISTANCIA INICIAL ENTRE HIJOS
    // --------------------------------------------------------

    const separacionInicial = 65;


    // --------------------------------------------------------
    // HIJO 1
    // --------------------------------------------------------

    const hijo1 = {

        tipo: "cuadrado",

        x:
            padre.x -
            dx * separacionInicial,

        y:
            padre.y -
            dy * separacionInicial,

        tamaño: tamañoHijo,

        // Movimiento heredado + impulso de separación.

        vx:
            padre.vx -
            dx * 0.75,

        vy:
            padre.vy -
            dy * 0.75,

        color: padre.color,

        radio: radioHijo,

        generacion:
            padre.generacion + 1,

        fase:
            Math.random() * Math.PI * 2,

        respiracion:
            0.0015 +
            Math.random() * 0.001,

        escala: 1,

        estiramientoX: 1,

        estiramientoY: 1

    };


    // --------------------------------------------------------
    // HIJO 2
    // --------------------------------------------------------

    const hijo2 = {

        tipo: "cuadrado",

        x:
            padre.x +
            dx * separacionInicial,

        y:
            padre.y +
            dy * separacionInicial,

        tamaño: tamañoHijo,

        vx:
            padre.vx +
            dx * 0.75,

        vy:
            padre.vy +
            dy * 0.75,

        color: padre.color,

        radio: radioHijo,

        generacion:
            padre.generacion + 1,

        fase:
            Math.random() * Math.PI * 2,

        respiracion:
            0.0015 +
            Math.random() * 0.001,

        escala: 1,

        estiramientoX: 1,

        estiramientoY: 1

    };


    // --------------------------------------------------------
    // REEMPLAZAR PADRE
    // --------------------------------------------------------
    // El padre deja de existir físicamente.
    // La idea es que los dos hijos sean la continuación
    // de su "herencia".

    const indice =
        figuras.indexOf(padre);


    if (indice !== -1) {

        figuras.splice(
            indice,
            1,
            hijo1,
            hijo2
        );

    }


    // --------------------------------------------------------
    // REINICIAR ESTADO
    // --------------------------------------------------------

    figuraEstirada = null;

    dedoA = null;
    dedoB = null;

    tiempoTension = 0;

    dividiendo = false;


    // Nos aseguramos de que los hijos
    // comiencen dentro del área del juego.

    controlarBordes(hijo1);
    controlarBordes(hijo2);

}


// ============================================================
// ANIMACIÓN
// ============================================================

function animar() {

    // Limpiamos todo el canvas.

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Actualizamos el movimiento.

    moverFiguras();


    // Actualizamos visualmente el estiramiento
    // si los dos dedos continúan activos.

    if (
        dedoA &&
        dedoB &&
        figuraEstirada
    ) {

        actualizarEstiramiento(
            {
                clientX: dedoA.x,
                clientY: dedoA.y,
                identifier: dedoA.id
            },
            {
                clientX: dedoB.x,
                clientY: dedoB.y,
                identifier: dedoB.id
            }
        );

    }


    // Dibujamos todos los cuadrados.

    figuras.forEach(figura => {

        dibujarFigura(figura);

    });


    // Repetimos la animación.

    requestAnimationFrame(animar);

}

animar();


// ============================================================
// TOUCHSTART
// ============================================================
// Se ejecuta cuando aparecen dedos sobre la pantalla.
//
// Solamente nos interesan dos dedos.

canvas.addEventListener(
    "touchstart",
    function(event) {

        event.preventDefault();


        // Necesitamos exactamente dos dedos
        // para comenzar la separación.

        if (event.touches.length !== 2) return;


        const touch1 = event.touches[0];
        const touch2 = event.touches[1];


        iniciarEstiramiento(
            touch1,
            touch2
        );

    },
    {
        passive: false
    }
);


// ============================================================
// TOUCHMOVE
// ============================================================
// Mientras los dos dedos se separan,
// actualizamos el estiramiento.

canvas.addEventListener(
    "touchmove",
    function(event) {

        event.preventDefault();


        if (
            event.touches.length !== 2 ||
            !figuraEstirada
        ) {

            return;

        }


        const touch1 = event.touches[0];
        const touch2 = event.touches[1];


        // Actualizamos las posiciones reales
        // de los dedos.

        const posicion1 =
            obtenerCoordenadas(
                touch1.clientX,
                touch1.clientY
            );


        const posicion2 =
            obtenerCoordenadas(
                touch2.clientX,
                touch2.clientY
            );


        dedoA.x = posicion1.x;
        dedoA.y = posicion1.y;

        dedoB.x = posicion2.x;
        dedoB.y = posicion2.y;


        actualizarEstiramiento(
            touch1,
            touch2
        );

    },
    {
        passive: false
    }
);


// ============================================================
// TOUCHEND
// ============================================================
// Cuando uno de los dedos se levanta,
// termina la interacción.
//
// El cuadrado vuelve progresivamente a su forma normal.

canvas.addEventListener(
    "touchend",
    function(event) {

        event.preventDefault();


        if (
            event.touches.length < 2 &&
            figuraEstirada
        ) {

            figuraEstirada.estiramientoX = 1;
            figuraEstirada.estiramientoY = 1;

        }


        if (event.touches.length < 2) {

            dedoA = null;
            dedoB = null;

            figuraEstirada = null;

            tiempoTension = 0;

        }

    },
    {
        passive: false
    }
);


// ============================================================
// TOUCHCANCEL
// ============================================================
// Algunos dispositivos cancelan un gesto,
// por ejemplo al cambiar de aplicación,
// recibir una interrupción del sistema, etc.

canvas.addEventListener(
    "touchcancel",
    function(event) {

        event.preventDefault();


        if (figuraEstirada) {

            figuraEstirada.estiramientoX = 1;
            figuraEstirada.estiramientoY = 1;

        }


        dedoA = null;
        dedoB = null;

        figuraEstirada = null;

        tiempoTension = 0;

    },
    {
        passive: false
    }
);

