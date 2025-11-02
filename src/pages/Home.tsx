import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Brain, Shuffle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Session, User } from "@supabase/supabase-js";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      toast.success("Signed out successfully");
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-accent">
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-end mb-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{user.email}</span>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
          )}
        </div>
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
            IFRS <span className="text-primary">MindPlay</span>
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
          <p>IFRS MindPlay © {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
