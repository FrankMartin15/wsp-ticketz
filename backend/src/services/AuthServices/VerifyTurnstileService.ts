import axios from "axios";
import AppError from "../../errors/AppError";

interface TurnstileVerifyRequest {
  token: string;
  remoteip?: string;
}

interface TurnstileResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
  action?: string;
  cdata?: string;
}

const VerifyTurnstileService = async ({
  token,
  remoteip
}: TurnstileVerifyRequest): Promise<boolean> => {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    console.warn("TURNSTILE_SECRET_KEY not configured, skipping verification");
    return true;
  }

  if (!token) {
    throw new AppError("ERR_TURNSTILE_TOKEN_REQUIRED", 400);
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);
    if (remoteip) {
      formData.append("remoteip", remoteip);
    }

    const response = await axios.post<TurnstileResponse>(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    const { success, "error-codes": errorCodes } = response.data;

    if (!success) {
      console.error("Turnstile verification failed:", errorCodes);
      throw new AppError("ERR_TURNSTILE_VERIFICATION_FAILED", 400);
    }

    return true;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    
    console.error("Error verifying Turnstile token:", error);
    throw new AppError("ERR_TURNSTILE_VERIFICATION_ERROR", 500);
  }
};

export default VerifyTurnstileService;
