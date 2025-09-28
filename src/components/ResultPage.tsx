import { GameButton } from '@/components/ui/game-button';
import { Card } from '@/components/ui/card';

interface ResultPageProps {
  selectedWords: string[];
  onPlayAgain: () => void;
  onShareImage: () => void;
}

// 單字解讀庫
const INTERPRETATIONS: Record<string, string> = {
  PEACE: "你將在 2025 找到心靈的平靜，學會在忙碌中保持內心的寧靜。",
  LOVE: "愛情與友情會帶來正能量，真誠的關係將成為你最大的財富。", 
  MONEY: "財運將隨著努力而來，理性的投資與規劃帶來豐盛回報。",
  HEALTH: "身心健康是你的優先，養成良好習慣將讓你活力充沛。",
  FREEDOM: "你將突破束縛，找到真正屬於自己的人生道路。",
  PURPOSE: "人生目標愈加清晰，你會發現自己真正的使命所在。",
  MIRACLES: "意想不到的美好將降臨，保持開放的心態迎接奇蹟。",
  STRENGTH: "內在力量覺醒，你擁有克服任何挑戰的勇氣。",
  FAMILY: "家庭關係更加和諧，親情的溫暖將支撐你前行。",
  SUCCESS: "努力將獲得回報，你定義的成功即將到來。",
  WISDOM: "智慧之光照亮前路，學習與成長是你的關鍵詞。",
  ENERGY: "充滿活力的一年，你的熱情將感染身邊的人。",
  HOPE: "即使面臨挑戰，希望之光永遠指引你前進。",
  JOY: "快樂將成為日常，你會發現生活中更多美好時刻。",
  TRUST: "信任他人也信任自己，誠信將為你打開更多機會。",
  POWER: "個人影響力提升，你有能力改變自己和周圍的世界。",
  GROWTH: "持續成長是主旋律，每個經歷都讓你更加強大。",
  MAGIC: "生活充滿魔法般的驚喜，保持童心與好奇心。",
  LIGHT: "你就是光，照亮自己也溫暖他人。",
  DREAMS: "夢想正在實現的路上，堅持下去就能看見彩虹。",
};

const generateMantra = (words: string[]): string => {
  const interpretations = words
    .map(word => INTERPRETATIONS[word] || `${word} 將為你帶來特別的力量與指引。`)
    .join(' ');
  
  const opening = [
    "🔮 你的 2025 年度預言已生成 ✨",
    "🌟 宇宙為你準備的神秘訊息 🌙", 
    "💫 來自星辰的專屬指引 🔮"
  ][Math.floor(Math.random() * 3)];
  
  const closing = [
    "願這些文字成為你前進路上的明燈，指引你走向更美好的未來。",
    "帶著這份祝福與力量，在 2025 年創造屬於你的奇蹟。",
    "相信自己，相信這些美好的預言，你的人生將因此而改變。"
  ][Math.floor(Math.random() * 3)];
  
  return `${opening}\n\n${interpretations}\n\n${closing}`;
};

export const ResultPage = ({ selectedWords, onPlayAgain, onShareImage }: ResultPageProps) => {
  const mantra = generateMantra(selectedWords);
  
  return (
    <div className="min-h-screen bg-game-bg flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 bg-card/90 backdrop-blur-sm shadow-deep">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold glow-text mb-4">
            🔮 你的 2025 幸運訊息
          </h1>
          
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            {selectedWords.map((word, index) => (
              <span 
                key={index}
                className="px-4 py-2 bg-mystical text-foreground rounded-full font-bold text-lg animate-sparkle shadow-glow"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {word}
              </span>
            ))}
          </div>
        </div>
        
        <div className="bg-background/30 rounded-lg p-6 mb-8 border border-mystical/20">
          <div className="prose prose-invert max-w-none">
            {mantra.split('\n\n').map((paragraph, index) => (
              <p 
                key={index}
                className="text-foreground/90 leading-relaxed mb-4 last:mb-0"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        
        <div className="flex gap-4 justify-center flex-wrap">
          <GameButton 
            variant="neon" 
            onClick={onPlayAgain}
            className="animate-float"
          >
            🎮 再玩一次
          </GameButton>
          <GameButton 
            variant="mystical" 
            onClick={onShareImage}
            className="animate-glow-pulse"
          >
            📸 生成分享圖
          </GameButton>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-muted-foreground text-sm">
            ✨ 將這份美好分享給你的朋友們吧！ ✨
          </p>
        </div>
      </Card>
    </div>
  );
};