'use client';

import React, { useState } from 'react';
import { BookOpen, ArrowRight, CheckCircle, Sparkles, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { AICourseGenerator } from './AICourseGenerator';
import { CourseCreationWizard } from './CourseCreationWizard';

interface CourseCreationChoiceProps {
  onSaveDraftComplete?: (courseData: any) => void;
  onPublishComplete?: (courseData: any) => void;
  onCancel?: () => void;
  initialData?: any;
}

export function CourseCreationChoice({
  onSaveDraftComplete,
  onPublishComplete,
  onCancel,
  initialData,
}: CourseCreationChoiceProps) {
  const [creationMode, setCreationMode] = useState<'choice' | 'manual' | 'ai'>(
    initialData ? 'manual' : 'choice',
  );
  const [aiGeneratedData, setAiGeneratedData] = useState<any>(null);

  const wizardInitialData = aiGeneratedData || initialData || null;

  // Show Choice Screen
  if (creationMode === 'choice') {
    return (
      <div className='w-full min-h-screen bg-gradient-to-b from-background via-accent/30 to-background py-12'>
        <div className='max-w-5xl mx-auto px-4'>
          <div className='text-center mb-12'>
            <h1 className='text-4xl font-bold text-gray-900 mb-4'>
              Create New Course
            </h1>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              Choose how you'd like to create your course
            </p>
          </div>

          <div className='grid md:grid-cols-2 gap-8'>
            {/* AI Generation Option */}
            <div
              onClick={() => setCreationMode('ai')}
              className='group cursor-pointer bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30 hover:border-primary rounded-2xl p-8 transition-all hover:shadow-xl hover:scale-105'
            >
              <div className='bg-primary text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6'>
                <Sparkles className='w-10 h-10' />
              </div>
              <h2 className='text-2xl font-bold text-gray-900 mb-3'>
                Generate with AI
              </h2>
              <p className='text-gray-600 mb-6'>
                Let AI create your course structure in seconds. Perfect for
                getting started quickly with a professional framework.
              </p>
              <ul className='text-left space-y-2 text-sm text-gray-700'>
                <li className='flex items-start gap-2'>
                  <CheckCircle className='w-5 h-5 text-primary flex-shrink-0 mt-0.5' />
                  <span>Auto-generated curriculum structure</span>
                </li>
                <li className='flex items-start gap-2'>
                  <CheckCircle className='w-5 h-5 text-primary flex-shrink-0 mt-0.5' />
                  <span>Smart learning objectives & prerequisites</span>
                </li>
                <li className='flex items-start gap-2'>
                  <CheckCircle className='w-5 h-5 text-primary flex-shrink-0 mt-0.5' />
                  <span>Fully customizable after generation</span>
                </li>
                <li className='flex items-start gap-2'>
                  <CheckCircle className='w-5 h-5 text-primary flex-shrink-0 mt-0.5' />
                  <span>Save hours of planning time</span>
                </li>
              </ul>
              <div className='mt-8'>
                <div className='inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all'>
                  Start with AI
                  <ArrowRight className='w-5 h-5' />
                </div>
              </div>
            </div>

            {/* Manual Creation Option */}
            <div
              onClick={() => setCreationMode('manual')}
              className='group cursor-pointer rounded-2xl border-2 border-border bg-gradient-to-br from-muted/40 to-card p-8 transition-all hover:scale-105 hover:border-primary hover:shadow-xl dark:from-slate-900 dark:to-slate-950'
            >
              <div className='bg-[#395192] text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6'>
                <BookOpen className='w-10 h-10' />
              </div>
              <h2 className='mb-3 text-2xl font-bold text-foreground'>
                Create Manually
              </h2>
              <p className='mb-6 text-muted-foreground'>
                Build your course from scratch with full control over every
                detail. Best for experienced creators.
              </p>
              <ul className='space-y-2 text-left text-sm text-foreground/80'>
                <li className='flex items-start gap-2'>
                  <CheckCircle className='w-5 h-5 text-[#395192] flex-shrink-0 mt-0.5' />
                  <span>Complete creative control</span>
                </li>
                <li className='flex items-start gap-2'>
                  <CheckCircle className='w-5 h-5 text-[#395192] flex-shrink-0 mt-0.5' />
                  <span>AI assist available at every step</span>
                </li>
                <li className='flex items-start gap-2'>
                  <CheckCircle className='w-5 h-5 text-[#395192] flex-shrink-0 mt-0.5' />
                  <span>Step-by-step guided wizard</span>
                </li>
                <li className='flex items-start gap-2'>
                  <CheckCircle className='w-5 h-5 text-[#395192] flex-shrink-0 mt-0.5' />
                  <span>Build exactly what you envision</span>
                </li>
              </ul>
              <div className='mt-8'>
                <div className='inline-flex items-center gap-2 font-semibold text-primary transition-all group-hover:gap-3'>
                  Create Manually
                  <ArrowRight className='w-5 h-5' />
                </div>
              </div>
            </div>
          </div>

          <div className='text-center mt-12'>
            <button
              onClick={onCancel}
              className='text-gray-600 hover:text-gray-900 underline'
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show AI Generator
  if (creationMode === 'ai') {
    return (
      <div className='w-full min-h-screen bg-gradient-to-b from-background via-accent/30 to-background py-8'>
        <div className='max-w-6xl mx-auto px-4'>
          <AICourseGenerator
            onGenerate={(generatedData) => {
              setAiGeneratedData(generatedData);
              setCreationMode('manual');
              toast.success('Course generated! You can now customize it.');
            }}
            onCancel={() => setCreationMode('choice')}
          />
        </div>
      </div>
    );
  }

  // Show Manual Creation Wizard
  return (
    <div className='w-full min-h-screen bg-gradient-to-b from-background via-accent/30 to-background py-8'>
      <div className='max-w-6xl mx-auto px-4'>
        <CourseCreationWizard
          initialData={wizardInitialData}
          onSaveDraftComplete={onSaveDraftComplete}
          onPublishComplete={onPublishComplete}
          onCancel={() => {
            if (aiGeneratedData) {
              // If coming from AI generation, ask for confirmation
              if (
                window.confirm(
                  'Are you sure you want to discard your AI-generated course?',
                )
              ) {
                setAiGeneratedData(null);
                setCreationMode('choice');
              }
            } else {
              setCreationMode('choice');
            }
          }}
        />
      </div>
    </div>
  );
}
