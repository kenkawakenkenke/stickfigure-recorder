import { BrowserRouter as Router, Route } from "react-router-dom";

import MainPage from "./pages/main_page.js";
import TermsPage from "./pages/terms_page.js";
import PrivacyPage from "./pages/privacy_page.js";
import ContactPage from "./pages/contact_page.js";

function App() {
  return (
    <div>
      <Router>
        <Route exact path="/" component={MainPage} />
        <Route exact path="/terms" component={TermsPage} />
        <Route exact path="/privacy" component={PrivacyPage} />
        <Route exact path="/contact" component={ContactPage} />
      </Router>
    </div>
  );
}

export default App;
