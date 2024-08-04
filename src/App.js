import Component from "./Component.js";

export default class App {
	constructor(rootElementId) {
		this.rootElementId = rootElementId;
		this.rootElement = document.getElementById(rootElementId);
		this.routes = {};

		this.handleRouting();
		window.addEventListener("popstate", this.handleRouting.bind(this));
	}

	/**
	 * Adds a route to the application.
	 * @param {string} path - The path of the route.
	 * @param {Component} component - The component associated with the path.
	 */
	addRoute(path, component) {
		this.routes = { ...this.routes, [path]: component };
	}

	/**
	 * Navigates to a specific page.
	 * @param {string} pageHash - The hash of the page to navigate to.
	 */
	goToPage(pageHash) {
		history.pushState(null, null, `#${pageHash}`);
		this.handleRouting();
	}

	/**
	 * Handles the routing logic based on the current URL hash.
	 */
	handleRouting() {
		const hash = window.location.hash;
		const page = this.routes[hash];

		if (!page) {
			console.error("Invalid Path: ", hash);
			return;
		}

		this.loadPage(page);
	}

	/**
	 * Loads a page by rendering the associated component.
	 * @param {Component} component - The component to render.
	 */
	async loadPage(component) {
		this.rootElement.innerHTML = "";
		const componentElement = await component.render();
		this.rootElement.appendChild(componentElement);
	}
}
