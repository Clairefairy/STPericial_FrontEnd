import React, { useContext, useEffect, useState } from 'react';
import { buscar, buscarEvidencia } from '../../util/service';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../util/UserContext';
import styles from './casodashboard.module.css';
import StatusSelector from '../../components/formCaso/StatusSelector';
import Container from '../../components/Container';
import { CircleDashed, Pen } from 'lucide-react';
import FormularioForm from '../../components/formCaso/FormularioForm';

function EditarCaso() {
 
    const navigate = useNavigate();
  const location = useLocation();
  const caso = location.state?.caso;



  return (
    <div className={styles.container}>
dqwd
     asdasd
        <FormularioForm
        casoParaEditar={caso}
          onClose={() => {

                  navigate('/dashboard/casos')
          }}
          onSubmit={() => {
              navigate('/dashboard/casos', { state: { editado: true } });

          }}/>

        
    </div>
  );

}

export default EditarCaso;
