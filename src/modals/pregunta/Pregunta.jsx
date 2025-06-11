import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import Timer from '../../components/timer';
import './Pregunta.css';

const Pregunta = ({ index, topico, pregunta, respuesta, puntos, cita, tiempo, incremento, onResponder, volumen }) => {
    const [mostrarRespuesta, setMostrarRespuesta] = useState(false);
    const [respuestaCorrecta, setRespuestaCorrecta] = useState(null);
    const [animando, setAnimando] = useState(false);

    const segundosIniciales = tiempo + (index * incremento);

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
            onResponder(value);
        }, 2000);
    };

    const verRspuesta = () => {
        if (volumen) {
            const show = new Audio('/sounds/show.mp3');
            show.play().catch((e) => {
                console.warn('No se pudo reproducir el sonido:', e);
            });
        }

        setMostrarRespuesta(true);
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

                <div className="flex justify-between items-center mb-4">
                    <p className="titulo-texto">{topico}: {puntos} puntos</p>
                </div>

                <Timer
                    segundos={segundosIniciales}
                    detener={mostrarRespuesta}
                    volumen={volumen}
                />

                <div className="mb-4">
                    <p className="pregunta-texto">{pregunta}</p>
                </div>

                {!mostrarRespuesta ? (
                    <button
                        className="button blue mb-4"
                        onClick={verRspuesta}
                    >
                        Mostrar respuesta
                    </button>
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
