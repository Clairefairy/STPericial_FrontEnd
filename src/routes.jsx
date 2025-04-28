import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Sobre from "./pages/Sobre";
import Servicos from "./pages/Servicos";
import Artigos from "./pages/Artigos";
import Contatos from "./pages/Contatos";
import Gerenciamento_casos from "./pages/GerencimentoDeCasos";
import ValidacaoLaudo from "./components/ValidacaoLaudo";
import Dashboard from "./pages/Dashboard";
import Page404 from "./pages/Page404";
import Login from "./components/Login";
import { useContext } from "react";
import { AuthContext } from "./util/UserContext";
import HomeDashboard from "./pages/Dashboard/HomeDashboard";
import CasoDashboard from "./pages/Dashboard/CasoDashboard";
import CriarCaso from "./pages/Dashboard/CriarCaso";
import EditarCaso from "./pages/Dashboard/EditarCaso";
import Gerenciamento_Laudos from "./pages/GerenciamentoDeLaudos";
import CriarLaudo from "./pages/Dashboard/CriarLaudo";
import EditarLaudo from "./pages/Dashboard/EditarLaudo";
import Gerenciamento_vitimas from "./pages/GerenciamentoDeVitimas";
import Gerenciamento_Usuarios from "./pages/GerenciamentoUsuarios";
import CriarUsuario from "./pages/Dashboard/CriarUsuario";
import EditarUsuario from "./pages/Dashboard/EditarUsuario";
import CriarRegistroDental from "./pages/Dashboard/CriarDental";
import EditarRegistroDental from "./pages/Dashboard/EditarDental";
import Gerenciamento_dental from "./pages/GerenciamentoDental";
import Perfil from "./pages/Perfil/Perfil";




function AppRoutes() {
  const { usuario } = useContext(AuthContext);
  const isAdminOrPerito = usuario.user.role === "admin" || usuario.user.role === "perito";
  const isLogado = usuario.user.role ==! "deslogado" && usuario.user.role ==! "";
  const isAdmin = usuario.user.role === "admin" 

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/artigos" element={<Artigos />} />
        <Route path="/contato" element={<Contatos />} />
        <Route path="/validar/:id" element={<ValidacaoLaudo />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<HomeDashboard />} />
          <Route path="home" element={<HomeDashboard />} />
          <Route path="perfil" element={<Perfil />} />

          <Route path="casos" element={<Gerenciamento_casos />} />
          <Route path="casos/criar" element={isAdminOrPerito ? <CriarCaso /> : <Navigate to="/dashbard/casos" state={{notAdmin: true}}/>} />
          <Route path="casos/editar" element={isAdminOrPerito ? <EditarCaso /> : <Navigate to="/dashbard/casos" state={{ notAdmin: true }} />} />
        
          <Route path="laudos" element={<Gerenciamento_Laudos />} />
          <Route path="laudos/criar" element={isAdminOrPerito ? <CriarLaudo /> : <Navigate to="/dashbard/casos" state={{ notAdmin: true }} />} />
          <Route path="laudos/editar" element={isAdminOrPerito ? <EditarLaudo /> : <Navigate to="/dashbard/casos" state={{ notAdmin: true }} />} />


          <Route path="registros-odontologicos" element={<Gerenciamento_dental />} />
          <Route path="registros-odontologicos/criar" element={isAdminOrPerito ? <CriarRegistroDental /> : <Navigate to="/dashbard/casos" state={{ notAdmin: true }} />} />
          <Route path="registros-odontologicos/editar" element={isAdminOrPerito ? <EditarRegistroDental /> : <Navigate to="/dashbard/casos" state={{ notAdmin: true }} />} />

          <Route path="victims" element={isAdmin ? <Gerenciamento_vitimas /> : <Navigate to="/dashboard" state={{ notAdmin: true }} />} />
          <Route path="usuarios" element={isAdmin ? <Gerenciamento_Usuarios /> : <Navigate to="/dashboard/usuarios" state={{ notAdmin: true }} />} />

          <Route path="usuarios/criar" element={isAdmin ? <CriarUsuario /> : <Navigate to="/dashboard/usuarios" state={{ notAdmin: true }} />} />
          <Route path="usuarios/editar" element={isAdmin ? <EditarUsuario /> : <Navigate to="/dashboard/usuarios" state={{ notAdmin: true }} />} />


          <Route path="caso/:id/evidencias" element={<CasoDashboard />} />
          <Route path="caso/:id" element={<CasoDashboard />} />

        </Route>

        <Route path="*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
