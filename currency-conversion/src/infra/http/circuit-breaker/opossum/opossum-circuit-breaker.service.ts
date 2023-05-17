import * as CircuitBreaker from 'opossum';
import axios from 'axios';

export function HttpCircuitBreaker() {
  const circuitBreaker = new CircuitBreaker(
    async (url: string) => {
      const response = await axios.get(url);
      return response;
    },
    {
      errorThresholdPercentage: 50,
      timeout: 700,
      resetTimeout: 10000,
    },
  );
  return circuitBreaker;
}
