
//1）、先看项目中有哪些类（属性和方法）
class Banner{
    //构造函数
    constructor(obj){
        //默认值
        let defaultObj = {
            //轮播图的容器
            boxDom :null,
            //图片的容器
            imgBox :null,
            //豆豆的容器
            douBox :null,
            //上一张
            // last:null,
            //下一张
            // next:null,
            "type":"fade",//淡入淡出(fade)，滑入滑出(slide)；
            "width":400,
            "height":300,
            "imgs":["img/1.jpg","img/2.jpg","img/3.jpg"],
            //豆豆的大小
            "douSize" :10,
            //豆豆的颜色:
            "douColor":"white",
            //豆豆的高亮颜色
            "douHighColor":"red",
            //豆豆是不是圆的
            "iscircle":true,
            "timeSpace":2000,
            "currIndex":0,//当前显示的图片的下标。
            "myTimer" :null,
        }
        for(let key in defaultObj){
            this[key] = (obj[key]==undefined?defaultObj[key]:obj[key]);
        } 
         //1、自动播放
 
        this.render();//动态创建dom
        this.addEvent();//增加事件
        this.autoPlay();
        // this.to_last();
        // this.to_next();
    }

    //创建UI
    render(){
        this.boxDom.style.position = "relative";//容器设为相对定位
        this.boxDom.style.overflow ="hidden";//溢出隐藏
        //1、创建图片
        //  1)、创建图片容器
        this.imgBox = document.createElement("div");//创建一个div盒子准备放图片
        this.imgBox.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;`;
        this.boxDom.appendChild(this.imgBox);
        //  2)、创建图片
        for(let i in this.imgs){
            let imgDom = document.createElement("img");//根据图片数创建img
            imgDom.src = this.imgs[i];//放图片
            imgDom.style.cssText = `
                position: absolute;
                width: 100%;
                height: 100%;
            `;
            //针对不同类型的轮播效果，设置不同的初始样式
            switch(this.type){
                case "fade":{
                    imgDom.style.opacity = 0;
                    if(i==0){
                        imgDom.style.opacity = 1;
                    }
                }break;
                case "slide":{
                    imgDom.style.left =`${this.width}px`;
                    if(i==0){
                        imgDom.style.left = "0px";
                    }
                }break;
            }
            this.imgBox.appendChild(imgDom);
        }
        //2、豆豆
        //   1)、创建豆豆容器
        this.douBox = document.createElement("ul");
        this.douBox.style.cssText = `
            position: absolute;            
            list-style: none;
            right: 30px;
            bottom:25px;
            z-index: 1;
            `;
        this.boxDom.appendChild(this.douBox);
        //   2)、创建豆豆
        for(let i in this.imgs){
           let liDom = document.createElement("li");
           liDom.style.cssText = `
            float: left;
            width: ${this.douSize}px;
            height: ${this.douSize}px;
            background-color: ${this.douColor};
            margin-left: ${this.douSize*2}px;
            box-shadow:0 0 5px #fff, 0 0 10px #fff, 0 0 20px #fff,0 0 40px #fff;
           `;
           if(this.iscircle==true){
               liDom.style.borderRadius = "50%";
           }
           if(i==0){
               liDom.style.backgroundColor=this.douHighColor;
           }
           this.douBox.appendChild(liDom);
        }
        //  3)、创建左右键
        for(let i=0;i<2;i++){
            let lastOrNext = document.createElement("div");
            let lastOrNextImg = document.createElement("img");
            if(i==0){
                lastOrNext.style.cssText = `
                width: 34px;
                height: 68px;
                z-index: 1;
                opacity: 0.3;
                position: absolute;
                top: 40%;
                display:none;
                background-color: #000;
                opacity: 0.3;`;
                lastOrNextImg.src = "img/rotation_last.png";
            }
            if(i==1){
                lastOrNext.style.cssText = `
                width: 34px;
                height: 68px;
                z-index: 1;
                opacity: 0.3;
                position: absolute;
                top: 40%;
                display:none;
                right:0px;
                background-color: #000;
                opacity: 0.3;`;
                lastOrNextImg.src = "img/rotation_next.png";
            }
            lastOrNextImg.style.cssText =`margin-left:25%;margin-top:50%;background-position:100%;`;
            lastOrNext.appendChild(lastOrNextImg);
            this.boxDom.appendChild(lastOrNext);
        }
    }


    addEvent(){
        //2、鼠标事件
        let lastOrNextBox = this.boxDom.children;
        this.boxDom.onmouseenter = ()=>{
            this.stopPlay();//2、鼠标放入停止轮播
            for(let i=1;i<lastOrNextBox.length;i++){
                if(lastOrNextBox[i].tagName.toLowerCase()=="div"){
                    lastOrNextBox[i].style.display = "block";//2、鼠标放入显示两个左右标
                }
            }
        }
        this.boxDom.onmouseleave = ()=>{
            for(let i=1;i<lastOrNextBox.length;i++){
                if(lastOrNextBox[i].tagName.toLowerCase()=="div"){
                    lastOrNextBox[i].style.display = "none";//2、鼠标移除隐藏两个左右标
                }
            }
        }
        
        lastOrNextBox[2].onclick = ()=>{//点击last按钮显示上一张
            this.stopPlay();
            if(this.currIndex==0){
                this.goImg(this.imgs.length-1);
            }else{
                this.goImg(this.currIndex-1);
            }
        }
        lastOrNextBox[2].onmouseenter = ()=>{
            this.stopPlay();//鼠标放入停止轮播
        }
        lastOrNextBox[3].onmouseenter = ()=>{
            this.stopPlay();//鼠标放入停止轮播
        }

        lastOrNextBox[3].onclick = ()=>{//点击next按钮显示上一张
            this.stopPlay();
            this.goImg(this.currIndex+1);
        }

        //3、鼠标离开继续播放
        this.boxDom.onmouseout = ()=>{
            this.autoPlay();
        }

        //4、点击按钮跳转到指定的图片
        let liDoms = this.douBox.children;
        for(let i=0;i<liDoms.length;i++){
            liDoms[i].onclick = ()=>{
                this.goImg(i);
            }
        }
    }
   
    autoPlay(){
        if(this.myTimer!=null){//已经启动过定时器
            return;
        }
        this.myTimer = setInterval(()=>{
            this.goImg(this.currIndex+1);
        },this.timeSpace);
    }
    // to_next(){
    //     this.goImg(this.currIndex+1);
    // }
    // to_last(){
    //     this.goImg(this.currIndex-1);
    // }
    
    //2、停止播放
    stopPlay(){
        window.clearInterval(this.myTimer);
        this.myTimer = null;
    }

    //4、跳转到指定的图片上
    goImg(ord){
    //一、数据处理
        //1、改变数据
        let outIndex = this.currIndex;
        this.currIndex = ord;
        //2、边界处理
        if(this.currIndex>this.imgs.length-1){
            this.currIndex=0;
        }
        //二、外观呈现
        this.showImg(outIndex,this.currIndex);
    }
    
    showImg(outIndex,currIndex){
        let imgDoms = this.imgBox.children;    
    
        switch(this.type){
            case "fade": this.fadeInOut(imgDoms[outIndex],imgDoms[currIndex],this.timeSpace/3);break;
            case "slide": this.silderInOut(imgDoms[outIndex],imgDoms[currIndex],this.timeSpace/3);break;
        }
      
        let liDoms = this.douBox.children;
        liDoms[outIndex].style.backgroundColor= this.douColor;
        liDoms[currIndex].style.backgroundColor= this.douHighColor;
    }

    
    //两张图片的滑入滑出效果
    silderInOut(outImg,inImg,timeLong){
        //1、把将要进入的图片的位置放在盒子的右边
        inImg.style.left = this.width+"px";
        //2、右移
        let timeSpace = 10;
        let left = 0;
        var step = this.width/(timeLong/timeSpace);

        let myTimer = setInterval(()=>{
            left-=step;
            if(left<=-this.width){
                left = -this.width;
                window.clearInterval(myTimer);
            }
            outImg.style.left = left+"px";
            inImg.style.left = (left+this.width)+"px";
        },timeSpace);
    }
    //两张图片的淡入淡出效果
    fadeInOut(outImg,inImg,timeLong){
        var opacity1 = 0;
        var timeSpace = 10;
        var step = 1/(timeLong/timeSpace);
        var myTimer =  setInterval(function(){
            opacity1+=step;
            if(opacity1>=1){
                opacity1 = 1;
                window.clearInterval(myTimer);
            }
            inImg.style.opacity = opacity1;
            outImg.style.opacity = 1-opacity1;
        },timeSpace)
    }
   
}

function $(str){
    if(str[0]=="#"){
        return document.getElementById(str.substring(1));
    }else if(str[0]=="."){
        return document.getElementsByClassName(str.substring(1));
    }else{
        return document.getElementsByTagName(str);
    }
}
