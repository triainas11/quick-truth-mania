import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Gamepad2, Users, Timer, Zap } from "lucide-react";
import { GameSettings } from "@/hooks/useGameLogic";
import { categories } from "@/data/questions";

interface GameSetupProps {
  onStartGame: (settings: GameSettings) => void;
}

const GameSetup = ({ onStartGame }: GameSetupProps) => {
  const [settings, setSettings] = useState<GameSettings>({
    rounds: 5,
    category: 'general',
    gameMode: 'normal',
    timeLimit: 10
  });

  const handleStart = () => {
    onStartGame(settings);
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 bg-card/90 backdrop-blur-sm border-primary/20 shadow-glow">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="gradient-primary p-4 rounded-full">
              <Gamepad2 className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-black mb-2 gradient-primary bg-clip-text text-transparent">
            QUICK TRUTH
          </h1>
          <p className="text-xl text-muted-foreground">Setup Your Game</p>
        </div>

        <div className="space-y-6">
          {/* Game Mode */}
          <div>
            <label className="text-lg font-semibold mb-3 block">Game Mode</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { id: 'normal', name: 'Normal', icon: Users, desc: 'Standard gameplay' },
                { id: 'speed', name: 'Speed', icon: Zap, desc: 'Faster questions' },
                { id: 'fakeout', name: 'Fake-Out', icon: Timer, desc: 'Reverse logic twists' }
              ].map((mode) => (
                <Button
                  key={mode.id}
                  variant={settings.gameMode === mode.id ? 'default' : 'outline'}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => setSettings(prev => ({ ...prev, gameMode: mode.id as any }))}
                >
                  <mode.icon className="w-6 h-6" />
                  <div className="text-center">
                    <div className="font-semibold">{mode.name}</div>
                    <div className="text-xs opacity-70">{mode.desc}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Rounds */}
          <div>
            <label className="text-lg font-semibold mb-3 block">Number of Rounds</label>
            <div className="flex gap-2">
              {[3, 5, 10, 15].map((rounds) => (
                <Button
                  key={rounds}
                  variant={settings.rounds === rounds ? 'default' : 'outline'}
                  onClick={() => setSettings(prev => ({ ...prev, rounds }))}
                  className="flex-1"
                >
                  {rounds}
                </Button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-lg font-semibold mb-3 block">Category</label>
            <Select 
              value={settings.category} 
              onValueChange={(value) => setSettings(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.entries(categories).map(([key, name]) => (
                  <SelectItem key={key} value={key}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Limit */}
          <div>
            <label className="text-lg font-semibold mb-3 block">Time Per Question</label>
            <div className="flex gap-2">
              {[5, 10, 15, 20].map((time) => (
                <Button
                  key={time}
                  variant={settings.timeLimit === time ? 'default' : 'outline'}
                  onClick={() => setSettings(prev => ({ ...prev, timeLimit: time }))}
                  className="flex-1"
                >
                  {time}s
                </Button>
              ))}
            </div>
          </div>

          {/* Game Info */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" />
              Game Settings
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{settings.rounds} rounds</Badge>
              <Badge variant="secondary">{categories[settings.category as keyof typeof categories] || 'All Categories'}</Badge>
              <Badge variant="secondary">{settings.timeLimit}s per question</Badge>
              <Badge variant="secondary">{settings.gameMode} mode</Badge>
            </div>
          </div>

          <Button 
            onClick={handleStart}
            size="lg" 
            className="w-full text-xl py-6"
            variant="hero"
          >
            <Gamepad2 className="mr-2 w-6 h-6" />
            Start Game!
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default GameSetup;