import { createSignal } from 'solid-js';

function StationPlayer(props) {
  const [isLoading, setIsLoading] = createSignal(true);

  const handleCanPlay = () => {
    setIsLoading(false);
  };

  return (
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-2xl font-bold mb-4 text-green-600">{props.station.name}</h2>
        <div class="relative">
          {isLoading() && (
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-gray-600">جارٍ تحميل البث...</div>
            </div>
          )}
          <audio
            controls
            autoplay
            src={props.station.url_resolved}
            class="w-full mb-4"
            onCanPlay={handleCanPlay}
          ></audio>
        </div>
        <button
          class="w-full px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-300 cursor-pointer"
          onClick={props.onClose}
        >
          إغلاق
        </button>
      </div>
    </div>
  );
}

export default StationPlayer;