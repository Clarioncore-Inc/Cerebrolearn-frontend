import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Vote } from 'lucide-react';
import { PersonalityVoteBar } from './PersonalityVoteBar';
import {
  getAvailableSystemsForSubject,
  getVoteResults,
  getTotalVotes,
} from '../../data/personalityDatabaseData';
import { PDBVoteTally } from '../../types/personalityDatabase';
import { useAuth } from '../../contexts/AuthContext';

interface PersonalityVotingWidgetProps {
  subjectId: string;
  onRequireSignIn: () => void;
}

/**
 * Self-contained voting widget backed by mock data. Votes require a signed
 * in user; anonymous voting is no longer supported.
 */
export function PersonalityVotingWidget({ subjectId, onRequireSignIn }: PersonalityVotingWidgetProps) {
  const { user } = useAuth();
  const systems = useMemo(() => getAvailableSystemsForSubject(subjectId), [subjectId]);
  const [localVotes, setLocalVotes] = useState<PDBVoteTally[]>([]);
  const [myVotes, setMyVotes] = useState<Record<string, string>>({});

  if (systems.length === 0) {
    return null;
  }

  const handleVote = (systemId: string, typeCode: string) => {
    if (!user) {
      onRequireSignIn();
      return;
    }

    const alreadyVotedFor = myVotes[systemId];
    if (alreadyVotedFor === typeCode) return; // no-op, already voted this type

    setLocalVotes(prev => {
      const withoutOldVote = alreadyVotedFor
        ? prev.filter(v => !(v.subjectId === subjectId && v.systemId === systemId && v.typeCode === alreadyVotedFor))
        : prev;
      const existing = withoutOldVote.find(
        v => v.subjectId === subjectId && v.systemId === systemId && v.typeCode === typeCode,
      );
      if (existing) {
        return withoutOldVote.map(v => (v === existing ? { ...v, votes: v.votes + 1 } : v));
      }
      return [...withoutOldVote, { subjectId, systemId: systemId as PDBVoteTally['systemId'], typeCode, votes: 1 }];
    });

    setMyVotes(prev => ({ ...prev, [systemId]: typeCode }));
  };

  const getResultsWithLocal = (systemId: string) => {
    const base = getVoteResults(subjectId, systemId);
    const removed = myVotes[systemId];
    const localForSystem = localVotes.filter(v => v.systemId === systemId);

    const merged = new Map(base.map(r => [r.typeCode, { ...r }]));
    localForSystem.forEach(v => {
      const existing = merged.get(v.typeCode);
      if (existing) {
        existing.votes += v.votes;
      } else {
        merged.set(v.typeCode, { typeCode: v.typeCode, typeName: v.typeCode, votes: v.votes, percentage: 0 });
      }
    });

    const total = Array.from(merged.values()).reduce((sum, r) => sum + r.votes, 0);
    return Array.from(merged.values())
      .map(r => ({ ...r, percentage: total > 0 ? Math.round((r.votes / total) * 1000) / 10 : 0 }))
      .sort((a, b) => b.votes - a.votes);
  };

  const getTotalWithLocal = (systemId: string) => {
    const base = getTotalVotes(subjectId, systemId);
    const local = localVotes.filter(v => v.systemId === systemId).reduce((sum, v) => sum + v.votes, 0);
    return base + local;
  };

  const totalCommunityVotes = systems.reduce((sum, system) => sum + getTotalWithLocal(system.id), 0);
  const formattedTotalVotes = new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(totalCommunityVotes);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Vote className="w-5 h-5 text-[#395192]" />
              Community Personality Vote
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {formattedTotalVotes} votes across {systems.length} systems
            </p>
          </div>

          {!user ? (
            <Button onClick={onRequireSignIn} className="w-full sm:w-auto bg-[#395192] hover:bg-[#395192]/90 text-white">
              <Vote className="w-4 h-4" />
              Vote / Comment
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">Click any type card below to cast your vote.</p>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {systems.map(system => (
            <div key={system.id} className="rounded-xl border bg-muted/20 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-foreground">{system.label}</h3>
                  <p className="text-xs text-muted-foreground">{getTotalWithLocal(system.id).toLocaleString()} votes</p>
                </div>
              </div>

              <PersonalityVoteBar
                results={getResultsWithLocal(system.id).slice(0, 4)}
                totalVotes={getTotalWithLocal(system.id)}
                selectedType={myVotes[system.id] ?? null}
                onVote={typeCode => handleVote(system.id, typeCode)}
                interactive={!!user}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
