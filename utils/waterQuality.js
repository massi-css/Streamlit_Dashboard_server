


const calculate_wqi = (ph, turbidity, temperature) => {
  // Weights for each parameter
  const ph_weight = 0.33;
  const turbidity_weight = 0.33;
  const temperature_weight = 0.33;

  // Normalize parameters
  const ph_norm = ((ph - 6) / (8.5 - 6)) * 100;
  const turbidity_norm = (turbidity / 5) * 100; // maximum acceptable turbidity is 5 NTU
  const temperature_norm = ((temperature - 0) / (30 - 0)) * 100; // temperature range from 0 to 30 Celsius

    // Cap normalized parameters at 100
    ph_norm = Math.min(ph_norm, 100);
    turbidity_norm = Math.min(turbidity_norm, 100);
    temperature_norm = Math.min(temperature_norm, 100);

  // Calculate sub-indices
  const ph_index = ph_norm * ph_weight;
  const turbidity_index = turbidity_norm * turbidity_weight;
  const temperature_index = temperature_norm * temperature_weight;

  // Calculate WQI
  const wqi =
    ph_index + turbidity_index + temperature_index;

  return wqi;
};

export { calculate_wqi };
