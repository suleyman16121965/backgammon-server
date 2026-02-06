// V2.4
/*    
    bug fix: override rolling animation
        this will remove any existing roll-tweens before start another one
            (e.g. player chain game score points very quickly)

    Added setHorizontalAlign function
*/

// V2.3
/* 
    Bug fix: Text not updating correctly when autofit wasn't enabled
*/

// V2.2
/* 
    Added CRollingScore
    Optimized __autofit
*/

//  V2.1
/* 
    Added "text-overflow: ellipsis" option;
    Added container for CTLText'S DisplayObjects;
    Added stroke;
    Added padding debugshape;
    Added iMinTextSize;
*/




CTLText.prototype = {
    
    constructor : CTLText,
    
    __autofit : function(){
        var szMsg = this._szMsg;
        var bEllipsis = szMsg.length < 3?false:this._bEllipsis;

        if(!bEllipsis && !this._bMultiline){
            this.__autofitLight();
            return;
        }

        var iEndSliceIndex = szMsg.length-2;
        var iFontSize = this._iStartingFontSize; 

        this.__refreshTextFont(iFontSize);

        var oTextBounds = this._oText.getBounds();
        while(
            oTextBounds.height+this._iOutline > this._iEffectiveHeight ||
            oTextBounds.width+this._iOutline > this._iEffectiveWidth                
        ){
            
            if(bEllipsis && iFontSize < this._iMinTextSize){
                iEndSliceIndex--;
                this._oText.text = szMsg.slice(
                    0,iEndSliceIndex
                )+"...";

                this.__updateY();        
                this.__verticalAlign();    

                if(iEndSliceIndex == 1){
                    break;
                };
            }else{
                iFontSize--;
                this.__refreshTextFont(iFontSize); 

                this.__updateY();        
                this.__verticalAlign();    

                if ( iFontSize < this._iMinTextSize && !bEllipsis){
                    break;
                }
            }

            oTextBounds = this._oText.getBounds();
        };

        this._iFontSize = iFontSize;

        this.__updateY();        
        this.__verticalAlign();    
        this.__updateStroke();
    },

    __checkAutofit : function(){
        if (this._bFitText) {
            this.__autofit();
        }else{
            this.__updateY();        
            this.__verticalAlign();    
            this.__updateStroke();
        }
    },

    __autofitLight : function(){
        this.__refreshTextFont(this._iStartingFontSize);

        var iFontSize = Math.floor(linearFunction(
            this._iEffectiveWidth,
            this._oText.getBounds().width+this._iOutline, 0,
            this._iStartingFontSize, 0
        ));

        if(iFontSize>this._iStartingFontSize){
            iFontSize = this._iStartingFontSize;
        }else if(iFontSize < this._iMinTextSize){
            iFontSize = this._iMinTextSize;
        }

        this.__refreshTextFont(iFontSize);

        this._iFontSize = iFontSize;

        this.__updateY();        
        this.__verticalAlign();    
        this.__updateStroke();
    },
    
    __refreshTextFont : function(iFontSize){
        this._oText.font = iFontSize+"px "+this._szFont;
        this._oText.lineHeight = Math.round(iFontSize*this._fLineHeightFactor);
    },

    __verticalAlign : function(){
        if(this._bVerticalAlign){
            var iCurHeight = this._oText.getBounds().height;          
            this._oText.y -= (iCurHeight-this._iHeight)/2 + (this._iPaddingV);  
        }        
    },

    __updateY : function(){

        this._oText.y = this._iPaddingV;

        switch(this._oText.textBaseline){
            case "middle":{
                this._oText.y += (this._oText.lineHeight/2) +
                                 (this._iFontSize*this._fLineHeightFactor-this._iFontSize);                    
            }break;
        }
    },

    __updateStroke : function(){
        if(this._oStroke){
            this._oStroke.x = this._oText.x;
            this._oStroke.y = this._oText.y;
            this._oStroke.text = this._oText.text;
            this._oStroke.font = this._oText.font;
            this._oStroke.lineHeight = this._oText.lineHeight;
        }
    },

    __updateOutline : function(){
        if(this._oStroke && this._oStroke.outline > this._oText.outline){
            this._iOutline = this._oStroke.outline;
        }else{
            this._iOutline = this._oText.outline;
        }
    },

    __updateHorizontalAlign : function(){
        switch(this._szAlign){
            case "center":{
                this._oText.x = (this._iWidth/2);
            }break;
            case "left":{
                this._oText.x = this._iPaddingH;
            }break;   
            case "right":{
                this._oText.x = this._iWidth-this._iPaddingH;
            }break;       
        }
    },

    __createText : function(szMsg){
        
        
        if (this._bDebug){
            this._oDebugShape = new createjs.Shape();
            this._oDebugShape.graphics
            .beginFill("rgba(255,130,0,0.5)")
            .drawRect(0, 0, this._iWidth, this._iHeight)
            .moveTo(this._iPaddingH,this._iHeight-this._iPaddingV)
            .lineTo(this._iWidth-this._iPaddingH,this._iHeight-this._iPaddingV)
            .lineTo(this._iWidth-this._iPaddingH,this._iPaddingV)
            .lineTo(this._iPaddingH,this._iPaddingV)
            .closePath()
            .beginFill("rgba(255,0,0,0.5)")
            .drawRect(
                this._iPaddingH,
                this._iPaddingV,
                this._iEffectiveWidth,
                this._iEffectiveHeight
            );
            this._oContainer.addChild(this._oDebugShape);
        }

        this._oText = new createjs.Text(szMsg, this._iFontSize+"px "+this._szFont, this._szColor);
        this._oText.textBaseline = "middle";
        this._oText.lineHeight = Math.round(this._iFontSize*this._fLineHeightFactor);
        this._oText.textAlign = this._szAlign;
        
        
        if ( this._bMultiline ){
            this._oText.lineWidth = this._iWidth - (this._iPaddingH*2);
        }else{
            this._oText.lineWidth = null;
        }
        
        this.__updateHorizontalAlign();

        this._oContainer.addChild(this._oText);  
        
        //this._oContainer.cache(0, 0, this._iWidth, this._iHeight);
        
        this.refreshText(szMsg);
    },  

    setStroke : function(iSize,szColor){
        if (!this._oStroke){
            this._oStroke = this._oText.clone();
            this._oContainer.addChild(this._oStroke);

            this._oContainer.swapChildren(this._oStroke,this._oText);
        }

        this.setStrokeColor(szColor?szColor:this._szStrokeColor);
        this.setStrokeSize(iSize?iSize:this._iStrokeSize);
    },

    setStrokeColor : function(szColor){
        this._szStrokeColor = szColor;
        if (this._oStroke){
            this._oStroke.color = this._szStrokeColor;
        }
    },

    setStrokeSize : function(iSize){
        this._iStrokeSize = iSize;
        if (this._oStroke){
            this._oStroke.outline = this._iStrokeSize;

            this.__updateOutline();
            
            this.__checkAutofit();
        }
    },

    removeStroke : function(){
        if(this._oStroke){
            this._oContainer.removeChild(this._oStroke);
            this._oStroke = null;
            
            this.__updateOutline();

            this.__checkAutofit();
        }
    },

    roll : function(iScore,iTime,ease,cbCompleted,cbOwner,aParams){
        iTime = iTime==null?1500:iTime;
        ease = ease==null?createjs.Ease.linear:ease;

        if(this._oText){
            var oRollingScore = {score:parseInt(this._szMsg)};
            this._szMsg = iScore;

            var oCbChange;
            if(this._bFitText){
                oCbChange = function(){
                    this._oText.text = Math.floor(oRollingScore.score);
                    this.__autofitLight();
                };
            }else{
                oCbChange = function(){
                    this._oText.text = Math.floor(oRollingScore.score);
                    this.__updateY();        
                    this.__verticalAlign();    
                    this.__updateStroke();
                };
            }
            
            this.stopRolling();

            this._oTweenRollText = createjs.Tween.get(oRollingScore, {override:true})
            .to({score: iScore}, iTime, ease);

            this._oTweenRollText.on("change",oCbChange,this);
            this._oTweenRollText.on("complete",function(){
                
                if(cbCompleted){
                    cbCompleted.apply(cbOwner,aParams);
                }

                this.stopRolling();
            },this,true);
        }
    },

    isRolling : function(){
        return this._oTweenRollText == null?false:true;
    },

    stopRolling : function(){
        if (this.isRolling()) {
            this._oTweenRollText.removeAllEventListeners();
            this._oTweenRollText.paused = true;
            this._oTweenRollText = null;
        }
    },

    pauseRolling : function(){
        if (this.isRolling()) {
            this._oTweenRollText.paused = true;
        }
    },
    
    resumeRolling: function(){
        if (this.isRolling()) {
            this._oTweenRollText.paused = false;
        }
    },

    setY : function(iNewY){
        this._oContainer.y = iNewY;
    },

    setX : function(iNewX){
        this._oContainer.x = iNewX;
    },
    
    setPosition : function(iNewX, iNewY){
        this._oContainer.x = iNewX;
        this._oContainer.y = iNewY;
        
        //this._oContainer.updateCache();
    },
    
    setHorizontalAlign : function(szAlign){
        this._szAlign = szAlign;
        this._oText.textAlign = this._szAlign;
        
        this.__updateHorizontalAlign();
    },
    
    setVerticalAlign : function( bVerticalAlign ){
        this._bVerticalAlign = bVerticalAlign;
    },
    
    setOutline : function(iSize){
        if (this._oText){
            this._oText.outline = iSize;

            this.__updateOutline();
        }
    },
    
    setShadow : function(szColor,iOffsetX,iOffsetY,iBlur){
        if (this._oText){
            this._oText.shadow = new createjs.Shadow(szColor, iOffsetX,iOffsetY,iBlur);
        }
    },
    
    setColor : function(szColor){
        this._szColor = szColor;
        this._oText.color = this._szColor;
    },
    
    setAlpha : function(iAlpha){
        this._oContainer.alpha = iAlpha;
    },

    setVisible : function(bVisible){
        this._oContainer.visible = bVisible;
    },

    setFontSize : function(iSize){
        this._iFontSize = this._iStartingFontSize = iSize;

        this.refreshText(this._szMsg);
    },

    setRegX : function(iRegX){
        this._oContainer.regX = iRegX;
    },

    setRegY : function(iRegY){
        this._oContainer.regY = iRegY;
    },
    
    removeTweens : function(){
        createjs.Tween.removeTweens(this._oContainer);
    },
    
    getText : function(){
        return this._oText;
    },

    getTextWidth : function(){
        return this._oText.getBounds().width+this._iOutline;
    },

    getTextHeight : function(){
        return this._oText.getBounds().height+this._iOutline;
    },
    
    getMsg : function(){
        return this._szMsg;
    },
    
    getX : function(){
        return this._oContainer.x;
    },
    
    getY : function(){
        return this._oContainer.y;
    },

    getHeight : function(){
        return this._iHeight;
    },
    
    getWidth : function(){
        return this._iWidth;
    },

    getColor : function(){
        return this._szColor;
    },
    
    getFontSize : function(){
        return this._iFontSize;
    },

    getContainer : function(){
        return this._oContainer;
    },

    unload : function(){
        this.stopRolling();

        createjs.Tween.removeTweens(this._oContainer);
        this._oParentContainer.removeChild(this._oContainer);
    },
    
    refreshText : function(szMsg){   
        this._szMsg = szMsg;
    
        if(this._szMsg === ""){
            this._szMsg = " ";
        }
        if ( this._oText === null ){
            this.__createText(this._szMsg);
        }

        this._oText.text = this._szMsg;

        this.__refreshTextFont(this._iStartingFontSize);
        
        this.__checkAutofit();
    }
}; 

function CTLText( oParentContainer, 
                    x, y, iWidth, iHeight, 
                    iFontSize, szAlign, szColor, szFont,iLineHeightFactor,
                    iPaddingH, iPaddingV,
                    szMsg, 
                    bFitText, bVerticalAlign, bMultiline, 
                    bDebug, 
                    iMinTextSize = 11, bEllipsis = true){

    this._oParentContainer = oParentContainer;

    this._oContainer = new createjs.Container();
    this._oContainer.x = x;
    this._oContainer.y = y;
    this._oParentContainer.addChild(this._oContainer);

    this._iOutline = 0;

    this._iWidth  = iWidth;
    this._iHeight = iHeight;
    
    this._bMultiline = bMultiline;

    this._iFontSize = iFontSize;
    this._iStartingFontSize = iFontSize;
    this._szAlign   = szAlign;
    this._szColor   = szColor;
    this._szFont    = szFont;

    this._iPaddingH = iPaddingH;
    this._iPaddingV = iPaddingV;

    this._iEffectiveWidth = this._iWidth-this._iPaddingH*2;
    this._iEffectiveHeight = this._iHeight-this._iPaddingV*2;

    this._bVerticalAlign = bVerticalAlign;
    this._bFitText       = bFitText;
    this._iMinTextSize   = iMinTextSize;
    this._bDebug         = bDebug;
    // this._bDebug         = true;

    this._bEllipsis = bEllipsis;

    // RESERVED
    this._oDebugShape = null; 
    this._fLineHeightFactor = iLineHeightFactor;
    
    this._oText = null;
    if ( szMsg ){
        this.__createText(szMsg);
    }
}