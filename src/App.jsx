import Game from "./components/Game";

export default function App() {
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
        className='z-10 text-white hover:text-blue-400 tracking-widest font-bold'
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          cursor: 'pointer'
        }}
      >
        Follow Me Here!
      </a>
    </div>
  )
}