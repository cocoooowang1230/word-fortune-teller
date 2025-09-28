import { useState } from 'react';
import { WordSearchGame } from '@/components/WordSearchGame';
import { ResultPage } from '@/components/ResultPage';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';

const GamePage = () => {
  const [gameState, setGameState] = useState<'playing' | 'completed'>('playing');
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleGameComplete = (words: string[]) => {
    setSelectedWords(words);
    setGameState('completed');
    toast.success('🎉 恭喜完成！你的幸運訊息已生成！');
  };

  const handlePlayAgain = () => {
    setSelectedWords([]);
    setGameState('playing');
  };

  const handleShareImage = async () => {
    try {
      toast.loading('正在生成分享圖片...');
      
      // 等待一小段時間確保頁面完全渲染
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const element = document.body;
      const canvas = await html2canvas(element, {
        backgroundColor: '#1a1625',
        scale: 1,
        useCORS: true,
        allowTaint: true,
      });
      
      // 轉換為圖片並下載
      const link = document.createElement('a');
      link.download = `my-2025-mantra-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      toast.success('📸 分享圖片已生成並下載！');
    } catch (error) {
      console.error('生成圖片失敗:', error);
      toast.error('生成圖片時發生錯誤，請稍後再試');
    }
  };

  if (gameState === 'completed') {
    return (
      <ResultPage 
        selectedWords={selectedWords}
        onPlayAgain={handlePlayAgain}
        onShareImage={handleShareImage}
      />
    );
  }

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
        
        <WordSearchGame onGameComplete={handleGameComplete} />
      </div>
    </div>
  );
};

export default GamePage;