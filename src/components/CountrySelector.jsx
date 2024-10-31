import { createSignal, onMount, For } from 'solid-js';

function CountrySelector(props) {
  const [countries, setCountries] = createSignal([]);
  const [loadingCountries, setLoadingCountries] = createSignal(false);

  const fetchCountries = async () => {
    setLoadingCountries(true);
    try {
      const response = await fetch('https://de1.api.radio-browser.info/json/countries');
      const data = await response.json();
      data.sort((a, b) => a.name.localeCompare(b.name));
      setCountries(data);
    } catch (error) {
      console.error('Error fetching countries:', error);
    } finally {
      setLoadingCountries(false);
    }
  };

  onMount(() => {
    fetchCountries();
  });

  return (
    <div class="mb-4">
      <label for="country-selector" class="block text-gray-700 font-semibold mb-2">اختر البلد:</label>
      <select
        id="country-selector"
        class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent cursor-pointer box-border"
        value={props.selectedCountry()}
        onChange={(e) => props.setSelectedCountry(e.target.value)}
      >
        <option value="">جميع البلدان</option>
        <For each={countries()}>
          {(country) => (
            <option value={country.name}>{country.name} ({country.stationcount})</option>
          )}
        </For>
      </select>
      {loadingCountries() && (
        <div class="mt-2 text-gray-600">جارٍ تحميل قائمة البلدان...</div>
      )}
    </div>
  );
}

export default CountrySelector;