import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import {
    createInitialVmState,
    createRuntimeSnapshot,
    createRuntimeView,
    exportBundle,
    hydrateSnapshot,
    importBundle,
    restoreSnapshot,
    serializeSnapshot,
    stepVm,
} from '@/symbiont/engine';
import { cn } from '@/lib/utils';
import { dashboard, lab } from '@/routes';
import type {
    BreadcrumbItem,
    ExperimentConfig,
    SymbiontRunStatus,
    SymbiontPreset,
    SymbiontStoredSnapshot,
    SymbiontVmState,
} from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
    {
        title: 'Lab',
        href: lab(),
    },
];

const presets: SymbiontPreset[] = [
    {
        id: 'noise-field',
        name: 'Noise Field',
        description: 'A high-entropy baseline for watching random structure form and collapse.',
    },
    {
        id: 'minimal-replicator',
        name: 'Minimal Replicator',
        description: 'A seeded environment tuned to inspect simple self-copying motifs.',
    },
    {
        id: 'phase-transition-hunt',
        name: 'Phase Transition Hunt',
        description: 'A search mode optimized to surface abrupt complexity shifts over long runs.',
    },
];

const initialConfig: ExperimentConfig = {
    name: 'Seed 88291 Trial',
    presetId: 'phase-transition-hunt',
    seed: 88291,
    worldSize: 4096,
    entropyRate: 12,
    mutationRate: 3,
    instructionSetVersion: 'bff-v1-alpha',
    stopTicks: 4200000,
    stepsPerTick: 128,
    jumpDistance: 7,
};

const quickStartSteps = [
    '1. Pick a preset to decide what kind of emergence you want to hunt.',
    '2. Press Start run to execute the actual deterministic VM from your current seed.',
    '3. Watch the heatmap for hotspots and the vitality chart for rising structure.',
    '4. Capture a snapshot when the run looks interesting, then replay it from the saved list.',
];

const SNAPSHOT_STORAGE_KEY = 'symbiont.lab.snapshots';

export default function Lab() {
    const [config, setConfig] = useState<ExperimentConfig>(initialConfig);
    const [status, setStatus] = useState<SymbiontRunStatus>('idle');
    const [vmState, setVmState] = useState<SymbiontVmState>(() => createInitialVmState(initialConfig));
    const [hasSavedDraft, setHasSavedDraft] = useState(false);
    const [snapshots, setSnapshots] = useState<SymbiontStoredSnapshot[]>([]);
    const [bundleMessage, setBundleMessage] = useState<string | null>(null);

    const runtimeView = useMemo(() => createRuntimeView(config, vmState, status), [config, status, vmState]);
    const metrics = runtimeView.metrics;
    const heatmap = runtimeView.heatmap;
    const events = runtimeView.events;
    const inspector = runtimeView.inspector;

    const selectedPreset = useMemo(
        () => presets.find((preset) => preset.id === config.presetId) ?? presets[0],
        [config.presetId],
    );

    useEffect(() => {
        if (status !== 'running') {
            return;
        }

        const interval = window.setInterval(() => {
            setVmState((current) => {
                const next = stepVm(config, current);

                if (next.tick >= config.stopTicks || next.halted) {
                    window.clearInterval(interval);
                    setStatus('complete');
                }

                return next;
            });
        }, 350);

        return () => window.clearInterval(interval);
    }, [config, status]);

    const activeMetric = useMemo(() => {
        return metrics.reduce((closest, point) => (point.tick <= vmState.tick ? point : closest), metrics[0]);
    }, [metrics, vmState.tick]);

    const explanation =
        status === 'idle'
            ? 'This page now runs a real deterministic VM in the browser. Start a run and every panel will update from actual tape state.'
            : status === 'running'
              ? 'The VM is executing bounded opcode steps on the seeded tape. Heatmap, metrics, and events all come from the same runtime state.'
              : status === 'paused'
                ? 'The VM is paused so you can inspect the current state before resuming.'
                : 'The VM reached a bounded stop condition, leaving the final runtime state available for inspection.';

    const handleStartRun = () => {
        setVmState(createInitialVmState(config));
        setStatus('running');
    };

    const handlePauseResume = () => {
        setStatus((current) => (current === 'running' ? 'paused' : 'running'));
    };

    const handleReset = () => {
        setVmState(createInitialVmState(config));
        setStatus('idle');
    };

    useEffect(() => {
        setVmState(createInitialVmState(config));
        setStatus('idle');
    }, [config.presetId, config.seed, config.worldSize, config.entropyRate, config.mutationRate, config.stopTicks]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const storedSnapshots = window.localStorage.getItem(SNAPSHOT_STORAGE_KEY);

        if (!storedSnapshots) {
            return;
        }

        try {
            setSnapshots(JSON.parse(storedSnapshots) as SymbiontStoredSnapshot[]);
        } catch {
            setSnapshots([]);
        }
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        window.localStorage.setItem(SNAPSHOT_STORAGE_KEY, JSON.stringify(snapshots));
    }, [snapshots]);

    const handleCaptureSnapshot = () => {
        const snapshot = createRuntimeSnapshot(config, vmState);

        setSnapshots((current) => [serializeSnapshot(snapshot), ...current].slice(0, 6));
    };

    const handleReplaySnapshot = (snapshotId: string) => {
        const storedSnapshot = snapshots.find((snapshot) => snapshot.id === snapshotId);

        if (!storedSnapshot) {
            return;
        }

        const restored = restoreSnapshot(hydrateSnapshot(storedSnapshot));
        setConfig(restored.config);
        setVmState(restored.state);
        setStatus('paused');
    };

    const handleExportBundle = (snapshotId: string) => {
        if (typeof window === 'undefined') {
            return;
        }

        const snapshot = snapshots.find((entry) => entry.id === snapshotId);

        if (!snapshot) {
            return;
        }

        const bundleContent = exportBundle(snapshot);
        const blob = new Blob([bundleContent], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = window.document.createElement('a');

        link.href = url;
        link.download = `${snapshot.label.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'experiment'}.symb`;
        link.click();
        window.URL.revokeObjectURL(url);
        setBundleMessage(`Exported ${snapshot.label} as a .SYMB bundle.`);
    };

    const handleImportBundle = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        try {
            const content = await file.text();
            const snapshot = importBundle(content);
            const restored = restoreSnapshot(hydrateSnapshot(snapshot));

            setSnapshots((current) => [snapshot, ...current.filter((entry) => entry.id !== snapshot.id)].slice(0, 6));
            setConfig(restored.config);
            setVmState(restored.state);
            setStatus('paused');
            setBundleMessage(`Imported ${snapshot.label} from .SYMB bundle.`);
        } catch (error) {
            setBundleMessage(error instanceof Error ? error.message : 'Unable to import bundle.');
        } finally {
            event.target.value = '';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lab" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <CardTitle>How the Lab Works</CardTitle>
                                <CardDescription>{explanation}</CardDescription>
                            </div>
                            <Badge variant={status === 'running' ? 'default' : 'outline'}>
                                {status === 'idle'
                                    ? 'Not started'
                                    : status === 'running'
                                      ? 'Running'
                                      : status === 'paused'
                                        ? 'Paused for inspection'
                                        : 'Run complete'}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
                        <div className="grid gap-3 sm:grid-cols-2">
                            {quickStartSteps.map((step) => (
                                <div key={step} className="rounded-lg border bg-muted/20 p-3 text-sm text-muted-foreground">
                                    {step}
                                </div>
                            ))}
                        </div>
                        <div className="rounded-lg border bg-muted/20 p-4 text-sm">
                            <p className="font-medium">What you are seeing</p>
                            <ul className="mt-3 space-y-2 text-muted-foreground">
                                <li>The left panel controls the seeded experiment setup.</li>
                                <li>The heatmap is generated from the live VM tape.</li>
                                <li>The vitality chart summarizes the current runtime state into research metrics.</li>
                                <li>The genome inspector decodes opcodes near the active pointer region.</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <CardTitle>Experiment Controls</CardTitle>
                                    <CardDescription>
                                        Configure a deterministic run and scaffold the first Symbiont lab workflow.
                                    </CardDescription>
                                </div>
                                <Badge variant="secondary">MVP</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="preset">Starter preset</Label>
                                <Select
                                    value={config.presetId}
                                    onValueChange={(value) =>
                                        setConfig((current) => ({
                                            ...current,
                                            presetId: value as ExperimentConfig['presetId'],
                                        }))
                                    }
                                >
                                    <SelectTrigger className="w-full" id="preset">
                                        <SelectValue placeholder="Select a preset" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {presets.map((preset) => (
                                            <SelectItem key={preset.id} value={preset.id}>
                                                {preset.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-muted-foreground text-sm">{selectedPreset.description}</p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor="name">Experiment name</Label>
                                    <Input
                                        id="name"
                                        value={config.name}
                                        onChange={(event) =>
                                            setConfig((current) => ({
                                                ...current,
                                                name: event.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="seed">Seed</Label>
                                    <Input
                                        id="seed"
                                        type="number"
                                        value={config.seed}
                                        onChange={(event) =>
                                            setConfig((current) => ({
                                                ...current,
                                                seed: Number(event.target.value),
                                            }))
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="worldSize">World size</Label>
                                    <Input
                                        id="worldSize"
                                        type="number"
                                        value={config.worldSize}
                                        onChange={(event) =>
                                            setConfig((current) => ({
                                                ...current,
                                                worldSize: Number(event.target.value),
                                            }))
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="entropyRate">Entropy rate</Label>
                                    <Input
                                        id="entropyRate"
                                        type="number"
                                        value={config.entropyRate}
                                        onChange={(event) =>
                                            setConfig((current) => ({
                                                ...current,
                                                entropyRate: Number(event.target.value),
                                            }))
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="mutationRate">Mutation rate</Label>
                                    <Input
                                        id="mutationRate"
                                        type="number"
                                        value={config.mutationRate}
                                        onChange={(event) =>
                                            setConfig((current) => ({
                                                ...current,
                                                mutationRate: Number(event.target.value),
                                            }))
                                        }
                                    />
                                </div>
                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor="instructionSetVersion">Instruction set version</Label>
                                    <Input
                                        id="instructionSetVersion"
                                        value={config.instructionSetVersion}
                                        onChange={(event) =>
                                            setConfig((current) => ({
                                                ...current,
                                                instructionSetVersion: event.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor="stopTicks">Stop ticks</Label>
                                    <Input
                                        id="stopTicks"
                                        type="number"
                                        value={config.stopTicks}
                                        onChange={(event) =>
                                            setConfig((current) => ({
                                                ...current,
                                                stopTicks: Number(event.target.value),
                                            }))
                                        }
                                    />
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Button type="button" onClick={handleStartRun}>
                                    Start run
                                </Button>
                                <Button type="button" variant="outline" onClick={handlePauseResume} disabled={status === 'idle' || status === 'complete'}>
                                    {status === 'running' ? 'Pause run' : 'Resume run'}
                                </Button>
                                <Button type="button" variant="outline" onClick={handleReset}>
                                    Reset
                                </Button>
                                <Button type="button" variant="outline" onClick={handleCaptureSnapshot} disabled={vmState.tick === 0}>
                                    Capture snapshot
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => snapshots[0] && handleExportBundle(snapshots[0].id)}
                                    disabled={snapshots.length === 0}
                                >
                                    Export latest .SYMB
                                </Button>
                                <Label className="inline-flex cursor-pointer items-center rounded-md border px-3 py-2 text-sm font-medium">
                                    Import .SYMB
                                    <input className="sr-only" type="file" accept=".symb,application/json" onChange={handleImportBundle} />
                                </Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setHasSavedDraft(true)}
                                >
                                    Save preset draft
                                </Button>
                            </div>
                            <p className="text-muted-foreground text-sm">
                                {hasSavedDraft
                                    ? 'Preset draft saved locally for this session.'
                                    : 'This first version keeps your current experiment settings in memory while you explore.'}
                            </p>
                            {bundleMessage ? <p className="text-sm font-medium">{bundleMessage}</p> : null}
                            <div className="rounded-lg border bg-muted/20 p-3 text-sm">
                                <p className="font-medium">Snapshots</p>
                                <p className="text-muted-foreground mt-1">
                                    Capture the exact runtime state, replay it later from this browser, or export it as a .SYMB bundle.
                                </p>
                                <div className="mt-3 space-y-2">
                                    {snapshots.length === 0 ? (
                                        <div className="rounded-lg border border-dashed p-3 text-muted-foreground">
                                            No snapshots captured yet.
                                        </div>
                                    ) : (
                                        snapshots.map((snapshot) => (
                                            <div key={snapshot.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                                                <div className="min-w-0">
                                                    <p className="truncate font-medium">{snapshot.label}</p>
                                                    <p className="text-muted-foreground text-xs">
                                                        {snapshot.capturedAt} · seed {snapshot.config.seed}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button type="button" variant="outline" size="sm" onClick={() => handleReplaySnapshot(snapshot.id)}>
                                                        Replay
                                                    </Button>
                                                    <Button type="button" variant="outline" size="sm" onClick={() => handleExportBundle(snapshot.id)}>
                                                        Export
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid gap-4">
                        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Heatmap</CardTitle>
                                    <CardDescription>
                                        Live visualization of the circular tape grouped into deterministic activity buckets.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-sidebar-border/70 bg-muted/20 dark:border-sidebar-border">
                                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/15 dark:stroke-neutral-100/15" />
                                        <div className="absolute inset-0 grid grid-cols-12 gap-1 p-4">
                                            {heatmap.map((cell, index) => (
                                                <div
                                                    key={`${cell.hue}-${index}`}
                                                    className={cn('rounded-sm transition-all duration-300', status !== 'idle' && 'shadow-sm')}
                                                    style={{
                                                        backgroundColor: `hsla(${cell.hue} 80% 60% / ${cell.intensity / 125})`,
                                                        transform: `scale(${0.92 + cell.intensity / 900})`,
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t bg-background/80 px-4 py-2 text-xs backdrop-blur">
                                            <span>
                                                {status === 'idle'
                                                    ? 'Execution region preview'
                                                    : `Tick ${vmState.tick.toLocaleString()} of ${config.stopTicks.toLocaleString()}`}
                                            </span>
                                            <span>{config.worldSize.toLocaleString()} cells · deterministic scaffold</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Run Metadata</CardTitle>
                                    <CardDescription>
                                        Critical provenance and version details remain visible during every run.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 text-sm">
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground">Seed</p>
                                        <p className="font-medium">{config.seed}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground">Instruction set</p>
                                        <p className="font-medium">{config.instructionSetVersion}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground">Current tick</p>
                                        <p className="font-medium">{vmState.tick.toLocaleString()}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground">Instruction pointer</p>
                                        <p className="font-medium">{vmState.instructionPointer}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground">Stop condition</p>
                                        <p className="font-medium">{config.stopTicks.toLocaleString()} ticks</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground">Captured snapshots</p>
                                        <p className="font-medium">{snapshots.length}</p>
                                    </div>
                                    <Separator />
                                    <div className="space-y-2">
                                        <p className="text-muted-foreground">Event queue</p>
                                        <div className="space-y-2">
                                            {events.map((event) => (
                                                <div key={`${event.tick}-${event.title}`} className="rounded-lg border p-3">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <p className="font-medium">{event.title}</p>
                                                        <span className="text-muted-foreground text-xs">{event.tick.toLocaleString()} ticks</span>
                                                    </div>
                                                    <p className="text-muted-foreground mt-1 text-sm">{event.detail}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid gap-4 lg:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Vitality Chart</CardTitle>
                                    <CardDescription>
                                        Runtime-derived entropy and complexity summaries for the current VM state.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {metrics.map((point) => (
                                        <div key={point.tick} className="space-y-2">
                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                <span>{point.tick.toLocaleString()} ticks</span>
                                                <span>
                                                    Entropy {point.entropy.toFixed(2)} · Complexity {point.complexity.toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="h-2 overflow-hidden rounded-full bg-muted">
                                                    <div
                                                        className="h-full rounded-full bg-sky-500"
                                                        style={{ width: `${point.entropy * 100}%` }}
                                                    />
                                                </div>
                                                <div className="h-2 overflow-hidden rounded-full bg-muted">
                                                    <div
                                                        className="h-full rounded-full bg-emerald-500"
                                                        style={{ width: `${point.complexity * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="rounded-lg border bg-muted/20 p-3 text-sm">
                                        <p className="font-medium">Current readout</p>
                                        <p className="text-muted-foreground mt-1">
                                            Entropy is at {activeMetric.entropy.toFixed(2)} while complexity is at {activeMetric.complexity.toFixed(2)}.
                                            In this tool, that means randomness is giving way to stronger repeated structure.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Genome Inspector</CardTitle>
                                    <CardDescription>
                                        Disassembly of the tape region around the active data pointer.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="rounded-lg border bg-muted/30 p-4 font-mono text-sm leading-6 text-muted-foreground">
                                        {inspector.code.map((line) => (
                                            <div key={line}>{line}</div>
                                        ))}
                                    </div>
                                    <p className="text-muted-foreground text-sm">{inspector.insight}</p>
                                    <Separator />
                                    <div className="grid gap-3 sm:grid-cols-3">
                                        <div className="rounded-lg border p-3">
                                            <p className="text-muted-foreground text-xs">Region</p>
                                            <p className="mt-1 font-medium">{inspector.region}</p>
                                        </div>
                                        <div className="rounded-lg border p-3">
                                            <p className="text-muted-foreground text-xs">Motif score</p>
                                            <p className="mt-1 font-medium">{inspector.motifScore.toFixed(2)}</p>
                                        </div>
                                        <div className="rounded-lg border p-3">
                                            <p className="text-muted-foreground text-xs">Replay status</p>
                                            <p className="mt-1 font-medium">{inspector.replayStatus}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
