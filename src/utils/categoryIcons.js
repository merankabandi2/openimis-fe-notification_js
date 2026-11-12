import PaymentIcon from "@mui/icons-material/Payment";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { CATEGORY_COLORS } from "../constants";

const CATEGORY_ICONS = {
  payment: PaymentIcon,
  grievance: ReportProblemIcon,
  activity: AssessmentIcon,
  selection: PeopleIcon,
  task: AssignmentIcon,
};

export function getCategoryIcon(category) {
  return CATEGORY_ICONS[category] || NotificationsIcon;
}

export function getCategoryColor(category) {
  return CATEGORY_COLORS[category] || "#616161";
}
