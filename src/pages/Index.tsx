import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import GameFeature from "@/components/GameFeature";
import SplitSection from "@/components/SplitSection";
import { 
  Zap, 
  Users, 
  Trophy, 
  Gamepad2, 
  Sparkles, 
  Timer, 
  Heart, 
  Download,
  Play,
  Smartphone
} from "lucide-react";
import quickTruthIcon from "@/assets/quick-truth-icon.png";
import heroBanner from "@/assets/hero-banner.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/src/assets/hero-banner.png')] bg-cover bg-center opacity-20"></div>
        
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <div className="flex justify-center mb-8">
            <img 
              src={quickTruthIcon} 
              alt="Quick Truth Game Icon" 
              className="w-32 h-32 rounded-3xl shadow-glow animate-bounce-gentle"
            />
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight">
            QUICK TRUTH
          </h1>
          
          <p className="text-2xl md:text-3xl text-white/90 mb-8 font-semibold">
            ⚡ THE ULTIMATE REFLEX TRIVIA SHOWDOWN ⚡
          </p>
          
          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-xl text-white/80 leading-relaxed mb-6">
              🔥 Ready to test your lightning-fast reflexes AND your brain? Quick Truth is the most addictive 
              two-player trivia game that'll have you and your friends screaming, laughing, and coming back for more!
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button variant="hero" size="lg" className="text-xl px-8 py-4" asChild>
              <a href="/game">
                <Play className="mr-2" />
                Play Now!
              </a>
            </Button>
            <Button variant="game" size="lg" className="text-xl px-8 py-4">
              <Download className="mr-2" />
              Download Free
            </Button>
          </div>
        </div>
      </section>

      {/* Split Screen Demo */}
      <SplitSection
        leftContent={
          <div>
            <h2 className="text-4xl font-black mb-4">SPLIT-SCREEN</h2>
            <h3 className="text-3xl font-bold mb-6">YES/NO MADNESS!</h3>
            <p className="text-xl opacity-90">
              Face off in lightning-fast split-screen battles! Race to answer statements, 
              trivia, silly facts, and mind-bending traps. Who has the quickest reflexes?
            </p>
          </div>
        }
        rightContent={
          <div>
            <h2 className="text-4xl font-black mb-4">BRAIN TEASERS</h2>
            <h3 className="text-3xl font-bold mb-6">& WILD TWISTS!</h3>
            <p className="text-xl opacity-90">
              Speed rounds, reverse logic ("TRUE means tap NO!"), and categories from 
              pop culture to kids mode. Every round brings new surprises!
            </p>
          </div>
        }
      />

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-6 gradient-primary bg-clip-text text-transparent">
              WHY YOU'LL BE OBSESSED
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From party mode mayhem to solo brain training, Quick Truth delivers endless entertainment 
              with features that keep you coming back for "just one more round!"
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <GameFeature
              icon={<Zap className="w-8 h-8 text-background" />}
              title="Lightning Fast Gameplay"
              description="Split-second decisions, instant reactions! Perfect for quick gaming sessions or extended tournaments with friends."
            />
            
            <GameFeature
              icon={<Users className="w-8 h-8 text-background" />}
              title="Party & Multiplayer Modes"
              description="Turn any gathering into an epic showdown! Perfect for parties, family nights, or competitive friend groups."
            />
            
            <GameFeature
              icon={<Gamepad2 className="w-8 h-8 text-background" />}
              title="Categories Galore"
              description="Pop culture, sports, science, kids mode, and more! Something for every player and every age group."
            />
            
            <GameFeature
              icon={<Timer className="w-8 h-8 text-background" />}
              title="Wild Speed Rounds"
              description="Think you're fast? Wait until the speed rounds kick in! Adrenaline-pumping challenges that'll test your limits."
            />
            
            <GameFeature
              icon={<Sparkles className="w-8 h-8 text-background" />}
              title="Hilarious Animations"
              description="Instant feedback with laugh-out-loud animations and sounds that celebrate your victories and epic fails!"
            />
            
            <GameFeature
              icon={<Heart className="w-8 h-8 text-background" />}
              title="Cosmetic Upgrades"
              description="Personalize your gaming experience with fun themes, sounds, and visual effects. Lightweight monetization that enhances the fun!"
            />
          </div>
        </div>
      </section>

      {/* App Store Description */}
      <section className="py-20 px-4 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <Card className="p-12 border-2 border-primary/20 shadow-glow">
            <div className="text-center mb-8">
              <Trophy className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-4xl font-black mb-4">THE ULTIMATE REFLEX CHALLENGE</h2>
            </div>
            
            <div className="space-y-6 text-lg leading-relaxed">
              <p>
                🚀 <strong>Quick Truth</strong> isn't just another trivia game—it's a reflex-testing, 
                brain-bending, friendship-challenging experience that'll have everyone at the edge of their seats!
              </p>
              
              <p>
                ⚡ <strong>Lightning-Fast Split-Screen Action:</strong> Two players, one screen, endless possibilities! 
                Race against your opponent in YES/NO showdowns featuring trivia questions, silly facts, 
                and devious traps designed to mess with your mind.
              </p>
              
              <p>
                🎉 <strong>Party Mode Perfection:</strong> Transform any gathering into an epic tournament! 
                Perfect for family game nights, parties, or when you need to settle who really has the 
                quickest reflexes in your friend group.
              </p>
              
              <p>
                🔥 <strong>Mind-Bending Twists:</strong> Just when you think you've got it figured out, 
                we throw in speed rounds, reverse logic challenges (where TRUE means tap NO!), and 
                brain teasers that'll have you questioning everything you know.
              </p>
              
              <p>
                🎨 <strong>Endless Customization:</strong> Light, fun monetization with cosmetic upgrades 
                that let you personalize your gaming experience without breaking the bank or interrupting the flow.
              </p>
              
              <p>
                💫 <strong>Addictive Replay Value:</strong> With constantly updating categories, seasonal challenges, 
                and the unpredictable nature of human reflexes, no two games are ever the same!
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="gradient-hero p-12 rounded-3xl shadow-glow">
            <Smartphone className="w-20 h-20 text-white mx-auto mb-6" />
            <h2 className="text-5xl font-black text-white mb-6">
              READY TO PROVE YOUR REFLEXES?
            </h2>
            <p className="text-2xl text-white/90 mb-8 leading-relaxed">
              Download Quick Truth now and discover why millions of players are choosing reflex over research, 
              speed over study, and quick thinking over slow pondering! 
            </p>
            <p className="text-xl text-white/80 mb-10">
              Challenge your friends, surprise your family, and train your brain—all while having the time of your life!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button variant="action" size="lg" className="text-2xl px-12 py-6" asChild>
                <a href="/game">
                  <Play className="mr-3 w-6 h-6" />
                  PLAY QUICK TRUTH NOW
                </a>
              </Button>
            </div>
            
            <p className="text-white/60 mt-6 text-lg">
              Available on iOS and Android • Free to Play • Optional Upgrades
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
