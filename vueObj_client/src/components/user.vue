<template>
    <div>
        <div class="layout-breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb-item href="/">首页</Breadcrumb-item>
                        <Breadcrumb-item>用户</Breadcrumb-item>
                    </Breadcrumb>
        </div>
        <div class="btn-group">
             <Input v-model="filter.name" class="btn-search">
                <span class="s1" slot="prepend" >搜索</span>
                <Button class="s2" slot="append" icon="ios-search" @click="search"></Button>
             </Input>
             <Button type="primary" v-on:click="addOne">添加一条</Button>
            <Button type="warning" v-on:click="removes">删除多条</Button>
        </div>
        <Table border :columns="columns7" :data="data6" @on-selection-change="onSelectionChange"></Table>
        <Page :page-size="filter.limit" @on-change="changePage" @on-page-size-change="changePageSize" class="page" :total="filter.total" :page-size-opts="[5,10,20]" show-sizer></Page>
       
         <Modal v-model="modal1" title="添加或者修改数据" @on-cancel="cancle">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <Form-item label="姓名" prop="name">
                    <Input v-model="formValidate.name" placeholder="请输入姓名"></Input>
                </Form-item>
                <Form-item label="密码" prop="password">
                    <Input v-model="formValidate.password" placeholder="请输入密码"></Input>
                </Form-item>
                <Form-item label="邮箱" prop="mail">
                    <Input v-model="formValidate.mail" placeholder="请输入邮箱"></Input>
                </Form-item>
                <Form-item label="城市" prop="city">
                    <Select v-model="formValidate.city" placeholder="请选择所在地">
                        <Option value="beijing">北京市</Option>
                        <Option value="shanghai">上海市</Option>
                        <Option value="shenzhen">深圳市</Option>
                    </Select>
                </Form-item>
                <Form-item label="选择日期">
                    <Row>
                        <Col span="11">
                            <Form-item prop="date">
                                <Date-picker type="date" placeholder="选择日期" v-model="formValidate.date"></Date-picker>
                            </Form-item>
                        </Col>
                        <Col span="2" style="text-align: center">-</Col>
                        <Col span="11">
                            <Form-item prop="time">
                                <Time-picker type="time" placeholder="选择时间" v-model="formValidate.time"></Time-picker>
                            </Form-item>
                        </Col>
                    </Row>
                </Form-item>
                <Form-item label="性别" prop="gender">
                    <Radio-group v-model="formValidate.gender">
                        <Radio label="male">男</Radio>
                        <Radio label="female">女</Radio>
                    </Radio-group>
                </Form-item>
                <Form-item label="爱好" prop="interest">
                    <Checkbox-group v-model="formValidate.interest">
                        <Checkbox label="吃饭"></Checkbox>
                        <Checkbox label="睡觉"></Checkbox>
                        <Checkbox label="跑步"></Checkbox>
                        <Checkbox label="看电影"></Checkbox>
                    </Checkbox-group>
                </Form-item>
                <Form-item label="介绍" prop="desc">
                    <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
                </Form-item>
                <Form-item>
                    <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                    <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
                </Form-item>
            </Form>
            <div slot="footer">

            </div>
        </Modal>
    </div>
</template>
<script>
    import md5 from "crypto-js/md5";
    export default {
        data () {
            return {
                ids:[],
                filter:{
                    page:1,
                    pages:0,
                    limit:5,
                    total:0,
                    name:''
                },
                modal1: false,
                columns7: [
                    { type: 'selection',width:54},
                    {
                        title: '姓名',
                        key: 'name',
                        render: (h, params) => {
                            return h('div', [
                                h('Icon', {
                                    props: {
                                        type: 'person'
                                    }
                                }),
                                h('strong', params.row.name)
                            ]);
                        }
                    },
                    {
                        title: '爱好',
                        key: 'interest'
                    },
                     {
                        title: '性别',
                        key: 'gender'
                    },
                     {
                        title: '日期',
                        key: 'date'
                    },
                    {
                        title: '地址',
                        key: 'city'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.modal1=true;
                                            Object.assign(this.oldObj,params.row);
                                            this.change(params.row);
                                        }
                                    }
                                }, '修改'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.removeOne(params.row._id);
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                data6: [
                   
                ],
                 formValidate: {
                    dataId:"",
                    name: '',
                    mail: 'aimiliyatang@qq.com',
                    city: 'shanghai',
                    gender: 'female',
                    interest: ["吃饭","跑步"],
                    date: new Date(),
                    time: new Date(),
                    desc: '银发的外貌及半妖精[1]（Half elf）血统与『嫉妒』的魔女―莎缇拉的形象相同，故被露格尼卡的人民所惧怕',
                    password:""
                },
                oldObj:{},
                ruleValidate: {
                    name: [
                        { required: true, message: '姓名不能为空', trigger: 'blur' }
                    ],
                    mail: [
                        { required: true, message: '邮箱不能为空', trigger: 'blur' },
                        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
                    ],
                    city: [
                        { required: true, message: '请选择城市', trigger: 'change' }
                    ],
                    gender: [
                        { required: true, message: '请选择性别', trigger: 'change' }
                    ],
                    interest: [
                        { required: true, type: 'array', min: 1, message: '至少选择一个爱好', trigger: 'change' },
                        { type: 'array', max: 2, message: '最多选择两个爱好', trigger: 'change' }
                    ],
                    date: [
                        { required: true, type: 'date', message: '请选择日期', trigger: 'change' }
                    ],
                    time: [
                        { required: true, type: 'date', message: '请选择时间', trigger: 'change' }
                    ],
                    desc: [
                        { required: true, message: '请输入个人介绍', trigger: 'blur' },
                        { type: 'string', min: 20, message: '介绍不能少于20字', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            onSelectionChange(selection){
                this.ids=[];
                for(var i=0;i<selection.length;i++){
                    this.ids.push(selection[i]._id);
                }
                 //console.log(this.ids);
            },
            cancle(){
                Object.assign(this.formValidate,this.oldObj);
                this.oldObj={};
            },
            removes () {
                  var _this=this;
                  this.$Modal.confirm({
                        title:"<h2>确定删除吗?</h2>",
                        content:"<h3>是否需要删除数据</h3>",
                        onOk:function(){
                           _this.$http.post("http://localhost:3000/users/removes",{ids:_this.ids}).then((res)=>{
                                     _this.ids=[];
                                      this.$Message.info("删除成功");
                                     _this.getByPage();
                            });
                        },
                        onCancel:function(){
                            this.$Message.info("取消了删除操作");
                        }
                 });
            },
            removeOne(id){
                var _this=this;
                 this.$Modal.confirm({
                        title:"<h2>确定删除吗?</h2>",
                        content:"<h3>是否需要删除数据</h3>",
                        onOk:function(){
                            _this.$http.delete("http://localhost:3000/users/delete/"+id).then((res)=>{
                                     this.$Message.info("删除成功");
                                     _this.getByPage();
                            });
                        },
                        onCancel:function(){
                            this.$Message.info("取消了删除操作");
                        }
                 });
            },
            handleSubmit (name) {

                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if(this.formValidate.dataId){
                             this.$http.put("http://localhost:3000/users/change/"+this.formValidate.dataId,this.formValidate).then((res)=>{
                                 this.modal1=false;
                                 Object.assign(this.formValidate,this.$options.data().formValidate);
                                 this.getByPage();
                             });
                         }else{
                            delete this.formValidate._id;
                           // console.log(md5(this.formValidate.password).toString());
                           // this.formValidate.password=md5(this.formValidate.password).toString();
                            this.$http.post("http://localhost:3000/users/add",this.formValidate).then((res)=>{
                                this.modal1=false;
                                this.getByPage();   
                            });
                         }
                        this.$Message.success('提交成功!');
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            },
            getByPage(page){
                  this.$http.post("http://localhost:3000/users/list",this.filter).then((res)=>{
                         this.filter.total=res.data.total;
                         this.filter.pages=res.data.pages;
                         this.data6=res.data.docs;
                    });
            },
            changePage:function(page){
                this.filter.page=page;
                this.getByPage();
            },
            change(obj){
                this.formValidate=obj;
                this.formValidate.dataId=obj._id;
                this.formValidate.date=new Date(obj.date);
                this.formValidate.time=new Date(obj.time);
            },
            changePageSize:function(limit){
                this.filter.limit=limit;
                this.getByPage();
            },
            addOne(){
                this.modal1=true;
                Object.assign(this.formValidate,this.$options.data().formValidate);
            },
            search(){
                this.$http.post("http://localhost:3000/users/list",this.filter).then((res)=>{
                        this.data6=res.data.docs;
                });
            }
        },
        created:function(){
           this.getByPage();
        }
    }
</script>
<style  scoped>
    .page{
        display:block;
        margin:10px auto;
    }
    .layout-breadcrumb{
        margin-bottom:5px;
    }
    .btn-search{
         width:500px;
    }
    .s1{
        display:inline-block;
       width:100px;
    }
    .s2{
        width:100px;
    }
    .btn-group{
        display:flex;
    }
</style>