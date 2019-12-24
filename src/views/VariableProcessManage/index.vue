<template>
  <el-container class="container">
    <el-header class="header" height="180">
      <el-form :inline="true" size="mini">
        <el-form-item label="名称：" style="width:30%">
          <el-input v-model="input_processName" type="text" placeholder="请输入规则流程名" />
        </el-form-item>
        <el-form-item label="业务" style="width:30%">
          <el-select v-model="input_busniessName">
            <el-option v-for="biz in bizList" :key="biz.key" :value="biz.value">{{ biz.value }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main class="main" style="height: 420px">
      <div v-show="isShowTable" class="tips">
        共搜到{{ pagination.records }}条数据
      </div>
      <div class="btn-msgbxVariable">
        <el-button type="primary" @click="handleAdd">添加规则流程</el-button>
      </div>
      <!-- 表格数据显示 -->
      <el-table v-loading="isLoading" :data="processList" style="width: 180;">
        <el-table-column label="规则流程ID">
          <template slot-scope="scope">
            <span>{{ scope.row.processId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="业务">
          <template slot-scope="scope">
            <span>{{ scope.row.businessName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="流程代码">
          <template slot-scope="scope">
            <span>{{ scope.row.processCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="名称">
          <template slot-scope="scope">
            <span>{{ scope.row.processName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述">
          <template slot-scope="scope">
            <span>{{ scope.row.processDescribe }}</span>
          </template>
        </el-table-column>
        <el-table-column label="触发环节">
          <template slot-scope="scope">
            <span>{{ scope.row.triggerLink }}</span>
          </template>
        </el-table-column>
        <el-table-column label="修改时间">
          <template slot-scope="scope">
            <span>{{ scope.row.updateTime }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="脚本类型">
          <template slot-scope="scope">
            <span>{{ scope.row.scriptType }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" min-width="200px">
          <template slot-scope="scope">
            <el-row>
              <el-col :span="6"><div class="grid-content"><el-button class="mini-btn bg-red" size="mini" @click="handleDelete(scope.$index)">删除</el-button></div></el-col>
              <el-col :span="6"><div class="grid-content"><el-button class="mini-btn bg-blue" size="mini" @click="handleEdit(scope.$index)">编辑</el-button></div></el-col>
              <el-col :span="6"><div v-show="scope.row.publishStatus === 'unpublished'" class="grid-content"><el-button class="mini-btn bg-green" size="mini" @click="handleRelease(scope.$index)">发布</el-button></div></el-col>
              <el-col :span="6"><div v-show="scope.row.publishStatus === 'published'" class="grid-content"><el-button class="mini-btn bg-orange" size="mini" @click="handleOffLine(scope.$index)">下线</el-button></div></el-col>
              <el-col :span="6"><div v-show="scope.row.publishStatus === 'published'" class="grid-content"><el-button class="mini-btn bg-yellow" size="mini" @click="jumpConfig(scope.$index)">规则管理</el-button></div></el-col>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer v-show="isShowTable" style="margin-bottom: 20px;">
      <el-pagination class="pagination" background layout="prev, pager, next" :page-size="pagination.pageSize" :total="pagination.records" :current-page="pagination.pageNumber" @current-change="handlePageChange" />
    </el-footer>
    <!-- 添加规则流程对话框 -->
    <el-dialog class="dialog" :modal-append-to-body="false" :visible.sync="isShowAdddialog" title="添加规则流程" width="40%" top="8vh">
      <el-row>
        <p>
          <span class="required" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;业务:
          <el-select v-model="processAdd.businessName">
            <el-option v-for="bus in bizList" :key="bus.key" :value="bus.value">{{ bus.value }}</el-option>
          </el-select>
        </p>
        <p>
          <span class="required" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名称: <el-input v-model="processAdd.processName" placeholder="请输入" style="width: 70%" />
        </p>
        <p>
          <span class="required" />流程代码:<el-input v-model="processAdd.processCode" placeholder="请输入" style="width: 70%" />
        </p>
        <p>
          <span class="required" />触发环节:
          <el-select v-model="processAdd.triggerLinkKey">
            <el-option v-for="(triggerLink, index) in allTriggerLink" :key="index" :value="triggerLink.key">{{ triggerLink.key }}</el-option>
          </el-select>
        </p>
        <p>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;描述: <el-input v-model="processAdd.describe" type="textarea" placeholder="请输入" style="width: 70%" />
        </p>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addProcess">提交</el-button>
      </div>
    </el-dialog>
    <!-- 编辑规则流程对话框 -->
    <el-dialog class="dialog" :modal-append-to-body="false" :visible.sync="isShowEditDialog" title="编辑规则流程" width="40%" top="8vh">
      <el-row>
        <p>
          <span class="required" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;业务:
          <el-select v-model="processEdit.businessName">
            <el-option v-for="bus in bizList" :key="bus.key" :value="bus.value">{{ bus.value }}</el-option>
          </el-select>
        </p>
        <p>
          <span class="required" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名称: <el-input v-model="processEdit.processName" placeholder="请输入" style="width: 70%" />
        </p>
        <p>
          <span class="required" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;流程代码: <el-input v-model="processEdit.processCode" placeholder="请输入" style="width: 70%" />
        </p>
        <p>
          <span class="required" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;触发环节:
          <el-select v-model="processEdit.triggerLink">
            <el-option v-for="(triggerLink) in allTriggerLink" :key="triggerLink.value" :label="triggerLink.key" :value="triggerLink.value" />
          </el-select>
        </p>
        <p>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;描述: <el-input v-model="processEdit.processDescribe" type="textarea" placeholder="请输入" style="width: 70%" />
        </p>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editProcess">提交</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import api from '../../api/index.js'

const {
  getType,
  getProcessList,
  postProcessDelete,
  postProcessAdd,
  getTriggerLinkQery,
  // postProcessManage,
  // getPacakgeSearch,
  postProcessEdit,
  // getProcessInfo
  postProcessOfflinee,
  postProcessRelease
} = api
export default {
  data() {
    return {
      input_busniessName: '',
      input_processName: '',
      businessName: '',
      processName: '',
      isLoading: false,
      processList: [
        {
          processId: '1',
          businessName: 'pp',
          processName: '业务1',
          processCode: 'BUSI',
          processDescribe: 'desc',
          triggerLink: 'trigger',
          updateTime: '2019.07.16'
        },
        {
          processId: '2',
          businessName: 'pp',
          processName: '业务2',
          processCode: 'BUSI2',
          processDescribe: 'desc',
          triggerLink: 'trigger',
          updateTime: '2019.07.18'
        }
      ],
      isShowTable: false,
      isShowAdddialog: false,
      isShowEditDialog: false,
      clickFlag: false, // 标记search按钮是否点击过，若点击过，调用addProcess方法后，直接调用requesProcessList，否则不调用
      allTriggerLink: [],
      processAdd: {
        businessName: '',
        processName: '',
        processCode: '',
        triggerLinkKey: '',
        describe: ''
      },
      processEdit: {},
      // 分页配置
      pagination: {
        pageSize: 3,
        pageNumber: 1,
        records: 0
      },
      variableManageList: [],
      varTypeList: [],
      dataTypeList: [],
      bizList: []
    }
  },
  mounted() {
    this.getInitData()
    this.getAllTriggerLink()
  },
  methods: {
    /**
     * 获取变量类型，数据类型，业务类型
     */
    getInitData() {
      getType().then(({ data }) => {
        this.bizList = data.content.bizList
        this.dataTypeList = data.content.dataTypeList
        this.varTypeList = data.content.varTypeList
      })
    },
    getAllTriggerLink() {
      getTriggerLinkQery({})
        .then(({ data }) => {
          this.allTriggerLink = data.content.TriggerLinkEnums
        })
        .catch(err => console.log(err))
    },
    jumpConfig(index) {
      this.$router.push(`/rulemanage/processconfig?processId=${this.processList[index].processId}`)
    },
    // 请求获取规则流程列表
    requestProcessList() {
      this.isLoading = true
      getProcessList(this.getSearchOption())
        .then(({ data }) => {
          console.log(data)
          if (data.status === 'success') {
            if (data.content.rows.length === 0 && this.pagination.pageNumber > 1) {
              this.pagination.pageNumber--
              this.requestProcessList()
            }
            this.processList = data.content.rows
            this.isLoading = false
            this.isShowTable = true
            this.pagination.records = data.content.records
            return
          }
          this.isLoading = false
          this.$message.error('查询失败，请输入查询条件')
        })
        .catch(err => {
          this.isLoading = false
          console.log(err)
          this.$message.error('请求发送失败')
        })
    },
    handleSearch() {
      this.processName = this.input_processName
      this.businessName = this.input_busniessName
      if (this.getSearchOption()) {
        this.pageNumber = 1
        this.clickFlag = true
        this.requestProcessList()
        this.input_busniessName = ''
        this.input_processName = ''
      }
    },
    handleDelete(index) {
      this.$confirm('确认删除规则流程？')
        // 确认删除
        .then(() => {
          // 删除规则流程
          postProcessDelete(this.getDeleteOption(index))
            .then(({ data }) => {
              console.log(data)
              if (data.status === 'success') {
                this.$message({ type: 'success', message: '删除成功' })
                this.requestProcessList()
                return
              }
              this.$message.error(`删除失败-${data.message}`)
            })
        })
        .catch(() => this.$message('已取消删除'))
    },
    // 显示添加规则流程界面
    handleAdd() {
      this.isShowAdddialog = true
      this.clearObj(this.processAdd)
    },
    // 添加规则流程
    addProcess() {
      if (this.validateAddOption()) {
        postProcessAdd(this.getAddOption())
          .then(({ data }) => {
            if (data.status === 'success') {
              this.$message({ type: 'success', message: '添加成功' })
              // 更新规则流程列表
              if (this.clickFlag) {
                // 如果已点击过search按钮，则表示form列表已显示，则直接调用requestProcessList，否则，form处于隐藏状态,会由于搜索参数为空而报错
                // 当出现用户点击搜索后，然后清空搜索条件后，再点击点击添加规则流程后会导致搜索参数为空而抛出搜索错误，但添加操作应该是正常完成的
                this.requestProcessList()
              }
              this.isShowAdddialog = false
              this.clearObj(this.processAdd)
              return
            }
            this.$message.error(`添加失败-${data.message}`)
          })
          .catch(err => console.log(err))
      }
    },
    editProcess() {
      const option = {}
      for (const key of Object.keys(this.processEdit)) {
        if (key !== 'updateTime') {
          option[key] = this.processEdit[key]
        }
        option['businessCode'] = this.findBusinessCodeByName(this.processEdit['businessName'])
      }
      console.log(option)
      this.$confirm('确认修改规则流程吗？')
        .then(() => {
          postProcessEdit(option)
            .then(({ data }) => {
              if (data.status === 'success') {
                this.$message({ type: 'success', message: '修改成功' })
                this.processEdit = {}
                this.isShowEditDialog = false
              } else {
                this.$message.error(`失败-${data.message}`)
              }
            })
            .catch(err => {
              console.log(err)
              this.$message.error('请求发送失败')
            })
        })
        .catch(() => {
          this.$message('操作已取消')
        })
    },
    handleEdit(index) {
      this.isShowEditDialog = true
      this.processEdit = this.processList[index]
    },
    handleTest(index) {
      console.log(index, 'test')
    },
    handleRelease(index) {
      postProcessRelease(this.getStateChangeOption(index))
        .then(({ data }) => {
          if (data.status === 'success') {
            this.$message({ type: 'success', message: '发布成功' })
            this.requestProcessList()
            return
          }
          this.$message.error(`发布失败-${data.message}`)
        })
        .catch(err => {
          console.log(err)
          this.$message.error('请求出错')
        })
    },
    handleOffLine(index) {
      postProcessOfflinee(this.getStateChangeOption(index))
        .then(({ data }) => {
          if (data.status === 'success') {
            this.$message({ type: 'success', message: '下线成功' })
            this.requestProcessList()
            return
          }
          this.$message.error(`下线失败-${data.message}`)
        })
        .catch(err => {
          console.log(err)
          this.$message.error('请求出错')
        })
    },
    // 处理分页跳转
    handlePageChange(index) {
      this.pagination.pageNumber = index
      this.requestProcessList()
    },
    validateSearchOption() {
      if (!(this.businessName || this.processName)) {
        this.$message.error('参数缺失')
        return false
      }
      return true
    },
    validateAddOption() {
      if (!(this.processAdd.businessName && this.processAdd.processName && this.processAdd.processCode && this.processAdd.triggerLinkKey)) {
        this.$message.error('必填参数不能为空')
        return false
      }
      return true
    },
    getSearchOption() {
      const option = {}
      if (this.businessName) {
        option['businessCode'] = this.findBusinessCodeByName(this.businessName)
      }
      if (this.processName) {
        option['processName'] = this.processName
      }
      option['pageSize'] = this.pagination.pageSize
      option['pageNumber'] = this.pagination.pageNumber
      return option
    },
    getStateChangeOption(index) {
      const option = {}
      option['processId'] = this.processList[index].processId
      return option
    },
    getDeleteOption(index) {
      const option = {}
      option['processId'] = this.processList[index].processId
      return option
    },
    getAddOption() {
      const { processAdd } = this
      const option = {}
      for (const key of Object.keys(processAdd)) {
        if (key !== 'businessName' && key !== 'allTriggerLink' && key !== 'triggerLinkKey') {
          option[key] = processAdd[key]
        }
      }
      option['businessCode'] = this.findBusinessCodeByName(processAdd.businessName)
      option['triggerLink'] = this.findTriggerLinkValueByKey(processAdd.triggerLinkKey)
      return option
    },
    findBusinessCodeByName(businessName) {
      return this.bizList.find(business => business.value === businessName).key
    },
    findTriggerLinkValueByKey(triggerLinkKey) {
      return this.allTriggerLink.find(triggerLink => triggerLink.key === triggerLinkKey).value
    },
    findTriggerLinkKeyByValue(triggerLinkValue) {
      return this.allTriggerLink.find(triggerLink => triggerLink.value === triggerLinkValue).key
    },
    clearObj(obj) {
      const o = obj
      for (const key of Object.keys(o)) {
        o[key] = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .container {
    padding: 10px;
    box-sizing: border-box;
    .header {
      background:rgb(247, 247, 247);
      padding: 20px;
      // box-sizing:border-box;
      .label {
        width: 30%;
        height: 30px;
        margin-right: 3%;
        box-sizing: border-box;
        float: left;
        .select {
          width: 180px;
        }
      }
    }
    .main {
      .btn-msgbxVariable {
        margin-top: 10px;
      }
      .bg-red {
        color: #fff;
        background: rgb(255, 0, 0);
      }
      .bg-blue {
        color: #fff;
        background: rgb(16, 142, 233);
      }
      .bg-yellow {
        color: #fff;
        background: rgb(220, 200, 100);
      }
      .bg-green {
        color: #fff;
        background: rgb(102, 204, 102);
      }
      .bg-orange {
        color: #fff;
        background: rgb(255, 97, 0);
      }
    }
    .pagination {
      position: absolute;
      margin-left: 50%;
      transform: translateX(-50%);
    }
  }

  input, select {
    width: 180px;
  }
  .label {
    font-weight: 500;
  }
  .required::before {
    content: "*";
    color: red;
  }

</style>
