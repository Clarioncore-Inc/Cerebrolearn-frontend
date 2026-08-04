import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Lock } from 'lucide-react';

interface SignInCTAProps {
  title: string;
  description: string;
  buttonLabel?: string;
  onSignIn: () => void;
}

/**
 * Shown in place of interactive voting/commenting UI when the visitor is
 * not signed in. Anonymous participation is no longer supported.
 */
export function SignInCTA({ title, description, buttonLabel = 'Sign In to Continue', onSignIn }: SignInCTAProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center text-center gap-4 py-12 px-6">
        <div className="w-14 h-14 rounded-full bg-[#395192]/10 flex items-center justify-center">
          <Lock className="w-6 h-6 text-[#395192]" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">{description}</p>
        </div>
        <Button onClick={onSignIn} className="bg-[#395192] hover:bg-[#395192]/90 text-white">
          {buttonLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
