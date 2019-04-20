class Gameboard{
    constructor( sourceResources, sourceBuildings, sourceTokens ){
        this.sourceResources = sourceResources;
        this.sourceBuildings = sourceBuildings;
        this.sourceTokens = sourceTokens;
        this.buildings = {
            building1: null,
            building2: null,
            building3: null
        };
        this.checkRequirements = this.checkRequirements.bind(this);
        this.clickedBuildingCards = this.clickedBuildingCards.bind(this);
        this.shuffle( this.sourceBuildings );
        this.dealBuildingCards();
        this.addBuildingsToDom();
    }

    shuffle( thingToShuffle ){
        for( var cardI = thingToShuffle.length-1; cardI>0; cardI--){
            var randomIndex = Math.floor(Math.random() * cardI);
            var temp = thingToShuffle[randomIndex];
            thingToShuffle[randomIndex] = thingToShuffle[cardI];
            thingToShuffle[cardI] = temp;
        }
    }

    dealBuildingCards(){
        this.buildings.building1 = this.sourceBuildings.pop();
        this.buildings.building2 = this.sourceBuildings.pop();
        this.buildings.building3 = this.sourceBuildings.pop();
    }

    addBuildingsToDom(){
        for (var building in this.buildings) {
            var resources = '';
            var req = this.buildings[building].requirements;
            for (var x in req){
                resources = req[x] + ' ' + x + ", " + resources;
                resources = resources.slice(0,-1);
            }
            var pointVal = $('<div>').text('Points: ' + this.buildings[building].points);
            var requirements = $('<div>').text('Requires: ' + resources);
            var newDiv = $('<div>')
            .addClass('babyDiv')
            .css({'height': '100%'})
            .append( pointVal, requirements);
            $('.'+building).append(newDiv);
        }
    }

    checkRequirements( player , building ){
        if (this.buildings[building] === null) {
            return;
        }
        var subtractAmounts = {

        }
        var foodCount = 0;
        var currentFoodCount = 0;
        var buildingReq = this.buildings[building].requirements;
        var foodAvailable = player.getStorage().food
        for( var resource in buildingReq){
            if(player.getStorage()[resource] < buildingReq[resource]){
                if(player.getStorage()[resource]+foodAvailable < buildingReq[resource]){
                    console.error(`player needed ${buildingReq[resource]}${resource} but only had ${player.getStorage()[resource]}`)
                    return false;                    
                }

                subtractAmounts[resource] = player.getStorage()[resource];
                var foodNeeded = buildingReq[resource] - player.getStorage()[resource]
                console.warn(`player only had ${player.getStorage()[resource]} but needed ${buildingReq[resource]}${resource}, taking ${foodNeeded} food as well`)
                foodAvailable-= foodNeeded;
            } else {
                subtractAmounts[resource] = buildingReq[resource];
            }
            
        }
        subtractAmounts.food = foodAvailable
        for( var resource in subtractAmounts){
            player.updateStats(resource, buildingReq[resource], 0)
        }
        return true;
        // for (var key in buildingReq){
        //     if (buildingReq[key] > player.storage[key] + player.storage.food){
        //         return false;
        //     } else if (player.storage.food){
        //         if (buildingReq[key] > player.storage.food){
        //             buildingReq.food = buildingReq[key] - player.storage.food;
        //             foodCount = buildingReq[key] - player.storage.food;
        //             player.storage.food -= buildingReq[key] - player.storage.food || 1;
        //             buildingReq[key] -= foodCount|| 1;
        //         } else if (buildingReq[key] === player.storage[key]){
        //             // necessary to exit out of conditional
        //         } else {
        //             buildingReq.food = buildingReq[key] + currentFoodCount;
        //             currentFoodCount = buildingReq[key];
        //             foodCount += buildingReq[key] || 1;
        //             buildingReq[key] -= buildingReq[key];
        //         }
        //         player.storage.food -= foodCount;
        //         foodCount = 0;
        //     }
        // }
        // player.storage.food = foodCount;
        // return this.buildings[building];
    }

    resetBuildingCards(){
        for (var key in this.buildings){
            if (this.buildings[key] === null){
                this.buildings[key] = this.sourceBuildings.pop();
                var resources = '';
                var req = this.buildings[key].requirements;
                for (var x in req){
                    resources = req[x] + ' ' + x + ", " + resources;
                    resources = resources.slice(0,-1);
                }
                var pointVal = $('<div>').text('Points: ' + this.buildings[key].points);
                var requirements = $('<div>').text('Requires: ' + resources);
                var newDiv = $('<div>')
                .addClass('babyDiv')
                .css({'height': '100%'})
                .append( pointVal, requirements);
                $('.'+key).append(newDiv);
            }
        }
    }

    clickedBuildingCards( building ){
        this.buildings[building] = null;
    }

    addBlankBuildingsToDom(){
        console.log(buildingClicked)
        for (var building in this.buildings){
            var resources = '';
            var req = this.buildings[building].requirements;
            for (var x in req){
                resources = req[x] + ' ' + x + ", " + resources;
                resources = resources.slice(0,-1);
            }
            var pointVal = $('<div>').text('Points: ' + this.buildings[building].points);
            var requirements = $('<div>').text('Requires: ' + resources);
            var newDiv = $('<div>')
            .addClass('babyDiv')
            .css({'height': '100%'})
            .append( pointVal, requirements);
            $('.'+building).append(newDiv);
        }
    }




}