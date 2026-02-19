// // src/app/api/progress/route.ts

// import { NextResponse } from "next/server";
// import { connectDB } from "@/config/db";
// import Progress from "@/models/Progress";
// import Plan from "@/models/Plan";
// import { toggleProgress } from "@/controllers/progress.controller";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

// export async function GET(req: Request) {
//   try {
//     await connectDB();

//     const session = await getServerSession(authOptions);
//     if (!session?.user?.id) {
//       return NextResponse.json(
//         { success: false, error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const { searchParams } = new URL(req.url);
//     const planId = searchParams.get("planId");

//     if (!planId) {
//       return NextResponse.json(
//         { success: false, error: "planId required" },
//         { status: 400 }
//       );
//     }

//     // 🔐 Verify ownership
//     const plan = await Plan.findById(planId);
//     if (!plan || plan.userId.toString() !== session.user.id) {
//       return NextResponse.json(
//         { success: false, error: "Forbidden" },
//         { status: 403 }
//       );
//     }

//     const progress = await Progress.find({ planId }).lean();

//     return NextResponse.json(
//       { success: true, data: progress },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 400 }
//     );
//   }
// }

// export async function POST(req: Request) {
//   try {
//     await connectDB();

//     const result = await toggleProgress(req);

//     return NextResponse.json(
//       { success: true, data: result },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 400 }
//     );
//   }
// }







// src/app/api/progress/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import { toggleProgress } from "@/controllers/progress.controller";

export async function POST(req: Request) {
  try {
    await connectDB();

    const result = await toggleProgress(req);

    return NextResponse.json(
      { success: true, data: result },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}