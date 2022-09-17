import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";


// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";

// Pages
import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";

import "react-toastify/dist/ReactToastify.css";
import './App.css';

function App() {
  return (
		<>
     <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/activate/:uid/:token"
            element={<ActivatePage />}
          /> */}
          <Route path="/upload/*" element={<UploadPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer theme="dark" />
      <Footer />
    </Router>
      </>

  );
}

export default App;
