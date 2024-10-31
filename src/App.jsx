import { createSignal, onMount, createEffect } from 'solid-js';
import StationList from './components/StationList';
import StationPlayer from './components/StationPlayer';
import Spinner from './components/Spinner';
import CountrySelector from './components/CountrySelector';

function App() {
  const [stations, setStations] = createSignal([]);
  const [loadingStations, setLoadingStations] = createSignal(false);
  const [selectedStation, setSelectedStation] = createSignal(null);
  const [searchTerm, setSearchTerm] = createSignal('');
  const [selectedCountry, setSelectedCountry] = createSignal('');

  const fetchStations = async () => {
    setLoadingStations(true);
    try {
      let url = 'https://de1.api.radio-browser.info/json/stations';
      if (selectedCountry()) {
        url += `/bycountry/${encodeURIComponent(selectedCountry())}`;
      } else {
        url += '/topclick/100';
      }
      const response = await fetch(url);
      const data = await response.json();

      // Filter out Islamic stations
      const excludedKeywords = ['islam', 'quran', 'koran', 'muslim', 'islamic', 'قرآن', 'إسلام', 'مسلم'];
      const filteredData = data.filter(station => {
        const tags = station.tags.toLowerCase();
        const name = station.name.toLowerCase();
        return !excludedKeywords.some(keyword =>
          tags.includes(keyword.toLowerCase()) || name.includes(keyword.toLowerCase())
        );
      });

      setStations(filteredData);
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoadingStations(false);
    }
  };

  onMount(() => {
    fetchStations();
  });

  createEffect(() => {
    selectedCountry(); // Depend on selectedCountry
    fetchStations();
  });

  const handleSelectStation = (station) => {
    setSelectedStation(station);
  };

  const handleClosePlayer = () => {
    setSelectedStation(null);
  };

  return (
    <div class="min-h-screen bg-gradient-to-b from-green-100 to-blue-100 p-4 text-gray-800">
      <div class="h-full max-w-6xl mx-auto flex flex-col">
        <header class="text-center mb-8">
          <h1 class="text-4xl font-bold text-green-600">تطبيق الراديو العالمي</h1>
        </header>
        <CountrySelector
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
        />
        <div class="mb-4">
          <input
            type="text"
            placeholder="بحث عن محطة..."
            value={searchTerm()}
            onInput={(e) => setSearchTerm(e.target.value)}
            class="w-full p-3 border border-gray-300 rounded-lg box-border focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
          />
        </div>
        {loadingStations() ? (
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