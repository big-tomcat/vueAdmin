<template>
  <div>
    <br />
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="活动名称">
        <el-input v-model="searchMap.name" placeholder="活动名称"></el-input>
      </el-form-item>
      <el-form-item label="活动日期">
        <el-date-picker type="date" v-model="searchMap.starttime" placeholder="选择开始日期"></el-date-picker>
        <el-date-picker type="date" v-model="searchMap.endtime" placeholder="选择结束日期"></el-date-picker>
      </el-form-item>
      <el-button @click="fetchDate()" type="success">查询</el-button>
      <el-button @click="handleEdit('')" type="success">新增</el-button>
    </el-form>
    <el-table :data="list" style="width: 100%">
      <el-table-column prop="id" label="活动ID" width="180"></el-table-column>
      <el-table-column prop="name" label="活动名称" width="180"></el-table-column>
      <el-table-column prop="sponsor" label="主办方"></el-table-column>
      <el-table-column prop="address" label="活动地址"></el-table-column>
      <el-table-column prop="starttime" label="开始时间"></el-table-column>
      <el-table-column prop="endtime" label="结束时间"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row.id)" type="text" size="small">修改</el-button>
          <el-button @click="handleDelete(scope.row.id)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="fetchDate"
      @current-change="fetchDate"
      :current-page="currentPage"
      :page-sizes="[5,10,20]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <el-dialog title="添加" :visible.sync="dialogVisible">
      <el-form label-width="80px">
        <el-form-item label="活动名称">
          <el-input v-model="pojo.name" placeholder="活动名称"></el-input>
        </el-form-item>
        <el-form-item label="活动地址">
          <el-input v-model="pojo.address" placeholder="活动地址"></el-input>
        </el-form-item>
        <el-form-item label="开始日期">
          <el-date-picker type="date" v-model="pojo.starttime" placeholder="开始日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker type="date" v-model="pojo.endtime" placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="报名截止">
          <el-date-picker type="date" v-model="pojo.enrolltime" placeholder="报名截止"></el-date-picker>
        </el-form-item>
        <el-form-item label="活动详情">
          <el-input type="textarea" v-model="pojo.detail" placeholder="活动详情" :rows="3"></el-input>
        </el-form-item>
        <el-form-item label="选择城市">
          <el-select v-model="pojo.city" placeholder="请选择">
            <el-option
              v-for="item in cityList"
              :key="item.value"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否可见">
          <el-switch
            active-value="1"
            inactive-value="0"
            v-model="pojo.state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSave()">修改</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import gatheringApi from "@/api/gathering";
import cityApi from "@/api/city";
export default {
  data() {
    return {
      list: [],
      total: 0, //总记录数
      currentPage: 1, //当前页
      pageSize: 10, //每页大小
      searchMap: {}, //查询条件
      dialogVisible: false, //编辑窗口是否可见，默认不可见
      pojo: {}, //编辑表单绑定的实体对象
      cityList: [], //城市列表
      id: "" //当前用户修改的id
    };
  }, //函数
  created() {
    this.fetchDate();
    cityApi.getList().then(response => {
      this.cityList = response.data;
    });
  }, //钩子函数
  methods: {
    fetchDate() {
      gatheringApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          this.list = response.data.rows;
          this.total = response.data.total;
        });
    },
    handleSave() {
      gatheringApi.update(this.id, this.pojo).then(response => {
        this.$message({
          message: response.message,
          type: response.flag ? "success" : "error"
        });
        if (response.flag) {
          //如果成功
          this.fetchDate(); //刷新列表
        }
      });
      this.dialogVisible = false; //关闭窗口
    },
    handleEdit(id) {
      this.id = id;
      this.dialogVisible = true; //打开窗口
      if (id != "") {
        //修改
        gatheringApi.findById(id).then(response => {
          if (response.flag) {
            this.pojo = response.data;
          }
        });
      } else {
        this.pojo = {}; //清空数据
      }
    }, //对象
    handleDelete(id) {
      this.$confirm("确定要删除此记录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          gatheringApi.deleteById(id).then(response => {
            this.$message({
              message: response.message,
              type: response.flag ? "success" : "error"
            });
            if (response.flag) {
              this.fetchDate(); //刷新数据
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>