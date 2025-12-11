import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ArrowLeft, UserPlus } from "lucide-react";
import { useState } from "react";

interface CandidatePageProps {
  onNavigate: (page: string) => void;
}

export function CandidatePage({ onNavigate }: CandidatePageProps) {
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    party: "",
    walletAddress: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Registering candidate:", formData);
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate('admin')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h2 className="text-slate-900">Register Candidate</h2>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg border-slate-200">
            <CardHeader className="space-y-1 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                Candidate Registration Form
              </CardTitle>
              <CardDescription>
                Register a new candidate for upcoming elections on the blockchain
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter candidate's full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="border-slate-300 focus:border-blue-500 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, position: value })}>
                    <SelectTrigger className="border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="president">President</SelectItem>
                      <SelectItem value="vice-president">Vice President</SelectItem>
                      <SelectItem value="secretary">Secretary</SelectItem>
                      <SelectItem value="treasurer">Treasurer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="party">Party / Affiliation</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, party: value })}>
                    <SelectTrigger className="border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Select party" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="progressive">Progressive Alliance</SelectItem>
                      <SelectItem value="innovation">Innovation Party</SelectItem>
                      <SelectItem value="united">United Students</SelectItem>
                      <SelectItem value="independent">Independent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wallet">Wallet Address</Label>
                  <Input
                    id="wallet"
                    placeholder="0x..."
                    value={formData.walletAddress}
                    onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
                    className="border-slate-300 focus:border-blue-500 focus:ring-blue-500 font-mono transition-all"
                  />
                  <p className="text-slate-500">Enter the candidate's Ethereum wallet address</p>
                </div>

                <div className="pt-4 flex gap-3">
                  <Button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700 flex-1"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Register Candidate
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => onNavigate('admin')}
                    className="border-slate-300"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <h4 className="text-blue-900">Important Notes</h4>
                <ul className="list-disc list-inside text-blue-700 space-y-1">
                  <li>All candidate registrations are recorded on the blockchain</li>
                  <li>Wallet address must be valid and verified</li>
                  <li>Candidates cannot be removed once registered</li>
                  <li>Registration requires admin approval and gas fees</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
