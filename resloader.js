'use strict';
// checks the value is an object or not
// return 'true' if value is an object,else 'false'
const isObject = value => {
    return toString.call(value) === '[object Object]'
}


// checks the value is an Array or not
// return 'true' if value is an object,else 'false'
const isArray = value => {
    return toString.call(value) === '[object Array]'
}

// checks the value is an Function or not
// return 'true' if value is an object,else 'false'
const isFunction = value => {
    return toString.call(value) === '[object Function]'
}

const resloaderObj = {
    total:0,
    start(option){
        // 资源总数
        for(let key in option.resources){
            this.total += option.resources[key].length;
        }
        if(isFunction(option.onStart)){
            option.onStart(this.total)
        }
        Promise.all(this._PromiseResources(option.resources,option.onProgress)).then(res=>{
          
            if(isFunction(option.onComplete)){
                option.onComplete(res)
            }
        }).catch(err=>{
            console.log('err')
        })

    },
    _PromiseResources(resources,callback){
        let promiseArr = [];
        let currentIndex = 0;
       
        if(resources.imgs){
            for(let i=0,length=resources.imgs.length; i< length; i++){
                promiseArr.push(this._loadImg(resources.imgs[i]));
                this._loadImg(resources.imgs[i]).then(()=>{
                    currentIndex++;
                    if(isFunction(callback)){
                        callback(currentIndex)
                    }
                   
                })
            }
        }
        if(resources.audio){
            for(let i=0,length=resources.audio.length; i< length; i++){
                promiseArr.push(this._loadAudio(resources.audio[i]))

                this._loadAudio(resources.audio[i]).then(()=>{
                    currentIndex++;
                    if(isFunction(callback)){
                        callback(currentIndex)
                    }
                })
            }

        }
       
        return promiseArr;
        

    },
   
    _loadAudio(audioSrc){
        return new Promise((resolve,reject)=>{
            let audio = new Audio();
            audio.src = audioSrc;

            audio.addEventListener('canplaythrough', function(){
               resolve(audioSrc)
            }, false);
            audio.addEventListener('error', function(err){
                 reject(err)
            }, false);
          
        })
    },
    _loadImg(imgSrc){
        return new Promise((resolve,reject)=>{
            let img = new Image();
            img.src = imgSrc;
            img.addEventListener('load',function(){
                resolve(imgSrc)
            })
            img.addEventListener('error',function(err){
                reject(err)
            })
            
        })
    }
}

const resloader = option => {
    // 检测参数
    if(!isObject(option)){
        throw new TypeError('Expected an object')
    }else{
        if(!isObject(option.resources)){
            throw new TypeError('option.resources is not an object')
        }else{
            resloaderObj.start(option)
        }
    }
}
//module.exports = resloader;







