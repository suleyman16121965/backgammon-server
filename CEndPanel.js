function CEndPanel(oSpriteBg){
    
    var _oBg;
    var _oGroup;
    
    var _oMsgText;
    var _oScoreText;
    var _iEventToLaunch;
    var _iScore;
    var _oButRestart;
    var _oButHome;
    var _iWinner;
    var _oEndSound;
    var _aCbCompleted;
    var _aCbOwner;
    
    this._init = function(oSpriteBg){
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        _oGroup = new createjs.Container();
        _oGroup.alpha = 0;
        _oGroup.visible=false;
        s_oStage.addChild(_oGroup);
        
        var oShape = new createjs.Shape();
        oShape.graphics.beginFill("#000").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        oShape.alpha = 0.5;
        oShape.on("mousedown",this.onMouseDown,this);
        _oGroup.addChild(oShape);
        
        _oBg = createBitmap(oSpriteBg);
        var oBgInfo = _oBg.getBounds();
        _oBg.regX = oBgInfo.width/2;
        _oBg.regY = oBgInfo.height/2;
        _oBg.x = CANVAS_WIDTH/2;
        _oBg.y = CANVAS_HEIGHT/2;
        _oGroup.addChild(_oBg);


        var iWidth = oSpriteBg.width-50;
        var iHeight = oSpriteBg.height-200;
        var iX = CANVAS_WIDTH/2;
        var iY = (CANVAS_HEIGHT/2)-90;
        _oMsgText = new CTLText(_oGroup, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    54, "center", FONT_COLOR, PRIMARY_FONT, 1.1,
                    2, 2,
                    " ",
                    true, true, true,
                    false 
        );

        var iWidth = oSpriteBg.width-50;
        var iHeight = 40;
        var iX = CANVAS_WIDTH/2;
        var iY = (CANVAS_HEIGHT/2+20);
        _oScoreText = new CTLText(_oGroup, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    37, "center", FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    " ",
                    true, true, false,
                    false 
        );
        
        var oSprite = s_oSpriteLibrary.getSprite("but_restart");
        _oButRestart = new CGfxButton(CANVAS_WIDTH/2+100,CANVAS_HEIGHT/2+110,oSprite,_oGroup);
        
        oSprite = s_oSpriteLibrary.getSprite("but_home");
        _oButHome = new CGfxButton(CANVAS_WIDTH/2-100,CANVAS_HEIGHT/2+110,oSprite,_oGroup);
        
        this.hide();
    };
   
    
    this.unload = function(){
        s_oStage.removeChild(_oGroup);
        _oButRestart.unload();
        _oButHome.unload();
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.onMouseDown = function(){
        
    };
    
    this._initListener = function(){
        _oButHome.addEventListener(ON_MOUSE_DOWN,this._onExit,this);
        _oButRestart.addEventListener(ON_MOUSE_DOWN,this._onRestart, this);
    };

    this.show = function(szMsgText,iScore,iWinner){
        this.resetPosHomeButton();

        _iWinner = iWinner;

        if (iWinner===0||s_b2Players){
            _oEndSound = playSound("win",1,false);
        }else{
            _oEndSound =  playSound("game_over",1,false);
        }
        _iScore = iScore;
        
        _oMsgText.refreshText(szMsgText);
        _oScoreText.refreshText("");

        _oScoreText.refreshText( TEXT_SCORE +": "+iScore );
        
        
        _oGroup.visible = true;
        
        var oParent = this;
        createjs.Tween.get(_oGroup).to({alpha:1 }, 500).call(function() {oParent._initListener();});
        
        document.dispatchEvent(new CustomEvent("save_score", {detail: { score: _iScore } }));
        document.dispatchEvent(new CustomEvent("end_session"));
    };
    
    this.hide = function(){
        _oGroup.visible = false;                                                     
    };
    
    this.hideRestartButton = function(){
        _oButRestart.setVisible(false);

        _oButRestart.removeTweens();
    };
    
    this.hideButtons = function(){
        _oButHome.setVisible(false);
        _oButRestart.setVisible(false);

        _oButRestart.removeTweens();
    };
    
    this.showButtons = function(){
        _oButHome.setVisible(true);
        _oButRestart.setVisible(true);
    };
    
    this.changeMessage = function(szMsg){
        _oMsgText.refreshText( szMsg );
    };
    
    this.centerHomeButton = function(){
        var oSpriteBg = s_oSpriteLibrary.getSprite("msg_box");
        _oButHome.setX(CANVAS_WIDTH/2);
        _oButHome.setVisible(true);
    };

    this.resetPosHomeButton = function(){
        _oButHome.setX(CANVAS_WIDTH/2-100);
    };
    
    this.notifyRestart = function(szMsg){
        _oScoreText.refreshText(szMsg);
        _oButRestart.trembleAnimation();
    };
    
    this._onExit = function(){
        if(_oEndSound){
            _oEndSound.stop();
        }
        _iEventToLaunch = ON_BACK_MENU;
        if(_aCbCompleted[_iEventToLaunch]){
            _aCbCompleted[_iEventToLaunch].call(_aCbOwner[_iEventToLaunch]);
        }
    };
    
    this._onRestart = function(){
        document.dispatchEvent(new CustomEvent("show_interlevel_ad"));
        if(_oEndSound){
            _oEndSound.stop();
        }
        _iEventToLaunch = ON_RESTART;
        if(_aCbCompleted[_iEventToLaunch]){
            _aCbCompleted[_iEventToLaunch].call(_aCbOwner[_iEventToLaunch]);
        }
    };
    
    
    this._init(oSpriteBg);
    
    return this;
}
