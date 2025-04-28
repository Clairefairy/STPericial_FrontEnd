import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from './casodashboard.module.css';
import DentalForm from '../../components/DentalForm/DentalForm';

function EditarRegistroDental() {
  const navigate = useNavigate();
  const location = useLocation();
  const dentalRecord = location.state?.dentalRecord;

  return (
    <div className={styles.container}>
      <DentalForm
        dentalRecordParaEditar={dentalRecord}
        onClose={() => {
          navigate('/dashboard/registros-odontologicos')
        }}
        onSubmit={() => {
          navigate('/dashboard/registros-odontologicos', { state: { editado: true } });
        }}
      />
    </div>
  );
}

export default EditarRegistroDental;