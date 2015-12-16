
# 模块化开发解决方案

近来看了很多前端的开发框架如backbone、Angular、Reactjs...看多了还是一头雾水，能做出TODOMVC的例子，却发现自己开发h5网站的时候无法套着框架用，一方面自己才疏学浅，可能还没吃透框架的使用方法。另一方面可能这就是大神们说的over designer,适合的才是最好的。基于这种情况，打算自己从简单的解决方案开始设计自己的前端模块化开发体系，逐步吸取各框架方案的优势，建设适合自己的开发流程（权当设定一个伟大的目标先）。

## 开发环境

目前暂定为1.0.0版本，先使用一些自己熟悉的开发工具

1. 使用JetBrains webstorm作为开发工具
2. 使用gulp + webpack作为打包流程工具
3. 使用nodejs作为开始使用的本地服务端，提供接口数据测试


## Vesion 1.0.0 开发方式

1.0.0 主要改变原来所有功能全部靠人工整理的开发方式，引入webpack按模块的方式写js，使用用less编写css。实际上只是做了VIEW上的模块化。

**View 模块化：**

View的设计主要是参考了backbone的View，抽象了继承类提供以下功能：

* template: 视图模板，目前使用mastcher.js(hogan.js)

* el: 模块容器节点，由外部提供，默认为div

* $el: $实例节点

* model：模块模型数据

* events： 做模块节点的事件绑定

* remove: 删除模块节点并移除事件

* init: 模块初始化时调用

* render: 模型渲染---默认使用model + template 进行视图渲染 （TODO:暂未实现VIEW类render方法）

注：暂时没有实现模块继承，考虑使用的场景暂时不需要做继承，继承会导致类的复杂，暂时不实现类继承功能。

> TODO: 

> 1.分离model，暂时耦合了model，由view管理自己的model，渲染自身。backbone分离model和collection的方式，在目前的使用场景上造成模型的冗余开发（虽然backbone有提供更高级的Backbone.Marionette，但我们暂时不搞这么复杂）。


> 2.更好的view层嵌套和通信方式，目前view层的通信使用全局event处理，视图嵌套直接在另一视图里面new View，需要手动传入数据做初始化

> 3.做样式的分模块打包，后续使用webpack进行css的模块打包


**Model**

目前model是组合在View层里面，model由外部传入，每次model更新需要手动控制视图刷新；目前实现的方式是做了全局的event管理器，每次model变化手动触发view注册的全局事件更新view。model的更新依赖其他逻辑请求数据并且传入view.render合并model并作view.render


>TODO:

> 1.实现model和view的相互绑定，以目前的需求状况考虑，优先实现model和view的单向绑定，即model变化触发view更新订单。

> 2.实现model的数据请求，目前是依赖外部逻辑实现数据请求。

**Controller**

目前的开发方式没有Controller这一说法，实际上view已经融合了controller的部分功能。


**其他附加类**

* request.js: 请求处理，依赖$.ajax,所有数据请求url配置都在这个类里面
* global.event.js: 各视图暴露的全局事件名，其他视图可以通过这个类来获取要通知其他视图的事件名称
* event.js : 全局事件绑定类，直接使用了jquery的事件绑定方法。

**第三方依赖**

* jquery.js
* hogan.js


**二期需解决问题**
* 模型数据较分散，没有集中管理，数据不可测，请求和数据分离，难于统一管理
* 