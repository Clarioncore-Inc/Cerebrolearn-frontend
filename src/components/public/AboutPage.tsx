import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Target,
  Eye,
  Heart,
  Users,
  Award,
  TrendingUp,
  Globe,
  Zap,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  const values = [
    {
      icon: Target,
      title: 'Excellence',
      description: 'We strive for the highest quality in everything we do, from course content to platform experience.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Heart,
      title: 'Accessibility',
      description: 'Education should be available to everyone, everywhere. We make learning affordable and accessible.',
      color: 'from-red-500 to-pink-500',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Learning is better together. We foster a supportive community of passionate learners.',
      color: 'from-purple-500 to-indigo-500',
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We constantly evolve our platform with cutting-edge technology and teaching methods.',
      color: 'from-yellow-500 to-orange-500',
    },
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Co-Founder',
      image: '👩‍💼',
      bio: 'Former Head of Education at TechCorp. PhD in Educational Technology.',
    },
    {
      name: 'Michael Chen',
      role: 'CTO & Co-Founder',
      image: '👨‍💻',
      bio: '15+ years in edtech. Previously led engineering at LearnPlatform.',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Content',
      image: '👩‍🏫',
      bio: 'Master educator with 20+ years experience. Published author.',
    },
    {
      name: 'David Kim',
      role: 'Head of Product',
      image: '👨‍🎨',
      bio: 'Product design expert. Previously at Google and Coursera.',
    },
  ];

  const milestones = [
    {
      year: '2020',
      title: 'Founded',
      description: 'CerebroLearn was born from a passion to make quality education accessible to all.',
    },
    {
      year: '2021',
      title: 'First 1,000 Users',
      description: 'Reached our first thousand learners and launched 50+ courses.',
    },
    {
      year: '2022',
      title: 'Series A Funding',
      description: 'Raised $10M to expand our platform and course offerings.',
    },
    {
      year: '2023',
      title: 'Global Expansion',
      description: 'Launched in 10+ countries with multilingual support.',
    },
    {
      year: '2024',
      title: '10,000+ Active Learners',
      description: 'Growing community with 500+ courses and industry recognition.',
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Active Learners' },
    { value: '500+', label: 'Expert Courses' },
    { value: '100+', label: 'Industry Partners' },
    { value: '50,000+', label: 'Certificates Issued' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-purple-900 text-white py-20 md:py-32">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]" />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              <Sparkles className="h-3 w-3 mr-1" />
              About Us
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Empowering Learners Worldwide
            </h1>
            <p className="text-xl text-white/90">
              We're on a mission to make high-quality education accessible, engaging, and effective for everyone, everywhere.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
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

      {/* Mission & Vision */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="h-full">
                <CardContent className="p-8">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center mb-6">
                    <Target className="h-7 w-7 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                  <p className="text-lg text-muted-foreground mb-4">
                    To democratize education by providing accessible, high-quality learning experiences that empower individuals to achieve their personal and professional goals.
                  </p>
                  <p className="text-muted-foreground">
                    We believe that everyone deserves access to world-class education, regardless of their background, location, or financial situation. Through innovative technology and expert instruction, we're breaking down barriers to learning.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="h-full">
                <CardContent className="p-8">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6">
                    <Eye className="h-7 w-7 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                  <p className="text-lg text-muted-foreground mb-4">
                    To become the world's most trusted and effective learning platform, transforming how people acquire knowledge and skills.
                  </p>
                  <p className="text-muted-foreground">
                    We envision a future where learning is personalized, interactive, and continuously adapted to each individual's needs. Where anyone, anywhere can master any skill and achieve their dreams.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4">Our Values</Badge>
            <h2 className="text-4xl font-bold mb-4">What We Stand For</h2>
            <p className="text-lg text-muted-foreground">
              These core values guide everything we do at CerebroLearn
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center mx-auto mb-4`}>
                      <value.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story / Timeline */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4">Our Journey</Badge>
            <h2 className="text-4xl font-bold mb-4">The CerebroLearn Story</h2>
            <p className="text-lg text-muted-foreground">
              From a small startup to a global learning platform
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-6">
                        <div className="h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-xl font-bold">
                          {milestone.year}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                          <p className="text-muted-foreground">{milestone.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4">Our Team</Badge>
            <h2 className="text-4xl font-bold mb-4">Meet the People Behind CerebroLearn</h2>
            <p className="text-lg text-muted-foreground">
              A passionate team dedicated to transforming education
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-5xl mx-auto mb-4">
                      {member.image}
                    </div>
                    <h3 className="font-semibold mb-1">{member.name}</h3>
                    <p className="text-sm text-primary mb-3">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4">Why Choose Us</Badge>
            <h2 className="text-4xl font-bold mb-4">What Makes Us Different</h2>
            <p className="text-lg text-muted-foreground">
              We're not just another learning platform
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Interactive Learning</h3>
                <p className="text-muted-foreground">
                  Our Brilliant-style approach makes learning active and engaging, not passive and boring.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Industry Recognition</h3>
                <p className="text-muted-foreground">
                  Our certificates are recognized by top employers and educational institutions worldwide.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Proven Results</h3>
                <p className="text-muted-foreground">
                  98% of our learners report significant improvement in their skills and career prospects.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32 bg-muted/30">
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
                  Join Our Learning Community
                </h2>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Be part of a global movement to make education accessible to all. Start your learning journey today.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90" onClick={() => onNavigate('signup')}>
                    Get Started Free
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" onClick={() => onNavigate('contact')}>
                    Contact Us
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
