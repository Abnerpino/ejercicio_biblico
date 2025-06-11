import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListOl } from '@fortawesome/free-solid-svg-icons';
import './Ordenacion.css';

const Ordenacion = ({ equipos, colores, onCerrar }) => {
    const [equiposVisibles, setEquiposVisibles] = useState(0);
    const [mostrarBoton, setMostrarBoton] = useState(false);

    useEffect(() => {
        if (equiposVisibles < equipos.length) {
            const timeout = setTimeout(() => {
                setEquiposVisibles(equiposVisibles + 1);
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [equiposVisibles, equipos.length]);

    useEffect(() => {
        if (equiposVisibles === equipos.length) {
            const timeout = setTimeout(() => {
                setMostrarBoton(true);
            }, 500); // Retraso de medio segundo antes de mostrar el botón
            return () => clearTimeout(timeout);
        } else {
            // Si los equipos no están todos visibles, ocultar el botón
            setMostrarBoton(false);
        }
    }, [equiposVisibles, equipos.length]);

    return (
        <div className="modal-orden">
            <div className="modal-contenido-orden">
                <div className='modal-header-orden'>
                    <FontAwesomeIcon icon={faListOl} fade />
                    <p className='text-titulo-orden'>Orden de Turnos</p>
                </div>
                <div className="lista-equipos">
                    {equipos.slice(0, equiposVisibles).map((equipo, i) => (
                        <div key={equipo} className='div-equipo'>
                            <p className='numero-turno'>{i+1}{(i+1 === 1 || i+1 === 3) ? 'er' : (i+1 >= 4 ? 'to' : 'do')} Turno:</p>
                            <div
                                className="equipo-box-orden visible"
                                style={{
                                    backgroundColor: colores[i % colores.length],
                                    color: 'white',
                                    transitionDelay: `${i * 0.3}s`, // cada equipo se anima con 0.3s de diferencia ro do ro to to
                                }}
                            >
                                {equipo.replace(/(\D+)(\d+)/, '$1 $2').toUpperCase()}
                            </div>
                        </div>
                    ))}
                </div>
                {mostrarBoton && (
                    <button className="btn-continuar" onClick={onCerrar}>Continuar</button>
                )}
            </div>
        </div>
    );
};

export default Ordenacion;