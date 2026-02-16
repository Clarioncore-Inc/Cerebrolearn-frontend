import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Save,
  Eye,
  Plus,
  Trash2,
  GripVertical,
  Type,
  Image as ImageIcon,
  Video,
  Code,
  ListOrdered,
  CheckSquare,
  AlertCircle,
  Lightbulb,
  Play,
  Upload,
  Link2,
  Heading1,
  Heading2,
  Bold,
  Italic,
  List,
  Quote,
  Puzzle,
  Calculator,
  ChevronDown,
  ChevronUp,
  Copy,
  Settings,
  FileText,
  Sparkles,
  Wand2,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface ContentBlock {
  id: string;
  type: 'text' | 'heading' | 'image' | 'video' | 'code' | 'quiz' | 'interactive' | 'hint' | 'callout' | 'problem';
  content: any;
  order: number;
}

interface LessonEditorProps {
  lesson?: any;
  course?: any;
  onSave: (lesson: any) => void;
  onCancel: () => void;
}

export function LessonEditor({ lesson, course, onSave, onCancel }: LessonEditorProps) {
  const [title, setTitle] = useState(lesson?.title || 'New Lesson');
  const [lessonType, setLessonType] = useState(lesson?.type || 'text');
  const [activeView, setActiveView] = useState<'edit' | 'preview'>('edit');
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [aiPrompt, setAIPrompt] = useState('');
  const [aiGenerating, setAIGenerating] = useState(false);
  
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>(lesson?.content || [
    {
      id: '1',
      type: 'heading',
      content: { text: 'Introduction', level: 1 },
      order: 1
    },
    {
      id: '2',
      type: 'text',
      content: { text: 'Start writing your lesson content here...' },
      order: 2
    }
  ]);

  const addBlock = (type: ContentBlock['type']) => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      order: contentBlocks.length + 1,
      content: getDefaultContent(type)
    };
    setContentBlocks([...contentBlocks, newBlock]);
    toast.success(`${type} block added`);
  };

  const getDefaultContent = (type: ContentBlock['type']) => {
    switch (type) {
      case 'heading':
        return { text: 'New Heading', level: 2 };
      case 'text':
        return { text: '' };
      case 'image':
        return { url: '', alt: '', caption: '' };
      case 'video':
        return { url: '', title: '' };
      case 'code':
        return { code: '// Write your code here', language: 'javascript' };
      case 'quiz':
        return {
          question: 'Question text',
          options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
          correctAnswer: 0,
          explanation: ''
        };
      case 'interactive':
        return {
          type: 'slider',
          question: 'Interactive problem',
          parameters: {}
        };
      case 'hint':
        return { text: 'Hint text' };
      case 'callout':
        return { text: 'Important note', type: 'info' };
      case 'problem':
        return {
          question: 'Problem statement',
          steps: ['Step 1', 'Step 2'],
          solution: '',
          hints: []
        };
      default:
        return {};
    }
  };

  const updateBlock = (id: string, content: any) => {
    setContentBlocks(contentBlocks.map(block =>
      block.id === id ? { ...block, content } : block
    ));
  };

  const deleteBlock = (id: string) => {
    setContentBlocks(contentBlocks.filter(block => block.id !== id));
    toast.success('Block deleted');
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = contentBlocks.findIndex(b => b.id === id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === contentBlocks.length - 1) return;

    const newBlocks = [...contentBlocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    
    setContentBlocks(newBlocks.map((block, i) => ({ ...block, order: i + 1 })));
  };

  const duplicateBlock = (id: string) => {
    const block = contentBlocks.find(b => b.id === id);
    if (!block) return;

    const newBlock: ContentBlock = {
      ...block,
      id: Date.now().toString(),
      order: contentBlocks.length + 1
    };
    setContentBlocks([...contentBlocks, newBlock]);
    toast.success('Block duplicated');
  };

  const handleSave = () => {
    const lessonData = {
      id: lesson?.id || Date.now().toString(),
      title,
      type: lessonType,
      content: contentBlocks,
      updatedAt: new Date().toISOString()
    };
    onSave(lessonData);
    toast.success('Lesson saved successfully!');
  };

  const handleAIGenerateBlock = async (blockType: ContentBlock['type'], prompt?: string) => {
    setAIGenerating(true);

    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 1500));

    let aiContent;
    
    switch (blockType) {
      case 'interactive':
        const interactiveTypes = [
          {
            type: 'slider',
            question: prompt || 'Adjust the values to explore the concept',
            parameters: {
              min: 0, max: 100, step: 1, initialValue: 50,
              label: 'Value', description: 'Interactive exploration',
              visualization: 'graph'
            }
          },
          {
            type: 'graph',
            question: prompt || 'Interactive graph visualization',
            parameters: {
              equation: 'y = x^2', xRange: [-10, 10], yRange: [-10, 100],
              gridEnabled: true, interactive: true
            }
          }
        ];
        aiContent = interactiveTypes[Math.floor(Math.random() * interactiveTypes.length)];
        break;

      case 'quiz':
        aiContent = {
          question: prompt || 'What is the correct answer to this question?',
          options: [
            'AI-generated option A',
            'AI-generated option B', 
            'AI-generated option C',
            'AI-generated option D'
          ],
          correctAnswer: 0,
          explanation: 'AI-generated explanation based on the lesson context.'
        };
        break;

      case 'text':
        aiContent = {
          text: prompt 
            ? `AI-generated content about: ${prompt}\n\nThis is a detailed explanation that would be generated based on your prompt and the lesson context.`
            : 'AI-generated text content that explains the concept in detail, with examples and clear explanations.'
        };
        break;

      case 'code':
        aiContent = {
          code: prompt 
            ? `// AI-generated code for: ${prompt}\nfunction example() {\n  // Implementation here\n  return true;\n}`
            : '// AI-generated code example\nfunction example() {\n  console.log("Hello World");\n}',
          language: 'javascript'
        };
        break;

      case 'problem':
        aiContent = {
          question: prompt || 'AI-generated problem statement',
          steps: ['Step 1: AI-generated approach', 'Step 2: Apply the method', 'Step 3: Verify the solution'],
          solution: 'AI-generated detailed solution',
          hints: []
        };
        break;

      default:
        aiContent = getDefaultContent(blockType);
    }

    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type: blockType,
      order: contentBlocks.length + 1,
      content: aiContent
    };

    setContentBlocks([...contentBlocks, newBlock]);
    setAIGenerating(false);
    setShowAIGenerator(false);
    setAIPrompt('');
    toast.success(`${blockType} generated with AI! 🎉`);
  };

  const handleEnhanceBlockWithAI = async (blockId: string) => {
    const block = contentBlocks.find(b => b.id === blockId);
    if (!block) return;

    toast.info('Enhancing with AI...');
    
    // Simulate AI enhancement
    await new Promise(resolve => setTimeout(resolve, 1500));

    let enhancedContent = { ...block.content };

    switch (block.type) {
      case 'text':
        enhancedContent.text = block.content.text + '\n\n✨ AI Enhancement: Additional context and examples added to make this concept clearer for students.';
        break;
      case 'quiz':
        enhancedContent.explanation = (block.content.explanation || '') + ' AI has added more detailed reasoning to help students understand.';
        break;
      case 'code':
        enhancedContent.code = block.content.code + '\n\n// AI-added: Additional examples and edge cases';
        break;
      default:
        break;
    }

    updateBlock(blockId, enhancedContent);
    toast.success('Block enhanced with AI! ✨');
  };

  const renderBlockEditor = (block: ContentBlock) => {
    switch (block.type) {
      case 'heading':
        return (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Button
                variant={block.content.level === 1 ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateBlock(block.id, { ...block.content, level: 1 })}
              >
                H1
              </Button>
              <Button
                variant={block.content.level === 2 ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateBlock(block.id, { ...block.content, level: 2 })}
              >
                H2
              </Button>
              <Button
                variant={block.content.level === 3 ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateBlock(block.id, { ...block.content, level: 3 })}
              >
                H3
              </Button>
            </div>
            <Input
              value={block.content.text}
              onChange={(e) => updateBlock(block.id, { ...block.content, text: e.target.value })}
              className="text-xl font-bold"
              placeholder="Heading text"
            />
          </div>
        );

      case 'text':
        return (
          <Textarea
            value={block.content.text}
            onChange={(e) => updateBlock(block.id, { ...block.content, text: e.target.value })}
            rows={6}
            placeholder="Write your content here..."
          />
        );

      case 'image':
        return (
          <div className="space-y-3">
            <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-accent transition-colors cursor-pointer">
              <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
            </div>
            <Input
              placeholder="Image URL (optional)"
              value={block.content.url}
              onChange={(e) => updateBlock(block.id, { ...block.content, url: e.target.value })}
            />
            <Input
              placeholder="Caption"
              value={block.content.caption}
              onChange={(e) => updateBlock(block.id, { ...block.content, caption: e.target.value })}
            />
          </div>
        );

      case 'video':
        return (
          <div className="space-y-3">
            <Input
              placeholder="YouTube/Vimeo URL or upload"
              value={block.content.url}
              onChange={(e) => updateBlock(block.id, { ...block.content, url: e.target.value })}
            />
            <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-accent transition-colors cursor-pointer">
              <Video className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Or upload video file</p>
            </div>
          </div>
        );

      case 'code':
        return (
          <div className="space-y-3">
            <div className="flex gap-2">
              <select
                value={block.content.language}
                onChange={(e) => updateBlock(block.id, { ...block.content, language: e.target.value })}
                className="px-3 py-2 rounded-md border bg-background"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
              </select>
            </div>
            <Textarea
              value={block.content.code}
              onChange={(e) => updateBlock(block.id, { ...block.content, code: e.target.value })}
              rows={10}
              className="font-mono text-sm"
              placeholder="// Write your code here"
            />
          </div>
        );

      case 'quiz':
        return (
          <div className="space-y-4">
            <Input
              placeholder="Question"
              value={block.content.question}
              onChange={(e) => updateBlock(block.id, { ...block.content, question: e.target.value })}
            />
            <div className="space-y-2">
              {block.content.options.map((option: string, index: number) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="radio"
                    checked={block.content.correctAnswer === index}
                    onChange={() => updateBlock(block.id, { ...block.content, correctAnswer: index })}
                    className="mt-1"
                  />
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...block.content.options];
                      newOptions[index] = e.target.value;
                      updateBlock(block.id, { ...block.content, options: newOptions });
                    }}
                    placeholder={`Option ${index + 1}`}
                  />
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateBlock(block.id, {
                ...block.content,
                options: [...block.content.options, `Option ${block.content.options.length + 1}`]
              })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Option
            </Button>
            <Textarea
              placeholder="Explanation (shown after answer)"
              value={block.content.explanation}
              onChange={(e) => updateBlock(block.id, { ...block.content, explanation: e.target.value })}
              rows={3}
            />
          </div>
        );

      case 'interactive':
        return (
          <div className="space-y-4">
            <Input
              placeholder="Interactive problem question"
              value={block.content.question}
              onChange={(e) => updateBlock(block.id, { ...block.content, question: e.target.value })}
            />
            <div className="p-8 border-2 border-dashed rounded-lg text-center">
              <Puzzle className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Interactive element configuration</p>
              <p className="text-xs text-muted-foreground mt-1">Configure sliders, graphs, or other interactive components</p>
            </div>
          </div>
        );

      case 'hint':
        return (
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <Textarea
                value={block.content.text}
                onChange={(e) => updateBlock(block.id, { ...block.content, text: e.target.value })}
                rows={3}
                className="bg-transparent border-0"
                placeholder="Hint text"
              />
            </div>
          </div>
        );

      case 'callout':
        return (
          <div className="space-y-3">
            <select
              value={block.content.type}
              onChange={(e) => updateBlock(block.id, { ...block.content, type: e.target.value })}
              className="px-3 py-2 rounded-md border bg-background"
            >
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="success">Success</option>
              <option value="error">Error</option>
            </select>
            <div className={`p-4 border-l-4 rounded ${
              block.content.type === 'info' ? 'bg-blue-50 border-blue-400' :
              block.content.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
              block.content.type === 'success' ? 'bg-green-50 border-green-400' :
              'bg-red-50 border-red-400'
            }`}>
              <Textarea
                value={block.content.text}
                onChange={(e) => updateBlock(block.id, { ...block.content, text: e.target.value })}
                rows={3}
                className="bg-transparent border-0"
                placeholder="Callout text"
              />
            </div>
          </div>
        );

      case 'problem':
        return (
          <div className="space-y-4">
            <Input
              placeholder="Problem statement"
              value={block.content.question}
              onChange={(e) => updateBlock(block.id, { ...block.content, question: e.target.value })}
            />
            <div className="space-y-2">
              <label className="text-sm font-medium">Solution Steps:</label>
              {block.content.steps.map((step: string, index: number) => (
                <Input
                  key={index}
                  value={step}
                  onChange={(e) => {
                    const newSteps = [...block.content.steps];
                    newSteps[index] = e.target.value;
                    updateBlock(block.id, { ...block.content, steps: newSteps });
                  }}
                  placeholder={`Step ${index + 1}`}
                />
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateBlock(block.id, {
                  ...block.content,
                  steps: [...block.content.steps, `Step ${block.content.steps.length + 1}`]
                })}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Step
              </Button>
            </div>
            <Textarea
              placeholder="Final solution"
              value={block.content.solution}
              onChange={(e) => updateBlock(block.id, { ...block.content, solution: e.target.value })}
              rows={4}
            />
          </div>
        );

      default:
        return <p className="text-muted-foreground">Unknown block type</p>;
    }
  };

  const renderBlockPreview = (block: ContentBlock) => {
    switch (block.type) {
      case 'heading':
        const HeadingTag = `h${block.content.level}` as keyof JSX.IntrinsicElements;
        return React.createElement(HeadingTag, { className: 'font-bold' }, block.content.text);
      
      case 'text':
        return <p className="whitespace-pre-wrap">{block.content.text}</p>;
      
      case 'image':
        return block.content.url ? (
          <div>
            <img src={block.content.url} alt={block.content.alt} className="rounded-lg w-full" />
            {block.content.caption && <p className="text-sm text-center text-muted-foreground mt-2">{block.content.caption}</p>}
          </div>
        ) : (
          <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
            <ImageIcon className="w-12 h-12 mx-auto mb-2" />
            <p>Image placeholder</p>
          </div>
        );
      
      case 'video':
        return block.content.url ? (
          <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
            <Play className="w-16 h-16 text-white" />
          </div>
        ) : (
          <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground aspect-video flex flex-col items-center justify-center">
            <Video className="w-12 h-12 mb-2" />
            <p>Video placeholder</p>
          </div>
        );
      
      case 'code':
        return (
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <div className="flex items-center justify-between mb-2 text-gray-400 text-xs">
              <span>{block.content.language}</span>
              <Copy className="w-4 h-4 cursor-pointer hover:text-gray-200" />
            </div>
            <pre>{block.content.code}</pre>
          </div>
        );
      
      case 'quiz':
        return (
          <Card>
            <CardContent className="p-6 space-y-4">
              <p className="font-semibold">{block.content.question}</p>
              <div className="space-y-2">
                {block.content.options.map((option: string, index: number) => (
                  <div
                    key={index}
                    className={`p-3 border-2 rounded-lg cursor-pointer hover:bg-accent ${
                      index === block.content.correctAnswer ? 'border-green-500 bg-green-50' : ''
                    }`}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      
      case 'hint':
        return (
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <p className="text-sm">{block.content.text}</p>
          </div>
        );
      
      case 'callout':
        return (
          <div className={`p-4 border-l-4 rounded flex items-start gap-3 ${
            block.content.type === 'info' ? 'bg-blue-50 border-blue-400' :
            block.content.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
            block.content.type === 'success' ? 'bg-green-50 border-green-400' :
            'bg-red-50 border-red-400'
          }`}>
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{block.content.text}</p>
          </div>
        );
      
      default:
        return <p className="text-muted-foreground">Preview not available</p>;
    }
  };

  const getBlockIcon = (type: ContentBlock['type']) => {
    switch (type) {
      case 'heading': return <Heading1 className="w-4 h-4" />;
      case 'text': return <Type className="w-4 h-4" />;
      case 'image': return <ImageIcon className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'code': return <Code className="w-4 h-4" />;
      case 'quiz': return <CheckSquare className="w-4 h-4" />;
      case 'interactive': return <Puzzle className="w-4 h-4" />;
      case 'hint': return <Lightbulb className="w-4 h-4" />;
      case 'callout': return <AlertCircle className="w-4 h-4" />;
      case 'problem': return <Calculator className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Please describe what interactive element you want to create');
      return;
    }

    await handleAIGenerateBlock('interactive', aiPrompt);
  };

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
                placeholder="Lesson Title"
              />
              <div className="flex items-center gap-3 mt-2">
                <select
                  value={lessonType}
                  onChange={(e) => setLessonType(e.target.value)}
                  className="px-3 py-1 rounded-md border bg-background text-sm"
                >
                  <option value="video">Video Lesson</option>
                  <option value="text">Text Lesson</option>
                  <option value="quiz">Quiz</option>
                  <option value="interactive">Interactive</option>
                  <option value="problem">Problem Set</option>
                </select>
                <Badge variant="secondary">{contentBlocks.length} blocks</Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setActiveView(activeView === 'edit' ? 'preview' : 'edit')}
            >
              <Eye className="mr-2 h-4 w-4" />
              {activeView === 'edit' ? 'Preview' : 'Edit'}
            </Button>
            <Button onClick={handleSave} className="bg-primary">
              <Save className="mr-2 h-4 w-4" />
              Save Lesson
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Content Editor */}
          <div className="lg:col-span-8 space-y-4">
            {activeView === 'edit' ? (
              <>
                {contentBlocks.map((block) => (
                  <Card key={block.id} className="group relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <GripVertical className="w-5 h-5 text-muted-foreground cursor-move" />
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            block.type === 'heading' ? 'bg-blue-500/10 text-blue-500' :
                            block.type === 'quiz' ? 'bg-purple-500/10 text-purple-500' :
                            block.type === 'code' ? 'bg-green-500/10 text-green-500' :
                            'bg-gray-500/10 text-gray-500'
                          }`}>
                            {getBlockIcon(block.type)}
                          </div>
                          <span className="text-sm font-medium capitalize">{block.type}</span>
                          {/* Inline AI Enhance Button */}
                          {['text', 'quiz', 'code', 'problem'].includes(block.type) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs text-[#395192] hover:bg-[#395192]/10 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleEnhanceBlockWithAI(block.id)}
                            >
                              <Sparkles className="w-3 h-3 mr-1" />
                              Enhance
                            </Button>
                          )}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" onClick={() => moveBlock(block.id, 'up')}>
                            <ChevronUp className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => moveBlock(block.id, 'down')}>
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => duplicateBlock(block.id)}>
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteBlock(block.id)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {renderBlockEditor(block)}
                    </CardContent>
                  </Card>
                ))}

                {/* Add Block Buttons */}
                <Card className="border-2 border-dashed">
                  <CardContent className="p-6">
                    <p className="text-sm font-medium mb-4">Add Content Block:</p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      <Button variant="outline" size="sm" onClick={() => addBlock('heading')}>
                        <Heading1 className="mr-2 h-4 w-4" />
                        Heading
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => addBlock('text')}>
                        <Type className="mr-2 h-4 w-4" />
                        Text
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => addBlock('image')}>
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Image
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => addBlock('video')}>
                        <Video className="mr-2 h-4 w-4" />
                        Video
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => addBlock('code')}>
                        <Code className="mr-2 h-4 w-4" />
                        Code
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => addBlock('quiz')}>
                        <CheckSquare className="mr-2 h-4 w-4" />
                        Quiz
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => addBlock('interactive')}>
                        <Puzzle className="mr-2 h-4 w-4" />
                        Interactive
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => addBlock('problem')}>
                        <Calculator className="mr-2 h-4 w-4" />
                        Problem
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => addBlock('hint')}>
                        <Lightbulb className="mr-2 h-4 w-4" />
                        Hint
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => addBlock('callout')}>
                        <AlertCircle className="mr-2 h-4 w-4" />
                        Callout
                      </Button>
                    </div>
                    
                    {/* AI Generate Interactive Button */}
                    <div className="mt-6 pt-6 border-t">
                      <Button
                        variant="default"
                        className="w-full bg-gradient-to-r from-[#395192] to-[#06B6D4] hover:opacity-90"
                        onClick={() => setShowAIGenerator(true)}
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Interactive Element with AI
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Generation Dialog */}
                {showAIGenerator && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#395192] to-[#06B6D4] flex items-center justify-center">
                              <Wand2 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <CardTitle>AI Interactive Element Generator</CardTitle>
                              <p className="text-sm text-muted-foreground mt-1">
                                Describe what you want and AI will create it
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setShowAIGenerator(false);
                              setAIPrompt('');
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Example Prompts */}
                        <div className="space-y-3">
                          <label className="text-sm font-medium">Quick Examples:</label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="justify-start h-auto py-3 px-4 text-left"
                              onClick={() => setAIPrompt('A slider to explore quadratic equations with real-time graphing')}
                            >
                              <div className="flex flex-col gap-1">
                                <span className="font-medium text-xs">Quadratic Equation Explorer</span>
                                <span className="text-xs text-muted-foreground">Interactive slider with graphing</span>
                              </div>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="justify-start h-auto py-3 px-4 text-left"
                              onClick={() => setAIPrompt('A physics simulation showing projectile motion with adjustable parameters')}
                            >
                              <div className="flex flex-col gap-1">
                                <span className="font-medium text-xs">Projectile Motion Sim</span>
                                <span className="text-xs text-muted-foreground">Physics simulation</span>
                              </div>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="justify-start h-auto py-3 px-4 text-left"
                              onClick={() => setAIPrompt('Interactive bar chart comparing sorting algorithm time complexities')}
                            >
                              <div className="flex flex-col gap-1">
                                <span className="font-medium text-xs">Algorithm Comparison</span>
                                <span className="text-xs text-muted-foreground">Interactive chart</span>
                              </div>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="justify-start h-auto py-3 px-4 text-left"
                              onClick={() => setAIPrompt('A draggable timeline showing key events in World War II')}
                            >
                              <div className="flex flex-col gap-1">
                                <span className="font-medium text-xs">Historical Timeline</span>
                                <span className="text-xs text-muted-foreground">Draggable timeline</span>
                              </div>
                            </Button>
                          </div>
                        </div>

                        {/* Custom Prompt Input */}
                        <div className="space-y-3">
                          <label className="text-sm font-medium">Or describe your own:</label>
                          <Textarea
                            value={aiPrompt}
                            onChange={(e) => setAIPrompt(e.target.value)}
                            rows={4}
                            placeholder="Example: Create an interactive slider that demonstrates how compound interest grows over time with adjustable principal, rate, and time period..."
                            className="resize-none"
                          />
                          <p className="text-xs text-muted-foreground">
                            💡 Tip: Be specific about what type of interaction you want (slider, graph, simulation, drag-and-drop, etc.)
                          </p>
                        </div>

                        {/* AI Suggestions */}
                        <div className="p-4 bg-accent/50 rounded-lg space-y-2">
                          <div className="flex items-start gap-2">
                            <Sparkles className="w-4 h-4 text-[#395192] mt-0.5 flex-shrink-0" />
                            <div className="text-sm space-y-1">
                              <p className="font-medium">AI can generate:</p>
                              <ul className="text-xs text-muted-foreground space-y-0.5 ml-4">
                                <li>• Interactive sliders and parameter controls</li>
                                <li>• Real-time graphs and visualizations</li>
                                <li>• Physics and science simulations</li>
                                <li>• Drag-and-drop activities</li>
                                <li>• Mathematical explorations</li>
                                <li>• Data visualizations and charts</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                              setShowAIGenerator(false);
                              setAIPrompt('');
                            }}
                            disabled={aiGenerating}
                          >
                            Cancel
                          </Button>
                          <Button
                            className="flex-1 bg-gradient-to-r from-[#395192] to-[#06B6D4]"
                            onClick={handleAIGenerate}
                            disabled={aiGenerating || !aiPrompt.trim()}
                          >
                            {aiGenerating ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <Wand2 className="mr-2 h-4 w-4" />
                                Generate with AI
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="p-8 space-y-6">
                  <h1 className="text-4xl font-extrabold">{title}</h1>
                  {contentBlocks.map((block) => (
                    <div key={block.id}>
                      {renderBlockPreview(block)}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Lesson Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Duration (minutes)</label>
                  <Input type="number" defaultValue={15} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">XP Reward</label>
                  <Input type="number" defaultValue={100} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Difficulty</label>
                  <select className="w-full px-3 py-2 rounded-md border bg-background">
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                  <p>Use interactive blocks to engage students</p>
                </div>
                <div className="flex gap-3">
                  <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                  <p>Add hints for challenging problems</p>
                </div>
                <div className="flex gap-3">
                  <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                  <p>Include code examples with explanations</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}