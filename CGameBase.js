var CGameBase = function(oData){
    this._bStartGame;
    this._bPieceMoving;
    this._iNumTurns;
    this._iScore;
    this._oInterface;
    this._oEndPanel;
    this._bPieceClicked;
    this._oTriangleContainer;
    this._aTriangle;
    this._oPieceContainer;
    this._iCounterDistribution;
    this._aPosDistribution;
    this._bTurnPlayer1;
    this._iDice1;
    this._iDice2;
    this._bDice1;
    this._bDice2;
    this._bDoubleDice;
    this._iPlayerDice;
    this._aTmpPieces;
    this._oCurrentPiece;
    this._oContainerBar;
    this._aBar;
    this._oEndRectWhite;
    this._oEndRectBlack;
    this._oWhiteDices;
    this._oRedDices;
    this._bCpuTurned;
    this._iBearOffWhite;
    this._iBearOffBlack;
    this._oAlertBox;
    this._oThinking;
    this._bFastDistribution;
    this._oFastDistributionBut;
    this._oBotDiceTimer;

    this._oRuleFilter;
    this._aRuleToCheck;
    
    this._iCPUTimeout;
    this._iSkipTurnTimeout;
    
    this._szWhiteName;
    this._szBlackName;
    
    this._init();
    
    s_oGame = this;
};

CGameBase.prototype._init = function(){
    
    this._oBotDiceTimer = new CTimeout();

    MS_DISTRIBUTION = 300;
    this._aTmpPieces = new Array();
    
    this.reset();

    var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_game'));
    s_oStage.addChild(oBg); //Draws on canvas

    this._oTriangleContainer = new createjs.Container();
    s_oStage.addChild(this._oTriangleContainer);

    this._aBar = new Array();

    this._oContainerBar = new createjs.Container();

    s_oStage.addChild(this._oContainerBar);

    this._aBar.push(new CBar(CANVAS_WIDTH/2,CANVAS_HEIGHT/2-265,BAR_UP,this._oContainerBar));

    this._aBar.push(new CBar(CANVAS_WIDTH/2,CANVAS_HEIGHT/2+265,BAR_DOWN,this._oContainerBar));

    this._aTriangle = new Array();

    this._aTriangle.push(new CTriangle(X_TRIANGLE_RIGHT+(62*5),Y_TRIANGLE_UP,this._oTriangleContainer,CELL_0));
    this._aTriangle.push(new CTriangle(X_TRIANGLE_RIGHT+(62*4),Y_TRIANGLE_UP,this._oTriangleContainer,CELL_1));
    this._aTriangle.push(new CTriangle(X_TRIANGLE_RIGHT+(62*3),Y_TRIANGLE_UP,this._oTriangleContainer,CELL_2));
    this._aTriangle.push(new CTriangle(X_TRIANGLE_RIGHT+(62*2),Y_TRIANGLE_UP,this._oTriangleContainer,CELL_3));
    this._aTriangle.push(new CTriangle(X_TRIANGLE_RIGHT+62,Y_TRIANGLE_UP,this._oTriangleContainer,CELL_4));
    this._aTriangle.push(new CTriangle(X_TRIANGLE_RIGHT,Y_TRIANGLE_UP,this._oTriangleContainer,CELL_5));
    this._aTriangle.push(new CTriangle(X_TRIANGLE_LEFT+(62*5),Y_TRIANGLE_UP,this._oTriangleContainer,CELL_6));
    this._aTriangle.push(new CTriangle(X_TRIANGLE_LEFT+(62*4),Y_TRIANGLE_UP,this._oTriangleContainer,CELL_7));
    this._aTriangle.push(new CTriangle(X_TRIANGLE_LEFT+(62*3),Y_TRIANGLE_UP,this._oTriangleContainer,CELL_8));
    this._aTriangle.push(new CTriangle(X_TRIANGLE_LEFT+(62*2),Y_TRIANGLE_UP,this._oTriangleContainer,CELL_9));
    this._aTriangle.push(new CTriangle(X_TRIANGLE_LEFT+62,Y_TRIANGLE_UP,this._oTriangleContainer,CELL_10));
    this._aTriangle.push(new CTriangle(X_TRIANGLE_LEFT,Y_TRIANGLE_UP,this._oTriangleContainer,CELL_11));
    this._aTriangle.push(new CTriangle(X_TRIANGLE_LEFT,Y_TRIANGLE_DOWN,this._oTriangleContainer,CELL_12));
    this._aTriangle.push(new CTriangle(X_TRIANGLE_LEFT+62,Y_TRIANGLE_DOWN,this._oTriangleContainer,CELL_13));
    this._aTriangle.push(new CTriangle(X_TRIANGLE_LEFT+(62*2),Y_TRIANGLE_DOWN,this._oTriangleContainer,CELL_14));
    this._aTriangle.push(new CTriangle(X_TRIANGLE_LEFT+(62*3),Y_TRIANGLE_DOWN,this._oTriangleContainer,CELL_15));
    this._aTriangle.push(new CTriangle(X_TRIANGLE_LEFT+(62*4),Y_TRIANGLE_DOWN,this._oTriangleContainer,CELL_16));
    this._aTriangle.push(new CTriangle(X_TRIANGLE_LEFT+(62*5),Y_TRIANGLE_DOWN,this._oTriangleContainer,CELL_17));
    this._aTriangle.push(new CTriangle(X_TRIANGLE_RIGHT,Y_TRIANGLE_DOWN,this._oTriangleContainer,CELL_18));
    this._aTriangle.push(new CTriangle(X_TRIANGLE_RIGHT+62,Y_TRIANGLE_DOWN,this._oTriangleContainer,CELL_19));
    this._aTriangle.push(new CTriangle(X_TRIANGLE_RIGHT+(62*2),Y_TRIANGLE_DOWN,this._oTriangleContainer,CELL_20));
    this._aTriangle.push(new CTriangle(X_TRIANGLE_RIGHT+(62*3),Y_TRIANGLE_DOWN,this._oTriangleContainer,CELL_21));
    this._aTriangle.push(new CTriangle(X_TRIANGLE_RIGHT+(62*4),Y_TRIANGLE_DOWN,this._oTriangleContainer,CELL_22));
    this._aTriangle.push(new CTriangle(X_TRIANGLE_RIGHT+(62*5),Y_TRIANGLE_DOWN,this._oTriangleContainer,CELL_23));

    this._oPieceContainer = new createjs.Container();
    s_oStage.addChild(this._oPieceContainer);
    
    
    this._aPosDistribution = [
        0,0,11,11,11,11,11,16,16,16,18,18,18,18,18,
        23,23,12,12,12,12,12,7,7,7,5,5,5,5,5
    ];
    
    
    ////DEBUG STARTING BOARD
    //this._aPosDistribution = [0,0,11,11,11,11,11,16,16,16,18,18,18,18,18,23,23,12,12,12,12,12,7,7,7,5,5,5,5,5];   //ORIGINAL
    //this._aPosDistribution = [23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,0,0,12,12,12,12,12,7,7,7,5,5,5,5,5];
    //this._aPosDistribution = [0,9,9,9,9,11,11,11,11,11,18,18,18,18,18,3,3,4,5,5,10,10,13,13,15,15,17,17,22,22];
    //this._aPosDistribution = [0,0,11,11,11,11,11,17,17,17,18,18,18,18,18,1,1,2,2,4,4,5,5,5,15,15,21,21,22,22]; //BOTH DICE RULE 1
    //this._aPosDistribution = [0,9,9,9,9,11,11,11,11,11,18,18,18,18,18,3,3,4,5,5,10,10,13,13,15,15,17,17,22,22]; //HIGHER DICE RULE
    //this._aPosDistribution = [1,1,6,6,8,8,10,10,13,13,18,18,19,20,20,23,14,14,14,14,12,12,12,12,12,5,5,5,5,5]; //HIGHER INVERTED (CPU)
    //this._aPosDistribution = [14,11,11,11,11,11,11,11,11,11,18,16,14,14,14,22,20,3,9,9,20,20,13,13,15,15,17,17,22,22]; //BAR TEST
    ////////////////////

    /*
    this._aPosDistribution = [
        11,11,11,11,11,11,11,12,17,18,18,19,19,20,21,
        2,9,9,13,2,3,3,14,14,14,15,16,9,0,0
    ];//BAR TEST
    */
   
    for (var i=0;i<NUM_PIECES;i++){
        this._aTmpPieces.push(new CPiece(X_OFFBOARD,Y_OFFBOARD_DOWN+(17*i),WHITE_PIECE,this._oPieceContainer,i));
    }

    for (var i=0;i<NUM_PIECES;i++){
        this._aTmpPieces.push(new CPiece(X_OFFBOARD,Y_OFFBOARD_UP+(17*i),BLACK_PIECE,this._oPieceContainer,i+NUM_PIECES));
    }

    this._oWhiteDices = new CDices(0);
    this._oRedDices = new CDices(1);

    this._oAlertBox = new CAlertBox(s_oStage);

    var oSprite = s_oSpriteLibrary.getSprite("but_speed");
    this._oFastDistributionBut = new CGfxButton(CANVAS_WIDTH-200,CANVAS_HEIGHT/2,oSprite,s_oStage);
    this._oFastDistributionBut.addEventListener(ON_MOUSE_DOWN,function(){s_oGame.onFastDistribution()});

    this._oInterface = new CInterface();

    this._oRuleFilter = new CRuleFilter();

    //console.clear();
};

CGameBase.prototype.reset = function(){
    this._bFastDistribution = false;
    this._bPieceMoving = false;
    this._iBearOffWhite = 0;
    this._iBearOffBlack = 0;
    this._bPieceClicked = false;
    this._bStartGame=true;
    this._iScore=0;
    this._iCounterDistribution = 0;
    this._iPlayerDice = 0;
    this._bCpuTurned = false;
    this._iDice1 = 0;
    this._iDice2 = 0;
    this._bDice1 = false;
    this._bDice2 = false;
    this._bDoubleDice = false;
    this._iNumTurns = 0;
};

CGameBase.prototype.initDistribution = function(){
    var oThisPiece;
    var iIndexTriangle;

    if (this._bFastDistribution){
        MS_DISTRIBUTION = 0;
    }
    
    if (this._iCounterDistribution<NUM_PIECES*2){
        oThisPiece = this._aTmpPieces[this._iCounterDistribution];
        iIndexTriangle = this._aPosDistribution[this._iCounterDistribution];
        this._oPieceContainer.addChildAt(oThisPiece.getPiece(),this._oPieceContainer.numChildren);
        oThisPiece.movePieceDistribution(this._aTriangle[iIndexTriangle].getX(),this._aTriangle[iIndexTriangle].getY());
        oThisPiece.setTriangle(iIndexTriangle);
        this._aTriangle[iIndexTriangle].addPiece(oThisPiece);
        this._iCounterDistribution++;
    }else{

        s_oGame._onAfterDistribution();
    }
};

CGameBase.prototype.onFastDistribution = function(){
    this._bFastDistribution = true;
    new createjs.Tween.get(s_oGame._oFastDistributionBut.getButtonImage()).to({x: CANVAS_WIDTH+200},300).call(function(){
         s_oGame._oFastDistributionBut.unload();
    });
};

CGameBase.prototype.onClickedPiece = function(oPieceIstance){

    if(this._bPieceMoving){
        return;
    }
    playSound("click_cell",1,false);

    var iCurrentBar;

    if (oPieceIstance.getTriangle()!==-1&&oPieceIstance.getTriangle()!==24){
        this._oCurrentPiece = this._aTriangle[oPieceIstance.getTriangle()].getLastPiece();
    }else{
        if (oPieceIstance.getColor()===WHITE_PIECE){
            this._oCurrentPiece = this._aBar[BAR_UP].getLastPiece();
        }else{
            this._oCurrentPiece = this._aBar[BAR_DOWN].getLastPiece();
        }
    }

    if (this._oCurrentPiece.getColor()===WHITE_PIECE){
        iCurrentBar = BAR_UP;
    }else{
        iCurrentBar = BAR_DOWN;
    }

    var aPieces;

    var aPossibleMove;

    if (this._iPlayerDice>0){

        this._oCurrentPiece.setOnTop();

       if (this._bPieceClicked===false){

           if (this.isPossibleMove(this._oCurrentPiece)){

                this._oCurrentPiece.setClicked(true);
                this._bPieceClicked = true;
                aPossibleMove = this.isPossibleMove(this._oCurrentPiece);
                if (this._bDoubleDice){

                        if (aPossibleMove[0].length>0){
                            this._aTriangle[aPossibleMove[0][0].iFocusTriangle].onFocus(aPossibleMove[0][0]);
                        }
                        if (aPossibleMove[0].length>1&&this._aBar[iCurrentBar].getNumPieces()<2){
                            this._aTriangle[aPossibleMove[0][1].iFocusTriangle].onFocus(aPossibleMove[0][1]);
                        }
                        if (aPossibleMove[0].length>2&&this._aBar[iCurrentBar].getNumPieces()<2){
                            this._aTriangle[aPossibleMove[0][2].iFocusTriangle].onFocus(aPossibleMove[0][2]);
                        }
                        if (aPossibleMove[0].length>3&&this._aBar[iCurrentBar].getNumPieces()<2){
                            this._aTriangle[aPossibleMove[0][3].iFocusTriangle].onFocus(aPossibleMove[0][3]);
                        }
                }else{

                        if (aPossibleMove[0].length>0){
                            this._aTriangle[aPossibleMove[0][0].iFocusTriangle].onFocus(aPossibleMove[0][0]);
                        }
                        if (aPossibleMove[1].length>0){
                            this._aTriangle[aPossibleMove[1][0].iFocusTriangle].onFocus(aPossibleMove[1][0]);
                        }
                        if (aPossibleMove[2].length>0&&this._aBar[iCurrentBar].getNumPieces()<2){
                            this._aTriangle[aPossibleMove[2][0].iFocusTriangle].onFocus(aPossibleMove[2][0]);
                        }
                }

                if (aPossibleMove[3].length>0){
                        if (aPossibleMove[3][0].iFocusTriangle===FINAL_CELL_WHITE){
                            var oSprite = s_oSpriteLibrary.getSprite("light_turn");
                            this._oEndRectWhite = createBitmap(oSprite,oSprite.width,oSprite.height);
                            this._oEndRectWhite.regX = 11;
                            this._oEndRectWhite.regY = 12;
                            this._oEndRectWhite.x = X_INTERFACE_PLAYER_END;
                            this._oEndRectWhite.y = Y_INTERFACE_PLAYER_2;
                            this._oEndRectWhite.on("mousedown",function(){s_oGame.onClickedTriangle(aPossibleMove[3][0]);});
                            this._oEndRectWhite.on("rollover", function(evt){
                                if (!s_bMobile){
                                    evt.target.cursor = "pointer";
                                }
                            });
                            this._oEndRectWhite.on("rollout", function(evt){
                                if (!s_bMobile){
                                    evt.target.cursor = "default";
                                }
                            });
                            s_oStage.addChild(this._oEndRectWhite);
                        }else{
                            var oSprite = s_oSpriteLibrary.getSprite("light_turn");
                            this._oEndRectBlack = createBitmap(oSprite,oSprite.width,oSprite.height);
                            this._oEndRectBlack.regX = 11;
                            this._oEndRectBlack.regY = 12;
                            this._oEndRectBlack.x = X_INTERFACE_PLAYER_END;
                            this._oEndRectBlack.y = Y_INTERFACE_PLAYER_1;
                            this._oEndRectBlack.on("mousedown",function(){s_oGame.onClickedTriangle(aPossibleMove[3][0]);});
                            this._oEndRectBlack.on("rollover", function(evt){
                                if (!s_bMobile){
                                    evt.target.cursor = "pointer";
                                }
                            });
                            this._oEndRectBlack.on("rollout", function(evt){
                                if (!s_bMobile){
                                    evt.target.cursor = "default";
                                }
                            });
                            s_oStage.addChild(this._oEndRectBlack);
                        }


                }


            }
       }else{
           if (this._oCurrentPiece.getStateClick()===true){
               this._oCurrentPiece.setClicked(false);
               this._bPieceClicked = false;
               s_oStage.removeChild(this._oEndRectWhite);
               s_oStage.removeChild(this._oEndRectBlack);
               for (var i=0;i<this._aTriangle.length;i++){
                    this._aTriangle[i].onIdle();
               }
           }else{
               s_oStage.removeChild(this._oEndRectWhite);
               s_oStage.removeChild(this._oEndRectBlack);
               for (var i=0;i<this._aTriangle.length;i++){
                   this._aTriangle[i].onIdle();
                   if (this._aTriangle[i].getNumPieces()>0){
                        aPieces = this._aTriangle[i].getArrayPieces();
                        for (var j=0;j<aPieces.length;j++){
                            aPieces[j].setClicked(false);
                        }
                   }
               }
               this._bPieceClicked = false;
               this.onClickedPiece(oPieceIstance);
           }
       }

   }
};

CGameBase.prototype.isPossibleMove = function(oPiece){

    var iPieceColor = oPiece.getColor();
    var iPieceTriangle = oPiece.getTriangle();
    var iPosNeg;
    var iBestTriangle;
    var iFinalCell;

    if (iPieceColor===WHITE_PIECE){
        iPosNeg = 1;
        iFinalCell = FINAL_CELL_WHITE;
    }else{
        iPosNeg = -1;
        iFinalCell = FINAL_CELL_BLACK;
    }

    var aMove = new Array();

    aMove[0] = new Array();
    aMove[1] = new Array();
    aMove[2] = new Array();
    aMove[3] = new Array();

    var oTmpTriangle;

    if (this._bDoubleDice){

        oTmpTriangle = this._aTriangle[iPieceTriangle+(this._iDice1*iPosNeg)];
        if (oTmpTriangle){
            if(oTmpTriangle.getNumPieces()<=1||oTmpTriangle.getColor()===iPieceColor){
                aMove[0].push({iFocusTriangle: iPieceTriangle+(this._iDice1*iPosNeg), cost: 1, 
                aMoveTriangle: [iPieceTriangle+(this._iDice1*iPosNeg)]});
            }
        }else if(this.checkBearOff()){
            if (iPieceTriangle+(this._iDice1*iPosNeg)===iFinalCell||this.checkPieceBefore(iPieceColor,iPieceTriangle)){
                aMove[3].push({iFocusTriangle: iFinalCell, cost: 1, 
                aMoveTriangle: [iFinalCell]});
            }
        }

        if (aMove[0].length>0&&this._iPlayerDice>1){
            oTmpTriangle = this._aTriangle[iPieceTriangle+(this._iDice1*2*iPosNeg)];
            if (oTmpTriangle){
                if(oTmpTriangle.getNumPieces()<=1||oTmpTriangle.getColor()===iPieceColor){
                    aMove[0].push({iFocusTriangle: iPieceTriangle+(this._iDice1*2*iPosNeg), cost: 2, 
                    aMoveTriangle: [iPieceTriangle+(this._iDice1*iPosNeg),iPieceTriangle+(this._iDice1*2*iPosNeg)]});
                }
            }else if(this.checkBearOff()){
                if (iPieceTriangle+(this._iDice1*2*iPosNeg)===iFinalCell||this.checkPieceBefore(iPieceColor,iPieceTriangle+(this._iDice1*iPosNeg))){
                    aMove[3].push({iFocusTriangle: iFinalCell, cost: 2, 
                    aMoveTriangle: [iPieceTriangle+(this._iDice1*iPosNeg),iFinalCell]});
                }
            }
        }

        if (aMove[0].length>1&&this._iPlayerDice>2){
            oTmpTriangle = this._aTriangle[iPieceTriangle+(this._iDice1*3*iPosNeg)];
            if (oTmpTriangle){
                if(oTmpTriangle.getNumPieces()<=1||oTmpTriangle.getColor()===iPieceColor){
                    aMove[0].push({iFocusTriangle: iPieceTriangle+(this._iDice1*3*iPosNeg), cost: 3,
                    aMoveTriangle: [iPieceTriangle+(this._iDice1*iPosNeg),iPieceTriangle+(this._iDice1*2*iPosNeg),iPieceTriangle+(this._iDice1*3*iPosNeg)]});
                }
            }else if(this.checkBearOff()){  
                if (iPieceTriangle+(this._iDice1*3*iPosNeg)===iFinalCell||this.checkPieceBefore(iPieceColor,iPieceTriangle+(this._iDice1*2*iPosNeg))){
                    aMove[3].push({iFocusTriangle: iFinalCell, cost: 3, 
                    aMoveTriangle: [iPieceTriangle+(this._iDice1*iPosNeg),iPieceTriangle+(this._iDice1*2*iPosNeg),iFinalCell]});
                }
            }
        }

        if (aMove[0].length>2&&this._iPlayerDice>3){
            oTmpTriangle = this._aTriangle[iPieceTriangle+(this._iDice1*4*iPosNeg)];
            if (oTmpTriangle){
                if(oTmpTriangle.getNumPieces()<=1||oTmpTriangle.getColor()===iPieceColor){
                    aMove[0].push({iFocusTriangle: iPieceTriangle+(this._iDice1*4*iPosNeg), cost: 4,
                    aMoveTriangle: [iPieceTriangle+(this._iDice1*iPosNeg),iPieceTriangle+(this._iDice1*2*iPosNeg),iPieceTriangle+(this._iDice1*3*iPosNeg),iPieceTriangle+(this._iDice1*4*iPosNeg)]});
                }
            }else if(this.checkBearOff()){  
                if (iPieceTriangle+(this._iDice1*4*iPosNeg)===iFinalCell||this.checkPieceBefore(iPieceColor,iPieceTriangle+(this._iDice1*3*iPosNeg))){
                    aMove[3].push({iFocusTriangle: iFinalCell, cost: 4, 
                    aMoveTriangle: [iPieceTriangle+(this._iDice1*iPosNeg),iPieceTriangle+(this._iDice1*2*iPosNeg),iPieceTriangle+(this._iDice1*2*iPosNeg),iFinalCell]});
                }
            }
        }
    }else{
        oTmpTriangle = this._aTriangle[iPieceTriangle+(this._iDice1*iPosNeg)];
        //console.log(iPieceTriangle+(this._iDice1*iPosNeg))
        if (oTmpTriangle){
            if(this._bDice1&&(oTmpTriangle.getNumPieces()<=1||oTmpTriangle.getColor()===iPieceColor)){
                aMove[0].push({iFocusTriangle: iPieceTriangle+(this._iDice1*iPosNeg), cost: 1,
                aMoveTriangle: [iPieceTriangle+(this._iDice1*iPosNeg)], iDiceDisable: 0});
            }
        }else if(this._bDice1&&this.checkBearOff()){  
            if (iPieceTriangle+(this._iDice1*iPosNeg)===iFinalCell||this.checkPieceBefore(iPieceColor,iPieceTriangle)){
                aMove[3].push({iFocusTriangle: iFinalCell, cost: 1, iDiceDisable: 0,
                aMoveTriangle: [iFinalCell]});
            }
        }

        oTmpTriangle = this._aTriangle[iPieceTriangle+(this._iDice2*iPosNeg)];

        if (oTmpTriangle){
            if(this._bDice2&&(oTmpTriangle.getNumPieces()<=1||oTmpTriangle.getColor()===iPieceColor)){
                aMove[1].push({iFocusTriangle: iPieceTriangle+(this._iDice2*iPosNeg), cost: 1,
                aMoveTriangle: [iPieceTriangle+(this._iDice2*iPosNeg)], iDiceDisable: 1});
            }
        }else if(this._bDice2&&this.checkBearOff()){  
            if (iPieceTriangle+(this._iDice2*iPosNeg)===iFinalCell||this.checkPieceBefore(iPieceColor,iPieceTriangle)){
                aMove[3].push({iFocusTriangle: iFinalCell, cost: 1, iDiceDisable: 1,
                aMoveTriangle: [iFinalCell]});
            }
        }

        if (aMove[0].length>0||aMove[1].length>0){

            if (aMove[0].length>0){
                iBestTriangle = aMove[0][0].iFocusTriangle;
            }else{
                iBestTriangle = aMove[1][0].iFocusTriangle;
            }

            if (aMove[0].length>0&&this._aTriangle[aMove[0][0].iFocusTriangle].getNumPieces()===1){
                iBestTriangle = aMove[0][0].iFocusTriangle;
            }

            if (aMove[1].length>0&&this._aTriangle[aMove[1][0].iFocusTriangle].getNumPieces()===1){
                iBestTriangle = aMove[1][0].iFocusTriangle;
            }

            oTmpTriangle = this._aTriangle[iPieceTriangle+((this._iDice1+this._iDice2)*iPosNeg)];

            if (oTmpTriangle){
                if(this._bDice1&&this._bDice2&&(oTmpTriangle.getNumPieces()<=1||oTmpTriangle.getColor()===iPieceColor)){
                    aMove[2].push({iFocusTriangle: iPieceTriangle+((this._iDice1+this._iDice2)*iPosNeg), cost: 2,
                        aMoveTriangle: [iBestTriangle,iPieceTriangle+((this._iDice1+this._iDice2)*iPosNeg)], iDiceDisable: 2});
                }
            }else if(this._bDice1&&this._bDice2&&this.checkBearOff()){  
                if (iPieceTriangle+((this._iDice1+this._iDice2)*iPosNeg)===iFinalCell||this.checkPieceBefore(iPieceColor,iBestTriangle)){
                    aMove[3].push({iFocusTriangle: iFinalCell, cost: 2, iDiceDisable: 2,
                    aMoveTriangle: [iBestTriangle,iFinalCell]});
                }
            }    

        }

    }

    if (aMove[0].length>0||aMove[1].length>0||aMove[3].length>0){
        return aMove;
    }else{
        return null;
    }


};

CGameBase.prototype.checkPieceBefore = function(iColor,iPieceTriangle){
    var bNoPieceBefore = true;
    var aPieces;

    if (iColor === WHITE_PIECE){
        for (var i=0;i<iPieceTriangle;i++){
            for (var j=0;j<this._aTriangle[i].getArrayPieces().length;j++){
                aPieces = this._aTriangle[i].getArrayPieces();
                if(aPieces[j].getColor()===WHITE_PIECE){
                    bNoPieceBefore = false;
                    break;
                }
            }
        }
    }else{
        for (var i=23;i>iPieceTriangle;i--){
            for (var j=0;j<this._aTriangle[i].getArrayPieces().length;j++){
                aPieces = this._aTriangle[i].getArrayPieces();
                if(aPieces[j].getColor()===BLACK_PIECE){
                    bNoPieceBefore = false;
                    break;
                }
            }
        }
    }

    return bNoPieceBefore;

};

CGameBase.prototype.checkBearOff = function(){

    var bBearOffAvaiable = true;
    var aPieces;

   if (this._bTurnPlayer1){
       for (var i=0;i<this._aTriangle.length;i++){
           aPieces = this._aTriangle[i].getArrayPieces();
           for (var j=0;j<aPieces.length;j++){
               if (aPieces[j].getColor()===WHITE_PIECE&&(aPieces[j].isOnBar()===true||aPieces[j].getTriangle()<18)){
                   bBearOffAvaiable = false;
                   break;
               }
           }
       }
   }else{
       for (var i=0;i<this._aTriangle.length;i++){
           aPieces = this._aTriangle[i].getArrayPieces();
           for (var j=0;j<aPieces.length;j++){
               if (aPieces[j].getColor()===BLACK_PIECE&&(aPieces[j].isOnBar()===true||aPieces[j].getTriangle()>5)){
                   bBearOffAvaiable = false;
                   break;
               }
           }
       }
   }

   return bBearOffAvaiable;

};

CGameBase.prototype.checkAvaiableMove = function(){
    var bAvailableMove = false;
    var aPieces;
    var iColor;
    var iBar;
    if (this._bTurnPlayer1){
        iColor = WHITE_PIECE;
        iBar = BAR_UP;
    }else{
        iColor = BLACK_PIECE;
        iBar = BAR_DOWN;
    }
    
    for (var i=0;i<this._aTriangle.length;i++){
        aPieces = this._aTriangle[i].getArrayPieces();
        for (var j=0;j<aPieces.length;j++){
            if (aPieces[j].getColor()===iColor&&aPieces[j].getStateListener()===true&&this.isPossibleMove(aPieces[j])){
                bAvailableMove = true;
                break;
            }
        }
    }

    aPieces = this._aBar[iBar].getArrayPieces();

    for (var i=0;i<this._aBar[iBar].getNumPieces();i++){
        if (this.isPossibleMove(aPieces[i])){
            bAvailableMove = true;
            break;
        }
    }

    return bAvailableMove;

};

CGameBase.prototype.updateInput = function(){
    var aPieces;

    for (var i=0;i<this._aTriangle.length;i++){
             if (this._aTriangle[i].getNumPieces()>0){

                 aPieces = this._aTriangle[i].getArrayPieces();

                 for (var j=0;j<aPieces.length;j++){
                     aPieces[j].unloadListeners();
                 }

             }
   }

    for (var i=0;i<this._aBar.length;i++){
        if (this._aBar[i].getNumPieces()>0){
            aPieces = this._aBar[i].getArrayPieces();

            for (var j=0;j<aPieces.length;j++){
                aPieces[j].unloadListeners();
            }
        }
    }

    if (s_b2Players){
        if (this._bTurnPlayer1){
            if (this._aBar[BAR_UP].getNumPieces()===0){
                  for (var i=0;i<this._aTriangle.length;i++){

                      if (this._aTriangle[i].getNumPieces()>0){

                          aPieces = this._aTriangle[i].getArrayPieces();

                            if (this._aTriangle[i].getColor()===WHITE_PIECE){

                                for (var j=0;j<aPieces.length;j++){
                                    aPieces[j].initListeners();
                                }

                            }
                    }
                  }
          }else{
              for (var i=0;i<this._aBar[0].getArrayPieces().length;i++){
                  this._aBar[BAR_UP].getArrayPieces()[i].initListeners();
              }
          }
        }else{ 
            if (this._aBar[BAR_DOWN].getNumPieces()===0){
                  for (var i=0;i<this._aTriangle.length;i++){

                      if (this._aTriangle[i].getNumPieces()>0){

                          aPieces = this._aTriangle[i].getArrayPieces();

                           if (this._aTriangle[i].getColor()===BLACK_PIECE){

                               for (var j=0;j<aPieces.length;j++){
                                   aPieces[j].initListeners();
                               }
                          }
                      }
                 }
            }else{
                for (var i=0;i<this._aBar[1].getArrayPieces().length;i++){
                    this._aBar[BAR_DOWN].getArrayPieces()[i].initListeners();
                }
            }
        }
    }else{
        if (this._bTurnPlayer1){
            if (this._aBar[BAR_UP].getNumPieces()===0){
                  for (var i=0;i<this._aTriangle.length;i++){

                      if (this._aTriangle[i].getNumPieces()>0){

                          aPieces = this._aTriangle[i].getArrayPieces();

                            if (this._aTriangle[i].getColor()===WHITE_PIECE){

                                for (var j=0;j<aPieces.length;j++){
                                    aPieces[j].initListeners();
                                }

                            }
                    }
                  }
            }else{
                for (var i=0;i<this._aBar[0].getArrayPieces().length;i++){
                    this._aBar[BAR_UP].getArrayPieces()[i].initListeners();
                }
            }
        }else{
            if (this._aBar[BAR_DOWN].getNumPieces()===0){
                for (var i=0;i<this._aTriangle.length;i++){

                    if (this._aTriangle[i].getNumPieces()>0){

                        aPieces = this._aTriangle[i].getArrayPieces();

                        if (this._aTriangle[i].getColor()===BLACK_PIECE){

                            for (var j=0;j<aPieces.length;j++){
                                aPieces[j].cpuInit();
                            }
                        }
                    }
                }
            }else{
                for (var i=0;i<this._aBar[1].getArrayPieces().length;i++){
                    this._aBar[BAR_DOWN].getArrayPieces()[i].cpuInit();
                }
            }
            if (this._bCpuTurned===false){
                this._bCpuTurned = true;
                this.rollDice();
                
            }
        }
    }
};

CGameBase.prototype.afterMove = function(){
    this._bPieceMoving = false;
    var iWinner = s_oGame.checkGameOver();
    
    if(iWinner === -1){
        if (this._iPlayerDice>0){
            if (s_oGame.checkAvaiableMove()===true){
                 s_oGame.updateInput();
                 if (!s_b2Players&&!this._bTurnPlayer1){
                     s_oGame.cpuThinkBeforeChoice();
                 }
            }else{
                this._oWhiteDices.fadeOutTween();
                this._oRedDices.fadeOutTween();

                this.skipTurn();
            }
        }else{
            this._bDoubleDice = false;
            this._oWhiteDices.fadeOutTween();

            s_oGame.changeTurn();
            s_oGame.updateInput();
        }
    }else{
        this._bStartGame = false;
        this.gameOver(iWinner);
    }
};

CGameBase.prototype.afterRollDice = function(){
    this._oAlertBox.hide();
    
    if (this._bTurnPlayer1){
         this._iDice1 = this._oWhiteDices.returnDiceResult1();
         this._iDice2 = this._oWhiteDices.returnDiceResult2();
    }else{
         this._iDice1 = this._oRedDices.returnDiceResult1();
         this._iDice2 = this._oRedDices.returnDiceResult2();
    }
    this._bDice1 = true;
    this._bDice2 = true;
    if (this._iDice1!==this._iDice2){
        this._iPlayerDice = 2;
    }else{
        this._iPlayerDice = 4;
        this._oAlertBox.show(TEXT_DOUBLE_DICES);
        playSound("positive_beep",1,false);
        this._bDoubleDice = true;
    }

    this._aRuleToCheck = this._oRuleFilter.checkMovesAvailable(this._bTurnPlayer1);

    if (s_oGame.checkAvaiableMove()===false){
        if (!s_b2Players&&this._bTurnPlayer1){
            this._oInterface.setVisibleButDice(true);
        }
        if (!s_b2Players&&!this._bTurnPlayer1){
            this._oInterface.setVisibleButDice(false);
            //setTimeout(s_oGame.rollDice,1000);
        }
        if (s_b2Players){
            this._oInterface.setVisibleButDice(true);
        }

        this.skipTurn();
    }else{
        this._oInterface.setVisibleButDice(false);
        if (!s_b2Players&&this._bTurnPlayer1===false){
            new createjs.Tween.get(s_oGame).to({},1500).call(s_oGame.cpuThinkBeforeChoice);
        }
    } 
};

CGameBase.prototype.skipTurn = function(){
    this._bDice1 = false;
    this._bDice2 = false;
    this._bDoubleDice = false;
    this._iPlayerDice = 0;
    
    this._oInterface.setVisibleButDice(false);
    
    this._oAlertBox.show(TEXT_NO_MOVES_AVAILABLE);
    playSound("negative_beep",1,false);
    this._iSkipTurnTimeout = setTimeout(function(){
        s_oGame._iSkipTurnTimeout = null;
        s_oGame.changeTurn();
        s_oGame.updateInput();
    },800);
};

CGameBase.prototype.debug = function(){
    for (var i=0;i<this._aTriangle.length;i++){
        if (this._aTriangle[i].getNumPieces()>0){
            this._aTriangle[i].getLastPiece().unloadListeners();
        }
    }
};

CGameBase.prototype.unload = function(){
    this._oBotDiceTimer.clear();

    this._bStartGame = false;

    s_oGame._oInterface.unload();
    if(s_oGame._oEndPanel){
        s_oGame._oEndPanel.unload();
    }

    if(this._iCPUTimeout){
        clearTimeout(this._iCPUTimeout);
    }
    if(this._iSkipTurnTimeout){
        clearTimeout(this._iSkipTurnTimeout);
    }

    this._oWhiteDices.unload();
    this._oRedDices.unload();

    createjs.Tween.removeAllTweens();
    s_oStage.removeAllChildren();
};

CGameBase.prototype.refreshPos = function(){

};

CGameBase.prototype.onRestart = function(){
    document.dispatchEvent(new CustomEvent("end_session"));
    document.dispatchEvent(new CustomEvent("share_event", {detail: { score: this._iScore } }));
    document.dispatchEvent(new CustomEvent("show_interlevel_ad"));
    this._oEndPanel.hide();

    s_oGame.reset();
    
    for(var i=0; i<this._aTriangle.length; i++){
        this._aTriangle[i].reset();
    };
    
    s_oGame.initDistribution();
    
    /*
    s_oGame.unload();
    s_oMain.gotoGame();
    */
};

CGameBase.prototype.onConfirmExit = function(){
    document.dispatchEvent(new CustomEvent("end_session"));
    document.dispatchEvent(new CustomEvent("share_event", {detail: { score: this._iScore } }));
    document.dispatchEvent(new CustomEvent("show_interlevel_ad"));

    s_oGame.unload();
    s_oMain.gotoMenu();
};



CGameBase.prototype.checkGameOver = function(){
    var iGameOver = -1;
    
    var aPieces;
    var iWhitePieces = 0;
    var iBlackPieces = 0;

    for (var i=0;i<this._aTriangle.length;i++){
        aPieces = this._aTriangle[i].getArrayPieces();
        for (var j=0;j<aPieces.length;j++){
            if (aPieces[j].getColor()===WHITE_PIECE){
                iWhitePieces++;
            }else{
                iBlackPieces++;
            }
        }
        iWhitePieces+=this._aBar[BAR_UP].getNumPieces();
        iBlackPieces+=this._aBar[BAR_DOWN].getNumPieces();
    }
    
    if (iWhitePieces===0){
        iGameOver = 0;
    }else if (iBlackPieces===0){
        iGameOver = 1;
    }

    return iGameOver;
};


CGameBase.prototype.cpuThinkBeforeChoice = function () {
    this._oThinking.show(); 
    var iTimeThink = randomIntBetween(MIN_TIME_THINK,MAX_TIME_THINK);
    this._iCPUTimeout = setTimeout(function(){ 
        //s_oGame._oThinking.hide(); 
        s_oGame._iCPUTimeout = null;
        s_oGame.cpuChoicePiece();
    },iTimeThink);
};


CGameBase.prototype.cpuChoicePiece = function(){

    var oPiece;
    var aMoves;
    var aPossibleChoices = new Array();
    var iPointsChoice = 0;


    if (this._aBar[BAR_DOWN].getNumPieces() > 0) {
        oPiece = this._aBar[BAR_DOWN].getLastPiece();
        aMoves = s_oGame.isPossibleMove(oPiece);

        if (aMoves) {
            for (var i = 0; i < aMoves.length - 1; i++) {
                for (var j = 0; j < aMoves[i].length; j++) {
                    iPointsChoice = 0;

                    if (this._aTriangle[aMoves[i][j].iFocusTriangle].getNumPieces() === 1 && this._aTriangle[aMoves[i][j].iFocusTriangle].getColor() === BLACK_PIECE) {
                        iPointsChoice++;
                    }
                    if (aMoves[i][j].iFocusTriangle < 13) {
                        iPointsChoice++;
                    }
                    if (aMoves[i][j].iFocusTriangle > 13 && this._aTriangle[aMoves[i][j].iFocusTriangle].getNumPieces() === 1) {
                        iPointsChoice++;
                    }
                    if (aMoves[i][j].iFocusTriangle < 13 && this._aTriangle[aMoves[i][j].iFocusTriangle].getNumPieces() === 1) {
                        iPointsChoice--;
                    }
                    if (this._aTriangle[aMoves[i][j].iFocusTriangle].getNumPieces() === 1 && aMoves[i][j].iFocusTriangle < 13) {
                        iPointsChoice++;
                    }
                    aPossibleChoices.push({oMove: aMoves[i][j], iPoints: iPointsChoice, oCurrentPiece: oPiece});
                }
            }
        }
    } else {

        for (var i = 0; i < this._aTriangle.length; i++) {
            if (this._aTriangle[i].getNumPieces() > 0) {
                oPiece = this._aTriangle[i].getLastPiece();
                if (oPiece.getColor() === BLACK_PIECE && oPiece.getStateListener()) {
                    aMoves = s_oGame.isPossibleMove(oPiece);
                    if (aMoves) {
                        for (var k = 0; k < aMoves.length - 1; k++) {
                            for (var j = 0; j < aMoves[k].length; j++) {
                                iPointsChoice = 0;

                                if (this._aTriangle[oPiece.getTriangle()].getNumPieces() < 3) {
                                    iPointsChoice-=3;
                                }
    
                                if (this._aTriangle[aMoves[k][j].iFocusTriangle].getNumPieces() === 1 && this._aTriangle[aMoves[k][j].iFocusTriangle].getColor() === BLACK_PIECE) {
                                    iPointsChoice+=3;
                                }
                                if (this._aTriangle[aMoves[k][j].iFocusTriangle].getNumPieces() === 1 && this._aTriangle[aMoves[k][j].iFocusTriangle].getColor() === WHITE_PIECE) {
                                    iPointsChoice+=5;
                                }
                                if (aMoves[k][j].iFocusTriangle < 13) {
                                    iPointsChoice++;
                                }
                                if (aMoves[k][j].iFocusTriangle > 13) {
                                    iPointsChoice--;
                                }
                                if (aMoves[k][j].iFocusTriangle > 11 && this._aTriangle[aMoves[k][j].iFocusTriangle].getNumPieces() === 1&&this._aTriangle[aMoves[k][j].iFocusTriangle].getColor()===WHITE_PIECE) {
                                    iPointsChoice+=4;
                                }
                                if (aMoves[k][j].iFocusTriangle < 11 && this._aTriangle[aMoves[k][j].iFocusTriangle].getNumPieces() === 1&&this._aTriangle[aMoves[k][j].iFocusTriangle].getColor()===WHITE_PIECE) {
                                    iPointsChoice--;
                                }
                                if (this._aTriangle[oPiece.getTriangle()].getNumPieces() === 1) {
                                    iPointsChoice++;
                                }
                                if (this._aTriangle[aMoves[k][j].iFocusTriangle].getNumPieces() === 1 && aMoves[k][j].iFocusTriangle < 13) {
                                    iPointsChoice++;
                                }
                                if (oPiece.getTriangle()>5&&aMoves[k][j].iFocusTriangle<=5){
                                    iPointsChoice+=5;
                                }
                                if (oPiece.getTriangle()<=5&&this._aTriangle[oPiece.getTriangle()].getNumPieces()<3){
                                    iPointsChoice-=10;
                                }
                                if (aMoves[k][j].iFocusTriangle<6&&this._aTriangle[aMoves[k][j].iFocusTriangle].getNumPieces()===0){
                                    iPointsChoice-=5;
                                }

                                if (oPiece.getTriangle()<=5){
                                    iPointsChoice -=4;
                                }

                                aPossibleChoices.push({oMove: aMoves[k][j], iPoints: iPointsChoice, oCurrentPiece: oPiece});
                            }
                        }
                            for (var j=0;j<aMoves[3].length;j++){
                                aPossibleChoices.push({oMove: aMoves[3][j], iPoints: 50, oCurrentPiece: oPiece});
                            }
                    }

                }

            }
        }
    };

    aPossibleChoices.sort(function (a, b) {
        return parseFloat(b.iPoints) - parseFloat(a.iPoints);
    });

    aPossibleChoices = this.cpuRemoveNotAllowedMoves(aPossibleChoices);

    this._oCurrentPiece = aPossibleChoices[0].oCurrentPiece;
    this._oCurrentPiece.setOnTop();
    s_oGame.onClickedTriangle(aPossibleChoices[0].oMove);


};

CGameBase.prototype.cpuRemoveNotAllowedMoves = function(aPossibleChoices){
    ////REMOVE NOT ALLOWED MOVES
    var aFilteredList = new Array();
    
    for(var i=0; i<aPossibleChoices.length; i++){
        var iTriangleSource = aPossibleChoices[i].oCurrentPiece.getTriangle();
        var oMove = aPossibleChoices[i].oMove;
        var szBrokenRule = this._oRuleFilter.checkForbiddenMoveInList(oMove, iTriangleSource, this._aRuleToCheck);
        
        if(szBrokenRule === RULE_BROKEN_NONE){
            aFilteredList.push(aPossibleChoices[i]);
        }
    };
    
    ////THERE IS A BUG WHERE WHEN THERE IS MORE THE ONE PIECE ON THE BAR, 
    ///CPU PREFER TO MOVE MORE TIMES THE FIRST PIECE HE MOVE OUT, INSTEAD TO REMOVE THE SECOND ON THE BAR. THIS VIOLATE THE RULE.
    ///THIS HAPPEN WHEN HE CAN CAPTURE ENEMY PIECE WITH THE SECOND DICE. WE SOLVE HERE REMOVING MOVES WITH A COST > 1;
    var iNumPiecesOnBar = this._aBar[BAR_DOWN].getNumPieces();
    if(iNumPiecesOnBar>0){
        for(var i=0; i<aFilteredList.length; i++){
            var oMove = aFilteredList[i].oMove;
            if(oMove.cost>1){
                aFilteredList.splice(i,1);
                i--;
            }
        };
    }
    
    
    return aFilteredList;
};

CGameBase.prototype.update = function(){
    if (s_oGame._oThinking){
        s_oGame._oThinking.update();
    }
};

CGameBase.prototype.getPieceByIndex = function(iIndex){    
    for(var i=0; i<this._aTmpPieces.length; i++){
        if(this._aTmpPieces[i].getIndex() === iIndex){
            return this._aTmpPieces[i];
        }
    };
};

CGameBase.prototype.getTriangles = function(){
    return this._aTriangle;
};

CGameBase.prototype.getBars = function(){
    return this._aBar;
};

CGameBase.prototype.getDiceResult = function(){
    return {dice1: this._iDice1, dice2: this._iDice2};
};

var s_oGame;