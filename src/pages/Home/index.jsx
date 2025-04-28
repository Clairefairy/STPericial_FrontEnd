import Footer from "../../components/Footer";
import Navbar from "../../components/Header";
import { Link } from "react-router-dom";
import Container from "../../components/Container";
import styles from "./Home.module.css";

function Home() {
  return (
    <>
      <div>
        <Navbar />
        <Container>
          <section className={styles.home}>
            <div className={styles.apresentacao} style={{ marginTop: "90px" }}>
              <p>Venha conhecer o nosso App!</p>
              
             
            </div>
            <figure>
              <img
                className={styles.img_home}
                src="/undraw_scientist_5td0.svg"
                alt="imagem Home"
              />
            </figure>
          </section>
        </Container>
        <Footer />
      </div>
    </>
  );
}
export default Home;
