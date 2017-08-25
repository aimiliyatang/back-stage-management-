<template>
		<div>
			<div class="layout-breadcrumb">
	                    <Breadcrumb>
	                        <Breadcrumb-item href="/">首页</Breadcrumb-item>
	                        <Breadcrumb-item>上传</Breadcrumb-item>
	                    </Breadcrumb>
	                    <p class="cateName">当前分类: <span>{{filter.cateName}}</span></p>
	                    <div class="btns">
					        <Button type="error" @click="removes">删除数据</Button>
					        <Input icon="search" v-model="filter.originalname" placeholder="请输入..." style="width: 200px"></Input>
					        <Button type="ghost" @click="search">全局搜索</Button>
					    </div>
	    	</div>
	    	<div class="upload-main">
	    		<div class="leftAsider">
	    			<Tree :data="baseData" @on-select-change="onSelectChange"></Tree>
		    		<Upload
					        ref="upload"
					        name="avatar"
					        :show-upload-list="false"
					        :on-success="handleSuccess"
					        :format="['jpg','jpeg','png','gif']"
					        :max-size="2048"
					        :on-format-error="handleFormatError"
					        :on-exceeded-size="handleMaxSize"
					        :before-upload="handleBeforeUpload"
					        multiple
					        type="drag"
					        v-bind:action="uploadUrl"
					        style="display: inline-block;width:58px;">
					        <div style="width: 58px;height:58px;line-height: 58px;">
					            <Icon type="camera" size="20"></Icon>
					        </div>
					 </Upload>
	    		</div>
				<Table class="rightAsider" border :columns="columns7" :data="data6" @on-selection-change="onSelectionChange"></Table>
	    	</div>
			
			<Modal v-model="modal1" title="修改图片" @on-cancel="cancle">
		            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
		           		<Form-item label="分类" prop="cateName">
		                    <Input v-model="formValidate.cateName" disabled></Input>
		                </Form-item>
		                <Form-item label="原始名称" prop="originalname">
		                    <Input v-model="formValidate.originalname" placeholder="原始名称"></Input>
		                </Form-item>
		                <Form-item label="文件大小" prop="size">
		                    <Input v-model="formValidate.size" disabled placeholder="文件大小"></Input>
		                </Form-item>
		               	<Form-item label="文件名称" prop="filename">
		                    <Input v-model="formValidate.filename" disabled placeholder="文件名称"></Input>
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
		                <Form-item label="缩略图">
		                	<img :src="'http://localhost:3000/'+formValidate.filename" alt="" width=60 height=60>
		                </Form-item>
		                <Form-item label="内容" prop="fieldname">
		                       <Input v-model="formValidate.fieldname" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
		                </Form-item>
		                <Form-item>
		                    <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
		                    <Button type="ghost" @click="handleReset" style="margin-left: 8px">重置</Button>
		                </Form-item>
		            </Form>
		            <div slot="footer">

		            </div>
	        </Modal>

		    <Modal title="查看图片" v-model="visible">
		        <img :src="'http://localhost:3000/' + imgName" v-if="visible" style="width:100%">
		    </Modal>
    		<Page :page-size="filter.limit" @on-change="changePage" @on-page-size-change="changePageSize" class="page" :total="filter.total" :page-size-opts="[5,10,20]" show-sizer></Page>
		</div>
</template>
<script>
	import { quillEditor } from 'vue-quill-editor'
    export default {
        data () {
            return {
                imgName: '',
                visible: false,
                modal1:false,
                uploadList: [],
                baseData:[],
                ids:[],
                uploadUrl:"",
                oldObj:{},
                filter:{
                	page:1,
                	pages:0,
                	limit:5,
                	total:0,
                	cateName:'',
                	originalname:''
                },
                formValidate:{
                	fieldname: '',
				    originalname: "",
				    filename: "",
				    encoding: "",
				    path: "",
				    size: 0,
				    mimetype: "",
				    date: new Date(),
				    destination: "",
				    cateName:""	
                },
                data6:[],
                ruleValidate: {
                    originalname: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                  	filename: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
           
                    date: [
                        { required: true, type: 'date', message: '请选择日期', trigger: 'change' }
                    ],
                    fieldname: [
                        { required: true, message: '请输入介绍', trigger: 'blur' },
                        { type: 'string', min: 5, message: '介绍不能少于5字', trigger: 'blur' }
                    ]
                },
                columns7: [
                      { type: 'selection',width:54,align:'center'},
                      {
			            title: '原始名称',
			            key: 'originalname',
			            align: 'center',
			          },
			          {
			            title: '文件大小',
			            key: 'size',
			            align: 'center',
			            render:(h,params)=>{
			            	return `${ params.row.size}`+"bit";
			            }
			          },
			          {
			            title: '文件名称',
			            key: 'filename',
			            align: 'center',
			          },
			          {
			            title: '缩略图',
			            key: 'path',
			            align: 'center',
			            render: (h, params) => {
			               		return h('img', {
	                                    attrs: {
	                                        src: `http://localhost:3000/${params.row.filename}`
	                                    },
	                                    style: {
	                                        width: '50px',
	                                        height:'50px',
	                                        marginTop:'4px',
	                                        cursor:'pointer'
	                                    },
	                                    on: {
	                                        click: () => {
	                                          this.handleView(params.row.filename);
	                                        }
	                                    }
                                   })
			            	}
			          },
			          {
			            title: '上传时间',
			            key: 'date',
			            align: 'center'
			          },
			          {
			            title: '操作',
			            key: 'action',
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
                                           this.handleRemove(params.row._id);
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
			        }
                ]               
            }
        },
        methods: {
        	handleSubmit(name){
        		 this.$refs[name].validate((valid) => {
                    if (valid) {
					 	this.$http.put("http://localhost:3000/upload/change/"+this.formValidate._id,this.formValidate).then((res)=>{
					 		//console.log(res);//返回修改之前的对象
					 		this.$Message.success({
			                content: '修改成功',
			                duration: 2
			            });	
			            this.modal1=false;
					 		this.getCateImg();
					 	});
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })
        	},
        	handleReset(){
        		Object.assign(this.formValidate,this.oldObj);
        		this.formValidate.date=new Date(this.formValidate.date);
        	},
        	cancle(){
        		Object.assign(this.formValidate,this.oldObj);
        		this.formValidate.date=new Date(this.formValidate.date);
        	},
            handleView (name) {
                this.imgName = name;
                this.visible = true;
            },
            handleRemove (id) {
            	var _this=this;
                  this.$Modal.confirm({
                        title:"<h2>确定删除吗?</h2>",
                        content:"<h3>是否需要删除该图片</h3>",
                        onOk:function(){
                            _this.$http.delete("http://localhost:3000/upload/delete/"+id).then((res)=>{
			               		if(res.status==200){
			               			//console.log(res);
			               			_this.$Message.success("删除成功");
			               			_this.getCateImg();
			               		}else{
			               			_this.$Message.error("删除失败");
			               		}
			               });
                        },
                        onCancel:function(){
                            this.$Message.info("取消了删除操作");
                        }
                 });
            },
            handleSuccess (res, file) {
            	this.$Message.success("添加成功");
            	this.getCateImg();
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
                });
            },
            handleMaxSize (file) {
                this.$Notice.warning({
                    title: '超出文件大小限制',
                    desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
                });
            },
            handleBeforeUpload () {
                const check = this.uploadList.length < 120;
                if (!check) {
                    this.$Notice.warning({
                        title: '最多只能上传 120 张图片。'
                    });
                }
                return check;
            },
            onSelectChange(arr){
            	if(arr[0]){
            		this.filter.page=1;
            		this.filter.cateName=arr[0].title;
            		this.uploadUrl="http://localhost:3000/upload/uploadFile/"+arr[0].title;
            		this.getCateImg();
            	}
            },
            changePage(page){
            	this.filter.page=page;
            	this.getCateImg();
            },
            changePageSize(limit){
            	this.filter.limit=limit;
            	this.getCateImg();
            },
            getCateImg(){
            	this.$http.post("http://localhost:3000/upload/getCateImg",this.filter).then((res)=>{
            		//console.log(res.data);
            		this.filter.total=res.data.total;
            		this.filter.pages=res.data.pages;
            		this.data6=res.data.docs;
            	});
            },
            onSelectionChange(arr){
        		this.ids=[];
            	for(var i=0;i<arr.length;i++){
            		this.ids.push(arr[i]._id);
            	}
            },
            removes(){
            	 var _this=this;
            	 this.$Modal.confirm({
                        title:"<h2>确定删除吗?</h2>",
                        content:"<h3>是否需要删除数据</h3>",
                        onOk:function(){
                        	// console.log(_this);
                            _this.$http.post("http://localhost:3000/upload/removes",{ids:_this.ids}).then((res)=>{
            					 if(res.status==200){
            					 	_this.ids=[];
            					 	_this.$Message.success("删除成功!!请稍等500ms");
            					 	setTimeout(function(){
        					 			_this.getCateImg();
            					 	},500);
            					 }
			            	});
                        },
                        onCancel:function(){
                            _this.$Message.info("取消了删除操作");
                        }
                 });
            },
            search(){
            	this.uploadUrl="";
            	this.filter.page=1;
            	this.filter.cateName="";
            	this.getCateImg();
            	this.$Message.success("查询完成!");
            },
            change(obj){
            	this.formValidate=obj;
            	this.formValidate.date=new Date(this.formValidate.date);
            },
            handleBeforeUpload(){
            	if(!this.uploadUrl){
            		this.$Message.error("请选择一个分类之后再上传");
            		return false;
            	}
            }
        },
        created:function(){
        	this.$http.get("http://localhost:3000/cate/all/2").then((res)=>{
        		this.baseData=res.data;
        		if(res.data.length>0){
					this.filter.cateName=res.data[0].title;
					this.uploadUrl="http://localhost:3000/upload/uploadFile/"+res.data[0].title;
					this.getCateImg();
        		}
        	});
        },
        components:{
        	quillEditor:quillEditor
        }
    }
</script>
<style scoped>
	.imgInfo{
		position:relative;
		z-index: 9999;	
	}
	.cateName{
		font-size:14px;
		font-family: "微软雅黑"
	}
	.cateName span{
		color:red;
		font-weight:bold;
	}
	.leftAsider{
		flex:1.2;
	}
	.page{
        display:block;
        margin:10px 0 10px 105px;
    }
	.rightAsider{
		flex:10;
		margin-top:10px;
	}
	.layout-breadcrumb{
        margin-bottom:5px;
    }
    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
    .upload-main{
    	display:flex;
    	justify-content: flex-start;
    }
    .btns{
    	margin-top: 10px;
    }

</style>