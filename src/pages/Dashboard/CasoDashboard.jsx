import React, { useContext, useEffect, useState } from "react";
import { buscar, buscarEvidencia, deletar } from "../../util/service";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../util/UserContext";
import styles from "./casodashboard.module.css";
import StatusSelector from "../../components/formCaso/StatusSelector";
import Container from "../../components/Container";
import { CircleDashed, Delete, Pen, Plus } from "lucide-react";
import FormularioForm from "../../components/formCaso/FormularioForm";
import FormularioEvidencia from "../../components/formEvidencia/FormularioEvidencia";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import QRCode from "qrcode";

function CasoDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [caso, setCaso] = useState({
    _id: "",
    type: "",
    title: "",
    description: "",
    status: "",
    numberProcess: "",
    openingDate: null,
    closingDate: null,
    responsible: "",
    victim: null,
    createdAt: null,
    updatedAt: null,
    __v: 0
  });

  const [evidencias, setEvidencias] = useState([]);
  const [collectedByMap, setCollectedByMap] = useState({});
  const [showFormularioCaso, setShowFormularioCaso] = useState(false);
  const [showFormularioEvidencia, setShowFormularioEvidencia] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmDeleteEvidencia, setShowConfirmDeleteEvidencia] = useState(false);
  const [deletando, setDeletando] = useState(false);
  const [evidenciaParaDeletar, setEvidenciaParaDeletar] = useState(null);
  const [evidenciaParaEditar, setEvidenciaParaEditar] = useState(null);

  const { id } = useParams();
  const { usuario } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = usuario.user.role === "admin";
  const isAdminOrPerito = isAdmin || usuario.user.role === "perito";

  useEffect(() => {
    buscarCaso();
  }, []);

  useEffect(() => {
    if (location.state?.notAdmin) toast.error("Você não tem permissão nessa página.");
    if (location.state?.criado) {
      toast.success("Caso criado!");
      setShowFormularioEvidencia(true);
    }
    if (location.state?.editado) toast.success("Caso editado!");
    if (location.state?.deletado) toast.success("Caso deletado!");
  }, [location]);

  async function buscarCaso() {
    setIsLoading(true);
    try {
      await buscar(`/cases/${id}`, setCaso, {
        headers: { Authorization: `Bearer ${usuario.token}` }
      });
      await buscarEvidencias();

    } catch (e) {
      if (e.status === 401 || e.status === 403)
      return navigate("/login", { state: { notAdmin: true } });
      toast.error("Erro ao buscar.");
      navigate("/dashboard");
    } finally {
      setIsLoading(false);
    }
  }


  const [responsible , setResposible] = useState({})

  useEffect(() => {
    if(caso.responsible){
      buscarUser();
    }
  }, [caso])

  async function  buscarUser(){
    let user = await buscar("/users/"+caso.responsible, setResposible, {
      headers: { Authorization: `Bearer ${usuario.token}` }
    })

  }

  async function buscarEvidencias() {
    try {
      const evidenciasData = await buscarEvidencia(`/evidences`, id, setEvidencias, {
        headers: { Authorization: `Bearer ${usuario.token}` }
      });
      setEvidencias(evidenciasData);

      const uniqueCollectedByIds = [...new Set(evidenciasData.map(ev => ev.collectedBy).filter(Boolean))];

      const newCollectedByMap = {};

      await Promise.all(
        uniqueCollectedByIds.map(async (userId) => {
          try {
            const userData = await buscar("/users/" + userId, null, {
              headers: { Authorization: `Bearer ${usuario.token}` }
            });
            newCollectedByMap[userId] = userData;
          } catch (error) {
            console.error(`Erro ao buscar usuário ${userId}:`, error);
          }
        })
      );

      setCollectedByMap(newCollectedByMap);

    } catch (error) {
    }
  }


  async function deletarCaso() {
    try {
      setDeletando(true);
      await deletar("/cases/" + id, {
        headers: { Authorization: `Bearer ${usuario.token}` }
      });
      navigate("/dashboard/casos", { state: { deletado: true } });
    } catch {
      toast.error("Erro ao deletar.");
    } finally {
      setShowConfirmDelete(false);
      setDeletando(false);
    }
  }

  async function deletarEvidencia(evidenciaId) {
    try {
      setDeletando(true);
      await deletar(`/evidences/${evidenciaId}`, {
        headers: { Authorization: `Bearer ${usuario.token}` }
      });
      toast.success("Evidência deletada com sucesso.");
      buscarEvidencias();
    } catch {
      toast.error("Erro ao deletar a evidência.");
    } finally {
      setShowConfirmDeleteEvidencia(false);
      setDeletando(false);
    }
  }

  function formatDate(dateString) {
    if (!dateString) return "Não informado";
    return new Date(dateString).toLocaleDateString("pt-BR");
  }

  function handleEditarClick() {
    setShowFormularioCaso(true);
  }

  function handleAdicionarEvidenciaClick() {
    setEvidenciaParaEditar(null);
    setShowFormularioEvidencia(true);
  }

  function handleDeleteClick() {
    setShowConfirmDelete(true);
  }

  function handleCloseFormularioCaso() {
    setShowFormularioCaso(false);
  }

  function handleCloseFormularioEvidencia() {
    setShowFormularioEvidencia(false);
    setEvidenciaParaEditar(null);
  }

  function handleDeleteEvidenciaClick(evidencia) {
    setEvidenciaParaDeletar(evidencia);
    setShowConfirmDeleteEvidencia(true);
  }

  function handleEditEvidenciaClick(evidencia) {
    setEvidenciaParaEditar(evidencia);
    setShowFormularioEvidencia(true);
  }

  const gerarLaudo = async () => {
    const doc = new jsPDF();


    doc.setDrawColor(0);
    doc.setFillColor(230, 230, 250);
    doc.rect(0, 0, 210, 25, "F");             
    doc.setFontSize(18);                      
    doc.setTextColor(0, 0, 100);
    doc.text(caso.title, 105, 15, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(0);
    // Linha 1
    doc.text(`ID: ${caso._id}`, 20, 35);
    doc.text(`Tipo: ${caso.type}`, 110, 35);
    // Linha 2
    doc.text(`Processo: ${caso.numberProcess}`, 20, 42);
    doc.text(`Status: ${caso.status}`, 110, 42);
    // Linha 3
    doc.text(`Resp.: ${responsible?.name}`, 20, 49);
    doc.text(`Vítima: ${caso.victim.name}`, 110, 49);
    // Linha 4
    doc.text(`Abertura: ${formatDate(caso.openingDate)}`, 20, 56);
    doc.text(`Fechamento: ${formatDate(caso.closingDate)}`, 110, 56);
    // Linha 5
    doc.text(`Criado: ${formatDate(caso.createdAt)}`, 20, 63);
    doc.text(`Atualizado: ${formatDate(caso.updatedAt)}`, 110, 63);

    doc.setDrawColor(180);
    doc.line(20, 68, 190, 68);

    // Descrição
    doc.setFontSize(12);
    doc.text("Descrição:", 20, 75);
    doc.setFontSize(10);
    doc.text(caso.description || "-", 20, 81, { maxWidth: 170 });

    // QR Code de validação
    const urlValidacao = `https://seusite.com/validar/${caso._id}`;
    const qrData = await QRCode.toDataURL(urlValidacao);
    doc.addImage(qrData, "PNG", 150, 90, 40, 40);
    doc.setFontSize(8);
    doc.text("Escaneie para validar este laudo.", 20, 95);

    // Assinatura
    doc.setFontSize(10);
    doc.line(20, 135, 80, 135);
    doc.text("Assinatura do Perito", 20, 140);

    // Evidências em lista compacta
    let yPos = 150;
    doc.setFontSize(12);
    doc.text("Evidências:", 20, yPos);
    doc.setFontSize(10);
    evidencias.forEach((ev, idx) => {
      yPos += 6;
      if (yPos > 280) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(`${idx + 1}. [${ev.type}] ${ev.text}`, 20, yPos, { maxWidth: 170 });
    });

    doc.save(`${caso.title}_Laudo.pdf`);
  };



  if (isLoading) {
    return (
      <Container>
        <div className={styles.loadingContainer}>
          <CircleDashed className={styles.loadingIcon} size={48} />
          <p>Carregando caso...</p>
        </div>
      </Container>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.manageCase}>
        {isAdminOrPerito && (
          <button className={styles.editButton} onClick={handleEditarClick}>
            <Pen size={32} />
          </button>
        )}
        {isAdmin && (
          <button className={styles.deleteButton} onClick={handleDeleteClick}>
            <Delete size={32} />
          </button>
        )}
        {isAdminOrPerito && (
          <button className={styles.evidenciaDownload} onClick={gerarLaudo}>
            Gerar PDF
          </button>
        )}
      </div>

      {showFormularioCaso ? (
        <FormularioForm
          casoParaEditar={caso}
          onClose={handleCloseFormularioCaso}
          onSubmit={() => {
            setShowFormularioCaso(false);
            buscarCaso();
          }}
        />
      ) : showFormularioEvidencia ? (
        <FormularioEvidencia
          caso={caso}
          evidenciaParaEditar={evidenciaParaEditar}
          onClose={handleCloseFormularioEvidencia}
          onSubmit={() => {
            setShowFormularioEvidencia(false);
            buscarEvidencias();
          }}
        />
      ) : (
        <>
          <p className={styles.id}>id: {caso._id}</p>
          <p className={styles.type}>{caso.type}</p>
          <h1 className={styles.title}>
            {caso.title} #{caso.numberProcess}
          </h1>
          <hr className={styles.divider} />

          <p className={styles.label}>Status:</p>
          <StatusSelector caso={caso} setCaso={setCaso} />

          <p className={styles.label}>Descrição:</p>
          <p className={styles.text}>{caso.description}</p>

          <p className={styles.label}>Data de Abertura:</p>
          <p className={styles.text}>{formatDate(caso.openingDate)}</p>

          <p className={styles.label}>Data de Fechamento:</p>
          <p className={styles.text}>{formatDate(caso.closingDate)}</p>

          <p className={styles.label}>Responsável:</p>
          <p className={styles.text}>{responsible?.name}</p>

          <p className={styles.label}>Vítima:</p>
          <p className={styles.text}>{caso.victim?.name ? caso.victim.name : "Sem Vítima"}</p>

          <p className={styles.label}>Criado em:</p>
          <p className={styles.text}>{formatDate(caso.createdAt)}</p>

          <p className={styles.label}>Atualizado em:</p>
          <p className={styles.text}>{formatDate(caso.updatedAt)}</p>

          <hr className={styles.divider} />

          <div style={{ position: "relative" }}>
            <h1 className={styles.title}>Evidências</h1>
            <button className={styles.addButton} onClick={handleAdicionarEvidenciaClick}>
              <Plus size={32} />
            </button>
          </div>

          <div className={styles.evidenciasContainer}>
            {evidencias.length === 0 ? (
              <p className={styles.text}>Nenhuma evidência encontrada.</p>
            ) : (
              evidencias.map((evidencia) => (
                <div
                  key={evidencia._id}
                  className={styles.evidenciaCard}
                  style={{ position: "relative" }}
                >
                  {[".png", ".jpg", ".gif"].some(ext => evidencia.fileUrl.includes(ext)) ? (
                    <img
                      src={evidencia.fileUrl}
                      alt={`Evidência ${evidencia._id}`}
                      className={styles.evidenciaImagem}
                    />
                  ) : evidencia.fileUrl.includes(".mp4") ? (
                    <video controls className={styles.evidenciaVideo}>
                      <source src={evidencia.fileUrl} type="video/mp4" />
                      Seu navegador não suporta o elemento de vídeo.
                    </video>
                  ) : (
                    <a
                      onClick={() => handleDownload(evidencia)}
                      className={styles.evidenciaDownload}
                      href="#"
                    >
                      Baixar como PDF
                    </a>
                  )}
                  <div>

                    <p><strong>ID:</strong> {evidencia._id}</p>
                    <p><strong>Tipo:</strong> {evidencia.type}</p>
                    <p><strong>Texto:</strong> {evidencia.text}</p>
                    <p><strong>Data de Coleta:</strong> {formatDate(evidencia.collectionDate)}</p>
                    <p><strong>Coletado por:</strong> {collectedByMap[evidencia.collectedBy]?.name || "Não informado"}</p>

                  </div>
        
                  {isAdmin && (
                    <button
                      className={styles.deleteButtonEvidencia}
                      onClick={() => handleDeleteEvidenciaClick(evidencia)}
                    >
                      <Delete size={24} />
                    </button>
                  )}
                  {isAdminOrPerito && (
                    <button
                      className={styles.editButtonEvidencia}
                      onClick={() => handleEditEvidenciaClick(evidencia)}
                    >
                      <Pen size={24} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
          <hr className={styles.divider} />
        </>
      )}

      {showConfirmDelete && (
        <div className={styles.confirmPopup}>
          <div className={styles.popupContent}>
            <p>Tem certeza que deseja deletar este caso?</p>
            <div className={styles.popupButtons}>
              <button className={styles.confirmButton} onClick={deletarCaso} disabled={deletando}>
                Confirmar
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => setShowConfirmDelete(false)}
                disabled={deletando}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmDeleteEvidencia && (
        <div className={styles.confirmPopup}>
          <div className={styles.popupContent}>
            <p>Tem certeza que deseja deletar esta evidência?</p>
            <div className={styles.popupButtons}>
              <button
                className={styles.confirmButton}
                onClick={() => deletarEvidencia(evidenciaParaDeletar._id)}
                disabled={deletando}
              >
                Confirmar
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => setShowConfirmDeleteEvidencia(false)}
                disabled={deletando}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CasoDashboard;
