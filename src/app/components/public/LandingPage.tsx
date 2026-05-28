import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  BookOpen,
  Users,
  Trophy,
  Zap,
  Brain,
  Target,
  TrendingUp,
  Award,
  CheckCircle2,
  Star,
  ArrowRight,
  Play,
  Sparkles,
  Globe,
  Lock,
  Clock,
  BarChart3,
} from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const features = [
    {
      icon: Brain,
      title: 'Interactive Learning',
      description: 'Brilliant-style step-by-step lessons with instant feedback and progressive hints',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Trophy,
      title: 'Gamification',
      description: 'Earn XP, unlock badges, maintain streaks, and compete on leaderboards',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Visualize your learning journey with detailed analytics and insights',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Award,
      title: 'Certifications',
      description: 'Earn professional certificates upon course completion',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Users,
      title: 'Expert Creators',
      description: 'Learn from industry professionals and subject matter experts',
      color: 'from-red-500 to-rose-500',
    },
    {
      icon: Globe,
      title: 'Learn Anywhere',
      description: 'Access your courses on any device, anytime, anywhere',
      color: 'from-indigo-500 to-blue-500',
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Active Learners' },
    { value: '500+', label: 'Expert Courses' },
    { value: '50,000+', label: 'Lessons Completed' },
    { value: '98%', label: 'Satisfaction Rate' },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Engineer',
      image: '👩‍💻',
      content: 'CerebroLearn transformed how I learn. The interactive lessons and gamification kept me motivated throughout my coding journey.',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Product Manager',
      image: '👨‍💼',
      content: 'The quality of courses and the progress tracking features are outstanding. I can clearly see my improvement over time.',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'Data Scientist',
      image: '👩‍🔬',
      content: 'Best learning platform I\'ve used. The certificates are recognized by employers, and the content is always up-to-date.',
      rating: 5,
    },
  ];

  const benefits = [
    'Self-paced learning that fits your schedule',
    'Interactive exercises with instant feedback',
    'Professional certificates upon completion',
    'Track your progress with detailed analytics',
    'Join a community of passionate learners',
    'Access on all your devices',
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Choose Your Path',
      description: 'Browse our catalog and select courses that match your goals',
      icon: Target,
    },
    {
      step: '2',
      title: 'Learn Interactively',
      description: 'Complete step-by-step lessons with hints and immediate feedback',
      icon: Brain,
    },
    {
      step: '3',
      title: 'Track Progress',
      description: 'Monitor your learning journey with visualizations and insights',
      icon: BarChart3,
    },
    {
      step: '4',
      title: 'Earn Recognition',
      description: 'Collect badges, maintain streaks, and earn certificates',
      icon: Award,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-purple-900 text-white">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]" />
        <div className="container relative py-24 md:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-white/20 text-white border-white/30">
                <Sparkles className="h-3 w-3 mr-1" />
                Interactive Learning Platform
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Learn Smarter,
                <br />
                Not Harder
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-lg">
                Master new skills with Brilliant-style interactive lessons, gamification, and expert-led courses. Your journey to expertise starts here.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90" onClick={() => onNavigate('signup')}>
                  Start Learning Free
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" onClick={() => onNavigate('catalog')}>
                  <Play className="h-5 w-5 mr-2" />
                  Watch Demo
                </Button>
              </div>
              <p className="text-sm text-white/70 mt-4">
                Free forever. No credit card required.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                <div className="aspect-video bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <div className="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                      <Play className="h-12 w-12" />
                    </div>
                    <p className="text-lg font-semibold">See CerebroLearn in Action</p>
                  </div>
                </div>
              </div>
              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-6 -right-6 bg-white text-primary rounded-xl p-4 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                  <div>
                    <p className="text-xs font-medium">Achievement</p>
                    <p className="text-sm font-bold">Badge Unlocked!</p>
                  </div>
                </div>
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-6 -left-6 bg-white text-primary rounded-xl p-4 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <Zap className="h-6 w-6 text-yellow-500" />
                  <div>
                    <p className="text-xs font-medium">You Earned</p>
                    <p className="text-sm font-bold">+50 XP</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30 border-y">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl font-bold text-primary mb-2">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4">Features</Badge>
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-lg text-muted-foreground">
              Powerful features designed to accelerate your learning journey
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4">How It Works</Badge>
            <h2 className="text-4xl font-bold mb-4">Your Learning Journey</h2>
            <p className="text-lg text-muted-foreground">
              Four simple steps to achieve your learning goals
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <Card className="h-full">
                  <CardContent className="p-6 text-center">
                    <div className="h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                      {item.step}
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4">Why Choose Us</Badge>
              <h2 className="text-4xl font-bold mb-4">Built for Your Success</h2>
              <p className="text-lg text-muted-foreground mb-8">
                We've designed every feature with one goal in mind: helping you achieve your learning objectives faster and more effectively.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="h-6 w-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </div>
                    <p className="text-lg">{benefit}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary to-purple-600 p-8 flex items-center justify-center">
                <div className="text-center text-white">
                  <Brain className="h-24 w-24 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold mb-2">Learn Your Way</h3>
                  <p className="text-white/80">
                    Personalized learning paths tailored to your goals
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4">Testimonials</Badge>
            <h2 className="text-4xl font-bold mb-4">Loved by Learners Worldwide</h2>
            <p className="text-lg text-muted-foreground">
              See what our community has to say about their experience
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6">{testimonial.content}</p>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                        {testimonial.image}
                      </div>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gradient-to-br from-primary to-purple-600 text-white border-0">
              <CardContent className="p-12 md:p-16 text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Ready to Start Learning?
                </h2>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Join thousands of learners achieving their goals with CerebroLearn. Start your journey today.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90" onClick={() => onNavigate('signup')}>
                    Get Started Free
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" onClick={() => onNavigate('pricing')}>
                    View Pricing
                  </Button>
                </div>
                <p className="text-sm text-white/70 mt-6">
                  Free plan available. Upgrade anytime.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
