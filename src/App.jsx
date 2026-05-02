import DarkVeil from './DarkVeil'

function App() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
      }}>
        <DarkVeil
          hueShift={35}
          noiseIntensity={0.01}
          scanlineIntensity={0.14}
          speed={1.7}
          scanlineFrequency={1.7}
          warpAmount={0.6}
        />
      </div>

      <div style={{ position: 'relative', zIndex: 1, padding: '40px' }}>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold' }}>
          Elagkian Rajendram
        </h1>
      </div>

    </div>
  )
}

export default App