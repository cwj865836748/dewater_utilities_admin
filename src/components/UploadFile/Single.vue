<template>
  <div>
    <el-upload
      class="upload-demo"
      :http-request="uploadFile"
      :drag="true"
      name="file"
      action=""
      :accept="accept"
      :limit="limit"
      :before-upload="beforeUploadHandle"
      :file-list="fileList"
      :on-remove="handleRemove"
    >
      <i class="el-icon-upload"/>
      <div class="el-upload__text" v-html="$t('common.uploadTip')"/>
      <div slot="tip" class="el-upload__tip">{{ $t('common.uploadFileTip') }}{{ accept}}</div>
    </el-upload>
  </div>
</template>

<script>
  import {Common} from '@/api'

  export default {
    name: '',
    props: {
      value: {
        type: String
      },
      limit: {
        type: Number,
        default: 1
      },
      type: {
        type: Number,
        default: 1 // 0所有 1图片 2ppt
      },
      accept: {
        type: String,
        default: '*.*'
      }
    },
    data() {
      return {
        fileList: []
      }
    },
    computed: {},
    watch: {
      value: {
        handler(newVal, oldVal) {
          if (this.value) {
            const fileName = this.value.replace(/(.*\/)*([^.]+).*/ig, '$2')
            this.fileList = this.value ? [{name: fileName, url: this.value}] : []
          }
        },
        deep: true,
        immediate: true
      },
      fileList: {
        handler(newVal, oldVal) {
          if (this.fileList.length > 0) {
            this.$emit('input', this.fileList[0].url)
          } else {
            this.$emit('input', '')
          }
        },
        deep: true,
        immediate: true

      }
    },
    created() {

    },
    mounted() {

    },
    methods: {
      beforeUploadHandle(file) {
        if (!file.size) {
          this.$message.error(this.$t('common.uploadFileNullTip'))
          return false
        }
      },
      uploadFile(file) {
        const formData = new FormData()
        formData.append('file', file.file)
        Common.uploadFile(formData).then((res) => {
          // const fileName = res.data.url.replace(/(.*\/)*([^.]+).*/ig, '$2')
          this.fileList.push({name: file.file.name, url: res.data.url})
          this.$message({
            message: res.msg || this.$t('common.success'),
            type: 'success'
          })
        })
      },
      handleRemove(file, fileList) {
        this.fileList = fileList
      }
    }
  }
</script>

<style scoped>

</style>
