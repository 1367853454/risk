<template>
  <el-container class="container">
    <!--搜索栏-->
    <el-header class="header" height="90px">
      <el-form :inline="true" size="mini">
        <el-form-item label="角色名称:" style="width: 30%">
          <el-input v-model="roleName" type="text" placeholder="请输入" />
        </el-form-item>
        <el-form-item style="width:30%">
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <!--主题数据展示-->
    <el-main class="main" style="height: 420px">
      <div v-show="isShowSearch" class="tips">
        共搜到1条数据
      </div>
      <div class="btn-addRole">
        <el-button type="primary" @click="openAdd">添加角色</el-button>
      </div>
      <el-table v-loading="isLoading" class="table" :data="roleSearchList">
        <el-table-column label="角色ID">
          <template slot-scope="scope">
            <span>{{ scope.row.roleId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色名称">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <span>{{ scope.row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="180px">
          <template slot-scope="scope">
            <el-row>
              <el-col :span="6"><div class="grid-content"><el-button size="mini" type="primary" @click="empower(scope.row.roleId)">授权</el-button></div></el-col>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <!--显示增加用户栏框-->
    <el-dialog v-show="isShow" :visible.sync="isShow" :title="title" width="40%" top="8vh">
      <p>
        <label class="mylabel"><span class="required" />角色名称</label>
        <el-input v-model="msgForRole.name" style="width: 70%" />
      </p>
      <p>
        <label class="mylabel">描述</label>
        <el-input v-model="msgForRole.description" type="textarea" :rows="5" placeholder="请输入内容" style="width: 70%" />
      </p>
      <div slot="footer" class="dialog-footer">
        <el-button v-show="isShowSubmit && isAdd" :disabled="isDisabled" type="primary" @click="isAddRole">
          提交
        </el-button>
      </div>
    </el-dialog>
    <!--显示树-->
    <el-dialog v-show="isShowTree" :visible.sync="isShowTree" title="授权" width="40%" top="8vh">
      <el-tree
        ref="tree"
        :data="permissionTree"
        show-checkbox
        node-key="id"
        default-expand-all
        :props="defaultProps"
      />
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
const {
  getRoleSearchList,
  postRoleAdd,
  getPermissionTree,
  getOneRolePermission,
  postEditPermission
} = api
export default {
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      title: '',
      isDisabled: false,
      isShowSubmit: false,
      isAdd: false,
      msgForRole: {
        name: '',
        description: ''
      },
      roleId: -1,
      roleName: '',
      isShowAdd: false,
      isShowSearch: false,
      isLoading: false,
      isShowTree: false,
      // isShowInfo: false,
      isShow: false,
      // roleSearchList: [
      //   {
      //     roleId: '1',
      //     name: 'system',
      //     description: '系统管理员具有所有权限'
      //   },
      //   {
      //     roleId: '2',
      //     name: 'admin',
      //     description: '管理员能够编辑规则，规则包，规则流程'
      //   },
      //   {
      //     roleId: '3',
      //     name: 'user',
      //     description: '普通用户只具备查看权限'
      //   }
      // ],
      roleSearchList: [],
      rolePermission: [],
      checked: [],
      half: [],
      permissionTree: [[{ value: '1', key: '1' }], [{ value: '2', key: '2' }, { value: '3', key: '3' }]]
    }
  },
  mounted() {
    this.getInitData()
  },
  methods: {
    getCheckedKeys() {
      this.checked = []
      this.checked = this.$refs.tree.getCheckedKeys()
      console.log(this.checked)
    },
    getHalfCheckedKeys() {
      this.half = []
      this.half = this.$refs.tree.getHalfCheckedKeys()
      console.log(this.half)
    },
    setCheckedKeys() {
      this.$refs.tree.setCheckedKeys(this.rolePermission)
    },
    resetChecked() {
      this.$refs.tree.setCheckedKeys([])
    },
    /**
     * 获取状态,角色信息
     */
    getInitData() {
      getPermissionTree().then(({ data }) => {
        this.permissionTree = data.content[0]
      })
    },
    openAdd() {
      this.isAdd = true
      this.msgForRole.name = ''
      this.msgForRole.description = ''
      this.open({ title: '新增', isDisabled: false, isShowSubmit: true })
    },
    // 根据传入的配置数据，打开对话框
    open(option) {
      option = Object.assign({ title: '', isDisabled: false, isShowSubmit: true }, option)
      this.isDisabled = option.isDisabled
      this.isShowSubmit = option.isShowSubmit
      this.title = option.title
      this.isShow = true
      if (option.data) {
        this.msgForRole = option.data
      }
    },
    search() {
      if (this.roleSearchParam()) {
        this.isLoading = true
        getRoleSearchList(this.getRoleSearchOption())
          .then(({ data }) => {
            // 获取列表后dosomething
            this.isLoading = false
            if (data.status === 'success') {
              this.roleSearchList = []
              this.roleSearchList.push(data.content)
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
    isAddRole() {
      if (this.roleAddParam()) {
        postRoleAdd(this.getRoleAddOption())
          .then(({ data }) => {
            if (data.status === 'success') {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.isShow = false
              return
            }
            this.$message.error(`提交失败-${data.message}`)
          })
          .catch(err => console.log(err))
      }
    },
    empower(roleId) {
      this.roleId = roleId
      const option = {}
      option['roleId'] = roleId
      getOneRolePermission(option)
        .then(({ data }) => {
          this.rolePermission = []
          if (data.content.length !== 0) {
            const val = []
            for (var i = 0; i < data.content.length; i++) {
              val.push(data.content[i].id)
            }
            this.rolePermission = val
          }
          this.isShowTree = true
          this.$nextTick(() => {
            this.setCheckedKeys()
          })
          console.log(this.rolePermission)
        })
        .catch(err => console.log(err))
    },
    edit() {
      postEditPermission(this.getEditOption())
        .then(({ data }) => {
          this.isShowTree = false
          this.search()
        })
        .catch(err => console.log(err))
    },
    roleSearchParam() {
      if (!this.roleName) {
        this.$message.error('缺少参数')
        return false
      }
      return true
    },
    roleAddParam() {
      if (!this.msgForRole.name) {
        this.$message.error('必填参数不能为空')
        return false
      }
      return true
    },
    /**
     * 获取数据配置
     */
    getRoleSearchOption() {
      const option = {}
      option['name'] = this.roleName
      return option
    },
    getRoleAddOption() {
      const option = {}
      option['name'] = this.msgForRole.name
      if (this.msgForRole.description) {
        option['description'] = this.msgForRole.description
      }
      return option
    },
    getEditOption() {
      const option = {}
      option['roleId'] = this.roleId
      this.getCheckedKeys()
      this.getHalfCheckedKeys()
      Array.prototype.push.apply(this.checked, this.half)
      option['permissionId'] = this.checked
      console.log(this.checked)
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
      .btn-addRole {
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
