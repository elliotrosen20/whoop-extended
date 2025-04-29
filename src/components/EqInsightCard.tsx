interface EqInsightDetail {
  feature1: string;
  feature2: string;
  feature1_units: string;
  feature2_units: string;
  ratio: number;
  description: string;
}

interface EqInsightCardProps {
  eqInsight: EqInsightDetail;
}


function EqInsightCard ({
  eqInsight
}: EqInsightCardProps) {
  const { feature1, feature2, ratio, description } = eqInsight;

  return (
    <div className="bg-white shadow-md p-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          {feature1} ⟷ {feature2}
        </h3>
        <div className="flex items-center text-blue-600">
          <span className="text-3xl font-bold">
            {Math.abs(ratio).toFixed(4)}×
          </span>
          <span className="ml-1 text-sm">ratio</span>
        </div>
      </div>
      
      <p className="text-gray-700 mb-4 text-base">
        {description}
      </p>
    </div>
  )
}

export default EqInsightCard;