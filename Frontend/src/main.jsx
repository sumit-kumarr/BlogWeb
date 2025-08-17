import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import App from "./App.jsx";
import React from "react";
import {
  BrowserRouter as Router,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import HomePage from "./routes/Homepage.jsx";
import Postlist from "./routes/Postlist.jsx";
import Write from "./routes/Write.jsx";
import Loginpage from "./routes/Loginpage.jsx";
import Register from "./routes/Register.jsx";
import MainLayout from "./Layouts/MainLayout.jsx";
  import { ClerkProvider } from '@clerk/clerk-react'
import SinglePost from "./routes/SinglePost.jsx";
import SavedPosts from "./routes/SavedPosts.jsx";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
 import { ToastContainer } from 'react-toastify';
import About from "./routes/About.jsx";
import NotFound from "./routes/NotFound.jsx";
import ErrorBoundary from "./Components/ErrorBoundary.jsx";
import UserProfile from "./Components/UserProfile.jsx";

const queryClient = new QueryClient()
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/posts",
        element: <Postlist />,
      },
      {
        path: "/saved",
        element: <SavedPosts />,
      },
      {
        path: "/:slug",
        element: <SinglePost />,
      },
      {
        path: "/write",
        element: <Write />,
      },
      {
        path: "/login",
        element: <Loginpage />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path:"/about",
        element:<About/>
      },
      {
        path:"/user/:username",
        element:<UserProfile/>
      },
      {
        path:"*",
        element:<NotFound/> 
      }
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <ClerkProvider publishableKey = {PUBLISHABLE_KEY}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <ToastContainer 
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </QueryClientProvider>
      </ClerkProvider>
    </ErrorBoundary>
  </StrictMode>
);
