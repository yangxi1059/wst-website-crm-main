<!--
 * @Author: 库建华
 * @Date: 2019-08-27 14:24:20
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-07-07 10:25:11
 * @Version:
 * @Description:
 -->
<template>
  <div class="upload-contract">
    <el-dialog
      :title="userType == 'vip'?'VIP上传订单文件':'销售上传订单文件'"
      class="info account yx_form"
      :visible.sync="contractVisible"
      width="1200px"
      :before-close="contractClose"
      v-loading="loading"
    >
        <div class="yx_block_height" style="display:flex;width:100%;overflow-x:auto;">
          <div style="font-size:16px;font-weight:500;min-width:100px">合同：</div>
          <div
            class="yxHover"
            type="text"
            :style="{width:'148px','text-align':'center','margin':'0 10px 0px 0px','height':'148px','position':'relative','border-radius':'6px','border':'1px #67C23A dashed','overflow':'hidden','display':'inline-block'}"
            icon="el-icon-download"
            v-for="item in contractList1"
            :key="item.id"
          >
            <el-tag v-if="item.contractType == 'original'" effect="dark" style="float:left" type="danger" size="mini">SALES</el-tag>
            <el-tag v-else type="warning" effect="dark" size="mini" style="float:left">VIP</el-tag>
            <br>
            <div>{{item.contractName}}</div>
            <div>{{item.createTime}}</div>
            <div>[{{item.contractTypeName}}]</div>
            <div class="yxHoverDiv" style="position:absolute;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,0.3)">
              <div style="display:flex">
                <div style="width:50%;height:100%;line-height:148px">
                  <el-button
                    type="primary"
                    icon="el-icon-view" circle
                    v-if="roleInfo.includes(`order_contract_view_original`) || roleInfo.includes(`order_contract_view_accessory`)"
                    title="预览"
                    @click="download(item.contractPath)"></el-button>
                </div>
                <div style="width:50%;height:100%;line-height:148px">
                  <el-button
                    type="success"
                    icon="el-icon-download" circle
                    v-if="roleInfo.includes(`order_contract_download_original`) || roleInfo.includes(`order_contract_download_accessory`)"
                    title="下载"
                    @click="downloadD(item.contractPath)"></el-button>
                </div>
              </div>
            </div>
          </div>
          <div
            class="yxHover"
            :style="{width:'148px','text-align':'center','margin':'0 10px 0px 0px','height':'148px','position':'relative','border-radius':'6px','border':'1px #F56C6C dashed','overflow':'hidden','display':'inline-block'}"
            v-for="(detail,i) in fileList1"
            :key="i"
          >
            <div>{{detail.name}}<span style="color:#c32e47">【待上传】</span></div>
            <div class="yxHoverDiv" style="position:absolute;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,0.3)">
              <div style="display:flex">
                <div style="width:100%;height:100%;line-height:148px">
                  <el-button
                    type="danger"
                    icon="el-icon-delete" circle
                    title="删除"
                    @click="delete1(i)"></el-button>
                </div>
              </div>
            </div>
          </div>
          <el-upload
            style="display:inline-block;width:148px;height:148px"
            action
            :show-file-list="false"
            :http-request="uploadFileAxios1"
            class="upload-btn"
            ref="elupload1"
            :on-change="change1"
            :on-remove="remove1"
            :limit="3"
            :auto-upload="false"
            :file-list="fileList1"
            drag
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
        <div class="yx_block_height" style="display:flex;width:100%;margin-top:50px;overflow-x:auto;" >
          <div style="font-size:16px;font-weight:500;min-width:100px">补充协议：</div>
          <div
            class="yxHover"
            type="text"
            :style="{width:'148px','text-align':'center','margin':'0 10px 0px 0px','height':'148px','position':'relative','border-radius':'6px','border':'1px #67C23A dashed','overflow':'hidden','display':'inline-block'}"
            icon="el-icon-download"
            v-for="item in contractList2"
            :key="item.id"
          >
            <el-tag v-if="item.contractType == 'original'" effect="dark" style="float:left" type="danger" size="mini">SALES</el-tag>
            <el-tag v-else type="warning" effect="dark" size="mini" style="float:left">VIP</el-tag>
            <br>
            <div>{{item.contractName}}</div>
            <div>{{item.createTime}}</div>
            <div>[{{item.contractTypeName}}]</div>
            <div class="yxHoverDiv" style="position:absolute;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,0.3)">
              <div style="display:flex">
                <div style="width:50%;height:100%;line-height:148px">
                  <el-button
                    type="primary"
                    icon="el-icon-view" circle
                    v-if="roleInfo.includes(`order_contract_view_original`) || roleInfo.includes(`order_contract_view_accessory`)"
                    title="预览"
                    @click="download(item.contractPath)"></el-button>
                </div>
                <div style="width:50%;height:100%;line-height:148px">
                  <el-button
                    type="success"
                    icon="el-icon-download" circle
                    v-if="roleInfo.includes(`order_contract_download_original`) || roleInfo.includes(`order_contract_download_accessory`)"
                    title="下载"
                    @click="downloadD(item.contractPath)"></el-button>
                </div>
              </div>
            </div>
          </div>
           <div
            class="yxHover"
            :style="{width:'148px','text-align':'center','margin':'0 10px 0px 0px','height':'148px','position':'relative','border-radius':'6px','border':'1px #F56C6C dashed','overflow':'hidden','display':'inline-block'}"
            v-for="(detail,i) in fileList2"
            :key="i"
          >
            <div>{{detail.name}}<span style="color:#c32e47">【待上传】</span></div>
            <div class="yxHoverDiv" style="position:absolute;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,0.3)">
              <div style="display:flex">
                <div style="width:100%;height:100%;line-height:148px">
                  <el-button
                    type="danger"
                    icon="el-icon-delete" circle
                    title="删除"
                    @click="delete2(i)"></el-button>
                </div>
              </div>
            </div>
          </div>
          <div class="order_apply" style="width:148px;height:148px;border: 1px dashed #d9d9d9;border-radius: 6px;text-align:center;display:flex;justify-content:center">
            <el-button type="primary" @click="applyOrder(orderId)" size="mini" style="align-self:center">发起补充协议申请</el-button>
          </div>
        </div>
        <div class="yx_block_height" style="display:flex;width:100%;margin-top:50px;overflow-x:auto;" >
          <div style="font-size:16px;font-weight:500;min-width:100px">其他：</div>
          <div
            class="yxHover"
            type="text"
            :style="{width:'148px','text-align':'center','margin':'0 10px 0px 0px','height':'148px','position':'relative','border-radius':'6px','border':'1px #67C23A dashed','overflow':'hidden','display':'inline-block'}"
            icon="el-icon-download"
            v-for="item in contractList3"
            :key="item.id"
          >
            <el-tag v-if="item.contractType == 'original'" effect="dark" style="float:left" type="danger" size="mini">SALES</el-tag>
            <el-tag v-else type="warning" effect="dark" size="mini" style="float:left">VIP</el-tag>
            <br>
            <div>{{item.contractName}}</div>
            <div>{{item.createTime}}</div>
            <div>[{{item.contractTypeName}}]</div>
            <div class="yxHoverDiv" style="position:absolute;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,0.3)">
              <div style="display:flex">
                <div style="width:50%;height:100%;line-height:148px">
                  <el-button
                    type="primary"
                    icon="el-icon-view" circle
                    v-if="roleInfo.includes(`order_contract_view_original`) || roleInfo.includes(`order_contract_view_accessory`)"
                    title="预览"
                    @click="download(item.contractPath)"></el-button>
                </div>
                <div style="width:50%;height:100%;line-height:148px">
                  <el-button
                    type="success"
                    icon="el-icon-download" circle
                    v-if="roleInfo.includes(`order_contract_download_original`) || roleInfo.includes(`order_contract_download_accessory`)"
                    title="下载"
                    @click="downloadD(item.contractPath)"></el-button>
                </div>
              </div>
            </div>
          </div>
           <div
            class="yxHover"
            :style="{width:'148px','text-align':'center','margin':'0 10px 0px 0px','height':'148px','position':'relative','border-radius':'6px','border':'1px #F56C6C dashed','overflow':'hidden','display':'inline-block'}"
            v-for="(detail,i) in fileList3"
            :key="i"
          >
            <div>{{detail.name}}<span style="color:#c32e47">【待上传】</span></div>
            <div class="yxHoverDiv" style="position:absolute;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,0.3)">
              <div style="display:flex">
                <div style="width:100%;height:100%;line-height:148px">
                  <el-button
                    type="danger"
                    icon="el-icon-delete" circle
                    title="删除"
                    @click="delete3(i)"></el-button>
                </div>
              </div>
            </div>
          </div>
          <el-upload
            style="display:inline-block;width:148px;height:148px"
            :http-request="uploadFileAxios3"
            :on-change="change3"
            :limit="3"
            :file-list="fileList3"
            :on-remove="remove3"
            :auto-upload="false"
            ref="elupload3"
            :show-file-list="false"
            :action="action"
            drag
            >
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="contractClose">取 消</el-button>
        <el-button type="primary" @click="submit">提 交</el-button>

      </span>
    </el-dialog>
    <applyOrder :orderId="orderId" :orderVisible="orderVisible" @close="orderClose()" @submit="orderSubmit()" />
  </div>
</template>

<script>
import { downloadFun, downloadFunD, uploadFunBySys } from '@/libs/file'
import applyOrder from './ApplyOrder'
import api from '@/api/sales_assistant'
import mixins from '@/plugin/mixins'
import { mapState } from 'vuex'
export default {
  name: 'uploadContract',
  mixins: [mixins],
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  props: {
    orderId: {
      type: String,
      default: ''
    },
    userType: {},
    contractVisible: {
      type: Boolean,
      default: false
    }
  },
  components: {
    applyOrder
  },
  data () {
    return {
      contractList: [],
      contractList1: [],
      contractList2: [],
      contractList3: [],
      fileList1: [],
      fileList2: [],
      fileList3: [],
      orderVisible: false,
      action: '',
      loading: false,
      contractType: ''
    }
  },
  watch: {
    contractVisible: function (val) {
      if (val) {
        if (this.userType === 'sales') {
          this.contractType = 'original'
        } else {
          this.contractType = 'accessory'
        }
        this.getContractList()
      }
    }
  },
  mounted () {},
  methods: {
    getContractList () {
      this.contractList1 = []
      this.contractList2 = []
      this.contractList3 = []
      api.getContractByOrderId(this.orderId).then(e => {
        console.log(e, e.data)
        this.contractList = e.data
        for (let i = 0; i < this.contractList.length; i++) {
          if (this.contractList[i].contractKind == 'contract') {
            this.contractList1.push(this.contractList[i])
          }
          if (this.contractList[i].contractKind == 'agreement') {
            this.contractList2.push(this.contractList[i])
          }
          if (this.contractList[i].contractKind == 'other') {
            this.contractList3.push(this.contractList[i])
          }
        }
      })
    },
    contractClose () {
      this.$emit('close')
      this.clear()
    },
    delete1 (i) {
      this.fileList1.splice(i, 1)
      console.log(i, this.fileList1)
    },
    delete2 (i) {
      this.fileList2.splice(i, 1)
      console.log(i, this.fileList2)
    },
    delete3 (i) {
      this.fileList3.splice(i, 1)
      console.log(i, this.fileList3)
    },
    download (val) {
      downloadFun(val, url => {
        window.open(url)
      })
    },
    downloadD (val) {
      downloadFunD(val, url => {
        window.open(url)
      })
    },
    uploadFileAxios1 (file, fileList) {
      console.log(file, fileList, this.fileList1)
      this.$loading()
      uploadFunBySys(file.file, `contract/${this.orderId}`, url => {
        const data = {
          contractName: file.file.name,
          contractPath: url,
          contractStatus: '1',
          contractType: this.contractType,
          orderId: this.orderId,
          contractKind: 'contract'
        }
        api.addContract(data).then(res => {
          console.log(res)
          this.$message({
            message: '合同上传成功',
            type: 'success'
          })
          this.$refs.elupload1 && this.$refs.elupload1.clearFiles()
          this.$loading().close()
          this.$emit('submit')
          this.getContractList()
        })
      })
    },
    uploadFileAxios2 (file, fileList) {
      console.log(file, fileList, this.fileList1)
      this.$loading()
      uploadFunBySys(file.file, `agreement/${this.orderId}`, url => {
        const data = {
          contractName: file.file.name,
          contractPath: url,
          contractStatus: '1',
          contractType: this.contractType,
          orderId: this.orderId,
          contractKind: 'agreement'
        }
        api.addContract(data).then(res => {
          console.log(res)
          this.$message({
            message: '补充协议上传成功',
            type: 'success'
          })
          this.$refs.elupload2 && this.$refs.elupload2.clearFiles()
          this.$loading().close()
          this.$emit('submit')
          this.getContractList()
        })
      })
    },
    uploadFileAxios3 (file, fileList) {
      console.log(file, fileList, this.fileList1)
      this.$loading()
      uploadFunBySys(file.file, `agreement/${this.orderId}`, url => {
        const data = {
          contractName: file.file.name,
          contractPath: url,
          contractStatus: '1',
          contractType: this.contractType,
          orderId: this.orderId,
          contractKind: 'other'
        }
        api.addContract(data).then(res => {
          console.log(res)
          this.$message({
            message: '其他文件上传成功',
            type: 'success'
          })
          this.$refs.elupload3 && this.$refs.elupload3.clearFiles()
          this.$loading().close()
          this.$emit('submit')
          this.getContractList()
        })
      })
    },
    clear () {
      this.fileList1 = []
      this.fileList2 = []
      this.fileList3 = []
      this.contractType = ''
    },
    change1 (file, fileList) {
      console.log(file, fileList)
      this.fileList1 = fileList
    },
    change2 (file, fileList) {
      console.log(file, fileList)
      this.fileList2 = fileList
    },
    change3 (file, fileList) {
      console.log(file, fileList)
      this.fileList3 = fileList
    },
    submit () {
      if (!this.fileList1.length && !this.fileList2.length && !this.fileList3.length) {
        this.$message({
          message: '请选取文件',
          type: 'error'
        })
        return
      } else {
        this.loading = true
      }
      let status1 = true
      let status2 = true
      let status3 = true
      if (this.fileList1.length) {
        status1 = false
      }
      if (this.fileList2.length) {
        status2 = false
      }
      if (this.fileList3.length) {
        status3 = false
      }
      const that = this
      if (this.fileList1.length) {
        let a = 0
        for (let i = this.fileList1.length - 1; i >= 0; i--) {
          const file1 = this.fileList1[i]
          console.log(file1, i, 1111111111111111111)
          uploadFunBySys(file1.raw, `contract/${this.orderId}`, url => {
            const data = {
              contractName: file1.name,
              contractPath: url,
              contractStatus: '1',
              contractType: this.contractType,
              orderId: this.orderId,
              contractKind: 'contract'
            }
            api.addContract(data).then(res => {
              a++
              console.log(res, a)
              if (a == that.fileList1.length) {
                status1 = true
                this.$message({
                  message: '合同上传成功',
                  type: 'success'
                })
              }
            })
          })
        }
      }
      if (this.fileList2.length) {
        let b = 0
        for (let i = this.fileList2.length - 1; i >= 0; i--) {
          const file2 = this.fileList2[i]
          console.log(file2)
          uploadFunBySys(file2.raw, `agreement/${this.orderId}`, url => {
            const data = {
              contractName: file2.name,
              contractPath: url,
              contractStatus: '1',
              contractType: this.contractType,
              orderId: this.orderId,
              contractKind: 'agreement'
            }
            api.addContract(data).then(res => {
              b++
              if (b == that.fileList2.length) {
                status2 = true
                this.$message({
                  message: '补充协议上传成功',
                  type: 'success'
                })
              }
            })
          })
        }
      }
      if (this.fileList3.length) {
        let c = 0
        for (let i = this.fileList3.length - 1; i >= 0; i--) {
          const file3 = this.fileList3[i]
          console.log(file3)
          uploadFunBySys(file3.raw, `other/${this.orderId}`, url => {
            const data = {
              contractName: file3.name,
              contractPath: url,
              contractStatus: '1',
              contractType: this.contractType,
              orderId: this.orderId,
              contractKind: 'other'
            }
            api.addContract(data).then(res => {
              c++
              console.log(res, c)
              if (c == that.fileList3.length) {
                status3 = true
                this.$message({
                  message: '其他文件上传成功',
                  type: 'success'
                })
              }
            })
          })
        }
      }
      let timeOut = null
      timeOut = setInterval(() => {
        if (status1 && status2 && status3) {
          clearInterval(timeOut)
          this.loading = false
          this.clear()
          this.getContractList()
          this.$emit('submit')
        }
      }, 1000)
    },
    contractSubmit () {
      console.log(this.fileList)
      if (!this.fileList.length) {
        this.$message({
          message: '请选取文件',
          type: 'error'
        })
        return
      }
      const file = this.fileList[0]
      this.$loading()
      uploadFunBySys(file.raw, `contract/${this.orderId}`, url => {
        const data = {
          contractName: file.name,
          contractPath: url,
          contractStatus: '1',
          contractType: this.contractType,
          orderId: this.orderId
        }
        api.addContract(data).then(res => {
          console.log(res)
          this.$message({
            message: '合同上传成功',
            type: 'success'
          })
          this.$loading().close()
          this.$emit('submit')
          this.clear()
        })
      })
    },
    applyOrder (orderId) {
      this.orderVisible = true
      console.log(orderId)
    },
    orderSubmit () {
      this.orderVisible = false
      this.getContractList()
    },
    orderClose () {
      this.orderVisible = false
    },
    remove1 () {
      this.fileList1 = []
    },
    remove2 () {
      this.fileList2 = []
    },
    remove3 () {
      this.fileList3 = []
    }
  }
}
</script>

<style lang="scss" scoped>
.yxHoverDiv{
  display: none;
}
.yxHover:hover .yxHoverDiv{
    display: block;
}
.yx_form .el-upload-dragger{
  width: 148px;
  height: 148px;
}
.yx_block_height{
  height: 170px;
}
.yxHover{
  min-width: 148px;
  min-height: 148px;
}
</style>
<style>
  .yx_form .el-upload-dragger{
    width: 148px;
    height: 148px;
  }
  .yx_form .el-upload-dragger .el-icon-plus{
    font-size: 28px;
    color: #8c939d;
    line-height:146px;
  }
</style>
