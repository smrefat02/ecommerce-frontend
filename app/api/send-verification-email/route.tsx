import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, verificationCode, userName } = await request.json()

    // Validate required fields
    if (!email || !verificationCode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // The verification code is stored in localStorage on the client side
    console.log(`[v0] Verification code for ${email}: ${verificationCode}`)

    return NextResponse.json({
      success: true,
      message: "Verification code generated. Check your email or use the code shown on the verification page.",
      testMode: true,
    })
  } catch (error) {
    console.error("[v0] Error in verification endpoint:", error)
    return NextResponse.json({ error: "An error occurred. Please try again." }, { status: 500 })
  }
}
