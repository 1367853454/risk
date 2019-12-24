<template>
  <div class="app-container">
    <el-row>
      <el-button type="primary" size="mini" @click="handleBack">
        返回
      </el-button>
    </el-row>
    <el-header class="header" height="180">
      <el-form :inline="true" size="mini">
        <el-form-item label="规则包代码：" style="width: 33%">
          <el-input v-model="input_packageCode" placeholder="请输入" />
        </el-form-item>
        <!-- <el-form-item label="规则包名称：" style="width: 28%">
          <el-input v-model="input_packageName" placeholder="请输入" />
        </el-form-item> -->
        <el-form-item label="业务：" style="width: 33%">
          <el-select v-model="input_businessCode">
            <el-option v-for="biz in bizList" :key="biz.key" :label="biz.value" :value="biz.key" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <div class="search-result" style="width:100%;height:120px;text-align:center;font-weight:800;font-size:30px;color:gray;border-bottom: 2px solid rgb(224, 224, 224);margin-bottom: 20px;">
      <div v-show="packageSearch.length == 0" style="line-height:120px;">
        暂无搜索结果
      </div>
      <div>
        <el-table v-show="packageSearch.length > 0" :data="packageSearch" row-key="id" border fit highlight-current-row style="width: 100%;margin-bottom: 40px;">
          <el-table-column width="120px" align="center" label="规则包ID">
            <template slot-scope="scope">
              <span>{{ scope.row.packageId }}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="300px" align="center" label="规则包名称">
            <template slot-scope="scope">
              <span>{{ scope.row.packageName }}</span>
            </template>
          </el-table-column>

          <el-table-column width="200px" align="center" label="规则包编号">
            <template slot-scope="scope">
              <span>{{ scope.row.packageCode }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center">
            <template>
              <el-button type="primary" size="mini" @click="handleAdd()">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-row style="padding: 10px;font-size: 25px;color:#666">
      规则流程
    </el-row>
    <el-table ref="dragTable" v-loading="isLoading" :data="processPackageList" row-key="packageId" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="规则包ID" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.packageId }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="300px" align="center" label="规则包名称">
        <template slot-scope="scope">
          <span>{{ scope.row.packageName }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="规则包代码">
        <template slot-scope="scope">
          <span>{{ scope.row.packageCode }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <div>
            <el-button type="danger" @click="handleRemove(scope.$index)">移除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px;position:relative;width: 100%;height: 200px;">
      <div style="position:absolute;left:50%;top:50%;transform:translate(-50%, -50%)">
        <el-button type="primary" @click="handleSaveSort()">保存</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
import api from '../../api/index.js'

const {
  getType,
  getPackageSearch,
  getProcessPackage,
  postProcessManage
} = api

export default {
  // name: 'DragTable',
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      input_packageCode: '',
      input_businessCode: '',
      bizList: [],
      packageSearch: [],
      processPackageList: [],
      isLoading: false,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      sortable: null,
      oldList: [],
      newList: []
    }
  },
  mounted() {
    this.getInitData()
    const processId = this.$route.query.processId
    this.searchProcessPackage(processId)
    this.setSort()
  },
  methods: {
    getInitData() {
      getType()
        .then(({ data }) => {
          if (data.status === 'success') {
            this.bizList = data.content.bizList
          } else {
            this.$message.error('获取业务列表失败')
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('请求发送失败')
        })
    },
    searchPackage() {
      const option = {}
      if (this.input_packageCode.trim() === '' || this.input_businessCode.trim() === '') {
        this.$message.error('业务类型和规则包代码不能为空')
        return
      }
      this.isLoading = true
      option['businessCode'] = this.input_businessCode.trim()
      option['packageCode'] = this.input_packageCode.trim()
      getPackageSearch(option)
        .then(({ data }) => {
          if (data.status === 'success') {
            this.packageSearch = [data.content]
          } else {
            if (data.message === 'package info not existed') {
              this.$message.error('未查询到结果')
            } else {
              this.$message.error(`失败-${data.message}`)
            }
          }
        })
        .catch(err => {
          console.log(err.message)
          this.$message.error('获取规则包列表失败')
        })
        .finally(() => {
          this.isLoading = false
          this.input_packageCode = ''
          this.input_businessCode = ''
        })
    },
    handleSearch() {
      this.searchPackage()
    },
    handleAdd() {
      const p = this.packageSearch[0]
      if (this.processPackageList.find(pack => pack.packageId === p.packageId)) {
        this.$message.warning('规则包已存在当前规则流程中')
        return
      }
      // p.orderNumber = this.processPackageList.length + 1
      this.newList.push(p.packageId)
      this.processPackageList.push(this.packageSearch.pop())
      this.$nextTick(() => {
        this.setSort()
      })
      // this.sortable = null
      // this.setSort()
      // console.log(this.processPackageList)
    },
    handleRemove(index) {
      this.processPackageList.splice(index, 1)
      this.newList.splice(index, 1)
      this.$nextTick(() => {
        this.setSort()
      })
    },
    handleSaveSort() {
      this.saveSort()
    },
    handleCancel() {
      const processId = this.$route.query.processId
      this.searchProcessPackage(processId)
      this.$message('您已取消编辑')
    },
    handleBack() {
      this.$router.go(-1)
    },
    searchProcessPackage(processId) {
      getProcessPackage({ processId })
        .then(({ data }) => {
          if (data.status === 'success') {
            this.processPackageList = data.content
            this.oldList = this.processPackageList.map(pack => pack.packageId)
            this.newList = this.oldList.slice()
            this.$nextTick(() => {
              this.setSort()
            })
          } else {
            this.$message.error(`失败-${data.message}`)
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('请求发送失败')
        })
    },
    saveSort() {
      postProcessManage(this.getSortUpdateOption())
        .then(({ data }) => {
          if (data.status === 'success') {
            this.$message({ type: 'success', message: '保存成功' })
          } else {
            this.$message.error(`保存失败-${data.message}`)
          }
        })
        .catch(err => {
          console.log(err.message)
          this.$message('请求发送失败')
        })
    },
    setSort() {
      const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function(dataTransfer) {
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.processPackageList.splice(evt.oldIndex, 1)[0]
          console.log(targetRow)
          this.processPackageList.splice(evt.newIndex, 0, targetRow)
          console.log(this.processPackageList)
          // for show the changes, you can delete in you code
          const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
          this.newList.splice(evt.newIndex, 0, tempIndex)
        }
      })
    },
    getSortUpdateOption() {
      const option = {}
      option['processId'] = this.$route.query.processId
      option['processManagePackageFormList'] = []
      this.processPackageList.forEach((pack, index) => {
        const temp = {}
        temp['packageCode'] = pack.packageCode
        temp['orderedNumber'] = index + 1
        option['processManagePackageFormList'].push(temp)
      })
      return option
    }
  }
}
</script>

<style>

.header {
  background:rgb(247, 247, 247);
  padding: 20px;
}
.sortable-ghost{
  opacity: .8;
  color: #fff!important;
  background: #42b983!important;
}
</style>

<style scoped>
.icon-star{
  margin-right:2px;
}
.drag-handler{
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.show-d{
  margin-top: 15px;
}
</style>
