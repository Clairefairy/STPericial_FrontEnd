import React, { useContext, useEffect, useState } from 'react';
import { buscar, buscarEvidencia } from '../../util/service';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../util/UserContext';
import styles from './casodashboard.module.css';
import StatusSelector from '../../components/formCaso/StatusSelector';
import Container from '../../components/Container';
import { CircleDashed, Pen } from 'lucide-react';
import FormularioForm from '../../components/formCaso/FormularioForm';
import LaudoForm from '../../components/formLaudo/FormularioForm';

function CriarLaudo() {
 
    const navigate = useNavigate();

  return (
    <div className={styles.container}>
        <LaudoForm
          onClose={() => {

                  navigate('/dashboard/laudos')
          }}
          onSubmit={(id) => {
              navigate('/dashboard/laudos/', { state: { criado: true } });
          }}/>

        
    </div>
  );

}

export default CriarLaudo;
