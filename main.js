$(document).ready(startApp);

var game;
var resources = {
    clay: {
        count: 9,
        maxCount: 9,
        playerLimit: 2,
        awardForFirst: 2,
        currentPlayers: []
    },
    wood: {
        count: 9,
        maxCount: 9,
        playerLimit: 2,
        awardForFirst: 2,
        currentPlayers: []
    },
    stone: {
        count: 9,
        maxCount: 9,
        playerLimit: 2,
        awardForFirst: 2,
        currentPlayers: []
    },
    food: {
        count: 9,
        maxCount: 9,
        playerLimit: 2,
        awardForFirst: 1,
        currentPlayers: []
    }
};

var buildings = [
{
    name: 'farm',
    points: 100,
    requirements:{
        wood: 1,
        clay: 2
    },
},
{
    name: 'barn',
    points: 100,
    requirements: {
        wood: 1,
        clay: 2
    }
},
{
    name: 'wheelbarrow',
    points: 100,
    requirements:{
        wood: 1,
        clay: 2
    },
},
{
    name: 'windmill',
    points: 100,
    requirements: {
        wood: 1,
        clay: 2
    }
},
{
    name: 'windmill',
    points: 100,
    requirements: {
        wood: 1,
        clay: 2
    }
},
{
    name: 'windmill',
    points: 100,
    requirements: {
        wood: 1,
        clay: 2
    }
},
{
    name: 'windmill',
    points: 100,
    requirements: {
        wood: 1,
        clay: 2
    }
},
{
    name: 'windmill',
    points: 100,
    requirements: {
        wood: 1,
        clay: 2
    }
}
];

var tokens = [1,2,3,4,5,6];


function startApp(){
    game = new Game( resources, buildings, tokens);
    game.addPlayer('blue');
    // game.startGame();
}