import { createSignal, createEffect, For, Show } from 'solid-js';

function CategorySelector(props) {
  const [categories, setCategories] = createSignal([]);
  const [loadingCategories, setLoadingCategories] = createSignal(false);

  const fetchCategories = async (country) => {
    setLoadingCategories(true);
    try {
      const response = await fetch(`https://de1.api.radio-browser.info/json/stations/bycountry/${encodeURIComponent(country)}`);
      const data = await response.json();

      // Extract tags from stations
      const tagsMap = {};
      data.forEach(station => {
        if (station.tags) {
          const tags = station.tags.split(',');
          tags.forEach(tag => {
            tag = tag.trim();
            if (tag) {
              if (!tagsMap[tag]) {
                tagsMap[tag] = 1;
              } else {
                tagsMap[tag] += 1;
              }
            }
          });
        }
      });

      // Convert tagsMap to array and sort
      const tagsArray = Object.keys(tagsMap).map(tagName => ({
        name: tagName,
        stationcount: tagsMap[tagName],
      }));

      tagsArray.sort((a, b) => a.name.localeCompare(b.name));

      setCategories(tagsArray);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  createEffect(() => {
    const country = props.selectedCountry();
    if (country) {
      fetchCategories(country);
    } else {
      setCategories([]);
    }
  });

  return (
    <div class="mb-4">
      <label for="category-selector" class="block text-gray-700 font-semibold mb-2">اختر التصنيف:</label>
      <select
        id="category-selector"
        class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent cursor-pointer box-border text-gray-800"
        value={props.selectedCategory()}
        onChange={(e) => props.setSelectedCategory(e.target.value)}
        disabled={!props.selectedCountry()}
        aria-label="اختر التصنيف"
      >
        <option value="">جميع التصنيفات</option>
        <For each={categories()}>
          {(category) => (
            <option value={category.name}>
              {category.name} ({category.stationcount})
            </option>
          )}
        </For>
      </select>
      <Show when={loadingCategories()}>
        <div class="mt-2 text-gray-600">جارٍ تحميل قائمة التصنيفات...</div>
      </Show>
      <Show when={!props.selectedCountry()}>
        <div class="mt-2 text-red-600">يرجى اختيار بلد أولاً لعرض التصنيفات المتاحة.</div>
      </Show>
    </div>
  );
}

export default CategorySelector;