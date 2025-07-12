import { Route, Routes } from "react-router";
import MainLayout from "./layouts/MainLayout";
import navigationItems from "./data/navigation";
import Login from "./pages/Auth/Login";
import Callback from "./pages/Auth/Callback";
import ProtectedRoute from "./pages/Auth/ProtectedRoute";
import PublicRoute from "./pages/Auth/PublicRoute";

const App = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          {navigationItems.map((item) => (
            <Route
              key={item.title}
              path={item.path}
              element={<item.element />}
            />
          ))}
        </Route>
      </Route>

      <Route path="auth">
        <Route element={<PublicRoute />}>
          <Route path="login" element={<Login />} />
        </Route>
        <Route path="callback" element={<Callback />}></Route>
      </Route>
    </Routes>
  );
};

export default App;
