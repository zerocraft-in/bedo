// hooks/usePoseDetection.ts
import { useFrameProcessor } from 'react-native-vision-camera';
import { runPoseDetection } from 'fitness-frame-processor'; // custom native module

export function usePoseDetection() {
  const [landmarks, setLandmarks] = useState<PoseLandmarks | null>(null);

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    const result = runPoseDetection(frame);
    if (result) {
      // result.landmarks = array of 33 keypoints with x,y,z,visibility
      setLandmarks(result.landmarks);
    }
  }, []);

  return { landmarks, frameProcessor };
}