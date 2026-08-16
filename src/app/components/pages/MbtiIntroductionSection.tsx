import React from 'react';
import { getCognitiveFunctionImagePath, type CognitiveFunctionCode } from '../../data/mbtiData';

const MBTI_OVERVIEW_PARAGRAPHS = [
  "Myers-Briggs Type Indicator (MBTI) is a psychological system designed to help individuals achieve self-discovery and information about other people through personality type. Based on Carl Jung's psychological type theory, Isabel Briggs Myers and Katharine Cook Briggs expanded it, MBTI categorizes people into 16 personality types based on assessing likes and dislikes for four dichotomies: Extraversion (E) or Introversion (I), Sensing (S) or Intuition (N), Thinking (T) or Feeling (F), and Judging (J) or Perceiving (P).",
  'These pairs reveal the way individuals perceive the world, make decisions, interact with others, and arrive at work and relationships. MBTI is applied widely in personal development, team building, education, and career development to facilitate enhanced intelligence, self-awareness, communication, and understanding among different people.',
];

const MBTI_COGNITIVE_FUNCTION_PARAGRAPHS = [
  "The cognitive functions are the psychological processes that form the basis of how each Myers-Briggs personality type perceives, thinks, and copes with the world. Derived from Carl Jung's theory of psychological type, these eight functions are different ways of perceiving information and making decisions. The functions belong to two general categories: Perceiving (how we take in information) and Judging (how we make decisions).",
  "There is both an introverted and extraverted version of each of the following: Sensing (Si/Se), Intuition (Ni/Ne), Thinking (Ti/Te), and Feeling (Fi/Fe). Every MBTI type has a unique 'function stack' — a hierarchized set of these four functions (dominant, auxiliary, tertiary, and inferior) — that defines their cognitive style. Insight into the cognitive functions provides an increased understanding of the 'how' of personality types, going beyond behavior to explain thought patterns, strengths, blind spots, and personal lines of development.",
];

const COGNITIVE_FUNCTIONS: Array<{
  code: CognitiveFunctionCode;
  title: string;
  label: string;
  description: string;
}> = [
  {
    code: 'Si',
    title: 'Introverted Sensing',
    label: 'Memory',
    description: 'Focuses on memories, and personal history.',
  },
  {
    code: 'Se',
    title: 'Extraverted Sensing',
    label: 'Visual-Spatial',
    description: 'Focuses on the present, concrete details, visual reality, and worldly experiences.',
  },
  {
    code: 'Ni',
    title: 'Introverted Intuition',
    label: 'Vision',
    description: 'Focuses on hidden pattern recognition, the future, and innovation.',
  },
  {
    code: 'Ne',
    title: 'Extraverted Intuition',
    label: 'Creativity',
    description: 'Focuses on worldly pattern recognition, brainstorming, ideas, and invention.',
  },
  {
    code: 'Ti',
    title: 'Introverted Thinking',
    label: 'Logic',
    description: 'Focuses on internal logic, systems, and analysis.',
  },
  {
    code: 'Te',
    title: 'Extraverted Thinking',
    label: 'Structuring',
    description: 'Focuses on external logic, planning, structuring, and efficiency.',
  },
  {
    code: 'Fi',
    title: 'Introverted Feeling',
    label: 'Integrity',
    description: 'Focuses on personal values, beliefs, and authenticity.',
  },
  {
    code: 'Fe',
    title: 'Extraverted Feeling',
    label: 'Connecting',
    description: 'Focuses on social harmony, relationships, and empathy.',
  },
];

export function MbtiIntroductionSection() {
  return (
    <div className='overflow-hidden rounded-2xl border bg-background shadow-sm'>
      <div className='space-y-8 p-6'>
        <div className='grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,420px)] lg:items-start'>
          <div className='space-y-4'>
            <h3 className='text-2xl font-semibold tracking-tight'>What is MBTI?</h3>
            {MBTI_OVERVIEW_PARAGRAPHS.map((paragraph) => (
              <p key={paragraph} className='text-sm leading-7 text-muted-foreground md:text-base'>
                {paragraph}
              </p>
            ))}
          </div>

          <div className='overflow-hidden rounded-3xl border bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)]'>
            <img src='/assets/mbti.svg' alt='MBTI illustration' className='h-auto w-full object-cover' />
          </div>
        </div>

        <div className='space-y-4 border-t pt-8'>
          <h3 className='text-2xl font-semibold tracking-tight'>What are MBTI Cognitive Functions?</h3>
          {MBTI_COGNITIVE_FUNCTION_PARAGRAPHS.map((paragraph) => (
            <p key={paragraph} className='text-sm leading-7 text-muted-foreground md:text-base'>
              {paragraph}
            </p>
          ))}

          <div className='grid grid-cols-1 gap-6 pt-2 sm:grid-cols-2 xl:grid-cols-4'>
            {COGNITIVE_FUNCTIONS.map(({ code, title, label, description }) => (
              <div key={code} className='space-y-3'>
                <img
                  src={getCognitiveFunctionImagePath(code)}
                  alt={`${code} icon`}
                  className='h-14 w-14 object-contain'
                />
                <div className='space-y-1.5'>
                  <p className='text-base font-semibold'>
                    ({code}) {title}
                  </p>
                  <p className='text-sm leading-6 text-muted-foreground'>
                    <span className='font-semibold text-foreground'>{label}:</span> {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}