// ============================================================
// CUADRADOS 3 - CADUCIDAD
// ============================================================
//
// INTERACCIÓN:
//
// - Comienzan 4 cuadrados.
// - Se mueven solos.
// - Chocan entre ellos y con los bordes.
// - Movimiento orgánico.
// - Respiración visual como en MEMORIA.
// - Con UN dedo / mouse se puede agarrar y mover un cuadrado.
// - Con DOS dedos se pueden agarrar DOS cuadrados diferentes.
// - Al acercar los dos cuadrados comienza la CADUCIDAD.
// - El desgaste es lento y progresivo.
// - El cuadrado pierde tamaño lentamente.
// - La opacidad prácticamente se mantiene.
// - Aparecen pequeños restos que se desprenden y caen.
// - El borde se desgasta de manera irregular mientras se toca.
// - AL SOLTAR:
//      • mantiene el tamaño que perdió
//      • recupera lentamente su forma cuadrada
// - Con el paso del tiempo pierde energía y se mueve cada vez más lento.
// - Cuando llega al tamaño mínimo, desaparece.
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

const COLOR_SELECCION = "#C4CEE5";


// ============================================================
// CONFIGURACIÓN
// ============================================================

const TAMANO_INICIAL = 110;

// Cuando llega a este tamaño,
// ya no puede continuar la interacción
// y desaparece.
const TAMANO_MINIMO = 25;

const VELOCIDAD = 0.7;

const FUERZA_CHOQUE = 0.8;


// ============================================================
// CADUCIDAD
// ============================================================

const VELOCIDAD_CADUCIDAD = 0.0018;

const DISTANCIA_CADUCIDAD = 145;


// ============================================================
// RECUPERACIÓN DE LA FORMA
// ============================================================
//
// IMPORTANTE:
//
// Esto NO recupera el tamaño.
//
// Solamente hace que el borde vuelva
// lentamente a ser un cuadrado regular
// cuando se sueltan los dedos.
//

const VELOCIDAD_RECUPERACION_FORMA = 0.025;


// ============================================================
// PÉRDIDA DE ENERGÍA
// ============================================================
//
// Cuanto más tiempo pasa,
// más lentamente se mueven.
//
// No se detienen inmediatamente.
// La pérdida es progresiva.
//

const PERDIDA_ENERGIA = 0.9997;

const VELOCIDAD_MINIMA = 0.025;


// ============================================================
// RESTOS
// ============================================================

let restos = [];


// ============================================================
// FIGURAS
// ============================================================

let figuras = [];


// ============================================================
// PUNTEROS
// ============================================================

const punteros = new Map();


// ============================================================
// MOUSE
// ============================================================

let mouseActivo = false;
let mouseFigura = null;


// ============================================================
// AJUSTAR CANVAS
// ============================================================

function ajustarCanvas() {

    const rect =
        canvas.getBoundingClientRect();

    canvas.width =
        rect.width;

    canvas.height =
        rect.height;
}


// ============================================================
// CREAR FIGURA
// ============================================================

function crearFigura(x, y, color) {

    return {

        // ----------------------------------------------------
        // POSICIÓN
        // ----------------------------------------------------

        x: x,
        y: y,

        // ----------------------------------------------------
        // TAMAÑO
        // ----------------------------------------------------

        tamano:
            TAMANO_INICIAL,

        tamanoOriginal:
            TAMANO_INICIAL,

        // ----------------------------------------------------
        // COLOR
        // ----------------------------------------------------

        color:
            color,

        // ----------------------------------------------------
        // MOVIMIENTO
        // ----------------------------------------------------

        vx:
            (Math.random() - 0.5) *
            VELOCIDAD,

        vy:
            (Math.random() - 0.5) *
            VELOCIDAD,

        // ----------------------------------------------------
        // ENERGÍA
        // ----------------------------------------------------

        energia:
            1,

        // ----------------------------------------------------
        // ROTACIÓN
        // ----------------------------------------------------

        rotacion:
            (Math.random() - 0.5) *
            4,

        velocidadRotacion:
            (Math.random() - 0.5) *
            0.015,

        // ----------------------------------------------------
        // MOVIMIENTO ORGÁNICO
        // ----------------------------------------------------

        fase:
            Math.random() *
            Math.PI *
            2,

        // ----------------------------------------------------
        // RESPIRACIÓN
        // ----------------------------------------------------

        faseRespiracion:
            Math.random() *
            Math.PI *
            2,

        faseSecundaria:
            Math.random() *
            Math.PI *
            2,

        velocidadRespiracion:
            0.012 +
            Math.random() *
            0.005,

        amplitudRespiracion:
            0.045 +
            Math.random() *
            0.015,

        respiracionX:
            1,

        respiracionY:
            1,

        // ----------------------------------------------------
        // MOVIMIENTO VERTICAL
        // ----------------------------------------------------

        faseVertical:
            Math.random() *
            Math.PI *
            2,

        velocidadVertical:
            0.008 +
            Math.random() *
            0.008,

        // ----------------------------------------------------
        // EMPUJE
        // ----------------------------------------------------

        empujeX:
            0,

        empujeY:
            0,

        // ----------------------------------------------------
        // CADUCIDAD
        // ----------------------------------------------------

        caducidad:
            0,

        desgaste:
            0,

        // ----------------------------------------------------
        // RECUPERACIÓN DE FORMA
        // ----------------------------------------------------
        //
        // 1 = totalmente deformado
        // 0 = cuadrado perfecto
        //

        deformacionForma:
            0,

        // ----------------------------------------------------
        // ESTADO
        // ----------------------------------------------------

        siendoArrastrada:
            false,

        enCaducidad:
            false,

        activa:
            true,

        // ----------------------------------------------------
        // RESTOS
        // ----------------------------------------------------

        tiempoRestos:
            Math.random() * 100
    };
}


// ============================================================
// CREAR FIGURAS INICIALES
// ============================================================

function crearFigurasIniciales() {

    figuras = [];

    figuras.push(
        crearFigura(
            canvas.width * 0.25,
            canvas.height * 0.30,
            COLORES[0]
        )
    );

    figuras.push(
        crearFigura(
            canvas.width * 0.75,
            canvas.height * 0.30,
            COLORES[1]
        )
    );

    figuras.push(
        crearFigura(
            canvas.width * 0.25,
            canvas.height * 0.70,
            COLORES[2]
        )
    );

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

    const radio =
        figura.tamano / 2;

    if (
        figura.x - radio < 0
    ) {

        figura.x =
            radio;

        figura.vx *= -1;
    }

    if (
        figura.x + radio >
        canvas.width
    ) {

        figura.x =
            canvas.width - radio;

        figura.vx *= -1;
    }

    if (
        figura.y - radio < 0
    ) {

        figura.y =
            radio;

        figura.vy *= -1;
    }

    if (
        figura.y + radio >
        canvas.height
    ) {

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

        if (!figura.activa) {
            return;
        }


        // ----------------------------------------------------
        // PÉRDIDA DE ENERGÍA
        // ----------------------------------------------------
        //
        // Solamente ocurre cuando no está siendo agarrada.
        //

        if (
            !figura.siendoArrastrada
        ) {

            figura.energia *=
                PERDIDA_ENERGIA;

            figura.energia =
                Math.max(
                    figura.energia,
                    0
                );
        }


        // ----------------------------------------------------
        // SI ESTÁ SIENDO ARRASTRADA
        // ----------------------------------------------------

        if (
            figura.siendoArrastrada
        ) {

            return;
        }


        // ----------------------------------------------------
        // VELOCIDAD ACTUAL
        // ----------------------------------------------------

        figura.vx *=
            PERDIDA_ENERGIA;

        figura.vy *=
            PERDIDA_ENERGIA;


        // Evitamos que desaparezca completamente
        // su movimiento demasiado rápido.

        if (
            Math.abs(figura.vx) <
            VELOCIDAD_MINIMA
        ) {

            figura.vx =
                figura.vx >= 0
                    ? VELOCIDAD_MINIMA
                    : -VELOCIDAD_MINIMA;
        }


        if (
            Math.abs(figura.vy) <
            VELOCIDAD_MINIMA
        ) {

            figura.vy =
                figura.vy >= 0
                    ? VELOCIDAD_MINIMA
                    : -VELOCIDAD_MINIMA;
        }


        // ----------------------------------------------------
        // MOVIMIENTO
        // ----------------------------------------------------

        figura.x +=
            figura.vx *
            figura.energia;

        figura.y +=
            figura.vy *
            figura.energia;


        // ----------------------------------------------------
        // MOVIMIENTO VERTICAL SUAVE
        // ----------------------------------------------------

        figura.faseVertical +=
            figura.velocidadVertical;

        const movimientoVertical =
            Math.sin(
                figura.faseVertical
            ) *
            0.08 *
            figura.energia;


        figura.y +=
            movimientoVertical;


        // ----------------------------------------------------
        // EMPUJE
        // ----------------------------------------------------

        figura.x +=
            figura.empujeX;

        figura.y +=
            figura.empujeY;


        figura.empujeX *=
            0.94;

        figura.empujeY *=
            0.94;


        // ----------------------------------------------------
        // ROTACIÓN
        // ----------------------------------------------------

        figura.rotacion +=
            figura.velocidadRotacion *
            figura.energia;


        // ----------------------------------------------------
        // FASE GENERAL
        // ----------------------------------------------------

        figura.fase +=
            0.015 *
            Math.max(
                figura.energia,
                0.15
            );


        // ----------------------------------------------------
        // RESPIRACIÓN
        // ----------------------------------------------------

        figura.faseRespiracion +=
            figura.velocidadRespiracion;

        figura.faseSecundaria +=
            figura.velocidadRespiracion *
            0.47;


        const ondaPrincipal =
            Math.sin(
                figura.faseRespiracion
            );


        const ondaSecundaria =
            Math.sin(
                figura.faseSecundaria
            );


        const respiracion =
            ondaPrincipal *
            figura.amplitudRespiracion
            +
            ondaSecundaria *
            0.006;


        figura.respiracionX =
            1 +
            respiracion;


        figura.respiracionY =
            1 +
            respiracion *
            0.94;


        // ----------------------------------------------------
        // RECUPERAR FORMA
        // ----------------------------------------------------
        //
        // Solo si NO está siendo tocada.
        //
        // El tamaño NO cambia.
        //

        if (
            !figura.enCaducidad
        ) {

            figura.deformacionForma -=
                VELOCIDAD_RECUPERACION_FORMA;

            figura.deformacionForma =
                Math.max(
                    figura.deformacionForma,
                    0
                );
        }


        limitarFigura(figura);
    });
}


// ============================================================
// COLISIONES
// ============================================================

function detectarColisiones() {

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


            if (
                !a.activa ||
                !b.activa
            ) {
                continue;
            }


            if (
                a.siendoArrastrada &&
                b.siendoArrastrada
            ) {
                continue;
            }


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
                (
                    a.tamano +
                    b.tamano
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


                if (
                    !a.siendoArrastrada
                ) {

                    a.x -=
                        nx *
                        solapamiento *
                        0.5;

                    a.y -=
                        ny *
                        solapamiento *
                        0.5;
                }


                if (
                    !b.siendoArrastrada
                ) {

                    b.x +=
                        nx *
                        solapamiento *
                        0.5;

                    b.y +=
                        ny *
                        solapamiento *
                        0.5;
                }


                if (
                    !a.siendoArrastrada
                ) {

                    a.vx -=
                        nx *
                        FUERZA_CHOQUE *
                        a.energia;

                    a.vy -=
                        ny *
                        FUERZA_CHOQUE *
                        a.energia;
                }


                if (
                    !b.siendoArrastrada
                ) {

                    b.vx +=
                        nx *
                        FUERZA_CHOQUE *
                        b.energia;

                    b.vy +=
                        ny *
                        FUERZA_CHOQUE *
                        b.energia;
                }


                a.empujeX -=
                    nx *
                    0.12;

                a.empujeY -=
                    ny *
                    0.12;

                b.empujeX +=
                    nx *
                    0.12;

                b.empujeY +=
                    ny *
                    0.12;


                limitarFigura(a);
                limitarFigura(b);
            }
        }
    }
}


// ============================================================
// BUSCAR FIGURA
// ============================================================

function buscarFigura(x, y) {

    for (
        let i =
            figuras.length - 1;
        i >= 0;
        i--
    ) {

        const figura =
            figuras[i];


        if (
            !figura.activa
        ) {
            continue;
        }


        const mitad =
            figura.tamano / 2;


        const margen =
            15;


        if (
            x >=
                figura.x -
                mitad -
                margen &&

            x <=
                figura.x +
                mitad +
                margen &&

            y >=
                figura.y -
                mitad -
                margen &&

            y <=
                figura.y +
                mitad +
                margen
        ) {

            return figura;
        }
    }

    return null;
}


// ============================================================
// POSICIÓN TOUCH
// ============================================================

function obtenerTouch(touch) {

    const rect =
        canvas.getBoundingClientRect();

    return {

        x:
            touch.clientX -
            rect.left,

        y:
            touch.clientY -
            rect.top
    };
}


// ============================================================
// MOVER FIGURA
// ============================================================

function moverFigura(
    figura,
    x,
    y
) {

    if (!figura) {
        return;
    }


    figura.x =
        x;

    figura.y =
        y;


    figura.vx =
        0;

    figura.vy =
        0;


    limitarFigura(figura);
}


// ============================================================
// CREAR RESTOS
// ============================================================

function crearRestos(figura) {

    const cantidad =
        1 +
        Math.floor(
            Math.random() * 2
        );


    for (
        let i = 0;
        i < cantidad;
        i++
    ) {

        const angulo =
            Math.random() *
            Math.PI *
            2;


        const radio =
            figura.tamano / 2;


        const distancia =
            radio *
            (
                0.60 +
                Math.random() *
                0.40
            );


        restos.push({

            x:
                figura.x +
                Math.cos(angulo) *
                distancia,

            y:
                figura.y +
                Math.sin(angulo) *
                distancia,

            tamano:
                2 +
                Math.random() *
                5,

            vx:
                (Math.random() - 0.5) *
                0.35,

            vy:
                0.15 +
                Math.random() *
                0.65,

            rotacion:
                Math.random() *
                Math.PI *
                2,

            velocidadRotacion:
                (Math.random() - 0.5) *
                0.03,

            opacidad:
                0.65 +
                Math.random() *
                0.25,

            color:
                figura.color,

            vida:
                1
        });
    }


    if (
        restos.length > 180
    ) {

        restos.splice(
            0,
            restos.length - 180
        );
    }
}


// ============================================================
// ACTUALIZAR RESTOS
// ============================================================

function actualizarRestos() {

    for (
        let i =
            restos.length - 1;
        i >= 0;
        i--
    ) {

        const resto =
            restos[i];


        resto.vy +=
            0.012;


        resto.x +=
            resto.vx;

        resto.y +=
            resto.vy;


        resto.rotacion +=
            resto.velocidadRotacion;


        resto.vida -=
            0.0018;


        resto.opacidad *=
            0.9985;


        if (
            resto.vida <= 0 ||
            resto.y >
                canvas.height + 30 ||
            resto.opacidad < 0.02
        ) {

            restos.splice(
                i,
                1
            );
        }
    }
}


// ============================================================
// ACTUALIZAR CADUCIDAD
// ============================================================

function actualizarCaducidad() {

    // --------------------------------------------------------
    // Reiniciar estado
    // --------------------------------------------------------

    figuras.forEach(
        figura => {

            figura.enCaducidad =
                false;
        }
    );


    // --------------------------------------------------------
    // BUSCAR DOS FIGURAS
    // --------------------------------------------------------

    if (
        punteros.size >= 2
    ) {

        const figurasSeleccionadas =
            [
                ...new Set(
                    [
                        ...punteros.values()
                    ]
                )
            ];


        if (
            figurasSeleccionadas.length >= 2
        ) {

            const figuraA =
                figurasSeleccionadas[0];

            const figuraB =
                figurasSeleccionadas[1];


            const dx =
                figuraB.x -
                figuraA.x;

            const dy =
                figuraB.y -
                figuraA.y;


            const distancia =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            if (
                distancia <
                DISTANCIA_CADUCIDAD
            ) {

                figuraA.enCaducidad =
                    true;

                figuraB.enCaducidad =
                    true;
            }
        }
    }


    // ========================================================
    // APLICAR DESGASTE
    // ========================================================

    figuras.forEach(
        figura => {

            if (
                !figura.activa
            ) {
                return;
            }


            // ------------------------------------------------
            // CADUCIDAD
            // ------------------------------------------------

            if (
                figura.enCaducidad
            ) {

                figura.caducidad +=
                    VELOCIDAD_CADUCIDAD;


                figura.caducidad =
                    Math.min(
                        figura.caducidad,
                        1
                    );


                figura.desgaste =
                    figura.caducidad;


                // ------------------------------------------------
                // DEFORMACIÓN
                // ------------------------------------------------
                //
                // Mientras se desgasta,
                // el borde se vuelve irregular.
                //

                figura.deformacionForma =
                    Math.min(
                        figura.deformacionForma +
                        0.015,
                        figura.caducidad
                    );


                // ------------------------------------------------
                // RESTOS
                // ------------------------------------------------

                figura.tiempoRestos +=
                    1;


                if (
                    figura.tiempoRestos >
                    28
                ) {

                    crearRestos(figura);

                    figura.tiempoRestos =
                        0;
                }
            }


            // ------------------------------------------------
            // TAMAÑO
            // ------------------------------------------------

            figura.tamano =
                TAMANO_INICIAL -
                (
                    TAMANO_INICIAL -
                    TAMANO_MINIMO
                ) *
                figura.caducidad;


            // ------------------------------------------------
            // OPACIDAD
            // ------------------------------------------------

            figura.opacidad =
                1 -
                (
                    figura.caducidad *
                    0.08
                );


            // ------------------------------------------------
            // SI LLEGA AL MÍNIMO
            // ------------------------------------------------

            if (
                figura.tamano <=
                TAMANO_MINIMO + 0.5
            ) {

                // Generamos una última
                // pequeña cantidad de restos.

                crearRestos(figura);

                figura.activa =
                    false;
            }
        }
    );


    // --------------------------------------------------------
    // Eliminar cuadrados muertos.
    // --------------------------------------------------------

    figuras =
        figuras.filter(
            figura =>
                figura.activa
        );
}


// ============================================================
// GRADIENTE
// ============================================================

function obtenerGradiente(
    figura,
    mitad
) {

    let colorClaro;
    let colorMedio;
    let colorOscuro;


    if (
        figura.color ===
        "#D9D9D9"
    ) {

        colorClaro =
            "#FFFFFF";

        colorMedio =
            "#D9D9D9";

        colorOscuro =
            "#AEB4BA";
    }

    else if (
        figura.color ===
        "#8BB2D3"
    ) {

        colorClaro =
            "#DCECF9";

        colorMedio =
            "#8BB2D3";

        colorOscuro =
            "#527A9C";
    }

    else if (
        figura.color ===
        "#202D64"
    ) {

        colorClaro =
            "#6674A5";

        colorMedio =
            "#202D64";

        colorOscuro =
            "#10183B";
    }

    else {

        colorClaro =
            "#7EA7D0";

        colorMedio =
            "#2B538E";

        colorOscuro =
            "#18355F";
    }


    const gradiente =
        ctx.createRadialGradient(

            -mitad * 0.30,
            -mitad * 0.35,
            0,

            0,
            0,
            mitad * 1.45
        );


    gradiente.addColorStop(
        0,
        colorClaro
    );

    gradiente.addColorStop(
        0.48,
        colorMedio
    );

    gradiente.addColorStop(
        1,
        colorOscuro
    );


    return gradiente;
}


// ============================================================
// SOMBRA
// ============================================================

function obtenerSombra(
    figura
) {

    if (
        figura.color ===
        "#D9D9D9"
    ) {

        return {
            color:
                "rgba(217,217,217,0.25)",
            blur:
                18
        };
    }


    if (
        figura.color ===
        "#8BB2D3"
    ) {

        return {
            color:
                "rgba(139,178,211,0.25)",
            blur:
                18
        };
    }


    if (
        figura.color ===
        "#202D64"
    ) {

        return {
            color:
                "rgba(32,45,100,0.35)",
            blur:
                18
        };
    }


    return {
        color:
            "rgba(43,83,142,0.35)",
        blur:
            18
    };
}


// ============================================================
// DIBUJAR RESTO
// ============================================================

function dibujarResto(resto) {

    ctx.save();


    ctx.translate(
        resto.x,
        resto.y
    );


    ctx.rotate(
        resto.rotacion
    );


    ctx.globalAlpha =
        resto.opacidad;


    ctx.fillStyle =
        resto.color;


    ctx.shadowColor =
        resto.color;

    ctx.shadowBlur =
        5;


    ctx.fillRect(
        -resto.tamano / 2,
        -resto.tamano / 2,
        resto.tamano,
        resto.tamano
    );


    ctx.restore();
}


// ============================================================
// FORMA DESGASTADA
// ============================================================

function dibujarFormaDesgastada(
    figura,
    mitad
) {

    const deformacion =
        mitad *
        0.18 *
        figura.deformacionForma;


    ctx.beginPath();


    // --------------------------------------------------------
    // ARRIBA
    // --------------------------------------------------------

    ctx.moveTo(
        -mitad,
        -mitad +
        deformacion *
        Math.sin(
            figura.fase * 2
        )
    );


    ctx.lineTo(
        -mitad * 0.35,
        -mitad +
        deformacion *
        Math.sin(
            figura.fase * 3
        )
    );


    ctx.lineTo(
        mitad * 0.25,
        -mitad +
        deformacion *
        Math.cos(
            figura.fase * 2
        )
    );


    ctx.lineTo(
        mitad,
        -mitad +
        deformacion *
        Math.sin(
            figura.fase * 4
        )
    );


    // --------------------------------------------------------
    // DERECHA
    // --------------------------------------------------------

    ctx.lineTo(
        mitad -
        deformacion *
        Math.abs(
            Math.sin(
                figura.fase * 2
            )
        ),
        -mitad * 0.30
    );


    ctx.lineTo(
        mitad -
        deformacion *
        Math.abs(
            Math.cos(
                figura.fase * 3
            )
        ),
        mitad * 0.25
    );


    ctx.lineTo(
        mitad,
        mitad
    );


    // --------------------------------------------------------
    // ABAJO
    // --------------------------------------------------------

    ctx.lineTo(
        mitad * 0.30,
        mitad -
        deformacion *
        Math.abs(
            Math.sin(
                figura.fase * 3
            )
        )
    );


    ctx.lineTo(
        -mitad * 0.30,
        mitad -
        deformacion *
        Math.abs(
            Math.cos(
                figura.fase * 2
            )
        )
    );


    ctx.lineTo(
        -mitad,
        mitad
    );


    // --------------------------------------------------------
    // IZQUIERDA
    // --------------------------------------------------------

    ctx.lineTo(
        -mitad +
        deformacion *
        Math.abs(
            Math.sin(
                figura.fase * 2
            )
        ),
        mitad * 0.25
    );


    ctx.lineTo(
        -mitad +
        deformacion *
        Math.abs(
            Math.cos(
                figura.fase * 3
            )
        ),
        -mitad * 0.30
    );


    ctx.closePath();


    ctx.fill();
}


// ============================================================
// DIBUJAR FIGURA
// ============================================================

function dibujarFigura(
    figura
) {

    if (
        !figura.activa
    ) {
        return;
    }


    ctx.save();


    // --------------------------------------------------------
    // CENTRO
    // --------------------------------------------------------

    ctx.translate(
        figura.x,
        figura.y
    );


    // --------------------------------------------------------
    // RESPIRACIÓN
    // --------------------------------------------------------

    ctx.scale(
        figura.respiracionX,
        figura.respiracionY
    );


    // --------------------------------------------------------
    // ROTACIÓN
    // --------------------------------------------------------

    ctx.rotate(
        figura.rotacion
    );


    // --------------------------------------------------------
    // OPACIDAD
    // --------------------------------------------------------

    ctx.globalAlpha =
        figura.opacidad;


    // --------------------------------------------------------
    // TAMAÑO
    // --------------------------------------------------------

    const mitad =
        figura.tamano / 2;


    // --------------------------------------------------------
    // GRADIENTE
    // --------------------------------------------------------

    ctx.fillStyle =
        obtenerGradiente(
            figura,
            mitad
        );


    // --------------------------------------------------------
    // SOMBRA
    // --------------------------------------------------------

    const sombra =
        obtenerSombra(
            figura
        );


    ctx.shadowColor =
        sombra.color;

    ctx.shadowBlur =
        sombra.blur;


    // --------------------------------------------------------
    // SELECCIÓN
    // --------------------------------------------------------

    if (
        figura.siendoArrastrada
    ) {

        ctx.shadowColor =
            COLOR_SELECCION;

        ctx.shadowBlur =
            30;
    }


    // ========================================================
    // FORMA
    // ========================================================

    if (
        figura.deformacionForma <=
        0.01
    ) {

        // Cuadrado perfecto.

        ctx.fillRect(
            -mitad,
            -mitad,
            figura.tamano,
            figura.tamano
        );
    }

    else {

        // Forma desgastada.

        dibujarFormaDesgastada(
            figura,
            mitad
        );
    }


    ctx.restore();
}


// ============================================================
// DIBUJAR TODO
// ============================================================

function dibujar() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    restos.forEach(
        dibujarResto
    );


    figuras.forEach(
        dibujarFigura
    );
}


// ============================================================
// TOUCHSTART
// ============================================================

canvas.addEventListener(
    "touchstart",
    function(evento) {

        evento.preventDefault();


        for (
            let i = 0;
            i <
            evento.changedTouches.length;
            i++
        ) {

            const touch =
                evento.changedTouches[i];


            const posicion =
                obtenerTouch(
                    touch
                );


            const figura =
                buscarFigura(
                    posicion.x,
                    posicion.y
                );


            if (
                figura &&
                ![
                    ...punteros.values()
                ].includes(
                    figura
                )
            ) {

                punteros.set(
                    touch.identifier,
                    figura
                );


                figura.siendoArrastrada =
                    true;


                moverFigura(
                    figura,
                    posicion.x,
                    posicion.y
                );
            }
        }

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


        for (
            let i = 0;
            i <
            evento.changedTouches.length;
            i++
        ) {

            const touch =
                evento.changedTouches[i];


            const figura =
                punteros.get(
                    touch.identifier
                );


            if (!figura) {
                continue;
            }


            const posicion =
                obtenerTouch(
                    touch
                );


            moverFigura(
                figura,
                posicion.x,
                posicion.y
            );
        }

    },
    {
        passive: false
    }
);


// ============================================================
// FINALIZAR TOUCH
// ============================================================

function finalizarDedos(
    evento
) {

    evento.preventDefault();


    for (
        let i = 0;
        i <
        evento.changedTouches.length;
        i++
    ) {

        const touch =
            evento.changedTouches[i];


        const figura =
            punteros.get(
                touch.identifier
            );


        if (
            figura
        ) {

            // ------------------------------------------------
            // SOLTAR
            // ------------------------------------------------

            figura.siendoArrastrada =
                false;


            // ------------------------------------------------
            // IMPORTANTE:
            //
            // NO recupera tamaño.
            //
            // El tamaño que perdió queda permanentemente.
            //
            // Lo único que empieza a recuperarse lentamente
            // es la FORMA del borde.
            // ------------------------------------------------

            figura.vx =
                (Math.random() - 0.5) *
                VELOCIDAD *
                figura.energia;


            figura.vy =
                (Math.random() - 0.5) *
                VELOCIDAD *
                figura.energia;
        }


        punteros.delete(
            touch.identifier
        );
    }
}


// ============================================================
// TOUCHEND
// ============================================================

canvas.addEventListener(
    "touchend",
    finalizarDedos,
    {
        passive: false
    }
);


// ============================================================
// TOUCHCANCEL
// ============================================================

canvas.addEventListener(
    "touchcancel",
    finalizarDedos,
    {
        passive: false
    }
);


// ============================================================
// MOUSE DOWN
// ============================================================

canvas.addEventListener(
    "mousedown",
    function(evento) {

        if (
            evento.button !== 0
        ) {
            return;
        }


        const rect =
            canvas.getBoundingClientRect();


        const x =
            evento.clientX -
            rect.left;


        const y =
            evento.clientY -
            rect.top;


        const figura =
            buscarFigura(
                x,
                y
            );


        if (
            figura
        ) {

            mouseActivo =
                true;

            mouseFigura =
                figura;


            figura.siendoArrastrada =
                true;


            punteros.set(
                "mouse",
                figura
            );


            moverFigura(
                figura,
                x,
                y
            );
        }
    }
);


// ============================================================
// MOUSE MOVE
// ============================================================

canvas.addEventListener(
    "mousemove",
    function(evento) {

        if (
            !mouseActivo ||
            !mouseFigura
        ) {
            return;
        }


        const rect =
            canvas.getBoundingClientRect();


        const x =
            evento.clientX -
            rect.left;


        const y =
            evento.clientY -
            rect.top;


        moverFigura(
            mouseFigura,
            x,
            y
        );
    }
);


// ============================================================
// MOUSE UP
// ============================================================

canvas.addEventListener(
    "mouseup",
    function() {

        if (
            mouseFigura
        ) {

            mouseFigura.siendoArrastrada =
                false;


            mouseFigura.vx =
                (Math.random() - 0.5) *
                VELOCIDAD *
                mouseFigura.energia;


            mouseFigura.vy =
                (Math.random() - 0.5) *
                VELOCIDAD *
                mouseFigura.energia;
        }


        punteros.delete(
            "mouse"
        );


        mouseActivo =
            false;

        mouseFigura =
            null;
    }
);


// ============================================================
// MOUSE SALE DEL CANVAS
// ============================================================

canvas.addEventListener(
    "mouseleave",
    function() {

        if (
            mouseFigura
        ) {

            mouseFigura.siendoArrastrada =
                false;


            mouseFigura.vx =
                (Math.random() - 0.5) *
                VELOCIDAD *
                mouseFigura.energia;


            mouseFigura.vy =
                (Math.random() - 0.5) *
                VELOCIDAD *
                mouseFigura.energia;
        }


        punteros.delete(
            "mouse"
        );


        mouseActivo =
            false;

        mouseFigura =
            null;
    }
);


// ============================================================
// INICIALIZACIÓN
// ============================================================

ajustarCanvas();

crearFigurasIniciales();


// ============================================================
// ANIMACIÓN
// ============================================================

function animar() {

    actualizarMovimiento();

    detectarColisiones();

    actualizarCaducidad();

    actualizarRestos();

    dibujar();


    requestAnimationFrame(
        animar
    );
}


animar();


// ============================================================
// CAMBIO DE TAMAÑO
// ============================================================

window.addEventListener(
    "resize",
    function() {

        ajustarCanvas();

        figuras.forEach(
            limitarFigura
        );
    }
);