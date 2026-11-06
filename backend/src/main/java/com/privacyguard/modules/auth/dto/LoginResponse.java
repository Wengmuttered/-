package com.privacyguard.modules.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * 【通行特权颁发响应报文】
 */
@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private Long userId;
    private boolean isNewUser;
}
