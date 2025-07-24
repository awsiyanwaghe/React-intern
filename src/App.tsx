import { ArtworkTable } from './components/ArtWorkTable'
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <h1 className="app-title">Artworks Gallery</h1>
      <ArtworkTable />
    </div>
  );
}

export default App;