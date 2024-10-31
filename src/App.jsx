import { createSignal, createEffect } from 'solid-js';
import StationList from './components/StationList';
import StationPlayer from './components/StationPlayer';
import Spinner from './components/Spinner';
import CountrySelector from './components/CountrySelector';
import CategorySelector from './components/CategorySelector';

function App() {
  const [stations, setStations] = createSignal([]);
  const [loadingStations, setLoadingStations] = createSignal(false);
  const [selectedStation, setSelectedStation] = createSignal(null);
  const [searchTerm, setSearchTerm] = createSignal('');
  const [selectedCountry, setSelectedCountry] = createSignal('');
  const [selectedCategory, setSelectedCategory] = createSignal('');

  const fetchStations = async () => {
    setLoadingStations(true);
    try {
      let url = '';
      if (!selectedCountry() && !selectedCategory()) {
        url = 'https://de1.api.radio-browser.info/json/stations/topclick/100';
      } else {
        url = 'https://de1.api.radio-browser.info/json/stations/search?';
        const params = [];
        if (selectedCountry()) {
          params.push(`country=${encodeURIComponent(selectedCountry())}`);
        }
        if (selectedCategory()) {
          params.push(`tag=${encodeURIComponent(selectedCategory())}`);
        }
        url += params.join('&');
      }

      const response = await fetch(url);
      const data = await response.json();

      // Filter out Islamic stations
      const filteredData = data.filter(station => {
        const tags = station.tags ? station.tags.toLowerCase() : '';
        const name = station.name ? station.name.toLowerCase() : '';
        const excludeKeywords = ['islam', 'islamic', 'muslim', 'quran', 'hadith', 'azan', 'adzan', 'qur\'an', 'koran'];
        return !excludeKeywords.some(keyword => tags.includes(keyword) || name.includes(keyword));
      });

      setStations(filteredData);
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoadingStations(false);
    }
  };

  createEffect(() => {
    selectedCountry();
    selectedCategory();
    fetchStations();
  });

  // Reset selectedCategory when selectedCountry changes
  createEffect(() => {
    const country = selectedCountry();
    setSelectedCategory('');
  });

  const handleSelectStation = (station) => {
    setSelectedStation(station);
  };

  const handleClosePlayer = () => {
    setSelectedStation(null);
  };

  return (
    <div class="h-full bg-gradient-to-b from-green-100 to-blue-100 p-4">
      <div class="h-full max-w-6xl mx-auto flex flex-col">
        <header class="text-center mb-8">
          <h1 class="text-4xl font-bold text-green-600">تطبيق الراديو العالمي</h1>
        </header>
        <CountrySelector
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
        />
        <CategorySelector
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedCountry={selectedCountry}
        />
        <div class="mb-4">
          <input
            type="text"
            placeholder="بحث عن محطة..."
            value={searchTerm()}
            onInput={(e) => setSearchTerm(e.target.value)}
            class="w-full p-3 border border-gray-300 rounded-lg box-border focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-800"
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