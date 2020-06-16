<template>
  <div>

    <div class="item" v-for="(vo,ko) in list">
      <el-popover

        placement="right"
        title=""
        trigger="hover"
      >
        <img :src="vo" style="max-height: 500px;max-width: 500px;">
        <img
          slot="reference"
          :src="vo"
          :alt="vo"
          class="el-upload el-upload--picture-card"
        >
        <el-button slot="reference" type="danger" icon="el-icon-delete" circle class="del-btn"
                   @click="handleRemove(ko)"></el-button>
      </el-popover>

    </div>
    <el-upload style="display: inline-block"
               action=""
               :file-list="fileList"
               :before-upload="beforeUploadHandle"
               :http-request="uploadImage"
               list-type="picture-card"
               :show-file-list="false"
    >

      <i class="el-icon-plus"/>
    </el-upload>
  </div>
</template>

<script>
  import {Common} from '@/api'

  export default {
    name: '',
    props: {
      value: {
        type: Array,
      },
    },
    data() {
      return {
        fileList: []
      }
    },
    computed: {
      list: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('input', val)
        }
      }
    },
    watch: {},
    created() {
    },
    mounted() {
    },
    methods: {
      beforeUploadHandle(file) {
        if (file.type !== 'image/jpg' && file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
          this.$message.error(this.$t('common.uploadImageTip'))
          return false
        }
      },
      uploadImage(file) {
        const formData = new FormData()
        formData.append('file', file.file)
        Common.uploadFile(formData).then((res) => {

          this.list.push(res.data.url)
          this.$message({
            message: res.msg || this.$t('common.success'),
            type: 'success'
          })
        })
      },
      handleRemove(ko) {
        this.list.splice(ko, 1)
      },
    }
  }
</script>
<style scoped type="text/scss" lang="scss">
  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    display: inline-block;
  }

  .item {
    display: inline-block;
    margin-right: 5px;
    position: relative;

    .del-btn {
      position: absolute;
      bottom: 4px;
      right: 4px;
    }
  }
</style>
