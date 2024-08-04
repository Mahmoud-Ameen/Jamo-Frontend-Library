## Jamo Library Documentation

### Overview

Jamo is a lightweight JavaScript library designed for building modular, component-based, single-page application (SPA) applications with centralized state management. It provides a simple way to create reusable components, manage application state, and handle routing.

This version of Jamo is created for learning purposes. It is not intended to be used in production.

### Table of Contents

-   [Installation](#installation)
-   [Getting Started](#getting-started)
-   [Components](#components)
    -   [Creating Components](#creating-components)
    -   [Using Components](#using-components)
-   [State Management](#state-management)
    -   [Store](#store)
    -   [Reducers](#reducers)
    -   [Dispatching Actions](#dispatching-actions)
    -   [Subscribing to State Changes](#subscribing-to-state-changes)
-   [Routing](#routing)
    -   [Defining Routes](#defining-routes)
    -   [Navigating Between Routes](#navigating-between-routes)
-   [Configuration](#configuration)

### Installation

To include Jamo in your project, import the necessary files.

```javascript
import Jamo from "./public/Jamo.js";
```

### Getting Started

Here's a quick example to get you started with Jamo:

```javascript
import Jamo from "./public/Jamo.js";
import MyPage from "./pages/MyPage.js";

const { App, Component, store } = Jamo;

// Configure the store
store.configure({
	initialState: {
		message: "Hello, World!",
	},
	reducers: {
		message: (state, action) => {
			switch (action.type) {
				case "SET_MESSAGE":
					return action.payload;
				default:
					return state;
			}
		},
	},
});

// Create an app instance and add a route
const app = new App("root");
app.addRoute("#/", new MyPage());
app.goToPage("/");
```

### Components

#### Creating Components

Jamo alows you to build up your project from encapsulated, reusable components. Components in Jamo are classes that extend the `Component` class.
Each Jamo component has its own `html` template file, `css` file, and `js` file.

#### Configuring Components

Jamo components use a configuration file (`JamoComponentsConfig.json`) to define the paths for templates and styles. Ensure this file is in the root directory. Each component is expected to be in a directory that contains a `[ComponentName].js` file declaring and exporting the component class, a `[ComponentName].html` specifying the component's HTML template (structure), and an optional `[ComponentName].css` for the component's styles.

```json
{
	"componentDirectory": {
		"MyComponent": "components/MyComponent/",
		"AboutComponent": "components/AboutComponent/"
	}
}
```

**Example:**

-   `MyComponent.js`

    ```javascript
    import Jamo from "../../public/Jamo.js";

    export default class MyComponent extends Jamo.Component {
    	initialize() {
    		// Any logic for dom manipulation on the component's html goes here
    	}
    }
    ```

-   `MyComponent.html`

    ```html
    <div class="my-component">
    	<h1>Welcome to My Component!</h1>
    </div>
    ```

#### Using Components

To include a subcomponent within another component, add a placeholder in the HTML template of the parent component.

A placeholder is any element that has the `data-component` attribute set to the name of the component you want to include.

Please note that there must be a matching component in the `JamoComponentsConfig.json` file and a `[ComponentName].js` and `[ComponentName].html` files in the specified directory.

**Example:**

-   `MyComponent.html`

    ```html
    <div>
    	<h1>Welcome to My Component!</h1>
    	<div data-component="MessageComponent"></div>
    	<!-- Jamo will replace the placeholder element with the MessageComponent -->
    </div>
    ```

### State Management

#### Store

The store is a centralized state management system inspired by Redux. It holds the application state and allows components to subscribe to state changes.

-   **configure(initial_state, reducers)**: Configures the store with the initial state and reducers.
-   **getState(slice)**: Gets the current state or a specific slice of the state.
-   **dispatch(action)**: Dispatches an action to the store.
-   **subscribe(slice, listener)**: Subscribes a listener to a specific slice of the state.

### State

State is an object that holds the application's state. It consists of one or more slices of state, each with its own reducer.

**Example:**

```javascript
const initialState = {
	products: [],
	users: [],
	cart: [],
};
```

#### Reducers

Reducers are functions that specify how the state changes in response to actions. Each slice of the state has its own reducer.
Reducers are pure functions that return a new state based on the current state and an action.

**Example:**

```javascript
const reducers = {
	cart: (state, action) => {
		switch (action.type) {
			case "ADD_CART_ITEM":
				return [...state, action.payload]; // updated state
			default:
				return state;
		}
	},
};
```

#### Dispatching Actions

Use the `dispatch` method to send actions to the store.

```javascript
store.dispatch({
	slice: "cart",
	type: "ADD_CART_ITEM",
	payload: { itemId: "123", quantity: 1 },
});
```

#### Subscribing to State Changes

Components can subscribe to specific slices of the state to react to changes.

```javascript
store.subscribe("cart", () => {
	console.log("Cart updated:", store.getState("cart"));
});
```

### Routing

#### Defining Routes

Routes map URL paths to page components. Use the `addRoute` method to define routes.

```javascript
const app = new App("root");
app.addRoute("#/", new MyComponent());
app.addRoute("#/about", new AboutComponent());
```

#### Navigating Between Routes

Use the `goToPage` method to navigate between routes.

```javascript
app.goToPage("/about");
```

### Examples

#### `JamoComponentsConfig.json`

```json
{
	"componentDirectory": {
		"MyComponent": "components/MyComponent/",
		"AboutComponent": "components/AboutComponent/"
	}
}
```

#### `components/MyComponent/MyComponent.js`

```javascript
import Jamo from "../../public/Jamo.js";

export default class MyComponent extends Jamo.Component {
	initialize() {
		// Component-specific initialization logic if needed
		// can be left empty
	}
}
```

#### `components/MyComponent/MyComponent.html`

```html
<div>
	<h1>My Component</h1>
	<div data-component="NestedComponent"></div>
</div>
```

#### `components/NestedComponent/NestedComponent.js`

```javascript
import Jamo from "../../public/Jamo.js";

export default class NestedComponent extends Jamo.Component {
	initialize() {
		// Nested component-specific initialization logic
		// will be left empty in this example
	}
}
```

#### `components/NestedComponent/NestedComponent.html`

```html
<div>
	<p>This is a nested component.</p>
</div>
```

#### `main.js`

```javascript
import Jamo from "./public/Jamo.js";

const { App, store } = Jamo;
import MyComponent from "./components/MyComponent/MyComponent.js";
import NestedComponent from "./components/NestedComponent/NestedComponent.js";

store.configure({
	initialState: {
		message: "Hello, World!",
	},
	reducers: {
		message: (state, action) => {
			switch (action.type) {
				case "SET_MESSAGE":
					return action.payload;
				default:
					return state;
			}
		},
	},
});

const app = new App("root");
app.addRoute("#/", new MyComponent());
app.addRoute("#/nested", new NestedComponent());
app.goToPage("/");
```
