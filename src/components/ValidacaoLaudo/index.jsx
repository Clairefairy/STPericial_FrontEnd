import { useParams } from "react-router-dom";
import styles from "./ValidacaoLaudo.module.css";

function ValidacaoLaudo() {
  const { id } = useParams();

  const casosFicticios = [
    { id: 1, nome: "Investigação A", tipo: "Acidente", status: "Em Andamento" },
    {
      id: 2,
      nome: "Investigação B",
      tipo: "Identificação de Vítima",
      status: "Concluído",
    },
  ];

  const caso = casosFicticios.find((c) => c.id === parseInt(id));

  if (!caso) return <p>Laudo não encontrado.</p>;

  return (
    <div className={styles.container}>
      <h1>Validação do Laudo</h1>
      <p>
        <strong>ID:</strong> {caso.id}
      </p>
      <p>
        <strong>Nome do Caso:</strong> {caso.nome}
      </p>
      <p>
        <strong>Tipo:</strong> {caso.tipo}
      </p>
      <p>
        <strong>Status:</strong> {caso.status}
      </p>
      <p>Este laudo é autêntico e foi gerado pela plataforma oficial.</p>
    </div>
  );
}

export default ValidacaoLaudo;
