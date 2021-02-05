import fileDownload from "js-file-download";
<template>
  <div class="flex-x-start">
    <el-button
      class="filter-item"
      size="small"
      @click="downMo"
      v-if="temOut"
      type="success"
    >
      导入模板下载
    </el-button>

  <el-upload
    action=""
    :http-request="uploadFile"
    :show-file-list="false"
    :before-upload="beforeAvatarUpload"
    :on-success="handleImageSuccess"
    v-if="inExcel"

  >
    <el-button size="small" type="primary">导入</el-button>
  </el-upload>
    <el-button class="filter-item"
               size="small" v-if="btnShow" @click="upOut" type="info">导出</el-button>
  </div>
</template>

<script>


  export default {
    name: "Upload",
    props:{
      type:{
        type:String,
        default:''
      },
      btnShow:{
        type:Boolean,
        default:true
      },
      inExcel:{
        type:Boolean,
        default:true
      },
      temOut:{
        type:Boolean,
        default:false
      }
    },
    data() {
      return {
      };
    },
    created() {
    },
    methods: {
      handleImageSuccess() {

      },
      beforeAvatarUpload(file) {
        var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
        const extension = testmsg === 'xls'
        const extension2 = testmsg === 'xlsx'
        if(!extension && !extension2) {
                this.$message({
                      message: '上传文件只能是 xls、xlsx格式!',
                       type: 'error'
              });
             }
        return extension || extension2
      },
      uploadFile(file) {
       this.$emit('uploadFile',file)

      },
      downMo(){
        this.$emit('downMo')

      },
      upOut(){
        this.$emit('upOut')

      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
