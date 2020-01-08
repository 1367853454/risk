<template>
  <div class="detail-container">
    <el-row style="margin-bottom: 20px;">
      <el-button type="primary" size="mini" @click="$router.go(-1)">返回</el-button>
    </el-row>
    <el-table :data="ruleData" style="width: 100%">
      <el-table-column label="业务" prop="businessName" />
      <el-table-column label="名称" prop="processName" />
      <el-table-column label="描述" prop="processDescribe" />
      <!--      <el-table-column label="当前版本" />-->
      <el-table-column label="修改时间" prop="updateTime" />
    </el-table>
    <el-row type="flex" align="middle" style="padding: 15px 0; margin-top: 50px;">
      <el-col :span="6">数据类型
        <el-select v-model="input_dataType" placeholder="全部" size="mini">
          <el-option
            v-for="item in dataTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col :span="8">订单创建时间
        <el-date-picker
          v-model="input_orderTiem"
          size="mini"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
        />
      </el-col>
      <el-col :span="2">最多展示一周数据</el-col>
      <el-col :span="6">
        <div class="button"><el-button icon="el-icon-search" type="primary" size="small" @click="handleSearch">查询</el-button></div>
      </el-col>
    </el-row>
    <el-table v-loading="lendTableLoading" ref="lendTable" :data="lendData" style="width:100%;" @selection-change="handleSelectionChange" :row-key="getRowKeys">
      <el-table-column type="selection" :reserve-selection="true" width="50" />
      <el-table-column label="借款编号" align="center" prop="orderCode" />
      <el-table-column label="对应产品" align="center" prop="businessName" />
      <el-table-column label="客户姓名" align="center" prop="fullName" />
      <el-table-column label="手机号码" align="center" prop="mobile" />
      <el-table-column label="借款金额" align="center" prop="applicationAmount" />
      <el-table-column label="借款期限" align="center" prop="termOfLoan" width="100" />
      <el-table-column label="创建时间" align="center" prop="createTime" />
    </el-table>
    <!--    分页-->
    <div class="footer">
      <el-pagination
        v-show="lendData.length > 0"
        background
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <div class="button"><el-button type="primary" size="small" @click="goRuleSimulation">规则模拟</el-button></div>

  </div>
</template>

<script>
import api from '../../api/decision'
const {
  getRuleProcess,
  getDataType,
  getOrderList
} = api
export default {
  name: 'SimulationDetail',
  data() {
    return {
      lendTableLoading: false,
      // 规则，订单表格数据
      ruleData: [],
      lendData: [],
      // 数据类型
      input_dataType: '',
      input_orderTiem: [],
      dataType: '',
      dataTypeList: [],
      // 订单创建时间
      orderTime: [],
      // 分页
      currentPage: 1,
      total: 0,
      pageSize: 10,
      orderCodeList: [],
      orderCodeSet: new Set()
    }
  },
  watch: {
    '$route': {
      handler() {
        this.getInitData()
      },
      immediate: true
    }
  },
  methods: {
    // 请求获取查询订单列表
    reqOrderList() {
      this.lendTableLoading = true
      getOrderList(this.getOrderSearchOption()).then(({ data }) => {
        if (data.status === 'success') {
          this.lendData = data.content.rows
          this.total = data.content.records
          // this.$refs.lendTable.toggleAllSelection()
          return
        }
        this.$message.error(`${data.message}`)
      })
        .catch((err) => {
          console.log(err.response)
        })
        .finally(this.lendTableLoading = false)
    },
    handleSearch() {
      this.dataType = this.input_dataType
      if (!this.input_orderTime || this.input_orderTime.length !== 0) {
        this.orderTime = this.input_orderTiem
      }
      this.currentPage = 1
      this.reqOrderList()
      this.input_dataType = ''
      this.input_orderTiem = ''
    },
    getInitData() {
      // 初始化数据
      this.dataType = 'PASS'
      this.dataTypeList = []
      this.lendData = []
      this.orderTime = []
      // 获取规则流程
      const processId = Number(this.$route.query.processId)
      if (processId) {
        getRuleProcess({ processId: processId }).then(({ data }) => {
          this.ruleData = []
          this.ruleData.push(data.content)
        })
      }
      // 获取数据类型
      getDataType().then(({ data }) => {
        const dataType = data.content.dataType
        dataType.forEach(item => {
          this.dataTypeList.push({ value: item.key, label: item.value })
        })
      })
    },
    goRuleSimulation() {
      console.log(this.orderCodeList)
      if (this.orderCodeList.length === 0) {
        this.$message.error('请选择至少一条记录，才能进行模拟')
        return
      }
      sessionStorage.setItem('ruleData', JSON.stringify(this.ruleData))
      sessionStorage.setItem('orderCodeList', JSON.stringify(this.orderCodeList))
      this.$router.push({ path: 'simulationresult' })
      this.clearData()
    },
    // 分页
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.currentPage = 1
      this.reqOrderList()
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.reqOrderList()
    },
    handleSelectionChange(selection) {
      this.orderCodeSet = new Set()
      selection.forEach(row => {
        this.orderCodeSet.add(row.orderCode)
      })
      this.orderCodeList = this.orderCodeSet
      console.log('orderCodeSet', this.orderCodeList)
    },
    getRowKeys(row) {
      return row.orderCode
    },
    clearData() {
      this.ruleData = []
      this.lendData = []
      this.dataType = ''
      this.orderTime = []
      this.orderCodeList = []
      this.orderCodeSet = new Set()
    },
    getOrderSearchOption() {
      const option = {}
      if (this.orderTime[0]) {
        option['startDate'] = this.orderTime[0]
        option['endDate'] = this.orderTime[1]
        this.orderTime = []
      }
      option['pageSize'] = this.pageSize
      option['pageNumber'] = this.currentPage
      option['dataType'] = this.dataType
      return option
    }
  }
}
</script>

<style lang="scss" scoped>
  .detail-container{
    padding: 20px;
    font-size: 14px;
  }
  .footer{
    text-align: right;
    padding: 15px 0;
  }
  .button{
    padding: 15px;
    text-align: center;
  }
  .el-button.el-button--primary.el-button--small{
    width: 100px;
  }
</style>
