"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect, useState, useCallback, useMemo } from "react";

// -------------------- Types --------------------
interface FormData {
  fullName: string;
  email: string;
  number: string;
  age: string;
  gender: string;
  city: string;
  state: string;
}

interface UserDetailFormProps {
  onSubmit: () => void;
}

interface SessionGuardProps {
  children: React.ReactNode;
}

// -------------------- Constants --------------------
const STORAGE_KEYS = {
  ENTRY_TIME: "entryTime",
  FORM_SUBMITTED: "userFormSubmitted",
} as const;

const TIMING = {
  FORM_SHOW_DELAY: 2 * 60 * 1000, // 2 minutes
  LOGIN_FORCE_DELAY: 5 * 60 * 1000, // 5 minutes
  CHECK_INTERVAL: 5 * 1000, // 5 seconds
} as const;

// -------------------- Utility Functions --------------------
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(key);
    } catch {
      //console.error(`Error reading from localStorage: ${key}`, error);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, value);
    } catch {
      // console.error(`Error writing to localStorage: ${key}`, error);
    }
  },
  removeItem: (key: string): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key);
    } catch {
      // console.error(`Error removing from localStorage: ${key}`, error);
    }
  },
};

// -------------------- SessionGuard Component --------------------
export default function SessionGuard({ children }: SessionGuardProps) {
  const { data: session, status } = useSession();
  const [showForm, setShowForm] = useState(false);
  const [forceLogin, setForceLogin] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check if form was already submitted
  const formSubmitted = useMemo(() => {
    return safeLocalStorage.getItem(STORAGE_KEYS.FORM_SUBMITTED) === "true";
  }, []);

  // Initialize entry time only once when component mounts
  useEffect(() => {
    const entryTime = safeLocalStorage.getItem(STORAGE_KEYS.ENTRY_TIME);
    if (!entryTime) {
      safeLocalStorage.setItem(STORAGE_KEYS.ENTRY_TIME, Date.now().toString());
      // console.log(
      //   "🕒 Entry time initialized:",
      //   new Date().toLocaleTimeString()
      // );
    }
    setIsInitialized(true);
  }, []);

  // Handle form submission callback
  const handleFormSubmit = useCallback(() => {
    safeLocalStorage.setItem(STORAGE_KEYS.FORM_SUBMITTED, "true");
    setShowForm(false);
    //console.log("✅ Form submitted successfully");
  }, []);

  // Handle login forcing
  const handleForceLogin = useCallback(async () => {
    try {
      console.log("🔒 Initiating forced Google login...");
      setForceLogin(true);
      await signIn("google", {
        callbackUrl: window.location.href,
        redirect: true,
      });
    } catch {
      // console.error("Error during forced login:", error);
      setForceLogin(false);
    }
  }, []);

  // Main timer logic - runs every 5 seconds
  useEffect(() => {
    if (!isInitialized) return;

    const interval = setInterval(() => {
      const storedTime = safeLocalStorage.getItem(STORAGE_KEYS.ENTRY_TIME);
      const formSubmittedLocal =
        safeLocalStorage.getItem(STORAGE_KEYS.FORM_SUBMITTED) === "true";

      if (!storedTime) return;

      const elapsed = Date.now() - parseInt(storedTime, 10);
      // const elapsedMinutes = Math.floor(elapsed / (60 * 1000));
      // const elapsedSeconds = Math.floor((elapsed % (60 * 1000)) / 1000);

      // console.log(`⏱ Time elapsed: ${elapsedMinutes}m ${elapsedSeconds}s`);

      // Show form after 2 minutes if not submitted and not already showing
      if (
        elapsed > TIMING.FORM_SHOW_DELAY &&
        !formSubmittedLocal &&
        !showForm
      ) {
        // console.log("📋 2 minutes passed - showing form");
        setShowForm(true);
        return; // Exit early to avoid other checks
      }

      // Force login after 5 minutes if form submitted but not authenticated
      if (
        elapsed > TIMING.LOGIN_FORCE_DELAY &&
        formSubmittedLocal &&
        !session &&
        status !== "loading"
      ) {
        console.log("🔒 5 minutes passed, form submitted, forcing login");
        clearInterval(interval);
        handleForceLogin();
        return;
      }
    }, TIMING.CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [
    isInitialized,
    session,
    status,
    showForm,
    formSubmitted,
    handleForceLogin,
  ]);

  // Don't render anything until initialized
  if (!isInitialized) {
    return <>{children}</>;
  }

  // Show form if 2 minutes passed and form not submitted
  if (!formSubmitted && showForm) {
    return <UserDetailForm onSubmit={handleFormSubmit} />;
  }

  // Show login redirect message if forcing login
  if (forceLogin) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-900 rounded-lg p-8 text-center max-w-md mx-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Authentication Required
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Redirecting to Google login...
          </p>
        </div>
      </div>
    );
  }

  // Normal case: show the website content
  return <>{children}</>;
}

// -------------------- UserDetailForm Component --------------------
function UserDetailForm({ onSubmit }: UserDetailFormProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    number: "",
    age: "",
    gender: "",
    city: "",
    state: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Validation function
  const validateForm = useCallback((data: FormData): Partial<FormData> => {
    const newErrors: Partial<FormData> = {};

    if (!data.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (data.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    if (!data.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!data.number.trim()) {
      newErrors.number = "Phone number is required";
    } else if (!/^\+?[\d\s-()]{10,}$/.test(data.number.trim())) {
      newErrors.number = "Please enter a valid phone number";
    }

    if (!data.age.trim()) {
      newErrors.age = "Age is required";
    } else {
      const ageNum = parseInt(data.age, 10);
      if (ageNum < 13 || ageNum > 120) {
        newErrors.age = "Age must be between 13 and 120";
      }
    }

    if (!data.gender.trim()) {
      newErrors.gender = "Gender is required";
    }

    if (!data.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!data.state.trim()) {
      newErrors.state = "State is required";
    }

    return newErrors;
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Clear error when user starts typing
      if (errors[name as keyof FormData]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [errors]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const validationErrors = validateForm(formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setIsSubmitting(true);
      setErrors({});

      try {
        const payload = {
          ...formData,
          age: parseInt(formData.age, 10),
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          number: formData.number.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const res = await fetch("/api/save-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || `Server error: ${res.status}`);
        }

        const result = await res.json();
        console.log("✅ User details saved successfully:", result);

        // Show success message before calling onSubmit
        alert(
          "Details saved successfully! You can now continue browsing. Google login will be required in a few minutes."
        );
        onSubmit();
      } catch (error) {
        // console.error("❌ Error saving user details:", error);

        if (error instanceof Error) {
          if (error.name === "AbortError") {
            setErrors({ email: "Request timed out. Please try again." });
          } else {
            setErrors({
              email: error.message || "Something went wrong. Please try again.",
            });
          }
        } else {
          setErrors({
            email: "An unexpected error occurred. Please try again.",
          });
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validateForm, onSubmit]
  );

  const formFields = [
    {
      key: "fullName",
      label: "Full Name",
      type: "text",
      placeholder: "Enter your full name",
    },
    {
      key: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter your email address",
    },
    {
      key: "number",
      label: "Phone Number",
      type: "tel",
      placeholder: "Enter your phone number",
    },
    { key: "age", label: "Age", type: "number", placeholder: "Enter your age" },
    {
      key: "city",
      label: "City",
      type: "text",
      placeholder: "Enter your city",
    },
    {
      key: "state",
      label: "State",
      type: "text",
      placeholder: "Enter your state",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6 sm:p-8" noValidate>
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Registration Required
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Please fill in your details to continue browsing
            </p>
          </div>

          <div className="space-y-4">
            {formFields.map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label
                  htmlFor={key}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  {label}{" "}
                  {["fullName", "email", "number", "age"].includes(key) && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <input
                  id={key}
                  name={key}
                  type={type}
                  value={formData[key as keyof FormData]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  disabled={isSubmitting}
                  className={`w-full p-3 rounded-lg border ${
                    errors[key as keyof FormData]
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                  } bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                  required={["fullName", "email", "number", "age"].includes(
                    key
                  )}
                />
                {errors[key as keyof FormData] && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors[key as keyof FormData]}
                  </p>
                )}
              </div>
            ))}

            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full p-3 rounded-lg border ${
                  errors.gender
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                } bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                required
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.gender}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-3 rounded-lg font-semibold transition-colors duration-200 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              "Submit & Continue Browsing"
            )}
          </button>

          <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
            After submitting, you can continue browsing. Google login will be
            required shortly.
          </p>
        </form>
      </div>
    </div>
  );
}
