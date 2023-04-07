/*
 * @Author: 库建华
 * @Date: 2020-01-10 13:38:12
 * @LastEditors: 库建华
 * @LastEditTime: 2020-05-11 10:01:09
 * @Version: 1
 * @Description:aes加密ECB模式，对称加密
 */
import jsEncrypt from 'encryptlong'
import CryptoJS from "crypto-js";
// //创建一个rsa实例
const api_public = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCzR+YTSOK5KRfZc2RIe8ELIV0Q +SuM21M0EYoPVsDaE5SBV3nSJMdq+F0yvHw+8qPHa7w9g5sfR5qmLMXyCxA9N8pm mOP1Z81qxtUeNdlJTapu7M4+eqqqgDqyKj+F/IA4hBNDFjBShYqEHRk3FZFygtG7 HZPKabvlG6iKhyP5nQIDAQAB';
const api_private = 'MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAMpaUvwwzRBJ5IH5xLpDjpgeBd35GXytTPvkpO/VxIn5O+yJzpjtvSSlO4UcrZVxTBV9FQIbi8Q4fmMW7G2xrukfXyQx1gwUkCJ/YqHyBjlhrZO6D7pvo1oqz8OmZoD5CfkcVJonlI+G37CN0b4u2kIDaSKEHo1iVffFpEeSuvbBAgMBAAECgYA2sNz2/nWeLmqNWqV6NmIm6Q5q5TWnReultTGDBQLey7cPgluNZ8wUSHhizNJ5rqqCsFDqRemruh0myP5T049TRbaWt9l3AVJnjAQNqlOvHf7RMEYywMcYM7QxZtJFCJvQsjdmEXTDVmHKmwKncvPo12dT/Ohmq6szY1XIYKuslQJBAOX4Nuv5QbcIfF1V3lExh/G/gpeMJfD6EIRXswittkFH8+SNO1ZXzmsdnpPoTvboXrV7hj/NkzfkEf272vjNDEsCQQDhQd0uRegkExrGPOVpvyb4jUoMTyGGMX1ofYMUutTwBjfUpYhXiK1Ze8l/vWBHuNTvFlx73eHer5hdXEQ2yImjAkBIR0lLxV2oH1ynITPspPqrOpva8cuC/7VtQvscQSzFO84mCVWa/6H6/KY4qo0XAVWzCI3bQ8t/h4k4DHD4PcodAkB60WOceEdDbBs8HTXku3GvMbI/FeIsfc1n7I9M/TVfDbThP8QgHgiOcr0B5iqZ0IBhP+r7KpadyVYlCUq0KBFLAkEAgsxDUFK22Ji/odAJznQGl/V2dH/Qrc8ecBa+dhrXfkTP1JN8wTgEY55JWO4zBwcpNC18BaOYyIyMa/S9NH8lkQ==';
const web_private = 'MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAIsr8CthTyx0o4GQkRAtdGtngVLU3cehJfUiPEKnIVMJ/U9UwVAlPVORFT9OuWiyOsrk/AgBOKT5g4zUBxv+YbU7pmdAHIBZI537yrnLcIpsnFHl2FjTlwr7JEUHAOylnXHCHBjd4jhM50Z0DUfy8occiVPZpgAceJc6QlICRH43AgMBAAECgYAaLmzjLE5BtbugvzqbCYISRomMtKD4Ujea0xL1Ew3w2js+NlqbojXUR8Hwg/XbXVQ0ITnMo7YtSwdVcfnYaVWmBIrOgk+GOVzR59LjNHJSK0OozZaM2n0itBHxFq20DEPxYnZz12rQ7Mv0+pMi/v5GgBGQk2ZTqk9pqz1Kb+pieQJBAL1wenA7JlyKHhKmb2rSZ4lM1AlBG1gYUmECNQqOJAhr7maN6QtO6rc0FqKy3erVm1kJZ0oMCyO+l68Zrjhph+MCQQC8EgXfLsUByio+4X3yySWImI8XOJv1QXFApblYep4MYpX5fXx3Izt8jqA+fJR4gM56rcdKSwK5lNoNCepsa7idAkEAghWZzjWf6w3hBreJbNYcyNicBdrSdxUEhJ7qY1wl/C55X6z1KZHAdZtsK78dymNyMJrXda59e8cmC9RboVs+NwJAAmkYuiuXStaUhAnP23TIjl+mNd374cDc+r8lCQVJUU9SLMh29+/zqz0IwMRIAuNjwh7IFyOu/UHzKYefAZS/4QJBAIkhKSsbWM3wGvv7gb1lcmFpsJB66Z4uScdAbq6tcDiwYy7khcx8MkwjN/KT9ixxx2f9zjLQuoEEGmm9/CVBqxo=';

const jsE = new jsEncrypt();
jsE.setPublicKey(`-----BEGIN PUBLIC KEY----- ${api_public} -----END PUBLIC KEY-----`);
jsE.setPrivateKey(`-----BEGIN PUBLIC KEY----- ${api_private} -----END PUBLIC KEY-----`);

const jsEe = new jsEncrypt();
jsEe.setPrivateKey(`-----BEGIN PRIVATE KEY----- ${web_private} -----END PRIVATE KEY-----`)



export default {
  // 加密
  encrypt(word) {
    const auto_key = Math.random().toString(36).substr(2).substr(0, 16).padEnd(16, 'wst');

    let key = CryptoJS.enc.Utf8.parse(auto_key);

    let srcs = CryptoJS.enc.Utf8.parse(JSON.stringify(word));
    let encrypted = CryptoJS.AES.encrypt(srcs, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });

    let data = {
      data: encrypted.toString(), //aes 用key可以加密data
      key: jsE.encryptLong(auto_key),//rsa加密key值；
    }
    return data;
  },

  // 解密
  decrypt(word, keyStr) {

    const decrypt_key = jsEe.decryptLong(keyStr);//rsa解密key值，

    var key = CryptoJS.enc.Utf8.parse(decrypt_key);
    var decrypt = CryptoJS.AES.decrypt(word, key, { //aes通过key解密
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });

    return JSON.parse(CryptoJS.enc.Utf8.stringify(decrypt).toString());
  }
};
