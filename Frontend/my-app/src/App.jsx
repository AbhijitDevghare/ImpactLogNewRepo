import { Toaster } from 'react-hot-toast';
import CustomeRoutes from './routes/CustomRoutes';
import OtherRoutes from './routes/OthersRoutes';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './redux/store';
import './App.css';
import { useEffect } from 'react';
import { getUserWhenAppLoads } from './redux/slices/AuthSlice';
import { useNavigate } from 'react-router-dom';

function AppContent() {
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
  const navigate = useNavigate();
  useEffect(() => {
    // dispatch(getUserWhenAppLoads());
    // console.log("WHOLE APP IS RELOADED")
    // if (!isLoggedIn) {
    //   navigate("/");
    // }
  }, [dispatch, isLoggedIn]);

  return (
    <>
      <CustomeRoutes />
      <OtherRoutes />
      <Toaster />
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
