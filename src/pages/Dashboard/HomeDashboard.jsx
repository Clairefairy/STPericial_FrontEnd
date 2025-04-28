import Header from "../../components/layout/Header";
import Container from "../../components/layout/Container";
import styles from "./Dashboard.module.css";

import WelcomeMessage from "../../components/Dashboard/WelcomeMessage";
import CaseStatusCards from "../../components/Dashboard/CaseStatusCards";
import WeeklyActivityChart from "../../components/Dashboard/WeeklyActivityChart";
import CaseDurationChart from "../../components/Dashboard/CaseDurationChart";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../util/UserContext";
import { buscar } from "../../util/service";

const HomeDashboard = () => {

    const [casos, setCasos] = useState([])
    const navigate = useNavigate();

    const {usuario} = useContext(AuthContext)

    const carregarCasos = async () => {
        try {
            await buscar("/cases", setCasos, {
                headers: {
                    Authorization: `Bearer ${usuario.token}`
                }
            });
        } catch (err) {
         
            if (err.status === 401 || err.status === 403) navigate("/login", { state: { notAdmin: true } });
            navigate("/login");
        } 
    };

    useEffect(() => {
        carregarCasos();
    }, [])
          
    return (
    
              
                    <div className={styles.contentArea}>
                        <WelcomeMessage className={styles.welcomeMessage}  />

                        <div className={styles.cardContainer}>
                <CaseStatusCards className={styles.caseCard} casos={casos} />
                        </div>

                        <div className={styles.chartGrid}>
                            <WeeklyActivityChart className={styles.chart} casos={casos} />
                            <CaseDurationChart className={styles.chart} casos={casos}/>
                        </div>
                 
          </div>
     
    );
};

export default HomeDashboard;
