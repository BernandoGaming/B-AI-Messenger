"use strict";

const utils = require("../utils");
const log = require("npmlog");

module.exports = function (defaultFuncs, api, ctx) {
	return function setMessageReaction(reaction, messageID, callback, forceCustomReaction) {
		let resolveFunc = function () { };
		let rejectFunc = function () { };
		const returnPromise = new Promise(function (resolve, reject) {
			resolveFunc = resolve;
			rejectFunc = reject;
		});

		if (!callback) {
			callback = function (err, friendList) {
				if (err) {
					return rejectFunc(err);
				}
				resolveFunc(friendList);
			};
		}

		if (ctx.i_userID) {
			throw { error: "Cannot set reaction as another profile." };
		}


		const variables = {
			data: {
				client_mutation_id: ctx.clientMutationId++,
				actor_id: ctx.i_userID || ctx.userID,
				action: reaction == "" ? "REMOVE_REACTION" : "ADD_REACTION",
				message_id: messageID,
				reaction: reaction
			}
		};

		const qs = {
			doc_id: "1491398900900362",
			variables: JSON.stringify(variables),
			dpr: 1
		};

		defaultFuncs
			.postFormData(
				"https://www.facebook.com/webgraphql/mutation/",
				ctx.jar,
				{},
				qs
			)
			.then(utils.parseAndCheckLogin(ctx.jar, defaultFuncs))
			.then(function (resData) {
				if (!resData) {
					throw { error: "setReaction returned empty object." };
				}
				if (resData.error || resData.errors) {
					throw resData;
				}
				callback(null);
			})
			.catch(function (err) {
				log.error("setReaction", err);
				return callback(err);
			});

		return returnPromise;
	};
};
