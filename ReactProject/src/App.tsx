import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import CandidateAuth from "./components/CandidateAuth";
import MatchmakerAuth from "./components/MatchmakerAuth";
import Login from "./components/login";
import Home from "./components/home";
import SignIn from "./components/register";
import GetCandidates1 from "./components/get-candidate";
// import Details from "./components/DetailsAuth";
import PostDetailsAuth from "./components/PostDetailsAuth";
import MatchMakerForm from "./components/PostDetailsMM";
// import RegistrationForm from "./components/xxx";

import MatchmakerNotes from "./components/MatchmakerNotes";
import UserProvider from "./components/UserContext";
// import { FileUpload } from "@mui/icons-material";
// import FileUploader from "./components/Files";
// import About from "./components/aboutCard";
import UserProfile from "./components/Candidateprofile";
import MatchCandidates from "./components/matchCandidates";
// import HowItWorks from "./components/HowItWork";


const routes = createBrowserRouter([
  {
    path: "/",
    element: < Home/>,
  },
  {
  path: "/candidate-auth",
  element: <CandidateAuth />,
  children: [
    { path: "login/:userType", element: <Login /> },
    { path: "signup/:userType", element: <SignIn /> },
    { path: "Post-Details-Auth", element: <PostDetailsAuth /> },
    { path: "CandidateProfile", element: <UserProfile /> },
    // { path: "match", element: <MatchCandidates /> } // 👈 הוספנו את זה
  ],
},

  {
    path: "/matchmaker-auth",
    element: <MatchmakerAuth />,
    children: [
      { path: "login/:userType", element: <Login  /> },
      { path: "signup/:userType", element: <SignIn /> },
      { path: "allMales", element: <GetCandidates1 />,children:[
          { path: "match/:role/:id", element: <MatchCandidates/> } // 👈 הוספנו את זה
      ] },
      // { path: "allMales/details/:role/:id", element: <Details /> },
      { path: "post-details-matchmaker", element: <MatchMakerForm />, },
      { path: "matchmaker-notes", element: <MatchmakerNotes />, },



    ],
  },
  // {
  //   path: "/about", element: <About />, 
    
  // },

  {
    path: "*",
    element: <Navigate to="/" />, // כל נתיב לא מוכר מפנה לדף הבית
  },
]);

function App() {
  return <UserProvider><RouterProvider router={routes} /></UserProvider>

}

export default App;
