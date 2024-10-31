function StationItem(props) {
  const handleSelectStation = () => {
    props.setCurrentStation(props.station);
    props.setIsPlaying(true);
  };

  return (
    <div
      class="bg-white p-4 rounded-lg shadow-md flex items-center cursor-pointer hover:bg-green-50 transition duration-300"
      onClick={handleSelectStation}
    >
      <img
        src={props.station.favicon || 'https://via.placeholder.com/50'}
        alt={props.station.name}
        class="w-12 h-12 rounded-full mr-4"
      />
      <div>
        <p class="font-semibold text-lg text-green-600">{props.station.name}</p>
        <p class="text-gray-500 text-sm">{props.station.country}</p>
      </div>
    </div>
  );
}

export default StationItem;