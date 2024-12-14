import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import TransactionPage from "./pages/TransactionPage.jsx";
import Header from "./components/ui/Header.jsx";
import NotFound from "./pages/NotFoundPage.jsx";
import { useQuery } from "@apollo/client";
import { GET_AUTHENTICATED_USER } from "./graphql/queries/users.query.js";
import { Toaster } from "react-hot-toast"

function App() {
  const {loading, data, error} = useQuery(GET_AUTHENTICATED_USER);
  console.log("Loading:", loading);
  console.log("Authenticated User:", data);
  console.log("Error:", error);

  if(loading) return null;
  return (
    <>
      {data.authUser && <Header />}
      <Routes>
        <Route path="/" element={data.authUser ? <HomePage authUser={data.authUser}/> : <Navigate to="/login" />}></Route>
        <Route path="/login" element={!data.authUser ? <LoginPage /> : <Navigate to="/" />}></Route>
        <Route path="/signup" element={!data.authUser ? <SignUpPage /> : <Navigate to="/" />}></Route>
        <Route path="/transaction/:id" element={data.authUser ? <TransactionPage /> : <Navigate to="/login" />}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
      <Toaster />
    </>
  );
}
export default App;