<template>
  <el-select v-model="code"
             @clear="clear"
             @focus="focus"
             filterable :filter-method="codeFilter" :placeholder="$t('common.pleaseSelect')" clearable>
    <el-option
      v-for="item in options"
      :key="item.areaCode"
      :label="item.areaCode"
      :value="item.areaCode"

    >
      <span style="float: left">{{ item.countryEn }}/{{ item.country }}</span>
      <span style="float: right; color: #8492a6; font-size: 14px">{{ item.areaCode }}</span>
    </el-option>
  </el-select>
</template>

<script>
  import {MobileAreaCode} from '@/api'

  export default {
    name: '',
    props: {
      value: {
        type: String
      }
    },
    data() {
      return {
        listQuery: {
          page: 1,
          limit: 1000,
          hidden: false
        },
        list: [],
        options: []
      }
    },
    computed: {
      code: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('input', val)
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      // 获取数据
      getList() {
        MobileAreaCode.fetchList(this.listQuery).then(res => {
          this.options = this.list = res.data.list
        })
      },
      codeFilter(query = '') {
        let arr = this.list.filter((item) => {
          return item.country.includes(query) || item.areaCode.includes(query)
        })
        if (!query) {
          arr = this.list.slice(0, 10)
        }
        if (arr.length > 10) {
          this.options = arr.slice(0, 10)
        } else {
          this.options = arr
        }
      },
      clear() {
        this.code = null
        this.codeFilter();
      },
      focus() {
        if (this.code == null) {
          this.codeFilter();
        }
      }
    }
  }
</script>

<style scoped>

</style>
