import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListOl, faPen } from '@fortawesome/free-solid-svg-icons';
import './Ordenacion.css';

const Ordenacion = ({ equipos, nombresEquipos, setNombresEquipos, colores, onCerrar, volumen }) => {
    const [equiposVisibles, setEquiposVisibles] = useState(0);
    const [mostrarBoton, setMostrarBoton] = useState(false);
    const [editando, setEditando] = useState(null);
    const [nombreTemp, setNombreTemp] = useState('');

    useEffect(() => {
        if (equiposVisibles < equipos.length) {
            const timeout = setTimeout(() => {
                if (volumen) {
                    const bubbles = new Audio('/sounds/bubbles.mp3');
                    bubbles.play().catch((e) => {
                        console.warn('No se pudo reproducir el sonido:', e);
                    });
                }
                setEquiposVisibles(equiposVisibles + 1);
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [equiposVisibles, equipos.length]);

    useEffect(() => {
        if (equiposVisibles === equipos.length) {
            const timeout = setTimeout(() => {
                setMostrarBoton(true);
            }, 1000); // Retraso de medio segundo antes de mostrar el botón
            return () => clearTimeout(timeout);
        } else {
            // Si los equipos no están todos visibles, ocultar el botón
            setMostrarBoton(false);
        }
    }, [equiposVisibles, equipos.length]);

    // Inicia el modo edición
    const iniciarEdicion = (equipo) => {
        setEditando(equipo);
        setNombreTemp(nombresEquipos[equipo]);
    };

    // Guarda el nombre modificado
    const guardarEdicion = (equipo) => {
        if (nombreTemp.trim() !== '') {
            setNombresEquipos(prev => ({
                ...prev,
                [equipo]: nombreTemp.trim().toUpperCase()
            }));
        }
        setEditando(null);
    };

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
                            <p className='numero-turno'>{i + 1}{(i + 1 === 1 || i + 1 === 3) ? 'er' : (i + 1 >= 4 ? 'to' : 'do')} Turno:</p>
                            <div
                                className="equipo-box-orden visible"
                                style={{
                                    backgroundColor: colores[i % colores.length],
                                    color: 'white',
                                    transitionDelay: `${i * 0.3}s`, // cada equipo se anima con 0.3s de diferencia
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                {editando === equipo ? (
                                    <input 
                                        type="text" 
                                        value={nombreTemp} 
                                        onChange={(e) => setNombreTemp(e.target.value)}
                                        onBlur={() => guardarEdicion(equipo)}
                                        onKeyDown={(e) => e.key === 'Enter' && guardarEdicion(equipo)}
                                        autoFocus
                                        maxLength={10}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            borderBottom: '2px solid white',
                                            color: 'white',
                                            fontSize: 'inherit',
                                            fontFamily: 'inherit',
                                            textAlign: 'center',
                                            outline: 'none',
                                            width: '80%'
                                        }}
                                    />
                                ) : (
                                    <>
                                        <span>{nombresEquipos[equipo]}</span>
                                        <FontAwesomeIcon 
                                            icon={faPen} 
                                            style={{ 
                                                position: 'absolute', 
                                                right: '15px', 
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                cursor: 'pointer',
                                                fontSize: '0.8em',
                                                opacity: 0.8
                                            }} 
                                            onClick={() => iniciarEdicion(equipo)}
                                            title="Editar nombre"
                                        />
                                    </>
                                )}
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