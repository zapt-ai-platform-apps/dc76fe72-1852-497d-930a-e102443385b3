import { createSignal, createEffect, onCleanup } from 'solid-js';
import StationList from './components/StationList';
import Spinner from './components/Spinner';
import CountrySelector from './components/CountrySelector';
import CategorySelector from './components/CategorySelector';
import AudioPlayer from './components/AudioPlayer';

function App() {
  const [stations, setStations] = createSignal([]);
  const [loadingStations, setLoadingStations] = createSignal(false);
  const [searchTerm, setSearchTerm] = createSignal('');
  const [selectedCountry, setSelectedCountry] = createSignal('');
  const [selectedCategory, setSelectedCategory] = createSignal('');
  const [currentStation, setCurrentStation] = createSignal(null);
  const [isPlaying, setIsPlaying] = createSignal(false);
  const [volume, setVolume] = createSignal(1);

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

      // Filter out Islamic stations and Quran reciters
      const filteredData = data.filter(station => {
        const tags = station.tags ? station.tags.toLowerCase() : '';
        const name = station.name ? station.name.toLowerCase() : '';
        const excludeKeywords = [
          'islam', 'islamic', 'muslim', 'quran', 'kur\'an', 'kuran', 'hadith', 'azan', 'adzan', 'qur\'an', 'koran', 'surah', 'sura', 'sheikh', 'sheik', 'tilawah', 'tilawat', 'recitation', 'reciter', 'qari', 'qur\'a', 'hafiz', 'muezzin', 'imam', 'adhan', 'tajwid', 'tajweed',
          'قران', 'قرآن', 'القرآن', 'القران', 'قراءة', 'قراء', 'قرّاء', 'قارئ', 'تلاوة', 'تلاوات', 'الشيخ', 'شيخ', 'سورة', 'سور', 'المصحف', 'الأذان', 'اذان', 'الأذان', 'إمام', 'تجويد', 'الحافظ'
        ];
        return !excludeKeywords.some(keyword => tags.includes(keyword) || name.includes(keyword));
      });

      // Remove stations with duplicate names
      const uniqueStationsMap = {};
      filteredData.forEach(station => {
        const stationName = station.name.trim().toLowerCase();
        if (!uniqueStationsMap[stationName]) {
          uniqueStationsMap[stationName] = station;
        }
      });

      const uniqueStations = Object.values(uniqueStationsMap);

      setStations(uniqueStations);
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
    selectedCountry();
    setSelectedCategory('');
  });

  return (
    <div class="min-h-screen bg-gradient-to-b from-green-100 to-blue-100 p-4">
      <div class="h-full max-w-6xl mx-auto flex flex-col text-gray-800">
        <header class="text-center mb-8">
          <h1 class="text-4xl font-bold text-green-600">تطبيق الراديو العالمي</h1>
          <p class="text-gray-600">استمع إلى محطات الراديو العالمية مع تحكم كامل</p>
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
            setCurrentStation={setCurrentStation}
            setIsPlaying={setIsPlaying}
          />
        )}
        <AudioPlayer
          currentStation={currentStation}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          volume={volume}
          setVolume={setVolume}
        />
      </div>
    </div>
  );
}

export default App;