import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import {
  Save,
  Plus,
  Trash2,
  GripVertical,
  CheckSquare,
  Circle,
  List,
  Type,
  Image as ImageIcon,
  Video,
  ArrowUpDown,
  Link,
  ChevronDown,
  ChevronUp,
  Copy,
  Eye,
  Calculator,
  Lightbulb,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'multi-select' | 'numerical' | 'short-answer' | 'drag-drop' | 'matching' | 'step-by-step';
  question: string;
  image?: string;
  video?: string;
  options?: string[];
  correctAnswer?: number | number[] | string;
  hints: string[];
  explanation: string;
  points: number;
  order: number;
}

interface QuizEditorProps {
  quiz?: any;
  onSave: (quiz: any) => void;
  onCancel: () => void;
}

export function QuizEditor({ quiz, onSave, onCancel }: QuizEditorProps) {
  const [title, setTitle] = useState(quiz?.title || 'New Quiz');
  const [description, setDescription] = useState(quiz?.description || '');
  const [timeLimit, setTimeLimit] = useState(quiz?.timeLimit || 30);
  const [passingScore, setPassingScore] = useState(quiz?.passingScore || 70);
  const [showPreview, setShowPreview] = useState(false);

  const [questions, setQuestions] = useState<QuizQuestion[]>(quiz?.questions || [
    {
      id: '1',
      type: 'multiple-choice',
      question: 'Sample question?',
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
      correctAnswer: 0,
      hints: [],
      explanation: '',
      points: 10,
      order: 1
    }
  ]);

  const addQuestion = (type: QuizQuestion['type']) => {
    const newQuestion: QuizQuestion = {
      id: Date.now().toString(),
      type,
      question: 'New question',
      options: type === 'multiple-choice' || type === 'multi-select' || type === 'matching' ? ['Option 1', 'Option 2', 'Option 3', 'Option 4'] : undefined,
      correctAnswer: type === 'multiple-choice' ? 0 : type === 'multi-select' ? [0] : '',
      hints: [],
      explanation: '',
      points: 10,
      order: questions.length + 1
    };
    setQuestions([...questions, newQuestion]);
    toast.success('Question added');
  };

  const updateQuestion = (id: string, updates: Partial<QuizQuestion>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const deleteQuestion = (id: string) => {
    if (!confirm('Delete this question?')) return;
    setQuestions(questions.filter(q => q.id !== id));
    toast.success('Question deleted');
  };

  const duplicateQuestion = (id: string) => {
    const question = questions.find(q => q.id === id);
    if (!question) return;

    const newQuestion: QuizQuestion = {
      ...question,
      id: Date.now().toString(),
      order: questions.length + 1
    };
    setQuestions([...questions, newQuestion]);
    toast.success('Question duplicated');
  };

  const moveQuestion = (id: string, direction: 'up' | 'down') => {
    const index = questions.findIndex(q => q.id === id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === questions.length - 1) return;

    const newQuestions = [...questions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newQuestions[index], newQuestions[targetIndex]] = [newQuestions[targetIndex], newQuestions[index]];
    
    setQuestions(newQuestions.map((q, i) => ({ ...q, order: i + 1 })));
  };

  const addHint = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;
    updateQuestion(questionId, { hints: [...question.hints, 'New hint'] });
  };

  const updateHint = (questionId: string, hintIndex: number, value: string) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;
    const newHints = [...question.hints];
    newHints[hintIndex] = value;
    updateQuestion(questionId, { hints: newHints });
  };

  const deleteHint = (questionId: string, hintIndex: number) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;
    updateQuestion(questionId, { hints: question.hints.filter((_, i) => i !== hintIndex) });
  };

  const handleSave = () => {
    const quizData = {
      id: quiz?.id || Date.now().toString(),
      title,
      description,
      timeLimit,
      passingScore,
      questions,
      totalPoints: questions.reduce((sum, q) => sum + q.points, 0),
      updatedAt: new Date().toISOString()
    };
    onSave(quizData);
    toast.success('Quiz saved successfully!');
  };

  const getQuestionIcon = (type: QuizQuestion['type']) => {
    switch (type) {
      case 'multiple-choice': return <Circle className="w-4 h-4" />;
      case 'multi-select': return <CheckSquare className="w-4 h-4" />;
      case 'numerical': return <Calculator className="w-4 h-4" />;
      case 'short-answer': return <Type className="w-4 h-4" />;
      case 'drag-drop': return <ArrowUpDown className="w-4 h-4" />;
      case 'matching': return <Link className="w-4 h-4" />;
      case 'step-by-step': return <List className="w-4 h-4" />;
      default: return <CheckSquare className="w-4 h-4" />;
    }
  };

  const renderQuestionEditor = (question: QuizQuestion) => {
    return (
      <div className="space-y-4">
        {/* Question Text */}
        <div>
          <label className="text-sm font-medium mb-2 block">Question</label>
          <Textarea
            value={question.question}
            onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
            rows={3}
            placeholder="Enter your question"
          />
        </div>

        {/* Media Upload */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" size="sm">
            <ImageIcon className="mr-2 h-4 w-4" />
            Add Image
          </Button>
          <Button variant="outline" size="sm">
            <Video className="mr-2 h-4 w-4" />
            Add Video
          </Button>
        </div>

        {/* Options based on question type */}
        {(question.type === 'multiple-choice' || question.type === 'multi-select' || question.type === 'matching') && question.options && (
          <div className="space-y-3">
            <label className="text-sm font-medium block">Answer Options</label>
            {question.options.map((option, index) => (
              <div key={index} className="flex gap-2">
                {question.type === 'multiple-choice' && (
                  <input
                    type="radio"
                    checked={question.correctAnswer === index}
                    onChange={() => updateQuestion(question.id, { correctAnswer: index })}
                    className="mt-3"
                  />
                )}
                {question.type === 'multi-select' && (
                  <input
                    type="checkbox"
                    checked={Array.isArray(question.correctAnswer) && question.correctAnswer.includes(index)}
                    onChange={(e) => {
                      const current = (question.correctAnswer as number[]) || [];
                      const updated = e.target.checked
                        ? [...current, index]
                        : current.filter(i => i !== index);
                      updateQuestion(question.id, { correctAnswer: updated });
                    }}
                    className="mt-3"
                  />
                )}
                <Input
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...question.options!];
                    newOptions[index] = e.target.value;
                    updateQuestion(question.id, { options: newOptions });
                  }}
                  placeholder={`Option ${index + 1}`}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newOptions = question.options!.filter((_, i) => i !== index);
                    updateQuestion(question.id, { options: newOptions });
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newOptions = [...(question.options || []), `Option ${question.options!.length + 1}`];
                updateQuestion(question.id, { options: newOptions });
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Option
            </Button>
          </div>
        )}

        {question.type === 'numerical' && (
          <div>
            <label className="text-sm font-medium mb-2 block">Correct Answer</label>
            <Input
              type="number"
              value={question.correctAnswer as string}
              onChange={(e) => updateQuestion(question.id, { correctAnswer: e.target.value })}
              placeholder="Enter numerical answer"
            />
          </div>
        )}

        {question.type === 'short-answer' && (
          <div>
            <label className="text-sm font-medium mb-2 block">Correct Answer</label>
            <Input
              value={question.correctAnswer as string}
              onChange={(e) => updateQuestion(question.id, { correctAnswer: e.target.value })}
              placeholder="Enter correct answer"
            />
          </div>
        )}

        {question.type === 'drag-drop' && (
          <div className="p-8 border-2 border-dashed rounded-lg text-center">
            <ArrowUpDown className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Configure drag-and-drop items</p>
          </div>
        )}

        {question.type === 'step-by-step' && (
          <div className="p-8 border-2 border-dashed rounded-lg text-center">
            <List className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Configure step-by-step problem</p>
            <p className="text-xs text-muted-foreground mt-1">Brilliant-style interactive solving</p>
          </div>
        )}

        {/* Hints */}
        <div className="space-y-3">
          <label className="text-sm font-medium block">Hints (Optional)</label>
          {question.hints.map((hint, index) => (
            <div key={index} className="flex gap-2 items-start">
              <Lightbulb className="w-5 h-5 text-yellow-500 mt-2 flex-shrink-0" />
              <Input
                value={hint}
                onChange={(e) => updateHint(question.id, index, e.target.value)}
                placeholder={`Hint ${index + 1}`}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteHint(question.id, index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => addHint(question.id)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Hint
          </Button>
        </div>

        {/* Explanation */}
        <div>
          <label className="text-sm font-medium mb-2 block">Explanation (Shown after submission)</label>
          <Textarea
            value={question.explanation}
            onChange={(e) => updateQuestion(question.id, { explanation: e.target.value })}
            rows={3}
            placeholder="Explain the correct answer"
          />
        </div>

        {/* Points */}
        <div>
          <label className="text-sm font-medium mb-2 block">Points Value</label>
          <Input
            type="number"
            value={question.points}
            onChange={(e) => updateQuestion(question.id, { points: parseInt(e.target.value) || 0 })}
            min={1}
          />
        </div>
      </div>
    );
  };

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-accent/30 to-background">
        <div className="container py-8 max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-extrabold">Preview Mode</h1>
            <Button onClick={() => setShowPreview(false)}>
              Exit Preview
            </Button>
          </div>

          <Card>
            <CardHeader className="text-center space-y-3">
              <CardTitle className="text-3xl">{title}</CardTitle>
              <p className="text-muted-foreground">{description}</p>
              <div className="flex items-center justify-center gap-6 text-sm">
                <span>{questions.length} Questions</span>
                <span>•</span>
                <span>{totalPoints} Total Points</span>
                <span>•</span>
                <span>{timeLimit} Minutes</span>
                <span>•</span>
                <span>Pass: {passingScore}%</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {questions.map((question, qIndex) => (
                <div key={question.id} className="p-6 border-2 rounded-lg">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold">
                      Question {qIndex + 1}: {question.question}
                    </h3>
                    <Badge>{question.points} pts</Badge>
                  </div>

                  {(question.type === 'multiple-choice' || question.type === 'multi-select') && question.options && (
                    <div className="space-y-2">
                      {question.options.map((option, index) => (
                        <div key={index} className="p-3 border-2 rounded-lg cursor-pointer hover:bg-accent">
                          {option}
                        </div>
                      ))}
                    </div>
                  )}

                  {question.type === 'numerical' && (
                    <Input type="number" placeholder="Enter your answer" />
                  )}

                  {question.type === 'short-answer' && (
                    <Textarea placeholder="Enter your answer" rows={4} />
                  )}

                  {question.hints.length > 0 && (
                    <Button variant="outline" size="sm" className="mt-4">
                      <Lightbulb className="mr-2 h-4 w-4" />
                      Show Hint
                    </Button>
                  )}
                </div>
              ))}

              <Button className="w-full" size="lg">
                Submit Quiz
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-accent/30 to-background">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onCancel}>
              ← Back
            </Button>
            <div>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-bold border-0 bg-transparent"
                placeholder="Quiz Title"
              />
              <div className="flex items-center gap-3 mt-2">
                <Badge variant="secondary">{questions.length} questions</Badge>
                <Badge variant="secondary">{totalPoints} points</Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowPreview(true)}>
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button onClick={handleSave} className="bg-primary">
              <Save className="mr-2 h-4 w-4" />
              Save Quiz
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Questions List */}
          <div className="lg:col-span-8 space-y-4">
            {/* Quiz Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Quiz Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    placeholder="Brief description of the quiz"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Time Limit (minutes)</label>
                    <Input
                      type="number"
                      value={timeLimit}
                      onChange={(e) => setTimeLimit(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Passing Score (%)</label>
                    <Input
                      type="number"
                      value={passingScore}
                      onChange={(e) => setPassingScore(parseInt(e.target.value) || 0)}
                      min={0}
                      max={100}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Questions */}
            {questions.map((question, index) => (
              <Card key={question.id} className="group">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GripVertical className="w-5 h-5 text-muted-foreground cursor-move" />
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        question.type === 'multiple-choice' ? 'bg-blue-500/10 text-blue-500' :
                        question.type === 'multi-select' ? 'bg-purple-500/10 text-purple-500' :
                        'bg-green-500/10 text-green-500'
                      }`}>
                        {getQuestionIcon(question.type)}
                      </div>
                      <div>
                        <p className="font-semibold">Question {index + 1}</p>
                        <p className="text-sm text-muted-foreground capitalize">{question.type.replace('-', ' ')}</p>
                      </div>
                      <Badge variant="secondary">{question.points} pts</Badge>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" onClick={() => moveQuestion(question.id, 'up')}>
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => moveQuestion(question.id, 'down')}>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => duplicateQuestion(question.id)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteQuestion(question.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {renderQuestionEditor(question)}
                </CardContent>
              </Card>
            ))}

            {/* Add Question */}
            <Card className="border-2 border-dashed">
              <CardContent className="p-6">
                <p className="text-sm font-medium mb-4">Add Question Type:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Button variant="outline" size="sm" onClick={() => addQuestion('multiple-choice')}>
                    <Circle className="mr-2 h-4 w-4" />
                    Multiple Choice
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => addQuestion('multi-select')}>
                    <CheckSquare className="mr-2 h-4 w-4" />
                    Multi-Select
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => addQuestion('numerical')}>
                    <Calculator className="mr-2 h-4 w-4" />
                    Numerical
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => addQuestion('short-answer')}>
                    <Type className="mr-2 h-4 w-4" />
                    Short Answer
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => addQuestion('drag-drop')}>
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    Drag & Drop
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => addQuestion('matching')}>
                    <Link className="mr-2 h-4 w-4" />
                    Matching
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => addQuestion('step-by-step')}>
                    <List className="mr-2 h-4 w-4" />
                    Step-by-Step
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quiz Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Questions</span>
                  <span className="font-bold">{questions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Points</span>
                  <span className="font-bold">{totalPoints}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Time Limit</span>
                  <span className="font-bold">{timeLimit} min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Passing Score</span>
                  <span className="font-bold">{passingScore}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Question Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {['multiple-choice', 'multi-select', 'numerical', 'short-answer'].map(type => {
                  const count = questions.filter(q => q.type === type).length;
                  if (count === 0) return null;
                  return (
                    <div key={type} className="flex items-center justify-between text-sm">
                      <span className="capitalize">{type.replace('-', ' ')}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Best Practices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <p>Add hints to help students learn</p>
                </div>
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <p>Provide detailed explanations</p>
                </div>
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <p>Mix different question types</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}