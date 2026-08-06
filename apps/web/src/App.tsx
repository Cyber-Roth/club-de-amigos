import "./App.css";

function App() {
  return (
    <main className="home">
      <h1>🌈 Club de Amigos</h1>

      <p>Un lugar seguro para jugar con amigos.</p>

      <button>Crear una sala</button>

      <div className="join">
        <h2>¿Ya te invitaron?</h2>

        <input
          type="text"
          placeholder="Código de la sala"
          maxLength={6}
        />

        <button>Entrar</button>
      </div>
    </main>
  );
}

export default App;