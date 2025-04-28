import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from './casodashboard.module.css';
import UserForm from '../../components/formLaudo/FormularioForm';

function EditarUsuario() {
  const navigate = useNavigate();
  const location = useLocation();
  const usuario = location.state?.usuario;

  return (
    <div className={styles.container}>
      <UserForm
        usuarioParaEditar={usuario}
        onClose={() => {
          navigate('/dashboard/usuarios')
        }}
        onSubmit={() => {
          navigate('/dashboard/usuarios', { state: { editado: true } });
        }}
      />
    </div>
  );
}

export default EditarUsuario;