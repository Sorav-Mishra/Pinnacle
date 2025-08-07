// "use client";

// import { useSession, signIn } from "next-auth/react";
// import { useEffect, useState, useCallback, useMemo } from "react";

// // -------------------- Types --------------------
// interface FormData {
//   fullName: string;
//   email: string;
//   number: string;
//   age: string;
//   gender: string;
//   city: string;
//   state: string;
// }

// interface UserDetailFormProps {
//   onSubmit: () => void;
// }

// interface SessionGuardProps {
//   children: React.ReactNode;
// }

// // -------------------- Constants --------------------
// const STORAGE_KEYS = {
//   ENTRY_TIME: "entryTime",
//   FORM_SUBMITTED: "userFormSubmitted",
//   LOGIN_TIME: "loginTime",
// } as const;

// const TIMING = {
//   FREE_USAGE_DELAY: 3 * 60 * 1000, // 3 minutes free usage
//   FORM_SHOW_DELAY: 5 * 60 * 1000, // 5 minutes after login to show form
//   CHECK_INTERVAL: 5 * 1000, // 5 seconds
// } as const;

// // -------------------- Utility Functions --------------------
// const safeLocalStorage = {
//   getItem: (key: string): string | null => {
//     if (typeof window === "undefined") return null;
//     try {
//       return localStorage.getItem(key);
//     } catch {
//       return null;
//     }
//   },
//   setItem: (key: string, value: string): void => {
//     if (typeof window === "undefined") return;
//     try {
//       localStorage.setItem(key, value);
//     } catch {
//       // Handle error silently
//     }
//   },
//   removeItem: (key: string): void => {
//     if (typeof window === "undefined") return;
//     try {
//       localStorage.removeItem(key);
//     } catch {
//       // Handle error silently
//     }
//   },
// };

// // -------------------- SessionGuard Component --------------------
// export default function SessionGuard({ children }: SessionGuardProps) {
//   const { data: session, status } = useSession();
//   const [showForm, setShowForm] = useState(false);
//   const [forceLogin, setForceLogin] = useState(false);
//   const [isInitialized, setIsInitialized] = useState(false);

//   // Check if form was already submitted (re-evaluate on each render)
//   const formSubmitted = useMemo(() => {
//     if (typeof window === "undefined") return false;
//     return safeLocalStorage.getItem(STORAGE_KEYS.FORM_SUBMITTED) === "true";
//   }, [showForm]); // Add showForm as dependency to re-evaluate after form submission

//   // Initialize entry time only once when component mounts
//   useEffect(() => {
//     const entryTime = safeLocalStorage.getItem(STORAGE_KEYS.ENTRY_TIME);
//     if (!entryTime) {
//       safeLocalStorage.setItem(STORAGE_KEYS.ENTRY_TIME, Date.now().toString());
//       // console.log(
//       //   "🕒 Entry time initialized:",
//       //   new Date().toLocaleTimeString()
//       // );
//     }
//     setIsInitialized(true);
//   }, []);

//   // Set login time when user successfully logs in
//   useEffect(() => {
//     if (session && status === "authenticated") {
//       const loginTime = safeLocalStorage.getItem(STORAGE_KEYS.LOGIN_TIME);
//       if (!loginTime) {
//         safeLocalStorage.setItem(
//           STORAGE_KEYS.LOGIN_TIME,
//           Date.now().toString()
//         );
//       //  console.log("🔐 Login time recorded:", new Date().toLocaleTimeString());
//       }
//     }
//   }, [session, status]);

//   // Handle form submission callback
//   const handleFormSubmit = useCallback(() => {
//     safeLocalStorage.setItem(STORAGE_KEYS.FORM_SUBMITTED, "true");
//     setShowForm(false);
//    // console.log("✅ Form submitted successfully");
//     // Force a re-render by updating a state that affects the component
//     window.location.reload(); // Simple way to ensure clean state
//   }, []);

//   // Handle login forcing
//   const handleForceLogin = useCallback(async () => {
//     try {
//      // console.log("🔒 Initiating forced Google login...");
//       setForceLogin(true);
//       await signIn("google", {
//         callbackUrl: window.location.href,
//         redirect: true,
//       });
//     } catch {
//       setForceLogin(false);
//     }
//   }, []);

//   // Main timer logic - runs every 5 seconds
//   useEffect(() => {
//     if (!isInitialized) return;

//     const interval = setInterval(() => {
//       const storedEntryTime = safeLocalStorage.getItem(STORAGE_KEYS.ENTRY_TIME);
//       const storedLoginTime = safeLocalStorage.getItem(STORAGE_KEYS.LOGIN_TIME);
//       const formSubmittedLocal =
//         safeLocalStorage.getItem(STORAGE_KEYS.FORM_SUBMITTED) === "true";

//       if (!storedEntryTime) return;

//       const entryElapsed = Date.now() - parseInt(storedEntryTime, 10);
//       const entryMinutes = Math.floor(entryElapsed / (60 * 1000));
//       const entrySeconds = Math.floor((entryElapsed % (60 * 1000)) / 1000);

//       console.log(`⏱ Time since entry: ${entryMinutes}m ${entrySeconds}s`);
//       console.log(
//         `📊 Status - Session: ${!!session}, FormSubmitted: ${formSubmittedLocal}, ShowForm: ${showForm}`
//       );

//       // FLOW 1: Force login after 3 minutes if user is not logged in
//       if (
//         entryElapsed > TIMING.FREE_USAGE_DELAY &&
//         !session &&
//         status !== "loading"
//       ) {
//        // console.log("🔒 3 minutes passed without login - forcing Google login");
//         clearInterval(interval);
//         handleForceLogin();
//         return;
//       }

//       // FLOW 2: Show form after 5 minutes of login if logged in but form not submitted
//       if (session && storedLoginTime && !formSubmittedLocal) {
//         const loginElapsed = Date.now() - parseInt(storedLoginTime, 10);
//         const loginMinutes = Math.floor(loginElapsed / (60 * 1000));
//         const loginSeconds = Math.floor((loginElapsed % (60 * 1000)) / 1000);

//         console.log(`⏱ Time since login: ${loginMinutes}m ${loginSeconds}s`);

//         if (loginElapsed > TIMING.FORM_SHOW_DELAY && !showForm) {
//         //  console.log("📋 5 minutes passed since login - showing form");
//           setShowForm(true);
//         }
//       }
//     }, TIMING.CHECK_INTERVAL);

//     return () => clearInterval(interval);
//   }, [isInitialized, session, status, showForm, handleForceLogin]);

//   // Don't render anything until initialized
//   if (!isInitialized) {
//     return <>{children}</>;
//   }

//   // Show form if user is logged in, 5 minutes passed since login, and form not submitted
//   if (session && !formSubmitted && showForm) {
//     return <UserDetailForm onSubmit={handleFormSubmit} />;
//   }

//   // Show login redirect message if forcing login
//   if (forceLogin) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white dark:bg-gray-900 rounded-lg p-8 text-center max-w-md mx-4">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
//             Free Trial Ended
//           </h3>
//           <p className="text-gray-600 dark:text-gray-400 mb-2">
//             Your 3-minute free trial has ended.
//           </p>
//           <p className="text-gray-600 dark:text-gray-400">
//             Redirecting to Google login to continue...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // Normal case: show the website content
//   return <>{children}</>;
// }

// // -------------------- UserDetailForm Component --------------------
// function UserDetailForm({ onSubmit }: UserDetailFormProps) {
//   const [formData, setFormData] = useState<FormData>({
//     fullName: "",
//     email: "",
//     number: "",
//     age: "",
//     gender: "",
//     city: "",
//     state: "",
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errors, setErrors] = useState<Partial<FormData>>({});

//   // Validation function
//   const validateForm = useCallback((data: FormData): Partial<FormData> => {
//     const newErrors: Partial<FormData> = {};

//     if (!data.fullName.trim()) {
//       newErrors.fullName = "Full name is required";
//     } else if (data.fullName.trim().length < 2) {
//       newErrors.fullName = "Full name must be at least 2 characters";
//     }

//     if (!data.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
//       newErrors.email = "Please enter a valid email address";
//     }

//     if (!data.number.trim()) {
//       newErrors.number = "Phone number is required";
//     } else if (!/^\+?[\d\s-()]{10,}$/.test(data.number.trim())) {
//       newErrors.number = "Please enter a valid phone number";
//     }

//     if (!data.age.trim()) {
//       newErrors.age = "Age is required";
//     } else {
//       const ageNum = parseInt(data.age, 10);
//       if (ageNum < 13 || ageNum > 120) {
//         newErrors.age = "Age must be between 13 and 120";
//       }
//     }

//     if (!data.gender.trim()) {
//       newErrors.gender = "Gender is required";
//     }

//     if (!data.city.trim()) {
//       newErrors.city = "City is required";
//     }

//     if (!data.state.trim()) {
//       newErrors.state = "State is required";
//     }

//     return newErrors;
//   }, []);

//   const handleChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//       const { name, value } = e.target;
//       setFormData((prev) => ({ ...prev, [name]: value }));

//       // Clear error when user starts typing
//       if (errors[name as keyof FormData]) {
//         setErrors((prev) => ({ ...prev, [name]: undefined }));
//       }
//     },
//     [errors]
//   );

//   const handleSubmit = useCallback(
//     async (e: React.FormEvent) => {
//       e.preventDefault();

//       const validationErrors = validateForm(formData);
//       if (Object.keys(validationErrors).length > 0) {
//         setErrors(validationErrors);
//         return;
//       }

//       setIsSubmitting(true);
//       setErrors({});

//       try {
//         const payload = {
//           ...formData,
//           age: parseInt(formData.age, 10),
//           fullName: formData.fullName.trim(),
//           email: formData.email.trim().toLowerCase(),
//           number: formData.number.trim(),
//           city: formData.city.trim(),
//           state: formData.state.trim(),
//         };

//         const controller = new AbortController();
//         const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

//         const res = await fetch("/api/save-user", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(payload),
//           signal: controller.signal,
//         });

//         clearTimeout(timeoutId);

//         if (!res.ok) {
//           const errorData = await res.json().catch(() => ({}));
//           throw new Error(errorData.error || `Server error: ${res.status}`);
//         }

//         // Show success message before calling onSubmit
//         alert(
//           "Details saved successfully! You can now continue using the app without any restrictions."
//         );
//         onSubmit();
//       } catch (error) {
//         if (error instanceof Error) {
//           if (error.name === "AbortError") {
//             setErrors({ email: "Request timed out. Please try again." });
//           } else {
//             setErrors({
//               email: error.message || "Something went wrong. Please try again.",
//             });
//           }
//         } else {
//           setErrors({
//             email: "An unexpected error occurred. Please try again.",
//           });
//         }
//       } finally {
//         setIsSubmitting(false);
//       }
//     },
//     [formData, validateForm, onSubmit]
//   );

//   const formFields = [
//     {
//       key: "fullName",
//       label: "Full Name",
//       type: "text",
//       placeholder: "Enter your full name",
//     },
//     {
//       key: "email",
//       label: "Email",
//       type: "email",
//       placeholder: "Enter your email address",
//     },
//     {
//       key: "number",
//       label: "Phone Number",
//       type: "tel",
//       placeholder: "Enter your phone number",
//     },
//     { key: "age", label: "Age", type: "number", placeholder: "Enter your age" },
//     {
//       key: "city",
//       label: "City",
//       type: "text",
//       placeholder: "Enter your city",
//     },
//     {
//       key: "state",
//       label: "State",
//       type: "text",
//       placeholder: "Enter your state",
//     },
//   ];

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
//         <form onSubmit={handleSubmit} className="p-6 sm:p-8" noValidate>
//           <div className="text-center mb-6">
//             <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
//               Additional Information Required
//             </h2>
//             <p className="text-sm text-gray-600 dark:text-gray-400">
//               Please complete your profile to continue using the app
//             </p>
//           </div>

//           <div className="space-y-4">
//             {formFields.map(({ key, label, type, placeholder }) => (
//               <div key={key}>
//                 <label
//                   htmlFor={key}
//                   className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
//                 >
//                   {label}{" "}
//                   {["fullName", "email", "number", "age"].includes(key) && (
//                     <span className="text-red-500">*</span>
//                   )}
//                 </label>
//                 <input
//                   id={key}
//                   name={key}
//                   type={type}
//                   value={formData[key as keyof FormData]}
//                   onChange={handleChange}
//                   placeholder={placeholder}
//                   disabled={isSubmitting}
//                   className={`w-full p-3 rounded-lg border ${
//                     errors[key as keyof FormData]
//                       ? "border-red-500 focus:ring-red-500"
//                       : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
//                   } bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
//                   required={["fullName", "email", "number", "age"].includes(
//                     key
//                   )}
//                 />
//                 {errors[key as keyof FormData] && (
//                   <p className="mt-1 text-sm text-red-600 dark:text-red-400">
//                     {errors[key as keyof FormData]}
//                   </p>
//                 )}
//               </div>
//             ))}

//             <div>
//               <label
//                 htmlFor="gender"
//                 className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
//               >
//                 Gender <span className="text-red-500">*</span>
//               </label>
//               <select
//                 id="gender"
//                 name="gender"
//                 value={formData.gender}
//                 onChange={handleChange}
//                 disabled={isSubmitting}
//                 className={`w-full p-3 rounded-lg border ${
//                   errors.gender
//                     ? "border-red-500 focus:ring-red-500"
//                     : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
//                 } bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
//                 required
//               >
//                 <option value="">Select gender</option>
//                 <option value="male">Male</option>
//                 <option value="female">Female</option>
//                 <option value="other">Other</option>
//                 <option value="prefer-not-to-say">Prefer not to say</option>
//               </select>
//               {errors.gender && (
//                 <p className="mt-1 text-sm text-red-600 dark:text-red-400">
//                   {errors.gender}
//                 </p>
//               )}
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-3 rounded-lg font-semibold transition-colors duration-200 disabled:cursor-not-allowed flex items-center justify-center"
//           >
//             {isSubmitting ? (
//               <>
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                 Submitting...
//               </>
//             ) : (
//               "Complete Profile & Continue"
//             )}
//           </button>

//           <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
//             Complete your profile to enjoy unlimited access to the app.
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }
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
  LOGIN_TIME: "loginTime",
} as const;

const TIMING = {
  FREE_USAGE_DELAY: 3 * 60 * 1000,
  FORM_SHOW_DELAY: 5 * 60 * 1000,
  CHECK_INTERVAL: 5 * 1000,
} as const;

// -------------------- Utility Functions --------------------
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, value);
    } catch {}
  },
  removeItem: (key: string): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key);
    } catch {}
  },
};

// -------------------- SessionGuard Component --------------------
export default function SessionGuard({ children }: SessionGuardProps) {
  const { data: session, status } = useSession();
  const [showForm, setShowForm] = useState(false);
  const [forceLogin, setForceLogin] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const formSubmitted = useMemo(() => {
    if (typeof window === "undefined") return false;
    return safeLocalStorage.getItem(STORAGE_KEYS.FORM_SUBMITTED) === "true";
  }, [showForm]);

  useEffect(() => {
    const entryTime = safeLocalStorage.getItem(STORAGE_KEYS.ENTRY_TIME);
    if (!entryTime) {
      safeLocalStorage.setItem(STORAGE_KEYS.ENTRY_TIME, Date.now().toString());
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (session && status === "authenticated") {
      const loginTime = safeLocalStorage.getItem(STORAGE_KEYS.LOGIN_TIME);
      if (!loginTime) {
        safeLocalStorage.setItem(
          STORAGE_KEYS.LOGIN_TIME,
          Date.now().toString()
        );
      }
    }
  }, [session, status]);

  const handleFormSubmit = useCallback(() => {
    safeLocalStorage.setItem(STORAGE_KEYS.FORM_SUBMITTED, "true");
    setShowForm(false);
    window.location.reload();
  }, []);

  const handleForceLogin = useCallback(async () => {
    try {
      setForceLogin(true);
      await signIn("google", {
        callbackUrl: window.location.href,
        redirect: true,
        prompt: "select_account",
        login_hint: "", // Clears hint
        hd: "", // Prevents domain-restricted login
      });
    } catch {
      setForceLogin(false);
    }
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    const interval = setInterval(() => {
      const storedEntryTime = safeLocalStorage.getItem(STORAGE_KEYS.ENTRY_TIME);
      const storedLoginTime = safeLocalStorage.getItem(STORAGE_KEYS.LOGIN_TIME);
      const formSubmittedLocal =
        safeLocalStorage.getItem(STORAGE_KEYS.FORM_SUBMITTED) === "true";

      if (!storedEntryTime) return;

      const entryElapsed = Date.now() - parseInt(storedEntryTime, 10);

      if (
        entryElapsed > TIMING.FREE_USAGE_DELAY &&
        !session &&
        status !== "loading"
      ) {
        clearInterval(interval);
        handleForceLogin();
        return;
      }

      if (session && storedLoginTime && !formSubmittedLocal) {
        const loginElapsed = Date.now() - parseInt(storedLoginTime, 10);

        if (loginElapsed > TIMING.FORM_SHOW_DELAY && !showForm) {
          setShowForm(true);
        }
      }
    }, TIMING.CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [isInitialized, session, status, showForm, handleForceLogin]);

  if (!isInitialized) {
    return <>{children}</>;
  }

  if (session && !formSubmitted && showForm) {
    return <UserDetailForm onSubmit={handleFormSubmit} />;
  }

  if (forceLogin) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-900 rounded-lg p-8 text-center max-w-md mx-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Free Trial Ended
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Your 3-minute free trial has ended.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Redirecting to Google login to continue...
          </p>
        </div>
      </div>
    );
  }

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
        const timeoutId = setTimeout(() => controller.abort(), 10000);

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

        alert(
          "Details saved successfully! You can now continue using the app without any restrictions."
        );
        onSubmit();
      } catch (error) {
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
              Additional Information Required
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Please complete your profile to continue using the app
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
              "Complete Profile & Continue"
            )}
          </button>

          <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
            Complete your profile to enjoy unlimited access to the app.
          </p>
        </form>
      </div>
    </div>
  );
}
