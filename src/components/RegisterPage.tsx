import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { registerUser } from "../lib/auth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { UserNav } from "./UserNav";
import { isLoggedIn } from "../lib/session";

const apuLogo = "/apu-logo.png";

interface RegisterPageProps {
  onNavigate: (page: string) => void;
}

export function RegisterPage({ onNavigate }: RegisterPageProps) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const currentUser = isLoggedIn();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    studentId: "",
    password: "",
    confirmPassword: "",
    faculty: "",
    year: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    studentId: "",
    password: "",
    confirmPassword: "",
  });

  // Validation helper functions
  const validateName = (name: string): { valid: boolean; error: string } => {
    if (!name.trim()) {
      return { valid: false, error: "This field is required" };
    }
    if (!/^[A-Za-z\s]+$/.test(name)) {
      return { valid: false, error: "Only letters and spaces are allowed" };
    }
    return { valid: true, error: "" };
  };

  const validateEmail = (email: string): { valid: boolean; error: string } => {
    if (!email.trim()) {
      return { valid: false, error: "Email is required" };
    }
    if (!/^TP\d{6}@mail\.apu\.edu\.my$/.test(email)) {
      return {
        valid: false,
        error: "Format: TP######@mail.apu.edu.my (exactly 6 digits)",
      };
    }
    // Extract TP number from email and check if it matches Student ID
    const emailId = email.split("@")[0]; // Gets "TP000001" from email
    if (formData.studentId && emailId !== formData.studentId) {
      return {
        valid: false,
        error: "Email ID must match your Student ID",
      };
    }
    return { valid: true, error: "" };
  };

  const validateStudentId = (id: string): { valid: boolean; error: string } => {
    if (!id.trim()) {
      return { valid: false, error: "Student ID is required" };
    }
    if (!/^TP\d{6}$/.test(id)) {
      return { valid: false, error: "Format: TP###### (exactly 6 digits)" };
    }
    return { valid: true, error: "" };
  };

  const validatePassword = (
    pwd: string
  ): { valid: boolean; error: string; strength: number } => {
    if (!pwd) {
      return { valid: false, error: "Password is required", strength: 0 };
    }
    if (pwd.length < 8) {
      return {
        valid: false,
        error: "Password must be at least 8 characters",
        strength: 1,
      };
    }

    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasLowerCase = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);

    let strength = 0;
    if (hasUpperCase) strength++;
    if (hasLowerCase) strength++;
    if (hasNumber) strength++;
    if (hasSpecial) strength++;

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecial) {
      const missing = [];
      if (!hasUpperCase) missing.push("uppercase");
      if (!hasLowerCase) missing.push("lowercase");
      if (!hasNumber) missing.push("number");
      if (!hasSpecial) missing.push("special character");
      return {
        valid: false,
        error: `Password must contain: ${missing.join(", ")}`,
        strength,
      };
    }

    return { valid: true, error: "", strength: 4 };
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate all fields
    const firstNameValidation = validateName(formData.firstName);
    const lastNameValidation = validateName(formData.lastName);
    const emailValidation = validateEmail(formData.email);
    const studentIdValidation = validateStudentId(formData.studentId);
    const passwordValidation = validatePassword(formData.password);

    // Update errors
    setErrors({
      firstName: firstNameValidation.error,
      lastName: lastNameValidation.error,
      email: emailValidation.error,
      studentId: studentIdValidation.error,
      password: passwordValidation.error,
      confirmPassword: "",
    });

    // Check if any validation failed
    if (
      !firstNameValidation.valid ||
      !lastNameValidation.valid ||
      !emailValidation.valid ||
      !studentIdValidation.valid ||
      !passwordValidation.valid
    ) {
      toast.error("Please fix all validation errors before submitting");
      setLoading(false);
      return;
    }

    // Check password match
    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!formData.agreeToTerms) {
      toast.error("You must agree to the terms and privacy policy");
      setLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const success = await registerUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        studentId: formData.studentId,
        password: formData.password,
        faculty: formData.faculty,
        year: formData.year,
      });

      if (success) {
        // Save registration data to localStorage for wallet registration
        localStorage.setItem(
          "pendingRegistration",
          JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            studentId: formData.studentId,
            email: formData.email,
            faculty: formData.faculty,
            year: formData.year,
          })
        );

        toast.success("Registration successful! Please login.");
        onNavigate("login");
      } else {
        toast.error("Registration failed. User may already exist.");
      }
    } catch (error) {
      toast.error("An error occurred during registration");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let validation;

    switch (name) {
      case "firstName":
      case "lastName":
        validation = validateName(value);
        break;
      case "email":
        validation = validateEmail(value);
        break;
      case "studentId":
        validation = validateStudentId(value);
        break;
      case "password":
        validation = validatePassword(value);
        break;
      case "confirmPassword":
        if (value !== formData.password) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: "Passwords do not match",
          }));
        }
        return;
      default:
        return;
    }

    if (validation) {
      setErrors((prev) => ({ ...prev, [name]: validation.error }));
    }
  };

  const handleElectionsClick = () => {
    if (!currentUser) {
      localStorage.setItem("intendedDestination", "vote");
      onNavigate("login");
    } else {
      onNavigate("vote");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl flex h-16 items-center px-6 md:px-8">
          <div className="flex items-center gap-2 w-48">
            <img src={apuLogo} alt="APU Logo" className="h-8 w-8" />
            <span className="font-semibold text-slate-900">Register</span>
          </div>
          <nav className="hidden md:flex gap-6 flex-1 justify-center">
            <button
              onClick={() => onNavigate("home")}
              className="text-sm font-normal text-slate-600 hover:text-slate-900 transition-colors"
            >
              Home
            </button>
            <button
              onClick={handleElectionsClick}
              className="text-sm font-normal text-slate-600 hover:text-slate-900 transition-colors"
            >
              Elections
            </button>
            <button
              onClick={() => onNavigate("results")}
              className="text-sm font-normal text-slate-600 hover:text-slate-900 transition-colors"
            >
              Results
            </button>
            <button
              onClick={() => onNavigate("my-votes")}
              className="text-sm font-normal text-slate-600 hover:text-slate-900 transition-colors"
            >
              My Votes
            </button>
            <button
              onClick={() => onNavigate("about")}
              className="text-sm font-normal text-slate-600 hover:text-slate-900 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => onNavigate("contact")}
              className="text-sm font-normal text-slate-600 hover:text-slate-900 transition-colors"
            >
              Contact
            </button>
          </nav>
          <div className="flex items-center gap-3 w-48 justify-end">
            {currentUser ? (
              <UserNav onNavigate={onNavigate} />
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => onNavigate("register")}
                  className="text-primary"
                >
                  Register
                </Button>
                <Button
                  onClick={() => onNavigate("login")}
                  className="bg-slate-900 hover:bg-slate-800 text-white"
                >
                  Sign In
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-6">
        <Card className="w-full max-w-md border-2 shadow-lg">
          <CardHeader>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 mb-2 -ml-2 w-fit text-slate-600 hover:text-slate-900"
              onClick={() => onNavigate("home")}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            <div className="flex items-center gap-3 mb-2">
              <img
                src={apuLogo}
                alt="Asia Pacific University Logo"
                className="h-10 w-auto"
              />
              <CardTitle className="text-2xl text-slate-900">
                Create an account
              </CardTitle>
            </div>
            <CardDescription className="text-slate-600">
              Enter your student details to register for APU voting system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-slate-700">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`border-slate-300 ${
                      errors.firstName ? "border-red-500" : ""
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-500">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-slate-700">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`border-slate-300 ${
                      errors.lastName ? "border-red-500" : ""
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-500">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentId" className="text-slate-700">
                  Student ID (TP Number)
                </Label>
                <Input
                  id="studentId"
                  name="studentId"
                  placeholder="TP000001"
                  required
                  value={formData.studentId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`border-slate-300 ${
                    errors.studentId ? "border-red-500" : ""
                  }`}
                />
                {errors.studentId && (
                  <p className="text-xs text-red-500">{errors.studentId}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">
                  Student Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="TP000001@mail.apu.edu.my"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`border-slate-300 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="faculty" className="text-slate-700">
                  Faculty
                </Label>
                <Select
                  value={formData.faculty}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, faculty: value }))
                  }
                >
                  <SelectTrigger className="border-slate-300">
                    <SelectValue placeholder="Select your faculty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="computing">
                      School of Computing
                    </SelectItem>
                    <SelectItem value="engineering">
                      School of Engineering
                    </SelectItem>
                    <SelectItem value="business">School of Business</SelectItem>
                    <SelectItem value="media">
                      School of Media & Design
                    </SelectItem>
                    <SelectItem value="science">School of Science</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year" className="text-slate-700">
                  Year of Study
                </Label>
                <Select
                  value={formData.year}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, year: value }))
                  }
                >
                  <SelectTrigger className="border-slate-300">
                    <SelectValue placeholder="Select your year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">First Year</SelectItem>
                    <SelectItem value="2">Second Year</SelectItem>
                    <SelectItem value="3">Third Year</SelectItem>
                    <SelectItem value="4">Fourth Year</SelectItem>
                    <SelectItem value="5">Postgraduate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`border-slate-300 pr-10 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-500" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password}</p>
                )}
                <p className="text-xs text-slate-500">
                  Min 8 chars with uppercase, lowercase, number & special char
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-700">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`border-slate-300 pr-10 ${
                      errors.confirmPassword ? "border-red-500" : ""
                    }`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-500" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      agreeToTerms: checked as boolean,
                    }))
                  }
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700"
                  >
                    Agree to terms and conditions
                  </label>
                  <p className="text-sm text-slate-500">
                    By registering, you agree to our Terms of Service and
                    Privacy Policy.
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>

              <div className="text-center text-sm text-slate-600">
                Already have an account?{" "}
                <button
                  type="button"
                  className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
                  onClick={() => onNavigate("login")}
                >
                  Sign in
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="w-full border-t py-6 bg-white">
        <div className="container mx-auto max-w-7xl flex flex-col items-center justify-between gap-4 md:flex-row px-6 md:px-8">
          <div className="text-center text-sm text-slate-600 md:text-left">
            © {new Date().getFullYear()} APU Vote Chain. All rights reserved.
          </div>
          <div className="flex gap-6">
            <button
              onClick={() => onNavigate("terms")}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Terms
            </button>
            <button
              onClick={() => onNavigate("privacy")}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Privacy
            </button>
            <button
              onClick={() => onNavigate("contact")}
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
