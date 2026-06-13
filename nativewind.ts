import { cssInterop } from "nativewind";
import { Svg } from "react-native-svg";

cssInterop(Svg, {
  className: {
    target: "style",
    nativeStyleToProp: {
      color: true,
    },
  },
});