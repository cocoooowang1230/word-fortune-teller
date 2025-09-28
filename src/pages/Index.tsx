import { GameButton } from '@/components/ui/game-button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
const Index = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-game-bg flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 text-center bg-card/90 backdrop-blur-sm shadow-deep">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold glow-text mb-4 animate-float">
            🔮 Word Search Mantra
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-mystical mb-6">
            尋找你的 2025 年度咒語
          </h2>
        </div>
        
        <div className="bg-background/20 rounded-lg p-6 mb-8 border border-mystical/30">
          <h3 className="text-xl font-bold mb-4 text-neon-yellow">
            ✨ 遊戲規則 ✨
          </h3>
          <div className="text-foreground/90 space-y-3 text-left">
            <p>📝 在字母陣中找到 3-5 個有意義的單字</p>
            <p>👆 用手指或滑鼠劃過字母來選擇單字</p>
            
            
            
          </div>
        </div>
        
        <div className="space-y-4">
          <GameButton variant="neon" size="lg" onClick={() => navigate('/game')} className="w-full md:w-auto px-8 py-4 text-xl animate-pulse-glow">
            🎮 開始遊戲
          </GameButton>
          
          <p className="text-muted-foreground text-sm">
            準備好發現你的神秘力量了嗎？
          </p>
        </div>
        
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-4 text-2xl animate-sparkle">
            <span>🌟</span>
            <span>🔮</span>
            <span>✨</span>
            <span>🌙</span>
            <span>💫</span>
          </div>
        </div>
      </Card>
    </div>;
};
export default Index;