import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import EqInsightCard from "./EqInsightCard";

interface EqInsightDetail {
  feature1: string;
  feature2: string;
  feature1_units: string;
  feature2_units: string;
  ratio: number;
  description: string;
}

interface EqInsightsModuleProps {
  eqInsights: EqInsightDetail[];
}

function EqInsightsModule ({
  eqInsights
}: EqInsightsModuleProps) {

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div>
      <Slider {...settings}>
        {eqInsights.map(eqInsight  => {
          return (
            <EqInsightCard eqInsight={eqInsight} />
          )
        })}
      </Slider>
    </div>
  )
}

export default EqInsightsModule;