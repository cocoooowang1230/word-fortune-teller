import { useState } from 'react';
import { WordSearchGame } from '@/components/WordSearchGame';
import { useNavigate } from 'react-router-dom';

const GamePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-game-bg">
      <div className="container mx-auto py-8">
        <div className="text-center mb-6">
          <button 
            onClick={() => navigate('/')}
            className="text-mystical hover:text-mystical/80 transition-colors"
          >
            ← 返回首頁
          </button>
        </div>
        
        <WordSearchGame />
      </div>
    </div>
  );
};

export default GamePage;