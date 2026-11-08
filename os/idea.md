Gemini said
This Product Requirements Document (PRD) outlines the development of Symbiont OS, a specialized, browser-based operating system designed for scientists to build, simulate, and benchmark emergent intelligence.

Drawing from the "computational life" theories of Blaise Agüera y Arcas, this OS treats intelligence not as a static algorithm, but as a social, responsive, and embodied process.

# Symbiont OS v1 Product Requirements Document

## 1. Product Overview

Symbiont OS is a browser-based, local-first research environment for studying the emergence of non-trivial self-replicating bytecode organisms from noise.

The purpose of Symbiont OS v1 is not to build general AI agents, virtual assistants, or LLM-driven simulations. The purpose is to give Artificial Life researchers and complexity scientists a deterministic, visual, reproducible, and shareable laboratory for running emergent bytecode-life experiments.

Symbiont OS v1 focuses on a narrow and rigorous definition of intelligence in this context:

> Intelligence, for v1, is the emergence of stable, non-trivial, self-replicating or persistence-enhancing bytecode structure from noise under deterministic simulation conditions.

The core value proposition is:

- Deterministic: same seed + same engine version + same config = same simulation state
- Visual: researchers can observe emergence in real time
- Inspectable: any detected structure can be paused, inspected, and disassembled
- Shareable: experiments can be exported and replayed by others without environment drift
- Local-first: all simulation data remains in the browser unless explicitly exported

## 2. Product Vision

Create the fastest and most trustworthy browser-native system for exploring, reproducing, and sharing emergent digital-life experiments.

Symbiont OS should become the standard environment for researchers who want to:

- run deterministic soup experiments
- inspect emergent replicators
- compare runs across seeds and parameter changes
- share exact experimental states with collaborators
- publish reproducible artifacts for papers and public discussion

## 3. Primary User

### The Digital Prebiotic Researcher

The primary user for v1 is an Artificial Life researcher, complexity theorist, or technically sophisticated experimentalist who currently uses custom scripts or research code to simulate emergent systems.

They are typically comfortable with:

- low-level computational models
- simulation parameters
- evolutionary thinking
- interpreting noisy signals and weak metrics

Their pain points today are:

- custom environments are difficult to reproduce across machines
- notebooks are poor tools for high-speed, stateful simulation
- simulations are difficult to inspect at exact moments of interest
- sharing experiments often requires manual setup and environment reconstruction
- there is no easy way to package and replay a specific emergent event

## 4. Core Product Promise

A researcher can run a deterministic bytecode-life experiment in the browser, detect an interesting emergent event, inspect it, snapshot it, and export a reproducible bundle that replays identically for another researcher.

Success is defined by a result like this:

> At Seed `88291`, a 12-instruction replicator emerged and persisted against noise pressure by `4.2M` ticks. Here is the exact bundle. Open it and replay the same event in your browser.

## 5. Scope of v1

Symbiont OS v1 is a focused research tool for bytecode emergence experiments.

### In Scope

- deterministic simulation engine
- bytecode organisms in a shared memory environment
- experiment configuration and seeded runs
- real-time heatmap visualization of the soup
- real-time complexity and entropy metrics
- event detection heuristics for possible emergence
- pause, inspect, and disassemble selected structures
- exact snapshotting and replay
- import/export of reproducible experiment bundles
- local experiment library
- side-by-side comparison of runs and snapshots
- lightweight notes, labels, and metadata

### Out of Scope for v1

- local LLM or Ollama integration
- neural networks or learned agents
- Shepherd Test environments
- tiling OS or desktop-like window manager
- continuous-space physics simulation
- cloud-first collaboration
- public hosted registry
- formal claims of general intelligence measurement

## 6. Core User Workflow

The core workflow of Symbiont OS v1 is the Emergence Loop.

### Step 1: Define

The researcher creates an experiment and sets:

- world size
- instruction set version
- mutation policy
- entropy injection rate
- scheduling mode
- stop conditions
- event detection thresholds

### Step 2: Seed

The system initializes a deterministic starting state using a reproducible seed.

### Step 3: Run

The engine executes the simulation at high speed in a deterministic runtime.

### Step 4: Detect

The system monitors metrics and flags possible interesting events, such as:

- possible replication
- sudden compression changes
- persistent local structure
- recurring executable motifs
- phase transition candidates

### Step 5: Inspect

The researcher pauses the simulation and examines:

- the local memory region
- candidate organism code
- metric deltas
- execution behavior at the flagged time window

### Step 6: Snapshot

The system saves the exact state at a selected tick count.

### Step 7: Compare

The researcher compares the result against:

- a prior snapshot
- a different seed
- a baseline preset
- a modified mutation or entropy rule

### Step 8: Share

The researcher exports a `.SYMB` bundle for replay, analysis, or publication support.

## 7. Core Scientific Artifact

The primary saved and shared object in v1 is the Experiment Bundle.

This is more useful than saving just a soup or just a genome because it preserves the entire experimental context.

A `.SYMB` bundle contains:

- engine version
- schema version
- initial seed
- tick count
- world configuration
- instruction set version
- mutation policy version
- metric definitions version
- snapshot binary
- snapshot checksum
- event markers
- derived metrics
- optional title
- optional notes
- optional tags
- provenance information for forked bundles

This bundle is the canonical reproducibility unit for the product.

## 8. Definition of an Agent in v1

In v1, an agent is strictly a bytecode organism.

It is not:

- an LLM-backed entity
- a neural network
- a symbolic planner
- a chatbot
- a cloud-powered reasoning system

A bytecode organism is a sequence of instructions that inhabits a shared memory environment and participates in deterministic execution under fixed simulation rules.

The core scientific objective of v1 is to study whether stable, non-random, persistence-enhancing, and potentially self-replicating instruction patterns emerge from noisy conditions.

## 9. Simulation Model

### 9.1 World Model

The v1 world is a 1D shared memory tape with segmented execution regions.

This model is chosen because it is:

- fast
- deterministic
- simpler to inspect
- easier to serialize
- well-suited for low-level organism experiments

### 9.2 Selection Pressures

The initial selection pressures in v1 are:

- finite memory
- limited execution budget
- mutation pressure
- overwrite competition
- persistence over time

v1 will avoid more elaborate energy systems unless later research shows they are necessary.

### 9.3 Symbiogenesis in v1

In v1, symbiogenesis is not implemented as a forced merge mechanic.

Instead, the working definition is:

> Persistent functional composition between adjacent or interacting bytecode structures that produces greater replication stability or persistence than isolated patterns.

This lets the system detect emergent composition without over-designing it.

## 10. Reproducibility Standard

The core scientific standard of Symbiont OS v1 is bit-identical state parity within a supported runtime contract.

### v1 Reproducibility Means

If the following are identical:

- engine version
- schema version
- instruction set version
- mutation policy version
- metric definition version
- seed
- config
- snapshot or replay format

Then the resulting simulation state at the same tick count must be identical.

### Determinism Applies To

- VM execution
- scheduling order
- mutation events
- entropy injection
- event detection logic
- metric calculations
- snapshot serialization

### Determinism Does Not Need To Apply To

- rendering details
- UI animation smoothness
- minor display-level differences that do not affect state

### Engineering Constraints for Determinism

- WebAssembly-based core engine
- integer-only or fixed-point math
- no floating-point dependent simulation logic
- fixed scheduling order
- no nondeterministic host callbacks inside simulation logic
- explicit versioning of all reproducibility-sensitive definitions

## 11. Product Experience

Symbiont OS v1 uses a High-Performance Laboratory Dashboard, not an operating system-like tiling interface.

### Required Views

#### 1. The Heatmap

A real-time view of the memory tape where color and density indicate activity, instruction frequency, or structural change.

Primary purpose:

- identify hot spots
- notice persistent structure
- visually locate candidate emergence regions

#### 2. The Vitality Chart

A time-series view of key metrics such as:

- entropy
- compression-based complexity approximation
- structure persistence
- event markers
- candidate replication signals

Primary purpose:

- detect regime changes
- correlate emergence with parameter shifts
- inspect when and why a flagged event occurred

#### 3. The Genome Inspector

A detailed panel for inspecting a selected region or candidate organism.

It should support:

- disassembly
- raw byte or instruction view
- bounded local context
- selected region metadata
- event-linked inspection

#### 4. Supporting Metadata Panel

A compact panel containing:

- seed
- tick count
- engine version
- config summary
- labels and notes
- event log

This panel is necessary for scientific clarity and reproducibility.

## 12. First-Run Experience

A new user should never start from a blank screen.

v1 should include three starter presets:

- Noise Field
- Minimal Replicator
- Phase Transition Hunt

These presets help users quickly understand the product, validate the system, and explore without needing deep setup knowledge.

### First 5-Minute Experience

Within five minutes, a user should be able to:

- launch a preset
- run the simulation
- see a flagged event
- pause and inspect the event
- export a reproducible bundle

That is the first wow moment.

## 13. Metrics and Detection

Symbiont OS v1 should avoid broad or controversial claims like AIQ for now.

Instead, v1 uses practical heuristics to identify interesting computational behavior.

### Core Metrics

- entropy
- compression-based complexity approximation
- local structure persistence
- novelty score
- recurring motif frequency
- replication candidate signals
- lineage stability where detectable

### Important Product Rule

These metrics are heuristics for discovery, not formal proof of intelligence.

The UI and docs should reflect that clearly.

### Event Detection

The system should auto-flag events such as:

- sudden compression-ratio changes
- local persistence above noise baseline
- repeated executable motifs
- candidate self-copy behavior
- abrupt regime transitions

## 14. Comparison and Analysis

Comparison is a core product feature in v1.

Researchers must be able to compare:

- same config, different seed
- same seed, different mutation policy
- same seed, different entropy rate
- snapshot A vs snapshot B
- baseline preset vs modified run

### Minimum Comparison Capabilities

- metadata diff
- metric diff
- replay alignment by tick count
- event marker comparison

Without comparison, the product would be visually interesting but scientifically weak.

## 15. Annotation and Provenance

Each experiment should support lightweight annotation.

### Required Metadata Fields

- title
- short description
- notes
- tags
- hypothesis
- candidate labels such as:
  - possible replicator
  - false positive
  - phase transition
  - stable motif

### Provenance

If one experiment is derived from another, the bundle should record:

- parent bundle reference
- changed configuration fields
- whether seed was preserved or changed
- parent engine and schema version

This provides a clean fork model even before a hosted registry exists.

## 16. Data and Storage

Symbiont OS v1 is local-first.

### Storage Model

- browser-local storage for metadata and recent experiment library
- IndexedDB for snapshots and bundles where appropriate
- explicit export or import for portability

### Requirements

- support local library browsing
- preserve snapshot integrity
- checksum binary state payloads
- handle version mismatch clearly
- never silently upgrade incompatible artifacts

## 17. Non-Functional Requirements

### Performance

The engine must be fast enough for meaningful research use, but v1 should prioritize deterministic execution and usability over marketing-heavy FPS claims.

Performance goals:

- responsive visualization during active simulation
- smooth replay and snapshot inspection
- fast stepping and pause or resume behavior
- practical long-run execution for emergence hunting

### Privacy

All simulation state, notes, and analysis remain local unless explicitly exported.

### Compatibility

Target modern Chromium-based browsers and Firefox versions that support the required WebAssembly and storage features.

### Reliability

The app must preserve:

- deterministic replay
- data integrity
- bundle version compatibility handling
- safe failure modes for corrupt or outdated bundles

## 18. Internal Validation Suite

To ensure scientific utility, the product should be validated against a small set of known internal scenarios.

### Required Benchmark Scenarios

- pure noise baseline
- structured but non-replicating pattern
- hand-authored minimal replicator
- unstable quasi-replicator
- mutation-collapse scenario

These are used to validate:

- metric behavior
- event detection quality
- snapshot or replay correctness
- regression stability

## 19. Success Metrics

### Product Success for v1

A researcher can:

- run a seeded experiment
- observe a flagged emergent event
- inspect the event
- export a `.SYMB` bundle
- replay the same result deterministically elsewhere

### Usage Success Signals

- number of exported bundles
- number of imported or replayed bundles
- number of compared runs
- repeat usage of local experiment library
- number of annotated candidate events

### Scientific Success Signals

- reproducible replay success rate
- number of externally shared bundles
- number of research references, demos, or papers using the environment
- evidence that users can identify meaningful structures faster than with ad hoc tools

## 20. Explicit Non-Goals

v1 is not intended to be:

- a general AI operating system
- a browser desktop metaphor
- a cloud collaboration platform
- an LLM laboratory
- a universal simulation engine
- a formal intelligence certification framework

This focus is necessary to make the product coherent and buildable.

## 21. Phase 2 Candidates

After v1 proves the local deterministic emergence workflow, future phases may explore:

- hosted registry and sharing
- experiment forking in a public ecosystem
- richer lineage analysis
- more advanced visualizations
- multi-panel lab workspaces
- collaborative annotations
- alternative world topologies
- more advanced symbiogenesis models
- carefully scoped local model integration if it serves a clear research purpose

## 22. Building Symbiont OS with the Existing Laravel Starter Kit

The existing application is a strong fit for v1 and should be used as the implementation foundation.

### Existing Stack

- Laravel 12
- Inertia.js
- React 19
- TypeScript
- Tailwind CSS 4
- Radix UI components
- Vite
- Fortify authentication

### Why This Starter Kit Fits

- Laravel provides routing, authentication, testing, and structured application boundaries.
- Inertia + React provides a fast way to build the research dashboard without introducing a second frontend architecture.
- TypeScript helps keep simulation-adjacent UI and bundle types explicit.
- Tailwind and Radix provide a strong base for the laboratory dashboard and settings panels.
- The app can remain local-first while still benefiting from Laravel for authenticated workspace access, saved experiment metadata, and future sharing features.

### Recommended Architecture Using Existing Patterns

#### Laravel Responsibilities

- authenticated application shell
- route definitions
- experiment metadata persistence when needed
- import or export endpoints if server-assisted download flows are later required
- policy and authorization boundaries
- test coverage for web routes and app behavior

#### React and Inertia Responsibilities

- dashboard UI
- experiment setup forms
- run controls
- heatmap rendering
- vitality chart rendering
- genome inspector
- metadata and annotation panels
- local import or export interactions

#### Browser Runtime Responsibilities

- simulation execution
- snapshot generation
- replay stepping
- local bundle serialization
- IndexedDB storage for large local artifacts

### Recommended v1 App Structure

Use the existing conventions already present in the starter kit.

#### Routes

- keep public marketing or welcome flow on `/`
- use authenticated routes for the lab experience
- add routes such as:
  - `/lab`
  - `/experiments`
  - `/experiments/:id`
  - `/library`

#### Frontend Pages

Add pages under `resources/js/pages` using the existing Inertia page resolution pattern.

Recommended pages:

- `lab.tsx`
- `experiments/index.tsx`
- `experiments/show.tsx`
- `library.tsx`

#### Frontend Components

Add focused components under `resources/js/components` for:

- experiment controls
- heatmap panel
- vitality chart panel
- genome inspector panel
- event log panel
- bundle import or export controls
- comparison view

Keep components small and consistent with the existing starter kit style.

#### Simulation Modules

Add simulation-specific browser modules under `resources/js` in a focused area such as:

- `resources/js/symbiont/engine`
- `resources/js/symbiont/state`
- `resources/js/symbiont/storage`
- `resources/js/symbiont/metrics`
- `resources/js/symbiont/bundles`

This keeps domain logic separate from generic UI code while staying inside the current frontend architecture.

### Recommended Implementation Phases

#### Phase 1: Foundation

- create authenticated lab route and page
- add experiment config form
- add starter presets
- define TypeScript types for experiment config and `.SYMB` bundle metadata
- build local state management for the simulation session

#### Phase 2: Core Runtime UI

- implement a browser-based simulation loop scaffold
- render the heatmap
- render core metrics timeline
- add pause, resume, step, and reset controls
- add metadata panel for seed, tick count, and version info

#### Phase 3: Inspection and Snapshotting

- add genome inspector
- add event detection markers
- add snapshot save and replay support
- add bundle export and import

#### Phase 4: Comparison and Library

- add local experiment library UI
- add run comparison view
- add annotations, tags, and hypotheses
- add provenance tracking between derived runs

### Backend Guidance for v1

The simulation itself should not depend on Laravel request cycles.

For v1:

- keep simulation execution in the browser
- keep large run artifacts local-first
- use Laravel primarily for app shell, auth, and future-ready structure
- only persist lightweight metadata server-side if there is a clear user benefit

### Testing Guidance Using the Existing Stack

- use Pest for Laravel route and application tests
- add frontend type safety with TypeScript checks
- keep domain logic in testable modules where possible
- validate bundle serialization and deserialization with focused tests
- validate deterministic replay with repeatable scenario tests

### Practical Build Direction

The cleanest path is to use Laravel + Inertia as the product shell and React + TypeScript as the research interface, while keeping the simulation engine as a browser-side module that can later be replaced or accelerated by WebAssembly without rewriting the app shell.

This approach is simple, iterative, and compatible with the current starter kit.

## 23. Instructions for Cascade

Use the following as implementation and planning guardrails for future work on Symbiont OS.

### Core Product Rules

- Always optimize for deterministic, reproducible bytecode-life experiments.
- Prefer a narrow and rigorous MVP over broad speculative features.
- The primary artifact is the Experiment Bundle, not a generic project file.
- The app is local-first unless a feature explicitly requires sharing or export.
- Metrics are discovery heuristics, not proof of intelligence.
- Avoid introducing architecture or UI patterns that imply a general-purpose OS before the research workflow is excellent.

### Scope Rules

- Prioritize:
  - seeded experiments
  - deterministic execution
  - snapshotting
  - replay
  - inspection
  - comparison
  - export or import
- Do not prioritize in v1:
  - LLM integration
  - cloud collaboration
  - Shepherd Test
  - heavy desktop or window manager patterns
  - continuous-space simulation
  - generalized agent abstractions

### Engineering Rules

- Keep simulation logic deterministic.
- Use integer-only or fixed-point logic in state-critical paths.
- Version all reproducibility-sensitive systems.
- Never make silent changes that break bundle replay.
- Treat import or export formats as core product interfaces.
- Prefer simple, inspectable data models.
- Separate simulation state from presentation state.

### UX Rules

- Always support the core loop:
  - define
  - seed
  - run
  - detect
  - inspect
  - snapshot
  - compare
  - share
- Never leave users at a blank starting point.
- Preserve visibility of seed, tick count, and version metadata.
- Ensure any flagged event can be inspected with minimal friction.
- Favor clear scientific instrumentation over visual flourish.

### Product Quality Rules

- If a feature does not improve reproducibility, inspection, comparison, or shareability, question whether it belongs in v1.
- If a claim cannot be validated scientifically, phrase it as a heuristic.
- When uncertain, choose the simpler deterministic design.
- Every major feature should strengthen the researcher’s ability to trust, replay, and communicate results.

### Suggested Next Product Definition Step

The next design artifact should be a v1 VM and Instruction Set Specification.

That spec should define:

- VM state
- memory model
- instruction set
- execution budget
- mutation rules
- entropy injection rules
- event detection hooks
- safety bounds
- serialization expectations

## 24. v1 VM and Instruction Set Specification

This section defines the concrete execution model for the first real Symbiont OS runtime.

### 24.1 Design Goals

The v1 VM must be:

- deterministic
- bounded
- simple to inspect
- simple to serialize
- expressive enough to support repeated structure and self-copying behavior

The VM does not attempt to maximize theoretical elegance in v1. It is optimized for reproducibility, observability, and practical implementation inside the browser.

### 24.2 VM State

The v1 VM state consists of:

- `tape`: a fixed-size circular array of unsigned 8-bit cells
- `instructionPointer`: current execution position on the tape
- `dataPointer`: current data position on the tape
- `tick`: total executed instruction count at the simulation level
- `stepsThisTick`: number of executed instruction steps in the current engine iteration
- `halted`: whether the current execution pass has halted early
- `lastOpcode`: last executed opcode value
- `mutationCount`: number of mutations applied so far
- `writeCount`: number of tape writes applied so far

### 24.3 Memory Model

- The world is a single circular tape.
- Each tape cell stores one unsigned 8-bit value.
- Tape length is determined by `worldSize`.
- All pointer movement wraps around using modulo arithmetic.
- There is no dynamic memory allocation in v1.
- There is no host IO in v1.

### 24.4 Execution Model

- One engine step executes exactly one opcode at `instructionPointer`.
- After an opcode executes, `instructionPointer` advances unless explicitly changed by control flow.
- The engine runs for a bounded number of steps per iteration.
- A run is deterministic when seed, config, engine version, and initial tape are identical.
- The VM uses integer-only arithmetic.

### 24.5 Opcode Set

The v1 opcode set is intentionally minimal.

#### Core Opcodes

- `0 = NOP`
  - do nothing
- `1 = DP_RIGHT`
  - move `dataPointer` right by one cell
- `2 = DP_LEFT`
  - move `dataPointer` left by one cell
- `3 = INC`
  - increment the byte at `dataPointer`
- `4 = DEC`
  - decrement the byte at `dataPointer`
- `5 = WRITE_IP_TO_DP`
  - copy the byte at `instructionPointer` into `dataPointer`
- `6 = WRITE_DP_TO_IP`
  - copy the byte at `dataPointer` into `instructionPointer`
- `7 = JUMP_IF_ZERO`
  - if byte at `dataPointer` is zero, advance `instructionPointer` by a fixed jump distance
- `8 = JUMP_IF_NONZERO`
  - if byte at `dataPointer` is non-zero, advance `instructionPointer` by a fixed jump distance
- `9 = HALT`
  - end the current execution pass early

### 24.6 Jump Semantics

- v1 uses a fixed jump distance stored in config rather than encoded multi-byte instructions.
- This simplifies decoding and keeps every cell independently interpretable.
- Default jump distance should be small and deterministic.

### 24.7 Execution Budget

The runtime must enforce:

- `stepsPerTick`: maximum number of executed instructions in one engine iteration
- `stopTicks`: maximum total ticks before automatic stop

This guarantees bounded browser execution and stable replay behavior.

### 24.8 Initial Tape Seeding

The initial tape is created deterministically from:

- `seed`
- `worldSize`
- `presetId`
- `entropyRate`
- `mutationRate`

Preset-specific initialization may bias the tape shape, but must remain fully deterministic.

### 24.9 Mutation Rules

Mutation is part of the environment, not an instruction.

- After each engine iteration, the runtime may mutate a bounded number of tape cells.
- Mutation positions are selected using the seeded deterministic RNG.
- Mutation values are selected using the seeded deterministic RNG.
- Mutation count per iteration is derived from `mutationRate`.
- Mutation must never depend on wall-clock timing or host randomness.

### 24.10 Entropy Injection Rules

Entropy injection is also environmental.

- At bounded intervals, a deterministic number of tape cells are overwritten or perturbed.
- Injection amount is derived from `entropyRate`.
- Entropy injection must be deterministic for a given seed and config.

### 24.11 Event Detection Hooks

The engine should emit sufficient state for the UI to detect:

- write density spikes
- repeated local motifs
- low-entropy islands
- sudden complexity increase
- persistent active regions across multiple iterations

v1 does not require the engine itself to classify “intelligence.” It only needs to expose deterministic signals that the UI and metric layer can interpret.

### 24.12 Snapshot Requirements

A snapshot must include:

- tape contents
- instruction pointer
- data pointer
- tick
- mutation count
- write count
- config
- engine version

This is the minimum replay state for v1.

### 24.13 Safety Bounds

The VM must never:

- allocate unbounded memory
- call nondeterministic host APIs during execution
- depend on floating-point math for core state transitions
- depend on wall-clock time for simulation progression

### 24.14 v1 Implementation Guidance

The first implementation should be written in TypeScript in the browser runtime.

- Keep the engine pure and testable.
- Keep serialization straightforward.
- Separate engine state from UI state.
- Keep the opcode table explicit and versioned.

Once behavior is stable, the engine may later be ported to WebAssembly without changing the app shell or experiment model.