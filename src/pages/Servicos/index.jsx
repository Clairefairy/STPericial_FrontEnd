import Navbar from "../../components/Header";
import Footer from "../../components/Footer";
import Container from "../../components/Container";
import styles from "./Servicos.module.css";
import { motion } from "framer-motion";

function Servicos() {
  return (
    <>
      <Navbar />
      <Container>
        <section className={styles.servicos}>
          <motion.h2
            className={styles.titulo}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Laudos Periciais Odontológicos
          </motion.h2>

          <motion.div
            className={styles.introducao}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <p className={styles.descricao}>
              Os laudos periciais odontológicos são documentos técnicos
              elaborados por cirurgiões-dentistas especializados em odontologia
              legal. Eles têm o papel de analisar, interpretar e relatar achados
              com valor jurídico, sendo fundamentais em processos judiciais,
              administrativos ou investigativos.
            </p>
            <p className={styles.descricao}>
              Com o avanço das inovações tecnológicas, esses laudos têm se
              tornado cada vez mais eficientes e precisos, contribuindo para o
              esclarecimento de diversos casos jurídicos.
            </p>
          </motion.div>

        
          <motion.div
            className={styles.conteudo}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              visible: { opacity: 1, scale: 1 },
            }}
            transition={{ duration: 0.3 }}
          >
            {[
              {
                titulo: "O que é um Laudo Pericial Odontológico?",
                texto:
                  "Documento técnico que relata achados odontológicos com fins legais. É utilizado como prova em processos civis, criminais, trabalhistas e administrativos.",
              },
              {
                titulo: "Finalidades do Laudo Pericial Odontológico",
                texto:
                  "Identificação humana em casos forenses, avaliação de lesões ou danos bucais, responsabilidade técnica de procedimentos odontológicos e muito mais.",
                lista: [
                  "Identificação humana em casos forenses e desastres em massa",
                  "Avaliação de lesões ou danos bucais",
                  "Responsabilidade técnica de procedimentos odontológicos",
                  "Estudos antropológicos e definição de perfil biológico",
                  "Análise de marcas de mordidas em casos de violência",
                ],
              },
              {
                titulo: "Conteúdo de um Laudo Bem Elaborado",
                texto:
                  "Inclui identificação das partes, objetivo da perícia, metodologia, e conclusão objetiva, assinada por perito habilitado.",
                lista: [
                  "Identificação das partes envolvidas",
                  "Objetivo detalhado da perícia",
                  "Metodologia e técnicas utilizadas",
                  "Resultados e interpretação técnica dos achados",
                ],
              },
              {
                titulo: "Validade Legal",
                texto:
                  "O laudo segue o Código de Processo Civil e Penal, além das normas do Conselho Federal de Odontologia.",
              },
              {
                titulo: "Aplicações na Sociedade",
                texto:
                  "Usado na justiça, segurança pública, e medicina legal para análise de vítimas e resolução de crimes.",
              },
              {
                titulo: "Inovações Tecnológicas",
                texto:
                  "Laudos digitais, modelos 3D, reconhecimento automatizado de padrões, e integração com sistemas judiciais.",
              },
            ].map((topico, index) => (
              <motion.div
                key={index}
                className={styles.topico}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.2,
                  duration: 0.3,
                }}
              >
                <h3>{topico.titulo}</h3>
                <p>{topico.texto}</p>
                {topico.lista && (
                  <ul className={styles.lista}>
                    {topico.lista.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </motion.div>
        </section>
      </Container>
      <Footer />
    </>
  );
}

export default Servicos;
