import React, { useState, useEffect } from "react";
import PieChartView from "./PieChartView";
import BarChartView from "./BarChartView";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

function CaseChartContainer({ casos }) {
    const [agrupamento, setAgrupamento] = useState("status");
    const [dadosPie, setDadosPie] = useState([]);
    const [dadosBar, setDadosBar] = useState([]);
    const [chavesBar, setChavesBar] = useState([]);

    function pegarGrupo(caso) {
        if (agrupamento === "responsible") {
            return caso.responsible?.name || "Desconhecido";
        } else if (agrupamento === "victimSex") {
            return caso.victim?.sex || "Não informado";
        } else if (agrupamento === "victimIdentified") {
            return caso.victim?.identified ? "Identificada" : "Não identificada";
        } else if (agrupamento === "victimAgeGroup") {
            if (!caso.victim?.dateBirth) return "Desconhecido";
            const anoNascimento = new Date(caso.victim.dateBirth).getFullYear();
            const idade = new Date().getFullYear() - anoNascimento;
            if (idade < 18) return "Menor de idade";
            if (idade < 40) return "Adulto jovem";
            if (idade < 60) return "Adulto";
            return "Idoso";
        } else if (agrupamento === "hasEvidence") {
            return caso.evidences?.length > 0 ? "Com evidências" : "Sem evidências";
        } else if (agrupamento === "evidenceType") {
            if (!caso.evidences || caso.evidences.length === 0) return ["Nenhuma"];
            return caso.evidences.map((e) => e.type);
        } else {
            return caso.status;
        }
    }

    useEffect(() => {
        const contagem = {};
        casos.forEach((caso) => {
            const chave = pegarGrupo(caso);
            if (Array.isArray(chave)) {
                chave.forEach((c) => {
                    contagem[c] = (contagem[c] || 0) + 1;
                });
            } else {
                contagem[chave] = (contagem[chave] || 0) + 1;
            }
        });

        const resultado = Object.keys(contagem).map((nome) => ({
            name: nome,
            value: contagem[nome],
        }));

        setDadosPie(resultado);
    }, [casos, agrupamento]);

    useEffect(() => {
        const agrupado = {};
        const todasChaves = new Set();

        casos.forEach((caso) => {
            if (!caso.openingDate) return;

            const data = caso.openingDate.split("T")[0];
            const grupo = pegarGrupo(caso);

            if (!agrupado[data]) agrupado[data] = {};

            const adicionar = (g) => {
                agrupado[data][g] = (agrupado[data][g] || 0) + 1;
                todasChaves.add(g);
            };

            if (Array.isArray(grupo)) {
                grupo.forEach(adicionar);
            } else {
                adicionar(grupo);
            }
        });

        const chaves = Array.from(todasChaves);
        const lista = [];

        Object.keys(agrupado).forEach((data) => {
            const item = {
                date: data,
                name:
                    format(parseISO(data), "EEE", { locale: ptBR }).charAt(0).toUpperCase() +
                    format(parseISO(data), "EEE", { locale: ptBR }).slice(1, 3),
                formattedDate: format(parseISO(data), "dd/MM", { locale: ptBR }),
            };

            chaves.forEach((chave) => {
                item[chave] = agrupado[data][chave] || 0;
            });

            lista.push(item);
        });

        lista.sort((a, b) => new Date(a.date) - new Date(b.date));

        setDadosBar(lista);
        setChavesBar(chaves);
    }, [casos, agrupamento]);

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "20px",
                    borderRadius: "1rem",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    marginBottom: "30px",
                    gap: "12px",
                }}
            >
                <label
                    htmlFor="agrupamento"
                    style={{
                        fontWeight: "bold",
                        color: "#333",
                        marginRight: "8px",
                        whiteSpace: "nowrap",
                    }}
                >
                    Agrupar por:
                </label>
                <select
                    id="agrupamento"
                    value={agrupamento}
                    onChange={(e) => setAgrupamento(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        fontSize: "15px",
                        backgroundColor: "#fff",
                        color: "#333",
                    }}
                >
                    <option value="status">Status do caso</option>
                    <option value="responsible">Responsável</option>
                    <option value="victimSex">Gênero da vítima</option>
                    <option value="victimIdentified">Vítima identificada</option>
                    <option value="victimAgeGroup">Idade da vítima</option>
                    <option value="hasEvidence">Com/Sem evidências</option>
                    <option value="evidenceType">Tipo de evidência</option>
                </select>
            </div>


            <PieChartView dados={dadosPie} />
            <BarChartView dados={dadosBar} dataKeys={chavesBar} />
        </div>
    );
}

export default CaseChartContainer;
