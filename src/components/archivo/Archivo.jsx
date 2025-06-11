import React from 'react';
import './Archivo.css';

const Archivo = ({ archivo, activo, onSeleccionar, esOriginal, totalArchivos }) => {
    const deshabilitarCheckbox = esOriginal && totalArchivos === 1;

    return (
        <div className="archivo-card">
            <div className='check-box'>
                <input
                    type="checkbox"
                    checked={activo}
                    onChange={() => onSeleccionar(archivo.id)}
                    disabled={deshabilitarCheckbox}
                />
            </div>
            <div className='card'>
                <div className="archivo-header">
                    <p className="archivo-titulo">{archivo.nombre}</p>
                </div>
                <div className="archivo-topicos">
                    {archivo.topicos.map((t, i) => (
                        <span key={i}>{t.toUpperCase()}</span>
                    ))}
                </div>
                <div className='archivo-footer'>
                    <p className="archivo-total">Total de preguntas: {archivo.total}</p>
                </div>
            </div>
        </div>
    );
};

export default Archivo;
