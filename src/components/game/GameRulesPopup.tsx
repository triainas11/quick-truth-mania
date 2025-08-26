import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { GameSettings } from "@/types/game";
import { Trophy, Heart, Zap } from "lucide-react";

interface GameRulesPopupProps {
  isOpen: boolean;
  onContinue: () => void;
  settings: GameSettings;
}

const GameRulesPopup = ({ isOpen, onContinue, settings }: GameRulesPopupProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Trophy className="w-6 h-6" />
            Game Rules
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {settings.scoreMode === 'points' ? (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Points Mode Rules
              </h3>
              
              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <div className="flex items-start gap-3">
                  <div className="text-green-500 font-bold">✓</div>
                  <div>
                    <div className="font-semibold">Correct Answer</div>
                    <div className="text-sm text-muted-foreground">+1 point</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="text-red-500 font-bold">✗</div>
                  <div>
                    <div className="font-semibold">Wrong Answer</div>
                    <div className="text-sm text-muted-foreground">No penalty</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="text-yellow-500 font-bold">⏱</div>
                  <div>
                    <div className="font-semibold">Time Out</div>
                    <div className="text-sm text-muted-foreground">No penalty for either player</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-primary/10 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Win Conditions</h4>
                <ul className="text-sm space-y-1">
                  <li>• Player with most points after {settings.rounds} rounds wins</li>
                  <li>• If tied → Sudden Death (5 seconds, winner takes all)</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Lives Mode Rules
              </h3>
              
              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <div className="flex items-start gap-3">
                  <div className="text-green-500 font-bold">✓</div>
                  <div>
                    <div className="font-semibold">Correct Answer</div>
                    <div className="text-sm text-muted-foreground">+1 point (no life lost)</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="text-red-500 font-bold">✗</div>
                  <div>
                    <div className="font-semibold">Wrong Answer</div>
                    <div className="text-sm text-muted-foreground">-1 life, opponent gains +1 point automatically</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="text-yellow-500 font-bold">⏱</div>
                  <div>
                    <div className="font-semibold">Time Out</div>
                    <div className="text-sm text-muted-foreground">Both players lose 1 life</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-primary/10 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Win Conditions</h4>
                <ul className="text-sm space-y-1">
                  <li>• <strong>KO Rule:</strong> If a player's lives hit 0, game ends immediately</li>
                  <li>• After {settings.rounds} rounds: Player with most points wins</li>
                  <li>• If points tied → Player with most lives left wins</li>
                  <li>• Still tied → Sudden Death (5 seconds, winner takes all)</li>
                </ul>
              </div>
            </div>
          )}
          
          <div className="bg-accent/10 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Sudden Death
            </h4>
            <p className="text-sm">
              Fixed 5 seconds regardless of your time setting. First to answer correctly wins. 
              Wrong answer = other player wins. No answer = YOU BOTH LOST!
            </p>
          </div>
          
          <Button onClick={onContinue} className="w-full" size="lg">
            Continue to Game
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameRulesPopup;