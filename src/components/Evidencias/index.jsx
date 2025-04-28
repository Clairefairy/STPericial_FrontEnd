import styles from "./Evidencias.module.css";
import { useState } from "react";

function Evidencias({ casoId, evidencias, onUpload, onRemove }) {
  const [mensagem, setMensagem] = useState(null);
  const [tipoMensagem, setTipoMensagem] = useState("sucesso");

  const handleUpload = (event) => {
    const arquivos = event.target.files;
    if (arquivos.length === 0) return;

    onUpload(arquivos);  
    setMensagem("Evidência(s) adicionada(s) com sucesso.");
    setTipoMensagem("sucesso");

    setTimeout(() => setMensagem(null), 3000);
  };

  const handleRemover = (id) => {
    onRemove(id);  

    setMensagem("Evidência removida com sucesso.");
    setTipoMensagem("erro");

    setTimeout(() => setMensagem(null), 3000);
  };

  return (
    <div className={styles.evidenciasContainer}>
      <h2>Evidências do Caso {casoId}</h2>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleUpload}
        className={styles.inputFile}
      />

      {mensagem && (
        <div
          className={
            tipoMensagem === "sucesso"
              ? styles.mensagemSucesso
              : styles.mensagemErro
          }
        >
          {mensagem}
        </div>
      )}

      <div className={styles.gallery}>
        {evidencias.length === 0 && <p>Nenhuma evidência enviada ainda.</p>}
        {evidencias.map((evidencia) => (
          <div key={evidencia.id} className={styles.card}>
            <img
              src={URL.createObjectURL(evidencia.arquivo)}
              alt={evidencia.nome}
              className={styles.preview}
            />
            <p className={styles.nomeArquivo}>{evidencia.nome}</p>
            <button
              className={styles.botaoRemover}
              onClick={() => handleRemover(evidencia.id)}
            >
              Remover
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Evidencias;
