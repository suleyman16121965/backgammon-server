function CThinking(){
    var _bStart;
    
    var _iTimeElaps;
    
    var _oGroup;
    var _oText;
    var _oTextDots;
    var _oRect;
    var _oListener;
    
    this._init = function(){
        _bStart = true;
      
        _iTimeElaps=0;
      
        _oGroup = new createjs.Container();
        
       var graphics = new createjs.Graphics().beginFill("rgba(0,0,0,0.01)").drawRect(250, 120, CANVAS_WIDTH-500, CANVAS_HEIGHT-240);
        _oRect = new createjs.Shape(graphics);
        _oListener = _oRect.on("click", function(){});
  /*
        _oText = new createjs.Text(TEXT_THINKING,"60px "+PRIMARY_FONT, "#ffffff");
        _oText.x = CANVAS_WIDTH*0.5;
        _oText.y = CANVAS_HEIGHT*0.5 -100;
        _oText.textAlign = "center";
        _oText.textBaseline = "alphabetic";
        _oText.lineWidth = 800;          
 */
        _oTextDots = new createjs.Text("","180px "+PRIMARY_FONT, "#ffffff");
        _oTextDots.x = 10+s_iOffsetX;
        _oTextDots.y = CANVAS_HEIGHT-10-s_iOffsetY;
        _oTextDots.textAlign = "left";
        _oTextDots.textBaseline = "alphabetic";
        _oTextDots.lineWidth = 800;     
        
        _oGroup.addChild(_oRect, _oText, _oTextDots);
        
        s_oStage.addChild(_oGroup);
    };
    
    this.unload = function(){
        _bStart =false;
        _oRect.off("click", _oListener);
        s_oStage.removeChild(_oGroup);
    };
    
    this.isShown = function(){
        return _oGroup.visible;
    };
    
    this.show = function(){
        this.refreshPos();
        
        _oGroup.visible = true;
    };
    
    this.refreshPos = function(){
        _oTextDots.x = 10+s_iOffsetX;
        _oTextDots.y = CANVAS_HEIGHT-10-s_iOffsetY;
    };

    this.hide = function(){
        _oGroup.visible = false;
    };
    
    this.setMessage = function(szMsg){
        //_oText.text = szMsg;
    };
    
    this.update = function(){
        if(_bStart){
            _iTimeElaps += s_iTimeElaps;
        
            if(_iTimeElaps >= 0 && _iTimeElaps < TIME_LOOP_WAIT/4){
                _oTextDots.text = "";
            } else if (_iTimeElaps >= TIME_LOOP_WAIT/4 && _iTimeElaps < TIME_LOOP_WAIT*2/4){
                _oTextDots.text = ".";
            } else if (_iTimeElaps >= TIME_LOOP_WAIT*2/4 && _iTimeElaps < TIME_LOOP_WAIT*3/4){
                _oTextDots.text = "..";
            } else if (_iTimeElaps >= TIME_LOOP_WAIT*3/4 && _iTimeElaps < TIME_LOOP_WAIT){
                 _oTextDots.text = "...";
            } else {
                _iTimeElaps = 0;
            }
                
        }
    };
    
    this._init();
    
}; 
