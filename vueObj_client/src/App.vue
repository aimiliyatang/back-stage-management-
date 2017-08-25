<style scoped>
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }
    .layout-breadcrumb{
        padding: 10px 15px 0;
    }
    .layout-content{
        min-height: 200px;
        margin: 15px;
        overflow: hidden;
        background: #fff;
        border-radius: 4px;
    }
    .layout-content-main{
        padding: 10px;
    }
    .layout-copy{
        text-align: center;
        padding: 10px 0 20px;
        color: #9ea7b4;
    }
    .layout-menu-left{
        background: #464c5b;
    }
    .layout-header{
        position:relative;
        font-size:20px;
        height: 60px;
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .layout-logo-left{
        width: 90%;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        margin: 15px auto;
    }
    .layout-ceiling-main a{
        color: #9ba7b5;
    }
    .layout-hide-text .layout-text{
        display: none;
    }
    .ivu-col{
        transition: width .2s ease-in-out;
    }
     .menuStyle{
        color:#fff
    }
    .over:hover{
      color:#fff
    }
    .login{
        font-family: 'PT Sans', Helvetica, Arial, sans-serif;
        color: #555;
        font-size: 16px;
        font-weight: 400;
        text-align:center;
        margin:50px auto;
        width:300px;
    }
    input {
        width: 95%;
        height: 40px;
        background: #fcfcfc;
        border: 1px solid #ddd;
        border-radius: 2px;
        box-shadow: 0 1px 3px 0 rgba(0,0,0,.1) inset;
        font-family: 'PT Sans', Helvetica, Arial, sans-serif;
        color: #888;
        font-size: 16px;
    }
    .btn-login {
        cursor: pointer;
        width: 95%;
        height: 42px;
        margin-top: 15px;
        padding: 0;
        background: #555;
        border-radius: 3px;
        border: 0;
        box-shadow: 0 15px 30px 0 rgba(255,255,255,.1) inset;
        font-family: 'PT Sans', Helvetica, Arial, sans-serif;
        font-size: 16px;
        font-weight: 400;
        color: #fff;
        text-shadow: 0 1px 2px rgba(0,0,0,.1);
    }
    .user_name{
        font-size:22px;color:red;
        margin-right:10px;
    }
    .login_btn{
        position:absolute;
        right:50px;
        top:15px;
    }
    .navicon{
        position:absolute;
    }
</style>
<template>
    <div class="layout" :class="{'layout-hide-text': spanLeft < 5}">
        <Row v-if="getState" type="flex">
            <i-col :span="spanLeft" class="layout-menu-left">
                <Menu active-name="1" theme="dark" width="auto">
                    <div class="layout-logo-left"></div>
                    <Menu-item name="1">
                       <router-link class="over" to="/" active-class="menuStyle" exact>
                            <Icon type="ios-navigate" :size="iconSize"></Icon>
                            <span class="layout-text">
                               首页
                            </span>
                        </router-link>  
                    </Menu-item>
                    <Menu-item name="2">
                        <router-link class="over" to="/user" active-class="menuStyle">
                            <Icon type="ios-keypad" :size="iconSize"></Icon>
                            <span class="layout-text">
                                 用户
                            </span>
                         </router-link>   
                    </Menu-item>
                    <Menu-item name="3">
                     <router-link class="over" to="/cate" active-class="menuStyle">
                        <Icon type="ios-analytics" :size="iconSize"></Icon>
                        <span class="layout-text">
                            分类
                        </span>
                      </router-link>  
                    </Menu-item>
                    <Menu-item name="4">
                     <router-link class="over" to="/log" active-class="menuStyle">
                        <Icon type="document-text" :size="iconSize"></Icon>
                        <span class="layout-text">
                            日志
                        </span>
                      </router-link>  
                    </Menu-item>
                    <Menu-item name="5">
                     <router-link class="over" to="/upload" active-class="menuStyle">
                        <Icon type="android-archive" :size="iconSize"></Icon>
                        <span class="layout-text">
                            上传
                        </span>
                      </router-link>  
                    </Menu-item>
                </Menu>
            </i-col>
            <i-col :span="spanRight">
                <div class="layout-header">
                    <i-button class="navicon" type="text" @click="toggleClick">
                        <Icon type="navicon" size="32"></Icon>
                    </i-button>
                    <div class="login_btn">
                        欢迎您 : <span class="user_name">{{user.name}}</span>
                        <Button type="primary" v-on:click="logout">注销</Button>
                    </div>
                </div>
                <div class="layout-content">
                    <div class="layout-content-main">
                         <router-view></router-view>
                    </div>
                </div>
                <div class="layout-copy">
                    2011-2016 &copy; TalkingData
                </div>
            </i-col>
        </Row>
        <div v-else class="login">
               用户名: <input type="text" name="username" v-model="user.name" placeholder="请输入用户名">
               密码:<input type="password" name="password" v-model="user.password" placeholder="请输入密码">
               <button class="btn-login" @click="login">登录</button>
        </div>
    </div>

</template>
<script>
    import {mapGetters,mapActions} from "vuex";
    export default {
        data () {
            return {
                spanLeft: 5,
                spanRight: 19,
                user:{
                    name:"",
                    password:""
                }
            }
        },
        computed: {
            ...mapGetters(["getState"]),
            iconSize () {
                return this.spanLeft === 5 ? 14 : 24;
            }
        },
        methods: {
            ...mapActions(["changeState","logout"]),
            toggleClick () {
                if (this.spanLeft === 5) {
                    this.spanLeft = 2;
                    this.spanRight = 22;
                } else {
                    this.spanLeft = 5;
                    this.spanRight = 19;
                }
            },
            login(){
                this.$http.post("http://localhost:3000/users/login",this.user).then((res)=>{
                    if(res.status==200){
                        if(res.data.length>0){
                            this.$Message.success("登录成功");
                             this.changeState(true);
                             this.user.name=res.data[0].name;
                         }else{
                            this.$Message.error("用户名或密码错误");   
                         }
                    }
                });
            }
        }
    }
</script>