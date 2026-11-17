import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Misc';
import { Button } from '../../components/ui/Button';
import { apiClient } from '../../lib/apiClient';
import { FileText, ShieldAlert, Sparkles, CheckSquare, Wrench, Layers, HelpCircle } from 'lucide-react';

export function BlueprintViewer({ onOpenLab }) {
  const [ideaInput, setIdeaInput] = useState('Help farmers know when their soil is dry so they save water');
  const [loading, setLoading] = useState(false);
  const [blueprint, setBlueprint] = useState(null);
  const [completedSteps, setCompletedSteps] = useState({});

  const handleGenerate = async () => {
    if (!ideaInput.trim()) return;
    setLoading(true);
    try {
      const res = await apiClient.generateBlueprint({
        gradeBand: 'primary',
        idea: ideaInput,
        ideaSummary: {
          goal: ideaInput,
          mode: 'hardware',
        },
      });
      setBlueprint(res.blueprint);
      setCompletedSteps({});
    } catch (err) {
      alert(`Blueprint error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleStep = (idx) => {
    setCompletedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header & Prompt Generator */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-line-subtle pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-400" />
            <h2 className="text-lg font-bold font-display text-ink-primary">Invention Blueprint Generator</h2>
          </div>
          <Badge tone="purple">AI-Guided Architecture</Badge>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={ideaInput}
            onChange={(e) => setIdeaInput(e.target.value)}
            placeholder="Describe what you want to invent..."
            className="flex-1 bg-surface-raised border border-line-subtle rounded-lg px-4 py-2 text-sm text-ink-primary focus:outline-none focus:border-primary-400"
          />
          <Button onClick={handleGenerate} loading={loading}>
            Generate Blueprint
          </Button>
        </div>
      </Card>

      {/* Blueprint Content */}
      {blueprint && (
        <div className="space-y-6 animate-fadeIn">
          {/* Overview Banner */}
          <Card className="p-6 border-primary-500/30 bg-surface/90 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Badge tone="info">Mode: {blueprint.mode.toUpperCase()}</Badge>
              {blueprint.labId === 'soil_moisture' && onOpenLab && (
                <Button size="sm" variant="secondary" onClick={onOpenLab}>
                  Open Interactive Soil Lab →
                </Button>
              )}
            </div>
            <h3 className="text-2xl font-bold font-display text-ink-primary">{blueprint.title}</h3>
            <p className="text-sm text-ink-secondary leading-relaxed">{blueprint.problemStatement}</p>
            <p className="text-xs text-ink-muted leading-relaxed">{blueprint.howItWorks}</p>
          </Card>

          {/* Components & Zero-Cost Household Alternatives */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-line-subtle pb-2">
              <Wrench className="w-4 h-4 text-warning" />
              <h4 className="font-semibold text-sm text-ink-primary">Components & Household Alternatives</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {blueprint.components.map((comp, idx) => (
                <div key={idx} className="p-3 bg-surface-raised rounded-lg border border-line-subtle space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-ink-primary">{comp.name}</span>
                    <Badge tone={comp.costTier === 'low' ? 'success' : 'warning'}>
                      {comp.costTier.toUpperCase()} COST
                    </Badge>
                  </div>
                  <p className="text-xs text-ink-muted">{comp.purpose}</p>
                  {comp.alternatives?.length > 0 && (
                    <div className="p-2 bg-bg-base/70 rounded text-[11px] text-primary-400">
                      <span className="font-semibold text-ink-primary">💡 Household Hack: </span>
                      {comp.alternatives[0].name} — {comp.alternatives[0].note}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Build Steps Timeline */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-line-subtle pb-2">
              <Layers className="w-4 h-4 text-primary-400" />
              <h4 className="font-semibold text-sm text-ink-primary">Step-by-Step Build Roadmap</h4>
            </div>

            <div className="space-y-4">
              {blueprint.buildSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-surface-raised/60 rounded-xl border border-line-subtle">
                  <button
                    onClick={() => toggleStep(idx)}
                    className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      completedSteps[idx]
                        ? 'bg-success text-white shadow-[0_0_12px_rgba(52,211,153,0.4)]'
                        : 'bg-surface-raised border border-line-strong text-ink-secondary hover:border-primary-400'
                    }`}
                  >
                    {completedSteps[idx] ? '✓' : idx + 1}
                  </button>

                  <div className="flex-1 space-y-1.5">
                    <h5 className={`font-semibold text-sm ${completedSteps[idx] ? 'line-through text-ink-muted' : 'text-ink-primary'}`}>
                      {step.title}
                    </h5>
                    <ul className="list-disc list-inside text-xs text-ink-secondary space-y-1">
                      {step.instructions.map((ins, i) => (
                        <li key={i}>{ins}</li>
                      ))}
                    </ul>
                    <p className="text-[11px] text-ink-muted italic">Why: {step.why}</p>
                    {step.safetyNote && (
                      <div className="mt-1 p-2 bg-warning/10 border border-warning/30 rounded text-[11px] text-warning flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{step.safetyNote}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Test Plan */}
          <Card className="p-5 space-y-3">
            <div className="flex items-center gap-2 border-b border-line-subtle pb-2">
              <CheckSquare className="w-4 h-4 text-success" />
              <h4 className="font-semibold text-sm text-ink-primary">Test & Verification Plan</h4>
            </div>
            <div className="space-y-2">
              {blueprint.testPlan.map((test, idx) => (
                <div key={idx} className="p-3 bg-surface-raised rounded-lg text-xs space-y-1">
                  <p className="font-semibold text-ink-primary">Q: {test.question}</p>
                  <p className="text-ink-secondary">How: {test.howToTest}</p>
                  <p className="text-success font-medium">Expected: {test.expectedObservation}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
