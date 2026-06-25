import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Genius, GeniusEra, GeniusProfileType } from '../../types/genius';
import {
  geniusAdminService,
  GeniusCreatePayload,
  GeniusUpdatePayload,
  PublicationStatus,
  GeniusAdminStats,
} from '../../services/geniusAdminService';
import { storageApi } from '../../../../utils/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import {
  Search,
  Plus,
  Brain,
  Edit2,
  Archive,
  CheckCircle2,
  FileText,
  Users,
  Sparkles,
  X,
  Save,
  Loader2,
  AlertCircle,
  ImagePlus,
  Link,
  Upload,
  Trash2,
} from 'lucide-react';

// ─── helpers ─────────────────────────────────────────────────────────────────

const STATUS_META: Record<PublicationStatus, { label: string; className: string }> = {
  published: { label: 'Published', className: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
  draft:     { label: 'Draft',     className: 'bg-amber-100  text-amber-700  border-amber-300'  },
  archived:  { label: 'Archived',  className: 'bg-slate-100  text-slate-500  border-slate-300'  },
};

const TYPE_META: Record<GeniusProfileType, string> = {
  historical:          'Historical',
  public_intellectual: 'Public Intellectual',
  fictional:           'Fictional',
};

const ERA_OPTIONS: GeniusEra[] = [
  'Ancient', 'Classical', 'Medieval', 'Renaissance',
  'Enlightenment', 'Industrial', 'Modern', 'Contemporary',
];

const TYPE_OPTIONS: GeniusProfileType[] = ['historical', 'public_intellectual', 'fictional'];

const EMPTY_FORM: GeniusCreatePayload = {
  id: '',
  full_name: '',
  iq_score: null,
  birth_date: null,
  death_date: null,
  birth_place: '',
  zodiac_sign: null,
  biography: '',
  short_description: '',
  era: 'Modern',
  is_historical: true,
  is_fictional: false,
  profile_type: 'historical',
  publication_status: 'draft',
  editorial_note: '',
  profile_image_url: null,
};

const EMPTY_STATS: GeniusAdminStats = {
  total: 0, published: 0, draft: 0, archived: 0, living: 0, fictional: 0,
};

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i').replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u').replace(/ñ/g, 'n').replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// ─── ImagePicker ──────────────────────────────────────────────────────────────

interface ImagePickerProps {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  disabled?: boolean;
}

function ImagePicker({ value, onChange, disabled }: ImagePickerProps) {
  const [mode, setMode] = useState<'url' | 'upload'>('url');
  const [urlInput, setUrlInput] = useState(value ?? '');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const previewUrl = value || null;

  const applyUrl = (url: string) => {
    setImgError(false);
    onChange(url.trim() || null);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setUploading(true);
    try {
      const started = await storageApi.start({
        file_type: 'image',
        filename: file.name,
        mime_type: file.type,
        create_type: 'post',
      });
      const formData = new FormData();
      Object.entries(started.fields).forEach(([k, v]) => formData.append(k, v as string));
      formData.append('file', file);
      await fetch(started.url, { method: 'POST', body: formData });
      const finished = await storageApi.finish(started.id);
      onChange(finished.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      {/* Preview */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full border-2 border-dashed border-input bg-muted flex items-center justify-center overflow-hidden shrink-0">
          {previewUrl && !imgError ? (
            <img
              src={previewUrl}
              alt="Profile preview"
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <ImagePlus className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          {previewUrl ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground truncate max-w-[200px]">{previewUrl}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                disabled={disabled}
                onClick={() => { onChange(null); setUrlInput(''); setImgError(false); }}
              >
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </Button>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No image set</p>
          )}
        </div>
      </div>

      {/* Mode toggle */}
      <div className="flex rounded-md border border-input overflow-hidden text-xs">
        <button
          type="button"
          onClick={() => setMode('url')}
          disabled={disabled}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 transition-colors ${
            mode === 'url' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'
          }`}
        >
          <Link className="h-3 w-3" /> Paste URL
        </button>
        <button
          type="button"
          onClick={() => setMode('upload')}
          disabled={disabled}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 transition-colors border-l border-input ${
            mode === 'upload' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'
          }`}
        >
          <Upload className="h-3 w-3" /> Upload file
        </button>
      </div>

      {mode === 'url' ? (
        <div className="flex gap-2">
          <Input
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            placeholder="https://example.com/photo.jpg"
            disabled={disabled}
            className="text-xs"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled || !urlInput.trim()}
            onClick={() => applyUrl(urlInput)}
          >
            Apply
          </Button>
        </div>
      ) : (
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={disabled || uploading}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            disabled={disabled || uploading}
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? (
              <><Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" /> Uploading…</>
            ) : (
              <><Upload className="h-3.5 w-3.5 mr-2" /> Choose image</>
            )}
          </Button>
          {uploadError && (
            <p className="text-xs text-destructive mt-1">{uploadError}</p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, value, label, color }: {
  icon: React.ElementType;
  value: number;
  label: string;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="p-5 flex items-center gap-4">
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── EditPanel ────────────────────────────────────────────────────────────────

interface EditPanelProps {
  initial: GeniusCreatePayload | null;
  onSave: (data: GeniusCreatePayload) => void;
  onClose: () => void;
  isNew: boolean;
  saving: boolean;
}

function EditPanel({ initial, onSave, onClose, isNew, saving }: EditPanelProps) {
  const [form, setForm] = useState<GeniusCreatePayload>(initial ?? EMPTY_FORM);
  const [slugEdited, setSlugEdited] = useState(!isNew);

  const set = (key: keyof GeniusCreatePayload, value: unknown) =>
    setForm(f => ({ ...f, [key]: value }));

  // Auto-generate slug when full_name changes on new profiles
  const handleNameChange = (name: string) => {
    set('full_name', name);
    if (isNew && !slugEdited) {
      set('id', toSlug(name));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim()) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />

      <div className="w-full max-w-lg bg-card border-l shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">
            {isNew ? 'Add Genius Profile' : 'Edit Genius Profile'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} disabled={saving}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">

          {/* Profile image */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Profile Image</label>
            <ImagePicker
              value={form.profile_image_url}
              onChange={url => set('profile_image_url', url)}
              disabled={saving}
            />
          </div>

          {/* Full name */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Full Name <span className="text-destructive">*</span></label>
            <Input
              required
              value={form.full_name}
              onChange={e => handleNameChange(e.target.value)}
              placeholder="Albert Einstein"
              disabled={saving}
            />
          </div>

          {/* ID / slug */}
          <div className="space-y-1">
            <label className="text-sm font-medium">
              ID / Slug
              {isNew && <span className="ml-1 text-xs text-muted-foreground">(auto-generated)</span>}
            </label>
            <Input
              value={form.id ?? ''}
              disabled={!isNew || saving}
              onChange={e => {
                setSlugEdited(true);
                set('id', e.target.value.toLowerCase().replace(/\s+/g, '-'));
              }}
              placeholder="albert-einstein"
            />
            <p className="text-xs text-muted-foreground">Lowercase, hyphens only. Cannot change after creation.</p>
          </div>

          {/* Short description */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Short Description</label>
            <Input
              value={form.short_description}
              onChange={e => set('short_description', e.target.value)}
              placeholder="Up to 280 characters"
              disabled={saving}
            />
          </div>

          {/* Biography */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Biography</label>
            <textarea
              value={form.biography}
              onChange={e => set('biography', e.target.value)}
              rows={5}
              disabled={saving}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none disabled:opacity-50"
              placeholder="Full biographical text..."
            />
          </div>

          {/* Row: era + profile type */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Era</label>
              <select
                value={form.era}
                disabled={saving}
                onChange={e => set('era', e.target.value as GeniusEra)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              >
                {ERA_OPTIONS.map(era => (
                  <option key={era} value={era}>{era}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Profile Type</label>
              <select
                value={form.profile_type}
                disabled={saving}
                onChange={e => {
                  const t = e.target.value as GeniusProfileType;
                  set('profile_type', t);
                  set('is_fictional', t === 'fictional');
                  set('is_historical', t === 'historical');
                }}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              >
                {TYPE_OPTIONS.map(t => (
                  <option key={t} value={t}>{TYPE_META[t]}</option>
                ))}
              </select>
            </div>
          </div>

          {/* IQ score */}
          <div className="space-y-1">
            <label className="text-sm font-medium">IQ Score (estimate)</label>
            <Input
              type="number"
              min={1}
              max={300}
              disabled={saving}
              value={form.iq_score ?? ''}
              onChange={e => set('iq_score', e.target.value ? Number(e.target.value) : null)}
              placeholder="Leave blank if no verified figure exists"
            />
            <p className="text-xs text-muted-foreground">
              Displayed with an "est." qualifier. Do not enter a figure you cannot source.
            </p>
          </div>

          {/* Row: birth date + death date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Birth Date</label>
              <Input
                value={form.birth_date ?? ''}
                disabled={saving}
                onChange={e => set('birth_date', e.target.value || null)}
                placeholder="YYYY-MM-DD"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Death Date</label>
              <Input
                value={form.death_date ?? ''}
                disabled={saving}
                onChange={e => set('death_date', e.target.value || null)}
                placeholder="Blank if living"
              />
            </div>
          </div>

          {/* Birth place */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Birth Place</label>
            <Input
              value={form.birth_place}
              disabled={saving}
              onChange={e => set('birth_place', e.target.value)}
              placeholder="City, Country"
            />
          </div>

          {/* Editorial note */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Editorial Note</label>
            <textarea
              value={form.editorial_note ?? ''}
              disabled={saving}
              onChange={e => set('editorial_note', e.target.value)}
              rows={2}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none disabled:opacity-50"
              placeholder="Context note shown in the profile page (framing, caveats, etc.)"
            />
          </div>

          {/* Publication status */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Publication Status</label>
            <select
              value={form.publication_status ?? 'draft'}
              disabled={saving}
              onChange={e => set('publication_status', e.target.value as PublicationStatus)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </form>

        <div className="px-6 py-4 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={handleSubmit} type="submit" disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isNew ? 'Create Profile' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────

export function GeniusManagementPage() {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PublicationStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<GeniusProfileType | 'all'>('all');
  const [editTarget, setEditTarget] = useState<Genius | null>(null);
  const [showNewPanel, setShowNewPanel] = useState(false);

  const [allProfiles, setAllProfiles] = useState<Genius[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const profiles = await geniusAdminService.list();
      setAllProfiles(profiles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profiles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const stats = useMemo<GeniusAdminStats>(() => ({
    total:     allProfiles.length,
    published: allProfiles.filter(g => g.publication_status === 'published').length,
    draft:     allProfiles.filter(g => g.publication_status === 'draft').length,
    archived:  allProfiles.filter(g => g.publication_status === 'archived').length,
    living:    allProfiles.filter(g => !g.death_date && !g.is_fictional).length,
    fictional: allProfiles.filter(g => g.is_fictional).length,
  }), [allProfiles]);

  const profiles = useMemo(() => {
    let result = [...allProfiles];
    if (statusFilter !== 'all') result = result.filter(g => g.publication_status === statusFilter);
    if (typeFilter !== 'all')   result = result.filter(g => g.profile_type === typeFilter);
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        g => g.full_name.toLowerCase().includes(q) || g.short_description.toLowerCase().includes(q),
      );
    }
    return result;
  }, [allProfiles, statusFilter, typeFilter, query]);

  const handleStatusChange = async (id: string, status: PublicationStatus) => {
    try {
      await geniusAdminService.updateStatus(id, status);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const handleCreate = async (data: GeniusCreatePayload) => {
    setSaving(true);
    try {
      await geniusAdminService.create(data);
      setShowNewPanel(false);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create profile');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (data: GeniusCreatePayload) => {
    if (!editTarget) return;
    setSaving(true);
    const payload: GeniusUpdatePayload = {
      full_name:          data.full_name,
      iq_score:           data.iq_score,
      birth_date:         data.birth_date,
      death_date:         data.death_date,
      birth_place:        data.birth_place,
      zodiac_sign:        data.zodiac_sign,
      biography:          data.biography,
      short_description:  data.short_description,
      era:                data.era,
      profile_type:       data.profile_type,
      is_historical:      data.is_historical,
      is_fictional:       data.is_fictional,
      editorial_note:     data.editorial_note,
      publication_status: data.publication_status,
      profile_image_url:  data.profile_image_url,
    };
    try {
      await geniusAdminService.update(editTarget.id, payload);
      setEditTarget(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const geniusToForm = (g: Genius): GeniusCreatePayload => ({
    id:                 g.id,
    full_name:          g.full_name,
    iq_score:           g.iq_score,
    birth_date:         g.birth_date,
    death_date:         g.death_date,
    birth_place:        g.birth_place,
    zodiac_sign:        g.zodiac_sign,
    biography:          g.biography,
    short_description:  g.short_description,
    era:                g.era,
    is_historical:      g.is_historical,
    is_fictional:       g.is_fictional,
    profile_type:       g.profile_type,
    publication_status: g.publication_status,
    editorial_note:     g.editorial_note,
    profile_image_url:  g.profile_image_url,
  });

  const displayStats = loading ? EMPTY_STATS : stats;

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="mb-1">Genius Profiles</h1>
          <p className="text-muted-foreground">
            Manage the genius directory. IQ figures are editorial estimates — review carefully before publishing.
          </p>
        </div>
        <Button onClick={() => setShowNewPanel(true)} disabled={loading}>
          <Plus className="h-4 w-4 mr-2" />
          Add Profile
        </Button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
          <button className="ml-auto text-xs underline" onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users}        value={displayStats.total}     label="Total Profiles" color="bg-primary/10 text-primary" />
        <StatCard icon={CheckCircle2} value={displayStats.published} label="Published"       color="bg-emerald-100 text-emerald-600" />
        <StatCard icon={FileText}     value={displayStats.draft}     label="Drafts"          color="bg-amber-100 text-amber-600" />
        <StatCard icon={Sparkles}     value={displayStats.living}    label="Living Figures"  color="bg-blue-100 text-blue-600" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or description…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as PublicationStatus | 'all')}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>

        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value as GeniusProfileType | 'all')}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="all">All types</option>
          <option value="historical">Historical</option>
          <option value="public_intellectual">Public Intellectual</option>
          <option value="fictional">Fictional</option>
        </select>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            {loading ? 'Loading…' : `${profiles.length} profile${profiles.length !== 1 ? 's' : ''}`}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Era</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">IQ (est.)</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : profiles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                      No profiles match the current filters.
                    </td>
                  </tr>
                ) : (
                  profiles.map(g => {
                    const sm = STATUS_META[g.publication_status];
                    return (
                      <tr key={g.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {g.profile_image_url ? (
                              <img
                                src={g.profile_image_url}
                                alt={g.full_name}
                                className="w-8 h-8 rounded-full object-cover shrink-0 bg-muted"
                                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                                {g.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </div>
                            )}
                            <div>
                              <div className="font-medium">{g.full_name}</div>
                              <div className="text-xs text-muted-foreground line-clamp-1 max-w-[220px]">
                                {g.short_description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{g.era}</td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="text-xs">
                            {TYPE_META[g.profile_type]}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          {g.iq_score ? (
                            <span className="flex items-center gap-1 text-sm font-medium" title={g.iq_score_note}>
                              <Brain className="h-3.5 w-3.5 text-muted-foreground" />
                              ~{g.iq_score}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={g.publication_status}
                            onChange={e => handleStatusChange(g.id, e.target.value as PublicationStatus)}
                            className={`rounded-md border px-2 py-1 text-xs font-medium ${sm.className} focus-visible:outline-none`}
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" title="Edit" onClick={() => setEditTarget(g)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Archive"
                              disabled={g.publication_status === 'archived'}
                              onClick={() => handleStatusChange(g.id, 'archived')}
                            >
                              <Archive className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {editTarget && (
        <EditPanel
          initial={geniusToForm(editTarget)}
          onSave={handleUpdate}
          onClose={() => setEditTarget(null)}
          isNew={false}
          saving={saving}
        />
      )}

      {showNewPanel && (
        <EditPanel
          initial={null}
          onSave={handleCreate}
          onClose={() => setShowNewPanel(false)}
          isNew={true}
          saving={saving}
        />
      )}
    </div>
  );
}
