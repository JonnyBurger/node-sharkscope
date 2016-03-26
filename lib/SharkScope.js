'use strict';

var md5 = require('md5');
var fetch = require('node-fetch');

class SharkScope {
	constructor(api_name, api_key, username, password, userAgent) {
		this.api_name = api_name;
		this.api_key = api_key;
		this.username = username;
		this.password = password;
		this.hash = md5(md5(password) + api_key);
		this.userAgent = userAgent || 'npm-sharkscope';
		this.userInfo = null;
	}

	domain() {
		return `http://www.sharkscope.com/api/${this.api_name}`;
	}

	headers() {
		return {
			'User-Agent': this.userAgent,
			'Accept': 'application/json',
			'Password': this.hash,
			'Username': this.username
		}
	}

	processResponse(json) {
		// Set rate limit info
		this.userInfo = json.Response.UserInfo;

		// throw error 
		if (json.Response.ErrorResponse) {
			throw json.Response.ErrorResponse.Error;
		}

		return Promise.resolve(json);
	}

	schedule(network, limit) {
		network = network || 'pokerstars';
		limit = limit || 50;

		return new Promise((resolve, reject) => {
			fetch(`${this.domain()}/networks/${network}/activeTournaments?limit=${limit}`, {
				headers: this.headers()
			})
			.then(response => response.json())
			.then(json => this.processResponse(json))
			.then(json => {
				resolve(json.Response.RegisteringTournamentsResponse.RegisteringTournaments);
			})
			.catch(reject);
		});
	}

	tournament(ids, network) {
		ids = [].concat(ids);
		network = network || 'pokerstars';

		return new Promise((resolve, reject) => {
			fetch(`${this.domain()}/networks/${network}/bareTournaments?tournamentIDs=${ids.join()}`, {
				headers: this.headers()
			})
			.then(response => response.json())
			.then(json => this.processResponse(json))
			.then(json => {
				resolve(json.Response.BareTournamentsResponse.BareTournaments);
			})
			.catch(reject);
		});
	}

	tournamentInfo(id, network) {
		network = network || 'pokerstars';

		return new Promise((resolve, reject) => {
			fetch(`${this.domain()}/networks/${network}/tournaments/${id}`, {
				headers: this.headers()
			})
			.then(response => response.json())
			.then(json => this.processResponse(json))
			.then(json => {
				resolve(json.Response.TournamentResponse);
			})
			.catch(reject);
		});
	}

	player(username, network) {
		network = network || 'pokerstars';

		return new Promise((resolve, reject) => {
			fetch(`${this.domain()}/networks/${network}/players/${username}`, {
				headers: this.headers()
			})
			.then(response => response.json())
			.then(json => this.processResponse(json))
			.then(json => {
				resolve(json.Response.PlayerResponse.PlayerView.Player);
			})
			.catch(reject);
		});
	}
}

module.exports = SharkScope;