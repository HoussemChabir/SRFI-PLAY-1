import { useNavigate } from "react-router-dom";
import { Brain, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-accent">
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-end mb-4">
          {/* Authentication removed: sign-in / sign-out controls intentionally hidden */}
        </div>
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
            SFRI <span className="text-primary">PLAY</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Master International Financial Reporting Standards through interactive learning
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-2">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-2xl">Flashcards Mode</CardTitle>
              <CardDescription className="text-base">
                Memorize account anatomy through interactive flashcards
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                Learn classifications, financial statements, and normal balances for all IFRS accounts
              </p>
              <Button className="w-full" size="lg" onClick={() => navigate("/flashcards")}>
                Start Learning
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-2">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shuffle className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-2xl">Drag & Drop Mode</CardTitle>
              <CardDescription className="text-base">
                Build financial statements by classifying accounts
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                Apply your knowledge to construct Balance Sheets, Income Statements, and Cash Flow Statements
              </p>
              <Button className="w-full" size="lg" onClick={() => navigate("/drag-drop")}>
                Build Statements
              </Button>
            </CardContent>
          </Card>
        </div>

        <footer className="text-center mt-16 text-muted-foreground">
          <p>SFRI PLAY © {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
