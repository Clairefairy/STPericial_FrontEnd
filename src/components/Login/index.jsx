import { useState, useContext, useEffect } from "react";
import Navbar from "../../components/Header";
import Footer from "../../components/Footer";
import Container from "../../components/Container";
import styles from "./Login.module.css";
import { FiUser, FiLock } from "react-icons/fi";
import { FaFacebookF, FaGoogle, FaApple } from "react-icons/fa";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../util/UserContext";
import toast from "react-hot-toast";

const FormInput = ({ id, name, label, placeholder, type = "text", Icon, value, onChange }) => (
  <div className={styles.inputGroup}>
    <label htmlFor={id}>
      {Icon && <Icon className={styles.icon} />} {label}
    </label>
    <input
      type={type}
      id={id}
      name={name}
      placeholder={placeholder}
      className={styles.input}
      value={value}
      onChange={onChange}
    />
  </div>
);

const SocialButton = ({ Icon, className }) => (
  <button type="button" className={`${styles.socialButton} ${className}`}>
    {Icon && <Icon className={styles.icon} />}
  </button>
);

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, handleLogin, handleLogout } = useContext(AuthContext);

  useEffect(() => {
    if (location.state?.notAdmin) {
      if(usuario.user.name !== ""){
        toast.error(`Usuário ${usuario.user.name} não tem permissão nesta página.`)
        handleLogout();
      }else{
        toast.error("Você não tem permissão nesta página.");
        handleLogout();

      }
    }
  }, [location]);


  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

  };

  const handleForm = async (e) => {
    e.preventDefault();
    // E manter a validação no handleForm
const handleForm = async (e) => {
  e.preventDefault();
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    toast.error("Por favor, insira um endereço de email válido");
    return;
  }

};
   const isLogado = await handleLogin(formData)
      if(isLogado){
        navigate("/dashboard")
      }
    
  };
  

  return (
    <>
      <Navbar />
      <Container>
        <section className={styles.login}>
          <div className={styles.loginWrapper}>
            <div className={styles.imageSection}>
              <img
                src="/undraw_login_weas.svg"
                alt="Ilustração de login"
                className={styles.loginImage}
              />
            </div>

            <div className={styles.formContainer}>
              <h2>Acesse sua conta</h2>
              <form onSubmit={handleForm}>
                <FormInput
                  id="email"
                  name="email"
                  label="E-mail"
                  placeholder="Seu e-mail"
                  Icon={FiUser}
                  value={formData.email}
                  onChange={handleChange}
                  pattern="[^@\s]+@[^@\s]+\.[^@\s]+"  // Adiciona validação HTML5
                  title="Por favor, insira um endereço de email válido"
                />

                <FormInput
                  id="password"
                  name="password"
                  label="Senha"
                  placeholder="Sua senha"
                  type="password"
                  Icon={FiLock}
                  value={formData.password}
                  onChange={handleChange}
                />

                <div className={styles.optionsRow}>
                 
                </div>

                <button type="submit" className={styles.loginButton}>
                  Entrar
                </button>
              </form>

            

              <div className={styles.socialLogin}>
               
                
              </div>
            </div>
          </div>
        </section>
      </Container>
      <Footer />
    </>
  );
}

export default Login;
