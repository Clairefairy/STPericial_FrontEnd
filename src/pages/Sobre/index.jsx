import Navbar from "../../components/Header";
import Footer from "../../components/Footer";
import Container from "../../components/Container";
import styles from "./Sobre.module.css";
import perito_sobre1 from "../../assets/imagem-dentista-perito.png";
import equipe_forense from "../../assets/imagem-equipe_forense.jpg";
import perfil_homem1 from "../../assets/img_perfil_homem1.png";
import perfil_homem2 from "../../assets/img_perfil_homem2.png";
import perfil_mulher from "../../assets/img_perfil_mulher.png";

function Sobre() {
  return (
    <>
      <Navbar />
      <Container>
        <section className={styles.sobre}>
          <div className={styles.divUm}>
            <div className={styles.textArea}>
              <h2>Sobre Nós</h2>
              <p>
                A STPericial é a nova referência em gestão de laudos
                odontológicos periciais. Nossa plataforma moderna e intuitiva
                centraliza todos os processos essenciais para facilitar o
                registro, análise e identificação forense. Com foco na segurança
                e eficiência, oferecemos uma solução acessível para Web e
                Mobile, projetada para peritos odontológicos, dentistas forenses
                e órgãos competentes.
              </p>
              <p>
                Com a STPericial, os usuários podem cadastrar casos, anexar
                evidências e gerar laudos detalhados com rapidez e praticidade.
                Além disso, nosso sistema avançado permite o cruzamento de
                informações, acelerando a identificação de indivíduos e
                promovendo resultados mais precisos em investigações forenses.
              </p>
            </div>
            <div className={styles.imageArea}>
              <img
                src={perito_sobre1}
                alt="Imagem de um dentista perito ilustrativo"
                className={styles.image}
              />
            </div>
          </div>

          <div className={styles.divDois}>
            <img
              src={equipe_forense}
              alt="Equipe de profissionais forenses reunidos"
              className={styles.imageFull}
            />
          </div>

          <div className={styles.divTres}>
            <p className={styles.centralText}>
              "Na STPericial, nossa equipe é formada por profissionais altamente
              qualificados, apaixonados por inovação e comprometidos com a
              transformação da odontologia forense."
            </p>
          </div>

          <div className={styles.divQuatro}>
            <div className={styles.feedback}>
              <img
                src={perfil_homem1}
                alt="Foto de João Silva"
                className={styles.userPhoto}
              />
              <h3>João Silva</h3>
              <p>⭐⭐⭐⭐⭐</p>
              <span>Há 2 dias</span>
              <p>
                Incrível! Atendimento impecável e qualidade acima das minhas
                expectativas.
              </p>
            </div>
            <div className={styles.feedback}>
              <img
                src={perfil_mulher}
                alt="Foto de Ana Oliveira"
                className={styles.userPhoto}
              />
              <h3>Ana Oliveira</h3>
              <p>⭐⭐⭐⭐⭐</p>
              <span>Há 1 semana</span>
              <p>
                Experiência fantástica! Um serviço que definitivamente merece
                destaque.
              </p>
            </div>
            <div className={styles.feedback}>
              <img
                src={perfil_homem2}
                alt="Foto de Marcos Pereira"
                className={styles.userPhoto}
              />
              <h3>Marcos Pereira</h3>
              <p>⭐⭐⭐⭐</p>
              <span>Há 3 semanas</span>
              <p>
                Produto excelente, mas o processo de entrega poderia ser um
                pouco mais rápido.
              </p>
            </div>
          </div>
        </section>
      </Container>
      <Footer />
    </>
  );
}

export default Sobre;
