import { Show, onMount, onCleanup, createEffect } from 'solid-js';

function AudioPlayer(props) {
  let audioRef;

  createEffect(() => {
    if (audioRef && props.currentStation()) {
      audioRef.src = props.currentStation().url_resolved;
      if (props.isPlaying()) {
        audioRef.play();
      } else {
        audioRef.pause();
      }
    }
  });

  onMount(() => {
    if (audioRef) {
      audioRef.volume = props.volume();
    }
  });

  createEffect(() => {
    if (audioRef) {
      audioRef.volume = props.volume();
    }
  });

  onCleanup(() => {
    if (audioRef) {
      audioRef.pause();
    }
  });

  const togglePlay = () => {
    if (props.isPlaying()) {
      props.setIsPlaying(false);
      audioRef.pause();
    } else {
      props.setIsPlaying(true);
      audioRef.play();
    }
  };

  const handleVolumeChange = (e) => {
    props.setVolume(e.target.value);
  };

  return (
    <Show when={props.currentStation()}>
      <div class="fixed bottom-0 left-0 right-0 bg-white shadow-md p-4 flex items-center">
        <button
          class="text-green-600 focus:outline-none mr-4 cursor-pointer"
          onClick={togglePlay}
        >
          {props.isPlaying() ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m-7 4h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-5.197-3.03A1 1 0 008 8.999v6.002a1 1 0 001.555.832l5.197-3.03a1 1 0 000-1.664z" />
            </svg>
          )}
        </button>
        <div class="flex-1">
          <p class="text-gray-800 font-semibold">{props.currentStation().name}</p>
          <p class="text-gray-500 text-sm">{props.currentStation().country}</p>
        </div>
        <div class="flex items-center">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={props.volume()}
            onInput={handleVolumeChange}
            class="cursor-pointer"
          />
        </div>
        <audio ref={audioRef} />
      </div>
    </Show>
  );
}

export default AudioPlayer;