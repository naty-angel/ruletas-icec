// Datos de la rifa
let opcionesDisponibles = [];
let ganadores = [];
let alAgua = [];
let etapaRifa = 0;

// Grados acumulados de las ruletas
let gradosRifa = 0;
let gradosJuegos = 0;

// Evita presionar varias veces mientras gira
let rifaGirando = false;
let juegosGirando = false;
let ultimoNivelJuego = -1;

// Elementos de la rifa
const pantallaCargaRifa = document.querySelector("#pantalla-carga-rifa");
const pantallaSorteoRifa = document.querySelector("#pantalla-sorteo-rifa");

const botonCargarNumeros = document.querySelector("#cargar-numeros");
const botonCargarPalabras = document.querySelector("#cargar-palabras");
const botonEditarParticipantes = document.querySelector("#editar-participantes");
const botonGirarRifa = document.querySelector("#girar-rifa");

const ruletaRifa = document.querySelector("#ruleta-rifa");
const contenedorRifa = document.querySelector("#contenedor-rifa");
const numeroRuleta = document.querySelector("#numero-ruleta");
const resultadoRifa = document.querySelector("#resultado-rifa");
const numerosRestantes = document.querySelector("#numeros-restantes");

const listaPalabras = document.querySelector("#lista-palabras");
const listaDisponibles = document.querySelector("#lista-disponibles");
const listaAgua = document.querySelector("#lista-agua");
const listaGanadores = document.querySelector("#lista-ganadores");

// Elementos de juegos
const botonGirarJuegos = document.querySelector("#girar-juegos");
const ruletaJuegos = document.querySelector("#ruleta-juegos");
const contenedorJuegos = document.querySelector("#contenedor-juegos");
const resultadoJuegos = document.querySelector("#resultado-juegos");
const nivelRuleta = document.querySelector("#nivel-ruleta");

// Escribe texto solo si el elemento existe
function escribirTexto(elemento, texto) {
    if (elemento) {
        elemento.textContent = texto;
    }
}

// Corta textos largos para que no rompan la ruleta
function textoCorto(valor, limite = 6) {
    const texto = String(valor);

    if (texto.length <= limite) {
        return texto;
    }

    return texto.slice(0, limite) + "...";
}

// Número aleatorio
function numeroAleatorio(maximo) {
    return Math.floor(Math.random() * maximo);
}

// Calcula la rotación para que el resultado quede bajo la flecha
function calcularRotacion(gradosActuales, centroSegmento) {
    const vueltaActual = ((gradosActuales % 360) + 360) % 360;
    const posicionFinal = (360 - centroSegmento + 360) % 360;

    let diferencia = posicionFinal - vueltaActual;

    if (diferencia < 0) {
        diferencia += 360;
    }

    return gradosActuales + 1440 + diferencia;
}

// Crea una ficha para las listas
function crearItemLista(valor, claseExtra = "") {
    const item = document.createElement("li");
    item.textContent = valor;
    item.className = claseExtra;
    return item;
}

// Limpia una lista
function limpiarLista(lista) {
    if (lista) {
        lista.innerHTML = "";
    }
}

// Muestra la pantalla del sorteo
function mostrarPantallaSorteo() {
    if (pantallaCargaRifa && pantallaSorteoRifa) {
        pantallaCargaRifa.classList.add("oculto");
        pantallaSorteoRifa.classList.remove("oculto");
    }
}

// Vuelve a la pantalla para editar participantes
function mostrarPantallaCarga() {
    if (pantallaCargaRifa && pantallaSorteoRifa) {
        pantallaSorteoRifa.classList.add("oculto");
        pantallaCargaRifa.classList.remove("oculto");
    }
}

// Dibuja la ruleta de la rifa mostrando todos los números
function mostrarOpcionesEnRuleta(ruleta, opciones) {
    if (!ruleta) {
        return;
    }

    const colores = [
        "#f9ad18",
        "#f97b00",
        "#2f956f",
        "#2e86a6",
        "#4963a6",
        "#8243a3",
        "#df4e37",
        "#536b80"
    ];

    ruleta.innerHTML = "";

    if (opciones.length === 0) {
        ruleta.style.background =
            "conic-gradient(" +
            "#f9ad18 0deg 90deg, " +
            "#f97b00 90deg 180deg, " +
            "#2f956f 180deg 270deg, " +
            "#2e86a6 270deg 360deg)";

        return;
    }

    const cantidad = opciones.length;
    const gradosPorSegmento = 360 / cantidad;
    const partesGradiente = [];

// Crea un segmento para cada participante
for (let indice = 0; indice < cantidad; indice++) {
    const inicio =
        indice * gradosPorSegmento;

    const final =
        (indice + 1) * gradosPorSegmento;

    const color =
        colores[indice % colores.length];

    partesGradiente.push(
        color + " " +
        inicio + "deg " +
        final + "deg"
    );
}

ruleta.style.background =
    "conic-gradient(" +
    partesGradiente.join(", ") +
    ")";

// Configuración de los números
let distancia = 39;
let tamanoLetra = 12;
let limiteTexto = 12;

if (cantidad > 100) {
    distancia = 45;
    tamanoLetra = 8;
    limiteTexto = 5;
} else if (cantidad > 60) {
    distancia = 44;
    tamanoLetra = 9;
    limiteTexto = 6;
} else if (cantidad > 30) {
    distancia = 42;
    tamanoLetra = 10;
    limiteTexto = 7;
}

// Coloca un número dentro de cada segmento
opciones.forEach(function (opcion, indice) {
    const angulo =
        (indice + 0.5) * gradosPorSegmento;

    const radianes =
        (angulo - 90) * Math.PI / 180;

    const posicionX =
        50 + Math.cos(radianes) * distancia;

    const posicionY =
        50 + Math.sin(radianes) * distancia;

    // El número sigue la dirección del segmento
    let rotacionTexto = angulo - 90;

    // Corrige los números del lado izquierdo
    if (angulo > 180) {
        rotacionTexto += 180;
    }

    const etiqueta =
        document.createElement("span");

    etiqueta.className = "opcion-ruleta";

    etiqueta.textContent =
        textoCorto(opcion, limiteTexto);

    etiqueta.title = String(opcion);

    etiqueta.style.left =
        posicionX + "%";

    etiqueta.style.top =
        posicionY + "%";

    etiqueta.style.fontSize =
        tamanoLetra + "px";

    etiqueta.style.transform =
        "translate(-50%, -50%) " +
        "rotate(" + rotacionTexto + "deg)";

    ruleta.appendChild(etiqueta);
});
}
    
// Muestra los participantes que siguen en sorteo
function mostrarDisponibles() {
    limpiarLista(listaDisponibles);

    if (!listaDisponibles) {
        return;
    }

    if (opcionesDisponibles.length === 0) {
        listaDisponibles.appendChild(crearItemLista("Sin opciones", "item-vacio"));
        return;
    }

    opcionesDisponibles.forEach(function (opcion) {
        listaDisponibles.appendChild(crearItemLista(opcion, "item-disponible"));
    });
}

// Muestra solo los números al agua del último giro
function mostrarAlAgua() {
    limpiarLista(listaAgua);

    if (!listaAgua) {
        return;
    }

    if (alAgua.length === 0) {
        listaAgua.appendChild(crearItemLista("Sin números al agua", "item-vacio"));
        return;
    }

    alAgua.forEach(function (opcion) {
        const item = document.createElement("li");
        item.className = "item-agua";

        const valor = document.createElement("strong");
        valor.textContent = opcion;

        const mensaje = document.createElement("span");
        mensaje.textContent = "Sigue participando";

        item.appendChild(valor);
        item.appendChild(mensaje);

        listaAgua.appendChild(item);
    });
}

// Muestra los ganadores
function mostrarGanadores() {
    limpiarLista(listaGanadores);

    if (!listaGanadores) {
        return;
    }

    if (ganadores.length === 0) {
        listaGanadores.appendChild(crearItemLista("Aún no hay ganadores", "item-vacio"));
        return;
    }

    ganadores.forEach(function (opcion) {
        listaGanadores.appendChild(crearItemLista(opcion, "item-ganador"));
    });
}

// Actualiza toda la información visible de la rifa
function actualizarPanelRifa() {
    escribirTexto(numerosRestantes, "Opciones restantes: " + opcionesDisponibles.length);

    mostrarOpcionesEnRuleta(ruletaRifa, opcionesDisponibles);
    mostrarDisponibles();
    mostrarAlAgua();
    mostrarGanadores();
}

// Cargar números para la rifa
if (botonCargarNumeros) {
    botonCargarNumeros.addEventListener("click", function () {
        const inicio = Number(document.querySelector("#numero-inicial").value);
        const final = Number(document.querySelector("#numero-final").value);

        if (inicio > final) {
            alert("El número inicial no puede ser mayor que el número final");
            return;
        }

        opcionesDisponibles = [];
        ganadores = [];
        alAgua = [];
        etapaRifa = 0;

        for (let numero = inicio; numero <= final; numero++) {
            opcionesDisponibles.push(numero);
        }

        gradosRifa = 0;

        if (ruletaRifa) {
            ruletaRifa.style.transform = "rotate(0deg)";
        }

        escribirTexto(numeroRuleta, "?");
        escribirTexto(resultadoRifa, "-");

        actualizarPanelRifa();
        mostrarPantallaSorteo();
    });
}

// Cargar nombres o palabras para la rifa
if (botonCargarPalabras) {
    botonCargarPalabras.addEventListener("click", function () {
        opcionesDisponibles = listaPalabras.value
            .split("\n")
            .map(function (opcion) {
                return opcion.trim();
            })
            .filter(function (opcion) {
                return opcion !== "";
            });

        if (opcionesDisponibles.length === 0) {
            alert("Escribe al menos un nombre o palabra");
            return;
        }

        ganadores = [];
        alAgua = [];
        gradosRifa = 0;
        etapaRifa = 0;

        if (ruletaRifa) {
            ruletaRifa.style.transform = "rotate(0deg)";
        }

        escribirTexto(numeroRuleta, "?");
        escribirTexto(resultadoRifa, "-");

        actualizarPanelRifa();
        mostrarPantallaSorteo();
    });
}

// Editar participantes
if (botonEditarParticipantes) {
    botonEditarParticipantes.addEventListener("click", function () {
        mostrarPantallaCarga();
    });
}

// Girar ruleta de rifa
if (botonGirarRifa) {
    botonGirarRifa.addEventListener("click", function () {
        if (rifaGirando) {
            return;
        }

        if (opcionesDisponibles.length === 0) {
    alert("No quedan opciones disponibles");
    return;
}

// Para completar un ciclo se necesitan tres opciones
if (
    etapaRifa === 0 &&
    opcionesDisponibles.length < 3
) {
    alert(
        "Se necesitan al menos tres opciones " +
        "para realizar otro sorteo"
    );

    return;
}

// Al comenzar un nuevo ciclo,
// los anteriores vuelven a participar
if (etapaRifa === 0) {
    alAgua = [];
    mostrarAlAgua();

    if (
        ruletaRifa.dataset.actualizarRuleta === "si"
    ) {
        mostrarOpcionesEnRuleta(
            ruletaRifa,
            opcionesDisponibles
        );

        ruletaRifa.dataset.actualizarRuleta = "no";
    }
}

// Se excluyen temporalmente los números al agua
const opcionesPermitidas =
    opcionesDisponibles
        .map(function (opcion, indice) {
            return {
                valor: opcion,
                posicion: indice
            };
        })
        .filter(function (participante) {
            return !alAgua.includes(
                participante.valor
            );
        });

            // Se escoge entre las opciones permitidas
        const seleccion =
            opcionesPermitidas[
            numeroAleatorio(opcionesPermitidas.length)
            ];

        const opcionSeleccionada =
            seleccion.valor;

        const posicionSeleccionada =
            seleccion.posicion;

        const centroSegmento =
            (posicionSeleccionada + 0.5) *
            (360 / opcionesDisponibles.length);

        const tituloResultado =
            document.querySelector(
                ".panel-resultado-rifa > p:first-child"
            );

        rifaGirando = true;
        botonGirarRifa.disabled = true;
        botonGirarRifa.textContent = "Girando...";

        escribirTexto(numeroRuleta, "?");
        escribirTexto(resultadoRifa, "...");

        if (etapaRifa === 0) {
            escribirTexto(
                tituloResultado,
                "Sorteando primer número al agua"
            );
        } else if (etapaRifa === 1) {
            escribirTexto(
                tituloResultado,
                "Sorteando segundo número al agua"
            );
        } else {
            escribirTexto(
                tituloResultado,
                "Sorteando ganador"
            );
        }

        gradosRifa = calcularRotacion(
            gradosRifa,
            centroSegmento
        );

        if (contenedorRifa) {
            contenedorRifa.classList.add("destacada");
        }

        ruletaRifa.style.transition =
            "transform 4s cubic-bezier(0.12, 0.75, 0.16, 1)";

        ruletaRifa.style.transform =
            "rotate(" + gradosRifa + "deg)";

        setTimeout(function () {
            escribirTexto(
                numeroRuleta,
                opcionSeleccionada
            );

            escribirTexto(
                resultadoRifa,
                opcionSeleccionada
            );

            // Primer resultado al agua
            if (etapaRifa === 0) {
                alAgua.push(opcionSeleccionada);
                etapaRifa = 1;

                escribirTexto(
                    tituloResultado,
                    "Primer número al agua"
                );
            }

            // Segundo resultado al agua
            else if (etapaRifa === 1) {
                alAgua.push(opcionSeleccionada);
                etapaRifa = 2;

                escribirTexto(
                    tituloResultado,
                    "Segundo número al agua"
                );
            }

            // Tercer resultado ganador
            else {
                ganadores.push(opcionSeleccionada);

                opcionesDisponibles.splice(
                    posicionSeleccionada,
                    1
                );

                etapaRifa = 0;

                escribirTexto(
                    tituloResultado,
                    "Ganador"
                );

                // Se redibuja al comenzar el próximo ciclo
                ruletaRifa.dataset.actualizarRuleta = "si";
            }

            escribirTexto(
                numerosRestantes,
                "Opciones restantes: " +
                opcionesDisponibles.length
            );

            mostrarDisponibles();
            mostrarAlAgua();
            mostrarGanadores();

           botonGirarRifa.textContent = "Resultado";
            contenedorRifa.style.cursor = "pointer";

            contenedorRifa.addEventListener(
                "click",
            function cerrarRuletaGrande() {
                contenedorRifa.classList.remove("destacada");
                contenedorRifa.style.cursor = "default";

            botonGirarRifa.disabled = false;
            botonGirarRifa.textContent = "Girar ruleta";
            rifaGirando = false;
            },
             { once: true }
            );
        }, 4000);
    });
}

// Girar ruleta de juegos
if (botonGirarJuegos) {
    botonGirarJuegos.addEventListener("click", function () {
        if (juegosGirando) {
            return;
        }

        juegosGirando = true;
        botonGirarJuegos.disabled = true;
        botonGirarJuegos.textContent = "Girando...";

        escribirTexto(resultadoJuegos, "Sorteando...");
        escribirTexto(nivelRuleta, "?");

        const niveles = [
        { nombre: "Fácil", grados: 300 },
        { nombre: "Medio", grados: 180 },
        { nombre: "Experto", grados: 60 }
        ];

        const posicionesPermitidas = [];

        for (
            let posicion = 0;
            posicion < niveles.length;
            posicion++
        ) {
        if (posicion !== ultimoNivelJuego) {
            posicionesPermitidas.push(posicion);
            }   
        }

        const posicionGanadora =
            posicionesPermitidas[
            numeroAleatorio(
            posicionesPermitidas.length
        )
        ];

        ultimoNivelJuego = posicionGanadora;

const nivelGanador =
    niveles[posicionGanadora];

        gradosJuegos = calcularRotacion(gradosJuegos, nivelGanador.grados);

        if (contenedorJuegos) {
            contenedorJuegos.classList.add("destacada");
        }

        if (ruletaJuegos) {
            ruletaJuegos.style.transition = "transform 4s cubic-bezier(0.12, 0.75, 0.16, 1)";
            ruletaJuegos.style.transform = "rotate(" + gradosJuegos + "deg)";
        }

        setTimeout(function () {
            escribirTexto(resultadoJuegos, nivelGanador.nombre);
            escribirTexto(nivelRuleta, "?");

            if (contenedorJuegos) {
                contenedorJuegos.classList.remove("destacada");
            }

            botonGirarJuegos.disabled = false;
            botonGirarJuegos.textContent = "Girar ruleta";
            juegosGirando = false;
        }, 4000);
    });
}

// Estado inicial
actualizarPanelRifa();
escribirTexto(resultadoJuegos, "-");
escribirTexto(nivelRuleta, "?");