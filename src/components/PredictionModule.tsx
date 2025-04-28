import { useState } from "react";
import SliderInput from "./SliderInput";

function PredictionModule () {

  const fileId = localStorage.getItem('fileId');

  interface InputValues {
    rhr: number;
    hrv: number;
    temp: number;
    spo2: number;
    resp: number;
    asleep: number;
    in_bed: number;
    light: number;
    deep: number;
    rem: number;
    awake: number;
    sleep_need: number;
    sleep_debt: number;
  }

  const [inputs, setInputs] = useState<InputValues>({
    rhr: 60,
    hrv: 50,
    temp: 36,
    spo2: 97,
    resp: 14,
    asleep: 420,
    in_bed: 380,
    light: 130,
    deep: 110,
    rem: 100,
    awake: 50,
    sleep_need: 120,
    sleep_debt: 120, 
  });

  type InputKey = keyof InputValues;

  interface SliderConfig {
    name: InputKey;
    label: string;
    min: number;
    max: number;
    step?: number;
  }

  const sliderConfigs: SliderConfig[] = [
    { name: "rhr", label: "Resting heart rate (bpm)", min: 40, max: 100, step: 1 },
    { name: "hrv", label: "Heart rate variability (ms)", min: 10, max: 150, step: 1 },
    { name: "temp", label: "Skin temp (celsius)", min: 35, max: 38, step: 0.1 },
    { name: "spo2", label: "Blood oxygen %", min: 90, max: 100, step: 1 },
    { name: "resp", label: "Respiratory rate (rpm)", min: 10, max: 25, step: 1 },
    { name: "asleep", label: "Asleep duration (min)", min: 200, max: 600, step: 1 },
    { name: "in_bed", label: "In bed duration (min)", min: 300, max: 700, step: 1 },
    { name: "light", label: "Light sleep duration (min)", min: 100, max: 400, step: 1 },
    { name: "deep", label: "Deep sleep duration (min)", min: 20, max: 150, step: 1 },
    { name: "rem", label: "REM sleep duration (min)", min: 30, max: 200, step: 1 },
    { name: "awake", label: "Awake duration (min)", min: 0, max: 200, step: 1 },
    { name: "sleep_need", label: "Sleep need (min)", min: 300, max: 600, step: 1 },
    { name: "sleep_debt", label: "Sleep debt (min)", min: 0, max: 300, step: 1 }
  ];

  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: parseFloat(value)
    });

    setPrediction(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);
    try {
      const response = await fetch(`/api/analyze/predict/${fileId}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputs)
      });

      const data = await response.json()

      await new Promise(resolve => setTimeout(resolve, 800));

      if (data.error) {
        console.error("Error from server:", data.error);
      } else {
        setPrediction(data.prediction)
      }

    } catch (error) {
      console.error('Error making prediciton:', error)
    } finally {
      setLoading(false)
    }
  }
  // return (
  //   <div>
  //     <h1>Recovery Score Predictor</h1>
  //     <p>Adjust the sliders to simulate different biometric states and estimate recovery score.</p>

  //     <form onSubmit={handleSubmit}>
  //       {sliderConfigs.map((config) => (
  //         <SliderInput
  //           key={config.name}
  //           name={config.name}
  //           label={config.label}
  //           min={config.min}
  //           max={config.max}
  //           step={config.step || 1}
  //           value={inputs[config.name]}
  //           onChange={handleInputChange}
  //         />
  //       ))}

  //       <button type="submit" disabled={loading}>
  //         {loading ? 'Predicting...' : 'Predict Recovery Score'}
  //       </button>
  //     </form>

  //     {prediction !== null && (
  //       <div className="mt-8 text-center p-6 bg-gray-50 rounded-lg shadow-md">
  //         <h2 className="text-2xl font-bold text-gray-800 mb-4">
  //           Predicted WHOOP Recovery Score
  //         </h2>
  //         <div className="text-5xl font-bold text-green-600">
  //           {prediction}
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // )
  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 bg-gray-100 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Recovery Score Predictor</h1>
      <p className="text-gray-600 text-center mb-8">Adjust the sliders to simulate different biometric states and estimate recovery score.</p>

      <form onSubmit={handleSubmit}>
        {sliderConfigs.map((config) => (
          <SliderInput
            key={config.name}
            name={config.name}
            label={config.label}
            min={config.min}
            max={config.max}
            step={config.step || 1}
            value={inputs[config.name]}
            onChange={handleInputChange}
          />
        ))}

        <div className="flex justify-center mt-6">
          <button 
            type="submit" 
            disabled={loading}
            className="border-5 font-semibold"
          >
            {loading ? 'Predicting...' : 'Predict Recovery Score'}
          </button>
        </div>
      </form>

      {prediction !== null && (
        <div className="mt-8 text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Predicted WHOOP Recovery Score
          </h2>
          <div className="text-6xl font-bold text-green-600">
            {prediction}
          </div>
        </div>
      )}
    </div>
  )

}

export default PredictionModule;