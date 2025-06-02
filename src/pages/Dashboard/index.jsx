import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import Container from "../../components/layout/Container";
import styles from "./Dashboard.module.css";

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
