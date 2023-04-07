<!--
 * @Author: 杨曦
 * @Date: 2021-12-15 15:40:09
 * @LastEditors: kaan
 * @LastEditTime: 2022-01-13 19:18:12
 * @Version:
 * @Description:
-->
<template>
	<div>
		<el-table :data="followedUpList" size="mini" highlight-current-row style="width: 100%">
				<el-table-column
						prop="times"
						align="center"
						label="次数"
						min-width="100"
						show-overflow-tooltip
				></el-table-column>
				<el-table-column
						prop="followStatusName"
						align="center"
						label="状态"
						min-width="100"
						show-overflow-tooltip
				></el-table-column>
				<el-table-column align="center" label="follow时间" min-width="100" show-overflow-tooltip >
						<template slot-scope="scope">
												<span v-if="scope.row.followTime">{{ scope.row.followTime.slice(0,10)}}</span>
												<el-button type="primary" @click="toFollow(scope.row)" v-if="!scope.row.followTime && scope.row.followStatus == 0">follow up</el-button>
						</template>
				</el-table-column>
				<el-table-column
						prop="beginDate"
						align="center"
						label="开始日期"
						min-width="100"
						show-overflow-tooltip
				></el-table-column>
				<el-table-column
						prop="endDate"
						align="center"
						label="截止日期"
						min-width="100"
						show-overflow-tooltip
				></el-table-column>
		</el-table>


    <el-dialog
      title="Follow Up详情"
      :visible.sync="followDetailVisible"
      append-to-body
      width="450px"
      :before-close="followDetailClose"
      :close-on-click-modal	="false"
    >
      <el-form
        :model="followUpSubmitData"
        :rules="rules"
        ref="rule"
        label-width="100px"
      >
        <el-form-item label="开始日期" prop="">{{formData.beginDate}}</el-form-item>
        <el-form-item label="截止日期" prop="">{{formData.endDate}}</el-form-item>
        <el-form-item label="状态" prop="achievement">
          <el-select
            v-model="followUpSubmitData.achievement"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in statusList[position]"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跟进内容" prop="remark">
          <el-input
            v-model="followUpSubmitData.remark"
            clearable
            type="textarea"
            :rows="3"
            maxlength="10000"
            minlength="20"
            :autosize="{ minRows: 2, maxRows: 6}"
            placeholder="请输入跟进内容"
            label="跟进内容"
            tabindex
            style="width:300px"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="followDetailClose">取 消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </span>
    </el-dialog>
	</div>
</template>

<script>
import api from '@/api/assistant.js'
import file from '@/libs/file'
import util from '@/libs/util'
import mixins from '@/plugin/mixins'

import { mapState } from 'vuex'
export default {
  name: 'assistantFollow1',
  props: {
    followedUpList: {},
  },
  mixins: [
    mixins
  ],
  data: () => {
    return {
      position:"sales_assistant",
      times: '',
      signId: '',
      pkId: '',
      menteeName: '',
      menteeId: '',
      vipFollowApplyVisible: false,
      clickStatus: 33333,
      loading: false,
      menteeInfo: {},
      orderArr: [],

      followDetailVisible:false,
      formData:{},
      followUpSubmitData: {
        remark: "",
        achievement: null,
        menteeId: null,
        pkId: null,
      },
      rules: {
        remark: [
          { required: true, message: "必填", trigger: "blur" },
          { message: "长度必须15～10000字符", min: 15, max: 10000, trigger: "blur" }
        ],
        achievement: { required: true, message: "必选", trigger: "blur" },
      },
      statusList: {
        sales_assistant: [
          "被删除",
          "未回复",
          "已回复，未拉销售",
          "已回复，已拉销售",
          "SPY"
        ],
        sales: [
          "未签约，未知是否感兴趣",
          "未签约，表明不感兴趣",
          "被删除",
          "SPY",
          "已签约"
        ],
        VIP: ["未回复", "已回复", "已结束合同"]
      },
    }
  },
  computed: {
    ...mapState('role', [
      'userInfo'
    ])
  },
  filters: {
    // 上课时间过滤器
    fmtTime: function (value) {
      if (value) {
        return util.fmtDate(new Date(value), 'hh:mm')
      } else {
        return '--:--'
      }
    }
  },
  mounted () {
    this.Topage()
  },
  methods: {

    /**
     * @description: 初始化获取课程分类
     * @param {*}
     * @return {*}
     */
    Topage () {
    },
    updateList () {
      this.Topage()
      this.menteeInfo = {}
      this.clickStatus = 33333
      this.followedUpList = []
      this.vipFollowApplyVisible = false
    },
    followUpItemClose () {
      this.vipFollowApplyVisible = false
    },
    download (path) {
      file.preview(path)
    },

    /**
     * @description: 去follow
     * @param {*} data
     * @return {*}
     */    
    toFollow(data){
      console.log(data)
      this.followDetailVisible = true;
      this.formData = JSON.parse(JSON.stringify(data));
      this.followUpSubmitData.menteeId = this.formData.menteeId;
    },
    followClose() {
      this.followUpData.list = [];
      this.followUpSubmitData = {
        remark: "",
        achievement: null,
        menteeId: null,
        pkId: null,
      },
      this.$emit("close");
    },
    submit() {
      this.$refs.rule.validate(valid => {
        if (!valid) return;
        this.setFollowUp();
      });
    },
    
    setFollowUp() {
      let timeNow = new Date();
      let time1;
      let time2;
      //  0：系统业务 1：主动记录
      if (!this.formData) {
        delete this.followUpSubmitData.pkId;
        // this.followUpSubmitData.followType = 1;
      } else {
        console.log(this.formData)
        if (!this.formData.beginDate) {  // 存在开始日期时yx**********************
          time1 = new Date();
        } else {
          time1 = new Date(this.formData.beginDate); // time1 == 起始日期
        }
        if (!this.formData.endDate) {  // 存在截止日期时yx**********************
          time2 = new Date();
        } else {
          time2 = new Date(this.formData.endDate); // time2 == 截止日期
        }
        if (
          time1 < timeNow
          && this.formData.followStatus
          && this.formData.followStatus == 0
        ) {
          this.followUpSubmitData.pkId = this.formData.pkId;
          this.followUpSubmitData.beginDate = this.formData.beginDate;
          this.followUpSubmitData.endDate = this.formData.endDate;
        } else {
          delete this.followUpSubmitData.pkId;
        }
      }
      console.log(this.followUpSubmitData,'1111111111111111111111111111111111')
      this.$loading({ background: "rgba(0,0,0,.5)" });

      api.assistantSetFollowUp(this.followUpSubmitData).then(res => {
        this.$message.success(res.data)
        console.log("提交follow数据：", res);
        this.followDetailClose()
        this.$loading().close();
        this.$emit("followUp");
      })
    },
    followDetailClose(){
      this.formData = {};
      this.followUpSubmitData = {
        remark: "",
        achievement: null,
        menteeId: null,
        pkId: null,
      },
      this.followDetailVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
	.demo-table-expand{
		padding-left: 20px;
	}
</style>
