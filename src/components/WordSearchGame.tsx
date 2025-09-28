import { useState, useRef, useEffect, useCallback } from 'react';
import { GameButton } from '@/components/ui/game-button';
import { Card } from '@/components/ui/card';

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
const HIGHLIGHT_COLORS = [
  'highlight-yellow',
  'highlight-green', 
  'highlight-pink',
  'neon-blue',
  'mystical'
];

// 幸運關鍵字庫
const KEYWORDS = [
  'PEACE', 'LOVE', 'MONEY', 'HEALTH', 'FREEDOM', 'PURPOSE', 'MIRACLES', 
  'STRENGTH', 'FAMILY', 'SUCCESS', 'WISDOM', 'ENERGY', 'HOPE', 'JOY',
  'TRUST', 'POWER', 'GROWTH', 'MAGIC', 'LIGHT', 'DREAMS'
];

const generateGrid = (): string[][] => {
  const grid: string[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
  
  // 隨機放置關鍵字
  const placedWords = new Set<string>();
  const targetWordCount = Math.min(8, KEYWORDS.length);
  
  while (placedWords.size < targetWordCount) {
    const word = KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)];
    if (placedWords.has(word)) continue;
    
    const directions = [
      [0, 1],   // 水平
      [1, 0],   // 垂直
      [1, 1],   // 對角線
      [-1, 1],  // 反對角線
    ];
    
    const direction = directions[Math.floor(Math.random() * directions.length)];
    const startRow = Math.floor(Math.random() * GRID_SIZE);
    const startCol = Math.floor(Math.random() * GRID_SIZE);
    
    // 檢查是否能放置
    let canPlace = true;
    for (let i = 0; i < word.length; i++) {
      const row = startRow + direction[0] * i;
      const col = startCol + direction[1] * i;
      if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) {
        canPlace = false;
        break;
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
  onGameComplete: (words: string[]) => void;
}

export const WordSearchGame = ({ onGameComplete }: WordSearchGameProps) => {
  const [grid, setGrid] = useState<string[][]>(() => generateGrid());
  const [selectedWords, setSelectedWords] = useState<SelectedWord[]>([]);
  const [currentSelection, setCurrentSelection] = useState<Position[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
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
      return { row, col };
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
      
      // 計算從起點到當前點的直線路徑
      const deltaRow = pos.row - start.row;
      const deltaCol = pos.col - start.col;
      const steps = Math.max(Math.abs(deltaRow), Math.abs(deltaCol));
      
      if (steps > 0) {
        const stepRow = deltaRow / steps;
        const stepCol = deltaCol / steps;
        
        for (let i = 0; i <= steps; i++) {
          const row = Math.round(start.row + stepRow * i);
          const col = Math.round(start.col + stepCol * i);
          if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
            positions.push({ row, col });
          }
        }
      } else {
        positions.push(start);
      }
      
      setCurrentSelection(positions);
    }
  }, [isSelecting, currentSelection, getPositionFromEvent]);

  const endSelection = useCallback(() => {
    if (currentSelection.length > 1) {
      const word = currentSelection.map(pos => grid[pos.row][pos.col]).join('');
      
      if (word.length >= 3 && !selectedWords.some(w => w.word === word)) {
        const colorIndex = selectedWords.length % HIGHLIGHT_COLORS.length;
        const newWord: SelectedWord = {
          word,
          positions: [...currentSelection],
          color: HIGHLIGHT_COLORS[colorIndex]
        };
        setSelectedWords(prev => [...prev, newWord]);
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
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd, { passive: false });
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

  const handleShuffle = () => {
    setGrid(generateGrid());
    setSelectedWords([]);
    setCurrentSelection([]);
  };

  const handleReset = () => {
    setSelectedWords([]);
    setCurrentSelection([]);
  };

  const handleFinish = () => {
    if (selectedWords.length > 0) {
      onGameComplete(selectedWords.map(w => w.word));
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <Card className="p-6 bg-card/80 backdrop-blur-sm">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold glow-text mb-2">
            Find Your 2025 Mantra
          </h2>
          <p className="text-muted-foreground">
            已選擇 {selectedWords.length}/5 個單字
          </p>
        </div>
        
        <div 
          ref={gridRef}
          className="grid grid-cols-15 gap-0 w-fit mx-auto mb-6 bg-background/50 p-2 rounded-lg shadow-deep"
          style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
          onMouseDown={startSelection}
          onTouchStart={startSelection}
        >
          {grid.map((row, rowIndex) =>
            row.map((letter, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={getCellClass(rowIndex, colIndex)}
              >
                {letter}
              </div>
            ))
          )}
        </div>

        {selectedWords.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 text-center">選中的單字:</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {selectedWords.map((word, index) => (
                <span 
                  key={index}
                  className={`px-3 py-1 rounded-full text-background font-bold ${word.color}`}
                >
                  {word.word}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-center flex-wrap">
          <GameButton variant="ghost-neon" onClick={handleShuffle}>
            🔄 重新洗牌
          </GameButton>
          <GameButton variant="danger" onClick={handleReset}>
            🧹 重置
          </GameButton>
          <GameButton 
            variant="neon" 
            onClick={handleFinish}
            disabled={selectedWords.length === 0}
            glowing={selectedWords.length > 0}
          >
            ✨ 完成 ({selectedWords.length})
          </GameButton>
        </div>
      </Card>
    </div>
  );
};