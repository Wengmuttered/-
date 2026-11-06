package com.privacyguard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * 个人隐私数据安全管家 - 后端服务启动类
 *
 * @author PrivacyGuard Team
 */
@SpringBootApplication
@EnableJpaAuditing
public class PrivacyGuardApplication {

    public static void main(String[] args) {
        SpringApplication.run(PrivacyGuardApplication.class, args);
    }
}
