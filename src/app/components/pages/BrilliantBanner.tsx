import React from 'react';
import { LogoMarquee } from './LogoMarquee';
import { Badge } from '../ui/badge';
import { Shield, Award, Sparkles } from 'lucide-react';
import { SlideInView } from './SlideInView';

interface BrilliantBannerProps {
  variant?: 'partners' | 'technology' | 'awards' | 'content';
  className?: string;
}

export function BrilliantBanner({ variant = 'partners', className = '' }: BrilliantBannerProps) {
  const config = {
    partners: {
      title: 'Trusted by Leading Organizations',
      subtitle: 'Our content is crafted by award-winning professionals from top universities and companies',
      icon: Shield,
      logos: [
        { name: 'MIT', text: 'MIT' },
        { name: 'Stanford', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Seal_of_Leland_Stanford_Junior_University.svg' },
        { name: 'Harvard', url: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Harvard_University_coat_of_arms.svg' },
        { name: 'Google', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
        { name: 'Microsoft', url: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' },
        { name: 'OpenAI', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg' },
        { name: 'Meta', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg' },
        { name: 'Apple', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
        { name: 'Amazon', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
        { name: 'Netflix', url: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
        { name: 'Tesla', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg' },
        { name: 'IBM', url: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg' },
        { name: 'Intel', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Intel_logo_%282006-2020%29.svg' },
        { name: 'Adobe', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.svg' },
        { name: 'Salesforce', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg' }
      ]
    },
    technology: {
      title: 'Powered by Cutting-Edge AI Technology',
      subtitle: 'Built with the latest artificial intelligence and machine learning frameworks',
      icon: Sparkles,
      logos: [
        { name: 'OpenAI', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg' },
        { name: 'Anthropic', text: 'ANTHROPIC' },
        { name: 'Google AI', text: 'GOOGLE AI' },
        { name: 'DeepMind', text: 'DEEPMIND' },
        { name: 'TensorFlow', text: 'TENSORFLOW' },
        { name: 'PyTorch', text: 'PYTORCH' },
        { name: 'Hugging Face', text: '🤗 HUGGING FACE' },
        { name: 'LangChain', text: '🦜 LANGCHAIN' }
      ]
    },
    awards: {
      title: 'Recognized Excellence',
      subtitle: 'Award-winning platform trusted by millions of learners worldwide',
      icon: Award,
      logos: [
        { name: 'Best EdTech 2024', text: '🏆 BEST EDTECH 2024' },
        { name: 'Innovation Award', text: '⭐ INNOVATION AWARD' },
        { name: 'Top AI Platform', text: '🚀 TOP AI PLATFORM' },
        { name: 'Learner Choice', text: '💎 LEARNER CHOICE' },
        { name: 'Excellence Award', text: '🎯 EXCELLENCE AWARD' }
      ]
    },
    content: {
      title: 'Learn from the Best',
      subtitle: 'Content partners including leading educational platforms and publishers',
      icon: Shield,
      logos: [
        { name: 'Coursera', text: 'COURSERA' },
        { name: 'edX', text: 'edX' },
        { name: 'Khan Academy', text: 'KHAN ACADEMY' },
        { name: 'Udacity', text: 'UDACITY' },
        { name: 'Brilliant', text: 'BRILLIANT' },
        { name: 'Codecademy', text: 'CODECADEMY' },
        { name: 'Pluralsight', text: 'PLURALSIGHT' },
        { name: 'LinkedIn Learning', text: 'LINKEDIN LEARNING' }
      ]
    }
  };

  const { title, subtitle, icon: Icon, logos } = config[variant];

  return (
    <section className={`relative py-12 md:py-16 border-y border-border bg-gradient-to-br from-background via-muted/30 to-background overflow-hidden ${className}`}>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--primary)_/_0.1)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--primary)_/_0.1)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      <div className="container relative z-10">
        {/* Header */}
        <SlideInView>
          <div className="text-center space-y-3 mb-10">
            <Badge variant="outline" className="border-primary/20 shadow-sm">
              <Icon className="w-3.5 h-3.5 mr-1.5 text-primary" />
              {variant === 'partners' && 'Trusted Worldwide'}
              {variant === 'technology' && 'AI-Powered'}
              {variant === 'awards' && 'Award-Winning'}
              {variant === 'content' && 'Premium Content'}
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {title}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          </div>
        </SlideInView>

        {/* Logo Marquee */}
        <SlideInView delay={200}>
          <LogoMarquee logos={logos} speed={30} />
        </SlideInView>
      </div>
    </section>
  );
}
