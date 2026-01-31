"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from '@supabase/supabase-js'

// Configuración de las monedas a monitorear
const CRYPTOS = ["bitcoin", "ethereum", "solana", "cardano", "polkadot"];

// Inicializamos el cliente (fuera del componente)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Home() {
  const [datos, setDatos] = useState<any>(null);
  const [cargando, setCargando] = useState(true);

  // Función para guardar el historial en Supabase
  const guardarHistorialEnBaseDeDatos = async (precios: any) => {
    try {
      // Creamos un array de objetos para insertar todos de un solo golpe (bulk insert)
      const registros = CRYPTOS.map(id => ({
        moneda: id,
        precio: precios[id].usd
      }));

      const { error } = await supabase
        .from('historial_precios') // Asegúrate de que tu tabla se llame exactamente así
        .insert(registros);

      if (error) throw error;
      console.log("✅ Historial guardado en Supabase");
    } catch (error) {
      console.error("❌ Error al guardar en Supabase:", error);
    }
  };

  const consultarAPI = async () => {
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${CRYPTOS.join(",")}&vs_currencies=usd`
      );
      const json = await res.json();
      
      setDatos(json);
      localStorage.setItem("crypto_cache", JSON.stringify(json));

      // Lógica de Backend: Guardamos en la BD
      await guardarHistorialEnBaseDeDatos(json);

    } catch (e) {
      console.error("Error en la petición:", e);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const cacheGuardado = localStorage.getItem("crypto_cache");
    if (cacheGuardado) {
      setDatos(JSON.parse(cacheGuardado));
      setCargando(false);
    }

    consultarAPI();

    const intervalo = setInterval(consultarAPI, 45000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-950 text-white font-sans">
      <div className="w-full max-w-2xl space-y-8">
        
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 uppercase tracking-tighter">
            Crypto OS v2.0
          </h1>
          <p className="text-slate-500 text-sm font-mono">Status: Database Connected • Engineer: José</p>
        </header>

        <Card className="bg-slate-900 border-slate-800 shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)] overflow-hidden">
          <CardHeader className="border-b border-slate-800 bg-slate-900/50">
            <div className="flex justify-between items-center">
              <CardTitle className="text-slate-400 text-xs uppercase tracking-widest font-bold">Market Overview</CardTitle>
              {cargando && <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-ping"></span>}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-800">
              {CRYPTOS.map((id) => (
                <div 
                  key={id} 
                  className="p-6 flex justify-between items-center hover:bg-slate-800/50 transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 rounded-full bg-slate-700 group-hover:bg-blue-500 transition-colors"></div>
                    <span className="capitalize font-semibold text-slate-300 group-hover:text-white">{id}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-mono font-bold text-emerald-400">
                      ${datos?.[id]?.usd ? datos[id].usd.toLocaleString() : "---"}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono">USD / {id.toUpperCase()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <footer className="flex justify-between items-center px-2">
          <div className="text-[10px] text-slate-600 font-mono">
            {cargando ? "SINCRONIZANDO..." : "SISTEMA ACTUALIZADO"}
          </div>
          <button 
            onClick={consultarAPI}
            className="text-[10px] font-bold text-blue-500 hover:text-blue-400 uppercase tracking-widest transition-colors"
          >
            [ Forzar Refresco ]
          </button>
        </footer>

      </div>
    </main>
  );
}