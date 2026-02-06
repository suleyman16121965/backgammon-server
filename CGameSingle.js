function CGameSingle(oData){

    CGameBase.call(this, oData);

    this._startGame();
    
};

CGameSingle.prototype = Object.create(CGameBase.prototype);


CGameSingle.prototype._startGame = function(){
    if (randomFloatBetween(1,100)>50){
        this._bTurnPlayer1 = true;
    }else{
        this._bTurnPlayer1 = false;
    }

    this.initDistribution();
    
    this._oThinking = new CThinking();
    this._oThinking.hide();

    this._szWhiteName = sprintf(TEXT_PLAYER,1);
    this._szBlackName = sprintf(TEXT_PLAYER,2);
    if(!s_b2Players){
        this._szBlackName = TEXT_AI;
    }

    s_oInterface.setPlayersInfo(this._szWhiteName, this._szBlackName);

    this._oEndPanel = new CEndPanel(s_oSpriteLibrary.getSprite('msg_box'));
    this._oEndPanel.addEventListener(ON_BACK_MENU,this.onConfirmExit,this);
    this._oEndPanel.addEventListener(ON_RESTART,this.onRestart,this);
};

CGameSingle.prototype.refreshPos = function(){
    this._oThinking.refreshPos();
};

CGameSingle.prototype._onAfterDistribution = function(){
    if (!this._bFastDistribution){
        s_oGame.onFastDistribution();
    }

    if (s_b2Players||this._bTurnPlayer1){
        s_oInterface.setVisibleButDice(true);
    }

    s_oInterface.onFocusTurn(this._bTurnPlayer1);

    s_oGame.updateInput();
};

CGameSingle.prototype.changeTurn = function(){
    this._iNumTurns++;
    
    this._bTurnPlayer1 = !this._bTurnPlayer1;

    this._oInterface.onFocusTurn(this._bTurnPlayer1);
  
    if (s_b2Players||this._bTurnPlayer1){
        this._oInterface.setVisibleButDice(true);
        this._oThinking.hide();
    }else{
       this._bCpuTurned = false;
    }
    
    if(!s_b2Players && !this._bTurnPlayer1){
        this._oThinking.show();
    }
};

CGameSingle.prototype.rollDice = function(){
    s_oGame._oWhiteDices.fadeOutTween();
    s_oGame._oRedDices.fadeOutTween();
    if (s_oGame._bTurnPlayer1){
         s_oGame._oWhiteDices.show();
    }else{
        if (s_oGame._bStartGame){
        s_oGame._oRedDices.show();
        }
    }
    s_oGame._oInterface.setVisibleButDice(false);
};

CGameSingle.prototype.onClickedTriangle = function(aPossibleMove){
    playSound("click_cell",1,false);

    var iTriangleSource = this._oCurrentPiece.getTriangle();
    var szBrokenRule = this._oRuleFilter.checkForbiddenMoveInList(aPossibleMove, iTriangleSource, this._aRuleToCheck);

    ///SWITCH RULE, IF HIT SOME RULE SHOW PLAYER MESSAGE AND RETURN, THEN CONTINUE TO MOVE
    switch(szBrokenRule){
        case RULE_BROKEN_BOTH_DICE:{
                //WITH THIS MOVE YOU CAN'T PLAY ALL DICES. PLEASE DO ANOTHER MOVES THAT ALLOW YOU PLAY BOTH DICES.
                this._oAlertBox.show(TEXT_RULEBROKEN_BOTH);
                return;
                break;
        }
        case RULE_BROKEN_HIGHER_DICE:{
                //WITH THIS MOVE YOU CAN'T PLAY THE DICE WITH HIGHER VALUE. PLEASE DO ANOTHER MOVES THAT (DA PRECEDENZA AL DADO COL VALORE PIU' ALTO)
                this._oAlertBox.show(TEXT_RULEBROKEN_HIGHER);
                return;
                break;
        }
        default:{
                ///DO NOTHING
                break;
        }
    }

    var iCell;
    var bFinalMove = false;
    var iCounterBearOff;

    if (this._oCurrentPiece.getColor()===WHITE_PIECE){
        iCounterBearOff = this._iBearOffWhite;
    }else{
        iCounterBearOff = this._iBearOffBlack;
    }

    for (var i=0; i<this._aTriangle.length;i++){
        this._aTriangle[i].onIdle();
    }
    s_oStage.removeChild(this._oEndRectWhite);
    s_oStage.removeChild(this._oEndRectBlack);

    if (s_b2Players||this._bTurnPlayer1){
         this._oCurrentPiece.setClicked(false);
         //this._oCurrentPiece.unloadListeners();
         this._bPieceClicked = false;
    }

    if (aPossibleMove.iFocusTriangle===-1||aPossibleMove.iFocusTriangle===24){
        bFinalMove = true;
         if (aPossibleMove.aMoveTriangle.length>1){
             iCell =  aPossibleMove.aMoveTriangle[0];
         }
    }else{
        iCell =  aPossibleMove.aMoveTriangle[0];
    }
    if (this._aTriangle[iCell]){
        this._bPieceMoving = true;
        if (this._aTriangle[iCell].getColor()!==this._oCurrentPiece.getColor()&&this._aTriangle[iCell].getNumPieces()===1){
            if (this._aTriangle[iCell].getLastPiece().getColor()===WHITE_PIECE){
                this._aTriangle[iCell].getLastPiece().movePiece(this._aBar[BAR_UP].getX(),this._aBar[BAR_UP].getY());
                this._aTriangle[iCell].getLastPiece().setTriangle(-1);
                this._aTriangle[iCell].getLastPiece().setBar(true);
                this._aBar[BAR_UP].addPiece(this._aTriangle[iCell].removePiece());
            }else{
                this._aTriangle[iCell].getLastPiece().movePiece(this._aBar[BAR_DOWN].getX(),this._aBar[BAR_DOWN].getY());
                this._aTriangle[iCell].getLastPiece().setTriangle(24);
                this._aTriangle[iCell].getLastPiece().setBar(true);
                this._aBar[BAR_DOWN].addPiece(this._aTriangle[iCell].removePiece());
            }
        }
    }else if(aPossibleMove.iFocusTriangle===-1||aPossibleMove.iFocusTriangle===24){
        this._oCurrentPiece.takeOutAnimation();
        new createjs.Tween.get(this._oCurrentPiece.getPiece()).to({x: this._oCurrentPiece.getXOut(), y: this._oCurrentPiece.getYOut(iCounterBearOff)},300, createjs.Ease.cubicOut);
        if (this._oCurrentPiece.getColor()===WHITE_PIECE){
           this._iBearOffWhite++;
        }else{
           this._iBearOffBlack++;
        }
        this._aTriangle[this._oCurrentPiece.getTriangle()].removePiece();
        this._oCurrentPiece.setTriangle(null);
        this._oCurrentPiece.unloadListeners();
    }

    aPossibleMove.aMoveTriangle.shift();

    if (aPossibleMove.aMoveTriangle.length>0){
        new createjs.Tween.get(this._oCurrentPiece.getPiece()).to({x: this._aTriangle[iCell].getX(),y: this._aTriangle[iCell].getY()},700,createjs.Ease.cubicOut)
                .call(function(){s_oGame.onClickedTriangle(aPossibleMove);});
    }else{
        if (!this._bTurnPlayer1&&!s_b2Players){
        this._bCpuTurned = true;
        }

        this._iPlayerDice-=aPossibleMove.cost;
        if (!this._bDoubleDice){
            if (aPossibleMove.iDiceDisable===0){
                this._bDice1 = false;
            }else if (aPossibleMove.iDiceDisable===1){
                this._bDice2 = false;
            }else{
                this._bDice1 = false;
                this._bDice2 = false;
            }
        }
        if (!bFinalMove){
            this._oCurrentPiece.movePieceOnBoard(this._aTriangle[iCell].getX(),this._aTriangle[iCell].getY());
        }else{
            this.afterMove();
        }
    }


    if (!this._oCurrentPiece.isOnBar()){
        if (!bFinalMove){
            this._aTriangle[iCell].addPiece(this._aTriangle[this._oCurrentPiece.getTriangle()].removePiece());
        }
    }else{
        if (this._oCurrentPiece.getColor()===WHITE_PIECE){
            this._aBar[BAR_UP].getLastPiece().setBar(false);
            this._aTriangle[iCell].addPiece(this._aBar[BAR_UP].removePiece());
        }else{
            this._aBar[BAR_DOWN].getLastPiece().setBar(false);
            this._aTriangle[iCell].addPiece(this._aBar[BAR_DOWN].removePiece());
        }
    }
    if (!bFinalMove){
        this._oCurrentPiece.setTriangle(iCell);
    }
};

CGameSingle.prototype.gameOver = function(iWinner){
    var iNumPieces = 0;
    for (var i=0;i<this._aTriangle.length;i++){
        iNumPieces +=this._aTriangle[i].getNumPieces();
    }
    for (var i=0;i<this._aBar.length;i++){
        iNumPieces += this._aBar[i].getNumPieces();
    }
    this._iScore = iNumPieces * MULTIPLIER_SCORE;

    var szPlayer = iWinner === 0 ? this._szWhiteName : this._szBlackName;
    var szMsgText;

    if (s_b2Players===true){
        szMsgText = sprintf(TEXT_WIN, szPlayer);
    }else if (iWinner===0){
        szMsgText = TEXT_GAMEOVER;
    }else{
        this._iScore = 0;
        szMsgText = sprintf(TEXT_WIN, szPlayer);
    }

    this._oEndPanel.show(szMsgText,this._iScore,iWinner);
    this._oEndPanel.showButtons();
};