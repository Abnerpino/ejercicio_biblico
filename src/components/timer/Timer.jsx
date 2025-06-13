import React, { useEffect, useState, useRef } from 'react';
import './Timer.css';

const Timer = ({ segundos, detener, volumen, onUpdate }) => {
  const [tiempoRestante, setTiempoRestante] = useState(segundos);
  const circleRef = useRef(null);
  const sonidoRef = useRef(null);

  useEffect(() => {
    setTiempoRestante(segundos); // sincroniza con cambios externos
  }, [segundos]);

  useEffect(() => {
    if (detener) {
      setTiempoRestante(0); // fuerza a 0 cuando se activa detener
      onUpdate?.(0); // Notifica al modal de pregunta
      if (circleRef.current) {
        circleRef.current.style.animation = 'none';
        circleRef.current.style.strokeDashoffset = '283';
      }
      if (sonidoRef.current) {
        sonidoRef.current.pause();
        sonidoRef.current.currentTime = 0; // Reinicia el sonido
      }
      return;
    }

    if (tiempoRestante <= 0) {
      if (circleRef.current) {
        circleRef.current.style.animationPlayState = 'paused';
      }
      return;
    }

    if (circleRef.current) {
      // Reinicia la animación cada vez que inicia el timer
      circleRef.current.style.animation = 'none';
      // Forzar reflow para reiniciar animación
      void circleRef.current.offsetWidth;
      circleRef.current.style.animation = `countdown ${segundos}s linear forwards`;
      circleRef.current.style.animationPlayState = 'running';
    }

    const interval = setInterval(() => {
      setTiempoRestante(prev => {
        const nuevoTiempo = prev - 1;
        if (nuevoTiempo <= 0) {
          clearInterval(interval);
          onUpdate?.(0);
          return 0;
        }

        if (nuevoTiempo === 10 && !detener) {
          if (sonidoRef.current) {
            if (volumen) {
              sonidoRef.current.play().catch((e) => {
                console.warn('No se pudo reproducir el sonido:', e);
              });
            }
          }
        }

        onUpdate?.(nuevoTiempo);
        return nuevoTiempo;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      if (sonidoRef.current) {
        sonidoRef.current.pause();
        sonidoRef.current.currentTime = 0; // Reinicia el sonido al desmontar
      }
    };
  }, [detener, segundos]);

  const getColor = (segundosRestantes) => {
    const ratio = segundosRestantes / segundos;
    if (ratio > 0.5) return '#0f0'; // verde
    if (ratio > 0.25) return '#ff8000'; // naranja
    return '#f00'; // rojo
  };

  return (
    <div className="timer-wrapper">
      <svg className="timer-svg" viewBox="0 0 100 100">
        <circle
          className="timer-circle-bg"
          cx="50"
          cy="50"
          r="45"
          stroke="#ddd"
          strokeWidth="6"
          fill="none"
        />
        <circle
          ref={circleRef}
          className="timer-circle"
          cx="50"
          cy="50"
          r="45"
          strokeDasharray="283"
          strokeDashoffset="0"
          stroke={getColor(tiempoRestante)}
          strokeWidth="6"
          fill="none"
          transform="rotate(-90 50 50)"
        />
        <text x="50" y="52.5" className="timer-text">
          {tiempoRestante}s
        </text>
      </svg>
      <audio ref={sonidoRef} src="/sounds/timer.mp3" preload="auto" />
    </div>
  );
};

export default Timer;
