import { createSignal, onMount, Show, For } from 'solid-js';

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

  const filteredStations = () => {
    return stations().filter(station =>
      station.name.toLowerCase().includes(searchTerm().toLowerCase())
    );
  };

  return (
    <div class="min-h-screen bg-gradient-to-b from-green-100 to-blue-100 p-4">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold text-center text-green-600 mb-8">تطبيق الراديو العربي</h1>

        <div class="mb-4">
          <input
            type="text"
            placeholder="بحث عن محطة..."
            value={searchTerm()}
            onInput={(e) => setSearchTerm(e.target.value)}
            class="w-full p-3 border border-gray-300 rounded-lg box-border focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
          />
        </div>

        <Show when={loading()}>
          <div class="text-center text-gray-600">جارٍ تحميل المحطات...</div>
        </Show>

        <Show when={!loading() && stations().length > 0}>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <For each={filteredStations()}>
              {(station) => (
                <div
                  class="bg-white p-4 rounded-lg shadow-md flex items-center cursor-pointer hover:bg-green-50 transition duration-300"
                  onClick={() => setSelectedStation(station)}>
                  <img
                    src={station.favicon || 'https://via.placeholder.com/50'}
                    alt={station.name}
                    class="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p class="font-semibold text-lg text-green-600">{station.name}</p>
                    <p class="text-gray-500 text-sm">{station.country}</p>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>

        <Show when={selectedStation()}>
          <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 class="text-2xl font-bold mb-4 text-green-600">{selectedStation().name}</h2>
              <audio controls autoplay src={selectedStation().url_resolved} class="w-full mb-4"></audio>
              <button
                class="w-full px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-300 cursor-pointer"
                onClick={() => setSelectedStation(null)}>
                إغلاق
              </button>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
}

export default App;