import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RotateCw, ChevronRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import chartData from "@/data/chartOfAccounts.json";

interface Account {
  accountTitle: string;
  classification: string;
  financialStatement: string;
  normalBalance: string;
}

const getCategoryColor = (classification: string) => {
  if (classification.includes("Asset")) return "border-green-500 bg-green-50";
  if (classification.includes("Liability")) return "border-red-500 bg-red-50";
  if (classification.includes("Equity")) return "border-orange-500 bg-orange-50";
  if (classification.includes("Revenue")) return "border-yellow-500 bg-yellow-50";
  if (classification.includes("Expense")) return "border-blue-500 bg-blue-50";
  return "border-gray-500 bg-gray-50";
};

const Flashcards = () => {
  const navigate = useNavigate();
  const [accounts] = useState<Account[]>(chartData.chartOfAccounts);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [deck, setDeck] = useState<Account[]>(accounts);

  const currentCard = deck[currentIndex];
  const progress = ((currentIndex + 1) / deck.length) * 100;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % deck.length);
    }, 150);
  };

  const handleShuffle = () => {
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-accent">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold text-foreground">
            Flashcards <span className="text-primary">Mode</span>
          </h1>
          <div className="w-32" />
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="mb-6 space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress</span>
              <span>
                Card {currentIndex + 1} / {deck.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="perspective-1000 mb-8">
            <div
              className={`relative w-full h-96 transition-transform duration-600 transform-style-3d cursor-pointer ${
                isFlipped ? "[transform:rotateY(180deg)]" : ""
              }`}
              onClick={handleFlip}
            >
              {/* Front of card */}
              <div
                className={`absolute inset-0 backface-hidden rounded-2xl shadow-2xl p-8 flex flex-col items-center justify-center bg-card border-4 ${getCategoryColor(
                  currentCard.classification
                )}`}
              >
                <p className="text-sm text-muted-foreground mb-4">Account Title</p>
                <h2 className="text-3xl font-bold text-center text-foreground">
                  {currentCard.accountTitle}
                </h2>
                <p className="text-sm text-muted-foreground mt-8">Click to reveal details</p>
              </div>

              {/* Back of card */}
              <div
                className={`absolute inset-0 backface-hidden [transform:rotateY(180deg)] rounded-2xl shadow-2xl p-8 bg-card border-4 ${getCategoryColor(
                  currentCard.classification
                )}`}
              >
                <div className="h-full flex flex-col justify-center space-y-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Account Title</p>
                    <h3 className="text-2xl font-bold text-foreground">{currentCard.accountTitle}</h3>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Classification</p>
                    <Badge className="text-base py-1 px-3">{currentCard.classification}</Badge>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Financial Statement</p>
                    <p className="text-lg font-semibold text-foreground">
                      {currentCard.financialStatement}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Normal Balance</p>
                    <p className="text-lg font-semibold text-foreground">{currentCard.normalBalance}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button variant="outline" size="lg" onClick={handleShuffle}>
              <RotateCw className="mr-2 h-4 w-4" />
              Shuffle Deck
            </Button>
            <Button variant="outline" size="lg" onClick={handleFlip}>
              <Eye className="mr-2 h-4 w-4" />
              {isFlipped ? "Hide" : "Show"} Answer
            </Button>
            <Button size="lg" onClick={handleNext}>
              Next Card
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
};

export default Flashcards;
