import { TbMusic, TbMusicOff } from "react-icons/tb";
import Game from "./components/Game";
import { useEffect, useRef, useState } from "react";
import music from "/assets/music/sound.mp3";

export default function App() {
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  // Music
  const audioRef = useRef(new Audio(music));

  // Ensure audio plays when the component is mounted
  useEffect(() => {
    audioRef.current.volume = 0.8;
    audioRef.current.loop = true;
    if (isPlayingMusic) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }

    return () => {
      audioRef.current.pause();
    };
  }, [isPlayingMusic]);

  return (
    <div>
      <div className='z-10 text-white text-xl font-bold tracking-widest'
        style={{
          position: 'fixed',
          top: '40px',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}>
        Flappy Bird
      </div>
      <Game />
      <a
        href="https://maldikurniawan.netlify.app/"
        className='z-10 text-gray-100 tracking-widest font-bold'
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          cursor: 'pointer'
        }}
      >
        Follow Me Here!
      </a>
      <button
        onClick={() => setIsPlayingMusic(!isPlayingMusic)}
        className='opacity-100 z-40'
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          color: '#FFF',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
        {!isPlayingMusic ?
          <TbMusicOff className='w-10 h-10 p-2 bg-blue-600 rounded-full' />
          :
          <TbMusic className='w-10 h-10 p-2 bg-blue-600 rounded-full' />
        }
      </button>
    </div>
  )
}