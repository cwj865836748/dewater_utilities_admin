<template>
  <div>

    <el-upload
      class="upload-demo"
      :http-request="uploadFile"
      drag
      name="file"
      action=""
      :accept="accept"
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
        type: Array,
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
        if (!file.size) {
          this.$message.error(this.$t('common.uploadFileNullTip'))
          return false
        }
      },
      uploadFile(file) {
        const formData = new FormData()
        formData.append('file', file.file)
        Common.uploadFile(formData).then((res) => {
          this.list.push({fileUrl: res.data.url, uid: file.file.uid, name: file.file.name})
          this.$message({
            message: res.msg || this.$t('common.success'),
            type: 'success'
          })
        })
      },
      handleRemove(file, fileList) {
        this.list.splice(this.list.findIndex(item => item.uid === file.uid), 1)
      },
    }
  }
</script>

<style scoped>

</style>
