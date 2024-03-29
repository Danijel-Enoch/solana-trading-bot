import { InlineKeyboard } from "grammy";
import { MyContext } from "../bot";
import { TokenDeployedGraph } from "../types";
import { trimAddress } from "../utils";

export async function renderFromTo(
	ctx: MyContext,
	from: number,
	to: number,
	data: TokenDeployedGraph[]
) {
	if (data.length === to + 1) {
		for (let index = from; index < to; index++) {
			const depTokensMenu = new InlineKeyboard();
			const element = data[index];
			depTokensMenu
				.text(`Token Name:${element.tokenName}`)
				.row()
				.text(`Total Supply:${element.totalSupply}`)
				.row()
				.text(
					`Contract Address: ${trimAddress(element.deployedAddress)}`
				)
				.row()
				.text(
					"Mange Token",
					`manage-token|${element.deployedAddress}!${element.tokenName}`
				)
				.row();
			await ctx.reply(`${element.tokenName} Token panel`, {
				reply_markup: depTokensMenu,
			});
		}
	} else {
		for (let index = from; index < to; index++) {
			const depTokensMenu = new InlineKeyboard();
			const element = data[index];
			depTokensMenu
				.text(` 🔠 Token Name:${element.tokenName}`)
				.row()
				.text(`💰 Total Supply:${element.totalSupply}`)
				.row()
				.text(
					`🆔 Contract Address: ${trimAddress(
						element.deployedAddress
					)}`
				)
				.row()
				.text(
					"🔨Mange Token",
					`manage-token|${element.deployedAddress}!${element.tokenName}`
				)
				.row();
			await ctx.reply(`${element.tokenName} Token panel`, {
				reply_markup: depTokensMenu,
			});
		}
		// if (data.length === to + 1) {
		// 	depTokensMenu.text("Prev Page", `prev-page-${data.length - 3}`);
		// } else if (from === 0) {
		// 	depTokensMenu.text("Next Page", `next-page-${to + 1}`);
		// } else {
		// 	depTokensMenu
		// 		.text("Prev Page", `prev-page-${from - 3}`)
		// 		.text("Next Page", `next-page-${to + 1}`);
		// }
	}
}
