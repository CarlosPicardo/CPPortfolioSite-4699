import { Route, Switch } from "wouter";
import Index from "./pages/index";
import Admin from "./pages/admin";
import { Provider } from "./components/provider";
import { useDraftPreview } from "./lib/content";

function App() {
  useDraftPreview();
  return (
    <Provider>
      <Switch>
        <Route path="/" component={Index} />
        <Route path="/admin" component={Admin} />
      </Switch>
    </Provider>
  );
}

export default App;
