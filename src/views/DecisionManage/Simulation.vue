<template>
  <div class="page-container">
    <el-row type="flex" align="middle" style="background:rgb(247, 247, 247);padding:40px;">
      <el-col :span="9">规则流程代码：<el-input v-model="processCode" style="width: 150px" size="mini" placeholder="请输入" /></el-col>
      <el-col :span="7">业务：
        <el-select v-model="workValue" placeholder="全部" size="mini">
          <el-option
            v-for="item in workList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col :span="8"><el-button icon="el-icon-search" type="primary" size="small" @click="searchRule">搜索</el-button></el-col>
    </el-row>
    <div class="result">共搜索到{{ searchLength }}条数据</div>
    <el-table
      v-loading="tableLoading"
      :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 100%"
    >
      <el-table-column label="规则流程ID" prop="processId" />
      <el-table-column label="业务" prop="businessName" />
      <el-table-column label="名称" prop="processName" />
      <el-table-column label="描述" prop="processDescribe" />
      <el-table-column label="修改时间" prop="updateTime" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="goSimulationDetail(scope.row)">规则模拟</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--    分页-->
    <div class="footer">
      <el-pagination
        background
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import api from '../../api/decision.js'
const { getSimulationList, getWorkParams } = api
export default {
  name: 'PagePermission',
  // components: { SwitchRoles },
  data() {
    return {
      tableLoading: false,
      // 搜索结果数
      searchLength: 2,
      processCode: '',
      workValue: '',
      // 业务类型
      workList: [],
      tableData: [
        {
          processId: '1',
          businessName: 'BUSI',
          processName: '业务1',
          processDescribe: 'desc',
          updateTime: '2019.07.16',
        },
        {
          processId: '2',
          businessName: 'BUSI2',
          processName: '业务2',
          processDescribe: 'desc',
          updateTime: '2019.07.18',
        }
      ],
      // 分页
      currentPage: 1,
      total: 0,
      pageSize: 3
    }
  },
  created() {
    this.getInitData()
  },
  methods: {
    searchRule() {
      this.tableLoading = true
      const args = { businessCode: this.workValue, processCode: this.processCode }
      getSimulationList(args).then(({ data }) => {
        console.log(data)
        if (data.code === '000000') {
          this.tableData = data.content.rows
          this.searchLength = data.content.records
          this.total = data.content.records
          // this.pageSize = data.content.pageSize
        }
        this.tableLoading = false
      })
    },
    goSimulationDetail(row) {
      sessionStorage.setItem('businessCode', JSON.stringify(this.workValue))
      sessionStorage.setItem('processCode', JSON.stringify(row.processCode))
      sessionStorage.setItem('triggerLinkEnums', JSON.stringify(row.triggerLinkEnums))
      this.$router.push({ path: 'simulationdetail', query: { processId: row.processId }})
    },
    // 分页
    handleSizeChange() {
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
    },
    getInitData() {
      this.workList = []
      getWorkParams().then(({ data }) => {
        const bizList = data.content.bizList
        bizList.forEach(item => {
          this.workList.push({ value: item.key, label: item.value })
        })
      })
    }

  }
}
</script>
<style lang="scss" scoped>
  .page-container{
    padding: 20px;
    font-size: 14px;
    position: relative;
  }
  .result{
    padding: 40px 0;
  }
  .footer{
    /*position: fixed;*/
    /*bottom: 70px;*/
    /*right: 20px;*/
    text-align: right;
    padding: 15px 0;
  }
</style>
