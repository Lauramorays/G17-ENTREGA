// ============================================================
// HERENCIA
// cuadrados2.js
// ============================================================
//
// INTERACCIÓN:
// - Comienzan 4 cuadrados.
// - Se mueven solos.
// - Chocan entre ellos y con los bordes.
// - Para activar HERENCIA se necesitan 2 dedos.
// - Los dos dedos deben tocar el mismo cuadrado.
// - Al separar los dedos, el cuadrado primero se ESTIRA.
// - Si los dedos se separan lo suficiente, el cuadrado se DIVIDE.
// - Los dos nuevos cuadrados heredan el color y características
//   del cuadrado original.
// ============================================================


// ============================================================
// CANVAS
// ============================================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


// ============================================================
// COLORES
// ============================================================

const COLORES = [
    "#D9D9D9",
    "#8BB2D3",
    "#202D64",
    "#2B538E"
];


// ============================================================
// CONFIGURACIÓN
// ============================================================

// Tamaño de los cuadrados iniciales.
const TAMANO_INICIAL = 110;

// Distancia que deben alcanzar los dedos para provocar
// la separación.
const DISTANCIA_SEPARACION = 180;

// Tamaño que tendrán los hijos respecto al padre.
const REDUCCION_HIJO = 0.82;

// Velocidad máxima de movimiento.
const VELOCIDAD = 0.7;

// Fuerza del choque entre cuadrados.
const FUERZA_CHOQUE = 0.8;


// ============================================================
// ARRAY DE FIGURAS
// ============================================================

let figuras = [];


// ============================================================
// VARIABLES DEL GESTO TÁCTIL
// ============================================================

// Indica si estamos realizando una interacción.
let gestoActivo = false;

// Figura que estamos manipulando.
let figuraSeleccionada = null;

// Identificador del primer dedo.
let dedo1ID = null;

// Identificador del segundo dedo.
let dedo2ID = null;

// Posición del primer dedo.
let dedo1 = {
    x: 0,
    y: 0
};

// Posición del segundo dedo.
let dedo2 = {
    x: 0,
    y: 0
};

// Distancia que había entre los dedos
// cuando comenzó el gesto.
let distanciaInicial = 0;


// ============================================================
// AJUSTAR CANVAS
// ============================================================

function ajustarCanvas() {

    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;
}


// ============================================================
// CREAR FIGURA
// ============================================================

function crearFigura(x, y, color, tamano = TAMANO_INICIAL) {

    return {

        // Posición.
        x: x,
        y: y,

        // Tamaño.
        tamano: tamano,

        // Color.
        color: color,

        // Movimiento horizontal.
        vx: (Math.random() - 0.5) * VELOCIDAD,

        // Movimiento vertical.
        vy: (Math.random() - 0.5) * VELOCIDAD,

        // Rotación.
        rotacion: Math.random() * Math.PI * 2,

        // Velocidad de rotación.
        velocidadRotacion:
            (Math.random() - 0.5) * 0.004,

        // Movimiento orgánico.
        fase: Math.random() * Math.PI * 2,

        // Generación de la figura.
        generacion: 0,

        // Cantidad de veces que se reprodujo.
        reproducciones: 0,

        // Indica si actualmente está siendo estirada.
        estirando: false,

        // Escala horizontal durante el estiramiento.
        escalaX: 1,

        // Escala vertical.
        escalaY: 1,

        // Ángulo del estiramiento.
        anguloEstiramiento: 0
    };
}


// ============================================================
// CREAR LAS 4 FIGURAS INICIALES
// ============================================================

function crearFigurasIniciales() {

    figuras = [];

    // Cuadrado 1.
    figuras.push(
        crearFigura(
            canvas.width * 0.25,
            canvas.height * 0.30,
            COLORES[0]
        )
    );

    // Cuadrado 2.
    figuras.push(
        crearFigura(
            canvas.width * 0.75,
            canvas.height * 0.30,
            COLORES[1]
        )
    );

    // Cuadrado 3.
    figuras.push(
        crearFigura(
            canvas.width * 0.25,
            canvas.height * 0.70,
            COLORES[2]
        )
    );

    // Cuadrado 4.
    figuras.push(
        crearFigura(
            canvas.width * 0.75,
            canvas.height * 0.70,
            COLORES[3]
        )
    );
}


// ============================================================
// LIMITAR FIGURA A LOS BORDES
// ============================================================

function limitarFigura(figura) {

    const radio = figura.tamano / 2;

    // Borde izquierdo.
    if (figura.x - radio < 0) {

        figura.x = radio;

        figura.vx *= -1;
    }

    // Borde derecho.
    if (figura.x + radio > canvas.width) {

        figura.x =
            canvas.width - radio;

        figura.vx *= -1;
    }

    // Borde superior.
    if (figura.y - radio < 0) {

        figura.y = radio;

        figura.vy *= -1;
    }

    // Borde inferior.
    if (figura.y + radio > canvas.height) {

        figura.y =
            canvas.height - radio;

        figura.vy *= -1;
    }
}


// ============================================================
// ACTUALIZAR MOVIMIENTO
// ============================================================

function actualizarMovimiento() {

    figuras.forEach(figura => {

        // Si la figura está siendo manipulada
        // dejamos de moverla automáticamente.
        if (
            figura === figuraSeleccionada &&
            gestoActivo
        ) {
            return;
        }

        // Movimiento principal.
        figura.x += figura.vx;
        figura.y += figura.vy;

        // Movimiento orgánico muy suave.
        figura.fase += 0.015;

        figura.x +=
            Math.sin(figura.fase) * 0.15;

        figura.y +=
            Math.cos(figura.fase * 0.8) * 0.15;

        // Rotación lenta.
        figura.rotacion +=
            figura.velocidadRotacion;

        // Evitar que salga de la pantalla.
        limitarFigura(figura);
    });
}


// ============================================================
// COLISIONES ENTRE FIGURAS
// ============================================================

function detectarColisiones() {

    for (let i = 0; i < figuras.length; i++) {

        for (let j = i + 1; j < figuras.length; j++) {

            const a = figuras[i];
            const b = figuras[j];

            const dx = b.x - a.x;
            const dy = b.y - a.y;

            const distancia =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );

            const distanciaMinima =
                (a.tamano + b.tamano) / 2;

            // Si las figuras están chocando.
            if (
                distancia < distanciaMinima &&
                distancia > 0
            ) {

                const nx =
                    dx / distancia;

                const ny =
                    dy / distancia;

                // Cuánto se superponen.
                const solapamiento =
                    distanciaMinima - distancia;

                // Separamos las dos figuras.
                a.x -=
                    nx * solapamiento * 0.5;

                a.y -=
                    ny * solapamiento * 0.5;

                b.x +=
                    nx * solapamiento * 0.5;

                b.y +=
                    ny * solapamiento * 0.5;

                // Pequeño impulso.
                a.vx -=
                    nx * FUERZA_CHOQUE;

                a.vy -=
                    ny * FUERZA_CHOQUE;

                b.vx +=
                    nx * FUERZA_CHOQUE;

                b.vy +=
                    ny * FUERZA_CHOQUE;

                limitarFigura(a);
                limitarFigura(b);
            }
        }
    }
}


// ============================================================
// BUSCAR QUÉ FIGURA ESTÁ DEBAJO DE UN DEDO
// ============================================================

function buscarFigura(x, y) {

    for (
        let i = figuras.length - 1;
        i >= 0;
        i--
    ) {

        const figura = figuras[i];

        const mitad =
            figura.tamano / 2;

        if (
            x >= figura.x - mitad &&
            x <= figura.x + mitad &&
            y >= figura.y - mitad &&
            y <= figura.y + mitad
        ) {

            return figura;
        }
    }

    return null;
}


// ============================================================
// DISTANCIA ENTRE LOS DOS DEDOS
// ============================================================

function calcularDistancia() {

    const dx =
        dedo2.x - dedo1.x;

    const dy =
        dedo2.y - dedo1.y;

    return Math.sqrt(
        dx * dx +
        dy * dy
    );
}


// ============================================================
// OBTENER POSICIÓN DEL TOUCH
// ============================================================

function obtenerTouch(touch) {

    const rect =
        canvas.getBoundingClientRect();

    return {

        x:
            touch.clientX - rect.left,

        y:
            touch.clientY - rect.top
    };
}


// ============================================================
// COMENZAR GESTO
// ============================================================

function comenzarGesto() {

    // Buscamos qué figura está debajo
    // de cada dedo.
    const figura1 =
        buscarFigura(
            dedo1.x,
            dedo1.y
        );

    const figura2 =
        buscarFigura(
            dedo2.x,
            dedo2.y
        );

    // Los dos dedos tienen que estar
    // sobre el mismo cuadrado.
    if (
        !figura1 ||
        !figura2 ||
        figura1 !== figura2
    ) {
        return;
    }

    // Guardamos la figura.
    figuraSeleccionada =
        figura1;

    // Guardamos la distancia inicial.
    distanciaInicial =
        calcularDistancia();

    // Activamos el gesto.
    gestoActivo = true;

    // Indicamos que se está estirando.
    figuraSeleccionada.estirando =
        true;
}


// ============================================================
// ACTUALIZAR ESTIRAMIENTO
// ============================================================

function actualizarGesto() {

    if (
        !gestoActivo ||
        !figuraSeleccionada
    ) {
        return;
    }

    // Calculamos la distancia actual.
    const distanciaActual =
        calcularDistancia();

    // Cuánto aumentó la distancia.
    const aumento =
        Math.max(
            0,
            distanciaActual -
            distanciaInicial
        );

    // Calculamos cuánto se estira.
    let escala =
        1 +
        aumento /
        DISTANCIA_SEPARACION *
        0.65;

    // Evitamos una deformación exagerada.
    escala =
        Math.min(
            escala,
            1.65
        );

    // Dirección entre los dedos.
    const angulo =
        Math.atan2(
            dedo2.y - dedo1.y,
            dedo2.x - dedo1.x
        );

    // Aplicamos el estiramiento.
    figuraSeleccionada.escalaX =
        escala;

    figuraSeleccionada.escalaY =
        1;

    figuraSeleccionada.anguloEstiramiento =
        angulo;

    // Cuando llega a la distancia necesaria,
    // se produce la herencia.
    if (
        distanciaActual >=
        DISTANCIA_SEPARACION
    ) {

        crearHijos(
            figuraSeleccionada
        );
    }
}


// ============================================================
// CREAR LOS DOS HIJOS
// ============================================================

function crearHijos(padre) {

    // Evitamos que el gesto se ejecute dos veces.
    if (!padre) {
        return;
    }

    // Dirección en la que estaban separados
    // los dos dedos.
    const dx =
        dedo2.x - dedo1.x;

    const dy =
        dedo2.y - dedo1.y;

    const distancia =
        Math.sqrt(
            dx * dx +
            dy * dy
        );

    // Vector normalizado.
    let nx = 1;
    let ny = 0;

    if (distancia > 0) {

        nx =
            dx / distancia;

        ny =
            dy / distancia;
    }

    // Los hijos son un poco más pequeños.
    const tamanoHijo =
        padre.tamano *
        REDUCCION_HIJO;

    // Distancia inicial de separación.
    const distanciaHijo = 35;

    // Posición del primer hijo.
    let x1 =
        padre.x -
        nx * distanciaHijo;

    let y1 =
        padre.y -
        ny * distanciaHijo;

    // Posición del segundo hijo.
    let x2 =
        padre.x +
        nx * distanciaHijo;

    let y2 =
        padre.y +
        ny * distanciaHijo;

    // Evitamos que los hijos aparezcan
    // fuera del canvas.
    const radio =
        tamanoHijo / 2;

    x1 =
        Math.max(
            radio,
            Math.min(
                canvas.width - radio,
                x1
            )
        );

    y1 =
        Math.max(
            radio,
            Math.min(
                canvas.height - radio,
                y1
            )
        );

    x2 =
        Math.max(
            radio,
            Math.min(
                canvas.width - radio,
                x2
            )
        );

    y2 =
        Math.max(
            radio,
            Math.min(
                canvas.height - radio,
                y2
            )
        );


    // ========================================================
    // CREAR HIJO 1
    // ========================================================

    const hijo1 =
        crearFigura(
            x1,
            y1,
            padre.color,
            tamanoHijo
        );

    // Hereda la generación.
    hijo1.generacion =
        padre.generacion + 1;

    // Se mueve en dirección contraria.
    hijo1.vx =
        padre.vx -
        nx * 1.1;

    hijo1.vy =
        padre.vy -
        ny * 1.1;


    // ========================================================
    // CREAR HIJO 2
    // ========================================================

    const hijo2 =
        crearFigura(
            x2,
            y2,
            padre.color,
            tamanoHijo
        );

    // Hereda la generación.
    hijo2.generacion =
        padre.generacion + 1;

    // Se mueve en la dirección opuesta.
    hijo2.vx =
        padre.vx +
        nx * 1.1;

    hijo2.vy =
        padre.vy +
        ny * 1.1;


    // ========================================================
    // AGREGAR LOS HIJOS
    // ========================================================

    figuras.push(
        hijo1,
        hijo2
    );


    // ========================================================
    // RESTAURAR EL PADRE
    // ========================================================

    padre.estirando =
        false;

    padre.escalaX =
        1;

    padre.escalaY =
        1;

    padre.reproducciones++;


    // ========================================================
    // FINALIZAR GESTO
    // ========================================================

    gestoActivo =
        false;

    figuraSeleccionada =
        null;

    dedo1ID =
        null;

    dedo2ID =
        null;
}


// ============================================================
// DIBUJAR UNA FIGURA
// ============================================================

function dibujarFigura(figura) {

    ctx.save();

    // Nos movemos al centro de la figura.
    ctx.translate(
        figura.x,
        figura.y
    );

    // Rotación normal.
    ctx.rotate(
        figura.rotacion
    );

    // Si está siendo estirada,
    // aplicamos la transformación.
    if (figura.estirando) {

        // Ajustamos la dirección del estiramiento.
        ctx.rotate(
            figura.anguloEstiramiento -
            figura.rotacion
        );

        // Estiramos solamente sobre el eje X.
        ctx.scale(
            figura.escalaX,
            figura.escalaY
        );
    }

    // Color de la figura.
    ctx.fillStyle =
        figura.color;

    // Dibujamos el cuadrado.
    ctx.fillRect(
        -figura.tamano / 2,
        -figura.tamano / 2,
        figura.tamano,
        figura.tamano
    );

    ctx.restore();
}


// ============================================================
// DIBUJAR TODO EL ESCENARIO
// ============================================================

function dibujar() {

    // Limpiamos todo.
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Dibujamos cada cuadrado.
    figuras.forEach(
        dibujarFigura
    );
}


// ============================================================
// BUCLE DE ANIMACIÓN
// ============================================================

function animar() {

    // Movimiento automático.
    actualizarMovimiento();

    // Colisiones.
    detectarColisiones();

    // Dibujar.
    dibujar();

    // Repetir.
    requestAnimationFrame(
        animar
    );
}


// ============================================================
// TOUCHSTART
// ============================================================

canvas.addEventListener(
    "touchstart",
    function(evento) {

        // Evita zoom, desplazamiento y otros
        // comportamientos del navegador.
        evento.preventDefault();

        // Solo nos interesan dos dedos.
        if (
            evento.touches.length !== 2
        ) {
            return;
        }

        // Obtenemos los dos dedos.
        const touch1 =
            evento.touches[0];

        const touch2 =
            evento.touches[1];

        // Guardamos sus identificadores.
        dedo1ID =
            touch1.identifier;

        dedo2ID =
            touch2.identifier;

        // Guardamos posiciones.
        dedo1 =
            obtenerTouch(touch1);

        dedo2 =
            obtenerTouch(touch2);

        // Intentamos comenzar el gesto.
        comenzarGesto();
    },
    {
        passive: false
    }
);


// ============================================================
// TOUCHMOVE
// ============================================================

canvas.addEventListener(
    "touchmove",
    function(evento) {

        evento.preventDefault();

        // Si no estamos haciendo un gesto,
        // no hacemos nada.
        if (!gestoActivo) {
            return;
        }

        // Buscamos nuestros dos dedos.
        for (
            let i = 0;
            i < evento.touches.length;
            i++
        ) {

            const touch =
                evento.touches[i];

            // Actualizamos el primer dedo.
            if (
                touch.identifier === dedo1ID
            ) {

                dedo1 =
                    obtenerTouch(touch);
            }

            // Actualizamos el segundo dedo.
            if (
                touch.identifier === dedo2ID
            ) {

                dedo2 =
                    obtenerTouch(touch);
            }
        }

        // Actualizamos el estiramiento.
        actualizarGesto();
    },
    {
        passive: false
    }
);


// ============================================================
// FINALIZAR TOUCH
// ============================================================

function finalizarGesto(evento) {

    evento.preventDefault();

    // Si soltamos uno de los dedos antes
    // de completar la separación,
    // cancelamos el estiramiento.
    if (
        gestoActivo &&
        evento.touches.length < 2
    ) {

        if (figuraSeleccionada) {

            figuraSeleccionada.estirando =
                false;

            figuraSeleccionada.escalaX =
                1;

            figuraSeleccionada.escalaY =
                1;
        }

        gestoActivo =
            false;

        figuraSeleccionada =
            null;

        dedo1ID =
            null;

        dedo2ID =
            null;
    }
}


// ============================================================
// TOUCHEND
// ============================================================

canvas.addEventListener(
    "touchend",
    finalizarGesto,
    {
        passive: false
    }
);


// ============================================================
// TOUCHCANCEL
// ============================================================

canvas.addEventListener(
    "touchcancel",
    finalizarGesto,
    {
        passive: false
    }
);


// ============================================================
// INICIALIZACIÓN
// ============================================================

// Ajustamos el canvas.
ajustarCanvas();

// Creamos las 4 figuras.
crearFigurasIniciales();

// Iniciamos la animación.
animar();


// ============================================================
// CAMBIO DE TAMAÑO
// ============================================================

window.addEventListener(
    "resize",
    function() {

        // Recalculamos el tamaño del canvas.
        ajustarCanvas();

        // Evitamos que alguna figura quede afuera.
        figuras.forEach(
            limitarFigura
        );
    }
);