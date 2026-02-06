function CButMenu(iXPos,iYPos,oSprite,szText,szFont,szColor,iFontSize, oParentContainer){
    var _iScaleFactor;
    var _aCbCompleted;
    var _aCbOwner;
    var _oSpriteBg = oSprite;
    var _oButton;
    var _oText;
    var _oAlert = null;
    var _oListenerMouseDown;
    var _oListenerMouseUp;
    
    this._init =function(iXPos,iYPos,oSprite,szText,szFont,szColor,iFontSize, oParentContainer){
        _iScaleFactor = 1;
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        _oButton = new createjs.Container();
        _oButton.x = iXPos;
        _oButton.y = iYPos;
        _oButton.regX = oSprite.width/2;
        _oButton.regY = oSprite.height/2;
        oParentContainer.addChild(_oButton);
        
        _oButton.cursor = "pointer";
        
        var oButtonBg = createBitmap( oSprite);
        _oButton.addChild(oButtonBg);

        _oText = new CTLText(_oButton, 
                    90, 12, oSprite.width-110, oSprite.height-30, 
                    iFontSize, "center", szColor, szFont, 1.1,
                    0, 0,
                    szText.toUpperCase(),
                    true, true, true,
                    false );

        

        this._initListener();
    };
    
    this.unload = function(){
       _oButton.off("mousedown", _oListenerMouseDown);
       _oButton.off("pressup", _oListenerMouseUp);
       
       oParentContainer.removeChild(_oButton);
    };
    
    this.setVisible = function(bVisible){
        _oButton.visible = bVisible;
    };
    
    this._initListener = function(){
       oParent = this;

       _oListenerMouseDown = _oButton.on("mousedown", this.buttonDown);
       _oListenerMouseUp = _oButton.on("pressup" , this.buttonRelease);      
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.buttonRelease = function(){
        _oButton.scaleX = _iScaleFactor;
        _oButton.scaleY = _iScaleFactor;

        if(_aCbCompleted[ON_MOUSE_UP]){
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP]);
        }
    };
    
    this.buttonDown = function(){
        _oButton.scaleX = _iScaleFactor*0.9;
        _oButton.scaleY = _iScaleFactor*0.9;

       if(_aCbCompleted[ON_MOUSE_DOWN]){
           _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN]);
       }
    };

    this.changeText = function(szText){
        _oText.refreshText(szText);
    };
    
    this.setPosition = function(iXPos,iYPos){
         _oButton.x = iXPos;
         _oButton.y = iYPos;
    };
    
    this.setX = function(iXPos){
         _oButton.x = iXPos;
    };
    
    this.setY = function(iYPos){
         _oButton.y = iYPos;
    };
    
    this.setScale = function(iScale){
        _iScaleFactor = iScale;
        _oButton.scale = iScale;
    };
    
    this.addAlert = function(){
        _oAlert = new CAlertIcon(_oSpriteBg.width-10,10,"1",_oButton);
        _oAlert.pulseAnimation();
    };
    
    this.removeAlert = function(){
        if(_oAlert !== null){
            _oButton.removeChild(_oAlert);
        }
    };
    
    this.getButtonImage = function(){
        return _oButton;
    };

    this.getX = function(){
        return _oButton.x;
    };
    
    this.getY = function(){
        return _oButton.y;
    };

    this._init(iXPos,iYPos,oSprite,szText,szFont,szColor,iFontSize, oParentContainer);
    
    return this;
    
}
