import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import styles from './casodashboard.module.css';

import FormularioForm from '../../components/formCaso/FormularioForm';
import LaudoForm from '../../components/formLaudo/FormularioForm';

function EditarLaudo() {
 
    const navigate = useNavigate();
  const location = useLocation();
  const laudo = location.state?.laudo;



  return (
    <div className={styles.container}>

        <LaudoForm
        laudoParaEditar={laudo}
          onClose={() => {

                  navigate('/dashboard/laudos')
          }}
          onSubmit={() => {
              navigate('/dashboard/laudos', { state: { editado: true } });

          }}/>

        
    </div>
  );

}

export default EditarLaudo;
