//src/component.js
export default class Component {
	static config = null;
	constructor() {
		this.template = "";
		this.styles = "";
		this.element = null;

		this.directoryPath;
		this.templatePath;
		this.stylesPath;
	}

	/**
	 * Renders the component and returns its HTML element.
	 * @returns {Promise<HTMLElement>} The rendered DOM element representing the component.
	 */
	async render() {
		await this.#setup();
		this.initialize();
		return this.element;
	}

	/**
	 * Initializes the component by setting up DOM manipulation logic.
	 * Override this method in subclasses to add custom logic.
	 */
	initialize() {
		// To be overridden by subclasses
	}

	/**
	 * Loads the configuration file if it hasn't been loaded already.
	 */
	async #loadConfig() {
		if (!Component.config) {
			try {
				const response = await fetch("./JamoComponentsConfig.json");
				const config = await response.json();
				Component.config = config;
			} catch (error) {
				console.error("Error loading configuration:", error);
				throw new Error("Error loading configuration.");
			}
		}
	}

	/**
	 * Sets the paths for the template and styles based on the component's configuration.
	 */
	async #setPaths() {
		if (!Component.config) {
			await this.#loadConfig();
		}
		this.directoryPath = Component.config.componentDirectory[this.constructor.name];
		if (!this.directoryPath) {
			throw new Error(`Component configuration not found for ${this.constructor.name}`);
		}
		this.templatePath = this.directoryPath + this.constructor.name + ".html";
		this.stylesPath = this.directoryPath + this.constructor.name + ".css";
	}

	/**
	 * Sets up the component by loading its configuration, fetching its template and styles,
	 * parsing the HTML, applying styles, and rendering nested components.
	 */
	async #setup() {
		try {
			await this.#setPaths();
			await this.#fetchTemplateAndStyles();

			this.element = this.#parseHTML(this.template);
			this.#applyStyles(this.styles);

			await this.#renderNestedComponents();
		} catch (error) {
			console.error("Error fetching, parsing, or rendering template or styles:", error);
			throw new Error("Error fetching, parsing, or rendering template or styles.");
		}
	}

	/**
	 * Fetches the template and styles for the component.
	 */
	async #fetchTemplateAndStyles() {
		try {
			const [templateResponse, stylesResponse] = await Promise.all([
				fetch(this.templatePath),
				fetch(this.stylesPath || ""),
			]);

			this.template = await templateResponse.text();
			this.styles = await stylesResponse.text();
		} catch (error) {
			console.error("Error fetching template or styles:", error);
			throw new Error("Error fetching template or styles.");
		}
	}

	/**
	 * Parses an HTML string and returns the first element.
	 * @param {string} htmlString - The HTML string to parse.
	 * @returns {HTMLElement} The parsed HTML element.
	 */
	#parseHTML(htmlString) {
		const tempContainer = document.createElement("div");
		tempContainer.innerHTML = htmlString.trim();
		return tempContainer.firstChild;
	}

	/**
	 * Applies the given CSS string as a style element in the document head.
	 * @param {string} cssString - The CSS string to apply.
	 */
	#applyStyles(cssString) {
		const styleId = `${this.constructor.name}-styles`;
		if (!document.getElementById(styleId)) {
			const style = document.createElement("style");
			style.id = styleId;
			style.innerHTML = cssString;
			document.head.appendChild(style);
		}
	}

	/**
	 * Renders nested components within the main component.
	 */
	async #renderNestedComponents() {
		const placeholders = this.element.querySelectorAll("[data-component]");

		for (const placeholder of placeholders) {
			const componentName = placeholder.dataset.component;
			if (!componentName) continue;

			const directoryPath = Component.config.componentDirectory[componentName];

			const { default: ComponentClass } = await import(
				"/" + directoryPath + componentName + ".js"
			);
			const componentInstance = new ComponentClass();

			const nestedElement = await componentInstance.render();
			placeholder.replaceWith(nestedElement);
		}
	}
}
