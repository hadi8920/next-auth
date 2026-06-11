import { connect } from "@/dbConfig/dbconfig";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/services/mailer";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

connect();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { username, email, password } = await reqBody;
    
    
    const user = await User.findOne({ email });
    

    if (user) {
      return NextResponse.json({ error: "user exists" }, { status: 400 });
    }
    

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    

    const savedUser = await newUser.save();

    

    const sendMailResp = await sendEmail({
      email,
      emailType: "VERIFY",
      userId: savedUser._id,
    });

    
    return NextResponse.json({
      message: "User created successfully",
      success: true,
      savedUser,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    
    return NextResponse.json({ error: error.messgae }, { status: 500 });
  }
}


