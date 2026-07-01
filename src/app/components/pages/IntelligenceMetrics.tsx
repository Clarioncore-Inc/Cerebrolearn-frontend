import React, { useEffect, useState } from 'react';
import { Users, Brain, Trophy, Zap } from 'lucide-react';

interface Metric {
  icon: React.ElementType;
  value: string;
  label: string;
  color: string;
}

export function IntelligenceMetrics() {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(true);
  }, []);

  const metrics: Metric[] = [
    {
      icon: Users,
      value: '50K+',
      label: 'Active Learners',
      color: '#395192'
    },
    {
      icon: Brain,
      value: '100K+',
      label: 'IQ Tests Taken',
      color: '#06b6d4'
    },
    {
      icon: Trophy,
      value: '1000+',
      label: 'Geniuses',
      color: '#f59e0b'
    },
    {
      icon: Zap,
      value: '95%',
      label: 'Success Rate',
      color: '#10b981'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <div
            key={index}
            className="glass-ai rounded-2xl p-4 md:p-6 hover:scale-105 transition-all duration-500 cursor-pointer group"
            style={{
              opacity: animated ? 1 : 0,
              transform: animated ? 'translateY(0)' : 'translateY(20px)',
              transition: `all 600ms ease-out ${index * 100}ms`
            }}
          >
            <div className="flex flex-col items-center text-center space-y-2">
              <div
                className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                style={{
                  background: `linear-gradient(135deg, ${metric.color}20, ${metric.color}10)`
                }}
              >
                <Icon
                  className="w-6 h-6 md:w-7 md:h-7"
                  style={{ color: metric.color }}
                />
              </div>

              <div className="text-2xl md:text-3xl font-bold" style={{ color: metric.color }}>
                {metric.value}
              </div>

              <div className="text-xs md:text-sm text-muted-foreground font-medium">
                {metric.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
