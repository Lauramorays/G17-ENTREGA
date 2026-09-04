// ============================================================
// EMPATÍA
// ============================================================
//
// CONCEPTO:
//
// Al comenzar, los 4 organismos parecen tranquilos.
// Después de 1 segundo comienzan a alterarse.
//
// Cada organismo tiene un nivel de alteración diferente:
// - algunos respiran más rápido
// - algunos se expanden más
// - algunos se mueven más rápido
//
// La persona puede intervenir tocando un organismo.
//
// 1 dedo:
//      No es suficiente para calmarlo.
//
// 2 o más dedos:
//      El organismo comienza a calmarse.
//
// Mientras los 2 o más dedos permanecen sobre él:
//      - disminuye su movimiento
//      - disminuye su respiración
//      - vuelve a su tamaño normal
//      - finalmente queda completamente quieto
//
// Al retirar los dedos:
//      vuelve progresivamente a su estado alterado.
//
// ============================================================


// ============================================================
// CANVAS
// ============================================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


// Ajustamos el tamaño real del canvas al tamaño visual.
function ajustarCanvas() {

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}


// Primera adaptación.
ajustarCanvas();


// Si cambia el tamaño de la ventana,
// volvemos a adaptar el canvas.
window.addEventListener("resize", () => {

    ajustarCanvas();
});


// ============================================================
// COLORES
// ============================================================
//
// Utilizamos exactamente la misma paleta del sistema.
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


// Los círculos tienen un tamaño similar al de los cuadrados
// de MEMORIA.
const RADIO_BASE = 55;


// Cuerpo físico utilizado para las colisiones.
const RADIO_CUERPO = 55;


// ------------------------------------------------------------
// TIEMPO INICIAL TRANQUILO
// ------------------------------------------------------------
//
// Durante este tiempo los organismos parecen normales.
// Después de 1 segundo comienza la alteración.
// ------------------------------------------------------------

const TIEMPO_TRANQUILO = 1000;


// Guardamos el momento exacto en que comenzó la experiencia.
const inicio = performance.now();


// Indica si ya comenzó la alteración.
let estadoAlterado = false;


// ============================================================
// CÍRCULOS
// ============================================================

let circulos = [];


// ============================================================
// CREAR CÍRCULOS
// ============================================================

function crearCirculos() {

    circulos = [];


    for (let i = 0; i < 4; i++) {

        // ----------------------------------------------------
        // NIVEL DE ALTERACIÓN
        // ----------------------------------------------------
        //
        // Cada círculo tiene un nivel diferente.
        //
        // Esto evita que los 4 se comporten exactamente igual.
        //
        // 0.45 = alteración leve
        // 0.70 = alteración media
        // 1.00 = alteración fuerte
        // ----------------------------------------------------

        const nivelesAlteracion = [
            0.55,
            0.85,
            0.65,
            1.00
        ];


        // ----------------------------------------------------
        // VELOCIDAD ALTERADA
        // ----------------------------------------------------
        //
        // Cuanto mayor es la alteración,
        // más rápido se mueve el organismo.
        // ----------------------------------------------------

        const alteracion =
            nivelesAlteracion[i];


        circulos.push({

            // ------------------------------------------------
            // POSICIÓN
            // ------------------------------------------------

            x:
                Math.random() *
                (canvas.width - RADIO_CUERPO * 2) +
                RADIO_CUERPO,

            y:
                Math.random() *
                (canvas.height - RADIO_CUERPO * 2) +
                RADIO_CUERPO,


            // ------------------------------------------------
            // TAMAÑO
            // ------------------------------------------------

            radio: RADIO_BASE,


            // ------------------------------------------------
            // VELOCIDAD
            // ------------------------------------------------
            //
            // Al principio utilizamos velocidades tranquilas.
            // Después de un segundo serán reemplazadas por
            // las velocidades correspondientes a su alteración.
            // ------------------------------------------------

            vx:
                (Math.random() - 0.5) * 1.5,

            vy:
                (Math.random() - 0.5) * 1.5,


            // ------------------------------------------------
            // VELOCIDAD ALTERADA
            // ------------------------------------------------
            //
            // Guardamos cuánto se moverá cuando se altere.
            // ------------------------------------------------

            velocidadAlterada:
                0.9 +
                alteracion * 1.8,


            // ------------------------------------------------
            // COLOR
            // ------------------------------------------------

            color: colores[i],


            // ------------------------------------------------
            // ALTERACIÓN
            // ------------------------------------------------

            nivelAlteracion:
                alteracion,


            // ------------------------------------------------
            // RESPIRACIÓN
            // ------------------------------------------------
            //
            // Cada organismo tiene un ritmo diferente.
            //
            // Algunos respiran muy rápido.
            // Otros respiran un poco más lento.
            // ------------------------------------------------

            velocidadRespiracionNormal:
                0.008 +
                Math.random() * 0.008,


            velocidadRespiracionAlterada:
                0.025 +
                alteracion * 0.035,


            // Momento diferente de la respiración para cada uno.
            faseRespiracion:
                Math.random() *
                Math.PI *
                2,


            // ------------------------------------------------
            // AMPLITUD DE RESPIRACIÓN
            // ------------------------------------------------
            //
            // Algunos organismos se expanden más que otros.
            // ------------------------------------------------

            amplitudAlterada:
                0.04 +
                alteracion * 0.08,


            // ------------------------------------------------
            // DEDOS
            // ------------------------------------------------

            dedosSobre: [],


            // ------------------------------------------------
            // NIVEL DE CALMA
            // ------------------------------------------------
            //
            // 0 = completamente alterado
            // 1 = completamente calmado
            //
            // Lo hacemos progresivo para que se vea el cambio.
            // ------------------------------------------------

            nivelCalma: 0,


            // ------------------------------------------------
            // CALMADO
            // ------------------------------------------------

            calmado: false
        });
    }
}


// Creamos los organismos.
crearCirculos();


// ============================================================
// DIBUJAR CÍRCULO
// ============================================================

function dibujarCirculo(circulo) {

    ctx.save();


    // Nos trasladamos al centro del organismo.
    ctx.translate(
        circulo.x,
        circulo.y
    );


    // --------------------------------------------------------
    // INTERPOLAR LA RESPIRACIÓN
    // --------------------------------------------------------
    //
    // Cuando está alterado:
    // respiración grande y rápida.
    //
    // Cuando está calmado:
    // respiración mínima.
    //
    // La transición es progresiva.
    // --------------------------------------------------------

    const amplitudAlterada =
        circulo.amplitudAlterada;


    const amplitudTranquila =
        0.012;


    const amplitud =
        amplitudAlterada *
            (1 - circulo.nivelCalma) +
        amplitudTranquila *
            circulo.nivelCalma;


    // --------------------------------------------------------
    // RESPIRACIÓN
    // --------------------------------------------------------

    const respiracion =
        1 +
        Math.sin(
            circulo.faseRespiracion
        ) *
        amplitud;


    // --------------------------------------------------------
    // TAMAÑO
    // --------------------------------------------------------
    //
    // Cuando está alterado puede expandirse más.
    // Cuando se calma vuelve a su tamaño original.
    // --------------------------------------------------------

    const escalaAlterada =
        1 +
        circulo.nivelAlteracion * 0.10;


    const escala =
        respiracion *
        (
            escalaAlterada *
                (1 - circulo.nivelCalma) +
            1 *
                circulo.nivelCalma
        );


    // La misma escala en X e Y mantiene
    // siempre la forma circular.
    ctx.scale(
        escala,
        escala
    );


    // ========================================================
    // CUERPO DEL ORGANISMO
    // ========================================================

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        circulo.radio,
        0,
        Math.PI * 2
    );


    // --------------------------------------------------------
    // COLOR
    // --------------------------------------------------------
    //
    // El color se mantiene dentro de la paleta del sistema.
    //
    // La alteración se representa principalmente mediante:
    // tamaño + respiración + velocidad.
    //
    // Cuando se calma, el color vuelve a verse más estable.
    // --------------------------------------------------------

    ctx.fillStyle =
        circulo.color;

    ctx.fill();


    // --------------------------------------------------------
    // BORDE
    // --------------------------------------------------------

    ctx.strokeStyle =
        circulo.color;

    ctx.lineWidth = 2;

    ctx.stroke();


    ctx.restore();
}


// ============================================================
// ACTUALIZAR RESPIRACIÓN
// ============================================================

function actualizarRespiracion(circulo) {

    // --------------------------------------------------------
    // VELOCIDAD DE RESPIRACIÓN ALTERADA
    // --------------------------------------------------------

    const velocidadAlterada =
        circulo.velocidadRespiracionAlterada;


    // --------------------------------------------------------
    // VELOCIDAD DE RESPIRACIÓN TRANQUILA
    // --------------------------------------------------------

    const velocidadTranquila =
        circulo.velocidadRespiracionNormal;


    // --------------------------------------------------------
    // INTERPOLACIÓN
    // --------------------------------------------------------
    //
    // Cuanto más calmado está:
    // más lenta es su respiración.
    // --------------------------------------------------------

    const velocidad =
        velocidadAlterada *
            (1 - circulo.nivelCalma) +
        velocidadTranquila *
            circulo.nivelCalma;


    circulo.faseRespiracion +=
        velocidad;
}


// ============================================================
// CONTROLAR BORDES
// ============================================================

function controlarBordes(circulo) {

    // --------------------------------------------------------
    // IZQUIERDA
    // --------------------------------------------------------

    if (
        circulo.x - RADIO_CUERPO < 0
    ) {

        circulo.x =
            RADIO_CUERPO;

        circulo.vx =
            Math.abs(circulo.vx);
    }


    // --------------------------------------------------------
    // DERECHA
    // --------------------------------------------------------

    if (
        circulo.x + RADIO_CUERPO >
        canvas.width
    ) {

        circulo.x =
            canvas.width -
            RADIO_CUERPO;

        circulo.vx =
            -Math.abs(circulo.vx);
    }


    // --------------------------------------------------------
    // ARRIBA
    // --------------------------------------------------------

    if (
        circulo.y - RADIO_CUERPO < 0
    ) {

        circulo.y =
            RADIO_CUERPO;

        circulo.vy =
            Math.abs(circulo.vy);
    }


    // --------------------------------------------------------
    // ABAJO
    // --------------------------------------------------------

    if (
        circulo.y + RADIO_CUERPO >
        canvas.height
    ) {

        circulo.y =
            canvas.height -
            RADIO_CUERPO;

        circulo.vy =
            -Math.abs(circulo.vy);
    }
}


// ============================================================
// COLISIONES
// ============================================================

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
                RADIO_CUERPO +
                RADIO_CUERPO;


            // ------------------------------------------------
            // SI ESTÁN CHOCANDO
            // ------------------------------------------------

            if (
                distancia <
                    distanciaMinima &&
                distancia > 0
            ) {

                const nx =
                    dx / distancia;

                const ny =
                    dy / distancia;


                const separacion =
                    distanciaMinima -
                    distancia;


                // ------------------------------------------------
                // SI A ESTÁ COMPLETAMENTE CALMADO
                // ------------------------------------------------

                if (
                    a.nivelCalma >= 0.95 &&
                    b.nivelCalma < 0.95
                ) {

                    b.x +=
                        nx * separacion;

                    b.y +=
                        ny * separacion;
                }


                // ------------------------------------------------
                // SI B ESTÁ COMPLETAMENTE CALMADO
                // ------------------------------------------------

                else if (
                    b.nivelCalma >= 0.95 &&
                    a.nivelCalma < 0.95
                ) {

                    a.x -=
                        nx * separacion;

                    a.y -=
                        ny * separacion;
                }


                // ------------------------------------------------
                // AMBOS SE MUEVEN
                // ------------------------------------------------

                else {

                    a.x -=
                        nx *
                        separacion *
                        0.5;

                    a.y -=
                        ny *
                        separacion *
                        0.5;


                    b.x +=
                        nx *
                        separacion *
                        0.5;

                    b.y +=
                        ny *
                        separacion *
                        0.5;
                }


                // ------------------------------------------------
                // REBOTE
                // ------------------------------------------------

                const velocidadRelativa =
                    (b.vx - a.vx) * nx +
                    (b.vy - a.vy) * ny;


                if (
                    velocidadRelativa < 0
                ) {

                    const rebote = 0.8;


                    const impulso =
                        -(1 + rebote) *
                        velocidadRelativa /
                        2;


                    // Si A está calmado,
                    // solamente B recibe movimiento.
                    if (
                        a.nivelCalma >= 0.95 &&
                        b.nivelCalma < 0.95
                    ) {

                        b.vx +=
                            impulso * nx;

                        b.vy +=
                            impulso * ny;
                    }


                    // Si B está calmado,
                    // solamente A recibe movimiento.
                    else if (
                        b.nivelCalma >= 0.95 &&
                        a.nivelCalma < 0.95
                    ) {

                        a.vx -=
                            impulso * nx;

                        a.vy -=
                            impulso * ny;
                    }


                    // Si ambos están alterados,
                    // ambos reciben el rebote.
                    else {

                        a.vx -=
                            impulso * nx;

                        a.vy -=
                            impulso * ny;


                        b.vx +=
                            impulso * nx;

                        b.vy +=
                            impulso * ny;
                    }
                }
            }
        }
    }
}


// ============================================================
// ACTUALIZAR ESTADO DE CALMA
// ============================================================

function actualizarCalma(circulo) {

    // --------------------------------------------------------
    // DOS O MÁS DEDOS
    // --------------------------------------------------------
    //
    // Dos dedos son necesarios para comenzar a regular
    // al organismo.
    // --------------------------------------------------------

    if (
        circulo.dedosSobre.length >= 2
    ) {

        circulo.calmado = true;

        // Aumentamos progresivamente el nivel de calma.
        //
        // 0 → alterado
        // 1 → completamente calmado

        circulo.nivelCalma += 0.025;


        // Nunca supera 1.
        if (
            circulo.nivelCalma > 1
        ) {

            circulo.nivelCalma = 1;
        }
    }


    // --------------------------------------------------------
    // MENOS DE DOS DEDOS
    // --------------------------------------------------------

    else {

        circulo.calmado = false;

        // Al retirar los dedos no vuelve inmediatamente
        // al estado alterado.
        //
        // Se recupera progresivamente.

        circulo.nivelCalma -= 0.008;


        // Nunca baja de 0.
        if (
            circulo.nivelCalma < 0
        ) {

            circulo.nivelCalma = 0;
        }
    }
}


// ============================================================
// ACTUALIZAR TODOS LOS ESTADOS DE CALMA
// ============================================================
//
// Esta función se ejecuta continuamente para que la transición
// de alterado a calmado sea visible.
// ============================================================

function actualizarEstadosCalma() {

    circulos.forEach(circulo => {

        // ----------------------------------------------------
        // SI HAY DOS O MÁS DEDOS
        // ----------------------------------------------------

        if (
            circulo.dedosSobre.length >= 2
        ) {

            circulo.nivelCalma += 0.025;

            if (
                circulo.nivelCalma > 1
            ) {

                circulo.nivelCalma = 1;
            }

            circulo.calmado = true;
        }


        // ----------------------------------------------------
        // SI HAY MENOS DE DOS DEDOS
        // ----------------------------------------------------

        else {

            circulo.nivelCalma -= 0.008;

            if (
                circulo.nivelCalma < 0
            ) {

                circulo.nivelCalma = 0;
            }


            // Se considera calmado mientras todavía
            // esté en transición.
            circulo.calmado =
                circulo.nivelCalma > 0;
        }
    });
}


// ============================================================
// MOVIMIENTO
// ============================================================

function moverCirculos() {

    circulos.forEach(circulo => {

        // ----------------------------------------------------
        // VELOCIDAD SEGÚN EL NIVEL DE CALMA
        // ----------------------------------------------------
        //
        // 0 = velocidad alterada
        // 1 = completamente quieto
        //
        // De esta forma la calma se puede ver.
        // ----------------------------------------------------

        const factorMovimiento =
            1 -
            circulo.nivelCalma;


        // ----------------------------------------------------
        // MOVIMIENTO
        // ----------------------------------------------------

        circulo.x +=
            circulo.vx *
            factorMovimiento;

        circulo.y +=
            circulo.vy *
            factorMovimiento;


        // ----------------------------------------------------
        // MOVIMIENTO ORGÁNICO
        // ----------------------------------------------------
        //
        // El movimiento se vuelve más suave a medida
        // que el organismo se calma.
        // ----------------------------------------------------

        circulo.vx +=
            Math.sin(
                circulo.faseRespiracion *
                0.7
            ) *
            0.003 *
            factorMovimiento;


        circulo.vy +=
            Math.cos(
                circulo.faseRespiracion *
                0.6
            ) *
            0.003 *
            factorMovimiento;


        // ----------------------------------------------------
        // LIMITAR VELOCIDAD
        // ----------------------------------------------------

        const velocidadMaxima =
            circulo.velocidadAlterada;


        const velocidad =
            Math.sqrt(
                circulo.vx *
                    circulo.vx +
                circulo.vy *
                    circulo.vy
            );


        if (
            velocidad >
            velocidadMaxima
        ) {

            circulo.vx =
                (circulo.vx / velocidad) *
                velocidadMaxima;

            circulo.vy =
                (circulo.vy / velocidad) *
                velocidadMaxima;
        }


        // ----------------------------------------------------
        // BORDES
        // ----------------------------------------------------

        controlarBordes(circulo);
    });


    // Revisamos las colisiones.
    detectarColisiones();
}


// ============================================================
// DETECTAR CÍRCULO TOCADO
// ============================================================

function detectarCirculoTocado(
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
            RADIO_CUERPO
        ) {

            return circulo;
        }
    }


    return null;
}


// ============================================================
// COORDENADAS DEL TOQUE
// ============================================================

function obtenerCoordenadas(
    clientX,
    clientY
) {

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
// INICIAR TOQUE
// ============================================================

canvas.addEventListener(
    "pointerdown",
    function(event) {

        // Ignoramos el mouse.
        if (
            event.pointerType === "mouse"
        ) {

            return;
        }


        event.preventDefault();


        const posicion =
            obtenerCoordenadas(
                event.clientX,
                event.clientY
            );


        const circulo =
            detectarCirculoTocado(
                posicion.x,
                posicion.y
            );


        // Si no tocó un círculo,
        // no hacemos nada.
        if (!circulo) {

            return;
        }


        // Capturamos ese dedo.
        canvas.setPointerCapture(
            event.pointerId
        );


        // Guardamos el identificador del dedo.
        if (
            !circulo.dedosSobre.includes(
                event.pointerId
            )
        ) {

            circulo.dedosSobre.push(
                event.pointerId
            );
        }


        // Actualizamos inmediatamente.
        actualizarCalma(circulo);
    },
    {
        passive: false
    }
);


// ============================================================
// SOLTAR DEDO
// ============================================================

function soltarDedo(
    pointerId
) {

    circulos.forEach(circulo => {

        const posicion =
            circulo.dedosSobre.indexOf(
                pointerId
            );


        if (
            posicion !== -1
        ) {

            // Quitamos el dedo.
            circulo.dedosSobre.splice(
                posicion,
                1
            );
        }
    });
}


// ============================================================
// POINTER UP
// ============================================================

canvas.addEventListener(
    "pointerup",
    function(event) {

        if (
            event.pointerType === "mouse"
        ) {

            return;
        }


        event.preventDefault();


        soltarDedo(
            event.pointerId
        );
    },
    {
        passive: false
    }
);


// ============================================================
// POINTER CANCEL
// ============================================================

canvas.addEventListener(
    "pointercancel",
    function(event) {

        if (
            event.pointerType === "mouse"
        ) {

            return;
        }


        soltarDedo(
            event.pointerId
        );
    }
);


// ============================================================
// ANIMACIÓN PRINCIPAL
// ============================================================

function animar() {

    // --------------------------------------------------------
    // LIMPIAR CANVAS
    // --------------------------------------------------------

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // --------------------------------------------------------
    // COMPROBAR LOS PRIMEROS 1000 ms
    // --------------------------------------------------------
    //
    // Durante el primer segundo todos están tranquilos.
    // Después comienzan a alterarse.
    // --------------------------------------------------------

    const tiempoActual =
        performance.now();


    const tiempoTranscurrido =
        tiempoActual -
        inicio;


    if (
        tiempoTranscurrido >=
        TIEMPO_TRANQUILO
    ) {

        estadoAlterado = true;
    }


    // --------------------------------------------------------
    // ACTIVAR ALTERACIÓN
    // --------------------------------------------------------

    if (
        estadoAlterado
    ) {

        circulos.forEach(circulo => {

            // Solamente asignamos la velocidad alterada
            // si todavía está prácticamente tranquilo.

            if (
                Math.abs(circulo.vx) < 0.76 &&
                Math.abs(circulo.vy) < 0.76
            ) {

                const angulo =
                    Math.random() *
                    Math.PI *
                    2;


                const velocidad =
                    circulo.velocidadAlterada;


                circulo.vx =
                    Math.cos(angulo) *
                    velocidad;

                circulo.vy =
                    Math.sin(angulo) *
                    velocidad;
            }
        });
    }


    // --------------------------------------------------------
    // ACTUALIZAR CALMA
    // --------------------------------------------------------

    actualizarEstadosCalma();


    // --------------------------------------------------------
    // MOVER
    // --------------------------------------------------------

    moverCirculos();


    // --------------------------------------------------------
    // RESPIRAR
    // --------------------------------------------------------

    circulos.forEach(circulo => {

        actualizarRespiracion(
            circulo
        );
    });


    // --------------------------------------------------------
    // DIBUJAR
    // --------------------------------------------------------

    circulos.forEach(circulo => {

        dibujarCirculo(
            circulo
        );
    });


    // --------------------------------------------------------
    // SIGUIENTE FRAME
    // --------------------------------------------------------

    requestAnimationFrame(
        animar
    );
}


// ============================================================
// INICIAR EXPERIENCIA
// ============================================================

animar();