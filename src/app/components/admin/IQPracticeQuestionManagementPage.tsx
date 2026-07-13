import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import { Brain, Loader2, Pencil, Plus, Save, Trash2 } from 'lucide-react';
import {
  iqPracticeQuestionService,
  type IQPracticeQuestion,
  type IQPracticeQuestionInput,
} from '../../services/iqPracticeQuestionService';
import { IQ_KPI_OPTIONS, normalizeIQKpiCategory } from '../../utils/iqKpis';
import { formatIQTestType, IQ_TEST_TYPE_OPTIONS, type IQTestType } from '../../utils/iqTestTypes';

type EditableQuestionForm = Omit<IQPracticeQuestionInput, 'sortOrder'> & {
  sortOrder: number | '';
};

const DEFAULT_FORM: EditableQuestionForm = {
  type: 'pattern',
  difficulty: 'easy',
  question: '',
  options: ['', ''],
  correctAnswer: 0,
  explanation: '',
  category: normalizeIQKpiCategory(),
  tests: ['culture_fair_intelligence_test'],
  sortOrder: '',
};

const QUESTION_TYPES = ['pattern', 'logical', 'mathematical', 'spatial', 'verbal'];
const DIFFICULTIES: Array<EditableQuestionForm['difficulty']> = ['easy', 'medium', 'hard'];
const QUESTIONS_PER_PAGE = 5;

const toForm = (question?: IQPracticeQuestion | null): EditableQuestionForm =>
  question
    ? {
        type: question.type,
        difficulty: question.difficulty,
        question: question.question,
        options: [...question.options],
        correctAnswer: question.correctAnswer,
        explanation: question.explanation ?? '',
        category: normalizeIQKpiCategory(question.category),
        tests: [...question.tests],
        sortOrder: question.sortOrder,
      }
    : { ...DEFAULT_FORM, options: [...DEFAULT_FORM.options], tests: [...DEFAULT_FORM.tests] };

export function IQPracticeQuestionManagementPage() {
  const [questions, setQuestions] = useState<IQPracticeQuestion[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<EditableQuestionForm>(toForm());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<IQPracticeQuestion | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const items = await iqPracticeQuestionService.listAdmin();
      setQuestions(items);
      if (selectedId) {
        const selected = items.find((item) => item.id === selectedId);
        if (selected) setForm(toForm(selected));
        else {
          setSelectedId(null);
          setForm(toForm());
        }
      }
      return items;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load practice questions.');
      return [] as IQPracticeQuestion[];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const selectedQuestion = useMemo(
    () => questions.find((item) => item.id === selectedId) ?? null,
    [questions, selectedId],
  );

  const stats = useMemo(() => ({
    total: questions.length,
    categories: new Set(questions.map((question) => normalizeIQKpiCategory(question.category))).size,
    tracks: new Set(questions.flatMap((question) => question.tests)).size,
  }), [questions]);

  const sortedQuestions = useMemo(
    () => [...questions].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)),
    [questions],
  );

  const totalPages = Math.max(1, Math.ceil(sortedQuestions.length / QUESTIONS_PER_PAGE));

  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * QUESTIONS_PER_PAGE;
    return sortedQuestions.slice(start, start + QUESTIONS_PER_PAGE);
  }, [sortedQuestions, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const resetForm = () => {
    setSelectedId(null);
    setForm(toForm());
  };

  const handleEdit = (question: IQPracticeQuestion) => {
    setSelectedId(question.id);
    setForm(toForm(question));
  };

  const handleOptionChange = (index: number, value: string) => {
    setForm((current) => {
      const options = [...current.options];
      options[index] = value;
      return { ...current, options };
    });
  };

  const addOption = () => setForm((current) => ({ ...current, options: [...current.options, ''] }));

  const removeOption = (index: number) => {
    setForm((current) => {
      if (current.options.length <= 2) return current;
      const options = current.options.filter((_, optionIndex) => optionIndex !== index);
      const correctAnswer = Math.min(current.correctAnswer, options.length - 1);
      return { ...current, options, correctAnswer };
    });
  };

  const toggleTestType = (testType: IQTestType, checked: boolean) => {
    setForm((current) => ({
      ...current,
      tests: checked
        ? Array.from(new Set([...current.tests, testType]))
        : current.tests.filter((item) => item !== testType),
    }));
  };

  const buildPayload = (): IQPracticeQuestionInput | null => {
    const options = form.options.map((option) => option.trim()).filter(Boolean);
    if (!form.question.trim()) return toast.error('Question text is required.'), null;
    if (!form.category.trim()) return toast.error('Category is required.'), null;
    if (options.length < 2) return toast.error('At least two answer options are required.'), null;
    if (form.correctAnswer >= options.length) return toast.error('Correct answer must match one of the current options.'), null;
    if (!form.tests.length) return toast.error('Select at least one test track.'), null;

    return {
      type: form.type.trim(),
      difficulty: form.difficulty,
      question: form.question.trim(),
      options,
      correctAnswer: form.correctAnswer,
      explanation: form.explanation.trim() || null,
      category: form.category.trim(),
      tests: form.tests,
      sortOrder: form.sortOrder === '' ? undefined : Number(form.sortOrder),
    };
  };

  const handleSave = async () => {
    const payload = buildPayload();
    if (!payload) return;

    setSaving(true);
    try {
      const isEditing = Boolean(selectedId);
      const saved = selectedId
        ? await iqPracticeQuestionService.update(selectedId, payload)
        : await iqPracticeQuestionService.create(payload);
      toast.success(isEditing ? 'Practice question updated.' : 'Practice question created.');
      await loadQuestions();

      if (isEditing) {
        handleEdit(saved);
      } else {
        resetForm();
        setCurrentPage(1);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save practice question.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await iqPracticeQuestionService.delete(deleting.id);
      toast.success('Practice question deleted.');
      if (selectedId === deleting.id) resetForm();
      setDeleting(null);
      await loadQuestions();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete practice question.');
    }
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="mb-2">IQ Practice Questions</h1>
          <p className="text-muted-foreground">Manage the questions used by the IQ practice mode experience.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="pt-6"><p className="text-2xl font-bold">{stats.total}</p><p className="text-sm text-muted-foreground">Questions</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-2xl font-bold">{stats.categories}</p><p className="text-sm text-muted-foreground">Categories</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><Brain className="h-7 w-7 text-primary" /><div><p className="text-2xl font-bold">{stats.tracks}</p><p className="text-sm text-muted-foreground">Covered test tracks</p></div></div></CardContent></Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="min-w-0 overflow-hidden">
          <CardHeader><CardTitle>{selectedQuestion ? 'Edit question' : 'Create question'}</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Question</Label>
              <Textarea value={form.question} onChange={(e) => setForm((current) => ({ ...current, question: e.target.value }))} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="space-y-2"><Label>Type</Label><Select value={form.type} onValueChange={(value) => setForm((current) => ({ ...current, type: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{QUESTION_TYPES.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label>Difficulty</Label><Select value={form.difficulty} onValueChange={(value) => setForm((current) => ({ ...current, difficulty: value as EditableQuestionForm['difficulty'] }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{DIFFICULTIES.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label>Category</Label><Select value={form.category} onValueChange={(value) => setForm((current) => ({ ...current, category: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{IQ_KPI_OPTIONS.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label>Sort Order</Label><Input type="number" min={0} value={form.sortOrder} onChange={(e) => setForm((current) => ({ ...current, sortOrder: e.target.value === '' ? '' : Number(e.target.value) }))} placeholder="Auto" /></div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><Label>Answer options</Label><Button type="button" variant="outline" size="sm" className="w-full sm:w-auto" onClick={addOption}><Plus className="mr-2 h-4 w-4" />Add Option</Button></div>
              {form.options.map((option, index) => (
                <div key={index} className="flex min-w-0 gap-2">
                  <Input value={option} onChange={(e) => handleOptionChange(index, e.target.value)} placeholder={`Option ${index + 1}`} />
                  <Button type="button" variant="outline" size="icon" className="shrink-0" onClick={() => removeOption(index)} disabled={form.options.length <= 2}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label>Correct answer</Label>
              <Select value={String(form.correctAnswer)} onValueChange={(value) => setForm((current) => ({ ...current, correctAnswer: Number(value) }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{form.options.map((option, index) => <SelectItem key={index} value={String(index)}>{`Option ${index + 1}${option.trim() ? `: ${option.trim()}` : ''}`}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Test tracks</Label>
              <div className="grid gap-3 md:grid-cols-2">
                {IQ_TEST_TYPE_OPTIONS.map((option) => (
                  <label key={option.value} className="flex items-start gap-3 rounded-lg border p-3 cursor-pointer">
                    <Checkbox checked={form.tests.includes(option.value as IQTestType)} onCheckedChange={(checked) => toggleTestType(option.value as IQTestType, Boolean(checked))} />
                    <div><p className="font-medium text-sm">{option.label}</p><p className="text-xs text-muted-foreground">{option.description}</p></div>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Explanation (optional)</Label>
              <Textarea
                value={form.explanation}
                onChange={(e) => setForm((current) => ({ ...current, explanation: e.target.value }))}
                placeholder="Add an explanation if you want one shown after answering"
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={resetForm}>Reset</Button>
              <Button type="button" onClick={handleSave} disabled={saving}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}{selectedQuestion ? 'Update Question' : 'Create Question'}</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="min-w-0 overflow-hidden">
          <CardHeader><CardTitle>Existing questions</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading questions…</div>
            ) : questions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No practice questions configured yet.</p>
            ) : paginatedQuestions.map((question) => (
              <div key={question.id} className="rounded-xl border p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium leading-snug">{question.question}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="outline">{question.type}</Badge>
                      <Badge variant="outline">{question.difficulty}</Badge>
                      <Badge variant="secondary">Order {question.sortOrder}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="icon" onClick={() => handleEdit(question)}><Pencil className="h-4 w-4" /></Button>
                    <Button type="button" variant="outline" size="icon" onClick={() => setDeleting(question)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{normalizeIQKpiCategory(question.category)}</p>
                <div className="flex flex-wrap gap-2">{question.tests.map((testType) => <Badge key={testType} className="border-0 bg-primary/10 text-primary">{formatIQTestType(testType)}</Badge>)}</div>
              </div>
            ))}

            {!loading && sortedQuestions.length > 0 ? (
              <div className="flex flex-col gap-2 border-t pt-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete practice question?</AlertDialogTitle>
            <AlertDialogDescription>This removes the question from both the admin panel and practice mode.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}