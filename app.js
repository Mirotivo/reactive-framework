// Home Component
class Home extends Component {
    render() {
        return `
            <div>
                <h1>Welcome to the Home Page</h1>
                <button id="toAbout">Go to About</button>
            </div>
        `;
    }

    mount() {
        this.bindEvent("toAbout", "click", this.goToAbout);
    }

    goToAbout() {
        router.navigate('/about');
    }
}

// About Component
class About extends Component {
    render() {
        return `
            <div>
                <h1>About Page</h1>
                <button id="toHome">Go to Home</button>
            </div>
        `;
    }

    mount() {
        document.getElementById("toHome").onclick = () => router.navigate('/');
    }
}

// Application Initialization
const appRoot = document.getElementById("app");
const router = RouterFactory.create(appRoot);
router.addRoute("/", new Home());
router.addRoute("/about", new About());
router.navigate('/');
