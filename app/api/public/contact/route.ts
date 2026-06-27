import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, destination, message } = await req.json();

    if (!name || !message) {
      return NextResponse.json({ error: "Name and message are required" }, { status: 400 });
    }

    // Save as a lead in the database
    await prisma.lead.create({
      data: {
        name,
        email: email || null,
        phone: phone || "N/A",
        city: destination || null,
        message: message || null,
        source: "WEBSITE_FORM",
        status: "NEW",
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[contact-api]", error);
    return NextResponse.json({ error: "Failed to save contact" }, { status: 500 });
  }
}
