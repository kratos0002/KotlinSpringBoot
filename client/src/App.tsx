import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import InfoHubPage from "@/pages/info-hub-page";
import DirectoryPage from "@/pages/directory-page";
import { AuthProvider } from "./hooks/use-auth";
import { CityProvider } from "@/context/CityContext";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/info-hub" component={InfoHubPage} />
          <Route path="/directory" component={DirectoryPage} />
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CityProvider>
        <AuthProvider>
          <Router />
          <Toaster />
        </AuthProvider>
      </CityProvider>
    </QueryClientProvider>
  );
}

export default App;
