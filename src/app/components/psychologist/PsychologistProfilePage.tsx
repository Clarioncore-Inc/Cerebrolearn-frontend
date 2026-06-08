import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ArrowLeft, Calendar, MapPin, Star, Award, Clock, Mail } from 'lucide-react';

interface PsychologistProfilePageProps {
  onNavigate: (page: string, data?: any) => void;
  backPage?: string;
  backData?: any;
  psychologist: {
    id: string;
    fullName: string;
    email: string;
    specialization: string;
    yearsOfExperience: string;
    location: string;
    bio: string;
    rating: number;
    reviewCount: number;
    sessionsCompleted: number;
    hourlyRate: number;
    avatar?: string;
    verified?: boolean;
  };
}

export function PsychologistProfilePage({ onNavigate, psychologist, backPage, backData }: PsychologistProfilePageProps) {
  const specializationLabel = psychologist.specialization
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  return (
    <div className="container max-w-5xl py-8 space-y-6">
      <Button variant="outline" onClick={() => onNavigate(backPage || 'browse-psychologists', backData)}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Psychologists
      </Button>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <Avatar className="h-24 w-24">
              <AvatarImage src={psychologist.avatar} />
              <AvatarFallback>{psychologist.fullName?.charAt(0).toUpperCase() || 'P'}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h1 className="text-3xl font-bold">{psychologist.fullName}</h1>
                  <p className="text-muted-foreground mt-1">{specializationLabel}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="secondary">{psychologist.yearsOfExperience} years experience</Badge>
                    {psychologist.verified ? <Badge variant="outline">Verified</Badge> : null}
                  </div>
                </div>

                <div className="flex flex-col gap-2 lg:min-w-[220px]">
                  <Button onClick={() => onNavigate('enhanced-book-appointment', { psychologist })}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Session
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-lg bg-muted/50 p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><Star className="h-4 w-4" /> Rating</div>
                  <p className="mt-2 text-xl font-semibold">{psychologist.rating.toFixed(1)} <span className="text-sm text-muted-foreground">({psychologist.reviewCount})</span></p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><Award className="h-4 w-4" /> Sessions</div>
                  <p className="mt-2 text-xl font-semibold">{psychologist.sessionsCompleted}</p>
                </div>
                {/* <div className="rounded-lg bg-muted/50 p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4" /> Hourly Rate</div>
                  <p className="mt-2 text-xl font-semibold">${psychologist.hourlyRate}</p>
                </div> */}
                <div className="rounded-lg bg-muted/50 p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4" /> Location</div>
                  <p className="mt-2 text-xl font-semibold">{psychologist.location}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>About</CardTitle>
            <CardDescription>Professional background and overview</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-7 text-muted-foreground whitespace-pre-wrap">
              {psychologist.bio || 'No bio available yet.'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact & Profile</CardTitle>
            <CardDescription>Quick profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Email</p>
              <div className="flex items-center gap-2 font-medium break-all"><Mail className="h-4 w-4" /> {psychologist.email}</div>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Specialization</p>
              <p className="font-medium">{specializationLabel}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Experience</p>
              <p className="font-medium">{psychologist.yearsOfExperience} years</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Location</p>
              <p className="font-medium">{psychologist.location}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}