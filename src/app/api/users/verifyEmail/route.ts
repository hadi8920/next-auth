import { connect } from "@/dbConfig/dbconfig";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";


connect();

export async function POST(req : NextRequest){
    try {
        const reqBody = await req.json()
    } catch (error:any) {
        return NextResponse.json({error:error.message},{status:500})
    }
}