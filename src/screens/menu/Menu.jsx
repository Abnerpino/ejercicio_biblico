import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookBible, faTrashCan, faFileCirclePlus, faRightFromBracket, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import Volumen from '../../assets/volume.svg?react';
import SinVolumen from '../../assets/volume-slash.svg?react';
import { cargarArchivosGuardados, guardarArchivos } from '../../utils/storage';
import preguntasJSON from '../../data/preguntas.json';
import Archivo from '../../components/archivo';
import Mensaje from '../../modals/mensaje';
import Confirmacion from '../../modals/confirmacion';
import Multiple from '../../modals/multiple';
import './Menu.css';

const archivoOriginal = {
  id: 'original',
  nombre: 'Preguntas_Original',
  topicos: [...new Set(preguntasJSON.map(j => j.topico))],
  total: preguntasJSON.reduce((acc, j) => acc + j.preguntas.length, 0)
};

const { ipcRenderer } = window.require('electron');

const Menu = ({ volumen, setVolumen }) => {
  const [archivos, setArchivos] = useState([]);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState('original');
  const [config, setConfig] = useState({ tiempoInicial: 30, incremento: 15, equipos: 1 });
  const [mensajeError, setMensajeError] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mostrarMultiModal, setMostrarMultiModal] = useState(0);
  const confirmacionResolver = useRef(null);
  const inputRef = useRef();
  const navigate = useNavigate();

  const archivoActual = archivos.find(a => a.id === archivoSeleccionado);
  const totalPreguntas = archivoActual ? archivoActual.total : 0;
  const opcionesEquipos = [1, 2, 3, 4, 5];

  // Función para manejar selección de equipos
  const seleccionarEquipos = (habilitado, num) => {
    if (!habilitado) {
      if (volumen) {
        const notSelection = new Audio('sounds/not-selection.mp3');
        notSelection.play().catch((e) => {
          console.warn('No se pudo reproducir el sonido:', e);
        });
      }
      return;
    }

    if (volumen) {
      const click = new Audio('sounds/click.mp3');
      click.play().catch((e) => {
        console.warn('No se pudo reproducir el sonido:', e);
      });
    }

    setConfig(prev => ({ ...prev, equipos: num }));
  };

  useEffect(() => {
    const guardados = cargarArchivosGuardados();
    setArchivos([archivoOriginal, ...guardados]);
  }, []);

  const saveJSONFile = async () => {
    let jsonFile;
    const files = cargarArchivosGuardados();
    if (archivoSeleccionado === 'original') {
      jsonFile = {
        nombre: 'Preguntas_Original',
        contenido: preguntasJSON
      };
    } else {
      jsonFile = files.find(f => f.id === archivoSeleccionado);
    }

    const resultado = await ipcRenderer.invoke('guardar-json', jsonFile);
    const sonido = new Audio(resultado ? 'sounds/save.mp3' : 'sounds/cancel.mp3');
    sonido.play().catch((e) => {
      console.warn('No se pudo reproducir el sonido:', e);
    });
  };

  const handleAgregarArchivo = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        const errores = [];

        // Validar estructura
        if (!Array.isArray(json)) {
          mostrarMensaje("El archivo no tiene la estructura correcta.");
          return;
        }

        // Validar la cantiad de tópicos
        const numTopicos = json.entries().reduce((acc, j) => acc + 1, 0);
        if (numTopicos > 6) {
          errores.push(`¡El archivo contiene ${numTopicos} tópicos! El número máximo de tópicos permitidos es 6.`)
        }

        const preguntasPorTopico = [];

        for (const [i, topico] of json.entries()) {
          if (!topico.topico || topico.topico.trim() === '') {
            errores.push(`El tópico en la posición ${i + 1} no tiene nombre.`);
          }

          if (!Array.isArray(topico.preguntas) || topico.preguntas.length === 0) {
            errores.push(`El tópico "${topico.topico || `(posición ${i + 1})`}" no tiene preguntas.`);
            continue;
          }
          if (topico.preguntas.length > 5) {
            errores.push(`El tópico "${topico.topico || `(posición ${i + 1})`}" tiene ${topico.preguntas.length} preguntas. El número máximo de preguntas por tópico es 5.`);
            continue;
          }

          preguntasPorTopico.push(topico.preguntas.length);

          for (const [j, pregunta] of topico.preguntas.entries()) {
            const prefijo = `Tópico "${topico.topico || `(posición ${i + 1})`}", pregunta ${j + 1}:`;
            if (!pregunta || pregunta.trim() === '') {
              errores.push(`${prefijo} el texto de la pregunta está vacío.`);
            }
            if (!topico.respuestas[j] || topico.respuestas[j].trim() === '') {
              errores.push(`${prefijo} la respuesta está vacía.`);
            }
            if (topico.puntos[j] === undefined || typeof topico.puntos[j] !== 'number' || isNaN(topico.puntos[j])) {
              errores.push(`${prefijo} el puntaje no es un número válido.`);
            }
          }
        }

        // Validar cantidad igual de preguntas entre tópicos
        const cantidadEsperada = preguntasPorTopico[0];
        if (!preguntasPorTopico.every(cant => cant === cantidadEsperada)) {
          errores.push("Todos los tópicos deben tener la misma cantidad de preguntas.");
        }

        // Validar nombre duplicado
        const nombreSinExtension = archivo.name.replace(/\.[^/.]+$/, "");
        const nombreYaExiste = archivos.some(a => a.nombre === nombreSinExtension);
        if (nombreYaExiste) {
          errores.push(`Ya has agregado un archivo con el nombre "${nombreSinExtension}".`);
          e.target.value = null; // Reset para poder volver a seleccionarlo si se desea
        }

        // Mostrar errores si existen
        if (errores.length > 0) {
          if (volumen) {
            const disable = new Audio('sounds/notification-disable.mp3');
            disable.play().catch((e) => {
              console.warn('No se pudo reproducir el sonido:', e);
            });
          }
          mostrarMensaje(errores.join('\n'));
          return;
        }

        if (volumen) {
          const insert = new Audio('sounds/insert.mp3');
          insert.play().catch((e) => {
            console.warn('No se pudo reproducir el sonido:', e);
          });
        }

        // Agregar archivo
        const nuevo = {
          id: Date.now().toString(),
          nombre: nombreSinExtension,
          topicos: json.map(j => j.topico),
          contenido: json,
          total: json.reduce((acc, j) => acc + j.preguntas.length, 0)
        };

        const nuevosArchivos = [...archivos.slice(1), nuevo];
        setArchivos([archivoOriginal, ...nuevosArchivos]);
        guardarArchivos(nuevosArchivos);
      } catch (e) {
        mostrarMensaje("El archivo no es válido. Verifica que el formato JSON sea correcto.");
      }
    };

    reader.readAsText(archivo);
    e.target.value = null; // Reset también aquí por seguridad
  };

  // Función que muestra el modal y espera confirmación
  const solicitarConfirmacion = (mensaje) => {
    return new Promise((resolve) => {
      confirmacionResolver.current = resolve;
      setMostrarConfirmacion({ mensaje });
    });
  };

  const eliminarArchivos = async () => {
    if (archivoSeleccionado === 'original') return;

    const eliminar = archivos.find(a => a.id === archivoSeleccionado);
    if (!eliminar) return; // No existe archivo seleccionado

    const confirmado = await solicitarConfirmacion(`¿Está seguro de eliminar el archivo de preguntas "${eliminar.nombre}"?`);
    if (!confirmado) return; // El usuario canceló

    if (volumen) {
      const recycle = new Audio('sounds/recycle.mp3');
      recycle.play().catch((e) => {
        console.warn('No se pudo reproducir el sonido:', e);
      });
    }

    const nuevos = archivos.filter(a => a.id !== archivoSeleccionado);
    setArchivos([archivoOriginal, ...nuevos.slice(1)]);
    guardarArchivos(nuevos.slice(1));

    if (!nuevos.some(a => a.id === archivoSeleccionado)) {
      setArchivoSeleccionado('original');
    }
  };

  const mostrarMensaje = (texto) => {
    setMensajeError(texto);
    setMostrarModal(true);
  };

  const iniciarJuego = () => {
    const errores = [];

    if (config.tiempoInicial < 15) {
      errores.push("El tiempo inicial no puede ser menor a 10 segundos.");
    }
    if (config.incremento < 5) {
      errores.push("El tiempo de incremento por puntaje no puede ser menor a 5 segundos.");
    }
    if (Number.isInteger(config.tiempoInicial) === false || Number.isInteger(config.incremento) === false || Number.isInteger(config.equipos) === false) {
      errores.push("Las cantidades deben ser números enteros, no se permiten números con punto decimal.");
    }

    const archivo = archivos.find(a => a.id === archivoSeleccionado);
    if (!archivo) {
      errores.push("Ocurrió un error al seleccionar el archivo de preguntas, vuelve a intentarlo.");
    }

    // Mostrar errores si existen
    if (errores.length > 0) {
      if (volumen) {
        const disable = new Audio('sounds/notification-disable.mp3');
        disable.play().catch((e) => {
          console.warn('No se pudo reproducir el sonido:', e);
        });
      }
      mostrarMensaje(errores.join('\n'));
      return;
    }

    if (volumen) {
      const connect = new Audio('sounds/connect.mp3');
      connect.play().catch((e) => {
        console.warn('No se pudo reproducir el sonido:', e);
      });
    }

    setTimeout(() => {
      navigate('/tablero', {
        state: {
          archivoId: archivoSeleccionado,
          config,
        },
      });
    }, 500);
  };

  return (
    <div className="pantalla-menu">
      <div className='div-header'>
        <FontAwesomeIcon icon={faBookBible} fade size='2x' />
        <p className='texto-titulo'>¿QUÉ TANTO SABES DE LA BIBLIA?</p>
        <FontAwesomeIcon icon={faBookBible} fade size='2x' />
      </div>
      <div className="paneles">
        <div className="panel archivo-panel">
          <div className='archivo-encabezado'>
            <div className='div-titulo'>
              <p className='titulo-lista'>Archivos de Preguntas</p>
            </div>
            <div className='div-icons'>
              <FontAwesomeIcon
                icon={faFloppyDisk}
                onClick={saveJSONFile}
                title='Guardar archivo'
                style={{ cursor: 'pointer', fontSize: '18px' }}
              />
              <FontAwesomeIcon
                icon={faFileCirclePlus}
                onClick={() => inputRef.current?.click()}
                title="Agregar archivo"
                style={{ cursor: 'pointer' }}
              />
              <FontAwesomeIcon
                icon={faTrashCan}
                onClick={eliminarArchivos}
                title={archivoSeleccionado === 'original' ? 'No se puede eliminar el archivo original' : 'Eliminar archivo'}
                style={{ cursor: archivoSeleccionado === 'original' ? 'not-allowed' : 'pointer' }}
              />
            </div>
          </div>
          <div className="archivo-lista">
            {archivos.map((a) => (
              <Archivo
                key={a.id}
                archivo={a}
                activo={a.id === archivoSeleccionado}
                onSeleccionar={setArchivoSeleccionado}
                esOriginal={a.id === 'original'}
                totalArchivos={archivos.length}
              />
            ))}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".json"
            onChange={handleAgregarArchivo}
            style={{ display: 'none' }}
          />
        </div>
        <div className="panel config-panel">
          <p className='titulo-configs'>Configuraciones Iniciales</p>
          <div className='div-configs'>
            <label className='panel-etiqueta'>Tiempo inicial (s):
              <input type="number" min={15} value={config.tiempoInicial} onChange={(e) => setConfig({ ...config, tiempoInicial: +e.target.value })} />
            </label>
            <label className='panel-etiqueta'>Incremento por puntaje (s):
              <input type="number" min={5} value={config.incremento} onChange={(e) => setConfig({ ...config, incremento: +e.target.value })} />
            </label>
            <label className='panel-etiqueta'>Número de equipos:</label>
            <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '8px' }}>
              {opcionesEquipos.map((num) => {
                const habilitado = totalPreguntas > 0 && (totalPreguntas % num === 0);
                const seleccionado = config.equipos === num;

                return (
                  <button
                    key={num}
                    onClick={() => seleccionarEquipos(habilitado, num)}
                    style={{
                      padding: '8px 12px',
                      cursor: habilitado ? 'pointer' : 'not-allowed',
                      backgroundColor: seleccionado ? '#708090' : '#fffff0',
                      color: seleccionado ? 'white' : 'black',
                      border: '1px solid #000',
                      borderRadius: '4px',
                      opacity: habilitado ? 1 : 0.25,
                      userSelect: 'none',
                      fontWeight: seleccionado ? 'bold' : 'normal',
                    }}
                    title={habilitado ? (num === 1 ? `Seleccionar ${num} equipo` : `Seleccionar ${num} equipos`) : `No válido con ${totalPreguntas} preguntas`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button className="btn-empezar" onClick={iniciarJuego}>Comenzar</button>
      </div>
      <div className="ayuda-etiquetas">
        <span className='texto-etiqueta' onClick={() => setMostrarMultiModal(1)}>¿Cómo jugar?</span>
        <span className='texto-etiqueta' onClick={() => setMostrarMultiModal(2)}>¿Cómo agrego mis preguntas?</span>
        <span className='texto-etiqueta' onClick={() => setMostrarMultiModal(3)}>Acerca de</span>
        <div className='icono-volumen' title={volumen ? 'Silenciar sonidos del juego' : 'Activar sonidos del juego'}>
          {volumen
            ? (
              <Volumen
                width={20}
                height={20}
                onClick={() => setVolumen(!volumen)}
              />
            ) : (
              <SinVolumen
                width={20}
                height={20}
                onClick={() => setVolumen(!volumen)}
              />
            )
          }
        </div>
        <FontAwesomeIcon
          icon={faRightFromBracket}
          title='Salir'
          onClick={() => ipcRenderer.send('cerrar-app')}
          cursor='pointer'
        />
      </div>

      <Mensaje
        mensaje={mensajeError}
        visible={mostrarModal}
        onCerrar={() => setMostrarModal(false)}
      />

      {mostrarConfirmacion && (
        <Confirmacion
          mensaje={mostrarConfirmacion.mensaje}
          onConfirmar={() => {
            confirmacionResolver.current(true);
            setMostrarConfirmacion(false);
          }}
          onCancelar={() => {
            confirmacionResolver.current(false);
            setMostrarConfirmacion(false);
          }}
        />
      )}

      {mostrarMultiModal > 0 && (
        <Multiple
          modal={mostrarMultiModal}
          onCerrar={() => setMostrarMultiModal(0)}
        />
      )}

    </div>
  );
};

export default Menu;
