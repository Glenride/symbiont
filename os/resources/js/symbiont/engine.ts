import type {
    SymbiontBundleDocument,
    ExperimentConfig,
    SymbiontEngineEvent,
    SymbiontHeatmapCell,
    SymbiontBundleMetadata,
    SymbiontInspectorSnapshot,
    SymbiontMetricPoint,
    SymbiontRuntimeSnapshot,
    SymbiontRuntimeView,
    SymbiontRunStatus,
    SymbiontStoredSnapshot,
    SymbiontVmState,
} from '@/types';

const ENGINE_VERSION = 'symbiont-engine-v1-alpha';
const OPCODE_COUNT = 10;
const HEATMAP_CELLS = 96;

function createRng(seed: number) {
    let state = seed >>> 0;

    return () => {
        state = (state * 1664525 + 1013904223) >>> 0;
        return state;
    };
}

function wrap(index: number, size: number) {
    return ((index % size) + size) % size;
}

function getStepsPerTick(config: ExperimentConfig) {
    return config.stepsPerTick ?? Math.max(24, Math.min(256, Math.floor(config.worldSize / 32)));
}

function getJumpDistance(config: ExperimentConfig) {
    return config.jumpDistance ?? 7;
}

function cloneState(state: SymbiontVmState): SymbiontVmState {
    return {
        ...state,
        tape: new Uint8Array(state.tape),
    };
}

function createInitialTape(config: ExperimentConfig) {
    const tape = new Uint8Array(config.worldSize);
    const rng = createRng(config.seed);
    const presetBias =
        config.presetId === 'noise-field' ? 0 : config.presetId === 'minimal-replicator' ? 2 : 4;

    for (let index = 0; index < tape.length; index += 1) {
        const noise = rng() % OPCODE_COUNT;
        tape[index] = (noise + presetBias + Math.floor(index / 11)) % OPCODE_COUNT;
    }

    if (config.presetId === 'minimal-replicator' && tape.length > 32) {
        const motif = [1, 5, 5, 8, 3, 9];
        motif.forEach((opcode, offset) => {
            tape[16 + offset] = opcode;
        });
    }

    if (config.presetId === 'phase-transition-hunt' && tape.length > 48) {
        const motif = [1, 3, 7, 5, 4, 9];
        motif.forEach((opcode, offset) => {
            tape[24 + offset] = opcode;
            tape[40 + offset] = opcode;
        });
    }

    return tape;
}

export function createInitialVmState(config: ExperimentConfig): SymbiontVmState {
    return {
        tape: createInitialTape(config),
        instructionPointer: config.seed % config.worldSize,
        dataPointer: (config.seed * 3) % config.worldSize,
        tick: 0,
        stepsThisTick: 0,
        halted: false,
        lastOpcode: 0,
        mutationCount: 0,
        writeCount: 0,
    };
}

function executeOpcode(config: ExperimentConfig, state: SymbiontVmState) {
    const size = state.tape.length;
    const ip = state.instructionPointer;
    const dp = state.dataPointer;
    const opcode = state.tape[ip] % OPCODE_COUNT;
    const jumpDistance = getJumpDistance(config);
    let nextIp = wrap(ip + 1, size);

    state.lastOpcode = opcode;

    switch (opcode) {
        case 0:
            break;
        case 1:
            state.dataPointer = wrap(dp + 1, size);
            break;
        case 2:
            state.dataPointer = wrap(dp - 1, size);
            break;
        case 3:
            state.tape[dp] = (state.tape[dp] + 1) % 256;
            state.writeCount += 1;
            break;
        case 4:
            state.tape[dp] = (state.tape[dp] + 255) % 256;
            state.writeCount += 1;
            break;
        case 5:
            state.tape[dp] = state.tape[ip];
            state.writeCount += 1;
            break;
        case 6:
            state.tape[ip] = state.tape[dp];
            state.writeCount += 1;
            break;
        case 7:
            if (state.tape[dp] === 0) {
                nextIp = wrap(ip + jumpDistance, size);
            }
            break;
        case 8:
            if (state.tape[dp] !== 0) {
                nextIp = wrap(ip + jumpDistance, size);
            }
            break;
        case 9:
            state.halted = true;
            break;
        default:
            break;
    }

    state.instructionPointer = nextIp;
    state.tick += 1;
    state.stepsThisTick += 1;
}

function applyEnvironment(config: ExperimentConfig, state: SymbiontVmState) {
    const mutations = Math.max(1, Math.floor(config.mutationRate / 2));
    const entropyBursts = Math.max(1, Math.floor(config.entropyRate / 4));
    const mutationSeed = config.seed + state.tick + state.writeCount + state.mutationCount;
    const rng = createRng(mutationSeed);

    for (let index = 0; index < mutations; index += 1) {
        const position = rng() % state.tape.length;
        state.tape[position] = (state.tape[position] + 1 + (rng() % 3)) % OPCODE_COUNT;
        state.mutationCount += 1;
    }

    if (state.tick % Math.max(8, 24 - config.entropyRate) === 0) {
        for (let index = 0; index < entropyBursts; index += 1) {
            const position = rng() % state.tape.length;
            state.tape[position] = rng() % OPCODE_COUNT;
        }
    }
}

export function stepVm(config: ExperimentConfig, previousState: SymbiontVmState) {
    const state = cloneState(previousState);
    state.stepsThisTick = 0;
    state.halted = false;

    const budget = getStepsPerTick(config);

    for (let step = 0; step < budget; step += 1) {
        executeOpcode(config, state);

        if (state.halted || state.tick >= config.stopTicks) {
            break;
        }
    }

    applyEnvironment(config, state);

    return state;
}

function computeEntropy(state: SymbiontVmState) {
    const counts = new Array(OPCODE_COUNT).fill(0);

    for (const cell of state.tape) {
        counts[cell % OPCODE_COUNT] += 1;
    }

    let score = 0;

    for (const count of counts) {
        if (count === 0) {
            continue;
        }

        const probability = count / state.tape.length;
        score -= probability * Math.log2(probability);
    }

    return Number(Math.min(1, score / Math.log2(OPCODE_COUNT)).toFixed(2));
}

function computeComplexity(state: SymbiontVmState) {
    let transitions = 0;

    for (let index = 1; index < state.tape.length; index += 1) {
        if (state.tape[index] !== state.tape[index - 1]) {
            transitions += 1;
        }
    }

    return Number((1 - transitions / Math.max(1, state.tape.length - 1)).toFixed(2));
}

function buildMetrics(state: SymbiontVmState): SymbiontMetricPoint[] {
    const phases = 6;
    const entropy = computeEntropy(state);
    const complexity = computeComplexity(state);

    return Array.from({ length: phases }, (_, index) => {
        const progress = index / (phases - 1);

        return {
            tick: Math.round(state.tick * progress),
            entropy: Number(Math.min(1, entropy + (1 - progress) * 0.08).toFixed(2)),
            complexity: Number(Math.max(0, complexity * progress).toFixed(2)),
        };
    });
}

function buildHeatmap(state: SymbiontVmState): SymbiontHeatmapCell[] {
    const bucketSize = Math.max(1, Math.floor(state.tape.length / HEATMAP_CELLS));

    return Array.from({ length: HEATMAP_CELLS }, (_, index) => {
        const start = index * bucketSize;
        const end = Math.min(state.tape.length, start + bucketSize);
        const slice = state.tape.slice(start, end);
        const sum = slice.reduce((total, value) => total + value, 0);
        const value = slice.length > 0 ? Math.round(sum / slice.length) : 0;

        return {
            intensity: Math.max(8, Math.min(100, value * 10 + 10)),
            hue: (value * 27 + index * 9) % 280,
            value,
        };
    });
}

function buildEvents(config: ExperimentConfig, state: SymbiontVmState, metrics: SymbiontMetricPoint[]): SymbiontEngineEvent[] {
    const activeRegions = buildHeatmap(state)
        .filter((cell) => cell.intensity > 60)
        .slice(0, 2)
        .map((cell, index) => ({ index, cell }));

    const events: SymbiontEngineEvent[] = [
        {
            tick: state.tick,
            title: state.halted ? 'Execution halted' : 'Execution advanced',
            detail: `${state.stepsThisTick} instructions executed with ${state.writeCount} total writes so far.`,
        },
    ];

    if (metrics.at(-1)?.complexity && metrics.at(-1)!.complexity > 0.35) {
        events.push({
            tick: state.tick,
            title: 'Complexity rise',
            detail: 'Repeated local structure is persisting longer than the initial seeded noise.',
        });
    }

    if (activeRegions.length > 0) {
        events.push({
            tick: state.tick,
            title: 'Active region detected',
            detail: `The ${config.presetId.replaceAll('-', ' ')} preset produced ${activeRegions.length} strong heatmap hotspots.`,
        });
    }

    return events;
}

function decodeOpcode(opcode: number) {
    switch (opcode % OPCODE_COUNT) {
        case 0:
            return 'nop';
        case 1:
            return 'ptr+';
        case 2:
            return 'ptr-';
        case 3:
            return 'inc';
        case 4:
            return 'dec';
        case 5:
            return 'write-ip';
        case 6:
            return 'write-dp';
        case 7:
            return 'jump-if-zero';
        case 8:
            return 'jump-if-not-zero';
        case 9:
            return 'halt';
        default:
            return 'nop';
    }
}

function buildInspector(state: SymbiontVmState, status: SymbiontRunStatus): SymbiontInspectorSnapshot {
    const regionStart = wrap(state.dataPointer - 6, state.tape.length);
    const regionValues = Array.from({ length: 12 }, (_, offset) => state.tape[wrap(regionStart + offset, state.tape.length)]);
    const code = [
        regionValues.slice(0, 6).map((value) => decodeOpcode(value)).join(' '),
        regionValues.slice(6).map((value) => decodeOpcode(value)).join(' '),
    ];

    return {
        code,
        region: `${regionStart} - ${wrap(regionStart + 11, state.tape.length)}`,
        motifScore: Number((computeComplexity(state) + state.writeCount / Math.max(50, state.tape.length)).toFixed(2)),
        replayStatus: status === 'complete' ? 'Snapshot ready' : status === 'paused' ? 'Paused for inspection' : 'Live runtime',
        insight:
            status === 'idle'
                ? 'Start a run to decode the most active local tape region.'
                : 'This region is centered around the current data pointer and shows the active local motif.',
    };
}

export function createRuntimeView(config: ExperimentConfig, state: SymbiontVmState, status: SymbiontRunStatus): SymbiontRuntimeView {
    const metrics = buildMetrics(state);

    return {
        status,
        config,
        state,
        metrics,
        heatmap: buildHeatmap(state),
        events: buildEvents(config, state, metrics),
        inspector: buildInspector(state, status),
    };
}

export function createRuntimeSnapshot(config: ExperimentConfig, state: SymbiontVmState): SymbiontRuntimeSnapshot {
    return {
        id: `${config.seed}-${state.tick}-${state.writeCount}`,
        label: `${config.name} @ ${state.tick.toLocaleString()} ticks`,
        capturedAt: new Date().toISOString(),
        config: { ...config },
        engineVersion: ENGINE_VERSION,
        state: cloneState(state),
    };
}

export function serializeSnapshot(snapshot: SymbiontRuntimeSnapshot): SymbiontStoredSnapshot {
    return {
        ...snapshot,
        state: {
            ...snapshot.state,
            tape: Array.from(snapshot.state.tape),
        },
    };
}

export function hydrateSnapshot(snapshot: SymbiontStoredSnapshot): SymbiontRuntimeSnapshot {
    return {
        ...snapshot,
        state: {
            ...snapshot.state,
            tape: new Uint8Array(snapshot.state.tape),
        },
    };
}

export function restoreSnapshot(snapshot: SymbiontRuntimeSnapshot) {
    return {
        config: { ...snapshot.config },
        state: cloneState(snapshot.state),
    };
}

function buildSnapshotChecksum(snapshot: SymbiontStoredSnapshot) {
    const payload = JSON.stringify(snapshot);
    let hash = 0;

    for (let index = 0; index < payload.length; index += 1) {
        hash = (hash * 31 + payload.charCodeAt(index)) >>> 0;
    }

    return hash.toString(16).padStart(8, '0');
}

export function createBundleDocument(snapshot: SymbiontStoredSnapshot): SymbiontBundleDocument {
    const metadata: SymbiontBundleMetadata = {
        schemaVersion: 'symb-1',
        engineVersion: snapshot.engineVersion,
        instructionSetVersion: snapshot.config.instructionSetVersion,
        mutationPolicyVersion: 'mutation-v1',
        seed: snapshot.config.seed,
        tickCount: snapshot.state.tick,
        snapshotChecksum: buildSnapshotChecksum(snapshot),
        title: snapshot.label,
        tags: [snapshot.config.presetId],
    };

    return {
        kind: 'symb.bundle',
        metadata,
        snapshot,
    };
}

export function exportBundle(snapshot: SymbiontStoredSnapshot) {
    return JSON.stringify(createBundleDocument(snapshot), null, 2);
}

export function importBundle(bundleContent: string): SymbiontStoredSnapshot {
    const document = JSON.parse(bundleContent) as SymbiontBundleDocument;

    if (document.kind !== 'symb.bundle') {
        throw new Error('Invalid bundle kind.');
    }

    if (document.metadata.schemaVersion !== 'symb-1') {
        throw new Error('Unsupported bundle schema version.');
    }

    const expectedChecksum = buildSnapshotChecksum(document.snapshot);

    if (document.metadata.snapshotChecksum !== expectedChecksum) {
        throw new Error('Snapshot checksum mismatch.');
    }

    return document.snapshot;
}

export function getEngineVersion() {
    return ENGINE_VERSION;
}
