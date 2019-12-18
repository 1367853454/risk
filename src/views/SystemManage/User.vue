<template>
  <el-container class="container">
    <!--搜索栏-->
    <el-header class="header" height="90px">
      <el-form :inline="true" size="mini">
        <el-form-item label="真实姓名:" style="width: 36%">
          <el-input v-model="fullName" type="text" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="状态" style="width: 36%">
          <el-select v-model="status">
            <el-option v-for="sta in statusList" :key="sta.key" :value="sta.key">{{ sta.value }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width:24%">
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <!--主题数据展示-->
    <el-main class="main" style="height: 420px">
      <div v-show="isShowSearch" class="tips">
        共搜到{{ pagination.records }}条数据
      </div>
      <div class="btn-addUser">
        <el-button type="primary" @click="openAdd">添加用户</el-button>
      </div>
      <el-table v-loading="isLoading" class="table" :data="userSearchList">
        <el-table-column label="用户ID">
          <template slot-scope="scope">
            <span>{{ scope.row.userId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="真实姓名">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户名">
          <template slot-scope="scope">
            <span>{{ scope.row.account }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机">
          <template slot-scope="scope">
            <span>{{ scope.row.mobile }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间">
          <template slot-scope="scope">
            <span>{{ scope.row.updateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span>{{ scope.row.status }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="180px">
          <template slot-scope="scope">
            <el-row>
              <el-col :span="6"><div class="grid-content"><el-button size="mini" type="primary" @click="show(scope.row.account,0)">查看</el-button></div></el-col>
              <el-col :span="6"><div class="grid-content"><el-button v-show="scope.row.status !== 'deleted'" size="mini" type="info" @click="show(scope.row.account,1)">编辑</el-button></div></el-col>
              <el-col :span="6"><div class="grid-content"><el-button v-show="scope.row.status === 'stop'" size="mini" type="success" @click="startUsing(scope.row.account)">启用</el-button></div></el-col>
              <el-col :span="6"><div class="grid-content"><el-button v-show="scope.row.status === 'normal'" size="mini" type="danger" @click="stopUsing(scope.row.account)">停用</el-button></div></el-col>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <!--底部页码-->
    <el-footer v-show="isShowSearch" style="margin-bottom: 20px;">
      <el-pagination class="pagination" background layout="prev, pager, next" :page-size="pagination.pageSize" :total="pagination.records" :current-page="pagination.pageNumber" @current-change="jump" />
    </el-footer>
    <!--显示增加用户栏框-->
    <el-dialog v-show="isShowAdd" :visible.sync="isShowAdd" title="添加用户" width="40%" top="8vh">
      <p>
        <label class="mylabel"><span class="required" />用户名</label>
        <el-input v-model="addUser.account" style="width: 70%" />
      </p>
      <p>
        <label class="mylabel">真实姓名</label>
        <el-input v-model="addUser.name" style="width: 70%" />
      </p>
      <p>
        <label class="mylabel">手机号</label>
        <el-input v-model="addUser.mobile" style="width: 70%" />
      </p>
      <p>
        <label class="mylabel">角色</label>
        <el-select v-model="addUser.role" multiple placeholder="请选择...">
          <el-option v-for="role1 in roleList" :key="role1.roleId" :value="role1.roleId" :label="role1.name" />
        </el-select>
      </p>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="add">
          提交
        </el-button>
      </div>
    </el-dialog>
    <!--查看具体信息-->
    <el-dialog v-show="isShowInfo" :visible.sync="isShowInfo" title="查看用户信息" width="40%" top="8vh">
      <p>
        <label class="mylabel"><span class="required" />用户名</label>
        <el-input v-model="UserInfo.account" :disabled="true" style="width: 70%" />
      </p>
      <p>
        <label class="mylabel">真实姓名</label>
        <el-input v-model="UserInfo.name" :disabled="true" style="width: 70%" />
      </p>
      <p>
        <label class="mylabel">手机号</label>
        <el-input v-model="UserInfo.mobile" :disabled="true" style="width: 70%" />
      </p>
      <p>
        <label class="mylabel">角色</label>
        <el-select v-model="UserInfo.role" :disabled="true" multiple placeholder="请选择...">
          <el-option v-for="role1 in roleList" :key="role1.roleId" :value="role1.roleId" :label="role1.name" />
        </el-select>
      </p>
    </el-dialog>
    <!--编辑框-->
    <el-dialog v-show="isShowEdit" :visible.sync="isShowEdit" title="编辑用户" width="40%" top="8vh">
      <p>
        <label class="mylabel"><span class="required" />用户名</label>
        <el-input v-model="editUser.newAccount" style="width: 70%" />
        <el-input v-model="editUser.oldAccount" type="hidden" style="width: 70%" />
      </p>
      <p>
        <label class="mylabel">真实姓名</label>
        <el-input v-model="editUser.name" style="width: 70%" />
      </p>
      <p>
        <label class="mylabel">手机号</label>
        <el-input v-model="editUser.mobile" style="width: 70%" />
      </p>
      <p>
        <label class="mylabel">角色</label>
        <el-select v-model="editUser.role" multiple placeholder="请选择...">
          <el-option v-for="role1 in roleList" :key="role1.roleId" :value="role1.roleId" :label="role1.name" />
        </el-select>
      </p>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="edit">
          提交
        </el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import api from '../../api/SystemManage.js'
const { getStatus, getRoleInfo, getUserSearchList, postUserAdd, postStartUsing, postStopUsing, getUserInfo, postUserEdit } = api
export default {
  data() {
    return {
      addUser: {
        name: '',
        account: '',
        mobile: '',
        role: []
      },
      UserInfo: {
        name: '',
        account: '',
        mobile: '',
        role: []
      },
      editUser: {
        name: '',
        newAccount: '',
        oldAccount: '',
        mobile: '',
        role: []
      },
      fullName: '',
      status: '',
      lastFullName: '',
      lastStatus: '',
      isShowAdd: false,
      isShowSearch: false,
      isLoading: false,
      isShowInfo: false,
      isShowEdit: false,
      // 分页配置
      pagination: {
        pageSize: 3,
        pageNumber: 1,
        total: 0
      },
      userSearchList: [],
      // 没网的时候显示
      statusList: [{ value: '1' }, { value: '2' }, { value: '3' }],
      roleList: [{ value: '1' }, { value: '2' }, { value: '3' }]
    }
  },
  mounted() {
    this.getInitData()
  },
  methods: {
    show(account, flag) {
      const option = {}
      option['account'] = account
      getUserInfo(option)
        .then(({ data }) => {
          this.UserInfo.role = []
          this.editUser.role = []
          if (data.content.role.length !== 0) {
            const val = []
            for (var i = 0; i < data.content.role.length; i++) {
              val.push(data.content.role[i].roleId)
            }
            if (flag === 0) {
              this.UserInfo.role = val
            } else {
              this.editUser.role = val
            }
          }
          if (flag === 0) {
            this.UserInfo.account = data.content.account
            this.UserInfo.mobile = data.content.mobile
            this.UserInfo.name = data.content.name
            this.isShowInfo = true
          } else {
            this.editUser.newAccount = data.content.account
            this.editUser.oldAccount = data.content.account
            this.editUser.mobile = data.content.mobile
            this.editUser.name = data.content.name
            this.isShowEdit = true
          }
        })
        .catch(err => console.log(err))
    },
    startUsing(account) {
      this.$confirm('您确定要启用这吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const option = {}
        option['account'] = account
        postStartUsing(option)
          .then(({ data }) => {
            if (data.status === 'success') {
              this.$message({
                message: '启用成功',
                type: 'success'
              })
              if (((this.pagination.pageNumber - 1) * this.pagination.pageSize) === (this.pagination.records - 1)) {
                this.pagination.pageNumber = ((this.pagination.pageNumber - 1) > 0) ? (this.pagination.pageNumber - 1) : 1
              }
              this.search()
              return
            }
            this.$message.error(`启用失败-${data.message}`)
          })
          .catch(err => console.log(err))
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消启用'
        })
      })
    },
    stopUsing(account) {
      this.$confirm('您确定要停用这吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const option = {}
        option['account'] = account
        postStopUsing(option)
          .then(({ data }) => {
            if (data.status === 'success') {
              this.$message({
                message: '停用成功',
                type: 'success'
              })
              if (((this.pagination.pageNumber - 1) * this.pagination.pageSize) === (this.pagination.records - 1)) {
                this.pagination.pageNumber = ((this.pagination.pageNumber - 1) > 0) ? (this.pagination.pageNumber - 1) : 1
              }
              this.search()
              return
            }
            this.$message.error(`停用失败-${data.message}`)
          })
          .catch(err => console.log(err))
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消停用'
        })
      })
    },
    /**
     * 获取状态,角色信息
     */
    getInitData() {
      getStatus().then(({ data }) => {
        this.statusList = data.content.statusList
      })
      getRoleInfo().then(({ data }) => {
        this.roleList = data.content
      })
    },
    openAdd() {
      this.addUser.account = ''
      this.addUser.name = ''
      this.addUser.mobile = ''
      this.addUser.role = ''
      this.isShowAdd = true
    },
    search() {
      if (this.userSearchParam()) {
        this.isLoading = true
        getUserSearchList(this.getUserSearchOption())
          .then(({ data }) => {
            // 获取列表后dosomething
            this.isLoading = false
            if (data.status === 'success') {
              console.log(data)
              this.userSearchList = data.content.rows
              this.pagination.pageSize = data.content.pageSize
              this.pagination.records = data.content.records
              this.isShowSearch = true
            } else {
              this.$message.error('出错啦')
            }
          })
          .catch(err => {
            this.isLoading = false
            console.log(err.response)
          })
      }
    },
    jump(index) {
      this.pagination.pageNumber = index
      this.search()
    },
    add() {
      if (this.userAddParam()) {
        postUserAdd(this.getUserAddOption())
          .then(({ data }) => {
            if (data.status === 'success') {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.isShowAdd = false
              this.search()
              return
            }
            this.$message.error(`提交失败-${data.message}`)
          })
          .catch(err => console.log(err))
      }
    },
    edit() {
      if (this.userEditParam()) {
        postUserEdit(this.getUserEditOption())
          .then(({ data }) => {
            if (data.status === 'success') {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.isShowEdit = false
              this.search()
              return
            }
            this.$message.error(`提交失败-${data.message}`)
          })
          .catch(err => console.log(err))
      }
    },
    userSearchParam() {
      if (!this.fullName && !this.status) {
        this.$message.error('缺少参数')
        return false
      }
      if (this.fullName) {
        if (this.fullName !== this.lastFullName) {
          this.pagination.pageNumber = 1
        }
        this.lastFullName = this.fullName
      }
      if (this.status) {
        if (this.status !== this.lastStatus) {
          this.pagination.pageNumber = 1
        }
        this.lastStatus = this.status
      }
      return true
    },
    userAddParam() {
      if (!this.addUser.account) {
        this.$message.error('必填参数不能为空')
        return false
      }
      return true
    },
    userEditParam() {
      if (!this.editUser.newAccount) {
        this.$message.error('必填参数不能为空')
        return false
      }
      return true
    },
    /**
     * 获取数据配置
     */
    getUserSearchOption() {
      const option = {}
      if (this.fullName) {
        option['name'] = this.fullName
      }
      if (this.status) {
        option['status'] = this.status
      }
      option['pageNumber'] = this.pagination.pageNumber
      option['pageSize'] = this.pagination.pageSize
      return option
    },
    getUserAddOption() {
      const option = {}
      option['account'] = this.addUser.account
      if (this.addUser.name) {
        option['name'] = this.addUser.name
      }
      if (this.addUser.mobile) {
        var mobile = this.addUser.mobile
        mobile = Number(mobile)
        if (isNaN(mobile)) {
          this.$message.error('mobile填写错误')
          return null
        }
        option['mobile'] = mobile
      }
      if (this.addUser.role) {
        option['role'] = this.addUser.role
      }
      return option
    },
    getUserEditOption() {
      const option = {}
      option['oldAccount'] = this.editUser.oldAccount
      option['newAccount'] = this.editUser.newAccount
      if (this.editUser.name) {
        option['name'] = this.editUser.name
      }
      if (this.editUser.mobile) {
        var mobile = this.editUser.mobile
        mobile = Number(mobile)
        if (isNaN(mobile)) {
          this.$message.error('mobile填写错误')
          return null
        }
        option['mobile'] = mobile
      }
      if (this.editUser.role) {
        option['role'] = this.editUser.role
      }
      return option
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
      .btn-addUser {
        margin-top: 10px;
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
  .mylabel{
    display: inline-block;
    text-align: right;
    width: 150px;
  }
  .required::before {
    content: "*";
    color: red;
  }
</style>
