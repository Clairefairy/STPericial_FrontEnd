import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";
import { useMemo } from "react";

const MAIN_COLOR = "#2563eb"; 

const DeterminanteBarChart = ({ casos }) => {
    function getStatusData() {
        const result = {};
        casos.forEach(caso => {
            const key = caso.status || "Desconhecido";
            result[key] = (result[key] || 0) + 1;
        });
        return result;
    }

    function getResponsibleData() {
        const result = {};
        casos.forEach(caso => {
            const key = caso.responsible?.name || "Desconhecido";
            result[key] = (result[key] || 0) + 1;
        });
        return result;
    }

    function getVictimSexData() {
        const result = {};
        casos.forEach(caso => {
            const key = caso.victim?.sex || "Não informado";
            result[key] = (result[key] || 0) + 1;
        });
        return result;
    }

    function getVictimIdentifiedData() {
        const result = {};
        casos.forEach(caso => {
            const key = caso.victim?.identified ? "Identificada" : "Não identificada";
            result[key] = (result[key] || 0) + 1;
        });
        return result;
    }

    function getVictimAgeGroupData() {
        const result = {};
        casos.forEach(caso => {
            let key = "Desconhecido";
            if (caso.victim?.dateBirth) {
                const birthYear = new Date(caso.victim.dateBirth).getFullYear();
                const currentYear = new Date().getFullYear();
                const age = currentYear - birthYear;
                if (age < 18) key = "Menor de idade";
                else if (age < 40) key = "Adulto jovem";
                else if (age < 60) key = "Adulto";
                else key = "Idoso";
            }
            result[key] = (result[key] || 0) + 1;
        });
        return result;
    }

    function getHasEvidenceData() {
        const result = {};
        casos.forEach(caso => {
            const key = caso.evidences?.length > 0 ? "Com evidências" : "Sem evidências";
            result[key] = (result[key] || 0) + 1;
        });
        return result;
    }

    function getEvidenceTypeData() {
        const result = {};
        casos.forEach(caso => {
            if (!caso.evidences || caso.evidences.length === 0) {
                result["Nenhuma"] = (result["Nenhuma"] || 0) + 1;
            } else {
                caso.evidences.forEach(e => {
                    result[e.type] = (result[e.type] || 0) + 1;
                });
            }
        });
        return result;
    }

    const allData = useMemo(() => {
        const categories = {
            "Status": getStatusData(),
            "Responsável": getResponsibleData(),
            "Gênero da Vítima": getVictimSexData(),
            "Vítima Identificada": getVictimIdentifiedData(),
            "Faixa Etária": getVictimAgeGroupData(),
            "Possui Evidências": getHasEvidenceData(),
            "Tipo de Evidência": getEvidenceTypeData()
        };

        const combined = [];
        for (const [category, data] of Object.entries(categories)) {
            for (const [name, value] of Object.entries(data)) {
                combined.push({
                    category,
                    name: `${category}: ${name}`, 
                    originalName: name, 
                    value
                });
            }
        }

        return combined.sort((a, b) => b.value - a.value);
    }, [casos]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="custom-tooltip" style={{
                    backgroundColor: '#fff',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                }}>
                    <p><strong>{data.category}:</strong> {data.originalName}</p>
                    <p><strong>Casos:</strong> {data.value}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{ overflowX: 'scroll', height: '1000px', padding: "0rem 0", overflowY: 'hidden' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Fatores Determinantes nos Casos</h3>
            <ResponsiveContainer height={"100%"} minWidth="850px" width="100%">
            <BarChart
                    layout="vertical"
                    data={allData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis
                        type="category"
                        dataKey="name"
                        width={300} 
                        tick={{ fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                        dataKey="value"
                        name="Número de Casos"
                        fill={MAIN_COLOR} 
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DeterminanteBarChart;