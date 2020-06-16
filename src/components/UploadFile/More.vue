<template>
  <div>

    <el-upload
      action=""
      :file-list="fileList"
      :before-upload="beforeUploadHandle"
      :http-request="uploadImage"
      :on-remove="handleRemove"
      list-type="picture-card"
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
          this.list.push({url: res.data.url, uid: file.file.uid})
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
