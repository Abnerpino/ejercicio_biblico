import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faHandshake } from '@fortawesome/free-solid-svg-icons';
import './Ganador.css';

const Ganador = ({ winner, onVolverAlMenu, volumen }) => {
    const hasPlayedRef = useRef(false);
    const nombreSeparado = winner.replace(/(\D+)(\d+)/, '$1 $2');

    useEffect(() => {
        if (!winner || hasPlayedRef.current) return;

        hasPlayedRef.current = true;

        if (winner === 'Empate') {
            if (volumen) {
                const draw = new Audio('/sounds/draw.mp3');
                draw.play().catch(err => console.warn('Error al reproducir sonido de empate:', err));
            }
        } else {
            if (volumen) {
                const winners = new Audio('/sounds/winners.mp3');
                winners.play().catch(err => console.warn('Error al reproducir sonido de victoria:', err));
            }

            // 🎉 Confeti al azar
            confetti({
                particleCount: 300,
                spread: 100,
                origin: { y: 0.6 }
            });

            const canvas = document.querySelector('canvas');
            if (canvas) {
                canvas.style.position = 'fixed';
                canvas.style.zIndex = '9999';
                canvas.style.pointerEvents = 'none';
            }
        }
    }, [winner]);

    return (
        <div className="modal">
            <div className="modal-content">
                <p className='titulo-winner'>¡Fin del juego!</p>
                <div className='div-winner'>
                    <p className='texto-winner'>{winner === 'Empate' ? 'Hubo un empate.' : `Ganó ${nombreSeparado.toUpperCase()}`}</p>
                    {winner === 'Empate'
                        ? <FontAwesomeIcon icon={faHandshake} shake size='2x' />
                        : <FontAwesomeIcon icon={faTrophy} beat size='2x' style={{ color: "#FFD43B" }} />
                    }
                </div>
                <button className="volver-button" onClick={onVolverAlMenu}>
                    Volver al Menú
                </button>
            </div>
        </div>
    );
};

export default Ganador;
