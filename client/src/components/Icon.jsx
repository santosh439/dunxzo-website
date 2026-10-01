import {
FileSearch,Target,Lock,Fingerprint,Gauge,ScrollText,ClipboardCheck,BadgeCheck,Network,LifeBuoy,UserRound,Scale,Sparkles,Rocket,Building2,Cloud,Landmark,LayoutDashboard,ShieldCheck,FolderCheck,Boxes,Wrench,GraduationCap,Globe2,KeyRound,Laptop,Users,Siren,Activity,CalendarRange,Calculator,Columns3,BookOpen,ListChecks,BookA,Info,Handshake,Mail,Circle
} from "lucide-react";
const MAP = { FileSearch,Target,Lock,Fingerprint,Gauge,ScrollText,ClipboardCheck,BadgeCheck,Network,LifeBuoy,UserRound,Scale,Sparkles,Rocket,Building2,Cloud,Landmark,LayoutDashboard,ShieldCheck,FolderCheck,Boxes,Wrench,GraduationCap,Globe2,KeyRound,Laptop,Users,Siren,Activity,CalendarRange,Calculator,Columns3,BookOpen,ListChecks,BookA,Info,Handshake,Mail,Circle };
export default function Icon({ name, ...props }) {
  const C = MAP[name] || Circle;
  return <C aria-hidden="true" {...props} />;
}
