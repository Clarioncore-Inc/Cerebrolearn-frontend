import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { BackButton } from '../ui/back-button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { Sparkles } from 'lucide-react';
import {
  ZODIAC_PROFILES,
  getZodiacParagraphs,
  type ZodiacSign,
} from '../../data/zodiacData';

const ZODIAC_SIGNS_PAGE_NAME = 'This individual';
const ZODIAC_SIGNS_PAGE_BIRTH_DATE = 'their birthdate';

interface ZodiacSignsPageProps {
  onNavigate?: (page: string, data?: any) => void;
}

export function ZodiacSignsPage({ onNavigate }: ZodiacSignsPageProps) {
  const signs = Object.keys(ZODIAC_PROFILES) as ZodiacSign[];

  return (
    <div className='container py-8 space-y-6 max-w-4xl'>
      <BackButton
        label='Back'
        fallbackPage='profile'
        onNavigate={onNavigate ? (page) => onNavigate(page) : undefined}
        className='px-0 hover:bg-transparent'
      />

      <div className='text-center space-y-3'>
        <div className='mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center'>
          <Sparkles className='h-7 w-7 text-primary' />
        </div>
        <h1 className='text-2xl md:text-3xl'>The 12 Zodiac Signs</h1>
        <p className='text-muted-foreground max-w-2xl mx-auto'>
          Explore the element, modality, ruling planet, and personality archetype
          associated with every zodiac sign.
        </p>
      </div>

      <Card>
        <CardContent className='pt-6'>
          <Accordion type='single' collapsible className='w-full'>
            {signs.map((sign) => {
              const profile = ZODIAC_PROFILES[sign];
              const paragraphs = getZodiacParagraphs(
                sign,
                ZODIAC_SIGNS_PAGE_NAME,
                ZODIAC_SIGNS_PAGE_BIRTH_DATE,
              );
              return (
                <AccordionItem key={sign} value={sign} className='mb-4 rounded-xl border px-4'>
                  <AccordionTrigger>
                    <div className='flex items-center gap-3 text-left'>
                      <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border bg-muted/40 p-2'>
                        <img
                          src={`/assets/${sign.toLowerCase()}_symbol.png`}
                          alt={`${sign} symbol`}
                          className='max-h-full max-w-full object-contain'
                        />
                      </div>
                      <div className='space-y-1'>
                        <div className='flex flex-wrap items-center gap-2'>
                          <span className='font-medium'>
                            {sign} ({profile.symbolName})
                          </span>
                          <Badge variant='secondary'>{profile.archetype}</Badge>
                          <Badge variant='secondary'>{profile.mbtiArchetype}</Badge>
                        </div>
                        <p className='text-sm text-muted-foreground'>{profile.dateRangeLabel}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className='space-y-6 pb-4'>
                      <div className='flex flex-wrap gap-2'>
                        <Badge variant='outline'>{profile.modality}</Badge>
                        <Badge variant='outline'>{profile.element}</Badge>
                        <Badge variant='outline'>Ruled by {profile.rulingPlanet}</Badge>
                        {profile.influencePlanet && (
                          <Badge variant='outline'>Influenced by {profile.influencePlanet}</Badge>
                        )}
                        {profile.exaltationPlanet && (
                          <Badge variant='outline'>{profile.exaltationPlanet} Exaltation</Badge>
                        )}
                      </div>

                      <div className='space-y-3'>
                        <div className='overflow-hidden rounded-xl border bg-muted/20'>
                          <img
                            src={`/assets/${sign.toLowerCase()}.png`}
                            alt={`Illustration of ${sign}`}
                            className='w-full h-auto object-cover'
                          />
                        </div>
                        <p className='text-xs italic text-muted-foreground'>Image of a {sign}</p>
                      </div>

                      <div className='space-y-3'>
                        <h4 className='text-base font-semibold'>
                          What the Sun in {sign} Means Regarding Intelligence:
                        </h4>
                        {paragraphs.map((paragraph, index) => (
                          <p key={index} className='text-sm text-muted-foreground'>
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
