class Framework {
    constructor(rootId) {
        this.root = document.getElementById(rootId);
    }

    render(component) {
        if (!(component instanceof Component)) {
            throw new Error("Only instances of Component can be rendered.");
        }
        this.root.innerHTML = component.render();
        component.mount();
    }

    createRouter(rootElement) {
        if (window.location.protocol === "file:") {
            return new FileRouter(rootElement); // Use FileRouter for file:// protocol
        } else if (window.location.protocol === "http:" || window.location.protocol === "https:") {
            return new HttpRouter(rootElement); // Use HttpRouter for http:// or https://
        } else {
            throw new Error("Unsupported protocol");
        }
    }

    addRoute(path, component) {
        this.router.addRoute(path, component);
    }
}


class FileRouter {
    constructor(rootElement) {
        this.routes = {};
        this.root = rootElement;
        this.init();
    }

    addRoute(path, component) {
        this.routes[path] = component;
    }

    init() {
        // Listen for hash changes
        window.addEventListener("hashchange", () => this.handleRoute());
        this.handleRoute(); // Handle the initial route
    }

    navigate(path) {
        window.location.hash = path; // Use hash for navigation
    }

    handleRoute() {
        const hash = window.location.hash.replace("#", "") || "/";
        const component = this.routes[hash] || this.routes["/"];
        if (component) {
            this.root.innerHTML = component.render();
            component.mount();
        } else {
            this.root.innerHTML = "<h1>404 - Page Not Found</h1>";
        }
    }
}


class HttpRouter {
    constructor(rootElement) {
        this.routes = {};
        this.root = rootElement;
        this.init();
    }

    addRoute(path, component) {
        this.routes[path] = component;
    }

    init() {
        // Listen for popstate events (back/forward navigation)
        window.addEventListener("popstate", () => this.handleRoute());
        this.handleRoute(); // Handle the initial route
    }

    navigate(path) {
        window.history.pushState({}, "", path); // Use history API for navigation
        this.handleRoute();
    }

    handleRoute() {
        const path = window.location.pathname || "/";
        const component = this.routes[path] || this.routes["/"];
        if (component) {
            this.root.innerHTML = component.render();
            component.mount();
        } else {
            this.root.innerHTML = "<h1>404 - Page Not Found</h1>";
        }
    }
}

class RouterFactory {
    static create(rootElement) {
        if (window.location.protocol === "file:") {
            return new FileRouter(rootElement); // Use FileRouter for file:// protocol
        } else if (window.location.protocol === "http:" || window.location.protocol === "https:") {
            return new HttpRouter(rootElement); // Use HttpRouter for http:// or https://
        } else {
            throw new Error("Unsupported protocol");
        }
    }
}

class Component {
    constructor(props = {}) {
        this.props = props;
        this.state = {};
    }

    bindEvent(selector, event, handler) {
        document.getElementById(selector).addEventListener(event, handler.bind(this));
    }

    // Set state and re-render the component
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.update();
    }

    // Default method to render the component (must be overridden by subclasses)
    render() {
        throw new Error("Render method must be implemented.");
    }

    // Lifecycle method: called after rendering
    mount() {
        // To be overridden by subclasses if needed
    }

    // Update the component's DOM on state change
    update() {
        const root = document.getElementById(this.props.rootId);
        if (root) {
            root.innerHTML = this.render();
            this.mount();
        }
    }
}
