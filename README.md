# SharkScope API

Retrieve information about online poker tournaments with ease.
Notes:
* You are limited to 5 queries a day, unless you get a paid subscription from sharkscope.com.
* This is an inofficial package and is not affiliated with sharkscope.com
* The API is not complete, but only contains endpoints I need the most. Pull requests are welcome.

## Quickstart

Install the package:
```
npm install sharkscope
```
Code:
```js
var SharkScope = require('sharkscope');
var sharkscope = new SharkScope('api_name', 'api_key', 'username', 'password'); // hash will be generated for you

sharkscope.tournament(['1512777529', '1512777510', '1498468319'])
.then(tournaments => {
	console.log(tournaments);
	/*
		{ CompletedTournament:
		   { '@duration': '35228',
		     '@date': '1458431228',
		     '@tickets': '0',
		     '@currency': 'USD',
		     '@flags': 'B',
		     '@game': 'H',
		     '@gameClass': 'scheduled',
		     '@id': '1498468319',
		     '@guarantee': '85000.0',
		     '@name': '$27 Saturday Eliminator [Progressive Super-Knockout], $85K Gtd',
		     '@network': 'PokerStars',
		     '@rake': '2.45',
		     '@stake': '24.55',
		     '@state': 'Completed',
		     '@structure': 'NL',
		     '@totalEntrants': '4026' },
		  ActiveTournament:
		   [ { '@currentEntrants': '0',
		       '@lastUpdateTime': '1458990907',
		       '@scheduledStartDate': '1458990900',
		       '@currency': 'USD',
		       '@flags': 'B,T,SO,HU',
		       '@game': 'H',
		       '@gameClass': 'scheduled',
		       '@id': '1512777529',
		       '@guarantee': '1000.0',
		       '@name': '$10.50 NL Hold\'em [Heads-Up, Turbo, Super-Knockout], $1K Gtd',
		       '@network': 'PokerStars',
		       '@rake': '0.5',
		       '@stake': '10.0',
		       '@state': 'Running',
		       '@structure': 'NL',
		       '@totalEntrants': '128' },
		     { '@currentEntrants': '0',
		       '@lastUpdateTime': '1458992041',
		       '@scheduledStartDate': '1458990000',
		       '@currency': 'USD',
		       '@game': 'H',
		       '@gameClass': 'scheduled',
		       '@id': '1512777510',
		       '@guarantee': '3500.0',
		       '@lateRegEndDate': '1458993600',
		       '@name': '$11 NL Hold\'em, $3.5K Gtd',
		       '@network': 'PokerStars',
		       '@overlay': '420.0',
		       '@rake': '1.0',
		       '@stake': '10.0',
		       '@state': 'Late Registration',
		       '@structure': 'NL',
		       '@totalEntrants': '308' } ] }
	*/
})
.catch(err => {
	console.log('Could not fetch:', err);
});
```

## API

### SharkScope(api_name, api_key, username, password [, user_agent]);
Creates a new instance of the SharkScope API.

### .tournament({string|array} tournament_ids [, network]);
Returns a promise containing one or more tournaments from a specific network (default is 'pokerstars' for all resources).
Cost = 1 search per 100 tournaments.
See section 3.5.4 in the API docs for more info.

### .player(username [, network]);
Returns a promise containing player info for a specific network.
Cost = 1 search per player.
See section 3.3.1 in the API docs for more info.

### .schedule([network] [, limit]);
Returns a promise containing tournaments that are open for late registration or scheduled to start in the future.
The default for the limit parameter is 50, but in my experiments I have found that it doesn't accomplish anything and returns all tournaments no matter what the specified limit is.
Cost = 1 search per request.
See section 3.5.2 in the API docs for more info.

## .userInfo
Returns an object containing the information of the currently logged in user, including the remaining searches.
This object will be null until the first request has been sent and will be updated on each request.

### Tips for developing with the SharkScope API

* Look at the info page to find the documentation: http://www.sharkscope.com/#SharkScope-API.html
* Choose the 'Existing subscribers' plan, not the 'bulk buy' one, unless you want to create many seperate Sharkscope accounts and sell them.
* Pay attention to the JSON response format: if it's a single entity, it will be just an object, if there are multiple entities, it will be an array of objects. Because sometimes it's hard to predict how many items will be returned, you should convert lone objects to arrays.
* 