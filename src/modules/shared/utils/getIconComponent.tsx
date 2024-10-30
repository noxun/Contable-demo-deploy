import {
  FileCheck2,
  FileInput,
  FileOutput,
  ListTree,
  User,
  Landmark,
  NotebookText,
  Folder,
  Text,
  Building,
  ListRestart,
  ListTodo,
  SquareGanttChart,
  Link,
  LayoutTemplate,
  MapPinHouse,
} from "lucide-react";

// Function to get the icon component based on the name
export const getIconComponent = (iconName: string) => {

  const icons = {
    FileCheck2: <FileCheck2 className="h-5 w-5" />,
    FileInput: <FileInput className="h-5 w-5" />,
    FileOutput: <FileOutput className="h-5 w-5" />,
    ListTree: <ListTree className="h-5 w-5" />,
    User: <User className="h-5 w-5" />,
    Landmark: <Landmark className="h-5 w-5" />,
    NotebookText: <NotebookText className="h-5 w-5" />,
    Folder: <Folder className="h-5 w-5" />,
    Text: <Text className="h-5 w-5" />,
    Building: <Building className="h-5 w-5" />,
    ListRestart: <ListRestart className="h-5 w-5" />,
    ListTodo: <ListTodo className="h-5 w-5" />,
    SquareGanttChart: <SquareGanttChart className="h-5 w-5" />,
    Link: <Link className="h-5 w-5" />,
    LayoutTemplate: <LayoutTemplate className="h-5 w-5" />,
    MapPinHouse: <MapPinHouse className="h-5 w-5" />,
  };

  return icons[iconName?.trim() as keyof typeof icons] || <User className="h-5 w-5" />; // Default to User icon if not found
};
