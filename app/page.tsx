"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Definimos las monedas que queremos monitorear
const CRYPTOS = ["bitcoin", "ethereum", "solana", "cardano"];

export default function Home() {
  const [datos, setDatos] = useState<any>(null);
  const [cargando, setCargando] = useState(true);

  const consultarAPI = async () => {
    try {
      setCargando(true);
      // Consultamos todas las monedas en una sola petición
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${CRYPTOS.join(",")}&vs_currencies=usd`
      );
      const json = await res.json();
      setDatos(json);
    } catch (e) {
      console.error("Error en la API", e);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    consultarAPI();
    // Opcional: Actualizar cada 30 segundos
    const intervalo = setInterval(consultarAPI, 30000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-900 text-white font-sans">
      <div className="w-full max-w-2xl space-y-6">
        <header className="text-center">
          <h1 className="text-4xl font-extrabold text-blue-400 tracking-tight">Crypto Dashboard</h1>
          <p className="text-slate-400 mt-2">Ingeniero: José | Mercado en Tiempo Real</p>
        </header>

        <Card className="bg-slate-800 border-slate-700 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-lg text-slate-300">Resumen de Mercado (USD)</CardTitle>
          </CardHeader>
          <CardContent>
            {cargando && !datos ? (
              <div className="space-y-4">
                <div className="h-8 bg-slate-700 animate-pulse rounded"></div>
                <div className="h-8 bg-slate-700 animate-pulse rounded"></div>
              </div>
            ) : (
              <div className="divide-y divide-slate-700">
                {CRYPTOS.map((id) => (
                  <div key={id} className="py-4 flex justify-between items-center group hover:bg-slate-700/30 px-2 transition-colors rounded-lg">
                    <span className="capitalize font-medium text-slate-200">{id}</span>
                    <span className="font-mono font-bold text-green-400 text-xl">
                      ${datos?.[id]?.usd?.toLocaleString() || "---"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-center">
           <button 
            onClick={consultarAPI}
            className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-600 px-4 py-2 rounded-full transition-all"
           >
            Sincronizar ahora
           </button>
        </div>
      </div>
    </main>
  );
}