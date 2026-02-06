function CMenu(){
    var _iIdTimeout;
    var _oBg;
    var _oButLocal;
    var _oFade;
    var _oAudioToggle;
    var _oCreditsBut;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    var _pStartPosCredits;
    var _pStartPosAudio;
    var _pStartPosFullscreen;
    var _pStartPosButLocal;
    
    this._init = function(){
        s_b2Players = false;

        _oBg = createBitmap(s_oSpriteLibrary.getSprite("bg_menu"));
        s_oStage.addChild(_oBg);

        
        _pStartPosButLocal = {x: (CANVAS_WIDTH/2), y: CANVAS_HEIGHT -100};
        var oSprite = s_oSpriteLibrary.getSprite('but_play');
        _oButLocal = new CGfxButton(_pStartPosButLocal.x,_pStartPosButLocal.y,oSprite, s_oStage);
        _oButLocal.addEventListener(ON_MOUSE_UP, this._onButLocalRelease, this);


        var oSprite = s_oSpriteLibrary.getSprite('but_info');
        _pStartPosCredits = {x: (oSprite.width/2) + 10, y: (oSprite.height/2) + 10};            
        _oCreditsBut = new CGfxButton((CANVAS_WIDTH/2),CANVAS_HEIGHT -240,oSprite, s_oStage);
        _oCreditsBut.addEventListener(ON_MOUSE_UP, this._onCreditsBut, this);
     
       
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: CANVAS_WIDTH - (oSprite.width/4)-10, y: (oSprite.height/2) + 10};            
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive, s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);          
            
        }
        
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }

        if (_fRequestFullScreen && screenfull.isEnabled){
            oSprite = s_oSpriteLibrary.getSprite("but_fullscreen")
            _pStartPosFullscreen = {x:_pStartPosCredits.x + oSprite.width/2 + 5,y:(oSprite.height/2) + 10};
            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen, s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP,this._onFullscreen,this);
        }
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        s_oStage.addChild(_oFade);

        createjs.Tween.get(_oFade).to({alpha:0}, 1000).call(function(){_oFade.visible = false;});  

        
        this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
    };
    
    this.unload = function(){

        _oButLocal.unload(); 
        _oButLocal = null;

        _oFade.visible = false;
        
        _oCreditsBut.unload();
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
                _oButFullscreen.unload();
        }
        
        s_oStage.removeChild(_oBg);
        _oBg = null;
        s_oMenu = null;
    };
    
    this.refreshButtonPos = function(iNewX,iNewY){
        _oButLocal.setPosition(_pStartPosButLocal.x,_pStartPosButLocal.y - iNewY);
        
        _oCreditsBut.setPosition(_pStartPosCredits.x + iNewX,iNewY + _pStartPosCredits.y);
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        }
        if (_fRequestFullScreen && screenfull.isEnabled){
                _oButFullscreen.setPosition(_pStartPosFullscreen.x + iNewX, _pStartPosFullscreen.y + iNewY);
        }
    };
 
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onCreditsBut = function(){
        new CCreditsPanel();
    };
    
    this.resetFullscreenBut = function(){
	if (_fRequestFullScreen && screenfull.isEnabled){
		_oButFullscreen.setActive(s_bFullscreen);
	}
    };

    this._onFullscreen = function(){
        if(s_bFullscreen) { 
		_fCancelFullScreen.call(window.document);
	}else{
		_fRequestFullScreen.call(window.document.documentElement);
	}
	
	sizeHandler();
    };

    this._onButLocalRelease = function(){
        
        this.unload();

        s_bPlayWithBot = false;
        
        document.dispatchEvent(new CustomEvent("start_session"));

        s_oMain.gotoSelectPlayers();
    };

    this.clearBotCheck = function(){
        clearTimeout(_iIdTimeout);
    };
    
    s_oMenu = this;
    
    this._init();
}

var s_oMenu = null;