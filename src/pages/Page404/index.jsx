import Navbar from "../../components/Header";
import Footer from "../../components/Footer";
import Container from "../../components/Container";
import styles from "./Page404.module.css";

function Page404() {
  return (
    <>
      <Navbar />
      <Container>
        <h2 className={styles.titulo2} style={{ marginTop: "90px" }}>
          Algo de errado não está certo ☹🦷
        </h2>
        <div className={styles.textos}>
          <span className={styles.texto_grande}>404</span> <br />
          <strong className={styles.texto_pag_N_localizada}>
            Página Não Localizada!
          </strong>
        </div>
      </Container>
      <Footer />
    </>
  );
}
export default Page404;
