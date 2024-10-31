import { createSignal, onMount, For } from 'solid-js';

function CategorySelector(props) {
  const [categories, setCategories] = createSignal([]);
  const [loadingCategories, setLoadingCategories] = createSignal(false);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await fetch('https://de1.api.radio-browser.info/json/tags');
      const data = await response.json();
      // Sort categories by name
      data.sort((a, b) => a.name.localeCompare(b.name));
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  onMount(() => {
    fetchCategories();
  });

  return (
    <div class="mb-4">
      <label for="category-selector" class="block text-gray-700 font-semibold mb-2">اختر التصنيف:</label>
      <select
        id="category-selector"
        class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent cursor-pointer box-border text-gray-800"
        value={props.selectedCategory()}
        onChange={(e) => props.setSelectedCategory(e.target.value)}
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
      {loadingCategories() && (
        <div class="mt-2 text-gray-600">جارٍ تحميل قائمة التصنيفات...</div>
      )}
    </div>
  );
}

export default CategorySelector;