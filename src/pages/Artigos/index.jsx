import { useState } from "react";
import Navbar from "../../components/Header";
import Footer from "../../components/Footer";
import Container from "../../components/Container";
import styles from "./Artigos.module.css";
import Modal from "../../components/Modal/Modal";

import reconhecimento_de_padroes from "../../assets/Reconhecimento de Padrões com Odontometria.png";
import Automatização_Processo_Laudos from "../../assets/Automatização no Processo de Laudos.png";
import doc_digital_laudos from "../../assets/Documentação Digital de Laudos.png";
import tecnicas_avacandas_3d from "../../assets/img-tecnicas Avançadas em Identificação Odontológica.jpg";
import ia_e_machine_learning from "../../assets/imagem IA e Machine Learning na Classificação de Dados Periciais.png";
import teleodontologia_Perícia from "../../assets/Teleodontologia na Perícia.png";
import Noticiacnj1 from "../../assets/img_Notícia1.jpg";
import Noticia_policia_cientifica2 from "../../assets/imagem-noticia2.jpeg";

const artigosData = [
  {
    imagem: Automatização_Processo_Laudos,
    titulo: "Automatização no Processo de Gestão de Laudos Periciais",
    texto:
      "Explora como a automação tem transformado a gestão de laudos periciais, reduzindo o tempo necessário para análise e documentação.",
  },
  {
    imagem: tecnicas_avacandas_3d,
    titulo: "Técnicas Avançadas de Identificação Odontológica Forense",
    texto:
      "Um estudo de caso utilizando scanners 3D para reconstrução de arcadas dentárias em perícias forenses.",
  },
  {
    imagem: ia_e_machine_learning,
    titulo: "IA e Machine Learning na Classificação de Dados Periciais",
    texto:
      "Aplicações de inteligência artificial na classificação de dados odontológicos em investigações forenses.",
  },
  {
    imagem: teleodontologia_Perícia,
    titulo: "Impacto da Teleodontologia na Perícia Odontológica Forense",
    texto:
      "Ferramenta emergente para consultas e suporte remoto em investigações forenses.",
  },
  {
    imagem: doc_digital_laudos,
    titulo: "Documentação Digital de Laudos: Requisitos Legais",
    texto:
      "Discute regulamentações e melhores práticas para a criação de laudos odontológicos digitais.",
  },
  {
    imagem: reconhecimento_de_padroes,
    titulo: "Reconhecimento de Padrões em Investigação Forense",
    texto:
      "Como a odontometria digital é usada para identificar padrões dentários em casos de investigação forense.",
  },
];

function Artigos() {
  const [modalOpen, setModalOpen] = useState(false);
  const [artigoSelecionado, setArtigoSelecionado] = useState(null);

  const abrirModal = (artigo) => {
    setArtigoSelecionado(artigo);
    setModalOpen(true);
  };

  return (
    <>
      <Navbar />
      <Container>
        <section className={styles.artigos}>
          <div className={styles.divTextoImagem}>
            <div className={styles.imageArea}>
              <img
                src="./undraw_articles_visl.svg"
                alt="Imagem ilustrativa de um artigo"
                className={styles.image}
              />
            </div>
            <div className={styles.textArea}>
              <h2>Artigos Científicos</h2>
              <p>
                Um artigo científico é um trabalho acadêmico que apresenta
                resultados de pesquisas, estudos de caso ou revisões teóricas
                sobre um tema específico. Produzido por especialistas, ele segue
                rigor metodológico e visa compartilhar descobertas com a
                comunidade científica, impulsionando o avanço do conhecimento.
                Na odontologia forense, esses artigos desempenham um papel
                essencial: fundamentam práticas periciais, orientam a elaboração
                de laudos mais precisos e sustentam decisões técnicas em
                processos judiciais.
                <p>
                  <br />
                  <br />
                  Eles servem como base para validar métodos de identificação
                  humana, registro de evidências e análise de arcadas dentárias,
                  entre outros. A STPericial reúne uma curadoria de artigos
                  científicos que abordam temas atuais e inovadores, como:
                  Aplicações de inteligência artificial na perícia odontológica
                  Técnicas 3D para reconstituição dentária Documentação digital
                  e requisitos legais para laudos Uso da teleodontologia em
                  investigações forenses Esta seção foi criada para disseminar
                  conhecimento técnico, apoiar profissionais da área e promover
                  o desenvolvimento contínuo da ciência forense com foco em
                  eficiência, precisão e inovação.
                </p>
              </p>
            </div>
          </div>

          <div className={styles.divArtigos}>
            {artigosData.map((artigo, index) => (
              <div className={styles.miniArtigo} key={index}>
                <img
                  src={artigo.imagem}
                  alt={artigo.titulo}
                  className={styles.miniImage}
                />
                <h3>{artigo.titulo}</h3>
                <p>{artigo.texto}</p>
                <div className={styles.buttonContainer}>
                  <button
                    className={styles.expandButton}
                    onClick={() => abrirModal(artigo)}
                  >
                    Expandir
                  </button>
                </div>
              </div>
            ))}
          </div>

          <h2 className={styles.tituloNoticias}>Últimas Notícias</h2>
          <div className={styles.divUltimasNoticias}>
            <div className={styles.noticia}>
              <img
                src={Noticiacnj1}
                alt="Notícia 1"
                className={styles.noticiaImage}
              />
              <div className={styles.noticiaText}>
                <h3>
                  Novo Sistema de Perícias Judiciais se torna obrigatório para
                  tribunais
                </h3>
                <p>
                  A partir desta segunda-feira (3/2), a adoção do novo Sistema
                  de Perícias Judiciais (Sisperjud) pelos tribunais passa a ser
                  obrigatória, conforme estipulado pela Resolução n. 595 do
                  Conselho Nacional de Justiça (CNJ).
                </p>
              </div>
            </div>
            <div className={styles.noticia}>
              <img
                src={Noticia_policia_cientifica2}
                alt="Notícia 2"
                className={styles.noticiaImage}
              />
              <div className={styles.noticiaText}>
                <h3>
                  Polícia Científica investe mais de R$ 5 milhões em exames e
                  laudos no Instituto de Análises e Pesquisas Forenses
                </h3>
                <p>
                  Com o objetivo de tornar mais céleres os exames e aumentar a
                  qualidade técnica dos laudos periciais emitidos pela Polícia
                  Científica de Sergipe (PCi), o Instituto de Análises e
                  Pesquisas Forenses (IAPF) recebeu mais de R$ 5 milhões em
                  investimento nos últimos dois anos.
                </p>
              </div>
            </div>
          </div>
        </section>
      </Container>
      <Footer />

      {modalOpen && artigoSelecionado && (
        <Modal
          titulo={artigoSelecionado.titulo}
          texto={artigoSelecionado.texto}
          imagem={artigoSelecionado.imagem}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}

export default Artigos;
