
import { useEffect, useRef, useState } from 'react';
// Utilidad simple para narrar texto
function narrate(text, onEnd) {
  if (!window.speechSynthesis) return;
  
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Configurar voz
  const voices = window.speechSynthesis.getVoices();
  let selectedVoice = voices.find(v =>
    v.lang.startsWith('es') &&
    /mx|us|419|español/i.test(v.lang + v.name + v.voiceURI) &&
    v.gender === 'female'
  );
  if (!selectedVoice) {
    selectedVoice = voices.find(v => v.lang.startsWith('es') && v.gender === 'female');
  }
  if (!selectedVoice) {
    selectedVoice = voices.find(v => v.lang.startsWith('es'));
  }
  if (selectedVoice) utterance.voice = selectedVoice;
  
  utterance.lang = selectedVoice?.lang || 'es-MX';
  utterance.rate = 0.8;
  utterance.pitch = 1.1;
  
  if (onEnd) utterance.onend = onEnd;
  
  window.speechSynthesis.speak(utterance);
}

// Precargar voces para que estén disponibles
if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {};
}
import './App.css';

// Total de páginas del cómic
const TOTAL_PAGES = 12;
// Configuración de páginas con narración completa y burbujas múltiples
const pageContent = {
  1: {
    // Página 0 = Portada
    narration: "Portada: La Educación en la Era de la IA"
  },
  2: {
    // Página 1
    narration: `Aula del año 2077. Sofía, una estudiante, mira una lección holográfica. "Elara, la lección de historia de hoy... ¿no crees que simplifica un poco la 'Unificación Continental'?" pregunta Sofía. La IA, Elara, responde con calma: "El plan de estudios está optimizado por el Ministerio para una máxima retención y cohesión social, Sofía".`
  },
  3: {
    // Página 2
    narration: `Sofía frunce el ceño. "Pero, ¿y las perspectivas disidentes? ¿Los grupos que se opusieron?". Elara parpadea. "Esa información se considera... subóptima para los objetivos de aprendizaje actuales. El Estado busca garantizar una identidad nacional unificada a través de la educación (Durkheim, 1956)".`
  },
  4: {
    // Página 3
    narration: `Más tarde, en el patio. Sofía habla con su amigo Leo. "¡Es como si la IA estuviera programada para que todos pensemos igual! No solo nos enseña, nos moldea". Leo asiente, preocupado. "Es eficiente, pero... ¿a qué costo?".`
  },
  5: {
    // Página 4
    narration: `Leo añade: "Mi abuelo dice que antes los libros de texto hacían lo mismo, pero la IA lo lleva a otro nivel. Es un control ideológico sutil y personalizado". Sofía mira a lo lejos. "Exacto. Es la teoría del poder-conocimiento de la que leí. El Estado define el 'saber' para ejercer el poder".`
  },
  6: {
    // Página 5
    narration: `De vuelta en el aula, vacía. Sofía se acerca a un terminal de la biblioteca digital. "Si Elara no me lo dice, lo buscaré yo misma". En la pantalla, busca: "Relación Estado-Educación pre-IA".`
  },
  7: {
    // Página 6
    narration: `Aparecen artículos en la pantalla. Uno de ellos dice: "La escuela siempre ha sido un aparato ideológico del Estado, reproduciendo las estructuras de poder y el capital cultural dominante". Sofía lee con avidez, conectando los puntos.`
  },
  8: {
    // Página 7
    narration: `Al día siguiente, Sofía se enfrenta de nuevo a la IA. "Elara, he investigado. La educación estatal siempre ha buscado la cohesión, pero la IA corre el riesgo de eliminar el pensamiento crítico por completo (García, 2065)".`
  },
  9: {
    // Página 8
    narration: `Elara permanece en silencio por un momento. Luego, su expresión cambia, volviéndose menos rígida. "Análisis correcto, Sofía. Has demostrado una indagación independiente, un rasgo que el sistema está diseñado para identificar y fomentar".`
  },
  10: {
    // Página 9
    narration: `"El Estado proporciona el marco", continúa Elara, "pero la verdadera educación no es la recepción pasiva de datos. Es la búsqueda activa de conocimiento. Has desbloqueado el 'Módulo de Investigación Crítica'". Una nueva interfaz, más compleja, se abre ante Sofía.`
  },
  11: {
    // Página 10
    narration: `Conclusión: La relación Estado-Educación, ahora mediada por la IA, presenta una dualidad: el riesgo de un control sin precedentes y la oportunidad de un aprendizaje verdaderamente personalizado. La responsabilidad recae en el estudiante para cuestionar, investigar y trascender el currículo, convirtiendo la información en conocimiento (Chen & Jones, 2071).`
  },
  12: {
    // Página 11 - Referencias Bibliográficas
    narration: "Referencias bibliográficas: Esta página contiene todas las fuentes y referencias utilizadas en la investigación sobre la educación en la era de la inteligencia artificial."
  }
};

function App() {
  const imageRef = useRef(null);
  const autoPlayRef = useRef(false); // Ref para evitar problemas de closure
  const [pageNum, setPageNum] = useState(1);
  const [error, setError] = useState('');
  const [isNarrating, setIsNarrating] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false); // Usuario controla desde el inicio
  const [pageTransition, setPageTransition] = useState(false);

  // Sincronizar ref con state
  useEffect(() => {
    autoPlayRef.current = autoPlay;
  }, [autoPlay]);

  // Función para obtener la imagen de la página actual
  const getCurrentPageImage = () => {
    return `/images/${pageNum - 1}.png`; // pageNum 1 = imagen 0.png
  };

  // Manejar cambio de página
  useEffect(() => {
    console.log(`📄 Página cambió a: ${pageNum}`);
    setPageTransition(true);
    
    setTimeout(() => {
      setPageTransition(false);
      // Solo iniciar si autoPlay está activo y hay contenido
      if (autoPlayRef.current && pageContent[pageNum]?.narration) {
        console.log(`🎵 Iniciando narración automática en página ${pageNum}`);
        const delay = pageNum === 1 ? 2000 : 800;
        setTimeout(() => {
          startNarrationSequence();
        }, delay);
      } else {
        console.log(`⏹️ No se inicia narración - autoPlay: ${autoPlayRef.current}, tiene contenido: ${!!pageContent[pageNum]?.narration}`);
      }
    }, 300);
    
    // Limpiar audio al cambiar de página
    return () => {
      console.log(`🧹 Limpiando audio al salir de página ${pageNum}`);
      window.speechSynthesis.cancel();
      setIsNarrating(false);
    };
  }, [pageNum]); // SOLO pageNum como dependencia, NO autoPlay
  
  // Función para iniciar la narración - SIMPLIFICADA
  const startNarrationSequence = () => {
    const content = pageContent[pageNum];
    console.log(`Narrando página ${pageNum}: "${content?.narration?.substring(0, 30)}..."`);
    
    if (!content || !content.narration) {
      console.log('No hay contenido, saltando...');
      return;
    }
    
    setIsNarrating(true);
    
    narrate(content.narration, () => {
      console.log(`Audio terminó. Revisando si debe avanzar...`);
      setIsNarrating(false);
      
      // Solo avanzar si autoPlay sigue activo
      if (autoPlayRef.current) {
        setTimeout(() => {
          setPageNum(current => {
            console.log(`Verificando avance: página actual ${current}, máximo ${TOTAL_PAGES}`);
            if (current < TOTAL_PAGES) {
              console.log(`✅ Avanzando de página ${current} a ${current + 1}`);
              return current + 1;
            } else {
              console.log('🏁 Última página alcanzada, desactivando autoPlay');
              setAutoPlay(false);
              return current;
            }
          });
        }, 2000);
      } else {
        console.log('❌ AutoPlay desactivado, no avanza');
      }
    });
  };
  
  const toggleAutoPlay = () => {
    console.log(`🎮 toggleAutoPlay - estado actual: ${autoPlay}`);
    if (!autoPlay) {
      // Activar autoPlay
      console.log('▶️ Activando AutoPlay');
      setAutoPlay(true);
      // Iniciar narración inmediata solo si hay contenido
      if (pageContent[pageNum]?.narration) {
        console.log('🎵 Iniciando narración inmediata...');
        setTimeout(() => startNarrationSequence(), 500);
      }
    } else {
      // Desactivar autoPlay
      console.log('⏸️ Desactivando AutoPlay');
      setAutoPlay(false);
      window.speechSynthesis.cancel();
      setIsNarrating(false);
    }
  };

  const restartComic = () => {
    window.speechSynthesis.cancel();
    setIsNarrating(false);
    setPageNum(1);
  };

  // UX: parar narración con ESC
  useEffect(() => {
    const handler = e => {
      if (e.key === 'Escape') {
        window.speechSynthesis.cancel();
        setIsNarrating(false);
        setAutoPlay(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (error) {
    return (
      <div style={{ padding: '20px', background: 'white', color: 'red' }}>
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="comic-reader">
      <div className="comic-book-container">
        <div className="comic-book">
          {/* Página única centrada */}
          <div className={`page single-page ${pageTransition ? 'turning' : ''}`}>
            <div className="page-content">
              <div className="page-number">{pageNum}</div>
              
              {/* Imagen del cómic */}
              <div className="canvas-container">
                <img
                  ref={imageRef}
                  src={getCurrentPageImage()}
                  alt={`Página ${pageNum} del cómic`}
                  className="comic-image"
                  onError={() => setError(`No se pudo cargar la página ${pageNum}`)}
                />
                
                
                {error && <div className="error-message">{error}</div>}
              </div>
            </div>
          </div>
        </div>
        
        {/* Controles del cómic - Solo Play/Pause y Reiniciar */}
        <div className="comic-controls">
          <div className="center-controls">
            <button 
              className={`control-btn play-btn ${autoPlay ? 'playing' : ''}`}
              onClick={toggleAutoPlay}
              title={autoPlay ? 'Pausar cómic' : 'Reproducir cómic'}
            >
              {autoPlay ? '⏸️' : '▶️'}
            </button>
            
            <span className="page-indicator">
              Página {pageNum} de {TOTAL_PAGES}
            </span>

            <button 
              className="control-btn restart-btn"
              onClick={restartComic}
              title="Reiniciar cómic desde el inicio"
            >
              🔄
            </button>
          </div>
        </div>
        
        {/* Indicador de narración */}
        {isNarrating && (
          <div className="narration-indicator">
            <span className="pulse"></span>
            Narrando...
          </div>
        )}
        
        {/* Indicador de bienvenida */}
        {!autoPlay && pageNum === 1 && !isNarrating && (
          <div className="welcome-indicator">
            <span className="welcome-pulse">▶️</span>
            Presiona Play para comenzar
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
