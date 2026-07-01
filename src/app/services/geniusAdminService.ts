import { Genius, GeniusEra, GeniusProfileType } from '../types/genius';
import { geniusProfilesApi } from '../../../utils/api-client';

export type PublicationStatus = 'draft' | 'published' | 'archived';

export interface GeniusCreatePayload {
  id?: string | null;
  full_name: string;
  iq_score?: number | null;
  birth_date?: string | null;
  death_date?: string | null;
  birth_place: string;
  zodiac_sign?: string | null;
  biography: string;
  short_description: string;
  era: GeniusEra;
  is_historical: boolean;
  is_fictional: boolean;
  profile_type: GeniusProfileType;
  publication_status?: PublicationStatus;
  editorial_note?: string;
  source_url?: string | null;
  profile_image_url?: string | null;
}

export interface GeniusUpdatePayload {
  full_name?: string;
  iq_score?: number | null;
  birth_date?: string | null;
  death_date?: string | null;
  birth_place?: string;
  zodiac_sign?: string | null;
  biography?: string;
  short_description?: string;
  era?: GeniusEra;
  is_historical?: boolean;
  is_fictional?: boolean;
  profile_type?: GeniusProfileType;
  publication_status?: PublicationStatus;
  editorial_note?: string;
  source_url?: string | null;
  profile_image_url?: string | null;
}

export interface GeniusListFilters {
  query?: string;
  status?: PublicationStatus;
  profile_type?: GeniusProfileType;
}

export interface GeniusAdminStats {
  total: number;
  published: number;
  draft: number;
  archived: number;
  living: number;
  fictional: number;
}

function toGenius(r: Awaited<ReturnType<typeof geniusProfilesApi.getById>>): Genius {
  return {
    id: r.id,
    slug: r.slug,
    full_name: r.full_name,
    iq_score: r.iq_score,
    iq_score_label: r.iq_score_label,
    iq_score_note: r.iq_score_note,
    birth_date: r.birth_date,
    death_date: r.death_date,
    birth_place: r.birth_place,
    zodiac_sign: r.zodiac_sign,
    profile_image_url: r.profile_image_url ?? null,
    banner_image_url: r.banner_image_url ?? null,
    image_attribution: r.image_attribution ?? null,
    biography: r.biography,
    short_description: r.short_description,
    era: r.era as GeniusEra,
    profile_type: r.profile_type as GeniusProfileType,
    is_historical: r.is_historical,
    is_fictional: r.is_fictional,
    source_url: r.source_url,
    editorial_note: r.editorial_note,
    publication_status: r.publication_status,
    created_at: r.created_at,
    updated_at: r.updated_at,
  };
}

export const geniusAdminService = {
  async list(filters: GeniusListFilters = {}): Promise<Genius[]> {
    const res = await geniusProfilesApi.list({
      query: filters.query,
      status: filters.status,
      profile_type: filters.profile_type,
    });
    return res.items.map(toGenius);
  },

  async stats(): Promise<GeniusAdminStats> {
    const res = await geniusProfilesApi.list();
    const items = res.items;
    return {
      total:     items.length,
      published: items.filter(g => g.publication_status === 'published').length,
      draft:     items.filter(g => g.publication_status === 'draft').length,
      archived:  items.filter(g => g.publication_status === 'archived').length,
      living:    items.filter(g => !g.death_date && !g.is_fictional).length,
      fictional: items.filter(g => g.is_fictional).length,
    };
  },

  async create(data: GeniusCreatePayload): Promise<Genius> {
    const res = await geniusProfilesApi.create(data);
    return toGenius(res);
  },

  async update(id: string, data: GeniusUpdatePayload): Promise<Genius> {
    const res = await geniusProfilesApi.update(id, data);
    return toGenius(res);
  },

  async updateStatus(id: string, status: PublicationStatus): Promise<Genius> {
    const res = await geniusProfilesApi.updateStatus(id, status);
    return toGenius(res);
  },

  async delete(id: string): Promise<boolean> {
    await geniusProfilesApi.delete(id);
    return true;
  },
};
