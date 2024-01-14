/**
 * Get the current timestamp in seconds.
 * @returns Seconds
 */
function now() {
	// Round to the next second to synchronize counting if more than
	// one actions are active
	return Math.ceil((new Date()).getTime() / 1000);
}

/**
 * A countdown timer.
 */
export class Countdown {

	private timer: any = null;
	private startTime: number = 0;
	private intervalSeconds: number = 0.1;
	private durationSeconds: number = 0;
	private onTickCallback: ((remaining: number) => void) | null = null;
	private onEndCallback: (() => void) | null = null;

	constructor() {
		this.timer = null;		
	}

	/**
	 * Set the callback for catching timer's ticks.
	 * @param callback
	 */
	onTick(callback: ((remaining: number) => void)) {
		this.onTickCallback = callback;
	}

	/**
	 * Set the callback for catching the countdown end event.
	 * @param callback
	 */
	onEnd(callback: (() => void)) {
		this.onEndCallback = callback;
	}

	/**
	 * Start the countdown.
	 * @param durationSeconds The countdown duration in seconds
	 */
	start(durationSeconds: number = 0) {		
		this.durationSeconds = durationSeconds;

		this.stop();

		this.startTime = now();

		this.tick();	
		this.timer = setInterval(this.tick.bind(this), this.intervalSeconds * 1000);

		console.log(`timer started`);
	}

	/**
	 * Stop the countdown.
	 */
	stop() {
		if (this.timer !== null) {			
			clearInterval(this.timer);
			this.timer = null;
			console.log("timer stopped")
		}
	}

	/**
	 * Check if the countdown has started.
	 * @returns `true` if the countdown has started and `false` otherwise
	 */
	isStarted() {
		return this.timer !== null;
	}

	private tick() {
		const secondsElapsed = now() - this.startTime;

		const remaining: number = Math.max(this.durationSeconds - secondsElapsed, 0);

		if (this.onTickCallback) {
			this.onTickCallback(remaining);
		}

		if (secondsElapsed >= this.durationSeconds) {
			this.end();
		}		
	}

	private end() {
		this.stop();
		console.log("countdown completed")
		if (this.onEndCallback) {
			this.onEndCallback();
		}
	}

}