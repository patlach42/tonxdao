import { useCallback, useState } from "react";
import { useWebApp } from "./TelegramAppProvider.tsx";

type VibrationType =
  | "soft"
  | "heavy"
  | "light"
  | "error"
  | "success"
  | "warning"
  | "selection"
  | "rigid"
  | "medium";
type VibrationStyle = 1 | 2 | 3 | 4 | 5 | 6;
export const useVibration = () => {
  const twa = useWebApp();
  const [vibrationStyle, setVibrationStyle] = useState<VibrationStyle>(4);
  const [vibrationCycle, setVibrationCycle] = useState<number>(0);
  const [vibrationType, setVibrationType] = useState<VibrationType>("soft");
  const [vibrationDelay, setVibrationDelay] = useState<number>(1000);

  const setVibrationStyle1 = useCallback(() => {
    if (vibrationCycle === 0) {
      setVibrationDelay(170);
      setVibrationType("soft");
      setVibrationCycle(1);
    } else if (vibrationCycle === 1) {
      setVibrationDelay(500);
      setVibrationType("heavy");
      setVibrationCycle(2);
    } else if (vibrationCycle === 2) {
      setVibrationDelay(170);
      setVibrationType("soft");
      setVibrationCycle(3);
    } else if (vibrationCycle === 3) {
      setVibrationDelay(500);
      setVibrationType("heavy");
      setVibrationCycle(4);
    } else if (vibrationCycle === 4) {
      setVibrationDelay(170);
      setVibrationType("soft");
      setVibrationCycle(5);
    } else if (vibrationCycle === 5) {
      setVibrationDelay(500);
      setVibrationType("heavy");
      setVibrationCycle(0);
    }
  }, [vibrationCycle]);
  const setVibrationStyle2 = useCallback(() => {
    if (vibrationCycle === 0) {
      setVibrationDelay(430);
      setVibrationType("heavy");
      setVibrationCycle(1);
    } else if (vibrationCycle === 1) {
      setVibrationDelay(430);
      setVibrationType("heavy");
      setVibrationCycle(2);
    } else if (vibrationCycle === 2) {
      setVibrationDelay(430);
      setVibrationType("heavy");
      setVibrationCycle(3);
    } else if (vibrationCycle === 3) {
      setVibrationDelay(430);
      setVibrationType("heavy");
      setVibrationCycle(4);
    } else if (vibrationCycle === 4) {
      setVibrationDelay(430);
      setVibrationType("heavy");
      setVibrationCycle(5);
    } else if (vibrationCycle === 5) {
      setVibrationDelay(430);
      setVibrationType("heavy");
      setVibrationCycle(6);
    } else if (vibrationCycle === 6) {
      setVibrationDelay(430);
      setVibrationType("heavy");
      setVibrationCycle(7);
    } else if (vibrationCycle === 7) {
      setVibrationDelay(430);
      setVibrationType("heavy");
      setVibrationCycle(0);
    }
  }, [vibrationCycle]);
  const setVibrationStyle3 = useCallback(() => {
    if (vibrationCycle === 0) {
      setVibrationDelay(215);
      setVibrationType("heavy");
      setVibrationCycle(1);
    } else if (vibrationCycle === 1) {
      setVibrationDelay(215);
      setVibrationType("selection");
      setVibrationCycle(2);
    } else if (vibrationCycle === 2) {
      setVibrationDelay(215);
      setVibrationType("heavy");
      setVibrationCycle(3);
    } else if (vibrationCycle === 3) {
      setVibrationDelay(215);
      setVibrationType("selection");
      setVibrationCycle(4);
    } else if (vibrationCycle === 4) {
      setVibrationDelay(215);
      setVibrationType("heavy");
      setVibrationCycle(5);
    } else if (vibrationCycle === 5) {
      setVibrationDelay(215);
      setVibrationType("selection");
      setVibrationCycle(6);
    } else if (vibrationCycle === 6) {
      setVibrationDelay(215);
      setVibrationType("heavy");
      setVibrationCycle(7);
    } else if (vibrationCycle === 7) {
      setVibrationDelay(215);
      setVibrationType("selection");
      setVibrationCycle(0);
    }
  }, [vibrationCycle]);
  const setVibrationStyle4 = useCallback(() => {
    if (vibrationCycle === 0) {
      setVibrationDelay(215);
      setVibrationType("heavy");
      setVibrationCycle(1);
    } else if (vibrationCycle === 1) {
      setVibrationDelay(215);
      setVibrationType("selection");
      setVibrationCycle(2);
    } else if (vibrationCycle === 2) {
      setVibrationDelay(215);
      setVibrationType("selection");
      setVibrationCycle(3);
    } else if (vibrationCycle === 3) {
      setVibrationDelay(215);
      setVibrationType("heavy");
      setVibrationCycle(4);
    } else if (vibrationCycle === 4) {
      setVibrationDelay(215);
      setVibrationType("selection");
      setVibrationCycle(5);
    } else if (vibrationCycle === 5) {
      setVibrationDelay(215);
      setVibrationType("selection");
      setVibrationCycle(6);
    } else if (vibrationCycle === 6) {
      setVibrationDelay(215);
      setVibrationType("heavy");
      setVibrationCycle(0);
    }
  }, [vibrationCycle]);
  const setVibrationStyle5 = useCallback(() => {
    if (vibrationCycle === 0) {
      setVibrationDelay(100);
      setVibrationType("warning");
      setVibrationCycle(1);
    } else if (vibrationCycle === 1) {
      setVibrationDelay(70);
      setVibrationType("selection");
      setVibrationCycle(2);
    } else if (vibrationCycle === 2) {
      setVibrationDelay(70);
      setVibrationType("selection");
      setVibrationCycle(3);
    } else if (vibrationCycle === 3) {
      setVibrationDelay(70);
      setVibrationType("selection");
      setVibrationCycle(4);
    } else if (vibrationCycle === 4) {
      setVibrationDelay(70);
      setVibrationType("selection");
      setVibrationCycle(5);
    } else if (vibrationCycle === 5) {
      setVibrationDelay(70);
      setVibrationType("selection");
      setVibrationCycle(0);
    }
  }, [vibrationCycle]);
  const setVibrationStyle6 = useCallback(() => {
    if (vibrationCycle === 0) {
      setVibrationDelay(176);
      setVibrationType("rigid");
      setVibrationCycle(1);
    } else if (vibrationCycle === 1) {
      setVibrationDelay(176);
      setVibrationType("selection");
      setVibrationCycle(2);
    } else if (vibrationCycle === 2) {
      setVibrationDelay(176);
      setVibrationType("warning");
      setVibrationCycle(3);
    } else if (vibrationCycle === 3) {
      setVibrationDelay(176);
      setVibrationType("selection");
      setVibrationCycle(4);
    } else if (vibrationCycle === 4) {
      setVibrationDelay(176);
      setVibrationType("selection");
      setVibrationCycle(5);
    } else if (vibrationCycle === 5) {
      setVibrationDelay(176);
      setVibrationType("rigid");
      setVibrationCycle(6);
    } else if (vibrationCycle === 6) {
      setVibrationDelay(176);
      setVibrationType("warning");
      setVibrationCycle(7);
    } else if (vibrationCycle === 7) {
      setVibrationDelay(176);
      setVibrationType("selection");
      setVibrationCycle(0);
    }
  }, [vibrationCycle]);
  const setVibrationByStyle = useCallback(() => {
    if (vibrationStyle === 1) {
      setVibrationStyle1();
    }
    if (vibrationStyle === 2) {
      setVibrationStyle2();
    }
    if (vibrationStyle === 3) {
      setVibrationStyle3();
    }
    if (vibrationStyle === 4) {
      setVibrationStyle4();
    }
    if (vibrationStyle === 5) {
      setVibrationStyle5();
    }
    if (vibrationStyle === 6) {
      setVibrationStyle6();
    }
  }, [
    setVibrationStyle1,
    setVibrationStyle2,
    setVibrationStyle3,
    setVibrationStyle4,
    setVibrationStyle5,
    setVibrationStyle6,
    vibrationStyle,
  ]);

  const vibrate = useCallback(() => {
    if (vibrationType === "soft") {
      twa?.HapticFeedback?.impactOccurred("soft");
    } else if (vibrationType === "heavy") {
      twa?.HapticFeedback?.impactOccurred("heavy");
    } else if (vibrationType === "light") {
      twa?.HapticFeedback?.impactOccurred("light");
    } else if (vibrationType === "medium") {
      twa?.HapticFeedback?.impactOccurred("medium");
    } else if (vibrationType === "rigid") {
      twa?.HapticFeedback?.impactOccurred("rigid");
    } else if (vibrationType === "error") {
      twa?.HapticFeedback?.notificationOccurred("error");
    } else if (vibrationType === "success") {
      twa?.HapticFeedback?.notificationOccurred("success");
    } else if (vibrationType === "warning") {
      twa?.HapticFeedback?.notificationOccurred("warning");
    } else if (vibrationType === "selection") {
      twa?.HapticFeedback?.selectionChanged();
    }
  }, [vibrationType, twa?.HapticFeedback]);

  return {
    vibrationCycle,
    setVibrationCycle,
    vibrationType,
    setVibrationType,
    vibrationDelay,
    setVibrationByStyle,
    vibrate,
    vibrationStyle,
    setVibrationStyle,
  };
};
