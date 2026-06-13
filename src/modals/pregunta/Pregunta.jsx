import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark, faEye } from '@fortawesome/free-solid-svg-icons';
import Circle1 from '../../assets/circle-1.svg?react';
import Circle2 from '../../assets/circle-2.svg?react';
import Circle3 from '../../assets/circle-3.svg?react';
import Robo from '../../assets/robbery.svg?react';
import Timer from '../../components/timer';
import './Pregunta.css';

const Pregunta = ({ index, topico, pregunta, respuesta, puntos, cita, tiempo, incremento, onResponder, volumen, numEquipos, turno, equipos, nombresEquipos, contador }) => {
    const [mostrarRespuesta, setMostrarRespuesta] = useState(false);
    const [respuestaCorrecta, setRespuestaCorrecta] = useState(null);
    const [animando, setAnimando] = useState(false);
    const [robarPuntos, setRobarPuntos] = useState(false);
    const segundosIniciales = tiempo + (index * incremento);
    const [segundosRestantes, setSegundosRestantes] = useState(segundosIniciales);
    const indexActual = equipos.indexOf(turno);
    const siguiente = equipos[(indexActual + 1) % equipos.length];

    const sincronizarTiempo = (nuevoTiempo) => {
        setSegundosRestantes(nuevoTiempo);
    };

    const responder = (value) => {
        if (volumen) {
            const sonido = new Audio(value ? '/sounds/correct-ding.mp3' : '/sounds/negative_beeps.mp3');
            sonido.play().catch((e) => {
                console.warn('No se pudo reproducir el sonido:', e);
            });
        }

        setRespuestaCorrecta(value);
        setAnimando(true);

        // Esperar duración de animación 2 segundos
        setTimeout(() => {
            setAnimando(false);
            let resultado = {
                equipoSuma: null,
                equipoResta: null,
                puntos,
            };

            if (robarPuntos) {
                if (value) {
                    resultado.equipoSuma = siguiente;
                } else {
                    resultado.equipoResta = siguiente;
                }
            } else {
                if (value) {
                    resultado.equipoSuma = turno;
                } else {
                    resultado.equipoResta = turno;
                }
            }

            onResponder(value, resultado);
        }, 2000);
    };

    const verRespuesta = () => {
        if (volumen) {
            const show = new Audio('/sounds/show.mp3');
            show.play().catch((e) => {
                console.warn('No se pudo reproducir el sonido:', e);
            });
        }

        setMostrarRespuesta(true);
    };

    const roboPuntos = () => {
        if (volumen) {
            const robo = new Audio('/sounds/robo.mp3');
            robo.play().catch((e) => {
                console.warn('No se pudo reproducir el sonido:', e);
            });
        }

        setRobarPuntos(true);
    };

    return (
        <div className="modal-pregunta">
            <div className="modal-content">
                {animando && (
                    <div className={`respuesta-animacion ${respuestaCorrecta ? 'correcto' : 'incorrecto'}`}>
                        {respuestaCorrecta
                            ? <FontAwesomeIcon icon={faCheck} style={{ color: "#3fa847", }} />
                            : <FontAwesomeIcon icon={faXmark} style={{ color: "#ff0000", }} />
                        }
                    </div>
                )}

                <div className="contenedor-turno">
                    <p className="turno-texto">Turno de: </p>
                    <p className="turno-texto nombre">{nombresEquipos[turno]}</p>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <p className="titulo-texto">{topico}: {puntos} puntos</p>
                </div>

                <Timer
                    segundos={segundosIniciales}
                    detener={mostrarRespuesta}
                    volumen={volumen}
                    onUpdate={sincronizarTiempo}
                />

                <div className="mb-4">
                    <p className="pregunta-texto">{pregunta}</p>
                </div>

                {!mostrarRespuesta ? (
                    <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', marginTop: '15px' }}>
                        <button
                            className="button blue mb-4"
                            onClick={verRespuesta}
                        >
                            <FontAwesomeIcon icon={faEye} style={{ marginRight: '5px' }} />
                            Mostrar respuesta
                        </button>
                        {contador > 0 && (
                            <div
                                className='icon-contador'
                                title='Si se acumulan 3 preguntas incorrectas, la siguiente pregunta incorrecta restará el puntaje.'
                                style={{ display: 'flex' }}
                            >
                                {contador === 1 && (
                                    <Circle1
                                        width={40}
                                        height={40}
                                        style={{ color: "#008f39" }}
                                    />
                                )}
                                {contador === 2 && (
                                    <Circle2
                                        width={40}
                                        height={40}
                                        style={{ color: "#ff8000" }}
                                    />
                                )}
                                {contador === 3 && (
                                    <Circle3
                                        width={40}
                                        height={40}
                                        style={{ color: "#ff0000" }}
                                    />
                                )}
                            </div>
                        )}
                        {numEquipos > 1 && segundosRestantes === 0 && (
                            <button
                                className="button yellow mb-4"
                                onClick={roboPuntos}
                                disabled={robarPuntos}
                            >
                                <Robo width={17.5} height={17.5} />
                                {robarPuntos ? '¡Robo de Puntos Activado!' : `Robo de Puntos: ${nombresEquipos[siguiente]}`}
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="button-group">
                        <p className="respuesta-texto">Respuesta: <b>{respuesta}</b></p>
                        {cita && (
                            <p className="cita-texto">Cita - {cita}</p>
                        )}
                        <button
                            className="button green secondary"
                            onClick={() => responder(true)}
                        >
                            Correcta
                        </button>
                        <button
                            className="button red secondary"
                            onClick={() => responder(false)}
                        >
                            Incorrecta
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Pregunta;
