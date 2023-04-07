<!--
 * @Author: 库建华
 * @Date: 2019-07-02 09:27:25
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-11-15 15:03:00
 * @Version:
 * @Description:
 -->
<template>
  <div class="mentor-pay">
    <el-dialog
      :title="'更新申请账户'"
      :visible.sync="payListVisible"
      width="1100px"
      :before-close="handleClose"
    > 
			<div class="mb20">
				<el-button  type="primary" size="small" @click="selectAll()">一键全选</el-button>
				<el-button  type="danger" size="small" @click="selectNone()">一键取消</el-button>
			</div>
			<el-card class="box-card box-cardTe mb20"   size="mini"  v-for="(item,i) in listNew" :key="item.applyId">
					<div style="display:flex;justify-content:space-between">
						<el-checkbox style="margin:5px 20px 0 0"	el-checkbox v-model="item.checked" @change="change(item.checked,i)"></el-checkbox>
						<div style="position:relative">
							<el-tag style="position:absolute;right:0;top:0" >{{item.applyTypeName}}</el-tag>
							<el-row>
								<span >
									<el-col :span="2" style="margin:5px 0">申请ID：</el-col>
									<el-col :span="10" style="margin:5px 0">{{item.applyId}}</el-col>
									<el-col :span="2" style="margin:5px 0">申请标题：</el-col>
									<el-col :span="10" style="margin:5px 0">{{item.applyTitle}}</el-col>
								</span>
								<span >
									<el-col :span="2" style="margin:5px 0">申请状态：</el-col>
									<el-col :span="10" style="margin:5px 0" >{{item.applyStatusName}}</el-col>
									<el-col :span="2" style="margin:5px 0">申请时间：</el-col>
									<el-col :span="10" style="margin:5px 0">{{item.createTime}}</el-col>
								</span>
								<span  v-for="(item,i) in JSON.parse(item.content).text" :key="i">
									<el-col :span="2" style="margin:5px 0">{{item.label}}：</el-col>
									<el-col :span="10" style="margin:5px 0">{{item.value}}</el-col>
								</span>
								<!-- <span >
									<el-col :span="2" style="margin:5px 0">申请账户：</el-col>
									<el-col :span="10" style="margin:5px 0">
										<el-select v-model="payType[i]" @change="changeA(item,payType[i])" placeholder="请选择">
											<el-option
												v-for="item in options"
												:key="item.accountId"
												:label="item.paymentTypeName"
												:value="item.accountId">
											</el-option>
										</el-select>
									</el-col>
								</span> -->
							</el-row>
						</div>
					</div>
					
			</el-card>
      <span slot="footer" class="dialog-footer">
				<el-button  type="primary"  @click="selectAll()">一键全选</el-button>
				<el-button  type="danger"  @click="selectNone()">一键取消</el-button>
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submit">更新</el-button>
      </span>
    </el-dialog>
	<el-dialog
		:show-close="false"
		:visible.sync="searchVisible"
		width="310px"
		:before-close="searchClose"
		>
		<el-form ref="form" size="mini" :model="form" label-width="80px">
			<el-form-item label="支付方式">
				<el-select v-model="form.payType"  placeholder="请选择">
					<el-option
						v-for="item in options"
						:key="item.accountId"
						:label="item.paymentTypeName"
						:value="item.accountId">
					</el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
	<el-button size="mini" @click="searchClose">取 消</el-button>
	<el-button size="mini" type="primary" @click="submit2">提交</el-button>
	</span>
	</el-dialog>
  </div>
</template>

<script>
import api from "@/api/vip.js";
export default {
  components: {  },
  name: "mentorPay",
  props: {
		list:{},
		checkedCities:[],
		mentorId:{},
    payListVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
				listNew:[],
				options:[],
				// payType:[],
				allList:[],
				searchVisible:false,
				rules:{
					payType: [{  required: true, message: '必填', trigger: 'blur' }],
				},
				form:{payType:''}
    };
  },
  watch: {
    payListVisible: function(newData) {
        if(newData){
					this.listNew = JSON.parse(JSON.stringify(this.list))
					console.log(this.listNew,1111111111)
					this.listNew.forEach(item => {
						item.checked = false;
						// this.payType.push(JSON.parse(item.content).info.payType)
					})
					api.getCooperatorPaymentListByCooperatorIdNew(this.mentorId,true).then(res => {
						// this.options = res.data;
						console.log(res.data)
						this.options = [];
						for(let i=0;i<res.data.length;i++){
							let account2 = ''
							if(res.data[i].paymentType){
								account2 += "付款类型：" + res.data[i].paymentType + "  ;  ";
							}
							if(res.data[i].payAcc){
								account2 += " 账户：" + res.data[i].payAcc + "  ;  ";
							}
							if(res.data[i].bankName){
								account2 += " 银行：" + res.data[i].bankName + "  ;  ";
							}
							if(res.data[i].realName){
								account2 += " 收款人姓名：" + res.data[i].realName + "  ;  ";
							}
							if(res.data[i].idCard){
									account2 += " 收款人身份证号：" + res.data[i].idCard + "  ;  ";
							}
							if(res.data[i].bankAddress){
									account2 += " Bank Address：" + res.data[i].bankAddress + "  ;  ";
							}
							if(res.data[i].zip){
									account2 += " ZIP：" + res.data[i].zip + "  ;  ";
							}
							if(res.data[i].routingNumber){
								account2 += " Routing Number：" + res.data[i].routingNumber + "  ;  ";
							}
							if(res.data[i].swiftCode){
								account2 += " Swift Code：" + res.data[i].swiftCode + "  ;  ";
							}
							this.allList = res.data;
							this.options.push({
								paymentTypeName:account2,
								accountId:res.data[i].accountId
							})
						}
          console.log(this.options)
        })
      }
    }
  },
  mounted() {
  },
  methods: {
    //关闭
    handleClose() {
			this.$emit("close");
			// this.payType = [];
    },
    submit() {
			if(this.listNew.some(this.checkAdult)){
				this.searchVisible = true;
			}else{
				this.$message.error('请选择要修改的申请！！')
			}
		},
		submit2(){
			let data2 = [];
			this.listNew.forEach(item => {
				if(item.checked){
					data2.push(item.applyId);
				}
			})
			this.$refs.form.validate(valid => {
				if(valid){
					let payWay = this.allList.filter(
						v => v.accountId == this.form.payType
					)[0];
					let account = "";
					for (let item in payWay) {
					switch (item) {
						case "paymentType": {
						account += "付款类型：" + payWay[item] + "  ;  ";
						break;
						}
						case "payAcc": {
						account += "账户：" + payWay[item] + "  ;  ";
						break;
						}
						case "bankName": {
						account += "银行：" + payWay[item] + "  ;  ";
						break;
						}
						case "realName": {
						account += "收款人姓名：" + payWay[item] + "  ;  ";
						break;
						}
						case "idCard": {
						account += "收款人身份证号：" + payWay[item] + "  ;  ";
						break;
						}
						case "bankAddress": {
						account += "Bank Address：" + payWay[item] + "  ;  ";
						break;
						}
						case "zip": {
						account += "ZIP：" + payWay[item] + "  ;  ";
						break;
						}
						case "routingNumber": {
						account += "Routing Number：" + payWay[item] + "  ;  ";
						break;
						}
						case "swiftCode": {
						account += "Swift Code：" + payWay[item] + "  ;  ";
						break;
						}
					}
					}
					let data = {
							applyIds:data2.join(','),
							newPayType:this.form.payType,
							newAcc:account,
					}
					console.log(data)
					this.$loading()
					api.uptPayType(data).then(res => {
							this.$loading().close()
							this.searchClose()
							this.$emit('submit')
					})
				}else{
					return false
				}
			})
		},
		searchClose(){
			this.searchVisible = false;
			this.options = [];
			this.allList = [];
			this.form = {payType:''}
		},
		checkAdult(age) {
			return age.checked == true;
		},
		handleCheckedCitiesChange(val){
			this.checkedCities = val ? cityOptions : [];
		},
		change(val,i){
			console.log(val)
			this.listNew[i].checked = val;
			this.$forceUpdate()
		},
		changeA(item,val){
			console.log(item,val)
			this.$forceUpdate()
		},
		selectAll(){
			this.listNew.forEach(item => {
				item.checked = true
			})
			this.$forceUpdate()
		},
		selectNone(){
			this.listNew.forEach(item => {
				item.checked = false
			})
			this.$forceUpdate()
		}
  }
};
</script>

<style lang="scss" scoped>

</style>