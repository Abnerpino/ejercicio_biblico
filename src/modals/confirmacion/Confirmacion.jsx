import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import './Confirmacion.css';

const Confirmacion = ({ mensaje, onConfirmar, onCancelar }) => {
    return (
        <div className="modal-confirmacion">
            <div className="modal-contenido-confirmacion">
                <div className='modal-header-confirmacion'>
                    <FontAwesomeIcon icon={faTriangleExclamation} />
                    <p className='text-titulo'>AVISO</p>
                </div>
                <p className='text-mensaje'>{mensaje}</p>
                <div className="modal-botones">
                    <button onClick={onConfirmar} className="btn-confirmar">Confirmar</button>
                    <button onClick={onCancelar} className="btn-cancelar">Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default Confirmacion;
