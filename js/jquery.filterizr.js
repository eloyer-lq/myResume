!function(e,m){"use strict";if(!m)throw new Error("Filterizr requires jQuery to work.");function v(t){this.init(t)}var r;v.prototype={init:function(t){this.root={x:0,y:0,w:t}},fit:function(t){var e,i,r,n=t.length,o=0<n?t[0].h:0;for(this.root.h=o,e=0;e<n;e++)r=t[e],(i=this.findNode(this.root,r.w,r.h))?r.fit=this.splitNode(i,r.w,r.h):r.fit=this.growDown(r.w,r.h)},findNode:function(t,e,i){return t.used?this.findNode(t.right,e,i)||this.findNode(t.down,e,i):e<=t.w&&i<=t.h?t:null},splitNode:function(t,e,i){return t.used=!0,t.down={x:t.x,y:t.y+i,w:t.w,h:t.h-i},t.right={x:t.x+e,y:t.y,w:t.w-e,h:i},t},growDown:function(t,e){var i;return this.root={used:!0,x:0,y:0,w:this.root.w,h:this.root.h+e,down:{x:0,y:this.root.h,w:this.root.w,h:e},right:this.root},(i=this.findNode(this.root,t,e))?this.splitNode(i,t,e):null}},m.fn.filterizr=function(){var t=this,e=arguments;if(t._fltr||(t._fltr=m.fn.filterizr.prototype.init(t.selector,"object"==typeof e[0]?e[0]:void 0)),"string"==typeof e[0]){if(-1<e[0].lastIndexOf("_"))throw new Error("Filterizr error: You cannot call private methods");if("function"!=typeof t._fltr[e[0]])throw new Error("Filterizr error: There is no such function");t._fltr[e[0]](e[1],e[2])}return t},m.fn.filterizr.prototype={init:function(t,e){var i=m(t).extend(m.fn.filterizr.prototype);return i.options={animationDuration:.5,callbacks:{onFilteringStart:function(){},onFilteringEnd:function(){}},delay:0,delayMode:"progressive",easing:"ease-out",filter:"all",filterOutCss:{opacity:0,transform:"scale(0.5)"},filterInCss:{opacity:1,transform:"scale(1)"},layout:"sameSize",selector:"string"==typeof t?t:".filtr-container",setupControls:!0},0===arguments.length&&(t=i.options.selector,e=i.options),1===arguments.length&&"object"==typeof arguments[0]&&(e=arguments[0]),e&&i.setOptions(e),i.css({padding:0,position:"relative"}),i._lastCategory=0,i._isAnimating=!1,i._mainArray=i._getFiltrItems(),i._subArrays=i._makeSubarrays(),i._activeArray=i._getCollectionByFilter(i.options.filter),i._toggledCategories={},i._typedText=m("input[data-search]").val()||"",i._uID="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(t){var e=16*Math.random()|0;return("x"==t?e:3&e|8).toString(16)}),i._setupEvents(),i.options.setupControls&&i._setupControls(),i.filter(i.options.filter),i},filter:function(t){var e=this,i=e._getCollectionByFilter(t);e.options.filter=t,e.trigger("filteringStart"),e._handleFiltering(i),e._isSearchActivated()&&e.search(e._typedText)},toggleFilter:function(t){var e=this,i=[];e.trigger("filteringStart"),e._toggledCategories[t]?delete e._toggledCategories[t]:e._toggledCategories[t]=!0,e._multifilterModeOn()?(i=e._makeMultifilterArray(),e._handleFiltering(i)):e.filter("all"),e._isSearchActivated()&&e.search(e._typedText)},search:function(t){var e=this,i=e._multifilterModeOn()?e._makeMultifilterArray():e._getCollectionByFilter(e.options.filter),r=[],n=0;if(e._isSearchActivated())for(n=0;n<i.length;n++){-1<i[n].text().toLowerCase().indexOf(t.toLowerCase())&&r.push(i[n])}if(0<r.length)e._handleFiltering(r);else if(e._isSearchActivated())for(n=0;n<e._activeArray.length;n++)e._activeArray[n]._filterOut();else e._handleFiltering(i)},shuffle:function(){var t=this;t._mainArray=t._fisherYatesShuffle(t._mainArray),t._subArrays=t._makeSubarrays();var e=t._multifilterModeOn()?t._makeMultifilterArray():t._getCollectionByFilter(t.options.filter);t._isSearchActivated()?t.search(t._typedText):t._placeItems(e)},sort:function(t,e){var i=this;if(e=e||"asc","domIndex"!==(t=t||"domIndex")&&"sortData"!==t&&"w"!==t&&"h"!==t)for(var r=0;r<i._mainArray.length;r++)i._mainArray[r][t]=i._mainArray[r].data(t);i._mainArray.sort(i._comparator(t,e)),i._subArrays=i._makeSubarrays();var n=i._multifilterModeOn()?i._makeMultifilterArray():i._getCollectionByFilter(i.options.filter);i._isSearchActivated()?i.search(i._typedText):i._placeItems(n)},setOptions:function(t){var e=this,i=0;for(var r in t)e.options[r]=t[r];if(e._mainArray&&(t.animationDuration||t.delay||t.easing||t.delayMode))for(i=0;i<e._mainArray.length;i++)e._mainArray[i].css("transition","all "+e.options.animationDuration+"s "+e.options.easing+" "+e._mainArray[i]._calcDelay()+"ms");e.options.filterInCss.transform||(e.options.filterInCss.transform="translate3d(0,0,0)"),e.options.filterOutCss.transform||(e.options.filterOutCss.transform="translate3d(0,0,0)")},_getFiltrItems:function(){var r=this,t=m(r.find(".filtr-item")),n=[];return m.each(t,function(t,e){var i=m(e).extend(o)._init(t,r);n.push(i)}),n},_makeSubarrays:function(){for(var t=this,e=[],i=0;i<t._lastCategory;i++)e.push([]);for(i=0;i<t._mainArray.length;i++)if("object"==typeof t._mainArray[i]._category)for(var r in t._mainArray[i]._category)e[t._mainArray[i]._category[r]-1].push(t._mainArray[i]);else e[t._mainArray[i]._category-1].push(t._mainArray[i]);return e},_makeMultifilterArray:function(){for(var t=[],e={},i=0;i<this._mainArray.length;i++){var r=this._mainArray[i],n=!1,o=r.domIndex in e==!1;if(Array.isArray(r._category)){for(var a=0;a<r._category.length;a++)if(r._category[a]in this._toggledCategories){n=!0;break}}else r._category in this._toggledCategories&&(n=!0);o&&n&&(e[r.domIndex]=!0,t.push(r))}return t},_setupControls:function(){var e=this;m("*[data-filter]").click(function(){var t=m(this).data("filter");e.options.filter!==t&&e.filter(t)}),m("*[data-multifilter]").click(function(){var t=m(this).data("multifilter");"all"===t?(e._toggledCategories={},e.filter("all")):e.toggleFilter(t)}),m("*[data-shuffle]").click(function(){e.shuffle()}),m("*[data-sortAsc]").click(function(){var t=m("*[data-sortOrder]").val();e.sort(t,"asc")}),m("*[data-sortDesc]").click(function(){var t=m("*[data-sortOrder]").val();e.sort(t,"desc")}),m("input[data-search]").keyup(function(){e._typedText=m(this).val(),e._delayEvent(function(){e.search(e._typedText)},250,e._uID)})},_setupEvents:function(){var t=this;m(e).resize(function(){t._delayEvent(function(){t.trigger("resizeFiltrContainer")},250,t._uID)}),t.on("resizeFiltrContainer",function(){t._multifilterModeOn()?t.toggleFilter():t.filter(t.options.filter)}).on("filteringStart",function(){t.options.callbacks.onFilteringStart()}).on("filteringEnd",function(){t.options.callbacks.onFilteringEnd()})},_calcItemPositions:function(){var t=this,e=t._activeArray,i=0,r=Math.round(t.width()/t.find(".filtr-item").outerWidth()),n=0,o=e[0].outerWidth(),a=0,s=0,l=0,f=0,u=0,h=[];if("packed"===t.options.layout){m.each(t._activeArray,function(t,e){e._updateDimensions()});var _=new v(t.outerWidth());for(_.fit(t._activeArray),f=0;f<e.length;f++)h.push({left:e[f].fit.x,top:e[f].fit.y});i=_.root.h}if("horizontal"===t.options.layout)for(f=n=1;f<=e.length;f++)o=e[f-1].outerWidth(),a=e[f-1].outerHeight(),h.push({left:s,top:l}),s+=o,i<a&&(i=a);else if("vertical"===t.options.layout){for(f=1;f<=e.length;f++)a=e[f-1].outerHeight(),h.push({left:s,top:l}),l+=a;i=l}else if("sameHeight"===t.options.layout){n=1;var c=t.outerWidth();for(f=1;f<=e.length;f++){o=e[f-1].width();var d=e[f-1].outerWidth(),g=0;e[f]&&(g=e[f].width()),h.push({left:s,top:l}),c<(u=s+o+g)?(l+=e[s=u=0].outerHeight(),n++):s+=d}i=n*e[0].outerHeight()}else if("sameWidth"===t.options.layout){for(f=1;f<=e.length;f++){if(h.push({left:s,top:l}),f%r==0&&n++,s+=o,(l=0)<n)for(u=n;0<u;)l+=e[f-r*u].outerHeight(),u--;f%r==0&&(s=0)}for(f=0;f<r;f++){for(var p=0,y=f;e[y];)p+=e[y].outerHeight(),y+=r;p=(i<p&&(i=p),0)}}else if("sameSize"===t.options.layout){for(f=1;f<=e.length;f++)h.push({left:s,top:l}),s+=o,f%r==0&&(l+=e[0].outerHeight(),s=0);i=(n=Math.ceil(e.length/r))*e[0].outerHeight()}return t.css("height",i),h},_handleFiltering:function(t){for(var e=this._getArrayOfUniqueItems(this._activeArray,t),i=0;i<e.length;i++)e[i]._filterOut();this._activeArray=t,this._placeItems(t)},_multifilterModeOn:function(){return 0<Object.keys(this._toggledCategories).length},_isSearchActivated:function(){return 0<this._typedText.length},_placeItems:function(t){this._isAnimating=!0,this._itemPositions=this._calcItemPositions();for(var e=0;e<t.length;e++)t[e]._filterIn(this._itemPositions[e])},_getCollectionByFilter:function(t){return"all"===t?this._mainArray:this._subArrays[t-1]},_makeDeepCopy:function(t){var e={};for(var i in t)e[i]=t[i];return e},_comparator:function(i,r){return function(t,e){return"asc"===r?t[i]<e[i]?-1:t[i]>e[i]?1:0:"desc"===r?e[i]<t[i]?-1:e[i]>t[i]?1:0:void 0}},_getArrayOfUniqueItems:function(t,e){var i,r,n=[],o={},a=e.length;for(i=0;i<a;i++)o[e[i].domIndex]=!0;for(a=t.length,i=0;i<a;i++)(r=t[i]).domIndex in o||n.push(r);return n},_delayEvent:(r={},function(t,e,i){if(null===i)throw Error("UniqueID needed");r[i]&&clearTimeout(r[i]),r[i]=setTimeout(t,e)}),_fisherYatesShuffle:function(t){for(var e,i,r=t.length;r;)i=Math.floor(Math.random()*r--),e=t[r],t[r]=t[i],t[i]=e;return t}};var o={_init:function(t,e){var i=this;return i._parent=e,i._category=i._getCategory(),i._lastPos={},i.domIndex=t,i.sortData=i.data("sort"),i.w=0,i.h=0,i._isFilteredOut=!0,i._filteringOut=!1,i._filteringIn=!1,i.css(e.options.filterOutCss).css({"-webkit-backface-visibility":"hidden",perspective:"1000px","-webkit-perspective":"1000px","-webkit-transform-style":"preserve-3d",position:"absolute",transition:"all "+e.options.animationDuration+"s "+e.options.easing+" "+i._calcDelay()+"ms"}),i.on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",function(){i._onTransitionEnd()}),i},_updateDimensions:function(){this.w=this.outerWidth(),this.h=this.outerHeight()},_calcDelay:function(){var t=this,e=0;return"progressive"===t._parent.options.delayMode?e=t._parent.options.delay*t.domIndex:t.domIndex%2==0&&(e=t._parent.options.delay),e},_getCategory:function(){var t=this,e=t.data("category");if("string"==typeof e)for(var i in e=e.split(", ")){if(isNaN(parseInt(e[i])))throw new Error("Filterizr: the value of data-category must be a number, starting from value 1 and increasing.");e[i]>t._parent._lastCategory&&(t._parent._lastCategory=e[i])}else e>t._parent._lastCategory&&(t._parent._lastCategory=e);return e},_onTransitionEnd:function(){var t=this;t._filteringOut?(m(t).addClass("filteredOut"),t._isFilteredOut=!0,t._filteringOut=!1):t._filteringIn&&(t._isFilteredOut=!1,t._filteringIn=!1),t._parent._isAnimating&&(t._parent.trigger("filteringEnd"),t._parent._isAnimating=!1)},_filterOut:function(){var t=this,e=t._parent._makeDeepCopy(t._parent.options.filterOutCss);e.transform+=" translate3d("+t._lastPos.left+"px,"+t._lastPos.top+"px, 0)",t.css(e),t._filteringOut=!0},_filterIn:function(t){var e=this,i=e._parent._makeDeepCopy(e._parent.options.filterInCss);m(e).removeClass("filteredOut"),e._filteringIn=!0,e._lastPos=t,i.transform+=" translate3d("+t.left+"px,"+t.top+"px, 0)",e.css(i)}}}(this,jQuery);