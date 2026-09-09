import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Home from "./pages/Home";
import fetchData from "./features/fetchData";
import { setUserData } from "./redux/slices/userSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await fetchData("/me");
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
