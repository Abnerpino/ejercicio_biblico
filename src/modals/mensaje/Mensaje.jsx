import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import './Mensaje.css'; // Asegúrate de crear también este CSS

const Mensaje = ({ mensaje, visible, onCerrar }) => {
  if (!visible) return null;

  const mensajes = mensaje.includes('\n') ? mensaje.split('\n') : [mensaje];

  return (
    <div className="modal-message">
      <div className="modal-contenido-mensaje">
        <div className='modal-header-mensaje'>
          <FontAwesomeIcon icon={faTriangleExclamation} />
          <p className='text-titulo'>AVISO</p>
        </div>
        <div className='modal-mensaje-lista'>
          <ul>
            {mensajes.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>
        <button className='modal-contenido-button' onClick={onCerrar}>Cerrar</button>
      </div>
    </div>
  );
};

export default Mensaje;
