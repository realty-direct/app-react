import { BrowserRouter } from "react-router-dom";
import RootView from "./src/RootView";

export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      <RootView />
    </BrowserRouter>
  );
}
