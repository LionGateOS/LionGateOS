export default function App() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg,#0b0e1a,#141833)',
      color: 'white',
      fontFamily: 'system-ui, sans-serif',
      padding: '40px'
    }}>
      <h1 style={{fontSize:'42px', marginBottom:'10px'}}>🚨 LionGateOS Travels — LIVE DATA WIRED</h1>
      <p style={{opacity:0.85, fontSize:'18px'}}>
        If you can see this screen, the old homepage is DEAD.
      </p>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:'20px', marginTop:'40px'}}>
        <section style={cardStyle}>
          <h2>🏨 Hotels</h2>
          <p>Expedia Lodging API slot</p>
          <button style={btn}>Fetch Hotels</button>
        </section>

        <section style={cardStyle}>
          <h2>🚗 Cars</h2>
          <p>Expedia Cars API slot</p>
          <button style={btn}>Fetch Cars</button>
        </section>

        <section style={cardStyle}>
          <h2>🎟️ Activities</h2>
          <p>Expedia Activities API slot</p>
          <button style={btn}>Fetch Activities</button>
        </section>
      </div>
    </div>
  )
}

const cardStyle = {
  background: '#1a1f3a',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
}

const btn = {
  marginTop: '16px',
  padding: '10px 16px',
  borderRadius: '8px',
  border: 'none',
  background: '#6a5cff',
  color: 'white',
  cursor: 'pointer'
}
