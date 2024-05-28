import style from "./homePage.module.css";

import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import MainHome from "../../components/MainHome/MainHome";
// import Maps from "../../components/MapsView/MapsView";

const HomePage = () => {
  return (
    <div className={style.container}>
      <Navbar />
      {/* <Maps /> */}
      <MainHome />
      <Footer />
    </div>
  );
};

export default HomePage;
