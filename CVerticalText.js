function CVerticalText(iX, iY, szText, oParentContainer) {
    var _iCurScale;
    var _iTargetDim = 190;
    
    var _oTextContainer;
    var _oText;

    this._init = function (iX, iY, szText, oParentContainer) {
        _iCurScale = 1;
        
        _oTextContainer = new createjs.Container();
        _oTextContainer.x = iX;
        _oTextContainer.y = iY;
        //_oTextContainer.scaleX = _oTextContainer.scaleY = 0.5;
        oParentContainer.addChild(_oTextContainer);
        
        this._buildText();
        
    };

    this.unload = function () {
        
    };

    this._buildText = function(){
        for(var i=0; i<szText.length; i++){
            _oText = new createjs.Text(szText[i], "60px " + PRIMARY_FONT, "#3d1f00");
            _oText.y += i*50;
            _oText.textBaseline = "top";
            _oText.textAlign = "center";
            _oText.lineWidth = 100;
            _oTextContainer.addChild(_oText);
        }
        
        var iCurDim = _oTextContainer.getBounds().height;
        
        if(iCurDim > _iTargetDim){
            _oTextContainer.scale = _iTargetDim/iCurDim;
        }
        
        _iCurScale = _oTextContainer.scale;
    };

    this.getCurScale = function(){
        return _iCurScale;
    };

    this.setScale = function(iScale){
        _iCurScale = iScale;
        
        _oTextContainer.scale = _iCurScale;
    };

    this.setY = function(iY){
        _oTextContainer.y = iY;
    };

    this.getHeight = function(){
        return _oTextContainer.getBounds().height*_iCurScale;
    };

    this.center = function(){
        var iCurY = _oTextContainer.y;
                
        iCurY += _iTargetDim/2 - this.getHeight()/2;
        
        this.setY(iCurY);
    };

    this._init(iX, iY, szText, oParentContainer);
}