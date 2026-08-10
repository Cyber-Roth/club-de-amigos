import { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [nombre, setNombre] = useState("");
  const [codigoSala, setCodigoSala] = useState("");
  const [codigoIngresado, setCodigoIngresado] = useState("");
  const [pantalla, setPantalla] = useState<"home" | "room">("home");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const dibujando = useRef(false);

  const ultimoX = useRef(0);
  const ultimoY = useRef(0);

  useEffect(() => {
    if (pantalla !== "room") return;

    const canvas = canvasRef.current;

    if (!canvas) return;

    canvas.width = window.innerWidth;

    canvas.height = window.innerHeight - 260;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "black";
  }, [pantalla]);

  function empezarDibujo(
    e: React.PointerEvent<HTMLCanvasElement>
  ) {
    dibujando.current = true;

    ultimoX.current = e.nativeEvent.offsetX;
    ultimoY.current = e.nativeEvent.offsetY;
  }

  function terminarDibujo() {
    dibujando.current = false;
  }

  function dibujar(
    e: React.PointerEvent<HTMLCanvasElement>
  ) {
    if (!dibujando.current) return;

    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.beginPath();

    ctx.moveTo(
      ultimoX.current,
      ultimoY.current
    );

    ctx.lineTo(
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY
    );

    ctx.stroke();

    ultimoX.current = e.nativeEvent.offsetX;
    ultimoY.current = e.nativeEvent.offsetY;
  }

  async function crearSala() {
    if (!nombre.trim()) {
      alert("Ingresá tu nombre.");
      return;
    }

    const respuesta = await fetch(
      "http://localhost:3001/create-room"
    );

    const datos = await respuesta.json();

    setCodigoSala(datos.roomCode);

    setPantalla("room");
  }

  async function entrarSala() {
    if (!nombre.trim()) {
      alert("Ingresá tu nombre.");
      return;
    }

    const respuesta = await fetch(
      "http://localhost:3001/join-room",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomCode: codigoIngresado,
          userName: nombre,
        }),
      }
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      alert(datos.message);
      return;
    }

    setCodigoSala(codigoIngresado.toUpperCase());

    setPantalla("room");
  }

  if (pantalla === "room") {
    return (
      <main className="room-page">
        <header className="top-bar">
          🌈 Sala {codigoSala}
        </header>

        <div className="videos">
          <div className="video">Miranda</div>

          <div className="video">Amiga 1</div>

          <div className="video">Amiga 2</div>

          <div className="video">Amiga 3</div>
        </div>

        <canvas
          ref={canvasRef}
          className="canvas"
          onPointerDown={empezarDibujo}
          onPointerMove={dibujar}
          onPointerUp={terminarDibujo}
          onPointerLeave={terminarDibujo}
        />

        <div className="toolbar">
          <button>✏️</button>

          <button>🖍</button>

          <button>🖌</button>

          <button>🧽</button>

          <button>⬛</button>

          <button>🟥</button>

          <button>🟦</button>

          <button>🟩</button>

          <button>🟨</button>
        </div>
      </main>
    );
  }

  return (
    <main className="home">
      <h1>🌈 Club de Amigos</h1>

      <p>Un lugar seguro para jugar con amigos.</p>

      <input
        placeholder="Tu nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <button onClick={crearSala}>
        Crear una sala
      </button>

      {codigoSala && (
        <section className="room">
          <h2>🎉 Sala creada</h2>

          <h1>{codigoSala}</h1>

          <p>Compartí este código.</p>
        </section>
      )}

      <div className="join">
        <h2>¿Ya te invitaron?</h2>

        <input
          value={codigoIngresado}
          onChange={(e) =>
            setCodigoIngresado(e.target.value)
          }
          placeholder="Código"
          maxLength={6}
        />

        <button onClick={entrarSala}>
          Entrar
        </button>
      </div>
    </main>
  );
}

export default App;