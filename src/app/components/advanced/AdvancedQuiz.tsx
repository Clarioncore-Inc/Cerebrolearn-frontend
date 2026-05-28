import React, { useState } from 'react';
import { Clock, Check, X, Code, Image, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AdvancedQuizProps {
  quizId: string;
  quizTitle: string;
  timeLimit: number; // in minutes
}

export function AdvancedQuiz({ quizId, quizTitle, timeLimit }: AdvancedQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60); // in seconds
  const [isSubmitted, setIsSubmitted] = useState(false);

  const questions = [
    {
      id: 1,
      type: 'multiple-choice',
      question: 'What is the primary purpose of React Hooks?',
      options: [
        'To replace class components',
        'To add state and lifecycle features to functional components',
        'To improve performance',
        'To handle routing'
      ],
      correctAnswer: 1,
      points: 10
    },
    {
      id: 2,
      type: 'code',
      question: 'Complete the following React component to display a counter:',
      codeTemplate: `function Counter() {\n  const [count, setCount] = useState(0);\n  \n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={/* YOUR CODE HERE */}>\n        Increment\n      </button>\n    </div>\n  );\n}`,
      correctAnswer: '() => setCount(count + 1)',
      points: 20
    },
    {
      id: 3,
      type: 'multiple-select',
      question: 'Which of the following are valid React Hooks? (Select all that apply)',
      options: ['useState', 'useEffect', 'useContext', 'useRouter', 'useRedux'],
      correctAnswers: [0, 1, 2],
      points: 15
    },
    {
      id: 4,
      type: 'true-false',
      question: 'React components must always return JSX.',
      correctAnswer: false,
      explanation: 'Components can also return strings, numbers, null, or arrays.',
      points: 5
    },
    {
      id: 5,
      type: 'short-answer',
      question: 'Explain the difference between controlled and uncontrolled components in React.',
      correctAnswer: 'Controlled components have their state managed by React, while uncontrolled components manage their own state internally.',
      points: 20
    }
  ];

  const handleAnswerChange = (questionId: number, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    toast.success('Quiz submitted successfully!');
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q) => {
      const userAnswer = answers[q.id];
      if (q.type === 'multiple-choice' && userAnswer === q.correctAnswer) {
        score += q.points;
      } else if (q.type === 'multiple-select') {
        const correct = JSON.stringify(userAnswer?.sort()) === JSON.stringify(q.correctAnswers?.sort());
        if (correct) score += q.points;
      } else if (q.type === 'true-false' && userAnswer === q.correctAnswer) {
        score += q.points;
      }
    });
    return score;
  };

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
  const userScore = isSubmitted ? calculateScore() : 0;

  const question = questions[currentQuestion];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {!isSubmitted ? (
        <>
          {/* Header */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{quizTitle}</h1>
                <p className="text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">{Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-slate-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{question.question}</h2>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                  {question.points} points
                </span>
              </div>
            </div>

            {/* Multiple Choice */}
            {question.type === 'multiple-choice' && (
              <div className="space-y-3">
                {question.options?.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      answers[question.id] === index
                        ? 'border-[#395192] bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      checked={answers[question.id] === index}
                      onChange={() => handleAnswerChange(question.id, index)}
                      className="w-5 h-5 text-[#395192]"
                    />
                    <span className="text-gray-900">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Code Question */}
            {question.type === 'code' && (
              <div>
                <div className="bg-gray-900 rounded-lg p-4 mb-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm font-mono">
                    <code>{question.codeTemplate}</code>
                  </pre>
                </div>
                <textarea
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  placeholder="Enter your code here..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-[#395192] focus:border-transparent resize-none"
                />
              </div>
            )}

            {/* Multiple Select */}
            {question.type === 'multiple-select' && (
              <div className="space-y-3">
                {question.options?.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      answers[question.id]?.includes(index)
                        ? 'border-[#395192] bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={answers[question.id]?.includes(index) || false}
                      onChange={(e) => {
                        const current = answers[question.id] || [];
                        const updated = e.target.checked
                          ? [...current, index]
                          : current.filter((i: number) => i !== index);
                        handleAnswerChange(question.id, updated);
                      }}
                      className="w-5 h-5 text-[#395192] rounded"
                    />
                    <span className="text-gray-900">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {/* True/False */}
            {question.type === 'true-false' && (
              <div className="flex gap-4">
                <label
                  className={`flex-1 flex items-center justify-center gap-3 p-6 border-2 rounded-lg cursor-pointer transition-all ${
                    answers[question.id] === true
                      ? 'border-[#395192] bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    checked={answers[question.id] === true}
                    onChange={() => handleAnswerChange(question.id, true)}
                    className="w-5 h-5 text-[#395192]"
                  />
                  <span className="text-xl font-semibold text-gray-900">True</span>
                </label>
                <label
                  className={`flex-1 flex items-center justify-center gap-3 p-6 border-2 rounded-lg cursor-pointer transition-all ${
                    answers[question.id] === false
                      ? 'border-[#395192] bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    checked={answers[question.id] === false}
                    onChange={() => handleAnswerChange(question.id, false)}
                    className="w-5 h-5 text-[#395192]"
                  />
                  <span className="text-xl font-semibold text-gray-900">False</span>
                </label>
              </div>
            )}

            {/* Short Answer */}
            {question.type === 'short-answer' && (
              <textarea
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                placeholder="Type your answer here..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#395192] focus:border-transparent resize-none"
              />
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {currentQuestion < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                className="px-6 py-3 bg-[#395192] text-white rounded-lg hover:bg-[#2d4178]"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Submit Quiz
              </button>
            )}
          </div>
        </>
      ) : (
        /* Results */
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
            <p className="text-gray-600">Here are your results</p>
          </div>

          <div className="bg-gradient-to-br from-[#395192] to-purple-600 rounded-xl p-8 text-white text-center mb-8">
            <p className="text-xl mb-2">Your Score</p>
            <p className="text-6xl font-bold mb-2">{userScore}/{totalPoints}</p>
            <p className="text-2xl">{Math.round((userScore / totalPoints) * 100)}%</p>
          </div>

          <div className="space-y-4">
            {questions.map((q, index) => {
              const userAnswer = answers[q.id];
              const isCorrect = q.type === 'multiple-choice' 
                ? userAnswer === q.correctAnswer
                : q.type === 'true-false'
                  ? userAnswer === q.correctAnswer
                  : true; // Manual grading needed for other types

              return (
                <div key={q.id} className={`border-2 rounded-lg p-4 ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium text-gray-900">Q{index + 1}: {q.question}</p>
                    {isCorrect ? (
                      <CheckCircle
                        className="h-5 w-5 text-primary rounded"
                      />
                    ) : (
                      <X className="w-5 h-5 text-red-600 shrink-0" />
                    )}
                  </div>
                  {q.explanation && (
                    <p className="text-sm text-gray-600 mt-2">{q.explanation}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}