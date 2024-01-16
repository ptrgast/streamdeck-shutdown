import { action, KeyUpEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import { Svg } from "../Svg";
import { ActionStore } from "../ActionStore";
import { Countdown } from "../Countdown";
import childProcess from 'child_process';


const STATE_STOPPED = 0;
const STATE_STARTED = 1;

const animator = new Svg(
	"imgs/actions/shutdown/states/countdown.svg", 
	["0:00", "fill:#ff0000;fill-opacity:1;"]
);

function formatRemaining(remaining: number) {
	remaining = Math.ceil(remaining);
	const minutes = Math.floor(remaining / 60);
	const seconds = String(remaining - (minutes * 60)).padStart(2, '0');
	if (minutes > 0) {
		return `${minutes}:${seconds}`;
	} else {
		return `${seconds}`;
	}
}

@action({ UUID: "com.ptrgast.shutdown.shutdown" })
export class Shutdown extends SingletonAction<ShutdownSettings> {

	private countdowns: ActionStore<Countdown> = new ActionStore();

	async onWillAppear(ev: WillAppearEvent<ShutdownSettings>): Promise<void> {
		let countdown = this.countdowns.get(ev.action);
		if (!countdown) {
			this.setState(ev, STATE_STOPPED);
		}
	}

	async onKeyUp(ev: KeyUpEvent<ShutdownSettings>): Promise<void> {	
		let countdown = this.countdowns.get(ev.action);
		if (!countdown) {
			// Init countdown
			console.log(`Creating new countdowns for action: ${ev.action.id}`);
			countdown = new Countdown();
			countdown.onTick((remaining) => {
				const time = (new Date()).getTime() / 1000;
				const opacity = 1 - 0.6 * (0.5 + 0.5 * Math.sin(2 * Math.PI * 1/2 * time));
				ev.action.setImage(animator.createImage([
					formatRemaining(remaining), 
					`fill:#ff0000;fill-opacity:${opacity};`
				]));
			});
			countdown.onEnd(() => {
				this.setState(ev, STATE_STOPPED);
				this.trigger();
			});
			this.countdowns.set(ev.action, countdown);
		} 

		// Start/stop countdown
		if (!countdown.isStarted()) {
			const settings: ShutdownSettings = await ev.action.getSettings();
			const delay = settings.delay || 0;
			if (delay > 0) {
				this.setState(ev, STATE_STARTED);
				countdown.start(delay);
			} else {
				this.trigger();
			}
		} else {
			countdown.stop();
			this.setState(ev, STATE_STOPPED);
		}
	}		

	setState(ev: KeyUpEvent<ShutdownSettings> | WillAppearEvent<ShutdownSettings>, state: number) {
		ev.action.setState(state == 0 ? 0 : 1);
		
		switch (state) {
			case STATE_STARTED:
				break;
			case STATE_STOPPED:
				ev.action.setImage("imgs/actions/shutdown/states/shutdown");
				break;
		}
	}

	trigger() {
		console.log("Shutting down...");
		childProcess.exec('cmd.exe /c "shutdown /s /f"');
	}
}

type ShutdownSettings = {
	delay: number;
};
