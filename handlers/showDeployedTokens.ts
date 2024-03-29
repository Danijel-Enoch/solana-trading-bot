import { InlineKeyboard } from "grammy";
import { setSessions } from ".";
import { MyContext } from "../bot";
import { getUserDeployedTokens } from "../models";
import { getWalletAddress } from "../web3";
import { trimAddress } from "../utils";
import { TokenDeployedGraph } from "../types";
import { myState } from "../utils";
import { renderFromTo } from "./renderFromTo.handler";

export async function showDeployedTokenHandler(ctx: MyContext) {
	await setSessions(ctx);

	//console.log("jjj", ctx.session.privateKey.toString());
	const pubKey = (await getWalletAddress(ctx.session.privateKey!)).toString();
	let data: TokenDeployedGraph[] = await getUserDeployedTokens(pubKey);
	const depTokensMenu = new InlineKeyboard();
	if (data && data.length > 0) {
		// if (data.length > 3) {
		// 	await renderFromTo(ctx, 0, 2, data)
		// } else {
		await renderFromTo(ctx, 0, data.length, data);
		//}
	} else {
		ctx.reply(
			"Error Occured While Fetching Tokens or Not token Deployed yet"
		);
	}

	//	console.log({ data });
}
