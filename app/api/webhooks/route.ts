import type { NextRequest } from "next/server";

async function verifyWebhookSignature(request: NextRequest): Promise<unknown> {
	const secret = process.env.WHOP_WEBHOOK_SECRET;
	if (!secret) throw new Error("WHOP_WEBHOOK_SECRET not set");

	const signature = request.headers.get("x-whop-signature");
	if (!signature) throw new Error("Missing x-whop-signature header");

	const body = await request.text();
	const key = await crypto.subtle.importKey(
		"raw",
		new TextEncoder().encode(secret),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["verify"],
	);
	const sig = Uint8Array.from(
		signature.replace(/^sha256=/, "").match(/.{2}/g)!.map((b) => parseInt(b, 16)),
	);
	const valid = await crypto.subtle.verify("HMAC", key, sig, new TextEncoder().encode(body));
	if (!valid) throw new Error("Invalid webhook signature");

	return JSON.parse(body);
}

export async function POST(request: NextRequest): Promise<Response> {
	let webhookData: any;
	try {
		webhookData = await verifyWebhookSignature(request);
	} catch {
		return new Response("Unauthorized", { status: 401 });
	}

	// Handle the webhook event
	if (webhookData.action === "payment.succeeded") {
		const { id, final_amount, amount_after_fees, currency, user_id } = webhookData.data;

		// final_amount is the amount the user paid
		// amount_after_fees is the amount received after card fees
		console.log(
			`Payment ${id} succeeded for ${user_id} with amount ${final_amount} ${currency}`,
		);

		// if you need to do work that takes a long time, run it in the background
		potentiallyLongRunningHandler(user_id, final_amount, currency, amount_after_fees).catch(
			console.error,
		);
	}

	// Make sure to return a 2xx status code quickly. Otherwise the webhook will be retried.
	return new Response("OK", { status: 200 });
}

async function potentiallyLongRunningHandler(
	_user_id: string | null | undefined,
	_amount: number,
	_currency: string,
	_amount_after_fees: number | null | undefined,
) {
	// This is a placeholder for a potentially long running operation
	// In a real scenario, you might need to fetch user data, update a database, etc.
}
