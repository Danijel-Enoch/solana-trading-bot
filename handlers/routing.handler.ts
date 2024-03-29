import { BigNumberish, Typed, ZeroAddress } from "ethers";
import {
	equalizerRouter,
	spookyDexRouter,
	spookyDexFactory,
	BotRouter,
	equalizerBotRouter,
} from ".";
import {
	instantiateEqualizerRouter,
	instantiateSpookyFactory,
} from "../web3/instantiate";
import { buyTokenHandler } from "./buyToken.handler";
import { MyContext } from "../bot";
import { sellTokenHandler } from "./sellToken.handler";
import { Pair__factory } from "../types/contracts";
export async function sellRouting(
	Weth: string,
	tokenOut: string,
	privateKey: string,
	rpc: string,
	slippage: number,
	amountInMax: BigNumberish | Typed,
	ctx: MyContext
) {
	const eqaulizerRouterC = await instantiateEqualizerRouter(
		equalizerRouter,
		rpc,
		privateKey
	);
	const spookyFactory = await instantiateSpookyFactory(
		spookyDexFactory,
		rpc,
		privateKey
	);

	const swapPairForEqualizer = await eqaulizerRouterC.pairFor(
		Weth,
		tokenOut,
		false
	);

	//get pair on Spooky
	const swapPairForSpooky = (
		await spookyFactory.getPair(Weth, tokenOut)
	).toString();
	if (
		swapPairForEqualizer !== ZeroAddress &&
		swapPairForSpooky !== ZeroAddress
	) {
		const SpookyPair = 0;
		// await ctx.reply("Selecting Equalizer Route");
		return await sellTokenHandler(
			slippage,
			amountInMax,
			tokenOut,
			privateKey,
			spookyDexRouter,
			"SPK",
			BotRouter,
			ctx
		);
		//use eqalizer
		await ctx.reply(
			`Routing Error: Token Pair not on Spooky  \n Pls Check Again`
		);
	} else if (swapPairForEqualizer != ZeroAddress) {
		await ctx.reply(
			`Routing Error: Token Pair not on Spooky  \n Pls Check Again`
		);

		// await ctx.reply("Selecting Equalizer Route");
		// return await sellTokenHandler(
		// 	slippage,
		// 	amountInMax,
		// 	tokenOut,
		// 	privateKey,
		// 	equalizerRouter,
		// 	"EQU",
		// 	equalizerBotRouter,
		// 	ctx
		// );
		//  use equalizer
	} else if (swapPairForSpooky != ZeroAddress) {
		ctx.reply("Selecting Spooky Route");
		//use spooky
		return await sellTokenHandler(
			slippage,
			amountInMax,
			tokenOut,
			privateKey,
			spookyDexRouter,
			"SPK",
			BotRouter,
			ctx
		);
	} else {
		await ctx.reply(
			`Routing Error: Token Pair not on Spooky  or Eqaulizer \n Pls Check Again`
		);
	}
}

export async function buyRouting(
	Weth: string,
	tokenOut: string,
	privateKey: string,
	rpc: string,
	slippage: number,
	amountIn: BigNumberish | Typed,
	amountTobuy: string,
	ctx: MyContext
) {
	await ctx.reply(`Routing`);
	const eqaulizerRouter = await instantiateEqualizerRouter(
		equalizerRouter,
		rpc,
		privateKey
	);
	const spookyFactory = await instantiateSpookyFactory(
		spookyDexFactory,
		rpc,
		privateKey
	);
	//get pair on equalizer
	const swapPairForEqualizer = await eqaulizerRouter.pairFor(
		Weth,
		tokenOut,
		false
	);

	//get pair on Spooky
	const swapPairForSpooky = (
		await spookyFactory.getPair(Weth, tokenOut)
	).toString();
	//if pair is on both
	if (
		swapPairForEqualizer !== ZeroAddress &&
		swapPairForSpooky !== ZeroAddress
	) {
		return await buyTokenHandler(
			slippage,
			amountIn,
			tokenOut,
			privateKey,
			amountTobuy,
			ctx,
			spookyDexRouter,
			"SPK",
			BotRouter
		);
	} else if (swapPairForEqualizer != ZeroAddress) {
		// await ctx.reply("Selecting Equalizer Route");
		// return await buyTokenHandler(
		// 	slippage,
		// 	amountIn,
		// 	tokenOut,
		// 	privateKey,
		// 	amountTobuy,
		// 	ctx,
		// 	eqaulizerRouter,
		// 	"EQU",
		// 	equalizerBotRouter
		// );
		//  use equalizer
		await ctx.reply(
			`Routing Error: Token Pair not on Spooky  \n Pls Check Again`
		);
	} else if (swapPairForSpooky != ZeroAddress) {
		//	ctx.reply("Selecting Spooky Route");
		//use spooky
		return await buyTokenHandler(
			slippage,
			amountIn,
			tokenOut,
			privateKey,
			amountTobuy,
			ctx,
			spookyDexRouter,
			"SPK",
			BotRouter
		);
	} else {
		await ctx.reply(
			`Routing Error: Token Pair on Spooky  or Eqaulier \n Pls Check Again`
		);
	}
}
