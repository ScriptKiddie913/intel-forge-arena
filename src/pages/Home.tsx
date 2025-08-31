import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Target, Trophy, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-accent text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <Shield className="h-20 w-20 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-6">Intel Forge Arena</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Master the art of Open Source Intelligence through challenging scenarios and real-world investigations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Button size="lg" variant="secondary" asChild>
                <Link to="/challenges">Start Challenges</Link>
              </Button>
            ) : (
              <>
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/auth">Get Started</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary" asChild>
                  <Link to="/challenges">View Challenges</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Intel Forge Arena?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Develop your OSINT skills through progressive challenges designed by cybersecurity experts.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="text-center">
                <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Real-World Scenarios</CardTitle>
                <CardDescription>
                  Practice with scenarios based on actual OSINT investigations and techniques.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader className="text-center">
                <Trophy className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle>Earn Certificates</CardTitle>
                <CardDescription>
                  Complete challenges to earn verified certificates showcasing your OSINT skills.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Join the Community</CardTitle>
                <CardDescription>
                  Connect with fellow investigators and learn from cybersecurity professionals.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Begin Your OSINT Journey?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of investigators who have sharpened their skills through our comprehensive challenge platform.
          </p>
          {!user && (
            <Button size="lg" asChild>
              <Link to="/auth">Create Free Account</Link>
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;