import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { AlertCircle, RefreshCw } from "lucide-react";
const apuLogo = "/apu-logo.png";

interface OverCapacityPageProps {
  onNavigate: (page: string) => void;
}

export function OverCapacityPage({ onNavigate }: OverCapacityPageProps) {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={apuLogo} alt="APU Logo" className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-slate-900">APU VOTE</h1>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 rounded-full bg-amber-100 p-3 w-fit">
              <AlertCircle className="h-8 w-8 text-amber-600" />
            </div>
            <CardTitle className="text-slate-900">Website at Maximum Capacity</CardTitle>
            <CardDescription className="text-base mt-2">
              The system is experiencing high traffic. Please try again later.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-sm text-slate-600">
              If you are an admin, log in to adjust the visitor limit in system settings.
            </p>

            <Button
              onClick={handleRefresh}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Page
            </Button>

            <div className="pt-4 border-t">
              <p className="text-xs text-slate-500">
                We appreciate your patience as we manage system load during peak voting periods.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Alternative Maintenance Mode Version
export function MaintenancePage({ onNavigate }: OverCapacityPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={apuLogo} alt="APU Logo" className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-slate-900">APU VOTE</h1>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 rounded-full bg-blue-100 p-3 w-fit">
              <AlertCircle className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-slate-900">System Under Maintenance</CardTitle>
            <CardDescription className="text-base mt-2">
              The e-voting system is temporarily unavailable. We'll be back shortly.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-900">
                We're performing scheduled maintenance to improve your voting experience.
              </p>
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-slate-500">
                Expected completion time: Please check back in 30 minutes
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
