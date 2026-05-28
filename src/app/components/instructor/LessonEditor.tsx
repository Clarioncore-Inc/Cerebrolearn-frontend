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
  Heading3,
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
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { Label } from '../ui/label';
import {
  storageApi,
  videoLessonsApi,
  lessonsApi,
} from '../../utils/api-client';

// ── UUID validation (module-level so useEffect can reference it) ──────────────
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isValidUUID = (id: string) => UUID_REGEX.test(id);

// ── Convert the API lesson response content arrays → editor ContentBlock[] ────
function normalizeLessonBlocks(lesson: any): ContentBlock[] {
  // If content is already a ContentBlock[] (e.g. after a local save in this session)
  if (
    Array.isArray(lesson?.content) &&
    lesson.content.length > 0 &&
    lesson.content[0]?.id &&
    lesson.content[0]?.type
  ) {
    return lesson.content as ContentBlock[];
  }

  const blocks: ContentBlock[] = [];
  let counter = 0;
  const nextId = () => `block-${++counter}`;

  const addBlocks = (
    arr: any[],
    type: ContentBlock['type'],
    mapper: (item: any) => any,
  ) => {
    (arr || []).forEach((item: any) => {
      blocks.push({
        id: item.id || nextId(),
        type,
        content: mapper(item),
        order: item.position ?? counter,
      });
    });
  };

  addBlocks(lesson?.heading_content, 'heading', (item) => ({
    text: item.text || '',
    level: item.level || 1,
  }));
  addBlocks(lesson?.text_content, 'text', (item) => ({
    text: item.body || '',
  }));
  addBlocks(lesson?.video_content, 'video', (item) => {
    // If there's a video_id, it means a video was uploaded
    const hasUploadedVideo = !!item.video_id;

    // The API might return video details expanded or just the ID
    // Check for filename in multiple possible locations
    const filename = item.filename || item.video?.filename || '';
    const videoUrl = item.video_url || item.url || item.video?.url || '';

    return {
      url: item.external_url || '',
      title: '',
      videoFileName: hasUploadedVideo ? filename || 'Uploaded Video' : '',
      videoReady: hasUploadedVideo,
      videoId: item.video_id || '',
      uploadedVideoUrl: videoUrl,
    };
  });
  addBlocks(lesson?.image_content, 'image', (item) => {
    const hasUploadedImage = !!item.image_id;
    const filename = item.filename || item.image?.filename || '';
    const imageUrl = item.image_url || item.url || item.image?.url || '';

    return {
      url: '',
      alt: item.alt_text || '',
      caption: item.caption || '',
      imageId: item.image_id || '',
      uploadedImageUrl: imageUrl,
      imageFileName: hasUploadedImage ? filename || 'Uploaded Image' : '',
    };
  });
  addBlocks(lesson?.code_content, 'code', (item) => ({
    code: item.code || '',
    language: item.language || 'javascript',
  }));
  addBlocks(lesson?.hint_content, 'hint', (item) => ({
    text: item.text || '',
  }));
  addBlocks(lesson?.callout_content, 'callout', (item) => ({
    text: item.text || '',
    type: item.callout_type || 'info',
  }));
  addBlocks(lesson?.quiz_content, 'quiz', (item) => {
    const q = (item.questions || [])[0] || {};
    const opts: any[] = q.options || [];
    const correctAnswers = opts
      .map((o: any, index: number) => (o.is_correct ? index : -1))
      .filter((index: number) => index !== -1);
    return {
      questionType: q.question_type || 'single_choice',
      question: q.text || '',
      options: opts.map((o: any) => o.text || ''),
      correctAnswers,
      points: q.points || 1,
      explanation: q.explanation || '',
    };
  });
  addBlocks(lesson?.problem_content, 'problem', (item) => ({
    question: item.statement || '',
    steps: item.hints?.length ? item.hints : ['Step 1', 'Step 2'],
    solution: item.solution_code || '',
    hints: item.hints || [],
  }));

  blocks.sort((a, b) => a.order - b.order);

  if (blocks.length === 0) {
    return [
      { id: '1', type: 'heading', content: { text: '', level: 1 }, order: 1 },
      { id: '2', type: 'text', content: { text: '' }, order: 2 },
    ];
  }
  return blocks;
}

// ── Map editor blocks → /lessons/{id} PUT body ────────────────────────────────
function buildLessonUpdatePayload(
  blocks: ContentBlock[],
  title: string,
  lessonType: string,
  duration: number,
  xp: number,
  difficulty: string,
) {
  const ofType = (t: ContentBlock['type']) =>
    blocks.filter((b) => b.type === t);

  return {
    title,
    kind: lessonType,
    duration_minutes: duration,
    xp_reward: xp,
    difficulty: difficulty.toLowerCase(),

    heading_content: ofType('heading').map((b, i) => ({
      position: i,
      text: b.content.text || '',
      level: b.content.level || 1,
    })),
    text_content: ofType('text').map((b, i) => ({
      position: i,
      body: b.content.text || '',
      estimated_read_minutes: 0,
      attachment_ids: [],
    })),
    video_content: ofType('video').map((b, i) => ({
      position: i,
      external_url: b.content.url || '',
      duration_seconds: 0,
      allow_download: true,
      ...(b.content.videoId ? { video_id: b.content.videoId } : {}),
    })),
    image_content: ofType('image').map((b, i) => ({
      position: i,
      caption: b.content.caption || '',
      alt_text: b.content.alt || '',
      ...(b.content.imageId ? { image_id: b.content.imageId } : {}),
    })),
    code_content: ofType('code').map((b, i) => ({
      position: i,
      code: b.content.code || '',
      language: b.content.language || 'javascript',
      show_line_numbers: true,
    })),
    hint_content: ofType('hint').map((b, i) => ({
      position: i,
      text: b.content.text || '',
      is_collapsible: true,
    })),
    callout_content: ofType('callout').map((b, i) => ({
      position: i,
      text: b.content.text || '',
      callout_type: b.content.type || 'info',
    })),
    quiz_content: ofType('quiz').map((b, i) => ({
      position: i,
      passing_score: 70,
      max_attempts: 3,
      time_limit_minutes: 0,
      shuffle_questions: false,
      show_correct_answers: true,
      questions: [
        {
          position: 0,
          question_type: b.content.questionType || 'single_choice',
          text: b.content.question || '',
          explanation: b.content.explanation || '',
          points: b.content.points || 1,
          options: (b.content.options || []).map((opt: string, j: number) => ({
            text: opt,
            is_correct: (Array.isArray(b.content.correctAnswers)
              ? b.content.correctAnswers
              : typeof b.content.correctAnswer === 'number'
                ? [b.content.correctAnswer]
                : []
            ).includes(j),
          })),
        },
      ],
    })),
    problem_content: ofType('problem').map((b, i) => ({
      position: i,
      statement: b.content.question || '',
      starter_code: '',
      solution_code: b.content.solution || '',
      language: 'python',
      time_limit_seconds: 30,
      memory_limit_mb: 256,
      hints: b.content.hints || [],
      test_cases: [],
    })),
  };
}

interface ContentBlock {
  id: string;
  type:
    | 'text'
    | 'heading'
    | 'image'
    | 'video'
    | 'code'
    | 'quiz'
    // | 'interactive'
    | 'hint'
    | 'callout'
    | 'problem';
  content: any;
  order: number;
}

interface LessonEditorProps {
  lesson?: any;
  course?: any;
  onSave: (lesson: any) => void;
  onCancel: () => void;
}

export function LessonEditor({
  lesson,
  course,
  onSave,
  onCancel,
}: LessonEditorProps) {
  console.log('lesson', lesson);
  const [title, setTitle] = useState(lesson?.title || 'New Lesson');
  const [lessonType, setLessonType] = useState(
    lesson?.kind || lesson?.type || 'text',
  );
  const [duration, setDuration] = useState<string>(() => {
    const v = lesson?.duration_minutes ?? lesson?.duration;
    return v != null && v !== 0 ? String(v) : '';
  });
  const [xp, setXp] = useState<string>(() => {
    const v = lesson?.xp_reward ?? lesson?.xp;
    return v != null ? String(v) : '';
  });
  const [difficulty, setDifficulty] = useState<string>(() => {
    const raw: string = lesson?.difficulty || 'beginner';
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  });
  const [activeView, setActiveView] = useState<'edit' | 'preview'>('edit');
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [aiPrompt, setAIPrompt] = useState('');
  const [aiGenerating, setAIGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Video lesson state
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoStorage, setVideoStorage] = useState<{
    id: string;
    url: string;
    fields: Record<string, string>;
  } | null>(null);

  const [isPreparingVideo, setIsPreparingVideo] = useState(false);

  // Image state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageStorage, setImageStorage] = useState<{
    id: string;
    url: string;
    fields: Record<string, string>;
  } | null>(null);
  const [isPreparingImage, setIsPreparingImage] = useState(false);
  const [currentImageBlockId, setCurrentImageBlockId] = useState<string | null>(
    null,
  );

  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>(() =>
    normalizeLessonBlocks(lesson),
  );

  const addBlock = (type: ContentBlock['type']) => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      order: contentBlocks.length + 1,
      content: getDefaultContent(type),
    };
    setContentBlocks([...contentBlocks, newBlock]);
    toast.success(`${type} block added`);
  };

  const getDefaultContent = (type: ContentBlock['type']) => {
    switch (type) {
      case 'heading':
        return { text: '', level: 2 };
      case 'text':
        return { text: '' };
      case 'image':
        return {
          url: '',
          alt: '',
          caption: '',
          imageId: '',
          uploadedImageUrl: '',
          imageFileName: '',
        };
      case 'video':
        return {
          url: '',
          title: '',
          videoFileName: '',
          videoReady: false,
          videoId: '',
          uploadedVideoUrl: '',
        };
      case 'code':
        return { code: '// Write your code here', language: 'javascript' };
      case 'quiz':
        return {
          questionType: 'single_choice',
          question: 'Question text',
          options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
          correctAnswers: [],
          points: 1,
          explanation: '',
        };
      // case 'interactive':
      //   return {
      //     type: 'slider',
      //     question: 'Interactive problem',
      //     parameters: {},
      //   };
      case 'hint':
        return { text: 'Hint text' };
      case 'callout':
        return { text: 'Important note', type: 'info' };
      case 'problem':
        return {
          question: 'Problem statement',
          steps: ['Step 1', 'Step 2'],
          solution: '',
          hints: [],
        };
      default:
        return {};
    }
  };

  const updateBlock = (id: string, content: any) => {
    setContentBlocks(
      contentBlocks.map((block) =>
        block.id === id ? { ...block, content } : block,
      ),
    );
  };

  const deleteBlock = (id: string) => {
    setContentBlocks(contentBlocks.filter((block) => block.id !== id));
    toast.success('Block deleted');
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = contentBlocks.findIndex((b) => b.id === id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === contentBlocks.length - 1) return;

    const newBlocks = [...contentBlocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[targetIndex]] = [
      newBlocks[targetIndex],
      newBlocks[index],
    ];

    setContentBlocks(newBlocks.map((block, i) => ({ ...block, order: i + 1 })));
  };

  const duplicateBlock = (id: string) => {
    const block = contentBlocks.find((b) => b.id === id);
    if (!block) return;

    const newBlock: ContentBlock = {
      ...block,
      id: Date.now().toString(),
      order: contentBlocks.length + 1,
    };
    setContentBlocks([...contentBlocks, newBlock]);
    toast.success('Block duplicated');
  };

  const handleVideoFile = async (file: File) => {
    if (!file.type.startsWith('video/')) {
      toast.error('Please upload a valid video file (MP4, WebM, MOV, AVI)');
      return;
    }
    setVideoFile(file);
    setVideoStorage(null);
    setIsPreparingVideo(true);
    try {
      const result = await storageApi.start({
        file_type: 'video',
        filename: file.name,
        mime_type: file.type,
        create_type: 'post',
      });
      setVideoStorage(result);
    } catch (err) {
      console.error('Error preparing video upload:', err);
      toast.error('Failed to prepare video upload. Please try again.');
      setVideoFile(null);
    } finally {
      setIsPreparingVideo(false);
    }
  };

  const handleImageFile = async (file: File, blockId: string) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file (PNG, JPG, GIF, WebP)');
      return;
    }
    setImageFile(file);
    setImageStorage(null);
    setCurrentImageBlockId(blockId);
    setIsPreparingImage(true);
    try {
      const result = await storageApi.start({
        file_type: 'image',
        filename: file.name,
        mime_type: file.type,
        create_type: 'post',
      });
      setImageStorage(result);

      // Upload to S3 immediately
      const { id, url, fields } = result;
      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) =>
        formData.append(key, value),
      );
      formData.append('file', file);
      await fetch(url, { method: 'POST', body: formData });

      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);

      // Update the block with image info
      updateBlock(blockId, {
        url: '', // Clear external URL when uploading
        alt: '',
        caption: '',
        imageId: id,
        uploadedImageUrl: previewUrl,
        imageFileName: file.name,
      });

      toast.success('Image uploaded successfully!');
    } catch (err) {
      console.error('Error uploading image:', err);
      toast.error('Failed to upload image. Please try again.');
      setImageFile(null);
    } finally {
      setIsPreparingImage(false);
      setCurrentImageBlockId(null);
    }
  };

  const handleSave = async () => {
    const lessonId = lesson?.id;

    if (!lessonId) {
      toast.error('Lesson ID is missing. Cannot save.');
      return;
    }

    setIsSaving(true);
    try {
      // Video upload — upload to AWS and store video_id in content block
      const videoBlock = contentBlocks.find((b) => b.type === 'video');
      const hasVideoFile = videoBlock && videoFile && videoStorage;

      let finalBlocks = contentBlocks;

      if (hasVideoFile) {
        const { id, url, fields } = videoStorage;
        const formData = new FormData();
        Object.entries(fields).forEach(([key, value]) =>
          formData.append(key, value),
        );
        formData.append('file', videoFile);
        await fetch(url, { method: 'POST', body: formData });

        // Create updated blocks array with video ID
        finalBlocks = contentBlocks.map((block) =>
          block.id === videoBlock.id
            ? { ...block, content: { ...block.content, videoId: id } }
            : block,
        );
      }

      if (isValidUUID(lessonId)) {
        // Persist all content blocks + metadata to the backend
        await lessonsApi.update(
          lessonId,
          buildLessonUpdatePayload(
            finalBlocks,
            title,
            lessonType,
            duration === '' ? 0 : Number(duration),
            xp === '' ? 0 : Number(xp),
            difficulty,
          ),
        );
      }

      const lessonData = {
        id: lesson.id,
        title,
        type: lessonType,
        content: finalBlocks,
        updatedAt: new Date().toISOString(),
      };
      onSave(lessonData);
      toast.success('Lesson saved successfully!');
    } catch (error) {
      console.error('Error saving lesson:', error);
      toast.error('Failed to save lesson. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderBlockEditor = (block: ContentBlock) => {
    switch (block.type) {
      case 'heading':
        return (
          <div className='space-y-3'>
            <div className='flex gap-2'>
              <Button
                variant={block.content.level === 1 ? 'default' : 'outline'}
                size='sm'
                onClick={() =>
                  updateBlock(block.id, { ...block.content, level: 1 })
                }
              >
                H1
              </Button>
              <Button
                variant={block.content.level === 2 ? 'default' : 'outline'}
                size='sm'
                onClick={() =>
                  updateBlock(block.id, { ...block.content, level: 2 })
                }
              >
                H2
              </Button>
              <Button
                variant={block.content.level === 3 ? 'default' : 'outline'}
                size='sm'
                onClick={() =>
                  updateBlock(block.id, { ...block.content, level: 3 })
                }
              >
                H3
              </Button>
            </div>
            <Input
              value={block.content.text}
              onChange={(e) =>
                updateBlock(block.id, {
                  ...block.content,
                  text: e.target.value,
                })
              }
              className='text-xl font-bold'
              placeholder='Heading text'
            />
          </div>
        );

      case 'text':
        return (
          <Textarea
            value={block.content.text}
            onChange={(e) =>
              updateBlock(block.id, { ...block.content, text: e.target.value })
            }
            rows={6}
            placeholder='Write your content here...'
          />
        );

      case 'image':
        return (
          <div className='space-y-3'>
            {/* Image preview if uploaded or URL provided */}
            {(block.content.uploadedImageUrl || block.content.url) && (
              <div className='relative'>
                <img
                  src={block.content.uploadedImageUrl || block.content.url}
                  alt={block.content.alt || 'Preview'}
                  className='w-full rounded-lg border'
                />
                {block.content.imageFileName && (
                  <div className='mt-2 flex items-center gap-2 text-xs text-green-600'>
                    <ImageIcon className='w-4 h-4' />
                    <span>{block.content.imageFileName}</span>
                    <span>✓ Uploaded</span>
                  </div>
                )}
                <button
                  type='button'
                  title='Remove image'
                  onClick={() => {
                    setImageFile(null);
                    setImageStorage(null);
                    updateBlock(block.id, {
                      ...block.content,
                      uploadedImageUrl: '',
                      imageFileName: '',
                      imageId: '',
                    });
                  }}
                  className='absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600'
                >
                  <X className='w-4 h-4' />
                </button>
              </div>
            )}

            {/* Upload area */}
            {!block.content.uploadedImageUrl && !block.content.url && (
              <div
                className='border-2 border-dashed rounded-lg p-8 text-center hover:bg-accent transition-colors cursor-pointer'
                onClick={() =>
                  document.getElementById(`image-upload-${block.id}`)?.click()
                }
              >
                {isPreparingImage && currentImageBlockId === block.id ? (
                  <div className='flex flex-col items-center gap-2'>
                    <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent' />
                    <p className='text-sm text-muted-foreground'>
                      Uploading...
                    </p>
                  </div>
                ) : (
                  <>
                    <Upload className='w-12 h-12 mx-auto mb-3 text-muted-foreground' />
                    <p className='text-sm text-muted-foreground'>
                      Click to upload or drag and drop
                    </p>
                    <p className='text-xs text-muted-foreground mt-1'>
                      PNG, JPG, GIF, WebP up to 10MB
                    </p>
                  </>
                )}
                <input
                  id={`image-upload-${block.id}`}
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImageFile(file, block.id);
                    }
                  }}
                />
              </div>
            )}

            {/* Divider */}
            {!block.content.uploadedImageUrl && (
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t' />
                </div>
                <div className='relative flex justify-center text-xs uppercase'>
                  <span className='bg-background px-2 text-muted-foreground'>
                    or
                  </span>
                </div>
              </div>
            )}

            {/* External URL */}
            {!block.content.uploadedImageUrl && (
              <div className='space-y-2'>
                <Label>External Image URL</Label>
                <Input
                  placeholder='https://example.com/image.jpg'
                  value={block.content.url}
                  onChange={(e) =>
                    updateBlock(block.id, {
                      ...block.content,
                      url: e.target.value,
                    })
                  }
                />
              </div>
            )}

            {/* Alt text and Caption */}
            <Input
              placeholder='Alt text (for accessibility)'
              value={block.content.alt}
              onChange={(e) =>
                updateBlock(block.id, { ...block.content, alt: e.target.value })
              }
            />
            <Input
              placeholder='Caption'
              value={block.content.caption}
              onChange={(e) =>
                updateBlock(block.id, {
                  ...block.content,
                  caption: e.target.value,
                })
              }
            />
          </div>
        );

      case 'video':
        return (
          <div className='space-y-4'>
            {/* Upload area */}
            {block.content.videoFileName ? (
              <div className='space-y-3'>
                <div className='flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg'>
                  <Video className='w-5 h-5 text-green-600 shrink-0' />
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm text-green-700 truncate'>
                      {block.content.videoFileName}
                    </p>
                    {block.content.videoId &&
                      block.content.uploadedVideoUrl && (
                        <p className='text-xs text-green-600 mt-0.5'>
                          ✓ Previously uploaded
                        </p>
                      )}
                  </div>
                  {isPreparingVideo && (
                    <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                      <div className='h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent' />
                      Preparing…
                    </div>
                  )}
                  {!isPreparingVideo &&
                    block.content.videoReady &&
                    !block.content.videoId && (
                      <span className='text-xs text-green-600'>
                        Ready to upload
                      </span>
                    )}
                  <button
                    type='button'
                    title='Remove video'
                    onClick={() => {
                      setVideoFile(null);
                      setVideoStorage(null);
                      updateBlock(block.id, {
                        ...block.content,
                        videoFileName: '',
                        videoReady: false,
                        videoId: '',
                        uploadedVideoUrl: '',
                      });
                    }}
                    className='text-gray-400 hover:text-gray-600'
                  >
                    <X className='w-4 h-4' />
                  </button>
                </div>

                {/* Video preview if available */}
                {block.content.uploadedVideoUrl && (
                  <div className='relative aspect-video bg-black rounded-lg overflow-hidden'>
                    <video
                      src={block.content.uploadedVideoUrl}
                      controls
                      className='w-full h-full'
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
              </div>
            ) : (
              <div
                className='border-2 border-dashed rounded-lg p-8 text-center hover:bg-accent transition-colors cursor-pointer'
                onClick={() =>
                  document.getElementById(`video-upload-${block.id}`)?.click()
                }
              >
                <Upload className='w-10 h-10 mx-auto mb-2 text-muted-foreground' />
                <p className='text-sm font-medium'>Click to upload a video</p>
                <p className='text-xs text-muted-foreground mt-1'>
                  MP4, WebM, MOV, AVI
                </p>
                <input
                  id={`video-upload-${block.id}`}
                  type='file'
                  accept='video/*'
                  className='hidden'
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      updateBlock(block.id, {
                        ...block.content,
                        videoFileName: file.name,
                      });
                      handleVideoFile(file).then(() => {
                        updateBlock(block.id, {
                          ...block.content,
                          videoFileName: file.name,
                          videoReady: true,
                        });
                      });
                    }
                  }}
                />
              </div>
            )}

            {/* Divider */}
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-background px-2 text-muted-foreground'>
                  or
                </span>
              </div>
            </div>

            {/* External URL */}
            <div className='space-y-2'>
              <Label>External Video URL</Label>
              <div className='flex items-center gap-2'>
                <Link2 className='w-4 h-4 text-muted-foreground shrink-0' />
                <Input
                  placeholder='YouTube, Vimeo, or direct video URL'
                  value={block.content.url}
                  onChange={(e) =>
                    updateBlock(block.id, {
                      ...block.content,
                      url: e.target.value,
                    })
                  }
                  disabled={!!block.content.videoFileName}
                />
              </div>
              {block.content.videoFileName && (
                <p className='text-xs text-muted-foreground'>
                  Remove the uploaded file to use an external URL instead.
                </p>
              )}
            </div>
          </div>
        );

      case 'code':
        return (
          <div className='space-y-3'>
            <div className='flex gap-2'>
              <select
                value={block.content.language}
                onChange={(e) =>
                  updateBlock(block.id, {
                    ...block.content,
                    language: e.target.value,
                  })
                }
                className='px-3 py-2 rounded-md border bg-background'
              >
                <option value='javascript'>JavaScript</option>
                <option value='python'>Python</option>
                <option value='java'>Java</option>
                <option value='cpp'>C++</option>
                <option value='html'>HTML</option>
                <option value='css'>CSS</option>
              </select>
            </div>
            <Textarea
              value={block.content.code}
              onChange={(e) =>
                updateBlock(block.id, {
                  ...block.content,
                  code: e.target.value,
                })
              }
              rows={10}
              className='font-mono text-sm'
              placeholder='// Write your code here'
            />
          </div>
        );

      case 'quiz':
        const questionType = block.content.questionType || 'single_choice';
        const isSingleChoice = questionType === 'single_choice';
        const correctAnswers: number[] = Array.isArray(
          block.content.correctAnswers,
        )
          ? block.content.correctAnswers
          : typeof block.content.correctAnswer === 'number'
            ? [block.content.correctAnswer]
            : [];

        const updateCorrectAnswer = (index: number, checked: boolean) => {
          if (isSingleChoice) {
            if (!checked) return;
            updateBlock(block.id, {
              ...block.content,
              correctAnswers: [index],
            });
            return;
          }

          const nextAnswers = checked
            ? correctAnswers.includes(index)
              ? correctAnswers
              : [...correctAnswers, index]
            : correctAnswers.filter((i: number) => i !== index);

          updateBlock(block.id, {
            ...block.content,
            correctAnswers: nextAnswers,
          });
        };

        return (
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-3'>
              <div className='space-y-2'>
                <Label>Question Type</Label>
                <select
                  value={questionType}
                  aria-label='Quiz question type'
                  onChange={(e) => {
                    const nextType = e.target.value;
                    const nextAnswers =
                      nextType === 'single_choice' && correctAnswers.length > 1
                        ? [correctAnswers[0]]
                        : correctAnswers;

                    updateBlock(block.id, {
                      ...block.content,
                      questionType: nextType,
                      correctAnswers: nextAnswers,
                    });
                  }}
                  className='w-full px-3 py-2 rounded-md border bg-background text-sm'
                >
                  <option value='single_choice'>
                    Single choice (Radio button)
                  </option>
                  <option value='multiple_choice'>
                    Multiple choice (Checkboxes)
                  </option>
                </select>
              </div>
              <div className='space-y-2'>
                <Label>Points</Label>
                <select
                  value={block.content.points || 1}
                  aria-label='Quiz points'
                  onChange={(e) =>
                    updateBlock(block.id, {
                      ...block.content,
                      points: parseInt(e.target.value, 10),
                    })
                  }
                  className='w-full px-3 py-2 rounded-md border bg-background text-sm'
                >
                  <option value='1'>1 point</option>
                  <option value='2'>2 points</option>
                  <option value='3'>3 points</option>
                  <option value='5'>5 points</option>
                  <option value='10'>10 points</option>
                </select>
              </div>
            </div>
            <Input
              placeholder='Question'
              value={block.content.question}
              onChange={(e) =>
                updateBlock(block.id, {
                  ...block.content,
                  question: e.target.value,
                })
              }
            />
            <div className='space-y-2'>
              {block.content.options.map((option: string, index: number) => (
                <div key={index} className='flex gap-2'>
                  <input
                    type={isSingleChoice ? 'radio' : 'checkbox'}
                    name={`lesson-editor-quiz-${block.id}`}
                    aria-label={`Mark option ${index + 1} as correct`}
                    checked={correctAnswers.includes(index)}
                    onChange={(e) =>
                      updateCorrectAnswer(index, e.target.checked)
                    }
                    className='mt-1'
                  />
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...block.content.options];
                      newOptions[index] = e.target.value;
                      updateBlock(block.id, {
                        ...block.content,
                        options: newOptions,
                      });
                    }}
                    placeholder={`Option ${index + 1}`}
                  />
                </div>
              ))}
            </div>
            <Button
              variant='outline'
              size='sm'
              onClick={() =>
                updateBlock(block.id, {
                  ...block.content,
                  options: [
                    ...block.content.options,
                    `Option ${block.content.options.length + 1}`,
                  ],
                })
              }
            >
              <Plus className='mr-2 h-4 w-4' />
              Add Option
            </Button>
            <Textarea
              placeholder='Explanation (shown after answer)'
              value={block.content.explanation}
              onChange={(e) =>
                updateBlock(block.id, {
                  ...block.content,
                  explanation: e.target.value,
                })
              }
              rows={3}
            />
          </div>
        );

      // case 'interactive':
      //   return (
      //     <div className='space-y-4'>
      //       <Input
      //         placeholder='Interactive problem question'
      //         value={block.content.question}
      //         onChange={(e) =>
      //           updateBlock(block.id, {
      //             ...block.content,
      //             question: e.target.value,
      //           })
      //         }
      //       />
      //       <div className='p-8 border-2 border-dashed rounded-lg text-center'>
      //         <Puzzle className='w-12 h-12 mx-auto mb-3 text-muted-foreground' />
      //         <p className='text-sm text-muted-foreground'>
      //           Interactive element configuration
      //         </p>
      //         <p className='text-xs text-muted-foreground mt-1'>
      //           Configure sliders, graphs, or other interactive components
      //         </p>
      //       </div>
      //     </div>
      //   );

      case 'hint':
        return (
          <div className='p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded'>
            <div className='flex items-start gap-3'>
              <Lightbulb className='w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5' />
              <Textarea
                value={block.content.text}
                onChange={(e) =>
                  updateBlock(block.id, {
                    ...block.content,
                    text: e.target.value,
                  })
                }
                rows={3}
                className='bg-transparent border-0'
                placeholder='Hint text'
              />
            </div>
          </div>
        );

      case 'callout':
        return (
          <div className='space-y-3'>
            <select
              value={block.content.type}
              onChange={(e) =>
                updateBlock(block.id, {
                  ...block.content,
                  type: e.target.value,
                })
              }
              className='px-3 py-2 rounded-md border bg-background'
            >
              <option value='info'>Info</option>
              <option value='warning'>Warning</option>
              <option value='success'>Success</option>
              <option value='error'>Error</option>
            </select>
            <div
              className={`p-4 border-l-4 rounded ${
                block.content.type === 'info'
                  ? 'bg-blue-50 border-blue-400'
                  : block.content.type === 'warning'
                    ? 'bg-yellow-50 border-yellow-400'
                    : block.content.type === 'success'
                      ? 'bg-green-50 border-green-400'
                      : 'bg-red-50 border-red-400'
              }`}
            >
              <Textarea
                value={block.content.text}
                onChange={(e) =>
                  updateBlock(block.id, {
                    ...block.content,
                    text: e.target.value,
                  })
                }
                rows={3}
                className='bg-transparent border-0'
                placeholder='Callout text'
              />
            </div>
          </div>
        );

      case 'problem':
        return (
          <div className='space-y-4'>
            <Input
              placeholder='Problem statement'
              value={block.content.question}
              onChange={(e) =>
                updateBlock(block.id, {
                  ...block.content,
                  question: e.target.value,
                })
              }
            />
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Solution Steps:</label>
              {block.content.steps.map((step: string, index: number) => (
                <Input
                  key={index}
                  value={step}
                  onChange={(e) => {
                    const newSteps = [...block.content.steps];
                    newSteps[index] = e.target.value;
                    updateBlock(block.id, {
                      ...block.content,
                      steps: newSteps,
                    });
                  }}
                  placeholder={`Step ${index + 1}`}
                />
              ))}
              <Button
                variant='outline'
                size='sm'
                onClick={() =>
                  updateBlock(block.id, {
                    ...block.content,
                    steps: [
                      ...block.content.steps,
                      `Step ${block.content.steps.length + 1}`,
                    ],
                  })
                }
              >
                <Plus className='mr-2 h-4 w-4' />
                Add Step
              </Button>
            </div>
            <Textarea
              placeholder='Final solution'
              value={block.content.solution}
              onChange={(e) =>
                updateBlock(block.id, {
                  ...block.content,
                  solution: e.target.value,
                })
              }
              rows={4}
            />
          </div>
        );

      default:
        return <p className='text-muted-foreground'>Unknown block type</p>;
    }
  };

  const renderBlockPreview = (block: ContentBlock) => {
    switch (block.type) {
      case 'heading':
        const HeadingTag =
          `h${block.content.level}` as keyof JSX.IntrinsicElements;
        return React.createElement(
          HeadingTag,
          { className: 'font-bold' },
          block.content.text,
        );

      case 'text':
        return <p className='whitespace-pre-wrap'>{block.content.text}</p>;

      case 'image':
        return block.content.url ? (
          <div>
            <img
              src={block.content.url}
              alt={block.content.alt}
              className='rounded-lg w-full'
            />
            {block.content.caption && (
              <p className='text-sm text-center text-muted-foreground mt-2'>
                {block.content.caption}
              </p>
            )}
          </div>
        ) : (
          <div className='border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground'>
            <ImageIcon className='w-12 h-12 mx-auto mb-2' />
            <p>Image placeholder</p>
          </div>
        );

      case 'video':
        return block.content.url ? (
          <div className='aspect-video bg-black rounded-lg flex items-center justify-center'>
            <Play className='w-16 h-16 text-white' />
          </div>
        ) : (
          <div className='border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground aspect-video flex flex-col items-center justify-center'>
            <Video className='w-12 h-12 mb-2' />
            <p>Video placeholder</p>
          </div>
        );

      case 'code':
        return (
          <div className='bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto'>
            <div className='flex items-center justify-between mb-2 text-gray-400 text-xs'>
              <span>{block.content.language}</span>
              <Copy className='w-4 h-4 cursor-pointer hover:text-gray-200' />
            </div>
            <pre>{block.content.code}</pre>
          </div>
        );

      case 'quiz':
        const previewCorrectAnswers: number[] = Array.isArray(
          block.content.correctAnswers,
        )
          ? block.content.correctAnswers
          : typeof block.content.correctAnswer === 'number'
            ? [block.content.correctAnswer]
            : [];
        return (
          <Card>
            <CardContent className='p-6 space-y-4'>
              <p className='font-semibold'>{block.content.question}</p>
              <div className='space-y-2'>
                {block.content.options.map((option: string, index: number) => (
                  <div
                    key={index}
                    className={`p-3 border-2 rounded-lg cursor-pointer hover:bg-accent ${
                      previewCorrectAnswers.includes(index)
                        ? 'border-green-500 bg-green-50'
                        : ''
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
          <div className='p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded flex items-start gap-3'>
            <Lightbulb className='w-5 h-5 text-yellow-600 flex-shrink-0' />
            <p className='text-sm'>{block.content.text}</p>
          </div>
        );

      case 'callout':
        return (
          <div
            className={`p-4 border-l-4 rounded flex items-start gap-3 ${
              block.content.type === 'info'
                ? 'bg-blue-50 border-blue-400'
                : block.content.type === 'warning'
                  ? 'bg-yellow-50 border-yellow-400'
                  : block.content.type === 'success'
                    ? 'bg-green-50 border-green-400'
                    : 'bg-red-50 border-red-400'
            }`}
          >
            <AlertCircle className='w-5 h-5 flex-shrink-0' />
            <p className='text-sm'>{block.content.text}</p>
          </div>
        );

      default:
        return <p className='text-muted-foreground'>Preview not available</p>;
    }
  };

  const getBlockIcon = (type: ContentBlock['type'], level?: number) => {
    switch (type) {
      case 'heading':
        return level === 3 ? (
          <Heading3 className='w-4 h-4' />
        ) : level === 2 ? (
          <Heading2 className='w-4 h-4' />
        ) : (
          <Heading1 className='w-4 h-4' />
        );
      case 'text':
        return <Type className='w-4 h-4' />;
      case 'image':
        return <ImageIcon className='w-4 h-4' />;
      case 'video':
        return <Video className='w-4 h-4' />;
      case 'code':
        return <Code className='w-4 h-4' />;
      case 'quiz':
        return <CheckSquare className='w-4 h-4' />;
      // case 'interactive':
      //   return <Puzzle className='w-4 h-4' />;
      case 'hint':
        return <Lightbulb className='w-4 h-4' />;
      case 'callout':
        return <AlertCircle className='w-4 h-4' />;
      case 'problem':
        return <Calculator className='w-4 h-4' />;
      default:
        return <FileText className='w-4 h-4' />;
    }
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      toast.error(
        'Please describe what interactive element you want to create',
      );
      return;
    }

    // await handleAIGenerateBlock('interactive', aiPrompt);
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-background via-accent/30 to-background'>
      <div className='container py-8'>
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-4'>
            <Button variant='ghost' onClick={onCancel}>
              ← Back
            </Button>
            <div>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='text-2xl font-bold bg-transparent border-0 border-b-2 border-b-muted-foreground/30 rounded-none focus-visible:ring-0 focus-visible:border-b-primary w-80'
                placeholder='Lesson Title'
              />
            </div>
          </div>
          <div className='flex gap-3'>
            <Button
              variant='outline'
              onClick={() =>
                setActiveView(activeView === 'edit' ? 'preview' : 'edit')
              }
            >
              <Eye className='mr-2 h-4 w-4' />
              {activeView === 'edit' ? 'Preview' : 'Edit'}
            </Button>
            <Button
              onClick={handleSave}
              className='bg-primary'
              disabled={isSaving || isPreparingVideo}
            >
              {isSaving ? (
                <>
                  <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                  Saving…
                </>
              ) : (
                <>
                  <Save className='mr-2 h-4 w-4' />
                  Save Lesson
                </>
              )}
            </Button>
          </div>
        </div>

        <div className='grid lg:grid-cols-12 gap-6'>
          {/* Content Editor */}
          <div className='lg:col-span-8 space-y-4'>
            {activeView === 'edit' ? (
              <>
                {contentBlocks.map((block) => (
                  <Card key={block.id} className='group relative'>
                    <CardHeader className='pb-3'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                          <GripVertical className='w-5 h-5 text-muted-foreground cursor-move' />
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              block.type === 'heading'
                                ? 'bg-blue-500/10 text-blue-500'
                                : block.type === 'quiz'
                                  ? 'bg-purple-500/10 text-purple-500'
                                  : block.type === 'code'
                                    ? 'bg-green-500/10 text-green-500'
                                    : 'bg-gray-500/10 text-gray-500'
                            }`}
                          >
                            {getBlockIcon(block.type, block.content?.level)}
                          </div>
                          <span className='text-sm font-medium capitalize'>
                            {block.type}
                          </span>
                        </div>
                        <div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                          <Button
                            variant='ghost'
                            title='Move Block Up'
                            size='sm'
                            onClick={() => moveBlock(block.id, 'up')}
                          >
                            <ChevronUp className='w-4 h-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            title='Move Block Down'
                            onClick={() => moveBlock(block.id, 'down')}
                          >
                            <ChevronDown className='w-4 h-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            title='Duplicate Block'
                            onClick={() => duplicateBlock(block.id)}
                          >
                            <Copy className='w-4 h-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            title='Delete Block'
                            onClick={() => deleteBlock(block.id)}
                          >
                            <Trash2 className='w-4 h-4 text-red-500' />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>{renderBlockEditor(block)}</CardContent>
                  </Card>
                ))}

                {/* Add Block Buttons */}
                <Card className='border-2 border-dashed'>
                  <CardContent className='p-6'>
                    <p className='text-sm font-medium mb-4'>
                      Add Content Block:
                    </p>
                    <div className='grid grid-cols-2 md:grid-cols-5 gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => addBlock('heading')}
                      >
                        <Heading1 className='mr-2 h-4 w-4' />
                        Heading
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => addBlock('text')}
                      >
                        <Type className='mr-2 h-4 w-4' />
                        Text
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => addBlock('image')}
                      >
                        <ImageIcon className='mr-2 h-4 w-4' />
                        Image
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => addBlock('video')}
                      >
                        <Video className='mr-2 h-4 w-4' />
                        Video
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => addBlock('code')}
                      >
                        <Code className='mr-2 h-4 w-4' />
                        Code
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => addBlock('quiz')}
                      >
                        <CheckSquare className='mr-2 h-4 w-4' />
                        Quiz
                      </Button>
                      {/* <Button
                        variant='outline'
                        size='sm'
                        onClick={() => addBlock('interactive')}
                      >
                        <Puzzle className='mr-2 h-4 w-4' />
                        Interactive
                      </Button> */}
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => addBlock('problem')}
                      >
                        <Calculator className='mr-2 h-4 w-4' />
                        Problem
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => addBlock('hint')}
                      >
                        <Lightbulb className='mr-2 h-4 w-4' />
                        Hint
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => addBlock('callout')}
                      >
                        <AlertCircle className='mr-2 h-4 w-4' />
                        Callout
                      </Button>
                    </div>

                    {/* AI Generate Interactive Button — hidden until AI is integrated
                    <div className='mt-6 pt-6 border-t'>
                      <Button
                        variant='default'
                        className='w-full bg-gradient-to-r from-[#395192] to-[#06B6D4] hover:opacity-90'
                        onClick={() => setShowAIGenerator(true)}
                      >
                        <Sparkles className='mr-2 h-4 w-4' />
                        Generate Interactive Element with AI
                      </Button>
                    </div> */}
                  </CardContent>
                </Card>

                {/* AI Generation Dialog — removed until AI is integrated */}
              </>
            ) : (
              <Card>
                <CardContent className='p-8 space-y-6'>
                  <h1 className='text-4xl font-extrabold'>{title}</h1>
                  {contentBlocks.map((block) => (
                    <div key={block.id}>{renderBlockPreview(block)}</div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className='lg:col-span-4 space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Lesson Settings</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <label className='text-sm font-medium mb-2 block'>
                    Duration (minutes)
                  </label>
                  <Input
                    type='number'
                    value={duration}
                    min={1}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>
                <div>
                  <label className='text-sm font-medium mb-2 block'>
                    XP Reward
                  </label>
                  <Input
                    type='number'
                    value={xp}
                    min={0}
                    onChange={(e) => setXp(e.target.value)}
                  />
                </div>
                <div>
                  <label className='text-sm font-medium mb-2 block'>
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className='w-full px-3 py-2 rounded-md border bg-background'
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3 text-sm'>
                {/* <div className='flex gap-3'>
                  <Lightbulb className='w-5 h-5 text-yellow-500 flex-shrink-0' />
                  <p>Use interactive blocks to engage students</p>
                </div> */}
                <div className='flex gap-3'>
                  <Lightbulb className='w-5 h-5 text-yellow-500 flex-shrink-0' />
                  <p>Add hints for challenging problems</p>
                </div>
                <div className='flex gap-3'>
                  <Lightbulb className='w-5 h-5 text-yellow-500 flex-shrink-0' />
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
