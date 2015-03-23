### isDeviceMotionSupported()

判断当前宿主环境是否支持手势事件

#### 使用例子

	require(['feature'], function(Feature){
		if(Feature.isDeviceMotionSupported()){
			alert('该环境支持手势事件...');
		}
	});
	
[demo](http://jsfiddle.net/benfchen/schb65wt/)

### isMsPointerSupported()

判断当前宿主环境是否支持ie8的Pointer事件

### isTouchEventSupported()

判断当前宿主环境是否支持触屏事件

### isHashChangeSupported()

判断当前环境是否支持hashChange事件

### isTransformSupported()

判断当前环境是否支持Transform动画

### isClassListSupported()

判断当前环境是否支持ClassList

### isQuerySelectorSupported()

判断当前环境是否支持QuerySelector方法

### getTransitionPrefix()

得到Transition属性的前缀

### getTransformPrefix()

得到Transform属性的前缀