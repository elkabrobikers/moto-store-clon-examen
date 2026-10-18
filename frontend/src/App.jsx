
import "./App.css";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Productos from "./components/Productos";
import FormularioProducto from "./components/FormularioProducto";

function App() {
  return (
    <div className="app">
      <Header />
      <Navbar />

      <main id="inicio">
        <h2>Bienvenido a MOTO STORE</h2>

        <p>
          Encuentra motocicletas, repuestos originales y accesorios
          para tu próxima aventura.
        </p>

        <Productos />
        <FormularioProducto />
      </main>

      <footer id="contacto">
        <p>© 2026 MOTO STORE - Tecnología Web II</p>
      </footer>
    </div>
  );
}

export default App;
