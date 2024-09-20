import React, { useState, useEffect } from "react";

const segments: string[] = ["Prize 1", "Prize 2", "Prize 3", "Prize 4", "Prize 5", "Prize 6"];

interface SpinHistory {
  prize: string;
  date: string;
}

const SpinTheWheel: React.FC = () => {
  const [rotation, setRotation] = useState<number>(0);
  const [prize, setPrize] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [spinsHistory, setSpinsHistory] = useState<SpinHistory[]>([]);
  const [audio] = useState<HTMLAudioElement | null>(typeof Audio !== 'undefined' ? new Audio('/path-to-your-spin-sound.mp3') : null);

  useEffect(() => {
    const storedHistory = localStorage.getItem('spinsHistory');
    if (storedHistory) {
      setSpinsHistory(JSON.parse(storedHistory));
    }
  }, []);

  const handleSpin = (): void => {
    if (isSpinning) return;

    setIsSpinning(true);
    setPrize(null);
    audio?.play();
    const randomRotation = Math.floor(Math.random() * 360) + 360 * 5;
    setRotation(prevRotation => prevRotation + randomRotation);
    
    const winningSegment = Math.floor((randomRotation % 360) / (360 / segments.length));
    const wonPrize = segments[segments.length - 1 - winningSegment];

    setTimeout(() => {
      setPrize(wonPrize);
      setIsSpinning(false);
      const newHistory: SpinHistory[] = [...spinsHistory, { prize: wonPrize, date: new Date().toLocaleString() }];
      setSpinsHistory(newHistory);
      localStorage.setItem('spinsHistory', JSON.stringify(newHistory));
      // Note: confetti effect removed due to potential dependency issues
    }, 5000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2 animate-pulse">Welcome</h1>
        <p className="text-2xl text-white">Launching Soon</p>
      </div>

      <div className="relative">
        <div className="w-80 h-80 rounded-full border-8 border-yellow-300 shadow-lg relative overflow-hidden"
             style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)' }}>
          {segments.map((segment, index) => (
            <div key={index}
                 className="absolute w-1/2 h-1/2 origin-bottom-right flex items-center justify-center"
                 style={{
                   backgroundColor: index % 2 === 0 ? '#f39c12' : '#e74c3c',
                   clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
                   transform: `rotate(${index * (360 / segments.length)}deg)`
                 }}
            >
              <span className="text-white font-bold text-sm transform -rotate-[60deg] origin-center translate-x-12">
                {segment}
              </span>
            </div>
          ))}
        </div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-white"></div>
      </div>

      <button onClick={handleSpin} 
              disabled={isSpinning}
              className="mt-8 px-8 py-3 bg-yellow-400 text-gray-800 rounded-full text-xl font-bold hover:bg-yellow-300 disabled:bg-yellow-200 transition-all duration-300 transform hover:scale-105">
        {isSpinning ? 'Spinning...' : 'Spin'}
      </button>

      {prize && (
        <div className="mt-6 text-2xl font-bold text-white animate-bounce">
          You won: {prize}
        </div>
      )}

      <div className="mt-12 w-full max-w-2xl bg-white rounded-lg p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Spin History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Prize</th>
                <th scope="col" className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {spinsHistory.map((spin, index) => (
                <tr key={index} className="bg-white border-b">
                  <td className="px-6 py-4">{spin.prize}</td>
                  <td className="px-6 py-4">{spin.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SpinTheWheel;