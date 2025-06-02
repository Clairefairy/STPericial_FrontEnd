import styles from "./Dashboard.module.css";
import WelcomeMessage from "../../components/Dashboard/WelcomeMessage";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../util/UserContext";
import { buscar } from "../../util/service";
import DeterminanteBarChart from "../../components/charts/DeterminanteBarChart";
import CaseChartContainer from "../../components/charts/CaseChartContainer";


const HomeDashboard = () => {
    const [casos, setCasos] = useState([]);
    const [filteredCasos, setFilteredCasos] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const navigate = useNavigate();
    const { usuario } = useContext(AuthContext);

    const carregarCasosCompletos = async () => {
        try {
            const casosResponse = await buscar("/cases", null, {
                headers: {
                    Authorization: `Bearer ${usuario.token}`,
                },
            });

            const evidenciasResponse = await buscar("/evidences", null, {
                headers: {
                    Authorization: `Bearer ${usuario.token}`,
                },
            });

            const responsavelIds = [...new Set(casosResponse.map((c) => c.responsible))];

            const responsaveisMap = {};

            await Promise.all(
                responsavelIds.map(async (id) => {
                    try {
                        const user = await buscar(`/users/${id}`, null, {
                            headers: {
                                Authorization: `Bearer ${usuario.token}`,
                            },
                        });
                        responsaveisMap[id] = user;
                    } catch (err) {
                        console.error("Erro ao buscar responsável:", err);
                    }
                })
            );

            const casosCompletos = casosResponse.map((caso) => {
                const evidenciasDoCaso = evidenciasResponse.filter(
                    (e) => e.case === caso._id
                );

                const responsavel = responsaveisMap[caso.responsible] || null;

                return {
                    ...caso,
                    evidences: evidenciasDoCaso,
                    responsible: responsavel,
                };
            });

            setCasos(casosCompletos);
            console.log(casosCompletos)
        } catch (err) {
            console.error("Erro ao carregar dados:", err);
            if (err.status === 401 || err.status === 403)
                navigate("/login", { state: { notAdmin: true } });
            else navigate("/login");
        }
    };

    useEffect(() => {
        carregarCasosCompletos();
    }, []);

    useEffect(() => {
        filterCasosByDate();
    }, [startDate, endDate, casos]);

    const filterCasosByDate = () => {
        if (!startDate || !endDate) {
            setFilteredCasos(casos);
            return;
        }

        const filtered = casos.filter((caso) => {
            const caseDate = new Date(caso.openingDate);
            return caseDate >= new Date(startDate) && caseDate <= new Date(endDate);
        });

        setFilteredCasos(filtered);
    };

    return (
        <div className={styles.contentArea}>
            <WelcomeMessage className={styles.welcomeMessage} />

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "20px",
                    borderRadius: "1rem",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    gap: "12px",
                    flexWrap: "wrap",
                }}
            >
                <label style={{ fontWeight: "bold", color: "#333", marginRight: "8px", whiteSpace: "nowrap" }}>
                    Data Inicial:
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        style={{
                            marginLeft: "8px",
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #ccc",
                            fontSize: "15px",
                            backgroundColor: "#fff",
                            color: "#333",
                        }}
                    />
                </label>
                <label style={{ fontWeight: "bold", color: "#333", whiteSpace: "nowrap" }}>
                    Data Final:
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        style={{
                            marginLeft: "8px",
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #ccc",
                            fontSize: "15px",
                            backgroundColor: "#fff",
                            color: "#333",
                        }}
                    />
                </label>
            </div>


        
     
                <CaseChartContainer className={styles.graficos} casos={filteredCasos} />
                <DeterminanteBarChart className={styles.graficos} casos={filteredCasos} />
         
               
        </div>
    );
};

export default HomeDashboard;
