import { validateSession } from "../../../service/session.service";

export async function meetingLoader({ params }: any) {
  const code = params.code;

  if (!code) {
    throw new Response("Meeting code missing", { status: 400 });
  }

  try {
    const session = await validateSession(code);

    if (!session.status) {
      throw new Response(session.message, { status: 410 });
    }

    return session;
  } catch (error: any) {
    console.error("Meeting loader error:", error);

    throw new Response(error?.message || "Unable to validate meeting", { status: error?.status || 500 });
  }
}
