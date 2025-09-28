import { useState, useRef, useEffect, useCallback } from 'react';
import { GameButton } from '@/components/ui/game-button';
import { Card } from '@/components/ui/card';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';
interface Position {
  row: number;
  col: number;
}
interface SelectedWord {
  word: string;
  positions: Position[];
  color: string;
}
const GRID_SIZE = 15;
const HIGHLIGHT_COLORS = ['highlight-yellow', 'highlight-green', 'highlight-pink', 'neon-blue', 'mystical'];

// 幸運關鍵字庫 + 常用英文單字（增加更多簡單正面的詞彙）
const KEYWORDS = [
  // 核心正面詞彙
  'LOVE', 'HOPE', 'HAPPY', 'JOY', 'PEACE', 'SMILE', 'LIGHT', 'MAGIC', 'DREAMS', 'LUCKY',
  'KIND', 'NICE', 'GOOD', 'BEST', 'WIN', 'WINS', 'YES', 'FUN', 'PLAY', 'DANCE',
  'SING', 'LAUGH', 'WARM', 'SOFT', 'SWEET', 'CUTE', 'COOL', 'CALM', 'SAFE', 'FREE',
  
  // 生活美好詞彙
  'FAMILY', 'FRIEND', 'HOME', 'HEART', 'SOUL', 'MIND', 'LIFE', 'TIME', 'DAY', 'SUN',
  'MOON', 'STAR', 'SKY', 'BLUE', 'PINK', 'GOLD', 'GIFT', 'CAKE', 'FOOD', 'MILK',
  
  // 能量詞彙
  'ENERGY', 'POWER', 'STRONG', 'BRAVE', 'WISE', 'SMART', 'BRIGHT', 'SHINE', 'GLOW', 'RISE',
  'FLY', 'GROW', 'LEARN', 'HELP', 'CARE', 'GIVE', 'SHARE', 'OPEN', 'NEW', 'FRESH',
  
  // 成就詞彙
  'SUCCESS', 'MONEY', 'HEALTH', 'GOALS', 'FAITH', 'TRUST', 'GROWTH', 'STRENGTH', 'WISDOM',
  'FREEDOM', 'PURPOSE', 'MIRACLES', 'FUTURE'
];

// 英文單字字典（完整版本，包含更多常用詞）
const COMMON_WORDS = new Set([
// 三字母單字
'THE', 'AND', 'FOR', 'ARE', 'BUT', 'NOT', 'YOU', 'ALL', 'CAN', 'HER', 'WAS', 'ONE', 'OUR', 'HAD', 'OUT', 'DAY', 'GET', 'HAS', 'HIM', 'HOW', 'ITS', 'MAY', 'NEW', 'NOW', 'OLD', 'SEE', 'TWO', 'WHO', 'BOY', 'DID', 'WAY', 'USE', 'MAN', 'SHE', 'SAY', 'HIS', 'GOD', 'SET', 'END', 'RUN', 'WIN', 'TOP', 'TRY', 'BIG', 'BAD', 'FUN', 'SUN', 'SKY', 'CAR', 'DOG', 'CAT', 'BOX', 'RED', 'YES', 'EAT', 'PUT', 'LET', 'ASK', 'AGO', 'ARM', 'EYE', 'EAR', 'LEG', 'CUP', 'KEY', 'MAP', 'PEN', 'BAG', 'HAT', 'BED', 'EGG', 'ICE', 'JOB', 'LAW', 'OIL', 'PIG', 'SEA', 'TAX', 'WAR', 'ZOO', 'ART', 'BUS', 'CUT', 'DRY', 'FAR', 'GUN', 'HIT', 'ILL', 'JOY', 'KID', 'LIE', 'MOM', 'NET', 'OWN', 'PAY', 'RAW', 'SIT', 'TOY', 'VAN', 'WET', 'MIX', 'FIX', 'SIX', 'FOX', 'AGE', 'AIR', 'ANY', 'BAG', 'BAR', 'BAT', 'BIT', 'BOW', 'BUY', 'COW', 'CRY', 'DIE', 'DIG', 'EAR', 'EYE', 'FEW', 'FLY', 'GAP', 'GAS', 'HAM', 'HOT', 'INK', 'JAM', 'LAY', 'LOG', 'LOW', 'MAD', 'MUD', 'NUT', 'OFF', 'POT', 'RAG', 'ROW', 'SAD', 'SAW', 'SEW', 'SHY', 'TAB', 'TEN', 'TOE', 'TON', 'TOP', 'TUG', 'WIG', 'WIN', 'ZIP', 'ADD', 'BIG', 'DIM', 'FIT', 'HOT', 'LID',
// 四字母單字
'LOVE', 'LIFE', 'TIME', 'WORK', 'WORD', 'GOOD', 'YEAR', 'MAKE', 'KNOW', 'BACK', 'COME', 'TAKE', 'WANT', 'GIVE', 'HAND', 'PART', 'FIND', 'TELL', 'TURN', 'MOVE', 'PLAY', 'SEEM', 'LOOK', 'FEEL', 'CALL', 'HELP', 'KEEP', 'SHOW', 'MEAN', 'NEED', 'LAST', 'LONG', 'BEST', 'HOME', 'BOTH', 'SIDE', 'IDEA', 'HEAD', 'FACE', 'FACT', 'HAND', 'HIGH', 'EACH', 'MOST', 'SUCH', 'VERY', 'WHAT', 'WITH', 'HAVE', 'FROM', 'THEY', 'THIS', 'BEEN', 'HAVE', 'SAID', 'EACH', 'LIKE', 'ONLY', 'SOME', 'ALSO', 'BOOK', 'TREE', 'DOOR', 'ROOM', 'FOOD', 'GAME', 'HERO', 'KING', 'MOON', 'STAR', 'WIND', 'FIRE', 'FISH', 'BIRD', 'BEAR', 'LION', 'WOLF', 'DUCK', 'FROG', 'CAKE', 'MILK', 'RICE', 'SOUP', 'MEAT', 'BLUE', 'GOLD', 'PINK', 'GREY', 'DARK', 'WARM', 'COLD', 'FAST', 'SLOW', 'EASY', 'HARD', 'SOFT', 'TALL', 'WIDE', 'DEEP', 'NEAR', 'SAFE', 'RICH', 'POOR', 'FULL', 'GLAD', 'BUSY', 'FREE', 'OPEN', 'REAL', 'TRUE', 'SURE', 'NICE', 'KIND', 'COOL', 'CUTE', 'FINE', 'WILD', 'CALM', 'WISE', 'FAIR', 'MINE', 'CARE', 'HOPE', 'HURT', 'JOKE', 'KISS', 'LAKE', 'LEAN', 'MALL', 'NAME', 'OKAY', 'PACE', 'QUIZ', 'RACE', 'SALE', 'TALK', 'UGLY', 'VARY', 'WAKE', 'ZERO', 'ABLE', 'BEAR', 'CODE', 'DEAL', 'EDGE', 'FLAT', 'GAIN', 'HATE', 'ITEM', 'JOIN', 'KICK', 'LUCK', 'MASK', 'NOTE', 'OVAL', 'PULL', 'QUIT', 'ROCK', 'SAVE', 'TAPE', 'USED', 'VIEW', 'WALK', 'YARD', 'ZONE', 'ARMY', 'BOAT', 'COIN', 'DRAW', 'EVEN', 'FLAG', 'GOLF', 'HALT', 'IRON', 'JOKE', 'KNEE', 'LAWN', 'MAIL', 'NAVY', 'OVAL', 'PARK', 'QUIT', 'RAIN', 'SNOW', 'TEXT', 'UNIT', 'VAST', 'WALL', 'YOGA', 'ZERO',
// 五字母單字
'ABOUT', 'ABOVE', 'AFTER', 'AGAIN', 'ALONE', 'ALONG', 'BEING', 'BELOW', 'COULD', 'DOING', 'EVERY', 'FIRST', 'FOUND', 'GIVEN', 'GOING', 'GREAT', 'GROUP', 'HAPPY', 'HOUSE', 'LARGE', 'LIGHT', 'LIVED', 'MIGHT', 'MONEY', 'NEVER', 'NIGHT', 'OTHER', 'PEACE', 'PLACE', 'RIGHT', 'SHALL', 'SMALL', 'SOUND', 'STILL', 'STUDY', 'THEIR', 'THESE', 'THINK', 'THREE', 'UNDER', 'WATER', 'WHERE', 'WHICH', 'WHILE', 'WORLD', 'WOULD', 'WRITE', 'WRONG', 'YOUNG', 'ANGEL', 'APPLE', 'BEACH', 'BRAIN', 'BREAD', 'CHAIR', 'DANCE', 'DREAM', 'EARTH', 'FLOWER', 'GLASS', 'HEART', 'HONEY', 'HUMAN', 'LAUGH', 'MAGIC', 'OCEAN', 'PAPER', 'PIANO', 'PLANT', 'SMILE', 'SPACE', 'SWEET', 'TABLE', 'TIGER', 'VOICE', 'WHEAT', 'WOMAN', 'YOUTH',
// 關鍵字（已包含在字典中）
...KEYWORDS]);

// 幸運解讀字典
const FORTUNE_MEANINGS = {
  'PEACE': '你將在 2025 找到心靈的平靜與和諧。',
  'LOVE': '愛情與友情會為你帶來無限能量。',
  'MONEY': '財運將隨著你的努力而豐收。',
  'HEALTH': '身心健康是你最大的財富。',
  'FREEDOM': '自由意志將指引你走向正確的道路。',
  'PURPOSE': '你會找到人生真正的使命。',
  'MIRACLES': '奇蹟將在你最需要的時候出現。',
  'STRENGTH': '內在力量讓你能克服一切困難。',
  'FAMILY': '家人的支持是你最大的依靠。',
  'SUCCESS': '成功正在向你招手。',
  'WISDOM': '智慧讓你在迷茫中找到方向。',
  'ENERGY': '正能量將充滿你的每一天。',
  'HOPE': '希望之光照亮你前進的路。',
  'JOY': '快樂將成為你生活的主旋律。',
  'TRUST': '信任將為你帶來珍貴的緣分。',
  'POWER': '你擁有改變現實的力量。',
  'GROWTH': '持續成長讓你越來越強大。',
  'MAGIC': '生活中的小確幸充滿魔力。',
  'LIGHT': '光明將驅散所有的陰霾。',
  'DREAMS': '夢想正在一步步實現。',
  'FUTURE': '美好的未來正等待著你。',
  'HAPPY': '幸福是你的人生底色。',
  'LUCKY': '幸運女神眷顧著你。',
  'BRAVE': '勇氣讓你無所畏懼。',
  'KIND': '善良的心會為你帶來福報。',
  'SMART': '聰明才智是你的利器。',
  'STRONG': '堅強的意志助你渡過難關。',
  'MIND': '清晰的思維指引你做出正確決定。',
  'SOUL': '靈魂的純淨讓你散發光芒。',
  'HEART': '真心誠意會得到回報。',
  'FAITH': '信念的力量讓一切皆有可能。',
  'GOALS': '目標明確讓你勇往直前。',
  'WINS': '勝利屬於堅持不懈的你。',
  'SHINE': '你的光芒將照亮周圍的人。',
  'GLOW': '內在的光輝讓你與眾不同。',
  'RISE': '你會在困境中崛起。',
  'FLY': '自由翱翔是你的天性。'
};
const generateGrid = (): string[][] => {
  const grid: string[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));

  // 隨機放置關鍵字和常用單字
  const placedWords = new Set<string>();
  const availableWords = [...KEYWORDS, ...Array.from(COMMON_WORDS).filter(w => w.length >= 3 && w.length <= 8)];
  const targetWordCount = Math.min(300, availableWords.length); // 增加到300個單字，讓遊戲更豐富

  let attempts = 0;
  while (placedWords.size < targetWordCount && attempts < 5000) {
    attempts++;
    const word = availableWords[Math.floor(Math.random() * availableWords.length)];
    if (placedWords.has(word)) continue;
    const directions = [[0, 1],
    // 水平
    [1, 0],
    // 垂直
    [1, 1],
    // 對角線
    [-1, 1],
    // 反對角線
    [0, -1],
    // 反水平
    [-1, 0],
    // 反垂直
    [-1, -1],
    // 反對角線
    [1, -1] // 反對角線
    ];
    const direction = directions[Math.floor(Math.random() * directions.length)];
    const startRow = Math.floor(Math.random() * GRID_SIZE);
    const startCol = Math.floor(Math.random() * GRID_SIZE);

    // 檢查是否能放置
    let canPlace = true;
    const positions: Position[] = [];
    for (let i = 0; i < word.length; i++) {
      const row = startRow + direction[0] * i;
      const col = startCol + direction[1] * i;
      if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) {
        canPlace = false;
        break;
      }
      positions.push({
        row,
        col
      });
    }

    // 檢查是否與已放置的字母衝突
    if (canPlace) {
      for (const pos of positions) {
        if (grid[pos.row][pos.col] !== '' && grid[pos.row][pos.col] !== word[positions.indexOf(pos)]) {
          canPlace = false;
          break;
        }
      }
    }
    if (canPlace) {
      for (let i = 0; i < word.length; i++) {
        const row = startRow + direction[0] * i;
        const col = startCol + direction[1] * i;
        grid[row][col] = word[i];
      }
      placedWords.add(word);
    }
  }

  // 填充剩餘空格
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j] === '') {
        grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
    }
  }
  return grid;
};
interface WordSearchGameProps {
  onGameComplete?: (words: string[]) => void;
}
export const WordSearchGame = ({
  onGameComplete
}: WordSearchGameProps) => {
  const [grid, setGrid] = useState<string[][]>(() => generateGrid());
  const [selectedWords, setSelectedWords] = useState<SelectedWord[]>([]);
  const [currentSelection, setCurrentSelection] = useState<Position[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [fortuneMessage, setFortuneMessage] = useState<string>('');
  const gridRef = useRef<HTMLDivElement>(null);
  const getPositionFromEvent = useCallback((e: any): Position | null => {
    if (!gridRef.current) return null;
    const rect = gridRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const cellSize = rect.width / GRID_SIZE;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
      return {
        row,
        col
      };
    }
    return null;
  }, []);
  const startSelection = useCallback((e: any) => {
    if (selectedWords.length >= 5) return;
    const pos = getPositionFromEvent(e);
    if (pos) {
      setIsSelecting(true);
      setCurrentSelection([pos]);
    }
  }, [getPositionFromEvent, selectedWords.length]);
  const updateSelection = useCallback((e: any) => {
    if (!isSelecting) return;
    const pos = getPositionFromEvent(e);
    if (pos && currentSelection.length > 0) {
      const start = currentSelection[0];
      const positions: Position[] = [];

      // 只允許直線選擇（水平、垂直、對角線）
      const deltaRow = pos.row - start.row;
      const deltaCol = pos.col - start.col;

      // 檢查是否為有效的直線方向
      const isHorizontal = deltaRow === 0;
      const isVertical = deltaCol === 0;
      const isDiagonal = Math.abs(deltaRow) === Math.abs(deltaCol);
      if (isHorizontal || isVertical || isDiagonal) {
        const steps = Math.max(Math.abs(deltaRow), Math.abs(deltaCol));
        if (steps > 0) {
          const stepRow = deltaRow / steps;
          const stepCol = deltaCol / steps;
          for (let i = 0; i <= steps; i++) {
            const row = Math.round(start.row + stepRow * i);
            const col = Math.round(start.col + stepCol * i);
            if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
              positions.push({
                row,
                col
              });
            }
          }
        } else {
          positions.push(start);
        }
      } else {
        // 如果不是直線，只保留起點
        positions.push(start);
      }
      setCurrentSelection(positions);
    }
  }, [isSelecting, currentSelection, getPositionFromEvent]);
  const endSelection = useCallback(() => {
    if (currentSelection.length > 1) {
      const word = currentSelection.map(pos => grid[pos.row][pos.col]).join('');

      // 檢查是否為有效的英文單字，且長度至少3個字母
      if (word.length >= 3 && COMMON_WORDS.has(word) && !selectedWords.some(w => w.word === word)) {
        const colorIndex = selectedWords.length % HIGHLIGHT_COLORS.length;
        const newWord: SelectedWord = {
          word,
          positions: [...currentSelection],
          color: HIGHLIGHT_COLORS[colorIndex]
        };
        setSelectedWords(prev => [...prev, newWord]);
        toast.success(`找到單字: ${word}! ✨`);
      } else if (word.length >= 3 && !COMMON_WORDS.has(word)) {
        toast.error(`"${word}" 不是有效的英文單字`);
      }
    }
    setIsSelecting(false);
    setCurrentSelection([]);
  }, [currentSelection, grid, selectedWords]);
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => updateSelection(e);
    const handleMouseUp = () => endSelection();
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      updateSelection(e);
    };
    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      endSelection();
    };
    if (isSelecting) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, {
        passive: false
      });
      document.addEventListener('touchend', handleTouchEnd, {
        passive: false
      });
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isSelecting, updateSelection, endSelection]);
  const getCellClass = (row: number, col: number): string => {
    const baseClass = "w-8 h-8 border border-border/30 flex items-center justify-center text-sm font-mono cursor-pointer select-none transition-all duration-200";

    // 檢查是否在當前選擇中
    if (currentSelection.some(pos => pos.row === row && pos.col === col)) {
      return `${baseClass} bg-mystical/60 text-foreground animate-pulse`;
    }

    // 檢查是否在已選中的單字中
    for (const word of selectedWords) {
      if (word.positions.some(pos => pos.row === row && pos.col === col)) {
        return `${baseClass} ${word.color} text-background font-bold`;
      }
    }
    return `${baseClass} bg-grid-dark hover:bg-mystical/20 text-foreground/80`;
  };
  const generateFortune = (): string => {
    return "📖 2025 回顧小語：\n這些字就是你今年的代表詞，它們拼湊出你的年度故事。";
  };
  const handleShuffle = () => {
    setGrid(generateGrid());
    setSelectedWords([]);
    setCurrentSelection([]);
    setGameCompleted(false);
    setFortuneMessage('');
  };
  const handleReset = () => {
    setSelectedWords([]);
    setCurrentSelection([]);
    setGameCompleted(false);
    setFortuneMessage('');
  };
  const handleFinish = () => {
    if (selectedWords.length > 0) {
      const words = selectedWords.map(w => w.word);
      const fortune = generateFortune();
      setFortuneMessage(fortune);
      setGameCompleted(true);
      onGameComplete?.(words);
      toast.success('🎉 恭喜完成！你的幸運訊息已生成！');
    }
  };
  const handleShareImage = async () => {
    try {
      toast.loading('正在生成分享圖片...');
      await new Promise(resolve => setTimeout(resolve, 500));

      // 只截取遊戲區域
      const gameElement = document.querySelector('.game-container') as HTMLElement;
      if (!gameElement) {
        toast.error('無法找到遊戲區域');
        return;
      }
      const canvas = await html2canvas(gameElement, {
        backgroundColor: '#1a1625',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        width: gameElement.offsetWidth,
        height: gameElement.offsetHeight
      });

      // 轉換為 blob
      canvas.toBlob(async blob => {
        if (!blob) {
          toast.error('圖片生成失敗');
          return;
        }

        // 檢查是否支援 Web Share API
        if (navigator.share && navigator.canShare) {
          try {
            const file = new File([blob], `my-2025-mantra-${Date.now()}.png`, {
              type: 'image/png'
            });
            if (navigator.canShare({
              files: [file]
            })) {
              await navigator.share({
                title: '我的 2025 年宇宙提示',
                text: '來看看我在 Word Search Mantra 遊戲中找到的幸運單字！',
                files: [file]
              });
              toast.success('分享成功！');
              return;
            }
          } catch (shareError) {
            console.log('Web Share 失敗，使用下載方式');
          }
        }

        // 降級到下載功能
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `my-2025-mantra-${Date.now()}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        toast.success('📸 分享圖片已下載！');
      }, 'image/png');
    } catch (error) {
      console.error('生成圖片失敗:', error);
      toast.error('生成圖片時發生錯誤，請稍後再試');
    }
  };
  return <div className="flex flex-col items-center gap-6 p-4">
      <Card className="p-6 bg-card/80 backdrop-blur-sm game-container">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold glow-text mb-2">✨2025 REWIND✨</h2>
          <p className="text-muted-foreground">
            已選擇 {selectedWords.length}/5 個單字
          </p>
        </div>
        
        <div ref={gridRef} className="grid grid-cols-15 gap-0 w-fit mx-auto mb-6 bg-background/50 p-2 rounded-lg shadow-deep" style={{
        gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`
      }} onMouseDown={startSelection} onTouchStart={startSelection}>
          {grid.map((row, rowIndex) => row.map((letter, colIndex) => <div key={`${rowIndex}-${colIndex}`} className={getCellClass(rowIndex, colIndex)}>
                {letter}
              </div>))}
        </div>

        {selectedWords.length > 0 && <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 text-center">選中的單字:</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {selectedWords.map((word, index) => <span key={index} className={`px-3 py-1 rounded-full text-background font-bold ${word.color}`}>
                  {word.word}
                </span>)}
            </div>
          </div>}

        {!gameCompleted ? <div className="flex gap-3 justify-center flex-wrap">
            <GameButton variant="ghost-neon" onClick={handleShuffle}>
              🔄 重新洗牌
            </GameButton>
            <GameButton variant="danger" onClick={handleReset}>
              🧹 重置
            </GameButton>
            <GameButton variant="neon" onClick={handleFinish} disabled={selectedWords.length === 0} glowing={selectedWords.length > 0}>
              ✨ 完成 ({selectedWords.length})
            </GameButton>
          </div> : <div className="space-y-4">
            {/* 結果訊息區塊 */}
            <div className="text-center mt-6">
              <div className="p-4 bg-mystical/10 rounded-lg border border-mystical/20 max-w-md mx-auto">
                <div className="whitespace-pre-line text-foreground/90 leading-relaxed text-sm">
                  {fortuneMessage}
                </div>
              </div>
            </div>
            
            {/* 按鈕區塊 */}
            <div className="flex gap-3 justify-center flex-wrap mt-6">
              <GameButton variant="neon" onClick={handleShuffle}>
                🎮 再玩一次
              </GameButton>
              <GameButton variant="ghost-neon" onClick={handleShareImage}>
                📤 分享我的結果 ✨
              </GameButton>
            </div>
          </div>}
      </Card>
    </div>;
};