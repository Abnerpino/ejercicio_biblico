import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Marquee from 'react-fast-marquee';
import Volumen from '../../assets/volume.svg?react';
import SinVolumen from '../../assets/volume-slash.svg?react';
import { cargarArchivosGuardados } from '../../utils/storage';
import Ordenacion from '../../modals/ordenacion';
import Confirmacion from '../../modals/confirmacion';
import Pregunta from '../../modals/pregunta';
import Ganador from '../../modals/ganador';
import preguntasJSON from '../../data/preguntas.json';
import './Tablero.css';

const Tablero = ({ volumen, setVolumen }) => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [turno, setTurno] = useState(null);
    const [puntajes, setPuntajes] = useState({});
    const [contadores, setContadores] = useState([]);
    const [nombresEquipos, setNombresEquipos] = useState({});
    const [equipoParaRestar, setEquipoParaRestar] = useState(null);
    const [preguntasData, setPreguntasData] = useState([]);
    const [preguntaSeleccionada, setPreguntaSeleccionada] = useState(null);
    const [preguntasUsadas, setPreguntasUsadas] = useState(new Set());
    const [ganador, setGanador] = useState(null);
    const [finJuego, setFinJuego] = useState(false);
    const [bloqueoActivo, setBloqueoActivo] = useState(false);
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
    const [mostrarModalOrden, setMostrarModalOrden] = useState(false);
    const [ordenEquipos, setOrdenEquipos] = useState([]);
    const confirmacionResolver = useRef(null);
    const iniciarBtnRef = useRef(null);

    const archivoId = state?.archivoId;
    const config = state?.config || { tiempoInicial: 30, incremento: 15, equipos: 1 };
    const coloresEquipos = ['#00008b', '#ff00ff', '#5f9ea0', '#d2691e', '#006400'];

    // Cargar preguntas del archivo correspondiente
    useEffect(() => {
        if (!archivoId) {
            navigate('/'); // regresar si no hay datos
            return;
        }

        if (archivoId === 'original') {
            setPreguntasData(preguntasJSON);
        } else {
            const guardados = cargarArchivosGuardados();
            const archivo = guardados.find(a => a.id === archivoId);

            if (!archivo) {
                navigate('/');
                return;
            }

            setPreguntasData(archivo.contenido);
        }

        // Inicializar puntajes dinámicamente según cantidad de equipos
        const nuevosPuntajes = {};
        const nuevosContadores = {};
        const nuevosNombres = {};
        for (let i = 1; i <= config.equipos; i++) {
            nuevosPuntajes[`equipo${i}`] = 0;
            nuevosContadores[`equipo${i}`] = 0;
            nuevosNombres[`equipo${i}`] = `EQUIPO ${i}`;
        }
        setPuntajes(nuevosPuntajes);
        setContadores(nuevosContadores);
        setNombresEquipos(nuevosNombres);
    }, [archivoId]);

    const iniciarJuego = () => {
        if (volumen) {
            const start = new Audio('sounds/start-game.mp3');
            start.play().catch((e) => {
                console.warn('No se pudo reproducir el sonido:', e);
            });
        }

        const equipos = Array.from({ length: config.equipos }, (_, i) => `equipo${i + 1}`);
        const aleatorio = equipos.sort(() => Math.random() - 0.5);
        setOrdenEquipos(aleatorio);
        setMostrarModalOrden(true);
        setFinJuego(false);
    };

    const cerrarModalOrden = () => {
        setMostrarModalOrden(false);
        setTurno(ordenEquipos[0]);
    };

    const finalizarJuego = () => {
        setFinJuego(true);
    };

    const resetearJuego = () => {
        const nuevosPuntajes = {};
        const nuevosContadores = {};
        const nuevosNombres = {};
        for (let i = 1; i <= config.equipos; i++) {
            nuevosPuntajes[`equipo${i}`] = 0;
            nuevosContadores[`equipo${i}`] = 0;
            nuevosNombres[`equipo${i}`] = `EQUIPO ${i}`;
        }
        setGanador(null);
        setPuntajes(nuevosPuntajes);
        setContadores(nuevosContadores);
        setNombresEquipos(nuevosNombres);
        setPreguntasUsadas(new Set());
        setTurno(null);
        setPreguntaSeleccionada(null);
        setOrdenEquipos([]);
    };

    // Función que muestra el modal y espera confirmación
    const solicitarConfirmacion = (mensaje) => {
        return new Promise((resolve) => {
            confirmacionResolver.current = resolve;
            setMostrarConfirmacion({ mensaje });
        });
    };

    const volverAlMenu = async () => {
        if (turno && !ganador) {
            const confirmado = await solicitarConfirmacion(`¿Está seguro de querer volver al Menú? Todo el progreso de la partida se perderá.`);
            if (!confirmado) return; // El usuario canceló
        }
        if (volumen) {
            const disconnected = new Audio('sounds/disconnected.mp3');
            disconnected.play().catch((e) => {
                console.warn('No se pudo reproducir el sonido:', e);
            });
        }
        setTimeout(() => {
            resetearJuego();  // Función que restablece preguntas, puntajes, etc.
            navigate('/');    // Redirige al menú principal
        }, 500);
    };

    const seleccionarPregunta = (topicoIndex, preguntaIndex) => {
        const disable = new Audio('sounds/notification-disable.mp3');
        if (!turno || bloqueoActivo) {
            if (volumen) {
                disable.play().catch((e) => {
                    console.warn('No se pudo reproducir el sonido:', e);
                });
            }
            // Animación de sacudida en el botón de inicio
            if (iniciarBtnRef.current) {
                iniciarBtnRef.current.classList.remove('animar-aviso'); // reset si ya está aplicada
                void iniciarBtnRef.current.offsetWidth; // reflow para reiniciar la animación
                iniciarBtnRef.current.classList.add('animar-aviso');
            }
            return;
        }
        const clave = `${topicoIndex}-${preguntaIndex}`;
        if (preguntasUsadas.has(clave)) {
            if (volumen) {
                disable.play().catch((e) => {
                    console.warn('No se pudo reproducir el sonido:', e);
                });
            }
            return;
        }
        if (volumen) {
            const click = new Audio('sounds/keyboard-click.mp3');
            click.play().catch((e) => {
                console.warn('No se pudo reproducir el sonido:', e);
            });
        }
        const topico = preguntasData[topicoIndex];
        setPreguntaSeleccionada({
            topicoIndex,
            preguntaIndex,
            topico: topico.topico,
            pregunta: topico.preguntas[preguntaIndex],
            respuesta: topico.respuestas[preguntaIndex],
            puntos: topico.puntos[preguntaIndex],
            cita: topico.citas?.[preguntaIndex] ?? '',
        });
    };

    const manejarRespuesta = (acertado, resultado) => {
        if (!preguntaSeleccionada) return;

        const clave = `${preguntaSeleccionada.topicoIndex}-${preguntaSeleccionada.preguntaIndex}`;
        setPreguntasUsadas(prev => new Set(prev).add(clave));
        setPreguntaSeleccionada(null);

        // Aplicar los puntajes según el resultado
        if (resultado?.equipoSuma) {
            setPuntajes(prev => ({
                ...prev,
                [resultado.equipoSuma]: prev[resultado.equipoSuma] + resultado.puntos,
            }));
        } else if (resultado?.equipoResta) {
            setContadores(prev => {
                const nuevoContador = prev[resultado.equipoResta] + 1 > 3 ? 0 : prev[resultado.equipoResta] + 1;

                // Marcamos si se debe restar puntaje
                if (nuevoContador === 0 || resultado.equipoResta !== turno) {
                    setEquipoParaRestar({
                        equipo: resultado.equipoResta,
                        puntos: resultado.puntos
                    });
                }

                return {
                    ...prev,
                    [resultado.equipoResta]: nuevoContador
                };
            });
        }

        setBloqueoActivo(true); // activar bloqueo
        setTimeout(() => {
            setBloqueoActivo(false);
            // Cambiar turno al siguiente equipo
            const indexActual = ordenEquipos.indexOf(turno);
            const siguiente = ordenEquipos[(indexActual + 1) % ordenEquipos.length];
            setTurno(siguiente);
        }, 1000);
    };

    useEffect(() => {	//224 nuevo todo
        if (equipoParaRestar) {
            setPuntajes(prev => ({
                ...prev,
                [equipoParaRestar.equipo]: Math.max(0, prev[equipoParaRestar.equipo] - equipoParaRestar.puntos),
            }));

            setEquipoParaRestar(null); // limpiar estado
        }
    }, [equipoParaRestar]);

    useEffect(() => {
        if (!turno) return;

        const totalPreguntas = preguntasData.reduce((acc, t) => acc + (t.preguntas?.length || 0), 0);
        const terminado = finJuego || preguntasUsadas.size === totalPreguntas;

        if (terminado) {
            setTurno(null);
            const puntajesArray = Object.entries(puntajes);
            const maxPuntaje = Math.max(...puntajesArray.map(([_, p]) => p));

            // Si todos los equipos tienen puntaje 0 => empate
            if (puntajesArray.every(([_, p]) => p === 0)) {
                setGanador('Empate');
                return;
            }

            // Filtrar equipos que tienen el puntaje máximo
            const ganadores = puntajesArray.filter(([_, p]) => p === maxPuntaje);
            setGanador(ganadores.length > 1 ? 'Empate' : ganadores[0][0]);
        }
    }, [finJuego, preguntasUsadas, puntajes, preguntasData]);

    return (
        <div className="pantalla-juego">
            <div className='btn-volver-menu'>
                <FontAwesomeIcon
                    icon={faArrowLeft}
                    size='2x'
                    title='Regresar al Menú'
                    onClick={volverAlMenu}
                />
            </div>
            <div className='btn-volumen' title={volumen ? 'Silenciar sonidos del juego' : 'Activar sonidos del juego'}>
                {volumen
                    ? (
                        <Volumen
                            width={40}
                            height={40}
                            onClick={() => setVolumen(!volumen)}
                        />
                    ) : (
                        <SinVolumen
                            width={40}
                            height={40}
                            onClick={() => setVolumen(!volumen)}
                        />
                    )
                }
            </div>
            <div className="header">
                <div>
                    {!turno
                        ? <button ref={iniciarBtnRef} className="button green" onClick={iniciarJuego}><h3>Iniciar Juego</h3></button>
                        : <button className="button red" onClick={finalizarJuego}><h3>Terminar Juego</h3></button>
                    }
                </div>
                {/* Mostrar equipos solo después de cerrar el modal */}
                {turno && ordenEquipos.length > 0 && !mostrarModalOrden && ordenEquipos.map((equipo, i) => (
                    <div
                        key={equipo}
                        className={`equipo-box ${turno === equipo ? 'activo' : ''}`}

                    >
                        <p className='texto-equipo'>{nombresEquipos[equipo]}</p>
                        <p className='texto-puntaje'>{puntajes[equipo]}</p>
                    </div>
                ))}
            </div>

            <div className="tabla-preguntas">
                <div className="fila topicos">
                    {preguntasData.map((topico, i) => (
                        <div
                            key={i}
                            className="celda topico"
                        >
                            {topico.topico.length > 10 ? (
                                <Marquee speed={25}>
                                    <span style={{ marginRight: 50 }}>{topico.topico}</span>
                                </Marquee>
                            ) : (
                                topico.topico
                            )}
                        </div>
                    ))}
                </div>
                {[0, 1, 2, 3, 4].map((fila) => (
                    <div className="fila" key={fila}>
                        {preguntasData.map((topico, col) => {
                            const clave = `${col}-${fila}`;
                            const usada = preguntasUsadas.has(clave);
                            return (
                                <button
                                    key={col}
                                    onClick={() => seleccionarPregunta(col, fila)}
                                    className={`button celda ${usada ? 'disabled' : ''}`}
                                >
                                    {topico.puntos[fila]}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>

            {mostrarModalOrden && (
                <Ordenacion
                    equipos={ordenEquipos}
                    nombresEquipos={nombresEquipos}
                    setNombresEquipos={setNombresEquipos}
                    colores={coloresEquipos}
                    onCerrar={cerrarModalOrden}
                    volumen={volumen}
                />
            )}

            {mostrarConfirmacion && (
                <Confirmacion
                    mensaje={mostrarConfirmacion.mensaje}
                    onConfirmar={() => {
                        confirmacionResolver.current(true);
                        setMostrarConfirmacion(false);
                    }}
                    onCancelar={() => {
                        confirmacionResolver.current(false);
                        setMostrarConfirmacion(false);
                    }}
                />
            )}

            {preguntaSeleccionada && (
                <Pregunta
                    index={preguntaSeleccionada.preguntaIndex}
                    topico={preguntaSeleccionada.topico}
                    pregunta={preguntaSeleccionada.pregunta}
                    respuesta={preguntaSeleccionada.respuesta}
                    puntos={preguntaSeleccionada.puntos}
                    cita={preguntaSeleccionada.cita}
                    tiempo={config.tiempoInicial}
                    incremento={config.incremento}
                    onResponder={manejarRespuesta}
                    volumen={volumen}
                    numEquipos={config.equipos}
                    turno={turno}
                    equipos={ordenEquipos}
                    nombresEquipos={nombresEquipos}
                    contador={contadores[turno]}
                />
            )}

            {ganador && (
                <Ganador
                    winner={ganador}
                    puntajes={puntajes}
                    nombresEquipos={nombresEquipos}
                    onVolverAlMenu={volverAlMenu}
                    volumen={volumen}
                />
            )}
        </div>
    );
};

export default Tablero;
