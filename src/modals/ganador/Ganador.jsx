import { useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, LabelList, ResponsiveContainer, Cell } from 'recharts';
import confetti from 'canvas-confetti';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faHandshake } from '@fortawesome/free-solid-svg-icons';
import './Ganador.css';

const coloresBarras = ['#4169e1', '#32cd32', '#FF33A8', '#ff4500', '#8b0000'];

const Ganador = ({ winner, puntajes, onVolverAlMenu, volumen }) => {
    const hasPlayedRef = useRef(false);
    const nombreSeparado = winner.replace(/(\D+)(\d+)/, '$1 $2');

    useEffect(() => {
        if (!winner || hasPlayedRef.current) return;

        hasPlayedRef.current = true;

        if (winner === 'Empate') {
            if (volumen) {
                const draw = new Audio('sounds/draw.mp3');
                draw.play().catch(err => console.warn('Error al reproducir sonido de empate:', err));
            }
        } else {
            if (volumen) {
                const winners = new Audio('sounds/winners.mp3');
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

    // Transformar objeto puntajes a array para Recharts
    const data = Object.entries(puntajes).map(([equipo, score]) => ({
        name: equipo.replace(/(\D+)(\d+)/, '$1 $2').toUpperCase(),
        score,
    }));

    return (
        <div className="modal">
            <div className="modal-content">
                <p className='titulo-winner'>¡Fin del Juego!</p>
                {winner !== 'Empate' && (
                    <p className='texto-winner'>Felicidades al Ganador:</p>
                )}
                <div className='div-winner'>
                    {winner === 'Empate'
                        ? <FontAwesomeIcon icon={faHandshake} shake size='2x' />
                        : <FontAwesomeIcon icon={faTrophy} beat size='2x' style={{ color: "#FFD43B" }} />
                    }
                    <p className='texto-winner'>{winner === 'Empate' ? 'EMPATE' : `${nombreSeparado.toUpperCase()}`}</p>
                    {winner === 'Empate'
                        ? <FontAwesomeIcon icon={faHandshake} shake size='2x' />
                        : <FontAwesomeIcon icon={faTrophy} beat size='2x' style={{ color: "#FFD43B" }} />
                    }
                </div>

                {/* Gráfica de barras */}
                <div style={{ marginTop: '20px', width: '100%', height: 250 }}>
                    <ResponsiveContainer>
                        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            {/* Mejor usar una sola barra para todos los datos */}
                            <Bar dataKey="score" >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={coloresBarras[index % coloresBarras.length]} />
                                ))}
                                <LabelList
                                    dataKey="score"
                                    position="top"
                                    style={{ fontWeight: 'bold', fontSize: 16 }}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <button className="volver-button" onClick={onVolverAlMenu}>
                    Volver al Menú
                </button>
            </div>
        </div>
    );
};

export default Ganador;
