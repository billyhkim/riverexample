class Game {
    constructor( resources, buildings, tokens) {
        this.resources = resources;
        this.buildings = buildings;
        this.tokens = tokens;
        this.gameBoard = new Gameboard(this.resources, this.buildings, this.tokens);
        this.players = [];
        this.addPlayer('blue');
        this.addPlayer('yellow');
        this.playerTurnIndex = 0;
        this.addEventListener = this.addEventListener.bind(this);
        this.checkResources = this.checkResources.bind(this);
        this.checkBuildingRequirement = this.checkBuildingRequirement.bind(this);
        this.addEventListener();
    }

    addPlayer(color){
        var playerObj = new Player(color);
        var playerDom = playerObj.render();
        this.players.push(playerObj);
        $(".playerArea").append(playerDom);
    }

    addEventListener(){
        $('.resourceContainer').click( this.checkResources );
        // $('.wood').click( this.checkResources );
        // $('.stone').click( this.checkResources );
        // $('.food').click( this.checkResources );
        $('.buildingsContainer > div').click( this.checkBuildingRequirement );
        $('.building2').click( this.checkBuildingRequirement );
        $('.building3').click( this.checkBuildingRequirement );
        $('.reset-button').click( this.gameRefresh );
    }

    checkResources(){
        var resourceName = $(event.currentTarget).attr('data-resource');
        var resource = this.resources[resourceName];
        if(resource.playerLimit === resource.currentPlayers.length){
            console.error('too many players here');
            return;
        }
        if(resource.count===0){
            console.error('there are no more ' + resourceName + ' left');
            return;
        }
        var award = 1;
        if(resource.currentPlayers.length===0){
            console.log('first player, so getting '+ resource.awardForFirst)
            award = resource.awardForFirst;
        }
        if(resource.count < award){
            console.warn(`trying to take ${award} from ${resourceName}, but there is only ${resource.count}`)
            award = resource.count;
        }
        if(this.players[this.playerTurnIndex].storageCount < award) {
            console.warn(`current player could not store ${award}, can only store ${this.players[this.playerTurnIndex].storageCount}.  Only taking ${this.players[this.playerTurnIndex].storageCount}`);
            award = this.players[this.playerTurnIndex].storageCount;
        }
        resource.currentPlayers.push(this.players[this.playerTurnIndex]);
        this.resourceClicked( resourceName , award)
        // if (resource === 'clay' && this.resources[0][resource] > 0 && this.players[this.playerTurnIndex].storageCount > 0 && this.resources[0].limit){
        //     this.resourceClicked( resource , 0);
        // } else if (resource === 'wood' && this.resources[1][resource] > 0 && this.players[this.playerTurnIndex].storageCount > 0 && this.resources[1].limit){
        //     this.resourceClicked( resource , 1 );
        // }   else if (resource === 'stone' && this.resources[2][resource] > 0 && this.players[this.playerTurnIndex].storageCount > 0 && this.resources[2].limit){
        //     this.resourceClicked( resource , 2);
        // }  else if (resource === 'food' && this.resources[3][resource] > 0 && this.players[this.playerTurnIndex].storageCount > 0 && this.resources[3].limit){
        //     this.resourceClicked( resource , 3);
        // }
    }

    resourceClicked( resourceName , count ){
        var resource = this.resources[resourceName];
        resource.count-=count;
        console.log(`taking ${count} ${resourceName}, now at ${resource.count}`);
        $('.resourceContainer[data-resource='+resourceName+'] .resourceCount').text( resource.count )
        // $(".resources").find('span.'+resource).text(this.resources[index][resource]);
        $('.resourceContainer[data-resource='+resourceName+'] .spotCount').text( resource.playerLimit - resource.currentPlayers.length )
        // $(".resources").find('span.'+resource+'limit').text(this.resources[index].limit);
        this.players[this.playerTurnIndex].updateStats(resourceName, count, -1);
        this.gotoNextPlayer();
    }

    checkBuildingRequirement(){
        var buildingClicked = $(event.currentTarget).attr('class');
        var buildingData = this.gameBoard.checkRequirements( this.players[this.playerTurnIndex], buildingClicked);
        if (buildingData && buildingClicked) {
            this.updateAll(buildingData);
            this.gameBoard.clickedBuildingCards(buildingClicked);
            this.gotoNextPlayer();
        }
    }

    updateAll( buildingData ){
        var tokenValue = this.tokens.pop();
        this.players[this.playerTurnIndex].updatePoints( buildingData.points, tokenValue);
        this.players[this.playerTurnIndex].updateBuildingWorkerAdjust( -1 );
        for (var key in buildingData.requirements) {
            this.players[this.playerTurnIndex].updatePerBuilding( key, buildingData.requirements[key]);
            this.updateBuyback(key, buildingData.requirements);
        }
        this.players[this.playerTurnIndex].addBuildingsMade( buildingData.points, tokenValue, -1 );
        $(event.currentTarget).children().fadeOut(500);
    }

    updateBuyback( resourceName, buildingData){
        var index = null;

        this.resources[resourceName].count += buildingData[resourceName];
        $('.resourceContainer[data-resource='+resourceName+'] .resourceCount').text( resource.count )
        //$(".resources").find('span.'+key).text(this.resources[index][key]);
    }
    
    gotoNextPlayer(){
        if( this.players[0].pioneers === 0 && this.players[1].pioneers === 0 && this.players[0].buildingsMade !== 2 && this.players[1].buildingsMade !== 2 ){
            this.resetTurn();
            this.resetResourceLimit();
            this.gameBoard.resetBuildingCards();
        } else if( this.players[this.playerTurnIndex].buildingsMade === 2  ){
            var message = '';
            this.gameWin();
            return;
        }
        this.playerTurnIndex++;

        if(this.playerTurnIndex === this.players.length){
            this.playerTurnIndex = 0;
            // $('span.blue').text('Player 1 Turn');
            // $('span.yellow').text('Player 2');
            // return;
        } 
        // $('span.yellow').text('Player 2 Turn');
        // $('span.blue').text('Player 1');
        for( var i = 0; i< this.players.length; i++){
            this.players[i].makeInactive();
        }
        this.players[this.playerTurnIndex].makeActive();
    }

    gameWin(message){
        var highestPlayer = 0;
        for( var playerI = 1; playerI < this.players.length; playerI++){
            if(this.players[highestPlayer].getTotalPoints() < this.players[playerI].getTotalPoints()){
                highestPlayer = playerI;
            }
        }
        $('.message').text(message + ' congrats! '+this.players[highestPlayer].name +(highestPlayer+1)+' You have conquered The River!');
        $('.congrats-modal').fadeIn();
 
    }

    gameRefresh(){
        location.reload();
    }

    resetTurn(){
        for (var i = 0; i < this.players.length; i++){
            this.players[i].resetPlayerPioneer();
        }
        this.resetResourceLimit();
    }

    resetResourceLimit(){
        for (var key in this.resources){
            this.resources[key].limit = 4;
            this.resources[3].limit = Infinity;
        }
    }
}