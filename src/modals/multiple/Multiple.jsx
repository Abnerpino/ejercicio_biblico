import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faFileCirclePlus, faCircleInfo, faCircleXmark, faCopy, faCode, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import './Multiple.css';

const data = [
    {
        topico: "Tópico 1",
        puntos: [100, 200, 300],
        preguntas: [
            "Pregunta 1",
            "Pregunta 2",
            "Pregunta 3"
        ],
        respuestas: [
            "Respuesta 1",
            "Respuesta 2",
            "Respuesta 3"
        ],
        citas: [
            "Cita 1",
            "Cita 2",
            "Cita 3"
        ]
    },
    {
        topico: "Tópico 2",
        puntos: [100, 200, 300],
        preguntas: [
            "Pregunta 1",
            "Pregunta 2",
            "Pregunta 3"
        ],
        respuestas: [
            "Respuesta 1",
            "Respuesta 2",
            "Respuesta 3"
        ],
        citas: [
            "",
            "Cita 2",
            ""
        ]
    }
];

const Multiple = ({ modal, onCerrar }) => {
    const [showNotification, setShowNotification] = useState(false);

    const copiarAlPortapapeles = () => {
        navigator.clipboard.writeText(JSON.stringify(data, null, 2))
            .then(() => {
                setShowNotification(true);
            })
            .catch(err => {
                alert("Error al copiar: ", err);
            });
    };

    // Ocultar la notificación después de 2 segundos
    useEffect(() => {
        if (showNotification) {
            const timer = setTimeout(() => setShowNotification(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [showNotification]);

    const howToPlay =
        <div className='div-contenido'>
            <div className='modal-header-1'>
                <div className="center-content">
                    <FontAwesomeIcon icon={faPlay} beat style={{ fontSize: "24px", }} />
                    <p className='text-titulo'>¿CÓMO JUGAR?</p>
                </div>
                <FontAwesomeIcon
                    icon={faCircleXmark}
                    onClick={onCerrar}
                    title="Cerrar"
                    style={{ color: "#ff0000", fontSize: "24px", }}
                />
            </div>
            <div className='modal-mensaje'>
                <p className='text-message'>Lo primero que tienes que hacer es seleccionar un archivo de preguntas y despues establecer las configuraciones iniciales.</p>
                <br></br>
                <p className='text-subtitulo'>Archivos de Preguntas</p>
                <p className='text-message'>Por defecto ya viene cargado un archivo de preguntas, pero tú puedes agregar tu archivo con tus propias preguntas, para ello solo pulsa en el icono de "Agregar archivo" y seleccionalo.</p>
                <p className='text-message'><b>Nota:</b> Los archivos deben de tener un formato en especifico, para más información, presiona sobre la etiqueta "<b>¿Cómo agrego mis preguntas?</b>" que se encuentra en el Menú principal.</p>
                <p className='text-message'>Si ya agregaste algún archivo de preguntas y quieres eliminarlo, solo presiona el icono de "Eliminar archivo". ¡El archivo de preguntas que viene cargado por defecto no se puede eliminar!</p>
                <p className='text-message'>También puedes guardar en tus documentos el archivo original de preguntas o algún otro archivo que haya sido cargado antes. Para ello solo pulsa en el icono de "Guardar archivo" y se mostrará una ventana para seleccionar la ubicación en la que guardarás el archivo y si deseas, también puedes cambiarle el nombre.</p>
                <br></br>
                <p className='text-subtitulo'>Configuraciones Iniciales</p>
                <p className='text-message'>El tiempo inicial se refiere al "tiempo base" que tiene cada pregunta, el cual por defecto es de 30 segundos y no puede ser menor a 15 segundos.</p>
                <p className='text-message'>El incremento por puntaje es el tiempo que se agrega al "tiempo base" de las preguntas cada vez que aumenta su puntaje, el cual por defecto es de 15 segundos y no puede ser menor a 5 segundos.</p>
                <p className='text-message'>El valor de estas dos cantidades tiene que ser un número entero. No se permiten números con punto decimal.</p>
                <p className='text-message'>El número de equipos va desde 1 hasta 5, pero solo se podrán seleccionar las opciones que estén habilitadas. Para que una opción se habilite, el resultado de la división del número total de preguntas del archivo seleccionado, entre el número de equipos de la opción, debe ser un número entero, si es con punto decimal, se inhabilita, esto para garantizar que todos los equipos contesten la misma cantidad de preguntas. El número de equipos por defecto es 1.</p>
                <br></br>
                <p className='text-subtitulo'>Todo Listo</p>
                <p className='text-message'>Una vez seleccionado el archivo de preguntas a usar y establecidas las configuraciones iniciales, pulsa el botón "Comenzar".</p>
                <p className='text-message'><b>Adicional:</b> Para activar o desactivar los sonidos del juego, pulsa sobre el icono de Sonido.</p>
                <p className='text-message'>Una vez presionado el botón "Comenzar", se mostrará el tablero del juego: botón de inicio, tópicos y puntajes de las preguntas. Al presionar el botón "Iniciar Juego", se mostrará una pequeña ventana en donde aparecerá el orden de turnos de cada equipo (se elegirá aleatoriamente y se mostrará solo si hay más de un equipo) y un botón de "Continuar" para empezar a contestar las preguntas.</p>
                <p className='text-message'>Después de presionar el botón para continuar, en el tablero ya se mostrarán los equipos y el equipo en turno se iluminará en color anaranjado.</p>
                <p className='text-message'>Cuando seleccione la cantidad de puntos que desea ganar, se mostrará una pequeña ventana con: un temporizador que iniciará la cuenta regresiva automáticamente, la pregunta y un botón para mostrar la respuesta.</p>
                <p className='text-message'>Puede esperar a que termine el tiempo para mostrar la respuesta o hacerlo antes. Al presionar el botón (si aún quedaba tiempo, este llegará a 0 inmediatamente), aparecerá la respuesta, su cita bíblica (si aplica) y dos botones, uno por si la respuesta fue correcta y otro por si fue incorrecta.</p>
                <p className='text-message'>Hay una opción para "Robar Puntos", la cual solo aparecerá si se deja correr el tiempo y este llega a 0 sin que antes se presione el botón de "Mostrar Respuesta". Solo puede hacer el robo de puntos el equipo que tendrá el siguiente turno, para activarlo solo se debe pulsar el botón y ya estará implementada dicha funcionalidad. ¡Importante! Cuando el equipo con el turno siguiente activa el robo de puntos, si su respuesta es correcta, se le suman los puntos, pero si es incorrecta, también se le restarán los puntos.</p>
                <p className='text-message'>Si no se activó el robo de puntos, automáticamente se sumarán los puntos al equipo en turno si la respuesta fue correcta pero si fue incorrecta, no se restarán (eso solo aplica para los equipos que activen el robo de puntos) y se mostrará nuevamente el tablero. Para evitar seleccionar alguna pregunta por accidente al cerrarse la ventana, hay un bloqueo de seguridad de 1 segundo, en el cual no se podrá elegir ninguna pregunta hasta que el siguiente equipo esté en turno.</p>
                <p className='text-message'>La idea del juego es que el equipo en turno conteste la pregunta antes de que el tiempo termine, pero si termina el tiempo y no se recibe alguna respuesta, el equipo con el siguiente turno podrá hacer el robo de puntos. En cualquiera de ambos casos, el no recibir una respuesta se debe considerar como respuesta incorrecta.</p>
                <p className='text-message'>El juego acaba cuando se terminan las preguntas o se presiona el botón "Terminar Juego". Inmediatamente se mostrará una ventana que anuncia al ganador (o un empate, si es el caso) juntamente con una gráfica de los puntajes de cada equipo y un botón para volver al Menú.</p>
            </div>
        </div>
        ;

    const howAddQuetions =
        <div className='div-contenido'>
            <div className='modal-header-1'>
                <div className="center-content">
                    <FontAwesomeIcon icon={faFileCirclePlus} beat style={{ fontSize: "24px", }} />
                    <p className='text-titulo'>¿CÓMO AGREGO MIS PREGUNTAS?</p>
                </div>
                <FontAwesomeIcon
                    icon={faCircleXmark}
                    onClick={onCerrar}
                    title="Cerrar"
                    style={{ color: "#ff0000", fontSize: "24px", }}
                />
            </div>
            <div className='modal-mensaje'>
                <p className='text-message'>Lo primero que se debe aclarar es que el archivo de preguntas debe tener cierta estructura y una extensión de archivo en particular: JSON.</p>
                <br></br>
                <p className='text-subtitulo'>Estructura del Archivo</p>
                <p className='text-message'>El archivo debe contener los tópicos (máximo 6 tópicos), los puntajes, sus preguntas, sus respuestas y opcionalmente, las citas bíblicas.</p>
                <p className='text-message'><b>Nota:</b> Todos los tópicos deben tener la misma cantidad de preguntas, respuestas y puntajes (máximo 5 para cada uno), ninguno de estos puede estar vacío, solo las citas bíblicas pueden estar vacías, los puntajes deben ser números enteros (se recomienda usar multiplos de 100).</p>
                <p className='text-message'>A continuación se muestra un pequeño ejemplo de cómo estructurar el archivo:</p>
                <div className='div-json'>
                    <FontAwesomeIcon
                        icon={faCopy}
                        className="copy-icon"
                        onClick={copiarAlPortapapeles}
                        title="Copiar JSON"
                    />
                    <pre className='text-json'>{JSON.stringify(data, null, 2)}</pre>
                    {showNotification && (
                        <div className="notification">
                            ¡Copiado al portapapeles!
                        </div>
                    )}
                </div>
                <br></br>
                <p className='text-subtitulo'>Archivo JSON</p>
                <p className='text-message'>Un archivo JSON (JavaScript Object Notation) es un formato de texto que se utiliza para almacenar e intercambiar datos de manera estructurada y legible.</p>
                <p className='text-message'>Antes de crear un archivo JSON, se debe comprender su sintaxis:</p>
                <ul className='lista'>
                    <li className='elemento-lista'>Los datos están en pares nombre-valor.</li>
                    <li className='elemento-lista'>Los datos están separados por comas.</li>
                    <li className='elemento-lista'>Las llaves &#123; &#125; contienen objetos.</li>
                    <li className='elemento-lista'>Los corchetes [ ] contienen matrices.</li>
                    <li className='elemento-lista'>Las cadenas (texto) deben estar entre comillas dobles " ".</li>
                </ul>
                <p className='text-message'>Puede hacer su archivo JSON en el Bloc de Notas de su PC, solo recuerde que al guardarlo, debe quitar la extensión '.txt' (de Archivo de Texto) y reemplazarla por '.json' (de Archivo JSON).</p>
                <p className='text-message'>En las siguientes páginas puede consultar más a detalle cómo crear un archivo JSON y cómo validarlo para saber si es correcto:</p>
                <div className='div-links'>
                    <a
                        href="https://leapcell.io/blog/how-to-make-a-json-file"
                        target="_blank"
                        title='Abrir en una nueva pestaña'
                        style={{ fontWeight: "bold" }}
                    >
                        Cómo crear un archivo JSON
                    </a>
                    <a
                        href="https://jsononline.net/es/json-validator"
                        target="_blank"
                        title='Abrir en una nueva pestaña'
                        style={{ fontWeight: "bold" }}
                    >
                        Validador JSON
                    </a>
                </div>
                <p className='text-message'>De igual manera, si desea usar el archivo JSON de preguntas que viene por defecto en el juego (o cualquier otro que haya sido cargado antes) y editarlo para hacer el trabajo más fácil, puede obtenerlo pulsando en el icono de "Guardar archivo" que aparece arriba de la lista de Archivos de Preguntas cargados.</p>
            </div>
        </div>
        ;

    const about =
        <div className='div-contenido'>
            <div className='modal-header-2'>
                <div className="center-content">
                    <FontAwesomeIcon icon={faCircleInfo} beat style={{ fontSize: "24px", }} />
                    <p className='text-titulo'>ACERCA DE</p>
                </div>
                <FontAwesomeIcon
                    icon={faCircleXmark}
                    onClick={onCerrar}
                    title="Cerrar"
                    style={{ color: "#ff0000", fontSize: "24px", }}
                />
            </div>
            <div className='modal-mensaje'>
                <p className='text-about'>Este "Ejercicio Bíblico" fue hecho con la finalidad de incentivar el estudio de la Palabra de Dios. Si fallaste en alguna pregunta, no te preocupes, puedes leer la cita y memorizar la respuesta, pero si acertaste en todas las preguntas, felicidades, eso indica que estudias tu Biblia. Te invito a que sigas leyendola para profundizar más en el conocimiento de la Palabra de Dios.</p>
                <div className='div-info'>
                    <FontAwesomeIcon icon={faCode} style={{ marginRight: "5px" }} />
                    <p className='text-about'><b>Desarrollador:</b> Ing. Abner Pino Federico</p>
                </div>
                <div className='div-info'>
                    <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: "5px" }} />
                    <p className='text-about'><b>Contacto:</b> abnerpino15@gmail.com</p>
                </div>
                <p className='text-versiculo'>"Escudriñad las Escrituras; porque a vosotros os parece que en ellas tenéis la vida eterna; y ellas son las que dan testimonio de mí." - San Juan 5:39</p>
            </div>
        </div>
        ;

    return (
        <div className="modal">
            <div className="modal-contenido">
                {modal === 1
                    ? howToPlay
                    : (modal === 2
                        ? howAddQuetions
                        : about
                    )
                }
            </div>
        </div>
    );
};

export default Multiple;
