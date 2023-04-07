<!--
 * @Author: 库建华
 * @Date: 2020-04-13 19:25:38
 * @LastEditors: kaan
 * @LastEditTime: 2021-04-07 15:55:30
 * @Version: 1
 * @Description:
 -->
<template>
  <d2-container >
    <div class="feedback" v-loading="loading">
      <div class="search_page">
        <div class="search">
          <el-date-picker
            v-model="applySeason"
            class="mr10"
            size="mini"
            value-format="yyyy"
            type="year"
            @change="Topage(1)"
            placeholder="请选择ApplySeason"
          ></el-date-picker>
          <el-select
            class="mr10"
            size="mini"
            v-model="entranceType"
            clearable
            filterable
            placeholder="请选择"
            @change="Topage(1)"
          >
            <el-option
              v-for="item in entrance_type"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
          <el-select
            class="mr10"
            size="mini"
            v-model="schoolId"
            clearable
            filterable
            placeholder="请选择school"
            @change="Topage(1)"
          >
            <el-option
              v-for="item in schools"
              :key="item.schoolId"
              :label="item.chiName"
              :value="item.schoolId"
            ></el-option>
          </el-select>
          <el-button icon="el-icon-search" class="mr10" size="mini" plain @click="Topage(1)">GO</el-button>
          <el-button
            v-if="roleInfo.includes('offer_edu_history_add')"
            class="mr10"
            size="mini"
            plain
            @click="addOffer()"
          >新增</el-button>
        </div>
        <pagination
          :total="total"
          :current-page="pageNum"
          :page-size="pageSize"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        ></pagination>
      </div>
      <el-table
        :data="offerList"
        size="mini"
        highlight-current-row
      >
        <el-table-column align="center" prop="menteeName" label="编辑" min-width="50px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              class="el-icon-edit"
              v-if="roleInfo.includes('offer_edu_history_edit')"
              @click="edit(scope.row)"
              title="编辑"
            ></el-button>
            <el-button
              size="mini"
              type="text"
              class="el-icon-delete"
              v-if="roleInfo.includes('offer_edu_history_delete')"
              @click="deleteItem(scope.row)"
              title="删除"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="menteeName" label="Mentee"></el-table-column>
        <el-table-column align="center" prop="applySeason" label="Apply Season"></el-table-column>
        <el-table-column align="center" prop="entranceTypeName" label="类型"></el-table-column>
        <el-table-column align="center" prop="entranceOfferProgramName" label="专业项目"></el-table-column>
        <el-table-column align="center" prop="schoolName" label="School"></el-table-column>
        <el-table-column align="center" prop="instituteName" label="学院"></el-table-column>
        <el-table-column align="center" prop="offerVoucherMosaic" label="Offer">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              v-if="roleInfo.includes('offer_edu_history_view_review') &&scope.row.offerVoucherMosaic"
              @click="download(scope.row.offerVoucherMosaic)"
            >查看</el-button>
            <el-button
              size="mini"
              type="text"
              v-if="roleInfo.includes('offer_edu_history_down_review') &&scope.row.offerVoucherMosaic"
              @click="downloadD(scope.row.offerVoucherMosaic)"
            >下载</el-button>
            <el-upload
              v-if="roleInfo.includes('offer_edu_history_upload_review')"
              action
              :http-request="uploadFileAxios"
              class="upload-btn"
              ref="elupload"
              :file-list="fileList"
            >
              <el-button
                class="el-icon-upload"
                slot="trigger"
                size="mini"
                type="success"
                plain
                @click="signId = scope.row.signId;pkId = scope.row.pkId"
              >选取文件</el-button>
            </el-upload>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="praiseVoucherMosaic" label="Review">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              v-if="roleInfo.includes('offer_edu_history_view_offer') &&scope.row.praiseVoucherMosaic"
              @click="download2(scope.row.praiseVoucherMosaic)"
            >查看</el-button>
            <el-button
              size="mini"
              type="text"
              v-if="roleInfo.includes('offer_edu_history_down_offer') &&scope.row.praiseVoucherMosaic"
              @click="downloadD2(scope.row.praiseVoucherMosaic)"
            >下载</el-button>
            <el-upload
              v-if="roleInfo.includes('offer_edu_history_upload_offer')"
              action
              :http-request="uploadFileAxios1"
              class="upload-btn"
              ref="elupload"
              :file-list="fileList"
            >
              <el-button
                class="el-icon-upload"
                slot="trigger"
                size="mini"
                type="success"
                plain
                @click="signId = scope.row.signId;pkId = scope.row.pkId"
              >选取文件</el-button>
            </el-upload>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :close-on-click-modal="false" title="升学历史Offer" :visible.sync="addVisible" :before-close="close" width="900px">
        <el-form
          size="medium"
          inline
          :model="offerItemData"
          :rules="rules"
          ref="offerItemData"
          label-width="120px"
        >
          <el-form-item label="学员名" prop="menteeName">
            <el-input :style="{width:widths}" v-model="offerItemData.menteeName" maxlength="99"></el-input>
          </el-form-item>
          <el-form-item label="applySeason" prop="applySeason">
            <el-date-picker
              v-model="offerItemData.applySeason"
              class="mr10"
              :style="{width:widths}"
              value-format="yyyy"
              type="year"
              @change="Topage(1)"
              placeholder="请选择ApplySeason"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="类型" prop="entranceType">
            <el-select
              :style="{width:widths}"
              filterable
              v-model="offerItemData.entranceType"
              allow-create
              placeholder="请选择"
            >
              <el-option
                v-for="item in entrance_type"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="专业项目" prop="entranceOfferProgram">
            <el-select
              :style="{width:widths}"
              filterable
              v-model="offerItemData.entranceOfferProgram"
              allow-create
              placeholder="请选择"
            >
              <el-option
                v-for="item in entrance_offer_program"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="school" prop="school">
            <el-select
              :style="{width:widths}"
              filterable
              allow-create
              v-model="offerItemData.schoolId"
              placeholder="请选择"
              @change="getAcademyBySchoolId(offerItemData)"
            >
              <el-option
                v-for="item in schools"
                :key="item.schoolId"
                :label="item.chiName"
                :value="item.schoolId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学院" prop="instituteId">
            <el-select
              :style="{width:widths}"
              filterable
              allow-create
              v-model="offerItemData.instituteId"
              placeholder="请选择"
            >
              <el-option
                v-for="item in institute"
                :key="item.instituteId"
                :label="item.instituteChiName"
                :value="item.instituteId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="close">取 消</el-button>
          <el-button type="primary" @click="submit">提 交</el-button>
        </span>
      </el-dialog>
    </div>
  </d2-container>
</template>

<script>
import mixins from "@/plugin/mixins";
import api from "@/api/vip.js";
import apiDic from "@/api/dictionary.js";
import { downloadFun, downloadFunD, uploadFunBySys } from '@/libs/file'
import { mapState } from 'vuex'

export default {
  mixins: [mixins],
  name: "feedback",
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  data() {
    return {
      offerList: [],
      pageNum: 1,
      total: 0,
      applySeason: null,
      pageSize: 400,
      schoolId: null,
      entranceType: null,
      entranceOfferProgram: null,
      schools: [],
      institute: [],
      entrance_type: [],
      entrance_offer_program: [],

      loading: false,
      fileList: [],
      addVisible: false,
      offerItemData: {
        menteeName: null,
        entranceType: null,
        entranceOfferProgram: null,
        applySeason: null,
        schoolId: null,
        instituteId: null,
        offerVoucherMosaic: null,
        praiseVoucherMosaic: null
      },
      rules: {
        wxId: [
          { required: true, message: "请输入微信ID", trigger: "blur" },
          { max: 60, message: "微信ID长度为60个字符以内", trigger: "blur" }
        ], //请输入微信ID
        menteeName: [{ required: true, message: "必填", trigger: "blur" }],
        applySeason: [{ required: true, message: "必填", trigger: "blur" }],
        school: [{ required: true, message: "必填", trigger: "blur" }],
        entranceType: [{ required: true, message: "必填", trigger: "blur" }],
        entranceOfferProgram: [{ required: true, message: "必填", trigger: "blur" }]
      },
      widths: "250px"
    };
  },
  mounted() {
    this.init();
    this.Topage(1);
    this.pageInit()
  },
  methods: {
    init() {
      let params = {
        pageNum: 1,
        pageSize: 9999
      };
      apiDic.getSchoolDicList(params).then(res => {
        console.log(res);
        this.schools = res.data.rows;
      });
    },
    async pageInit () {
      // 获取用户组内成员列表
      this.entrance_type = await this.getDictionary('entrance_type')
      this.entrance_offer_program = await this.getDictionary('entrance_offer_program')
    },
    Topage() {
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        applySeason: this.applySeason,
        schoolId: this.schoolId,
        entranceType: this.entranceType
      };
      console.log("offer列表参数", this.entranceType, params);
      this.loading = true
      api.getHistoryOfferEduList(params).then(res => {
        console.log("offer列表", res);
        this.offerList = res.data.rows;
        this.total = res.data.total;
        this.loading = false
      });
    },
    // 分页插件回调：页码，每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.Topage(this.pageNum);
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.Topage(this.pageNum);
    },
    // 查看
    download(path) {
      // if (!this.roleInfo.includes(`offer_edu_history_view_offer`)) {
      //   this.$message("无权限");
      //   return;
      // }
      console.log(path);
      downloadFun(path, url => {
        window.open(url);
      });
    },
    download2(path) {
      // if (!this.roleInfo.includes(`offer_edu_history_down_offer`)) {
      //   this.$message("无权限");
      //   return;
      // }
      console.log(path);
      downloadFun(path, url => {
        window.open(url);
      });
    },
    // 下载
    downloadD(path) {
      // if (!this.roleInfo.includes(`offer_hm_list_img_view_hm`)) {
      //   this.$message("无权限");
      //   return;
      // }
      console.log(path);
      downloadFunD(path, url => {
        window.open(url);
      });
    },
    downloadD2(path) {
      // if (!this.roleInfo.includes(`offer_hm_list_img_down_hm`)) {
      //   this.$message("无权限");
      //   return;
      // }
      console.log(path);
      downloadFunD(path, url => {
        window.open(url);
      });
    },
    // 上传
    uploadFileAxios(file, fileList) {
      this.$loading();
      console.log(file, fileList);
      uploadFunBySys(
        file.file,
        `temp/offer_edu_his/${this.pkId}/voucher`,
        url => {
          let data = {
            pkId: this.pkId,
            offerVoucherMosaic: url
          };
          this.submitCommon(data);
          this.fileList = [];
          this.$loading().close();
          this.$refs.elupload.clearFiles();
        }
      );
    },
    // 上传
    uploadFileAxios1(file, fileList) {
      this.$loading();
      console.log(file, fileList);
      uploadFunBySys(
        file.file,
        `temp/offer_edu_his/${this.pkId}/review`,
        url => {
          let data = {
            pkId: this.pkId,
            praiseVoucherMosaic: url
          };
          this.submitCommon(data);
          this.fileList = [];
          this.$refs.elupload.clearFiles();
        }
      );
    },
    submitCommon(data) {
      api.uptHistoryOfferEdu(data).then(res => {
        console.log(res);
        this.Topage(1);
        this.$message({
          type: "success",
          message: "提交成功"
        });
        this.close();
      });
    },
    addOffer() {
      this.addVisible = true;
    },
    close() {
      this.offerItemData = {
        menteeName: null,
        entranceType: null,
        applySeason: null,
        schoolId: null,
        instituteId: null,
        offerVoucherMosaic: null,
        praiseVoucherMosaic: null
      };
      this.addVisible = false;
    },
    submit() {
      console.log(this.offerItemData);
      if (this.offerItemData.entranceType == "internal_transfer" && !this.offerItemData.instituteId) {
        this.$message({
          type: "error",
          message: "类别为（内部转院/学）时，学院必填!"
        });
        return;
      }
      if (this.offerItemData.pkId) {
        this.submitCommon(this.offerItemData);
      } else {
        api.addHistoryOfferEdu(this.offerItemData).then(() => {
          this.$message({
            type: "success",
            message: "提交成功"
          });
          this.close();
          this.Topage(1);
        });
      }
    },
    edit(item) {
      this.offerItemData = { ...item };
      this.addVisible = true;
    },
    deleteItem(v) {
      this.$confirm("此操作将删除该条目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            pkId: v.pkId
          };
          api.delHistoryOfferEdu(params).then(() => {
            this.$message({
              type: "success",
              message: "提交成功"
            });
            this.close();
            this.Topage(1);
          });
        })
        .catch(() => {});
    },
    getAcademyBySchoolId(item) {
      console.log(item);
      item.instituteId = null;
      apiDic.getAcademyBySchoolId(item.schoolId).then(res => {
        console.log(res.data);
        this.institute = res.data;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>