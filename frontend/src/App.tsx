import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DiscoverPage from "./pages/DiscoverPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import AddSpacePage from "./pages/AddSpacePage";
import SpaceDetailsPage from "./pages/SpaceDetailsPage";
import EditSpacePage from "./pages/EditSpacePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/discover" element={<DiscoverPage />} />
      <Route path="/auth/signin" element={<SignInPage />} />
      <Route path="/auth/signup" element={<SignUpPage />} />
      <Route path="/spaces/add" element={<AddSpacePage />} />
      <Route path="/spaces/:id" element={<SpaceDetailsPage />} />
      <Route path="/spaces/:id/edit" element={<EditSpacePage />} />
    </Routes>
  );
}

export default App;
