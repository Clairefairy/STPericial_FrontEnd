import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../util/UserContext';
import styles from './casodashboard.module.css';
import UserForm from '../../components/FormUsuario/UserForm';

function CriarUsuario() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <UserForm
        onClose={() => {
          navigate('/dashboard/usuarios')
        }}
        onSubmit={() => {
          navigate('/dashboard/usuarios', { state: { criado: true } });
        }}
      />
    </div>
  );
}

export default CriarUsuario;