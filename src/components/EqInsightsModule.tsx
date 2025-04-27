interface EqInsight {
  feature1: string;
  feature2: string;
  ratio: number;
  description: string;
}

interface EqInsightsModuleProps {
  eqInsights: EqInsight[];
}

function EqInsightsModule ({
  eqInsights
}: EqInsightsModuleProps) {


  return (
    <div>
      
    </div>
  )
}

export default EqInsightsModule;