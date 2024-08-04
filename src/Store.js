class Store {
	constructor() {
		this.state = null;
		this.reducers = null;
		this.listeners = {};
		this.isConfigured = false;
	}

	/**
	 * Configures the store with the initial state and reducers.
	 * @param {object} config - The initial state and reducers configuration.
	 */
	configure({ initialState, reducers }) {
		if (!initialState || !reducers) {
			throw new Error("Initial state and reducers must be provided.");
		}
		this.state = initialState;
		this.reducers = reducers;
		this.isConfigured = true;
	}

	/**
	 * Gets the current state or a specific slice of the state.
	 * @param {string} slice - The slice of the state to retrieve.
	 * @returns {any} The state or a specific slice of the state.
	 */
	getState(slice) {
		this.checkConfigured();
		return slice ? this.state[slice] : this.state;
	}

	/**
	 * Dispatches an action to the store to update the state.
	 * @param {object} action - The action to dispatch.
	 */
	dispatch(action) {
		this.checkConfigured();
		const { slice, type } = action;

		if (!this.reducers[slice]) {
			throw new Error(`Reducer for slice "${slice}" not found.`);
		}

		this.state[slice] = this.reducers[slice](this.state[slice], action);
		console.log(`${slice}/${type} =>`, this.state[slice]);

		if (this.listeners[slice]) {
			this.listeners[slice].forEach((listener) => listener());
		}
	}

	/**
	 * Subscribes a listener to a specific slice of the state.
	 * @param {string} slice - The slice of the state to subscribe to.
	 * @param {function} listener - The listener function to call when the state changes.
	 * @returns {function} A function to unsubscribe the listener.
	 */
	subscribe(slice, listener) {
		this.checkConfigured();
		if (!this.listeners[slice]) {
			this.listeners[slice] = [];
		}
		this.listeners[slice].push(listener);
		return () => {
			this.listeners[slice] = this.listeners[slice].filter((l) => l !== listener);
		};
	}

	/**
	 * Checks if the store is configured.
	 */
	checkConfigured() {
		if (!this.isConfigured) {
			throw new Error(
				"Store is not configured. Call configure() before using other methods."
			);
		}
	}
}

const store = new Store();
export default store;
