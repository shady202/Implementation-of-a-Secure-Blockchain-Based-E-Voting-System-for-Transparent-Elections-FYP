import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { UserNav } from "./UserNav";
import { isLoggedIn } from "../lib/session";
import { Mail, Phone, MapPin, Clock, MessageCircle, HelpCircle, ArrowLeft } from "lucide-react";
const apuLogo = "/apu-logo.png";

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

export function ContactPage({ onNavigate }: ContactPageProps) {
  const currentUser = isLoggedIn();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted");
    // Handle form submission
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-7xl flex h-16 items-center px-6 md:px-8">
          <div className="flex items-center gap-3 w-48">
            <img src={apuLogo} alt="Asia Pacific University Logo" className="h-10 w-auto" />
            <span>APU VOTE</span>
          </div>
          <nav className="hidden md:flex gap-6 flex-1 justify-center">
            <button
              onClick={() => onNavigate('home')}
              className="text-sm transition-colors hover:text-primary"
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('vote')}
              className="text-sm transition-colors hover:text-primary"
            >
              Elections
            </button>
            <button
              onClick={() => onNavigate('results')}
              className="text-sm transition-colors hover:text-primary"
            >
              Results
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="text-sm transition-colors hover:text-primary"
            >
              About
            </button>
            <button
              className="text-sm text-primary"
            >
              Contact
            </button>
          </nav>
          <div className="flex items-center gap-3 w-48 justify-end">
            <UserNav onNavigate={onNavigate} />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto max-w-7xl py-16 px-6 md:px-8">
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={() => onNavigate('home')}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </div>
          <div className="mb-8">
            <h1 className="text-slate-900 mb-2">Contact Us</h1>
            <p className="text-slate-600">
              Have questions about APU VOTE? We're here to help. Reach out to us through any of the channels below.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Mail className="h-6 w-6 text-emerald-600" />
                  </div>
                  <CardTitle>Email Us</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-slate-600">
                  <div>
                    <strong className="text-slate-900">General Inquiries:</strong>
                  </div>
                  <a href="mailto:vote@apu.edu.my" className="text-emerald-600 hover:underline block">
                    vote@apu.edu.my
                  </a>
                  <div className="mt-3">
                    <strong className="text-slate-900">Technical Support:</strong>
                  </div>
                  <a href="mailto:support@apu.edu.my" className="text-emerald-600 hover:underline block">
                    support@apu.edu.my
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Phone className="h-6 w-6 text-emerald-600" />
                  </div>
                  <CardTitle>Call Us</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-slate-600">
                  <div>
                    <strong className="text-slate-900">Main Line:</strong>
                  </div>
                  <a href="tel:+60389961000" className="text-emerald-600 hover:underline block">
                    +60 3-8996 1000
                  </a>
                  <div className="mt-3">
                    <strong className="text-slate-900">Student Services:</strong>
                  </div>
                  <a href="tel:+60389961234" className="text-emerald-600 hover:underline block">
                    +60 3-8996 1234
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <MapPin className="h-6 w-6 text-emerald-600" />
                  </div>
                  <CardTitle>Visit Us</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="leading-relaxed text-slate-600">
                  <div className="text-slate-900 mb-1">Asia Pacific University</div>
                  <div>Technology Park Malaysia</div>
                  <div>Bukit Jalil</div>
                  <div>57000 Kuala Lumpur</div>
                  <div>Malaysia</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 mb-12">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-6 w-6 text-emerald-500" />
                  <CardTitle>Send Us a Message</CardTitle>
                </div>
                <CardDescription>Fill out the form below and we'll get back to you within 24 hours.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" placeholder="John" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" placeholder="Doe" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">University Email *</Label>
                    <Input id="email" type="email" placeholder="tp123456@mail.apu.edu.my" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="studentId">Student ID *</Label>
                    <Input id="studentId" placeholder="TP123456" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input id="subject" placeholder="Question about voting process" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Please describe your question or concern in detail..."
                      rows={5}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Clock className="h-6 w-6 text-emerald-500" />
                    <CardTitle>Support Hours</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-slate-600">
                    <div>
                      <div className="text-slate-900">During Election Period:</div>
                      <div>Monday - Sunday: 8:00 AM - 10:00 PM</div>
                    </div>
                    <div>
                      <div className="text-slate-900">Regular Hours:</div>
                      <div>Monday - Friday: 9:00 AM - 6:00 PM</div>
                      <div>Saturday: 9:00 AM - 1:00 PM</div>
                      <div>Sunday & Public Holidays: Closed</div>
                    </div>
                    <div className="text-slate-500 italic">All times are in Malaysia Standard Time (GMT+8)</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-6 w-6 text-emerald-500" />
                    <CardTitle>Frequently Asked Questions</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-slate-600">
                    <div>
                      <div className="text-slate-900 mb-1">How do I register to vote?</div>
                      <div>
                        Click the "Register" button and use your @apu.edu.my email to create an account. You'll need
                        your student ID for verification.
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-900 mb-1">Is my vote really anonymous?</div>
                      <div>
                        Yes! Your vote is encrypted and recorded on the blockchain without any connection to your
                        identity. Not even administrators can see how you voted.
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-900 mb-1">Can I change my vote?</div>
                      <div>
                        No. Once submitted to the blockchain, votes are permanent and cannot be changed. Please review
                        your choices carefully before submitting.
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-900 mb-1">What if I forget my password?</div>
                      <div>
                        Use the "Forgot Password" link on the login page. A reset link will be sent to your university
                        email.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Need Immediate Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-slate-600">
                    <div>
                      For urgent technical issues during active elections, please call our hotline:
                    </div>
                    <a href="tel:+60389961000" className="text-emerald-600 hover:underline block">
                      +60 3-8996 1000
                    </a>
                    <div className="text-slate-500">Available during election periods only</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="bg-emerald-50 border-emerald-200">
            <CardHeader>
              <CardTitle className="text-center">Important Notice</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-slate-600">
                For issues related to election rules, candidate complaints, or official grievances, please contact the
                APU Student Council Elections Committee directly at{" "}
                <a href="mailto:elections@apu.edu.my" className="text-emerald-600 hover:underline">
                  elections@apu.edu.my
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="w-full border-t py-6 mt-12">
        <div className="container mx-auto max-w-7xl flex flex-col items-center justify-between gap-4 md:flex-row px-6 md:px-8">
          <div className="text-center text-slate-600 md:text-left">
            &copy; {new Date().getFullYear()} APU Vote Chain. All rights reserved.
          </div>
          <div className="flex gap-6">
            <button
              onClick={() => onNavigate('terms')}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Terms
            </button>
            <button
              onClick={() => onNavigate('privacy')}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Privacy
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Contact
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}