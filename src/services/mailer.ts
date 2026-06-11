import User from "@/models/user.model";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === "VERIFIFY") {
      await User.findByIdAndUpdate(userId, {
        forgetPasswordToken: hashedToken,
        forgetPasswordTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    }

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "c9ed6936be6a52",
        pass: "2c596ef1b6731a",
      },
    });

    const mailOptions = {
      from: "muhammadhadidotty8920@gmail.com", // sender address
      to: email, // list of recipients
      subject:
        emailType === "VERIFY" ? "verify your email" : "reset your password", // subject line
      html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`, // HTML body
    };

    const mailResponse = await transporter.sendMail(mailOptions);

    return mailResponse;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error:any) {
    throw new Error(error.message);
  }
};
