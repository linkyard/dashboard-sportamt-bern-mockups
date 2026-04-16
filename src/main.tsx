import { TopBar } from "./dashboard/top-bar";
import { RouteIndex } from "./site/routes";

export default function MainView() {
  return (
    <div className="root">
      <TopBar />
      <RouteIndex />
    </div>
  );
}
