import { useAuth } from '../../contexts/AuthContext';
import { HowItWorksSection } from '../sections/HowItWorksSection';
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
  CheckCircle
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

  const stats = [
    { value: '50K+', label: 'Active Learners', icon: Users },
    { value: '1000+', label: 'Expert Courses', icon: BookOpen },
    { value: '100+', label: 'Top Instructors', icon: GraduationCap },
    { value: '95%', label: 'Success Rate', icon: Trophy }
  ];

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
    {
      icon: Upload,
      title: 'Create Courses',
      description: 'Upload your courses with ease using our intuitive course creation tools. Share your knowledge and expertise with thousands of eager learners worldwide.',
      image: imgCallToAction,
      action: () => onNavigate(user ? 'instructor' : 'auth')
    },
    {
      icon: FileText,
      title: 'Testing Center',
      description: 'Take free IQ Tests through Cerebrolearn in the testing center for immediate estimated IQ Scores! Schedule official IQ tests with verified psychologists.',
      image: imgOnlineTest1,
      action: () => onNavigate(user ? 'dashboard' : 'auth')
    },
    {
      icon: BarChart3,
      title: 'Rankings',
      description: 'Visit our Rankings center to see global and local leaderboards. Compete with learners worldwide and track your progress against the best.',
      image: imgExam1,
      action: () => onNavigate('leaderboard')
    },
    {
      icon: Gamepad2,
      title: 'Gaming Center',
      description: 'Visit the Cerebrolearn Gaming Center to play various intellectual games. Challenge yourself to memorize digits of Pi and more!',
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
      <div className="relative overflow-hidden bg-gradient-to-r from-primary via-secondary to-primary text-white">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.05)_25%,rgba(255,255,255,.05)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.05)_75%,rgba(255,255,255,.05))] bg-[length:60px_60px] animate-gradient"></div>
        <div className="container relative py-3 text-center text-sm">
          <p className="flex items-center justify-center gap-2 flex-wrap">
            <Sparkles className="w-4 h-4" />
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

      {/* Hero Section with Glassmorphism */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-accent to-muted">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-success/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container relative z-10 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-slide-up">
              <Badge variant="secondary" className="glass shadow-lg">
                <Sparkles className="mr-1 h-3 w-3" />
                Designed by Experts
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="gradient-text">
                  Intellect Advancement
                </span>
                <br />
                <span className="text-foreground">for Humanity's Future</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                Master new skills with interactive lessons, earn certifications, and advance your career with CerebroLearn's comprehensive learning platform.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4 pt-2">
                <Button 
                  size="lg" 
                  onClick={() => onNavigate(user ? 'dashboard' : 'auth')}
                  className="text-lg px-8 shadow-xl hover:shadow-2xl hover-lift group bg-primary"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => onNavigate('catalog')}
                  className="text-lg px-8 border-2 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Explore Courses
                </Button>
              </div>

              {/* Glassmorphic Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6">
                {stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className="glass rounded-2xl p-4 shadow-xl hover:shadow-2xl hover-lift group"
                  >
                    <stat.icon className="w-6 h-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative hidden lg:block animate-float">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-warning to-amber-400 rounded-2xl shadow-2xl rotate-12 animate-float"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-secondary to-cyan-400 rounded-full shadow-2xl animate-float animation-delay-2000"></div>
                <img 
                  src={imgImage9} 
                  alt="Learning illustration" 
                  className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section with Parallax Effect */}
      <section className="relative border-y border-[#dee7ff] bg-gradient-to-br from-white to-[#fcfcff]">
        <div className="container py-12">
          <div className="text-center space-y-2 mb-12">
            <Badge variant="outline" className="border-[#395192]/20">
              <Shield className="w-3 h-3 mr-1 text-[#395192]" />
              Trusted Worldwide
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-[#395192]">Designed by Experts!</h2>
            <p className="text-base text-[#6478be] max-w-2xl mx-auto">
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
      <section className="py-16 bg-gradient-to-b from-[#fcfcff] to-white">
        <div className="container">
          <div className="backdrop-blur-xl bg-white/80 rounded-3xl border border-[#dee7ff] shadow-2xl overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-[#395192] mb-2">
                  What brings you to CerebroLearn today?
                </h2>
                <p className="text-[#6478be]">Choose your path and start your journey</p>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {journeyCards.map((card, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-[#f7f8ff] border border-[#dee7ff] hover:border-[#395192] transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
                    onClick={card.action}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-500" style={{ background: `linear-gradient(135deg, ${card.gradient.split(' ')[0].replace('from-', '')} 0%, ${card.gradient.split(' ')[1].replace('to-', '')} 100%)` }}></div>
                    <div className="relative p-6 space-y-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                        <card.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-[#395192] group-hover:text-[#052d69] transition-colors">
                          {card.title}
                        </h3>
                        <p className="text-sm text-[#6478be] leading-relaxed">
                          {card.description}
                        </p>
                      </div>
                      <div className="flex items-center text-[#395192] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
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

      {/* All-In-One Features with Modern Cards */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#eff3ff] via-white to-[#fffefa]"></div>
        <div className="container relative z-10">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-[#395192] text-white border-0 shadow-lg">
              <Zap className="w-3 h-3 mr-1" />
              All-In-One Platform
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-[#395192]">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-[#6478be] max-w-3xl mx-auto leading-relaxed">
              CerebroLearn is an online learning platform that combines all the tools to reach your full intellectual potential.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {allInOneFeatures.map((feature, index) => (
              <Card 
                key={index} 
                className="group relative overflow-hidden border-2 border-[#dee7ff] hover:border-[#395192] transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 bg-gradient-to-br from-white to-[#fcfcff]"
              >
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" style={{ background: feature.color }}></div>
                <CardHeader className="space-y-6 relative">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" style={{ background: feature.color }}></div>
                    <div className="relative w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500" style={{ background: feature.color }}>
                      <feature.icon className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-[#395192] group-hover:text-[#052d69] transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed text-[#6478be]">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses - Modern Grid */}
      <section className="py-20 bg-gradient-to-br from-white via-[#fcfcff] to-[#f7f8ff]">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-5xl font-bold">
                <span className="text-[#395192]">Our Most </span>
                <span className="bg-gradient-to-r from-[#f7e4a7] via-[#f5df96] to-[#cebb7e] bg-clip-text text-transparent">Popular Courses</span>
              </h2>
              <p className="text-lg text-[#6478be]">
                Join Our Courses Verified By Professionals
              </p>
            </div>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => onNavigate('catalog')}
              className="group border-2 border-[#395192] text-[#395192] hover:bg-[#395192] hover:text-white shadow-lg"
            >
              Explore Courses
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularCourses.map((course, index) => (
              <Card
                key={index}
                className="group cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border-2 border-transparent hover:border-[#395192] bg-white"
                onClick={() => onNavigate('catalog')}
              >
                <div className="relative h-56 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute bottom-4 left-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <Button size="sm" className="w-full bg-white text-[#395192] hover:bg-[#395192] hover:text-white">
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
                  <h3 className="text-lg font-semibold line-clamp-2 text-[#395192] group-hover:text-[#052d69] transition-colors min-h-[3.5rem]">
                    {course.subtitle}
                  </h3>
                  
                  <div className="flex items-center justify-between text-sm text-[#6478be] pt-2 border-t border-[#dee7ff]">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-[#f7e4a7] text-[#f7e4a7]" />
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

      {/* Platform Features - Alternating Layout */}
      <section className="py-20 bg-gradient-to-b from-[#f7f8ff] to-white">
        <div className="container">
          <div className="text-center mb-16 space-y-4">
            <Badge className="bg-[#395192] text-white border-0 shadow-lg">
              <Zap className="w-3 h-3 mr-1" />
              Platform Features
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-[#395192]">
              Everything You Need in One Platform
            </h2>
            <p className="text-lg text-[#6478be] max-w-3xl mx-auto">
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
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#395192] to-[#6478be] text-white shadow-lg">
                      <feature.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-[#395192]">
                      {feature.title}
                    </h3>
                    <p className="text-lg text-[#6478be] leading-relaxed">
                      {feature.description}
                    </p>
                    <Button
                      size="lg"
                      onClick={feature.action}
                      className="bg-[#395192] hover:bg-[#052d69] text-white shadow-lg group"
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
                        <img
                          src={feature.image}
                          alt={feature.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#395192]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute -z-10 top-8 right-8 w-32 h-32 bg-[#395192]/10 rounded-full blur-3xl"></div>
                    <div className="absolute -z-10 bottom-8 left-8 w-40 h-40 bg-secondary/10 rounded-full blur-3xl"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-br from-[#eff3ff] via-white to-[#fcfcff]">
        <div className="container">
          <div className="text-center mb-16 space-y-4">
            <Badge variant="outline" className="border-[#395192]/20">
              <Shield className="w-3 h-3 mr-1 text-[#395192]" />
              Why Choose CerebroLearn
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-[#395192]">
              The Best Learning Experience
            </h2>
            <p className="text-lg text-[#6478be] max-w-3xl mx-auto">
              Join thousands of successful learners who have transformed their careers with CerebroLearn
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((item, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-2 border-[#dee7ff] hover:border-[#395192] transition-all duration-500 hover:shadow-xl hover:-translate-y-2 bg-white"
              >
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" style={{ background: item.color }}></div>
                <CardHeader className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" style={{ background: item.color }}></div>
                    <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500" style={{ background: item.color }}>
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-xl text-[#395192] group-hover:text-[#052d69] transition-colors">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed text-[#6478be]">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Newsletter CTA with Glassmorphism */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#395192] via-[#6478be] to-[#8ca1eb]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.02)_25%,rgba(255,255,255,.02)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.02)_75%,rgba(255,255,255,.02))] bg-[length:60px_60px]"></div>
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 md:p-12">
              <div className="text-center space-y-8 text-white">
                <Globe className="w-16 h-16 mx-auto opacity-80" />
                <h2 className="text-3xl md:text-5xl font-bold">
                  Subscribe to our newsletter
                </h2>
                <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                  Stay updated with the latest courses, learning tips, and exclusive offers delivered straight to your inbox.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <Input 
                    type="email" 
                    placeholder="Enter your email"
                    className="backdrop-blur-md bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30 h-12"
                  />
                  <Button 
                    size="lg"
                    className="bg-white text-[#395192] hover:bg-white/90 shadow-xl whitespace-nowrap h-12 px-8"
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
      <section className="py-24 bg-gradient-to-b from-[#fcfcff] to-white">
        <div className="container">
          <Card className="relative overflow-hidden border-2 border-[#dee7ff] bg-gradient-to-br from-white via-[#f7f8ff] to-[#eff3ff] shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#bdcdff] to-[#f7e4a7] rounded-full blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#f5df96] to-[#8ca1eb] rounded-full blur-3xl opacity-20"></div>
            <CardContent className="relative py-20 text-center space-y-8">
              <Rocket className="w-16 h-16 mx-auto text-[#395192]" />
              <h2 className="text-3xl md:text-5xl font-bold text-[#395192]">
                Ready to Start Learning?
              </h2>
              <p className="text-xl text-[#6478be] max-w-2xl mx-auto leading-relaxed">
                Join thousands of learners worldwide and start your journey to mastery today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button 
                  size="lg"
                  onClick={() => onNavigate(user ? 'dashboard' : 'auth')}
                  className="text-base px-10 h-14 bg-[#395192] hover:bg-[#052d69] shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start Learning Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => onNavigate('catalog')}
                  className="text-base px-10 h-14 border-2 border-[#395192] text-[#395192] hover:bg-[#395192] hover:text-white shadow-lg"
                >
                  Browse All Courses
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}