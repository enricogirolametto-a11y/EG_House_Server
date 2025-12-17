import { useState } from 'react';
import axios from 'axios';

function App() {
  const [input, setInput] = useState("");

  const inviaDati = async () => {
    try {
      const res = await axios.post('http://localhost:3001/api/data', { testo: input });
      alert(res.data.message);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={inviaDati}>Invia al Server</button>
    </div>
  );
}
export default App;
