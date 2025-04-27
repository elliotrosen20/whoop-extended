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
  const { feature1, feature2, feature1_units, feature2_units, ratio, description } = eqInsight;

  return (
    <div className="bg-white rounded-lg shadow-md p-5 transition-all duration-300 hover:shadow-lg">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-800">
          {feature1} ⟷ {feature2}
        </h3>
        <div className="flex items-center text-blue-600">
          <span className="text-2xl font-bold">
            {Math.abs(ratio).toFixed(4)}×
          </span>
          <span className="ml-1 text-sm">ratio</span>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4">
        {description}
      </p>
    </div>
  )
}

export default EqInsightCard;