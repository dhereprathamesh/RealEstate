import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./routes/homepage/homePage";
import Listpage from "./routes/listPage/listPage";
import Layout from "./routes/layout/layout";
import SinglePage from "./routes/singlePage/SinglePage";
import ProfilePage from "./routes/profilePage/profilePage";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/list",
          element: <Listpage />,
        },
        {
          path: "/:id",
          element: <SinglePage />,
        },
        {
          path: "/profile",
          element: <ProfilePage />,
        },
        // {
        //   path: "/login",
        //   element: <Login />,
        // },
        // {
        //   path: "/register",
        //   element: <Register />,
        // },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
