<template>
		<div>
			 <div class="layout-breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb-item href="/">首页</Breadcrumb-item>
                        <Breadcrumb-item>分类</Breadcrumb-item>
                    </Breadcrumb>
   		 </div>
        <Button-group>
            <Button @click="changeType(1)" :class="{ changeStyle: formValidate.type === 1 }">日志分类</Button>
            <Button @click="changeType(2)" :class="{ changeStyle: formValidate.type === 2 }">上传分类</Button>
            <Button @click="changeType(3)" :class="{ changeStyle: formValidate.type === 3 }">相册分类</Button>
        </Button-group>
        <Tree :data="baseData" @on-select-change="onSelectChange"></Tree>
         <Form class="btn-group" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
          <Input class="txt" type="text" disabled v-model="formValidate.parentId"></Input>
            <Form-item label="名称" prop="title">
                <Input v-model="formValidate.title" placeholder="请输入节点名"></Input>
            </Form-item>
             <Form-item>
                  <Button type="primary" @click="handleSubmitRoot('formValidate')">添加根节点</Button>
                  <Button type="info" @click="deleteNode">删除</Button>
                  <Button type="success" @click="changeNode('formValidate')">修改</Button>
                  <Button type="warning" @click="handleSubmitNode('formValidate')">添加子节点</Button>
             </Form-item>
         </Form> 
		</div>
</template>
<script>
    export default {
        data () {
            return {
                 _id:"",
                 formValidate: {
                    type: 1,
                    title: '',
                    parentId: null,
                    currentParentId: null
                  },
                  baseData: [],
                  ruleValidate: {
                      title: [
                          { required: true, message: '节点名不能为空', trigger: 'blur' }
                      ]
                  }   
            }
        },
        methods:{
          onSelectChange(arr){
              // console.log(arr[0]._id);
              if(arr[0]){
                   this.formValidate.title="";
                   this.formValidate.parentId=arr[0]._id; 
                   this.formValidate.currentParentId=arr[0].parentId; 
                   this._id=arr[0]._id;
              }
          },
          changeType:function(num){
              this.formValidate.type=num;
              this._id="";
              this.formValidate.parentId="";
              this.formValidate.title="";
              this.getAllNode();
          },
          addNode(){
              this.$http.post("http://localhost:3000/cate/add",this.formValidate).then((res)=>{
                  this.$Message.info("添加成功");
                  this.formValidate.title="";
                  this.getAllNode();
              });
          },
          getAllNode(){
               this.$http.get("http://localhost:3000/cate/all/"+this.formValidate.type).then((res)=>{
                 this.baseData=res.data;
               });
          },
          handleSubmitNode (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.addNode();
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })
          },
          handleSubmitRoot(name){
               this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.formValidate.parentId=null;
                        this.addNode();
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })
          },
          handleReset (name) {
              this.$refs[name].resetFields();
          },
          deleteNode(){
              this.$http.delete("http://localhost:3000/cate/remove/"+this._id).then((res)=>{
                   this.$Message.info('删除成功!');
                   this.formValidate.title="";
                   this.getAllNode();
              });
          },
          changeNode(name){
             this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.formValidate._id=this._id;
                        this.formValidate.parentId=this.formValidate.currentParentId;
                        this.$http.put("http://localhost:3000/cate/update/"+this._id,this.formValidate).then((res)=>{
                             this.$Message.info('更新成功!');
                             delete this.formValidate._id;
                             this.parentId="";
                             this.formValidate.title="";
                             this.getAllNode();
                        });
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })
          }
        },
        computed:{

        },
        created:function(){
           this.getAllNode();
        }
    }
</script>
<style>
	.layout-breadcrumb{
        margin-bottom:5px;
    }
    .changeStyle{
      color:#fff;
      background:red;
    }
    .btn-group{
      display:flex;
    }
    .txt{
      width:200px;
    }
</style>