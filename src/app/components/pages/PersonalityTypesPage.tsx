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
import { Brain } from 'lucide-react';
import {
  MBTI_PROFILES,
  MBTI_FUNCTIONS,
  MBTI_STACK_ROLE_LABELS,
  getCognitiveFunctionImagePath,
  getMBTITypeImagePath,
  type MBTIType,
} from '../../data/mbtiData';

interface PersonalityTypesPageProps {
  onNavigate?: (page: string, data?: any) => void;
}

export function PersonalityTypesPage({ onNavigate }: PersonalityTypesPageProps) {
  const types = Object.keys(MBTI_PROFILES) as MBTIType[];

  return (
    <div className='container py-8 space-y-6 max-w-4xl'>
      <BackButton
        label='Back'
        fallbackPage='public-rankings'
        onNavigate={onNavigate ? (page) => onNavigate(page) : undefined}
        className='px-0 hover:bg-transparent'
      />

      <div className='text-center space-y-3'>
        <div className='mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center'>
          <Brain className='h-7 w-7 text-primary' />
        </div>
        <h1 className='text-2xl md:text-3xl'>The 16 Personality Types</h1>
        <p className='text-muted-foreground max-w-2xl mx-auto'>
          Explore the cognitive functions, traits, and notable figures associated
          with each MBTI personality type.
        </p>
      </div>

      <Card>
        <CardContent className='pt-6'>
          <Accordion type='single' collapsible className='w-full'>
            {types.map((type) => {
              const profile = MBTI_PROFILES[type];
              return (
                <AccordionItem key={type} value={type} className='mb-4 rounded-xl border px-4'>
                  <AccordionTrigger>
                    <div className='flex items-center gap-3 text-left'>
                      <div className='space-y-1'>
                        <div className='flex flex-wrap items-center gap-2'>
                          <span className='font-medium'>{profile.nickname}</span>
                          <Badge variant='secondary'>{type}</Badge>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className='space-y-6 pb-4'>
                      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4'>
                        {profile.stack.map((code, index) => {
                          const fn = MBTI_FUNCTIONS[code];
                          const roleLabel = MBTI_STACK_ROLE_LABELS[index];
                          return (
                            <div key={code} className='space-y-3'>
                              <img
                                src={getCognitiveFunctionImagePath(code)}
                                alt={`${code} icon`}
                                className='h-14 w-14 object-contain'
                              />
                              <p className='text-sm font-semibold'>
                                {roleLabel} - ({code}) {fn.name}
                              </p>
                              <p className='text-sm text-muted-foreground'>
                                <span className='font-semibold text-foreground'>{fn.sublabel}:</span>{' '}
                                {fn.description}
                              </p>
                            </div>
                          );
                        })}
                      </div>

                      <div className='space-y-3'>
                        <div className='overflow-hidden rounded-xl border bg-muted/20'>
                          <img
                            src={getMBTITypeImagePath(type)}
                            alt={`Illustration of ${type}`}
                            className='w-full h-auto object-cover'
                          />
                        </div>
                        <p className='text-xs italic text-muted-foreground'>Image of MBTI Type</p>
                      </div>

                      <div className='space-y-3'>
                        {profile.paragraphs.map((paragraph, index) => (
                          <p key={index} className='text-sm leading-7 text-muted-foreground'>
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
