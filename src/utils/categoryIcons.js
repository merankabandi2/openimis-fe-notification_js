import PaymentIcon from "@material-ui/icons/Payment";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";
import AssessmentIcon from "@material-ui/icons/Assessment";
import PeopleIcon from "@material-ui/icons/People";
import AssignmentIcon from "@material-ui/icons/Assignment";
import NotificationsIcon from "@material-ui/icons/Notifications";
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
