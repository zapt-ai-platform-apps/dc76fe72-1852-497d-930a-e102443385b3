import { For } from 'solid-js';
import StationItem from './StationItem';

function StationList(props) {
  const filteredStations = () => {
    const searchTermLower = props.searchTerm().toLowerCase();
    return props.stations().filter(station =>
      station.name.toLowerCase().includes(searchTermLower)
    );
  };

  return (
    <div class="flex-grow overflow-y-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <For each={filteredStations()}>
          {(station) => (
            <StationItem
              station={station}
              setCurrentStation={props.setCurrentStation}
              setIsPlaying={props.setIsPlaying}
            />
          )}
        </For>
      </div>
    </div>
  );
}

export default StationList;