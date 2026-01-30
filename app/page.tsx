"use client";
import { useState, useEffect } from "react";
// 1. Importamos los componentes de la librería
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const [moneda, setMoneda] = useState("bitcoin");
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

useEffect(() => {
    consultarAPI();
  }, [moneda]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-900 text-white font-sans">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center text-blue-400">Crypto Monitor Pro</h1>
        
        <select 
          value={moneda}
          onChange={(e) => setMoneda(e.target.value)}
          className="w-full bg-slate-800 text-white p-3 rounded-lg border border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="bitcoin">Bitcoin (BTC)</option>
          <option value="ethereum">Ethereum (ETH)</option>
          <option value="solana">Solana (SOL)</option>
        </select>

        {/* 2. Usamos la Card aquí para mostrar el dato principal */}
        <Card className="bg-slate-800 border-slate-700 shadow-2xl overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider">
              Precio Actual ({moneda})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cargando ? (
              <div className="text-2xl text-yellow-500 animate-pulse font-mono text-center py-4">
                Sincronizando...
              </div>
            ) : (
              <div className="text-5xl font-bold text-green-400 font-mono text-center py-4">
                ${precio}
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-slate-500">
          Datos provistos por CoinGecko API • Actualización en tiempo real
        </p>
      </div>
    </main>
  );
}