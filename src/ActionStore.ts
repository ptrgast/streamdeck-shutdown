/**
 * A store for saving and retrieving action instance data.
 */
export class ActionStore<T> {

	private store: Map<string, T> = new Map();

	set(action: any, value: T) {		
		this.store.set(action.id, value);
	}

	get(action: any): T|undefined {
		return this.store.get(action.id);
	}

}