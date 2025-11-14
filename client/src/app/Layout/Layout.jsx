import { Outlet } from "react-router-dom";
import Navigation from "../../widgets/navigation/Navigation";
import Footer from "../../widgets/footer/Footer";


export default function Layout({setUser, user}) {
  return (
    <div>
      <Navigation  setUser = {setUser} user={user} />
      <Outlet />
      <Footer />
    </div>
  );
}
