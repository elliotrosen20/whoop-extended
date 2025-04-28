interface InsightDetail {
  feature: string;
  original_feature: string,
  units: string,
  change_amount: number;
  impact: number;
  description: string;
}

interface InsightCardProps {
  insight: InsightDetail;
}

function InsightCard ({
  insight
}: InsightCardProps) {

  const { feature, units, change_amount, impact, description } = insight;

  const isPositive = impact > 0;

  // return (
  //   <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
  //     <div className="flex justify-between items-start mb-3">
  //       <h3 className="text-lg font-semibold text-gray-800">
  //         {feature}
  //       </h3>
  //       <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
  //         <span className="text-2xl font-bold">
  //           {isPositive ? '+' : ''}{impact.toFixed(1)}
  //         </span>
  //         <span className="ml-1 text-sm">points</span>
  //       </div>
  //     </div>
      
  //     <p className="text-gray-600 mb-4">
  //       {description}
  //     </p>
      
  //     <div className="flex items-center text-sm text-gray-500">
  //       <span className="font-medium">Change amount:</span>
  //       <span className="ml-2">{change_amount.toFixed(2)} {units}</span>
  //     </div>
  //   </div>
  // )
  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{feature}</h3>
        <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          <span className="text-3xl font-bold">
            {isPositive ? '+' : ''}{impact.toFixed(1)}
          </span>
          <span className="ml-1 text-sm">points</span>
        </div>
      </div>
  
      <p className="text-gray-700 mb-4 text-base">
        {description}
      </p>
  
      <div className="flex items-center text-sm text-gray-600">
        <span className="font-medium">Change amount:</span>
        <span className="ml-2">{change_amount.toFixed(2)} {units}</span>
      </div>
    </div>
  )

}

export default InsightCard;