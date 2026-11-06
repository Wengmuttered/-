package com.privacyguard.modules.auth.dto;

import lombok.Data;

/**
 * 【微信登陆握手协议包】 WxLoginRequest
 */
@Data
public class WxLoginRequest {
    // 从小程序端拦截带来的临时凭证 code
    private String code;
    // 基础防线数据
    private String encryptedData;
    private String iv;
}
