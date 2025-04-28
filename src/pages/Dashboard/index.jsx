import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import Container from "../../components/layout/Container";
import styles from "./Dashboard.module.css";

import WelcomeMessage from "../../components/Dashboard/WelcomeMessage";
import CaseStatusCards from "../../components/Dashboard/CaseStatusCards";
import WeeklyActivityChart from "../../components/Dashboard/WeeklyActivityChart";
import CaseDurationChart from "../../components/Dashboard/CaseDurationChart";
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../util/UserContext";

const Dashboard = () => {

const {usuario} = useContext(AuthContext);


if(usuario.user.role === "" || usuario.user.role === "deslogado"){
  return (
    <Navigate to="/login" replace state={{ notAdmin: true }} ></Navigate> 
  )
}

  return (
    <div className={styles.container}>
      <Sidebar className={styles.sidebar} />

      <div className={styles.mainContent}>
        <Header className={styles.header} />
        <Container>
          <Outlet/>
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;
