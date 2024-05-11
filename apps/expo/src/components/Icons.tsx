import {
  Info,
  LucideIcon,
  MoonStar,
  Sun,
  Image as ImageIcon,
  Plus,
  Clock4,
  MoreVertical,
  ChevronLeft,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Trash2,
  SquarePen,
  X,
} from "lucide-react-native";
import { cssInterop } from "nativewind";

function interopIcon(icon: LucideIcon) {
  cssInterop(icon, {
    className: {
      target: "style",
      nativeStyleToProp: {
        color: true,
        opacity: true,
      },
    },
  });
}

interopIcon(Info);
interopIcon(MoonStar);
interopIcon(Sun);
interopIcon(ImageIcon);
interopIcon(Plus);
interopIcon(Clock4);
interopIcon(MoreVertical);
interopIcon(ChevronLeft);
interopIcon(Check);
interopIcon(ChevronDown);
interopIcon(ChevronRight);
interopIcon(ChevronUp);
interopIcon(Trash2);
interopIcon(SquarePen);
interopIcon(X);

export {
  Info,
  MoonStar,
  Sun,
  ImageIcon,
  Plus,
  Clock4,
  MoreVertical,
  ChevronLeft,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Trash2,
  SquarePen,
  X,
};
