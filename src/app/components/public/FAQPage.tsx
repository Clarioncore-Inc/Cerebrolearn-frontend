import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  ChevronDown,
  Search,
  HelpCircle,
  BookOpen,
  CreditCard,
  Shield,
  Users,
  Award,
  MessageCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FAQPageProps {
  onNavigate: (page: string) => void;
}

export function FAQPage({ onNavigate }: FAQPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const categories = [
    {
      id: 'general',
      name: 'General',
      icon: HelpCircle,
      questions: [
        {
          id: 'what-is-cerebrolearn',
          question: 'What is CerebroLearn?',
          answer: 'CerebroLearn is an interactive learning platform that combines Brilliant-style step-by-step lessons with gamification and expert-led courses. We make learning engaging, effective, and accessible to everyone.',
        },
        {
          id: 'how-it-works',
          question: 'How does CerebroLearn work?',
          answer: 'Simply create an account, browse our course catalog, enroll in courses that interest you, and start learning! Our interactive lessons guide you step-by-step with instant feedback, hints, and progress tracking.',
        },
        {
          id: 'who-for',
          question: 'Who is CerebroLearn for?',
          answer: 'CerebroLearn is for anyone looking to learn new skills or advance their knowledge. Whether you\'re a student, professional, or lifelong learner, we have courses for all levels from beginner to advanced.',
        },
        {
          id: 'free-account',
          question: 'Do I need to create an account?',
          answer: 'Yes, you need a free account to access courses and track your progress. Creating an account is quick, free, and gives you access to our community features.',
        },
      ],
    },
    {
      id: 'courses',
      name: 'Courses',
      icon: BookOpen,
      questions: [
        {
          id: 'course-types',
          question: 'What types of courses do you offer?',
          answer: 'We offer courses in programming, data science, mathematics, business, design, languages, and more. All courses include interactive lessons, quizzes, projects, and certificates of completion.',
        },
        {
          id: 'course-levels',
          question: 'What skill levels are your courses for?',
          answer: 'We have courses for all levels - beginner, intermediate, and advanced. Each course clearly indicates its difficulty level and prerequisites.',
        },
        {
          id: 'new-courses',
          question: 'How often are new courses added?',
          answer: 'We add new courses monthly and regularly update existing content to keep it current and relevant. Pro members get early access to new releases.',
        },
        {
          id: 'course-duration',
          question: 'How long does it take to complete a course?',
          answer: 'Course length varies from a few hours to several weeks, depending on the topic and your pace. All courses are self-paced, so you can learn on your schedule.',
        },
        {
          id: 'prerequisites',
          question: 'Do courses have prerequisites?',
          answer: 'Some advanced courses may require prior knowledge. Prerequisites are clearly listed on each course page. We also recommend starting paths for beginners.',
        },
      ],
    },
    {
      id: 'pricing',
      name: 'Pricing',
      icon: CreditCard,
      questions: [
        {
          id: 'cost',
          question: 'How much does CerebroLearn cost?',
          answer: 'We offer a Free plan with access to 50+ courses, and a Pro plan at $29/month (or $290/year) with unlimited course access, certificates, and advanced features. Enterprise pricing is available for teams.',
        },
        {
          id: 'free-trial',
          question: 'Is there a free trial?',
          answer: 'Yes! Pro plan includes a 14-day free trial. No credit card required to start. You can try all premium features risk-free.',
        },
        {
          id: 'payment-methods',
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and offer invoice billing for Enterprise customers.',
        },
        {
          id: 'cancel-subscription',
          question: 'Can I cancel my subscription anytime?',
          answer: 'Yes, you can cancel anytime from your account settings. You\'ll continue to have access until the end of your billing period.',
        },
        {
          id: 'refund-policy',
          question: 'What is your refund policy?',
          answer: 'We offer a 30-day money-back guarantee. If you\'re not satisfied within the first 30 days, contact us for a full refund.',
        },
      ],
    },
    {
      id: 'account',
      name: 'Account',
      icon: Users,
      questions: [
        {
          id: 'create-account',
          question: 'How do I create an account?',
          answer: 'Click "Sign Up" and enter your email, password, and name. You can also sign up using your Google, Facebook, or GitHub account for faster registration.',
        },
        {
          id: 'reset-password',
          question: 'How do I reset my password?',
          answer: 'Click "Forgot Password" on the login page, enter your email, and we\'ll send you a reset link. Follow the instructions to create a new password.',
        },
        {
          id: 'update-profile',
          question: 'Can I update my profile information?',
          answer: 'Yes, you can update your profile, including name, email, photo, and preferences, from your account settings at any time.',
        },
        {
          id: 'delete-account',
          question: 'How do I delete my account?',
          answer: 'You can delete your account from account settings. Note that this action is permanent and will remove all your data, progress, and certificates.',
        },
        {
          id: 'multiple-devices',
          question: 'Can I use my account on multiple devices?',
          answer: 'Yes! Your account works on all devices - desktop, tablet, and mobile. Your progress syncs automatically across all devices.',
        },
      ],
    },
    {
      id: 'certificates',
      name: 'Certificates',
      icon: Award,
      questions: [
        {
          id: 'get-certificate',
          question: 'How do I earn a certificate?',
          answer: 'Complete all lessons and pass all quizzes in a course with a minimum score of 70%. Your certificate will be automatically generated and available for download.',
        },
        {
          id: 'certificate-recognized',
          question: 'Are certificates recognized?',
          answer: 'Yes, our certificates are recognized by many employers and educational institutions. They include a unique verification ID that employers can validate.',
        },
        {
          id: 'share-certificate',
          question: 'Can I share my certificate?',
          answer: 'Absolutely! You can download certificates as PDF, share them on LinkedIn, and add them to your resume. Each certificate includes a shareable verification link.',
        },
        {
          id: 'certificate-cost',
          question: 'Do certificates cost extra?',
          answer: 'Certificates are included with Pro and Enterprise plans. Free plan members can upgrade to receive certificates for completed courses.',
        },
      ],
    },
    {
      id: 'technical',
      name: 'Technical',
      icon: Shield,
      questions: [
        {
          id: 'browser-support',
          question: 'Which browsers are supported?',
          answer: 'CerebroLearn works best on the latest versions of Chrome, Firefox, Safari, and Edge. We recommend keeping your browser up to date for the best experience.',
        },
        {
          id: 'mobile-app',
          question: 'Is there a mobile app?',
          answer: 'Yes, we have mobile apps for both iOS and Android. Download them from the App Store or Google Play Store to learn on the go.',
        },
        {
          id: 'offline-access',
          question: 'Can I access courses offline?',
          answer: 'Pro members can download course materials for offline access through our mobile apps. This is perfect for learning during commutes or travel.',
        },
        {
          id: 'system-requirements',
          question: 'What are the system requirements?',
          answer: 'You need a stable internet connection, a modern browser, and for video content, we recommend at least 5 Mbps download speed.',
        },
        {
          id: 'data-security',
          question: 'Is my data secure?',
          answer: 'Yes, we use industry-standard encryption (256-bit SSL) to protect your data. We never share your personal information with third parties without consent.',
        },
      ],
    },
  ];

  const allQuestions = categories.flatMap((cat) => 
    cat.questions.map((q) => ({ ...q, category: cat.name }))
  );

  const filteredQuestions = searchQuery
    ? allQuestions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen py-20">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge className="mb-4">FAQ</Badge>
          <h1 className="text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-muted-foreground">
            Find answers to common questions about CerebroLearn
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-lg h-14"
            />
          </div>

          {/* Search Results */}
          {searchQuery && (
            <Card className="mt-4">
              <CardContent className="p-6">
                {filteredQuestions.length > 0 ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Found {filteredQuestions.length} result{filteredQuestions.length !== 1 ? 's' : ''}
                    </p>
                    {filteredQuestions.map((q) => (
                      <div key={q.id} className="border-b last:border-0 pb-4 last:pb-0">
                        <Badge variant="outline" className="mb-2">
                          {q.category}
                        </Badge>
                        <h4 className="font-semibold mb-2">{q.question}</h4>
                        <p className="text-sm text-muted-foreground">{q.answer}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground mb-4">
                      No results found for "{searchQuery}"
                    </p>
                    <Button variant="outline" onClick={() => setSearchQuery('')}>
                      Clear Search
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Categories */}
        {!searchQuery && (
          <Tabs defaultValue="general" className="max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                  <category.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-8">
                <div className="space-y-4">
                  {category.questions.map((question) => (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => toggleItem(question.id)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between gap-4">
                            <h3 className="font-semibold text-lg">{question.question}</h3>
                            <motion.div
                              animate={{ rotate: openItems.includes(question.id) ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            </motion.div>
                          </div>
                          
                          <AnimatePresence>
                            {openItems.includes(question.id) && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <p className="text-muted-foreground mt-4 leading-relaxed">
                                  {question.answer}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}

        {/* Contact CTA */}
        <div className="max-w-3xl mx-auto mt-16">
          <Card>
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Still Have Questions?</h3>
              <p className="text-muted-foreground mb-6">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" onClick={() => onNavigate('contact')}>
                  Contact Support
                </Button>
                <Button size="lg" variant="outline" onClick={() => onNavigate('about')}>
                  Learn More About Us
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto mt-12">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('pricing')}>
            <CardContent className="p-6 text-center">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">View Pricing</h4>
              <p className="text-sm text-muted-foreground">
                See our plans and pricing options
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('catalog')}>
            <CardContent className="p-6 text-center">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Browse Courses</h4>
              <p className="text-sm text-muted-foreground">
                Explore our course catalog
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('signup')}>
            <CardContent className="p-6 text-center">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Get Started</h4>
              <p className="text-sm text-muted-foreground">
                Create your free account today
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
