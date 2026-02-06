function CTimeout(){
    var _bPlaying;

    var _iId;
    var _iStart;
    var _iRemainingTime;

    var _cbCompleted;
    var _oCbOwner;
    var _aParams;

    var _oThis = this;

    this._init = function(){
        _bPlaying = false;
    };
    
    this.start = function(cbCompleted,oCbOwner,iTime,aParams){
        if(_bPlaying){
            this.clear();
        }

        _cbCompleted = cbCompleted;
        _oCbOwner = oCbOwner;
        _aParams = aParams;

        _bPlaying = true;

        _iRemainingTime = iTime;

        this.resume();
    };

    this._onEndTimeout = function(){
        this.clear();
    };

    this.isPlaying = function(){
        return _bPlaying;
    };

    this.clear = function(){
        if(_iId){
            clearTimeout(_iId);
            _iId = null;
        }

        _bPlaying = false;
    };

    this.pause = function(){
        clearTimeout(_iId);
        _iId = null;
        _iRemainingTime -= Date.now() - _iStart;
    };

    this.resume = function(){
        if (_iId || !_bPlaying) {
            return;
        }

        _iStart = Date.now();
        _iId = setTimeout(function(){
            _oThis._onEndTimeout();
            _cbCompleted.apply(_oCbOwner,_aParams);
        }, _iRemainingTime);
    };

    this._init();
}