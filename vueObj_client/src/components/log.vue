<template>
	<div>
		 <div class="layout-breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb-item href="/">首页</Breadcrumb-item>
                        <Breadcrumb-item>日志</Breadcrumb-item>
                    </Breadcrumb>
    </div>
         <div class="btn-group">
             <Input class="btn-search" v-model="filter.title" @input="search">
                <span class="s1" slot="prepend" >搜索</span>
             </Input>
             <Button class="btn" type="primary" @click="searchFromAll">全局搜索</Button>
             <Button class="btn" type="primary" v-on:click="showModal">添加一条</Button>
             <Button class="btn" type="warning" v-on:click="removes">删除多条</Button>
        </div>
        <div class="main-content">
        	<Tree class="l" :data="baseData" @on-select-change="onSelectChange"></Tree>
			<Table class="r" border :columns="columns7" :data="data6" @on-selection-change="onSelectionChange"></Table>
        </div>
		<Page :page-size="filter.limit" @on-change="changePage" @on-page-size-change="changePageSize" class="page" :total="filter.total" :page-size-opts="[5,10,20]" show-sizer></Page>
       
         <Modal v-model="modal1" title="添加或者修改数据" @on-cancel="cancle">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
           		<Form-item label="分类" prop="cateName">
                    <Input v-model="formValidate.cateName" disabled></Input>
                </Form-item>
                <Form-item label="作者" prop="author">
                    <Input v-model="formValidate.author" placeholder="作者名称"></Input>
                </Form-item>
                <Form-item label="标题" prop="title">
                    <Input v-model="formValidate.title" placeholder="标题"></Input>
                </Form-item>
               	<Form-item label="描述" prop="desc">
                    <Input v-model="formValidate.desc" placeholder="描述"></Input>
                </Form-item>
                <Form-item label="时间">
                    <Row>
                        <Col span="11">
                            <Form-item prop="date">
                                <Date-picker type="date" placeholder="选择日期" v-model="formValidate.date"></Date-picker>
                            </Form-item>
                        </Col>
                    </Row>
                </Form-item>
                <Form-item label="内容" prop="content">
                      <quill-editor v-model="formValidate.content">
					  </quill-editor>
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
	import { quillEditor } from 'vue-quill-editor'
	export default{
		data:function(){
			return{
				baseData:[],
				type:1,
				data6:[],
				ids:[],
				oldObj:{},
				filter:{
                    page:1,
                    pages:0,
                    limit:5,
                    total:0,
                    title:'',
                    cateName:'',
                    all:''
                },
                formValidate: {
                    cateName:"",
                    title: '',
                    date: '',
                    desc: '',
                   	author:"",
                   	content:""
                },
                modal1: false,
                ruleValidate: {
                    title: [
                        { required: true, message: '标题不能为空', trigger: 'blur' }
                    ],
                  	desc: [
                        { required: true, message: '描述不能为空', trigger: 'blur' }
                    ],
                    author: [
                        { required: true, message: '作者不能为空', trigger: 'blur' }
                    ],
                    date: [
                        { required: true, type: 'date', message: '请选择日期', trigger: 'change' }
                    ],
                    content: [
                        { required: true, message: '请输入个人介绍', trigger: 'blur' },
                        { type: 'string', min: 20, message: '介绍不能少于20字', trigger: 'blur' }
                    ]
                },
				columns7: [
                    { type: 'selection',width:54},
                    {
                        title: '标题',
                        key: 'title',
                        render: (h, params) => {
                            return h('div', [
                                h('Icon', {
                                    props: {
                                        type: 'person'
                                    }
                                }),
                                h('strong', params.row.title)
                            ]);
                        }
                    },
                    {
                        title: '时间',
                        key: 'date'
                    },
                     {
                        title: '描述',
                        key: 'desc'
                    },
                     {
                        title: '作者',
                        key: 'author'
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
                ]
			}
		},
		methods:{
			onSelectChange(res){
				this.filter.all="";
				this.filter.title="";
				this.filter.page=1;
				if(res[0]){
					// console.log(res[0]._id);
					this.formValidate.cateName=res[0].title;
					this.filter.cateName=res[0].title;
					this.getById();
				}
			},
			removes(){
				 var _this=this;
                  this.$Modal.confirm({
                        title:"<h2>确定删除吗?</h2>",
                        content:"<h3>是否需要删除数据</h3>",
                        onOk:function(){
                           _this.$http.post("http://localhost:3000/log/removes",{ids:_this.ids}).then((res)=>{
                                     _this.ids=[];
                                      this.$Message.success("删除成功");
                                     _this.getById();
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
                           _this.$http.post("http://localhost:3000/log/removeOne/"+id).then((res)=>{
                                      this.$Message.success("删除成功");
                                     _this.getById();
                            });
                        },
                        onCancel:function(){
                            this.$Message.info("取消了删除操作");
                        }
                 });
			},
			onSelectionChange(arr){
				this.ids=[];
				for(var i=0;i<arr.length;i++){
					this.ids.push(arr[i]._id);
				}
			},
			getById(){
				this.$http.post("http://localhost:3000/log/getById",this.filter).then((res)=>{
						//console.log(res);
						this.data6=res.data.docs;
						this.filter.pages=res.data.pages;
						this.filter.total=res.data.total;
				});
			},
			getAllNode(){
               this.$http.get("http://localhost:3000/cate/all/"+this.type).then((res)=>{
               	 //console.log(res.data);
               	 if(res.data.length>0){
               	 	 this.baseData=res.data;
               	 	 this.filter.cateName=res.data[0].title;
					 this.getById();
               	 }
               });
          	},
          	search(){
          		this.getById();
          	},
          	searchFromAll(){
          		this.filter.all="true";
          		this.getById();
          	},
          	change(obj){
          		this.formValidate=obj;
          		this.formValidate.date=new Date(this.formValidate.date);
          	},
          	showModal(){ //添加一条
          		this.modal1=true;
          		delete this.formValidate._id;
          		var newcateName=this.formValidate.cateName;
          		this.formValidate={
                    cateName:newcateName,
                    title: '',
                    date: new Date(),
                    desc: '',
                   	author:"",
                   	content:""
                }
          	},
          	changePage:function(page){
                this.filter.page=page;
                this.getById();
            },
            changePageSize:function(limit){
                this.filter.limit=limit;
                this.getById();
            },
            addLog(){
            	this.$http.post("http://localhost:3000/log/add",this.formValidate).then((data)=>{
            		  // console.log(data);
            		  if(data.status==200){
            		  		this.$Message.success({
				                content: '添加成功',
				                duration: 2
				            });	
				            this.modal1=false;
            		  		this.getById();
            		  }
            	});
            },
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
       					if(this.formValidate.cateName){
       						 if(this.formValidate._id){
       						 	this.$http.put("http://localhost:3000/log/update/"+this.formValidate._id,this.formValidate).then((res)=>{
       						 		//console.log(res);//返回修改之前的对象
       						 		this.$Message.success({
						                content: '修改成功',
						                duration: 2
						            });	
						            this.modal1=false;
       						 		this.getById();
       						 	});
       						 }else{
       						 	this.addLog();
       						 }
       					}else{
       						 this.$Message.error('请选择一个分类!');
       						 this.modal1=false;	
       					}
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })
	        },
	        handleReset (name) {
                this.$refs[name].resetFields();
            },
            cancle(){
            	Object.assign(this.formValidate,this.oldObj);
            	this.oldObj={};
            }
		},
		created:function(){
			this.getAllNode();
		},
		components: {
		    quillEditor
		}
	}
</script>
<style >
	.main-content{
		display:flex;
	}
	.l{
		flex:1.2;
	}
	.r{
		flex:10;
	}
	.page{
        display:block;
        margin:10px 0 10px 105px;
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
    	margin-left:105px;
        display:flex;
    }
    .btn{
    	margin-left:10px;
    }
</style>