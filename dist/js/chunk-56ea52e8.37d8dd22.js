(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-56ea52e8"],{"1d65":function(t,e,s){},"4b54":function(t,e,s){"use strict";s.r(e);var r=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"chatgroup"},[s("div",{staticClass:"navHead"},[s("a-icon",{staticClass:"leftIcon",attrs:{type:"left"},on:{click:t.backRouter}}),s("span",[t._v(t._s(t.title))]),s("a-icon",{staticClass:"userIcon",attrs:{type:"team"},on:{click:t.todetail}})],1),s("div",{ref:"msgWrapper",staticClass:"contentBox"},[s("div",{staticClass:"boxWrapper"},t._l(t.groupMsgList,function(e,r){return s("div",{key:r,staticClass:"userChat",class:{self:e.from==t.$store.state.user.username}},[s("a-avatar",{staticClass:"avatar",attrs:{icon:"user"}}),s("span",{staticClass:"userid"},[t._v(t._s(e.from)+" :")]),s("div",{staticClass:"bubble"},[s("p",[t._v(t._s(e.data))])])],1)}),0)]),s("div",{staticClass:"sendControl"},[s("input",{directives:[{name:"model",rawName:"v-model",value:t.msg,expression:"msg"}],attrs:{type:"text"},domProps:{value:t.msg},on:{input:function(e){e.target.composing||(t.msg=e.target.value)}}}),s("a-icon",{staticClass:"smileIcon",attrs:{type:"smile"}}),s("button",{class:["btn",{active:t.btnActive}],on:{click:t.send}},[t._v("发送")])],1)])},o=[],i=(s("8e6e"),s("ac6a"),s("456d"),s("bd86")),a=s("2f62"),c=s("1fba");function n(t,e){var s=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),s.push.apply(s,r)}return s}function l(t){for(var e=1;e<arguments.length;e++){var s=null!=arguments[e]?arguments[e]:{};e%2?n(s,!0).forEach(function(e){Object(i["a"])(t,e,s[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(s)):n(s).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(s,e))})}return t}var u={name:"chatgroup",data:function(){return{msg:""}},computed:l({},Object(a["e"])(["title"]),{},Object(a["c"])(["groupMsgList"]),{btnActive:function(){return!!this.msg.trim()}}),methods:l({},Object(a["b"])(["sendGroupText","listGroupMember"]),{backRouter:function(){this.$router.go(-1)},send:function(){if(this.msg.trim()){var t={gid:this.$route.params.groupid,content:this.msg};this.sendGroupText(t),this.msg=""}},initalBScroller:function(){this.msgScroller?this.msgScroller.refresh():this.msgScroller=new c["a"](this.$refs.msgWrapper,{click:!0})},todetail:function(){this.$router.push({name:"groupdetail"}),this.listGroupMember(this.$route.params.groupid)}}),watch:{groupMsgList:function(){this.initalBScroller(),this.msgScroller.scrollTo(0,this.msgScroller.maxScrollY,500)}},beforeMount:function(){var t=localStorage.getItem(this.$store.state.user.username);t&&(this.$store.state.msgDataSource=JSON.parse(t))},mounted:function(){this.initalBScroller(),this.msgScroller.scrollTo(0,this.msgScroller.maxScrollY)},updated:function(){this.initalBScroller(),this.msgScroller.scrollTo(0,this.msgScroller.maxScrollY)},beforeDestroy:function(){this.msgScroller.destroy(),this.msgScroller=null}},p=u,m=(s("df77"),s("2877")),g=Object(m["a"])(p,r,o,!1,null,"642c473f",null);e["default"]=g.exports},df77:function(t,e,s){"use strict";var r=s("1d65"),o=s.n(r);o.a}}]);
//# sourceMappingURL=chunk-56ea52e8.37d8dd22.js.map