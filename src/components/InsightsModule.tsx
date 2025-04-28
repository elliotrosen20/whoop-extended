import InsightCard from "./InsightCard";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface InsightDetail {
  feature: string;
  original_feature: string,
  units: string,
  change_amount: number;
  impact: number;
  description: string;
}

interface InsightsModuleProps {
  insights: InsightDetail[];
}

function InsightsModule ({
  insights
}: InsightsModuleProps) {
 
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <div className="custom-arrow right-0" />,
    prevArrow: <div className="custom-arrow left-0" />
  };

  return (
    // <div className="w-full mx-auto px-6 py-8 bg-white rounded-lg shadow-lg">
    <div className="">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Insights</h2>
      <Slider {...settings}>
        {insights.map(insight => {
          return (
            <InsightCard insight={insight} />
          )
        })}
      </Slider>
    </div>
  )
}

export default InsightsModule;