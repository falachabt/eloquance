"use client";
import { useState, useEffect } from "react";
import { Modal, Input, Button, message, Form, Space, Divider } from "antd";
import { useRouter } from "next/navigation";
import { supabase, supabseAdmin } from "@/lib/supabase";
import { HomeOutlined } from "@ant-design/icons";
import Cookies from "js-cookie"; // Import js-cookie

async function checkIfEmail(email) {
  try {
    const { data: user, error: createUserError } = await supabseAdmin.auth.admin.createUser({
      email: email,
      email_confirm: true,
    });

    if (createUserError) {
      console.error("Error creating user:", createUserError);
      return;
    }

    console.log("User created:", user);

    const { data: insertData, error: insertError } = await supabseAdmin
      .from("user_emails")
      .insert([{ email: email }]);

    if (insertError) {
      console.error("Error inserting into user_emails:", insertError);
      return;
    }

    console.log("Email inserted into user_emails table:", insertData);
  } catch (err) {
    console.error("Unexpected error:", err);
  }
}

export const AuthModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
 const [emailLoading, setEmailLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const router = useRouter();

  async function sendOtp() {
    try {
      await supabase.auth.signInWithOtp({ email });
      message.success("Code d'activation envoyé à votre email.");
    } catch (error) {
      message.error(error.message || "Erreur lors de l'envoi du code d'activation.");
    }
  }

  async function sendVerificationCode(email) {
    try {
      await checkIfEmail(email);
      await sendOtp(email);
    } catch (error) {
      if (error.message?.includes("A user with this email address has already")) {
        await sendOtp(email);
      }
    }
  }

  useEffect(() => {
    const emailInCookies = Cookies.get("user_email");

    // If email is already in cookies, don't show the modal
    console.log(emailInCookies)
    if (emailInCookies) {
      setIsVisible(false);
      setEmail(emailInCookies); // Set the email from cookies for further use
    } else {
      // Check if the user is logged in initially
      const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setIsVisible(true); // Show modal if no user session
        }else{
          // console.log(session)
        }
      };
      checkUser();
    }

    // Listen for changes in authentication state
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
        const emailInCookies = Cookies.get("user_email");

      if (!session && !emailInCookies) {
        setIsVisible(true); // Show modal if user logs out
      } else {
        setIsVisible(false); // Hide modal if user logs in
      }
    });

    // Cleanup the listener on component unmount
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleEmailSubmit = async () => {
    setEmailLoading(true);

    try {
      await sendVerificationCode(email);
      message.success("OTP envoyé à votre email.");
      setIsOtpSent(true);
    } catch (error) {
      message.error(error.message || "Erreur lors de l'envoi de l'OTP.");
    } finally {
      setEmailLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    setOtpLoading(true);

    try {
      // Verify OTP
      const {  error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "magiclink",
      });

      if (verifyError) throw verifyError;

      // OTP verification success, set the email in a cookie
      Cookies.set("user_email", email, { expires: 1 / 48 }); // 30 minutes = 1/48th of a day

      message.success("Connexion réussie !");
      setIsVisible(false);
      router.push("/reservations");
    } catch (error) {
      message.error(error.message || "Erreur de vérification de l'OTP.");
    } finally {
      setOtpLoading(false);
    }
  };

  const goToHomePage = () => {
    router.push("/");
  };

  return (
    <Modal
      title={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Connectez-vous à votre compte</span>
          <Button type="link" onClick={goToHomePage}>
            <HomeOutlined style={{ fontSize: "20px" }} />
          </Button>
        </div>
      }
      visible={isVisible}
      footer={null}
      centered
      closable={false}
      bodyStyle={{ padding: "20px 30px" }}
    >
      <p style={{ textAlign: "center", fontSize: "16px", color: "#888" }}>
        Veuillez vous connecter ou créer un compte pour consulter vos anciennes réservations ou en faire une nouvelle.
      </p>

      <Divider />
      <Form layout="vertical">
        <Space direction="vertical" size="large" style={{ display: "flex" }}>
          {!isOtpSent ? (
            <>
              <Form.Item labelAlign="right" label="Adresse Email">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.email@exemple.com"
                  size="large"
                  required
                />
              </Form.Item>
              <Button
                type="primary"
                block
                onClick={handleEmailSubmit}
                loading={emailLoading}
                disabled={emailLoading} // Disable button while loading
                size="large"
                style={{ marginTop: "10px" }}
              >
                Envoyer le code OTP
              </Button>
            </>
          ) : (
            <>
              <Form.Item label="Code OTP">
                <Input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Entrer le code OTP reçu"
                  size="large"
                  required
                />
              </Form.Item>
              <Button
                type="primary"
                block
                onClick={handleOtpSubmit}
                loading={otpLoading}
                disabled={otpLoading} // Disable button while loading
                size="large"
                style={{ marginTop: "10px" }}
              >
                Vérifier et Se Connecter
              </Button>
            </>
          )}
        </Space>
      </Form>
    </Modal>
  );
};