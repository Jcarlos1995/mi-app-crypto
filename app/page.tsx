"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [moneda, setMoneda] = useState("bitcoin"); // Estado para la moneda elegida
  const [precio, setPrecio] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  const consultarAPI = async () => {
    try {
      setCargando(true);
      const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${moneda}&vs_currencies=usd`);
      const datos = await res.json();
      setPrecio(datos[moneda].usd.toLocaleString());
    } catch (e) {
      setPrecio("Error");
    } finally {
      setCargando(false);
    }
  };

  // El useEffect ahora "escucha" cambios en la variable 'moneda'
  useEffect(() => {
    consultarAPI();
  }, [moneda]); // <--- Se ejecuta cada vez que cambias la moneda en el select

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-900 text-white font-sans">
      <div className="bg-gray-800 p-8 rounded-2xl border border-blue-500 shadow-2xl text-center w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-blue-400">Multi-Crypto Watch</h1>
        
        {/* Selector de moneda */}
        <select 
          value={moneda}
          onChange={(e) => setMoneda(e.target.value)}
          className="mb-6 bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-400 w-full"
        >
          <option value="bitcoin">Bitcoin (BTC)</option>
          <option value="ethereum">Ethereum (ETH)</option>
          <option value="solana">Solana (SOL)</option>
          <option value="cardano">Cardano (ADA)</option>
        </select>

        <div className="mb-8">
          <p className="text-gray-400 uppercase tracking-widest text-xs mb-2 italic">{moneda} en USD</p>
          {cargando ? (
            <div className="animate-pulse text-3xl text-yellow-500">Buscando...</div>
          ) : (
            <div className="text-5xl font-mono font-bold text-green-400">${precio}</div>
          )}
        </div>
      </div>
    </main>
  );
}