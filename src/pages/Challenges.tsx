import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Play, Lock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  points: number;
  is_active: boolean;
}

const Challenges = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('is_active', true)
        .order('difficulty', { ascending: true });

      if (error) throw error;

      setChallenges(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load challenges.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'hard':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleLaunchChallenge = (challengeId: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to access challenges.",
      });
      return;
    }
    
    // Open challenge in new window
    const challengeUrl = `/challenge/${challengeId}`;
    window.open(challengeUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading challenges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">OSINT Challenges</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Test your open source intelligence skills with these carefully crafted challenges.
            Each challenge comes with multiple questions and rewards you with a certificate upon completion.
          </p>
        </div>

        {!user && (
          <div className="mb-8 p-4 bg-muted rounded-lg text-center">
            <p className="text-muted-foreground mb-2">
              Sign in to access challenges and track your progress.
            </p>
            <Button asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <Card key={challenge.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{challenge.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {challenge.description}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={`text-white ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty}
                    </Badge>
                    <Badge variant="outline">
                      {challenge.points} pts
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">
                    {challenge.category}
                  </Badge>
                  
                  <Button
                    onClick={() => handleLaunchChallenge(challenge.id)}
                    disabled={!user}
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    {user ? (
                      <>
                        <Play className="h-4 w-4" />
                        <span>Launch</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        <span>Sign In</span>
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {challenges.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No challenges available at the moment. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Challenges;