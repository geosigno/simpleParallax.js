import { useEffect, useState } from "react";
import {
  onReducedMotionChange,
  prefersReducedMotion,
} from "../../shared/reduced-motion";

const useReducedMotion = (): boolean => {
  const [reduced, setReduced] = useState<boolean>(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
    return onReducedMotionChange(setReduced);
  }, []);

  return reduced;
};

export default useReducedMotion;
