const Card = ({ label, value, color }) => (
  <div className="flex-1 bg-white rounded-xl shadow-md p-4 text-center">
    <div className={`text-${color}-600 text-2xl font-bold`}>{value}</div>
    <div className="text-gray-500">{label}</div>
  </div>
);

const CaseStatusCards = ({ casos }) => {
  const safeCasos = Array.isArray(casos) ? casos : [];
  const counts = safeCasos.reduce((acc, caso) => {
    if (caso.status === "em_andamento") {
      acc.emAndamento += 1;
    } else if (caso.status === "finalizado") {
      acc.finalizado += 1;
    } else if (caso.status === "arquivado") {
      acc.arquivado += 1;
    }
    return acc;
  }, { emAndamento: 0, finalizado: 0, arquivado: 0 });

  return (
    <div className="flex gap-4 justify-end">
      <Card label="Em Andamento" value={counts.emAndamento} color="yellow" />
      <Card label="Finalizado" value={counts.finalizado} color="green" />
      <Card label="Arquivado" value={counts.arquivado} color="blue" />
    </div>
  );
};

export default CaseStatusCards;