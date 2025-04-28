import Navbar from "../../components/Header";
import Footer from "../../components/Footer";
import Container from "../../components/Container";
import styles from "./Contatos.module.css";
import { FiUser, FiMail, FiMessageSquare } from "react-icons/fi";

function Contatos() {
  return (
    <>
      <Navbar />
      <Container>
        <section className={styles.contatos}>
          <div className={styles.formContainer}>
            <div className={styles.formLeft}>
              <h2>Fale conosco</h2>
              <form>
                <div className={styles.inputGroup}>
                  <label htmlFor="nome">
                    <FiUser className={styles.icon} />
                    Nome
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    placeholder="Seu nome"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="email">
                    <FiMail className={styles.icon} />
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Seu email"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="mensagem">
                    <FiMessageSquare className={styles.icon} />
                    Mensagem
                  </label>
                  <textarea
                    id="mensagem"
                    name="mensagem"
                    placeholder="Digite sua mensagem..."
                  />
                </div>
                <button type="submit" className={styles.botaoEnviar}>
                  Enviar Mensagem
                </button>
              </form>
            </div>

            <div className={styles.formRight}>
              <img
                src="/undraw_contact-us_kcoa.svg"
                alt="Ilustração de contato"
                className={styles.ilustracao}
              />
            </div>
          </div>
        </section>
      </Container>
      <Footer />
    </>
  );
}

export default Contatos;
