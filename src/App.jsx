import { createSignal, onMount } from 'solid-js';
import StationList from './components/StationList';
import StationPlayer from './components/StationPlayer';
import Spinner from './components/Spinner';

function App() {
  const [stations, setStations] = createSignal([]);
  const [loading, setLoading] = createSignal(false);
  const [selectedStation, setSelectedStation] = createSignal(null);
  const [searchTerm, setSearchTerm] = createSignal('');

  const fetchStations = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://de1.api.radio-browser.info/json/stations/bylanguage/arabic');
      const data = await response.json();
      setStations(data);
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
    }
  };

  onMount(() => {
    fetchStations();
  });

  const handleSelectStation = (station) => {
    setSelectedStation(station);
  };

  const handleClosePlayer = () => {
    setSelectedStation(null);
  };

  return (
    <div class="h-full bg-gradient-to-b from-green-100 to-blue-100 p-4">
      <div class="max-w-6xl mx-auto h-full flex flex-col">
        <header class="text-center mb-8">
          <h1 class="text-4xl font-bold text-green-600">تطبيق الراديو العربي</h1>
        </header>
        <div class="mb-4">
          <input
            type="text"
            placeholder="بحث عن محطة..."
            value={searchTerm()}
            onInput={(e) => setSearchTerm(e.target.value)}
            class="w-full p-3 border border-gray-300 rounded-lg box-border focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
          />
        </div>
        {loading() ? (
          <div class="flex-grow flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <StationList
            stations={stations}
            searchTerm={searchTerm}
            onSelectStation={handleSelectStation}
          />
        )}
        {selectedStation() && (
          <StationPlayer
            station={selectedStation()}
            onClose={handleClosePlayer}
          />
        )}
      </div>
    </div>
  );
}

export default App;