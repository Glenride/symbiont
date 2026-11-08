export type SymbiontPresetId = 'noise-field' | 'minimal-replicator' | 'phase-transition-hunt';

export type SymbiontOpcodeName =
    | 'NOP'
    | 'DP_RIGHT'
    | 'DP_LEFT'
    | 'INC'
    | 'DEC'
    | 'WRITE_IP_TO_DP'
    | 'WRITE_DP_TO_IP'
    | 'JUMP_IF_ZERO'
    | 'JUMP_IF_NONZERO'
    | 'HALT';

export type SymbiontPreset = {
    id: SymbiontPresetId;
    name: string;
    description: string;
};

export type ExperimentConfig = {
    name: string;
    presetId: SymbiontPresetId;
    seed: number;
    worldSize: number;
    entropyRate: number;
    mutationRate: number;
    instructionSetVersion: string;
    stopTicks: number;
    stepsPerTick?: number;
    jumpDistance?: number;
};

export type SymbiontMetricPoint = {
    tick: number;
    entropy: number;
    complexity: number;
};

export type SymbiontHeatmapCell = {
    intensity: number;
    hue: number;
    value: number;
};

export type SymbiontEngineEvent = {
    tick: number;
    title: string;
    detail: string;
};

export type SymbiontInspectorSnapshot = {
    code: string[];
    region: string;
    motifScore: number;
    replayStatus: string;
    insight: string;
};

export type SymbiontRunStatus = 'idle' | 'running' | 'paused' | 'complete';

export type SymbiontVmState = {
    tape: Uint8Array;
    instructionPointer: number;
    dataPointer: number;
    tick: number;
    stepsThisTick: number;
    halted: boolean;
    lastOpcode: number;
    mutationCount: number;
    writeCount: number;
};

export type SymbiontRuntimeSnapshot = {
    id: string;
    label: string;
    capturedAt: string;
    config: ExperimentConfig;
    engineVersion: string;
    state: SymbiontVmState;
};

export type SymbiontStoredSnapshot = {
    id: string;
    label: string;
    capturedAt: string;
    config: ExperimentConfig;
    engineVersion: string;
    state: Omit<SymbiontVmState, 'tape'> & {
        tape: number[];
    };
};

export type SymbiontRuntimeView = {
    status: SymbiontRunStatus;
    config: ExperimentConfig;
    state: SymbiontVmState;
    metrics: SymbiontMetricPoint[];
    heatmap: SymbiontHeatmapCell[];
    events: SymbiontEngineEvent[];
    inspector: SymbiontInspectorSnapshot;
};

export type SymbiontBundleMetadata = {
    schemaVersion: string;
    engineVersion: string;
    instructionSetVersion: string;
    mutationPolicyVersion: string;
    seed: number;
    tickCount: number;
    snapshotChecksum: string;
    title?: string;
    notes?: string;
    tags?: string[];
};

export type SymbiontBundleDocument = {
    kind: 'symb.bundle';
    metadata: SymbiontBundleMetadata;
    snapshot: SymbiontStoredSnapshot;
};
