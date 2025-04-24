"use client"
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserEditSchema, type UserEditValues } from "@/lib/schemas/user";
import { editUser } from "@/actions/user";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { UserRole } from "@prisma/client";
import { AvatarInput } from "./avatar-input";
import { Progress } from "@/components/ui/progress";
import { Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";

interface UserEditFormProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    image?: string | null;
  };
  isAdmin: boolean;
}

export function UserEditForm({ user, isAdmin }: UserEditFormProps) {
  const router = useRouter();
  const { refreshUserData, updateAvatar } = useUser();
  const [isPending, setIsPending] = useState(false);
  const [formChanged, setFormChanged] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [lastSubmitTime, setLastSubmitTime] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const cancelButtonRef = useRef<HTMLButtonElement | null>(null);
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);

  // Memoize default values to prevent recreation on each render
  const defaultValues = useMemo(() => ({
    name: user?.name ?? "",
    email: user?.email ?? "",
    password: "",
    role: user?.role ?? UserRole.USER,
    image: null,
  }), [user?.name, user?.email, user?.role]);

  const form = useForm<UserEditValues>({
    resolver: zodResolver(UserEditSchema),
    defaultValues,
    mode: "onChange", // Validate on change for better UX
  });

  // Detect if form has been changed to optimize performance
  useEffect(() => {
    const subscription = form.watch(() => {
      setFormChanged(true);
    });
    
    // Cleanup subscription to prevent memory leaks
    return () => subscription.unsubscribe();
  }, [form]);

  // Function to check password strength
  const checkPasswordStrength = (password: string): number => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 25;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 25; // Uppercase
    if (/[a-z]/.test(password)) strength += 25; // Lowercase
    if (/[0-9]/.test(password)) strength += 15; // Numbers
    if (/[^A-Za-z0-9]/.test(password)) strength += 10; // Special chars
    
    return Math.min(100, strength);
  };

  // Password strength effect
  useEffect(() => {
    const password = form.watch("password");
    if (password) {
      setPasswordStrength(checkPasswordStrength(password));
    } else {
      setPasswordStrength(0);
    }
  }, [form.watch("password")]);

  // Rate limiting function
  const checkRateLimit = () => {
    const now = Date.now();
    const minInterval = 2000; // 2 seconds between submissions
    
    if (lastSubmitTime && (now - lastSubmitTime < minInterval)) {
      toast.error("Please wait before submitting again");
      return false;
    }
    
    setLastSubmitTime(now);
    return true;
  };

  // Analytics tracking is simpler and free of TypeScript errors
  const trackFormSubmission = () => {
    try {
      // Implementation depends on your analytics provider
      // This is a placeholder that doesn't trigger TypeScript errors
      if (typeof window !== 'undefined') {
        console.log('Form submission tracked');
        // If using a specific analytics service, implement here
      }
    } catch (error) {
      // Silent fail
    }
  };

  // Handle form submission
  function onSubmit(values: UserEditValues) {
    if (!formChanged) {
      toast.info("No changes detected");
      return;
    }

    if (!checkRateLimit()) {
      return;
    }

    // Clear any previous errors
    setFormError(null);
    setIsPending(true);
    trackFormSubmission();
    
    if (!user?.id) {
      toast.error("User ID is required");
      setIsPending(false);
      return;
    }

    // Create new abort controller for this submission
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      // Sanitize inputs before submission
      const sanitizedValues = {
        name: typeof values.name === 'string' ? values.name.trim() : '',
        email: typeof values.email === 'string' ? values.email.trim().toLowerCase() : '',
        password: values.password || '',
        role: values.role,
        image: values.image,
      };

      const formData = new FormData();
      
      // Always include these fields regardless of emptiness
      formData.append("name", sanitizedValues.name);
      formData.append("email", sanitizedValues.email);
      
      if (sanitizedValues.role && Object.values(UserRole).includes(sanitizedValues.role)) {
        formData.append("role", sanitizedValues.role);
      }
      
      if (sanitizedValues.password && sanitizedValues.password.trim()) {
        // Only include password if strength is sufficient
        if (passwordStrength >= 50) {
          formData.append("password", sanitizedValues.password);
        } else {
          toast.error("Password is not strong enough");
          setIsPending(false);
          return;
        }
      } else {
        // Explicitly send empty string for password when not provided
        formData.append("password", "");
      }
      
      if (sanitizedValues.image instanceof File) {
        // Validate file size and type
        if (sanitizedValues.image.size > 1 * 1024 * 1024) { // 1MB limit
          toast.error("Image is too large (max 1MB)");
          setIsPending(false);
          return;
        }
        
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(sanitizedValues.image.type)) {
          toast.error("Invalid image format (JPEG, PNG or WebP only)");
          setIsPending(false);
          return;
        }
        
        formData.append("image", sanitizedValues.image);
      }

      // Log the form data for debugging
      console.log("Submitting form with data:", {
        name: formData.get("name"),
        email: formData.get("email"),
        role: formData.get("role"),
        hasPassword: !!formData.get("password"),
        hasImage: !!formData.get("image"),
      });

      // Use a Promise approach instead of async/await
      editUser(user.id, formData, isAdmin)
        .then(response => {
          if (response?.error) {
            setFormError(response.error);
            toast.error(response.error);
            return;
          }

          // Update the UI directly for immediate feedback
          if (response.user && response.user.image) {
            // Update the avatar image locally to avoid session refresh
            updateAvatar(response.user.image);
          }

          toast.success(response?.success ?? "Changes saved successfully");
          setFormChanged(false);
          
          // Refresh session data in the background for other data updates
          refreshUserData();
          
          // Refresh the page to show updated data
          router.refresh();
        })
        .catch(error => {
          if (error?.name === 'AbortError') {
            // Submission was aborted, do nothing
            return;
          }
          
          console.error("[FORM_SUBMIT_ERROR]", error);
          const errorMessage = error?.message || "Something went wrong!";
          setFormError(errorMessage);
          toast.error(errorMessage);
        })
        .finally(() => {
          setIsPending(false);
          abortControllerRef.current = null;
        });
    } catch (error) {
      console.error("[FORM_PROCESSING_ERROR]", error);
      toast.error("Error processing form data");
      setIsPending(false);
    }
  }

  // Get field value safely
  const getFieldValue = (fieldName: keyof UserEditValues) => {
    return form.getValues(fieldName) ?? defaultValues[fieldName];
  };

  // Abort form submission if component unmounts during submission
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Focus first field on mount
  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  // Handle keyboard navigation 
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Escape key resets the form
    if (e.key === 'Escape' && formChanged && !isPending) {
      e.preventDefault();
      form.reset(defaultValues);
      setFormChanged(false);
      toast.info("Changes discarded");
    }
    
    // Save on Ctrl+S / Cmd+S
    if ((e.ctrlKey || e.metaKey) && e.key === 's' && formChanged && !isPending) {
      e.preventDefault();
      submitButtonRef.current?.click();
    }
  };

  // Clear error when form changes
  useEffect(() => {
    if (formError && formChanged) {
      setFormError(null);
    }
  }, [formChanged, formError]);

  // Get password strength color
  const getPasswordStrengthColor = useMemo(() => {
    if (passwordStrength < 30) return "bg-destructive";
    if (passwordStrength < 70) return "bg-yellow-500";
    return "bg-green-500";
  }, [passwordStrength]);

  return (
    <Form {...form}>
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          if (!isPending && formChanged) {
            form.handleSubmit(onSubmit)(e);
          }
        }} 
        className="space-y-6"
        aria-label="Edit user profile"
        role="form"
        onKeyDown={handleKeyDown}
      >
        {formError && (
          <div 
            className="bg-destructive/10 text-destructive p-3 rounded-md text-sm" 
            role="alert" 
            aria-live="assertive"
          >
            {formError}
          </div>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="name">Name</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  id="name"
                  ref={nameInputRef}
                  value={field.value ?? ""}
                  disabled={isPending}
                  placeholder="Enter your name"
                  autoComplete="name"
                  type="text"
                  aria-required="true"
                  aria-invalid={!!form.formState.errors.name}
                  aria-describedby="name-error"
                />
              </FormControl>
              <FormMessage id="name-error" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="email">Email</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  id="email"
                  value={field.value ?? ""}
                  disabled={isPending}
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="username email"
                  aria-required="true"
                  aria-invalid={!!form.formState.errors.email}
                  aria-describedby="email-error email-description"
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  inputMode="email"
                />
              </FormControl>
              <FormDescription id="email-description" className="text-xs">
                Your email address will be used for login and notifications
              </FormDescription>
              <FormMessage id="email-error" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="password">Password</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  id="password"
                  value={field.value ?? ""}
                  disabled={isPending}
                  type="password"
                  placeholder="Enter new password (optional)"
                  autoComplete="new-password"
                  aria-describedby="password-error password-strength"
                  onChange={(e) => {
                    field.onChange(e);
                    setPasswordStrength(checkPasswordStrength(e.target.value));
                  }}
                  minLength={8}
                />
              </FormControl>
              {field.value && (
                <div id="password-strength" className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs">Password strength</span>
                    <span className="text-xs">
                      {passwordStrength < 30 ? "Weak" : 
                       passwordStrength < 70 ? "Medium" : "Strong"}
                    </span>
                  </div>
                  <Progress 
                    value={passwordStrength} 
                    className="h-1"
                  />
                  <div className={`h-1 mt-1 ${getPasswordStrengthColor} rounded-full`} style={{ width: `${passwordStrength}%` }}></div>
                  {passwordStrength < 50 && field.value && (
                    <p className="text-xs text-destructive flex items-center mt-1">
                      <Info className="h-3 w-3 mr-1" />
                      Include uppercase, lowercase, numbers, and special characters
                    </p>
                  )}
                </div>
              )}
              <FormMessage id="password-error" />
            </FormItem>
          )}
        />

        {isAdmin && (
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="role">Role</FormLabel>
                <Select
                  disabled={isPending}
                  onValueChange={field.onChange}
                  defaultValue={field.value ?? UserRole.USER}
                >
                  <FormControl>
                    <SelectTrigger 
                      id="role" 
                      aria-describedby="role-error"
                      aria-invalid={!!form.formState.errors.role}
                    >
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={UserRole.USER}>User</SelectItem>
                    <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage id="role-error" />
              </FormItem>
            )}
          />
        )}

        <AvatarInput form={form} currentImageUrl={user?.image ?? null} />

        <div className="flex justify-between items-center">
          {formChanged && (
            <p className="text-sm text-muted-foreground" aria-live="polite">
              <span aria-hidden="true">•</span> Unsaved changes
            </p>
          )}
          <div className="flex space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                form.reset(defaultValues);
                setFormChanged(false);
              }}
              disabled={isPending || !formChanged}
              className="min-w-[100px]"
              ref={cancelButtonRef}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isPending || !formChanged}
              aria-busy={isPending}
              className="min-w-[100px]"
              ref={submitButtonRef}
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm mr-2" aria-hidden="true" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          <p>
            <kbd className="px-1 py-0.5 text-xs border rounded">Esc</kbd> to cancel • 
            <kbd className="px-1 py-0.5 text-xs border rounded ml-1">Ctrl</kbd> + 
            <kbd className="px-1 py-0.5 text-xs border rounded">S</kbd> to save
          </p>
        </div>
      </form>
    </Form>
  );
} 