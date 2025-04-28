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
  };

  return (
    <div>
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