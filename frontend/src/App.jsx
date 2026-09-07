import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Home from "./pages/Home";
import getUser from "./features/getUser";
import { setUserData } from "./redux/slices/userSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      console.log("Logged in user:", user);
      if (user) {
        dispatch(setUserData(user));
      }
    };

    fetchUser();
  }, [dispatch]);

  return <Home />;
}

export default App;
