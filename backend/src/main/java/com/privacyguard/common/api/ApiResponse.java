package com.privacyguard.common.api;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 【特工司令部全局传令响应规范】
 * 全球统一的数据出舱包装体
 * @param <T> 具体承载数据(Payload)
 */
@Data
@NoArgsConstructor
public class ApiResponse<T> {
    
    private int code;
    private String message;
    private T data;
    
    private ApiResponse(int code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }
    
    // [ COMMAND: SUCCESS ]
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(200, "OPERATION_SUCCESS", data);
    }
    
    public static <T> ApiResponse<T> success() {
        return success(null);
    }
    
    // [ COMMAND: FAILED ]
    public static <T> ApiResponse<T> error(int code, String message) {
        return new ApiResponse<>(code, message, null);
    }
    
    // [ COMMAND: UNAUTHORIZED ]
    public static <T> ApiResponse<T> unauthorized() {
        return error(401, "UNAUTHORIZED_OR_TOKEN_EXPIRED");
    }
}
