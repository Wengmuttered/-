package com.privacyguard.modules.user.repository;

import com.privacyguard.modules.user.entity.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 用户安全档案库 (User Account Repository)
 */
@Repository
public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {
    
    // 通过微信侦测的 OpenID 寻回物理建档信息
    Optional<UserAccount> findByOpenid(String openid);
}
