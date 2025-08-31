import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Trophy, Flag } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  points: number;
}

interface Question {
  id: string;
  question: string;
  points: number;
  order_index: number;
}

const Challenge = () => {
  const { challengeId } = useParams();
  const { user } = useAuth();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [submissions, setSubmissions] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (challengeId) {
      fetchChallenge();
      fetchQuestions();
    }
  }, [challengeId]);

  useEffect(() => {
    // Calculate progress based on correct submissions
    const correctAnswers = Object.values(submissions).filter(Boolean).length;
    const totalQuestions = questions.length || 1;
    setProgress((correctAnswers / totalQuestions) * 100);
  }, [submissions, questions]);

  const fetchChallenge = async () => {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('id', challengeId)
        .single();

      if (error) throw error;
      setChallenge(data);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load challenge.",
      });
    }
  };

  const fetchQuestions = async () => {
    try {
      // For now, create mock questions since the questions table doesn't exist yet
      const mockQuestions: Question[] = [
        {
          id: '1',
          question: 'What is the IP address of the target server? (Format: XXX.XXX.XXX.XXX)',
          points: 50,
          order_index: 1
        },
        {
          id: '2',
          question: 'What port is the web service running on?',
          points: 30,
          order_index: 2
        },
        {
          id: '3',
          question: 'What is the operating system of the target server?',
          points: 40,
          order_index: 3
        }
      ];
      
      setQuestions(mockQuestions);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load questions.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async (questionId: string) => {
    const answer = answers[questionId];
    if (!answer?.trim()) {
      toast({
        variant: "destructive",
        title: "Invalid Answer",
        description: "Please provide an answer before submitting.",
      });
      return;
    }

    setSubmitting(true);

    try {
      // Mock answer validation (in real implementation, this would check against correct flags)
      const mockCorrectAnswers: { [key: string]: string } = {
        '1': '192.168.1.100',
        '2': '80',
        '3': 'Ubuntu'
      };

      const isCorrect = mockCorrectAnswers[questionId]?.toLowerCase() === answer.toLowerCase();

      setSubmissions(prev => ({
        ...prev,
        [questionId]: isCorrect
      }));

      if (isCorrect) {
        toast({
          title: "Correct!",
          description: "Great job! You found the correct answer.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Incorrect",
          description: "That's not the right answer. Keep investigating!",
        });
      }

      // Check if all questions are answered correctly
      const allAnswered = questions.every(q => submissions[q.id] || q.id === questionId && isCorrect);
      if (allAnswered) {
        setTimeout(() => {
          generateCertificate();
        }, 1000);
      }

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit answer.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const generateCertificate = () => {
    toast({
      title: "🎉 Challenge Completed!",
      description: "Congratulations! Your certificate is being generated.",
    });

    // Mock certificate generation
    setTimeout(() => {
      const certificateWindow = window.open('', '_blank', 'width=800,height=600');
      if (certificateWindow) {
        certificateWindow.document.write(`
          <html>
            <head>
              <title>OSINT Challenge Certificate</title>
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  text-align: center; 
                  padding: 40px;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                }
                .certificate {
                  background: white;
                  color: #333;
                  padding: 40px;
                  border-radius: 10px;
                  max-width: 600px;
                  margin: 0 auto;
                  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                }
                .header { font-size: 32px; margin-bottom: 20px; color: #667eea; }
                .title { font-size: 24px; margin-bottom: 30px; }
                .recipient { font-size: 28px; font-weight: bold; color: #764ba2; margin: 20px 0; }
                .challenge-info { margin: 20px 0; font-size: 18px; }
                .footer { margin-top: 30px; font-size: 14px; color: #666; }
              </style>
            </head>
            <body>
              <div class="certificate">
                <div class="header">🛡️ Intel Forge Arena</div>
                <div class="title">Certificate of Completion</div>
                <div>This certifies that</div>
                <div class="recipient">${user?.email || 'Anonymous User'}</div>
                <div>has successfully completed the OSINT challenge</div>
                <div class="challenge-info">
                  <strong>"${challenge?.title || 'Unknown Challenge'}"</strong><br>
                  Category: ${challenge?.category || 'General'}<br>
                  Difficulty: ${challenge?.difficulty || 'Unknown'}<br>
                  Points Earned: ${challenge?.points || 0}
                </div>
                <div class="footer">
                  Issued on ${new Date().toLocaleDateString()}<br>
                  Intel Forge Arena - OSINT Challenge Platform
                </div>
              </div>
            </body>
          </html>
        `);
      }
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading challenge...</p>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Challenge Not Found</h1>
          <p className="text-muted-foreground">The requested challenge could not be loaded.</p>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Challenge Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">{challenge.title}</CardTitle>
                <CardDescription className="text-base mb-4">
                  {challenge.description}
                </CardDescription>
                <div className="flex space-x-2">
                  <Badge className={`text-white ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty}
                  </Badge>
                  <Badge variant="outline">{challenge.category}</Badge>
                  <Badge variant="secondary">
                    <Trophy className="h-3 w-3 mr-1" />
                    {challenge.points} pts
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">
                  {Object.values(submissions).filter(Boolean).length} / {questions.length} completed
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>
        </Card>

        {/* Questions */}
        <div className="space-y-4">
          {questions.map((question, index) => (
            <Card key={question.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <span>Question {index + 1}</span>
                      {submissions[question.id] !== undefined && (
                        submissions[question.id] ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )
                      )}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {question.question}
                    </CardDescription>
                  </div>
                  <Badge variant="outline">
                    {question.points} pts
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <Label htmlFor={`answer-${question.id}`} className="sr-only">
                      Answer
                    </Label>
                    <Input
                      id={`answer-${question.id}`}
                      placeholder="Enter your answer (flag)..."
                      value={answers[question.id] || ''}
                      onChange={(e) => setAnswers(prev => ({
                        ...prev,
                        [question.id]: e.target.value
                      }))}
                      disabled={submissions[question.id] === true}
                    />
                  </div>
                  <Button
                    onClick={() => handleSubmitAnswer(question.id)}
                    disabled={submitting || submissions[question.id] === true}
                    className="flex items-center space-x-2"
                  >
                    <Flag className="h-4 w-4" />
                    <span>Submit</span>
                  </Button>
                </div>
                
                {submissions[question.id] === true && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-green-800 text-sm">
                    ✅ Correct answer! Well done.
                  </div>
                )}
                
                {submissions[question.id] === false && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
                    ❌ Incorrect answer. Keep investigating!
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Completion Status */}
        {progress === 100 && (
          <Card className="mt-6 border-green-200 bg-green-50">
            <CardHeader className="text-center">
              <CardTitle className="text-green-800 flex items-center justify-center space-x-2">
                <Trophy className="h-6 w-6" />
                <span>Challenge Completed!</span>
              </CardTitle>
              <CardDescription className="text-green-700">
                Congratulations! You've successfully completed this OSINT challenge.
                Your certificate has been generated.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Challenge;