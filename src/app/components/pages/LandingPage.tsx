import { useAuth } from '../../contexts/AuthContext';
import { useFeatureFlags } from '../../contexts/FeatureFlagContext';
import { useAppSettings } from '../../hooks/useAppSettings';
import { HowItWorksSection } from '../sections/HowItWorksSection';
import { AIHeroSection } from './AIHeroSection';
import { BrilliantBanner } from './BrilliantBanner';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import {
  BookOpen,
  Users,
  Trophy,
  Zap,
  Target,
  Award,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Star,
  Clock,
  Play,
  Brain,
  Rocket,
  Calendar,
  Globe,
  Shield,
  FileText,
  Gamepad2,
  BarChart3,
  Upload,
  PenTool,
  Video,
  BookMarked,
  Lightbulb,
  Users2,
  CheckCircle,
  Book
} from 'lucide-react';

const imgImage9 = "/assets/1b8ecf81cf4f7b4c4ad46fb87d38198fce6066e5.png";
const imgImage55 = "/assets/279474bb0377daeaa24db9ebc979f29a163e457d.png";
const imgImage56 = "/assets/287263fbc10ba182771f89e03a20b5a325d6dc81.png";
const imgImage59 = "/assets/6fccf20ec49077fcdc5b458b410228f700798765.png";
const imgImage61 = "/assets/64c735cea776b2bb18be343bad5d67e5528354cc.png";
const imgImage62 = "/assets/9a8e10c0215eba6754e78eff77112ba157fcc62e.png";
const imgImage67 = "/assets/28cb7d225bf072bdf1e8a907b803a449aa9efaf2.png";
const imgDiv = "/assets/676be56e3abc59e868c4aebf8c78e59bfba4cb9e.png";
const imgDiv1 = "/assets/dfa849d9c6c959b062d1c54434187530d7dc31bf.png";
const imgDiv2 = "/assets/1c0fb39200e97fbb738f409f0c95349f83cc3103.png";
const imgDiv3 = "/assets/e0e83dd7b43a66952dcf7fbc3b1f6b3bafafadf2.png";
const imgProductImage = "/assets/395b74aa3ac48340d5e1bb34035e499118657561.png";
const imgDiv4 = "/assets/0de71ac4144ddf456e41d314839af7a4dd98160e.png";
const imgOnlineTest1 = "/assets/74b9c4a05863014e829874effcdb4e101a4bfaea.png";
const imgExam1 = "/assets/2b9915a5b2bccb2fc3576435451e50183a1ab681.avif";
const imgCertification1 = "/assets/2b450a7aaeec583b742195169b6d6e836c5b8470.png";
const imgCallToAction = "/assets/a956cf32af6d936b4e935451c2fe2257d07c8ea7.png";

interface LandingPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const { user } = useAuth();
  const { isIQOnlyMode, showCourseFeatures } = useFeatureFlags();
  const { formattedIQTestPrice } = useAppSettings();

  const allInOneFeatures = [
    {
      icon: Award,
      title: 'Earn Accreditations',
      description: 'Earn accreditations to verify your knowledge and showcase your expertise to employers worldwide.',
      color: '#395192'
    },
    {
      icon: Brain,
      title: 'Learn Modern Skills',
      description: 'Take courses to learn modern skills in a versatile amount of subjects from industry experts.',
      color: '#06b6d4'
    },
    {
      icon: Briefcase,
      title: 'Career Prep',
      description: 'Prep for your career aspirations with industry-relevant training and hands-on projects.',
      color: '#10b981'
    }
  ];

  const journeyCards = [
    {
      icon: Target,
      title: 'Begin My Career',
      description: 'Start your learning journey from scratch',
      gradient: 'from-indigo-500 to-purple-500',
      action: () => onNavigate(user ? 'dashboard' : 'auth')
    },
    {
      icon: TrendingUp,
      title: 'Progress My Career',
      description: 'Advance your existing career skills',
      gradient: 'from-cyan-500 to-blue-500',
      action: () => onNavigate(user ? 'dashboard' : 'auth')
    },
    {
      icon: BookOpen,
      title: 'Explore Courses',
      description: 'Browse thousands of expert courses',
      gradient: 'from-emerald-500 to-teal-500',
      action: () => onNavigate('catalog')
    },
    {
      icon: GraduationCap,
      title: 'Create Courses',
      description: 'Share your knowledge with the world',
      gradient: 'from-[#f7e4a7] to-[#f5df96]',
      action: () => onNavigate(user ? 'instructor' : 'auth')
    }
  ];

  const popularCourses = [
    {
      title: 'Computer Science',
      subtitle: 'Software Engineering',
      image: imgDiv,
      rating: 4.8,
      students: '12.5K',
      duration: '8 weeks',
      color: '#395192'
    },
    {
      title: 'Computer Science',
      subtitle: 'Artificial Intelligence & Machine Learning',
      image: imgDiv1,
      rating: 4.9,
      students: '15.3K',
      duration: '10 weeks',
      color: '#6478be'
    },
    {
      title: 'Data Science',
      subtitle: 'Data Analytics & Visualization',
      image: imgDiv2,
      rating: 4.7,
      students: '9.8K',
      duration: '6 weeks',
      color: '#8ca1eb'
    },
    {
      title: 'Business',
      subtitle: 'Digital Marketing Strategy',
      image: imgDiv3,
      rating: 4.6,
      students: '11.2K',
      duration: '5 weeks',
      color: '#395192'
    },
    {
      title: 'Design',
      subtitle: 'UI/UX Design Fundamentals',
      image: imgProductImage,
      rating: 4.8,
      students: '13.7K',
      duration: '7 weeks',
      color: '#6478be'
    },
    {
      title: 'Programming',
      subtitle: 'Full Stack Web Development',
      image: imgDiv4,
      rating: 4.9,
      students: '18.4K',
      duration: '12 weeks',
      color: '#8ca1eb'
    }
  ];

  const platformFeatures = [
    ...(isIQOnlyMode
      ? []
      : [{
          icon: Upload,
          title: 'Create Courses',
          description: 'Upload your courses with ease using our intuitive course creation tools. Share your knowledge and expertise with thousands of eager learners worldwide.',
          image: imgCallToAction,
          action: () => onNavigate(user ? 'instructor' : 'auth')
        }]),
    {
      icon: FileText,
      title: 'Testing Center',
      description: `Unlock practice tests and book an official psychologist-proctored IQ assessment for ${formattedIQTestPrice}.`,
      image: imgOnlineTest1,
      action: () => onNavigate(user ? 'dashboard' : 'iq-test-overview')
    },
    {
      icon: BarChart3,
      title: 'Rankings',
      description: 'Visit our Rankings center to see global and local leaderboards. Compete with learners worldwide and track your progress against the best.',
      image: imgExam1,
      action: () => onNavigate(user ? 'dashboard' : 'iq-test-overview')
    },
    {
      icon: Book,
      title: 'Certification',
      description: 'Get an IQ certificate from a certified psychologist',
      image: imgCertification1,
      action: () => onNavigate(user ? 'dashboard' : 'auth')
    }
  ];

  const whyChooseUs = [
    {
      icon: Lightbulb,
      title: 'Expert-Led Content',
      description: 'Learn from industry professionals and top educators',
      color: '#395192'
    },
    {
      icon: Users2,
      title: 'Active Community',
      description: 'Join thousands of learners in our vibrant community',
      color: '#06b6d4'
    },
    {
      icon: CheckCircle,
      title: 'Verified Certificates',
      description: 'Earn recognized certifications to boost your career',
      color: '#10b981'
    },
    {
      icon: Video,
      title: 'Interactive Learning',
      description: 'Engage with hands-on projects and real-world scenarios',
      color: '#f59e0b'
    },
    {
      icon: BookMarked,
      title: 'Flexible Scheduling',
      description: 'Learn at your own pace, anytime and anywhere',
      color: '#ec4899'
    },
    {
      icon: Trophy,
      title: 'Gamified Experience',
      description: 'Earn XP, badges, and compete on leaderboards',
      color: '#8b5cf6'
    }
  ];

  return (
    <div className="w-full overflow-hidden">
      {/* Animated Top Banner */}
      {!isIQOnlyMode && (
        <div className="relative overflow-hidden bg-gradient-to-r from-primary via-secondary to-primary text-white">
          <div className="absolute inset-0 neural-grid opacity-20"></div>
          <div className="container relative py-3 text-center text-sm z-10">
            <p className="flex items-center justify-center gap-2 flex-wrap">
              <Sparkles className="w-4 h-4 animate-pulse" />
              Start, switch, or advance your career with more than 70+ Topics, Professional Certificates, and gain knowledge from world-class universities and companies.
              <button
                onClick={() => onNavigate(user ? 'dashboard' : 'auth')}
                className="underline hover:no-underline font-semibold inline-flex items-center gap-1 group"
              >
                Join for Free
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </p>
          </div>
        </div>
      )}

      {/* AI Hero Section */}
      <AIHeroSection onNavigate={onNavigate} isAuthenticated={!!user} />

      {/* Conversion CTAs */}
      <section className="py-14 bg-gradient-to-b from-background to-background/95">
        <div className="container">
          <Card className="border-2 border-primary/20 shadow-xl bg-gradient-to-br from-card to-card/90">
            <CardContent className="py-10 space-y-8">
              <div className="text-center space-y-3">
                <Badge className="bg-primary text-primary-foreground border-0">Get Started</Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-primary">Choose Your CerebroLearn Path</h2>
                <p className="text-muted-foreground max-w-3xl mx-auto">
                  {isIQOnlyMode
                    ? 'Jump directly into our IQ and psychologist services.'
                    : 'Start as a learner, teach as an instructor, or jump directly into our IQ and psychologist services.'}
                </p>
              </div>

              {!isIQOnlyMode && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <Button
                    size="lg"
                    className="h-14 text-base"
                    onClick={() => onNavigate(user ? 'dashboard' : 'auth', { authMode: 'signup' })}
                  >
                    <GraduationCap className="w-5 h-5 mr-2" />
                    Become a Learner
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 text-base border-2"
                    onClick={() => onNavigate(user ? 'instructor' : 'auth', { authMode: 'signup' })}
                  >
                    <Briefcase className="w-5 h-5 mr-2" />
                    Become an Instructor
                  </Button>
                </div>
              )}

              <div className="pt-2 border-t">
                <p className="text-sm font-semibold text-primary mb-3">Popular Services</p>
                <div className="grid sm:grid-cols-3 gap-3">
                  <Button variant="secondary" onClick={() => onNavigate('iq-test-overview')}>
                    <Brain className="w-4 h-4 mr-2" />
                    IQ Assessment
                  </Button>
                  <Button variant="secondary" onClick={() => onNavigate('auth', { authMode: 'login' })}>
                    <Users className="w-4 h-4 mr-2" />
                    Find Psychologists
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => onNavigate(user ? 'student-sessions' : 'auth', user ? undefined : { authMode: 'login' })}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    My Sessions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Brilliant Banner - Trusted Partners */}
      <BrilliantBanner variant="partners" />

      {/* Partners Section with Parallax Effect */}
      <section className="relative border-y border-border bg-gradient-to-br from-background to-background/95" style={{ display: 'none' }}>
        <div className="container py-12">
          <div className="text-center space-y-2 mb-12">
            <Badge variant="outline" className="border-primary/20">
              <Shield className="w-3 h-3 mr-1 text-primary" />
              Trusted Worldwide
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-primary">Designed by Experts!</h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Our content is crafted by award-winning professionals from top universities and companies!
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-60 hover:opacity-100 transition-all duration-500">
            {[imgImage55, imgImage56, imgImage59, imgImage61, imgImage62, imgImage67].map((img, index) => (
              <div 
                key={index} 
                className="h-16 flex items-center justify-center filter grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <img src={img} alt={`Partner ${index + 1}`} className="h-full object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Cards with Bento Grid */}
      {!isIQOnlyMode && (
      <section className="py-16 bg-gradient-to-b from-background to-background/95 relative overflow-hidden">
        <div className="absolute inset-0 neural-grid opacity-[0.03]"></div>
        <div className="container relative z-10">
          <div className="backdrop-blur-xl bg-card/80 dark:bg-card/90 rounded-3xl border-2 border-border shadow-2xl overflow-hidden">
            <div className="absolute inset-0 neural-grid opacity-[0.02]"></div>
            <div className="p-8 md:p-12 relative z-10">
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">
                  What brings you to CerebroLearn today?
                </h2>
                <p className="text-muted-foreground">Choose your path and start your journey</p>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {journeyCards.map((card, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-card to-card/95 dark:from-card dark:to-card/90 border-2 border-border hover:border-primary transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
                    onClick={card.action}
                  >
                    <div className="absolute inset-0 neural-grid opacity-0 group-hover:opacity-[0.05] transition-opacity duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500" style={{ background: `linear-gradient(135deg, ${card.gradient.split(' ')[0].replace('from-', '')} 0%, ${card.gradient.split(' ')[1].replace('to-', '')} 100%)` }}></div>
                    <div className="relative p-6 space-y-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                        <card.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-primary group-hover:text-primary/80 transition-colors">
                          {card.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {card.description}
                        </p>
                      </div>
                      <div className="flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Get Started <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* All-In-One Features with Modern Cards */}
      {!isIQOnlyMode && (
      <section className="py-20 relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
        <div className="absolute inset-0 neural-grid opacity-[0.03]"></div>
        <div className="container relative z-10">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-gradient-to-r from-[#395192] to-[#6478be] text-white border-0 shadow-lg">
              <Zap className="w-3 h-3 mr-1" />
              All-In-One Platform
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-[#395192] via-[#4a63a8] to-[#395192] bg-clip-text text-transparent pb-2">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              CerebroLearn is an online learning platform that combines all the tools to reach your full intellectual potential.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {allInOneFeatures.map((feature, index) => (
              <Card
                key={index}
  className="group relative overflow-hidden border-2 border-border hover:border-primary transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 bg-gradient-to-br from-card to-card/95"
              >
                <div className="absolute inset-0 neural-grid opacity-0 group-hover:opacity-[0.05] transition-opacity duration-500"></div>
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" style={{ background: feature.color }}></div>
                <CardHeader className="space-y-6 relative z-10">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" style={{ background: feature.color }}></div>
                    <div className="relative w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500" style={{ background: feature.color }}>
                      <feature.icon className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-primary group-hover:text-primary/80 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Popular Courses - Modern Grid */}
      {showCourseFeatures && (
      <section className="py-20 bg-gradient-to-br from-background via-background to-background/95 relative overflow-hidden">
        <div className="absolute inset-0 neural-grid opacity-[0.02]"></div>
        <div className="container relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-5xl font-bold">
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Our Most </span>
                <span className="bg-gradient-to-r from-[#f7e4a7] via-[#f5df96] to-[#cebb7e] bg-clip-text text-transparent">Popular Courses</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Join Our Courses Verified By Professionals
              </p>
            </div>
            <Button
              variant="outline"
              size="lg"
              onClick={() => onNavigate('catalog')}
              className="group border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-lg"
            >
              Explore Courses
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularCourses.map((course, index) => (
              <Card
                key={index}
                className="group cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border-2 border-border hover:border-primary bg-card"
                onClick={() => onNavigate('catalog')}
              >
                <div className="relative h-56 overflow-hidden">
                  <div className="absolute inset-0 neural-grid opacity-0 group-hover:opacity-10 z-[5] transition-opacity duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute bottom-4 left-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <Button size="sm" className="w-full bg-background dark:bg-primary text-primary dark:text-primary-foreground hover:bg-primary hover:text-primary-foreground">
                      <Play className="w-4 h-4 mr-2" />
                      Start Learning
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs" style={{ background: `${course.color}20`, color: course.color }}>
                      {course.title}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold line-clamp-2 text-primary group-hover:text-primary/80 transition-colors min-h-[3.5rem]">
                    {course.subtitle}
                  </h3>

                  <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t border-border">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 dark:fill-yellow-500 dark:text-yellow-500" />
                      <span className="font-medium">{course.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{course.students}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Platform Features - Alternating Layout */}
      <section className="py-20 bg-background relative overflow-hidden">
        <div className="absolute inset-0 neural-grid opacity-[0.03]"></div>
        <div className="container relative z-10">
          <div className="text-center mb-16 space-y-4">
            <Badge className="bg-gradient-to-r from-[#395192] to-[#6478be] text-white border-0 shadow-lg">
              <Zap className="w-3 h-3 mr-1" />
              Platform Features
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/70 to-primary bg-clip-text text-transparent pb-2">
              Everything You Need in One Platform
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Discover all the powerful tools and features that make CerebroLearn the ultimate learning platform
            </p>
          </div>

          <div className="space-y-24">
            {platformFeatures.map((feature, index) => {
              // Determine if this is one of the features that should have smaller images
              const shouldReduceImageSize = feature.title.includes('Testing Center') ||
                                           feature.title.includes('Rankings') ||
                                           feature.title.includes('Gaming Center');

              return (
                <div
                  key={index}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg group/icon">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-primary/70 blur-xl opacity-50 group-hover/icon:opacity-75 transition-opacity"></div>
                      <feature.icon className="w-8 h-8 relative z-10" />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-primary">
                      {feature.title}
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                    <Button
                      size="lg"
                      onClick={feature.action}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg group"
                    >
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                  <div className={`relative ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <div className={`relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-500 group ${
                      shouldReduceImageSize ? 'max-w-md mx-auto' : ''
                    }`}>
                      <div className={`relative ${
                        shouldReduceImageSize ? 'aspect-[4/3]' : 'aspect-video'
                      }`}>
                        <div className="absolute inset-0 neural-grid opacity-0 group-hover:opacity-10 z-10 transition-opacity duration-500"></div>
                        <img
                          src={feature.image}
                          alt={feature.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[5]"></div>
                      </div>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute -z-10 top-8 right-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
                    <div className="absolute -z-10 bottom-8 left-8 w-40 h-40 bg-secondary/10 rounded-full blur-3xl"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      {!isIQOnlyMode && (
      <section className="py-20 relative overflow-hidden bg-gradient-to-br bg-background">
        <div className="absolute inset-0 neural-grid opacity-[0.03]"></div>
        <div className="container relative z-10">
          <div className="text-center mb-16 space-y-4">
            <Badge className="bg-gradient-to-r from-[#395192] to-[#6478be] text-white border-0 shadow-lg">
              <Shield className="w-3 h-3 mr-1" />
              Why Choose CerebroLearn
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/70 to-primary bg-clip-text text-transparent pb-2">
              The Best Learning Experience
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Join thousands of successful learners who have transformed their careers with CerebroLearn
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((item, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-2 border-border hover:border-primary transition-all duration-500 hover:shadow-xl hover:-translate-y-2 bg-card"
              >
                <div className="absolute inset-0 neural-grid opacity-0 group-hover:opacity-[0.05] transition-opacity duration-500"></div>
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" style={{ background: item.color }}></div>
                <CardHeader className="space-y-4 relative z-10">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" style={{ background: item.color }}></div>
                    <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500" style={{ background: item.color }}>
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-xl text-primary group-hover:text-primary/80 transition-colors">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed text-muted-foreground">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* AI Technology Banner */}
      <BrilliantBanner variant="technology" />

      {/* IQ Test Promotional Section */}
      <section className="py-20 iq-section-bg relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 neural-grid opacity-20"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#06b6d4]/30 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[#f59e0b]/20 to-transparent rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
{/* Discover Your True IQ Score Section */}
        <div className="container relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Content */}
              <div className="text-white space-y-6">
                <Badge className="bg-white/20 hover:bg-white/30 border-0 text-white backdrop-blur-md text-sm">
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  Practice Access Included • Official Testing {formattedIQTestPrice}
                </Badge>

                <div className="space-y-4">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                    Discover Your
                    <span className="block bg-gradient-to-r from-[#fbbf24] via-[#f59e0b] to-[#fbbf24] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                      True IQ Score
                    </span>
                  </h2>
                  
                  <p className="text-xl text-white/90 leading-relaxed">
                    Book your official IQ package to unlock practice tests, then complete a verified psychologist assessment and compare yourself with history's greatest minds.
                  </p>
                </div>

                {/* Feature List */}
                <div className="space-y-3 py-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#06b6d4] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">Unlimited Practice Access</p>
                      <p className="text-white/80">Practice tests unlock after booking, so you can prepare before your final exam</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#10b981] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">Official Testing Available</p>
                      <p className="text-white/80">Book a verified psychologist for {formattedIQTestPrice} and get a certified IQ assessment</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#f59e0b] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">Compare with Geniuses</p>
                      <p className="text-white/80">See how you rank against Einstein, Tesla, and 20+ historical figures</p>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    size="lg"
                    onClick={() => onNavigate('iq-test-overview')}
                    className="bg-white dark:bg-primary text-primary dark:text-primary-foreground hover:bg-white/90 dark:hover:bg-primary/90 shadow-2xl text-lg h-14 px-8 group"
                  >
                    <Brain className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Explore Official IQ Test
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => onNavigate('genius-directory')}
                    className="border-2 border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md text-lg h-14 px-8"
                  >
                    <Trophy className="w-5 h-5 mr-2" />
                    Explore Genius Database
                  </Button>
                </div>

                <p className="text-sm text-white/70 pt-2">
                  ⚡ Unlimited practice access included • Official testing with psychologist {formattedIQTestPrice}
                </p>
              </div>

              {/* Right Column - Visual Stats Card */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-3xl blur-2xl"></div>

                <Card className="relative backdrop-blur-xl bg-white/10 border-2 border-white/20 shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 neural-grid opacity-10"></div>
                  <CardContent className="p-8 relative z-10">
                    {/* Top Section - Brain Icon */}
                    <div className="text-center mb-8">
                      <div className="relative inline-block">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] rounded-full blur-xl opacity-50 animate-pulse"></div>
                        <div className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] flex items-center justify-center shadow-2xl">
                          <Brain className="w-12 h-12 text-white" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-white mt-4">IQ Test Features</h3>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-5 h-5 text-[#06b6d4]" />
                          <p className="text-white/80 text-sm">Duration</p>
                        </div>
                        <p className="text-2xl font-bold text-white">60 min</p>
                      </div>

                      <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-5 h-5 text-[#10b981]" />
                          <p className="text-white/80 text-sm">Questions</p>
                        </div>
                        <p className="text-2xl font-bold text-white">40</p>
                      </div>

                      <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-5 h-5 text-[#f59e0b]" />
                          <p className="text-white/80 text-sm">Test Takers</p>
                        </div>
                        <p className="text-2xl font-bold text-white">1M+</p>
                      </div>

                      <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                        <div className="flex items-center gap-2 mb-2">
                          <BarChart3 className="w-5 h-5 text-[#ec4899]" />
                          <p className="text-white/80 text-sm">Accuracy</p>
                        </div>
                        <p className="text-2xl font-bold text-white">98%</p>
                      </div>
                    </div>

                    {/* Categories */}
                    <div className="space-y-2">
                      <p className="text-white/80 text-sm font-semibold mb-3">Test Categories:</p>
                      
                      <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/10">
                        <div className="w-2 h-2 rounded-full bg-[#06b6d4]"></div>
                        <span className="text-white/90 text-sm">Pattern Recognition</span>
                      </div>

                      <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/10">
                        <div className="w-2 h-2 rounded-full bg-[#10b981]"></div>
                        <span className="text-white/90 text-sm">Logical Reasoning</span>
                      </div>

                      <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/10">
                        <div className="w-2 h-2 rounded-full bg-[#f59e0b]"></div>
                        <span className="text-white/90 text-sm">Verbal Intelligence</span>
                      </div>

                      <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/10">
                        <div className="w-2 h-2 rounded-full bg-[#ec4899]"></div>
                        <span className="text-white/90 text-sm">Spatial Intelligence</span>
                      </div>
                    </div>

                    {/* Bottom Badge */}
                    <div className="mt-6 pt-6 border-t border-white/20 text-center">
                      <Badge className="bg-[#10b981] hover:bg-[#059669] text-white border-0 text-sm px-4 py-1.5">
                        <Shield className="w-3.5 h-3.5 mr-1.5" />
                        Scientifically Validated
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Floating Badge */}
                <div className="absolute -top-4 -right-4 z-10">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#fbbf24] rounded-full blur-xl opacity-75 animate-pulse"></div>
                    <Badge className="relative bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-white border-0 shadow-2xl px-4 py-2 text-sm font-bold">
                      OFFICIAL IQ TEST
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      {isIQOnlyMode ? (
        <HowItWorksSection
          badgeText="How It Works"
          title="Your IQ Journey Made Simple"
          subtitle="Discover your true IQ score in three easy steps"
          steps={[
            {
              number: '01',
              title: 'Sign Up and Practice',
              description: 'Create your account, pay and unlock unlimited practice tests to prepare',
              icon: Target,
              gradient: 'from-indigo-500 to-purple-500'
            },
            {
              number: '02',
              title: 'Book Your Assessment',
              description: `Schedule a verified psychologist-proctored IQ test for ${formattedIQTestPrice}`,
              icon: Brain,
              gradient: 'from-cyan-500 to-blue-500'
            },
            {
              number: '03',
              title: 'Get Your Results',
              description: 'Receive your certified score and compare yourself with history\'s greatest minds',
              icon: BarChart3,
              gradient: 'from-emerald-500 to-teal-500'
            }
          ]}
        />
      ) : (
        <HowItWorksSection />
      )}

      {/* Newsletter CTA with Glassmorphism */}
      <section className="newsletter-section-bg relative py-24 overflow-hidden">
        <div className="absolute inset-0"></div>
        <div className="absolute inset-0 neural-grid opacity-20"></div>
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl border-2 border-white/20 shadow-2xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute inset-0 neural-grid opacity-10"></div>
              <div className="text-center space-y-8 text-white dark:text-primary relative z-10">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-white dark:bg-primary rounded-full blur-2xl opacity-20 animate-pulse"></div>
                  <Globe className="w-16 h-16 mx-auto relative" />
                </div>
                <h2 className="text-3xl md:text-5xl font-bold">
                  Subscribe to our newsletter
                </h2>
                <p className="text-xl text-white/90 dark:text-primary/80 max-w-2xl mx-auto leading-relaxed">
                  {isIQOnlyMode
                    ? 'Stay updated with IQ testing tips, cognitive science insights, and exclusive offers delivered straight to your inbox.'
                    : 'Stay updated with the latest courses, learning tips, and exclusive offers delivered straight to your inbox.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="backdrop-blur-md bg-white/20 dark:bg-primary/10 border-white/30 dark:border-primary/30 text-white dark:text-primary placeholder:text-white/60 dark:placeholder:text-primary/50 focus:bg-white/30 dark:focus:bg-primary/20 h-12"
                  />
                  <Button
                    size="lg"
                    className="bg-white dark:bg-primary text-primary dark:text-primary-foreground hover:bg-white/90 dark:hover:bg-primary/90 shadow-xl whitespace-nowrap h-12 px-8"
                  >
                    Subscribe
                    <Sparkles className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA with Modern Design */}
      <section className="py-24 bg-gradient-to-b from-background to-background/95 relative overflow-hidden">
        <div className="absolute inset-0 neural-grid opacity-[0.02]"></div>
        <div className="container relative z-10">
          <Card className="relative overflow-hidden border-2 border-border bg-gradient-to-br from-card via-card to-card/95 shadow-2xl">
            <div className="absolute inset-0 neural-grid opacity-[0.03]"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-yellow-400/20 dark:from-primary/10 dark:to-yellow-400/10 rounded-full blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-yellow-400/20 to-primary/20 dark:from-yellow-400/10 dark:to-primary/10 rounded-full blur-3xl opacity-20"></div>
            <CardContent className="relative py-20 text-center space-y-8 z-10">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-primary rounded-full blur-2xl opacity-30 animate-pulse"></div>
                <Rocket className="w-16 h-16 mx-auto text-primary relative" />
              </div>
              <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/70 to-primary bg-clip-text text-transparent pb-2">
                {isIQOnlyMode ? 'Ready to Discover Your IQ?' : 'Ready to Start Learning?'}
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {isIQOnlyMode
                  ? 'Join thousands who have taken our official IQ assessment and see how you compare.'
                  : 'Join thousands of learners worldwide and start your journey to mastery today.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                {isIQOnlyMode ? (
                  <>
                    <Button
                      size="lg"
                      onClick={() => onNavigate('iq-test-overview')}
                      className="text-base px-10 h-14 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
                    >
                      <Brain className="mr-2 h-5 w-5" />
                      Start My IQ Test
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => onNavigate('genius-directory')}
                      className="text-base px-10 h-14 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-lg"
                    >
                      Explore Genius Database
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="lg"
                      onClick={() => onNavigate(user ? 'dashboard' : 'auth')}
                      className="text-base px-10 h-14 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
                    >
                      <Sparkles className="mr-2 h-5 w-5" />
                      Start Learning Now
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => onNavigate('catalog')}
                      className="text-base px-10 h-14 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-lg"
                    >
                      Browse All Courses
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}