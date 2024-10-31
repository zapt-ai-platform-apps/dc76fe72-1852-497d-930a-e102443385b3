import { For } from 'solid-js';
import StationItem from './StationItem';

function StationList(props) {
  const filteredStations = () => {
    return props.stations().filter(station =>
      station.name.toLowerCase().includes(props.searchTerm().toLowerCase())
    );
  };

  return (
    <div class="flex-grow overflow-y-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <For each={filteredStations()}>
          {(station) => (
            <StationItem
              station={station}
              onSelect={() => props.onSelectStation(station)}
            />
          )}
        </For>
      </div>
    </div>
  );
}

export default StationList;