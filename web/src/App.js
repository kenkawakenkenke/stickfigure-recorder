import { BrowserRouter as Router, Route, useParams } from "react-router-dom";

import MainPage from "./pages/main_page.js";
import TermsPage from "./pages/terms_page.js";
import PrivacyPage from "./pages/privacy_page.js";
import ContactPage from "./pages/contact_page.js";
import GalleryPage from "./pages/gallery_page.js";

function GalleryPageRoute() {
  const { gifID } = useParams();
  return <GalleryPage gifID={gifID}></GalleryPage>;
}

function App() {
  return (
    <div>
      <Router>
        <Route exact path="/" component={MainPage} />
        <Route exact path="/terms" component={TermsPage} />
        <Route exact path="/gallery" component={GalleryPage} />
        <Route exact path="/gallery/:gifID" component={GalleryPageRoute} />
        <Route exact path="/privacy" component={PrivacyPage} />
        <Route exact path="/contact" component={ContactPage} />
      </Router>
    </div>
  );
}

export default App;
