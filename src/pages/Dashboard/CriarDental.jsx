import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../util/UserContext';
import styles from './casodashboard.module.css';
import DentalForm from '../../components/DentalForm/DentalForm';

function CriarRegistroDental() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <DentalForm
        onClose={() => {
          navigate('/dashboard/registros-odontologicos')
        }}
        onSubmit={() => {
          navigate('/dashboard/registros-odontologicos', { state: { criado: true } });
        }}
      />
    </div>
  );
}

export default CriarRegistroDental;