import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import TransactionPage from "./pages/TransactionPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import Header from "./components/ui/Header.jsx";
import NotFound from "./pages/NotFoundPage.jsx";

function App() {
  const auth = true;
  return (
    <>
      {auth && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/signup" element={<SignUpPage />}></Route>
        <Route path="/transaction/:id" element={<TransactionPage />}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </>
  );
}
export default App;