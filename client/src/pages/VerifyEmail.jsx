import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FiArrowRight, FiCheckCircle, FiMail, FiXCircle } from "react-icons/fi";

import { resendVerificationEmail, verifyEmail } from "../services/authApi";

import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";

import { loginShowcaseData } from "../data/authData";

import "../styles/auth/common/auth-layout.css";
import "../styles/auth/common/auth-showcase.css";
import "../styles/auth/common/auth-form.css";
import "../styles/auth/login.css";
import "../styles/auth/common/auth-responsive.css";

const VerifyEmail = () => {
  const { token } = useParams();

  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [message, setMessage] = useState("");

  const [resendEmail, setResendEmail] = useState("");
  const [isResending, setIsResending] = useState(false);

  // React StrictMode (dev mode) har effect ko do baar chalata hai. Yeh
  // token ek hi baar use ho sakta hai (backend use hote hi clear kar
  // deta hai), isliye bina is guard ke: pehli call se email verify ho
  // jaata (success), aur turant dusri call (StrictMode se) usi ab-invalid
  // token ko dobara try karti aur "invalid/expired" error deti — jo UI
  // par final state ban jaata, chahe verification genuinely ho chuki ho.
  const hasVerifiedRef = useRef(false);

  useEffect(() => {
    const runVerification = async () => {
      try {
        const data = await verifyEmail(token);

        setStatus("success");
        setMessage(data?.message || "Email verified successfully.");
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "This verification link is invalid or has expired.",
        );
      }
    };

    if (!token) {
      setStatus("error");
      setMessage("Missing verification token.");
      return;
    }

    if (!hasVerifiedRef.current) {
      hasVerifiedRef.current = true;
      runVerification();
    }
  }, [token]);

  const handleResend = async (event) => {
    event.preventDefault();

    if (!resendEmail.trim() || !/\S+@\S+\.\S+/.test(resendEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setIsResending(true);

      const data = await resendVerificationEmail(
        resendEmail.trim().toLowerCase(),
      );

      toast.success(data?.message || "Verification email sent.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Couldn't resend verification email.",
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout showcase={loginShowcaseData}>
      <div className="auth-form-heading">
        <span className="auth-form-label">Email verification</span>

        <h2>
          {status === "verifying" && "Verifying your email..."}
          {status === "success" && "Email verified!"}
          {status === "error" && "Verification failed"}
        </h2>
      </div>

      {status === "success" && (
        <>
          <p className="auth-info-banner">
            <FiCheckCircle style={{ verticalAlign: "middle", marginRight: 6 }} />
            {message}
          </p>

          <Link to="/login" className="auth-submit-button" style={{ textDecoration: "none" }}>
            Go to login
            <FiArrowRight />
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <p className="auth-error-message">
            <FiXCircle style={{ verticalAlign: "middle", marginRight: 6 }} />
            {message}
          </p>

          <form className="auth-form" onSubmit={handleResend} noValidate>
            <AuthInput
              name="resendEmail"
              label="Resend verification link"
              type="email"
              value={resendEmail}
              placeholder="you@example.com"
              icon={FiMail}
              disabled={isResending}
              onChange={(event) => setResendEmail(event.target.value)}
            />

            <button
              type="submit"
              className="auth-submit-button"
              disabled={isResending}
            >
              {isResending ? "Sending..." : "Resend verification email"}
            </button>
          </form>
        </>
      )}

      <p className="auth-switch-text">
        <Link to="/login">Back to login</Link>
      </p>
    </AuthLayout>
  );
};

export default VerifyEmail;