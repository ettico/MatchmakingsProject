import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import CandidateAuth from "./components/CandidateAuth";
import MatchmakerAuth from "./components/MatchmakerAuth";
import Login from "./components/login";
import Home from "./components/home";
import SignIn from "./components/register";
// import FileUploader from "./components/Files";
import GetMales from "./components/getCandidate";
import GetCandidates1 from "./components/get-candidate";
import Details from "./components/DetailsAuth";


const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/candidate-auth",
    element: <CandidateAuth />,
    children: [
      { path: "login/:userType", element: <Login /> },
      { path: "signup/:userType", element: <SignIn /> },
    ],
  },
  {
    path: "/matchmaker-auth",
    element: <MatchmakerAuth />,
    children: [
      { path: "login/:userType", element: <Login /> },
      { path: "signup/:userType", element: <SignIn /> },
      { path: "allMales", element: <GetCandidates1 /> ,
        
      },
      { path: "allMales/details/:role/:id", element: <Details /> },
    ],
  },
  {
   path: "allMales", element: <GetMales /> ,
  },
  
  {
    path: "*",
    element: <Navigate to="/" />, // כל נתיב לא מוכר מפנה לדף הבית
  },
]);

function App() {
  return <RouterProvider router={routes} />;
}

export default App;
