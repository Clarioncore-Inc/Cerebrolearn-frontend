import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { PersonalityVoteBar } from './PersonalityVoteBar';
import { Vote } from 'lucide-react';
import {
  getAvailableSystemsForSubject,
  getVoteResults,
  getTotalVotes,
} from '../../data/personalityDatabaseData';
import { PDBVoteTally } from '../../types/personalityDatabase';

interface PersonalityVotingWidgetProps {
  subjectId: string;
}

/**
 * Self-contained voting widget backed by mock data. Anonymous votes are
 * simulated in local component state only (no backend yet).
 */
export function PersonalityVotingWidget({ subjectId }: PersonalityVotingWidgetProps) {
  const systems = useMemo(() => getAvailableSystemsForSubject(subjectId), [subjectId]);
  const [activeSystemId, setActiveSystemId] = useState(systems[0]?.id ?? 'mbti');
  const [localVotes, setLocalVotes] = useState<PDBVoteTally[]>([]);
  const [myVotes, setMyVotes] = useState<Record<string, string>>({});

  if (systems.length === 0) {
    return null;
  }

  const handleVote = (systemId: string, typeCode: string) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Vote className="w-5 h-5 text-[#395192]" />
          Community Personality Vote
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Cast your vote below — no account needed.
        </p>
      </CardHeader>
      <CardContent>
        <Tabs value={activeSystemId} onValueChange={setActiveSystemId}>
          <TabsList className="w-full flex-wrap h-auto">
            {systems.map(system => (
              <TabsTrigger key={system.id} value={system.id} className="flex-1">
                {system.shortLabel}
              </TabsTrigger>
            ))}
          </TabsList>
          {systems.map(system => (
            <TabsContent key={system.id} value={system.id} className="pt-4">
              <PersonalityVoteBar
                results={getResultsWithLocal(system.id)}
                totalVotes={getTotalWithLocal(system.id)}
                selectedType={myVotes[system.id] ?? null}
                onVote={typeCode => handleVote(system.id, typeCode)}
              />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
