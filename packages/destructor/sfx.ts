/**
 * Physics Sound Effects System
 * Handles audio playback for the Half-Life 2 physics playground
 * Adapted from https://www.half-life.com/en/halflife2/20th
 */

/** Configuration for a single sound effect */
interface SoundEffectConfig {
    /** Multiple audio file paths for random selection */
    readonly paths: readonly string[];
    /** Volume level (0.0 to 1.0) */
    readonly volume: number;
    /** Whether the sound should loop continuously */
    readonly loop?: boolean;
    /** Delay before playing in milliseconds */
    readonly delay?: number;
    /** Names of other sounds to stop when this sound plays */
    readonly stops?: readonly string[];
}

/** Registry of all available sound effects */
const SOUND_EFFECT_REGISTRY = {
    // Gravity Gun Sounds
    holdloop: {
        paths: ["/halflife/audio/physcannon_hold_loop.mp3"],
        volume: 0.2,
        loop: true,
    },
    select: {
        paths: ["/halflife/audio/physcannon_select.mp3"],
        volume: 0.3,
    },
    weaponswitch: {
        paths: ["/halflife/audio/physcannon_return.mp3"],
        volume: 0.3,
    },
    pickup: {
        paths: ["/halflife/audio/physcannon_pickup.mp3"],
        volume: 0.3,
    },
    open: {
        paths: ["/halflife/audio/physcannon_claws_open.mp3"],
        volume: 0.3,
        stops: ["close"],
    },
    close: {
        paths: ["/halflife/audio/physcannon_claws_close.mp3"],
        volume: 0.3,
        stops: ["open"],
    },
    drop: {
        paths: ["/halflife/audio/physcannon_drop.mp3"],
        volume: 0.3,
    },
    dryfire: {
        paths: ["/halflife/audio/physcannon_dryfire.mp3"],
        volume: 0.3,
    },
} as const;

/** Type for valid sound effect names */
type SoundEffectName = keyof typeof SOUND_EFFECT_REGISTRY;

/**
 * Internal state for managing a single sound effect
 * Tracks loading, playback, and audio context nodes
 */
class SoundEffectState {
    /** Loaded audio buffers for this sound effect */
    private readonly audioBuffers: AudioBuffer[] = [];

    /** Currently playing audio source node */
    private currentAudioSource: AudioBufferSourceNode | null = null;

    /** Gain node for volume control */
    private readonly gainNode: GainNode;

    /** Promise that resolves when all audio files are loaded */
    private readonly loadingPromise: Promise<void>;

    /** ID of the most recent play request */
    private pendingPlayRequestId: number | null = null;

    /** Index for cycling through multiple audio files */
    private nextAudioIndex = 0;

    /** Whether this sound is currently playing */
    private isCurrentlyPlaying = false;

    /**
     * Creates a new sound effect state
     * @param audioContext - Web Audio API context
     * @param config - Sound effect configuration
     */
    constructor(
        private readonly audioContext: AudioContext,
        private readonly config: SoundEffectConfig,
    ) {
        this.gainNode = this.createGainNode();
        this.loadingPromise = this.loadAudioFiles();
    }

    /** Whether this sound effect is currently playing */
    get isPlaying(): boolean {
        return this.isCurrentlyPlaying;
    }

    /** Promise that resolves when audio files are loaded */
    get onLoaded(): Promise<void> {
        return this.loadingPromise;
    }

    /**
     * Creates and configures the gain node for volume control
     * @returns Configured gain node
     */
    private createGainNode(): GainNode {
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = this.config.volume;
        gainNode.connect(this.audioContext.destination);
        return gainNode;
    }

    /**
     * Loads all audio files for this sound effect
     * @returns Promise that resolves when loading is complete
     */
    private async loadAudioFiles(): Promise<void> {
        const loadPromises = this.config.paths.map(async (path) => {
            try {
                const response = await fetch(path);
                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch audio: ${response.status} ${response.statusText}`,
                    );
                }

                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer =
                    await this.audioContext.decodeAudioData(arrayBuffer);
                this.audioBuffers.push(audioBuffer);
            } catch (error) {
                console.error(`Failed to load audio file: ${path}`, error);
                throw error;
            }
        });

        await Promise.all(loadPromises);
    }

    /**
     * Plays this sound effect
     * @param playRequestId - Unique identifier for this play request
     * @returns Promise that resolves when playback starts
     */
    async play(playRequestId: number): Promise<void> {
        this.pendingPlayRequestId = playRequestId;

        // Wait for audio to load
        await this.loadingPromise;

        // Check if this play request is still valid
        if (this.pendingPlayRequestId !== playRequestId) {
            return;
        }

        // Handle delay if specified
        if (this.config.delay && this.config.delay > 0) {
            await this.waitForDelay(this.config.delay);

            // Check again if request is still valid after delay
            if (this.pendingPlayRequestId !== playRequestId) {
                return;
            }
        }

        this.startPlayback();
    }

    /**
     * Waits for the specified delay
     * @param delayMs - Delay in milliseconds
     * @returns Promise that resolves after the delay
     */
    private waitForDelay(delayMs: number): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(resolve, delayMs);
        });
    }

    /**
     * Starts audio playback with the current buffer
     */
    private startPlayback(): void {
        this.stop(); // Stop any currently playing audio

        if (this.audioBuffers.length === 0) {
            console.warn("No audio buffers available for playback");
            return;
        }

        const audioSource = this.audioContext.createBufferSource();
        audioSource.buffer = this.audioBuffers[
            this.nextAudioIndex
        ] as AudioBuffer;
        audioSource.loop = this.config.loop ?? false;
        audioSource.connect(this.gainNode);

        // Set up end event handler
        audioSource.addEventListener("ended", () => {
            this.isCurrentlyPlaying = false;
            this.currentAudioSource = null;
        });

        // Start playback
        audioSource.start();
        this.currentAudioSource = audioSource;
        this.isCurrentlyPlaying = true;

        // Cycle to next audio buffer for variety
        this.nextAudioIndex =
            (this.nextAudioIndex + 1) % this.audioBuffers.length;
    }

    /**
     * Stops the currently playing audio
     */
    stop(): void {
        if (this.currentAudioSource) {
            try {
                this.currentAudioSource.stop();
            } catch (error) {
                // Audio source may already be stopped
                console.debug("Audio source stop error:", error);
            }
            this.currentAudioSource = null;
        }

        this.isCurrentlyPlaying = false;
        this.pendingPlayRequestId = null;
    }

    /**
     * Cancels any pending play requests
     */
    cancelPendingRequests(): void {
        this.pendingPlayRequestId = null;
    }
}

/**
 * Manages sound effects for the physics playground
 * Handles loading, playback, and debugging of Half-Life 2 audio
 */
export class PhysicsSoundEffects {
    /** Web Audio API context for audio processing */
    private readonly audioContext: AudioContext;

    /** Map of sound effect names to their state objects */
    private readonly soundStates = new Map<SoundEffectName, SoundEffectState>();

    /** Counter for generating unique play request IDs */
    private nextPlayRequestId = 1;

    /** Whether the sound system has started loading */
    private hasStartedLoading = false;

    /** Timeout for non-looping sound cancellation */
    private readonly playTimeouts = new Map<string, number>();

    /**
     * Creates a new physics sound effects manager
     */
    constructor() {
        this.audioContext = new AudioContext();
        this.setupLazyLoading();
    }

    /**
     * Sets up lazy loading to start after page load
     */
    private setupLazyLoading(): void {
        // Don't block initial page load for audio preloading
        window.addEventListener(
            "load",
            () => {
                this.startLoading();
            },
            { once: true },
        );
    }

    /**
     * Plays a sound effect by name
     * @param name - Name of the sound effect to play
     * @returns Promise that resolves when playback starts
     */
    async playSound(name: string): Promise<void> {
        if (!this.isValidSoundName(name)) {
            console.error(`Unknown sound effect: ${name}`);
            return;
        }

        // Ensure loading has started
        this.startLoading();

        const state = this.soundStates.get(name);
        if (!state) {
            console.error(`Sound state not found for: ${name}`);
            return;
        }

        const config = SOUND_EFFECT_REGISTRY[name];
        const playRequestId = this.generatePlayRequestId();

        // Set up timeout for non-looping sounds to prevent stale requests
        this.setupPlayTimeout(name, config, state);

        // Stop conflicting sounds
        this.stopConflictingSounds(config);

        // Start playback
        await state.play(playRequestId);
    }

    /**
     * Stops a currently playing sound effect
     * @param name - Name of the sound effect to stop
     */
    async stopSound(name: string): Promise<void> {
        if (!this.isValidSoundName(name)) {
            console.error(`Unknown sound effect: ${name}`);
            return;
        }

        const state = this.soundStates.get(name);
        if (state) {
            state.stop();
        }

        // Clear any pending timeout
        const timeout = this.playTimeouts.get(name);
        if (timeout) {
            clearTimeout(timeout);
            this.playTimeouts.delete(name);
        }
    }

    /**
     * Starts loading all sound effects
     */
    private startLoading(): void {
        if (this.hasStartedLoading) {
            return;
        }

        this.hasStartedLoading = true;
        this.initializeSoundStates();
        this.createDebugInterface();
    }

    /**
     * Initializes sound states for all registered sound effects
     */
    private initializeSoundStates(): void {
        for (const [name, config] of Object.entries(SOUND_EFFECT_REGISTRY)) {
            const normalizedConfig = this.normalizeConfig(config);
            const state = new SoundEffectState(
                this.audioContext,
                normalizedConfig,
            );
            this.soundStates.set(name as SoundEffectName, state);
        }
    }

    /**
     * Normalizes sound effect configuration
     * @param config - Raw configuration object
     * @returns Normalized configuration
     */
    private normalizeConfig(config: SoundEffectConfig): SoundEffectConfig {
        return {
            ...config,
            delay: config.delay ?? 0,
            stops: config.stops ?? [],
            loop: config.loop ?? false,
        };
    }

    /**
     * Generates a unique play request ID
     * @returns Unique identifier
     */
    private generatePlayRequestId(): number {
        this.nextPlayRequestId += 1;

        return this.nextPlayRequestId;
    }

    /**
     * Sets up timeout for non-looping sounds to prevent stale requests
     * @param name - Sound effect name
     * @param config - Sound configuration
     * @param state - Sound state
     */
    private setupPlayTimeout(
        name: string,
        config: SoundEffectConfig,
        state: SoundEffectState,
    ): void {
        if (!config.loop) {
            const delay = config.delay ?? 0;
            const timeout = setTimeout(() => {
                state.cancelPendingRequests();
                this.playTimeouts.delete(name);
            }, delay + 500) as unknown as number;

            this.playTimeouts.set(name, timeout);
        }
    }

    /**
     * Stops sounds that conflict with the current sound
     * @param config - Configuration of the sound being played
     */
    private stopConflictingSounds(config: SoundEffectConfig): void {
        if (!config.stops) return;

        for (const soundToStop of config.stops) {
            this.stopSound(soundToStop);
        }
    }

    /**
     * Checks if a sound name is valid
     * @param name - Sound name to validate
     * @returns Whether the name is valid
     */
    private isValidSoundName(name: string): name is SoundEffectName {
        return name in SOUND_EFFECT_REGISTRY;
    }

    /**
     * Creates debug interface for testing sounds
     */
    private createDebugInterface(): void {
        const container = document.querySelector("#sounddebug ul");
        if (!container) {
            return;
        }

        this.clearDebugInterface(container);
        this.populateDebugInterface(container);
    }

    /**
     * Clears the debug interface
     * @param container - Container element
     */
    private clearDebugInterface(container: Element): void {
        container.innerHTML = "";
    }

    /**
     * Populates the debug interface with sound controls
     * @param container - Container element
     */
    private populateDebugInterface(container: Element): void {
        for (const [name, state] of this.soundStates.entries()) {
            const config = SOUND_EFFECT_REGISTRY[name];
            const listItem = this.createDebugButton(name, config, state);
            container.appendChild(listItem);
        }
    }

    /**
     * Creates a debug button for a sound effect
     * @param name - Sound effect name
     * @param config - Sound configuration
     * @param state - Sound state
     * @returns List item element with button
     */
    private createDebugButton(
        name: string,
        config: SoundEffectConfig,
        state: SoundEffectState,
    ): HTMLLIElement {
        const listItem = document.createElement("li");
        const button = document.createElement("button");

        button.textContent = name;
        button.disabled = true;

        // Enable button when audio loads
        state.onLoaded
            .then(() => {
                button.disabled = false;
            })
            .catch((error) => {
                console.error(`Failed to load sound: ${name}`, error);
                button.textContent = `${name} (failed)`;
                button.disabled = true;
            });

        // Set up button click handler
        button.addEventListener("click", () => {
            this.handleDebugButtonClick(name, config, state);
        });

        listItem.appendChild(button);
        return listItem;
    }

    /**
     * Handles debug button clicks
     * @param name - Sound effect name
     * @param config - Sound configuration
     * @param state - Sound state
     */
    private handleDebugButtonClick(
        name: string,
        config: SoundEffectConfig,
        state: SoundEffectState,
    ): void {
        if (config.loop && state.isPlaying) {
            // Toggle looping sounds
            this.stopSound(name);
        } else {
            // Play the sound
            this.playSound(name);
        }
    }
}
