import { action, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";


@action({ UUID: "com.ptrgast.shutdown.shutdown" })
export class Shutdown extends SingletonAction<ShutdownSettings> {

	async onKeyDown(ev: KeyDownEvent<ShutdownSettings>): Promise<void> {

	}
}

type ShutdownSettings = {};
